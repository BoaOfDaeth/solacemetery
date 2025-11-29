import useSWR from 'swr';
import { useSearchParams } from 'next/navigation';
import { useRef, useEffect } from 'react';

interface Item {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
  hidden?: boolean;
  visibleAfter?: string;
  postedBy?: string[];
}

interface ItemsResponse {
  success: boolean;
  data: {
    items: Item[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    query: string;
    filter?: string;
    sort?: string;
  };
}

// Cache key generator for consistent key management
export const getItemsCacheKey = (params: {
  query?: string;
  filter?: string;
  sort?: string;
  page?: string;
}) => {
  const searchParams = new URLSearchParams();

  if (params.query) searchParams.set('q', params.query);
  if (params.filter) searchParams.set('filter', params.filter);
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.page && params.page !== '1') searchParams.set('page', params.page);

  return `/api/search?${searchParams.toString()}`;
};

export function useItems() {
  const searchParams = useSearchParams();

  const query = searchParams.get('q') || '';
  const filter = searchParams.get('filter') || '';
  const sort = searchParams.get('sort') || '';
  const page = searchParams.get('page') || '1';

  // Generate cache key
  const cacheKey = getItemsCacheKey({ query, filter, sort, page });

  // Conditional fetching - only fetch if we have valid parameters
  const shouldFetch = query.length >= 2 || query.length === 0; // Allow empty query for "all items"

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<ItemsResponse>(
      shouldFetch ? cacheKey : null // Conditional fetching
    );

  // Keep previous data while new data is loading (stale-while-revalidate)
  const previousDataRef = useRef<ItemsResponse | undefined>(data);

  useEffect(() => {
    if (data) {
      previousDataRef.current = data;
    }
  }, [data]);

  // Use current data if available, otherwise fall back to previous data
  const displayData = data || previousDataRef.current;

  return {
    items: displayData?.data?.items || [],
    totalItems: displayData?.data?.totalItems || 0,
    currentPage: displayData?.data?.currentPage || 1,
    totalPages: displayData?.data?.totalPages || 1,
    hasNextPage: displayData?.data?.hasNextPage || false,
    hasPrevPage: displayData?.data?.hasPrevPage || false,
    query: displayData?.data?.query || '',
    filter: displayData?.data?.filter || '',
    sort: displayData?.data?.sort || '',
    isLoading: isLoading && !previousDataRef.current, // Only loading if no previous data
    isValidating,
    error,
    mutate, // For manual revalidation
  };
}
