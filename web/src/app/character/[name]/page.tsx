import { FormatPlayer, getDataCutoffDate, getTimeFilterClauseWithAnd } from '@/lib/utils';
import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import ModernTable from '@/components/ModernTable';

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
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        {/* Header */}
        <div className="mb-4 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-foreground">
            {decodedName}
          </h1>
          {characterData.characterInfo.race &&
            characterData.characterInfo.class && (
              <p className="font-semibold text-muted-foreground sm:ml-2">
                {characterData.characterInfo.race}{' '}
                {characterData.characterInfo.class}
              </p>
            )}
        </div>
        {/* PVP Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* PVP Kills */}
          <ModernTable
            title={`PVP Kills (${characterData.statistics.pvp.kills})`}
            columns={[
              { key: 'victim', label: 'Victim' },
              { key: 'klevel', label: 'Killed at Level' }
            ]}
            data={characterData.appearances.pvp.kills}
            renderCell={(key, value, row) => {
              if (key === 'victim') {
                return (
                  <div className="flex flex-col">
                    <FormatPlayer
                      name={row.victim}
                      level={row.vlevel}
                    />
                    {row.time && (
                      <div className="text-xs text-muted-foreground mt-0.5 truncate font-medium">
                        {row.time}
                      </div>
                    )}
                  </div>
                );
              }
              if (key === 'klevel') {
                return <span className="text-muted-foreground">{row.klevel || '-'}</span>;
              }
              return value;
            }}
            className="border-0 shadow-none"
          />

          {/* PVP Deaths */}
          <ModernTable
            title={`PVP Deaths (${characterData.statistics.pvp.deaths})`}
            columns={[
              { key: 'killer', label: 'Killer' },
              { key: 'vlevel', label: 'Killed at Level' }
            ]}
            data={characterData.appearances.pvp.deaths}
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
                      <div className="text-xs text-muted-foreground mt-0.5 truncate font-medium">
                        {row.time}
                      </div>
                    )}
                  </div>
                );
              }
              if (key === 'vlevel') {
                return <span className="text-muted-foreground">{row.vlevel || '-'}</span>;
              }
              return value;
            }}
            className="border-0 shadow-none"
          />
        </div>

        {/* MVP Section */}
        <div className="mt-4">
          {/* MVP Deaths */}
          <ModernTable
            title={`MVP Deaths (${characterData.statistics.mvp.deaths})`}
            columns={[
              { key: 'killer', label: 'Killer' },
              { key: 'vlevel', label: 'Level' }
            ]}
            data={characterData.appearances.mvp.deaths}
            renderCell={(key, value, row) => {
              if (key === 'killer') {
                return (
                  <div className="flex flex-col">
                    <FormatPlayer
                      name={row.killer}
                      linkType="mob"
                    />
                    {row.time && (
                      <div className="text-xs text-muted-foreground mt-0.5 truncate font-medium">
                        {row.time}
                      </div>
                    )}
                  </div>
                );
              }
              if (key === 'vlevel') {
                return <span className="text-muted-foreground">{row.vlevel}</span>;
              }
              return value;
            }}
            className="border-0 shadow-none"
          />
        </div>
      </div>
    </div>
  );
}
