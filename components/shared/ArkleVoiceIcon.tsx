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
      className={`${currentSize} rounded-full flex items-center justify-center relative overflow-hidden shadow-2xl ${className}`}
      style={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #dbeafe 30%, #60a5fa 65%, #2563eb 100%)',
        border: '1px solid rgba(255,255,255,0.4)',
        boxShadow: isListening ? '0 0 50px rgba(96, 165, 250, 0.6), inset 0 -10px 25px rgba(37, 99, 235, 0.5)' : '0 15px 35px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* 🌀 The fluid liquid blobs shifting around */}
      <div className="absolute inset-0 overflow-hidden opacity-90 pointer-events-none">
        <motion.div 
          animate={isListening ? {
            scale: [1.2, 1.4, 1.2],
            rotate: [0, 180, 360]
          } : {
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180]
          }}
          transition={{ duration: isListening ? 6 : 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-20%] bg-blue-400/20 rounded-[40%] blur-[25px]"
        />
        <motion.div 
          animate={isListening ? {
            scale: [1.3, 1.1, 1.3],
            rotate: [180, 360, 540]
          } : {
            scale: [1, 1.05, 1],
            rotate: [90, 180, 270]
          }}
          transition={{ duration: isListening ? 8 : 16, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-30%] bg-sky-300/30 rounded-[35%] blur-[30px]"
        />
        <motion.div 
          animate={isListening ? {
            scale: [1.1, 1.3, 1.1],
            rotate: [360, 180, 0]
          } : {
            scale: [1, 1.15, 1],
            rotate: [180, 270, 360]
          }}
          transition={{ duration: isListening ? 7 : 14, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-25%] bg-indigo-500/20 rounded-[45%] blur-[35px]"
        />
      </div>

      {/* 🔮 Center responsive energy core bubble */}
      <motion.div
        animate={isListening ? {
          scale: [1, 1.1 + (volume / 80), 1.02 + (volume / 100), 1],
          borderRadius: [
            "42% 58% 70% 30% / 45% 45% 55% 55%",
            "70% 30% 52% 48% / 60% 40% 60% 40%",
            "50% 50% 50% 50% / 50% 50% 50% 50%"
          ]
        } : isThinking ? {
          scale: [1, 1.08, 1],
          borderRadius: ["50%", "45% 55% 45% 55%", "50%"]
        } : {
          scale: 1,
          borderRadius: "50%"
        }}
        transition={{
          duration: isListening ? 3 : 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-4 bg-gradient-to-tr from-blue-500/80 via-sky-400/90 to-white/95 backdrop-blur-2xl shadow-inner border border-white/30 flex items-center justify-center z-10"
      >
        <div className="flex items-center gap-[10%] h-[35%] w-[50%] justify-center relative">
          {bars.map((h, i) => (
            <motion.div 
              key={i} 
              animate={isListening ? { 
                height: [
                  `${h * 0.4 + (volume * 0.4)}%`, 
                  `${h * 0.9 + (volume * 0.8)}%`, 
                  `${h * 0.5 + (volume * 0.5)}%`
                ]
              } : isThinking ? {
                height: [`${h * 0.5}%`, `${h * 0.8}%`, `${h * 0.5}%`],
                opacity: [0.6, 1, 0.6]
              } : {
                height: `4px`
              }}
              transition={{ 
                duration: isListening ? 0.12 : 1.2, 
                repeat: Infinity, 
                repeatType: "mirror",
                delay: i * 0.08
              }}
              className="w-[12%] bg-blue-600/80 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]"
              style={{ minHeight: '3px' }}
            />
          ))}
        </div>
      </motion.div>

      {/* Subtle overlay reflection shine */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/30 rounded-full pointer-events-none z-20" />
    </div>
  );
};
