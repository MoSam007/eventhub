import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { registerValidation, loginValidation } from '../utils/validators';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

router.post('/register', authLimiter, registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);
router.get('/me', authenticate, getMe);

export default router;
