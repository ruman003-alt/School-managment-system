import { Response } from 'express';
import { AuthenticatedRequest, asyncHandler } from '../middleware/auth';
import UserService from '../services/UserService';
import { validateRequest } from '../utils/validation';
import { CreateUserSchema, UpdateUserSchema } from '../validators/schemas';
import { logger } from '../config/logger';

export class UserController {
  create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const data = validateRequest(CreateUserSchema, req.body);

    const user = await UserService.createUser(req.user.schoolId, data);

    logger.info({ userId: user.id }, 'User created via API');

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userWithoutPassword,
    });
  });

  getById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const { id } = req.params;
    const user = await UserService.getUser(id, req.user.schoolId);

    const { password, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: userWithoutPassword,
    });
  });

  list = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await UserService.listUsers(req.user.schoolId, page, limit);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: {
        page: result.page,
        limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  });

  update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const { id } = req.params;
    const data = validateRequest(UpdateUserSchema, req.body);

    const user = await UserService.updateUser(id, req.user.schoolId, data);

    const { password, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: userWithoutPassword,
    });
  });
}

export default new UserController();
