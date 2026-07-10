import { z } from 'zod';
import { logger } from '../config/logger';
import { ValidationError } from './errors';

export function validateRequest<T>(schema: z.ZodSchema, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.flatten();
    logger.warn({ errors }, 'Validation failed');
    throw new ValidationError('Validation failed', errors);
  }

  return result.data as T;
}
