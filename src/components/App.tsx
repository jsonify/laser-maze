import React from 'react';
import { GameBoard } from './GameBoard';
import { TokenPalette } from './TokenPalette';
import { Controls } from './Controls';

const App: React.FC = () => {
  return (
    <div className="laser-maze-app">
      <header>
        <h1>Laser Maze</h1>
      </header>
      <main>
        <div className="game-container">
          <GameBoard />
          <TokenPalette />
          <Controls />
        </div>
      </main>
    </div>
  );
};

export default App;