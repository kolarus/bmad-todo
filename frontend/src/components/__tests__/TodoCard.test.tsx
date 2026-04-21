import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoCard } from '../TodoCard';
import { Todo } from '../../lib/types/todo';

const mockToggleTodo = jest.fn().mockResolvedValue(undefined);
const mockDeleteTodo = jest.fn().mockResolvedValue(undefined);

jest.mock('../../lib/context/TodoContext', () => ({
  useTodos: () => ({
    toggleTodo: mockToggleTodo,
    deleteTodo: mockDeleteTodo,
  }),
}));

const mockTodo: Todo = {
  id: 'todo-1',
  text: 'Buy groceries',
  completed: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('TodoCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo text', () => {
    render(<TodoCard todo={mockTodo} />);
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('should render unchecked checkbox for incomplete todo', () => {
    render(<TodoCard todo={mockTodo} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('should render checked checkbox for completed todo', () => {
    render(<TodoCard todo={{ ...mockTodo, completed: true }} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should call toggleTodo with todo id on checkbox click', async () => {
    const user = userEvent.setup();
    render(<TodoCard todo={mockTodo} />);
    await user.click(screen.getByRole('checkbox'));
    expect(mockToggleTodo).toHaveBeenCalledWith('todo-1');
  });

  it('should call deleteTodo with todo id on delete button click', async () => {
    const user = userEvent.setup();
    render(<TodoCard todo={mockTodo} />);
    await user.click(screen.getByRole('button', { name: /delete buy groceries/i }));
    expect(mockDeleteTodo).toHaveBeenCalledWith('todo-1');
  });

  it('should have correct aria-label on delete button', () => {
    render(<TodoCard todo={mockTodo} />);
    expect(screen.getByRole('button', { name: 'Delete Buy groceries' })).toBeInTheDocument();
  });

  it('should show line-through for completed todo', () => {
    render(<TodoCard todo={{ ...mockTodo, completed: true }} />);
    const text = screen.getByText('Buy groceries');
    expect(text).toHaveClass('line-through');
  });

  it('should show opacity-60 for completed todo', () => {
    render(<TodoCard todo={{ ...mockTodo, completed: true }} />);
    const text = screen.getByText('Buy groceries');
    expect(text).toHaveClass('opacity-60');
  });

  it('should NOT show line-through for incomplete todo', () => {
    render(<TodoCard todo={mockTodo} />);
    const text = screen.getByText('Buy groceries');
    expect(text).not.toHaveClass('line-through');
  });
});
