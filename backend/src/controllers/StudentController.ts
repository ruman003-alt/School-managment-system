import { Response } from 'express';
import { AuthenticatedRequest, asyncHandler } from '../middleware/auth';
import StudentService from '../services/StudentService';
import { validateRequest } from '../utils/validation';
import { CreateStudentSchema, UpdateStudentSchema } from '../validators/schemas';
import { logger } from '../config/logger';

export class StudentController {
  create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const data = validateRequest(CreateStudentSchema, req.body);
    const dateOfBirth = new Date(data.dateOfBirth);

    const student = await StudentService.createStudent(req.user.schoolId, {
      ...data,
      dateOfBirth,
    });

    logger.info({ studentId: student.id }, 'Student created via API');

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student,
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
    const student = await StudentService.getStudent(id, req.user.schoolId);

    res.status(200).json({
      success: true,
      data: student,
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

    const result = await StudentService.listStudents(req.user.schoolId, page, limit);

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

  listByClass = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const { classId } = req.params;
    const students = await StudentService.getStudentsByClass(req.user.schoolId, classId);

    res.status(200).json({
      success: true,
      data: students,
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
    const data = validateRequest(UpdateStudentSchema, req.body);

    const student = await StudentService.updateStudent(id, req.user.schoolId, data);

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student,
    });
  });
}

export default new StudentController();
