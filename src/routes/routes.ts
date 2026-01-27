import { Router } from 'express';
import authRoutes from './auth-route';
import collectionRoute from './collection-route';
import attachmentRoutes from './attachment-route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/collections', collectionRoute);
router.use('/attachments', attachmentRoutes);

export default router;
