'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TeaserFlowProps {
    onComplete: () => void;
    businessName: string;
}

export default function TeaserFlow({ onComplete, businessName }: TeaserFlowProps) {
    const [phase, setPhase] = useState(0);
    const [progress, setProgress] = useState(0);

    const phases = [
        {
            title: "NEURAL MAPPING",
            sub: "Scanning Industry Vectors...",
            icon: "psychology",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "FACTORY SYNC",
            sub: "Connecting Legal & Brand Engines...",
            icon: "settings_input_component",
            color: "text-indigo-500",
            bg: "bg-indigo-500/10"
        },
        {
            title: "OS IGNITION",
            sub: "Personalizing Your AI Workspace...",
            icon: "bolt",
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    if (phase < phases.length - 1) {
                        setPhase(p => p + 1);
                        return 0;
                    } else {
                        clearInterval(interval);
                        setTimeout(onComplete, 1000);
                        return 100;
                    }
                }
                return prev + 2;
            });
        }, 80);

        return () => clearInterval(interval);
    }, [phase, onComplete, phases.length]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 font-[DM_Sans,sans-serif] overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-lg px-6 text-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={phase}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8 md:mb-12"
                    >
                        <div className={`w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 md:mb-8 rounded-[1.5rem] md:rounded-3xl ${phases[phase].bg} flex items-center justify-center shadow-2xl`}>
                            <span className={`material-symbols-outlined text-4xl md:text-5xl font-black ${phases[phase].color}`}>
                                {phases[phase].icon}
                            </span>
                        </div>
                        
                        <div className="space-y-2 md:space-y-3 px-4">
                            <h2 className="text-[10px] md:text-sm font-black text-slate-500 uppercase tracking-[0.3em] md:tracking-[0.4em]">
                                {phases[phase].title}
                            </h2>
                            <h3 className="text-xl md:text-2xl font-black text-white italic tracking-tight leading-tight">
                                {businessName.toUpperCase()}: <span className="text-slate-400 not-italic font-bold">{phases[phase].sub}</span>
                            </h3>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Progress Bar Area */}
                <div className="space-y-4">
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "linear" }}
                        />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>SYSTEM STABLE</span>
                        <span>{progress}% SYNCHRONIZED</span>
                        <span>v3.5 ACTIVE</span>
                    </div>
                </div>

                {/* Status Ticker */}
                <div className="mt-20 h-8 overflow-hidden relative">
                    <motion.p 
                        className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter"
                        animate={{ y: [0, -20, -40, -60] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                        [LOG] SECURING DOMAIN NAMES...<br/>
                        [LOG] GENERATING BRAND VECTORS...<br/>
                        [LOG] PARSING GST REGULATIONS...<br/>
                        [LOG] INITIALIZING ARKLE CORE...
                    </motion.p>
                </div>
            </div>
        </div>
    );
}
