import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';

export function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error('Unexpected Error', err);

  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
}
