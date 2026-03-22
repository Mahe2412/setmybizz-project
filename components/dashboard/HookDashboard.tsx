'use client';

import React from 'react';
import AdvisorBoard from './AdvisorBoard';
import { motion } from 'framer-motion';

interface HookDashboardProps {
    onAction: () => void;
}

export default function HookDashboard({ onAction }: HookDashboardProps) {
    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-12 font-[DM_Sans,sans-serif]">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="w-full">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-4">
                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                            Guest Workspace Active
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter text-slate-900 leading-none">
                            YOUR BUSINESS <span className="text-blue-600">INCUBATOR.</span>
                        </h1>
                        <p className="mt-4 text-slate-500 font-bold max-w-xl text-xs md:text-sm leading-relaxed uppercase tracking-wide">
                            We've initialized your professional board and AI advisors. Register now to sync this data with a legal entity.
                        </p>
                    </div>
                    
                    <button 
                        onClick={onAction}
                        className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-slate-900/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        Claim Your Business Now
                        <span className="material-symbols-outlined">rocket_launch</span>
                    </button>
                </header>

                <div className="grid grid-cols-1 gap-8 md:gap-12">
                    {/* Primary Hook: The Board */}
                    <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                        <div className="min-w-[320px]">
                            <AdvisorBoard />
                        </div>
                    </div>

                    {/* Secondary Hooks Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        {/* Hook 1: AI Co-Founder Pre-auth */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-20 translate-x-20 group-hover:bg-white/20 transition-all duration-1000"></div>
                            <h3 className="text-xl md:text-2xl font-black mb-4 italic tracking-tight">Meet Arkle: Your AI Co-Founder</h3>
                            <p className="text-indigo-100 text-xs md:text-sm font-medium leading-relaxed mb-8 opacity-90">
                                Arkle has already started drafting your sales strategy and compliance checklist. Login to see the full reports.
                            </p>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 mb-8 font-mono text-[10px] md:text-xs text-indigo-200">
                                $ arkle --analyze {new Date().getFullYear()} --market-entry<br/>
                                <span className="text-green-400">&gt; Industry Vectors Analyzed</span><br/>
                                <span className="text-green-400">&gt; Competitor Gaps Identified</span><br/>
                                <span className="text-amber-400">&gt; Regulatory Path: PVT LTD Recommended</span>
                            </div>
                            <button 
                                onClick={onAction}
                                className="w-full md:w-auto bg-white text-indigo-600 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-transform"
                            >
                                Chat with Arkle →
                            </button>
                        </div>

                        {/* Hook 2: LaunchPad Preview */}
                        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] md:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] group">
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 italic tracking-tight">The AI LaunchPad</h3>
                            <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed mb-8">
                                Instant deployment of your brand assets. We've queued 4 logo concepts and a landing page skeleton for you.
                            </p>
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="aspect-square bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-6 md:p-8 group-hover:scale-95 transition-transform">
                                    <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center">
                                        <span className="material-symbols-outlined text-slate-200 text-3xl md:text-4xl font-black">brush</span>
                                    </div>
                                </div>
                                <div className="aspect-square bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-6 md:p-8 group-hover:scale-95 transition-transform" style={{ transitionDelay: '0.1s' }}>
                                    <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center">
                                        <span className="material-symbols-outlined text-slate-200 text-3xl md:text-4xl font-black">html</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={onAction}
                                className="w-full bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-colors"
                            >
                                View Brand Assets →
                            </button>
                        </div>
                    </div>
                </div>

                <footer className="mt-16 md:mt-20 text-center text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] pb-12">
                    SETMYBIZZ FACTORY · SECURE NODE : BRAVO-9
                </footer>
            </div>
        </div>
    );
}
