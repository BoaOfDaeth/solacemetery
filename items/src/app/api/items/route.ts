import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getRedisClient } from '@/lib/redis';
import Item from '@/models/Item';
import { createOrUpdateParsedItem } from '@/services/itemService';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Validate required field
    if (!body.raw || typeof body.raw !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Raw field is required and must be a string' },
        { status: 400 }
      );
    }

    // Check if item already exists in Redis cache
    try {
      const redis = await getRedisClient();
      const by = body.by || 'unknown';

      // Hash the raw data using SHA-1 for fastest hashing
      const rawHash = crypto
        .createHash('sha1')
        .update(body.raw)
        .digest('hex')
        .substring(0, 16); // Get first 16 chars

      // Create key in format: <by>:<hashed_raw>
      const redisKey = `${by}:${rawHash}`;

      // Check if key already exists
      const existingItem = await redis.get(redisKey);
      if (existingItem) {
        const parsedItem = JSON.parse(existingItem);
        return NextResponse.json(
          {
            success: false,
            error: 'Item already exists',
            data: {
              existingItemId: parsedItem.itemId,
              by: parsedItem.by,
              room: parsedItem.room,
              createdAt: parsedItem.createdAt,
              ttl: parsedItem.ttl,
            },
          },
          { status: 409 } // Conflict status code
        );
      }

      // Create the item in MongoDB
      const item = new Item({
        raw: body.raw,
        room: body.room || undefined,
        by: body.by || undefined,
      });
      const savedItem = await item.save();

      // Automatically parse the item and create/update parsed item
      const parseResult = await createOrUpdateParsedItem(
        String(savedItem._id),
        body.raw,
        body.by || undefined, // Pass username if available
        true // Mark as API post (12 hour delay)
      );
      if (parseResult.success) {
        console.log(`Parsed item created/updated with HRU: ${parseResult.hru}`);
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
          raw: body.raw,
          by: by,
          room: body.room,
          createdAt: savedItem.createdAt,
          ttl: 3600,
        })
      );

      console.log(`Cached item in Redis with key: ${redisKey}`);

      return NextResponse.json(
        {
          success: true,
          data: savedItem,
        },
        { status: 201 }
      );
    } catch (redisError) {
      console.error('Redis operation failed:', redisError);
      // If Redis fails, still create the item in MongoDB
      const item = new Item({
        raw: body.raw,
        room: body.room || undefined,
        by: body.by || undefined,
      });
      const savedItem = await item.save();

      return NextResponse.json(
        {
          success: true,
          data: savedItem,
          warning: 'Item created but Redis caching failed',
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
