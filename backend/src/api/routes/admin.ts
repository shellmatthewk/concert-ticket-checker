import { Router, Request, Response, NextFunction } from 'express';
import { ticketmasterService } from '../../services/scraping/ticketmaster.js';

const router = Router();

// POST /api/admin/sync/ticketmaster - Sync events from Ticketmaster
router.post(
  '/sync/ticketmaster',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { keyword, city, stateCode, maxPages } = req.body || {};

      const result = await ticketmasterService.syncEvents({
        keyword,
        city,
        stateCode,
        maxPages: maxPages || 2,
      });

      res.json({
        success: true,
        message: 'Sync complete',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
