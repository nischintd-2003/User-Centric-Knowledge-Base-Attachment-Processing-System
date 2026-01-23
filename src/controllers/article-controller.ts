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

const getArticleId = (req: IAuthRequest) => {
  let { articleId } = req.params;
  if (Array.isArray(articleId)) {
    articleId = articleId[0];
  }
  if (!articleId) {
    throw new Error('Article ID is required');
  }
  return articleId;
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
    const userId = req.user._id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const collectionId = getCollectionId(req);
    const articleId = getArticleId(req);

    const foundArticle = await Article.findOne({
      userId: userId,
      collectionId: collectionId,
      _id: articleId,
    });

    res.status(200).json({
      message: 'Article  details fetched successfully',
      body: { Article: foundArticle },
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error while fetching the article',
      error: JSON.stringify(error),
    });
  }
};

export const updateArticle = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const collectionId = getCollectionId(req);
    const articleId = getArticleId(req);
    const { title, content } = req.body;
    const updatedArticle = await Article.updateOne(
      { userId: userId, collectionId: collectionId, _id: articleId },
      { $set: { title: title, content: content } },
    );
    res.status(200).json({
      message: 'Article updated successfully',
      body: { updatedArticle: updatedArticle },
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error while updating the article',
      error: JSON.stringify(error),
    });
  }
};
export const deleteArticle = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    const collectionId = getCollectionId;
    const articleId = getArticleId;
  } catch (error) {
    res.status(400).json({
      message: 'Error while deleting the article',
      error: JSON.stringify(error),
    });
  }
};
