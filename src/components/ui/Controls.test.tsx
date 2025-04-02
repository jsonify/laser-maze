import React from 'react';
import { render, screen } from '@testing-library/react';
import { Controls } from './Controls';

describe('Controls Component', () => {
  it('renders Controls placeholder', () => {
    render(<Controls />);
    expect(screen.getByText('Controls')).toBeInTheDocument();
  });
});
