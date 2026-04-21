'use client';

import { useRef, useEffect, useState } from 'react';
import { useTodos } from '../lib/context/TodoContext';

export function TodoInput() {
  const { addTodo } = useTodos();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    await addTodo(trimmed);
    setValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What needs to be done?"
        maxLength={500}
        className="w-full outline-none text-slate-900 bg-transparent placeholder-slate-400"
        aria-label="New todo text"
      />
    </div>
  );
}
