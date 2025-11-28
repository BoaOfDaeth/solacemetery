import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';
import ParsedItem from '@/models/ParsedItem';
import { createOrUpdateParsedItem } from '@/services/itemService';
import { reapplyVisibilityLog } from '@/services/visibilityService';

interface ReparseResults {
  total: number;
  success: number;
  failed: number;
  errors: string[];
  finalParsedItemsCount: number;
}

// Function to reparse all items
async function reparseAllItems(): Promise<ReparseResults> {
  try {
    await connectDB();

    console.log('=== STARTING REPARSE PROCESS ===');

    // Step 1: Clear parsedId from all items
    console.log('Step 1: Clearing parsedId from all items...');
    const clearResult = await Item.updateMany({}, { $unset: { parsedId: 1 } });
    console.log(`✓ Cleared parsedId from ${clearResult.modifiedCount} items`);

    // Step 2: Clear existing parsed items
    console.log('Step 2: Clearing existing parsed items...');
    const deleteResult = await ParsedItem.deleteMany({});
    console.log(`✓ Deleted ${deleteResult.deletedCount} existing parsed items`);

    // Step 3: Get all raw items ordered by creation date (oldest first)
    console.log('Step 3: Fetching raw items...');
    const rawItems = await Item.find({}).sort({ createdAt: 1 });
    console.log(`✓ Found ${rawItems.length} raw items to process`);

    const results: ReparseResults = {
      total: rawItems.length,
      success: 0,
      failed: 0,
      errors: [],
      finalParsedItemsCount: 0,
    };

    console.log('Step 4: Processing items one by one...');
    console.log('=====================================');

    // Step 4: Process items one by one from oldest to newest
    for (let i = 0; i < rawItems.length; i++) {
      const rawItem = rawItems[i];
      const itemNumber = i + 1;

      // Use the service to parse and create/update parsed item
      // Don't pass username for reparse - preserve existing createdBy or leave null
      const parseResult = await createOrUpdateParsedItem(
        String(rawItem._id),
        rawItem.raw
      );

      if (parseResult.success) {
        results.success++;

        // Progress update every 100 items (less verbose)
        if (itemNumber % 100 === 0) {
          console.log(
            `Progress: ${itemNumber}/${rawItems.length} items processed (${results.success} successful, ${results.failed} failed)`
          );
        }
      } else if (parseResult.skipped) {
        // Silently skip items (level 1, corpse, key) - don't count as failed
        // Don't log, just skip silently
        continue;
      } else {
        // Only log and count actual errors
        results.failed++;
        results.errors.push(
          `Failed to parse item ${rawItem._id}: ${parseResult.error}`
        );
        console.error(
          `✗ ERROR processing item ${itemNumber}: ${parseResult.error}`
        );
        console.error(`Raw item ID: ${rawItem._id}`);
      }
    }

    // Reapply visibility log after rebuilding parsed items
    await reapplyVisibilityLog();
    console.log('Step 5: Reapplied visibility actions log');

    // Get final count of ParsedItems in database
    results.finalParsedItemsCount = await ParsedItem.countDocuments();

    console.log('\n=====================================');
    console.log('=== REPARSE PROCESS COMPLETED ===');
    console.log(`Total raw items processed: ${results.total}`);
    console.log(`Successfully parsed: ${results.success}`);
    console.log(`Failed to parse: ${results.failed}`);
    console.log(`Final ParsedItems count: ${results.finalParsedItemsCount}`);

    if (results.errors.length > 0) {
      console.log('\nErrors encountered:');
      results.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    console.log('=====================================');

    return results;
  } catch (error) {
    console.error('FATAL ERROR in reparseAllItems:', error);
    throw error;
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const results = await reparseAllItems();

    return NextResponse.json({
      success: true,
      message: 'Reparsing completed',
      results,
    });
  } catch (error) {
    console.error('Error in reparse endpoint:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `Failed to reparse items: ${errorMessage}` },
      { status: 500 }
    );
  }
}
