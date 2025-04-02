/***********************************************
 * FILE: src/contexts/SettingsContext.tsx
 * CREATED: 2025-04-01 23:48:56
 *
 * PURPOSE:
 * This file manages user preferences and settings for the Laser Maze application.
 * Provides context for theme, difficulty, and other customizable options.
 *
 * METHODS:
 * - SettingsContextProvider: Wraps children with settings context
 ***********************************************/

import React, { createContext, useCallback, useState } from 'react';
import type { ReactNode } from 'react';

interface AppSettings {
  theme: 'light' | 'dark';
  sound: boolean;
}

interface SettingsContextValue {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

export const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsContextProvider = ({ children }: { children: ReactNode }) => {
  const [settings] = useState<AppSettings>({ theme: 'light', sound: true });

  const updateSetting = useCallback(
    <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      // Placeholder for future implementation
      console.log(`Updating setting ${key} to ${value}`);
    },
    []
  );

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};
