# Story 4.2: Create E2E Test - Happy Path (Full CRUD Cycle)

Status: ready-for-dev

## Story

As a QA engineer,
I want an E2E test covering the complete todo lifecycle,
So that I verify all CRUD operations work together in a real user scenario.

## Acceptance Criteria

1. Test navigates to application home page
2. Test verifies page loads successfully (input field visible)
3. Test creates a new todo by typing "Buy groceries" and pressing Enter
4. Test verifies todo appears in the list immediately with correct text
5. Test verifies todo is marked as active (not completed)
6. Test clicks the checkbox to mark todo complete
7. Test verifies todo shows completed state (visual change — opacity/strikethrough)
8. Test clicks delete button (×) on the todo
9. Test verifies todo is removed from the list
10. Test verifies empty state appears ("No todos yet" or similar)
11. Test passes consistently (no flakiness)
12. Test completes in < 30 seconds
13. Training requirement met: E2E Test 1 complete

## Tasks / Subtasks

- [ ] Task 1: Create test file (AC: 1-13)
  - [ ] Create `e2e/tests/happy-path.spec.ts`
  - [ ] Import `test`, `expect` from `@playwright/test`
  - [ ] Import helpers `addTodo`, `clearAllTodos` from `../fixtures`
  - [ ] Add `beforeEach` that calls `clearAllTodos` via API and navigates to `'/'`
  - [ ] Write test: "should complete full CRUD cycle — create, complete, delete"
    - Navigate to `/`
    - Verify input is visible
    - Add todo "Buy groceries"
    - Verify "Buy groceries" appears in list
    - Verify todo does NOT have completed styling
    - Click checkbox
    - Verify todo has completed styling (aria-checked or visual class)
    - Click delete button
    - Verify todo removed
    - Verify empty state visible
  - [ ] Run test to confirm it passes: `cd e2e && npm test happy-path`

## Dev Notes

### Test Pattern
```typescript
import { test, expect } from '@playwright/test';
import { addTodo, clearAllTodos } from '../fixtures';

test.describe('Happy Path - Full CRUD Cycle', () => {
  test.beforeEach(async ({ page }) => {
    await clearAllTodos(page);
    await page.goto('/');
  });

  test('should complete full CRUD cycle', async ({ page }) => {
    // Verify page loaded
    await expect(page.getByTestId('todo-input')).toBeVisible();

    // Create todo
    await addTodo(page, 'Buy groceries');
    
    // Verify created
    const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Buy groceries' });
    await expect(todoItem).toBeVisible();
    
    // Verify not completed
    const checkbox = todoItem.getByTestId('todo-checkbox');
    await expect(checkbox).not.toBeChecked();
    
    // Complete it
    await checkbox.click();
    await expect(checkbox).toBeChecked();
    
    // Verify visual distinction (completed class)
    await expect(todoItem).toHaveClass(/completed|opacity/);
    
    // Delete it
    await todoItem.getByTestId('todo-delete').click();
    await expect(todoItem).not.toBeVisible();
    
    // Verify empty state
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });
});
```

### Selector Strategy
- Use `data-testid` attributes (added in Story 4.1)
- Use `getByTestId()` for stable selectors — do NOT use text or CSS selectors for interactive elements
- `getByRole('checkbox')` is also acceptable for checkboxes
- `getByPlaceholder('What needs to be done?')` for input if testid not added yet

### Completed State Verification
Check how the completed state is rendered (from `frontend/src/components/TodoCard.tsx`):
- Look for `line-through` or `opacity-60` CSS classes, or
- `aria-checked` on checkbox, or  
- A `data-completed="true"` attribute
Use whatever the component actually applies.

### Prerequisite
- Story 4.1 must be complete (Playwright installed, helpers available)
- App must be running at `http://localhost:3000` and backend at `http://localhost:3001`

## File List

**New files:**
- `e2e/tests/happy-path.spec.ts`

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-21 | Story created | Dev Agent |
