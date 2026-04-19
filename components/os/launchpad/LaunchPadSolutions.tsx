import React from 'react';
import { SOLUTION_IDEAS } from './LaunchPadConstants';

interface LaunchPadSolutionsProps {
    setPromptInput: (val: string) => void;
    startSolutionsChat: () => void;
}

export const LaunchPadSolutions: React.FC<LaunchPadSolutionsProps> = ({
    setPromptInput,
    startSolutionsChat
}) => {
    return (
        <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Additional Apps Section */}
            <div className="w-full mt-2 text-center">
                <p className="text-[14px] text-slate-500 mb-4 font-medium uppercase tracking-widest">Build something specific</p>
                <div className="flex flex-wrap justify-center gap-3">
                    {['Build Apps', 'Web Applications', 'Tools', 'SaaS Products', 'Custom CRM'].map((item, i) => (
                        <button 
                            key={i} 
                            onClick={() => setPromptInput(`Help me build a ${item}...`)}
                            className="px-6 py-2 bg-white border border-slate-100 rounded-xl text-[14px] text-slate-800 font-bold hover:border-[#0073ea] hover:text-[#0073ea] transition-all shadow-sm"
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Solution Cards */}
            <div className="max-w-[680px] w-full mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
                {[
                    { title: 'Build a Custom CRM', desc: 'Track leads, deals, and customer lifecycle', icon: 'group', clr: '#579bfc' },
                    { title: 'Create AI Agent', desc: 'Automate follow-ups, support, and workflows', icon: 'smart_toy', clr: '#9d94ff' },
                    { title: 'Performance Dashboard', desc: 'Real-time analytics on revenue and growth', icon: 'monitoring', clr: '#00c875' },
                    { title: 'Workflow Automation', desc: 'Connect tools and eliminate manual tasks', icon: 'account_tree', clr: '#ff7b00' },
                ].map((card, i) => (
                    <button 
                        key={i} 
                        onClick={startSolutionsChat}
                        className="flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-2xl hover:border-[#0073ea] hover:shadow-xl transition-all text-left group"
                    >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${card.clr}15` }}>
                            <span className="material-symbols-outlined text-[20px]" style={{ color: card.clr }}>{card.icon}</span>
                        </div>
                        <div>
                            <p className="text-[15px] font-black text-slate-800 group-hover:text-[#0073ea] transition-colors uppercase tracking-tight">{card.title}</p>
                            <p className="text-[13px] text-slate-400 mt-1 font-medium">{card.desc}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Template Grid */}
            <div className="w-full max-w-5xl mt-16 px-6 pb-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[20px] font-black text-slate-900 uppercase tracking-tight">Start with an idea</h2>
                    <div className="flex items-center gap-4">
                        {['All', 'Sales', 'Marketing', 'Ops'].map((cat, i) => (
                            <button key={i} className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border transition-all ${i === 0 ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SOLUTION_IDEAS.map((idea, i) => (
                        <button 
                            key={i} 
                            onClick={() => {
                                setPromptInput(idea.prompt);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="group flex flex-col bg-white rounded-2xl border border-slate-100 hover:border-[#0073ea] hover:shadow-2xl transition-all overflow-hidden text-left"
                        >
                            <div className="h-40 w-full relative overflow-hidden bg-slate-50">
                                <img 
                                    src={(idea as any).image} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-lg">
                                    <span className="material-symbols-outlined text-[20px]" style={{ color: idea.clr }}>
                                        {idea.category === 'Marketing' ? 'campaign' : 'monitoring'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <p className="text-[14px] font-black text-slate-900 group-hover:text-[#0073ea] transition-colors uppercase tracking-tight">{idea.title}</p>
                                <p className="text-[12px] text-slate-400 mt-1 font-medium">{idea.category}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
