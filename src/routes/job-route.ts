import { Router } from 'express';
import { authMiddleware } from '../middleware/auth-middleware';
import { getJobStatus } from '../controllers/article-controller';

const jobRouter = Router({ mergeParams: true });

/**
 * @swagger
 * /api/articles/{:articleId}/jobs/{:jobId}:
 *   get:
 *     summary: Fetch the status of the job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: articleId
 *       - in: path
 *         name: jobId
 *     responses:
 *       200:
 *         description: Know the ongoing status of the job
 */
jobRouter.get('/:jobId', authMiddleware, getJobStatus);

export default jobRouter;
