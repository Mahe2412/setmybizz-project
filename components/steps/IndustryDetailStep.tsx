import React from 'react';
import { BusinessData } from '../../types';

interface IndustryDetailStepProps {
    data: BusinessData;
    updateData: (newData: Partial<BusinessData>) => void;
    onNext: () => void;
    onBack: () => void;
    uiStep: number;
    totalSteps: number;
}

const IndustryDetailStep: React.FC<IndustryDetailStepProps> = ({ data, updateData, onNext, onBack, uiStep, totalSteps }) => {
    return (
        <div className="w-full max-w-2xl mx-auto px-4 animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col items-center">
            <div className="text-center mb-10">
                <span className="text-[10px] font-black text-slate-500 bg-white px-4 py-2 rounded-full mb-4 inline-block uppercase tracking-widest shadow-sm border border-slate-100">
                    Step {uiStep} of {totalSteps}
                </span>
                <div className="w-48 h-48 relative mb-6 mx-auto">
                    <img
                        alt="Industry Illustration"
                        className="w-full h-full object-contain drop-shadow-sm"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQRM4to2ItLArHK7AWVUxBzIdHY8UVMYNkcgX_WO9n8JJlbNSu8OI7aRivNeRheU8dvDWUfGkFWKs4kupGpntM0HgmAF5iqNSDh-HUqqW2h6KMQK1keg_3QwSubVldp7dj-UmbPpcxBiFS7S4wpzsjl5pP37I3P61DQYxm4mKG-VowypLVmG4AVVJWtmTmRD_ZGhAsggImGK2ZD9X66x5LmFlBgLWReyoetL5XloyQz0C1G9qgpdfNkBDFZB1s341KfvIef52usNYi"
                    />
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
                    Enter your industry
                </h1>
                <p className="text-slate-500 text-lg mt-3 max-w-lg mx-auto leading-relaxed font-sans font-medium">
                    By telling us more about what you do, we can create a better plan for you
                </p>
            </div>

            <div className="w-full space-y-4 max-w-md">
                <div className="relative">
                    <input
                        className="w-full p-3 rounded-lg border border-slate-200 shadow-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none transition-all font-medium text-sm"
                        placeholder="e.g Coffee shop"
                        value={data.industry}
                        onChange={(e) => updateData({ industry: e.target.value })}
                    />
                </div>
                <div className="relative">
                    <textarea
                        className="w-full p-3 rounded-lg border border-slate-200 shadow-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none resize-none transition-all font-medium text-sm"
                        placeholder="e.g We are a small organic grocery shop located in Williamsburg, focused on a young, hipster audience"
                        rows={3}
                        value={data.description}
                        onChange={(e) => updateData({ description: e.target.value })}
                    ></textarea>
                </div>
            </div>

            <div className="w-full max-w-2xl flex justify-between items-center mt-12 pt-8 border-t border-slate-200">
                <button
                    onClick={onBack}
                    className="text-slate-500 hover:text-slate-700 font-bold text-xs uppercase tracking-widest px-4 py-2 flex items-center gap-2 transition-colors"
                >
                    <span className="material-icons-round text-base">arrow_back</span> Back
                </button>
                <button
                    onClick={onNext}
                    className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-[0.2em] px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 transform active:scale-95"
                >
                    Continue <span className="material-icons-round text-lg">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};

export default IndustryDetailStep;
