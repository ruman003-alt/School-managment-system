import { Response } from 'express';
import { AuthenticatedRequest, asyncHandler } from '../middleware/auth';
import AuthService from '../services/AuthService';
import { validateRequest } from '../utils/validation';
import { LoginSchema, RefreshTokenSchema } from '../validators/schemas';
import { logger } from '../config/logger';

export class AuthController {
  login = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { email, password } = validateRequest(LoginSchema, req.body);

    const result = await AuthService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  });

  refreshToken = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { refreshToken } = validateRequest(RefreshTokenSchema, req.body);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const result = await AuthService.refreshAccessToken(refreshToken, req.user);

    res.status(200).json({
      success: true,
      message: 'Token refreshed',
      data: result,
    });
  });

  logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    logger.info({ userId: req.user?.userId }, 'User logged out');

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  });
}

export default new AuthController();
