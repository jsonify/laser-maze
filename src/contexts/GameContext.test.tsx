import { useContext } from 'react';
import { render, renderHook, act } from '@testing-library/react';
import { GameProvider, useGame } from './GameContext';
import type { Token } from '../utils/grid'; // Import Token type

describe('GameContext', () => {
  it('should render children', () => {
    const { container } = render(
      <GameProvider>
        <div>Test Children</div>
      </GameProvider>
    );
    expect(container.firstChild).toBeInstanceOf(HTMLElement);
    expect(container.textContent).toBe('Test Children');
  });

  it('should provide initial grid state', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider,
    });
    // Check if grid is initialized (e.g., has expected dimensions or is an array)
    expect(result.current.grid).toBeDefined();
    expect(Array.isArray(result.current.grid)).toBe(true);
    // Add more specific checks if needed, e.g., dimensions
    // expect(result.current.grid.length).toBe(DEFAULT_GRID_HEIGHT);
  });

  it('should provide grid manipulation functions', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider,
    });
    expect(result.current.placeTokenInCell).toBeInstanceOf(Function);
    expect(result.current.removeTokenFromCell).toBeInstanceOf(Function);
    expect(result.current.rotateTokenInCell).toBeInstanceOf(Function);
  });

  // Optional: Add a test to check if functions update the grid state
  it('should update grid when placeTokenInCell is called', () => {
    const { result } = renderHook(() => useGame(), {
      wrapper: GameProvider,
    });
    const initialGrid = result.current.grid;
    const testToken: Token = { type: 'laser', orientation: 0, state: 'idle' }; // Example token

    act(() => {
      result.current.placeTokenInCell(0, 0, testToken);
    });

    expect(result.current.grid).not.toBe(initialGrid); // Check if grid instance changed
    expect(result.current.grid[0][0]?.token).toEqual(testToken); // Check if token is placed
  });
});
