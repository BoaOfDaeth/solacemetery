'use client';

import ExpandableItemCard from './ExpandableItemCard';
import Pagination from './Pagination';
import { useItems } from '@/hooks/useItems';
import {
  getBorderColor,
  getShadowColor,
  getBackgroundLevelColor,
} from '@/lib/helpers';

interface ItemsDisplayProps {
  userIsAdmin: boolean;
}

export default function ItemsDisplay({ userIsAdmin }: ItemsDisplayProps) {
  const {
    items,
    totalItems,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    query: currentQuery,
    filter: currentFilter,
    sort: currentSort,
    isLoading,
    isValidating,
    error,
    mutate,
  } = useItems();

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-red-500 text-lg mb-4">Error loading items</div>
        <div className="text-gray-400 text-sm mb-4">
          {(error as { status?: number }).status === 404
            ? 'Items not found'
            : 'Something went wrong while loading items'}
        </div>
        <button
          onClick={() => mutate()}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Only show full loading state on initial load (no data yet)
  // When we have data, keep showing it while validating (stale-while-revalidate)
  if (isLoading && items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-gray-500 text-lg">Loading items...</div>
        <div className="mt-2">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
        </div>
      </div>
    );
  }

  if (!isLoading && !isValidating && items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-gray-500 text-lg">
          {currentQuery
            ? `No items found for "${currentQuery}"`
            : 'No items found'}
        </div>
        <div className="text-gray-400 text-sm mt-2">
          {currentQuery
            ? 'Try a different search term'
            : 'Items will appear here when they are added to the database'}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Items Counter with Validating Indicator */}
      <div className="mb-4 flex items-center gap-2">
        {currentQuery ? (
          <p className="text-gray-600">
            Found {totalItems} result{totalItems !== 1 ? 's' : ''} for &ldquo;
            <span className="font-semibold">{currentQuery}</span>&rdquo;
          </p>
        ) : (
          <p className="text-gray-600">
            Showing {totalItems} item{totalItems !== 1 ? 's' : ''} in the
            database
          </p>
        )}
        {isValidating && (
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <div className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
            <span>Updating...</span>
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="space-y-2 sm:space-y-3 mb-4">
        {items.map(item => {
          // Create raw item data for the expandable card
          const rawItem = {
            _id: String(item._id),
            raw: String(item.raw),
            createdAt: String(item.createdAt),
            updatedAt: String(item.updatedAt),
            parsedId: item.hru,
          };

          // Check if item is pending (visibleAfter is in the future)
          // visibleAfter is a string from the API, need to parse it
          // Admins should see pending items with dotted borders too
          const isPending = Boolean(
            item.visibleAfter &&
              item.visibleAfter.trim() !== '' &&
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
              postedBy={item.postedBy}
              cardStyle={{
                boxShadow: getShadowColor(item.level),
                borderColor: getBorderColor(item.level),
                backgroundColor: getBackgroundLevelColor(item.level),
              }}
            />
          );
        })}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        baseUrl={(() => {
          const params = new URLSearchParams();
          if (currentQuery) params.set('q', currentQuery);
          if (currentFilter) params.set('filter', currentFilter);
          if (currentSort && currentSort !== 'latest')
            params.set('sort', currentSort);
          const queryString = params.toString();
          return queryString ? `/?${queryString}` : '/';
        })()}
      />
    </>
  );
}
