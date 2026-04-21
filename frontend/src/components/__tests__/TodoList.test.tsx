import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from '../TodoList';
import { Todo } from '../../lib/types/todo';

const mockRefetchTodos = jest.fn().mockResolvedValue(undefined);

// Default mock state
let mockContextValue = {
  todos: [] as Todo[],
  isLoading: false,
  error: null as string | null,
  refetchTodos: mockRefetchTodos,
};

jest.mock('../../lib/context/TodoContext', () => ({
  useTodos: () => mockContextValue,
}));

// Mock TodoCard to avoid needing full context in child
jest.mock('../TodoCard', () => ({
  TodoCard: ({ todo }: { todo: Todo }) => (
    <div data-testid={`todo-card-${todo.id}`}>{todo.text}</div>
  ),
}));

const mockTodos: Todo[] = [
  { id: '1', text: 'First todo', completed: false, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '2', text: 'Second todo', completed: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

describe('TodoList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state when isLoading is true', () => {
    mockContextValue = { todos: [], isLoading: true, error: null, refetchTodos: mockRefetchTodos };
    render(<TodoList />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading your todos...');
  });

  it('should show error state when error is set', () => {
    mockContextValue = { todos: [], isLoading: false, error: "Couldn't load todos", refetchTodos: mockRefetchTodos };
    render(<TodoList />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/couldn't load your todos/i)).toBeInTheDocument();
  });

  it('should call refetchTodos when retry button is clicked', async () => {
    const user = userEvent.setup();
    mockContextValue = { todos: [], isLoading: false, error: "Couldn't load todos", refetchTodos: mockRefetchTodos };
    render(<TodoList />);
    await user.click(screen.getByText('Retry'));
    expect(mockRefetchTodos).toHaveBeenCalledTimes(1);
  });

  it('should show empty state when todos is empty array', () => {
    mockContextValue = { todos: [], isLoading: false, error: null, refetchTodos: mockRefetchTodos };
    render(<TodoList />);
    expect(screen.getByText(/No todos yet/i)).toBeInTheDocument();
  });

  it('should render TodoCard for each todo', () => {
    mockContextValue = { todos: mockTodos, isLoading: false, error: null, refetchTodos: mockRefetchTodos };
    render(<TodoList />);
    expect(screen.getByTestId('todo-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('todo-card-2')).toBeInTheDocument();
  });

  it('should render todos in a list', () => {
    mockContextValue = { todos: mockTodos, isLoading: false, error: null, refetchTodos: mockRefetchTodos };
    render(<TodoList />);
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('loading takes priority over error', () => {
    mockContextValue = { todos: [], isLoading: true, error: 'Some error', refetchTodos: mockRefetchTodos };
    render(<TodoList />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
