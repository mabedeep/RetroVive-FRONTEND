/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Target, Sliders } from 'lucide-react';

interface GamepadConfigProps {
  onBack: () => void;
}

export const GamepadConfig: React.FC<GamepadConfigProps> = ({ onBack }) => {
  const { settings, updateSettings } = useApp();
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let ticker: number;
    const poll = () => {
      const gpsis = navigator.getGamepads();
      for (const gp of gpsis) {
        if (!gp) continue;
        setStickPos({ x: gp.axes[0], y: gp.axes[1] });
        break; // Just track the first found gamepad
      }
      ticker = requestAnimationFrame(poll);
    };
    poll();
    return () => cancelAnimationFrame(ticker);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-full"
        >
          <ArrowLeft size={24} />
        </button>
        <h3 className="text-xl font-bold uppercase tracking-tight">Analog Stick & Sensitivity</h3>
      </div>

      <div className="grid grid-cols-2 gap-12">
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest">Stick Sensitivity</label>
                <span className="text-sm font-mono">{settings.analogSensitivity.toFixed(2)}x</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="2.0" 
                step="0.05"
                value={settings.analogSensitivity}
                onChange={(e) => updateSettings({ analogSensitivity: parseFloat(e.target.value) })}
                className="accent-[var(--accent)]" 
              />
              <p className="text-[10px] text-[var(--text-dim)]">Multiplies stick input. Higher values make the stick react faster.</p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest">Dead Zone</label>
                <span className="text-sm font-mono">{settings.analogDeadZone.toFixed(2)}</span>
              </div>
              <input 
                type="range" 
                min="0.05" 
                max="0.8" 
                step="0.05"
                value={settings.analogDeadZone}
                onChange={(e) => updateSettings({ analogDeadZone: parseFloat(e.target.value) })}
                className="accent-[var(--accent)]" 
              />
              <p className="text-[10px] text-[var(--text-dim)]">Minimum movement required to trigger an action. Higher values prevent stick drift.</p>
            </div>
          </section>

          <div className="p-4 bg-white/5 rounded-xl flex items-center gap-4 border border-white/5">
             <Sliders className="text-[var(--accent)]" size={20} />
             <p className="text-xs text-[var(--text-dim)]">These settings affect menu navigation and game selection logic.</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 p-8 bg-neutral-900 rounded-2xl border border-white/5 relative overflow-hidden">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-dim)] absolute top-4">Live Input Monitor</h4>
          
          <div className="relative w-48 h-48 border-2 border-white/10 rounded-full flex items-center justify-center">
             {/* Center markers */}
             <div className="absolute w-full h-[1px] bg-white/5" />
             <div className="absolute h-full w-[1px] bg-white/5" />
             
             {/* Deadzone visualizer */}
             <div 
               className="absolute border border-[var(--accent)]/30 rounded-full bg-[var(--accent)]/5"
               style={{ 
                 width: `${settings.analogDeadZone * 100}%`, 
                 height: `${settings.analogDeadZone * 100}%` 
               }}
             />

             {/* Stick indicator */}
             <motion.div 
               className="absolute w-6 h-6 bg-[var(--accent)] rounded-full shadow-[0_0_15px_rgba(255,78,0,0.5)] z-10"
               animate={{ 
                 x: stickPos.x * 96 * settings.analogSensitivity, 
                 y: stickPos.y * 96 * settings.analogSensitivity 
               }}
               transition={{ type: 'spring', damping: 10, stiffness: 100 }}
             />
          </div>

          <div className="flex gap-8 text-[10px] font-mono text-[var(--text-dim)] mt-4">
             <div>X: {stickPos.x.toFixed(3)}</div>
             <div>Y: {stickPos.y.toFixed(3)}</div>
          </div>
          
          {Math.sqrt(stickPos.x**2 + stickPos.y**2) > settings.analogDeadZone && (
             <div className="absolute bottom-4 text-[var(--accent)] text-[10px] font-bold animate-pulse uppercase tracking-widest">
                Action Triggered
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
