import React from 'react';

interface LaunchPadBuildProps {
    appState: 'home' | 'discuss' | 'building' | 'ready' | 'agent-workspace' | 'solutions-chat';
    buildProgress: number;
    builtAssets: Array<{
        id: string;
        label: string;
        icon: string;
        color: string;
        status: 'pending' | 'building' | 'done' | 'failed';
    }>;
}

export const LaunchPadBuilding: React.FC<LaunchPadBuildProps> = ({
    buildProgress,
    builtAssets
}) => {
    return (
        <div className="flex flex-col items-center justify-center h-full px-4 animate-in zoom-in-95 duration-500">
            <div className="max-w-md w-full text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 border-[3px] border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-[3px] border-t-[#0073ea] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                        <span className="text-[24px]">🚀</span>
                    </div>
                </div>
                <h2 className="text-[20px] font-black text-slate-900 uppercase tracking-tight mb-1">Building your ecosystem</h2>
                <p className="text-[14px] text-slate-400 font-medium mb-8 uppercase tracking-widest">{buildProgress}% complete</p>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-50 rounded-full mb-8 overflow-hidden">
                    <div className="h-full bg-[#0073ea] rounded-full transition-all duration-500" style={{ width: `${buildProgress}%` }}></div>
                </div>

                {/* Asset status list */}
                <div className="space-y-2 text-left">
                    {builtAssets.map(asset => (
                        <div key={asset.id} className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
                            <span className="material-symbols-outlined text-[18px]" style={{ color: asset.color }}>{asset.icon}</span>
                            <span className="text-[14px] text-slate-900 font-bold flex-1">{asset.label}</span>
                            {asset.status === 'pending' && <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Queued</span>}
                            {asset.status === 'building' && <span className="material-symbols-outlined text-[16px] text-[#0073ea] animate-spin">progress_activity</span>}
                            {asset.status === 'done' && <span className="material-symbols-outlined text-[16px] text-[#00c875]">check_circle</span>}
                            {asset.status === 'failed' && <span className="material-symbols-outlined text-[16px] text-red-500">error</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const LaunchPadReady: React.FC<LaunchPadBuildProps & { 
    bizCtx: any; 
    setAppState: (s: any) => void; 
    setBuildProgress: (n: number) => void;
    setViewingAsset: (a: any) => void;
}> = ({
    builtAssets,
    bizCtx,
    setAppState,
    setBuildProgress,
    setViewingAsset
}) => {
    return (
        <div className="max-w-4xl mx-auto pt-10 px-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
                <div>
                    <h2 className="text-[28px] font-black text-slate-900 uppercase tracking-tighter">Your ecosystem is ready! 🎉</h2>
                    <p className="text-[14px] text-slate-400 font-medium mt-1 uppercase tracking-widest">{builtAssets.length} assets built — click to open & customize</p>
                </div>
                <button onClick={() => { setAppState('home'); setBuildProgress(0); }} className="px-5 py-2.5 border border-slate-200 text-slate-900 text-[12px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    New Build
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {builtAssets.map(asset => (
                    <div key={asset.id} onClick={() => asset.status === 'done' && setViewingAsset(asset)} className="bg-white p-6 rounded-[32px] border border-slate-100 hover:border-[#0073ea] hover:shadow-2xl transition-all cursor-pointer group">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{ background: `${asset.color}18` }}>
                            <span className="material-symbols-outlined text-[24px]" style={{ color: asset.color }}>{asset.icon}</span>
                        </div>
                        <h3 className="text-[17px] font-black text-slate-900 uppercase tracking-tight mb-1">{asset.label}</h3>
                        <p className="text-[12px] text-slate-400 font-medium">{asset.status === 'done' ? 'Ready to launch' : 'Generation failed'}</p>
                        <div className={`flex items-center gap-1.5 mt-5 text-[10px] font-black uppercase tracking-widest ${asset.status === 'done' ? 'text-[#00c875]' : 'text-red-500'}`}>
                            <span className="material-symbols-outlined text-[14px]">{asset.status === 'done' ? 'verified' : 'error'}</span>
                            {asset.status === 'done' ? 'Arkle Secured' : 'Failed'}
                        </div>
                    </div>
                ))}
            </div>

            {/* Business context summary */}
            {bizCtx.idea && (
                <div className="mt-12 p-8 rounded-[40px] bg-[#f8fafc] border border-slate-200/50">
                    <h3 className="text-[12px] font-black text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
                        <span className="material-symbols-outlined text-[18px] text-[#0073ea]">psychology</span>
                        Strategy Intelligence
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {[
                            { label: 'Business Idea', val: bizCtx.idea },
                            { label: 'Target Audience', val: bizCtx.audience },
                            { label: 'Project Stage', val: bizCtx.stage },
                            { label: 'Monetization', val: bizCtx.model },
                        ].map((item, i) => (
                            <div key={i}>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{item.label}</p>
                                <p className="text-[14px] font-bold text-slate-700 leading-snug">{item.val}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
