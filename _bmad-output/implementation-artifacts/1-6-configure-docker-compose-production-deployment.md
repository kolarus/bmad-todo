# Story 1.6: Configure Docker Compose Production Deployment

Status: done

## Story

As a developer,
I want a `docker-compose.prod.yml` that orchestrates all services,
So that I can deploy the entire application with a single command.

## Acceptance Criteria

**Given** production Dockerfiles are created (Story 1.5 done)
**When** I create `docker-compose.prod.yml`
**Then** File defines three services: `frontend`, `backend`, `postgres`
**And** Frontend service builds from `frontend/Dockerfile` and exposes port 3000
**And** Backend service builds from `backend/Dockerfile` and exposes port 3001
**And** PostgreSQL service uses `postgres:16-alpine` image with volume for data persistence
**And** Services are connected through a Docker network
**And** Environment variables are properly configured for production
**And** `DATABASE_URL` connects backend to `postgres` service (not `localhost`)
**And** `NEXT_PUBLIC_API_URL` points to backend service
**And** Running `docker-compose -f docker-compose.prod.yml up` starts all services
**And** `depends_on` with healthcheck conditions ensures startup order: postgres → backend → frontend
**And** Backend runs `prisma migrate deploy` before starting the server

## Developer Context

### Critical Architecture Requirements

**Technology Stack:**
- **Docker Compose:** v3.8 schema
- **PostgreSQL image:** `postgres:16-alpine`
- **Frontend port:** 3000 (exposed to host)
- **Backend port:** 3001 (exposed to host; also used for inter-service communication)
- **Postgres port:** 5432 (internal only — NOT exposed to host in production)
- **Network:** Custom bridge network `trainingnf-network`

**Key Design Decisions:**
- `DATABASE_URL` uses service name `postgres` as host (Docker internal DNS), not `localhost`
- `NEXT_PUBLIC_API_URL` must use the public-facing URL for browser access in production. In this local compose setup, use `http://localhost:3001` so the browser can reach the backend.
- Backend runs `npx prisma migrate deploy` before `node dist/server.js` (using a shell entrypoint)
- PostgreSQL volume named `postgres_prod_data` (separate from dev volume)
- `restart: unless-stopped` on all services for resilience
- Docker Compose healthchecks on all three services

**Project Structure:**
```
/
├── frontend/
│   ├── Dockerfile              # Already created in Story 1.5
│   └── ...
├── backend/
│   ├── Dockerfile              # Already created in Story 1.5
│   └── ...
└── docker-compose.prod.yml     # WRITE THIS (currently empty)
```

**Startup Order:**
```
postgres (healthy) → backend (healthy) → frontend (healthy)
```

**Backend CMD with migration:**
The backend Docker CMD must run migrations before starting. Use shell form:
```
/bin/sh -c "npx prisma migrate deploy && node dist/server.js"
```
This can be done via `command` override in docker-compose.prod.yml.

### Environment Variables

**postgres service:**
- `POSTGRES_USER`: `postgres`
- `POSTGRES_PASSWORD`: `postgres` (for local/training use; production would use secrets)
- `POSTGRES_DB`: `trainingnf`

**backend service:**
- `NODE_ENV`: `production`
- `PORT`: `3001`
- `DATABASE_URL`: `postgresql://postgres:postgres@postgres:5432/trainingnf?schema=public`
- `ALLOWED_ORIGINS`: `http://localhost:3000`

**frontend service:**
- `NODE_ENV`: `production`
- `NEXT_PUBLIC_API_URL`: `http://localhost:3001`
- `PORT`: `3000`
- `HOSTNAME`: `0.0.0.0`

### Implementation Steps

#### Step 1: Write `docker-compose.prod.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: trainingnf-postgres-prod
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: trainingnf
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
    networks:
      - trainingnf-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: trainingnf-backend-prod
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3001
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/trainingnf?schema=public
      ALLOWED_ORIGINS: http://localhost:3000
    ports:
      - "3001:3001"
    command: /bin/sh -c "npx prisma migrate deploy && node dist/server.js"
    networks:
      - trainingnf-network
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:3001/api/health || exit 1"]
      interval: 15s
      timeout: 5s
      retries: 5
      start_period: 30s

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: trainingnf-frontend-prod
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3000
      HOSTNAME: 0.0.0.0
      NEXT_PUBLIC_API_URL: http://localhost:3001
    ports:
      - "3000:3000"
    networks:
      - trainingnf-network
    depends_on:
      backend:
        condition: service_healthy

networks:
  trainingnf-network:
    driver: bridge

volumes:
  postgres_prod_data:
    driver: local
```

### Testing / Verification

Verify the docker-compose.prod.yml is syntactically valid:

```bash
docker compose -f docker-compose.prod.yml config
```

This must output a valid resolved config with no errors.

> Full runtime verification (all services healthy) is covered in Story 1.7.

### Dev Agent Record

#### Debug Log
- Removed obsolete `version: '3.8'` attribute (Docker Compose v2 no longer needs it, emits warning).

#### Completion Notes
All ACs met. `docker compose -f docker-compose.prod.yml config` validates with no errors.
- 3 services: `postgres`, `backend`, `frontend`
- Correct startup order via `depends_on` with healthcheck conditions
- Backend migration command: `npx prisma migrate deploy && node dist/server.js`
- Postgres port not exposed to host

#### File List
- `docker-compose.prod.yml` — created

#### Change Log
- 2026-04-20: Story implemented and verified
