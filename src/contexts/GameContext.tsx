import React, { createContext, useContext, useCallback, useState } from 'react';
import type { Grid, Token } from '../utils/grid';
import { createGrid, placeToken, removeToken, rotateToken } from '../utils/grid';

interface GameContextType {
  grid: Grid;
  placeTokenInCell: (x: number, y: number, token: Token) => void;
  removeTokenFromCell: (x: number, y: number) => void;
  rotateTokenInCell: (x: number, y: number, angle: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [grid, setGrid] = useState<Grid>(() => createGrid());

  const placeTokenInCell = useCallback((x: number, y: number, token: Token) => {
    setGrid((currentGrid) => placeToken(currentGrid, x, y, token));
  }, []);

  const removeTokenFromCell = useCallback((x: number, y: number) => {
    setGrid((currentGrid) => removeToken(currentGrid, x, y));
  }, []);

  const rotateTokenInCell = useCallback((x: number, y: number, angle: number) => {
    setGrid((currentGrid) => rotateToken(currentGrid, x, y, angle));
  }, []);

  const value = {
    grid,
    placeTokenInCell,
    removeTokenFromCell,
    rotateTokenInCell,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
