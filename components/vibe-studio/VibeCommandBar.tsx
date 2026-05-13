"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useBizStore } from '@/lib/useBizStore';

export default function VibeCommandBar() {
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const { addTask, setIsVoiceActive, isVoiceActive, liveTranscript } = useBizStore();

    const handleCommand = async () => {
        if (!inputValue.trim()) return;
        setIsThinking(true);
        
        try {
            const res = await fetch('/api/vibe', {
                method: 'POST',
                body: JSON.stringify({ command: inputValue, context: { currentDashboard: 'neural' } })
            });
            const data = await res.json();
            
            if (data.directives) {
                data.directives.forEach((d: any) => {
                    if (d.type === 'CREATE_TASK') {
                        addTask(d.payload);
                    }
                });
            }

            setInputValue('');
        } catch (e) {
            console.error(e);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-[100] pointer-events-none">
            <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="pointer-events-auto bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl p-2 flex items-center gap-3 relative overflow-hidden"
            >
                {/* Background Animation for "Vibe" */}
                {isThinking && (
                    <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent z-0"
                    />
                )}

                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0 animate-pulse">
                    <span className="material-symbols-outlined text-indigo-400 text-lg">psychology</span>
                </div>

                <input 
                    type="text" 
                    placeholder="Command Arkle: 'Create a lead board' or 'Draft a CRM'..." 
                    className="flex-1 bg-transparent border-none outline-none text-xs font-bold text-slate-700 placeholder:text-slate-400 z-10"
                    value={isVoiceActive && liveTranscript ? liveTranscript : inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
                />

                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsVoiceActive(true)}
                        className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-all"
                    >
                        <span className="material-symbols-outlined text-slate-400 text-lg">mic</span>
                    </button>
                    <button 
                        onClick={handleCommand}
                        disabled={isThinking}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isThinking ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/20'}`}
                    >
                        {isThinking ? 'Processing...' : 'Execute'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
