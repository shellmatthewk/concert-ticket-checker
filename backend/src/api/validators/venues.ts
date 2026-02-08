import { z } from 'zod';

export const SearchVenuesSchema = z.object({
  query: z.string().optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lon: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().min(1).max(500).optional().default(50),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  offset: z.coerce.number().min(0).optional().default(0),
});

export type SearchVenuesRequest = z.infer<typeof SearchVenuesSchema>;

export const GetVenueSchema = z.object({
  id: z.string().uuid(),
});

export type GetVenueParams = z.infer<typeof GetVenueSchema>;
