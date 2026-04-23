/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { useNavigation } from '../hooks/useNavigation';
import { Play, Info, Star, Users, Calendar, Building2, Film } from 'lucide-react';

export const GameDetails: React.FC = () => {
  const { currentGame, setCurrentGame } = useApp();
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const triggerVibration = () => {
    // Gamepad vibration
    const gamepads = navigator.getGamepads();
    for (const gp of gamepads) {
      if (gp?.vibrationActuator) {
        (gp.vibrationActuator as any).playEffect('dual-rumble', {
          startDelay: 0,
          duration: 200,
          weakMagnitude: 1.0,
          strongMagnitude: 1.0,
        });
      }
    }
    // Browser/Mobile vibration fallback
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  };

  const handleLaunch = () => {
    triggerVibration();
    alert(`Launching: ${currentGame?.path} with RetroArch...`);
  };

  useNavigation({
    onAction: (action) => {
      if (action === 'BACK') {
        if (isPlayingVideo) setIsPlayingVideo(false);
        else setCurrentGame(null);
      }
      if (action === 'SELECT' && !isPlayingVideo) {
        handleLaunch();
      }
    }
  });

  if (!currentGame) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-[var(--bg-primary)] z-50 overflow-hidden flex"
    >
      {/* Background Fanart */}
      <div className="absolute inset-0 opacity-20 filter blur-xl">
         <img 
           src={currentGame.media.fanart} 
           alt="" 
           referrerPolicy="no-referrer"
           className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
      </div>

      <div className="relative w-1/3 h-full flex flex-col justify-center items-center p-20 gap-8">
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full aspect-[3/4] bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border-4 border-white/10 relative group"
        >
          <AnimatePresence mode="wait">
            {!isPlayingVideo ? (
              <motion.div
                key="image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full relative"
              >
                <img 
                  src={currentGame.media.box2d} 
                  alt={currentGame.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden absolute inset-0 flex items-center justify-center p-12 text-center text-4xl font-black opacity-20">
                  {currentGame.name}
                </div>
                
                {/* Overlay Play Icon for Video */}
                {currentGame.media.video && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 cursor-pointer"
                    onClick={() => setIsPlayingVideo(true)}
                  >
                    <div className="w-20 h-20 rounded-full bg-[var(--accent)] flex items-center justify-center pl-2">
                       <Play fill="white" size={40} className="text-white" />
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full bg-black"
              >
                <video
                  ref={videoRef}
                  src={currentGame.media.video}
                  autoPlay
                  controls
                  className="w-full h-full object-contain"
                  onEnded={() => setIsPlayingVideo(false)}
                />
                <button 
                  onClick={() => setIsPlayingVideo(false)}
                  className="absolute top-4 right-4 bg-black/60 p-2 rounded-full hover:bg-black/80"
                >
                  ESC
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="flex flex-col w-full gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full h-20 bg-[var(--accent)] text-white text-2xl font-black flex items-center justify-center gap-4 rounded-xl shadow-lg ring-offset-4 ring-offset-[var(--bg-primary)] hover:ring-4 ring-[var(--accent)]/50"
            onClick={handleLaunch}
          >
            <Play size={40} fill="currentColor" />
            LAUNCH GAME
          </motion.button>

          {currentGame.media.video && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full h-14 bg-white/10 text-white font-bold flex items-center justify-center gap-3 rounded-xl border border-white/5 hover:bg-white/20`}
              onClick={() => setIsPlayingVideo(!isPlayingVideo)}
            >
              <Film size={20} />
              {isPlayingVideo ? 'STOP PREVIEW' : 'WATCH PREVIEW'}
            </motion.button>
          )}
        </div>
      </div>

      <div className="relative w-2/3 h-full p-20 flex flex-col justify-center gap-8 overflow-y-auto">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1 className="text-7xl font-black mb-4 tracking-tighter">{currentGame.name}</h1>
          <div className="flex gap-6 mb-8 text-[var(--accent)] font-bold">
             <div className="flex items-center gap-2"><Star size={18} fill="currentColor" /> {currentGame.rating.toFixed(1)}/10</div>
             <div className="flex items-center gap-2"><Users size={18} /> {currentGame.players} Players</div>
             <div className="flex items-center gap-2"><Calendar size={18} /> {currentGame.releasedate.substring(0, 4)}</div>
          </div>
          
          <div className="max-w-2xl text-xl text-[var(--text-dim)] leading-relaxed mb-12">
            {currentGame.desc}
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm uppercase tracking-widest text-[var(--text-dim)]">
             <div>
                <p className="font-black text-[var(--accent)] mb-2 flex items-center gap-2"><Building2 size={16} /> Developer</p>
                <p>{currentGame.developer}</p>
             </div>
             <div>
                <p className="font-black text-[var(--accent)] mb-2 flex items-center gap-2"><Info size={16} /> Path</p>
                <p className="truncate font-mono text-xs">{currentGame.path}</p>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-8 right-8">
         <button 
           onClick={() => setCurrentGame(null)}
           className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center hover:bg-neutral-700"
         >
           ESC
         </button>
      </div>
    </motion.div>
  );
};
