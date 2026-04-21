import { Page } from '@playwright/test';

export async function addTodo(page: Page, text: string): Promise<void> {
  await page.getByTestId('todo-input').fill(text);
  await page.keyboard.press('Enter');
}

export async function getTodos(page: Page): Promise<string[]> {
  const items = page.getByTestId('todo-text');
  return items.allTextContents();
}

export async function clearAllTodos(page: Page): Promise<void> {
  const apiURL = process.env.API_URL ?? 'http://localhost:3001';

  // Try bulk delete first (works in dev, blocked in production)
  const bulkRes = await page.request.delete(`${apiURL}/api/todos`);
  if (bulkRes.ok()) return;

  // Fallback: fetch all todos and delete one-by-one
  const res = await page.request.get(`${apiURL}/api/todos`);
  if (!res.ok()) return;
  const todos = await res.json();
  for (const todo of todos) {
    await page.request.delete(`${apiURL}/api/todos/${todo.id}`);
  }
}
