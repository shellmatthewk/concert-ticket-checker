import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { eventService, Event, EventWithHistory, PriceHistory } from '../../../backend/src/services/events.js';
import { getSupabase } from '../../../backend/src/db/client.js';
import { NotFoundError } from '../../../backend/src/api/middleware/errorHandler.js';

// Create a mock Supabase client
const mockSupabase = {
  from: vi.fn(),
};

// Mock the Supabase client
vi.mock('../../../backend/src/db/client.js', () => ({
  getSupabase: vi.fn(() => mockSupabase),
}));

describe('EventService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('search', () => {
    it('should return events matching artist query', async () => {
      const mockData = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          external_id: 'ext123',
          artist_name: 'Taylor Swift',
          genre: 'Pop',
          venue_id: 'venue1',
          event_date: '2026-06-15T19:00:00Z',
          url: 'https://example.com/event/1',
          status: 'active',
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
          venue: {
            id: 'venue1',
            name: 'Madison Square Garden',
            city: 'New York',
            state: 'NY',
          },
        },
      ];

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockGte = vi.fn().mockReturnThis();
      const mockIlike = vi.fn().mockReturnThis();
      const mockLte = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockReturnThis();
      const mockRange = vi.fn().mockResolvedValue({ data: mockData, error: null });

      (mockSupabase.from as Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        gte: mockGte,
        ilike: mockIlike,
        lte: mockLte,
        order: mockOrder,
        range: mockRange,
      });

      mockSelect.mockReturnValue({
        eq: mockEq,
        gte: mockGte,
        ilike: mockIlike,
        lte: mockLte,
        order: mockOrder,
        range: mockRange,
      });

      mockEq.mockReturnValue({
        gte: mockGte,
        ilike: mockIlike,
        lte: mockLte,
        order: mockOrder,
        range: mockRange,
      });

      mockGte.mockReturnValue({
        ilike: mockIlike,
        lte: mockLte,
        order: mockOrder,
        range: mockRange,
      });

      mockIlike.mockReturnValue({
        order: mockOrder,
        range: mockRange,
      });

      mockOrder.mockReturnValue({
        range: mockRange,
      });

      const results = await eventService.search({ query: 'Taylor Swift', limit: 20, offset: 0 });

      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBe(1);
      expect(results[0].artistName).toBe('Taylor Swift');
      expect(results[0].venue?.name).toBe('Madison Square Garden');
      expect(mockSupabase.from).toHaveBeenCalledWith('events');
    });

    it('should return empty array when no matches found', async () => {
      const mockRange = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockOrder = vi.fn().mockReturnValue({ range: mockRange });
      const mockIlike = vi.fn().mockReturnValue({ ilike: vi.fn().mockReturnThis(), order: mockOrder, range: mockRange });
      const mockEq = vi.fn().mockReturnValue({ ilike: mockIlike, gte: vi.fn().mockReturnThis(), order: mockOrder, range: mockRange });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      (mockSupabase.from as Mock).mockReturnValue({
        select: mockSelect,
      });

      const results = await eventService.search({ query: 'NonexistentArtist', limit: 20, offset: 0 });

      expect(results).toEqual([]);
    });

    it('should filter by genre when provided', async () => {
      const mockData = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          external_id: 'ext123',
          artist_name: 'Taylor Swift',
          genre: 'Pop',
          venue_id: 'venue1',
          event_date: '2026-06-15T19:00:00Z',
          url: 'https://example.com/event/1',
          status: 'active',
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
          venue: null,
        },
      ];

      const mockRange = vi.fn().mockResolvedValue({ data: mockData, error: null });
      const mockOrder = vi.fn().mockReturnValue({ range: mockRange });
      const mockIlike = vi.fn().mockReturnValue({ ilike: vi.fn().mockReturnThis(), order: mockOrder, range: mockRange });
      const mockEq = vi.fn().mockReturnValue({ ilike: mockIlike, gte: vi.fn().mockReturnThis(), order: mockOrder, range: mockRange });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      (mockSupabase.from as Mock).mockReturnValue({
        select: mockSelect,
      });

      const results = await eventService.search({ genre: 'Pop', limit: 20, offset: 0 });

      expect(results.length).toBe(1);
      expect(results[0].genre).toBe('Pop');
      expect(mockIlike).toHaveBeenCalledWith('genre', '%Pop%');
    });

    it('should filter by date range when provided', async () => {
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockGte = vi.fn().mockReturnThis();
      const mockLte = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockReturnThis();
      const mockRange = vi.fn().mockResolvedValue({ data: [], error: null });

      (mockSupabase.from as Mock).mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({ eq: mockEq });
      mockEq.mockReturnValue({ gte: mockGte });
      mockGte.mockReturnValue({ lte: mockLte });
      mockLte.mockReturnValue({ order: mockOrder });
      mockOrder.mockReturnValue({ range: mockRange });

      await eventService.search({
        dateFrom: '2026-03-01T00:00:00Z',
        dateTo: '2026-12-31T23:59:59Z',
        limit: 20,
        offset: 0,
      });

      expect(mockGte).toHaveBeenCalled();
      expect(mockLte).toHaveBeenCalledWith('event_date', '2026-12-31T23:59:59Z');
    });

    it('should throw error when database query fails', async () => {
      const mockError = new Error('Database connection failed');

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockGte = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockReturnThis();
      const mockRange = vi.fn().mockResolvedValue({ data: null, error: mockError });

      (mockSupabase.from as Mock).mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({ eq: mockEq });
      mockEq.mockReturnValue({ gte: mockGte });
      mockGte.mockReturnValue({ order: mockOrder });
      mockOrder.mockReturnValue({ range: mockRange });

      await expect(eventService.search({ limit: 20, offset: 0 })).rejects.toThrow();
    });

    it('should respect limit parameter', async () => {
      const mockRange = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockOrder = vi.fn().mockReturnValue({ range: mockRange });
      const mockEq = vi.fn().mockReturnValue({ ilike: vi.fn().mockReturnThis(), gte: vi.fn().mockReturnThis(), order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      (mockSupabase.from as Mock).mockReturnValue({
        select: mockSelect,
      });

      await eventService.search({ limit: 5, offset: 0 });

      expect(mockRange).toHaveBeenCalledWith(0, 4); // 0 to limit-1
    });

    it('should respect offset parameter', async () => {
      const mockRange = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockOrder = vi.fn().mockReturnValue({ range: mockRange });
      const mockEq = vi.fn().mockReturnValue({ ilike: vi.fn().mockReturnThis(), gte: vi.fn().mockReturnThis(), order: mockOrder });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

      (mockSupabase.from as Mock).mockReturnValue({
        select: mockSelect,
      });

      await eventService.search({ limit: 10, offset: 20 });

      expect(mockRange).toHaveBeenCalledWith(20, 29); // offset to offset+limit-1
    });
  });

  describe('getById', () => {
    it('should return event when found', async () => {
      const mockData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        external_id: 'ext123',
        artist_name: 'Beyonce',
        genre: 'R&B',
        venue_id: 'venue1',
        event_date: '2026-07-20T20:00:00Z',
        url: 'https://example.com/event/2',
        status: 'active',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
        venue: {
          id: 'venue1',
          name: 'Hollywood Bowl',
          city: 'Los Angeles',
          state: 'CA',
        },
      };

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: mockData, error: null });

      (mockSupabase.from as Mock).mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({ eq: mockEq });
      mockEq.mockReturnValue({ single: mockSingle });

      const result = await eventService.getById('123e4567-e89b-12d3-a456-426614174000');

      expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(result.artistName).toBe('Beyonce');
      expect(result.venue?.name).toBe('Hollywood Bowl');
    });

    it('should throw NotFoundError when event not found', async () => {
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } });

      (mockSupabase.from as Mock).mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({ eq: mockEq });
      mockEq.mockReturnValue({ single: mockSingle });

      await expect(
        eventService.getById('123e4567-e89b-12d3-a456-426614174000')
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when data is null', async () => {
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: null });

      (mockSupabase.from as Mock).mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({ eq: mockEq });
      mockEq.mockReturnValue({ single: mockSingle });

      await expect(
        eventService.getById('123e4567-e89b-12d3-a456-426614174000')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('getWithPriceHistory', () => {
    it('should return event with price history', async () => {
      const mockEventData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        external_id: 'ext123',
        artist_name: 'Taylor Swift',
        genre: 'Pop',
        venue_id: 'venue1',
        event_date: '2026-06-15T19:00:00Z',
        url: 'https://example.com/event/1',
        status: 'active',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
        venue: null,
      };

      const mockPriceData = [
        {
          id: 'price1',
          event_id: '123e4567-e89b-12d3-a456-426614174000',
          min_price: 100,
          max_price: 500,
          avg_price: 250,
          source: 'ticketmaster',
          listing_type: 'primary',
          section_details: { floor: { min: 150, max: 500 } },
          recorded_at: '2026-01-15T00:00:00Z',
        },
      ];

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: mockEventData, error: null });

      // Price history query chain - order returns an awaitable result
      const mockPriceOrder = vi.fn().mockResolvedValue({ data: mockPriceData, error: null });
      const mockPriceEq = vi.fn().mockReturnValue({ order: mockPriceOrder });
      const mockPriceSelect = vi.fn().mockReturnValue({ eq: mockPriceEq });

      (mockSupabase.from as Mock)
        .mockReturnValueOnce({
          select: mockSelect,
        })
        .mockReturnValueOnce({
          select: mockPriceSelect,
        });

      mockSelect.mockReturnValue({ eq: mockEq });
      mockEq.mockReturnValue({ single: mockSingle });

      const result = await eventService.getWithPriceHistory('123e4567-e89b-12d3-a456-426614174000');

      expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(result.priceHistory).toBeInstanceOf(Array);
      expect(result.priceHistory.length).toBe(1);
      expect(result.priceHistory[0].minPrice).toBe(100);
      expect(result.priceHistory[0].source).toBe('ticketmaster');
    });

    it('should return event with empty price history when none exists', async () => {
      const mockEventData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        external_id: 'ext123',
        artist_name: 'Taylor Swift',
        genre: 'Pop',
        venue_id: 'venue1',
        event_date: '2026-06-15T19:00:00Z',
        url: 'https://example.com/event/1',
        status: 'active',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
        venue: null,
      };

      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockSingle = vi.fn().mockResolvedValue({ data: mockEventData, error: null });
      const mockOrder = vi.fn().mockReturnThis();
      const mockPriceQuery = vi.fn().mockResolvedValue({ data: [], error: null });

      (mockSupabase.from as Mock)
        .mockReturnValueOnce({
          select: mockSelect,
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: mockOrder,
            }),
          }),
        });

      mockSelect.mockReturnValue({ eq: mockEq });
      mockEq.mockReturnValue({ single: mockSingle });
      mockOrder.mockReturnValue(mockPriceQuery);

      const result = await eventService.getWithPriceHistory('123e4567-e89b-12d3-a456-426614174000');

      expect(result.priceHistory).toEqual([]);
    });
  });

  describe('getByArtist', () => {
    it('should return all events for an artist', async () => {
      const mockData = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          external_id: 'ext123',
          artist_name: 'Taylor Swift',
          genre: 'Pop',
          venue_id: 'venue1',
          event_date: '2026-06-15T19:00:00Z',
          url: 'https://example.com/event/1',
          status: 'active',
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
          venue: {
            id: 'venue1',
            name: 'Madison Square Garden',
            city: 'New York',
            state: 'NY',
          },
        },
        {
          id: '223e4567-e89b-12d3-a456-426614174000',
          external_id: 'ext124',
          artist_name: 'Taylor Swift',
          genre: 'Pop',
          venue_id: 'venue2',
          event_date: '2026-07-20T19:00:00Z',
          url: 'https://example.com/event/2',
          status: 'active',
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
          venue: {
            id: 'venue2',
            name: 'Hollywood Bowl',
            city: 'Los Angeles',
            state: 'CA',
          },
        },
      ];

      const mockSelect = vi.fn().mockReturnThis();
      const mockIlike = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockGte = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({ data: mockData, error: null });

      (mockSupabase.from as Mock).mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({ ilike: mockIlike });
      mockIlike.mockReturnValue({ eq: mockEq });
      mockEq.mockReturnValue({ gte: mockGte });
      mockGte.mockReturnValue({ order: mockOrder });

      const results = await eventService.getByArtist('Taylor Swift');

      expect(results.length).toBe(2);
      expect(results[0].artistName).toBe('Taylor Swift');
      expect(results[1].artistName).toBe('Taylor Swift');
      expect(mockIlike).toHaveBeenCalledWith('artist_name', '%Taylor Swift%');
    });

    it('should return empty array when artist has no events', async () => {
      const mockSelect = vi.fn().mockReturnThis();
      const mockIlike = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockGte = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });

      (mockSupabase.from as Mock).mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({ ilike: mockIlike });
      mockIlike.mockReturnValue({ eq: mockEq });
      mockEq.mockReturnValue({ gte: mockGte });
      mockGte.mockReturnValue({ order: mockOrder });

      const results = await eventService.getByArtist('NonexistentArtist');

      expect(results).toEqual([]);
    });

    it('should throw error when database query fails', async () => {
      const mockError = new Error('Database error');

      const mockSelect = vi.fn().mockReturnThis();
      const mockIlike = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockGte = vi.fn().mockReturnThis();
      const mockOrder = vi.fn().mockResolvedValue({ data: null, error: mockError });

      (mockSupabase.from as Mock).mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({ ilike: mockIlike });
      mockIlike.mockReturnValue({ eq: mockEq });
      mockEq.mockReturnValue({ gte: mockGte });
      mockGte.mockReturnValue({ order: mockOrder });

      await expect(eventService.getByArtist('Taylor Swift')).rejects.toThrow();
    });
  });
});
