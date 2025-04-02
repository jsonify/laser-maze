import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { GridCell } from './GridCell';

export const GameBoard: React.FC = () => {
  const { grid, placeTokenInCell, removeTokenFromCell, rotateTokenInCell } = useGame();

  return (
    <div
      className="game-board grid grid-cols-5 gap-1 bg-gray-100 p-4 rounded-lg shadow-md"
      data-testid="game-board"
    >
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <GridCell
            key={`${x}-${y}`}
            cell={cell}
            x={x}
            y={y}
            onTokenPlace={placeTokenInCell}
            onTokenRemove={removeTokenFromCell}
            onTokenRotate={rotateTokenInCell}
          />
        ))
      )}
    </div>
  );
};
