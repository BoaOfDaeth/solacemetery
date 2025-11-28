import { randomBytes } from 'crypto';
import { getRedisClient } from './redis';

const SESSION_PREFIX = 'session:';
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days in seconds

export interface SessionData {
  userId: string;
  discordId: string;
  username: string;
  avatar: string | null;
  isAdmin: boolean;
}

/**
 * Generate a secure random session token
 */
export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Create a new session in Redis
 */
export async function createSession(userData: SessionData): Promise<string> {
  const token = generateSessionToken();
  const redis = await getRedisClient();

  const sessionKey = `${SESSION_PREFIX}${token}`;
  const sessionValue = JSON.stringify({
    ...userData,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL * 1000,
  });

  await redis.setEx(sessionKey, SESSION_TTL, sessionValue);

  return token;
}

/**
 * Get session data from Redis
 */
export async function getSession(token: string): Promise<SessionData | null> {
  if (!token) {
    return null;
  }

  try {
    const redis = await getRedisClient();
    const sessionKey = `${SESSION_PREFIX}${token}`;
    const sessionData = await redis.get(sessionKey);

    if (!sessionData) {
      return null;
    }

    const parsed = JSON.parse(sessionData) as SessionData & {
      expiresAt: number;
    };

    // Check if session is expired
    if (parsed.expiresAt < Date.now()) {
      await deleteSession(token);
      return null;
    }

    return {
      userId: parsed.userId,
      discordId: parsed.discordId,
      username: parsed.username,
      avatar: parsed.avatar,
      isAdmin: parsed.isAdmin ?? false,
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Delete a session from Redis
 */
export async function deleteSession(token: string): Promise<void> {
  if (!token) {
    return;
  }

  try {
    const redis = await getRedisClient();
    const sessionKey = `${SESSION_PREFIX}${token}`;
    await redis.del(sessionKey);
  } catch (error) {
    console.error('Error deleting session:', error);
  }
}

/**
 * Refresh session expiration
 */
export async function refreshSession(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  try {
    const redis = await getRedisClient();
    const sessionKey = `${SESSION_PREFIX}${token}`;
    const exists = await redis.exists(sessionKey);

    if (exists) {
      await redis.expire(sessionKey, SESSION_TTL);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error refreshing session:', error);
    return false;
  }
}
