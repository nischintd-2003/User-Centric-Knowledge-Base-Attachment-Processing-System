import { Request, Response } from 'express';
import Collection from '../models/collection-model';
import { ObjectId } from 'mongodb';
import Article from '../models/article-model';
import Attachment from '../models/attachment-model';
import fs from 'fs';

export interface IAuthRequest extends Request {
  user?: any;
}

export const createCollection = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const { name, description } = req.body;

    const _collection = new Collection({
      name,
      description,
      userId,
    });

    const savedCollection = await _collection.save();
    res.status(200).json({
      message: 'Collection is created successfully',
      body: { Collection: savedCollection },
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error while saving the collection',
      error: JSON.stringify(error),
    });
  }
};

export const getUserCollection = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const userCollections = await Collection.find({ userId: userId }).sort({ createdAt: -1 });
    res.status(200).json({
      message: 'Collections are fetched successfully',
      body: { userCollection: userCollections },
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error while fetching the collection',
      error: JSON.stringify(error),
    });
  }
};

export const updateCollection = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    let { collectionId } = req.params;
    const { name, description } = req.body;

    if (Array.isArray(collectionId)) {
      collectionId = collectionId[0];
    }

    const updatedCollection = await Collection.updateOne(
      { userId: userId, _id: new ObjectId(collectionId) },
      { $set: { name: name, description: description } },
    );

    if (!updatedCollection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.status(200).json({
      message: 'Collection is updated successfully',
      body: { updatedCollection: updatedCollection },
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error : no documents found',
      error: JSON.stringify(error),
    });
  }
};

export const deleteCollection = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    let { collectionId } = req.params;

    if (Array.isArray(collectionId)) {
      collectionId = collectionId[0];
    }

    if (!collectionId) {
      throw new Error('Collection ID is required');
    }

    const collection = await Collection.findOne({
      _id: collectionId,
      userId,
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    const articles = await Article.find({
      collectionId,
      userId,
    });

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

    await Attachment.deleteMany({
      articleId: { $in: articleIds },
      userId,
    });

    await Article.deleteMany({
      collectionId,
      userId,
    });

    await collection.deleteOne();

    res.status(200).json({
      message: 'Collection is deleted successfully',
      body: { deletedCollection: collection },
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error : No documents found',
      error: JSON.stringify(error),
    });
  }
};
