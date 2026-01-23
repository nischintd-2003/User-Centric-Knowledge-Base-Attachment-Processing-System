import { Request, Response } from 'express';
import Collection from '../models/collection-model';
import { ObjectId } from 'mongodb';

interface IAuthRequest extends Request {
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
    res
      .status(200)
      .json({ message: 'Collection is created succefully', body: { Collection: savedCollection } });
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
      message: 'Collection is created succefully',
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
    let { collectionId } = req.params;
    const { name, description } = req.body;

    if (Array.isArray(collectionId)) {
      collectionId = collectionId[0];
    }

    const updatedCollection = await Collection.updateOne(
      { userId: userId, _id: new ObjectId(collectionId) },
      { $set: { name: name, description: description } },
    );

    res.status(200).json({
      message: 'Collection is updated succefully',
      body: { updatedCollection: updatedCollection },
    });

    if (userId) {
      throw new Error('User not authenticated');
    }
    const documentToUpdate = await Collection.findOne({});
  } catch (error) {}
};

export const deleteCollection = async (req: IAuthRequest, res: Response) => {
  try {
  } catch (error) {}
};
