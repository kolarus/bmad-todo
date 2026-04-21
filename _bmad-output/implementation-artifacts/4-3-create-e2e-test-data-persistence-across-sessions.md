# Story 4.3: Create E2E Test - Data Persistence Across Sessions

Status: ready-for-dev

## Story

As a QA engineer,
I want an E2E test verifying data persists across browser refresh,
So that I confirm todos are stored in the database and survive sessions.

## Acceptance Criteria

1. Test creates a todo "Walk the dog"
2. Test verifies todo appears in the list
3. Test refreshes the page (`page.reload()`)
4. Test verifies todo "Walk the dog" is still in the list after refresh
5. Test creates a second todo "Read a book"
6. Test creates a new browser context (simulates closing/reopening browser)
7. Test verifies both todos are present in the new context
8. Test verifies data was fetched from backend (not localStorage — confirmed by new context having data)
9. Test passes consistently
10. Training requirement met: E2E Test 2 complete

## Tasks / Subtasks

- [ ] Task 1: Create persistence test file (AC: 1-10)
  - [ ] Create `e2e/tests/persistence.spec.ts`
  - [ ] Import `test`, `expect`, `Browser` from `@playwright/test`
  - [ ] Import helpers from `../fixtures`
  - [ ] Write test 1: "should persist todo after page refresh"
    - Clear all todos via API
    - Navigate to `/`
    - Add todo "Walk the dog"
    - Verify todo visible
    - Call `page.reload()`
    - Wait for loading state to resolve
    - Verify "Walk the dog" still in list
  - [ ] Write test 2: "should persist todos across new browser context"
    - Clear all todos via API
    - Open page, add "Walk the dog" and "Read a book"
    - Open a new browser context (`browser.newContext()`)
    - Navigate to `/` in new context
    - Verify both todos are present
    - Close second context

- [ ] Task 2: Run tests to confirm they pass (AC: 9)
  - [ ] `cd e2e && npm test persistence`

## Dev Notes

### Persistence Test Pattern
```typescript
import { test, expect, Browser } from '@playwright/test';
import { addTodo, clearAllTodos, getTodos } from '../fixtures';

test.describe('Data Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await clearAllTodos(page);
  });

  test('should persist todo after page refresh', async ({ page }) => {
    await page.goto('/');
    await addTodo(page, 'Walk the dog');
    await expect(page.getByTestId('todo-item')).toHaveCount(1);
    
    await page.reload();
    // Wait for loading to complete
    await expect(page.getByTestId('loading-state')).not.toBeVisible({ timeout: 5000 }).catch(() => {});
    await expect(page.getByText('Walk the dog')).toBeVisible();
  });

  test('should persist todos across new browser context', async ({ page, browser }) => {
    await page.goto('/');
    await addTodo(page, 'Walk the dog');
    await addTodo(page, 'Read a book');
    await expect(page.getByTestId('todo-item')).toHaveCount(2);
    
    // New context simulates closing and reopening browser
    const newContext = await browser.newContext();
    const newPage = await newContext.newPage();
    await newPage.goto('/');
    
    // Both todos should still be there (fetched from backend, not localStorage)
    await expect(newPage.getByText('Walk the dog')).toBeVisible();
    await expect(newPage.getByText('Read a book')).toBeVisible();
    
    await newContext.close();
  });
});
```

### Loading State Handling
After `page.reload()`, there may be a brief loading state. Use:
```typescript
// Option 1: wait for loading indicator to disappear
await expect(page.getByTestId('loading-state')).not.toBeVisible({ timeout: 5000 });

// Option 2: wait for todo text to appear (implicit wait is fine in Playwright)
await expect(page.getByText('Walk the dog')).toBeVisible({ timeout: 5000 });
```

### Prerequisite
- Story 4.1 and 4.2 complete

## File List

**New files:**
- `e2e/tests/persistence.spec.ts`

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-21 | Story created | Dev Agent |
