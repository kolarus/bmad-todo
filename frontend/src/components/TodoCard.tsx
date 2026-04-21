'use client';

import { Todo } from '../lib/types/todo';
import { useTodos } from '../lib/context/TodoContext';

interface TodoCardProps {
  todo: Todo;
}

export function TodoCard({ todo }: TodoCardProps) {
  const { toggleTodo, deleteTodo } = useTodos();

  return (
    <div className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 shadow-sm p-4">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        className="h-5 w-5 flex-shrink-0 cursor-pointer accent-indigo-600"
      />
      <span
        className={`flex-1 break-words text-slate-900 ${todo.completed ? 'line-through opacity-60' : ''}`}
      >
        {todo.text}
      </span>
      <button
        onClick={() => deleteTodo(todo.id)}
        aria-label={`Delete ${todo.text}`}
        className="ml-auto flex-shrink-0 text-slate-400 hover:text-red-600 font-bold text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}
