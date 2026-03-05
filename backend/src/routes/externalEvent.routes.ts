import { Router } from 'express';
import { getEventbriteEvents } from '../controllers/externalEvent.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * Route to fetch external events from Eventbrite
 * Protected: Requires authentication
 */
router.get('/eventbrite/nairobi', getEventbriteEvents);

export default router;
