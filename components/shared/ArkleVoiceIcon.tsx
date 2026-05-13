'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface ArkleVoiceIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isListening?: boolean;
  isThinking?: boolean;
  volume?: number;
  className?: string;
}

export const ArkleVoiceIcon: React.FC<ArkleVoiceIconProps> = ({ 
  size = 'md', 
  isListening = false, 
  isThinking = false, 
  volume = 0,
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-40 h-40'
  };

  const barHeightMap = {
    sm: [8, 14, 20, 14, 8],
    md: [12, 22, 32, 22, 12],
    lg: [24, 44, 64, 44, 24],
    xl: [40, 70, 100, 70, 40]
  };

  const currentSize = sizeMap[size];
  const bars = barHeightMap[size];

  return (
    <div 
      className={`${currentSize} rounded-full flex items-center justify-center relative overflow-hidden shadow-lg ${className}`}
      style={{ 
        background: 'radial-gradient(circle at center, #2563eb 0%, #1e40af 100%)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <div className="flex items-center gap-[10%] h-[60%] relative z-10">
        {bars.map((h, i) => (
          <motion.div 
            key={i} 
            animate={isListening ? { 
              height: [
                `${h * 0.8 + (volume * 0.2)}%`, 
                `${h * 1.2 + (volume * 0.5)}%`, 
                `${h * 0.9 + (volume * 0.3)}%`
              ]
            } : isThinking ? {
              height: [`${h}%`, `${h * 1.2}%`, `${h}%`],
              opacity: [0.6, 1, 0.6]
            } : {
              height: `${h}%`
            }}
            transition={{ 
              duration: isListening ? 0.15 : 1.5, 
              repeat: Infinity, 
              repeatType: "mirror",
              delay: i * 0.1
            }}
            className="w-[15%] bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            style={{ minHeight: '2px' }}
          />
        ))}
      </div>
      
      {/* Subtle Glow */}
      <div className="absolute inset-0 bg-white/5 rounded-full pointer-events-none"></div>
    </div>
  );
};
