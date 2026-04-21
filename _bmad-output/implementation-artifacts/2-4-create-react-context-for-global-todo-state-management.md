# Story 2.4: Create React Context for Global Todo State Management

Status: done

## Story

As a developer,
I want a TodoContext providing global state and operations,
so that components can access and modify todos without prop drilling.

## Acceptance Criteria

1. `TodoContext` provides: `todos` (Todo[]), `isLoading` (boolean), `error` (string | null)
2. `TodoContext` provides methods: `addTodo(text: string)`, `toggleTodo(id: string)`, `deleteTodo(id: string)`, `refetchTodos()`
3. Context fetches todos from API on mount and sets `isLoading` appropriately
4. Context handles API errors and sets `error` state with user-friendly messages
5. `useTodos()` custom hook provides type-safe access to context
6. Hook throws error if used outside `TodoProvider`
7. Component tests verify context provides expected state and methods
8. Component tests verify loading state during fetch
9. Component tests verify error state when API fails
10. All context tests pass

## Tasks / Subtasks

- [x] Task 1: Set up frontend testing infrastructure (prerequisite for tests)
  - [x] Install test deps: `cd frontend && npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom @types/jest ts-jest`
  - [x] Create `frontend/jest.config.ts` using `next/jest` transformer
  - [x] Create `frontend/jest.setup.ts` importing `@testing-library/jest-dom`
  - [x] Add `"test": "jest"` and `"test:coverage": "jest --coverage"` to `frontend/package.json` scripts
- [x] Task 2: Define shared Todo type (AC: 1)
  - [x] Create `frontend/src/lib/types/todo.ts` with `Todo` interface: `{ id: string; text: string; completed: boolean; createdAt: string; updatedAt: string }`
- [x] Task 3: Create API client module (AC: 2, 3, 4)
  - [x] Create `frontend/src/lib/api/todos.ts`
  - [x] `fetchTodos(): Promise<Todo[]>` — GET `${NEXT_PUBLIC_API_URL}/api/todos`
  - [x] `createTodo(text: string): Promise<Todo>` — POST with `{ text }`
  - [x] `updateTodo(id: string, data: Partial<Pick<Todo, 'completed' | 'text'>>): Promise<Todo>` — PATCH
  - [x] `deleteTodo(id: string): Promise<void>` — DELETE (expect 204)
  - [x] All functions throw on non-OK responses with user-friendly message from response body or fallback
- [x] Task 4: Create TodoContext (AC: 1-6)
  - [x] Create `frontend/src/lib/context/TodoContext.tsx`
  - [x] Define `TodoContextType` interface
  - [x] Create `TodoContext` with `React.createContext<TodoContextType | null>(null)`
  - [x] `TodoProvider` component that fetches todos on mount (useEffect)
  - [x] Sets `isLoading: true` before fetch, `false` after
  - [x] Sets `error` state on API failure
  - [x] `useTodos()` hook that reads context and throws if null
  - [x] Export: `TodoProvider`, `useTodos`
- [x] Task 5: Write context tests (AC: 7, 8, 9, 10)
  - [x] Create `frontend/src/lib/context/__tests__/TodoContext.test.tsx`
  - [x] Mock `../api/todos` module with `jest.mock`
  - [x] Test: context provides todos when fetch succeeds
  - [x] Test: `isLoading` is true during fetch, false after
  - [x] Test: `error` is set when fetch fails
  - [x] Test: `useTodos()` throws if used outside provider
  - [x] Run `cd frontend && npm test -- --testPathPattern=TodoContext`

## Dev Notes

### Architecture Patterns
- **State management**: React Context + useState per architecture
- **API base URL**: Read from `process.env.NEXT_PUBLIC_API_URL` (never hardcode)
- **'use client' directive**: All context and hooks MUST have `'use client'` at top
- **Error messages**: User-friendly, specific (e.g., "Couldn't load your todos. Check your connection.")

### Frontend Test Setup (jest.config.ts)
```typescript
import type { Config } from 'jest';
import nextJest from 'next/jest';
const createJestConfig = nextJest({ dir: './' });
const config: Config = {
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
export default createJestConfig(config);
```
Note: Use `setupFilesAfterFramework` NOT `setupFilesAfterEnv` for next/jest.

Actually, correct key is `setupFilesAfterEnv`:
```typescript
const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
};
```

### API Client Error Handling Pattern
```typescript
const res = await fetch(url, options);
if (!res.ok) {
  const body = await res.json().catch(() => null);
  throw new Error(body?.error?.message ?? 'Unexpected error');
}
```

### File Paths
- `frontend/src/lib/types/todo.ts` (NEW)
- `frontend/src/lib/api/todos.ts` (NEW)
- `frontend/src/lib/context/TodoContext.tsx` (NEW)
- `frontend/src/lib/context/__tests__/TodoContext.test.tsx` (NEW)
- `frontend/jest.config.ts` (NEW)
- `frontend/jest.setup.ts` (NEW)
- `frontend/package.json` (MODIFY — add test scripts and deps)

### Environment Variable Note
In tests, `process.env.NEXT_PUBLIC_API_URL` is undefined. Mock the API module to avoid real HTTP calls.

### References
- Architecture context: [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- Todo type: derived from Prisma schema [Source: backend/prisma/schema.prisma]
- Story AC: [Source: _bmad-output/planning-artifacts/epics.md#Story 2.4]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.6

### Debug Log References

### Completion Notes List

### File List

### Change Log
