import UserRepository from '../repositories/UserRepository';
import { User, UserRole } from '@prisma/client';
import { NotFoundError, ValidationError } from '../utils/errors';
import { hashPassword } from '../utils/auth';
import { logger } from '../config/logger';

export class UserService {
  async createUser(schoolId: string, data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: UserRole;
  }): Promise<User> {
    logger.info({ email: data.email, role: data.role }, 'Creating user');

    const existingUser = await UserRepository.findByEmailInSchool(data.email, schoolId);
    if (existingUser) {
      throw new ValidationError('User with this email already exists in this school');
    }

    const user = await UserRepository.create({
      schoolId,
      ...data,
    });

    logger.info({ userId: user.id }, 'User created');

    return user;
  }

  async getUser(userId: string, schoolId: string): Promise<User> {
    const user = await UserRepository.findById(userId, schoolId);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  }

  async listUsers(schoolId: string, page: number = 1, limit: number = 10): Promise<{ data: User[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const { data, total } = await UserRepository.findAll(schoolId, skip, limit);
    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async listUsersByRole(schoolId: string, role: UserRole): Promise<User[]> {
    return UserRepository.findAllByRole(schoolId, role);
  }

  async updateUser(userId: string, schoolId: string, data: Partial<User>): Promise<User> {
    logger.info({ userId }, 'Updating user');
    const user = await UserRepository.update(userId, schoolId, data);
    logger.info({ userId }, 'User updated');
    return user;
  }

  async deactivateUser(userId: string, schoolId: string): Promise<User> {
    logger.info({ userId }, 'Deactivating user');
    return UserRepository.deactivate(userId, schoolId);
  }
}

export default new UserService();
