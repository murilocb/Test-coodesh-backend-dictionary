import { Request, Response } from 'express';
import { getUserProfile, getUserHistory, getUserFavorites } from '../services/userService';
import { setCache } from '../config/redisClient';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  try {
    const start = Date.now();
    const user = await getUserProfile(userId);
    await setCache(req.originalUrl, JSON.stringify(user));
    const duration = Date.now() - start;
    res.set('x-response-time', `${duration}ms`);
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getHistory = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { limit = 10, page = 1 } = req.query;

  try {
    const start = Date.now();
    const data = await getUserHistory(userId, Number(limit), Number(page));
    await setCache(req.originalUrl, JSON.stringify(data));
    const duration = Date.now() - start;
    res.set('x-response-time', `${duration}ms`);
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getFavorites = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { limit = 10, page = 1 } = req.query;

  try {
    const start = Date.now();
    const data = await getUserFavorites(userId, Number(limit), Number(page));
    await setCache(req.originalUrl, JSON.stringify(data));
    const duration = Date.now() - start;
    res.set('x-response-time', `${duration}ms`);
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
