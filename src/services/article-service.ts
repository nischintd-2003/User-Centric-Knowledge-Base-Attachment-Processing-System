import fs from 'fs';
import path from 'path';
import { Worker } from 'worker_threads';
import { ObjectId } from 'mongodb';
import Article from '../models/article-model';
import Attachment from '../models/attachment-model';
import Job from '../models/job-model';
import { AppError } from '../utils/app-error';

const spawnArticleWorker = (jobId: string, articleId: string) => {
  const workerPath = path.join(process.cwd(), 'dist', 'workers', 'article-worker.js');

  new Worker(workerPath, {
    workerData: { jobId, articleId },
  });
};

export const createArticleService = async (
  userId: ObjectId,
  collectionId: string,
  title: string,
  content: string,
) => {
  const article = await Article.create({
    title,
    content,
    userId,
    collectionId,
  });

  const job = await Job.create({
    userId,
    articleId: article._id,
    status: 'PENDING',
  });

  spawnArticleWorker(job._id.toString(), article._id.toString());

  return article;
};

export const getCollectionArticlesService = async (userId: ObjectId, collectionId: string) => {
  return Article.find({ userId, collectionId }).sort({ createdAt: -1 });
};

export const getArticleDetailsService = async (articleId: string) => {
  const article = await Article.findById(articleId);

  if (!article) {
    throw new AppError('Article not found', 404);
  }

  return article;
};

export const updateArticleService = async (
  userId: ObjectId,
  articleId: string,
  title?: string,
  content?: string,
) => {
  const updatePayload: { title?: string; content?: string } = {};

  if (title !== undefined) updatePayload.title = title;
  if (content !== undefined) updatePayload.content = content;

  const article = await Article.findOneAndUpdate({ _id: articleId, userId }, updatePayload, {
    new: true,
  });

  if (!article) {
    throw new AppError('Article not found', 404);
  }

  const job = await Job.create({
    userId,
    articleId,
    status: 'PENDING',
  });

  spawnArticleWorker(job._id.toString(), articleId);

  return article;
};

export const deleteArticleService = async (
  userId: ObjectId,
  collectionId: string,
  articleId: string,
) => {
  const article = await Article.findOne({ _id: articleId, collectionId, userId });

  if (!article) {
    throw new AppError('Article not found', 404);
  }

  const attachments = await Attachment.find({ articleId, userId });

  for (const attachment of attachments) {
    if (fs.existsSync(attachment.path)) {
      fs.unlinkSync(attachment.path);
    }
  }

  await Attachment.deleteMany({ articleId, userId });
  await article.deleteOne();

  return article;
};

export const getJobStatusService = async (userId: ObjectId, articleId: string, jobId: string) => {
  const job = await Job.findOne({ _id: jobId, articleId, userId });

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  return job;
};
