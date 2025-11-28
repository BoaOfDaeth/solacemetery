'use server';

import { getServerUser } from '@/lib/auth-server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';
import PostingLog from '@/models/PostingLog';
import { createOrUpdateParsedItem } from '@/services/itemService';
import { getRedisClient } from '@/lib/redis';
import crypto from 'crypto';

export async function postItem(raw: string) {
  const user = await getServerUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to post items',
    };
  }

  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return {
      success: false,
      error: 'Item data is required',
    };
  }

  const username = user.username;
  const userId = user.userId;

  try {
    await connectDB();

    // Check if item already exists in Redis cache
    try {
      const redis = await getRedisClient();

      // Hash the raw data using SHA-1
      const rawHash = crypto
        .createHash('sha1')
        .update(raw.trim())
        .digest('hex')
        .substring(0, 16);

      // Create key in format: <by>:<hashed_raw>
      const redisKey = `${username}:${rawHash}`;

      // Check if key already exists
      const existingItem = await redis.get(redisKey);
      if (existingItem) {
        const parsedItem = JSON.parse(existingItem);
        // Log the duplicate attempt
        await PostingLog.create({
          userId,
          username,
          raw: raw.trim(),
          success: false,
          error: 'Item already exists',
        });
        return {
          success: false,
          error: 'This item has already been posted',
          existingItemId: parsedItem.itemId,
        };
      }

      // Create the item in MongoDB with username
      const item = new Item({
        raw: raw.trim(),
        by: username,
        // No room field for user submissions
      });
      const savedItem = await item.save();

      // Automatically parse the item and create/update parsed item
      let parsedItemHRU: string | undefined;
      const parseResult = await createOrUpdateParsedItem(
        String(savedItem._id),
        raw.trim(),
        username // Pass username to track first poster
      );
      if (parseResult.success) {
        parsedItemHRU = parseResult.hru;
      } else if (!parseResult.skipped) {
        // Only log actual errors, not skipped items
        console.error('Failed to parse item:', parseResult.error);
      }

      // Store the item data in Redis with 1 hour TTL
      await redis.setEx(
        redisKey,
        3600,
        JSON.stringify({
          itemId: savedItem._id,
          raw: raw.trim(),
          by: username,
          createdAt: savedItem.createdAt,
          ttl: 3600,
        })
      );

      // Log the posting
      await PostingLog.create({
        userId,
        username,
        raw: raw.trim(),
        itemId: String(savedItem._id),
        parsedItemHRU,
        success: true,
      });

      return {
        success: true,
        itemId: String(savedItem._id),
        parsedItemHRU,
      };
    } catch (redisError) {
      console.error('Redis operation failed:', redisError);
      // If Redis fails, still create the item in MongoDB
      const item = new Item({
        raw: raw.trim(),
        by: username,
      });
      const savedItem = await item.save();

      // Try to parse the item
      let parsedItemHRU: string | undefined;
      const parseResult = await createOrUpdateParsedItem(
        String(savedItem._id),
        raw.trim(),
        username // Pass username to track first poster
      );
      if (parseResult.success) {
        parsedItemHRU = parseResult.hru;
      } else if (!parseResult.skipped) {
        // Only log actual errors, not skipped items
        console.error('Failed to parse item:', parseResult.error);
      }

      // Log the posting
      await PostingLog.create({
        userId,
        username,
        raw: raw.trim(),
        itemId: String(savedItem._id),
        parsedItemHRU,
        success: true,
        error: 'Redis caching failed',
      });

      return {
        success: true,
        itemId: String(savedItem._id),
        parsedItemHRU,
        warning: 'Item created but Redis caching failed',
      };
    }
  } catch (error) {
    console.error('Error posting item:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to post item. Please try again.';

    // Log the error
    try {
      await connectDB();
      await PostingLog.create({
        userId,
        username,
        raw: raw.trim(),
        success: false,
        error: errorMessage,
      });
    } catch (logError) {
      console.error('Failed to log posting error:', logError);
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
