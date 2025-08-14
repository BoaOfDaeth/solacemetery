import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';

    let results: unknown;

    switch (type) {
      case 'top_killers':
        results = await query(`
          SELECT killer, COUNT(*) as kills 
          FROM MVP 
          GROUP BY killer 
          ORDER BY kills DESC 
          LIMIT 10
        `);
        break;

      case 'top_victims':
        results = await query(`
          SELECT victim, COUNT(*) as deaths 
          FROM MVP 
          GROUP BY victim 
          ORDER BY deaths DESC 
          LIMIT 10
        `);
        break;

      case 'pvp_by_race':
        results = await query(`
          SELECT krace, COUNT(*) as pvp_kills 
          FROM PVP 
          WHERE krace IS NOT NULL 
          GROUP BY krace 
          ORDER BY pvp_kills DESC
        `);
        break;

      case 'pvp_by_class':
        results = await query(`
          SELECT kclass, COUNT(*) as pvp_kills 
          FROM PVP 
          WHERE kclass IS NOT NULL 
          GROUP BY kclass 
          ORDER BY pvp_kills DESC
        `);
        break;

      case 'level_distribution':
        results = await query(`
          SELECT vlevel, COUNT(*) as count 
          FROM MVP 
          WHERE vlevel IS NOT NULL 
          GROUP BY vlevel 
          ORDER BY vlevel
        `);
        break;

      default:
        // Overview stats
        const [mvpCount] = await query('SELECT COUNT(*) as count FROM MVP');
        const [pvpCount] = await query('SELECT COUNT(*) as count FROM PVP');
        const [uniqueKillers] = await query(
          'SELECT COUNT(DISTINCT killer) as count FROM MVP'
        );
        const [uniqueVictims] = await query(
          'SELECT COUNT(DISTINCT victim) as count FROM MVP'
        );

        results = {
          mvp_records: mvpCount.count,
          pvp_records: pvpCount.count,
          unique_killers: uniqueKillers.count,
          unique_victims: uniqueVictims.count,
        };
    }

    return NextResponse.json({
      success: true,
      data: results,
      type,
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
