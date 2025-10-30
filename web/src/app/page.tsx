import { FormatPlayer, getDataCutoffDate, getTimeFilterClause } from '@/lib/utils';
import { query } from '@/lib/db';
import { Icon } from '@iconify/react';
import StatsCard from '@/components/StatsCard';
import ModernTable from '@/components/ModernTable';
import type { Metadata } from 'next';

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
        COUNT(*) as kills,
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
    <div className="bg-background">
      {/* Statistics Overview */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <StatsCard
            title="Players killed by players"
            value={stats.pvp_records.toLocaleString()}
            href="/pvp"
            icon={
              <Icon icon="game-icons:backstab" className="w-6 h-6 text-primary" />
            }
          />
          <StatsCard
            title="Players killed by mobs"
            value={stats.mvp_records.toLocaleString()}
            href="/mvp"
            icon={
              <Icon icon="game-icons:crab-claw" className="w-6 h-6 text-primary" />
            }
          />
          <StatsCard
            title="Top Killer"
            value={stats.top_killers?.[0]?.kills || 0}
            description={stats.top_killers?.[0]?.killer || "No data"}
            href={stats.top_killers?.[0]?.killer ? `/character/${encodeURIComponent(stats.top_killers[0].killer)}` : undefined}
            icon={
              <Icon icon="game-icons:scythe" className="w-6 h-6 text-primary" />
            }
          />
        </div>

        {/* Leaderboards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary select-none">
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
              { key: 'levels', label: 'Levels Sum', className: 'text-right' }
            ]}
            data={stats.top_monster_killers || []}
            renderCell={(key, value, row) => {
              if (key === 'mob') {
                return (
                  <div className="font-medium text-foreground">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center min-w-0">
                        <a
                          href={`/mob/${encodeURIComponent(row.killer)}`}
                          className="text-primary hover:text-primary/80 hover:underline font-medium truncate"
                          title={row.killer}
                        >
                          {row.killer}
                        </a>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 truncate font-medium">
                        {row.kills || 0} players killed
                      </div>
                    </div>
                  </div>
                );
              }
              if (key === 'levels') {
                return (
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive select-none">
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


    </div>
  );
}

export const metadata: Metadata = {
  title: 'Overview',
  description: 'Latest PVP and MVP stats, leaders, and summaries for Solace Mud.',
  alternates: { canonical: '/' },
  openGraph: { title: 'Overview', description: 'Latest PVP and MVP stats, leaders, and summaries for Solace Mud.', url: '/' },
  twitter: { title: 'Overview', description: 'Latest PVP and MVP stats, leaders, and summaries for Solace Mud.', card: 'summary' },
};
