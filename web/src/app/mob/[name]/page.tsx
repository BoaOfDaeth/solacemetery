import { FormatPlayer, getDataCutoffDate, getTimeFilterClauseWithAnd } from '@/lib/utils';
import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import ModernTable from '@/components/ModernTable';

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
    const cutoffTime = getDataCutoffDate();
    
    // Get all kills by this monster
    const kills = await query(`
      SELECT id, victim, vlevel, time
      FROM MVP 
      WHERE killer = ?
      ${getTimeFilterClauseWithAnd()}
      ORDER BY id DESC
    `, [name, cutoffTime]);

    // Calculate statistics in a single query for better performance
    const stats = await query(`
      SELECT 
        COUNT(*) as total_kills,
        COUNT(DISTINCT victim) as unique_victims,
        AVG(vlevel) as avg_level
      FROM MVP 
      WHERE killer = ?
      ${getTimeFilterClauseWithAnd()}
    `, [name, cutoffTime]);

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
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header */}
        <div className="mb-4 text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground break-words">
            {decodedName}
          </h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-card border border-border rounded-xl shadow-sm p-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Total Kills
            </h3>
            <p className="text-3xl font-bold text-foreground">
              {mobData.statistics.totalKills}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm p-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Average Victim Level
            </h3>
            <p className="text-3xl font-bold text-foreground">
              {mobData.statistics.avgLevel}
            </p>
          </div>
        </div>

        {/* Victim List */}
        <ModernTable
          title={`Victim List (${mobData.statistics.totalKills})`}
          description="All characters killed by this monster"
          columns={[
            { key: 'victim', label: 'Victim' }
          ]}
          data={mobData.kills}
          renderCell={(key, value, row) => {
            if (key === 'victim') {
              return (
                <div className="flex flex-col">
                  <FormatPlayer
                    name={row.victim}
                    level={row.vlevel}
                    truncate={true}
                    maxLength={30}
                  />
                  {row.time && (
                    <div className="text-xs text-muted-foreground mt-0.5 truncate font-medium">
                      {row.time}
                    </div>
                  )}
                </div>
              );
            }
            return value;
          }}
          className="border-0 shadow-none"
        />
      </div>
    </div>
  );
}
