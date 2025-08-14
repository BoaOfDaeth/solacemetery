'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CharacterData {
  character: string;
  characterInfo: {
    race: string | null;
    class: string | null;
  };
  statistics: {
    mvp: {
      deaths: number;
      total: number;
    };
    pvp: {
      kills: number;
      deaths: number;
      total: number;
    };
    total: number;
  };
  appearances: {
    mvp: {
      deaths: any[];
    };
    pvp: {
      kills: any[];
      deaths: any[];
    };
  };
}

export default function CharacterPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const [characterData, setCharacterData] = useState<CharacterData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacterData = async () => {
      try {
        setLoading(true);
        const { name } = await params;
        const response = await fetch(
          `/api/character/${encodeURIComponent(name)}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch character data');
        }

        const data = await response.json();
        setCharacterData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacterData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading character data...</p>
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
            <div className="bg-red-50 border border-red-200 p-4">
              <h3 className="text-lg font-medium text-red-800">Error</h3>
              <p className="mt-2 text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!characterData) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Character Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              No data found for this character.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {characterData.character}
          </h1>
          {characterData.characterInfo.race &&
            characterData.characterInfo.class && (
              <p className="font-bold ml-2">
                {characterData.characterInfo.race}{' '}
                {characterData.characterInfo.class}
              </p>
            )}
        </div>
        {/* PVP Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* PVP Kills */}
          <div className="bg-white shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                PVP Kills ({characterData.statistics.pvp.kills})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Victim
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Killed at Level
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {characterData.appearances.pvp.kills.map((kill: any) => (
                    <tr key={kill.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link
                          href={`/character/${encodeURIComponent(kill.victim)}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {kill.victim}
                        </Link>
                        {kill.vlevel && (
                          <span className="text-gray-500 ml-1">
                            ({kill.vlevel})
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {kill.klevel || '-'}
                      </td>
                    </tr>
                  ))}
                  {characterData.appearances.pvp.kills.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No PVP kills recorded
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PVP Deaths */}
          <div className="bg-white shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                PVP Deaths ({characterData.statistics.pvp.deaths})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Killer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Killed at Level
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {characterData.appearances.pvp.deaths.map((death: any) => (
                    <tr key={death.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link
                          href={`/character/${encodeURIComponent(death.killer)}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {death.killer}
                        </Link>
                        {death.klevel && (
                          <span className="text-gray-500 ml-1">
                            ({death.klevel})
                          </span>
                        )}
                        {death.krace && death.kclass && (
                          <span className="text-gray-500 ml-1">
                            {death.krace}/{death.kclass}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {death.vlevel || '-'}
                      </td>
                    </tr>
                  ))}
                  {characterData.appearances.pvp.deaths.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No PVP deaths recorded
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MVP Section */}
        <div className="mt-2">
          {/* MVP Deaths */}
          <div className="bg-white shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                MVP Deaths ({characterData.statistics.mvp.deaths})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Killer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {characterData.appearances.mvp.deaths.map((death: any) => (
                    <tr key={death.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link
                          href={`/mob/${encodeURIComponent(death.killer)}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {death.killer}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {death.vlevel}
                      </td>
                    </tr>
                  ))}
                  {characterData.appearances.mvp.deaths.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No MVP deaths recorded
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
