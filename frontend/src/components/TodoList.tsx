'use client';

import { useTodos } from '../lib/context/TodoContext';
import { TodoCard } from './TodoCard';

export function TodoList() {
  const { todos, isLoading, error, refetchTodos } = useTodos();

  if (isLoading) {
    return (
      <p role="status" aria-live="polite" className="text-center text-slate-500 py-8">
        Loading your todos...
      </p>
    );
  }

  if (error) {
    return (
      <div role="alert" className="text-center py-8">
        <p className="text-red-600 mb-3">{error}</p>
        <button
          onClick={refetchTodos}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <p className="text-center text-slate-500 py-8">
        No todos yet. Ready when you are!
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {todos.map(todo => (
        <li key={todo.id}>
          <TodoCard todo={todo} />
        </li>
      ))}
    </ul>
  );
}
