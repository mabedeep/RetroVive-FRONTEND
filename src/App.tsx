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

import { MetadataService } from './services/metadataService';

function AppContent() {
  const { currentSystem, currentGame, setGames, isLoading, setIsLoading, settings } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Apply theme to body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  // Loading gamelist.xml when system changes
  useEffect(() => {
    if (currentSystem) {
      setIsLoading(true);
      
      const loadGamelist = async () => {
        try {
          const response = await fetch(`/roms/${currentSystem.folder}/gamelist.xml`);
          if (response.ok) {
            const xmlText = await response.text();
            const parsedGames = await MetadataService.parseGamelist(currentSystem, xmlText);
            setGames(parsedGames);
          } else {
            throw new Error('Gamelist not found, falling back to mock data');
          }
        } catch (error) {
          console.warn(error);
          // Fallback to mock data if real file is missing
          const mockGames: GameMetadata[] = Array.from({ length: 48 }).map((_, i) => ({
            id: `${currentSystem.id}_game_${i}`,
            path: `/roms/${currentSystem.folder}/game_${i}.zip`,
            name: `${currentSystem.name} Game ${i + 1}`,
            desc: `Esta es una descripción de ejemplo para el juego ${i + 1}. Cuando coloques tu propio archivo gamelist.xml en /roms/${currentSystem.folder}/, esta información se actualizará automáticamente.`,
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
        } finally {
          setIsLoading(false);
        }
      };

      loadGamelist();
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
