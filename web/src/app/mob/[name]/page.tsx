'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface MobData {
  monster: string;
  statistics: {
    totalKills: number;
    uniqueVictims: number;
    avgLevel: number;
  };
  kills: any[];
}

export default function MobPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const [mobData, setMobData] = useState<MobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMobData = async () => {
      try {
        setLoading(true);
        const { name } = await params;
        const response = await fetch(`/api/mob/${encodeURIComponent(name)}`);

        if (!response.ok) {
          throw new Error('Failed to fetch mob data');
        }

        const data = await response.json();
        setMobData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMobData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading mob data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-red-800">Error</h3>
              <p className="mt-2 text-red-700">{error}</p>
              <Link
                href="/"
                className="mt-4 inline-block text-blue-600 hover:text-blue-800"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!mobData) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Monster Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              No data found for this monster.
            </p>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {mobData.monster}
          </h1>
          <p className="text-gray-600 mt-2">Monster Statistics & Victim List</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Total Kills
            </h3>
            <p className="text-3xl font-bold text-red-600">
              {mobData.statistics.totalKills}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unique Victims
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {mobData.statistics.uniqueVictims}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Average Victim Level
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {mobData.statistics.avgLevel}
            </p>
          </div>
        </div>

        {/* Victim List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Victim List ({mobData.statistics.totalKills})
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              All characters killed by this monster
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Victim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mobData.kills.map((kill: any) => (
                  <tr key={kill.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link
                        href={`/character/${encodeURIComponent(kill.victim)}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {kill.victim}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {kill.vlevel || '-'}
                    </td>
                  </tr>
                ))}
                {mobData.kills.length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No victims recorded
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
