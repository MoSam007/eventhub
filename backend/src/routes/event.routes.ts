import { Router } from 'express';
import {
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  createEventWithDetails,
  getMyEvents,
} from '../controllers/event.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { triggerEventSync } from '../controllers/eventSync.controller';

const router = Router();

router.get('/', getAllEvents);

// Protected routes - Host's own events
router.get('/my-events', authenticate, authorize('HOST', 'ADMIN'), getMyEvents);

// Get external events
router.get("/sync-external", triggerEventSync)

// Create event
router.post(
  '/',
  authenticate,
  authorize('HOST', 'ADMIN'),
  createEventWithDetails
);

router.get('/:id', getEventById);
router.put('/:id', authenticate, updateEvent);
router.delete('/:id', authenticate, deleteEvent);

export default router;
