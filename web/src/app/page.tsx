'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserGroupIcon, BoltIcon } from '@heroicons/react/24/outline';

interface Stats {
  mvp_records: number;
  pvp_records: number;
  top_killers?: Array<{
    killer: string;
    kills: number;
    race?: string;
    class?: string;
  }>;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const statsResponse = await fetch('/api/stats');
        const statsResult = await statsResponse.json();
        if (statsResult.success) {
          setStats(statsResult.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Solacemetry data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Solacemetry</h1>
              <p className="text-gray-600">Gaming Database Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <BoltIcon className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    MVP Records
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.mvp_records?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    PVP Records
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pvp_records?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Killers Table */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Top 10 Killers
              </h3>
              <p className="text-sm text-gray-600">
                Players with the most PVP kills
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kills
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.top_killers?.map((killer: any, index: number) => (
                    <tr key={killer.killer} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link
                          href={`/character/${encodeURIComponent(killer.killer)}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {killer.killer}
                        </Link>
                        {killer.race && killer.class && (
                          <span className="text-gray-500 ml-2">
                            {killer.race}/{killer.class}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {killer.kills}
                      </td>
                    </tr>
                  ))}
                  {(!stats.top_killers || stats.top_killers.length === 0) && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No killer data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Quick Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/pvp"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <UserGroupIcon className="h-12 w-12 text-blue-500" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  PVP Records
                </h3>
                <p className="text-sm text-gray-600">
                  View all Player vs Player combat records
                </p>
              </div>
            </div>
          </Link>
          <Link
            href="/mvp"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <BoltIcon className="h-12 w-12 text-red-500" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  MVP Records
                </h3>
                <p className="text-sm text-gray-600">
                  View all Monster vs Player combat records
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
