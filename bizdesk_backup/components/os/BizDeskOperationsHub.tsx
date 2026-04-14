"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OperationalTask {
    id: string;
    task: string;
    indianId: string; // GST/PAN/MSME
    status: 'Working' | 'Done' | 'Overdue' | 'Review' | 'Draft';
    owner: string;
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    deadline: string;
    arklePrediction: string;
    groupId: string;
}

const GROUPS = [
    { id: 'legal', name: 'Legal & Indian Compliance', color: '#579bfc' },
    { id: 'ops', name: 'Operational Excellence', color: '#00c875' },
    { id: 'brand', name: 'Brand & Market Entry', color: '#ff642e' },
];

import { useBizStore } from '@/lib/useBizStore';

export default function BizDeskOperationsHub() {
    const { tasks } = useBizStore();

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Done': return 'bg-[#00c875] text-white';
            case 'Working': return 'bg-[#fdab3d] text-white';
            case 'Overdue': return 'bg-[#e2445c] text-white';
            case 'Review': return 'bg-[#579bfc] text-white';
            default: return 'bg-slate-300 text-slate-700';
        }
    };

    const renderGroup = (group: typeof GROUPS[0]) => {
        const groupTasks = tasks.filter(t => t.groupId === group.id);
        
        return (
            <div key={group.id} className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-3 px-6 py-3 bg-white border-b border-slate-100 sticky top-0 z-10">
                    <div style={{ backgroundColor: group.color }} className="w-1 h-6 rounded-full" />
                    <h3 style={{ color: group.color }} className="text-sm font-black uppercase tracking-tight italic">{group.name}</h3>
                    <span className="bg-slate-50 text-slate-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-slate-100">{groupTasks.length} ITEMS</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
                        <thead>
                            <tr className="bg-slate-50/30 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="px-6 py-3 w-[25%]">Task Description</th>
                                <th className="px-4 py-3 w-[15%]">Indian Entity ID</th>
                                <th className="px-4 py-3 w-[10%] text-center">Stakeholder</th>
                                <th className="px-4 py-3 w-[12%] text-center">Status</th>
                                <th className="px-4 py-3 w-[10%] text-center">Priority</th>
                                <th className="px-4 py-3 w-[12%] text-center">Timeline</th>
                                <th className="px-6 py-3 w-[16%]">Arkle Insight</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {groupTasks.map((task) => (
                                <motion.tr 
                                    key={task.id} 
                                    whileHover={{ x: 4, backgroundColor: 'rgba(248, 250, 252, 1)' }}
                                    className="group cursor-pointer border-l-4 border-transparent hover:border-indigo-500"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-slate-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity">drag_indicator</span>
                                            <span className="text-[13px] font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{task.task}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{task.indianId}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[9px] font-black text-slate-700 border border-white shadow-sm ring-1 ring-slate-100 mx-auto group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            {task.owner.charAt(0)}
                                        </div>
                                    </td>
                                    <td className="px-2 py-4 text-center">
                                        <div className={`px-4 py-2 rounded-sm text-[9px] font-black uppercase tracking-tight shadow-sm inline-block min-w-[90px] ${getStatusStyle(task.status)}`}>
                                            {task.status}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <div className={`text-[9px] font-black uppercase tracking-widest ${task.priority === 'Critical' ? 'text-red-600 animate-pulse' : 'text-slate-400'}`}>
                                            {task.priority}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-[14px]">event</span>
                                            {task.deadline}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 relative">
                                        <div className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 h-1.5 bg-indigo-500 rounded-full mt-1 shrink-0 animate-pulse" />
                                            <p className="text-[10px] font-black text-indigo-700/80 italic leading-tight capitalize">"{task.arklePrediction}"</p>
                                        </div>
                                        {/* Row Hover Action */}
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-blue-600 active:scale-95">Action</button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full bg-white rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden font-sans">
            {/* Monday-Style Sub Header Selection */}
            <div className="h-16 border-b border-slate-50 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <div className="flex bg-slate-50 p-1 rounded-xl gap-1">
                        <button className="bg-white text-indigo-600 shadow-sm px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest">Main Table</button>
                        <button className="text-slate-400 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:text-slate-900 transition-colors">Timeline View</button>
                        <button className="text-slate-400 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:text-slate-900 transition-colors">AI Forecast</button>
                    </div>
                    <div className="h-6 w-[1.5px] bg-slate-200" />
                    <div className="flex items-center gap-2 text-slate-400 hover:text-slate-900 cursor-pointer group">
                        <span className="material-symbols-outlined text-sm transition-transform group-hover:scale-110">search</span>
                        <p className="text-[10px] font-black uppercase tracking-widest">Search Ops</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                          <div key={i} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-500 ring-1 ring-slate-100">B</div>
                      ))}
                      <div className="w-7 h-7 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-[10px] font-black text-white ring-1 ring-slate-100">+</div>
                  </div>
                  <button className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95">Trigger Arkle</button>
                </div>
            </div>

            {/* The Unified Grouped Board */}
            <div className="p-2 bg-[#f8faff] min-h-[500px]">
                {GROUPS.map(renderGroup)}
            </div>

            {/* Footer Summary */}
            <div className="p-4 bg-white border-t border-slate-50 flex items-center justify-between">
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm bg-[#00c875]" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Done: 25%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm bg-[#fdab3d]" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">In Motion: 50%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm bg-[#e2445c]" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Blocked: 25%</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black text-slate-300 uppercase italic">Integrity Sync: 100% Secure</span>
                    <span className="material-symbols-outlined text-emerald-500 text-sm">verified_user</span>
                </div>
            </div>
        </div>
    );
}
