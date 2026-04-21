import { test, expect } from '@playwright/test';
import { addTodo, clearAllTodos } from '../fixtures';

test.describe('Data Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await clearAllTodos(page);
  });

  test('should persist todo after page refresh', async ({ page }) => {
    await page.goto('/');
    await addTodo(page, 'Walk the dog');
    await expect(page.getByTestId('todo-item')).toHaveCount(1);

    await page.reload();
    await expect(page.getByTestId('loading-state')).not.toBeVisible({ timeout: 5000 }).catch(() => {});
    await expect(page.getByText('Walk the dog')).toBeVisible({ timeout: 5000 });
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
    await expect(newPage.getByText('Walk the dog')).toBeVisible({ timeout: 5000 });
    await expect(newPage.getByText('Read a book')).toBeVisible({ timeout: 5000 });

    await newContext.close();
  });
});
