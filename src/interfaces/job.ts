import mongoose from 'mongoose';

export interface IJob extends Document {
  userId: mongoose.Types.ObjectId;
  articleId: mongoose.Types.ObjectId;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  wordCount?: number;
  attachmentCount?: number;
  error?: string;
}
