import connectDB from '@/lib/mongodb';
import ParsedItem from '@/models/ParsedItem';
import Item from '@/models/Item';
import User from '@/models/User';
import { DAMAGE_TYPE_BY_KEYWORD } from '@/lib/constants';

export interface ParsedItemData {
  name: string;
  hru: string;
  level: number;
  type?: string;
  slot?: string;
  raw: string;
  damageType?: string;
  averageDamage?: number;
  acAverage?: number;
  acBonus?: number;
  damrollBonus?: number;
  whenWorn?: {
    strength?: number;
    dexterity?: number;
    constitution?: number;
    mana?: number;
    health?: number;
    hitRoll?: number;
  };
  searchText?: string;
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

  // Parse damage type from "Its attacks take the form of a <keyword>."
  for (const line of lines) {
    const attackMatch = line.match(
      /its\s+attacks\s+take\s+the\s+form\s+of\s+a\s+([^.]+)\./i
    );
    if (attackMatch) {
      const keyword = attackMatch[1].trim().toLowerCase();
      const damageType = DAMAGE_TYPE_BY_KEYWORD[keyword];
      if (damageType) {
        parsed.damageType = damageType;
        break;
      }
    }
  }

  // Parse average damage from "It deals XdY damage (averaging at Z)."
  for (const line of lines) {
    const damageMatch = line.match(
      /it\s+deals\s+\d+d\d+\s+damage\s+\(averaging\s+at\s+(\d+)\)\./i
    );
    if (damageMatch) {
      parsed.averageDamage = parseInt(damageMatch[1]);
      break;
    }
  }

  // Parse armor class from "Armor class bonus: 4 vs pierce, 4 vs bash, 4 vs slash, and 2 vs magic."
  // Calculate average of the 4 values
  for (const line of lines) {
    const armorMatch = line.match(
      /armor\s+class\s+bonus:\s+(\d+)\s+vs\s+pierce,\s+(\d+)\s+vs\s+bash,\s+(\d+)\s+vs\s+slash,\s+and\s+(\d+)\s+vs\s+magic\./i
    );
    if (armorMatch) {
      const pierce = parseInt(armorMatch[1]);
      const bash = parseInt(armorMatch[2]);
      const slash = parseInt(armorMatch[3]);
      const magic = parseInt(armorMatch[4]);
      parsed.acAverage = Math.round((pierce + bash + slash + magic) / 4);
      break;
    }
  }

  // Parse "When worn, it" section - virtual field for searchText and bonus calculations
  // Need to check original raw text for indentation
  const whenWorn: ParsedItemData['whenWorn'] = {};
  let acBonus: number | undefined;
  let damrollBonus: number | undefined;
  const rawLines = raw.split('\n');
  let inWhenWornSection = false;

  for (let i = 0; i < rawLines.length; i++) {
    const originalLine = rawLines[i];
    const trimmedLine = originalLine.trim();

    // Skip empty lines
    if (trimmedLine.length === 0) {
      continue;
    }

    // Check if we're entering the "When worn, it" section
    if (trimmedLine.match(/when\s+worn,\s+it/i)) {
      inWhenWornSection = true;
      continue;
    }

    // If we're in the section, only process indented lines (lines that start with whitespace)
    if (inWhenWornSection) {
      // Check if line is indented (starts with whitespace)
      if (!/^\s/.test(originalLine)) {
        // Line is not indented, we've reached the end of the section
        break;
      }

      // Parse "modifies <stat> by <value>"
      const modifyMatch = trimmedLine.match(
        /modifies\s+(hit\s+roll|damage\s+roll|armor\s+class|\w+)\s+by\s+(-?\d+)/i
      );
      if (modifyMatch) {
        const stat = modifyMatch[1].toLowerCase();
        const value = parseInt(modifyMatch[2]);

        // Map stat names to whenWorn fields
        if (stat === 'strength') {
          whenWorn.strength = value;
        } else if (stat === 'dexterity') {
          whenWorn.dexterity = value;
        } else if (stat === 'constitution') {
          whenWorn.constitution = value;
        } else if (stat === 'mana') {
          whenWorn.mana = value;
        } else if (stat === 'health') {
          whenWorn.health = value;
        } else if (stat === 'hit roll') {
          whenWorn.hitRoll = value;
        } else if (stat === 'armor class') {
          acBonus = value;
        } else if (stat === 'damage roll') {
          damrollBonus = value;
        }
      }
    }
  }

  // Set acBonus and damrollBonus if found (calculated from whenWorn section)
  if (acBonus !== undefined) {
    parsed.acBonus = acBonus;
  }
  if (damrollBonus !== undefined) {
    parsed.damrollBonus = damrollBonus;
  }

  // Generate HRU from the parsed name (slugified)
  parsed.hru = slugify(parsed.name);

  // Build searchText: name + whenWorn stats (whenWorn is virtual, not saved to DB)
  parsed.searchText = buildSearchText(parsed.name, whenWorn);

  return parsed;
}

function buildSearchText(
  name: string,
  whenWorn?: ParsedItemData['whenWorn']
): string {
  const parts: string[] = [name.toLowerCase()];

  if (whenWorn) {
    if (whenWorn.strength !== undefined) {
      parts.push(
        `strength ${whenWorn.strength > 0 ? '+' : ''}${whenWorn.strength}`
      );
    }
    if (whenWorn.dexterity !== undefined) {
      parts.push(
        `dexterity ${whenWorn.dexterity > 0 ? '+' : ''}${whenWorn.dexterity}`
      );
    }
    if (whenWorn.constitution !== undefined) {
      parts.push(
        `constitution ${whenWorn.constitution > 0 ? '+' : ''}${whenWorn.constitution}`
      );
    }
    if (whenWorn.mana !== undefined) {
      parts.push(`mana ${whenWorn.mana > 0 ? '+' : ''}${whenWorn.mana}`);
    }
    if (whenWorn.health !== undefined) {
      parts.push(`health ${whenWorn.health > 0 ? '+' : ''}${whenWorn.health}`);
    }
    if (whenWorn.hitRoll !== undefined) {
      parts.push(
        `hit roll ${whenWorn.hitRoll > 0 ? '+' : ''}${whenWorn.hitRoll}`
      );
    }
  }

  return parts.join(' ');
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
    // Note: whenWorn is a virtual field - not saved to database
    const updateData: Record<string, unknown> = {
      name: parsedData.name,
      level: parsedData.level,
      type: parsedData.type,
      slot: parsedData.slot,
      raw: parsedData.raw,
      damageType: parsedData.damageType,
      averageDamage: parsedData.averageDamage,
      acAverage: parsedData.acAverage,
      acBonus: parsedData.acBonus,
      damrollBonus: parsedData.damrollBonus,
      searchText: parsedData.searchText,
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
    // Note: whenWorn is a virtual field - not saved to database
    const newParsedItemData: Record<string, unknown> = {
      name: parsedData.name,
      hru: parsedData.hru,
      level: parsedData.level,
      type: parsedData.type,
      slot: parsedData.slot,
      raw: parsedData.raw,
      damageType: parsedData.damageType,
      averageDamage: parsedData.averageDamage,
      acAverage: parsedData.acAverage,
      acBonus: parsedData.acBonus,
      damrollBonus: parsedData.damrollBonus,
      searchText: parsedData.searchText,
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
