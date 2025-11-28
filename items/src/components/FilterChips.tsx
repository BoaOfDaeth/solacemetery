'use client';

import { useRouter } from 'next/navigation';
import { FILTER_MAPPING, FilterKey } from '@/lib/helpers';

interface FilterChipsProps {
  currentFilter?: string;
  currentQuery?: string;
  userIsAdmin?: boolean;
}

// Consumable filters that should only be visible to admins
const ADMIN_ONLY_FILTERS: FilterKey[] = [
  'potion',
  'wand',
  'staves',
  'pill',
  'scroll',
];

export default function FilterChips({
  currentFilter,
  currentQuery,
  userIsAdmin = false,
}: FilterChipsProps) {
  const router = useRouter();

  const handleFilterClick = (filterKey: FilterKey) => {
    const params = new URLSearchParams();

    // Preserve current search query
    if (currentQuery) {
      params.set('q', currentQuery);
    }

    // If clicking the same filter, remove it (toggle off)
    if (currentFilter === filterKey) {
      // Don't add filter param, effectively removing it
    } else {
      // Add the new filter
      params.set('filter', filterKey);
    }

    // Reset to page 1 when changing filters
    // (don't add page param, defaults to page 1)

    const queryString = params.toString();
    const url = queryString ? `/?${queryString}` : '/';
    router.push(url);
  };

  // Filter out admin-only filters for non-admin users
  const visibleFilters = Object.entries(FILTER_MAPPING).filter(([key]) => {
    if (ADMIN_ONLY_FILTERS.includes(key as FilterKey)) {
      return userIsAdmin;
    }
    return true;
  });

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {visibleFilters.map(([key, filter]) => {
        const isActive = currentFilter === key;
        return (
          <button
            key={key}
            onClick={() => handleFilterClick(key as FilterKey)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
              isActive
                ? 'bg-gray-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
