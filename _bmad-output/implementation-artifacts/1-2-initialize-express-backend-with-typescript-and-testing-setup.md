# Story 1.2: Initialize Express Backend with TypeScript and Testing Setup

Status: ready-for-dev

## Story

As a developer,
I want an Express backend with TypeScript and testing infrastructure,
So that I can build type-safe API endpoints with immediate test coverage.

## Acceptance Criteria

**Given** the frontend is initialized
**When** I set up the backend structure
**Then** Express 4.x is installed with TypeScript configuration
**And** Node.js 20.x LTS is the target runtime
**And** tsx and nodemon are configured for hot-reload development
**And** Jest or Vitest is configured for backend unit tests
**And** A basic Express server starts on localhost:3001
**And** A health check endpoint `/api/health` returns 200 OK
**And** The test command runs successfully with a sample test passing

## Developer Context

### Critical Architecture Requirements

**Technology Stack (MUST FOLLOW):**
- **Express:** 4.x with TypeScript
- **TypeScript:** 5.x with strict mode enabled
- **Node.js:** 20.x LTS runtime
- **Testing Framework:** Vitest (preferred) or Jest
- **Dev Tools:** tsx + nodemon for hot-reload
- **Package Manager:** npm (consistency with frontend)

**Project Structure (STRICT REQUIREMENT):**
```
/backend/
├── src/
│   ├── routes/          # API route handlers (create in future stories)
│   ├── controllers/     # Business logic (create in future stories)
│   ├── services/        # Data access layer (create in future stories)
│   └── server.ts        # Express app entry point
├── tests/               # Test files (co-located with src/)
│   └── health.test.ts   # Sample health check test
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
├── .env.example         # Environment variable template
├── .env                 # Actual environment variables (gitignored)
└── nodemon.json         # Nodemon configuration for hot-reload
```

### Implementation Steps

**Step 1: Create Backend Directory and Initialize npm**

```bash
mkdir backend
cd backend
npm init -y
```

**Step 2: Install Core Dependencies**

```bash
npm install express cors dotenv
```

**Dependencies Explained:**
- `express` - Web framework for API endpoints
- `cors` - Cross-Origin Resource Sharing middleware
- `dotenv` - Environment variable management

**Step 3: Install Development Dependencies**

```bash
npm install --save-dev typescript @types/express @types/cors @types/node tsx nodemon vitest
```

**Dev Dependencies Explained:**
- `typescript` - TypeScript compiler
- `@types/express` - Type definitions for Express
- `@types/cors` - Type definitions for CORS
- `@types/node` - Type definitions for Node.js
- `tsx` - TypeScript execution environment (faster than ts-node)
- `nodemon` - File watcher for hot-reload
- `vitest` - Testing framework (modern, fast, ESM-friendly)

**Alternative (if Jest preferred):**
```bash
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

**Step 4: Initialize TypeScript Configuration**

```bash
npx tsc --init
```

Then update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "types": ["node", "vitest"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Key TypeScript Settings:**
- `strict: true` - Enables all strict type checks
- `module: "commonjs"` - Node.js standard module system
- `outDir: "./dist"` - Compiled output directory
- `rootDir: "./src"` - Source code directory

**Step 5: Create Express Server**

Create `src/server.ts`:

```typescript
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'trainingnf-api'
  });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  });
}

// Export app for testing
export default app;
```

**Step 6: Configure Environment Variables**

Create `.env.example`:

```
# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Database URL (to be configured in Story 1.3)
# DATABASE_URL=postgresql://user:password@localhost:5432/trainingnf
```

Create `.env` (copy from .env.example):

```bash
cp .env.example .env
```

Add `.env` to `.gitignore`:

```bash
echo ".env" >> .gitignore
echo "node_modules" >> .gitignore
echo "dist" >> .gitignore
```

**Step 7: Configure Nodemon for Hot-Reload**

Create `nodemon.json`:

```json
{
  "watch": ["src"],
  "ext": "ts",
  "ignore": ["src/**/*.test.ts", "node_modules"],
  "exec": "tsx src/server.ts",
  "env": {
    "NODE_ENV": "development"
  }
}
```

**Step 8: Configure Vitest**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/']
    }
  }
});
```

**Step 9: Create Sample Health Check Test**

Create `tests/health.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server';

describe('Health Check Endpoint', () => {
  it('should return 200 OK with status and timestamp', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('service', 'trainingnf-api');
    expect(new Date(response.body.timestamp).toString()).not.toBe('Invalid Date');
  });
});
```

**Install supertest for HTTP testing:**

```bash
npm install --save-dev supertest @types/supertest
```

**Step 10: Update package.json Scripts**

