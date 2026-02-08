import { describe, it, expect } from 'vitest';
import { SearchEventsSchema, GetEventSchema, GetArtistEventsSchema } from '../../../backend/src/api/validators/events.js';

describe('Event Validators', () => {
  describe('SearchEventsSchema', () => {
    it('should validate valid search request with all fields', () => {
      const validData = {
        query: 'Taylor Swift',
        lat: 40.7128,
        lon: -74.0060,
        radius: 50,
        dateFrom: '2026-03-01T00:00:00Z',
        dateTo: '2026-12-31T23:59:59Z',
        genre: 'Pop',
        limit: 20,
        offset: 0,
      };

      const result = SearchEventsSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.query).toBe('Taylor Swift');
        expect(result.data.lat).toBe(40.7128);
        expect(result.data.lon).toBe(-74.0060);
        expect(result.data.radius).toBe(50);
      }
    });

    it('should validate search request with only query', () => {
      const validData = {
        query: 'Beyonce',
      };

      const result = SearchEventsSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.query).toBe('Beyonce');
        expect(result.data.limit).toBe(20); // default
        expect(result.data.offset).toBe(0); // default
        expect(result.data.radius).toBe(50); // default
      }
    });

    it('should coerce string numbers to numbers for lat/lon', () => {
      const data = {
        lat: '40.7128',
        lon: '-74.0060',
      };

      const result = SearchEventsSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.lat).toBe('number');
        expect(typeof result.data.lon).toBe('number');
        expect(result.data.lat).toBe(40.7128);
        expect(result.data.lon).toBe(-74.0060);
      }
    });

    it('should reject invalid latitude (> 90)', () => {
      const invalidData = {
        lat: 91,
        lon: -74.0060,
      };

      const result = SearchEventsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid latitude (< -90)', () => {
      const invalidData = {
        lat: -91,
        lon: -74.0060,
      };

      const result = SearchEventsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid longitude (> 180)', () => {
      const invalidData = {
        lat: 40,
        lon: 181,
      };

      const result = SearchEventsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid longitude (< -180)', () => {
      const invalidData = {
        lat: 40,
        lon: -181,
      };

      const result = SearchEventsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject radius less than 1', () => {
      const invalidData = {
        radius: 0,
      };

      const result = SearchEventsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject radius greater than 500', () => {
      const invalidData = {
        radius: 501,
      };

      const result = SearchEventsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject limit less than 1', () => {
      const invalidData = {
        limit: 0,
      };

      const result = SearchEventsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject limit greater than 100', () => {
      const invalidData = {
        limit: 101,
      };

      const result = SearchEventsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject negative offset', () => {
      const invalidData = {
        offset: -1,
      };

      const result = SearchEventsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid datetime format for dateFrom', () => {
      const invalidData = {
        dateFrom: 'not-a-date',
      };

      const result = SearchEventsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept valid ISO datetime for dateFrom', () => {
      const validData = {
        dateFrom: '2026-03-01T00:00:00Z',
      };

      const result = SearchEventsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept valid ISO datetime for dateTo', () => {
      const validData = {
        dateTo: '2026-12-31T23:59:59Z',
      };

      const result = SearchEventsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept empty object and apply defaults', () => {
      const result = SearchEventsSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(20);
        expect(result.data.offset).toBe(0);
        expect(result.data.radius).toBe(50);
      }
    });
  });

  describe('GetEventSchema', () => {
    it('should validate valid UUID', () => {
      const validData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = GetEventSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      }
    });

    it('should reject non-UUID string', () => {
      const invalidData = {
        id: 'not-a-uuid',
      };

      const result = GetEventSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject number instead of string', () => {
      const invalidData = {
        id: 123,
      };

      const result = GetEventSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty string', () => {
      const invalidData = {
        id: '',
      };

      const result = GetEventSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing id field', () => {
      const invalidData = {};

      const result = GetEventSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('GetArtistEventsSchema', () => {
    it('should validate valid artist name', () => {
      const validData = {
        name: 'Taylor Swift',
      };

      const result = GetArtistEventsSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Taylor Swift');
      }
    });

    it('should validate single character name', () => {
      const validData = {
        name: 'A',
      };

      const result = GetArtistEventsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty string', () => {
      const invalidData = {
        name: '',
      };

      const result = GetArtistEventsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing name field', () => {
      const invalidData = {};

      const result = GetArtistEventsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept name with special characters', () => {
      const validData = {
        name: "Guns N' Roses",
      };

      const result = GetArtistEventsSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Guns N' Roses");
      }
    });
  });
});
