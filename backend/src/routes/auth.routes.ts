import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { registerValidation, loginValidation } from '../utils/validators';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// Add logging middleware
router.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', authenticate, getMe);

export default router;