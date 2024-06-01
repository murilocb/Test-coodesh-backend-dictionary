import express, { Router } from 'express';
import { getEntries, getEntryDetails, favoriteWord, unfavoriteWord } from '../controller/dictionaryController';
import auth from '../middleware/auth';
import { checkCache, clearCache } from '../middleware/cache';

const router: Router = express.Router();

router.get('/', auth, checkCache, getEntries);
router.get('/:word', auth, checkCache, getEntryDetails);
router.post('/:word/favorite', auth, clearCache, favoriteWord);
router.delete('/:word/unfavorite', auth, clearCache, unfavoriteWord);

export default router;
