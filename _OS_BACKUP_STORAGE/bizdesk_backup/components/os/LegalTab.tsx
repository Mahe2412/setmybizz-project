"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgreementTemplate {
    id: string;
    name: string;
    description: string;
    icon: string;
    complexity: 'Low' | 'Medium' | 'High';
}

const TEMPLATES: AgreementTemplate[] = [
    { id: '1', name: 'Co-Founder Agreement', description: 'Define equity, vesting, and roles for Bharat founders.', icon: 'groups', complexity: 'High' },
    { id: '2', name: 'Standard NDA', description: 'Protect your IP during investor pitches.', icon: 'security', complexity: 'Low' },
    { id: '3', name: 'Service Agreement', description: 'Professional contract for client projects.', icon: 'description', complexity: 'Medium' },
    { id: '4', name: 'Employment Offer Letter', description: 'HSN/SAC compliant hiring document.', icon: 'person_add', complexity: 'Medium' },
];

export default function LegalTab() {
    const [selectedTemplate, setSelectedTemplate] = useState<AgreementTemplate | null>(null);
    const [isDrafting, setIsDrafting] = useState(false);

    const handleDraft = (template: AgreementTemplate) => {
        setSelectedTemplate(template);
        setIsDrafting(true);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-24 px-4">
            {/* SAIL Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-50 rounded-full blur-3xl -z-0" />
                <div className="relative z-10 text-center md:text-left">
                    <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="material-symbols-outlined text-purple-400">gavel</span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Legal & Strategy <span className="text-purple-600">SAIL</span> Node</h1>
                    </div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Strategic Arkle Intelligence & Legal (v1.0)</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-[2rem] text-white flex items-center gap-4 shadow-2xl">
                    <span className="material-symbols-outlined text-emerald-400 text-[32px] animate-pulse">verified</span>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Legal Integrity</p>
                        <p className="text-sm font-black italic">100% Compliant</p>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {isDrafting ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[3rem] border-2 border-purple-500 p-10 shadow-3xl shadow-purple-500/5 relative"
                    >
                        <button onClick={() => setIsDrafting(false)} className="absolute top-8 right-10 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900">Cancel Draft</button>
                        <div className="flex items-center gap-4 mb-10">
                            <span className="material-symbols-outlined text-[40px] text-purple-600">{selectedTemplate?.icon}</span>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Drafting: {selectedTemplate?.name}</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Arkle is synthesizing the legal clauses...</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 min-h-[300px] relative overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 4 }}
                                    className="absolute top-0 left-0 h-1 bg-purple-500"
                                />
                                <pre className="whitespace-pre-wrap font-serif text-sm text-slate-600 leading-relaxed italic">
                                    "This AGREEMENT is entered into on this ____ day of ____ 2026, by and between... 
                                    Arkle is generating terms for Intellectual Property Assignment and Vesting Schedules...
                                    Please provide Founding Member names to continue."
                                </pre>
                            </div>
                            
                            <div className="flex flex-col md:flex-row gap-4">
                                <button className="flex-1 bg-slate-900 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-purple-600 transition-all">Generate Full Draft</button>
                                <button className="px-10 py-5 border-2 border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:border-purple-200 hover:text-purple-600 transition-all">Human Review</button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Agreements Marketplace */}
                        <div className="space-y-6">
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] border-l-4 border-purple-600 pl-4 leading-none">Agreement Factory</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {TEMPLATES.map(t => (
                                    <div 
                                        key={t.id} 
                                        onClick={() => handleDraft(t)}
                                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                                                <span className="material-symbols-outlined text-[24px]">{t.icon}</span>
                                            </div>
                                            <div>
                                                <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{t.name}</h4>
                                                <p className="text-[10px] font-medium text-slate-400 mt-1 max-w-[200px]">{t.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-center px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-purple-50 transition-all">
                                            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Complexity</p>
                                            <p className={`text-[10px] font-black uppercase ${t.complexity === 'High' ? 'text-red-500' : 'text-emerald-500'}`}>{t.complexity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Arkle Legal Watch (Real-time Audit) */}
                        <div className="space-y-6">
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] border-l-4 border-amber-600 pl-4 leading-none">Neural Legal Watch</h3>
                            <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden min-h-[400px]">
                                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-purple-600/20 rounded-full blur-[60px]" />
                                <div className="space-y-8 relative z-10">
                                    <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                                        <span className="text-3xl">🛡️</span>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Trademark Status</p>
                                            <h4 className="text-xl font-black italic">SetMyBizz (Applied)</h4>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                            <span className="material-symbols-outlined text-amber-500">info</span>
                                            <p className="text-xs font-medium leading-relaxed opacity-80 italic">"Mahendra, your ROC filing for FY25 is coming up in 45 days. I recommend drafting the Director’s Report by end of month."</p>
                                        </div>
                                        <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                            <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                                            <p className="text-xs font-medium leading-relaxed opacity-80 italic">"All vendor contracts are currently valid. No termination risks detected."</p>
                                        </div>
                                    </div>

                                    <button className="w-full mt-6 py-5 bg-white text-slate-900 rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-slate-50 transition-all">Start Compliance Audit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
