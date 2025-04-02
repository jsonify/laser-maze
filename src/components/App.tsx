import React from 'react';
import { GameContextProvider } from '../contexts/GameContext';
import { SettingsContextProvider } from '../contexts/SettingsContext';

const App: React.FC = () => {
  return (
    <GameContextProvider>
      <SettingsContextProvider>
        <div>Laser Maze App</div>
      </SettingsContextProvider>
    </GameContextProvider>
  );
};

export default App;
