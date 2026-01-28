import { IUser } from './user';
import mongoose from 'mongoose';

export {};

declare global {
  namespace Express {
    interface Request {
      user?: IUser & { _id: mongoose.Types.ObjectId };
    }
  }
}
