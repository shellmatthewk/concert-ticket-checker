import { getSupabase } from '../db/client.js';
import { logger } from '../utils/logger.js';
import { NotFoundError } from '../api/middleware/errorHandler.js';
import type { SearchEventsRequest } from '../api/validators/events.js';

export interface Event {
  id: string;
  externalId: string | null;
  artistName: string;
  genre: string | null;
  venueId: string | null;
  eventDate: string;
  url: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  venue?: Venue | null;
  currentMinPrice?: number | null;
  currentMaxPrice?: number | null;
}

export interface Venue {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
}

export interface PriceHistory {
  id: string;
  eventId: string;
  minPrice: number | null;
  maxPrice: number | null;
  avgPrice: number | null;
  source: string;
  listingType: string | null;
  sectionDetails: Record<string, unknown> | null;
  recordedAt: string;
}

export interface EventWithHistory extends Event {
  priceHistory: PriceHistory[];
}

class EventService {
  async search(filters: SearchEventsRequest): Promise<Event[]> {
    logger.debug({ filters }, 'Searching events');

    const supabase = getSupabase();
    let query = supabase
      .from('events')
      .select(`
        *,
        venue:venues(id, name, city, state)
      `)
      .eq('status', 'active')
      .gte('event_date', new Date().toISOString());

    if (filters.query) {
      query = query.ilike('artist_name', `%${filters.query}%`);
    }

    if (filters.genre) {
      query = query.ilike('genre', `%${filters.genre}%`);
    }

    if (filters.dateFrom) {
      query = query.gte('event_date', filters.dateFrom);
    }

    if (filters.dateTo) {
      query = query.lte('event_date', filters.dateTo);
    }

    const { data, error } = await query
      .order('event_date', { ascending: true })
      .range(filters.offset, filters.offset + filters.limit - 1);

    if (error) {
      logger.error({ error }, 'Failed to search events');
      throw error;
    }

    return (data || []).map(this.transformEvent);
  }

  async getById(id: string): Promise<Event> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        venue:venues(id, name, city, state)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundError('Event');
    }

    return this.transformEvent(data);
  }

  async getWithPriceHistory(id: string): Promise<EventWithHistory> {
    const event = await this.getById(id);

    const supabase = getSupabase();
    const { data: priceData, error } = await supabase
      .from('price_history')
      .select('*')
      .eq('event_id', id)
      .order('recorded_at', { ascending: true });

    if (error) {
      logger.error({ error }, 'Failed to fetch price history');
      throw error;
    }

    return {
      ...event,
      priceHistory: (priceData || []).map(this.transformPriceHistory),
    };
  }

  async getByArtist(artistName: string): Promise<Event[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        venue:venues(id, name, city, state)
      `)
      .ilike('artist_name', `%${artistName}%`)
      .eq('status', 'active')
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true });

    if (error) {
      logger.error({ error }, 'Failed to fetch artist events');
      throw error;
    }

    return (data || []).map(this.transformEvent);
  }

  private transformEvent(row: Record<string, unknown>): Event {
    return {
      id: row.id as string,
      externalId: row.external_id as string | null,
      artistName: row.artist_name as string,
      genre: row.genre as string | null,
      venueId: row.venue_id as string | null,
      eventDate: row.event_date as string,
      url: row.url as string | null,
      status: row.status as string,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
      venue: row.venue as Venue | null,
    };
  }

  private transformPriceHistory(row: Record<string, unknown>): PriceHistory {
    return {
      id: row.id as string,
      eventId: row.event_id as string,
      minPrice: row.min_price as number | null,
      maxPrice: row.max_price as number | null,
      avgPrice: row.avg_price as number | null,
      source: row.source as string,
      listingType: row.listing_type as string | null,
      sectionDetails: row.section_details as Record<string, unknown> | null,
      recordedAt: row.recorded_at as string,
    };
  }
}

export const eventService = new EventService();
