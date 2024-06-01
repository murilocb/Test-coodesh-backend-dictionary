import { createClient } from 'redis';
import { envs } from '../env';

const redisClient = createClient({
  url: envs.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Failed to connect to Redis', error);
  }
};

const getCache = async (key: string): Promise<string | null> => {
  try {
    const value = await redisClient.get(key);
    return value;
  } catch (error) {
    console.error('Error getting cache', error);
    return null;
  }
};

const setCache = async (key: string, value: string, expireInSeconds: number = 3600): Promise<void> => {
  try {
    await redisClient.set(key, value, { EX: expireInSeconds });
  } catch (error) {
    console.error('Error setting cache', error);
  }
};

export { connectRedis, getCache, setCache };
