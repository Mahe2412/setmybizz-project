import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface DashboardModuleProps {
    title: string;
    description: string;
    icon: LucideIcon;
    status: 'active' | 'coming_soon' | 'completed';
    color: string;
    onAction?: () => void;
}

const DashboardModule: React.FC<DashboardModuleProps> = ({ title, description, icon: Icon, status, color, onAction }) => {
    const isActive = status === 'active';
    const isCompleted = status === 'completed';

    return (
        <motion.div 
            whileHover={isActive ? { y: -5, scale: 1.02 } : {}}
            className={`relative group bg-white rounded-[2.5rem] border ${isActive ? 'border-blue-100 shadow-xl shadow-blue-500/5' : 'border-slate-100 opacity-80'} p-8 transition-all duration-500 overflow-hidden`}
        >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/5 rounded-full blur-3xl pointer-events-none`} />

            {!isActive && !isCompleted && (
                <div className="absolute top-6 right-6 px-3 py-1 bg-slate-100 rounded-full flex items-center gap-1.5 border border-slate-200">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Coming Soon</span>
                </div>
            )}

            {isCompleted && (
                <div className="absolute top-6 right-6 px-3 py-1 bg-emerald-50 rounded-full flex items-center gap-1.5 border border-emerald-100">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                </div>
            )}

            <div className={`w-14 h-14 rounded-2xl bg-${color}-50 flex items-center justify-center mb-8 shadow-inner`}>
                <Icon className={`w-7 h-7 text-${color}-600`} />
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight uppercase tracking-widest">{title}</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{description}</p>

            {isActive ? (
                <button 
                    onClick={onAction}
                    className={`flex items-center gap-2 text-xs font-black text-${color}-600 uppercase tracking-widest group-hover:gap-4 transition-all`}
                >
                    Initialize Mission <ArrowRight className="w-4 h-4" />
                </button>
            ) : (
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Module locked in Beta</div>
            )}
        </motion.div>
    );
};

export default DashboardModule;
