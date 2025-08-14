import { FormatPlayer } from '@/lib/utils';
import { query } from '@/lib/db';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

interface MvpRecord {
  id: number;
  killer: string;
  victim: string;
  vlevel?: number;
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
    
    // Get total count
    const totalCount = await query(`
      SELECT COUNT(*) as count
      FROM MVP
    `);
    
    const total = (totalCount as any[])[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const mvpData = await query(`
      SELECT id, killer, victim, vlevel
      FROM MVP 
      ORDER BY id DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

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
              href={`/mvp?page=1`}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
            >
              First
            </Link>
          )}
          
          {pages.map(page => (
            <Link
              key={page}
              href={`/mvp?page=${page}`}
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
              href={`/mvp?page=${totalPages}`}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
            >
              Last
            </Link>
          )}
        </div>
      </div>
  );
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <PageHeader title="Mob vs Player records" />

      {/* MVP Table */}
      <div className="max-w-7xl mx-auto pb-8">
        <div className="bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mob
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Victim
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records
                .sort((a, b) => (b.vlevel || 0) - (a.vlevel || 0))
                .map(record => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <FormatPlayer
                        name={record.killer}
                        linkType="mob"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <FormatPlayer
                        name={record.victim}
                        level={record.vlevel}
                      />
                    </td>
                  </tr>
                ))}
              {records.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No MVP records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          )}
        </div>
      </div>
    </div>
  );
}
