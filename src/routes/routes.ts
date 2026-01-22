import { Router } from 'express';
import authRoutes from './auth-route';
import collectionRoute from './collection-route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/collections', collectionRoute);

export default router;
