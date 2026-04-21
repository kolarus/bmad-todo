# Story 2.2: Create Todo Service Layer with Prisma CRUD Operations + Unit Tests

Status: ready-for-dev

## Story

As a developer,
I want a service layer that handles all todo database operations with unit tests,
so that business logic is separated from HTTP handling and thoroughly tested.

## Acceptance Criteria

1. `TodoService.findAll()` retrieves all todos ordered by `createdAt` descending
2. `TodoService.create(data)` creates a new todo with validated data, returns the created `Todo`
3. `TodoService.update(id, data)` updates todo completion status, returns updated `Todo` or `null` if not found
4. `TodoService.delete(id)` removes a todo by ID, returns deleted `Todo` or `null` if not found
5. Each method returns proper TypeScript types from Prisma (`Todo`, `Todo[]`)
6. Service handles Prisma `P2025` (record not found) errors and returns `null`
7. Unit tests cover all CRUD operations using Vitest mocks for PrismaClient
8. Unit tests verify not-found handling (returns `null`)
9. Test coverage for service layer is > 80%
10. All tests pass successfully

## Tasks / Subtasks

- [ ] Task 1: Create Prisma singleton module (AC: 1-4)
  - [ ] Create `backend/src/lib/prisma.ts` that exports a singleton PrismaClient (using Prisma 7 + PrismaPg adapter pattern from server.ts)
  - [ ] This module reads `DATABASE_URL` from `env` config
- [ ] Task 2: Implement TodoService (AC: 1-6)
  - [ ] Create `backend/src/services/todo.service.ts`
  - [ ] Implement `findAll()`: `prisma.todo.findMany({ orderBy: { createdAt: 'desc' } })`
  - [ ] Implement `create(data: TodoCreate)`: `prisma.todo.create({ data: { text: data.text } })`
  - [ ] Implement `update(id: string, data: TodoUpdate)`: `prisma.todo.update({ where: { id }, data })` — catch P2025 and return null
  - [ ] Implement `delete(id: string)`: `prisma.todo.delete({ where: { id } })` — catch P2025 and return null
  - [ ] Import `TodoCreate`, `TodoUpdate` types from `../validation/todo.schema`
- [ ] Task 3: Write unit tests (AC: 7, 8, 9, 10)
  - [ ] Create `backend/src/services/todo.service.test.ts`
  - [ ] Mock PrismaClient using `vi.mock('../lib/prisma')`
  - [ ] Test `findAll()` returns array ordered correctly (mock returns array)
  - [ ] Test `create()` calls prisma.todo.create with correct data
  - [ ] Test `update()` returns updated todo on success
  - [ ] Test `update()` returns null when Prisma throws P2025
  - [ ] Test `delete()` returns deleted todo on success
  - [ ] Test `delete()` returns null when Prisma throws P2025
  - [ ] Run `cd backend && npm run test:run` and verify passing

## Dev Notes

### Architecture Patterns
- **Prisma version**: `@prisma/client@^7.7.0` with `@prisma/adapter-pg`
- **Prisma 7 client creation pattern** (from server.ts):
  ```typescript
  import { PrismaClient } from '@prisma/client';
  import { PrismaPg } from '@prisma/adapter-pg';
  import { Pool } from 'pg';
  import { env } from '../config/env';
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  export const prisma = new PrismaClient({ adapter });
  ```
- **Singleton pattern**: Create prisma instance once and export it. Server.ts should import from this module rather than creating its own
- **P2025 error code**: Prisma throws `PrismaClientKnownRequestError` with code `P2025` when record not found. Catch with:
  ```typescript
  import { Prisma } from '@prisma/client';
  catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      return null;
    }
    throw e;
  }
  ```
- **TodoCreate/TodoUpdate types**: Import from `../validation/todo.schema` (Story 2.1 creates this)

### File Paths
- `backend/src/lib/prisma.ts` (NEW — prisma singleton)
- `backend/src/services/todo.service.ts` (NEW)
- `backend/src/services/todo.service.test.ts` (NEW)
- `backend/src/server.ts` (MODIFY — import prisma from `./lib/prisma` instead of local definition)

### Mocking Strategy for Unit Tests
Use Vitest's `vi.mock()` to mock the prisma module:
```typescript
import { vi, describe, it, expect, beforeEach } from 'vitest';
vi.mock('../lib/prisma', () => ({
  prisma: {
    todo: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }
  }
}));
```
Then import and cast to get typed mock functions.

### Prisma Error Simulation in Tests
```typescript
import { Prisma } from '@prisma/client';
const notFoundError = new Prisma.PrismaClientKnownRequestError('Not found', {
  code: 'P2025',
  clientVersion: '7.0.0'
});
```

### References
- Story 2.1 output: `backend/src/validation/todo.schema.ts`
- Architecture service layer pattern: [Source: _bmad-output/planning-artifacts/architecture.md#Backend Stack]
- Existing Prisma usage: [Source: backend/src/server.ts]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List

### Change Log
