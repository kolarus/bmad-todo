# Story 4.1: Set Up Playwright E2E Testing Infrastructure

Status: ready-for-dev

## Story

As a developer,
I want Playwright configured with proper test structure and utilities,
So that I can write reliable E2E tests that run consistently in CI/CD.

## Acceptance Criteria

1. Playwright is installed in `e2e/` directory with `package.json`
2. `playwright.config.ts` defines test configuration with `baseURL` pointing to app (default: `http://localhost:3000`)
3. Test browsers are configured (Chromium minimum; Firefox and WebKit optional)
4. Test directory structure is created (`e2e/tests/`, `e2e/fixtures/`)
5. Base URL is configurable via `BASE_URL` environment variable
6. Screenshots on failure are enabled
7. Video recording on failure is enabled
8. Test timeout is set to 30 seconds default
9. Helper functions are created for common operations: `addTodo(page, text)`, `getTodos(page)`
10. Test database cleanup utility is available (direct API call to DELETE all todos or API-based reset)
11. Running `npm test` in `e2e/` executes all Playwright tests
12. Tests can run in headless mode (CI) and headed mode (local development: `npm run test:headed`)
13. Playwright HTML reporter is configured for test results

## Tasks / Subtasks

- [ ] Task 1: Initialize e2e package and install Playwright (AC: 1, 3, 11, 12)
  - [ ] Create `e2e/package.json` with name, scripts, and Playwright dependency
  - [ ] Run `npm install` in `e2e/` to install `@playwright/test`
  - [ ] Run `npx playwright install chromium` to download browser binaries
  - [ ] Add `test` script: `playwright test`
  - [ ] Add `test:headed` script: `playwright test --headed`
  - [ ] Add `test:ui` script: `playwright test --ui`

- [ ] Task 2: Create playwright.config.ts (AC: 2, 3, 5, 6, 7, 8, 13)
  - [ ] Create `e2e/playwright.config.ts`
  - [ ] Set `baseURL` from `process.env.BASE_URL ?? 'http://localhost:3000'`
  - [ ] Configure Chromium as primary browser (projects array)
  - [ ] Set `screenshot: 'only-on-failure'`
  - [ ] Set `video: 'on-first-retry'`
  - [ ] Set `timeout: 30000`
  - [ ] Set `reporter: 'html'` (or `[['html'], ['list']]` for CI)
  - [ ] Set `retries: process.env.CI ? 2 : 0`

- [ ] Task 3: Create directory structure (AC: 4)
  - [ ] Create `e2e/tests/` directory (placeholder file or first test)
  - [ ] Create `e2e/fixtures/` directory

- [ ] Task 4: Create test helpers (AC: 9, 10)
  - [ ] Create `e2e/fixtures/helpers.ts`
  - [ ] Implement `addTodo(page: Page, text: string): Promise<void>` — fills input and presses Enter
  - [ ] Implement `getTodos(page: Page): Promise<string[]>` — returns text of all visible todo items
  - [ ] Implement `clearAllTodos(page: Page): Promise<void>` — calls `DELETE /api/todos` via `page.request` (add this endpoint if it doesn't exist, or use a loop)
  - [ ] Create `e2e/fixtures/index.ts` that exports all helpers

- [ ] Task 5: Add backend bulk-delete endpoint (AC: 10)
  - [ ] Check if `DELETE /api/todos` (delete all) exists in backend
  - [ ] If not: add `router.delete('/', todoController.deleteAllTodos)` to `backend/src/routes/todos.ts`
  - [ ] Add `deleteAllTodos` controller + service method in backend (only for test/dev use — guarded by `NODE_ENV !== 'production'`)
  - [ ] Alternatively: the helper can delete todos one-by-one using `GET + DELETE per id`

- [ ] Task 6: Verify setup works (AC: 11, 12)
  - [ ] Create a smoke test `e2e/tests/smoke.spec.ts` that navigates to baseURL and checks the page title or input is visible
  - [ ] Run `npm test` in `e2e/` with app running (verify 1 test passes)

## Dev Notes

### Project Structure
```
e2e/
  package.json
  playwright.config.ts
  fixtures/
    helpers.ts
    index.ts
  tests/
    smoke.spec.ts
    (further tests added in stories 4.2–4.6)
```

### playwright.config.ts Pattern
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  reporter: process.env.CI ? 'list' : [['html', { open: 'never' }], ['list']],
});
```

### Helper Pattern
```typescript
import { Page } from '@playwright/test';

export async function addTodo(page: Page, text: string): Promise<void> {
  await page.getByPlaceholder('What needs to be done?').fill(text);
  await page.keyboard.press('Enter');
}

export async function getTodos(page: Page): Promise<string[]> {
  const items = page.locator('[data-testid="todo-text"]');
  return items.allTextContents();
}

export async function clearAllTodos(page: Page): Promise<void> {
  const apiURL = process.env.API_URL ?? 'http://localhost:3001';
  await page.request.delete(`${apiURL}/api/todos`);
}
```

### Backend Cleanup Endpoint
- Add `DELETE /api/todos` guarded by `if (process.env.NODE_ENV === 'production') return res.status(403).json(...)`
- This only runs in dev/test environments
- Alternatively: `clearAllTodos` can do `GET /api/todos` then loop DELETE per ID

### data-testid Attributes
The frontend components must expose `data-testid` attributes for reliable Playwright selection. Check existing components. If missing, add:
- `data-testid="todo-input"` on the input field in `TodoInput.tsx`
- `data-testid="todo-item"` on each todo card in `TodoCard.tsx`
- `data-testid="todo-text"` on the todo text span
- `data-testid="todo-checkbox"` on the checkbox
- `data-testid="todo-delete"` on the delete button
- `data-testid="empty-state"` on the EmptyState component
- `data-testid="error-state"` on the ErrorState component
- `data-testid="loading-state"` on the LoadingState component
- `data-testid="retry-button"` on retry buttons

### Key Existing Files to Reference
- `frontend/src/components/TodoInput.tsx`
- `frontend/src/components/TodoCard.tsx`
- `frontend/src/components/TodoList.tsx`
- `backend/src/routes/todos.ts`
- `backend/src/controllers/todo.controller.ts`
- `backend/src/services/todo.service.ts`

## File List

**New files:**
- `e2e/package.json`
- `e2e/playwright.config.ts`
- `e2e/fixtures/helpers.ts`
- `e2e/fixtures/index.ts`
- `e2e/tests/smoke.spec.ts`

**Modified files (if data-testid needed):**
- `frontend/src/components/TodoInput.tsx`
- `frontend/src/components/TodoCard.tsx`
- `frontend/src/components/TodoList.tsx`
- `frontend/src/components/ErrorBoundary.tsx` (possibly)

**Modified files (if bulk-delete endpoint needed):**
- `backend/src/routes/todos.ts`
- `backend/src/controllers/todo.controller.ts`
- `backend/src/services/todo.service.ts`

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-21 | Story created | Dev Agent |
