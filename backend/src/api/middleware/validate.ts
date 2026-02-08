import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function validateRequest(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        // Store parsed query in a custom property to maintain type safety
        (req as Request & { validatedQuery: unknown }).validatedQuery = schemas.query.parse(req.query);
      }
      if (schemas.params) {
        // Store parsed params in a custom property to maintain type safety
        (req as Request & { validatedParams: unknown }).validatedParams = schemas.params.parse(req.params);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

// Helper types for accessing validated data
declare global {
  namespace Express {
    interface Request {
      validatedQuery?: unknown;
      validatedParams?: unknown;
    }
  }
}
