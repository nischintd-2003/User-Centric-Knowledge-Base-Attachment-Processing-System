import { Request, Response } from 'express';
import Collection from '../models/collection-model';

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
      message: 'Error while saving the user',
      error: JSON.stringify(error),
    });
  }
};

export const getUserCollection = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};

export const updateCollection = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};

export const deleteCollection = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
