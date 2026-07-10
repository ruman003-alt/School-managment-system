import prisma from '../models/prisma';
import { Student } from '@prisma/client';
import { NotFoundError, ConflictError } from '../utils/errors';

export class StudentRepository {
  async create(data: {
    schoolId: string;
    userId: string;
    enrollmentNumber: string;
    dateOfBirth: Date;
    gender: string;
    bloodGroup?: string;
    classId: string;
    sectionId: string;
  }): Promise<Student> {
    try {
      return await prisma.student.create({ data });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictError('Student with this enrollment number already exists');
      }
      throw error;
    }
  }

  async findById(id: string, schoolId: string): Promise<Student | null> {
    return prisma.student.findFirst({
      where: { id, schoolId },
      include: {
        user: true,
        class: true,
        section: true,
      },
    });
  }

  async findByUserId(userId: string, schoolId: string): Promise<Student | null> {
    return prisma.student.findFirst({
      where: { userId, schoolId },
      include: { user: true },
    });
  }

  async findAll(schoolId: string, skip: number = 0, take: number = 10): Promise<{ data: Student[]; total: number }> {
    const [data, total] = await Promise.all([
      prisma.student.findMany({
        where: { schoolId, currentStatus: 'ACTIVE' },
        skip,
        take,
        include: { user: true, class: true, section: true },
      }),
      prisma.student.count({ where: { schoolId, currentStatus: 'ACTIVE' } }),
    ]);
    return { data, total };
  }

  async findByClass(schoolId: string, classId: string): Promise<Student[]> {
    return prisma.student.findMany({
      where: { schoolId, classId, currentStatus: 'ACTIVE' },
      include: { user: true, section: true },
    });
  }

  async findBySection(schoolId: string, sectionId: string): Promise<Student[]> {
    return prisma.student.findMany({
      where: { schoolId, sectionId, currentStatus: 'ACTIVE' },
      include: { user: true },
    });
  }

  async update(id: string, schoolId: string, data: Partial<Student>): Promise<Student> {
    const student = await this.findById(id, schoolId);
    if (!student) {
      throw new NotFoundError('Student');
    }

    return prisma.student.update({ where: { id }, data });
  }
}

export default new StudentRepository();
