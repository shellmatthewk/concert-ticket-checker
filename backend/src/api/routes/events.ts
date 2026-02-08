import { Router, Request, Response, NextFunction } from 'express';
import { validateRequest } from '../middleware/validate.js';
import { SearchEventsSchema, GetEventSchema, type SearchEventsRequest, type GetEventParams } from '../validators/events.js';
import { eventService } from '../../services/events.js';

const router = Router();

// GET /api/events - Search events
router.get(
  '/',
  validateRequest({ query: SearchEventsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = req.validatedQuery as SearchEventsRequest;
      const events = await eventService.search(filters);
      res.json({ data: events, count: events.length });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/events/:id - Get event by ID
router.get(
  '/:id',
  validateRequest({ params: GetEventSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.validatedParams as GetEventParams;
      const event = await eventService.getById(id);
      res.json({ data: event });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/events/:id/prices - Get event with price history
router.get(
  '/:id/prices',
  validateRequest({ params: GetEventSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.validatedParams as GetEventParams;
      const eventWithHistory = await eventService.getWithPriceHistory(id);
      res.json({ data: eventWithHistory });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
