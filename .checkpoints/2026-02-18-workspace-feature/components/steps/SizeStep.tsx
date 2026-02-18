import React from 'react';
import { BusinessData, BusinessSize } from '../../types';

interface SizeStepProps {
    data: BusinessData;
    updateData: (newData: Partial<BusinessData>) => void;
    onNext: () => void;
    onBack: () => void;
    uiStep: number;
    totalSteps: number;
}

const SizeStep: React.FC<SizeStepProps> = ({ data, updateData, onNext, onBack, uiStep, totalSteps }) => {
    const sizes: { id: BusinessSize; label: string; desc: string; icon: string }[] = [
        { id: 'solo', label: 'Solo Founder', desc: 'Just me, handling everything.', icon: 'person' },
        { id: 'small_team', label: 'Small Team', desc: '2-10 employees/partners.', icon: 'groups' },
        { id: 'scaling', label: 'Scaling Startup', desc: '10-50+ and growing fast.', icon: 'trending_up' },
        { id: 'enterprise', label: 'Enterprise', desc: 'Established organization.', icon: 'business' },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto px-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-10">
                <span className="text-[10px] font-black text-slate-500 bg-white px-4 py-2 rounded-full mb-4 inline-block uppercase tracking-widest shadow-sm border border-slate-100">
                    Step {uiStep} of {totalSteps}
                </span>
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-slate-900 tracking-tight">
                    How big is your operation?
                </h1>
                <p className="text-slate-500 text-sm font-sans font-medium opacity-80">Scaling tools defined by your size.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {sizes.map(size => {
                    const colorMap: Record<string, string> = {
                        solo: 'bg-blue-50 text-blue-600',
                        small_team: 'bg-purple-50 text-purple-600',
                        scaling: 'bg-green-50 text-green-600',
                        enterprise: 'bg-orange-50 text-orange-600',
                    };
                    // Map sizes to colors manually since they don't have a color prop in the original array
                    const colorKey = size.id === 'solo' ? 'solo' : size.id === 'small_team' ? 'small_team' : size.id === 'scaling' ? 'scaling' : 'enterprise';
                    const activeColorClass = colorMap[colorKey];

                    return (
                        <button
                            key={size.id}
                            onClick={() => updateData({ size: size.id })}
                            className={`group p-4 rounded-2xl border-2 flex items-center gap-3 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 ${data.size === size.id ? 'border-blue-600 bg-white ring-1 ring-blue-600 shadow-blue-100' : 'border-slate-100 bg-white hover:border-blue-200'}`}
                        >
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform ${data.size === size.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : activeColorClass}`}>
                                <span className="material-icons-round text-lg font-bold">{size.icon}</span>
                            </div>
                            <div className="text-left leading-tight">
                                <h3 className={`font-bold text-sm tracking-tight mb-0.5 ${data.size === size.id ? 'text-blue-700' : 'text-slate-900'}`}>{size.label}</h3>
                                <p className="text-[10px] text-slate-500 font-medium leading-tight">{size.desc}</p>
                            </div>
                        </button>
                    )
                })}
            </div>

            <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-100 max-w-2xl mx-auto">
                <button onClick={onBack} className="text-slate-500 hover:text-slate-700 font-bold text-xs uppercase tracking-widest px-6 py-2 transition-colors flex items-center gap-2">
                    <span className="material-icons-round">arrow_back</span> Back
                </button>
                <button onClick={onNext} className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold px-10 py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 uppercase tracking-[0.2em] text-xs transform active:scale-95">
                    Next <span className="material-icons-round text-lg">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};

export default SizeStep;
