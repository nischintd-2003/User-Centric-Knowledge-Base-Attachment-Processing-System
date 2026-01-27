import { Router } from 'express';
import authRoutes from './auth-route';
import collectionRoute from './collection-route';
import attachmentRoutes from './attachment-route';
import jobRouter from './job-route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/collections', collectionRoute);
router.use('/attachments', attachmentRoutes);
router.use('/articles/:articleId/jobs', jobRouter);

export default router;
