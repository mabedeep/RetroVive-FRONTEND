import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Check, Loader2, FolderPlus, X } from 'lucide-react';

const COMMON_SYSTEMS = [
  { id: '3do', name: '3DO', type: 'console' },
  { id: 'amiga', name: 'Amiga', type: 'computer' },
  { id: 'arcade', name: 'Arcade', type: 'arcade' },
  { id: 'atari2600', name: 'Atari 2600', type: 'console' },
  { id: 'atari5200', name: 'Atari 5200', type: 'console' },
  { id: 'atari7800', name: 'Atari 7800', type: 'console' },
  { id: 'atarilynx', name: 'Atari Lynx', type: 'handheld' },
  { id: 'dreamcast', name: 'Dreamcast', type: 'console' },
  { id: 'fbneo', name: 'FinalBurn Neo', type: 'arcade' },
  { id: 'gameboy', name: 'Game Boy', type: 'handheld' },
  { id: 'gba', name: 'Game Boy Advance', type: 'handheld' },
  { id: 'gbc', name: 'Game Boy Color', type: 'handheld' },
  { id: 'gamecube', name: 'GameCube', type: 'console' },
  { id: 'genesis', name: 'Sega Genesis', type: 'console' },
  { id: 'n64', name: 'Nintendo 64', type: 'console' },
  { id: 'nds', name: 'Nintendo DS', type: 'handheld' },
  { id: 'nes', name: 'NES', type: 'console' },
  { id: 'pcengine', name: 'PC Engine', type: 'console' },
  { id: 'ps1', name: 'PlayStation', type: 'console' },
  { id: 'ps2', name: 'PlayStation 2', type: 'console' },
  { id: 'psp', name: 'PSP', type: 'handheld' },
  { id: 'saturn', name: 'Saturn', type: 'console' },
  { id: 'snes', name: 'SNES', type: 'console' },
  { id: 'wii', name: 'Wii', type: 'console' },
  { id: 'zxtpectrum', name: 'ZX Spectrum', type: 'computer' },
];

export const SystemWizard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});

  const toggleSystem = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const createSystems = async () => {
    for (const id of selected) {
      if (status[id] === 'success') continue;
      
      setStatus(prev => ({ ...prev, [id]: 'loading' }));
      
      const system = COMMON_SYSTEMS.find(s => s.id === id);
      try {
        const res = await fetch('/api/systems/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(system)
        });
        
        if (res.ok) {
          setStatus(prev => ({ ...prev, [id]: 'success' }));
        } else {
          setStatus(prev => ({ ...prev, [id]: 'error' }));
        }
      } catch (err) {
        setStatus(prev => ({ ...prev, [id]: 'error' }));
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-12 bg-black/90 backdrop-blur-xl"
    >
      <div className="bg-[var(--bg-secondary)] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black italic tracking-tighter text-[var(--accent)]">SYSTEM WIZARD</h2>
            <p className="text-[var(--text-dim)] text-sm uppercase tracking-widest font-bold">Automatic Folder Scaffolding</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={32} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-3 gap-4">
          {COMMON_SYSTEMS.map(system => (
            <div 
              key={system.id}
              onClick={() => toggleSystem(system.id)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                selected.includes(system.id) 
                  ? 'border-[var(--accent)] bg-[var(--accent)]/10' 
                  : 'border-white/5 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex flex-col">
                <span className="font-bold text-sm">{system.name}</span>
                <span className="text-[10px] uppercase opacity-50">{system.id}</span>
              </div>
              
              <div className="flex items-center justify-center w-8 h-8 rounded-full">
                {status[system.id] === 'loading' ? (
                  <Loader2 className="animate-spin text-[var(--accent)]" size={20} />
                ) : status[system.id] === 'success' ? (
                  <Check className="text-green-500" size={20} />
                ) : status[system.id] === 'error' ? (
                  <X className="text-red-500" size={20} />
                ) : selected.includes(system.id) ? (
                  <Check className="text-[var(--accent)]" size={20} />
                ) : (
                  <Plus className="opacity-20" size={20} />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 border-t border-white/10 flex items-center justify-between bg-black/20">
          <div className="text-sm">
            <span className="font-bold text-[var(--accent)]">{selected.length}</span> systems selected
          </div>
          
          <div className="flex gap-4">
             <button 
               onClick={onClose}
               className="px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/5"
             >
               Cancel
             </button>
             <button 
               onClick={createSystems}
               disabled={selected.length === 0}
               className="px-8 py-3 bg-[var(--accent)] text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-lg"
             >
               <FolderPlus size={18} />
               Create Structure
             </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
