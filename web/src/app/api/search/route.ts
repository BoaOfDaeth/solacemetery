import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || q.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    const searchTerm = `%${q.trim()}%`;

    // Search for characters in MVP victims
    const mvpResults = await query(
      `SELECT DISTINCT victim as character_name, 'mvp_victim' as source FROM MVP WHERE victim LIKE ?`,
      [searchTerm]
    );

    // Search for characters in PVP killers
    const pvpKillerResults = await query(
      `SELECT DISTINCT killer as character_name, 'pvp_killer' as source FROM PVP WHERE killer LIKE ? AND killer != victim`,
      [searchTerm]
    );

    // Search for characters in PVP victims
    const pvpVictimResults = await query(
      `SELECT DISTINCT victim as character_name, 'pvp_victim' as source FROM PVP WHERE victim LIKE ? AND killer != victim`,
      [searchTerm]
    );

    // Combine and deduplicate results
    const allResults = [
      ...(mvpResults as any[]),
      ...(pvpKillerResults as any[]),
      ...(pvpVictimResults as any[]),
    ];

    // Remove duplicates based on character_name
    const uniqueCharacters = allResults.reduce((acc, current) => {
      const x = acc.find(
        (item: any) => item.character_name === current.character_name
      );
      if (!x) {
        return acc.concat([current]);
      } else {
        // If character exists, merge sources
        if (!x.source.includes(current.source)) {
          x.source = `${x.source},${current.source}`;
        }
        return acc;
      }
    }, [] as any[]);

    // Sort alphabetically
    uniqueCharacters.sort((a: any, b: any) =>
      a.character_name.localeCompare(b.character_name)
    );

    return NextResponse.json({
      success: true,
      data: {
        query: q.trim(),
        results: uniqueCharacters,
        total: uniqueCharacters.length,
      },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}
