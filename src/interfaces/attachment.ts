import mongoose from 'mongoose';

export interface IAttachment extends Document {
  userId: mongoose.Types.ObjectId;
  articleId: mongoose.Types.ObjectId;
  filename: string;
  mimeType: string;
  size: number;
  path: string;
  uploadedAt: Date;
}
