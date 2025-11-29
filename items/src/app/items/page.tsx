import { Metadata } from 'next';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import ParsedItem from '@/models/ParsedItem';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import FilterChips from '@/components/FilterChips';
import ExpandableItemCard from '@/components/ExpandableItemCard';
import {
  getBorderColor,
  getShadowColor,
  getBackgroundLevelColor,
  getFilterQuery,
  FilterKey,
  addVisibilityFilter,
} from '@/lib/helpers';
import { isAdminFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface ParsedItemLean {
  _id: string;
  name: string;
  hru: string;
  level: number;
  type?: string;
  slot?: string;
  raw: string;
  room?: string;
  by?: string;
  foundAt?: Date;
  hidden?: boolean;
  visibleAfter?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ItemsPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    filter?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: ItemsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || '';

  return {
    title: query ? `Items: ${query} - Solabase` : 'Items - Solabase',
    description: `Browse all items${query ? ` matching "${query}"` : ''} in Solabase items database`,
  };
}

async function getItems(
  searchParams: Promise<{ q?: string; page?: string; filter?: string }>,
  userIsAdmin: boolean
): Promise<{
  items: Array<{
    _id: string;
    name: string;
    hru: string;
    level: number;
    type?: string;
    slot?: string;
    raw: string;
    room?: string;
    by?: string;
    foundAt?: string;
    createdAt: string;
    updatedAt: string;
    hidden?: boolean;
    visibleAfter?: string;
  }>;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  query: string;
  filter?: string;
}> {
  try {
    await connectDB();

    const params = await searchParams;
    const query = params.q || '';
    const filter = params.filter as FilterKey;
    const page = parseInt(params.page || '1');
    const limit = 10;

    let searchFilter: Record<string, unknown> = {};
    let textSearch: { $text?: { $search: string } } = {};

    // If there's a search query, use text search for better performance
    if (query && query.length >= 2) {
      textSearch.$text = { $search: query };
    }

    // If there's a filter, add it to the search filter
    if (filter) {
      const filterQuery = getFilterQuery(filter);
      searchFilter = { ...searchFilter, ...filterQuery };
    }

    if (!userIsAdmin) {
      searchFilter.hidden = { $ne: true };
    }

    // Apply visibility filter (visibleAfter for API posts)
    searchFilter = addVisibilityFilter(searchFilter, userIsAdmin);

    // Combine text search with other filters
    const combinedFilter = { ...textSearch, ...searchFilter };

    // Get total count
    const totalItems = await ParsedItem.countDocuments(combinedFilter);

    // Calculate pagination
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const skip = (page - 1) * limit;

    // Get items with pagination
    const items = await ParsedItem.find(combinedFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<ParsedItemLean[]>();

    // Format items for the frontend
    const formattedItems = items.map(item => ({
      _id: String(item._id),
      name: item.name,
      hru: item.hru,
      level: item.level,
      type: item.type,
      slot: item.slot,
      raw: String(item.raw),
      room: item.room ? String(item.room) : undefined,
      by: item.by ? String(item.by) : undefined,
      foundAt: item.foundAt ? String(item.foundAt) : undefined,
      createdAt: String(item.createdAt),
      updatedAt: String(item.updatedAt),
      hidden: Boolean(item.hidden),
      visibleAfter: item.visibleAfter ? String(item.visibleAfter) : undefined,
    }));

    return {
      items: formattedItems,
      totalItems,
      currentPage: page,
      totalPages,
      hasNextPage,
      hasPrevPage,
      query,
      filter,
    };
  } catch (error) {
    console.error('Items error:', error);
    return {
      items: [],
      totalItems: 0,
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      query: '',
      filter: undefined,
    };
  }
}

export default async function ItemsPage({ searchParams }: ItemsPageProps) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;
  const userIsAdmin = await isAdminFromCookies(sessionToken);

  const {
    items,
    totalItems,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    query,
    filter,
  } = await getItems(searchParams, userIsAdmin);

  return (
    <div className="p-2 sm:p-4">
      <div className="max-w-3xl mx-auto w-full">
        {/* Search and Filter Card */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="mb-4">
            <SearchBar currentQuery={query} currentFilter={filter} />
          </div>
          <div>
            <FilterChips userIsAdmin={userIsAdmin} />
          </div>
        </div>

        {/* Items Counter */}
        <div className="mb-4">
          {query ? (
            <p className="text-gray-600">
              Found {totalItems} result{totalItems !== 1 ? 's' : ''} for &ldquo;
              <span className="font-semibold">{query}</span>&rdquo;
            </p>
          ) : (
            <p className="text-gray-600">
              Showing {totalItems} item{totalItems !== 1 ? 's' : ''} in the
              database
            </p>
          )}
        </div>

        {/* Items List */}
        {items.length > 0 ? (
          <>
            <div className="space-y-2 sm:space-y-3 mb-4">
              {items.map(item => {
                // Create raw item data for the expandable card
                const rawItem = {
                  _id: String(item._id),
                  raw: String(item.raw),
                  room: item.room ? String(item.room) : undefined,
                  by: item.by ? String(item.by) : undefined,
                  createdAt: String(item.foundAt || item.createdAt),
                  updatedAt: String(item.updatedAt),
                  parsedId: item.hru,
                };

                // Check if item is pending (visibleAfter is in the future)
                // visibleAfter is a Date object from the database
                // Admins should see pending items with dotted borders too
                const isPending = Boolean(
                  item.visibleAfter &&
                    new Date(item.visibleAfter).getTime() > Date.now()
                );

                return (
                  <ExpandableItemCard
                    key={item._id}
                    title={item.name}
                    subtitle={`Level ${item.level}${
                      item.type ? ` • ${item.type}` : ''
                    }${item.slot ? ` • ${item.slot}` : ''}`}
                    rawItem={rawItem}
                    userIsAdmin={userIsAdmin}
                    itemHidden={Boolean(item.hidden)}
                    isPending={isPending}
                    cardStyle={{
                      boxShadow: getShadowColor(item.level),
                      borderColor: getBorderColor(item.level),
                      backgroundColor: getBackgroundLevelColor(item.level),
                    }}
                  />
                );
              })}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              baseUrl={(() => {
                const params = new URLSearchParams();
                if (query) params.set('q', query);
                if (filter) params.set('filter', filter);
                const queryString = params.toString();
                return queryString ? `/items?${queryString}` : '/items';
              })()}
            />
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-gray-500 text-lg">
              {query ? `No items found for "${query}"` : 'No items found'}
            </div>
            <div className="text-gray-400 text-sm mt-2">
              {query
                ? 'Try a different search term'
                : 'Items will appear here when they are added to the database'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
