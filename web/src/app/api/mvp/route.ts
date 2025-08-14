import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';
    const killer = searchParams.get('killer');
    const victim = searchParams.get('victim');

    let sql = 'SELECT * FROM MVP';
    const params: any[] = [];

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
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('MVP API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch MVP data' },
      { status: 500 }
    );
  }
}
