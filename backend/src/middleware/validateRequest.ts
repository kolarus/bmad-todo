import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const firstError = result.error.issues[0];
      return res.status(400).json({
        error: {
          message: firstError?.message ?? 'Validation failed',
          code: 'VALIDATION_ERROR',
          status: 400,
        },
      });
    }
    req.body = result.data;
    next();
  };
}
