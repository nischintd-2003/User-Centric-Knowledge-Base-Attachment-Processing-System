import { Router } from 'express';
import {
  createArticle,
  deleteArticle,
  getArticleDetails,
  getCollectionArticles,
  updateArticle,
} from '../controllers/article-controller';
import { authMiddleware } from '../middleware/auth-middleware';
import attachmentRoutes from './attachment-route';

const articleRoute = Router({ mergeParams: true });

/**
 * @swagger
 * /api/collections/{:collectionId}/articles:
 *   post:
 *     summary: Create a article for a collection
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title,content]
 *             properties:
 *               name:
 *                 type: string
 *               content:
 *                 type:string
 *     responses:
 *       200:
 *         description: Article created
 */
articleRoute.post('/', authMiddleware, createArticle);
/**
 * @swagger
 * /api/collections/{:collectionId}/articles:
 *   get:
 *     summary: Get a collection articles
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: collectionId
 *         in: path
 *     responses:
 *       200:
 *         description: List of articles
 */
articleRoute.get('/', authMiddleware, getCollectionArticles);
/**
 * @swagger
 * /api/collections/{:collectionId}/articles/{:articleId}:
 *   get:
 *     summary: Get details of an article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *       - in: path
 *         name: articleId
 *     responses:
 *       200:
 *         description: Details of a article
 */
articleRoute.get('/:articleId', authMiddleware, getArticleDetails);
/**
 * @swagger
 * /api/collections/{:collectionId}/articles/{:articleId}:
 *   put:
 *     summary: Update a article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *       - in: path
 *         name: articleId
 *     responses:
 *       200:
 *         description: Update a article
 */
articleRoute.put('/:articleId', authMiddleware, updateArticle);
/**
 * @swagger
 * /api/collections/{:collectionId}/articles/{:articleId}:
 *   delete:
 *     summary: Delete a article
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *       - in: path
 *         name: articleId
 *     responses:
 *       200:
 *         description: Article will be deleted along with it's attachment
 */
articleRoute.delete('/:articleId', authMiddleware, deleteArticle);
articleRoute.use('/:articleId/attachments', attachmentRoutes);

export default articleRoute;
