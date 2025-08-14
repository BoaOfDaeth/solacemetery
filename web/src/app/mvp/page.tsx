'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BoltIcon } from '@heroicons/react/24/outline';

interface MvpRecord {
  id: number;
  killer: string;
  victim: string;
  vlevel?: number;
}

export default function MvpPage() {
  const [mvpData, setMvpData] = useState<MvpRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMvpData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/mvp?limit=100');
        if (!response.ok) {
          throw new Error('Failed to fetch MVP data');
        }
        const data = await response.json();
        setMvpData(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMvpData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
                      <div className="animate-spin h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading MVP data...</p>
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
          <div className="flex items-center">
            <BoltIcon className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MVP Records</h1>
              <p className="text-gray-600">Monster vs Player combat records</p>
            </div>
          </div>
        </div>
      </div>

      {/* MVP Table */}
      <div className="max-w-7xl mx-auto pb-8">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <tbody className="divide-y divide-gray-200">
            {mvpData
              .sort((a, b) => (b.vlevel || 0) - (a.vlevel || 0))
              .map(record => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link
                      href={`/mob/${encodeURIComponent(record.killer)}`}
                      className="text-red-600 hover:text-red-800 hover:underline"
                    >
                      {record.killer}
                    </Link>
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
            {mvpData.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No MVP records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
