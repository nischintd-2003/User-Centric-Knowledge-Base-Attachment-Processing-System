import mongoose from 'mongoose';

export interface IArticle extends Document {
  title: string;
  content: number;
  userId: mongoose.Types.ObjectId;
  collectionId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
