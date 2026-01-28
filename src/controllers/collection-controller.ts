import { Request, Response, NextFunction } from 'express';
import {
  createCollectionService,
  deleteCollectionService,
  getUserCollectionsService,
  updateCollectionService,
} from '../services/collection-service';
import { AppError } from '../utils/app-error';

export interface IAuthRequest extends Request {
  user?: any;
}

const getParamAsString = (param: string | string[] | undefined, name: string): string => {
  if (param === undefined) {
    throw new AppError(`${name} is required`, 400);
  }

  if (Array.isArray(param)) {
    const value = param[0];

    if (value === undefined) {
      throw new AppError(`${name} is required`, 400);
    }

    return value;
  }

  return param;
};

export const createCollection = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { name, description } = req.body;

    const collection = await createCollectionService(req.user._id, name, description);

    res.status(201).json({
      message: 'Collection created successfully',
      body: { collection },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserCollection = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const collections = await getUserCollectionsService(req.user._id);

    res.status(200).json({
      message: 'Collections fetched successfully',
      body: { collections },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCollection = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const collectionId = getParamAsString(req.params.collectionId, 'collectionId');
    const { name, description } = req.body;

    const collection = await updateCollectionService(req.user._id, collectionId, name, description);

    res.status(200).json({
      message: 'Collection updated successfully',
      body: { collection },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCollection = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const collectionId = getParamAsString(req.params.collectionId, 'collectionId');

    const deletedCollection = await deleteCollectionService(req.user._id, collectionId);

    res.status(200).json({
      message: 'Collection deleted successfully',
      body: { deletedCollection },
    });
  } catch (error) {
    next(error);
  }
};
