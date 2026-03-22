import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { BusinessData } from '../../types';

interface NameStepProps {
    data: BusinessData;
    updateData: (newData: Partial<BusinessData>) => void;
    onNext: () => void;
}

const NameStep: React.FC<NameStepProps> = ({ data, updateData, onNext }) => {
    return (
        <div className="w-full flex flex-col items-center justify-center px-4 animate-slide-up duration-500">
            <div className="max-w-3xl w-full text-center space-y-8 mt-10">
                
                <div className="inline-flex items-center justify-center gap-2 mb-4 animate-fade-in">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">1</span>
                    <span className="text-slate-500 font-semibold tracking-wide uppercase text-sm">Quick Question 1 of 3</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black font-sans text-slate-900 leading-tight tracking-tight">
                    What's your <span className="text-gradient">business name?</span>
                </h1>

                <p className="font-sans text-slate-600 text-lg max-w-xl mx-auto leading-relaxed">
                    Don't worry if you haven't decided yet, you can always change it later.
                </p>

                <div className="glass-card p-6 md:p-8 rounded-3xl mx-auto max-w-2xl shadow-xl mt-8 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative flex flex-col md:flex-row gap-4 items-center w-full z-10">
                        <div className="relative w-full flex-1">
                            <input
                                type="text"
                                className="w-full pl-6 pr-12 py-5 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-lg font-medium"
                                placeholder="e.g. Acme Corporation..."
                                value={data.name}
                                onChange={(e) => updateData({ name: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && data.name.trim() && onNext()}
                                autoFocus
                            />
                            {data.name.trim() && (
                                <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5 animate-pulse" />
                            )}
                        </div>
                        
                        <button
                            disabled={!data.name.trim()}
                            onClick={onNext}
                            className="group w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-bold px-8 py-5 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 text-lg shrink-0"
                        >
                            <span>Next Step</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NameStep;
