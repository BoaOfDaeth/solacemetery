import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ParsedItem from '@/models/ParsedItem';
import Item from '@/models/Item';
import { getFilterQuery, FilterKey, addVisibilityFilter } from '@/lib/helpers';
import { isAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const filter = searchParams.get('filter') as FilterKey;
    const sort = searchParams.get('sort') || 'latest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;

    let searchFilter: Record<string, unknown> = {};
    const textSearch: { $text?: { $search: string } } = {};

    // If there's a search query, use text search for better performance
    if (query && query.length >= 2) {
      textSearch.$text = { $search: query };
    }

    // If there's a filter, add it to the search filter
    if (filter) {
      const filterQuery = getFilterQuery(filter);
      searchFilter = { ...searchFilter, ...filterQuery };
    }

    const userIsAdmin = await isAdmin(request);

    if (!userIsAdmin) {
      searchFilter.hidden = { $ne: true };
    }

    // Apply visibility filter (visibleAfter for API posts)
    searchFilter = addVisibilityFilter(searchFilter, userIsAdmin);

    // Determine sort order
    let sortOrder: Record<string, 1 | -1 | { $meta: 'textScore' }>;
    if (query && query.length >= 2) {
      // When searching, sort by text score (relevance) first, then by sort preference
      if (sort === 'level') {
        sortOrder = { score: { $meta: 'textScore' }, level: -1 };
      } else {
        sortOrder = { score: { $meta: 'textScore' }, createdAt: -1 };
      }
    } else {
      // No search query, use normal sorting
      if (sort === 'level') {
        sortOrder = { level: -1 };
      } else {
        // Default to 'latest' (createdAt desc)
        sortOrder = { createdAt: -1 };
      }
    }

    // Combine text search with other filters
    const combinedFilter = { ...textSearch, ...searchFilter };

    // Get total count with the same filter
    const totalItems = await ParsedItem.countDocuments(combinedFilter);

    // Calculate pagination info
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const skip = (page - 1) * limit;

    // Get items with pagination
    // Include text score in projection when using text search
    const projection =
      query && query.length >= 2 ? { score: { $meta: 'textScore' } } : {};
    const items = await ParsedItem.find(combinedFilter, projection)
      .sort(sortOrder)
      .skip(skip)
      .limit(limit)
      .lean<
        Array<{
          _id: unknown;
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
          roomHistory: string[];
          hidden?: boolean;
          visibleAfter?: Date;
          createdAt: Date;
          updatedAt: Date;
        }>
      >();

    // Get usernames (by field) from Items for each ParsedItem
    const itemHRUs = items.map(item => item.hru);
    const rawItems = await Item.find({
      parsedId: { $in: itemHRUs },
      by: { $exists: true, $ne: null },
    })
      .select('parsedId by')
      .lean<Array<{ parsedId: string; by: string }>>();

    // Create a map of hru -> array of usernames
    const usernameMap = new Map<string, string[]>();
    rawItems.forEach(rawItem => {
      if (rawItem.parsedId && rawItem.by) {
        const existing = usernameMap.get(rawItem.parsedId) || [];
        if (!existing.includes(rawItem.by)) {
          existing.push(rawItem.by);
        }
        usernameMap.set(rawItem.parsedId, existing);
      }
    });

    // Format items for the frontend
    const formattedItems = items.map(item => {
      const usernames = usernameMap.get(item.hru) || [];
      return {
        _id: String(item._id),
        name: item.name,
        hru: item.hru,
        level: item.level,
        type: item.type,
        slot: item.slot,
        raw: String(item.raw),
        damageType: item.damageType,
        averageDamage: item.averageDamage,
        acAverage: item.acAverage,
        acBonus: item.acBonus,
        damrollBonus: item.damrollBonus,
        whenWorn: item.whenWorn,
        ...(userIsAdmin && { roomHistory: item.roomHistory }),
        ...(userIsAdmin && usernames.length > 0 && { postedBy: usernames }),
        hidden: Boolean(item.hidden),
        visibleAfter: item.visibleAfter ? String(item.visibleAfter) : undefined,
        createdAt: String(item.createdAt),
        updatedAt: String(item.updatedAt),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        items: formattedItems,
        totalItems,
        currentPage: page,
        totalPages,
        hasNextPage,
        hasPrevPage,
        query,
        filter,
        sort,
      },
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}
