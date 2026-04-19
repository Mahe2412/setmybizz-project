import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DISCUSSION_FLOW } from './LaunchPadConstants';

interface BuildingModalProps {
    appState: string;
    buildProgress: number;
}

export const BuildingModal: React.FC<BuildingModalProps> = ({ appState, buildProgress }) => {
    if (appState !== 'building') return null;
    return (
        <div className="fixed inset-0 z-120 flex items-center justify-center bg-[#1c1f3b] animate-in fade-in duration-1000">
            <div className="w-full max-w-lg text-center p-12">
                <div className="relative w-40 h-40 mx-auto mb-12">
                    <div className="absolute inset-0 border-8 border-white/5 rounded-full"></div>
                    <div 
                        className="absolute inset-0 border-8 border-[#0073ea] rounded-full transition-all duration-500"
                        style={{ clipPath: `inset(0 0 0 ${100 - buildProgress}%)`, transform: 'rotate(-90deg)' }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[64px] text-white animate-bounce">rocket_launch</span>
                    </div>
                </div>
                
                <h2 className="text-[28px] font-black text-white mb-4 uppercase tracking-tighter">Arkle is Building...</h2>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-[#0073ea] transition-all duration-700" style={{ width: `${buildProgress}%` }}></div>
                </div>
                <div className="flex flex-col gap-3">
                    <p className={`text-[14px] uppercase tracking-[0.3em] transition-all duration-500 ${buildProgress > 20 ? 'text-[#00c875]' : 'text-white/20'}`}>
                        {buildProgress > 20 ? '✓ Strategy Mapped' : 'Mapping Strategy...'}
                    </p>
                    <p className={`text-[14px] uppercase tracking-[0.3em] transition-all duration-500 ${buildProgress > 50 ? 'text-[#00c875]' : 'text-white/20'}`}>
                        {buildProgress > 50 ? '✓ Brand Engine Loaded' : 'Deploying Brand Engine...'}
                    </p>
                    <p className={`text-[14px] uppercase tracking-[0.3em] transition-all duration-500 ${buildProgress > 80 ? 'text-[#00c875]' : 'text-white/20'}`}>
                        {buildProgress > 80 ? '✓ Assets Synchronized' : 'Generating Assets...'}
                    </p>
                </div>
            </div>
        </div>
    );
};

interface WelcomeModalProps {
    showWelcome: boolean;
    onStart: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ showWelcome, onStart }) => {
    if (!showWelcome) return null;
    return (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-700">
            <div className="bg-[#1c1f3b] w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-white/10 p-12 text-center animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-gradient-to-tr from-[#0073ea] to-[#00c875] rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-blue-500/20">
                    <span className="material-symbols-outlined text-white text-[48px] animate-pulse">psychology</span>
                </div>
                <h1 className="text-[42px] font-black text-white mb-4 leading-tight tracking-tight uppercase">Meet Arkle</h1>
                <p className="text-[19px] text-white/60 mb-10 leading-relaxed max-w-md mx-auto">
                    Your strategic AI Co-Founder. I will help you build your <span className="text-white font-bold">entire startup</span> from scratch in minutes. 
                </p>
                <button 
                    onClick={onStart}
                    className="w-full py-5 bg-white text-[#1c1f3b] rounded-2xl text-[18px] font-bold shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center gap-3"
                >
                    Start Your Empire
                    <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
                </button>
                <p className="mt-6 text-[12px] text-white/30 uppercase tracking-[0.2em]">Strategy · Design · Tech · Scale</p>
            </div>
        </div>
    );
};

interface DiscoveryModalProps {
    showDiscovery: boolean;
    discoveryStep: number;
    isVoiceActive: boolean;
    setIsVoiceActive: (val: boolean) => void;
    toggleVoice: () => void;
    speak: (text: string) => void;
    liveTranscript: string;
    handlediscoveryAnswer: (val: string) => void;
    setDiscoveryStep: React.Dispatch<React.SetStateAction<number>>;
}

export const DiscoveryModal: React.FC<DiscoveryModalProps> = ({
    showDiscovery,
    discoveryStep,
    isVoiceActive,
    setIsVoiceActive,
    toggleVoice,
    speak,
    liveTranscript,
    handlediscoveryAnswer,
    setDiscoveryStep
}) => {
    if (!showDiscovery) return null;
    const currentQ = DISCUSSION_FLOW[discoveryStep];
    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="bg-white/10 backdrop-blur-2xl w-full max-w-xl rounded-[40px] shadow-2xl border border-white/20 p-10 flex flex-col relative animate-in zoom-in-95 duration-500 overflow-hidden group">
                
                {/* Progress Indicator - Top */}
                <div className="flex gap-1.5 mb-8 justify-center">
                    {DISCUSSION_FLOW.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${i === discoveryStep ? 'w-8 bg-[#0073ea]' : 'w-2 bg-white/10'}`}></div>
                    ))}
                </div>

                {/* Question Area & Neural Orb */}
                <div className="flex-1 flex flex-col items-center justify-center py-6">
                    <AnimatePresence mode="wait">
                        {!isVoiceActive ? (
                            <motion.div 
                                key="text-q"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="text-center w-full"
                            >
                                <div className="flex items-center justify-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-tr from-[#0073ea] to-[#00c875] rounded-xl flex items-center justify-center shadow-lg">
                                        <span className="material-symbols-outlined text-white text-[20px] animate-pulse">psychology</span>
                                    </div>
                                    <span className="text-white/40 text-[11px] font-black uppercase tracking-[0.4em]">Arkle Consultation</span>
                                </div>
                                <h2 className="text-[28px] font-black text-white leading-tight tracking-tight uppercase font-[Outfit] mb-10 px-4">
                                    {(currentQ as any).q}
                                </h2>

                                {/* Interaction Zone (Text/Choice) */}
                                <div className="w-full">
                                    {(currentQ as any).type === 'choice' ? (
                                        <div className="grid grid-cols-1 gap-3 px-2">
                                            {(currentQ as any).options.map((opt: any, idx: number) => (
                                                <button 
                                                    key={idx}
                                                    onClick={() => handlediscoveryAnswer(opt.label)}
                                                    className="group p-4 bg-white/5 hover:bg-white rounded-[22px] text-left transition-all border border-white/5 hover:border-white shadow-lg flex items-center gap-5 active:scale-95"
                                                >
                                                    <div className="w-10 h-10 bg-white/10 group-hover:bg-[#0073ea] group-hover:text-white rounded-xl flex items-center justify-center transition-all">
                                                        <span className="material-symbols-outlined text-white group-hover:text-white text-[20px]">{opt.icon}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[14px] font-black text-white group-hover:text-[#1c1f3b] uppercase tracking-tight">{opt.label}</h4>
                                                        <p className="text-[10px] text-white/30 group-hover:text-[#1c1f3b]/50 font-bold uppercase tracking-wider">{opt.desc}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="relative w-full px-2">
                                            <input 
                                                autoFocus
                                                className="w-full bg-white/5 border border-white/10 rounded-[25px] px-8 py-5 text-[18px] font-bold text-white outline-none focus:border-[#0073ea] transition-all placeholder-white/10 text-center font-[Outfit]"
                                                placeholder={(currentQ as any).placeholder}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handlediscoveryAnswer((e.target as any).value);
                                                        (e.target as any).value = "";
                                                    }
                                                }}
                                            />
                                            <button 
                                                onClick={() => {
                                                    const inp = (document.querySelector('input') as any);
                                                    if (inp) {
                                                        handlediscoveryAnswer(inp.value);
                                                        inp.value = "";
                                                    }
                                                }}
                                                className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0073ea] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">east</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="voice-q"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex flex-col items-center justify-center w-full"
                            >
                                {/* NEURAL ORB - LARGE INTEGRATED */}
                                <div className="relative mb-12 group cursor-pointer" onClick={() => { setIsVoiceActive(false); toggleVoice(); }}>
                                    <motion.div 
                                      animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                      className="absolute inset-0 bg-[#0073ea] rounded-full blur-[60px] -m-12"
                                    />
                                    <motion.div 
                                      animate={{ 
                                        borderRadius: ["40% 60% 70% 30%", "60% 40% 30% 70%", "40% 60% 70% 30%"],
                                        rotate: [0, 90, 0]
                                      }} 
                                      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                      className="w-40 h-40 bg-linear-to-tr from-[#0073ea] via-[#00c875] to-cyan-400 shadow-[0_0_100px_rgba(0,115,234,0.4)] border border-white/40 flex flex-col items-center justify-center overflow-hidden"
                                    >
                                       <span className="material-symbols-outlined text-white text-[60px] drop-shadow-2xl">graphic_eq</span>
                                    </motion.div>
                                </div>
                                
                                <div className="text-center space-y-4">
                                    <p className="text-[#0073ea] font-black text-[14px] uppercase tracking-[0.4em] animate-pulse">Neural Link Active</p>
                                    <h3 className="text-white text-[20px] font-black uppercase tracking-tight max-w-[340px] px-4 font-[Outfit]">
                                        {(currentQ as any).q}
                                    </h3>
                                    {liveTranscript ? (
                                         <p className="text-white/80 text-[14px] font-bold italic tracking-tight bg-white/5 py-3 px-6 rounded-2xl border border-white/10 animate-pulse">
                                             "{liveTranscript}"
                                         </p>
                                    ) : (
                                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Awaiting founder directive...</p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom Controls */}
                <div className="shrink-0 flex justify-between items-center mt-6 pt-6 border-t border-white/10">
                    <button 
                        onClick={() => setDiscoveryStep(prev => Math.max(0, (prev as any) - 1))}
                        disabled={discoveryStep === 0 || isVoiceActive}
                        className="text-[12px] font-black text-white/20 hover:text-white disabled:opacity-0 transition-colors uppercase tracking-[0.2em] flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[16px]">west</span>
                        Back
                    </button>

                    <button 
                        onClick={() => { setIsVoiceActive(!isVoiceActive); toggleVoice(); if (!isVoiceActive) speak(currentQ.q); }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all text-[11px] font-black uppercase tracking-widest shadow-xl transform active:scale-95 ${isVoiceActive ? 'bg-red-500 text-white animate-pulse shadow-red-500/20' : 'bg-white text-[#1c1f3b] hover:bg-[#0073ea] hover:text-white'}`}
                    >
                        <span className="material-symbols-outlined text-[20px]">{isVoiceActive ? 'mic_off' : 'mic'}</span>
                        {isVoiceActive ? 'Exit Talk Mode' : 'Talk with Arkle'}
                    </button>
                </div>

                {/* Subtle Background Accent */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all duration-1000"></div>
            </div>
        </div>
    );
};
