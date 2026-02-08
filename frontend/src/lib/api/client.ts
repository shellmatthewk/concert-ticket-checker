const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  data: T;
  count?: number;
  error?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Events
  searchEvents: (params: Record<string, string | number | undefined>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    return fetchApi<Event[]>(`/api/events?${searchParams}`);
  },

  getEvent: (id: string) => fetchApi<Event>(`/api/events/${id}`),

  getEventPrices: (id: string) => fetchApi<EventWithHistory>(`/api/events/${id}/prices`),

  // Artists
  getArtistEvents: (name: string) => fetchApi<Event[]>(`/api/artists/${encodeURIComponent(name)}/events`),

  // Venues
  searchVenues: (params: Record<string, string | number | undefined>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    return fetchApi<Venue[]>(`/api/venues?${searchParams}`);
  },

  getNearbyVenues: (lat: number, lon: number, radius?: number) =>
    fetchApi<Venue[]>(`/api/venues/nearby?lat=${lat}&lon=${lon}${radius ? `&radius=${radius}` : ''}`),

  // Health
  health: () => fetchApi<{ status: string }>('/api/health'),
};

// Types
export interface Venue {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  timezone: string | null;
  createdAt: string;
}

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
