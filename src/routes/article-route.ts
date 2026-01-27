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

articleRoute.post('/', authMiddleware, createArticle);
articleRoute.get('/', authMiddleware, getCollectionArticles);
articleRoute.get('/:articleId', authMiddleware, getArticleDetails);
articleRoute.put('/:articleId', authMiddleware, updateArticle);
articleRoute.delete('/:articleId', authMiddleware, deleteArticle);
articleRoute.use('/:articleId/attachments', attachmentRoutes);

export default articleRoute;
