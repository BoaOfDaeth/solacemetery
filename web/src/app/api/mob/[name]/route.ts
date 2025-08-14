import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'solacemetry_user',
  password: process.env.DB_PASSWORD || 'solacemetry_password',
  database: process.env.DB_NAME || 'solace_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  acquireTimeout: 10000,
  timeout: 10000,
  charset: 'utf8mb4',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const monsterName = decodeURIComponent(name);

    if (!monsterName) {
      return NextResponse.json(
        { error: 'Monster name is required' },
        { status: 400 }
      );
    }

    // Create database connection
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Get all kills by this monster
      const [kills] = await connection.execute(
        `SELECT id, killer, victim, vlevel FROM MVP WHERE killer = ? ORDER BY id DESC`,
        [monsterName]
      );

      // Calculate statistics
      const totalKills = (kills as any[]).length;

      // Get unique victims count
      const [uniqueVictimsResult] = await connection.execute(
        `SELECT COUNT(DISTINCT victim) as unique_victims FROM MVP WHERE killer = ?`,
        [monsterName]
      );
      const uniqueVictims =
        (uniqueVictimsResult as any[])[0]?.unique_victims || 0;

      // Get average victim level
      const [avgLevelResult] = await connection.execute(
        `SELECT AVG(vlevel) as avg_level FROM MVP WHERE killer = ? AND vlevel IS NOT NULL`,
        [monsterName]
      );
      const avgLevel = (avgLevelResult as any[])[0]?.avg_level || 0;

      const response = {
        monster: monsterName,
        statistics: {
          totalKills,
          uniqueVictims,
          avgLevel: Math.round(avgLevel * 100) / 100, // Round to 2 decimal places
        },
        kills: kills,
      };

      return NextResponse.json(response);
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error fetching mob data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mob data' },
      { status: 500 }
    );
  }
}
