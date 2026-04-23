import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Check, Loader2, FolderPlus, X } from 'lucide-react';

import systemsDb from '../system_db.json';

const ALL_SYSTEMS = Object.entries(systemsDb).map(([id, info]: [string, any]) => ({
  id,
  name: info.name,
  type: info.type
}));

export const SystemWizard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});

  const filteredSystems = ALL_SYSTEMS.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSystem = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelected(ALL_SYSTEMS.map(s => s.id));
  };

  const deselectAll = () => {
    setSelected([]);
  };

  const createSystems = async () => {
    for (const id of selected) {
      if (status[id] === 'success') continue;
      
      setStatus(prev => ({ ...prev, [id]: 'loading' }));
      
      const system = ALL_SYSTEMS.find(s => s.id === id);
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
      <div className="bg-[var(--bg-secondary)] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black italic tracking-tighter text-[var(--accent)]">SYSTEM WIZARD</h2>
            <p className="text-[var(--text-dim)] text-sm uppercase tracking-widest font-bold">Bulk Scaffolding Engine</p>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="text"
              placeholder="Search systems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors w-64"
            />
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={32} />
            </button>
          </div>
        </div>

        <div className="p-4 bg-black/20 border-b border-white/5 flex gap-4 px-8">
           <button onClick={selectAll} className="text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">Select All</button>
           <button onClick={deselectAll} className="text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">Deselect All</button>
           <div className="flex-1 text-right text-[10px] font-bold uppercase tracking-widest opacity-30">
              Total Systems: {ALL_SYSTEMS.length}
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-4 gap-3">
          {filteredSystems.map(system => (
            <div 
              key={system.id}
              onClick={() => toggleSystem(system.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                selected.includes(system.id) 
                  ? 'border-[var(--accent)] bg-[var(--accent)]/10 ring-1 ring-[var(--accent)]' 
                  : 'border-white/5 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs truncate">{system.name}</span>
                <span className="text-[9px] uppercase opacity-40 truncate">{system.id}</span>
              </div>
              
              <div className="flex items-center justify-center w-6 h-6 rounded-full shrink-0">
                {status[system.id] === 'loading' ? (
                  <Loader2 className="animate-spin text-[var(--accent)]" size={14} />
                ) : status[system.id] === 'success' ? (
                  <Check className="text-green-500" size={14} />
                ) : status[system.id] === 'error' ? (
                  <X className="text-red-500" size={14} />
                ) : selected.includes(system.id) ? (
                  <Check className="text-[var(--accent)]" size={14} />
                ) : (
                  <Plus className="opacity-10" size={14} />
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
               Scaffold Selected Systems
             </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
