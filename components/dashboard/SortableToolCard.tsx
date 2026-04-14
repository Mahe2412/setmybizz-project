"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ToolCardProps {
    id: string;
    label: string;
    icon: string;
    color: string;
    isAgentActive?: boolean;
    onContextMenu: (e: React.MouseEvent, label: string) => void;
    onClick: () => void;
}

const colorVariants: Record<string, { bg: string, text: string, hoverBg: string, hoverText: string, from: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', hoverBg: 'group-hover:bg-blue-600', hoverText: 'group-hover:text-white', from: 'from-blue-50' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', hoverBg: 'group-hover:bg-indigo-600', hoverText: 'group-hover:text-white', from: 'from-indigo-50' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', hoverBg: 'group-hover:bg-purple-600', hoverText: 'group-hover:text-white', from: 'from-purple-50' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-600', hoverBg: 'group-hover:bg-pink-600', hoverText: 'group-hover:text-white', from: 'from-pink-50' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', hoverBg: 'group-hover:bg-rose-600', hoverText: 'group-hover:text-white', from: 'from-rose-50' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', hoverBg: 'group-hover:bg-orange-600', hoverText: 'group-hover:text-white', from: 'from-orange-50' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', hoverBg: 'group-hover:bg-amber-600', hoverText: 'group-hover:text-white', from: 'from-amber-50' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', hoverBg: 'group-hover:bg-yellow-600', hoverText: 'group-hover:text-white', from: 'from-yellow-50' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', hoverBg: 'group-hover:bg-emerald-600', hoverText: 'group-hover:text-white', from: 'from-emerald-50' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-600', hoverBg: 'group-hover:bg-teal-600', hoverText: 'group-hover:text-white', from: 'from-teal-50' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', hoverBg: 'group-hover:bg-cyan-600', hoverText: 'group-hover:text-white', from: 'from-cyan-50' },
    green: { bg: 'bg-green-50', text: 'text-green-600', hoverBg: 'group-hover:bg-green-600', hoverText: 'group-hover:text-white', from: 'from-green-50' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', hoverBg: 'group-hover:bg-violet-600', hoverText: 'group-hover:text-white', from: 'from-violet-50' },
    fuchsia: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-600', hoverBg: 'group-hover:bg-fuchsia-600', hoverText: 'group-hover:text-white', from: 'from-fuchsia-50' },
    red: { bg: 'bg-red-50', text: 'text-red-600', hoverBg: 'group-hover:bg-red-600', hoverText: 'group-hover:text-white', from: 'from-red-50' },
};

export default React.memo(function SortableToolCard({ id, label, icon, color, isAgentActive, onContextMenu, onClick }: ToolCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 1 };
    const colors = colorVariants[color] || colorVariants['blue'];

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onContextMenu={(e) => onContextMenu(e, label)}
            onClick={onClick}
            className={`bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-3 hover:shadow-xl hover:-translate-y-1 transition-all group h-full relative overflow-hidden select-none cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50 scale-105 shadow-2xl ring-2 ring-indigo-500 z-50' : ''} ${isAgentActive ? 'ring-2 ring-indigo-500 shadow-indigo-200 shadow-lg' : ''}`}
        >
            {isAgentActive && (
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 animate-pulse z-20"></div>
            )}
            <div className={`p-2.5 ${isAgentActive ? 'bg-slate-900 text-white animate-pulse' : `${colors.bg} ${colors.text}`} rounded-2xl transition-transform group-hover:scale-105 shadow-sm relative z-10`}>
                <span className="material-icons text-lg">{icon}</span>
                {isAgentActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-900 animate-ping"></span>
                )}
            </div>
            <span className={`font-black text-[8px] uppercase tracking-widest relative z-10 transition-colors ${isAgentActive ? 'text-indigo-600' : 'text-slate-700 group-hover:text-slate-900'}`}>{label}</span>
            <span className="absolute top-2 right-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity material-icons text-xs">drag_indicator</span>
            
            {isAgentActive && (
                <div className="absolute bottom-1 right-2 flex items-center gap-1">
                    <span className="text-[6px] font-black text-indigo-400 uppercase tracking-tighter">AI AGENT ACTIVE</span>
                </div>
            )}
        </div>
    );
});
