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
    <div className="h-screen w-full flex flex-col justify-center items-center overflow-hidden relative">
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

      <div className="text-center mb-12 relative z-10">
        <h1 className="text-6xl font-black italic tracking-tighter opacity-10 font-[Anton]">
          RETROVIBE
        </h1>
      </div>

      <div className="flex items-center gap-12 px-20 relative z-10">
        {systems.map((system, i) => (
          <motion.div
            key={system.id}
            animate={{
              scale: i === index ? 1.2 : 0.8,
              opacity: i === index ? 1 : 0.4,
              x: (index - i) * -100
            }}
            className={`flex flex-col items-center gap-4 cursor-pointer rounded-2xl ${
              i === index ? 'bg-[var(--bg-secondary)]/80 shadow-[var(--card-shadow)] backdrop-blur-md' : 'bg-black/20'
            }`}
            onClick={() => {
              setIndex(i);
              if (index === i) setCurrentSystem(system);
            }}
          >
            <div className="w-72 h-72 rounded-xl flex items-center justify-center relative overflow-hidden">
              <SystemLogo system={system} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-20 text-center relative z-10">
        <p className="text-[var(--text-dim)] uppercase tracking-widest text-sm bg-black/40 px-6 py-2 rounded-full backdrop-blur-sm">
          {currentSystemConfig.fullname} • {currentSystemConfig.manufacturer} • {currentSystemConfig.releaseYear}
        </p>
      </div>
    </div>
  );
};
