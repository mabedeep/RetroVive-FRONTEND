/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { useNavigation } from '../hooks/useNavigation';
import { GameMetadata } from '../types';
import { Loader2, Search } from 'lucide-react';

export const GameGrid: React.FC = () => {
  const { games, setCurrentGame, currentSystem, setCurrentSystem, isLoading } = useApp();
  const [index, setIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const cols = 6;

  // Auto-scroll logic
  useEffect(() => {
    if (gridContainerRef.current) {
      const activeElement = gridContainerRef.current.children[index] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [index]);

  const filteredGames = useMemo(() => {
    return games.filter(game => 
      game.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [games, searchQuery]);

  // Reset index when search changes
  useEffect(() => {
    setIndex(0);
  }, [searchQuery]);

  useNavigation({
    onAction: (action) => {
      if (isLoading || isSearchFocused) return; // Prevent grid navigation while loading or searching
      
      const maxIndex = filteredGames.length - 1;
      if (maxIndex < 0) {
        if (action === 'BACK') setCurrentSystem(null);
        return;
      }

      switch (action) {
        case 'LEFT': setIndex(prev => Math.max(0, prev - 1)); break;
        case 'RIGHT': setIndex(prev => Math.min(maxIndex, prev + 1)); break;
        case 'UP': setIndex(prev => Math.max(0, prev - cols)); break;
        case 'DOWN': setIndex(prev => Math.min(maxIndex, prev + cols)); break;
        case 'SELECT': setCurrentGame(filteredGames[index]); break;
        case 'BACK': setCurrentSystem(null); break;
      }
    }
  });

  return (
    <div className="min-h-screen p-12 flex flex-col gap-8 bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-4xl font-bold text-[var(--accent)]">{currentSystem?.name}</h2>
          {isLoading ? (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-[var(--accent)]"
            >
              <Loader2 size={24} />
            </motion.div>
          ) : (
            <span className="text-[var(--text-dim)]">/ {filteredGames.length} Games</span>
          )}
        </div>

        <div className={`flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border transition-all ${isSearchFocused ? 'border-[var(--accent)] w-96' : 'border-transparent w-64'}`}>
          <Search size={18} className={isSearchFocused ? 'text-[var(--accent)]' : 'text-[var(--text-dim)]'} />
          <input
            type="text"
            placeholder="Search game..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[var(--text-dim)]/50"
          />
        </div>
      </div>

      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            >
              <div className="w-16 h-16 border-4 border-[var(--accent)]/20 border-t-[var(--accent)] rounded-full animate-spin" />
              <p className="text-sm font-bold tracking-widest text-[var(--accent)] animate-pulse uppercase">
                Loading Database...
              </p>
            </motion.div>
          ) : filteredGames.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-[var(--text-dim)]"
            >
              <Search size={48} strokeWidth={1} className="mb-4 opacity-20" />
              <p className="text-xl font-bold uppercase tracking-widest">No games found</p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              ref={gridContainerRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-6 gap-6 overflow-y-auto pr-4 max-h-[80vh]"
            >
              {filteredGames.map((game, i) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.08,
                    transition: { duration: 0.2 }
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: i === index ? 1.05 : 1,
                    borderColor: i === index ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)',
                    borderWidth: 4,
                    boxShadow: i === index ? '0 20px 40px -10px rgba(0,0,0,0.5), 0 0 20px -5px var(--accent)' : '0 10px 20px -10px rgba(0,0,0,0.3)'
                  }}
                  className={`group relative aspect-[3/4] bg-[var(--bg-secondary)] rounded-lg overflow-hidden cursor-pointer transition-all border-4`}
                  onClick={() => setIndex(i)}
                >
                  <div className="w-full h-full bg-neutral-800 flex items-center justify-center relative">
                    <img 
                      src={game.media.box2d} 
                      alt={game.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden absolute inset-0 flex items-center justify-center p-4 text-center opacity-30 text-xs uppercase font-bold">
                      {game.name}
                    </div>
                  </div>
                  
                  <div className="absolute inset-x-0 bottom-0 bg-black/80 p-3 backdrop-blur-sm">
                    <p className="text-xs font-bold truncate text-center uppercase tracking-tight">
                      {game.name}
                    </p>
                  </div>

                  {i === index && (
                    <div className="absolute inset-0 bg-[var(--accent)]/10 animate-pulse pointer-events-none" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-12 flex gap-12 text-[var(--text-dim)] text-xs uppercase tracking-widest font-bold">
        <span>Enter: Launch</span>
        <span>Esc: Back</span>
        <span>Arrows: Navigate</span>
      </div>
    </div>
  );
};
