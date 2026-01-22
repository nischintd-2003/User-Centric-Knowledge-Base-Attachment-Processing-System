import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import type { User } from '../interfaces/user';

const userSchema = new mongoose.Schema<User>(
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

    email: {
      type: String,
      require: true,
      unique: true,
    },

    hashPassword: {
      type: String,
      required: true,
      minLenght: 6,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.authenticate = async function (password: string) {
  const bCryptedPassword = await bcrypt.compare(password, this.hashPassword);
  return bCryptedPassword;
};

const User = mongoose.model('User', userSchema);

export default User;
