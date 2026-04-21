import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from '../Checkbox';

describe('Checkbox', () => {
  const defaultProps = {
    checked: false,
    onChange: jest.fn(),
    'aria-label': 'Test checkbox',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders unchecked state with correct aria-label', () => {
    render(<Checkbox {...defaultProps} />);
    const input = screen.getByRole('checkbox', { name: 'Test checkbox' });
    expect(input).not.toBeChecked();
  });

  it('renders checked state when checked prop is true', () => {
    render(<Checkbox {...defaultProps} checked={true} />);
    const input = screen.getByRole('checkbox', { name: 'Test checkbox' });
    expect(input).toBeChecked();
  });

  it('calls onChange when clicked', () => {
    const onChange = jest.fn();
    render(<Checkbox {...defaultProps} onChange={onChange} />);
    const input = screen.getByRole('checkbox');
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('renders SVG checkmark when checked', () => {
    const { container } = render(<Checkbox {...defaultProps} checked={true} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('does not render SVG checkmark when unchecked', () => {
    const { container } = render(<Checkbox {...defaultProps} checked={false} />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
