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
    const characterName = decodeURIComponent(name);

    if (!characterName) {
      return NextResponse.json(
        { error: 'Character name is required' },
        { status: 400 }
      );
    }

    // Create database connection
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Get MVP appearances (as killer) - exclude self-kills
      const [mvpKills] = await connection.execute(
        `SELECT id, killer, victim, vlevel, 'killer' as role FROM MVP WHERE killer = ? AND killer != victim`,
        [characterName]
      );

      // Get MVP appearances (as victim) - exclude self-kills
      const [mvpDeaths] = await connection.execute(
        `SELECT id, killer, victim, vlevel, 'victim' as role FROM MVP WHERE victim = ? AND killer != victim`,
        [characterName]
      );

      // Get PVP appearances (as killer) - exclude self-kills
      const [pvpKills] = await connection.execute(
        `SELECT id, killer, victim, klevel, vlevel, krace, kclass, 'killer' as role FROM PVP WHERE killer = ? AND killer != victim`,
        [characterName]
      );

      // Get PVP appearances (as victim) - exclude self-kills
      const [pvpDeaths] = await connection.execute(
        `SELECT id, killer, victim, klevel, vlevel, krace, kclass, 'victim' as role FROM PVP WHERE victim = ? AND killer != victim`,
        [characterName]
      );

      // Calculate statistics
      const totalMvpKills = (mvpKills as any[]).length;
      const totalMvpDeaths = (mvpDeaths as any[]).length;
      const totalPvpKills = (pvpKills as any[]).length;
      const totalPvpDeaths = (pvpDeaths as any[]).length;

      const response = {
        character: characterName,
        statistics: {
          mvp: {
            kills: totalMvpKills,
            deaths: totalMvpDeaths,
            total: totalMvpKills + totalMvpDeaths,
          },
          pvp: {
            kills: totalPvpKills,
            deaths: totalPvpDeaths,
            total: totalPvpKills + totalPvpDeaths,
          },
          total:
            totalMvpKills + totalMvpDeaths + totalPvpKills + totalPvpDeaths,
        },
        appearances: {
          mvp: {
            kills: mvpKills,
            deaths: mvpDeaths,
          },
          pvp: {
            kills: pvpKills,
            deaths: pvpDeaths,
          },
        },
      };

      return NextResponse.json(response);
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error fetching character data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch character data' },
      { status: 500 }
    );
  }
}
