import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user-model';
import { AppError } from '../utils/app-error';

export const registerUserService = async (username: string, email: string, password: string) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError('User already exists with this email', 409);
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    email,
    hashPassword,
  });

  return user;
};

export const loginUserService = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordMatched = await user.authenticate(password);

  if (!isPasswordMatched) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: '3d',
  });

  return { user, token };
};
