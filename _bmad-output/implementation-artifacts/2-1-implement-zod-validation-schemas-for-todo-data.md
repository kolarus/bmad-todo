# Story 2.1: Implement Zod Validation Schemas for Todo Data

Status: ready-for-dev

## Story

As a developer,
I want shared Zod validation schemas for todo data,
so that both frontend and backend validate data consistently and catch errors early with user-friendly messages.

## Acceptance Criteria

1. A `todoCreateSchema` validates todo creation: text is a required string, 1–500 chars, trimmed, non-empty/whitespace-only
2. A `todoUpdateSchema` validates todo updates: completed is a boolean; text is an optional string 1–500 chars
3. Backend schemas live in `backend/src/validation/todo.schema.ts`
4. Frontend schemas live in `frontend/src/lib/validation/todo.ts` (duplicated intentionally — no shared package)
5. TypeScript types `TodoCreate` and `TodoUpdate` are inferred from schemas using `z.infer<typeof ...>`
6. Unit tests in `backend/src/validation/todo.schema.test.ts` verify schema catches: empty strings, whitespace-only strings, strings > 500 chars
7. Unit tests verify schema allows valid todo text (1–500 chars)
8. Error messages are user-friendly: "Todo text is required", "Todo text cannot be empty or whitespace", "Todo text must be 500 characters or less"

## Tasks / Subtasks

- [ ] Task 1: Create backend Zod schemas (AC: 1, 2, 3, 5)
  - [ ] Create `backend/src/validation/todo.schema.ts` with `todoCreateSchema` and `todoUpdateSchema`
  - [ ] Infer and export `TodoCreate` and `TodoUpdate` TypeScript types
  - [ ] Use `.trim()` before min/max validation to strip whitespace
  - [ ] Use custom error messages per AC 8
- [ ] Task 2: Create frontend Zod schemas (AC: 1, 2, 4, 5)
  - [ ] Create `frontend/src/lib/validation/todo.ts` with identical schemas
  - [ ] Infer and export same TypeScript types
- [ ] Task 3: Write backend unit tests (AC: 6, 7, 8)
  - [ ] Create `backend/src/validation/todo.schema.test.ts`
  - [ ] Test `todoCreateSchema`: empty string rejects, whitespace-only rejects, > 500 chars rejects
  - [ ] Test `todoCreateSchema`: valid text (1 char, 500 chars, normal text) passes
  - [ ] Test `todoUpdateSchema`: valid `{ completed: true }` passes
  - [ ] Test `todoUpdateSchema`: valid `{ text: "foo", completed: false }` passes
  - [ ] Run `cd backend && npm test` to confirm passing

## Dev Notes

### Architecture Patterns
- **Zod version**: `zod@^4.3.6` is installed in backend. Frontend does NOT have Zod yet — install it.
- **Schema duplication**: Architecture explicitly calls for schemas in both `backend/src/validation/` and `frontend/src/lib/validation/` — no shared package
- **Zod v4 API**: Uses standard `z.string().min().max()`. Use `.trim()` then `.min(1, msg).max(500, msg)` for text validation
- **Error messages**: Use object syntax: `z.string().min(1, { message: "Todo text is required" })`

### File Paths
- Backend: `backend/src/validation/todo.schema.ts` (NEW)
- Backend tests: `backend/src/validation/todo.schema.test.ts` (NEW)  
- Frontend: `frontend/src/lib/validation/todo.ts` (NEW — create `frontend/src/lib/validation/` directory)

### Frontend Zod Setup
Zod is NOT yet installed in frontend. Add to `frontend/package.json` dependencies and install:
```
cd frontend && npm install zod
```

### Testing
- Backend uses Vitest (`vitest.config.ts` already configured)
- Test file lives alongside source: `backend/src/validation/todo.schema.test.ts`
- Run: `cd backend && npm run test:run`

### References
- Architecture: Zod validation - [Source: _bmad-output/planning-artifacts/architecture.md#Data Validation: Zod]
- Story AC: [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1]
- Backend Zod env example: [Source: backend/src/config/env.ts]

## QA Gate

> **Definition of Done requires E2E verification.** The validation schemas defined here must be verifiable through real browser interactions. This story is not considered fully **done** until Story 4-4 reaches `done` status.

### E2E Scenario: Empty Input Is Silently Rejected in the Browser

**Linked Implementation:** Story 4-4 — E2E Test: Empty Input Validation

**Scenario:**
- **GIVEN** the user opens the app and the TodoInput field is focused
- **WHEN** the user presses Enter with an empty string or whitespace-only text
- **THEN** no new todo is added to the list
- **AND** no error message or alert is shown (silent prevention per UX-DR3)
- **AND** the input field remains focused and ready for valid input

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List

### Change Log
