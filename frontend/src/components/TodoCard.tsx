'use client';

import { useState } from 'react';
import { Todo } from '../lib/types/todo';
import { useTodos } from '../lib/context/TodoContext';
import { Checkbox } from './Checkbox';

interface TodoCardProps {
  todo: Todo;
}

export function TodoCard({ todo }: TodoCardProps) {
  const { toggleTodo, deleteTodo } = useTodos();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => deleteTodo(todo.id), 200);
  };

  return (
    <div
      className={[
        'flex items-center gap-3 bg-white rounded-lg border border-slate-200 p-4',
        'transition-all duration-300 hover:shadow-md',
        todo.completed ? 'opacity-60 shadow-sm' : 'shadow-sm',
        isDeleting ? 'opacity-0 scale-95' : '',
      ].join(' ')}
    >
      <Checkbox
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      <span
        className={`flex-1 break-words text-slate-900 transition-all duration-150 ${todo.completed ? 'line-through' : ''}`}
      >
        {todo.text}
      </span>
      <button
        onClick={handleDelete}
        aria-label={`Delete ${todo.text}`}
        className="ml-auto flex-shrink-0 text-slate-400 hover:text-red-600 font-bold text-lg leading-none min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded"
      >
        ×
      </button>
    </div>
  );
}
