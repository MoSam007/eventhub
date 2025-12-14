import { Router } from 'express';
import { generateEventContent, generateEventImages } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post(
  '/generate-event-content',
  [
    body('eventDescription').trim().notEmpty().withMessage('Event description is required'),
    body('eventDescription').isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  ],
  validate,
  generateEventContent
);

router.post(
  '/generate-event-images',
  [
    body('prompts').isArray().withMessage('Image prompts must be an array'),
    body('eventTitle').trim().notEmpty().withMessage('Event title is required'),
  ],
  validate,
  generateEventImages
);

export default router;