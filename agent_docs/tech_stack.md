# Tech Stack & Tools

## Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + Shadcn/ui
- **State Management:** Zustand (lightweight) or React Context
- **Charts:** Recharts for price history visualization
- **Testing:** Vitest + React Testing Library

## Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js with TypeScript
- **Validation:** Zod for request/response validation
- **Scheduling:** node-cron for price fetching jobs
- **Logging:** Pino for structured logs
- **Testing:** Vitest

## Database & Infrastructure
- **Primary DB:** Supabase (PostgreSQL + PostGIS)
- **Auth:** Supabase Auth with OAuth (Google/GitHub)
- **Storage:** Supabase Storage for venue/artist images
- **Caching:** Upstash Redis
- **Monitoring:** Sentry for error tracking

## Deployment
- **Frontend:** Vercel (auto-deploy from main)
- **Backend:** Render (Web Service)
- **Database:** Supabase (managed PostgreSQL)

## External APIs
- **Ticketmaster Discovery API:** Event and venue data
- **SeatGeek API:** Event data and deal scores
- **PredictHQ:** Demand and nearby event data (optional)

---

## Project Structure

### Frontend (Next.js)
```
src/
├── app/                 # App router
│   ├── page.tsx        # Home/Search
│   ├── events/         # Event listings
│   ├── event/[id]/     # Event detail + price history
│   └── artist/[id]/    # Artist tour comparison
├── components/
│   ├── ui/             # Shadcn base components
│   ├── features/       # Feature-specific
│   │   ├── search/
│   │   ├── price/
│   │   └── event/
│   └── layouts/
├── lib/
│   ├── api/           # API client
│   ├── hooks/         # Custom hooks
│   ├── utils/         # Utilities
│   └── stores/        # Zustand stores
├── styles/            # Global styles
└── types/             # TypeScript types
```

### Backend (Express)
```
src/
├── api/
│   ├── routes/        # Route handlers
│   ├── middleware/    # Auth, rate limiting
│   └── validators/    # Zod schemas
├── services/
│   ├── scraping/      # Data collection
│   ├── aggregation/   # Price normalization
│   └── geo/           # PostGIS queries
├── models/            # Data models
├── db/
│   ├── migrations/
│   └── seeds/
├── jobs/              # Cron jobs
├── utils/
└── config/
```

---

## Setup Commands

### Initial Setup
```bash
# Frontend
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend
npx shadcn-ui@latest init

# Backend
mkdir backend && cd backend
npm init -y
npm install express typescript ts-node @types/node @types/express
npm install zod pino node-cron
npm install -D vitest
```

### Development
```bash
# Frontend
cd frontend && npm run dev

# Backend
cd backend && npm run dev
```

### Testing
```bash
npm test           # Run all tests
npm run test:watch # Watch mode
```

### Linting
```bash
npm run lint       # ESLint check
npm run lint:fix   # Auto-fix issues
```

---

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=
```

### Backend (.env)
```
DATABASE_URL=
SUPABASE_SERVICE_KEY=
TICKETMASTER_API_KEY=
SEATGEEK_API_KEY=
UPSTASH_REDIS_URL=
SENTRY_DSN=
PORT=3001
```

---

## Key Dependencies

### Frontend
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.0.0",
  "@supabase/supabase-js": "^2.0.0",
  "zustand": "^4.0.0",
  "recharts": "^2.0.0",
  "zod": "^3.0.0"
}
```

### Backend
```json
{
  "express": "^4.18.0",
  "typescript": "^5.0.0",
  "@supabase/supabase-js": "^2.0.0",
  "zod": "^3.0.0",
  "pino": "^8.0.0",
  "node-cron": "^3.0.0",
  "ioredis": "^5.0.0"
}
```
