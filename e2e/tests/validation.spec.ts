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
    // No error toast or dialog visible (exclude Next.js route announcer)
    await expect(page.locator('[role="alert"]:not(#__next-route-announcer__)')).not.toBeVisible();
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
