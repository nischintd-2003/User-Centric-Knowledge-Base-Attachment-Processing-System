import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination(req: Request, file, cb) {
    const userId = req.user?.userId;
    const articleId = req.params.articleId;

    if (!userId || typeof articleId !== 'string') {
      return cb(new Error('Invalid user or article id'), '');
    }

    const uploadPath = path.join(
      'storage',
      'users',
      userId,
      'articles',
      articleId
    );

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },

  filename(req: Request, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 
  }
});
