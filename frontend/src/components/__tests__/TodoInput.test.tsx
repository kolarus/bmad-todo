import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoInput } from '../TodoInput';

const mockAddTodo = jest.fn().mockResolvedValue(undefined);

jest.mock('../../lib/context/TodoContext', () => ({
  useTodos: () => ({ addTodo: mockAddTodo }),
}));

describe('TodoInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render input with correct placeholder', () => {
    render(<TodoInput />);
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
  });

  it('should have maxLength of 500', () => {
    render(<TodoInput />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('maxLength', '500');
  });

  it('should call addTodo with trimmed text on Enter key', async () => {
    const user = userEvent.setup();
    render(<TodoInput />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'Buy groceries');
    await user.keyboard('{Enter}');
    expect(mockAddTodo).toHaveBeenCalledWith('Buy groceries');
  });

  it('should NOT call addTodo with empty input', async () => {
    const user = userEvent.setup();
    render(<TodoInput />);
    await user.keyboard('{Enter}');
    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  it('should NOT call addTodo with whitespace-only input', async () => {
    const user = userEvent.setup();
    render(<TodoInput />);
    const input = screen.getByRole('textbox');
    await user.type(input, '   ');
    await user.keyboard('{Enter}');
    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  it('should clear input after successful submission', async () => {
    const user = userEvent.setup();
    render(<TodoInput />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'Test todo');
    await user.keyboard('{Enter}');
    expect(input).toHaveValue('');
  });
});
