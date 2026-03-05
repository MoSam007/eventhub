import { Request, Response, NextFunction } from 'express';
import { fetchNairobiEvents } from '../services/eventbrite.service';

/**
 * Controller to fetch events from Eventbrite for Nairobi
 */
export const getEventbriteEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('--- Fetching Events from Eventbrite (Organization Fallback) ---');
    const events = await fetchNairobiEvents();

    res.status(200).json({
      status: 'success',
      results: events.length,
      data: {
        events,
      },
    });
  } catch (error: any) {
    console.error('Controller error fetching external events:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch events from Eventbrite',
      details: error.message,
    });
  }
};
