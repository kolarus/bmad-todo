# Story 4.4: Create E2E Test - Empty Input Validation

Status: ready-for-dev

## Story

As a QA engineer,
I want an E2E test verifying empty input is silently prevented,
So that I confirm the validation works without showing error modals.

## Acceptance Criteria

1. Test navigates to application
2. Test focuses input field
3. Test presses Enter without typing anything
4. Test verifies no todo is added to the list
5. Test verifies no error message or modal appears (silent validation)
6. Test verifies empty state remains visible ("No todos yet")
7. Test types only whitespace ("   ") and presses Enter
8. Test verifies no todo is added (whitespace-only also prevented)
9. Test types valid text "Valid todo" and presses Enter
10. Test verifies todo is added successfully
11. Test verifies input field is cleared and refocused after successful add
12. Test passes consistently
13. Training requirement met: E2E Test 3 complete

## Tasks / Subtasks

- [ ] Task 1: Create validation test file (AC: 1-13)
  - [ ] Create `e2e/tests/validation.spec.ts`
  - [ ] Import helpers from `../fixtures`
  - [ ] Write test: "should silently prevent empty todo submission"
    - Clear all todos, navigate to `/`
    - Get reference to input element
    - Click input to focus
    - Press Enter (no text)
    - Verify todo list count is 0
    - Verify empty state still visible
    - Verify NO toast/alert/error message visible
  - [ ] Write test: "should silently prevent whitespace-only todo"
    - Fill input with "   " (spaces only)
    - Press Enter
    - Verify no todo added
    - Verify empty state still visible
  - [ ] Write test: "should accept valid todo and clear input"
    - Type "Valid todo"
    - Press Enter
    - Verify todo appears
    - Verify input is cleared (`toHaveValue('')`)

- [ ] Task 2: Run tests to confirm they pass
  - [ ] `cd e2e && npm test validation`

## Dev Notes

### Validation Test Pattern
```typescript
import { test, expect } from '@playwright/test';
import { clearAllTodos } from '../fixtures';

test.describe('Input Validation', () => {
  test.beforeEach(async ({ page }) => {
    await clearAllTodos(page);
    await page.goto('/');
  });

  test('should silently prevent empty todo submission', async ({ page }) => {
    const input = page.getByTestId('todo-input');
    await input.click();
    await page.keyboard.press('Enter');
    
    // No todos added
    await expect(page.getByTestId('todo-item')).toHaveCount(0);
    // Empty state still visible
    await expect(page.getByTestId('empty-state')).toBeVisible();
    // No error toast or dialog visible
    await expect(page.locator('[role="alert"]')).not.toBeVisible();
  });

  test('should prevent whitespace-only todo', async ({ page }) => {
    const input = page.getByTestId('todo-input');
    await input.fill('   ');
    await page.keyboard.press('Enter');
    
    await expect(page.getByTestId('todo-item')).toHaveCount(0);
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });

  test('should accept valid todo and clear input', async ({ page }) => {
    const input = page.getByTestId('todo-input');
    await input.fill('Valid todo');
    await page.keyboard.press('Enter');
    
    // Todo added
    await expect(page.getByText('Valid todo')).toBeVisible();
    // Input cleared
    await expect(input).toHaveValue('');
  });
});
```

### Notes on Silent Prevention
The PRD (FR9) specifies "silent prevention" — no error toast, no modal, no red border. The test should explicitly assert no `[role="alert"]` is shown, confirming the silent UX pattern is maintained.

### Input Selector
Use `getByTestId('todo-input')` (added in Story 4.1) or `getByPlaceholder('What needs to be done?')` as fallback.

### Prerequisite
- Story 4.1 complete (infrastructure setup, data-testid attributes added)

## File List

**New files:**
- `e2e/tests/validation.spec.ts`

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-21 | Story created | Dev Agent |
