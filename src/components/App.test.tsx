import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders the placeholder text', () => {
    render(<App />);
    expect(screen.getByText('Laser Maze App')).toBeInTheDocument();
  });
});
