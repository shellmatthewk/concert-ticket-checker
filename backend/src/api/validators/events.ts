import { z } from 'zod';

export const SearchEventsSchema = z.object({
  query: z.string().optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lon: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().min(1).max(500).optional().default(50),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  genre: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  offset: z.coerce.number().min(0).optional().default(0),
});

export type SearchEventsRequest = z.infer<typeof SearchEventsSchema>;

export const GetEventSchema = z.object({
  id: z.string().uuid(),
});

export type GetEventParams = z.infer<typeof GetEventSchema>;

export const GetArtistEventsSchema = z.object({
  name: z.string().min(1),
});

export type GetArtistEventsParams = z.infer<typeof GetArtistEventsSchema>;
