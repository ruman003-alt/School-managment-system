import UserRepository from '../repositories/UserRepository';
import { User, UserRole } from '@prisma/client';
import { UnauthorizedError, ValidationError, NotFoundError } from '../utils/errors';
import { generateAccessToken, generateRefreshToken, TokenPayload } from '../utils/auth';
import { logger } from '../config/logger';

export class AuthService {
  async login(email: string, password: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      schoolId: string;
    };
  }> {
    logger.info({ email }, 'Login attempt');

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('User account is inactive');
    }

    const isPasswordValid = await UserRepository.verifyPassword(user.id, password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    await UserRepository.updateLastLogin(user.id);

    const payload: TokenPayload = {
      userId: user.id,
      schoolId: user.schoolId,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    logger.info({ userId: user.id }, 'User logged in successfully');

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        schoolId: user.schoolId,
      },
    };
  }

  async refreshAccessToken(refreshToken: string, payload: TokenPayload): Promise<{
    accessToken: string;
  }> {
    logger.info({ userId: payload.userId }, 'Refreshing access token');

    const user = await UserRepository.findById(payload.userId, payload.schoolId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    const newPayload: TokenPayload = {
      userId: user.id,
      schoolId: user.schoolId,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(newPayload);

    return { accessToken };
  }
}

export default new AuthService();
