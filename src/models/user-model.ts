import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minLength: 1,
      maxLenght: 30,
    },

    password: {
      type: String,
      required: true,
      minLenght: 6,
      maxLenght: 50,
    },

    emai: {
      type: String,
      require: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model('User', userSchema);
