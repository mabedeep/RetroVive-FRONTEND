/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SystemSelect } from './components/SystemSelect';
import { GameGrid } from './components/GameGrid';
import { GameDetails } from './components/GameDetails';
import { SettingsOverlay } from './components/SettingsOverlay';
import { useNavigation } from './hooks/useNavigation';
import { GameMetadata } from './types';

function AppContent() {
  const { currentSystem, currentGame, setGames, isLoading, setIsLoading, settings } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Apply theme to body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  // Mock data generation when system changes
  useEffect(() => {
    if (currentSystem) {
      setIsLoading(true);
      
      // Simulate loading gamelist.xml with a delay
      const timer = setTimeout(() => {
        const mockGames: GameMetadata[] = Array.from({ length: 48 }).map((_, i) => ({
          id: `${currentSystem.id}_game_${i}`,
          path: `/roms/${currentSystem.folder}/game_${i}.zip`,
          name: `Game Title ${i + 1}`,
          desc: `Description for game ${i + 1}. This is where the game information from gamelist.xml would appear. Usually it includes genre, release date, and gameplay details.`,
          rating: 4 + Math.random() * 6,
          releasedate: '199' + (i % 9) + '0101',
          developer: 'RetroDev Studio',
          publisher: 'Classic Games Inc',
          genre: 'Action / Arcade',
          players: '1-2',
          media: {
             box2d: `/media/${currentSystem.folder}/box2d/game_${i}.png`,
             fanart: `/media/${currentSystem.folder}/fanart/game_${i}.jpg`,
             video: i % 2 === 0 ? `https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4` : undefined
          }
        }));
        setGames(mockGames);
        setIsLoading(false);
      }, 1000); // 1 second delay to show the spinner

      return () => clearTimeout(timer);
    }
  }, [currentSystem, setGames, setIsLoading]);

  useNavigation({
    onAction: (action) => {
      if (action === 'MENU') setIsSettingsOpen(prev => !prev);
    }
  });

  return (
    <div className="relative w-full h-screen overflow-hidden select-none">
      {!currentSystem ? (
        <SystemSelect />
      ) : (
        <GameGrid />
      )}

      {currentGame && <GameDetails />}

      <SettingsOverlay 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      {/* Global Sound/Music controls could also go here */}
      <audio id="bgm" src="/assets/audio/bgm.mp3" loop volumes={settings.volume / 100} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
