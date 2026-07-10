import StudentRepository from '../repositories/StudentRepository';
import UserRepository from '../repositories/UserRepository';
import { Student } from '@prisma/client';
import { NotFoundError, ValidationError } from '../utils/errors';
import { logger } from '../config/logger';
import prisma from '../models/prisma';

export class StudentService {
  async createStudent(
    schoolId: string,
    data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      enrollmentNumber: string;
      dateOfBirth: Date;
      gender: string;
      bloodGroup?: string;
      classId: string;
      sectionId: string;
    }
  ): Promise<Student> {
    logger.info({ enrollmentNumber: data.enrollmentNumber }, 'Creating student');

    // Create user
    const user = await UserRepository.create({
      schoolId,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'STUDENT',
    });

    // Create student record
    const student = await StudentRepository.create({
      schoolId,
      userId: user.id,
      enrollmentNumber: data.enrollmentNumber,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      classId: data.classId,
      sectionId: data.sectionId,
    });

    logger.info({ studentId: student.id }, 'Student created');

    return student;
  }

  async getStudent(studentId: string, schoolId: string): Promise<Student> {
    const student = await StudentRepository.findById(studentId, schoolId);
    if (!student) {
      throw new NotFoundError('Student');
    }
    return student;
  }

  async listStudents(schoolId: string, page: number = 1, limit: number = 10): Promise<{ data: Student[]; total: number; page: number; totalPages: number }> {
    const skip = (page - 1) * limit;
    const { data, total } = await StudentRepository.findAll(schoolId, skip, limit);
    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getStudentsByClass(schoolId: string, classId: string): Promise<Student[]> {
    return StudentRepository.findByClass(schoolId, classId);
  }

  async getStudentsBySection(schoolId: string, sectionId: string): Promise<Student[]> {
    return StudentRepository.findBySection(schoolId, sectionId);
  }

  async updateStudent(studentId: string, schoolId: string, data: Partial<Student>): Promise<Student> {
    logger.info({ studentId }, 'Updating student');
    const student = await StudentRepository.update(studentId, schoolId, data);
    logger.info({ studentId }, 'Student updated');
    return student;
  }
}

export default new StudentService();
