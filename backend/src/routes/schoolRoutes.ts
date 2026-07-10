import { Router } from 'express';
import SchoolController from '../controllers/SchoolController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = Router();

// All school routes require authentication
router.use(authMiddleware);

// Super admin only
router.post('/', roleMiddleware('SUPER_ADMIN'), SchoolController.create);

// Available to all authenticated users
router.get('/', SchoolController.list);
router.get('/:id', SchoolController.getById);

// School admin or super admin
router.put('/:id', roleMiddleware('SUPER_ADMIN', 'SCHOOL_ADMIN'), SchoolController.update);

export default router;
