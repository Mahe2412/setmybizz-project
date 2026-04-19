import React from 'react';

interface LaunchPadAgentWorkspaceProps {
    agent: any;
    agentTasks: any[];
    selectedAgentId: string;
    agentTaskInput: string;
    setAgentTaskInput: (v: string) => void;
    handleAgentTaskSubmit: () => void;
    isAgentWorking: boolean;
    setAppState: (s: any) => void;
    isRecording: boolean;
    liveTranscript: string;
    toggleVoice: () => void;
}

export const LaunchPadAgentWorkspace: React.FC<LaunchPadAgentWorkspaceProps> = ({
    agent,
    agentTasks,
    selectedAgentId,
    agentTaskInput,
    setAgentTaskInput,
    handleAgentTaskSubmit,
    isAgentWorking,
    setAppState,
    isRecording,
    liveTranscript,
    toggleVoice
}) => {
    const currentTasks = agentTasks.filter(t => t.agentId === selectedAgentId);
    const inProgressTasks = currentTasks.filter(t => t.status === 'in-progress');
    const doneTasks = currentTasks.filter(t => t.status === 'done');

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] animate-in fade-in slide-in-from-right-8 duration-500 relative z-0">
            {/* Workspace Header */}
            <div className="bg-white px-8 py-6 border-b border-slate-100 shadow-sm flex items-center justify-between shrink-0 relative z-10">
                <div className="flex items-center gap-6">
                    <button onClick={() => setAppState('home')} className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-all border border-slate-100 hover:border-slate-300">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </button>
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative" style={{ backgroundColor: `${agent.clr}15`, color: agent.clr }}>
                            <span className="material-symbols-outlined text-[28px]">{agent.icon}</span>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#00c875] border-2 border-white flex items-center justify-center shadow-sm">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-[20px] font-black text-slate-900 uppercase tracking-tight leading-tight">
                                    {agent.title}
                                </h1>
                                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-slate-900 text-white">AI Worker</span>
                            </div>
                            <p className="text-[13px] text-slate-400 font-medium flex items-center gap-1.5 mt-1">
                                <span className="material-symbols-outlined text-[14px] text-amber-500">bolt</span>
                                {agent.role} &bull; Active Node
                            </p>
                        </div>
                    </div>
                </div>
                <button className="px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[12px] text-slate-900 font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                    Configuration
                </button>
            </div>

            {/* Workspace Board */}
            <div className="flex-1 overflow-x-auto p-8 flex items-start gap-8 no-scrollbar relative z-0">
                {/* Backlog */}
                <div className="w-[340px] shrink-0 flex flex-col gap-4">
                    <div className="text-slate-400 px-2 text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-between">
                        Queue / Backlog <span className="text-slate-200">01</span>
                    </div>
                    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm cursor-grab hover:border-[#0073ea] hover:shadow-xl transition-all">
                        <p className="text-[14px] text-slate-900 font-bold leading-snug">Generate {agent.role} strategy report for Q3</p>
                        <div className="mt-4 flex items-center gap-2 text-slate-300 text-[11px] font-black uppercase tracking-widest">
                            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                            System Suggestion
                        </div>
                    </div>
                </div>

                {/* In Progress */}
                <div className="w-[340px] shrink-0 flex flex-col gap-4">
                    <div className="text-amber-500 px-2 text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-between">
                        Processing <span className="bg-amber-100 text-amber-600 w-5 h-5 rounded flex items-center justify-center text-[10px]">{inProgressTasks.length}</span>
                    </div>
                    {inProgressTasks.map((t) => (
                        <div key={t.id} className="bg-white p-6 rounded-[24px] border border-amber-100 shadow-[0_20px_40px_rgba(245,158,11,0.05)] ring-1 ring-amber-500/10">
                            <p className="text-[14px] text-slate-900 font-bold mb-4">{t.title}</p>
                            <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 w-[60%] animate-pulse"></div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full w-fit uppercase tracking-widest">
                                <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                                Arkle Neural Syncing
                            </div>
                        </div>
                    ))}
                </div>

                {/* Done */}
                <div className="w-[380px] shrink-0 flex flex-col gap-4">
                    <div className="text-[#00c875] px-2 text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-between">
                        Completed <span className="bg-emerald-100 text-emerald-600 w-5 h-5 rounded flex items-center justify-center text-[10px]">{doneTasks.length}</span>
                    </div>
                    {doneTasks.map((t) => (
                        <div key={t.id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col gap-3">
                            <div className="flex items-start gap-3 border-b border-slate-50 pb-4">
                                <span className="material-symbols-outlined text-[18px] text-emerald-500 shrink-0 mt-0.5">check_circle</span>
                                <p className="text-[14px] text-slate-900 font-bold leading-tight">{t.title}</p>
                            </div>
                            <div className="text-[13px] text-slate-500 font-medium whitespace-pre-wrap mt-1 bg-slate-50 p-4 rounded-2xl overflow-x-auto max-h-[400px] overflow-y-auto no-scrollbar border border-slate-100/50">
                                {t.result}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Input Bar */}
            <div className="p-6 bg-white border-t border-slate-100 shrink-0 z-10 shadow-[0_-20px_60px_rgba(0,0,0,0.02)] pb-10 relative flex items-center justify-center">
                <div className="max-w-4xl w-full mx-auto bg-white border border-slate-200 rounded-[32px] flex items-center justify-between p-2 shadow-sm focus-within:border-[#0073ea] focus-within:shadow-xl focus-within:shadow-blue-500/10 transition-all">
                    <div className="flex items-center gap-1 pl-3">
                        <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">attach_file</span>
                        </button>
                        <input 
                            value={isRecording && liveTranscript ? liveTranscript : agentTaskInput}
                            onChange={(e) => setAgentTaskInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAgentTaskSubmit(); }}
                            placeholder={`Command ${agent.title}... (e.g. "Draft an email to clients")`}
                            className="flex-1 min-w-[400px] bg-transparent px-3 py-2 outline-none text-[15px] font-bold text-slate-900 placeholder-slate-300"
                            disabled={isAgentWorking}
                        />
                    </div>
                    <div className="flex items-center gap-2 pr-1">
                        <button 
                            onClick={toggleVoice} 
                            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-slate-900 text-white scale-110 shadow-xl animate-pulse' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{isRecording ? 'graphic_eq' : 'mic'}</span>
                        </button>
                        <button 
                            onClick={() => handleAgentTaskSubmit()}
                            disabled={isAgentWorking || (!agentTaskInput.trim() && !liveTranscript.trim())}
                            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${(isAgentWorking || (!agentTaskInput.trim() && !liveTranscript.trim())) ? 'bg-slate-50 text-slate-200' : 'bg-[#0073ea] text-white hover:scale-105 shadow-lg shadow-blue-500/20'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{isAgentWorking ? 'hourglass_empty' : 'arrow_upward'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
