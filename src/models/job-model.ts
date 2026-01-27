import mongoose from 'mongoose';
import { IJob } from '../interfaces/job';
import User from './user-model';
import Article from './article-model';

const jobSchema = new mongoose.Schema<IJob>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: User,
      required: true,
      index: true,
    },
    articleId: {
      type: mongoose.Types.ObjectId,
      ref: Article,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
      default: 'PENDING',
    },
    wordCount: Number,
    attachmentCount: Number,
    error: String,
  },
  { timestamps: true },
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
