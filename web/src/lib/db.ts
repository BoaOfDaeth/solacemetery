import mysql from 'mysql2/promise';

// Use connection string only
const DATABASE_URL = process.env.DATABASE_URL;

let pool: mysql.Pool | null = null;

function createPool(): mysql.Pool {
  if (pool) {
    return pool;
  }

  if (!DATABASE_URL) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('DATABASE_URL environment variable is required in production');
    } else {
      // For local development, create a default connection string
      const defaultUrl = 'mysql://solacemetry_user:rootpassword@localhost:3306/solace_db';
      pool = mysql.createPool(defaultUrl);
    }
  } else {
    pool = mysql.createPool(DATABASE_URL);
  }

  return pool;
}

/**
 * Database query function with error handling
 * 
 * Recommended database indexes for optimal performance:
 * - PVP table: INDEX(killer), INDEX(victim), INDEX(killer, victim), INDEX(id DESC)
 * - MVP table: INDEX(killer), INDEX(victim), INDEX(id DESC)
 * - Composite indexes for common query patterns
 */
export async function query(sql: string, params?: unknown[]) {
  const connectionPool = createPool();
  try {
    const [results] = await connectionPool.execute(sql, params);
    return results;
  } catch (error) {
    throw error;
  }
}

export async function getConnection() {
  const connectionPool = createPool();
  try {
    const connection = await connectionPool.getConnection();
    return connection;
  } catch (error) {
    throw error;
  }
}

export default function getPool() {
  return createPool();
}
