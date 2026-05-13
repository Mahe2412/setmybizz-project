'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArkleStrategyModeProps {
    bizCtx: any;
    onUpdateCtx: (updates: any) => void;
    onCommand: (cmd: string) => void;
    liveTranscript?: string;
    isListening?: boolean;
}

export default function ArkleStrategyMode({ bizCtx, onUpdateCtx, onCommand, liveTranscript, isListening }: ArkleStrategyModeProps) {
    const [suggestions, setSuggestions] = useState<{ type: 'colors' | 'fonts' | 'layout'; items: any[] } | null>(null);
    const [activePrompt, setActivePrompt] = useState('');

    // Mock interactive suggestions based on keywords (for demo)
    useEffect(() => {
        const text = (liveTranscript || activePrompt).toLowerCase();
        if (text.includes('color') || text.includes('organic')) {
            setSuggestions({
                type: 'colors',
                items: [
                    { id: '1', name: 'Forest Mint', palette: ['#1A3C34', '#2D5A27', '#E8F5E9'] },
                    { id: '2', name: 'Earth Clay', palette: ['#4E342E', '#8D6E63', '#FFF8E1'] },
                    { id: '3', name: 'Organic Gold', palette: ['#F9A825', '#FFD54F', '#FFFDE7'] },
                    { id: '4', name: 'Ocean Mist', palette: ['#006064', '#4DD0E1', '#E0F7FA'] },
                ]
            });
        } else if (activePrompt.toLowerCase().includes('font') || activePrompt.toLowerCase().includes('style')) {
            setSuggestions({
                type: 'fonts',
                items: [
                    { id: 'f1', name: 'Modern Sans', family: "'Outfit', sans-serif" },
                    { id: 'f2', name: 'Classic Serif', family: "'Playfair Display', serif" },
                    { id: 'f3', name: 'Geometric', family: "'Lexend', sans-serif" },
                ]
            });
        } else {
            setSuggestions(null);
        }
    }, [activePrompt]);

    return (
        <div className="h-full flex flex-col p-8 bg-slate-950/20 backdrop-blur-3xl rounded-[40px] border border-white/10 overflow-hidden relative">
            {/* 🌌 Atmospheric Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full" />
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-[32px] font-black text-white tracking-tight uppercase leading-none">Strategy Mode</h2>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mt-2">Neural Co-Founder Active</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live Syncing</span>
                    </div>
                </div>
            </div>

            {/* Main Interactive Stage */}
            <div className="flex-1 relative z-10 flex flex-col gap-6 overflow-y-auto no-scrollbar">
                {/* Active Suggestion Box */}
                <AnimatePresence mode="wait">
                    {suggestions && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/5 border border-white/10 rounded-[32px] p-8 shadow-2xl"
                        >
                            <h3 className="text-[14px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-400">auto_awesome</span>
                                Arkle's Recommendations
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {suggestions.type === 'colors' && suggestions.items.map((item, idx) => (
                                    <button
                                        key={item.id}
                                        onClick={() => onCommand(`Apply color palette ${idx + 1}`)}
                                        className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-white/10 transition-all text-left"
                                    >
                                        <div className="flex gap-1 mb-4 h-12 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                                            {item.palette.map((color: string) => (
                                                <div key={color} style={{ background: color }} className="flex-1" />
                                            ))}
                                        </div>
                                        <p className="text-[12px] font-bold text-white group-hover:text-blue-400">{item.name}</p>
                                        <p className="text-[9px] font-black text-white/30 uppercase mt-1">Option {idx + 1}</p>
                                    </button>
                                ))}

                                {suggestions.type === 'fonts' && suggestions.items.map((item, idx) => (
                                    <button
                                        key={item.id}
                                        onClick={() => onCommand(`Use ${item.name} font`)}
                                        className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-white/10 transition-all text-center"
                                    >
                                        <div className="h-16 flex items-center justify-center mb-4 text-white text-[20px]" style={{ fontFamily: item.family }}>
                                            Aa Bb Cc
                                        </div>
                                        <p className="text-[12px] font-bold text-white">{item.name}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-center gap-4">
                                <button className="px-6 py-3 rounded-xl bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all border border-white/5">
                                    Undo Last Change
                                </button>
                                <button className="px-6 py-3 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:scale-105 transition-all shadow-lg shadow-blue-600/20">
                                    Confirm Selection
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Arkle Chat Context */}
                <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
                            <span className="material-symbols-outlined text-[20px] animate-pulse">psychology</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-widest mb-1">Arkle Analysis</h4>
                            <p className="text-white/80 text-[14px] leading-relaxed">
                                I've analyzed your intent for an <strong>Organic Store</strong>. For this industry, I suggest Earthy tones and Rounded fonts to build trust and feel natural. 
                                <br/><br/>
                                <em>"Hi Arkle, 3rd color add cheyu"</em> - You can say this to apply the Organic Gold palette.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Input Area (Marvel Style) */}
            <div className="relative z-10 pt-6">
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-[30px] p-2 pl-6 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <input 
                        value={activePrompt}
                        onChange={e => setActivePrompt(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && activePrompt.trim()) {
                                onCommand(activePrompt.trim());
                                setActivePrompt('');
                            }
                        }}
                        placeholder="Lead me, Arkle. Talk to your business..."
                        className="flex-1 bg-transparent text-white text-[15px] font-medium outline-none placeholder-white/20"
                    />
                    <div className="flex items-center gap-1 pr-2">
                        <button 
                            onClick={() => setActivePrompt("Enable live neural voice dictation")} 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
                            title="Voice Command"
                        >
                            <span className="material-symbols-outlined">mic</span>
                        </button>
                        <button 
                            onClick={() => {
                                if (activePrompt.trim()) {
                                    onCommand(activePrompt.trim());
                                    setActivePrompt('');
                                }
                            }}
                            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
                            title="Submit"
                        >
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </div>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                    {['Growth Plan', 'Brand Voice', 'Competitors'].map(chip => (
                        <button 
                            key={chip} 
                            onClick={() => {
                                onCommand(`Generate ${chip} strategy`);
                            }}
                            className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] hover:text-blue-400 transition-colors"
                        >
                            {chip}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
