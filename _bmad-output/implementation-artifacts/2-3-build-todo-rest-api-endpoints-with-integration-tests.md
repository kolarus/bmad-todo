# Story 2.3: Build Todo REST API Endpoints with Integration Tests

Status: ready-for-dev

## Story

As a developer,
I want REST API endpoints for todo operations with comprehensive integration tests,
so that the frontend can perform all CRUD operations and I have confidence the API works correctly.

## Acceptance Criteria

1. `GET /api/todos` returns all todos as JSON array (200 OK)
2. `POST /api/todos` creates todo with body `{ text }`, returns created todo (201 Created)
3. `PATCH /api/todos/:id` updates completion status with body `{ completed }` or `{ text }`, returns updated todo (200 OK)
4. `DELETE /api/todos/:id` deletes todo, returns 204 No Content
5. All endpoints use Zod validation middleware
6. Invalid requests return 400 Bad Request with JSON API error format: `{ "error": { "message": "...", "code": "...", "status": 400 } }`
7. Not found (on PATCH/DELETE) returns 404 with JSON API error format
8. Server errors return 500 with JSON error (no stack traces in production)
9. Supertest integration tests cover all endpoints for success cases and error cases (400, 404)
10. All integration tests pass (100% endpoint coverage)

## Tasks / Subtasks

- [ ] Task 1: Create validation middleware (AC: 5, 6)
  - [ ] Create `backend/src/middleware/validateRequest.ts`
  - [ ] Export `validateBody(schema: ZodSchema)` middleware that parses `req.body` and returns 400 on failure
  - [ ] Error format: `{ error: { message: string, code: "VALIDATION_ERROR", status: 400 } }`
- [ ] Task 2: Create Todo controller (AC: 1-8)
  - [ ] Create `backend/src/controllers/todo.controller.ts`
  - [ ] `getAll(req, res)`: call `TodoService.findAll()`, return `res.json(todos)`
  - [ ] `create(req, res)`: call `TodoService.create(req.body)`, return `res.status(201).json(todo)`
  - [ ] `update(req, res)`: call `TodoService.update(id, req.body)`, handle null → 404
  - [ ] `remove(req, res)`: call `TodoService.delete(id)`, handle null → 404, success → 204 no body
  - [ ] 404 format: `{ error: { message: "Todo not found", code: "NOT_FOUND", status: 404 } }`
  - [ ] 500 format: `{ error: { message: "Internal server error", code: "INTERNAL_ERROR", status: 500 } }`
  - [ ] Wrap all async controllers in try/catch, pass errors to `next()`
- [ ] Task 3: Create global error handler middleware (AC: 8)
  - [ ] Add error handler in `backend/src/middleware/errorHandler.ts`
  - [ ] Catches errors passed via `next(err)`, returns 500 JSON response
  - [ ] Never exposes stack traces (check `env.NODE_ENV !== 'production'` for dev details)
- [ ] Task 4: Create Todo routes (AC: 1-4)
  - [ ] Create `backend/src/routes/todo.routes.ts`
  - [ ] `GET /` → `getAll`
  - [ ] `POST /` → `validateBody(todoCreateSchema)`, `create`
  - [ ] `PATCH /:id` → `validateBody(todoUpdateSchema)`, `update`
  - [ ] `DELETE /:id` → `remove`
- [ ] Task 5: Register routes in server.ts (AC: 1-4)
  - [ ] In `backend/src/server.ts`, add `app.use('/api/todos', todoRouter)`
  - [ ] Register error handler after all routes
- [ ] Task 6: Write integration tests (AC: 9, 10)
  - [ ] Create `backend/tests/todos.test.ts`
  - [ ] Test `GET /api/todos`: returns 200 + array
  - [ ] Test `POST /api/todos` valid body: returns 201 + todo object
  - [ ] Test `POST /api/todos` empty text: returns 400
  - [ ] Test `POST /api/todos` whitespace-only: returns 400
  - [ ] Test `POST /api/todos` > 500 chars: returns 400
  - [ ] Test `PATCH /api/todos/:id` valid: returns 200 + updated todo
  - [ ] Test `PATCH /api/todos/:id` non-existent id: returns 404
  - [ ] Test `DELETE /api/todos/:id` valid: returns 204
  - [ ] Test `DELETE /api/todos/:id` non-existent id: returns 404
  - [ ] Use beforeAll/afterAll to clean up test data

## Dev Notes

### Architecture Patterns
- **Controller-Service pattern**: Routes → Controller → Service → Prisma
- **Error format** (JSON API spec from architecture):
  ```json
  { "error": { "message": "...", "code": "...", "status": 400 } }
  ```
- **Express 5.x**: Backend uses `express@^5.2.1` — async errors are automatically caught in Express 5, but still use try/catch for explicit control
- **Validation middleware pattern**: Parses `req.body` against Zod schema, attaches parsed data back to `req.body`, calls `next()` on success

### File Paths
- `backend/src/middleware/validateRequest.ts` (NEW)
- `backend/src/middleware/errorHandler.ts` (NEW)
- `backend/src/controllers/todo.controller.ts` (NEW)
- `backend/src/routes/todo.routes.ts` (NEW)
- `backend/tests/todos.test.ts` (NEW)
- `backend/src/server.ts` (MODIFY — add todo router and error handler)

### Integration Test Strategy
Tests run against actual database (vitest.config.ts loads .env). Use unique test data and clean up:
```typescript
import { prisma } from '../src/lib/prisma';
beforeAll(async () => {
  await prisma.todo.deleteMany(); // clean slate
});
afterAll(async () => {
  await prisma.todo.deleteMany(); // cleanup
  await prisma.$disconnect();
});
```
**Important**: The integration test database is `trainingnf` on localhost:5432. Docker must be running.

### Async Error Handling in Express 5
Express 5 automatically propagates promise rejections from route handlers to the error middleware. Still use explicit try/catch in controllers for clarity.

### References
- Story 2.1 schemas: `backend/src/validation/todo.schema.ts`
- Story 2.2 service: `backend/src/services/todo.service.ts`
- Architecture API format: [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- Existing test pattern: [Source: backend/tests/health.test.ts]

## QA Gate

> **Definition of Done requires E2E verification.** All four API endpoints must be exercised end-to-end through a real browser. This story is not considered fully **done** until Story 4-2 reaches `done` status.

### E2E Scenario: Full CRUD Cycle Through the Browser (Happy Path)

**Linked Implementation:** Story 4-2 — E2E Test: Happy Path Full CRUD Cycle

**Scenario:**
- **GIVEN** the app is open in a browser and the todo list is visible
- **WHEN** the user types "Buy groceries" and presses Enter → triggers `POST /api/todos`
- **THEN** the new todo appears immediately in the list
- **WHEN** the user clicks the checkbox on that todo → triggers `PATCH /api/todos/:id`
- **THEN** the todo is visually marked as completed (strikethrough + reduced opacity)
- **WHEN** the user clicks the delete (×) button → triggers `DELETE /api/todos/:id`
- **THEN** the todo is removed from the list
- **AND** a subsequent page reload shows the correct empty or remaining state → `GET /api/todos`

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List

### Change Log
