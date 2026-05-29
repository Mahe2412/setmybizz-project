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
    
    // Form Inputs
    const [partyA, setPartyA] = useState('');
    const [partyB, setPartyB] = useState('');
    const [extraTerms, setExtraTerms] = useState('');
    const [generatedText, setGeneratedText] = useState<string | null>(null);
    const [loadingText, setLoadingText] = useState(false);

    const handleStartDraft = (template: AgreementTemplate) => {
        setSelectedTemplate(template);
        setGeneratedText(null);
        setPartyA('');
        setPartyB('');
        setExtraTerms('');
        setIsDrafting(true);
    };

    const handleGenerateContract = (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingText(true);
        setTimeout(() => {
            const pA = partyA || 'Sri Lakshmi Enterprises';
            const pB = partyB || 'Partner Corp';
            const terms = extraTerms || 'No additional parameters provided.';
            
            let resultText = '';
            if (selectedTemplate?.id === '1') {
                resultText = `CO-FOUNDER AGREEMENT\n\nThis Agreement is entered on May 21, 2026, by and between:\n1. Founder A: ${pA}\n2. Founder B: ${pB}\n\n1. Equity split is allocated as 50% / 50% between Founder A and Founder B.\n2. Both founders agree to a 4-year vesting schedule with a 1-year cliff.\n3. Special Directives: ${terms}\n\nSigned,\n[Founder A Signature]\n[Founder B Signature]`;
            } else if (selectedTemplate?.id === '2') {
                resultText = `MUTUAL NON-DISCLOSURE AGREEMENT\n\nThis Agreement is between:\nParty A: ${pA}\nParty B: ${pB}\n\n1. Both parties agree that all shared technological blueprints, pricing models, and IP shall remain confidential.\n2. Neither party will disclose or use this information outside of mutual integration efforts.\n3. Additional Terms: ${terms}\n\nSigned by representatives.`;
            } else if (selectedTemplate?.id === '3') {
                resultText = `MASTER SERVICE AGREEMENT\n\nThis Service SLA is between:\nClient: ${pA}\nService Provider: ${pB}\n\n1. Services: The provider agrees to deliver software and operational modules as specified in SOW-01.\n2. Payment: Fees paid within 30 days of monthly invoice generation.\n3. SLA stipulations: ${terms}\n\nApproved on behalf of both parties.`;
            } else {
                resultText = `EMPLOYMENT OFFER LETTER\n\nDate: May 21, 2026\nTo: ${pB}\nFrom: ${pA}\n\nDear Candidate,\nWe are pleased to offer you the position of Startup Operator. Your annual compensation package will be as discussed, subject to tax withholding.\nSpecial terms: ${terms}\n\nBest regards,\nHR Desk, ${pA}`;
            }
            setGeneratedText(resultText);
            setLoadingText(false);
        }, 1500);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-24 px-4">
            {/* SAIL Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
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
                        className="bg-white rounded-[3rem] border-2 border-indigo-600 p-8 shadow-xl relative"
                    >
                        <button onClick={() => setIsDrafting(false)} className="absolute top-6 right-8 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900">✕ Close</button>
                        
                        <div className="flex items-center gap-4 mb-8">
                            <span className="material-symbols-outlined text-[40px] text-indigo-600">{selectedTemplate?.icon}</span>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Drafting: {selectedTemplate?.name}</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Fill the parameters to compile the agreement text.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <form onSubmit={handleGenerateContract} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">First Party / Discloser / Employer</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. Sri Lakshmi Enterprises"
                                        value={partyA}
                                        onChange={(e) => setPartyA(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Second Party / Receiver / Candidate</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. Rajesh Kumar"
                                        value={partyB}
                                        onChange={(e) => setPartyB(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Custom Clauses & Additional Terms</label>
                                    <textarea 
                                        rows={3}
                                        placeholder="e.g. Non-compete period is 12 months."
                                        value={extraTerms}
                                        onChange={(e) => setExtraTerms(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none leading-relaxed"
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
                                >
                                    {loadingText ? 'Arkle Composing Clauses...' : 'Generate Full Agreement'}
                                </button>
                            </form>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[300px]">
                                {generatedText ? (
                                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                                        <pre className="text-xs text-slate-700 font-mono overflow-y-auto max-h-[220px] whitespace-pre-wrap leading-relaxed bg-white p-4 rounded-xl border border-slate-150">{generatedText}</pre>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => { navigator.clipboard.writeText(generatedText); alert("Copied to clipboard!"); }}
                                                className="flex-1 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-indigo-600 transition-colors"
                                            >
                                                📋 Copy Document
                                            </button>
                                            <button 
                                                onClick={() => alert("Agreement saved successfully!")}
                                                className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                Save as PDF
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                                        <span className="material-symbols-outlined text-slate-300 text-3xl mb-2 font-light">gavel</span>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Agreement Draft Preview</p>
                                        <p className="text-[11px] text-slate-500 max-w-[220px]">Click the "Generate" button on the left to see the drafted document terms.</p>
                                    </div>
                                )}
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
                                        onClick={() => handleStartDraft(t)}
                                        className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group cursor-pointer flex items-center justify-between"
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

                                    <button 
                                        onClick={() => alert("Launching overall compliance audit for your GST and corporate entities...")}
                                        className="w-full mt-6 py-5 bg-white text-slate-900 rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-slate-50 transition-all"
                                    >
                                        Start Compliance Audit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
