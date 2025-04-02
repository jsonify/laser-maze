import { useContext } from 'react';
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { GameContextProvider, GameContext } from './GameContext';

describe('GameContext', () => {
  it('should render children', () => {
    const { container } = render(
      <GameContextProvider>
        <div>Test Children</div>
      </GameContextProvider>
    );
    expect(container.firstChild).toBeInstanceOf(HTMLElement);
    expect(container.textContent).toBe('Test Children');
  });

  it('should provide initial state', () => {
    const { result } = renderHook(() => useContext(GameContext), {
      wrapper: GameContextProvider,
    });
    expect(result.current?.gameState).toEqual({ level: 1, score: 0 });
  });

  it('should provide dispatchGameAction function', () => {
    const { result } = renderHook(() => useContext(GameContext), {
      wrapper: GameContextProvider,
    });
    expect(result.current?.dispatchGameAction).toBeInstanceOf(Function);
  });
});
