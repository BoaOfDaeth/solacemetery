import { FormatPlayer, getDataCutoffDate, getTimeFilterClauseWithAnd } from '@/lib/utils';
import { query } from '@/lib/db';
import { notFound } from 'next/navigation';

interface CharacterData {
  character: string;
  characterInfo: {
    race?: string;
    class?: string;
  };
  statistics: {
    pvp: {
      kills: number;
      deaths: number;
    };
    mvp: {
      deaths: number;
    };
  };
  appearances: {
    pvp: {
      kills: any[];
      deaths: any[];
    };
    mvp: {
      deaths: any[];
    };
  };
}

async function getCharacterData(name: string): Promise<CharacterData | null> {
  try {
    const cutoffTime = getDataCutoffDate();
    
    // Get character info
    const characterInfo = await query(`
      SELECT DISTINCT krace as race, kclass as class
      FROM PVP 
      WHERE killer = ? 
      ${getTimeFilterClauseWithAnd()}
      LIMIT 1
    `, [name, cutoffTime]);

    // Get PVP kills
    const pvpKills = await query(`
      SELECT id, victim, vlevel, klevel, time
      FROM PVP 
      WHERE killer = ? AND killer != victim
      ${getTimeFilterClauseWithAnd()}
      ORDER BY id DESC
    `, [name, cutoffTime]);

    // Get PVP deaths
    const pvpDeaths = await query(`
      SELECT id, killer, klevel, krace, kclass, vlevel, time
      FROM PVP 
      WHERE victim = ? AND killer != victim
      ${getTimeFilterClauseWithAnd()}
      ORDER BY id DESC
    `, [name, cutoffTime]);

    // Get MVP deaths
    const mvpDeaths = await query(`
      SELECT id, killer, vlevel, time
      FROM MVP 
      WHERE victim = ?
      ${getTimeFilterClauseWithAnd()}
      ORDER BY id DESC
    `, [name, cutoffTime]);

    // Calculate statistics in a single query for better performance
    const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM PVP WHERE killer = ? AND killer != victim ${getTimeFilterClauseWithAnd()}) as pvp_kills,
        (SELECT COUNT(*) FROM PVP WHERE victim = ? AND killer != victim ${getTimeFilterClauseWithAnd()}) as pvp_deaths,
        (SELECT COUNT(*) FROM MVP WHERE victim = ? ${getTimeFilterClauseWithAnd()}) as mvp_deaths
    `, [name, cutoffTime, name, cutoffTime, name, cutoffTime]);

    return {
      character: name,
      characterInfo: {
        race: (characterInfo as any[])[0]?.race,
        class: (characterInfo as any[])[0]?.class,
      },
      statistics: {
        pvp: {
          kills: (stats as any[])[0]?.pvp_kills || 0,
          deaths: (stats as any[])[0]?.pvp_deaths || 0,
        },
        mvp: {
          deaths: (stats as any[])[0]?.mvp_deaths || 0,
        },
      },
      appearances: {
        pvp: {
          kills: pvpKills as any[],
          deaths: pvpDeaths as any[],
        },
        mvp: {
          deaths: mvpDeaths as any[],
        },
      },
    };
  } catch (error) {
    console.error('Error fetching character data:', error);
    return null;
  }
}

export default async function CharacterPage({ 
  params 
}: { 
  params: Promise<{ name: string }> 
}) {
  // Await params before accessing its properties
  const { name } = await params;
  
  // Decode the URL parameter to handle spaces properly
  const decodedName = decodeURIComponent(name);
  const characterData = await getCharacterData(decodedName);

  if (!characterData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 py-2">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-2 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">
            {decodedName}
          </h1>
          {characterData.characterInfo.race &&
            characterData.characterInfo.class && (
              <p className="font-bold sm:ml-2">
                {characterData.characterInfo.race}{' '}
                {characterData.characterInfo.class}
              </p>
            )}
        </div>
        {/* PVP Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* PVP Kills */}
          <div className="bg-white shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                PVP Kills ({characterData.statistics.pvp.kills})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Victim
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Killed at Level
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {characterData.appearances.pvp.kills.map((kill: any) => (
                    <tr key={kill.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <div className="flex flex-col">
                          <FormatPlayer
                            name={kill.victim}
                            level={kill.vlevel}
                          />
                          {kill.time && (
                            <div className="text-xs text-gray-400 mt-0.5">
                              {kill.time}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {kill.klevel || '-'}
                      </td>
                    </tr>
                  ))}
                  {characterData.appearances.pvp.kills.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No PVP kills recorded
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PVP Deaths */}
          <div className="bg-white shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                PVP Deaths ({characterData.statistics.pvp.deaths})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Killer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Killed at Level
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {characterData.appearances.pvp.deaths.map((death: any) => (
                    <tr key={death.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <div className="flex flex-col">
                          <FormatPlayer
                            name={death.killer}
                            level={death.klevel}
                            race={death.krace}
                            class={death.kclass}
                          />
                          {death.time && (
                            <div className="text-xs text-gray-400 mt-0.5">
                              {death.time}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {death.vlevel || '-'}
                      </td>
                    </tr>
                  ))}
                  {characterData.appearances.pvp.deaths.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No PVP deaths recorded
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MVP Section */}
        <div className="mt-2">
          {/* MVP Deaths */}
          <div className="bg-white shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                MVP Deaths ({characterData.statistics.mvp.deaths})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Killer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {characterData.appearances.mvp.deaths.map((death: any) => (
                    <tr key={death.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <div className="flex flex-col">
                          <FormatPlayer
                            name={death.killer}
                            linkType="mob"
                          />
                          {death.time && (
                            <div className="text-xs text-gray-400 mt-0.5">
                              {death.time}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {death.vlevel}
                      </td>
                    </tr>
                  ))}
                  {characterData.appearances.mvp.deaths.length === 0 && (
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
        </div>
      </div>
    </div>
  );
}
