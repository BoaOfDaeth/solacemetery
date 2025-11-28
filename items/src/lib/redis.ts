import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

export async function connectRedis() {
  if (redisClient) {
    return redisClient;
  }

  try {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';

    redisClient = createClient({
      url,
    });

    redisClient.on('error', err => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Connected to Redis');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }
}

export async function getRedisClient() {
  if (!redisClient) {
    await connectRedis();
  }
  return redisClient!;
}

export async function disconnectRedis() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}
