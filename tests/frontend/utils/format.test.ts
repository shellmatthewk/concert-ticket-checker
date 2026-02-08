import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { formatPrice, formatDate, formatTime, formatDateTime, formatRelativeDate } from '../../../frontend/src/lib/utils/format';

describe('Format Utilities', () => {
  describe('formatPrice', () => {
    it('should format whole numbers correctly', () => {
      expect(formatPrice(100)).toBe('$100');
    });

    it('should format large numbers correctly', () => {
      expect(formatPrice(1500)).toBe('$1,500');
    });

    it('should format very large numbers correctly', () => {
      expect(formatPrice(1000000)).toBe('$1,000,000');
    });

    it('should round decimals to nearest dollar', () => {
      expect(formatPrice(99.99)).toBe('$100');
    });

    it('should round down when < 0.5', () => {
      expect(formatPrice(99.49)).toBe('$99');
    });

    it('should handle zero correctly', () => {
      expect(formatPrice(0)).toBe('$0');
    });

    it('should handle null by returning N/A', () => {
      expect(formatPrice(null)).toBe('N/A');
    });

    it('should handle undefined by returning N/A', () => {
      expect(formatPrice(undefined)).toBe('N/A');
    });

    it('should format small positive numbers', () => {
      expect(formatPrice(1)).toBe('$1');
    });

    it('should handle decimal values less than 1', () => {
      expect(formatPrice(0.99)).toBe('$1');
    });
  });

  describe('formatDate', () => {
    it('should format date in correct format', () => {
      const date = '2026-03-15T19:30:00Z';
      const result = formatDate(date);

      // Result should contain month, day, and year
      expect(result).toMatch(/Mar/);
      expect(result).toMatch(/15/);
      expect(result).toMatch(/2026/);
    });

    it('should include weekday in format', () => {
      const date = '2026-03-15T19:30:00Z'; // Sunday
      const result = formatDate(date);

      // Should include weekday abbreviation
      expect(result).toMatch(/Sun/);
    });

    it('should handle January dates', () => {
      // Use midday UTC to avoid timezone-related day boundary issues
      const date = '2026-01-01T18:00:00Z';
      const result = formatDate(date);

      expect(result).toMatch(/Jan/);
      expect(result).toMatch(/1/);
      expect(result).toMatch(/2026/);
    });

    it('should handle December dates', () => {
      const date = '2026-12-31T23:59:59Z';
      const result = formatDate(date);

      expect(result).toMatch(/Dec/);
      expect(result).toMatch(/31/);
      expect(result).toMatch(/2026/);
    });

    it('should handle leap year dates', () => {
      const date = '2024-02-29T12:00:00Z';
      const result = formatDate(date);

      expect(result).toMatch(/Feb/);
      expect(result).toMatch(/29/);
      expect(result).toMatch(/2024/);
    });
  });

  describe('formatTime', () => {
    it('should format time in 12-hour format', () => {
      const date = '2026-03-15T19:30:00Z';
      const result = formatTime(date);

      // Should include hour and minute
      expect(result).toMatch(/\d{1,2}:\d{2}/);
      // Should include AM or PM
      expect(result).toMatch(/AM|PM/);
    });

    it('should format morning time with AM', () => {
      const date = '2026-03-15T09:15:00Z';
      const result = formatTime(date);

      expect(result).toMatch(/AM/);
    });

    it('should format evening time with PM', () => {
      const date = '2026-03-15T21:45:00Z';
      const result = formatTime(date);

      expect(result).toMatch(/PM/);
    });

    it('should format afternoon time with PM', () => {
      // Use 23:00 UTC which is afternoon/evening in all US timezones
      const date = '2026-03-15T23:00:00Z';
      const result = formatTime(date);

      expect(result).toMatch(/PM/);
    });

    it('should format early morning time with AM', () => {
      // Use 14:00 UTC which is early morning in all US timezones
      const date = '2026-03-15T14:00:00Z';
      const result = formatTime(date);

      expect(result).toMatch(/AM/);
    });

    it('should pad minutes with zero when needed', () => {
      const date = '2026-03-15T14:05:00Z';
      const result = formatTime(date);

      expect(result).toMatch(/05/);
    });
  });

  describe('formatDateTime', () => {
    it('should combine date and time with "at"', () => {
      const date = '2026-03-15T19:30:00Z';
      const result = formatDateTime(date);

      expect(result).toMatch(/at/);
      expect(result).toMatch(/Mar/);
      expect(result).toMatch(/15/);
      expect(result).toMatch(/2026/);
    });

    it('should include both date and time components', () => {
      const date = '2026-03-15T14:30:00Z';
      const result = formatDateTime(date);

      // Should have date part
      expect(result).toMatch(/2026/);
      // Should have time part with AM/PM
      expect(result).toMatch(/AM|PM/);
      // Should have connector
      expect(result).toContain('at');
    });
  });

  describe('formatRelativeDate', () => {
    // Note: These tests may be time-dependent. We're testing the logic.

    it('should return "Today" for current date', () => {
      const now = new Date();
      const today = now.toISOString();
      const result = formatRelativeDate(today);

      expect(result).toBe('Today');
    });

    it('should return "Tomorrow" for next day', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = formatRelativeDate(tomorrow.toISOString());

      expect(result).toBe('Tomorrow');
    });

    it('should return "In X days" for dates within a week', () => {
      const future = new Date();
      future.setDate(future.getDate() + 3);
      const result = formatRelativeDate(future.toISOString());

      expect(result).toMatch(/In \d+ days/);
    });

    it('should return "In X weeks" for dates within a month', () => {
      const future = new Date();
      future.setDate(future.getDate() + 14); // 2 weeks
      const result = formatRelativeDate(future.toISOString());

      expect(result).toMatch(/In \d+ weeks?/);
    });

    it('should return formatted date for dates beyond a month', () => {
      const future = new Date();
      future.setDate(future.getDate() + 60); // ~2 months
      const result = formatRelativeDate(future.toISOString());

      // Should return full date format, not relative
      expect(result).toMatch(/202\d/); // Should contain year
      expect(result).not.toMatch(/In/);
    });

    it('should handle dates exactly 7 days away', () => {
      const future = new Date();
      future.setDate(future.getDate() + 7);
      const result = formatRelativeDate(future.toISOString());

      // Could be "In 7 days" or "In 1 weeks" depending on implementation
      expect(result).toMatch(/In (7 days|1 weeks)/);
    });

    it('should handle dates exactly 30 days away', () => {
      const future = new Date();
      future.setDate(future.getDate() + 30);
      const result = formatRelativeDate(future.toISOString());

      // At 30 days, should still be in weeks format or switch to date
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
