'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ArkleVoiceOrb({ isOpen, onClose, isListening, msgs }: { 
  isOpen: boolean; 
  onClose: () => void; 
  isListening: boolean;
  msgs: any[];
}) {
  const lastAiMsg = msgs.filter(m => m.role === 'assistant').pop()?.content || "Arkle is listening...";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-10 overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px]" />
             <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
          </div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-10 right-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10 z-50"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          {/* THE NEURAL ORB */}
          <div className="relative z-10 flex flex-col items-center gap-16 w-full max-w-2xl">
            <div className="relative">
              {/* Outer Pulsing Rings */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-blue-400 rounded-full blur-3xl -m-20"
              />

              {/* Main Morphing Orb */}
              <motion.div
                animate={{
                  scale: isListening ? [1, 1.1, 1.05, 1.1, 1] : 1,
                  borderRadius: [
                    "40% 60% 70% 30% / 40% 50% 60% 70%",
                    "60% 40% 30% 70% / 50% 60% 30% 40%",
                    "40% 60% 70% 30% / 40% 50% 60% 70%"
                  ],
                }}
                transition={{
                  duration: isListening ? 4 : 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-64 h-64 md:w-80 md:h-80 bg-linear-to-tr from-blue-400 via-indigo-200 to-white shadow-[0_0_80px_rgba(59,130,246,0.5)] border border-white/40 backdrop-blur-3xl relative overflow-hidden"
              >
                 {/* Internal Glassmorphic Shimmer */}
                 <motion.div 
                   animate={{ x: [-200, 400], y: [-200, 400] }}
                   transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent w-[200%] h-[200%]"
                 />
              </motion.div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-8 pt-10">
               <button className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                  <span className="material-symbols-outlined text-[32px]">mic_off</span>
               </button>
               <button 
                 onClick={onClose}
                 className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white shadow-2xl shadow-red-500/20 hover:scale-110 active:scale-90 transition-all"
               >
                  <span className="material-symbols-outlined text-[36px]">call_end</span>
               </button>
               <button className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                  <span className="material-symbols-outlined text-[32px]">volume_up</span>
               </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
