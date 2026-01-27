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

/**
 * @swagger
 * /api/collections/{:collectionId}/articles/{:articleId}:
 *   post:
 *     summary: Create a attachment for a article
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *       - in: path
 *         name: articleId
 *     responses:
 *       200:
 *         description: Attachment created
 */
attachmentRoutes.post('/', authMiddleware, upload.array('files'), uploadAttachments);
/**
 * @swagger
 * /api/collections/{:collectionId}/articles/{:articleId}:
 *   get:
 *     summary: Fetch attachments from a article
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *       - in: path
 *         name: articleId
 *     responses:
 *       200:
 *         description: Fetch all the attachments
 */
attachmentRoutes.get('/', authMiddleware, listAttachments);
/**
 * @swagger
 * /api/collections/{:collectionId}/articles/{:articleId}/{:attachmentId}/download:
 *   get:
 *     summary: Download a attachment from a article
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *       - in: path
 *         name: articleId
 *       - in: path
 *         name: attachmentId
 *     responses:
 *       200:
 *         description: Download the attachment
 */
attachmentRoutes.get('/:attachmentId/download', authMiddleware, downloadAttachment);
/**
 * @swagger
 * /api/collections/{:collectionId}/articles/{:articleId}/{:attachmentId}/download:
 *   delete:
 *     summary: Delete a attachment from the article
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: collectionId
 *       - in: path
 *         name: articleId
 *       - in: path
 *         name: attachmentId
 *     responses:
 *       200:
 *         description: Delete the attachment
 */
attachmentRoutes.delete('/:attachmentId', authMiddleware, deleteAttachment);

export default attachmentRoutes;
