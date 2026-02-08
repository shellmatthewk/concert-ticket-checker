# Product Requirements Document: ConcertDaddy MVP

## Executive Summary

**Product:** ConcertDaddy
**Version:** MVP (1.0)
**Document Status:** Draft
**Last Updated:** 2026-02-07

### Product Vision
ConcertDaddy empowers concertgoers with transparent, aggregated ticket pricing data across multiple sources, enabling faster and smarter purchasing decisions. By providing price history and cross-venue comparisons, it addresses the information asymmetry that currently favors scalpers and large platforms.

### Success Criteria
- Coverage of at least 10 concerts per major US city
- Smaller/regional venues also represented
- Functional price history tracking from ticket availability

## Problem Statement

### Problem Definition
Concert ticket pricing is opaque and volatile. Dynamic pricing on primary platforms can increase costs 300%+ within minutes. Secondary markets add 200-500% markups. Fans lack tools to compare prices across sources or understand if they're getting a fair deal.

### Impact Analysis
- **User Impact:** Fans overpay or miss events due to lack of pricing visibility
- **Market Impact:** Global concert ticket market growing ~5% CAGR with low consumer trust
- **Business Impact:** Learning project — skill development in fullstack architecture

## Target Audience

### Primary Persona: The Budget-Conscious Fan
**Demographics:**
- Age 18-35, students and young professionals
- Limited disposable income
- Attends 3-10 concerts per year

**Psychographics:**
- Values experiences over possessions
- Price-sensitive but willing to pay for good seats
- Researches before purchasing

**Jobs to Be Done:**
1. Find the cheapest tickets for a specific show
2. Compare options across different venues/dates
3. Decide whether to buy now or wait

### Secondary Persona: The Data Analyst
**Demographics:**
- Works with data professionally or as hobby
- Interested in pricing patterns and market dynamics

**Jobs to Be Done:**
1. Track price drift across locations and seasons
2. Analyze historical pricing trends
3. Export or query raw pricing data

## User Stories

### Epic: Ticket Price Discovery

**Primary User Story:**
"As an avid music lover, I want to find cheaper concert prices so that I can experience different genres of music"

**Acceptance Criteria:**
- [ ] Can search by artist name
- [ ] Results show prices from multiple sources
- [ ] Prices are current within 1 hour

### Supporting User Stories

1. "As a poor college student, I want to see the best deals on tickets so that I can go with my friends"
   - AC: Shows lowest prices first; includes fees in displayed price

2. "As a data analyst, I want to track ticket prices so that I can calculate drift in location and seasons"
   - AC: Price history stored from first availability; queryable by date range

3. "As a concertgoer, I want to compare the same artist across venues so that I can find the best value"
   - AC: Cross-venue comparison for same artist/tour displayed

## Functional Requirements

### Core Features (MVP — P0)

#### Feature 1: Event Search
- **Description:** Search concerts by artist, venue, or location
- **User Value:** Quickly find relevant events
- **Acceptance Criteria:**
  - [ ] Search returns results in < 500ms
  - [ ] Supports partial matching (autocomplete)
  - [ ] Filters by date range, location radius
- **Dependencies:** SeatGeek API, Ticketmaster Discovery API

#### Feature 2: Cross-Venue/Location Comparison
- **Description:** Compare ticket prices for same artist across different venues or cities
- **User Value:** Find the best deal for a tour
- **Acceptance Criteria:**
  - [ ] Shows all tour dates for an artist
  - [ ] Displays min/max prices per venue
  - [ ] Sortable by price, date, distance

#### Feature 3: Price History Tracking
- **Description:** Display historical price data from initial ticket availability
- **User Value:** Understand if current price is high/low relative to history
- **Acceptance Criteria:**
  - [ ] Price history chart per event
  - [ ] Data collected via scheduled jobs (GitHub Actions)
  - [ ] Minimum daily snapshots stored

### Should Have (P1)

#### Similar Price Comparison
- Show other tickets in same price range at the same event
- Query: tickets within ±15% of selected price, different sections

#### Resale Listings Display
- Show current resale prices alongside primary listings
- Clear labeling of source (primary vs resale)

### Could Have (P2)

