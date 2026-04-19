import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, X, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { BusinessData } from '../../types';

interface ArkleGreetingProps {
    data: BusinessData;
}

const ArkleGreeting: React.FC<ArkleGreetingProps> = ({ data }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);

    const messages = [
        `Hello ${data.userName || 'Founder'}! Your Neural BizOS is initialized.`,
        `I have mapped your trajectory for "${data.name || 'Your Business'}".`,
        `Your first mission: Activate the ${data.stage === 'idea' ? 'Legal Birth' : 'Compliance Shield'} module.`,
        `Shall we begin the installation?`
    ];

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const nextMessage = () => {
        if (messageIndex < messages.length - 1) {
            setMessageIndex(prev => prev + 1);
        } else {
            setIsVisible(false);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-8 right-8 z-[100] w-full max-w-sm"
                >
                    <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden backdrop-blur-xl">
                        {/* Glowing Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <button 
                            onClick={() => setIsVisible(false)}
                            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Bot className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h4 className="font-black text-sm uppercase tracking-widest text-blue-400">Arkle AI</h4>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Neural Core Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="min-h-[60px] mb-6">
                            <motion.p 
                                key={messageIndex}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-sm font-bold leading-relaxed text-slate-200"
                            >
                                {messages[messageIndex]}
                            </motion.p>
                        </div>

                        <button 
                            onClick={nextMessage}
                            className="w-full py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-50 transition-all shadow-xl"
                        >
                            {messageIndex === messages.length - 1 ? 'Start Mission' : 'Continue'} <ArrowRight className="w-4 h-4" />
                        </button>

                        <div className="mt-4 flex items-center justify-center gap-2 opacity-30">
                            <Zap className="w-3 h-3" />
                            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Neural Link Encrypted</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ArkleGreeting;
