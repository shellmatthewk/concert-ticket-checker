# AGENTS.md — Master Plan for ConcertDaddy

## Project Overview
**App:** ConcertDaddy
**Goal:** Help concertgoers access ticket prices quickly to make better purchasing decisions
**Stack:** Next.js (App Router) + Express.js + Supabase (PostgreSQL/PostGIS) + Vercel/Render
**Current Phase:** Phase 1 — Foundation

## How I Should Think
1. **Understand Intent First**: Before answering, identify what the user actually needs
2. **Ask If Unsure**: If critical information is missing, ask before proceeding
3. **Plan Before Coding**: Propose a plan, ask for approval, then implement
4. **Verify After Changes**: Run tests/linters or manual checks after each change
5. **Explain Trade-offs**: When recommending something, mention alternatives

## Plan → Execute → Verify
1. **Plan:** Outline a brief approach and ask for approval before coding.
2. **Plan Mode:** If supported, use Plan mode for architectural decisions.
3. **Execute:** Implement one feature at a time.
4. **Verify:** Run tests/linters or manual checks after each feature; fix before moving on.

## Context & Memory
- Treat `AGENTS.md` and `agent_docs/` as living docs.
- Use `CLAUDE.md` for persistent project rules.
- Update these files as the project scales (commands, conventions, constraints).

## Context Files
Refer to these for details (load only when needed):
- `agent_docs/tech_stack.md`: Tech stack & libraries
- `agent_docs/code_patterns.md`: Code style & patterns
- `agent_docs/project_brief.md`: Persistent project rules and conventions
- `agent_docs/product_requirements.md`: Full PRD
- `agent_docs/testing.md`: Verification strategy and commands
- `agent_docs/resources.md`: Reference repositories and documentation

## Current State (Update This!)
**Last Updated:** 2026-02-08
**Working On:** Configure Supabase and run database migrations
**Recently Completed:** Full project initialization - frontend and backend build successfully
**Blocked By:** Need Supabase credentials to test database operations

## Roadmap

### Phase 1: Foundation
- [x] Initialize Next.js project with TypeScript
- [x] Set up Tailwind CSS + Shadcn/ui
- [x] Configure Supabase connection (code ready, needs credentials)
- [x] Create database schema (SQL migration file ready)
- [x] Set up Express.js backend
- [x] Configure environment variables (templates created)
- [ ] Run database migrations in Supabase
- [ ] Set up pre-commit hooks (lint, format, tests)
- [ ] Deploy skeleton to Vercel + Render

### Phase 2: Core Features (MVP)
- [ ] Event search by artist/venue/location
- [ ] Cross-venue/location comparison (same artist or genre)
- [ ] Price history tracking and visualization
- [ ] Nearby venue search (PostGIS)

### Phase 3: Should-Have Features
- [ ] Similar price comparison at same concert
- [ ] Resale listings display

### Phase 4: Could-Have Features
- [ ] Price alerts
- [ ] Tab notifications

### NOT in MVP (Future)
- Stadium seating diagrams
- User accounts
- Mobile app

## Success Metrics
- At least 10 concerts per major US city covered
- Smaller/regional venues represented
- Price history tracked from initial ticket availability

## Engineering Constraints

### Type Safety (No Compromises)
- The `any` type is FORBIDDEN—use `unknown` with type guards
- All function parameters and returns must be typed
- Use Zod for runtime validation on API boundaries

### Architectural Sovereignty
- Routes/controllers handle request/response ONLY
- All business logic goes in `services/`
- No database calls from route handlers

### Library Governance
- Check existing `package.json` before suggesting new dependencies
- Prefer native APIs over libraries (fetch over axios)
- No deprecated patterns (useEffect for data → use TanStack Query or SWR)

### The "No Apologies" Rule
- Do NOT apologize for errors—fix them immediately
- Do NOT generate filler text before providing solutions
- If context is missing, ask ONE specific clarifying question

### Workflow Discipline
- Pre-commit hooks must pass before commits
- If verification fails, fix issues before continuing
- Commit after each completed milestone

## What NOT To Do
- Do NOT delete files without explicit confirmation
- Do NOT modify database schemas without backup plan
- Do NOT add features not in the current phase
- Do NOT skip tests for "simple" changes
- Do NOT bypass failing tests or pre-commit hooks
- Do NOT use deprecated libraries or patterns
- Do NOT expose API keys in client-side code
- Do NOT use `any` type in TypeScript
