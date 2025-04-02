/***********************************************
 * FILE: src/contexts/GameContext.tsx
 * CREATED: 2025-04-01 23:48:16
 *
 * PURPOSE:
 * This file manages the core game state for the Laser Maze application.
 * Provides context for game board state, player actions, and game progress.
 *
 * METHODS:
 * - GameContextProvider: Wraps children with game context
 ***********************************************/

import React, { createContext, useCallback, useState } from 'react';
import type { ReactNode } from 'react';

interface GameState {
  level: number;
  score: number;
}

interface GameAction {
  type: string;
  payload?: unknown;
}

interface GameContextValue {
  gameState: GameState;
  dispatchGameAction: (action: GameAction) => void;
}

export const GameContext = createContext<GameContextValue | null>(null);

export const GameContextProvider = ({ children }: { children: ReactNode }) => {
  const [gameState] = useState<GameState>({ level: 1, score: 0 });

  const dispatchGameAction = useCallback((action: GameAction) => {
    // Placeholder for future implementation
    console.log('Game action dispatched:', action);
  }, []);

  return (
    <GameContext.Provider value={{ gameState, dispatchGameAction }}>
      {children}
    </GameContext.Provider>
  );
};
