import { Router, Request, Response, NextFunction } from 'express';
import { validateRequest } from '../middleware/validate.js';
import { SearchVenuesSchema, GetVenueSchema, type SearchVenuesRequest, type GetVenueParams } from '../validators/venues.js';
import { venueService } from '../../services/venues.js';

const router = Router();

// GET /api/venues - Search venues
router.get(
  '/',
  validateRequest({ query: SearchVenuesSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = req.validatedQuery as SearchVenuesRequest;
      const venues = await venueService.search(filters);
      res.json({ data: venues, count: venues.length });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/venues/nearby - Search nearby venues
router.get(
  '/nearby',
  validateRequest({ query: SearchVenuesSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lat, lon, radius, limit } = req.validatedQuery as SearchVenuesRequest;
      if (lat === undefined || lon === undefined) {
        res.status(400).json({ error: 'lat and lon are required for nearby search' });
        return;
      }
      const venues = await venueService.searchNearby(lat, lon, radius, limit);
      res.json({ data: venues, count: venues.length });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/venues/:id - Get venue by ID
router.get(
  '/:id',
  validateRequest({ params: GetVenueSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.validatedParams as GetVenueParams;
      const venue = await venueService.getById(id);
      res.json({ data: venue });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
