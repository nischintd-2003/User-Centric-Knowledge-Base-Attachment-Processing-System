import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user-model';

export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const verifytoken: any = jwt.verify(token, process.env.JWT_SECRET ?? '');

      const rootuser = await User.findOne({
        _id: verifytoken._id,
      });

      if (!rootuser) {
        throw 'User not found';
      }

      req.user = rootuser;
      next();
    } else {
      throw 'Authentication is required';
    }
  } catch (error) {
    return res.status(400).json({ message: 'Authorization required' });
  }
};
