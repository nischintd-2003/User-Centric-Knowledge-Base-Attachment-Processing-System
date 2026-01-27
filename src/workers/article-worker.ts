import { parentPort, workerData } from 'worker_threads';
import mongoose from 'mongoose';
import Article from '../models/article-model';
import Attachment from '../models/attachment-model';
import Job from '../models/job-model';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

const articleWorker = async () => {
  const { jobId, articleId } = workerData;

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('Mongo db url is not defined');
    }

    await mongoose.connect(process.env.MONGODB_URI!);

    await Job.findByIdAndUpdate(jobId, {
      status: 'PROCESSING',
    });

    const article = await Article.findById(articleId);
    if (!article) {
      throw new Error('Article not found');
    }

    const wordCount = article.content ? article.content.trim().split(/\s+/).length : 0;

    const attachmentCount = await Attachment.countDocuments({
      articleId,
    });

    await Job.findByIdAndUpdate(jobId, {
      status: 'COMPLETED',
      wordCount,
      attachmentCount,
    });

    parentPort?.postMessage({ success: true });
  } catch (error: any) {
    await Job.findByIdAndUpdate(workerData.jobId, {
      status: 'FAILED',
      error: error.message,
    });

    parentPort?.postMessage({ success: false });
  } finally {
    await mongoose.disconnect();
  }
};

articleWorker();
