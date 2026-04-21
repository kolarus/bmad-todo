'use client';

import { useTodos } from '../lib/context/TodoContext';
import { TodoCard } from './TodoCard';

export function TodoList() {
  const { todos, isLoading, error, refetchTodos } = useTodos();

  if (isLoading) {
    return (
      <div data-testid="loading-state" role="status" aria-live="polite" className="flex flex-col items-center py-12 gap-3">
        <svg
          className="animate-spin h-8 w-8 text-indigo-500"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-slate-500 text-base">Loading your todos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div data-testid="error-state" role="alert" className="flex flex-col items-center text-center py-12 gap-4">
        <p className="text-red-600 font-medium">Couldn&apos;t load your todos</p>
        <p className="text-slate-500 text-sm">Check your connection</p>
        <button
          onClick={refetchTodos}
          data-testid="retry-button"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <p data-testid="empty-state" className="text-center text-slate-500 text-lg py-12">
        No todos yet. Ready when you are!
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {todos.map(todo => (
        <li key={todo.id} className="animate-fade-in-down">
          <TodoCard todo={todo} />
        </li>
      ))}
    </ul>
  );
}
