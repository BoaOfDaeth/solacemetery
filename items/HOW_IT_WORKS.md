# How It Works

This document describes how item posting, processing, and scoring works in Solabase.

## Item Posting

There are two ways to post items:

### 1. Authenticated Form Posting (`/post`)

- **Route**: User submits through the web form at `/post`
- **Authentication**: Requires Discord OAuth login
- **Action**: `postItem` server action
- **Flow**:
  1. User must be authenticated (Discord login required)
  2. Raw item text is validated
  3. Redis cache is checked for duplicates (1 hour TTL per user)
  4. New `Item` document is created in MongoDB with:
     - `raw`: The item's raw text
     - `by`: Username from session (`globalName || username`)
  5. Item is automatically parsed via `createOrUpdateParsedItem`
  6. Posting is logged in `PostingLog` collection
  7. **Scoring**: User's score is incremented if a new `ParsedItem` is created

### 2. API Posting (`POST /api/items`)

- **Route**: Direct API endpoint
- **Authentication**: Password secured at infrastructure level (nginx/proxy)
- **Flow**:
  1. Raw item text is validated
  2. Redis cache is checked for duplicates
  3. New `Item` document is created with:
     - `raw`: The item's raw text
     - `by`: Optional username from request body
     - `room`: Optional room identifier
  4. Item is automatically parsed via `createOrUpdateParsedItem`
  5. **Scoring**: **NO scores are awarded** for API posts

## Item Processing

### Parsing Flow (`createOrUpdateParsedItem`)

When an item is posted, it goes through the following processing:

1. **Parse Raw Text**:
   - Extract item name from first line (between first and second-to-last comma)
   - Remove "labelled <spell>" suffixes from names
   - Extract level from third line (e.g., "is of 25th level")
   - Extract type from first line (e.g., "is armor", "is weapon")
   - Extract slot from fourth line (e.g., "wear it on your head")
   - Generate HRU (Human Readable URL) by slugifying the item name

2. **Filtering**:
   - **Skip level 1 items**: Items with level 1 are not parsed
   - **Skip corpses**: Items with type containing "corpse" are not parsed
   - **Skip keys**: Items with type containing "key" are not parsed

3. **Create or Update ParsedItem**:
   - Check if a `ParsedItem` with the same HRU already exists
   - **If exists** (update):
     - Update: `name`, `level`, `type`, `slot`, `raw`, `updatedAt`
     - Add room to `roomHistory` if provided (using `$addToSet`)
     - **Preserve** `createdBy` field (original creator keeps credit)
     - **No score increment** (not a new item)
   - **If new** (create):
     - Create new `ParsedItem` with all parsed data
     - Set `createdBy` to username (if provided from authenticated form)
     - Initialize `roomHistory` array
     - **Increment user's score** (if `createdByUsername` is provided and matches a User)

4. **Link Item to ParsedItem**:
   - Set `Item.parsedId` to the `ParsedItem.hru`
   - This links the raw submission to the parsed item

## Items vs ParsedItems Relationship

### Items (Raw Historical Data)

- **Purpose**: Store raw, unprocessed item submissions as historical records
- **Content**: Original raw text exactly as submitted
- **Persistence**: Never deleted or modified (immutable historical record)
- **Reparsing**: Can be reparsed at any time if parsing algorithm changes
- **Linkage**: Each Item can link to a ParsedItem via `parsedId` field
- **Multiple Items per ParsedItem**: Multiple raw submissions can link to the same ParsedItem (same item posted multiple times)

### ParsedItems (Displayed Entities)

- **Purpose**: Processed, structured data that is actually displayed to users
- **Content**: Extracted and structured data (name, level, type, slot, etc.)
- **Persistence**: Can be deleted and recreated during reparse operations
- **Reparsing**: Rebuilt from Items during reparse process
- **Uniqueness**: One ParsedItem per unique item name (by HRU)
- **Display**: This is what users see in search results, item pages, and comparisons

### Key Relationship Points

- **ParsedItems are derived from Items**: ParsedItems are created/updated by processing Items
- **Items are the source of truth**: If parsing algorithm changes, Items can be reparsed to regenerate ParsedItems
- **One-to-many relationship**: One ParsedItem can have many Items linking to it (via `parsedId`)
- **Historical preservation**: Items preserve all raw submissions, even if ParsedItem is updated
- **Reparse capability**: The `/api/items/reparse` endpoint processes all Items from scratch to rebuild ParsedItems

## Scoring System

### How Scores Work

- **Only authenticated form posts** can earn scores
- **Only first poster** gets credit (when a new `ParsedItem` is created)
- **Score is stored** in `User.score` field (not calculated dynamically)
- **Score increments atomically** using MongoDB `$inc` operator

### Score Increment Conditions

A user's score is incremented when **ALL** of the following are true:

1. Item is posted through authenticated form (`postItem` action)
2. Item successfully parses (not level 1, corpse, or key)
3. A **new** `ParsedItem` is created (not an update to existing one)
4. Username matches a User in the database (by `username` or `globalName`)

## Workflow Examples

### Example 1: First User Posts New Item

1. User A posts "a reinforced iron halberd" through form
2. Item is parsed → HRU: `reinforced-iron-halberd`
3. No existing ParsedItem found → **Creates new ParsedItem**
4. Sets `createdBy = "UserA"`
5. Increments `User.score` for UserA (+1)
6. Links `Item.parsedId = "reinforced-iron-halberd"`

### Example 2: Second User Posts Same Item (Updated Stats)

1. User B posts same item with different stats through form
2. Item is parsed → HRU: `reinforced-iron-halberd` (same)
3. Existing ParsedItem found → **Updates existing ParsedItem**
4. Preserves `createdBy = "UserA"` (original creator)
5. **No score increment** (not a new item)
6. Links `Item.parsedId = "reinforced-iron-halberd"`

### Example 3: API Post

1. External system posts item via API
2. Item is parsed and ParsedItem is created/updated
3. **No `createdBy` field set** (API posts don't track creator)
4. **No score increment** (API posts don't count)

## Key Points

- **One ParsedItem per unique item name** (by HRU)
- **Multiple Items can link to same ParsedItem** (via `parsedId`)
- **Only first poster gets score credit** (when ParsedItem is created)
- **Scores are persistent** (stored in User collection, not calculated)
- **API posts don't affect scoring** (only authenticated form posts)

