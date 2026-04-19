import React from 'react';
import { motion } from 'framer-motion';
import { BusinessData, BusinessStage } from '../../types';
import { Lightbulb, Building2, ChevronRight, ChevronLeft, Sparkles, Rocket } from 'lucide-react';

interface StageStepProps {
    data: BusinessData;
    updateData: (newData: Partial<BusinessData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const StageStep: React.FC<StageStepProps> = ({ data, updateData, onNext, onBack }) => {
    const options: { id: BusinessStage; label: string; desc: string; icon: any; color: string }[] = [
        { 
            id: 'idea', 
            label: 'The Birth', 
            desc: "I have a new startup idea to build", 
            icon: Lightbulb,
            color: 'blue'
        },
        { 
            id: 'operating', 
            label: 'The Upgrade', 
            desc: "I have an existing business to scale", 
            icon: Building2,
            color: 'indigo'
        }
    ];

    return (
        <div className="w-full flex flex-col items-center justify-center max-w-4xl mx-auto px-4 mt-8 relative">
            
            {/* Soft Decorative Backgrounds */}
            <div className="absolute top-0 -left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[90px] pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full bg-white border border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.03)] rounded-[3rem] p-8 md:p-14 relative overflow-hidden backdrop-blur-xl"
            >
                <div className="flex flex-col items-center justify-center relative z-10">
                    
                    {/* Header Discovery */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/50 border border-blue-100 text-blue-700 text-[10px] font-black tracking-[0.2em] uppercase mb-4 shadow-sm">
                            <Sparkles className="w-3 h-3" /> Step 1: Discovery
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-4">
                            Define your <span className="text-blue-600 italic">Trajectory</span>
                        </h1>
                        <p className="text-slate-500 text-base font-medium max-w-md mx-auto">
                            Are we building a new empire from scratch or upgrading an existing powerhouse?
                        </p>
                    </div>

                    {/* Differentiated Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-12">
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => {
                                    updateData({ stage: opt.id });
                                    // Auto-next for smoother flow if you prefer, 
                                    // or just wait for the button.
                                }}
                                className={`group relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 transition-all duration-500 hover:-translate-y-1 ${data.stage === opt.id ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-500/30 scale-[1.02]' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-white'}`}
                            >
                                <div className={`w-16 h-16 mb-6 rounded-2xl flex items-center justify-center transition-all duration-500 ${data.stage === opt.id ? 'bg-white/20 text-white' : 'bg-white text-blue-600 shadow-lg'}`}>
                                    <opt.icon className={`w-8 h-8 ${data.stage === opt.id ? 'text-white' : 'text-blue-600'}`} strokeWidth={1.5} />
                                </div>
                                <h3 className={`font-black text-xl mb-2 uppercase tracking-tight ${data.stage === opt.id ? 'text-white' : 'text-slate-900'}`}>
                                    {opt.label}
                                </h3>
                                <p className={`text-xs font-bold leading-relaxed px-4 text-center ${data.stage === opt.id ? 'text-blue-100' : 'text-slate-400'}`}>
                                    {opt.desc}
                                </p>

                                {data.stage === opt.id && (
                                    <motion.div 
                                        layoutId="check"
                                        className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                                    >
                                        <div className="w-3 h-3 bg-blue-600 rounded-full" />
                                    </motion.div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-4 w-full max-w-sm">
                        <button 
                            onClick={onBack}
                            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                        <button 
                            onClick={onNext}
                            disabled={!data.stage}
                            className={`flex-[2] flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all ${!data.stage ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/20'}`}
                        >
                            Continue Setup <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default StageStep;
