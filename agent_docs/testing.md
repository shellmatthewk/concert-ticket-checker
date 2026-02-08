# Testing Strategy

## Overview
- **Unit Tests:** Vitest for services and utilities
- **Component Tests:** React Testing Library
- **E2E Tests:** Playwright for critical user journeys
- **Manual Checks:** Pre-deployment verification

---

## Test Commands

```bash
# Run all tests
npm test

# Watch mode (development)
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e

# Specific test file
npm test -- EventService.test.ts
```

---

## Unit Testing

### Service Tests
```typescript
// services/__tests__/eventService.test.ts
import { describe, it, expect, vi } from 'vitest';
import { eventService } from '../events';

describe('EventService', () => {
  describe('search', () => {
    it('should return events matching artist query', async () => {
      const results = await eventService.search({ query: 'Taylor Swift' });

      expect(results).toBeInstanceOf(Array);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty('artistName');
    });

    it('should return empty array for no matches', async () => {
      const results = await eventService.search({ query: 'xyznonexistent' });

      expect(results).toEqual([]);
    });

    it('should respect limit parameter', async () => {
      const results = await eventService.search({ limit: 5 });

      expect(results.length).toBeLessThanOrEqual(5);
    });
  });
});
```

### Utility Tests
```typescript
// lib/__tests__/formatPrice.test.ts
import { describe, it, expect } from 'vitest';
import { formatPrice } from '../utils/formatPrice';

describe('formatPrice', () => {
  it('formats whole numbers', () => {
    expect(formatPrice(100)).toBe('$100.00');
  });

  it('formats decimals', () => {
    expect(formatPrice(99.99)).toBe('$99.99');
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });
});
```

---

## Component Testing

```typescript
// components/__tests__/EventCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EventCard } from '../EventCard';

const mockEvent = {
  id: '1',
  artistName: 'Beyonce',
  venue: { name: 'Madison Square Garden', city: 'New York' },
  eventDate: new Date('2026-03-15'),
  currentMinPrice: 150,
};

describe('EventCard', () => {
  it('renders event information', () => {
    render(<EventCard event={mockEvent} />);

    expect(screen.getByText('Beyonce')).toBeInTheDocument();
    expect(screen.getByText('Madison Square Garden')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<EventCard event={mockEvent} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('article'));

    expect(onSelect).toHaveBeenCalledWith(mockEvent);
  });
});
```

---

## E2E Testing (Playwright)

```typescript
// e2e/search.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Event Search', () => {
  test('user can search for an artist', async ({ page }) => {
    await page.goto('/');

    // Search for artist
    await page.fill('[data-testid=search-input]', 'Beyonce');
    await page.click('[data-testid=search-button]');

    // Verify results appear
    await expect(page.locator('[data-testid=event-card]')).toBeVisible();
    await expect(page.locator('[data-testid=event-card]').first()).toContainText('Beyonce');
  });

  test('user can view event details', async ({ page }) => {
    await page.goto('/');

    // Search and click result
    await page.fill('[data-testid=search-input]', 'Beyonce');
    await page.click('[data-testid=search-button]');
    await page.click('[data-testid=event-card]:first-child');

    // Verify detail page
    await expect(page).toHaveURL(/\/event\/.+/);
    await expect(page.locator('[data-testid=price-chart]')).toBeVisible();
  });

  test('user can compare tour dates', async ({ page }) => {
    await page.goto('/artist/beyonce');

    // Verify comparison view
    await expect(page.locator('[data-testid=venue-comparison]')).toBeVisible();
    await expect(page.locator('[data-testid=venue-row]').count()).toBeGreaterThan(1);
  });
});
```

---

## Pre-Commit Hooks

### Setup (using Husky + lint-staged)
```bash
npm install -D husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

### Configuration (package.json)
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{ts,tsx,test.ts}": [
      "vitest related --run"
    ]
  }
}
```

### What Runs Before Each Commit
1. ESLint fix on staged files
2. Prettier format on staged files
3. Related tests for changed files

---

## Verification Loop

After implementing each feature:

1. **Type Check**
   ```bash
   npm run typecheck
   ```

2. **Lint**
   ```bash
   npm run lint
   ```

3. **Run Tests**
   ```bash
   npm test
   ```

4. **Manual Verification**
   - Open in browser
   - Test the specific feature
   - Check console for errors
   - Test on mobile viewport

5. **If All Pass** → Commit
6. **If Any Fail** → Fix before proceeding

---

## Test Coverage Targets

| Area | Target | Priority |
|------|--------|----------|
| Services | 80% | High |
| Utilities | 90% | High |
| API Routes | 70% | Medium |
| Components | 60% | Medium |
| E2E Flows | 3-5 critical paths | High |

---

## Manual Testing Checklist

### Before Deployment
- [ ] Search returns results
- [ ] Event detail page loads with price chart
- [ ] Cross-venue comparison works
- [ ] Nearby search finds venues
- [ ] Mobile responsive layout works
- [ ] No console errors
- [ ] Page loads under 2 seconds
- [ ] Screen reader can navigate

### After Deployment
- [ ] Production URL loads
- [ ] Search works with real data
- [ ] No CORS errors
- [ ] SSL certificate valid
- [ ] Analytics tracking (if configured)
