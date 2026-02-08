import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './api/middleware/errorHandler.js';
import { apiRateLimiter } from './api/middleware/rateLimit.js';

// Routes
import healthRouter from './api/routes/health.js';
import eventsRouter from './api/routes/events.js';
import venuesRouter from './api/routes/venues.js';
import artistsRouter from './api/routes/artists.js';
import adminRouter from './api/routes/admin.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(express.json());
app.use(apiRateLimiter);

// Request logging
app.use((req, _res, next) => {
  logger.info({ method: req.method, path: req.path }, 'Incoming request');
  next();
});

// Routes
app.use('/api/health', healthRouter);
app.use('/api/events', eventsRouter);
app.use('/api/venues', venuesRouter);
app.use('/api/artists', artistsRouter);
app.use('/api/admin', adminRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found', code: 'NOT_FOUND' });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  logger.info({ port: config.port }, 'Server started');
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`CORS origin: ${config.cors.origin}`);
});

export default app;
