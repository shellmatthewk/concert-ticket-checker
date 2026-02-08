import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  supabase: {
    url: process.env.SUPABASE_URL || '',
    serviceKey: process.env.SUPABASE_SERVICE_KEY || '',
  },

  redis: {
    url: process.env.UPSTASH_REDIS_URL || '',
  },

  apis: {
    ticketmaster: {
      apiKey: process.env.TICKETMASTER_API_KEY || '',
      baseUrl: 'https://app.ticketmaster.com/discovery/v2',
    },
    seatgeek: {
      apiKey: process.env.SEATGEEK_API_KEY || '',
      baseUrl: 'https://api.seatgeek.com/2',
    },
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
} as const;

export type Config = typeof config;
