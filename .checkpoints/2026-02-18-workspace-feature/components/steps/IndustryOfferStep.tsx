import React from 'react';
import { BusinessData, OfferingType } from '../../types';

interface IndustryOfferStepProps {
    data: BusinessData;
    updateData: (newData: Partial<BusinessData>) => void;
    onNext: () => void;
    onBack: () => void;
    uiStep: number;
    totalSteps: number;
}

const IndustryOfferStep: React.FC<IndustryOfferStepProps> = ({ data, updateData, onNext, onBack, uiStep, totalSteps }) => {
    const options: { id: OfferingType; label: string; desc: string; icon: string; color: string }[] = [
        { id: 'physical_goods', label: 'Physical Goods', desc: 'Material products, candles, clothing, etc.', icon: 'inventory_2', color: 'blue' },
        { id: 'services', label: 'Services', desc: 'Skills like coaching, photography, etc.', icon: 'handyman', color: 'purple' },
        { id: 'hospitality', label: 'Leisure & Hospitality', desc: 'Food, hotel, spa, tourism, etc.', icon: 'local_cafe', color: 'orange' },
        { id: 'content', label: 'Original Content', desc: 'Blogging, gaming, social media, etc.', icon: 'video_camera_front', color: 'red' },
        { id: 'tech', label: 'Technology', desc: 'Digital products, apps or platforms.', icon: 'devices', color: 'teal' },
    ];

    return (
        <div className="w-full max-w-2xl mx-auto px-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-10">
                <span className="text-[10px] font-black text-slate-500 bg-white px-4 py-2 rounded-full mb-4 inline-block uppercase tracking-widest shadow-sm border border-slate-100">
                    Step {uiStep} of {totalSteps}
                </span>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mt-2 tracking-tight">
                    What will {data.name} offer?
                </h1>
            </div>

            <div className="space-y-3 max-w-xl mx-auto">
                {options.map(opt => {
                    const colorMap: Record<string, string> = {
                        blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
                        purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
                        orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100',
                        red: 'bg-rose-50 text-rose-600 group-hover:bg-rose-100',
                        teal: 'bg-teal-50 text-teal-600 group-hover:bg-teal-100'
                    };
                    const activeColorClass = colorMap[opt.color] || colorMap['blue'];

                    return (
                        <label
                            key={opt.id}
                            className={`group relative flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 bg-white shadow-sm hover:shadow-md ${data.offeringType === opt.id ? 'border-blue-600 ring-1 ring-blue-600 shadow-blue-100' : 'border-slate-100 hover:border-blue-300'}`}
                        >
                            <input
                                type="radio"
                                className="sr-only"
                                name="offering"
                                checked={data.offeringType === opt.id}
                                onChange={() => updateData({ offeringType: opt.id })}
                            />
                            <div className={`w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center transition-all duration-300 border ${data.offeringType === opt.id ? 'bg-blue-600 text-white border-blue-600 scale-105 shadow-md' : `${activeColorClass} border-transparent`}`}>
                                <span className="material-icons-round text-lg font-bold">{opt.icon}</span>
                            </div>
                            <div className="flex-grow min-w-0">
                                <h3 className={`font-bold text-sm tracking-tight transition-colors ${data.offeringType === opt.id ? 'text-blue-700' : 'text-slate-900'}`}>{opt.label}</h3>
                                <p className="text-slate-500 text-[10px] mt-0.5 font-medium leading-relaxed truncate">{opt.desc}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${data.offeringType === opt.id ? 'border-blue-600 bg-blue-600' : 'border-slate-200 group-hover:border-blue-300'}`}>
                                {data.offeringType === opt.id && <span className="material-icons-round text-white text-xs font-bold">check</span>}
                            </div>
                        </label>
                    );
                })}
            </div>

            <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200 max-w-xl mx-auto">
                <button onClick={onBack} className="text-slate-500 hover:text-slate-700 font-bold text-xs uppercase tracking-widest px-4 py-2 flex items-center gap-2 transition-colors">
                    <span className="material-icons-round text-base">arrow_back</span> Back
                </button>
                <button onClick={onNext} className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-[0.2em] px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 transform active:scale-95">
                    Continue <span className="material-icons-round text-lg">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};

export default IndustryOfferStep;
