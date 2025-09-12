import { FormatPlayer, getDataCutoffDate, getTimeFilterClauseWithAnd } from '@/lib/utils';
import { query } from '@/lib/db';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import ModernTable from '@/components/ModernTable';

interface PvpRecord {
  id: number;
  killer: string;
  victim: string;
  klevel?: number;
  vlevel?: number;
  krace?: string;
  kclass?: string;
  time?: string | null;
}



interface PvpData {
  pvpRecords: PvpRecord[];
  pvpTotal: number;
  currentPage: number;
  pvpTotalPages: number;
  limit: number;
}

async function getPvpData(page: number = 1, limit: number = 50): Promise<PvpData> {
  try {
    const offset = (page - 1) * limit;
    const cutoffTime = getDataCutoffDate();
    
    // Get total count
    const pvpTotalCount = await query(`
      SELECT COUNT(*) as count
      FROM PVP
      WHERE killer != victim
      ${getTimeFilterClauseWithAnd()}
    `, [cutoffTime]);
    
    const pvpTotal = (pvpTotalCount as any[])[0]?.count || 0;
    const pvpTotalPages = Math.ceil(pvpTotal / limit);

    // Get paginated PVP data
    const pvpData = await query(`
      SELECT id, killer, victim, klevel, vlevel, krace, kclass, time
      FROM PVP 
      WHERE killer != victim
      ${getTimeFilterClauseWithAnd()}
      ORDER BY id DESC
      LIMIT ${limit} OFFSET ${offset}
    `, [cutoffTime]);

    return {
      pvpRecords: pvpData as PvpRecord[],
      pvpTotal,
      currentPage: page,
      pvpTotalPages,
      limit,
    };
  } catch (error) {
    console.error('Error fetching PVP data:', error);
    return {
      pvpRecords: [],
      pvpTotal: 0,
      currentPage: page,
      pvpTotalPages: 0,
      limit,
    };
  }
}


export default async function PvpPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // Await searchParams before accessing its properties
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1');
  const limit = 50;
  
  const { pvpRecords, currentPage, pvpTotalPages } = await getPvpData(page, limit);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <ModernTable
        title="Player vs Player Records"
        columns={[
          { key: 'killer', label: 'Killer' },
          { key: 'victim', label: 'Victim' }
        ]}
        data={pvpRecords}
        renderCell={(key, value, row) => {
          if (key === 'killer') {
            return (
              <div className="flex flex-col">
                <FormatPlayer
                  name={row.killer}
                  level={row.klevel}
                  race={row.krace}
                  class={row.kclass}
                />
                {row.time && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {row.time}
                  </div>
                )}
              </div>
            );
          }
          if (key === 'victim') {
            return (
              <FormatPlayer
                name={row.victim}
                level={row.vlevel}
              />
            );
          }
          return value;
        }}
            className="border-0 shadow-none"
          />
        </div>
        
        {pvpTotalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={pvpTotalPages} basePath="/pvp" />
        )}
      </div>
    </div>
  );
}
