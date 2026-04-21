import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Unhandled error:', err);
  }
  res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
      status: 500,
    },
  });
}
