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
      console.warn('DATABASE_URL not set - using local development defaults');
      // For local development, create a default connection string
      const defaultUrl = 'mysql://solacemetry_user:rootpassword@localhost:3306/solace_db';
      console.log('Using default local connection:', defaultUrl);
      pool = mysql.createPool(defaultUrl);
    }
  } else {
    console.log('Using DATABASE_URL connection string');
    console.log('Database URL format:', DATABASE_URL.substring(0, 20) + '...');
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
    console.error('Database query error:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
}

export async function getConnection() {
  const connectionPool = createPool();
  try {
    const connection = await connectionPool.getConnection();
    console.log('Database connection successful');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

export default function getPool() {
  return createPool();
}
