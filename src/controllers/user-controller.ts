import { Request, Response, NextFunction } from 'express';
import { loginUserService, registerUserService } from '../services/user-service';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    const user = await registerUserService(username, email, password);

    res.status(201).json({
      message: 'User registered successfully',
      body: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUserService(email, password);

    res.status(200).json({
      message: 'User logged in successfully',
      body: { token, user },
    });
  } catch (error) {
    next(error);
  }
};
