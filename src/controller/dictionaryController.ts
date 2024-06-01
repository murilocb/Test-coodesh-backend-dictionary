import { Request, Response } from 'express';
import { getWords, getWordDetails, addFavorite, removeFavorite } from '../services/dictionaryService';
import { setCache } from '../config/redisClient';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const getEntries = async (req: Request, res: Response) => {
  const { search = '', limit = 20, page = 1 } = req.query;

  try {
    const start = Date.now();
    const data = await getWords(search as string, Number(limit), Number(page));
    await setCache(req.originalUrl, JSON.stringify(data));
    const duration = Date.now() - start;
    res.set('x-response-time', `${duration}ms`);
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getEntryDetails = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { word } = req.params;

  try {
    const start = Date.now();
    const data = await getWordDetails(userId, word);
    await setCache(req.originalUrl, JSON.stringify(data));
    const duration = Date.now() - start;
    res.set('x-response-time', `${duration}ms`);
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const favoriteWord = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { word } = req.params;

  try {
    await addFavorite(userId, word);
    return res.status(200).send({ message: 'Word now is an favority.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const unfavoriteWord = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { word } = req.params;

  try {
    await removeFavorite(userId, word);
    return res.status(200).send({ message: 'Word now is not favority.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
