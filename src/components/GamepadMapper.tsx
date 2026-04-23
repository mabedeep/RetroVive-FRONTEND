/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { NavAction } from '../types';
import { Gamepad2, ArrowLeft } from 'lucide-react';

interface GamepadMapperProps {
  onBack: () => void;
}

const ACTIONS: NavAction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT', 'SELECT', 'BACK', 'MENU'];

export const GamepadMapper: React.FC<GamepadMapperProps> = ({ onBack }) => {
  const { settings, updateSettings } = useApp();
  const [mappingAction, setMappingAction] = useState<NavAction | null>(null);

  const handleGamepadButton = useCallback((buttonIndex: number) => {
    if (mappingAction) {
      const newMapping = { ...settings.controllerMapping, [mappingAction]: buttonIndex };
      updateSettings({ controllerMapping: newMapping });
      setMappingAction(null);
    }
  }, [mappingAction, settings.controllerMapping, updateSettings]);

  useEffect(() => {
    let ticker: number;
    const poll = () => {
      if (mappingAction) {
        const gamepads = navigator.getGamepads();
        for (const gp of gamepads) {
          if (!gp) continue;
          gp.buttons.forEach((btn, idx) => {
            if (btn.pressed) handleGamepadButton(idx);
          });
        }
      }
      ticker = requestAnimationFrame(poll);
    };
    poll();
    return () => cancelAnimationFrame(ticker);
  }, [mappingAction, handleGamepadButton]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-full"
        >
          <ArrowLeft size={24} />
        </button>
        <h3 className="text-xl font-bold">CONTROLLER MAPPING</h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {ACTIONS.map((action) => (
          <div 
            key={action}
            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5"
          >
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-widest text-[var(--accent)]">{action}</span>
              <span className="text-xs text-[var(--text-dim)]">Current: Button {settings.controllerMapping[action]}</span>
            </div>
            
            <button
              onClick={() => setMappingAction(action)}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                mappingAction === action 
                ? 'bg-[var(--accent)] animate-pulse' 
                : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {mappingAction === action ? 'PRESS ANY BUTTON...' : 'REMAP'}
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {mappingAction && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-4 bg-[var(--accent)]/20 border border-[var(--accent)]/30 rounded-xl flex items-center gap-4 text-sm"
          >
            <Gamepad2 className="animate-bounce" />
            <span>Waiting for input for <strong className="text-[var(--accent)]">{mappingAction}</strong>...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
