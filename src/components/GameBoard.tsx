import React from 'react';

export const GameBoard: React.FC = () => {
  return (
    <div className="game-board">
      <div className="grid grid-cols-5 gap-1 bg-gray-100 p-4 rounded-lg">
        {Array.from({ length: 25 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square bg-white border border-gray-300 rounded"
          />
        ))}
      </div>
    </div>
  );
};