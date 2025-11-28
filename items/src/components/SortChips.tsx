'use client';

import { useRouter } from 'next/navigation';

interface SortChipsProps {
  currentSort?: string;
  currentQuery?: string;
  currentFilter?: string;
}

export default function SortChips({
  currentSort,
  currentQuery,
  currentFilter,
}: SortChipsProps) {
  const router = useRouter();

  const handleSortClick = (sortValue: string) => {
    const params = new URLSearchParams();

    // Preserve current search query
    if (currentQuery) {
      params.set('q', currentQuery);
    }

    // Preserve current filter
    if (currentFilter) {
      params.set('filter', currentFilter);
    }

    // If clicking the same sort, remove it (toggle off)
    if (currentSort === sortValue) {
      // Don't add sort param, effectively removing it (defaults to 'latest')
    } else {
      // Add the new sort
      params.set('sort', sortValue);
    }

    // Reset to page 1 when changing sort
    // (don't add page param, defaults to page 1)

    const queryString = params.toString();
    const url = queryString ? `/?${queryString}` : '/';
    router.push(url);
  };

  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'level', label: 'Level' },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {sortOptions.map(option => {
        const isActive =
          currentSort === option.value ||
          (!currentSort && option.value === 'latest');
        return (
          <button
            key={option.value}
            onClick={() => handleSortClick(option.value)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
              isActive
                ? 'bg-gray-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
