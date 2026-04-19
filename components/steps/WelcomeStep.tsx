import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Globe2, ChevronRight, Zap, Cpu, ShieldCheck, Activity } from 'lucide-react';

interface WelcomeStepProps {
    onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
    return (
        <div className="w-full flex flex-col items-center justify-center max-w-3xl mx-auto px-4 mt-8 relative">
            
            {/* Boosted Decorative Backgrounds */}
            <div className="absolute top-0 -left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Premium Compact Glass Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="group w-full bg-white border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] rounded-[3rem] p-8 md:p-14 relative overflow-hidden backdrop-blur-xl transition-all duration-700 hover:shadow-[0_30px_100px_rgba(37,99,235,0.06)]"
            >
                
                <div className="flex flex-col items-center justify-center relative z-10">
                    
                    {/* Central Globe Icon (Compact) */}
                    <div className="mb-8 relative">
                        <div className="absolute inset-0 bg-blue-600 blur-[40px] opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-700"></div>
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center relative z-10 border border-slate-50 shadow-2xl overflow-hidden transition-transform duration-700 group-hover:scale-110">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white"></div>
                            <Globe2 className="text-blue-600 w-10 h-10 md:w-12 md:h-12 relative z-10" strokeWidth={1.5} />
                        </div>
                        <Sparkles className="absolute -top-4 -right-4 text-amber-400 w-8 h-8 animate-pulse" />
                    </div>

                    <div className="text-center space-y-6 relative z-10 max-w-2xl mx-auto">
                        {/* Refined Badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50/50 border border-blue-100 text-blue-700 text-[10px] font-black tracking-[0.15em] uppercase mb-2 shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                            </span>
                            Run • Manage • Operate (Entire Business with AI)
                        </div>
                        
                        {/* Title - Scaled for Compact Container */}
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-2">
                            Setup Your Startup <br />
                            <span className="text-blue-600">Operating System</span>
                        </h1>
                        
                        {/* Catchy Description */}
                        <p className="text-slate-500 text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity duration-700">
                            Install a powerful AI-driven infrastructure for your business. 
                            <span className="text-slate-900 font-bold"> Arkle Super AI</span> manages your growth autonomously, without human intervention.
                        </p>

                        {/* Action Area */}
                        <div className="pt-8 w-full max-w-xs mx-auto">
                            <button
                                onClick={onNext}
                                className="relative inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-base shadow-[0_15px_40px_rgba(37,99,235,0.2)] transition-all duration-700 w-full
                                group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:shadow-[0_30px_80px_rgba(37,99,235,0.5)] group-hover:-translate-y-1"
                            >
                                <span className="relative z-10">Initialize BizOS Installation</span>
                                <div className="ml-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </button>
                            
                            {/* Support Icons */}
                            <div className="mt-8 flex items-center justify-center gap-6 opacity-30 transition-opacity group-hover:opacity-70">
                                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">
                                    <Cpu className="w-3.5 h-3.5 text-blue-600" /> Core
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">
                                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Secure
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">
                                    <Activity className="w-3.5 h-3.5 text-emerald-600" /> Live
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
            
            <footer className="mt-12 opacity-30">
                <span className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">
                    Neural Engine • SetMyBizz v2.0
                </span>
            </footer>
        </div>
    );
};

export default WelcomeStep;
