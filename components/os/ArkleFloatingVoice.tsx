'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBizStore } from '@/lib/useBizStore';
import { ArkleVoiceIcon } from '../shared/ArkleVoiceIcon';
import { ArkleVoiceRecognizer, ArkleVolumeMeter } from '@/lib/ArkleVoiceBridge';

export default function ArkleFloatingVoice() {
    const isVoiceActive = useBizStore((state) => state.isVoiceActive);
    const setIsVoiceActive = useBizStore((state) => state.setIsVoiceActive);
    const isMuted = useBizStore((state) => state.isMuted);
    const setIsMuted = useBizStore((state) => state.setIsMuted);
    const isPaused = useBizStore((state) => state.isPaused);
    const setIsPaused = useBizStore((state) => state.setIsPaused);
    const setLastVoiceCommand = useBizStore((state) => state.setLastVoiceCommand);
    const setLiveTranscript = useBizStore((state) => state.setLiveTranscript);
    
    // Check if IDE is open to adjust position (assuming global state if possible, else we use a standard offset)
    const isIdeOpen = typeof window !== 'undefined' && document.body.classList.contains('arkle-panel-open');
    
    const [isHovered, setIsHovered] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [volume, setVolume] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [recognizer, setRecognizer] = useState<ArkleVoiceRecognizer | null>(null);
    const [volumeMeter, setVolumeMeter] = useState<ArkleVolumeMeter | null>(null);

    // Initialize Voice Engine
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const vr = new ArkleVoiceRecognizer(
            (partial) => {
                setTranscript(partial);
                setLiveTranscript(partial);
            },
            (final) => {
                setTranscript(final);
                setLastVoiceCommand(final);
                setLiveTranscript(final);
                
                // Intelligent Action Detection
                const isBuildingCommand = /build|create|setup|generate/i.test(final);
                setIsSpeaking(true);
                
                // Show building status if detected
                if (isBuildingCommand) {
                    setTranscript(`Initializing build for: ${final}...`);
                }
                
                setTimeout(() => setIsSpeaking(false), 3500);
            },
            (err) => console.error(err)
        );
        vr.init();
        setRecognizer(vr);

        const vm = new ArkleVolumeMeter();
        setVolumeMeter(vm);

        return () => {
            vr.stop();
            vm.destroy();
        };
    }, [setLastVoiceCommand]);

    // Handle Active State
    useEffect(() => {
        if (isVoiceActive && !isPaused && !isMuted) {
            recognizer?.start();
            // Start volume monitoring
            navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                volumeMeter?.init(stream, (v) => setVolume(v));
            }).catch(e => console.error("Mic access denied", e));
        } else {
            recognizer?.stop();
            setTranscript('');
            setVolume(0);
        }
    }, [isVoiceActive, isPaused, isMuted, recognizer, volumeMeter]);

    // Reset State on Close
    useEffect(() => {
        if (!isVoiceActive) {
            setTranscript('');
            setIsMuted(false);
            setIsPaused(false);
        }
    }, [isVoiceActive, setIsMuted, setIsPaused]);

    // Constraints for dragging
    const constraintsRef = useRef(null);

    return (
        <AnimatePresence>
            {isVoiceActive && (
                <div 
                    className="fixed inset-0 z-[1000] pointer-events-none select-none overflow-hidden" 
                    ref={constraintsRef}
                >
                    {/* The Neural Hub Capsule */}
                    <motion.div
                        drag
                        dragConstraints={constraintsRef}
                        dragElastic={0.1}
                        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        initial={{ opacity: 0, scale: 0.5, y: 100, x: '-50%' }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1, 
                            y: 0,
                            left: '50%',
                            x: isIdeOpen ? 250 : '-50%' 
                        }}
                        exit={{ opacity: 0, scale: 0.5, y: 100, x: '-50%' }}
                        className="absolute bottom-40 w-48 flex flex-col items-center pointer-events-auto"
                    >
                            {/* THE NEURAL NODE (Liquid Orb Button) */}
                            <div className="relative w-24 h-24">
                                {/* Persistent Close Button */}
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onClick={(e) => { e.stopPropagation(); setIsVoiceActive(false); }}
                                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-900/90 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-red-500 transition-all z-[110] pointer-events-auto shadow-xl"
                                    title="Close Arkle Voice"
                                >
                                    <span className="material-symbols-rounded text-[14px]">close</span>
                                </motion.button>

                                <div
                                    className="relative pointer-events-auto"
                                >
                                    <ArkleVoiceIcon 
                                        size="lg" 
                                        isListening={isVoiceActive && !isPaused && !isMuted}
                                        isThinking={isSpeaking}
                                        volume={volume}
                                    />
                                </div>
                            </div>

                            {/* Live Transcript Bubble */}
                            <AnimatePresence>
                                {transcript && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: -150 }}
                                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                        className="absolute left-1/2 -translate-x-1/2 w-72 p-4 bg-slate-900/40 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl z-[150] text-center"
                                    >
                                        <p className="text-white text-[13px] font-medium leading-relaxed italic">
                                            "{transcript}"
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Quick Command Sticker Popup */}
                            <AnimatePresence>
                                {isHovered && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                        animate={{ opacity: 1, y: -105, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                        className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-[0_40px_80px_rgba(0,0,0,0.5)] z-[200]"
                                    >
                                        {/* Mic Toggle Button */}
                                        <motion.button 
                                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isMuted ? 'text-orange-400 bg-orange-400/10' : 'text-white'}`}
                                            title={isMuted ? "Unmute Mic" : "Mute Mic"}
                                        >
                                            <span className="material-symbols-rounded text-[24px]">{isMuted ? 'mic_off' : 'mic'}</span>
                                        </motion.button>

                                        {/* Cancel Button */}
                                        <motion.button 
                                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(239,68,68,0.2)' }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => { e.stopPropagation(); setIsVoiceActive(false); }}
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-red-400 border border-red-400/20"
                                            title="Cancel Voice Mode"
                                        >
                                            <span className="material-symbols-rounded text-[24px]">close</span>
                                        </motion.button>

                                        {/* Pause Button */}
                                        <motion.button 
                                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isPaused ? 'text-blue-400 bg-blue-400/10' : 'text-white'}`}
                                            title={isPaused ? "Resume Arkle" : "Pause Arkle"}
                                        >
                                            <span className="material-symbols-rounded text-[24px]">{isPaused ? 'play_arrow' : 'pause'}</span>
                                        </motion.button>

                                        {/* Tiny Tip Arrow */}
                                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900/95 border-r border-b border-white/20 rotate-45"></div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Voice Mode Status Label */}
                            <motion.div 
                                className="mt-6 px-8 py-3.5 bg-white/90 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-full border border-white/50 flex items-center justify-center pointer-events-none gap-3"
                            >
                                <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-purple-500 animate-pulse' : 'bg-green-500 animate-ping'}`}></div>
                                <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.25em] whitespace-nowrap">
                                    {isSpeaking ? 'Arkle is Thinking...' : isPaused ? 'Arkle Paused' : 'Arkle is Listening'}
                                </span>
                            </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
