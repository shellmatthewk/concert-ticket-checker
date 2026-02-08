# Essential Resources

## Reference Repositories

| Repository | Purpose | Link |
|------------|---------|------|
| **PatrickJS/awesome-cursorrules** | Anti-vibe rule templates | github.com/PatrickJS/awesome-cursorrules |
| **modelcontextprotocol/servers** | MCP server implementations | github.com/modelcontextprotocol/servers |
| **shadcn/ui** | Component library reference | ui.shadcn.com |
| **t3-oss/create-t3-app** | Full-stack Next.js patterns | create.t3.gg |

---

## Key Documentation

### Frontend
- **Next.js App Router:** nextjs.org/docs/app
- **Tailwind CSS:** tailwindcss.com/docs
- **Shadcn/ui:** ui.shadcn.com/docs
- **Zustand:** docs.pmnd.rs/zustand
- **Recharts:** recharts.org/en-US/api

### Backend
- **Express.js:** expressjs.com/en/guide
- **Zod Validation:** zod.dev
- **Pino Logging:** getpino.io

### Database
- **Supabase Docs:** supabase.com/docs
- **PostGIS:** postgis.net/documentation
- **PostgreSQL:** postgresql.org/docs

### APIs
- **Ticketmaster Discovery API:** developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2
- **SeatGeek API:** platform.seatgeek.com

### Testing
- **Vitest:** vitest.dev
- **Playwright:** playwright.dev/docs
- **React Testing Library:** testing-library.com/docs/react-testing-library/intro

---

## Code Examples & Patterns

### Supabase with PostGIS
```typescript
// Geo query example from Supabase docs
const { data, error } = await supabase.rpc('nearby_venues', {
  lat: 37.7749,
  long: -122.4194,
  radius_meters: 50000
});
```

### Next.js App Router Data Fetching
```typescript
// Server component data fetching
async function EventPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);
  return <EventDetail event={event} />;
}
```

### Express Error Handling
```typescript
// Centralized error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});
```

---

## Deployment Guides

### Vercel
- **Deploy Next.js:** vercel.com/docs/frameworks/nextjs
- **Environment Variables:** vercel.com/docs/concepts/projects/environment-variables

### Render
- **Deploy Express:** render.com/docs/deploy-node-express-app
- **Web Services:** render.com/docs/web-services

### Supabase
- **Database Setup:** supabase.com/docs/guides/database
- **Migrations:** supabase.com/docs/guides/cli/local-development

---

## Community Resources

### Discord Servers
- **Supabase Discord:** discord.supabase.com
- **Next.js Discord:** nextjs.org/discord
- **Tailwind Discord:** tailwindcss.com/discord

### Forums
- **Stack Overflow Tags:** [supabase], [next.js], [express]
- **Reddit:** r/nextjs, r/node

---

## Troubleshooting

### Common Issues

**CORS Errors**
- Check `ALLOW_ORIGIN` in Express config
- Ensure Vercel deployment URL matches whitelist

**Supabase Connection Fails**
- Verify `SUPABASE_URL` and keys are correct
- Check if database is paused (free tier)

**PostGIS Queries Fail**
- Ensure PostGIS extension is enabled
- Verify SRID matches (4326 for lat/long)

**Rate Limiting**
- Check Ticketmaster/SeatGeek quotas
- Implement caching with Upstash Redis

### Debug Commands
```bash
# Check environment variables
printenv | grep SUPABASE

# Test database connection
npx supabase db ping

# View Render logs
render logs --service <service-id>

# Vercel build logs
vercel logs <deployment-url>
```
