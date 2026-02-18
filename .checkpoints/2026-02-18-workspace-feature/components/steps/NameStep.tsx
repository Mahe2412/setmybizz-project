import React from 'react';
import { BusinessData } from '../../types';

interface NameStepProps {
    data: BusinessData;
    updateData: (newData: Partial<BusinessData>) => void;
    onNext: () => void;
}

const NameStep: React.FC<NameStepProps> = ({ data, updateData, onNext }) => {
    return (
        <div className="w-full min-h-[80vh] flex flex-col items-center justify-center px-4 animate-in fade-in duration-700">
            <div className="max-w-4xl w-full text-center space-y-8">
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 leading-tight tracking-tight">
                    Simplifying your business journey
                </h1>

                <p className="font-sans text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                    Navigate your business journey with an AI-powered platform built for every step -- from launch to growth.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-xl mx-auto">
                    <input
                        type="text"
                        className="w-full md:flex-1 p-4 rounded-xl border-none shadow-xl bg-white text-slate-900 placeholder-slate-400 focus:ring-4 focus:ring-primary/20 transition-all text-lg font-medium"
                        placeholder="Enter your business name"
                        value={data.name}
                        onChange={(e) => updateData({ name: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && data.name.trim() && onNext()}
                    />
                    <button
                        disabled={!data.name.trim()}
                        onClick={onNext}
                        className="w-full md:w-auto bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-blue-500/30 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 text-lg"
                    >
                        Start My Business 🚀
                    </button>
                </div>
            </div>

            <div className="mt-16 flex items-center gap-2 text-slate-500">
                <span className="material-icons-round text-primary text-lg">verified</span>
                <span className="text-[9px] font-black uppercase tracking-widest">Trusted by 10,000+ Founders</span>
            </div>
        </div>
    );
};

export default NameStep;
