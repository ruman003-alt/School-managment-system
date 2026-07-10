import prisma from '../models/prisma';
import { User, UserRole } from '@prisma/client';
import { NotFoundError, ConflictError } from '../utils/errors';
import { hashPassword, comparePasswords } from '../utils/auth';

export class UserRepository {
  async create(data: {
    schoolId: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: UserRole;
  }): Promise<User> {
    try {
      const hashedPassword = await hashPassword(data.password);
      return await prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictError('User with this email already exists');
      }
      throw error;
    }
  }

  async findById(id: string, schoolId?: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        id,
        ...(schoolId && { schoolId }),
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByEmailInSchool(email: string, schoolId: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { email, schoolId },
    });
  }

  async findAll(schoolId: string, skip: number = 0, take: number = 10): Promise<{ data: User[]; total: number }> {
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where: { schoolId, isActive: true },
        skip,
        take,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where: { schoolId, isActive: true } }),
    ]);
    return { data, total };
  }

  async findAllByRole(schoolId: string, role: UserRole): Promise<User[]> {
    return prisma.user.findMany({
      where: { schoolId, role, isActive: true },
    });
  }

  async update(id: string, schoolId: string, data: Partial<User>): Promise<User> {
    const user = await this.findById(id, schoolId);
    if (!user) {
      throw new NotFoundError('User');
    }

    return prisma.user.update({ where: { id }, data });
  }

  async verifyPassword(userId: string, password: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return false;
    return comparePasswords(password, user.password);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() },
    });
  }

  async deactivate(id: string, schoolId: string): Promise<User> {
    return this.update(id, schoolId, { isActive: false });
  }
}

export default new UserRepository();
