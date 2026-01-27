import { Router } from 'express';
import { authMiddleware } from '../middleware/auth-middleware';
import { getJobStatus } from '../controllers/article-controller';

const jobRouter = Router({ mergeParams: true });

jobRouter.get('/:jobId', authMiddleware, getJobStatus);

export default jobRouter;
