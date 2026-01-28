import { Response, NextFunction } from 'express';
import { IAuthRequest } from './collection-controller';
import {
  createArticleService,
  deleteArticleService,
  getArticleDetailsService,
  getCollectionArticlesService,
  getJobStatusService,
  updateArticleService,
} from '../services/article-service';
import { AppError } from '../utils/app-error';
import { getParamAsString } from '../utils/request-utils';

export const createArticle = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const collectionId = getParamAsString(req.params.collectionId, 'collectionId');
    const { title, content } = req.body;

    const article = await createArticleService(req.user._id, collectionId, title, content);

    res.status(201).json({
      message: 'Article created successfully',
      body: { article },
    });
  } catch (error) {
    next(error);
  }
};

export const getCollectionArticles = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const collectionId = getParamAsString(req.params.collectionId, 'collectionId');

    const articles = await getCollectionArticlesService(req.user._id, collectionId);

    res.status(200).json({
      message: 'Articles fetched successfully',
      body: { articles },
    });
  } catch (error) {
    next(error);
  }
};

export const getArticleDetails = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const articleId = getParamAsString(req.params.articleId, 'articleId');

    const article = await getArticleDetailsService(articleId);

    res.status(200).json({
      message: 'Article details fetched successfully',
      body: { article },
    });
  } catch (error) {
    next(error);
  }
};

export const updateArticle = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const articleId = getParamAsString(req.params.articleId, 'articleId');
    const { title, content } = req.body;

    const article = await updateArticleService(req.user._id, articleId, title, content);

    res.status(200).json({
      message: 'Article updated successfully',
      body: { article },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteArticle = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const collectionId = getParamAsString(req.params.collectionId, 'collectionId');
    const articleId = getParamAsString(req.params.articleId, 'articleId');

    await deleteArticleService(req.user._id, collectionId, articleId);

    res.status(200).json({
      message: 'Article deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getJobStatus = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const articleId = getParamAsString(req.params.articleId, 'articleId');
    const jobId = getParamAsString(req.params.jobId, 'jobId');

    const job = await getJobStatusService(req.user._id, articleId, jobId);

    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};
