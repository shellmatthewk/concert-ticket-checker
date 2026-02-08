# Project Brief (Persistent)

## Product Vision
ConcertDaddy helps concertgoers access transparent ticket pricing data across multiple sources, enabling faster and smarter purchasing decisions through price history and cross-venue comparisons.

## Target Users
1. **Budget-conscious fans** (primary): Students and young professionals seeking affordable concert tickets
2. **Data analysts** (secondary): Users interested in tracking price trends across locations and seasons

## Core Value Proposition
- Aggregated pricing from multiple sources
- Historical price tracking from initial availability
- Cross-venue comparison for same artist/tour
- Nearby event discovery via geo-search

---

## Coding Conventions

### TypeScript
- Strict mode enabled
- No `any` types — use `unknown` with type guards
- All functions must have explicit return types
- Use Zod for runtime validation

### React
- Functional components only
- Use hooks for state and effects
- Data fetching via SWR or TanStack Query (not useEffect)
- Colocate component files with their styles/tests

### Express
- Thin controllers — logic in services only
- Zod validation middleware on all routes
- Centralized error handling
- Structured logging with Pino

### Styling
- Tailwind CSS utility classes
- Shadcn/ui for base components
- Design tokens for colors/spacing (no raw hex values)
- Mobile-responsive by default

---

## Quality Gates

### Before Every Commit
1. `npm run lint` passes
2. `npm run typecheck` passes
3. `npm test` passes (relevant tests)
4. No console.log statements in production code

### Before Every PR
1. All quality gates above
2. Manual testing of affected features
3. Update AGENTS.md "Current State" section

### Before Deployment
1. All tests passing
2. No TypeScript errors
3. Environment variables configured
4. Database migrations applied

---

## Key Commands

### Development
```bash
# Frontend
cd frontend && npm run dev     # Start Next.js dev server

# Backend
cd backend && npm run dev      # Start Express dev server
```

### Testing
```bash
npm test                       # Run all tests
npm run test:watch             # Watch mode
npm run test:coverage          # Coverage report
```

### Quality
```bash
npm run lint                   # ESLint check
npm run lint:fix               # Auto-fix issues
npm run typecheck              # TypeScript check
npm run format                 # Prettier format
```

### Database
```bash
npx supabase db push           # Push migrations
npx supabase db reset          # Reset database
```

### Deployment
```bash
# Frontend deploys automatically via Vercel on push to main
# Backend deploys automatically via Render on push to main
```

---

## Git Workflow

### Branch Naming
- `feature/event-search` — New features
- `fix/price-display-bug` — Bug fixes
- `chore/update-deps` — Maintenance

### Commit Messages
```
type(scope): description

Examples:
feat(search): add artist autocomplete
fix(price): correct decimal formatting
chore(deps): update Next.js to 14.1
```

### PR Process
1. Create feature branch from `develop`
2. Make changes, ensure quality gates pass
3. Push and create PR to `develop`
4. After review, merge to `develop`
5. Periodically merge `develop` to `main` for deployment

---

## Update Cadence

### AGENTS.md
- Update "Current State" after each work session
- Update "Roadmap" when completing phases

### agent_docs/
- Update when adding new patterns or conventions
- Review monthly for accuracy

### Tool Configs
- Update commands when build process changes
- Add new constraints as discovered
