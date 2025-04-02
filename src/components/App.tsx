import React from 'react';
import { GameProvider } from '../contexts/GameContext'; // Corrected import name
import { SettingsContextProvider } from '../contexts/SettingsContext';

const App: React.FC = () => {
  return (
    <GameProvider>
      {' '}
      // Corrected component name
      <SettingsContextProvider>
        <div>Laser Maze App</div>
      </SettingsContextProvider>
    </GameProvider> // Corrected component name
  );
};

export default App;
