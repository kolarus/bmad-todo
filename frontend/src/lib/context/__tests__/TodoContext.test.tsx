import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoProvider, useTodos } from '../TodoContext';
import * as api from '../../api/todos';

// Mock the API module
jest.mock('../../api/todos');
const mockApi = api as jest.Mocked<typeof api>;

const mockTodo = {
  id: 'todo-1',
  text: 'Test todo',
  completed: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// Helper component that displays context values
function TodoContextConsumer() {
  const { todos, isLoading, error, toastMessage, addTodo, toggleTodo, deleteTodo } = useTodos();
  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'not-loading'}</div>
      <div data-testid="error">{error ?? 'no-error'}</div>
      <div data-testid="toast">{toastMessage ?? 'no-toast'}</div>
      <ul>
        {todos.map(t => (
          <li key={t.id} data-testid={`todo-${t.id}`}>
            {t.text}
            <button onClick={() => toggleTodo(t.id)}>toggle</button>
            <button onClick={() => deleteTodo(t.id)}>delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => addTodo('New todo')}>add</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <TodoProvider>
      <TodoContextConsumer />
    </TodoProvider>
  );
}

describe('TodoContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Story 2.4: Initial state and loading', () => {
    it('should show loading initially then show todos', async () => {
      mockApi.fetchTodos.mockResolvedValue([mockTodo]);
      renderWithProvider();

      expect(screen.getByTestId('loading')).toHaveTextContent('loading');

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      expect(screen.getByTestId(`todo-${mockTodo.id}`)).toBeInTheDocument();
    });

    it('should show error when fetch fails', async () => {
      mockApi.fetchTodos.mockRejectedValue(new Error('Network error'));
      renderWithProvider();

      await waitFor(() => {
        expect(screen.getByTestId('error')).not.toHaveTextContent('no-error');
      });
    });

    it('should throw if useTodos is used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(<TodoContextConsumer />);
      }).toThrow('useTodos must be used within a TodoProvider');
      consoleSpy.mockRestore();
    });
  });

  describe('Story 2.5: Optimistic UI - addTodo', () => {
    it('should optimistically add todo before API responds', async () => {
      const user = userEvent.setup();
      mockApi.fetchTodos.mockResolvedValue([]);

      let resolveCreate!: (value: typeof mockTodo) => void;
      mockApi.createTodo.mockReturnValue(
        new Promise(resolve => { resolveCreate = resolve; })
      );

      renderWithProvider();
      await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('not-loading'));

      await user.click(screen.getByText('add'));

      // Should immediately show a todo (optimistic)
      expect(screen.getAllByRole('listitem')).toHaveLength(1);

      // Resolve the API call
      await act(async () => {
        resolveCreate(mockTodo);
      });

      // Should now show the real todo
      expect(screen.getByTestId(`todo-${mockTodo.id}`)).toBeInTheDocument();
    });

    it('should rollback todo on addTodo failure', async () => {
      const user = userEvent.setup();
      mockApi.fetchTodos.mockResolvedValue([]);
      mockApi.createTodo.mockRejectedValue(new Error('Server error'));

      renderWithProvider();
      await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('not-loading'));

      await user.click(screen.getByText('add'));

      await waitFor(() => {
        expect(screen.queryAllByRole('listitem')).toHaveLength(0);
        expect(screen.getByTestId('toast')).not.toHaveTextContent('no-toast');
      });
    });
  });

  describe('Story 2.5: Optimistic UI - toggleTodo', () => {
    it('should optimistically toggle todo', async () => {
      const user = userEvent.setup();
      mockApi.fetchTodos.mockResolvedValue([mockTodo]);
      mockApi.updateTodo.mockResolvedValue({ ...mockTodo, completed: true });

      renderWithProvider();
      await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('not-loading'));

      await user.click(screen.getByText('toggle'));

      expect(mockApi.updateTodo).toHaveBeenCalledWith(mockTodo.id, { completed: true });
    });

    it('should rollback toggle on failure', async () => {
      const user = userEvent.setup();
      mockApi.fetchTodos.mockResolvedValue([mockTodo]);
      mockApi.updateTodo.mockRejectedValue(new Error('Server error'));

      renderWithProvider();
      await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('not-loading'));

      await user.click(screen.getByText('toggle'));

      await waitFor(() => {
        expect(screen.getByTestId('toast')).not.toHaveTextContent('no-toast');
      });
    });
  });

  describe('Story 2.5: Optimistic UI - deleteTodo', () => {
    it('should optimistically delete todo', async () => {
      const user = userEvent.setup();
      mockApi.fetchTodos.mockResolvedValue([mockTodo]);
      mockApi.deleteTodo.mockResolvedValue(undefined);

      renderWithProvider();
      await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('not-loading'));

      expect(screen.getByTestId(`todo-${mockTodo.id}`)).toBeInTheDocument();

      await user.click(screen.getByText('delete'));

      await waitFor(() => {
        expect(screen.queryByTestId(`todo-${mockTodo.id}`)).not.toBeInTheDocument();
      });
    });

    it('should restore todo on delete failure', async () => {
      const user = userEvent.setup();
      mockApi.fetchTodos.mockResolvedValue([mockTodo]);
      mockApi.deleteTodo.mockRejectedValue(new Error('Server error'));

      renderWithProvider();
      await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('not-loading'));

      await user.click(screen.getByText('delete'));

      await waitFor(() => {
        expect(screen.getByTestId(`todo-${mockTodo.id}`)).toBeInTheDocument();
        expect(screen.getByTestId('toast')).not.toHaveTextContent('no-toast');
      });
    });
  });
});
