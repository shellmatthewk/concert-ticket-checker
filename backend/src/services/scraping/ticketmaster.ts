import { config } from '../../config/index.js';
import { getSupabase } from '../../db/client.js';
import { logger } from '../../utils/logger.js';

const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

interface TicketmasterEvent {
  id: string;
  name: string;
  url: string;
  dates: {
    start: {
      dateTime: string;
      localDate: string;
    };
  };
  classifications?: Array<{
    genre?: { name: string };
  }>;
  priceRanges?: Array<{
    min: number;
    max: number;
  }>;
  _embedded?: {
    venues?: Array<{
      id: string;
      name: string;
      city?: { name: string };
      state?: { stateCode: string };
      location?: {
        latitude: string;
        longitude: string;
      };
      timezone?: string;
    }>;
    attractions?: Array<{
      name: string;
    }>;
  };
}

interface TicketmasterResponse {
  _embedded?: {
    events: TicketmasterEvent[];
  };
  page: {
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export class TicketmasterService {
  private apiKey: string;

  constructor() {
    this.apiKey = config.apis.ticketmaster.apiKey;
    if (!this.apiKey) {
      logger.warn('Ticketmaster API key not configured');
    }
  }

  async fetchEvents(options: {
    keyword?: string;
    city?: string;
    stateCode?: string;
    size?: number;
    page?: number;
  } = {}): Promise<TicketmasterEvent[]> {
    const params = new URLSearchParams({
      apikey: this.apiKey,
      classificationName: 'music',
      size: String(options.size || 50),
      page: String(options.page || 0),
      sort: 'date,asc',
    });

    if (options.keyword) params.append('keyword', options.keyword);
    if (options.city) params.append('city', options.city);
    if (options.stateCode) params.append('stateCode', options.stateCode);

    const url = `${BASE_URL}/events.json?${params}`;
    logger.info({ url: url.replace(this.apiKey, '***') }, 'Fetching from Ticketmaster');

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ticketmaster API error: ${response.status}`);
    }

    const data: TicketmasterResponse = await response.json();
    return data._embedded?.events || [];
  }

  async syncEvents(options: {
    keyword?: string;
    city?: string;
    stateCode?: string;
    maxPages?: number;
  } = {}): Promise<{ venuesCreated: number; eventsCreated: number; pricesRecorded: number }> {
    const supabase = getSupabase();
    let venuesCreated = 0;
    let eventsCreated = 0;
    let pricesRecorded = 0;

    const maxPages = options.maxPages || 1;

    for (let page = 0; page < maxPages; page++) {
      const events = await this.fetchEvents({ ...options, page });

      if (events.length === 0) break;

      for (const tmEvent of events) {
        try {
          // Upsert venue
          const venue = tmEvent._embedded?.venues?.[0];
          let venueId: string | null = null;

          if (venue) {
            const { data: existingVenue } = await supabase
              .from('venues')
              .select('id')
              .eq('name', venue.name)
              .eq('city', venue.city?.name || '')
              .single();

            if (existingVenue) {
              venueId = existingVenue.id;
            } else {
              const lat = venue.location?.latitude ? parseFloat(venue.location.latitude) : null;
              const lon = venue.location?.longitude ? parseFloat(venue.location.longitude) : null;

              const { data: newVenue, error: venueError } = await supabase
                .from('venues')
                .insert({
                  name: venue.name,
                  city: venue.city?.name || null,
                  state: venue.state?.stateCode || null,
                  location: lat && lon ? `POINT(${lon} ${lat})` : null,
                  timezone: venue.timezone || null,
                })
                .select('id')
                .single();

              if (venueError) {
                logger.error({ error: venueError }, 'Failed to insert venue');
              } else if (newVenue) {
                venueId = newVenue.id;
                venuesCreated++;
              }
            }
          }

          // Upsert event
          const artistName = tmEvent._embedded?.attractions?.[0]?.name || tmEvent.name;
          const genre = tmEvent.classifications?.[0]?.genre?.name || null;

          const { data: existingEvent } = await supabase
            .from('events')
            .select('id')
            .eq('external_id', tmEvent.id)
            .single();

          let eventId: string;

          if (existingEvent) {
            eventId = existingEvent.id;
          } else {
            const { data: newEvent, error: eventError } = await supabase
              .from('events')
              .insert({
                external_id: tmEvent.id,
                artist_name: artistName,
                genre,
                venue_id: venueId,
                event_date: tmEvent.dates.start.dateTime || tmEvent.dates.start.localDate,
                url: tmEvent.url,
                status: 'active',
              })
              .select('id')
              .single();

            if (eventError) {
              logger.error({ error: eventError, event: tmEvent.name }, 'Failed to insert event');
              continue;
            }
            eventId = newEvent!.id;
            eventsCreated++;
          }

          // Record price if available
          if (tmEvent.priceRanges && tmEvent.priceRanges.length > 0) {
            const priceRange = tmEvent.priceRanges[0];
            const { error: priceError } = await supabase
              .from('price_history')
              .insert({
                event_id: eventId,
                min_price: priceRange.min,
                max_price: priceRange.max,
                avg_price: (priceRange.min + priceRange.max) / 2,
                source: 'Ticketmaster',
                listing_type: 'primary',
              });

            if (priceError) {
              logger.error({ error: priceError }, 'Failed to insert price');
            } else {
              pricesRecorded++;
            }
          }
        } catch (err) {
          logger.error({ error: err, event: tmEvent.name }, 'Error processing event');
        }
      }

      // Rate limit: wait 200ms between pages
      if (page < maxPages - 1) {
        await new Promise(r => setTimeout(r, 200));
      }
    }

    logger.info({ venuesCreated, eventsCreated, pricesRecorded }, 'Sync complete');
    return { venuesCreated, eventsCreated, pricesRecorded };
  }
}

export const ticketmasterService = new TicketmasterService();
