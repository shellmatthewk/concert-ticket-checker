import { Router, Request, Response, NextFunction } from 'express';
import { validateRequest } from '../middleware/validate.js';
import { GetArtistEventsSchema, type GetArtistEventsParams } from '../validators/events.js';
import { eventService } from '../../services/events.js';

const router = Router();

// GET /api/artists/:name/events - Get all events for an artist (tour comparison)
router.get(
  '/:name/events',
  validateRequest({ params: GetArtistEventsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.validatedParams as GetArtistEventsParams;
      const events = await eventService.getByArtist(name);
      res.json({
        data: events,
        count: events.length,
        artistName: name,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
