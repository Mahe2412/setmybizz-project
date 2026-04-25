import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StartupBible, loadBible, saveBible } from '../lib/ArkleMemoryManager';

/**
 * MemoryBadge Component
 * UI Memory Visualizer for Arkle's Startup Bible
 */
const MemoryBadge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bible, setBible] = useState<StartupBible | null>(null);

  useEffect(() => {
    setBible(loadBible());
  }, [isOpen]);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      {/* The Floating Badge */}
      <button 
        onClick={toggleOpen}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border ${isOpen ? 'bg-blue-600 text-white border-blue-500 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-blue-400 hover:text-blue-600'}`}
      >
        <span className={`material-symbols-outlined text-[18px] ${isOpen ? 'animate-pulse' : ''}`}>psychology</span>
        <span className="text-[10px] font-black uppercase tracking-widest">Neural Memory</span>
      </button>

      {/* Memory Panel Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            className="absolute right-0 bottom-full mb-4 w-80 bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden z-[200]"
          >
            <div className="p-6 bg-slate-900 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[14px] font-black uppercase tracking-widest">Startup Bible</h3>
                <span className="text-[9px] font-bold text-blue-400">v1.0 Ready</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">Everything Arkle knows about your vision and stack.</p>
            </div>

            <div className="p-6 space-y-6 max-h-96 overflow-y-auto custom-scrollbar">
              {/* Style Guide Section */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Style & Tone</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Tone</p>
                    <p className="text-[12px] font-black text-slate-800">{bible?.styleGuide.tone}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Theme</p>
                    <p className="text-[12px] font-black text-slate-800">{bible?.styleGuide.theme}</p>
                  </div>
                </div>
              </div>

              {/* Tech Stack Section */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tech Stack</h4>
                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[16px] text-blue-500">database</span>
                    <span className="text-[12px] font-bold text-slate-700">{bible?.techStack.database}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-blue-500">rocket</span>
                    <span className="text-[12px] font-bold text-slate-700">{bible?.techStack.hosting}</span>
                  </div>
                </div>
              </div>

              {/* Logic & Rules */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Neural Rules</h4>
                <div className="space-y-2">
                  {bible?.businessLogic.map((rule, i) => (
                    <div key={i} className="flex gap-2 text-[11px] font-medium text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-blue-500">●</span>
                      {rule}
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Close Vault
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemoryBadge;
