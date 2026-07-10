import { Router } from 'express';
import authRoutes from './authRoutes';
import schoolRoutes from './schoolRoutes';
import userRoutes from './userRoutes';
import studentRoutes from './studentRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/schools', schoolRoutes);
router.use('/users', userRoutes);
router.use('/students', studentRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default router;
