# Story 1.5: Create Production Dockerfiles for Frontend and Backend

Status: done

## Story

As a developer,
I want production-ready Dockerfiles with multi-stage builds for both frontend and backend,
So that I can deploy optimized, secure containers with minimal image sizes.

## Acceptance Criteria

**Given** the development environment is fully configured (Stories 1.1–1.4 done)
**When** I create production Dockerfiles
**Then** `frontend/Dockerfile` exists with multi-stage build (deps → builder → runner stages)
**And** Frontend Dockerfile uses `node:20-alpine` base image
**And** Frontend Dockerfile creates a non-root user (`nextjs`/`nodejs`) for running the app
**And** Frontend production image uses Next.js standalone output (already configured in `next.config.ts`)
**And** `backend/Dockerfile` exists with multi-stage build (builder → runner stages)
**And** Backend Dockerfile uses `node:20-alpine` base image
**And** Backend Dockerfile creates a non-root user (`nodeapp`/`nodejs`) for running the app
**And** Backend Dockerfile includes `prisma generate` in the build stage
**And** Backend runner stage copies generated Prisma client from builder (no double-generation)
**And** Both `.dockerignore` files exist (one per service root) excluding `node_modules`, `dist`/`.next`, env files
**And** Both Dockerfiles can be built successfully without errors (`docker build`)
**And** Built images can run standalone with appropriate environment variables provided

## Developer Context

### Critical Architecture Requirements

**Technology Stack:**
- **Node.js Runtime:** `node:20-alpine` (LTS, minimal image)
- **Frontend Framework:** Next.js 16.2.4 with `output: 'standalone'` (already set in `next.config.ts`)
- **Backend Framework:** Express 5.x, TypeScript compiled to `dist/` via `tsc`
- **ORM:** Prisma 7.x with `@prisma/adapter-pg` — requires `prisma generate` at build time
- **Package Manager:** npm (use `npm ci` for reproducible installs)

**Security Requirements:**
- Both containers MUST run as non-root users
- `.dockerignore` files MUST exclude `.env*` files so no secrets are baked into images
- Use `npm ci` (not `npm install`) for deterministic builds
- Production deps only in runner stage (`npm ci --omit=dev` for backend)

**Key Files:**
```
/
├── frontend/
│   ├── Dockerfile              # WRITE THIS (currently empty)
│   ├── .dockerignore           # CREATE THIS
│   ├── next.config.ts          # output: 'standalone' already set
│   ├── package.json            # next 16.2.4, react 19
│   └── src/
│
├── backend/
│   ├── Dockerfile              # WRITE THIS (currently empty)
│   ├── .dockerignore           # CREATE THIS
│   ├── package.json            # express, prisma 7.x, @prisma/adapter-pg, pg
│   ├── tsconfig.json           # target: ES2020, module: node16, outDir: ./dist
│   ├── prisma/
│   │   └── schema.prisma       # datasource: postgresql, generator: prisma-client-js
│   └── src/
│       └── server.ts           # entry point, listens on env.PORT (default 3001)
```

**Backend Entry Point:** `node dist/server.js`  
**Frontend Entry Point:** `node server.js` (from Next.js standalone output)

### Implementation Steps

#### Step 1: Create `frontend/.dockerignore`

```
node_modules
.next
.env*.local
.env.local
npm-debug.log*
README.md
.git
.gitignore
```

#### Step 2: Create `frontend/Dockerfile`

Three-stage build to minimize final image size:
- **deps**: Install only production+dev deps needed for build
- **builder**: Copy source + run `next build`
- **runner**: Non-root user, copy only standalone output

```dockerfile
# Stage 1: Install dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy standalone output (server.js + required modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copy static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### Step 3: Create `backend/.dockerignore`

```
node_modules
dist
.env
.env.*
!.env.example
npm-debug.log*
README.md
.git
.gitignore
tests
*.test.ts
```

#### Step 4: Create `backend/Dockerfile`

Two-stage build:
- **builder**: Install all deps, generate Prisma client, compile TypeScript
- **runner**: Install prod deps only, copy Prisma client from builder, copy compiled dist

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY tsconfig.json ./
COPY prisma ./prisma/
RUN npx prisma generate
COPY src ./src/
RUN npm run build

# Stage 2: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeapp --ingroup nodejs

# Install production dependencies only
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy generated Prisma client from builder (avoids re-generation)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy prisma schema (needed at runtime for migrations if run in container)
COPY prisma ./prisma/

# Copy compiled application
COPY --from=builder /app/dist ./dist

RUN chown -R nodeapp:nodejs /app
USER nodeapp

EXPOSE 3001

CMD ["node", "dist/server.js"]
```

### Testing / Verification

After creating all files, verify builds succeed:

```bash
# Build frontend image
docker build -t trainingnf-frontend ./frontend

# Build backend image
docker build -t trainingnf-backend ./backend
```

Both commands must complete without errors. If build succeeds, acceptance criteria are met.

> Note: Actual running the images end-to-end requires environment variables and is verified in Story 1.7.

### Dev Agent Record

#### Debug Log
- Fixed `src/config/env.ts`: Zod 4.x renamed `error.errors` → `error.issues`; updated error handling accordingly.

#### Completion Notes
All ACs met. Both Docker images build successfully.
- `trainingnf-frontend:latest` — Next.js standalone, non-root user `nextjs`
- `trainingnf-backend:latest` — Express dist, non-root user `nodeapp`, Prisma client copied from builder stage

#### File List
- `frontend/Dockerfile` — created (3-stage: deps, builder, runner)
- `frontend/.dockerignore` — created
- `backend/Dockerfile` — created (2-stage: builder, runner)
- `backend/.dockerignore` — created
- `backend/src/config/env.ts` — fixed Zod 4.x API (`issues` instead of `errors`)

#### Change Log
- 2026-04-20: Story implemented and verified
