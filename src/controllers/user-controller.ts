import { Request, response, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from 'dotenv';
import User from '../models/user-model';

const JWT_SECRET = process?.env?.JWT_SECRET ?? '';

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const alreadyAUser = await User.findOne({ email });
    if (alreadyAUser) {
      throw 'User is already present with same email';
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const _user = new User({
      username,
      email,
      hashPassword,
    });

    const savedUser = await _user.save();

    response
      .status(200)
      .json({ message: 'User is signed up successfully', body: { User: savedUser } });
  } catch (error) {
    response.status(400).json({
      message: 'Error while saving the user',
      error: JSON.stringify(error),
    });
  }
};
