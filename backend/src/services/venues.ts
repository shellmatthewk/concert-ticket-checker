import { getSupabase } from '../db/client.js';
import { logger } from '../utils/logger.js';
import { NotFoundError } from '../api/middleware/errorHandler.js';
import type { SearchVenuesRequest } from '../api/validators/venues.js';

export interface Venue {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  timezone: string | null;
  createdAt: string;
}

class VenueService {
  async search(filters: SearchVenuesRequest): Promise<Venue[]> {
    logger.debug({ filters }, 'Searching venues');

    // If lat/lon provided, use geo search
    if (filters.lat !== undefined && filters.lon !== undefined) {
      return this.searchNearby(filters.lat, filters.lon, filters.radius, filters.limit);
    }

    const supabase = getSupabase();
    let query = supabase.from('venues').select('*');

    if (filters.query) {
      query = query.or(`name.ilike.%${filters.query}%,city.ilike.%${filters.query}%`);
    }

    const { data, error } = await query
      .order('name', { ascending: true })
      .range(filters.offset, filters.offset + filters.limit - 1);

    if (error) {
      logger.error({ error }, 'Failed to search venues');
      throw error;
    }

    return (data || []).map(this.transformVenue);
  }

  async searchNearby(lat: number, lon: number, radiusMiles: number = 50, limit: number = 20): Promise<Venue[]> {
    const supabase = getSupabase();
    const radiusMeters = radiusMiles * 1609.34; // Convert miles to meters

    const { data, error } = await supabase.rpc('get_venues_nearby', {
      user_lat: lat,
      user_lon: lon,
      dist_meters: radiusMeters,
    });

    if (error) {
      logger.error({ error }, 'Failed to search nearby venues');
      throw error;
    }

    return (data || []).slice(0, limit).map(this.transformVenue);
  }

  async getById(id: string): Promise<Venue> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundError('Venue');
    }

    return this.transformVenue(data);
  }

  private transformVenue(row: Record<string, unknown>): Venue {
    return {
      id: row.id as string,
      name: row.name as string,
      city: row.city as string | null,
      state: row.state as string | null,
      timezone: row.timezone as string | null,
      createdAt: row.created_at as string,
    };
  }
}

export const venueService = new VenueService();
