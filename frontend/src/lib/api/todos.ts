import { Todo } from '../types/todo';

const getBaseUrl = () => process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.error?.message ?? `Request failed with status ${res.status}`, res.status);
  }
  return res.json() as Promise<T>;
}

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(`${getBaseUrl()}/api/todos`);
  return handleResponse<Todo[]>(res);
}

export async function createTodo(text: string): Promise<Todo> {
  const res = await fetch(`${getBaseUrl()}/api/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return handleResponse<Todo>(res);
}

export async function updateTodo(id: string, data: Partial<Pick<Todo, 'completed' | 'text'>>): Promise<Todo> {
  const res = await fetch(`${getBaseUrl()}/api/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Todo>(res);
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/todos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.error?.message ?? `Delete failed with status ${res.status}`, res.status);
  }
}
