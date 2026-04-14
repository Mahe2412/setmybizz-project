import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CORE_SERVICES, PACKAGE_OPTIONS } from '../../lib/pricingConfig';
import { PlusCircle, CheckCircle2, ShoppingCart, Users, Star, ArrowRight, ShieldCheck, Zap, Sparkles, MessageSquare, Briefcase, Rocket, Globe } from 'lucide-react';

const StartupStoreTab: React.FC = () => {
    const [cart, setCart] = useState<any[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
    
    const toggleCartItem = (service: any) => {
        setCart(prev => {
            const exists = prev.find(item => item.id === service.id);
            if (exists) return prev.filter(item => item.id !== service.id);
            return [...prev, service];
        });
    };

    const isInCart = (id: string) => cart.some(item => item.id === id);

    return (
        <div className="h-full flex flex-col bg-slate-50 no-scrollbar overflow-y-auto">
            {/* ─── HEADER ─── */}
            <div className="shrink-0 p-8 md:p-12 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
                                <ShoppingCart className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational OS</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Startup Store</h1>
                        <p className="text-slate-500 font-medium text-lg">Source custom business protocols and professional consultations.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none">Verified Compliance Experts</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-8 md:p-12">
                <div className="max-w-7xl mx-auto space-y-20">
                    
                    {/* ─── CUSTOM PACKAGES SECTION (NO PRICES) ─── */}
                    <div className="space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="h-0.5 w-12 bg-blue-600 rounded-full" />
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Ready-to-go Packs</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {PACKAGE_OPTIONS.map((pkg) => (
                                <motion.div 
                                    key={pkg.id}
                                    whileHover={{ y: -10 }}
                                    className={`relative flex flex-col bg-white border-2 rounded-[40px] overflow-hidden transition-all duration-300 ${selectedPackage === pkg.id ? 'border-blue-600 shadow-2xl' : 'border-slate-100 shadow-xl shadow-slate-200/50 hover:border-blue-200'}`}
                                >
                                    <div className={`p-8 ${pkg.bg || 'bg-slate-50'} border-b border-slate-100`}>
                                        <h4 className={`text-xl font-black ${pkg.textColor || 'text-slate-900'} mb-1`}>{pkg.name}</h4>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pkg.ideal}</div>
                                    </div>
                                    <div className="p-8 flex-grow flex flex-col">
                                        <ul className="space-y-4 mb-8 flex-grow">
                                            {pkg.features.map((f, i) => (
                                                <li key={i} className="flex items-start gap-3 text-[13px] text-slate-600 font-bold">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <button 
                                            onClick={() => setSelectedPackage(pkg.id === selectedPackage ? null : pkg.id)}
                                            className={`w-full py-5 rounded-[22px] font-black text-[11px] uppercase tracking-widest transition-all shadow-xl ${selectedPackage === pkg.id ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                        >
                                            {selectedPackage === pkg.id ? 'Bundle Selected' : 'Select Bundle'}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* ─── INDIVIDUAL SERVICES GRID (NO PRICES) ─── */}
                    <div className="space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="h-0.5 w-12 bg-slate-900 rounded-full" />
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Individual Protocols</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {CORE_SERVICES.map((service) => (
                                <motion.div 
                                    key={service.id}
                                    whileHover={{ y: -5 }}
                                    className={`bg-white border rounded-[30px] p-6 transition-all cursor-pointer group flex flex-col justify-between h-full ${isInCart(service.id) ? 'border-slate-900 ring-4 ring-slate-900/5 shadow-2xl' : 'border-slate-200 hover:border-slate-400'}`}
                                    onClick={() => toggleCartItem(service)}
                                >
                                    <div>
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${service.colors}`}>
                                            <service.icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">{service.category}</span>
                                        <h3 className="text-[16px] font-black text-slate-900 leading-tight mb-3">{service.title}</h3>
                                        <p className="text-slate-500 text-[11px] font-medium leading-relaxed line-clamp-2">{service.desc}</p>
                                    </div>
                                    <div className="mt-8 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Sourcing</span>
                                        <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isInCart(service.id) ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white'}`}>
                                            {isInCart(service.id) ? <CheckCircle2 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* ─── BOOK PROFESSIONS SECTION (REMAINING) ─── */}
                    <div className="pt-20 border-t border-slate-200">
                        <div className="mb-12 text-center space-y-2">
                             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 rounded-full text-[9px] font-black text-white uppercase tracking-[0.25em] mb-4">Elite Access</div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Professional Consultation</h2>
                            <p className="text-slate-500 font-medium text-lg">Direct access to verified experts for complex mission directives.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[
                                { title: 'Legal Counsel', type: 'CA / SC Lawyer', icon: ShieldCheck, color: 'from-blue-600 to-indigo-700' },
                                { title: 'Compliance Lead', type: 'Expert CS', icon: Zap, color: 'from-purple-600 to-pink-700' },
                                { title: 'Startup Mentor', type: 'Strategy Lead', icon: Sparkles, color: 'from-orange-500 to-red-600' }
                            ].map((prof, i) => (
                                <motion.div 
                                    key={i}
                                    whileHover={{ y: -8 }}
                                    className="relative bg-slate-900 rounded-[48px] p-10 overflow-hidden group border border-slate-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] h-full"
                                >
                                    <div className={`absolute top-0 right-0 w-40 h-40 bg-linear-to-bl ${prof.color} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity`} />
                                    
                                    <div className="relative z-10 h-full flex flex-col items-center text-center">
                                        <div className="w-20 h-20 rounded-[32px] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-8 shadow-2xl group-hover:rotate-6 transition-transform">
                                            <prof.icon className="w-10 h-10 text-white" />
                                        </div>
                                        <span className="text-[11px] font-black text-white/50 uppercase tracking-[0.3em] mb-3">{prof.type}</span>
                                        <h4 className="text-2xl font-black text-white mb-10 leading-tight">{prof.title}</h4>
                                        <button className="mt-auto w-full py-6 bg-white text-slate-900 rounded-[30px] font-black text-[12px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95">
                                            Request Session <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── SELECTION FOOTER (LITE THEME) ─── */}
            <AnimatePresence>
                {(cart.length > 0 || selectedPackage) && (
                    <motion.div 
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="sticky bottom-8 mx-auto mb-8 w-[95%] max-w-4xl z-50 px-8 py-5 bg-white border border-slate-200 text-slate-900 rounded-[35px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] flex items-center justify-between gap-6 backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-900/10">
                                <PlusCircle className="w-6 h-6 text-white" />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="text-base font-black">Ready for Deployment</h4>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                    {selectedPackage ? 'Package + ' : ''} {cart.length} Protocols selected
                                </p>
                            </div>
                        </div>

                        <button className="px-10 py-5 bg-blue-600 text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3 group">
                            Finalize Portfolio <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StartupStoreTab;
