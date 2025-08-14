import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'solace_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

/**
 * Database query function with error handling
 * 
 * Recommended database indexes for optimal performance:
 * - PVP table: INDEX(killer), INDEX(victim), INDEX(killer, victim), INDEX(id DESC)
 * - MVP table: INDEX(killer), INDEX(victim), INDEX(id DESC)
 * - Composite indexes for common query patterns
 */
export async function query(sql: string, params?: unknown[]) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function getConnection() {
  return await pool.getConnection();
}

export default pool;
