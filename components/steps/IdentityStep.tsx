import React from 'react';
import { motion } from 'framer-motion';
import { BusinessData } from '../../types';
import { User, Mail, Phone, ChevronRight, ChevronLeft, Sparkles, ShieldCheck } from 'lucide-react';

interface IdentityStepProps {
    data: BusinessData;
    updateData: (newData: Partial<BusinessData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const IdentityStep: React.FC<IdentityStepProps> = ({ data, updateData, onNext, onBack }) => {
    const isReady = data.userName && data.email && data.phone;

    return (
        <div className="w-full flex flex-col items-center justify-center max-w-4xl mx-auto px-4 mt-8 relative">
            
            {/* Soft Decorative Backgrounds */}
            <div className="absolute top-0 -left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[90px] pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full bg-white border border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.03)] rounded-[3rem] p-10 md:p-16 relative overflow-hidden backdrop-blur-xl"
            >
                <div className="flex flex-col items-center justify-center relative z-10">
                    
                    {/* Header Discovery */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/50 border border-blue-100 text-blue-700 text-[10px] font-black tracking-[0.2em] uppercase mb-4 shadow-sm">
                            <Sparkles className="w-3 h-3" /> Step 2: Neural Identity
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-4">
                            Connect your <span className="text-blue-600 italic">Foundation</span>
                        </h1>
                        <p className="text-slate-500 text-base font-medium max-w-md mx-auto">
                            Arkle needs your founder identity to secure your dashboard and automate your compliance.
                        </p>
                    </div>

                    {/* Identity Form */}
                    <div className="w-full max-w-md space-y-5 mb-12">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600/40" />
                            <input 
                                type="text" 
                                placeholder="Founder Full Name" 
                                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-bold text-slate-700"
                                value={data.userName || ''}
                                onChange={e => updateData({ userName: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600/40" />
                            <input 
                                type="email" 
                                placeholder="Business Email Address" 
                                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-bold text-slate-700"
                                value={data.email || ''}
                                onChange={e => updateData({ email: e.target.value })}
                            />
                        </div>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600/40" />
                            <input 
                                type="tel" 
                                placeholder="WhatsApp Number" 
                                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-bold text-slate-700"
                                value={data.phone || ''}
                                onChange={e => updateData({ phone: e.target.value })}
                            />
                        </div>
                        
                        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-700 text-[10px] font-bold">
                            <ShieldCheck className="w-4 h-4 shrink-0" /> Your data is encrypted with AES-256 protocols.
                        </div>
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
                            disabled={!isReady}
                            className={`flex-[2] flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all ${!isReady ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/20'}`}
                        >
                            Connect Identity <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default IdentityStep;
