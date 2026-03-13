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
        <div className="w-full bg-white rounded-[2.5rem] border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden font-[DM_Sans,sans-serif]">
            {/* Header */}
            <div className="bg-slate-900 p-8 text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Arkle Advisor · Professional Board</span>
                        </div>
                        <h2 className="text-3xl font-black italic tracking-tighter">DAWN-1 STRATEGY CENTER</h2>
                        <p className="text-slate-400 text-sm mt-1 uppercase font-bold tracking-widest">365-Day Tracking Active</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-center min-w-[120px]">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Health Score</p>
                            <p className="text-2xl font-black text-amber-400">72<span className="text-sm opacity-50">/100</span></p>
                        </div>
                        <div className="bg-blue-600 px-5 py-3 rounded-2xl shadow-lg shadow-blue-900/40 text-center min-w-[120px] cursor-pointer hover:scale-105 transition-transform">
                            <p className="text-[10px] font-black text-blue-100 uppercase mb-1">Next Milestone</p>
                            <p className="text-sm font-black text-white">INC-CERT</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Progress Indicators */}
                <div className="lg:col-span-1 space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Domain Visibility</h4>
                    {stats.map((stat, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-slate-700 uppercase tracking-wide">{stat.label}</span>
                                <span className="text-xs font-black text-slate-900">{stat.value}</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                    className={`h-full bg-gradient-to-r ${stat.color}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: stat.value }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                />
                            </div>
                        </div>
                    ))}
                    
                    <div className="mt-8 p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Advisor Insight</p>
                        <p className="text-xs font-bold text-slate-700 italic leading-relaxed">
                            "Focus on Phase 1: CS Domain. Compliance bottlenecks identified in name reservation. Resolving now."
                        </p>
                    </div>
                </div>

                {/* Workflow Table */}
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Action Pipelines</h4>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[9px] font-black uppercase">CS</span>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase">Tax</span>
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[9px] font-black uppercase">Legal</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm transition-all group">
                                <div className={`w-2 h-12 rounded-full ${task.priority === 'High' ? 'bg-rose-500' : task.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-500">{task.category}</span>
                                        <h5 className="text-sm font-black text-slate-900">{task.title}</h5>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">schedule</span> {task.days}d</span>
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">info</span> {task.status}</span>
                                    </div>
                                </div>
                                <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Footer Prompt */}
            <div className="bg-slate-50 p-6 flex items-center justify-between border-t border-slate-100">
                <p className="text-xs font-bold text-slate-500">DAWN-1 Engine Syncing with Ministry of Corporate Affairs...</p>
                <div className="flex gap-4">
                    <span className="material-symbols-outlined text-slate-300">verified_user</span>
                    <span className="material-symbols-outlined text-slate-300">security</span>
                    <span className="material-symbols-outlined text-slate-300">cloud_done</span>
                </div>
            </div>
        </div>
    );
}
