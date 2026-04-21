import { test, expect } from '@playwright/test';
import { clearAllTodos, addTodo } from '../fixtures';

test.describe('Optimistic UI', () => {
  test.beforeEach(async ({ page }) => {
    await clearAllTodos(page);
    await page.goto('/');
  });

  test('should show todo immediately before API sync completes', async ({ page }) => {
    // Add delay to POST so we can check UI before API returns
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
    await page.waitForResponse(
      resp => resp.url().includes('/api/todos') && resp.request().method() === 'POST'
    );

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

    // Click the label wrapper since input is sr-only
    await page.getByTestId('todo-item')
      .filter({ hasText: 'Toggle me' })
      .locator('label').first().click();
    await expect(checkbox).toBeChecked();

    await page.reload();

    // Verify completed state persisted
    const reloadedCheckbox = page.getByTestId('todo-item')
      .filter({ hasText: 'Toggle me' })
      .getByTestId('todo-checkbox');
    await expect(reloadedCheckbox).toBeChecked({ timeout: 5000 });
  });
});
