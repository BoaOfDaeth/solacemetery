'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchResult {
  character_name: string;
  source: string;
}

interface SearchData {
  query: string;
  results: SearchResult[];
  total: number;
}

export default function SearchPage() {
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');

        if (!query) {
          setError('No search query provided');
          return;
        }

        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }

        const data = await response.json();
        if (data.success) {
          setSearchData(data.data);
        } else {
          setError(data.error || 'Search failed');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, []);

  const getSourceLabel = (source: string) => {
    const sources = source.split(',');
    const labels = sources.map(s => {
      switch (s) {
        case 'mvp_victim':
          return 'MVP Victim';
        case 'pvp_killer':
          return 'PVP Killer';
        case 'pvp_victim':
          return 'PVP Victim';
        default:
          return s;
      }
    });
    return labels.join(', ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!searchData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No search data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <MagnifyingGlassIcon className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Search Results
              </h1>
              <p className="text-gray-600">
                Found {searchData.total} character
                {searchData.total !== 1 ? 's' : ''} for &quot;
                {searchData.query}&quot;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-7xl mx-auto py-8">
        {searchData.results.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Character Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appears As
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {searchData.results.map((result, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link
                      href={`/character/${encodeURIComponent(result.character_name)}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {result.character_name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getSourceLabel(result.source)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No characters found
            </h3>
            <p className="text-gray-600 mb-4">
              No characters found matching &quot;{searchData.query}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
