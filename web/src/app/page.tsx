import { FormatPlayer, getDataCutoffDate } from '@/lib/utils';
import { query } from '@/lib/db';
import PageHeader from '@/components/PageHeader';

// Force dynamic rendering - this page should not be statically generated
export const dynamic = 'force-dynamic';

// Disable caching for this page
export const fetchCache = 'force-no-store';

interface Stats {
  mvp_records: number;
  pvp_records: number;
  top_killers?: Array<{
    killer: string;
    kills: number;
    race?: string;
    class?: string;
  }>;
  top_monster_killers?: Array<{
    killer: string;
    total_levels: number;
  }>;
}

async function getStats(): Promise<Stats> {
  try {
    const cutoffDate = getDataCutoffDate();
    
    const mvpCount = await query(`
      SELECT COUNT(*) as count 
      FROM MVP 
      WHERE time IS NULL OR UNIX_TIMESTAMP(STR_TO_DATE(time, '%a %b %d %H:%i:%s %Y')) <= UNIX_TIMESTAMP(?)
    `, [cutoffDate]);
    
    const pvpCount = await query(`
      SELECT COUNT(*) as count 
      FROM PVP 
      WHERE killer != victim 
      AND (time IS NULL OR UNIX_TIMESTAMP(STR_TO_DATE(time, '%a %b %d %H:%i:%s %Y')) <= UNIX_TIMESTAMP(?))
    `, [cutoffDate]);

    // Get top 10 player killers with their race and class
    const topKillers = await query(`
      SELECT 
        killer,
        COUNT(*) as kills,
        MAX(krace) as race,
        MAX(kclass) as class
      FROM PVP 
      WHERE killer != victim 
      AND (time IS NULL OR UNIX_TIMESTAMP(STR_TO_DATE(time, '%a %b %d %H:%i:%s %Y')) <= UNIX_TIMESTAMP(?))
      GROUP BY killer 
      ORDER BY kills DESC 
      LIMIT 10
    `, [cutoffDate]);

    // Get top 10 monster killers
    const topMonsterKillers = await query(`
      SELECT 
        killer,
        SUM(vlevel) as total_levels
      FROM MVP 
      WHERE vlevel IS NOT NULL
      AND (time IS NULL OR UNIX_TIMESTAMP(STR_TO_DATE(time, '%a %b %d %H:%i:%s %Y')) <= UNIX_TIMESTAMP(?))
      GROUP BY killer 
      ORDER BY total_levels DESC 
      LIMIT 10
    `, [cutoffDate]);

    return {
      mvp_records: (mvpCount as any[])[0]?.count || 0,
      pvp_records: (pvpCount as any[])[0]?.count || 0,
      top_killers: topKillers as any[],
      top_monster_killers: topMonsterKillers as any[],
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      mvp_records: 0,
      pvp_records: 0,
      top_killers: [],
      top_monster_killers: [],
    };
  }
}

export default async function Home() {
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <PageHeader title="Solace MUD Stats" />

      {/* Top Killers Tables */}
      <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Top 10 Player Killers */}
          <div className="bg-white shadow">
            <div className="px-6 py-2 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Top 10 Player Killers
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
                  {stats.top_killers?.map((killer: any) => (
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

          {/* Top 10 Monster Killers */}
          <div className="bg-white shadow">
            <div className="px-6 py-2 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Top 10 Mobs
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mob
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player Levels killed
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.top_monster_killers?.map((mob: any) => (
                    <tr key={mob.killer} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <FormatPlayer
                          name={mob.killer}
                          linkType="mob"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mob.total_levels}
                      </td>
                    </tr>
                  ))}
                  {(!stats.top_monster_killers || stats.top_monster_killers.length === 0) && (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No mob killer data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl mx-auto">
          <div className="bg-white shadow p-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  PVP Records
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pvp_records?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow p-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  MVP Records
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.mvp_records?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Server Time */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center">
          <p className="text-sm text-gray-500 opacity-0 hover:opacity-100 transition-opacity duration-200">
            Data Cutoff Time: {getDataCutoffDate().toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              year: 'numeric',
              hour12: false,
              // timeZone: 'UTC'
            }).replace(/,/g, '')}
          </p>
        </div>
      </div>
    </div>
  );
}
