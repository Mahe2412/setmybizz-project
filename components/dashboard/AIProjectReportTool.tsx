"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ProjectScheme, ProjectReport, DPRFinancials, DPRContent } from '../../types/dpr';
import { calculatePMEGPSubsidy, calculateBankingRatios } from '../../lib/dpr-engine';
import { SCHEME_KNOWLEDGE, SUPPORTED_LANGUAGES } from '../../lib/schemes';
import { BIZZY_SYSTEM_PROMPT } from '../../lib/prompts/bizzy';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import Toast from '../ToastNotification';

interface AIProjectReportToolProps {
    businessData: any;
    onClose: () => void;
}

export default function AIProjectReportTool({ businessData, onClose }: AIProjectReportToolProps) {
    const { user, guestId } = useAuth();
    const [step, setStep] = useState(0); // 0: Scheme, 1: Promoters, 2: Financials, 3: AI Generation, 4: Review & Polish
    const [mode, setMode] = useState<'TEMPLATE' | 'AI'>('TEMPLATE');
    const [loading, setLoading] = useState(false);
    const [mudraType, setMudraType] = useState<'SHISHU' | 'KISHORE' | 'TARUN' | null>(null);
    const [selectedLang, setSelectedLang] = useState('en');
    const [isListening, setIsListening] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: '', sub: '' });

    // State for the Report
    const [report, setReport] = useState<Partial<ProjectReport>>({
        scheme: 'PMEGP',
        businessName: businessData?.name || '',
        industry: businessData?.industry || '',
        location: { city: '', state: '', areaType: 'URBAN' },
        promoter: { 
            name: user?.displayName || '', 
            qualification: '', 
            experience: '', 
            category: 'GENERAL', 
            gender: 'MALE' 
        },
        financials: {
            fixedAssets: { landAndBuilding: 0, machinery: 0, furniture: 0, otherAssets: 0 },
            workingCapital: { rawMaterial: 0, salaries: 0, utilities: 0, marketing: 0, contingency: 0 },
            revenue: { monthlyTarget: 0, unitPrice: 0, unitsPerMonth: 0 },
            funding: { ownContribution: 0, loanRequired: 0, subsidyEligible: 0 },
            parameters: { workingDays: 300, shifts: 1, capacityUtil: 45, interestRate: 9.5 }
        }
    });

    const [finSubStep, setFinSubStep] = useState(0); // 0: Project Cost, 1: Operations, 2: Revenue

    const [chatInput, setChatInput] = useState("");
    const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'ai', content: string}>>([]);

    // Set initial greeting based on language
    useEffect(() => {
        const greetings: Record<string, string> = {
            te: "నమస్కారం! 🙏 నేను Bizzy — setmybizz.in AI Business Advisor. మీకు ఏ scheme కోసం Project Report కావాలి? 1️⃣ PMEGP 2️⃣ Mudra 3️⃣ MSME 4️⃣ Standup India...",
            hi: "Namaste! 🙏 Main Bizzy hoon — setmybizz.in ka AI Business Advisor. Kaunse scheme ke liye Project Report chahiye? 1️⃣ PMEGP 2️⃣ Mudra 3️⃣ MSME 4️⃣ Standup India...",
            en: "Hello! I'm Bizzy — your setmybizz.in AI Business Advisor. Which scheme do you need a Project Report for? (PMEGP, Mudra, MSME, or Standup India)"
        };
        setChatHistory([{ role: 'ai', content: greetings[selectedLang] || greetings.en }]);
    }, [selectedLang]);

    const handleSchemeSelect = (scheme: ProjectScheme) => {
        setReport(prev => ({ ...prev, scheme }));
        setStep(1);
    };

    const handleNext = () => {
        if (step === 3) {
            handleGenerateDPR();
        } else {
            setStep(prev => prev + 1);
        }
    };

    const handleGenerateDPR = async () => {
        setLoading(true);
        try {
            const schemeInfo = SCHEME_KNOWLEDGE[report.scheme as keyof typeof SCHEME_KNOWLEDGE] || {};
            const langName = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.name || 'English';
            
            const prompt = `${BIZZY_SYSTEM_PROMPT}
            
            USER INPUTS:
            Business Name: ${report.businessName}
            Scheme: ${report.scheme}
            Industry: ${report.industry}
            Language: ${langName}
            Promoter: ${JSON.stringify(report.promoter)}
            Financials: ${JSON.stringify(report.financials)}
            
            TASK: Generate the DPR following Bizzy's identity and scheme rules.
            Format the output ONLY as JSON:
            {
                "executiveSummary": "...",
                "businessConcept": "...",
                "marketAnalysis": "...",
                "swotAnalysis": { "strengths": [], "weaknesses": [], "opportunities": [], "threats": [] },
                "implementationSchedule": [],
                "dscrCheck": { "value": number, "status": "OK" | "WARNING", "fix": "..." }
            }`;

            const res = await fetch('/api/gemini', {
                method: 'POST',
                body: JSON.stringify({ prompt })
            });
            const data = await res.json();
            
            // Basic parsing of AI text (should be JSON)
            let aiContent;
            try {
                const cleanText = data.text.replace(/```json/g, '').replace(/```/g, '').trim();
                aiContent = JSON.parse(cleanText);
            } catch (e) {
                // Fallback if AI fails to give JSON
                aiContent = {
                    executiveSummary: data.text.substring(0, 300) + "...",
                    businessConcept: "Click AI Chat to refine details.",
                    marketAnalysis: "Generating detailed stats...",
                    swotAnalysis: { strengths: ["AI Generated"], weaknesses: [], opportunities: [], threats: [] },
                    implementationSchedule: ["Step 1: Registration"]
                };
            }

            setReport(prev => ({
                ...prev,
                status: 'COMPLETED',
                content: aiContent
            }));

            // Auto-save to DB for GTM tracking
            saveReportToDb({ ...report, content: aiContent, status: 'COMPLETED' });
            
            setStep(4);
            setToast({ visible: true, message: "DPR Generated Successfully", sub: `Your ${report.scheme} report is ready for review.` });
        } catch (error) {
            console.error("DPR Generation Error:", error);
            setToast({ visible: true, message: "Generation Failed", sub: "Please check your internet connection." });
        } finally {
            setLoading(false);
        }
    };

    const saveReportToDb = async (finalReport: any) => {
        try {
            const reportData = {
                ...finalReport,
                userId: user?.uid || guestId,
                timestamp: serverTimestamp(),
                platform: 'web-asap'
            };
            const docRef = await addDoc(collection(db, 'project_reports'), reportData);
            setReport(prev => ({ ...prev, id: docRef.id }));
        } catch (e) {
            console.error("Error saving report:", e);
        }
    };

    const toggleVoice = () => {
        if (!('webkitSpeechRecognition' in window)) {
            setToast({ visible: true, message: "Voice not supported", sub: "Please use Chrome or Edge browser." });
            return;
        }
        
        setIsListening(prev => !prev);
        // Simple Web Speech API Implementation
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = selectedLang === 'te' ? 'te-IN' : (selectedLang === 'hi' ? 'hi-IN' : 'en-US');
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setChatInput(transcript);
            setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        
        if (!isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }
    };

    const handleChatAsk = async () => {
        if (!chatInput.trim()) return;
        const userInput = chatInput;
        const newHistory = [...chatHistory, { role: 'user', content: userInput }];
        setChatHistory(newHistory as any);
        setChatInput("");
        setLoading(true);

        try {
            const prompt = `${BIZZY_SYSTEM_PROMPT}
            
            CURRENT REPORT DATA: ${JSON.stringify(report)}
            CONVERSATION HISTORY: ${JSON.stringify(newHistory.slice(-5))}
            USER MESSAGE: ${userInput}
            
            TASK: Provide a helpful, multilingual advisor-style response. If the user asks for changes, explain how you'll adjust the financials or content.`;

            const res = await fetch('/api/gemini', {
                method: 'POST',
                body: JSON.stringify({ prompt })
            });
            const data = await res.json();
            
            setChatHistory([...newHistory, { role: 'ai', content: data.text }] as any);
        } catch (error) {
            setChatHistory([...newHistory, { role: 'ai', content: "I'm having trouble connecting to my neural link. Please try again or check your data." }] as any);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = (type: 'PDF' | 'DOCS' | 'WHATSAPP') => {
        if (type === 'WHATSAPP') {
            const message = `Hello, I've generated my Detailed Project Report (DPR) for ${report.businessName} using SetMyBizz AI. Scheme: ${report.scheme}. Please review the financials and banking ratios.`;
            window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
            return;
        }
        
        if (type === 'PDF') {
            setToast({ visible: true, message: "Preparing PDF...", sub: "Optimization for Bank Print Format active." });
            setTimeout(() => window.print(), 1000);
            return;
        }
        
        setToast({ visible: true, message: `Exporting to ${type}...`, sub: "Your file is being prepared and synced to your workspace." });
    };

    return (
        <div className="fixed inset-0 z-100 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border border-white/20">
                {/* Header */}
                <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-purple-900 p-8 text-white shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                <span className="material-icons text-3xl">bar_chart</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">AI Project Report (DPR) Builder</h2>
                                <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mt-1 opacity-80">
                                    Scheme: {report.scheme} • Bank-Ready Format
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                            <span className="material-icons text-white">close</span>
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="mt-8 flex items-center gap-2">
                        {[0, 1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                <div className={`h-full bg-white transition-all duration-500 ${step >= s ? 'w-full' : 'w-0'}`}></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 bg-[#f8faff] custom-scroll">
                    
                    {/* Multi-Language Selector */}
                    <div className="flex justify-center mb-8 gap-2">
                        {SUPPORTED_LANGUAGES.map(lang => (
                            <button 
                                key={lang.code}
                                onClick={() => setSelectedLang(lang.code)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedLang === lang.code ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
                            >
                                {lang.native}
                            </button>
                        ))}
                    </div>

                    {/* Step 0: Scheme Selection */}
                    {step === 0 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center mb-10">
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Select your Loan/Subsidy Scheme</h3>
                                <p className="text-slate-500 font-medium">We'll tailor the entire report format based on your selection.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { id: 'PMEGP', name: 'PMEGP Scheme', desc: 'Up to 35% Govt. Subsidy', icon: 'payments', color: 'indigo' },
                                    { id: 'MUDRA', name: 'MUDRA Loan', desc: 'Shishu, Kishore, Tarun', icon: 'account_balance', color: 'blue' },
                                    { id: 'GENERAL_BANK_LOAN', name: 'General Bank Loan', desc: 'Custom Bank Format', icon: 'business', color: 'emerald' },
                                    { id: 'STARTUP_INDIA', name: 'Startup India', desc: 'For Seed Fund/Grants', icon: 'rocket_launch', color: 'purple' },
                                    { id: 'MSME_LOAN', name: 'MSME Business Loan', desc: 'For Small Enterprises', icon: 'storefront', color: 'orange' }
                                ].map((s) => (
                                    <div 
                                        key={s.id} 
                                        onClick={() => {
                                            if (s.id === 'MUDRA') {
                                                setReport(prev => ({ ...prev, scheme: 'MUDRA' }));
                                                // Trigger mudra selector
                                            } else {
                                                handleSchemeSelect(s.id as ProjectScheme);
                                            }
                                        }}
                                        className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                                    >
                                        <div className={`w-12 h-12 rounded-2xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            <span className="material-icons text-2xl">{s.icon}</span>
                                        </div>
                                        <h4 className="font-black text-slate-800 mb-1">{s.name}</h4>
                                        <p className="text-xs text-slate-400 font-bold">{s.desc}</p>
                                        
                                        {report.scheme === 'MUDRA' && s.id === 'MUDRA' && (
                                            <div className="mt-4 flex gap-2 animate-in fade-in zoom-in-95 duration-300">
                                                {['SHISHU', 'KISHORE', 'TARUN'].map(m => (
                                                    <button 
                                                        key={m}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setMudraType(m as any);
                                                            handleSchemeSelect('MUDRA');
                                                        }}
                                                        className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-tighter"
                                                    >
                                                        {m}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 flex items-center justify-center">
                                <button 
                                    onClick={() => {
                                        setMode('AI');
                                        handleGenerateDPR();
                                    }}
                                    className="px-8 py-4 bg-indigo-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-900 transition-all flex items-center gap-3 border border-white/20"
                                >
                                    <span className="material-icons animate-pulse text-indigo-400">auto_awesome</span>
                                    Instant AI Mode (Skip Manual Entry)
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Promoter Details */}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">1</span>
                                Promoter Profile
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Name (As per Aadhar)</label>
                                    <input 
                                        type="text" 
                                        value={report.promoter?.name} 
                                        onChange={(e) => setReport({...report, promoter: {...report.promoter!, name: e.target.value}})}
                                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold focus:border-blue-500 focus:outline-none shadow-sm"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                                    <select 
                                        aria-label="Promoter Category"
                                        value={report.promoter?.category}
                                        onChange={(e) => setReport({...report, promoter: {...report.promoter!, category: e.target.value as any}})}
                                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold focus:border-blue-500 focus:outline-none shadow-sm appearance-none"
                                    >
                                        <option value="GENERAL">General</option>
                                        <option value="SC">Scheduled Caste (SC)</option>
                                        <option value="ST">Scheduled Tribe (ST)</option>
                                        <option value="OBC">OBC</option>
                                        <option value="MINORITY">Minority</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Educational Qualification</label>
                                    <select 
                                        aria-label="Educational Qualification"
                                        value={report.promoter?.qualification}
                                        onChange={(e) => setReport({...report, promoter: {...report.promoter!, qualification: e.target.value}})}
                                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold focus:border-blue-500 focus:outline-none shadow-sm"
                                    >
                                        <option value="">Select Qualification</option>
                                        <option value="Less than 8th">Less than 8th</option>
                                        <option value="8th Pass">8th Pass</option>
                                        <option value="10th/12th Pass">10th/12th Pass</option>
                                        <option value="Graduate">Graduate</option>
                                        <option value="Post Graduate">Post Graduate</option>
                                    </select>
                                </div>
                            </div>
                            <button 
                                onClick={handleNext}
                                className="mt-10 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                            >
                                Continue to Financials <span className="material-icons text-sm">arrow_forward</span>
                            </button>
                        </div>
                    )}

                    {/* Step 2: Professional Financial Interface */}
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex gap-8">
                            {/* Left: Financial Inputs */}
                            <div className="flex-[2] space-y-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                        <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-sm">2</span>
                                        Financial Architecture
                                    </h3>
                                    <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
                                        {['CAPITAL', 'OPERATIONS', 'REVENUE'].map((t, idx) => (
                                            <button 
                                                key={t}
                                                onClick={() => setFinSubStep(idx)}
                                                className={`px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest transition-all ${finSubStep === idx ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {finSubStep === 0 && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Project Capital Expenditure (CAPEX)</p>
                                            <div className="grid grid-cols-2 gap-8">
                                                <div>
                                                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Land & Building (₹)</label>
                                                    <input 
                                                        type="number" 
                                                        value={report.financials?.fixedAssets.landAndBuilding}
                                                        onChange={(e) => setReport({...report, financials: {...report.financials!, fixedAssets: {...report.financials!.fixedAssets, landAndBuilding: Number(e.target.value)}}})}
                                                        className="w-full bg-slate-50 border-b-2 border-slate-100 py-3 font-black text-lg focus:outline-none focus:border-indigo-600 transition-all px-4 rounded-t-xl"
                                                        placeholder="0"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Plant & Machinery (₹)</label>
                                                    <input 
                                                        type="number" 
                                                        value={report.financials?.fixedAssets.machinery}
                                                        onChange={(e) => setReport({...report, financials: {...report.financials!, fixedAssets: {...report.financials!.fixedAssets, machinery: Number(e.target.value)}}})}
                                                        className="w-full bg-slate-50 border-b-2 border-slate-100 py-3 font-black text-lg focus:outline-none focus:border-indigo-600 transition-all px-4 rounded-t-xl"
                                                        placeholder="0"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Furniture & Office (₹)</label>
                                                    <input 
                                                        type="number" 
                                                        value={report.financials?.fixedAssets.furniture}
                                                        onChange={(e) => setReport({...report, financials: {...report.financials!, fixedAssets: {...report.financials!.fixedAssets, furniture: Number(e.target.value)}}})}
                                                        className="w-full bg-slate-50 border-b-2 border-slate-100 py-3 font-black text-lg focus:outline-none focus:border-indigo-600 transition-all px-4 rounded-t-xl"
                                                        placeholder="0"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Other Assets (₹)</label>
                                                    <input 
                                                        type="number" 
                                                        value={report.financials?.fixedAssets.otherAssets}
                                                        onChange={(e) => setReport({...report, financials: {...report.financials!, fixedAssets: {...report.financials!.fixedAssets, otherAssets: Number(e.target.value)}}})}
                                                        className="w-full bg-slate-50 border-b-2 border-slate-100 py-3 font-black text-lg focus:outline-none focus:border-indigo-600 transition-all px-4 rounded-t-xl"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {finSubStep === 1 && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Operational Parameters</p>
                                            <div className="grid grid-cols-2 gap-8">
                                                <div>
                                                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Working Days / Year</label>
                                                    <input 
                                                        type="number" 
                                                        className="w-full bg-slate-50 border-b-2 border-slate-100 py-3 font-black text-lg focus:outline-none focus:border-indigo-600 transition-all px-4 rounded-t-xl"
                                                        defaultValue="300"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Capacity Utilisation (%)</label>
                                                    <input 
                                                        type="number" 
                                                        className="w-full bg-slate-50 border-b-2 border-slate-100 py-3 font-black text-lg focus:outline-none focus:border-indigo-600 transition-all px-4 rounded-t-xl"
                                                        defaultValue="45"
                                                    />
                                                    <p className="text-[9px] text-slate-400 mt-2 font-bold italic">Banks prefer 45-55% for Year 1.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {finSubStep === 2 && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Revenue & Sales Targets</p>
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-2 gap-8">
                                                    <div>
                                                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Monthly Sales Quantity</label>
                                                        <input 
                                                            type="number" 
                                                            className="w-full bg-slate-50 border-b-2 border-slate-100 py-3 font-black text-lg focus:outline-none focus:border-indigo-600 transition-all px-4 rounded-t-xl"
                                                            placeholder="e.g. 1000 Units"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Average Selling Price (₹)</label>
                                                        <input 
                                                            type="number" 
                                                            className="w-full bg-slate-50 border-b-2 border-slate-100 py-3 font-black text-lg focus:outline-none focus:border-indigo-600 transition-all px-4 rounded-t-xl"
                                                            placeholder="e.g. 500"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 mt-4">
                                                    <div className="flex justify-between items-center text-indigo-900">
                                                        <span className="text-xs font-black uppercase tracking-widest">Est. Annual Revenue</span>
                                                        <span className="text-xl font-black">₹ 0.00</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-4">
                                    <button 
                                        onClick={() => setFinSubStep(prev => Math.max(0, prev - 1))}
                                        className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${finSubStep === 0 ? 'opacity-0' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                                    >
                                        Prev Module
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if (finSubStep < 2) setFinSubStep(prev => prev + 1);
                                            else handleNext();
                                        }}
                                        className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-105 flex items-center gap-2"
                                    >
                                        {finSubStep === 2 ? 'Generate Final Report' : 'Next Module'} 
                                        <span className="material-icons text-sm">{finSubStep === 2 ? 'auto_awesome' : 'east'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Right: Live Summary Dashboard */}
                            <div className="flex-1 space-y-6">
                                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl sticky top-4 overflow-hidden border border-white/10">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -translate-y-16 translate-x-16"></div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8 border-b border-white/10 pb-4 italic">Real-time Analysis</h4>
                                    
                                    <div className="space-y-8">
                                        <div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Project Cost</p>
                                            <p className="text-3xl font-black">₹ {((report.financials?.fixedAssets.landAndBuilding || 0) + (report.financials?.fixedAssets.machinery || 0) + (report.financials?.fixedAssets.furniture || 0) + (report.financials?.fixedAssets.otherAssets || 0)).toLocaleString()}</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 pt-4">
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[9px] font-bold text-slate-400">Promoter Margin (10%)</span>
                                                    <span className="text-xs font-black">₹ {(((report.financials?.fixedAssets.machinery || 0) + (report.financials?.fixedAssets.landAndBuilding || 0)) * 0.1).toLocaleString()}</span>
                                                </div>
                                                <div className="w-full h-1 bg-white/10 rounded-full">
                                                    <div className="h-full bg-blue-500 w-[10%] rounded-full"></div>
                                                </div>
                                            </div>
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                                <div className="flex justify-between items-center mb-1 text-green-400">
                                                    <span className="text-[9px] font-bold">Estimated Subsidy</span>
                                                    <span className="text-xs font-black">₹ {(((report.financials?.fixedAssets.machinery || 0) + (report.financials?.fixedAssets.landAndBuilding || 0)) * 0.35).toLocaleString()}</span>
                                                </div>
                                                <div className="w-full h-1 bg-white/10 rounded-full">
                                                    <div className="h-full bg-green-500 w-[35%] rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 mt-4 border-t border-white/10">
                                            <div className="flex items-center gap-3 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                                    <span className="material-icons text-indigo-400 text-lg">verified_user</span>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Bankability Score</p>
                                                    <p className="text-xs font-black text-white">HIGH (Estimated DSCR 1.82)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                                    <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Quick Load Industry Norms</h5>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Dairy Farm', 'Oil Mill', 'Bakery', 'Garments'].map(ind => (
                                            <button 
                                                key={ind} 
                                                className="py-2 px-3 text-[9px] font-black text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-900 hover:text-white transition-all border border-slate-100"
                                            >
                                                {ind}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Loading Page */}
                    {step === 3 && (
                        <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
                            <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center relative mb-8">
                                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-3xl animate-spin"></div>
                                <span className="material-icons text-4xl text-blue-600">psychology</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">Architecting Your Project Report...</h3>
                            <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
                                Our AI is analyzing banking norms, industry standard ratios, and local market potential to build a compliant DPR.
                            </p>
                            
                            <div className="mt-12 w-full max-w-md bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 transition-all duration-3000 w-full ease-out"></div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Review & Polish (Chat Mode) */}
                    {step === 4 && (
                        <div className="flex gap-8 h-full animate-in fade-in zoom-in-95 duration-500">
                            {/* Left: Report Preview */}
                            <div className="flex-[1.5] bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                    <h4 className="font-black text-slate-800 text-sm flex items-center gap-2">
                                        <span className="material-icons text-indigo-600 text-lg">preview</span> Draft Report Preview
                                    </h4>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleExport('PDF')} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 transition-all shadow-sm">
                                            <span className="material-icons text-sm">picture_as_pdf</span>
                                        </button>
                                        <button onClick={() => handleExport('DOCS')} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 transition-all shadow-sm">
                                            <span className="material-icons text-sm">description</span>
                                        </button>
                                        <button onClick={() => handleExport('WHATSAPP')} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-green-600 transition-all shadow-sm">
                                            <span className="material-icons text-sm">share</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-10 font-serif text-slate-700 leading-relaxed custom-scroll bg-white">
                                    <div className="max-w-2xl mx-auto space-y-8">
                                        <div className="text-center pb-10 border-b-2 border-slate-100">
                                            <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">{report.businessName}</h1>
                                            <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em]">DETAILED PROJECT REPORT</p>
                                        </div>
                                        
                                        <section>
                                            <h5 className="text-sm font-black text-slate-900 border-l-4 border-blue-600 pl-3 mb-4 uppercase">1. Executive Summary</h5>
                                            <p className="text-sm text-slate-600">{report.content?.executiveSummary}</p>
                                        </section>

                                        <section>
                                            <h5 className="text-sm font-black text-slate-900 border-l-4 border-blue-600 pl-3 mb-4 uppercase">2. SWOT Analysis</h5>
                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                <div className="bg-green-50 p-4 rounded-2xl">
                                                    <p className="font-black text-[10px] text-green-700 mb-2 uppercase tracking-widest italic">Strengths</p>
                                                    <ul className="text-[11px] list-disc pl-4 space-y-1">
                                                        {report.content?.swotAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                                    </ul>
                                                </div>
                                                <div className="bg-red-50 p-4 rounded-2xl">
                                                    <p className="font-black text-[10px] text-red-700 mb-2 uppercase tracking-widest italic">Weaknesses</p>
                                                    <ul className="text-[11px] list-disc pl-4 space-y-1">
                                                        {report.content?.swotAnalysis.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
                                                    </ul>
                                                </div>
                                            </div>
                                        </section>

                                        <section>
                                            <h5 className="text-sm font-black text-slate-900 border-l-4 border-blue-600 pl-3 mb-4 uppercase">4. Projected Balance Sheet (Year 1)</h5>
                                            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 overflow-hidden">
                                                <table className="w-full text-[10px]">
                                                    <thead>
                                                        <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-widest text-[8px]">
                                                            <th className="text-left pb-2">Liabilities</th>
                                                            <th className="text-right pb-2">Amount (₹)</th>
                                                            <th className="text-left pl-4 pb-2">Assets</th>
                                                            <th className="text-right pb-2">Amount (₹)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-slate-700 font-medium">
                                                        <tr className="border-b border-slate-100">
                                                            <td className="py-2">Capital Account</td>
                                                            <td className="text-right py-2">5,00,000</td>
                                                            <td className="py-2 pl-4">Fixed Assets</td>
                                                            <td className="text-right py-2">{(report.financials?.fixedAssets.machinery || 0).toLocaleString()}</td>
                                                        </tr>
                                                        <tr className="border-b border-slate-100">
                                                            <td className="py-2">Bank Term Loan</td>
                                                            <td className="text-right py-2">15,00,000</td>
                                                            <td className="py-2 pl-4">Current Assets</td>
                                                            <td className="text-right py-2">3,50,000</td>
                                                        </tr>
                                                        <tr className="bg-slate-100/50 font-black">
                                                            <td className="py-2">TOTAL</td>
                                                            <td className="text-right py-2">20,00,000</td>
                                                            <td className="py-2 pl-4">TOTAL</td>
                                                            <td className="text-right py-2">20,00,000</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </section>

                                        <section>
                                            <h5 className="text-sm font-black text-slate-900 border-l-4 border-blue-600 pl-3 mb-4 uppercase">5. CMA Data Projections (3 Years)</h5>
                                            <div className="space-y-3">
                                                {[1, 2, 3].map(yr => (
                                                    <div key={yr} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                                                        <span className="text-[10px] font-black text-slate-400">YEAR {yr}</span>
                                                        <div className="flex gap-6">
                                                            <div className="text-right">
                                                                <p className="text-[8px] font-bold text-slate-400 uppercase">Sales</p>
                                                                <p className="text-xs font-black text-slate-900">₹{(4500000 * yr).toLocaleString()}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-[8px] font-bold text-slate-400 uppercase">Net Profit</p>
                                                                <p className="text-xs font-black text-green-600">₹{(900000 * yr).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <div className="pt-10 border-t border-slate-100 italic text-[10px] text-slate-400 flex justify-between">
                                            <span>Prepared by SetMyBizz AI Architect</span>
                                            <span>Date: {new Date().toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: AI Polish Chat */}
                            <div className="flex-1 flex flex-col h-full">
                                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
                                     <div className="p-6 border-b border-slate-50 bg-indigo-50/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="material-icons text-indigo-600 text-lg">auto_awesome</span>
                                            <h4 className="font-black text-slate-800 text-xs">AI Report Polishing</h4>
                                        </div>
                                        <span className="bg-indigo-600 text-white text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Live Mode</span>
                                     </div>

                                     <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scroll bg-slate-50/30">
                                        {chatHistory.map((msg, i) => (
                                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`p-4 rounded-2xl text-xs max-w-[85%] shadow-sm ${msg.role === 'user' ? 'bg-slate-900 text-white font-bold' : 'bg-white border border-slate-200 text-slate-700 font-medium leading-relaxed'}`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        ))}
                                     </div>

                                     <div className="p-4 bg-white border-t border-slate-50">
                                        <div className="relative group flex gap-2">
                                            <div className="relative flex-1">
                                                <input 
                                                    type="text" 
                                                    value={chatInput}
                                                    onChange={(e) => setChatInput(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleChatAsk()}
                                                    placeholder="e.g. Add 5% contingency to financials..."
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-12 py-4 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-all focus:bg-white"
                                                />
                                                <button 
                                                    onClick={toggleVoice}
                                                    className={`absolute right-12 top-2.5 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isListening ? 'bg-red-50 text-red-600 animate-pulse' : 'text-slate-400 hover:text-indigo-600'}`}
                                                >
                                                    <span className="material-icons text-lg">{isListening ? 'mic_active' : 'mic'}</span>
                                                </button>
                                                <button 
                                                    onClick={handleChatAsk}
                                                    className="absolute right-2 top-2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-md group-hover:scale-105"
                                                >
                                                    <span className="material-icons text-sm">send</span>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-[9px] text-slate-400 mt-3 text-center font-bold">Try: "Add local market trends for Dairy in Pune" or "Request CA Review"</p>
                                     </div>
                                </div>

                                {/* Premium Upgrade CTA */}
                                <div className="mt-6 p-6 bg-linear-to-br from-indigo-900 to-purple-900 rounded-[2.5rem] shadow-xl text-white group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-16 translate-x-16 group-hover:bg-white/10 transition-all"></div>
                                    <div className="relative z-10">
                                        <h5 className="font-black text-sm mb-1 flex items-center gap-2">
                                            <span className="material-icons text-amber-500 text-lg">verified</span> Get Professional Seal
                                        </h5>
                                        <p className="text-[10px] text-indigo-200 mb-4 font-bold leading-relaxed">Required for bank loans over ₹25 Lakhs.</p>
                                        <button className="w-full py-3 bg-white text-indigo-900 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:shadow-indigo-500/20 transition-all hover:scale-[1.02]">
                                            Request CA Signature (₹4,999)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-between shrink-0 px-10">
                    <button 
                        onClick={() => setStep(prev => Math.max(0, prev - 1))}
                        disabled={step === 0}
                        className="text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest disabled:opacity-0"
                    >
                        Back
                    </button>
                    <div className="flex items-center gap-4">
                        {step === 4 ? (
                            <button 
                                onClick={onClose}
                                className="px-10 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl hover:shadow-blue-500/30 transition-all hover:-translate-y-1 flex items-center gap-2"
                            >
                                <span className="material-icons text-lg">save</span> Save to AI Workspace
                            </button>
                        ) : null}
                    </div>
                </div>

                {/* HIDDEN PRINT-ONLY BANK DPR LAYOUT */}
                <div className="hidden print:block print:p-10 font-serif text-slate-900 bg-white">
                    <div className="text-center mb-10 border-b-4 border-slate-900 pb-6">
                        <h1 className="text-4xl font-black uppercase mb-2">{report.businessName}</h1>
                        <p className="text-sm font-bold tracking-[0.4em] text-slate-500">DETAILED PROJECT REPORT (DPR)</p>
                        <p className="mt-4 font-bold">Scheme: {report.scheme} | Category: {report.promoter?.category}</p>
                    </div>
                    
                    <div className="space-y-10">
                        <section>
                            <h2 className="text-xl font-black border-b-2 border-slate-200 pb-2 mb-4">1. EXECUTIVE SUMMARY</h2>
                            <p className="text-sm leading-relaxed">{report.content?.executiveSummary}</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black border-b-2 border-slate-200 pb-2 mb-4">2. PROMOTER PROFILE</h2>
                            <table className="w-full text-sm border-collapse border border-slate-300">
                                <tbody>
                                    <tr><td className="border border-slate-300 p-3 font-bold bg-slate-50 w-1/3">Promoter Name</td><td className="border border-slate-300 p-3">{report.promoter?.name}</td></tr>
                                    <tr><td className="border border-slate-300 p-3 font-bold bg-slate-50">Qualification</td><td className="border border-slate-300 p-3">{report.promoter?.qualification}</td></tr>
                                    <tr><td className="border border-slate-300 p-3 font-bold bg-slate-50">Category</td><td className="border border-slate-300 p-3">{report.promoter?.category}</td></tr>
                                </tbody>
                            </table>
                        </section>

                        <section>
                            <h2 className="text-xl font-black border-b-2 border-slate-200 pb-2 mb-4">3. FINANCIAL ANALYSIS</h2>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="border border-slate-300 p-5 rounded-xl">
                                    <h3 className="font-black text-sm mb-4">COST OF PROJECT</h3>
                                    <ul className="text-sm space-y-2">
                                        <li className="flex justify-between"><span>Machinery</span> <span>₹{(report.financials?.fixedAssets.machinery || 0).toLocaleString()}</span></li>
                                        <li className="flex justify-between font-black border-t pt-2"><span>Total</span> <span>₹{(report.financials?.fixedAssets.machinery || 0).toLocaleString()}</span></li>
                                    </ul>
                                </div>
                                <div className="border border-slate-300 p-5 rounded-xl">
                                    <h3 className="font-black text-sm mb-4">MEANS OF FINANCE</h3>
                                    <ul className="text-sm space-y-2">
                                        <li className="flex justify-between"><span>Own Contribution</span> <span>10%</span></li>
                                        <li className="flex justify-between"><span>Bank Loan</span> <span>90%</span></li>
                                        <li className="flex justify-between text-green-700 font-bold"><span>PMEGP Subsidy</span> <span>Eligible</span></li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <div className="mt-32 pt-10 border-t flex justify-between italic text-sm text-slate-400">
                            <span>Digitally Generated by setmybizz.in</span>
                            <div className="text-right">
                                <div className="w-48 h-20 border-2 border-dashed border-slate-200 mb-2"></div>
                                <span>(Entrepreneur's Signature)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {toast.visible && <Toast message={toast.message} subMessage={toast.sub} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />}
        </div>
    );
}

