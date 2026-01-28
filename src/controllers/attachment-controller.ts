import { Response, NextFunction } from 'express';
import { IAuthRequest } from './collection-controller';
import {
  deleteAttachmentService,
  downloadAttachmentService,
  listAttachmentsService,
  uploadAttachmentsService,
} from '../services/attachment-service';
import { AppError } from '../utils/app-error';
import { getParamAsString } from '../utils/request-utils';

export const uploadAttachments = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const collectionId = getParamAsString(req.params.collectionId, 'collectionId');
    const articleId = getParamAsString(req.params.articleId, 'articleId');
    const files = req.files as Express.Multer.File[];

    const attachments = await uploadAttachmentsService(
      req.user._id,
      collectionId,
      articleId,
      files,
    );

    res.status(200).json({
      message: 'Files uploaded successfully',
      body: attachments,
    });
  } catch (error) {
    next(error);
  }
};

export const listAttachments = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const articleId = getParamAsString(req.params.articleId, 'articleId');

    const attachments = await listAttachmentsService(req.user._id, articleId);

    res.status(200).json({
      message: 'Attachments fetched successfully',
      body: attachments,
    });
  } catch (error) {
    next(error);
  }
};

export const downloadAttachment = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const attachmentId = getParamAsString(req.params.attachmentId, 'attachmentId');

    const attachment = await downloadAttachmentService(req.user._id, attachmentId);

    res.download(attachment.path, attachment.filename);
  } catch (error) {
    next(error);
  }
};

export const deleteAttachment = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const attachmentId = getParamAsString(req.params.attachmentId, 'attachmentId');

    const attachment = await deleteAttachmentService(req.user._id, attachmentId);

    res.status(200).json({
      message: 'Attachment deleted successfully',
      body: attachment,
    });
  } catch (error) {
    next(error);
  }
};
