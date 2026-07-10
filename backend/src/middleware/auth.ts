import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { ApiError, UnauthorizedError } from '../utils/errors';
import { verifyAccessToken } from '../utils/auth';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    schoolId: string;
    email: string;
    role: string;
  };
}

export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      next(new UnauthorizedError('Invalid token'));
    }
  }
}

export function roleMiddleware(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new UnauthorizedError('Insufficient permissions'));
    }

    next();
  };
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error(err, 'Error occurred');

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}
