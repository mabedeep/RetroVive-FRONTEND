/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, GameMetadata, SystemConfig } from '../types';
import { SYSTEMS } from '../constants';

interface AppContextType {
  systems: SystemConfig[];
  reloadSystems: () => Promise<void>;
  currentSystem: SystemConfig | null;
  setCurrentSystem: (system: SystemConfig | null) => void;
  currentGame: GameMetadata | null;
  setCurrentGame: (game: GameMetadata | null) => void;
  games: GameMetadata[];
  setGames: (games: GameMetadata[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [systems, setSystems] = useState<SystemConfig[]>(SYSTEMS);
  const [currentSystem, setCurrentSystem] = useState<SystemConfig | null>(null);
  const [currentGame, setCurrentGame] = useState<GameMetadata | null>(null);
  const [games, setGames] = useState<GameMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'default',
    volume: 80,
    controllerMapping: {
      'UP': 12,    // D-Pad Up
      'DOWN': 13,  // D-Pad Down
      'LEFT': 14,  // D-Pad Left
      'RIGHT': 15, // D-Pad Right
      'SELECT': 0, // A
      'BACK': 1,   // B
      'MENU': 9,   // Start
    },
    analogSensitivity: 1.0,
    analogDeadZone: 0.2,
    systemBackgrounds: {},
  });

  const reloadSystems = async () => {
    try {
      const res = await fetch('/systems.json');
      if (res.ok) {
        const data = await res.json();
        setSystems(data);
      }
    } catch (error) {
      console.error('Failed to load systems:', error);
    }
  };

  useEffect(() => {
    reloadSystems();
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <AppContext.Provider value={{
      systems, reloadSystems,
      currentSystem, setCurrentSystem,
      currentGame, setCurrentGame,
      games, setGames,
      isLoading, setIsLoading,
      settings, updateSettings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
