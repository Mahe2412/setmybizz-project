import React from 'react';
import { motion } from 'framer-motion';
import { SERVICES, SOLUTION_IDEAS, DIGITAL_EMPLOYEES } from './LaunchPadConstants';

interface LaunchPadHomeProps {
    firstName: string;
    startDiscussion: () => void;
    startSolutionsChat: () => void;
    setTopTab: (tab: any) => void;
    setSelectedAgentId: (id: string) => void;
    setAppState: (state: any) => void;
}

export const LaunchPadHome: React.FC<LaunchPadHomeProps> = ({
    firstName,
    startDiscussion,
    startSolutionsChat,
    setTopTab,
    setSelectedAgentId,
    setAppState
}) => {
    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section */}
            <div className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
                        <span className="material-symbols-outlined text-white text-[24px]">rocket_launch</span>
                    </div>
                    <span className="text-slate-400 text-[12px] font-black uppercase tracking-[0.4em]">Arkle Launchpad v4.0</span>
                </div>
                <h1 className="text-[48px] md:text-[64px] font-black text-slate-900 leading-[0.9] tracking-tighter uppercase mb-6">
                    Build Your Empire,<br/><span className="text-[#0073ea]">{firstName}</span>
                </h1>
                <p className="text-[18px] text-slate-500 max-w-2xl font-medium leading-relaxed">
                    Deploy AI-powered apps, websites, and digital employees in seconds. Arkle handles the strategy, design, and execution.
                </p>
            </div>

            {/* Core Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                <button 
                    onClick={startDiscussion}
                    className="group relative bg-[#1c1f3b] p-10 rounded-[40px] text-left overflow-hidden shadow-2xl hover:scale-[1.01] transition-all"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[80px] -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                            <span className="material-symbols-outlined text-white text-[28px]">psychology</span>
                        </div>
                        <h2 className="text-[32px] font-black text-white uppercase tracking-tighter mb-3 leading-none">Co-Founder<br/>Discussion</h2>
                        <p className="text-white/50 text-[15px] font-medium max-w-[240px]">Map your business strategy & brand identity with AI.</p>
                        <div className="mt-8 flex items-center gap-2 text-[#0073ea] font-black text-[12px] uppercase tracking-widest">
                            Start Consultation <span className="material-symbols-outlined text-[16px] group-hover:translate-x-2 transition-transform">east</span>
                        </div>
                    </div>
                </button>

                <button 
                    onClick={startSolutionsChat}
                    className="group relative bg-white p-10 rounded-[40px] text-left overflow-hidden shadow-xl border border-slate-100 hover:scale-[1.01] transition-all"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-emerald-50/80 rounded-2xl flex items-center justify-center mb-8 border border-emerald-100">
                            <span className="material-symbols-outlined text-[#00c875] text-[28px]">lightbulb</span>
                        </div>
                        <h2 className="text-[32px] font-black text-slate-900 uppercase tracking-tighter mb-3 leading-none">Business<br/>Solutions</h2>
                        <p className="text-slate-400 text-[15px] font-medium max-w-[240px]">Solve specific bottlenecks & build custom tools.</p>
                        <div className="mt-8 flex items-center gap-2 text-[#00c875] font-black text-[12px] uppercase tracking-widest">
                            Open Solutions Lab <span className="material-symbols-outlined text-[16px] group-hover:translate-x-2 transition-transform">east</span>
                        </div>
                    </div>
                </button>
            </div>

            {/* Quick Deploy Grid */}
            <div className="mb-20">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[14px] font-black text-slate-400 uppercase tracking-[0.3em]">Quick Deploy Assets</h3>
                    <div className="h-px flex-1 bg-slate-100 mx-6"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {SERVICES.map((s) => (
                        <button key={s.id} className="group p-5 bg-white rounded-3xl border border-slate-100 hover:border-[#0073ea] hover:shadow-xl transition-all flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                                <span className="material-symbols-outlined text-[24px]">{s.icon}</span>
                            </div>
                            <span className="text-[12px] font-black text-slate-800 uppercase tracking-tight">{s.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Digital Employees */}
            <div className="mb-20">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[14px] font-black text-slate-400 uppercase tracking-[0.3em]">AI Digital Employees</h3>
                    <div className="h-px flex-1 bg-slate-100 mx-6"></div>
                    <button onClick={() => setTopTab('ai-agents')} className="text-[12px] font-black text-[#0073ea] uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {DIGITAL_EMPLOYEES.slice(0, 4).map((agent) => (
                        <div 
                            key={agent.id} 
                            onClick={() => { setSelectedAgentId(agent.id); setAppState('agent-workspace'); }}
                            className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform" style={{ backgroundColor: `${agent.clr}15`, color: agent.clr }}>
                                    <span className="material-symbols-outlined text-[24px]">{agent.icon}</span>
                                </div>
                                <h4 className="text-[17px] font-black text-slate-900 uppercase tracking-tight mb-1">{agent.title}</h4>
                                <p className="text-[11px] text-[#00c875] font-black uppercase tracking-widest mb-4">{agent.role}</p>
                                <p className="text-[13px] text-slate-400 font-medium leading-relaxed">{agent.desc}</p>
                                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Deploy Now</span>
                                    <span className="material-symbols-outlined text-slate-200 text-[18px] group-hover:translate-x-1 transition-transform group-hover:text-[#0073ea]">east</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
