# CLAUDE.md — Claude Code Configuration for ConcertDaddy

## Project Context
**App:** ConcertDaddy
**Stack:** Next.js + Express.js + Supabase (PostgreSQL/PostGIS) + Vercel/Render
**Stage:** MVP Development
**User Level:** Developer

## Directives

1. **Master Plan:** Always read `AGENTS.md` first. It contains the current phase and tasks.
2. **Documentation:** Refer to `agent_docs/` for tech stack details, code patterns, and testing guides.
3. **Plan-First:** Propose a brief plan and wait for approval before coding.
4. **Incremental Build:** Build one small feature at a time. Test frequently.
5. **Pre-Commit:** If hooks exist, run them before commits; fix failures.
6. **No Linting:** Do not act as a linter. Use `npm run lint` if needed.
7. **Communication:** Be concise. Ask clarifying questions when needed.

## Commands

### Development
```bash
cd frontend && npm run dev    # Start Next.js dev server (port 3000)
cd backend && npm run dev     # Start Express dev server (port 3001)
```

### Testing
```bash
npm test                      # Run all tests
npm run test:watch            # Watch mode
npm run test:e2e              # Playwright E2E tests
```

### Quality
```bash
npm run lint                  # ESLint check
npm run lint:fix              # Auto-fix lint issues
npm run typecheck             # TypeScript strict check
npm run format                # Prettier format
```

### Database
```bash
npx supabase db push          # Push migrations
npx supabase db reset         # Reset database (caution!)
```

### Git
```bash
git status                    # Check changes
git add <files>               # Stage specific files
git commit -m "type: msg"     # Commit (hooks will run)
```

## Engineering Rules

### Type Safety
- `any` is FORBIDDEN — use `unknown` with type guards
- All functions must have explicit return types
- Use Zod for runtime validation at API boundaries

### Architecture
- Routes handle HTTP only — no business logic
- All logic goes in `services/`
- No database calls from route handlers

### Dependencies
- Check `package.json` before adding new deps
- Prefer native APIs (fetch over axios)
- No deprecated patterns

### Workflow
- Pre-commit hooks must pass
- Fix failures before continuing
- Update `AGENTS.md` after completing tasks

## What NOT To Do
- Do NOT delete files without confirmation
- Do NOT modify DB schema without backup plan
- Do NOT add features outside current phase
- Do NOT skip tests for "simple" changes
- Do NOT bypass failing pre-commit hooks
- Do NOT use `any` type
- Do NOT expose API keys in client code

## Context Files
Load these as needed:
- `agent_docs/tech_stack.md` — Stack and setup
- `agent_docs/code_patterns.md` — Code style
- `agent_docs/testing.md` — Test strategy
- `agent_docs/product_requirements.md` — PRD
- `agent_docs/resources.md` — Reference docs
