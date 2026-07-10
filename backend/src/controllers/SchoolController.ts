import { Response } from 'express';
import { AuthenticatedRequest, asyncHandler } from '../middleware/auth';
import SchoolService from '../services/SchoolService';
import { validateRequest } from '../utils/validation';
import { CreateSchoolSchema, UpdateSchoolSchema } from '../validators/schemas';
import { logger } from '../config/logger';

export class SchoolController {
  create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const data = validateRequest(CreateSchoolSchema, req.body);
    const established = new Date(data.established);

    const school = await SchoolService.createSchool({
      ...data,
      established,
    });

    logger.info({ schoolId: school.id }, 'School created via API');

    res.status(201).json({
      success: true,
      message: 'School created successfully',
      data: school,
    });
  });

  getById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const school = await SchoolService.getSchool(id);

    res.status(200).json({
      success: true,
      data: school,
    });
  });

  list = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await SchoolService.listSchools(page, limit);

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
    const { id } = req.params;
    const data = validateRequest(UpdateSchoolSchema, req.body);

    const school = await SchoolService.updateSchool(id, data);

    logger.info({ schoolId: id }, 'School updated via API');

    res.status(200).json({
      success: true,
      message: 'School updated successfully',
      data: school,
    });
  });
}

export default new SchoolController();
