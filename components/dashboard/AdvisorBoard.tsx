'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AdvisorBoard() {
    const tasks = [
        { id: 1, title: 'Company Name Reservation', status: 'Pending', category: 'CS', priority: 'High', days: 2 },
        { id: 2, title: 'DSC Acquisition', status: 'In Progress', category: 'CS', priority: 'Medium', days: 3 },
        { id: 3, title: 'MOA/AOA Drafting', status: 'Waiting', category: 'Legal', priority: 'High', days: 5 },
        { id: 4, title: 'GST Registration Prep', status: 'Pending', category: 'TAX', priority: 'Low', days: 7 },
    ];

    const stats = [
        { label: 'Legal Compliance', value: '45%', color: 'from-blue-500 to-indigo-600' },
        { label: 'Financial Readiness', value: '20%', color: 'from-emerald-500 to-teal-600' },
        { label: 'Brand Protection', value: '10%', color: 'from-purple-500 to-pink-600' },
    ];

    return (
        <div className="w-full bg-white rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] md:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden font-[DM_Sans,sans-serif]">
            {/* Header */}
            <div className="bg-slate-900 p-6 md:p-8 text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 md:gap-3 mb-2">
                            <span className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400">Arkle Advisor · Professional Board</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter">DAWN-1 STRATEGY CENTER</h2>
                        <p className="text-slate-400 text-[10px] md:text-sm mt-1 uppercase font-bold tracking-widest">365-Day Tracking Active</p>
                    </div>
                    <div className="flex flex-row w-full md:w-auto gap-3 md:gap-4 lg:gap-6 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                        <div className="bg-white/10 backdrop-blur-md px-4 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl border border-white/10 text-center min-w-[100px] md:min-w-[120px] shrink-0">
                            <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase mb-0.5 md:mb-1">Health Score</p>
                            <p className="text-xl md:text-2xl font-black text-amber-400">72<span className="text-xs md:text-sm opacity-50">/100</span></p>
                        </div>
                        <div className="bg-blue-600 px-4 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-lg shadow-blue-900/40 text-center min-w-[100px] md:min-w-[120px] cursor-pointer hover:scale-105 transition-transform shrink-0">
                            <p className="text-[8px] md:text-[10px] font-black text-blue-100 uppercase mb-0.5 md:mb-1">Next Milestone</p>
                            <p className="text-xs md:text-sm font-black text-white">INC-CERT</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Progress Indicators */}
                <div className="lg:col-span-1 space-y-4 md:space-y-6">
                    <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 md:mb-4">Domain Visibility</h4>
                    {stats.map((stat, i) => (
                        <div key={i} className="space-y-1.5 md:space-y-2">
                            <div className="flex justify-between items-center text-[10px] md:text-xs font-black text-slate-700 uppercase tracking-wide">
                                <span>{stat.label}</span>
                                <span className="text-slate-900">{stat.value}</span>
                            </div>
                            <div className="h-1.5 md:h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                    className={`h-full bg-gradient-to-r ${stat.color}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: stat.value }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                />
                            </div>
                        </div>
                    ))}
                    
                    <div className="mt-6 md:mt-8 p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase mb-1 md:mb-2">Advisor Insight</p>
                        <p className="text-[10px] md:text-xs font-bold text-slate-700 italic leading-relaxed">
                            "Focus on Phase 1: CS Domain. Compliance bottlenecks identified in name reservation. Resolving now."
                        </p>
                    </div>
                </div>

                {/* Workflow Table */}
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-4 md:mb-6">
                        <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Action Pipelines</h4>
                        <div className="flex gap-1.5">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[8px] font-black uppercase">CS</span>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[8px] font-black uppercase">Tax</span>
                        </div>
                    </div>

                    <div className="space-y-2 md:space-y-3">
                        {tasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm transition-all group">
                                <div className={`w-1.5 md:w-2 h-8 md:h-12 rounded-full ${task.priority === 'High' ? 'bg-rose-500' : task.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
                                        <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-50 text-slate-400 border border-slate-100 shrink-0">{task.category}</span>
                                        <h5 className="text-xs md:text-sm font-black text-slate-900 truncate">{task.title}</h5>
                                    </div>
                                    <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider md:tracking-widest">
                                        <span className="flex items-center gap-0.5 md:gap-1"><span className="material-symbols-outlined text-[10px] md:text-[12px]">schedule</span> {task.days}d</span>
                                        <span className="flex items-center gap-0.5 md:gap-1 truncate"><span className="material-symbols-outlined text-[10px] md:text-[12px]">info</span> {task.status}</span>
                                    </div>
                                </div>
                                <button className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0 active:scale-90">
                                    <span className="material-symbols-outlined text-base md:text-lg">chevron_right</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Footer Prompt */}
            <div className="bg-slate-50 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between border-t border-slate-100 gap-4">
                <p className="text-[9px] md:text-xs font-bold text-slate-500 text-center md:text-left">DAWN-1 Engine Syncing with Ministry of Corporate Affairs...</p>
                <div className="flex gap-4">
                    <span className="material-symbols-outlined text-slate-300 text-sm md:text-base">verified_user</span>
                    <span className="material-symbols-outlined text-slate-300 text-sm md:text-base">security</span>
                    <span className="material-symbols-outlined text-slate-300 text-sm md:text-base">cloud_done</span>
                </div>
            </div>
        </div>
    );
}
