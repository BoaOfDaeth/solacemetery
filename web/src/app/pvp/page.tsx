'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserGroupIcon } from '@heroicons/react/24/outline';

interface PvpRecord {
  id: number;
  killer: string;
  victim: string;
  klevel?: number;
  vlevel?: number;
  krace?: string;
  kclass?: string;
}

export default function PvpPage() {
  const [pvpData, setPvpData] = useState<PvpRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPvpData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/pvp?limit=100');
        if (!response.ok) {
          throw new Error('Failed to fetch PVP data');
        }
        const data = await response.json();
        setPvpData(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPvpData();
  }, []);

  const filteredPvpData = pvpData.filter(
    record =>
      record.killer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.victim.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading PVP data...</p>
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  PVP Records
                </h1>
                <p className="text-gray-600">Player vs Player combat records</p>
              </div>
            </div>
            <Link
              href="/"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Back to Top
            </Link>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">
                Search PVP records
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Search by killer or victim name..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredPvpData.length} of {pvpData.length} records
            </div>
          </div>
        </div>
      </div>

      {/* PVP Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              PVP Records (Player vs Player)
            </h3>
            <p className="text-sm text-gray-600">
              Showing {filteredPvpData.length} records
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Killer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Victim
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPvpData
                  .sort((a, b) => (b.klevel || 0) - (a.klevel || 0))
                  .map(record => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link
                          href={`/character/${encodeURIComponent(record.killer)}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {record.killer}
                        </Link>
                        {record.klevel && (
                          <span className="text-gray-500 ml-1">
                            ({record.klevel})
                          </span>
                        )}
                        {record.krace && record.kclass && (
                          <span className="text-gray-500 ml-1">
                            {record.krace}/{record.kclass}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link
                          href={`/character/${encodeURIComponent(record.victim)}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {record.victim}
                        </Link>
                        {record.vlevel && (
                          <span className="text-gray-500 ml-1">
                            ({record.vlevel})
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                {filteredPvpData.length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No PVP records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
