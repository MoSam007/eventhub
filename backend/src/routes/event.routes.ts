import { Router } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  createEventWithDetails,
} from '../controllers/event.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { eventValidation } from '../utils/validators';
import { validate } from '../middleware/validation.middleware';

const router = Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post(
  '/',
  authenticate,
  authorize('HOST', 'ADMIN'),
  createEventWithDetails
)
router.post(
  '/',
  authenticate,
  authorize('HOST', 'ADMIN'),
  eventValidation,
  validate,
  createEvent
);
router.put('/:id', authenticate, updateEvent);
router.delete('/:id', authenticate, deleteEvent);

export default router;
