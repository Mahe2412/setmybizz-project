import React from 'react';
import { BusinessData, BusinessStage } from '../../types';

interface StageStepProps {
    data: BusinessData;
    updateData: (newData: Partial<BusinessData>) => void;
    onNext: () => void;
    onBack: () => void;
    uiStep: number;
    totalSteps: number;
}

const StageStep: React.FC<StageStepProps> = ({ data, updateData, onNext, onBack, uiStep, totalSteps }) => {
    const options: { id: BusinessStage; label: string; desc: string; icon: string }[] = [
        { id: 'idea', label: 'Just an idea', desc: "I'm still exploring possibilities", icon: 'lightbulb' },
        { id: 'launch', label: 'Getting ready', desc: "I have a plan, setting things up", icon: 'rocket_launch' },
        { id: 'operating', label: 'In business', desc: "I'm operating and selling", icon: 'storefront' },
    ];

    return (
        <div className="w-full max-w-5xl mx-auto px-4 animate-in fade-in slide-in-from-right-4 duration-500 relative">
            <div className="text-center mb-10">
                <span className="text-[10px] font-black text-slate-500 bg-white px-5 py-2 rounded-full mb-4 inline-block uppercase tracking-widest shadow-sm">
                    Step {uiStep} of {totalSteps}
                </span>
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-slate-900 tracking-tight">
                    What stage is <span className="text-blue-600 underline decoration-blue-200 decoration-4 underline-offset-4">{data.name || 'your business'}</span> at?
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto mb-16">
                {options.map(opt => {
                    const colorMap: Record<string, string> = {
                        idea: 'bg-yellow-50 text-yellow-600',
                        launch: 'bg-rose-50 text-rose-600',
                        operating: 'bg-blue-50 text-blue-600'
                    };
                    const activeColorClass = colorMap[opt.id];

                    return (
                        <button
                            key={opt.id}
                            onClick={() => updateData({ stage: opt.id })}
                            className={`group relative flex flex-col items-center justify-center p-6 bg-white rounded-3xl border-2 transition-all duration-300 h-56 shadow-sm hover:shadow-xl hover:-translate-y-1 ${data.stage === opt.id ? 'border-blue-600 ring-4 ring-blue-50 shadow-blue-200' : 'border-slate-100 hover:border-blue-200'}`}
                        >
                            <div className={`w-12 h-12 mb-4 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${data.stage === opt.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : activeColorClass}`}>
                                <span className="material-icons-round text-xl font-bold">{opt.icon}</span>
                            </div>
                            <h3 className={`font-bold text-base mb-1.5 uppercase tracking-tight ${data.stage === opt.id ? 'text-blue-700' : 'text-slate-800'}`}>
                                {opt.label}
                            </h3>
                            <p className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${data.stage === opt.id ? 'text-blue-600 bg-blue-50' : 'text-slate-500 bg-slate-50'}`}>{opt.desc}</p>
                        </button>
                    )
                })}
            </div>

            <div className="flex justify-center items-center gap-6 mt-8 pt-8 border-t border-slate-200 max-w-2xl mx-auto">
                <button onClick={onBack} className="px-8 py-3 rounded-full text-slate-500 hover:bg-slate-100 font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2">
                    <span className="material-icons-round">arrow_back</span> Back
                </button>
                <button onClick={onNext} className="bg-[#2563EB] hover:bg-blue-700 text-white px-12 py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-500/30 flex items-center gap-3 transition-all transform hover:-translate-y-1 active:scale-95">
                    Continue
                    <span className="material-icons-round text-lg">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};

export default StageStep;
