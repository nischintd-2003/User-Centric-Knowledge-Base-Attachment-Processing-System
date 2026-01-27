import { Router } from 'express';
import {
  createCollection,
  deleteCollection,
  getUserCollection,
  updateCollection,
} from '../controllers/collection-controller';
import { authMiddleware } from '../middleware/auth-middleware';
import articleRoute from './article-route';

const collectionRoute = Router();

/**
 * @swagger
 * /api/collections:
 *   post:
 *     summary: Create a collection
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Collection created
 */
collectionRoute.post('/', authMiddleware, createCollection);
/**
 * @swagger
 * /api/collections:
 *   get:
 *     summary: Get user collections
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of collections
 */
collectionRoute.get('/', authMiddleware, getUserCollection);
/**
 * @swagger
 * /api/collections:
 *   put:
 *     summary: Update a specific collection
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Update a collection
 */
collectionRoute.put('/:collectionId', authMiddleware, updateCollection);
/**
 * @swagger
 * /api/collections:
 *   delete:
 *     summary: Delete a collection
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A collection will be deleted along with it's articles and attachments
 */
collectionRoute.delete('/:collectionId', authMiddleware, deleteCollection);
collectionRoute.use('/:collectionId/articles', articleRoute);

export default collectionRoute;
