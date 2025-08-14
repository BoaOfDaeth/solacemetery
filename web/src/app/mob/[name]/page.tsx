import { FormatPlayer } from '@/lib/utils';
import { query } from '@/lib/db';
import { notFound } from 'next/navigation';

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
      SELECT id, victim, vlevel
      FROM MVP 
      WHERE killer = ?
      ORDER BY id DESC
    `, [name]);

    // Calculate statistics
    const totalKills = await query(`
      SELECT COUNT(*) as count
      FROM MVP 
      WHERE killer = ?
    `, [name]);

    const uniqueVictims = await query(`
      SELECT COUNT(DISTINCT victim) as count
      FROM MVP 
      WHERE killer = ?
    `, [name]);

    const avgLevel = await query(`
      SELECT AVG(vlevel) as avg
      FROM MVP 
      WHERE killer = ? AND vlevel IS NOT NULL
    `, [name]);

    return {
      monster: name,
      statistics: {
        totalKills: (totalKills as any[])[0]?.count || 0,
        uniqueVictims: (uniqueVictims as any[])[0]?.count || 0,
        avgLevel: Math.round((avgLevel as any[])[0]?.avg || 0),
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
  params: { name: string } 
}) {
  const mobData = await getMobData(params.name);

  if (!mobData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {mobData.monster}
          </h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <div className="bg-white shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Total Kills
            </h3>
            <p className="text-3xl font-bold">
              {mobData.statistics.totalKills}
            </p>
          </div>

          <div className="bg-white shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unique Victims
            </h3>
            <p className="text-3xl font-bold">
              {mobData.statistics.uniqueVictims}
            </p>
          </div>

          <div className="bg-white shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Average Victim Level
            </h3>
            <p className="text-3xl font-bold">
              {mobData.statistics.avgLevel}
            </p>
          </div>
        </div>

        {/* Victim List */}
        <div className="bg-white shadow">
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
                      <FormatPlayer
                        name={kill.victim}
                        level={kill.vlevel}
                      />
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
