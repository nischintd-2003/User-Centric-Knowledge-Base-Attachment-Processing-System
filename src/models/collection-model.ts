import mongoose from 'mongoose';
import { ICollection } from '../interfaces/collection';
import User from './user-model';

const collectionSchema = new mongoose.Schema<ICollection>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 500,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: User,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

collectionSchema.index({ userId: 1, name: 1 }, { unique: true });

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
