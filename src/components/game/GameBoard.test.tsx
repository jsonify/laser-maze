import React from 'react';
import { render, screen } from '@testing-library/react';
import { GameBoard } from './GameBoard';

describe('GameBoard Component', () => {
  it('renders GameBoard placeholder', () => {
    render(<GameBoard />);
    expect(screen.getByText('GameBoard')).toBeInTheDocument();
  });
});
