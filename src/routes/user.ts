import express, { Router } from 'express';
import { getProfile, getHistory, getFavorites } from '../controller/userController';
import auth from '../middleware/auth';
import { checkCache } from '../middleware/cache';

const router: Router = express.Router();

router.get('/me', auth, checkCache, getProfile);
router.get('/me/history', auth, checkCache, getHistory);
router.get('/me/favorites', auth, checkCache, getFavorites);

export default router;
