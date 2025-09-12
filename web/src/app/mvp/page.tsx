import { FormatPlayer, getDataCutoffDate, getTimeFilterClause } from '@/lib/utils';
import { query } from '@/lib/db';
import Pagination from '@/components/Pagination';
import ModernTable from '@/components/ModernTable';

// Force dynamic rendering - this page should not be statically generated
export const dynamic = 'force-dynamic';

// Disable caching for this page
export const fetchCache = 'force-no-store';

interface MvpRecord {
  id: number;
  killer: string;
  victim: string;
  vlevel?: number;
  time?: string | null;
}

interface MvpData {
  records: MvpRecord[];
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

async function getMvpData(page: number = 1, limit: number = 50): Promise<MvpData> {
  try {
    const offset = (page - 1) * limit;
    const cutoffTime = getDataCutoffDate();
    
    // Get total count
    const totalCount = await query(`
      SELECT COUNT(*) as count
      FROM MVP
      WHERE ${getTimeFilterClause()}
    `, [cutoffTime]);
    
    const total = (totalCount as any[])[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const mvpData = await query(`
      SELECT id, killer, victim, vlevel, time
      FROM MVP 
      WHERE ${getTimeFilterClause()}
      ORDER BY id DESC
      LIMIT ${limit} OFFSET ${offset}
    `, [cutoffTime]);

    return {
      records: mvpData as MvpRecord[],
      total,
      currentPage: page,
      totalPages,
      limit,
    };
  } catch (error) {
    console.error('Error fetching MVP data:', error);
    return {
      records: [],
      total: 0,
      currentPage: page,
      totalPages: 0,
      limit,
    };
  }
}


export default async function MvpPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // Await searchParams before accessing its properties
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1');
  const limit = 50;
  
  const { records, currentPage, totalPages } = await getMvpData(page, limit);

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <ModernTable
        title="Mob achievements"
        columns={[
          { key: 'mob', label: 'Mob' },
          { key: 'victim', label: 'Victim' }
        ]}
        data={records}
        renderCell={(key, value, row) => {
          if (key === 'mob') {
            return (
              <div className="flex flex-col">
                <FormatPlayer
                  name={row.killer}
                  linkType="mob"
                  truncate={true}
                  maxLength={25}
                />
                {row.time && (
                  <div className="text-xs text-muted-foreground mt-0.5 truncate font-medium">
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
                truncate={true}
                maxLength={20}
              />
            );
          }
          return value;
        }}
            className="border-0 shadow-none"
          />
        </div>
        
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/mvp" />
        )}
      </div>
    </div>
  );
}
