import { ObjectId } from 'mongodb';
import fs from 'fs';
import Collection from '../models/collection-model';
import Article from '../models/article-model';
import Attachment from '../models/attachment-model';
import { AppError } from '../utils/app-error';

export const createCollectionService = async (
  userId: ObjectId,
  name: string,
  description?: string,
) => {
  const payload: {
    name: string;
    userId: ObjectId;
    description?: string;
  } = {
    name,
    userId,
  };

  if (description !== undefined) {
    payload.description = description;
  }

  return Collection.create(payload);
};

export const getUserCollectionsService = async (userId: ObjectId) => {
  return Collection.find({ userId }).sort({ createdAt: -1 });
};

export const updateCollectionService = async (
  userId: ObjectId,
  collectionId: string,
  name?: string,
  description?: string,
) => {
  const updated = await Collection.findOneAndUpdate(
    { _id: collectionId, userId },
    { name, description },
    { new: true },
  );

  if (!updated) {
    throw new AppError('Collection not found', 404);
  }

  return updated;
};

export const deleteCollectionService = async (userId: ObjectId, collectionId: string) => {
  const collection = await Collection.findOne({ _id: collectionId, userId });

  if (!collection) {
    throw new AppError('Collection not found', 404);
  }

  const articles = await Article.find({ collectionId, userId });
  const articleIds = articles.map((a) => a._id);

  const attachments = await Attachment.find({
    articleId: { $in: articleIds },
    userId,
  });

  for (const attachment of attachments) {
    if (fs.existsSync(attachment.path)) {
      fs.unlinkSync(attachment.path);
    }
  }

  await Attachment.deleteMany({ articleId: { $in: articleIds }, userId });
  await Article.deleteMany({ collectionId, userId });
  await collection.deleteOne();

  return collection;
};
