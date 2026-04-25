import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const QAOverlay = ({ isScanning = false }: { isScanning?: boolean }) => (
  <AnimatePresence>
    {isScanning && (
      <div className="absolute inset-0 z-[100] pointer-events-none overflow-hidden">
        <motion.div 
          initial={{ y: '-100%' }}
          animate={{ y: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)]"
        />
        <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[1px] animate-pulse"></div>
      </div>
    )}
  </AnimatePresence>
);
