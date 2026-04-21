import { test, expect } from '@playwright/test';
import { clearAllTodos } from '../fixtures';

test.describe('Error Recovery', () => {
  test('should show error state and recover on retry', async ({ page }) => {
    await clearAllTodos(page);

    // Intercept GET todos to simulate backend down
    await page.route('**/api/todos', route => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }), contentType: 'application/json' });
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

    // Verify recovery
    await expect(page.getByTestId('error-state')).not.toBeVisible({ timeout: 5000 });
    await expect(
      page.getByTestId('empty-state').or(page.getByTestId('todo-item').first())
    ).toBeVisible({ timeout: 5000 });
  });

  test('should rollback optimistic update on failed POST', async ({ page }) => {
    await clearAllTodos(page);
    await page.goto('/');

    // Intercept POST to simulate failure
    await page.route('**/api/todos', route => {
      if (route.request().method() === 'POST') {
        route.fulfill({ status: 500, body: JSON.stringify({ error: 'Failed to save' }), contentType: 'application/json' });
      } else {
        route.continue();
      }
    });

    // Try to add todo
    await page.getByTestId('todo-input').fill('Test todo');
    await page.keyboard.press('Enter');

    // Verify error toast appears (exclude Next.js route announcer)
    await expect(page.locator('[role="alert"]:not(#__next-route-announcer__)')).toBeVisible({ timeout: 5000 });

    // Verify todo rolled back (not in list)
    await expect(page.getByText('Test todo')).not.toBeVisible({ timeout: 5000 });

    await page.unroute('**/api/todos');
  });
});
