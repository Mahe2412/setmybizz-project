import React from 'react';
import { Package, Hammer, Coffee, Video, Monitor, ArrowLeft, ArrowRight, Check } from 'lucide-react';
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
    const options: { id: OfferingType; label: string; desc: string; icon: React.ReactNode; colorClass: string }[] = [
        { id: 'physical_goods', label: 'Physical Products', desc: 'Material goods, clothing, crafts, etc.', icon: <Package className="w-6 h-6" />, colorClass: 'from-blue-500 to-indigo-500' },
        { id: 'services', label: 'Services', desc: 'Consulting, coaching, freelancing, clinics.', icon: <Hammer className="w-6 h-6" />, colorClass: 'from-purple-500 to-pink-500' },
        { id: 'hospitality', label: 'Leisure & Hospitality', desc: 'Restaurants, cafes, hotels, tourism.', icon: <Coffee className="w-6 h-6" />, colorClass: 'from-orange-500 to-amber-500' },
        { id: 'content', label: 'Creators & Media', desc: 'Blogging, YouTube, gaming, influencers.', icon: <Video className="w-6 h-6" />, colorClass: 'from-red-500 to-rose-500' },
        { id: 'tech', label: 'Tech & Digital', desc: 'Software, SaaS, digital products.', icon: <Monitor className="w-6 h-6" />, colorClass: 'from-teal-500 to-emerald-500' },
    ];

    return (
        <div className="w-full flex flex-col items-center justify-center px-4 animate-slide-up duration-500 mt-10">
            <div className="text-center mb-10 w-full max-w-3xl">
                <div className="inline-flex items-center justify-center gap-2 mb-4 animate-fade-in">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">2</span>
                    <span className="text-slate-500 font-semibold tracking-wide uppercase text-sm">Quick Question 2 of 3</span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-black font-sans text-slate-900 mt-2 tracking-tight leading-tight">
                    What does <span className="text-gradient font-bold">{data.name || 'your business'}</span> do?
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl mx-auto">
                {options.map(opt => {
                    const isSelected = data.offeringType === opt.id;
                    return (
                        <label
                            key={opt.id}
                            className={`group relative flex flex-col p-6 rounded-3xl cursor-pointer transition-all duration-300 glass-card
                                ${isSelected 
                                    ? 'ring-2 ring-blue-500 shadow-[0_8px_30px_rgb(59,130,246,0.2)] scale-[1.02] bg-blue-50/50' 
                                    : 'hover:border-blue-300 hover:shadow-lg hover:scale-[1.01]'
                                }`}
                        >
                            <input
                                type="radio"
                                className="sr-only"
                                name="offering"
                                checked={isSelected}
                                onChange={() => {
                                    updateData({ offeringType: opt.id });
                                    // Optional: Auto-advance after a tiny delay
                                    // setTimeout(onNext, 400); 
                                }}
                            />
                            
                            <div className="flex justify-between items-start w-full mb-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${opt.colorClass} shadow-lg shadow-${opt.colorClass}/30 transition-transform group-hover:scale-110`}>
                                    {opt.icon}
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
                                    {isSelected && <Check className="text-white w-4 h-4" strokeWidth={3} />}
                                </div>
                            </div>
                            
                            <div className="flex-grow mt-2">
                                <h3 className={`text-xl font-bold tracking-tight mb-1 transition-colors ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                                    {opt.label}
                                </h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                    {opt.desc}
                                </p>
                            </div>
                        </label>
                    );
                })}
            </div>

            <div className="flex justify-between items-center w-full max-w-5xl mx-auto mt-12 pt-8 border-t border-slate-200/60">
                <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-bold uppercase tracking-widest px-6 py-3 flex items-center gap-2 transition-colors rounded-xl hover:bg-slate-100">
                    <ArrowLeft className="w-5 h-5" /> Back
                </button>
                <button 
                    onClick={onNext} 
                    className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold uppercase tracking-[0.15em] px-8 py-4 rounded-xl shadow-lg transition-all flex items-center gap-3 transform active:scale-95"
                >
                    Continue <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default IndustryOfferStep;
