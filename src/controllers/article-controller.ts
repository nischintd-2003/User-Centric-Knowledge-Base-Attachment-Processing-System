import { NextFunction, Response } from 'express';
import Article from '../models/article-model';
import { IAuthRequest } from './collection-controller';
import fs from 'fs';
import Attachment from '../models/attachment-model';
import Job from '../models/job-model';
import { Worker } from 'worker_threads';
import path from 'path';

const getCollectionId = (req: IAuthRequest) => {
  let { collectionId } = req.params;
  if (Array.isArray(collectionId)) {
    collectionId = collectionId[0];
  }
  if (!collectionId) {
    throw new Error('Collection ID is required');
  }
  return collectionId;
};

const getArticleId = (req: IAuthRequest) => {
  let { articleId } = req.params;
  if (Array.isArray(articleId)) {
    articleId = articleId[0];
  }
  if (!articleId) {
    throw new Error('Article ID is required');
  }
  return articleId;
};

export const createArticle = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const collectionId = getCollectionId(req);
    const { title, content } = req.body;

    const _article = new Article({
      title,
      content,
      userId,
      collectionId,
    });

    const savedArticle = await _article.save();

    const job = await Job.create({
      userId,
      articleId: _article._id,
      status: 'PENDING',
    });

    const workerPath = path.join(process.cwd(), 'dist', 'workers', 'article-worker.js');

    new Worker(workerPath, {
      workerData: {
        jobId: job._id.toString(),
        articleId: _article._id.toString(),
      },
    });

    res
      .status(200)
      .json({ message: 'Article is created succefully', body: { Article: savedArticle } });
  } catch (error) {
    res.status(400).json({
      message: 'Error while saving the article',
      error: JSON.stringify(error),
    });
  }
};

export const getCollectionArticles = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const collectionId = getCollectionId(req);

    const articles = await Article.find({
      userId: userId,
      collectionId: collectionId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Articles fetched successfully',
      body: { Articles: articles },
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error while fetching the article',
      error: JSON.stringify(error),
    });
  }
};

export const getArticleDetails = async (req: IAuthRequest, res: Response) => {
  try {
    const articleId = getArticleId(req);

    const foundArticle = await Article.findOne({
      _id: articleId,
    });

    res.status(200).json({
      message: 'Article  details fetched successfully',
      body: { Article: foundArticle },
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error while fetching the article',
      error: JSON.stringify(error),
    });
  }
};

export const updateArticle = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const articleId = getArticleId(req);
    const { title, content } = req.body;
    const updatedArticle = await Article.updateOne(
      { _id: articleId },
      { $set: { title: title, content: content } },
    );

    const job = await Job.create({
      userId,
      articleId,
      status: 'PENDING',
    });

    const workerPath = path.join(process.cwd(), 'dist', 'workers', 'article-worker.js');

    new Worker(workerPath, {
      workerData: {
        jobId: job._id.toString(),
        articleId,
      },
    });

    res.status(200).json({
      message: 'Article updated successfully',
      body: { updatedArticle: updatedArticle },
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error while updating the article',
      error: JSON.stringify(error),
    });
  }
};

export const deleteArticle = async (req: IAuthRequest, res: Response) => {
  try {
    const collectionId = getCollectionId(req);
    const articleId = getArticleId(req);
    const userId = req.user._id;

    if (!userId || typeof articleId !== 'string') {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const article = await Article.findOne({
      _id: articleId,
      collectionId,
      userId,
    });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const attachments = await Attachment.find({ articleId, userId });

    for (const attachment of attachments) {
      if (fs.existsSync(attachment.path)) {
        fs.unlinkSync(attachment.path);
      }
    }

    await Attachment.deleteMany({ articleId, userId });

    await article.deleteOne();

    res.status(200).json({
      message: 'Article deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error while deleting the article',
      error: JSON.stringify(error),
    });
  }
};

export const getJobStatus = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const { articleId, jobId } = req.params;
    const userId = req.user._id;

    if (!userId || typeof articleId !== 'string' || typeof jobId !== 'string') {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const job = await Job.findOne({
      _id: jobId,
      articleId,
      userId,
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    next(err);
  }
};
