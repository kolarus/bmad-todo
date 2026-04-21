# trainingnf — Todo Application

A full-stack todo application built as a BMAD methodology training project. Implements a complete spec-driven development workflow: Product Brief → PRD → UX Design → Architecture → Epics/Stories → Implementation.

## Key Features

- **Full CRUD** — create, toggle complete, and delete todos
- **Real-time persistence** — all todos stored in PostgreSQL, survive page refresh
- **Optimistic UI** — instant feedback with automatic rollback on API errors
- **Accessible** — WCAG 2.1 AA compliant, full keyboard navigation, ARIA labels
- **Responsive** — mobile-first design that works at all screen sizes
- **Production-ready** — Dockerized with health checks and environment validation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16.2, React 19, TypeScript 5, Tailwind CSS 4 |
| Backend | Express 5, Node.js 20, TypeScript, Prisma 7 (ORM) |
| Database | PostgreSQL 16 |
| Containerization | Docker, Docker Compose |
| Testing | Jest + React Testing Library (frontend), Vitest + Supertest (backend), Playwright (E2E) |

---

## Prerequisites

- [Node.js 20 LTS](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- npm (comes with Node.js)

---

## Quick Start — Development

### 1. Clone and navigate

```bash
git clone <repository-url>
cd trainingnf
```

### 2. Start PostgreSQL via Docker

```bash
docker compose up -d
```

This starts PostgreSQL on `localhost:5432`.

### 3. Set up backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
```

### 4. Set up frontend

```bash
cd ../frontend
npm install
cp .env.example .env.local   # if .env.example exists
```

Ensure `frontend/.env.local` contains:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 5. Run both services concurrently

From the project root:

```bash
npm install   # installs root dev dependencies
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health check:** http://localhost:3001/api/health

---

## Running Tests

### All tests (from root)

```bash
npm test
```

### Backend unit + integration tests

```bash
cd backend
npm test
```

With coverage:

```bash
cd backend
npm run test:coverage
```

### Frontend component tests

```bash
cd frontend
npm test
```

With coverage:

```bash
cd frontend
npm run test:coverage
```

### E2E tests (requires running app)

Start the app first (`npm run dev` from root), then:

```bash
cd e2e
npm test
```

Run with visible browser:

```bash
cd e2e
npm run test:headed
```

View HTML report:

```bash
cd e2e
npm run test:report
```

---

## Production Deployment — Docker Compose

### Build and start all services

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### Verify all containers are healthy

```bash
docker compose -f docker-compose.prod.yml ps
```

All three services (`postgres`, `backend`, `frontend`) should show status `healthy`.

### Verify the stack

```bash
# Backend health
curl http://localhost:3001/api/health

# Database connectivity
curl http://localhost:3001/api/health/db

# Frontend
open http://localhost:3000
```

### Stop the production stack

```bash
docker compose -f docker-compose.prod.yml down
```

To also remove the database volume (destroys all data):

```bash
docker compose -f docker-compose.prod.yml down -v
```

---

## Project Structure

```
trainingnf/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   └── components/
│   └── Dockerfile
│
├── backend/           # Express REST API
│   ├── src/
│   │   ├── server.ts
│   │   ├── config/    # Environment validation
│   │   └── middleware/
│   ├── prisma/        # Database schema + migrations
│   └── Dockerfile
│
├── e2e/               # Playwright end-to-end tests
│   └── tests/
│
├── docs/              # QA and process reports
│   ├── accessibility-report.md
│   ├── performance-report.md
│   ├── security-review-report.md
│   ├── test-coverage-report.md
│   ├── qa-summary-report.md
│   ├── ai-integration-log.md
│   └── bmad-process-documentation.md
│
├── _bmad-output/      # BMAD planning and implementation artifacts
│   ├── planning-artifacts/   # PRD, architecture, UX specs, epics
│   └── implementation-artifacts/  # Story files, sprint status
│
├── docker-compose.yml          # Development (PostgreSQL only)
├── docker-compose.prod.yml     # Production (all services)
└── README.md
```

---

## Troubleshooting

### Port already in use (3000, 3001, 5432)

Find and stop the process using the port:

```bash
lsof -ti:3000 | xargs kill -9   # or 3001, 5432
```

Or change the port in `.env` and the relevant `docker-compose.yml` entry.

### Database connection error

1. Ensure PostgreSQL is running: `docker compose ps`
2. Check `DATABASE_URL` in `backend/.env` matches the Docker Compose config
3. Re-run migrations: `cd backend && npx prisma migrate dev`

### Prisma migration failed

```bash
cd backend
npx prisma migrate reset   # WARNING: drops all data
npx prisma migrate dev
```

### Container not starting / stuck

Check service logs:

```bash
docker compose -f docker-compose.prod.yml logs backend
docker compose -f docker-compose.prod.yml logs frontend
docker compose -f docker-compose.prod.yml logs postgres
```

### Backend image build fails (TypeScript errors)

```bash
cd backend
npm run build   # check TypeScript errors locally first
```

### `NEXT_PUBLIC_API_URL` not set (frontend shows "not configured")

Ensure `frontend/.env.local` exists with:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

For production Docker Compose, this is injected via `docker-compose.prod.yml` environment variables.

---

## Additional Documentation

| Document | Description |
|----------|-------------|
| [Accessibility Report](docs/accessibility-report.md) | WCAG 2.1 AA compliance audit results |
| [Performance Report](docs/performance-report.md) | Lighthouse scores and bundle size analysis |
| [Security Review](docs/security-review-report.md) | XSS, SQL injection, CORS, and dependency audit |
| [Test Coverage Report](docs/test-coverage-report.md) | Coverage metrics for unit and integration tests |
| [QA Summary Report](docs/qa-summary-report.md) | Comprehensive QA sign-off and production readiness |
| [AI Integration Log](docs/ai-integration-log.md) | How AI tools were used throughout development |
| [BMAD Process Documentation](docs/bmad-process-documentation.md) | How BMAD guided the full development lifecycle |

BMAD planning artifacts (PRD, architecture, UX specs, epics, stories) are in [`_bmad-output/`](_bmad-output/).
