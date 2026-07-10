import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const SALT_ROUNDS = 10;

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT tokens
export interface TokenPayload {
  userId: string;
  schoolId: string;
  email: string;
  role: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwt.secret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
}
