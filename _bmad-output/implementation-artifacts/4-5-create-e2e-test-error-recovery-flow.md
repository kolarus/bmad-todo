# Story 4.5: Create E2E Test - Error Recovery Flow

Status: ready-for-dev

## Story

As a QA engineer,
I want an E2E test simulating backend failure and recovery,
So that I verify error handling and user recovery paths work correctly.

## Acceptance Criteria

1. Test intercepts API requests using `page.route()`
2. Test simulates backend down by returning 500 error for `GET /api/todos`
3. Test navigates to application
4. Test verifies error state appears (error message visible)
5. Test verifies error message includes actionable guidance
6. Test verifies "Retry" button is present
7. Test restores normal API responses (removes route intercept with `page.unroute()`)
8. Test clicks "Retry" button
9. Test verifies loading state appears
10. Test verifies todos load successfully (or empty state if no todos)
11. Test verifies application recovered gracefully
12. Test simulates failed POST by intercepting and returning 500
13. Test attempts to add todo "Test todo"
14. Test verifies error toast appears with specific message
15. Test verifies todo is NOT in the list (optimistic UI rolled back)
16. Test passes consistently
17. Training requirement met: E2E Test 4 complete

## Tasks / Subtasks

- [ ] Task 1: Create error recovery test file (AC: 1-17)
  - [ ] Create `e2e/tests/error-recovery.spec.ts`
  - [ ] Write test 1: "should show error state when backend is down and recover on retry"
    - Clear all todos via API (before intercepting)
    - Set up route to intercept `GET /api/todos` → return `{ status: 500 }`
    - Navigate to `/`
    - Verify error state is visible (`data-testid="error-state"`)
    - Verify "Retry" button is visible
    - Remove route intercept
    - Click "Retry"
    - Verify loading state or todos/empty state appears (successful recovery)
  - [ ] Write test 2: "should rollback optimistic update on failed POST"
    - Clear all todos via API
    - Navigate to `/`
    - Set up route to intercept `POST /api/todos` → return `{ status: 500 }`
    - Add todo "Test todo" (optimistic UI will show it briefly)
    - Verify error toast appears (`[role="alert"]` visible)
    - Verify "Test todo" is NOT in the list (rolled back)
    - Remove route intercept

- [ ] Task 2: Run tests to confirm they pass
  - [ ] `cd e2e && npm test error-recovery`

## Dev Notes

### Route Interception Pattern
```typescript
import { test, expect } from '@playwright/test';
import { clearAllTodos } from '../fixtures';

test.describe('Error Recovery', () => {
  test('should show error state and recover on retry', async ({ page }) => {
    await clearAllTodos(page);
    
    // Intercept GET todos to simulate backend down
    await page.route('**/api/todos', route => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) });
      } else {
        route.continue();
      }
    });
    
    await page.goto('/');
    
    // Verify error state
    await expect(page.getByTestId('error-state')).toBeVisible();
    await expect(page.getByTestId('retry-button')).toBeVisible();
    
    // Remove intercept and click retry
    await page.unroute('**/api/todos');
    await page.getByTestId('retry-button').click();
    
    // Verify recovery — loading state → empty state (no todos)
    // Wait for loading to resolve
    await expect(page.getByTestId('error-state')).not.toBeVisible({ timeout: 5000 });
    // Either empty state or todos visible
    await expect(
      page.getByTestId('empty-state').or(page.getByTestId('todo-item'))
    ).toBeVisible({ timeout: 5000 });
  });

  test('should rollback optimistic update on failed POST', async ({ page }) => {
    await clearAllTodos(page);
    await page.goto('/');
    
    // Intercept POST to simulate failure
    await page.route('**/api/todos', route => {
      if (route.request().method() === 'POST') {
        route.fulfill({ status: 500, body: JSON.stringify({ error: 'Failed to save' }) });
      } else {
        route.continue();
      }
    });
    
    // Try to add todo
    await page.getByTestId('todo-input').fill('Test todo');
    await page.keyboard.press('Enter');
    
    // Verify error toast appears
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 5000 });
    
    // Verify todo rolled back (not in list)
    await expect(page.getByText('Test todo')).not.toBeVisible({ timeout: 5000 });
    
    await page.unroute('**/api/todos');
  });
});
```

### URL Pattern for Route Interception
The API URL in development is `http://localhost:3001`. Since Playwright runs against the frontend at `http://localhost:3000`, and the Next.js frontend makes cross-origin requests to `http://localhost:3001`, use:
- `'**/api/todos'` or `'http://localhost:3001/api/todos'`
- Check `frontend/.env.local` or `frontend/src/lib/api.ts` for the API base URL to confirm.

### Checking ErrorState Component
From `frontend/src/components/TodoList.tsx` or similar — the `ErrorState` component renders when initial load fails. Confirm:
- What `data-testid` attribute it has (or add one in Story 4.1)
- What the retry button looks like (add `data-testid="retry-button"`)

### Toast Timing
The error toast auto-dismisses after 5 seconds (from Story 2.9). The test needs to check for it within that window. Playwright's default assertions wait up to 5s by default, which should be sufficient.

### Prerequisite
- Story 4.1 complete
- `data-testid="error-state"`, `data-testid="retry-button"` added in Story 4.1

## File List

**New files:**
- `e2e/tests/error-recovery.spec.ts`

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-21 | Story created | Dev Agent |
