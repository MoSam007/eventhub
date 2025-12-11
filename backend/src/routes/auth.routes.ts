import { Router } from 'express';
import { 
  register, 
  login, 
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
  socialAuth,
} from '../controllers/auth.controller';
import { registerValidation, loginValidation } from '../utils/validators';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { body } from 'express-validator';

const router = Router();

// Add logging middleware
router.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Registration and Login
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// Get current user
router.get('/me', authenticate, getMe);

// Email verification
router.get('/verify-email/:token', verifyEmail);

// Password reset
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Valid email is required')],
  validate,
  forgotPassword
);

router.post(
  '/reset-password/:token',
  [body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')],
  validate,
  resetPassword
);

// Social authentication
router.post(
  '/social-auth',
  [
    body('provider').isIn(['google', 'facebook', 'apple']).withMessage('Invalid provider'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('fullName').notEmpty().withMessage('Full name is required'),
  ],
  validate,
  socialAuth
);

export default router;