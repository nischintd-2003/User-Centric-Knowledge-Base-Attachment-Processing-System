import { Response } from 'express';
import fs from 'fs';
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
      message: 'Error while uploading files',
      error: JSON.stringify(error),
    });
  }
};

export const listAttachments = async (req: IAuthRequest, res: Response) => {
  try {
    const { articleId } = req.params;
    const userId = req.user._id;

    if (!userId || typeof articleId !== 'string') {
      return res.status(400).json({ message: 'Invalid request parameters' });
    }

    const attachments = await Attachment.find({
      articleId,
      userId,
    });

    res.status(200).json({ message: 'Attachments fetched successfully', body: attachments });
  } catch (error) {
    res.status(400).json({
      message: 'Error while fetching files',
      error: JSON.stringify(error),
    });
  }
};

export const downloadAttachment = async (req: IAuthRequest, res: Response) => {
  try {
    const { attachmentId } = req.params;
    const userId = req.user._id;

    if (!userId || typeof attachmentId !== 'string') {
      return res.status(400).json({ message: 'Invalid request parameters' });
    }

    const attachment = await Attachment.findOne({
      _id: attachmentId,
      userId,
    });

    if (!attachment) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    if (!fs.existsSync(attachment.path)) {
      return res.status(410).json({ message: 'File not found on disk' });
    }

    res.download(attachment.path, attachment.filename);
  } catch (error) {
    res.status(400).json({
      message: 'Error while downloading the  file',
      error: JSON.stringify(error),
    });
  }
};

export const deleteAttachment = async (req: IAuthRequest, res: Response) => {};
