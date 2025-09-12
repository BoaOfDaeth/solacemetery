import { FormatPlayer, getDataCutoffDate, getTimeFilterClause, getTimeFilterClauseWithAnd } from '@/lib/utils';
import { query } from '@/lib/db';
import Link from 'next/link';
import TablePageLayout from '@/components/TablePageLayout';
import Pagination from '@/components/Pagination';

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
    <TablePageLayout title="Mob vs Player records">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mob
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Victim
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records
              .map(record => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900 min-w-0">
                    <div className="flex flex-col">
                      <FormatPlayer
                        name={record.killer}
                        linkType="mob"
                        truncate={true}
                        maxLength={25}
                      />
                      {record.time && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          {record.time}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-gray-500 min-w-0">
                    <FormatPlayer
                      name={record.victim}
                      level={record.vlevel}
                      truncate={true}
                      maxLength={20}
                    />
                  </td>
                </tr>
              ))}
            {records.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="px-3 sm:px-6 py-4 text-center text-sm text-gray-500"
                >
                  No MVP records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/mvp" />
      )}
    </TablePageLayout>
  );
}
