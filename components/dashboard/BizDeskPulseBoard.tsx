"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBizStore } from '@/lib/useBizStore';
import { StatusBadge } from '@/components/os/shared';

interface Group {
    id: string;
    name: string;
    color: string;
}

const GROUPS: Group[] = [
    { id: 'g1', name: 'Legal & Incorporation', color: 'indigo-500' },
    { id: 'g2', name: 'Brand & Creative', color: 'pink-500' },
    { id: 'g3', name: 'Strategy & Ops', color: 'emerald-500' },
];

export default function BizDeskPulseBoard() {
    const { tasks, updateTask } = useBizStore();
    const [search, setSearch] = useState('');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Done': return 'bg-[#00c875]'; // Monday Green
            case 'Working': return 'bg-[#fdab3d]'; // Monday Amber
            case 'Stuck': return 'bg-[#e2445c]'; // Monday Red
            case 'Overdue': return 'bg-red-600';
            case 'Review': return 'bg-[#579bfc]'; // Monday Blue
            default: return 'bg-slate-400';
        }
    };

    const renderGroup = (group: Group) => {
        // Find tasks for this group. If no group assigned, default to Legal for now or match by category logic
        const groupItems = tasks.filter(t => {
            const matchesSearch = t.task.toLowerCase().includes(search.toLowerCase());
            // Crude mapping for Phase 1: GST/Legal tasks to g1, Branding to g2
            if (group.id === 'g1') return matchesSearch && (t.task.includes('GST') || t.task.includes('Filing'));
            if (group.id === 'g2') return matchesSearch && (t.task.includes('Logo') || t.task.includes('Identity'));
            return matchesSearch && !t.task.includes('GST') && !t.task.includes('Logo');
        });
        
        if (groupItems.length === 0) return null;

        return (
            <div key={group.id} className="mb-8 last:mb-0">
                <div className="flex items-center gap-3 px-6 py-2">
                   <div className={`w-1 h-6 bg-${group.color} rounded-full`}></div>
                   <h3 className={`text-sm font-black text-${group.color} uppercase tracking-tight`}>{group.name}</h3>
                   <span className="text-[10px] font-bold text-slate-400">({groupItems.length} items)</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead>
                            <tr className="bg-slate-50/50 border-y border-slate-100">
                                <th className="px-6 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest w-[40%]">Pulse Item</th>
                                <th className="px-2 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center w-[15%]">Owner</th>
                                <th className="px-2 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center w-[15%]">Status</th>
                                <th className="px-2 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center w-[15%]">Deadline</th>
                                <th className="px-6 py-2 text-[9px] font-black text-indigo-500 uppercase tracking-widest w-[15%]">Arkle Insight</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {groupItems.map((item) => (
                                <motion.tr 
                                    key={item.id}
                                    layout
                                    className="hover:bg-slate-50 transition-all group cursor-pointer border-l-4 border-transparent hover:border-indigo-500"
                                >
                                    <td className="px-6 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-slate-300 text-sm opacity-0 group-hover:opacity-100">drag_indicator</span>
                                            <div>
                                                <span className="text-xs font-semibold text-slate-700 block">{item.task}</span>
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{item.indianId}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-2 py-2.5 text-center">
                                        <div className="w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center text-[8px] font-black text-white mx-auto border-2 border-white shadow-sm ring-1 ring-slate-100 uppercase">
                                            {item.task.charAt(0)}
                                        </div>
                                    </td>
                                    <td className="px-1 py-1 text-center">
                                        <div 
                                            onClick={() => updateTask(item.id, { status: item.status === 'Done' ? 'Working' : 'Done' })}
                                            className={`px-2 py-1.5 rounded-sm text-[8px] font-black text-white uppercase tracking-tight shadow-sm w-full h-full min-h-[34px] flex items-center justify-center transition-all hover:scale-[1.02] cursor-pointer ${getStatusColor(item.status)}`}
                                        >
                                            {item.status}
                                        </div>
                                    </td>
                                    <td className="px-1 py-1 text-center">
                                         <div className="text-[10px] font-black text-slate-500 uppercase">
                                            {item.deadline}
                                        </div>
                                    </td>
                                    <td className="px-6 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse flex-shrink-0"></span>
                                            <p className="text-[9px] font-bold text-indigo-600 truncate italic">"{item.arklePrediction}"</p>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            <tr className="hover:bg-slate-50/50">
                                <td colSpan={5} className="px-8 py-2 text-[10px] text-slate-400 font-bold border-t border-slate-100 italic">
                                    <button className="hover:text-indigo-600 uppercase tracking-widest font-black">+ Initiate New Protocol</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden font-sans">
            {/* Monday-style Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-2xl relative">
                        <div className="absolute inset-0 bg-indigo-500/20 animate-ping rounded-xl blur-sm" />
                        <span className="material-symbols-outlined text-indigo-400 text-lg relative z-10">hub</span>
                    </div>
                    <div>
                        <h2 className="text-base font-black tracking-tighter text-slate-900 uppercase leading-none italic">Bharat <span className="text-indigo-600 not-italic">Pulse Board</span></h2>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1 block">Autonomous Operational Sync</span>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-200 mx-4"></div>
                    <div className="flex bg-slate-100/50 rounded-xl border border-slate-200 px-4 py-2.5 items-center gap-3 group focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                        <span className="material-symbols-outlined text-sm text-slate-400">search</span>
                        <input 
                            type="text" 
                            placeholder="Explore operations..." 
                            className="bg-transparent border-none outline-none text-[10px] font-black w-48 text-slate-700 placeholder-slate-400 uppercase tracking-widest"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2 mr-4">
                        {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />)}
                    </div>
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-[1.2rem] text-[9px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
                        New Operational Node
                    </button>
                </div>
            </div>

            {/* Grouped Table View */}
            <div className="p-4 bg-white/40">
                {GROUPS.map(renderGroup)}
            </div>

            {/* Board Footer summary */}
            <div className="p-4 bg-slate-900 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Neural Link: Online</span>
                    </div>
                    <div className="flex items-center gap-2">
                         <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Entities Tracked: {tasks.length}</span>
                    </div>
                </div>
                <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
                    Arkle OS v1.2 • Distributed via BizDesk Global Sync
                </div>
            </div>
        </div>
    );
}
