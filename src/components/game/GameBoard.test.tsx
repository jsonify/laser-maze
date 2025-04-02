import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GameBoard } from './GameBoard';
import { GameProvider } from '../../contexts/GameContext';

describe('GameBoard', () => {
  const renderWithProvider = () => {
    return render(
      <GameProvider>
        <GameBoard />
      </GameProvider>
    );
  };

  it('renders a 5x5 grid', () => {
    renderWithProvider();
    const board = screen.getByTestId('game-board');
    expect(board).toBeInTheDocument();

    // Should render 25 cells (5x5)
    const cells = screen.getAllByTestId(/^grid-cell-\d-\d$/);
    expect(cells).toHaveLength(25);
  });

  it('renders cells in correct positions', () => {
    renderWithProvider();

    // Check a few specific positions
    expect(screen.getByTestId('grid-cell-0-0')).toBeInTheDocument();
    expect(screen.getByTestId('grid-cell-4-4')).toBeInTheDocument();
    expect(screen.getByTestId('grid-cell-2-3')).toBeInTheDocument();
  });
});
