import { Router } from 'express';
import StudentController from '../controllers/StudentController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = Router();

// All student routes require authentication
router.use(authMiddleware);

// Create student (School admin or Super admin)
router.post('/', roleMiddleware('SUPER_ADMIN', 'SCHOOL_ADMIN'), StudentController.create);

// List students (authenticated users from the same school)
router.get('/', StudentController.list);

// Get student by ID
router.get('/:id', StudentController.getById);

// Get students by class
router.get('/class/:classId', StudentController.listByClass);

// Update student
router.put('/:id', roleMiddleware('SUPER_ADMIN', 'SCHOOL_ADMIN'), StudentController.update);

export default router;
