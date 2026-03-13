# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Venture** is a full-stack event discovery platform focused on the Nairobi/Kenya market. It aggregates events from multiple external sources (Google Events via SerpAPI, Eventbrite, KenyaBuzz scraping), enriches them with AI, and allows hosts/vendors to manage their own events.

## Commands

All commands must be run from their respective subdirectory — never from the repo root.

### Backend (run from `backend/`)

```bash
# Development
cd backend && npm run dev                        # Start ts-node server via nodemon, watches src/, runs on port 5000

# Production
cd backend && npm run build                      # tsc → compiles src/ to dist/ (ES2020, commonjs)
cd backend && npm run start                      # node dist/server.js (requires build first)

# Type-check only (no emit)
cd backend && npx tsc --noEmit                   # Validate types without writing files

# Run a single script directly
cd backend && npx ts-node src/createExternalCategory.ts   # Seed the external events category UUID

# Prisma
cd backend && npm run prisma:generate            # Regenerate Prisma client after schema.prisma changes (always run after migrations)
cd backend && npm run prisma:migrate             # Apply pending migrations to dev DB (creates new migration if schema changed)
cd backend && npm run prisma:seed                # Run prisma/seed.ts via ts-node
cd backend && npm run prisma:studio              # Open Prisma Studio at http://localhost:5555
cd backend && npx prisma migrate reset           # WARNING: drops and recreates DB, then re-seeds
cd backend && npx prisma db push                 # Push schema changes without creating a migration (prototyping only)
```

### Frontend (run from `frontend/`)

```bash
cd frontend && npm run dev                       # Vite dev server on port 3000, proxies /api/* → localhost:5000
cd frontend && npm run build                     # tsc -b + vite build → outputs to frontend/dist/
cd frontend && npm run preview                   # Serve the production build locally for testing
cd frontend && npm run lint                      # Run ESLint across all frontend source files
```

### Running both simultaneously

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

## Architecture

### Backend (`backend/src/`)

**Entry points**: `server.ts` → `app.ts` (Express v5)

**Request flow**: Routes → Middleware (auth, validation, rate limiting) → Controllers → Services → Prisma ORM → PostgreSQL

**Key architectural patterns**:
- JWT auth with short-lived access tokens (15m) and refresh tokens (7d)
- Dual LLM providers: **Groq** (llama-3.1-8b-instant, primary for text generation/classification) and **OpenAI** (DALL-E 3, for image generation)
- Event sync cron job runs every 6 hours (`jobs/eventSync.job.ts`), calling `eventAggregator.ts`

**Event aggregation pipeline** (`services/eventAggregator.ts`):
1. Fetch in parallel from Google Events (SerpAPI), Eventbrite API, KenyaBuzz (Puppeteer scraping)
2. Normalize all events to a common format (`utils/eventNormalizer.ts`)
3. AI categorize via `eventClassifier.ts` (keyword matching first, then Groq fallback)
4. Image enrichment via `imageEnrichmet.service.ts`
5. Deduplicate by `externalUrl`, batch insert 100 at a time with `skipDuplicates`

**AI controller** (`controllers/ai.controller.ts`):
- `POST /api/ai/generate-content` — Groq generates structured event JSON (title, description, schedule, FAQs, tags, features)
- `POST /api/ai/generate-images` — OpenAI DALL-E 3 generates event images

### Frontend (`frontend/src/`)

**Stack**: React 19, TypeScript, Vite, Tailwind CSS v4, React Query, Zustand, React Hook Form + Zod

**Dev proxy**: Vite proxies `/api/*` to `localhost:5000` — no CORS issues in dev

**State**: Zustand for auth/global state, React Query for server state/caching

**Roles & routing**: Users have roles (USER, VENDOR, ADMIN, HOST). Protected routes in `components/common/ProtectedRoute.tsx`. Admin pages under `pages/admin/`, host pages under `pages/host/`.

### Database (PostgreSQL + PostGIS)

Schema managed via Prisma (`backend/prisma/schema.prisma`). Key models: `User`, `Event`, `Category`, `EventAttendee`, `VendorService`, `ServiceBid`, `Review`.

External events use `externalId` + `source` fields on the `Event` model to track provenance. The `EXTERNAL_EVENTS_CATEGORY_ID` env var is a UUID pointing to a special category for unclassified external events.

## Environment Variables

Backend requires: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `GROQ_API_KEY`, `OPENAI_API_KEY`, `EVENTBRITE_API_TOKEN`, `SERP_API_KEY`, `EXTERNAL_EVENTS_CATEGORY_ID`, `FRONTEND_URL`, plus optional email (Gmail SMTP), Stripe, and AWS S3 vars.

Frontend requires: `VITE_GOOGLE_MAPS_API_KEY`, `VITE_STRIPE_PUBLIC_KEY`.
