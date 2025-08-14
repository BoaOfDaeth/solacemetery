import { FormatPlayer } from '@/lib/utils';
import { query } from '@/lib/db';

interface PvpRecord {
  id: number;
  killer: string;
  victim: string;
  klevel?: number;
  vlevel?: number;
  krace?: string;
  kclass?: string;
}

interface MvpRecord {
  id: number;
  killer: string;
  victim: string;
  vlevel?: number;
}

async function getPvpData(): Promise<{ pvpData: PvpRecord[]; mvpData: MvpRecord[] }> {
  try {
    const pvpData = await query(`
      SELECT id, killer, victim, klevel, vlevel, krace, kclass
      FROM PVP 
      WHERE killer != victim
      ORDER BY id DESC
      LIMIT 100
    `);

    const mvpData = await query(`
      SELECT id, killer, victim, vlevel
      FROM MVP 
      ORDER BY id DESC
      LIMIT 100
    `);

    return {
      pvpData: pvpData as PvpRecord[],
      mvpData: mvpData as MvpRecord[],
    };
  } catch (error) {
    console.error('Error fetching PVP data:', error);
    return {
      pvpData: [],
      mvpData: [],
    };
  }
}

export default async function PvpPage() {
  const { pvpData, mvpData } = await getPvpData();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Player vs Player records</h1>
            </div>
          </div>
        </div>
      </div>

      {/* PVP Table */}
      <div className="max-w-7xl mx-auto pb-8">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <tbody className="divide-y divide-gray-200">
            {pvpData
              .sort((a, b) => (b.klevel || 0) - (a.klevel || 0))
              .map(record => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <FormatPlayer
                      name={record.killer}
                      level={record.klevel}
                      race={record.krace}
                      class={record.kclass}
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
            {pvpData.length === 0 && (
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
      </div>

      {/* MVP Deaths Table */}
      <div className="max-w-7xl mx-auto pb-8">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <tbody className="divide-y divide-gray-200">
            {mvpData.map(record => (
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
                  No MVP deaths recorded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
