import prisma from '../models/prisma';
import { School } from '@prisma/client';
import { NotFoundError, ConflictError } from '../utils/errors';

export class SchoolRepository {
  async create(data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    logo?: string;
    registrationNumber: string;
    principalName: string;
    established: Date;
    website?: string;
  }): Promise<School> {
    try {
      return await prisma.school.create({ data });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictError('School with this name or registration number already exists');
      }
      throw error;
    }
  }

  async findById(id: string): Promise<School | null> {
    return prisma.school.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<School | null> {
    return prisma.school.findUnique({ where: { name } });
  }

  async findAll(skip: number = 0, take: number = 10): Promise<{ data: School[]; total: number }> {
    const [data, total] = await Promise.all([
      prisma.school.findMany({ skip, take, where: { isActive: true } }),
      prisma.school.count({ where: { isActive: true } }),
    ]);
    return { data, total };
  }

  async update(id: string, data: Partial<School>): Promise<School> {
    const school = await prisma.school.findUnique({ where: { id } });
    if (!school) {
      throw new NotFoundError('School');
    }

    return prisma.school.update({ where: { id }, data });
  }

  async deactivate(id: string): Promise<School> {
    return this.update(id, { isActive: false });
  }
}

export default new SchoolRepository();
