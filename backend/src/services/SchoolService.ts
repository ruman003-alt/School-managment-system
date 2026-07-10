import SchoolRepository from '../repositories/SchoolRepository';
import { School } from '@prisma/client';
import { NotFoundError, ValidationError } from '../utils/errors';
import { logger } from '../config/logger';

export class SchoolService {
  async createSchool(data: {
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
    logger.info({ name: data.name }, 'Creating school');

    const school = await SchoolRepository.create(data);

    logger.info({ schoolId: school.id }, 'School created successfully');

    return school;
  }

  async getSchool(id: string): Promise<School> {
    const school = await SchoolRepository.findById(id);
    if (!school) {
      throw new NotFoundError('School');
    }
    return school;
  }

  async listSchools(page: number = 1, limit: number = 10): Promise<{ data: School[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const { data, total } = await SchoolRepository.findAll(skip, limit);
    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateSchool(id: string, data: Partial<School>): Promise<School> {
    logger.info({ schoolId: id }, 'Updating school');
    const school = await SchoolRepository.update(id, data);
    logger.info({ schoolId: id }, 'School updated');
    return school;
  }

  async deactivateSchool(id: string): Promise<School> {
    logger.info({ schoolId: id }, 'Deactivating school');
    return SchoolRepository.deactivate(id);
  }
}

export default new SchoolService();
