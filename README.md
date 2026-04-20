# trainingnf — Todo Application

A full-stack todo application built with Next.js 16, Express 5, PostgreSQL 16, and Docker, developed using the BMAD methodology.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16.2, React 19, TypeScript 5, Tailwind CSS 4 |
| Backend | Express 5, Node.js 20, TypeScript, Prisma 7 (ORM) |
| Database | PostgreSQL 16 |
| Containerization | Docker, Docker Compose |
| Testing | Vitest (backend), Supertest (API integration) |

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

### Backend unit + integration tests

```bash
cd backend
npm test
```

Or from root:

```bash
npm test
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