- **Price Alerts:** Notify when price drops below threshold (requires future notification system)
- **Tab Notifications:** Browser tab updates when watching an event

### Out of Scope (Won't Have)
- **Stadium seating diagrams:** Too complex for MVP
- **User accounts:** No auth needed for v1
- **Mobile app:** Web-only, responsive design sufficient

## Non-Functional Requirements

### Performance
- **Page Load:** < 2 seconds
- **Search Response:** < 500ms from cache, < 2s cold
- **Database Queries:** Optimized indexes for instant retrieval
- **Uptime:** Best effort (free tier)

### Security
- **Authentication:** None (no user accounts)
- **Data Protection:** No PII collected; backend not exposed publicly
- **API Keys:** Stored in environment variables, not client-side

### Usability
- **Accessibility:** WCAG 2.1 AA, screen reader compatible
- **Browser Support:** Chrome, Safari, Firefox, Edge (latest 2 versions)
- **Responsive:** Works on desktop and tablet (mobile de-prioritized)

### Scalability
- **Venue Coverage:** Designed for hundreds of venues nationwide
- **Hosting:** Vercel (auto-scaling on free tier)
- **Database:** Supabase PostgreSQL with PostGIS for geo queries

## UI/UX Requirements

### Design Principles
1. **Speed first** — Users should find prices in seconds
2. **Clarity** — Prices clearly labeled with source and fees
3. **Comparison-focused** — Easy side-by-side viewing

### Information Architecture
```
├── Home / Search
├── Search Results
│   ├── Event List
│   └── Filters (date, location, price)
├── Event Detail
│   ├── Price Listings
│   ├── Price History Chart
│   └── Similar Prices
├── Artist View
│   └── Tour Dates Comparison
└── About / Info
```

### Key User Flows

#### Flow 1: Find Cheapest Tickets
```
Search Artist → View Results → Select Event → Compare Prices → View History → External Link to Buy
```

#### Flow 2: Compare Tour Dates
```
Search Artist → View All Tour Dates → Compare Venues → Select Best Value → View Details
```

## Technical Stack (from Research)

| Layer | Technology | Why |
|-------|------------|-----|
| Frontend | Next.js + TypeScript | Unified stack, Vercel deployment |
| Database | Supabase (PostgreSQL + PostGIS) | Free tier, geo queries, JSONB for row details |
| Caching | Upstash (Redis) | Avoid API rate limits |
| Background Jobs | GitHub Actions (cron) | Free scheduled price fetching |
| APIs | SeatGeek, Ticketmaster Discovery | Free tiers available |

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API rate limits hit | Medium | High | Cache aggressively with Upstash; batch requests |
| Data gaps (missing venues) | Medium | Medium | Start with major markets; expand gradually |
| Scraping breakage | High | Medium | Prefer APIs; abstract scraping logic for easy fixes |
| Price staleness | Medium | Medium | Hourly cron jobs; display "last updated" timestamp |
| Scope creep | Medium | Medium | Strict MVP scope; defer features to v2 |

## MVP Definition of Done

### Feature Complete
- [ ] Event search functional
- [ ] Cross-venue comparison working
- [ ] Price history displayed with chart
- [ ] Should-have features implemented if time allows

### Quality Assurance
- [ ] Manual testing on Chrome, Firefox, Safari
- [ ] Screen reader tested (VoiceOver or NVDA)
- [ ] No critical bugs

### Release Ready
- [ ] Deployed to Vercel
- [ ] Supabase database populated with initial data
- [ ] GitHub Actions cron job running
- [ ] Basic error handling in place

## Open Questions & Assumptions

### Open Questions
- Which specific cities to prioritize first?
- How frequently should prices be refreshed (hourly vs daily)?

### Assumptions
- SeatGeek and Ticketmaster APIs will remain free at current tier
- Users will access via desktop primarily
- Price data from APIs is accurate enough without verification

## Next Steps

1. **Immediate:** Review and approve this PRD
2. **Next:** Create Technical Design Document (Part 3)
3. **Then:** Set up development environment (Next.js, Supabase, Vercel)
4. **Build:** Implement MVP features with AI assistance
5. **Launch:** Deploy and test with real data

---
*PRD Version: 1.0*
*Created: 2026-02-07*
*Status: Ready for Technical Design*
