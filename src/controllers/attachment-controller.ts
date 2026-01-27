import { Request, Response } from 'express';
import Attachment from '../models/attachment-model';
import Article from '../models/article-model';
import { IAuthRequest } from './collection-controller';

export const uploadAttachments = async (req: IAuthRequest, res: Response) => {
  try {
    const { collectionId, articleId } = req.params;
    const userId = req.user._id;
    const files = req.files as Express.Multer.File[];

    if (!userId || typeof articleId !== 'string' || typeof collectionId !== 'string') {
      return res.status(400).json({ message: 'Invalid request parameters' });
    }

    const article = await Article.findOne({
      _id: articleId,
      collectionId,
      userId,
    });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const attachments = files.map((file) => ({
      userId,
      articleId,
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      uploadedAt: new Date(),
    }));

    const savedAttachments = await Attachment.insertMany(attachments);

    res.status(200).json({ message: 'Uploaded the file successfully', body: savedAttachments });
  } catch (error) {
    res.status(400).json({
      message: 'Error while uploading the file',
      error: JSON.stringify(error),
    });
  }
};

export const listAttachments = async (req: Request, res: Response) => {};

export const downloadAttachment = async (req: Request, res: Response) => {};

export const deleteAttachment = async (req: Request, res: Response) => {};
