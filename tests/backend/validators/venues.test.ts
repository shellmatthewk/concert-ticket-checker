import { describe, it, expect } from 'vitest';
import { SearchVenuesSchema, GetVenueSchema } from '../../../backend/src/api/validators/venues.js';

describe('Venue Validators', () => {
  describe('SearchVenuesSchema', () => {
    it('should validate valid search request with all fields', () => {
      const validData = {
        query: 'Madison Square Garden',
        lat: 40.7505,
        lon: -73.9934,
        radius: 25,
        limit: 10,
        offset: 5,
      };

      const result = SearchVenuesSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.query).toBe('Madison Square Garden');
        expect(result.data.lat).toBe(40.7505);
        expect(result.data.lon).toBe(-73.9934);
        expect(result.data.radius).toBe(25);
        expect(result.data.limit).toBe(10);
        expect(result.data.offset).toBe(5);
      }
    });

    it('should validate search request with only query', () => {
      const validData = {
        query: 'Hollywood Bowl',
      };

      const result = SearchVenuesSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.query).toBe('Hollywood Bowl');
        expect(result.data.limit).toBe(20); // default
        expect(result.data.offset).toBe(0); // default
        expect(result.data.radius).toBe(50); // default
      }
    });

    it('should validate search request with lat/lon only', () => {
      const validData = {
        lat: 34.1122,
        lon: -118.3387,
      };

      const result = SearchVenuesSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.lat).toBe(34.1122);
        expect(result.data.lon).toBe(-118.3387);
      }
    });

    it('should coerce string numbers to numbers', () => {
      const data = {
        lat: '40.7505',
        lon: '-73.9934',
        radius: '30',
        limit: '15',
        offset: '10',
      };

      const result = SearchVenuesSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.lat).toBe('number');
        expect(typeof result.data.lon).toBe('number');
        expect(typeof result.data.radius).toBe('number');
        expect(typeof result.data.limit).toBe('number');
        expect(typeof result.data.offset).toBe('number');
        expect(result.data.lat).toBe(40.7505);
        expect(result.data.radius).toBe(30);
      }
    });

    it('should reject invalid latitude (> 90)', () => {
      const invalidData = {
        lat: 91,
        lon: -73.9934,
      };

      const result = SearchVenuesSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid latitude (< -90)', () => {
      const invalidData = {
        lat: -91,
        lon: -73.9934,
      };

      const result = SearchVenuesSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid longitude (> 180)', () => {
      const invalidData = {
        lat: 40,
        lon: 181,
      };

      const result = SearchVenuesSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid longitude (< -180)', () => {
      const invalidData = {
        lat: 40,
        lon: -181,
      };

      const result = SearchVenuesSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject radius less than 1', () => {
      const invalidData = {
        radius: 0,
      };

      const result = SearchVenuesSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject radius greater than 500', () => {
      const invalidData = {
        radius: 501,
      };

      const result = SearchVenuesSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject limit less than 1', () => {
      const invalidData = {
        limit: 0,
      };

      const result = SearchVenuesSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject limit greater than 100', () => {
      const invalidData = {
        limit: 101,
      };

      const result = SearchVenuesSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject negative offset', () => {
      const invalidData = {
        offset: -1,
      };

      const result = SearchVenuesSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept empty object and apply defaults', () => {
      const result = SearchVenuesSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(20);
        expect(result.data.offset).toBe(0);
        expect(result.data.radius).toBe(50);
      }
    });

    it('should accept only lat without lon (both are independent)', () => {
      const data = {
        lat: 40.7505,
      };

      const result = SearchVenuesSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept only lon without lat (both are independent)', () => {
      const data = {
        lon: -73.9934,
      };

      const result = SearchVenuesSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('GetVenueSchema', () => {
    it('should validate valid UUID', () => {
      const validData = {
        id: '550e8400-e29b-41d4-a716-446655440000',
      };

      const result = GetVenueSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      }
    });

    it('should reject non-UUID string', () => {
      const invalidData = {
        id: 'not-a-uuid',
      };

      const result = GetVenueSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject number instead of string', () => {
      const invalidData = {
        id: 12345,
      };

      const result = GetVenueSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty string', () => {
      const invalidData = {
        id: '',
      };

      const result = GetVenueSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing id field', () => {
      const invalidData = {};

      const result = GetVenueSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject partial UUID', () => {
      const invalidData = {
        id: '550e8400-e29b',
      };

      const result = GetVenueSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
