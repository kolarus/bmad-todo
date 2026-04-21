import { test, expect } from '@playwright/test';
import { addTodo, clearAllTodos } from '../fixtures';

test.describe('Happy Path - Full CRUD Cycle', () => {
  test.beforeEach(async ({ page }) => {
    await clearAllTodos(page);
    await page.goto('/');
  });

  test('should complete full CRUD cycle — create, complete, delete', async ({ page }) => {
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

    // Complete it — click the label wrapper since input is sr-only
    await todoItem.locator('label').first().click();
    await expect(checkbox).toBeChecked();

    // Verify visual distinction (line-through)
    await expect(todoItem.getByTestId('todo-text')).toHaveClass(/line-through/);

    // Delete it
    await todoItem.getByTestId('todo-delete').click();
    await expect(todoItem).not.toBeVisible();

    // Verify empty state
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });
});
