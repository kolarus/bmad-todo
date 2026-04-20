# Story 1.7: Implement Health Check Endpoints and Verify Full Stack Integration

Status: done

## Story

As a developer,
I want health check endpoints for all services and full stack verified end-to-end,
So that I can confirm the entire containerized stack works and containers report their status correctly.

## Acceptance Criteria

**Given** all services are containerized (Stories 1.5 and 1.6 done)
**When** I implement health checks and verify integration
**Then** Backend has `/api/health` endpoint returning JSON with status and timestamp (already exists — verify passes)
**And** Backend has `/api/health/db` endpoint that verifies database connection (already exists — verify passes)
**And** Docker Compose health checks are configured for ALL three services in `docker-compose.prod.yml`
**And** Frontend service gets a Docker Compose healthcheck (currently missing — add it)
**And** `docker-compose -f docker-compose.prod.yml up -d` starts all services successfully
**And** `docker compose -f docker-compose.prod.yml ps` shows all containers as `healthy`
**And** Full stack integration passes: `curl http://localhost:3001/api/health/db` returns `{"status":"ok","database":"connected",...}`
**And** `README.md` exists at project root with setup instructions for development environment
**And** `README.md` documents how to start the production environment (`docker-compose -f docker-compose.prod.yml up`)
**And** `README.md` includes a troubleshooting section for common setup issues

## Developer Context

### Critical Architecture Requirements

**Existing health endpoints (backend — already implemented):**
- `GET /api/health` → `{ status: 'ok', environment, timestamp, service }`
- `GET /api/health/db` → `{ status: 'ok', database: 'connected', timestamp }` (queries `SELECT 1` via Prisma)

**Frontend health (Next.js built-in):**  
Next.js does not expose a built-in `/health` route. Use the app's own page (`/`) as the health check target — if it responds with HTTP 200, the container is running.

**Docker Compose prod file location:** `docker-compose.prod.yml` (root)

**Files to create/modify:**
```
/
├── README.md                        # CREATE — project root documentation
└── docker-compose.prod.yml          # MODIFY — add frontend healthcheck
```

### Implementation Steps

#### Step 1b: Add root `npm run dev` script to `package.json`

The root `package.json` currently has no scripts. Add `concurrently` to run frontend + backend in parallel:

```bash
npm install --save-dev concurrently
```

Update root `package.json` scripts:
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix frontend\" \"npm run dev --prefix backend\"",
    "test": "npm run test --prefix backend"
  },
  "devDependencies": {
    "concurrently": "^9.x"
  }
}
```

#### Step 2: Add frontend healthcheck to `docker-compose.prod.yml`

In the `frontend` service, add:

```yaml
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:3000/ > /dev/null || exit 1"]
      interval: 15s
      timeout: 5s
      retries: 5
      start_period: 30s
```

#### Step 2: Create `README.md` at project root

Write a comprehensive README with the following sections:

1. **Project Overview** — what trainingnf is, the tech stack summary
2. **Prerequisites** — Node.js 20, Docker, npm
3. **Quick Start (Development)**
   - `git clone` / navigate to folder
   - `docker compose up -d` (starts PostgreSQL)
   - `cd backend && npm install && npx prisma migrate dev`
   - `cd ../frontend && npm install`
   - From root: `npm run dev` (starts both frontend + backend concurrently)
   - Open http://localhost:3000
4. **Running Tests**
   - Backend: `cd backend && npm test`
5. **Production Deployment (Docker Compose)**
   - `docker compose -f docker-compose.prod.yml up --build -d`
   - Wait for all containers to be healthy: `docker compose -f docker-compose.prod.yml ps`
   - Frontend: http://localhost:3000, Backend API: http://localhost:3001
   - Stop: `docker compose -f docker-compose.prod.yml down`
6. **Troubleshooting**
   - Port conflicts (3000/3001/5432)
   - Database connection errors
   - Prisma migration failures
   - Container not starting (check logs: `docker compose logs [service]`)

#### Step 3: Verify the full stack

Run these commands to verify:

```bash
# Start the stack
docker compose -f docker-compose.prod.yml up --build -d

# Wait ~60s then check status
docker compose -f docker-compose.prod.yml ps

# Verify backend API health
curl http://localhost:3001/api/health

# Verify database health
curl http://localhost:3001/api/health/db

# Stop the stack
docker compose -f docker-compose.prod.yml down
```

Expected results:
- All 3 containers show status `healthy` in `ps`
- `/api/health` returns `{"status":"ok",...}`
- `/api/health/db` returns `{"status":"ok","database":"connected",...}`

### Dev Agent Record

#### Debug Log
- Frontend healthcheck using `localhost` failed inside Alpine container — `localhost` does not resolve to the bind address. Fixed by using `0.0.0.0:3000` in the healthcheck URL.
- Backend `prisma migrate deploy` failed because `prisma.config.ts` (Prisma 7.x config with `datasource.url`) was not copied to the runner stage. Fixed by adding `COPY prisma.config.ts ./` in both builder and runner stages of `backend/Dockerfile`.

#### Completion Notes
All ACs met. Full stack verified:
- All 3 containers (`postgres`, `backend`, `frontend`) show `healthy` status
- `GET /api/health` → `{"status":"ok","environment":"production",...}`
- `GET /api/health/db` → `{"status":"ok","database":"connected",...}`
- `README.md` created at project root with dev setup, test, prod deployment, and troubleshooting sections
- Root `package.json` now has `npm run dev` (concurrently) and `npm test` scripts

#### File List
- `docker-compose.prod.yml` — modified: added frontend healthcheck (using `0.0.0.0`)
- `backend/Dockerfile` — modified: copy `prisma.config.ts` in both stages
- `package.json` (root) — modified: added `scripts.dev` and `scripts.test` via concurrently
- `README.md` (root) — created

#### Change Log
- 2026-04-20: Story implemented and verified
