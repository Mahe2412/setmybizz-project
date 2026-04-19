import React from 'react';
import { DIGITAL_EMPLOYEES } from './LaunchPadConstants';

interface LaunchPadAgentsProps {
    setSelectedAgentId: (id: string) => void;
    setAppState: (state: any) => void;
}

export const LaunchPadAgents: React.FC<LaunchPadAgentsProps> = ({
    setSelectedAgentId,
    setAppState
}) => {
    return (
        <div className="max-w-[1000px] w-full mt-12 mb-10 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center text-center mb-10">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-black uppercase tracking-[0.3em] mb-3 border border-indigo-100">Future of Work</span>
                <h2 className="text-[32px] font-black text-slate-900 uppercase tracking-tighter">Hire Your Digital Team</h2>
                <p className="text-[16px] text-slate-500 mt-2 max-w-2xl font-medium">Run an entire enterprise solo. Arkle's AI Agents act as your dedicated executive team.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {DIGITAL_EMPLOYEES.map((emp) => (
                    <div 
                        key={emp.id} 
                        onClick={() => { setSelectedAgentId(emp.id); setAppState('agent-workspace'); }} 
                        className="relative group bg-white border border-slate-100 hover:border-[#0073ea] rounded-[32px] p-6 hover:shadow-2xl transition-all flex flex-col items-start overflow-hidden text-left cursor-pointer"
                    >
                        <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-all blur-xl" style={{ backgroundColor: emp.clr }}></div>
                        
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm relative z-10" style={{ backgroundColor: `${emp.clr}15`, color: emp.clr }}>
                            <span className="material-symbols-outlined text-[24px]">{emp.icon}</span>
                        </div>
                        
                        <h3 className="text-[17px] font-black text-slate-900 uppercase tracking-tight mb-1 relative z-10">{emp.title}</h3>
                        <p className="text-[11px] text-[#00c875] font-black uppercase tracking-widest mb-4">{emp.role}</p>
                        <p className="text-[13px] text-slate-400 font-medium leading-relaxed flex-1 relative z-10">{emp.desc}</p>
                        
                        <div className="mt-6 w-full pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Available</span>
                            <span className="material-symbols-outlined text-slate-200 text-[18px] group-hover:translate-x-1 transition-transform group-hover:text-[#0073ea]">east</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-10 bg-[#1c1f3b] rounded-[40px] shadow-2xl flex flex-col md:flex-row items-center justify-between text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32"></div>
                <div className="relative z-10 mb-8 md:mb-0">
                    <h3 className="text-white text-[24px] font-black uppercase tracking-tighter mb-2">Need a Custom Workflow?</h3>
                    <p className="text-white/50 text-[15px] font-medium">Train a bespoke digital employee for your unique needs.</p>
                </div>
                <button className="px-8 py-4 bg-white text-[#1c1f3b] rounded-2xl text-[14px] font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2 shadow-xl">
                    <span className="material-symbols-outlined text-[20px]">draw</span>
                    Build Custom Agent
                </button>
            </div>
        </div>
    );
};
