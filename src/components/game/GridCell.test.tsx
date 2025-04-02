import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GridCell } from './GridCell';
import type { Cell, Token } from '../../utils/grid';

describe('GridCell', () => {
  const mockToken: Token = {
    type: 'laser',
    orientation: 0,
    state: 'idle',
  };

  const defaultProps = {
    cell: { token: null } as Cell,
    x: 0,
    y: 0,
  };

  it('renders empty cell correctly', () => {
    render(<GridCell {...defaultProps} />);
    const cell = screen.getByTestId('grid-cell-0-0');
    expect(cell).toBeInTheDocument();
    expect(cell).not.toHaveTextContent('→');
  });

  it('renders cell with laser token correctly', () => {
    render(<GridCell {...defaultProps} cell={{ token: mockToken }} />);
    const token = screen.getByTestId('token-0-0');
    expect(token).toBeInTheDocument();
    expect(token).toHaveTextContent('→');
    expect(token).toHaveStyle({ transform: 'rotate(0deg)' });
  });

  it('renders cell with mirror token correctly', () => {
    const mirrorToken: Token = { ...mockToken, type: 'mirror' };
    render(<GridCell {...defaultProps} cell={{ token: mirrorToken }} />);
    const token = screen.getByTestId('token-0-0');
    expect(token).toBeInTheDocument();
    expect(token).toHaveTextContent('╱');
  });

  it('renders cell with target token correctly', () => {
    const targetToken: Token = { ...mockToken, type: 'target' };
    render(<GridCell {...defaultProps} cell={{ token: targetToken }} />);
    const token = screen.getByTestId('token-0-0');
    expect(token).toBeInTheDocument();
    expect(token).toHaveTextContent('◎');
  });

  it('calls onTokenRemove when clicking cell with token', () => {
    const onTokenRemove = vi.fn();
    render(
      <GridCell {...defaultProps} cell={{ token: mockToken }} onTokenRemove={onTokenRemove} />
    );

    fireEvent.click(screen.getByTestId('grid-cell-0-0'));
    expect(onTokenRemove).toHaveBeenCalledWith(0, 0);
  });

  it('applies correct rotation to token', () => {
    const rotatedToken: Token = { ...mockToken, orientation: 90 };
    render(<GridCell {...defaultProps} cell={{ token: rotatedToken }} />);

    const token = screen.getByTestId('token-0-0');
    expect(token).toHaveStyle({ transform: 'rotate(90deg)' });
  });
});
