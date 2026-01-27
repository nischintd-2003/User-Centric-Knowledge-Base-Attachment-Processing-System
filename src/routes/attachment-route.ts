import { Router } from 'express';
import { upload } from '../utils/multer';
import {
  deleteAttachment,
  downloadAttachment,
  listAttachments,
  uploadAttachments,
} from '../controllers/attachment-controller';
import { authMiddleware } from '../middleware/auth-middleware';

const attachmentRoutes = Router({ mergeParams: true });

attachmentRoutes.post('/', authMiddleware, upload.array('files'), uploadAttachments);
attachmentRoutes.get('/', authMiddleware, listAttachments);
attachmentRoutes.get('/:attachmentId/download', authMiddleware, downloadAttachment);
attachmentRoutes.delete('/:attachmentId', authMiddleware, deleteAttachment);

export default attachmentRoutes;