Update `package.json`:

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "trainingnf backend API",
  "main": "dist/server.js",
  "scripts": {
    "dev": "nodemon",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

**Scripts Explained:**
- `dev` - Start development server with hot-reload
- `build` - Compile TypeScript to JavaScript
- `start` - Run compiled production server
- `test` - Run tests in watch mode
- `test:run` - Run tests once
- `test:coverage` - Run tests with coverage report

### Testing Requirements

**Verification Steps (MUST COMPLETE):**

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Verify TypeScript Compilation:**
   ```bash
   npm run build
   ```
   - Should create `dist/` folder with compiled JavaScript
   - No compilation errors allowed

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   - Server MUST start on localhost:3001
   - Console should show "Server running" message

4. **Test Health Check Endpoint (manual):**
   ```bash
   curl http://localhost:3001/api/health
   ```
   - Should return 200 OK
   - Response should include status, timestamp, service fields

5. **Run Test Suite:**
   ```bash
   npm run test:run
   ```
   - Health check test MUST pass
   - No test failures allowed

6. **Create Empty Directories for Future Stories:**
   ```bash
   mkdir -p src/routes src/controllers src/services
   ```

### Common LLM Pitfalls to Avoid

**❌ DO NOT:**
- Use ts-node (slower than tsx)
- Skip test setup (tests are required from day one)
- Hard-code CORS origin (must use environment variable)
- Use port 3000 (conflicts with frontend - must use 3001)
- Skip environment variable validation (add in Story 1.4)
- Add database connections yet (wrong story - that's 1.3)
- Create todo routes/controllers (wrong epic - that's Epic 2)

**✅ DO:**
- Use tsx + nodemon for fast hot-reload
- Configure Vitest for testing framework
- Use environment variables for configuration
- Export app for testing (separate server startup from app creation)
- Keep health check simple (just status + timestamp)
- Create empty folders for future stories (routes/, controllers/, services/)

### File Structure After Completion

```
/backend/
├── src/
│   ├── routes/          # Empty (ready for Epic 2)
│   ├── controllers/     # Empty (ready for Epic 2)
│   ├── services/        # Empty (ready for Epic 2)
│   └── server.ts        # Express app with health check
├── tests/
│   └── health.test.ts   # Health check test
├── dist/                # Compiled output (after npm run build)
├── node_modules/
├── .env                 # Environment variables (gitignored)
├── .env.example         # Environment variable template
├── .gitignore           # Ignores .env, node_modules, dist
├── nodemon.json         # Hot-reload configuration
├── tsconfig.json        # TypeScript strict mode enabled
├── vitest.config.ts     # Vitest configuration
└── package.json         # Dependencies and scripts
```

### References

**Source Documents:**
- [Architecture: Backend Stack](../_bmad-output/planning-artifacts/architecture.md#backend-stack-express)
- [Architecture: Initialization Approach](../_bmad-output/planning-artifacts/architecture.md#step-2-create-backend-folder-structure)
- [Epic 1: Story 1.2](../_bmad-output/planning-artifacts/epics.md#story-12-initialize-express-backend-with-typescript-and-testing-setup)

### Next Story Context

**Story 1.3** will add PostgreSQL database with Prisma ORM. This story is intentionally backend infrastructure only.

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Implementation Notes

**Initialization:**
- Successfully created backend directory and initialized npm package
- Installed Express 4.x with TypeScript 5.x and all required dependencies
- Configured tsx + nodemon for fast hot-reload development
- Set up Vitest as the testing framework

**Key Implementation Decisions:**

1. **TypeScript Configuration:**
   - Used module: "node16" and moduleResolution: "node16" (modern Node.js approach)
   - Enabled strict mode for type safety
   - Configured proper outDir (./dist) and rootDir (./src) for clean builds

2. **Testing Setup:**
   - Chose Vitest over Jest (modern, faster, better ESM support)
   - Installed supertest for HTTP endpoint testing
   - Created sample health check test that verifies status, timestamp, and service name
   - All tests pass successfully

3. **Server Configuration:**
   - Created Express server with CORS configured for frontend origin
   - Implemented /api/health endpoint returning JSON with status, timestamp, and service name
   - Separated app export from server startup (enables testing without starting server)
   - Used environment variables for PORT and FRONTEND_URL

4. **Development Workflow:**
   - nodemon watches src/ directory for TypeScript changes
   - tsx executes TypeScript directly without compilation step
   - Hot-reload works smoothly for rapid development

### Files Created/Modified

**Created Files:**
- `backend/` - Complete Express application directory
- `backend/src/server.ts` - Express app with health check endpoint
- `backend/src/routes/` - Empty directory for future API routes
- `backend/src/controllers/` - Empty directory for business logic
- `backend/src/services/` - Empty directory for data access layer
- `backend/tests/health.test.ts` - Health check endpoint test
- `backend/.env` - Environment variables
- `backend/.env.example` - Environment variable template
- `backend/nodemon.json` - Hot-reload configuration
- `backend/vitest.config.ts` - Vitest test configuration
- `backend/.gitignore` - Ignores .env, node_modules, dist

**Configuration Files:**
- `backend/package.json` - Updated with scripts (dev, build, start, test, test:run, test:coverage)
- `backend/tsconfig.json` - TypeScript strict mode with node16 module system

### Completion Checklist

- [x] Express 4.x installed with TypeScript configuration
- [x] Node.js 20.x LTS targeted in configuration
- [x] tsx and nodemon configured for hot-reload development
- [x] Vitest configured for backend unit tests
- [x] Basic Express server starts on localhost:3001 (verified with lsof and curl)
- [x] Health check endpoint `/api/health` returns 200 OK with correct JSON structure
- [x] Test command runs successfully with sample test passing (1 test passed)
- [x] Empty routes/, controllers/, services/ folders created
- [x] TypeScript strict mode verified (strict: true in tsconfig.json)
- [x] All acceptance criteria met

**Test Results:**
```
✓ tests/health.test.ts (1)
  ✓ Health Check Endpoint (1)
    ✓ should return 200 OK with status and timestamp
```

**Health Check Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-04-20T09:41:06.261Z",
  "service": "trainingnf-api"
}
```

---

**Status:** done  
**Last Updated:** 2026-04-20  
**Completed by:** Claude Sonnet 4.5
