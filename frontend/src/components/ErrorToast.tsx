'use client';

import { useEffect } from 'react';
import { useTodos } from '../lib/context/TodoContext';

export function ErrorToast() {
  const { toastMessage, clearToast } = useTodos();

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      clearToast();
    }, 5000);
    return () => clearTimeout(timer);
  }, [toastMessage, clearToast]);

  if (!toastMessage) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-4 right-4 z-50 max-w-sm bg-red-50 border-l-4 border-red-600 text-red-800 px-4 py-3 rounded-lg shadow-lg"
    >
      <p className="text-sm font-medium">{toastMessage}</p>
    </div>
  );
}
