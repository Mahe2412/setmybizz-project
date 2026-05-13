'use client';
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArkleVoiceOrbProps {
    isOpen: boolean;
    onClose: () => void;
    isListening: boolean;
    isAiTalking?: boolean;
    partialTranscript?: string;
    finalTranscript?: string;
    volumeLevel?: number; // 0-100
}

export default function ArkleVoiceOrb({ 
    isOpen, 
    onClose, 
    isListening, 
    isAiTalking,
    partialTranscript, 
    finalTranscript,
    volumeLevel = 0 
}: ArkleVoiceOrbProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Audio reactive animation logic could go here, 
    // but for now let's use the volumeLevel for pure CSS/Motion animations for performance

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1000] bg-slate-950/40 backdrop-blur-md flex flex-col items-center justify-center p-10 overflow-hidden"
                >
                    {/* 🌌 Neural Background Surface */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" />
                        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
                        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-cyan-400/5 rounded-full blur-[130px]" />
                        
                        {/* Dynamic Grid Overlay */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                    </div>

                    {/* ✖️ Close Control */}
                    <motion.button 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        onClick={onClose}
                        className="absolute top-10 right-10 w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/10 z-[1100]"
                    >
                        <span className="material-symbols-outlined text-[24px]">close</span>
                    </motion.button>

                    {/* 🧠 THE NEURAL ORB CENTERPIECE */}
                    <div className="relative z-10 flex flex-col items-center gap-16 w-full max-w-4xl text-center">
                        <div className="relative">
                            {/* Outer Reactive Energy Rings */}
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ 
                                        scale: isListening ? [1, 1.2 + (volumeLevel/100), 1] : 1,
                                        opacity: isListening ? [0.1, 0.2, 0.1] : 0.05,
                                        rotate: i * 45
                                    }}
                                    transition={{ duration: 4 / i, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-blue-500 rounded-full blur-3xl -m-24"
                                />
                            ))}

                            {/* THE LIQUID ORB (Multiple Morphing Layers) */}
                            <div className={`relative transition-all duration-700 ${isAiTalking ? 'w-48 h-48 md:w-56 md:h-56' : 'w-72 h-72 md:w-96 md:h-96'}`}>
                                <motion.div
                                    animate={{
                                        scale: isListening ? [1, 1.05, 1] : 1,
                                        borderRadius: [
                                            "40% 60% 70% 30% / 40% 50% 60% 70%",
                                            "60% 40% 30% 70% / 50% 60% 30% 40%",
                                            "50% 50% 50% 50% / 50% 50% 50% 50%",
                                            "40% 60% 70% 30% / 40% 50% 60% 70%"
                                        ],
                                        rotate: isListening ? [0, 90, 180, 0] : 0
                                    }}
                                    transition={{
                                        duration: isListening ? 8 : 20,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute inset-0 bg-linear-to-tr from-blue-600 via-indigo-400 to-cyan-300 shadow-[0_0_120px_rgba(59,130,246,0.4)] border border-white/40 backdrop-blur-3xl overflow-hidden"
                                >
                                    {/* Shimmer Effect */}
                                    <motion.div 
                                        animate={{ x: [-400, 800], y: [-400, 800] }}
                                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 bg-linear-to-br from-white/30 via-white/5 to-transparent w-[300%] h-[300%]"
                                    />
                                    
                                    {/* Core Energy Glow */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-1/2 h-1/2 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
                                    </div>
                                </motion.div>
                                
                                {/* Micro-particles / Waveform Overlay (Placeholder for future) */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="material-symbols-outlined text-[80px] text-white/30 drop-shadow-2xl">
                                        {isAiTalking ? 'volume_up' : isListening ? 'graphic_eq' : 'mic'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 📝 REAL-TIME TRANSCRIPT STREAM (HUD Style) */}
                        <div className={`space-y-6 w-full max-w-2xl flex flex-col justify-center transition-all duration-700 ${isAiTalking ? 'mt-[-40px] opacity-80 scale-90' : 'min-h-[140px]'}`}>
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-2"
                            >
                                <p className={`text-[10px] font-black uppercase tracking-[0.6em] transition-colors duration-500 ${isAiTalking ? 'text-indigo-400' : isListening ? 'text-blue-400' : 'text-slate-500'}`}>
                                    {isAiTalking ? 'Neural Processing' : isListening ? 'Neural Listening' : 'System Idle'}
                                </p>
                                
                                <div className="flex items-center justify-center">
                                    <AnimatePresence mode="wait">
                                        <motion.h2 
                                            key={finalTranscript || partialTranscript || 'idle'}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className={`text-[20px] md:text-[24px] font-black tracking-tight leading-tight transition-all duration-500 ${finalTranscript ? 'text-white' : 'text-white/40 italic'} ${isAiTalking ? 'max-w-[400px]' : 'max-w-none'}`}
                                        >
                                            {finalTranscript || partialTranscript || "Listening for command..."}
                                        </motion.h2>
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>

                        {/* 🎛️ PREMIUM HUD CONTROLS (Slimmer) */}
                        <motion.div 
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className={`flex items-center gap-6 bg-white/5 backdrop-blur-xl p-4 rounded-[40px] border border-white/10 shadow-2xl transition-all duration-700 ${isAiTalking ? 'scale-75 opacity-50 translate-y-10' : ''}`}
                        >
                            <button className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all group">
                                <span className="material-symbols-outlined text-[20px] group-hover:scale-110">mic_off</span>
                            </button>
                            
                            <button 
                                onClick={onClose}
                                className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:scale-110 active:scale-95 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="material-symbols-outlined text-[32px] relative z-10">call_end</span>
                            </button>
                            
                            <button className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all group">
                                <span className="material-symbols-outlined text-[20px] group-hover:scale-110">settings_voice</span>
                            </button>
                        </motion.div>
                        
                        <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em] mt-4">Arkle Autonomous Brain • Neural Voice Bridge v2.0</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
