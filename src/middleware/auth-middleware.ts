import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user-model';
import { AppError } from '../utils/app-error';
import { IAuthRequest } from '../controllers/collection-controller';

export const authMiddleware = async (req: IAuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication token missing', 401);
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as jwt.JwtPayload;

    if (!decoded || typeof decoded !== 'object' || !decoded._id) {
      throw new AppError('Invalid authentication token', 401);
    }

    const user = await User.findById(decoded._id);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
