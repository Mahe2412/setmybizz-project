import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle2, ArrowRight, Loader2, Sparkles, 
    ShieldCheck, Zap, Globe2, Cpu, 
    FileText, User, Mail, Phone, Lock,
    CheckSquare
} from 'lucide-react';
import { BusinessData } from '../../types';

import { signInWithGoogle } from '../../lib/firebase';
import { saveBusinessProfile } from '../../lib/db';

interface SummaryStepProps {
    data: BusinessData;
    onBack: () => void;
    onDashboard: () => void;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ data, onBack, onDashboard }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [isLeadCaptured, setIsLeadCaptured] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [formData, setFormData] = useState({ 
        name: data.userName || '', 
        email: data.email || '', 
        phone: data.phone || '' 
    });

    // Simulate AI Analysis
    useEffect(() => {
        const interval = setInterval(() => {
            setAnalysisProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsAnalyzing(false), 800);
                    return 100;
                }
                return prev + 1.5;
            });
        }, 30);
        return () => clearInterval(interval);
    }, []);

    const handleGoogleSignIn = async () => {
        try {
            setIsSyncing(true);
            const { user } = await signInWithGoogle();
            if (user) {
                // Sync the onboarding data to the new user profile
                await saveBusinessProfile(user.uid, {
                    ...data,
                    userName: user.displayName || data.userName,
                    email: user.email || data.email,
                });
                setIsLeadCaptured(true);
                setTimeout(() => onDashboard(), 1500);
            }
        } catch (error) {
            console.error("Auth/Sync failed", error);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSyncing(true);
            // Simulate manual lead capture success
            setIsLeadCaptured(true);
            setTimeout(() => onDashboard(), 2000);
        } catch (error) {
            console.error("Lead capture failed", error);
        } finally {
            setIsSyncing(false);
        }
    };

    const modules = data.stage === 'idea' ? [
        { id: 'incorp', title: 'Legal Birth (Incorporation)', desc: 'Pvt Ltd / LLP official registration protocols.', status: 'Ready to Install', icon: FileText, color: 'blue' },
        { id: 'gst', title: 'Tax Identity (GST)', desc: 'GST / MSME / Udyam government ID setup.', status: 'Ready to Install', icon: ShieldCheck, color: 'indigo' },
        { id: 'brand', title: 'Neural Brand Kit', desc: 'AI-generated branding & digital core.', status: 'Ready to Install', icon: Sparkles, color: 'amber' }
    ] : [
        { id: 'global', title: 'Global Access Module', desc: 'US/UK Entity & Export license connectivity.', status: 'Ready to Install', icon: Globe2, color: 'blue' },
        { id: 'compliance', title: 'Compliance Shield', desc: 'Advanced tax audit & annual filing automation.', status: 'Ready to Install', icon: ShieldCheck, color: 'indigo' },
        { id: 'auto', title: 'OS Automation', desc: 'Automating Sales, CRM, and WhatsApp workflows.', status: 'Ready to Install', icon: Cpu, color: 'emerald' }
    ];

    return (
        <div className="w-full flex flex-col items-center justify-center max-w-5xl mx-auto px-4 mt-8 relative">
            
            <AnimatePresence mode="wait">
                {isAnalyzing ? (
                    /* STAGE 1: AI ANALYSIS ANIMATION (PREMIUM) */
                    <motion.div 
                        key="analyzing"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="w-full max-w-2xl bg-white border border-slate-100 shadow-[0_20px_80px_rgba(0,0,0,0.05)] rounded-[3rem] p-16 text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white pointer-events-none"></div>
                        <div className="mb-12 relative inline-block">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-10 border border-blue-100 rounded-full border-dashed opacity-50"
                            />
                            <motion.div 
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center relative z-10 shadow-2xl shadow-blue-500/30"
                            >
                                <Cpu className="w-12 h-12 text-white" />
                            </motion.div>
                        </div>
                        
                        <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">
                            Neural Processing <br/> <span className="text-blue-600 italic">Core Initialized</span>
                        </h2>
                        
                        <div className="w-full max-w-sm mx-auto bg-slate-100 h-3 rounded-full overflow-hidden mb-6 relative">
                            <motion.div 
                                className="h-full bg-blue-600"
                                initial={{ width: "0%" }}
                                animate={{ width: `${analysisProgress}%` }}
                            />
                        </div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">
                            Mapping {Math.floor(analysisProgress)}% • Constructing Blueprint
                        </p>
                    </motion.div>
                ) : (
                    /* STAGE 2: THE BLUEPRINT & PREMIUM SIGN-UP */
                    <motion.div 
                        key="blueprint"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full bg-white border border-white/80 shadow-[0_40px_100px_rgba(0,0,0,0.06)] rounded-[3rem] overflow-hidden backdrop-blur-3xl"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
                            
                            {/* LEFT PANEL: THE BLUEPRINT (60%) */}
                            <div className="lg:col-span-7 p-10 md:p-16 border-r border-slate-100">
                                <div className="mb-12">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm">
                                        <CheckSquare className="w-3.5 h-3.5" /> Discovery Verified
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[0.95] tracking-tighter">
                                        Your Neural <br/> <span className="text-blue-600">BizOS Blueprint</span>
                                    </h2>
                                </div>

                                <div className="space-y-6 max-w-xl">
                                    {modules.map((mod, i) => (
                                        <motion.div 
                                            key={mod.id}
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.15 }}
                                            className="flex items-start gap-6 p-6 rounded-3xl bg-slate-50/50 border border-slate-100 group hover:bg-white hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500"
                                        >
                                            <div className={`w-14 h-14 rounded-2xl bg-white text-blue-600 shadow-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                                                <mod.icon className="w-7 h-7" strokeWidth={1.5} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm">{mod.title}</h4>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">{mod.status}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium leading-relaxed group-hover:text-slate-700 transition-colors">{mod.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                
                                <div className="mt-12 pt-8 border-t border-slate-50 flex items-center gap-6">
                                    <div className="flex -space-x-3">
                                        {[1,2,3,4].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-black">F{i}</div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Join 1,000+ Founders launching today
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT PANEL: PREMIUM CAPTURE/AUTH (40%) */}
                            <div className="lg:col-span-5 bg-slate-900 p-10 md:p-16 flex flex-col justify-center relative overflow-hidden">
                                {/* Decorative Glow */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/20 rounded-full blur-[80px] pointer-events-none"></div>

                                {!isLeadCaptured ? (
                                    <div className="relative z-10 space-y-10">
                                        <div className="text-center">
                                            <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter">Claim Dashboard</h3>
                                            <p className="text-xs text-slate-400 font-bold leading-relaxed px-4">
                                                Finalize your account to activate the blueprint and enter your AI Workspace.
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <button 
                                                onClick={handleGoogleSignIn}
                                                disabled={isSyncing}
                                                className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50"
                                            >
                                                {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />}
                                                {isSyncing ? "Syncing..." : "Sign up with Google"}
                                            </button>
                                            
                                            <div className="flex items-center gap-4 py-2">
                                                <div className="flex-1 h-px bg-white/10"></div>
                                                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">OR USE EMAIL</span>
                                                <div className="flex-1 h-px bg-white/10"></div>
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                    <input 
                                                        type="text" 
                                                        placeholder="Founder Name" 
                                                        required
                                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/40 focus:outline-none font-bold text-sm text-white placeholder:text-white/20"
                                                        value={formData.name}
                                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                    <input 
                                                        type="email" 
                                                        placeholder="Business Email" 
                                                        required
                                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/40 focus:outline-none font-bold text-sm text-white placeholder:text-white/20"
                                                        value={formData.email}
                                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                                    <input 
                                                        type="tel" 
                                                        placeholder="WhatsApp Number" 
                                                        required
                                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/40 focus:outline-none font-bold text-sm text-white placeholder:text-white/20"
                                                        value={formData.phone}
                                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                                    />
                                                </div>

                                                <button 
                                                    type="submit"
                                                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/40 hover:bg-blue-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mt-4"
                                                >
                                                    Finalize & Initialize <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </div>

                                        <p className="text-[9px] text-slate-500 font-black text-center flex items-center justify-center gap-2 uppercase tracking-widest">
                                            <Lock className="w-3 h-3 text-blue-500" /> AES-256 Neural Encryption
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center py-10 relative z-10">
                                        <motion.div 
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="w-24 h-24 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20"
                                        >
                                            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                                        </motion.div>
                                        <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">Authorized</h3>
                                        <p className="text-sm text-slate-400 font-bold mb-10">Your Neural BizDesk is now active.</p>
                                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <footer className="mt-12 opacity-30 text-center">
                <span className="text-[10px] font-black tracking-[0.5em] text-slate-600 uppercase">
                    Neural Engine Core • Auth Protocol v2.0
                </span>
            </footer>
        </div>
    );
};

export default SummaryStep;
