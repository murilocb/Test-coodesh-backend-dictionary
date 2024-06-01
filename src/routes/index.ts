import { Router, Request, Response } from 'express';
import fullstackRoutes from './fullstackChallenge';
import authRoutes from './auth';
import dictionaryRoutes from './dictionary';
import userRoutes from './user'

const router = Router();

router.use('/', fullstackRoutes)
router.use('/auth', authRoutes);
router.use('/entries/en', dictionaryRoutes);
router.use('/user', userRoutes);

router.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

export default router;