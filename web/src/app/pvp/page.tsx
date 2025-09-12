import { FormatPlayer, getDataCutoffDate, getTimeFilterClauseWithAnd } from '@/lib/utils';
import { query } from '@/lib/db';
import Link from 'next/link';
import TablePageLayout from '@/components/TablePageLayout';
import Pagination from '@/components/Pagination';

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
    <TablePageLayout title="Player vs Player records">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Killer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Victim
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pvpRecords
            .map(record => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  <div className="flex flex-col">
                    <FormatPlayer
                      name={record.killer}
                      level={record.klevel}
                      race={record.krace}
                      class={record.kclass}
                    />
                    {record.time && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        {record.time}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <FormatPlayer
                    name={record.victim}
                    level={record.vlevel}
                  />
                </td>
              </tr>
            ))}
          {pvpRecords.length === 0 && (
            <tr>
              <td
                colSpan={2}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No PVP records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {pvpTotalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={pvpTotalPages} basePath="/pvp" />
      )}
    </TablePageLayout>
  );
}
