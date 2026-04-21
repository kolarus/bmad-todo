'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Todo } from '../types/todo';
import * as api from '../api/todos';

interface TodoContextType {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  toastMessage: string | null;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  refetchTodos: () => Promise<void>;
  toastError: (message: string) => void;
  clearToast: () => void;
}

const TodoContext = createContext<TodoContextType | null>(null);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toastError = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.fetchTodos();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load your todos. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = useCallback(async (text: string) => {
    const tempId = `temp-${Date.now()}`;
    const tempTodo: Todo = {
      id: tempId,
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTodos(prev => [tempTodo, ...prev]);
    try {
      const serverTodo = await api.createTodo(text);
      setTodos(prev => prev.map(t => (t.id === tempId ? serverTodo : t)));
    } catch {
      setTodos(prev => prev.filter(t => t.id !== tempId));
      toastError("Couldn't save your todo. Check your connection.");
    }
  }, [toastError]);

  const toggleTodo = useCallback(async (id: string) => {
    const target = todos.find(t => t.id === id);
    if (!target) return;
    const prevCompleted = target.completed;
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
    try {
      await api.updateTodo(id, { completed: !prevCompleted });
    } catch {
      setTodos(prev => prev.map(t => (t.id === id ? { ...t, completed: prevCompleted } : t)));
      toastError("Couldn't update your todo. Check your connection.");
    }
  }, [todos, toastError]);

  const deleteTodo = useCallback(async (id: string) => {
    const target = todos.find(t => t.id === id);
    if (!target) return;
    setTodos(prev => prev.filter(t => t.id !== id));
    try {
      await api.deleteTodo(id);
    } catch {
      setTodos(prev => [target, ...prev]);
      toastError("Couldn't delete your todo. Check your connection.");
    }
  }, [todos, toastError]);

  return (
    <TodoContext.Provider
      value={{
        todos,
        isLoading,
        error,
        toastMessage,
        addTodo,
        toggleTodo,
        deleteTodo,
        refetchTodos: fetchTodos,
        toastError,
        clearToast,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos(): TodoContextType {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
}
