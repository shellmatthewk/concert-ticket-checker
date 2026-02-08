# Product Requirements — ConcertDaddy MVP

## Problem Statement
Concert ticket pricing is opaque and volatile. Dynamic pricing on primary platforms can increase costs 300%+ within minutes. Secondary markets add 200-500% markups. Fans lack tools to compare prices across sources or understand if they're getting a fair deal.

## User Stories

### Primary
> "As an avid music lover, I want to find cheaper concert prices so that I can experience different genres of music"

### Supporting
1. "As a poor college student, I want to see the best deals on tickets so that I can go with my friends"
2. "As a data analyst, I want to track ticket prices so that I can calculate drift in location and seasons"
3. "As a concertgoer, I want to compare the same artist across venues so that I can find the best value"

---

## Features

### Must Have (P0 — MVP)
| Feature | Description | Acceptance Criteria |
|---------|-------------|---------------------|
| Event Search | Search by artist, venue, or location | Results in <500ms, autocomplete support |
| Cross-Venue Comparison | Compare prices for same artist across venues/cities | Shows all tour dates with min/max prices |
| Price History | Historical price tracking from initial availability | Chart visualization, daily snapshots stored |
| Nearby Search | Find events near user location | PostGIS-powered, configurable radius |

### Should Have (P1)
| Feature | Description |
|---------|-------------|
| Similar Price Comparison | Show tickets in same price range at same event |
| Resale Listings | Display current resale prices alongside primary |

### Could Have (P2)
| Feature | Description |
|---------|-------------|
| Price Alerts | Notify when price drops below threshold |
| Tab Notifications | Browser tab updates when watching event |

### Won't Have (Not in MVP)
- Stadium seating diagrams
- User accounts / authentication
- Mobile native app

---

## Success Metrics

### Coverage Target
- At least 10 concerts per major US city
- Smaller/regional venues represented
- Data freshness: prices updated hourly

### Quality Metrics
- Search response time < 500ms
- Page load < 2 seconds
- Zero critical bugs at launch

---

## UI/UX Requirements

### Design Principles
1. **Speed first** — Users find prices in seconds
2. **Clarity** — Prices clearly labeled with source and fees
3. **Comparison-focused** — Easy side-by-side viewing

### Key Screens
1. **Home / Search** — Search bar, trending events
2. **Search Results** — Event list with filters
3. **Event Detail** — Price listings, history chart, similar prices
4. **Artist Tour View** — All venues comparison

### Accessibility
- WCAG 2.1 AA compliance
- Screen reader compatible
- Keyboard navigation support

---

## Technical Constraints

### Budget
- $0-7/month for infrastructure
- Free tier services only

### Performance
- Instant database queries (indexed)
- Aggressive caching (5 min TTL)

### Security
- No user accounts (no PII stored)
- API keys in environment variables only
- CORS whitelist for production domain

### Scalability
- Designed for hundreds of venues nationwide
- Vercel auto-scaling for frontend
- Render for backend with sleep-prevention if needed

---

## Scope Boundaries

### In Scope
- Row/section details for listings
- Artist and genre information
- Nearby area/venue search
- Price comparison across sources

### Out of Scope
- Ticket purchasing (external links only)
- Stadium seating maps
- User accounts and personalization
- Mobile native applications
