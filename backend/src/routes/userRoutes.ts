import { Router } from 'express';
import UserController from '../controllers/UserController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// Create user (School admin or Super admin)
router.post('/', roleMiddleware('SUPER_ADMIN', 'SCHOOL_ADMIN'), UserController.create);

// List users (School admin or Super admin)
router.get('/', roleMiddleware('SUPER_ADMIN', 'SCHOOL_ADMIN'), UserController.list);

// Get user by ID
router.get('/:id', UserController.getById);

// Update user
router.put('/:id', UserController.update);

export default router;
