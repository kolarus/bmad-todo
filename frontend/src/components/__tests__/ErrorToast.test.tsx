import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ErrorToast } from '../ErrorToast';

const mockClearToast = jest.fn();

// Default mock
let toastMessage: string | null = null;

jest.mock('../../lib/context/TodoContext', () => ({
  useTodos: () => ({
    toastMessage,
    clearToast: mockClearToast,
  }),
}));

describe('ErrorToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should not render when toastMessage is null', () => {
    toastMessage = null;
    render(<ErrorToast />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should render toast with message when toastMessage is set', () => {
    toastMessage = "Couldn't save your todo. Check your connection.";
    render(<ErrorToast />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText("Couldn't save your todo. Check your connection.")).toBeInTheDocument();
  });

  it('should have role="alert" for screen reader announcement', () => {
    toastMessage = 'Error message';
    render(<ErrorToast />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should call clearToast after 5 seconds', () => {
    toastMessage = 'Error message';
    render(<ErrorToast />);
    
    expect(mockClearToast).not.toHaveBeenCalled();
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    expect(mockClearToast).toHaveBeenCalledTimes(1);
  });

  it('should NOT call clearToast before 5 seconds', () => {
    toastMessage = 'Error message';
    render(<ErrorToast />);
    
    act(() => {
      jest.advanceTimersByTime(4999);
    });
    
    expect(mockClearToast).not.toHaveBeenCalled();
  });
});
