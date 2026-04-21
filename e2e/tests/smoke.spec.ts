import { test, expect } from '@playwright/test';

test('smoke test - app loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('todo-input')).toBeVisible();
});
