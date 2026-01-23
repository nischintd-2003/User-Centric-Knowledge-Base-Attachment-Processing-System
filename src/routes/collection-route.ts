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

collectionRoute.post('/', authMiddleware, createCollection);
collectionRoute.get('/', authMiddleware, getUserCollection);
collectionRoute.put('/:collectionId', authMiddleware, updateCollection);
collectionRoute.delete('/:collectionId', authMiddleware, deleteCollection);
collectionRoute.use('/:collectionId/articles', articleRoute);

export default collectionRoute;
