/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { THEMES, SYSTEMS } from '../constants';
import { Settings, Volume2, Gamepad2, LogOut, Power, RotateCw, Monitor, Zap, Image, ArrowLeft, Wand2 } from 'lucide-react';
import { GamepadMapper } from './GamepadMapper';
import { GamepadConfig } from './GamepadConfig';
import { SystemWizard } from './SystemWizard';

interface SettingsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsOverlay: React.FC<SettingsOverlayProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, systems } = useApp();
  const [view, setView] = useState<'main' | 'mapping' | 'analog' | 'backgrounds'>('main');
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md"
        onClick={() => {
          setView('main');
          onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="w-[850px] max-h-[90vh] bg-[var(--bg-secondary)] rounded-3xl p-12 flex flex-col gap-8 overflow-hidden border border-white/5 shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <AnimatePresence mode="wait">
            {view === 'main' && (
              <motion.div
                key="main"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="flex flex-col gap-12"
              >
                <div className="flex items-center gap-4">
                  <Settings size={32} className="text-[var(--accent)]" />
                  <h2 className="text-4xl font-black tracking-tighter">SETTINGS</h2>
                </div>

                <div className="grid grid-cols-2 gap-12">
                  <div className="flex flex-col gap-8">
                    <section className="flex flex-col gap-4">
                      <h3 className="text-xs font-bold text-[var(--accent)] tracking-widest uppercase">General</h3>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                         <div className="flex items-center gap-3"><Monitor size={20} /> Theme</div>
                         <select 
                            value={settings.theme}
                            onChange={(e) => updateSettings({ theme: e.target.value })}
                            className="bg-[var(--bg-primary)] p-2 rounded-lg border-none"
                         >
                            {THEMES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                         </select>
                      </div>
                      <div className="flex flex-col gap-3 p-4 bg-white/5 rounded-xl">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3"><Volume2 size={20} /> Master Volume</div>
                            <span>{settings.volume}%</span>
                         </div>
                         <input 
                           type="range" 
                           value={settings.volume}
                           onChange={(e) => updateSettings({ volume: parseInt(e.target.value) })}
                           className="accent-[var(--accent)]" 
                         />
                      </div>

                      <div className="flex flex-col gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-3 font-bold text-sm"><Zap size={20} className="text-[var(--accent)]" /> Background Music</div>
                            <span className="text-[10px] opacity-50 uppercase tracking-widest">Random tracks from /musica</span>
                          </div>
                          <button 
                            onClick={() => updateSettings({ bgmEnabled: !settings.bgmEnabled })}
                            className={`w-12 h-6 rounded-full relative transition-colors ${settings.bgmEnabled ? 'bg-[var(--accent)]' : 'bg-white/10'}`}
                          >
                            <motion.div 
                              animate={{ x: settings.bgmEnabled ? 24 : 4 }}
                              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                          </button>
                        </div>

                        {settings.bgmEnabled && (
                          <div className="flex flex-col gap-2 mt-2">
                             <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                <span>Music Volume</span>
                                <span>{settings.bgmVolume}%</span>
                             </div>
                             <input 
                               type="range" 
                               value={settings.bgmVolume}
                               onChange={(e) => updateSettings({ bgmVolume: parseInt(e.target.value) })}
                               className="accent-[var(--accent)] h-1" 
                             />
                          </div>
                        )}
                      </div>
                    </section>
  
                    <section className="flex flex-col gap-3">
                       <h3 className="text-xs font-bold text-[var(--accent)] tracking-widest uppercase">Tools</h3>
                       <button 
                         onClick={() => setIsWizardOpen(true)}
                         className="flex items-center gap-3 p-4 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl border border-[var(--accent)]/30 hover:bg-[var(--accent)]/20 transition-colors w-full text-left font-bold"
                       >
                          <Wand2 size={20} /> System Creation Wizard
                       </button>
                    </section>
                  </div>

                  <div className="flex flex-col gap-8">
                    <section className="flex flex-col gap-3">
                       <h3 className="text-xs font-bold text-[var(--accent)] tracking-widest uppercase">Controls</h3>
                       <button 
                         onClick={() => setView('mapping')}
                         className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-[var(--accent)]/20 transition-colors w-full text-left"
                       >
                          <Gamepad2 size={20} /> Map Controller Buttons
                       </button>
                       <button 
                         onClick={() => setView('analog')}
                         className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-[var(--accent)]/20 transition-colors w-full text-left"
                       >
                          <Zap size={20} /> Analog Sensitivity & Deadzones
                       </button>
                       <button 
                         onClick={() => setView('backgrounds')}
                         className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-[var(--accent)]/20 transition-colors w-full text-left"
                       >
                          <Monitor size={20} /> Custom System Backgrounds
                       </button>
                    </section>

                    <div className="flex flex-col gap-4">
                       <h3 className="text-xs font-bold text-[var(--accent)] tracking-widest uppercase">System</h3>
                       <div className="grid grid-cols-1 gap-2">
                          <button 
                            onClick={() => alert('Closing App...')}
                            className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-neutral-700 text-left"
                          >
                             <LogOut size={20} /> Exit App
                          </button>
                          <button 
                             onClick={() => alert('Rebooting System...')}
                             className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-neutral-700 text-left"
                          >
                             <RotateCw size={20} /> Reboot
                          </button>
                          <button 
                            onClick={() => alert('Shutting Down...')}
                            className="flex items-center gap-4 p-4 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500/30 text-left"
                          >
                             <Power size={20} /> Shutdown
                          </button>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'mapping' && (
              <motion.div
                key="mapping"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="overflow-y-auto pr-2"
              >
                <GamepadMapper onBack={() => setView('main')} />
              </motion.div>
            )}

            {view === 'analog' && (
              <motion.div
                key="analog"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
              >
                <GamepadConfig onBack={() => setView('main')} />
              </motion.div>
            )}
            {view === 'backgrounds' && (
              <motion.div
                key="backgrounds"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="flex flex-col gap-8 h-full"
              >
                <div className="flex items-center gap-4">
                  <button 
                     onClick={() => setView('main')}
                     className="p-2 hover:bg-white/10 rounded-full"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <h3 className="text-xl font-bold uppercase tracking-tight">System Backgrounds</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-4 flex flex-col gap-6">
                   <p className="text-xs text-[var(--text-dim)] uppercase tracking-widest font-bold">
                      Provide a URL to override the default system background.
                   </p>
                   
                   {systems.map(system => (
                      <div key={system.id} className="flex flex-col gap-2 p-4 bg-white/5 rounded-xl border border-white/5">
                         <div className="flex items-center justify-between">
                            <label className="text-sm font-bold uppercase">{system.name}</label>
                            <span className="text-[10px] text-[var(--accent)] font-bold uppercase tracking-widest italic">{system.type}</span>
                         </div>
                         <input 
                            type="text"
                            placeholder="Background Image URL..."
                            value={settings.systemBackgrounds[system.id] || ''}
                            onChange={(e) => {
                               const newBgs = { ...settings.systemBackgrounds, [system.id]: e.target.value };
                               updateSettings({ systemBackgrounds: newBgs });
                            }}
                            className="w-full bg-black/40 p-3 rounded-lg border border-white/10 text-sm focus:border-[var(--accent)] outline-none transition-colors"
                         />
                      </div>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center text-[var(--text-dim)] text-xs">
             <p>RetroVibe Frontend v1.0.0</p>
             <button 
               onClick={() => {
                 setView('main');
                 onClose();
               }} 
               className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-bold"
             >
               CLOSE
             </button>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isWizardOpen && (
          <SystemWizard onClose={() => {
            setIsWizardOpen(false);
            reloadSystems();
          }} />
        )}
      </AnimatePresence>
    </>
  );
};
