import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user-model';

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const isPasswordMatched = await user.authenticate(password);
      if (isPasswordMatched) {
        const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET ?? '', {
          expiresIn: '3d',
        });
        res.status(200).json({ message: 'User is signed in successfully', body: { token, user } });
      } else {
        throw 'Password is incorrect';
      }
    } else {
      throw 'User not found';
    }
  } catch (error) {
    res.status(400).json({ message: 'Error while login', error: error });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const alreadyAUser = await User.findOne({ email });
    if (alreadyAUser) {
      throw 'User is already present with same email';
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const _user = new User({
      username,
      email,
      hashPassword,
    });

    const savedUser = await _user.save();

    res.status(200).json({ message: 'User is signed up successfully', body: { User: savedUser } });
  } catch (error) {
    res.status(400).json({
      message: 'Error while saving the user',
      error: JSON.stringify(error),
    });
  }
};
