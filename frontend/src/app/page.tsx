'use client';

import { TodoProvider } from '../lib/context/TodoContext';
import { TodoInput } from '../components/TodoInput';
import { TodoList } from '../components/TodoList';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ErrorToast } from '../components/ErrorToast';

export default function Home() {
  return (
    <TodoProvider>
      <main className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">My Todos</h1>
          <div className="space-y-3">
            <TodoInput />
            <ErrorBoundary>
              <TodoList />
            </ErrorBoundary>
          </div>
        </div>
        <ErrorToast />
      </main>
    </TodoProvider>
  );
}

