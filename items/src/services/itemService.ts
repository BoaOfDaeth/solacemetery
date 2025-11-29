import connectDB from '@/lib/mongodb';
import ParsedItem from '@/models/ParsedItem';
import Item from '@/models/Item';
import User from '@/models/User';

export interface ParsedItemData {
  name: string;
  hru: string;
  level: number;
  type?: string;
  slot?: string;
  raw: string;
}

export function parseItemRaw(raw: string): ParsedItemData {
  const lines = raw
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // Initialize with defaults
  const parsed: ParsedItemData = {
    name: '',
    hru: '',
    level: 1,
    raw: raw,
  };

  // Extract name and type from first line only: ".. this object, <name>, is armor,"
  if (lines.length > 0) {
    const firstLine = lines[0];

    // Extract name from between first and second-to-last comma
    const commaIndices = [];
    for (let i = 0; i < firstLine.length; i++) {
      if (firstLine[i] === ',') {
        commaIndices.push(i);
      }
    }

    if (commaIndices.length >= 2) {
      const firstCommaIndex = commaIndices[0];
      const secondToLastCommaIndex = commaIndices[commaIndices.length - 2];
      const lastCommaIndex = commaIndices[commaIndices.length - 1];

      // Extract name between first and second-to-last comma
      let nameText = firstLine
        .substring(firstCommaIndex + 1, secondToLastCommaIndex)
        .trim();

      // Remove "labelled <spell>" part from the name
      // Pattern: "labelled <spell name>" at the end
      const labelledMatch = nameText.match(/^(.*?)\s+labelled\s+\w+$/i);
      if (labelledMatch) {
        nameText = labelledMatch[1].trim();
      }

      parsed.name = nameText;

      // Extract type from between second-to-last and last comma
      const typeText = firstLine
        .substring(secondToLastCommaIndex + 1, lastCommaIndex)
        .trim();
      parsed.type = typeText.toLowerCase();
    }
  }

  // Parse specific lines for properties
  // Level is always on the 3rd line (index 2)
  if (lines.length >= 3) {
    const levelLine = lines[2];
    const levelMatch = levelLine.match(
      /is\s+of\s+(\d+)(?:st|nd|rd|th)?\s+level/i
    );
    if (levelMatch) {
      parsed.level = parseInt(levelMatch[1]);
    }
  }

  // Equipment slot is always on the 4th line (index 3)
  if (lines.length >= 4) {
    const slotLine = lines[3];

    // Check for "wear it" pattern first
    const wearMatch = slotLine.match(
      /wear\s+it\s+(?:about|on|around)\s+your\s+(\w+)/i
    );
    if (wearMatch) {
      parsed.slot = wearMatch[1].toLowerCase();
    } else {
      // Check for "You can use it as a" pattern
      const useMatch = slotLine.match(/you\s+can\s+use\s+it\s+as\s+a\s+(\w+)/i);
      if (useMatch) {
        parsed.slot = useMatch[1].toLowerCase();
      }
    }
  }

  // Generate HRU from the parsed name (slugified)
  parsed.hru = slugify(parsed.name);

  return parsed;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export type ParseItemResult =
  | { success: true; hru: string }
  | { success: false; skipped: true; reason: string }
  | { success: false; skipped: false; error: string };

export async function createOrUpdateParsedItem(
  rawItemId: string,
  raw: string,
  createdByUsername?: string,
  isApiPost: boolean = false
): Promise<ParseItemResult> {
  await connectDB();

  // Get the raw item data
  const rawItem = await Item.findById(rawItemId);
  if (!rawItem) {
    return {
      success: false,
      skipped: false,
      error: `Raw item with ID ${rawItemId} not found`,
    };
  }

  // Parse the raw item data
  const parsedData = parseItemRaw(raw);

  // Skip level 1 items
  if (parsedData.level === 1) {
    return { success: false, skipped: true, reason: 'Level 1 item' };
  }

  // Skip corpses - check type field
  if (parsedData.type && parsedData.type.includes('corpse')) {
    return { success: false, skipped: true, reason: 'Corpse' };
  }

  // Skip keys - check type field
  if (parsedData.type && parsedData.type.includes('key')) {
    return { success: false, skipped: true, reason: 'Key' };
  }

  // Check if a parsed item with this HRU already exists
  const existingParsedItem = await ParsedItem.findOne({ hru: parsedData.hru });

  if (existingParsedItem) {
    // Update existing parsed item (don't change createdBy - preserve original creator)
    const updateData: Record<string, unknown> = {
      name: parsedData.name,
      level: parsedData.level,
      type: parsedData.type,
      slot: parsedData.slot,
      raw: parsedData.raw,
      updatedAt: new Date(),
    };

    // Add room to roomHistory if it exists and is not already in the array
    if (rawItem.room) {
      updateData.$addToSet = {
        roomHistory: rawItem.room,
      };
    }

    await ParsedItem.findOneAndUpdate({ hru: parsedData.hru }, updateData);

    // Update the raw item with the parsed item's HRU
    await Item.findByIdAndUpdate(rawItemId, {
      parsedId: parsedData.hru,
    });

    return { success: true, hru: parsedData.hru };
  } else {
    // Create new parsed item with raw item data
    const newParsedItemData: Record<string, unknown> = {
      ...parsedData,
      roomHistory: [],
    };

    // Add room to roomHistory if it exists
    if (rawItem.room) {
      newParsedItemData.roomHistory = [rawItem.room];
    }

    // Set createdBy only when creating a new ParsedItem (first poster gets credit)
    if (createdByUsername) {
      newParsedItemData.createdBy = createdByUsername;
    }

    // Set hidden by default for consumables (potions, wands, staves, pills, scrolls)
    // These items are posted and scored, but only visible to admins until restored
    const consumableTypes = [
      'is a potion',
      'is a magical wand',
      'is a magical staff',
      'is a pill',
      'is a magical scroll',
    ];
    if (parsedData.type && consumableTypes.includes(parsedData.type)) {
      newParsedItemData.hidden = true;
    }

    // Set visibleAfter for API posts (12 hours delay)
    if (isApiPost) {
      const visibleAfter = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours from now
      newParsedItemData.visibleAfter = visibleAfter;
    }

    const newParsedItem = new ParsedItem(newParsedItemData);
    await newParsedItem.save();

    // Increment user's score if this is a user-submitted item
    // Match by either username or globalName (session uses globalName || username)
    if (createdByUsername) {
      await User.findOneAndUpdate(
        {
          $or: [
            { username: createdByUsername },
            { globalName: createdByUsername },
          ],
        },
        { $inc: { score: 1 } },
        { upsert: false } // Don't create user if doesn't exist
      );
    }

    // Update the raw item with the parsed item's HRU
    await Item.findByIdAndUpdate(rawItemId, {
      parsedId: parsedData.hru,
    });

    return { success: true, hru: parsedData.hru };
  }
}

export async function getParsedItemByHRU(hru: string) {
  await connectDB();
  return await ParsedItem.findOne({ hru }).lean();
}

export async function getAllParsedItems() {
  await connectDB();
  return await ParsedItem.find().lean();
}
