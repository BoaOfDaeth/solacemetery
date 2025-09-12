import { FormatPlayer } from '@/lib/utils';
import { query } from '@/lib/db';
import { notFound } from 'next/navigation';

// Force dynamic rendering - this page should not be statically generated
export const dynamic = 'force-dynamic';

// Disable caching for this page
export const fetchCache = 'force-no-store';

interface MobData {
  monster: string;
  statistics: {
    totalKills: number;
    uniqueVictims: number;
    avgLevel: number;
  };
  kills: any[];
}

async function getMobData(name: string): Promise<MobData | null> {
  try {
    // Get all kills by this monster
    const kills = await query(`
      SELECT id, victim, vlevel, time
      FROM MVP 
      WHERE killer = ?
      ORDER BY id DESC
    `, [name]);

    // Calculate statistics in a single query for better performance
    const stats = await query(`
      SELECT 
        COUNT(*) as total_kills,
        COUNT(DISTINCT victim) as unique_victims,
        AVG(vlevel) as avg_level
      FROM MVP 
      WHERE killer = ?
    `, [name]);

    return {
      monster: name,
      statistics: {
        totalKills: (stats as any[])[0]?.total_kills || 0,
        uniqueVictims: (stats as any[])[0]?.unique_victims || 0,
        avgLevel: Math.round((stats as any[])[0]?.avg_level || 0),
      },
      kills: kills as any[],
    };
  } catch (error) {
    console.error('Error fetching mob data:', error);
    return null;
  }
}

export default async function MobPage({ 
  params 
}: { 
  params: Promise<{ name: string }> 
}) {
  // Await params before accessing its properties
  const { name } = await params;
  
  // Decode the URL parameter to handle spaces properly
  const decodedName = decodeURIComponent(name);
  const mobData = await getMobData(decodedName);

  if (!mobData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 py-2">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-2 text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 px-4 sm:px-0 break-words">
            {decodedName}
          </h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 px-4 sm:px-0">
          <div className="bg-white shadow p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Total Kills
            </h3>
            <p className="text-3xl font-bold">
              {mobData.statistics.totalKills}
            </p>
          </div>

          <div className="bg-white shadow p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Average Victim Level
            </h3>
            <p className="text-3xl font-bold">
              {mobData.statistics.avgLevel}
            </p>
          </div>
        </div>

        {/* Victim List */}
        <div className="bg-white shadow overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
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
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Victim
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mobData.kills.map((kill: any) => (
                  <tr key={kill.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900 min-w-0">
                      <div className="flex flex-col">
                        <FormatPlayer
                          name={kill.victim}
                          level={kill.vlevel}
                          truncate={true}
                          maxLength={30}
                        />
                        {kill.time && (
                          <div className="text-xs text-gray-400 mt-0.5">
                            {kill.time}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {mobData.kills.length === 0 && (
                  <tr>
                    <td
                      colSpan={1}
                      className="px-3 sm:px-6 py-4 text-center text-sm text-gray-500"
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
