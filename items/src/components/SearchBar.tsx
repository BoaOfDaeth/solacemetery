'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  currentQuery?: string;
  currentFilter?: string;
  currentSort?: string;
}

export default function SearchBar({
  currentQuery = '',
  currentFilter,
  currentSort,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(currentQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigateToSearch(query);
  };

  const handleReset = () => {
    setQuery('');
    // Reset everything - clear search, filter, and sort
    router.push('/');
  };

  const navigateToSearch = (searchQuery: string) => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }

    // Preserve current filter
    if (currentFilter) {
      params.set('filter', currentFilter);
    }

    // Preserve current sort
    if (currentSort && currentSort !== 'latest') {
      params.set('sort', currentSort);
    }

    const queryString = params.toString();
    const url = queryString ? `/?${queryString}` : '/';
    router.push(url);
  };

  return (
    <div className="flex items-center gap-2 flex-1 max-w-md mx-4">
      <form onSubmit={handleSearch} className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search items..."
          className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
        />
      </form>

      <button
        type="button"
        onClick={handleSearch}
        className="px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-500 transition-colors duration-200 cursor-pointer select-none h-10 flex items-center"
        title="Search items"
      >
        Go
      </button>

      <button
        type="button"
        onClick={handleReset}
        className="px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-500 transition-colors duration-200 cursor-pointer select-none h-10 flex items-center"
        title="Reset search and filters"
      >
        Reset
      </button>
    </div>
  );
}
