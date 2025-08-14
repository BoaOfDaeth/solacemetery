import Link from 'next/link';
import { UserGroupIcon, BoltIcon } from '@heroicons/react/24/outline';
import { FormatPlayer } from '@/lib/utils';
import { query } from '@/lib/db';

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

async function getStats(): Promise<Stats> {
  try {
    const mvpCount = await query('SELECT COUNT(*) as count FROM MVP');
    const pvpCount = await query(
      'SELECT COUNT(*) as count FROM PVP WHERE killer != victim'
    );

    // Get top 10 killers with their race and class
    const topKillers = await query(`
      SELECT 
        killer,
        COUNT(*) as kills,
        MAX(krace) as race,
        MAX(kclass) as class
      FROM PVP 
      WHERE killer != victim 
      GROUP BY killer 
      ORDER BY kills DESC 
      LIMIT 10
    `);

    return {
      mvp_records: (mvpCount as any[])[0]?.count || 0,
      pvp_records: (pvpCount as any[])[0]?.count || 0,
      top_killers: topKillers as any[],
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      mvp_records: 0,
      pvp_records: 0,
      top_killers: [],
    };
  }
}

export default async function Home() {
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center my-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Solace MUD player stats
            </h1>
          </div>
        </div>
      </div>

      {/* Top Killers Table - Moved to top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-white shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Top 10 Killers
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                      <FormatPlayer
                        name={killer.killer}
                        race={killer.race}
                        class={killer.class}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {killer.kills}
                    </td>
                  </tr>
                ))}
                {(!stats.top_killers || stats.top_killers.length === 0) && (
                  <tr>
                    <td
                      colSpan={2}
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

      {/* Stats Cards - Only PVP Records */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white shadow p-6">
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
    </div>
  );
}
