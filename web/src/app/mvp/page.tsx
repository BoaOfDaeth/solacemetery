import { FormatPlayer } from '@/lib/utils';
import { BoltIcon } from '@heroicons/react/24/outline';
import { query } from '@/lib/db';

interface MvpRecord {
  id: number;
  killer: string;
  victim: string;
  vlevel?: number;
}

async function getMvpData(): Promise<MvpRecord[]> {
  try {
    const mvpData = await query(`
      SELECT id, killer, victim, vlevel
      FROM MVP 
      ORDER BY id DESC
      LIMIT 100
    `);

    return mvpData as MvpRecord[];
  } catch (error) {
    console.error('Error fetching MVP data:', error);
    return [];
  }
}

export default async function MvpPage() {
  const mvpData = await getMvpData();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <BoltIcon className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MVP Records</h1>
              <p className="text-gray-600">Monster vs Player combat records</p>
            </div>
          </div>
        </div>
      </div>

      {/* MVP Table */}
      <div className="max-w-7xl mx-auto pb-8">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <tbody className="divide-y divide-gray-200">
            {mvpData
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
            {mvpData.length === 0 && (
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
      </div>
    </div>
  );
}
