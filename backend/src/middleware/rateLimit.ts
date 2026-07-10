import { Request, Response, NextFunction } from 'express';

const requestCounts = new Map<string, number>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100;

interface RequestInfo {
  count: number;
  resetTime: number;
}

const requests = new Map<string, RequestInfo>();

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const identifier = req.ip || 'unknown';
  const now = Date.now();

  let requestInfo = requests.get(identifier);

  if (!requestInfo || now > requestInfo.resetTime) {
    requests.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return next();
  }

  requestInfo.count++;

  if (requestInfo.count > MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests',
    });
  }

  next();
}
