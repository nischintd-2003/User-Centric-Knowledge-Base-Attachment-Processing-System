import { Request, Response } from 'express';
import Article from '../models/article-model';
import { ObjectId } from 'mongodb';

export interface IAuthRequest extends Request {
  user?: any;
}

const getCollectionId = (req: IAuthRequest) => {
  let { collectionId } = req.params;
  if (Array.isArray(collectionId)) {
    collectionId = collectionId[0];
  }
  if (!collectionId) {
    throw new Error('Collection ID is required');
  }
  return collectionId;
};

export const createArticle = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const collectionId = getCollectionId(req);
    const { title, content } = req.body;

    const _article = new Article({
      title,
      content,
      userId,
      collectionId,
    });

    const savedArticle = await _article.save();

    res
      .status(200)
      .json({ message: 'Article is created succefully', body: { Article: savedArticle } });
  } catch (error) {
    res.status(400).json({
      message: 'Error while saving the article',
      error: JSON.stringify(error),
    });
  }
};

export const getCollectionArticles = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const collectionId = getCollectionId(req);

    const articles = await Article.find({
      userId: userId,
      collectionId: collectionId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Articles fetched successfully',
      body: { Articles: articles },
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error while fetching the article',
      error: JSON.stringify(error),
    });
  }
};

export const getArticleDetails = async (req: IAuthRequest, res: Response) => {
  try {
  } catch (error) {}
};

export const updateArticle = async (req: IAuthRequest, res: Response) => {
  try {
  } catch (error) {}
};
export const deleteArticle = async (req: IAuthRequest, res: Response) => {
  try {
  } catch (error) {}
};
