import fs from 'fs';
import Attachment from '../models/attachment-model';
import Article from '../models/article-model';
import { ObjectId } from 'mongodb';
import { AppError } from '../utils/app-error';

export const uploadAttachmentsService = async (
  userId: ObjectId,
  collectionId: string,
  articleId: string,
  files: Express.Multer.File[],
) => {
  const article = await Article.findOne({
    _id: articleId,
    collectionId,
    userId,
  });

  if (!article) {
    throw new AppError('Article not found', 404);
  }

  if (!files || files.length === 0) {
    throw new AppError('No files uploaded', 400);
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

  return Attachment.insertMany(attachments);
};

export const listAttachmentsService = async (userId: ObjectId, articleId: string) => {
  return Attachment.find({ articleId, userId });
};

export const downloadAttachmentService = async (userId: ObjectId, attachmentId: string) => {
  const attachment = await Attachment.findOne({
    _id: attachmentId,
    userId,
  });

  if (!attachment) {
    throw new AppError('Attachment not found', 404);
  }

  if (!fs.existsSync(attachment.path)) {
    throw new AppError('File not found on disk', 410);
  }

  return attachment;
};

export const deleteAttachmentService = async (userId: ObjectId, attachmentId: string) => {
  const attachment = await Attachment.findOne({
    _id: attachmentId,
    userId,
  });

  if (!attachment) {
    throw new AppError('Attachment not found', 404);
  }

  if (fs.existsSync(attachment.path)) {
    fs.unlinkSync(attachment.path);
  }

  await attachment.deleteOne();

  return attachment;
};
