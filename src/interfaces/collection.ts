import mongoose from 'mongoose';

export interface ICollection extends Document {
  name: string;
  description?: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
