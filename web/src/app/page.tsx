'use client';

import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import Link from 'next/link';
import {
  ChartBarIcon,
  UserGroupIcon,
  BoltIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface MVPRecord {
  id: number;
  killer: string;
  victim: string;
  vlevel: number;
}

interface PVPRecord {
  id: number;
  killer: string;
  victim: string;
  klevel: number;
  vlevel: number;
  krace: string;
  kclass: string;
}

interface Stats {
  mvp_records: number;
  pvp_records: number;
  unique_killers: number;
  unique_victims: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState(0); // PVP is now first (index 0)
  const [mvpData, setMvpData] = useState<MVPRecord[]>([]);
  const [pvpData, setPvpData] = useState<PVPRecord[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [characterSearch, setCharacterSearch] = useState('');
  const [showCharacterSearch, setShowCharacterSearch] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch MVP data
      const mvpResponse = await fetch('/api/mvp?limit=100');
      const mvpResult = await mvpResponse.json();
      if (mvpResult.success) {
        setMvpData(mvpResult.data);
      }

      // Fetch PVP data
      const pvpResponse = await fetch('/api/pvp?limit=100');
      const pvpResult = await pvpResponse.json();
      if (pvpResult.success) {
        setPvpData(pvpResult.data);
      }

      // Fetch stats
      const statsResponse = await fetch('/api/stats');
      const statsResult = await statsResponse.json();
      if (statsResult.success) {
        setStats(statsResult.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMvpData = mvpData.filter(
    record =>
      record.killer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.victim.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPvpData = pvpData.filter(
    record =>
      record.killer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.victim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.krace?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.kclass?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search players, monsters, races, classes..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowCharacterSearch(!showCharacterSearch)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserIcon className="h-5 w-5" />
                <span>Character Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Character Search Modal */}
      {showCharacterSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Character Search
              </h2>
              <button
                onClick={() => setShowCharacterSearch(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter character name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={characterSearch}
                onChange={e => setCharacterSearch(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter' && characterSearch.trim()) {
                    window.location.href = `/character/${encodeURIComponent(characterSearch.trim())}`;
                  }
                }}
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  if (characterSearch.trim()) {
                    window.location.href = `/character/${encodeURIComponent(characterSearch.trim())}`;
                  }
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search Character
              </button>
              <button
                onClick={() => setShowCharacterSearch(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Unique Killers
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.unique_killers?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Unique Victims
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.unique_victims?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
                 ${
                   selected
                     ? 'bg-white shadow'
                     : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                 }`
              }
            >
              PVP Records
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
                 ${
                   selected
                     ? 'bg-white shadow'
                     : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                 }`
              }
            >
              MVP Records
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-6">
            <Tab.Panel>
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
                    </tbody>
                  </table>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    MVP Records (Player vs Monster)
                  </h3>
                  <p className="text-sm text-gray-600">
                    Showing {filteredMvpData.length} records
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Level
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredMvpData.map(record => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <Link
                              href={`/mob/${encodeURIComponent(record.killer)}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {record.killer}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <Link
                              href={`/character/${encodeURIComponent(record.victim)}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {record.victim}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.vlevel || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
