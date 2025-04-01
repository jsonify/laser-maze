import React from 'react';

export const TokenPalette: React.FC = () => {
  return (
    <div className="token-palette">
      <h2 className="text-xl font-bold mb-4">Available Tokens</h2>
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-lg">
        {/* Placeholder for token slots */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square bg-white border-2 border-dashed border-gray-300 rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};