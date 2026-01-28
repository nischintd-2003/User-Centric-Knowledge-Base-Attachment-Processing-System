import mongoose from 'mongoose';
import { IArticle } from '../interfaces/article';
import User from './user-model';
import Collection from './collection-model';

const articleSchema = new mongoose.Schema<IArticle>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: User,
      required: true,
      index: true,
    },
    collectionId: {
      type: mongoose.Types.ObjectId,
      ref: Collection,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

articleSchema.index({ userId: 1, collectionId: 1, title: 1 }, { unique: true });

const Article = mongoose.model('Article', articleSchema);

export default Article;
