import { Request, Response, NextFunction } from 'express';
import { getCache, setCache } from '../config/redisClient';

export const checkCache = async (req: Request, res: Response, next: NextFunction) => {
  const key = req.originalUrl;

  try {
    const cachedData = await getCache(key);
    if (cachedData) {
      res.set('x-cache', 'HIT');
      res.set('x-response-time', '0ms');
      return res.status(200).json(JSON.parse(cachedData));
    }
    res.set('x-cache', 'MISS');
    return next();
  } catch (error) {
    console.error('Error checking cache', error);
    return next();
  }
};

export const clearCache = async (req: Request, res: Response, next: NextFunction) => {
  const key = req.originalUrl;

  try {
    await setCache(key, '', -1);
    console.log('Cache cleared');
    return next();
  } catch (error) {
    console.error('Error clearing cache', error);
    return next();
  }
};
