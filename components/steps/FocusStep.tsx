import React from 'react';
import { BusinessData, FocusArea } from '../../types';

interface FocusStepProps {
    data: BusinessData;
    updateData: (newData: Partial<BusinessData>) => void;
    onNext: () => void;
    onBack: () => void;
    uiStep: number;
    totalSteps: number;
}

const FocusStep: React.FC<FocusStepProps> = ({ data, updateData, onNext, onBack, uiStep, totalSteps }) => {
    const options: { id: FocusArea; label: string; desc: string; icon: string; color: string }[] = [
        { id: 'online_presence', label: 'Online Presence', desc: 'Website, domain, social media, and digital branding setup.', icon: 'laptop_chromebook', color: 'teal' },
        { id: 'formation', label: 'Business Formation', desc: 'LLC registration, Udyam, EIN, and legal compliance.', icon: 'gavel', color: 'blue' },
        { id: 'branding', label: 'Logo & Branding', desc: 'Logo design, business cards, trademarks, and brand identity.', icon: 'palette', color: 'purple' },
        { id: 'growth', label: 'Growth & Funding', desc: 'Startup India registration, funding support, and scaling tools.', icon: 'trending_up', color: 'orange' },
    ];

    const toggleFocus = (id: FocusArea) => {
        // Ensure focusAreas is initialized
        const currentFocus = data.focusAreas || [];
        const next = currentFocus.includes(id)
            ? currentFocus.filter(x => x !== id)
            : [...currentFocus, id];
        updateData({ focusAreas: next });
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-10 max-w-2xl mx-auto">
                <span className="text-xs font-semibold text-blue-600 bg-white border border-blue-100 px-4 py-2 rounded-full mb-4 inline-block shadow-sm">
                    Step {uiStep} of {totalSteps}
                </span>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    What would you like to focus on today?
                </h1>
                <p className="text-slate-600 text-lg font-sans">
                    You can choose more than one goal to help us tailor your dashboard.
                </p>
            </div>

            <div className="flex flex-col gap-6 mb-12 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 max-w-6xl mx-auto">
                    {options.map(opt => {
                        const colorMap: Record<string, string> = {
                            teal: 'bg-teal-50 text-teal-600',
                            blue: 'bg-blue-50 text-blue-600',
                            purple: 'bg-purple-50 text-purple-600',
                            orange: 'bg-orange-50 text-orange-600'
                        };
                        const activeColorClass = colorMap[opt.color];

                        return (
                            <label key={opt.id} className="group cursor-pointer relative block h-full">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={data.focusAreas?.includes(opt.id) || false}
                                    onChange={() => toggleFocus(opt.id)}
                                />
                                <div className={`h-full bg-white border-2 rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 ${data.focusAreas?.includes(opt.id) ? 'border-blue-600 ring-1 ring-blue-600 shadow-blue-100' : 'border-slate-100 hover:border-blue-200'}`}>
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 border ${data.focusAreas?.includes(opt.id) ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' : activeColorClass}`}>
                                        <span className="material-icons-round text-xl font-bold">{opt.icon}</span>
                                    </div>
                                    <h3 className={`font-bold text-sm mb-1 transition-colors ${data.focusAreas?.includes(opt.id) ? 'text-blue-700' : 'text-slate-900'}`}>
                                        {opt.label}
                                    </h3>
                                    <p className="text-[10px] text-slate-500 leading-tight font-medium">
                                        {opt.desc}
                                    </p>

                                    <div className={`absolute top-3 right-3 transition-all duration-300 ${data.focusAreas?.includes(opt.id) ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                                        <span className="material-icons-round text-blue-600 text-lg font-bold">check_circle</span>
                                    </div>
                                </div>
                            </label>
                        )
                    })}
                </div>

                <div className="flex flex-col items-center gap-8 mb-20">
                    <a className="text-sm text-blue-600 hover:text-blue-800 font-semibold hover:underline decoration-2 underline-offset-4 transition-colors" href="#">Not sure? Look for guidance</a>
                    <button
                        onClick={onNext}
                        className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold px-16 py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1 text-lg active:scale-95"
                    >
                        Continue
                    </button>
                </div>

                <footer className="fixed bottom-0 left-0 w-full py-5 px-6 border-t border-slate-200 bg-white/90 backdrop-blur-md z-50">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <button
                            onClick={onBack}
                            className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wide"
                        >
                            <span className="material-icons-round mr-1">chevron_left</span> Back
                        </button>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {uiStep} of {totalSteps}</span>
                            <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 w-full rounded-full"></div>
                            </div>
                        </div>
                        <button
                            onClick={onNext}
                            className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wide"
                        >
                            Skip <span className="material-icons-round ml-1">chevron_right</span>
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default FocusStep;
