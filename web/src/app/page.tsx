import { FormatPlayer, getDataCutoffDate, getTimeFilterClause } from '@/lib/utils';
import { query } from '@/lib/db';
import PageHeader from '@/components/PageHeader';
import StatsCard from '@/components/StatsCard';
import ModernTable from '@/components/ModernTable';

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
      WHERE ${getTimeFilterClause()}
    `, [cutoffDate]);
    
    const pvpCount = await query(`
      SELECT COUNT(*) as count 
      FROM PVP 
      WHERE killer != victim 
      AND (${getTimeFilterClause()})
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
      AND (${getTimeFilterClause()})
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
      AND (${getTimeFilterClause()})
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
    <div className="min-h-screen bg-background">
      {/* Statistics Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <StatsCard
            title="PVP Records"
            value={stats.pvp_records.toLocaleString()}
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <StatsCard
            title="MVP Records"
            value={stats.mvp_records.toLocaleString()}
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
          />
          <StatsCard
            title="Top Killer"
            value={stats.top_killers?.[0]?.kills || 0}
            description={stats.top_killers?.[0]?.killer || "No data"}
            icon={
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
          />
        </div>

        {/* Leaderboards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 10 Player Killers */}
          <ModernTable
            title="Top 10 Player Killers"
            columns={[
              { key: 'player', label: 'Player' },
              { key: 'kills', label: 'Kills', className: 'text-right' }
            ]}
            data={stats.top_killers || []}
            renderCell={(key, value, row) => {
              if (key === 'player') {
                return (
                  <div className="font-medium text-foreground">
                    <FormatPlayer
                      name={row.killer}
                      race={row.race}
                      class={row.class}
                    />
                  </div>
                );
              }
              if (key === 'kills') {
                return (
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {value}
                    </span>
                  </div>
                );
              }
              return value;
            }}
          />

          {/* Top 10 Monster Killers */}
          <ModernTable
            title="Top 10 Mobs"
            columns={[
              { key: 'mob', label: 'Mob' },
              { key: 'levels', label: 'Player Levels Killed', className: 'text-right' }
            ]}
            data={stats.top_monster_killers || []}
            renderCell={(key, value, row) => {
              if (key === 'mob') {
                return (
                  <div className="font-medium text-foreground">
                    <FormatPlayer
                      name={row.killer}
                      linkType="mob"
                    />
                  </div>
                );
              }
              if (key === 'levels') {
                return (
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                      {row.total_levels}
                    </span>
                  </div>
                );
              }
              return value;
            }}
          />
        </div>
      </div>

      {/* Data Freshness Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center">
          <p className="text-sm text-muted-foreground opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-default">
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
