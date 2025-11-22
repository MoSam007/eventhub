import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('ADMIN'));

// Stats
router.get('/stats', getUserStats);

// User CRUD
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);

router.post(
  '/users',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('role').isIn(['USER', 'HOST', 'VENDOR', 'ADMIN']).withMessage('Valid role is required'),
  ],
  validate,
  createUser
);

router.put(
  '/users/:id',
  [
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
    body('role').optional().isIn(['USER', 'HOST', 'VENDOR', 'ADMIN']).withMessage('Valid role is required'),
  ],
  validate,
  updateUser
);

router.delete('/users/:id', deleteUser);

export default router;
