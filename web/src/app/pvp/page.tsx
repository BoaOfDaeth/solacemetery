import { FormatPlayer } from '@/lib/utils';
import { query } from '@/lib/db';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

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
    
    // Get total count
    const pvpTotalCount = await query(`
      SELECT COUNT(*) as count
      FROM PVP
      WHERE killer != victim
    `);
    
    const pvpTotal = (pvpTotalCount as any[])[0]?.count || 0;
    const pvpTotalPages = Math.ceil(pvpTotal / limit);

    // Get paginated PVP data
    const pvpData = await query(`
      SELECT id, killer, victim, klevel, vlevel, krace, kclass, time
      FROM PVP 
      WHERE killer != victim
      ORDER BY id DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

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

function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center px-6 py-4 border-t border-gray-200">
      <div className="flex items-center space-x-2">
        {currentPage > 1 && (
          <Link
            href={`/pvp?page=1`}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
          >
            First
          </Link>
        )}
        
        {pages.map(page => (
          <Link
            key={page}
            href={`/pvp?page=${page}`}
            className={`px-3 py-2 text-sm font-medium ${
              page === currentPage
                ? 'text-blue-600 bg-blue-50 border border-blue-300'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </Link>
        ))}
        
        {currentPage < totalPages && (
          <Link
            href={`/pvp?page=${totalPages}`}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
          >
            Last
          </Link>
        )}
      </div>
    </div>
  );
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <PageHeader title="Player vs Player records" />

      {/* PVP Table */}
      <div className="max-w-7xl mx-auto pb-8">
        <div className="bg-white shadow">
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
            <Pagination currentPage={currentPage} totalPages={pvpTotalPages} />
          )}
        </div>
      </div>


    </div>
  );
}
