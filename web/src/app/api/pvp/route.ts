import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';
    const killer = searchParams.get('killer');
    const victim = searchParams.get('victim');
    const krace = searchParams.get('krace');
    const kclass = searchParams.get('kclass');

    let sql = 'SELECT * FROM PVP';
    const params: unknown[] = [];

    // Build WHERE clause if filters are provided
    const conditions: string[] = [];
    if (killer) {
      conditions.push('killer LIKE ?');
      params.push(`%${killer}%`);
    }
    if (victim) {
      conditions.push('victim LIKE ?');
      params.push(`%${victim}%`);
    }
    if (krace) {
      conditions.push('krace LIKE ?');
      params.push(`%${krace}%`);
    }
    if (kclass) {
      conditions.push('kclass LIKE ?');
      params.push(`%${kclass}%`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ` ORDER BY id DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

    const results = await query(sql, params);

    return NextResponse.json({ 
      success: true, 
      data: results,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('PVP API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch PVP data' },
      { status: 500 }
    );
  }
}
