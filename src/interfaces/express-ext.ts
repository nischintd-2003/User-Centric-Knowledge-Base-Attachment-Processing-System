import { IUser } from './user';
import mongoose from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: IUser & { _id: mongoose.Types.ObjectId };
    }
  }
}
