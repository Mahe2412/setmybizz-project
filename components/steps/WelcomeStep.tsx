import React from 'react';
import { Sparkles, Globe2, Briefcase, ChevronRight, Zap } from 'lucide-react';

interface WelcomeStepProps {
    onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
    return (
        <div className="w-full flex flex-col items-center justify-center animate-slide-up duration-700 max-w-4xl mx-auto px-4 mt-8 relative">
            
            {/* Advanced Decorative Background Orbs */}
            <div className="absolute top-0 -left-10 w-72 h-72 bg-blue-500/15 rounded-full blur-[90px] animate-pulse pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-indigo-500/15 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

            {/* Premium Wrapping Glass Card */}
            <div className="w-full glass-card border border-white/60 shadow-[0_8px_40px_rgba(0,0,0,0.04)] rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden backdrop-blur-xl group/card">
                
                {/* Animated Gradient Border (visible on hover) */}
                <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2.5rem] p-[1px] bg-gradient-to-r from-blue-400/0 via-blue-400/40 to-indigo-400/0" style={{ maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)'}}></div>

                <div className="flex flex-col items-center justify-center relative z-10">
                    
                    {/* Premium Icon Container */}
                    <div className="mb-10 relative group">
                        <div className="absolute inset-0 bg-blue-600 blur-[40px] opacity-20 rounded-full animate-glow group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div className="w-24 h-24 md:w-28 md:h-28 glass-panel rounded-full flex items-center justify-center relative z-10 border border-white/80 shadow-[0_8px_32px_rgba(37,99,235,0.15)] overflow-hidden transition-transform duration-500 group-hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/0 z-0"></div>
                            <Globe2 className="text-blue-600 w-12 h-12 md:w-14 md:h-14 animate-float relative z-10" strokeWidth={1.5} />
                        </div>
                        {/* Decorative floating particles */}
                        <Sparkles className="absolute -top-6 -right-6 text-amber-400 w-8 h-8 animate-pulse drop-shadow-md" />
                        <Briefcase className="absolute -bottom-2 -left-4 text-indigo-400 w-6 h-6 animate-float drop-shadow-md" style={{ animationDelay: '1s' }} strokeWidth={1.5} />
                        <Zap className="absolute top-1/2 -right-8 text-blue-400 w-5 h-5 animate-pulse drop-shadow-md" style={{ animationDelay: '1.5s' }} strokeWidth={2} />
                    </div>

                    <div className="text-center space-y-7 relative z-10 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50/50 border border-blue-200 text-blue-700 text-xs md:text-sm font-bold tracking-[0.15em] uppercase mb-2 animate-fade-in shadow-sm hover:shadow-md hover:bg-white transition-all">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                            </span>
                            <span className="relative z-10 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">AI Business Setup & Global Access</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black font-sans tracking-tight text-slate-900 leading-[1.15]">
                            Setup Your Business For <br className="hidden md:block"/> <span className="text-gradient">Global Access</span>
                        </h1>
                        
                        <p className="text-slate-600 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
                            We just need 3 quick details. Our AI will instantly set up your business foundation and prepare it for the global market.
                        </p>

                        <div className="pt-8 w-full max-w-sm mx-auto">
                            <button
                                onClick={onNext}
                                className="group relative inline-flex items-center justify-center px-8 py-5 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-[0_10px_40px_rgba(37,99,235,0.3)] hover:shadow-[0_10px_50px_rgba(37,99,235,0.5)] hover:-translate-y-1 active:scale-95 w-full overflow-hidden border border-white/20"
                            >
                                {/* Shimmer effect inside button */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                                <span className="relative z-10">Start Business Setup</span>
                                <div className="ml-3 p-1.5 rounded-full bg-white/20 relative z-10 group-hover:translate-x-1 transition-transform">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </button>
                            <p className="text-sm text-slate-500 mt-6 font-semibold flex items-center justify-center gap-1.5 opacity-80">
                                <Sparkles className="w-4 h-4 text-amber-500" /> Takes less than 2 minutes
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <footer className="mt-12 flex flex-col items-center gap-2 opacity-50 relative z-10">
                <span className="text-[10px] font-bold tracking-[0.25em] text-slate-600 uppercase">
                    Your Gateway to Global Markets
                </span>
            </footer>
        </div>
    );
};

export default WelcomeStep;
