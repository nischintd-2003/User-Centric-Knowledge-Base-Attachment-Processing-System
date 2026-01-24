import mongoose from 'mongoose';
import { IAttachment } from '../interfaces/attachment';
import User from './user-model';
import { ref } from 'node:process';
import Article from './article-model';

const attachmentSchema = new mongoose.Schema<IAttachment>(
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
    filename: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
);

const attachment = mongoose.model('Attachment', attachmentSchema);

export default attachment;
