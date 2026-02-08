# Code Patterns & Style Guide

## TypeScript Standards

### Strict Type Safety
```typescript
// GOOD: Explicit types
interface Event {
  id: string;
  artistName: string;
  eventDate: Date;
  venue: Venue;
}

async function getEvent(id: string): Promise<Event | null> {
  // implementation
}

// BAD: Using 'any'
async function getEvent(id: any): any {
  // NEVER do this
}
```

### Zod Validation
```typescript
// Request validation
import { z } from 'zod';

export const SearchEventsSchema = z.object({
  query: z.string().optional(),
  lat: z.number().optional(),
  lon: z.number().optional(),
  radius: z.number().min(1).max(500).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export type SearchEventsRequest = z.infer<typeof SearchEventsSchema>;
```

### Error Handling
```typescript
// Custom error types
class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

// Usage in services
async function getEvent(id: string): Promise<Event> {
  const event = await db.events.findUnique({ where: { id } });
  if (!event) {
    throw new NotFoundError('Event');
  }
  return event;
}
```

---

## React Patterns

### Component Structure
```typescript
// components/features/event/EventCard.tsx
interface EventCardProps {
  event: Event;
  onSelect?: (event: Event) => void;
}

export function EventCard({ event, onSelect }: EventCardProps) {
  return (
    <div
      className="rounded-lg border p-4 hover:shadow-md transition-shadow"
      onClick={() => onSelect?.(event)}
    >
      <h3 className="font-semibold">{event.artistName}</h3>
      <p className="text-muted-foreground">{event.venue.name}</p>
      <p className="text-sm">{formatDate(event.eventDate)}</p>
    </div>
  );
}
```

### Data Fetching (SWR or TanStack Query)
```typescript
// lib/hooks/useEvent.ts
import useSWR from 'swr';

export function useEvent(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/api/events/${id}` : null,
    fetcher
  );

  return {
    event: data,
    isLoading,
    isError: error,
  };
}

// Usage in component
function EventPage({ id }: { id: string }) {
  const { event, isLoading, isError } = useEvent(id);

  if (isLoading) return <Skeleton />;
  if (isError) return <ErrorDisplay />;

  return <EventDetail event={event} />;
}
```

### Zustand Store
```typescript
// lib/stores/searchStore.ts
import { create } from 'zustand';

interface SearchState {
  query: string;
  filters: SearchFilters;
  setQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  filters: defaultFilters,
  setQuery: (query) => set({ query }),
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  reset: () => set({ query: '', filters: defaultFilters }),
}));
```

---

## Express Patterns

### Route Handler (Thin Controller)
```typescript
// api/routes/events.ts
import { Router } from 'express';
import { validateRequest } from '../middleware/validate';
import { SearchEventsSchema } from '../validators/events';
import { eventService } from '../../services/events';

const router = Router();

// GET /api/events - Search events
router.get('/',
  validateRequest({ query: SearchEventsSchema }),
  async (req, res, next) => {
    try {
      const events = await eventService.search(req.query);
      res.json({ data: events });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
```

### Service Layer (Business Logic)
```typescript
// services/events.ts
import { supabase } from '../db/client';
import { cache } from '../lib/cache';

class EventService {
  async search(filters: SearchEventsRequest): Promise<Event[]> {
    const cacheKey = `events:search:${JSON.stringify(filters)}`;

    // Check cache first
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    // Build query
    let query = supabase
      .from('events')
      .select('*, venue:venues(*)')
      .eq('status', 'active')
      .gte('event_date', new Date().toISOString());

    if (filters.query) {
      query = query.ilike('artist_name', `%${filters.query}%`);
    }

    // Execute and cache
    const { data, error } = await query
      .order('event_date')
      .range(filters.offset, filters.offset + filters.limit - 1);

    if (error) throw error;

    await cache.set(cacheKey, data, 300); // 5 min TTL
    return data;
  }
}

export const eventService = new EventService();
```

### Middleware
```typescript
// api/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function validateRequest(schemas: ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      next();
    } catch (error) {
      res.status(400).json({ error: 'Validation failed', details: error });
    }
  };
}
```

---

## Database Patterns

### Supabase Client
```typescript
// db/client.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);
```

### Geo Query Pattern
```typescript
// services/geo.ts
export async function findNearbyVenues(
  lat: number,
  lon: number,
  radiusMeters: number
): Promise<Venue[]> {
  const { data, error } = await supabase.rpc('get_venues_nearby', {
    user_lat: lat,
    user_lon: lon,
    dist_meters: radiusMeters,
  });

  if (error) throw error;
  return data;
}
```

---

## Naming Conventions

### Files
- Components: `PascalCase.tsx` (e.g., `EventCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `camelCase.ts` or `types.ts`
- Tests: `*.test.ts` or `*.spec.ts`

### Variables
- Components: `PascalCase`
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Types/Interfaces: `PascalCase`

### API Endpoints
- Plural nouns: `/api/events`, `/api/venues`
- Nested resources: `/api/events/:id/prices`
- Query params for filtering: `/api/events?artist=beyonce`

---

## Import Order
```typescript
// 1. External libraries
import { useState } from 'react';
import { z } from 'zod';

// 2. Internal modules (absolute paths)
import { Button } from '@/components/ui/button';
import { useEvent } from '@/lib/hooks/useEvent';

// 3. Relative imports
import { EventCard } from './EventCard';

// 4. Types (can be inline or separate)
import type { Event } from '@/types';
```
