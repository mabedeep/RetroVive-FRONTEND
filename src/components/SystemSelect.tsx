/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SYSTEMS } from '../constants';
import { useApp } from '../context/AppContext';
import { useNavigation } from '../hooks/useNavigation';
import { Joystick, Gamepad2, Monitor } from 'lucide-react';

const SystemLogo: React.FC<{ system: any }> = ({ system }) => {
  const [logoPathIndex, setLogoPathIndex] = useState(0);
  
  // Try these paths in order
  const logoPaths = [
    `/media/sistemas/logos/${system.id}.png`,
    `/media/logos/${system.logo}`,
    `/media/${system.folder}/logo.png`,
  ];

  const handleLogoError = () => {
    if (logoPathIndex < logoPaths.length - 1) {
      setLogoPathIndex(prev => prev + 1);
    } else {
      setLogoPathIndex(-1); // Signal to show fallback icon
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {logoPathIndex !== -1 ? (
          <motion.img
            key={logoPaths[logoPathIndex]}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={logoPaths[logoPathIndex]}
            alt={system.name}
            referrerPolicy="no-referrer"
            className="max-w-[80%] max-h-[60%] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] z-10"
            onError={handleLogoError}
          />
        ) : (
          <motion.div
            key="fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            className="flex flex-col items-center gap-4"
          >
            {system.type === 'arcade' && <Joystick size={80} strokeWidth={1} className="text-[var(--accent)]" />}
            {system.type === 'console' && <Gamepad2 size={80} strokeWidth={1} className="text-[var(--accent)]" />}
            {system.type !== 'arcade' && system.type !== 'console' && <Monitor size={80} strokeWidth={1} className="text-[var(--accent)]" />}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="absolute inset-x-0 bottom-4 text-center font-black text-2xl tracking-tighter uppercase opacity-80 z-20">
        {system.name}
      </div>
    </div>
  );
};

export const SystemSelect: React.FC = () => {
  const { setCurrentSystem, currentSystem, settings, systems } = useApp();
  const [index, setIndex] = useState(0);

  const currentSystemConfig = systems[index] || systems[0];
  if (!currentSystemConfig) return null;

  const systemBackground = settings.systemBackgrounds[currentSystemConfig.id] || `/media/${currentSystemConfig.folder}/${currentSystemConfig.background}`;

  useNavigation({
    onAction: (action) => {
      if (action === 'LEFT') setIndex(prev => Math.max(0, prev - 1));
      if (action === 'RIGHT') setIndex(prev => Math.min(systems.length - 1, prev + 1));
      if (action === 'SELECT') setCurrentSystem(systems[index]);
    }
  });

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center overflow-hidden relative bg-[var(--bg-primary)]">
      {/* Dynamic Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={systemBackground}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={systemBackground} 
            alt="" 
            className="w-full h-full object-cover blur-sm"
            referrerPolicy="no-referrer"
            onError={(e) => {
               (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)] opacity-60" />
          <div className="absolute inset-0 bg-[var(--bg-primary)] opacity-40 mix-blend-multiply" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-4 text-center z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.3, y: 0 }}
          className="text-8xl font-black italic tracking-tighter font-[Anton] text-white select-none pointer-events-none"
        >
          RETROVIBE
        </motion.h1>
        <div className="h-1 w-24 bg-[var(--accent)] mx-auto -mt-2 opacity-50" />
      </div>

      {/* Centered Carousel Track */}
      <div className="relative w-full h-[450px] flex items-center justify-center perspective-[2000px] z-10 overflow-visible">
        <motion.div 
          animate={{ 
            // Formula to center the item at index 'index'
            // The container is justify-center, so we offset from the theoretical center
            x: ((systems.length - 1) / 2 - index) * (288 + 48) 
          }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="flex items-center gap-12"
        >
          {systems.map((system, i) => {
            const distance = Math.abs(i - index);
            const isSelected = i === index;
            
            return (
              <motion.div
                key={system.id}
                animate={{
                  scale: isSelected ? 1.25 : 0.75,
                  opacity: distance > 2 ? 0 : (isSelected ? 1 : 0.4),
                  rotateY: isSelected ? 0 : (i < index ? 35 : -35),
                  z: isSelected ? 200 : -100,
                  filter: isSelected ? "blur(0px)" : "blur(2px)",
                }}
                className={`relative flex flex-col items-center gap-4 cursor-pointer rounded-3xl shrink-0 w-72 h-72 ${
                  isSelected ? 'bg-[var(--bg-secondary)]/90 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl ring-2 ring-white/30' : 'bg-black/30'
                }`}
                onClick={() => {
                  setIndex(i);
                  if (isSelected) setCurrentSystem(system);
                }}
              >
                <div className="w-full h-full rounded-xl flex items-center justify-center relative overflow-hidden p-4">
                  <SystemLogo system={system} />
                </div>

                {/* Selection Glow */}
                {isSelected && (
                  <motion.div 
                    layoutId="glow"
                    className="absolute -inset-8 bg-[var(--accent)]/30 blur-[60px] -z-10 rounded-full"
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="absolute bottom-20 text-center relative z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSystemConfig.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-[var(--text-dim)] uppercase tracking-wider text-xs font-bold bg-black/40 px-6 py-2 rounded-full backdrop-blur-sm border border-white/5">
              {currentSystemConfig.fullname}
            </p>
            <p className="text-[10px] text-[var(--accent)] font-black uppercase tracking-[0.3em] mt-2">
              {currentSystemConfig.manufacturer} • {currentSystemConfig.releaseYear} • {systems.length} SYSTEMS
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-1.5 z-20">
         {systems.map((_, i) => (
           <div 
             key={i} 
             className={`h-0.5 transition-all duration-300 ${
               i === index ? 'w-8 bg-[var(--accent)]' : 'w-2 bg-white/10'
             }`} 
           />
         ))}
      </div>
    </div>
  );
};
