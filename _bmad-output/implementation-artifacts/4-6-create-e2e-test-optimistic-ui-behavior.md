# Story 4.6: Create E2E Test - Optimistic UI Behavior

Status: ready-for-dev

## Story

As a QA engineer,
I want an E2E test verifying optimistic UI updates work correctly,
So that I confirm the app feels instant while maintaining data integrity.

## Acceptance Criteria

1. Test navigates to application
2. Test adds a todo "Test optimistic UI"
3. Test verifies todo appears in UI immediately (before API response completes — within 200ms visual check)
4. Test waits for API response to complete
5. Test verifies todo remains in list (successful backend sync)
6. Test refreshes page to confirm data persisted to database
7. Test verifies todo is still present after refresh
8. Test toggles todo completion
9. Test verifies visual change happens (checkbox + strikethrough)
10. Test verifies data persists after another refresh
11. Test passes consistently
12. Training requirement met: E2E Test 5 complete

## Tasks / Subtasks

- [ ] Task 1: Create optimistic UI test file (AC: 1-12)
  - [ ] Create `e2e/tests/optimistic-ui.spec.ts`
  - [ ] Import helpers from `../fixtures`
  - [ ] Write test 1: "should show todo immediately before API sync completes"
    - Clear all todos, navigate to `/`
    - Use `page.route()` to add latency to POST (delay 500ms, then continue)
    - Type "Test optimistic UI" and press Enter
    - Immediately verify todo is visible in list (before API returns)
    - Wait for route to complete
    - Verify todo still in list
    - Remove route intercept
  - [ ] Write test 2: "should persist optimistically added todo after refresh"
    - Clear all todos, navigate to `/`
    - Add "Persisted todo"
    - Verify visible
    - Reload page
    - Verify still present
  - [ ] Write test 3: "should persist toggle state after refresh"
    - Clear todos, navigate
    - Add "Toggle me"
    - Click checkbox to complete
    - Reload page
    - Verify todo still shows as completed

- [ ] Task 2: Run tests to confirm they pass
  - [ ] `cd e2e && npm test optimistic-ui`

## Dev Notes

### Optimistic UI Test with Network Delay
```typescript
import { test, expect } from '@playwright/test';
import { clearAllTodos, addTodo } from '../fixtures';

test.describe('Optimistic UI', () => {
  test.beforeEach(async ({ page }) => {
    await clearAllTodos(page);
    await page.goto('/');
  });

  test('should show todo immediately before API sync', async ({ page }) => {
    // Add delay to POST so we can check UI before API returns
    let resolvePost: () => void;
    const postDelay = new Promise<void>(r => { resolvePost = r; });
    
    await page.route('**/api/todos', async route => {
      if (route.request().method() === 'POST') {
        await new Promise(r => setTimeout(r, 500)); // 500ms delay
        await route.continue();
      } else {
        await route.continue();
      }
    });
    
    await page.getByTestId('todo-input').fill('Test optimistic UI');
    await page.keyboard.press('Enter');
    
    // Verify todo appears immediately (optimistic) — within 200ms
    await expect(page.getByText('Test optimistic UI')).toBeVisible({ timeout: 200 });
    
    // Wait for API to complete
    await page.waitForResponse(resp => resp.url().includes('/api/todos') && resp.request().method() === 'POST');
    
    // Todo still there after real API response
    await expect(page.getByText('Test optimistic UI')).toBeVisible();
    
    await page.unroute('**/api/todos');
  });

  test('should persist optimistically added todo after refresh', async ({ page }) => {
    await addTodo(page, 'Persisted todo');
    await expect(page.getByText('Persisted todo')).toBeVisible();
    
    await page.reload();
    await expect(page.getByText('Persisted todo')).toBeVisible({ timeout: 5000 });
  });

  test('should persist toggle state after refresh', async ({ page }) => {
    await addTodo(page, 'Toggle me');
    const checkbox = page.getByTestId('todo-item')
      .filter({ hasText: 'Toggle me' })
      .getByTestId('todo-checkbox');
    
    await checkbox.click();
    await expect(checkbox).toBeChecked();
    
    await page.reload();
    
    // Verify completed state persisted
    const reloadedCheckbox = page.getByTestId('todo-item')
      .filter({ hasText: 'Toggle me' })
      .getByTestId('todo-checkbox');
    await expect(reloadedCheckbox).toBeChecked({ timeout: 5000 });
  });
});
```

### Immediate Visibility Check
The optimistic UI pattern adds the todo to React state before the API call returns. So `toBeVisible({ timeout: 200 })` should succeed if optimistic updates are working. If this is too tight, increase to 500ms — the key is it appears before the API returns (which is delayed by 500ms in this test).

### waitForResponse
```typescript
await page.waitForResponse(
  resp => resp.url().includes('/api/todos') && resp.request().method() === 'POST'
);
```
This waits for the POST to complete, confirming backend sync happened.

### Prerequisite
- Story 4.1 complete (infrastructure + data-testid attributes)

## File List

**New files:**
- `e2e/tests/optimistic-ui.spec.ts`

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-21 | Story created | Dev Agent |
