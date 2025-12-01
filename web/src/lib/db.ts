import mysql from 'mysql2/promise';
import crypto from 'crypto';
import { getRedisClient } from './redis';

// Use connection string only
const DATABASE_URL = process.env.DATABASE_URL;

// Redis cache TTL: 3 minutes (180 seconds)
const CACHE_TTL_SECONDS = 180;

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
 * Generate a cache key from SQL query and parameters
 */
function generateCacheKey(sql: string, params?: unknown[]): string {
  // Normalize SQL: remove extra whitespace and convert to lowercase
  const normalizedSQL = sql.replace(/\s+/g, ' ').trim().toLowerCase();
  
  // Create hash of SQL + params
  const paramsString = params ? JSON.stringify(params) : '';
  const keyString = `${normalizedSQL}:${paramsString}`;
  
  // Generate SHA256 hash for consistent key length
  const hash = crypto.createHash('sha256').update(keyString).digest('hex');
  
  return `mysql:query:${hash}`;
}

/**
 * Database query function with Redis caching and error handling
 * 
 * All queries are cached in Redis with a 3-minute TTL to reduce MySQL load
 * and protect against DDoS attacks.
 * 
 * Recommended database indexes for optimal performance:
 * - PVP table: INDEX(killer), INDEX(victim), INDEX(killer, victim), INDEX(id DESC)
 * - MVP table: INDEX(killer), INDEX(victim), INDEX(id DESC)
 * - Composite indexes for common query patterns
 */
export async function query(sql: string, params?: unknown[]) {
  const cacheKey = generateCacheKey(sql, params);
  
  // Try to get from Redis cache first
  try {
    const redis = await getRedisClient();
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    // If Redis fails, log error but continue to MySQL query
    console.error('Redis cache error (falling back to MySQL):', error);
  }
  
  // Query MySQL
  const connectionPool = createPool();
  try {
    const [results] = await connectionPool.execute(sql, params);
    
    // Cache the results in Redis
    try {
      const redis = await getRedisClient();
      await redis.setEx(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(results));
    } catch (error) {
      // If caching fails, log but don't fail the query
      console.error('Failed to cache query result:', error);
    }
    
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
