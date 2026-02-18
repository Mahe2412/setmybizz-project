"use client";

import React, { useState, useEffect } from 'react';
import { BusinessData } from '@/types';

interface LaunchPadAIOnboardingProps {
    businessData: Partial<BusinessData>;
    onComplete: (data: any) => void;
}

type UIPhase = 'POPUP1' | 'POPUP2' | 'QUIZ' | 'LOGIN' | 'BUILDING_ASSETS' | 'LOGO_SAMPLES' | 'LOGO_SELECTION' | 'WEBSITE_FLOW' | 'COMPLETED';

export default function LaunchPadAIOnboarding({ businessData, onComplete }: LaunchPadAIOnboardingProps) {
    const [phase, setPhase] = useState<UIPhase>('POPUP1');
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        language: 'English',
        businessName: businessData.name || '',
        service: '',
        industry: businessData.industry || '',
        team: '',
        stage: '',
        launchTime: '',
        products: [{ name: '', images: [] }],
        description: '',
        logoPreference: '',
        selectedLogo: null as any,
        email: '',
        phone: ''
    });

    const languages = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Marathi', 'Bengali', 'Gujarati'];
    const industries = ['Technology', 'E-commerce', 'Healthcare', 'Education', 'Food & Beverage', 'Fashion', 'Real Estate', 'Finance', 'Services', 'Other'];
    const teamSizes = ['Solo Founder', '2-5 Members', '5-10 Members', '10-20 Members', '20+ Members'];
    const stages = ['Idea Stage', 'Development', 'MVP Ready', 'Pre-Launch', 'Already Launched'];
    const launchTimes = ['Within a month', '1-3 Months', '3-6 Months', '6+ Months'];

    // Quiz Steps
    const quizSteps = [
        { id: 'language', title: 'Select Your Language', type: 'select', options: languages },
        {
            id: 'basic', title: 'Business Details', type: 'multi-text', fields: [
                { id: 'businessName', label: 'Business Name', placeholder: 'Enter your brand name' },
                { id: 'service', label: 'Primary Service/Offering', placeholder: 'What do you do?' },
                { id: 'industry', label: 'Industry', type: 'select', options: industries },
            ]
        },
        {
            id: 'details', title: 'Growth & Stage', type: 'multi-text', fields: [
                { id: 'team', label: 'Team Size', type: 'select', options: teamSizes },
                { id: 'stage', label: 'Business Stage', type: 'select', options: stages },
                { id: 'launchTime', label: 'When do you plan to launch?', type: 'select', options: launchTimes },
            ]
        },
        { id: 'products', title: 'Product Inventory', type: 'products' },
        { id: 'description', title: 'Mission & Vision', type: 'textarea', placeholder: 'Explain your business mission, values, and what makes you unique...' },
        {
            id: 'contact', title: 'Claim Your Free Brand', type: 'multi-text', fields: [
                { id: 'email', label: 'Email Address', placeholder: 'your@email.com' },
                { id: 'phone', label: 'Phone Number', placeholder: '+91' },
            ]
        },
    ];

    const handleNextQuiz = () => {
        if (step < quizSteps.length - 1) {
            setStep(step + 1);
        } else {
            setPhase('LOGIN');
        }
    };

    const handleBackQuiz = () => {
        if (step > 0) setStep(step - 1);
    };

    useEffect(() => {
        if (phase === 'BUILDING_ASSETS') {
            const timer = setTimeout(() => {
                setPhase('LOGO_SAMPLES');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    // Mock Logo Samples
    const logoSamples = [
        { id: 1, name: 'Minimalist', icon: 'auto_awesome_mosaic', preview: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=200&h=200&fit=crop' },
        { id: 2, name: 'Abstract Shapes', icon: 'category', preview: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=200&h=200&fit=crop' },
        { id: 3, name: 'Animated Style', icon: 'animation', preview: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=200&h=200&fit=crop' },
        { id: 4, name: 'Typography Based', icon: 'title', preview: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=200&fit=crop' },
        { id: 5, name: 'Gradient Fusion', icon: 'gradient', preview: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=200&h=200&fit=crop' },
        { id: 6, name: 'Classic / Luxury', icon: 'diamond', preview: 'https://images.unsplash.com/photo-1523726491678-bf852e717f6a?w=200&h=200&fit=crop' },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="w-full max-w-xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-700">
                {/* Phase 1: Popup 1 - High Energy Start */}
                {phase === 'POPUP1' && (
                    <div className="bg-white rounded-[3rem] p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-slate-100 relative overflow-hidden text-left">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform">
                                    <span className="material-symbols-outlined text-3xl font-black">rocket_launch</span>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
                                        Neural <span className="not-italic text-indigo-600">Ignition</span>
                                    </h2>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Scale or Fail? Choose Scale.</p>
                                </div>
                            </div>

                            <div className="space-y-6 mb-10">
                                <h3 className="text-4xl font-black text-slate-900 tracking-tightest leading-[0.9]">
                                    BUILD YOUR BRAND <br />
                                    <span className="text-indigo-600 italic">FOR FREE.</span>
                                </h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm">
                                    Why wait weeks? Our AI Engine generates your <span className="text-slate-900 font-black">Logo, Website, and Brand Kits</span> in minutes. Fully automated. Zero friction.
                                </p>
                            </div>

                            <button
                                onClick={() => setPhase('POPUP2')}
                                className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/40 hover:bg-black hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                Start Building Now
                                <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
                            </button>

                            <p className="text-center text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mt-6">
                                Powered by Arkle AI Factory • 256-bit Secure
                            </p>
                        </div>
                    </div>
                )}

                {/* Phase 2: Popup 2 - Feature Spotlight */}
                {phase === 'POPUP2' && (
                    <div className="bg-white rounded-[3rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-slate-100 relative overflow-hidden text-left animate-in slide-in-from-right-8 duration-500">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>

                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-xl font-black">auto_awesome</span>
                                </div>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Factory Output</h2>
                            </div>
                            <span className="px-3 py-1 bg-slate-100 text-slate-400 rounded-lg text-[7px] font-black uppercase tracking-widest">v2.4 Active</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-10">
                            {[
                                { label: 'Logo Design', icon: 'brush', active: true },
                                { label: 'Web Architecture', icon: 'web', active: true },
                                { label: 'Neural Copy', icon: 'edit_note', active: true },
                                { label: 'Social Matrix', icon: 'share', active: true },
                                { label: 'Brand Guidelines', icon: 'category', active: false },
                                { label: 'E-Store Hub', icon: 'shopping_cart', active: false }
                            ].map((f, i) => (
                                <div key={i} className={`p-4 rounded-2xl border ${f.active ? 'bg-indigo-50/50 border-indigo-100 text-indigo-900' : 'bg-slate-50 border-slate-100 text-slate-400'} flex items-center gap-3 transition-all hover:scale-105`}>
                                    <span className={`material-symbols-outlined text-sm ${f.active ? 'text-indigo-600' : 'text-slate-300'}`}>{f.icon}</span>
                                    <span className="text-[8px] font-black uppercase tracking-widest">{f.label}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setPhase('QUIZ')}
                            className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all active:scale-95"
                        >
                            Initialize Factory
                        </button>
                    </div>
                )}

                {/* Phase 3: The Quiz - Interactive Onboarding */}
                {phase === 'QUIZ' && (
                    <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col border border-slate-100 animate-in slide-in-from-right-8 duration-500 text-left">
                        <div className="bg-slate-50/50 backdrop-blur-md border-b border-slate-100 p-8">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
                                        <span className="material-symbols-outlined text-xl">psychology</span>
                                    </div>
                                    <div>
                                        <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] leading-none mb-2">Neural Input Phase</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question {step + 1} of {quizSteps.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 max-w-[140px]">
                                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-900 transition-all duration-700 ease-out" style={{ width: `${((step + 1) / quizSteps.length) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 max-h-[480px] overflow-y-auto custom-scroll space-y-8">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{quizSteps[step].title}</h2>
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Provide data for neural mapping</p>
                            </div>

                            {quizSteps[step].type === 'select' && (
                                <div className="grid grid-cols-2 gap-4">
                                    {quizSteps[step].options?.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => {
                                                setFormData({ ...formData, [quizSteps[step].id]: opt });
                                                handleNextQuiz();
                                            }}
                                            className={`p-6 rounded-2xl border-2 text-[10px] font-black transition-all text-left uppercase tracking-[0.2em] ${formData[quizSteps[step].id as keyof typeof formData] === opt
                                                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-lg scale-[1.02]'
                                                : 'border-slate-50 hover:border-slate-200 text-slate-400 hover:bg-slate-50'
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {quizSteps[step].type === 'multi-text' && (
                                <div className="space-y-6">
                                    {quizSteps[step].fields?.map((field: any) => (
                                        <div key={field.id} className="relative group">
                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2 group-focus-within:text-indigo-600 transition-colors">{field.label}</label>
                                            {field.type === 'select' ? (
                                                <div className="relative">
                                                    <select
                                                        value={formData[field.id as keyof typeof formData] as string}
                                                        onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                                                        className="w-full p-5 rounded-2xl border-2 border-slate-50 focus:border-indigo-100 focus:bg-white outline-none font-black text-xs text-slate-900 bg-slate-50 transition-all appearance-none"
                                                    >
                                                        <option value="">Select Option...</option>
                                                        {field.options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                                                    </select>
                                                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                                </div>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={formData[field.id as keyof typeof formData] as string}
                                                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                                                    placeholder={field.placeholder}
                                                    className="w-full p-5 rounded-2xl border-2 border-slate-50 focus:border-indigo-100 focus:bg-white outline-none font-black text-xs text-slate-900 placeholder-slate-300 bg-slate-50 transition-all shadow-inner"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {quizSteps[step].type === 'products' && (
                                <div className="space-y-4">
                                    {formData.products.map((p, idx) => (
                                        <div key={idx} className="bg-slate-50/50 p-6 rounded-2xl border-2 border-slate-100 group hover:border-indigo-100 transition-all">
                                            <input
                                                type="text"
                                                value={p.name}
                                                onChange={(e) => {
                                                    const newProds = [...formData.products];
                                                    newProds[idx].name = e.target.value;
                                                    setFormData({ ...formData, products: newProds });
                                                }}
                                                placeholder="Service Name (e.g. Design, Coaching)..."
                                                className="w-full bg-transparent border-b-2 border-slate-200 focus:border-indigo-600 outline-none font-black text-xs text-slate-900 py-2 transition-all"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setFormData({ ...formData, products: [...formData.products, { name: '', images: [] }] })}
                                        className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[1.5rem] text-slate-400 font-extrabold text-[10px] uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-400 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-sm">add</span>
                                        Add Another Offering
                                    </button>
                                </div>
                            )}

                            {quizSteps[step].type === 'textarea' && (
                                <div className="relative">
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder={quizSteps[step].placeholder}
                                        rows={6}
                                        className="w-full p-8 rounded-[2rem] border-2 border-slate-50 focus:border-indigo-100 focus:bg-white outline-none font-bold text-xs text-slate-900 placeholder-slate-300 bg-slate-50 transition-all resize-none leading-relaxed shadow-inner"
                                    />
                                    <div className="absolute bottom-6 right-8 text-[8px] font-black text-slate-300 uppercase tracking-widest">Analyzing Sentiment...</div>
                                </div>
                            )}
                        </div>

                        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between shrink-0">
                            <button onClick={handleBackQuiz} disabled={step === 0} className="px-8 py-4 rounded-xl font-black text-slate-400 hover:text-slate-900 disabled:opacity-0 transition-all text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Back
                            </button>
                            <button onClick={handleNextQuiz} className="px-12 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/30 hover:bg-black hover:scale-105 transition-all active:scale-95 flex items-center gap-3">
                                {step === quizSteps.length - 1 ? 'Start Engine' : 'Continue'}
                                <span className="material-symbols-outlined text-xs font-black">bolt</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Login / Profile Phase - Founder Identity */}
                {phase === 'LOGIN' && (
                    <div className="bg-white rounded-[3rem] p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-slate-100 animate-in zoom-in-95 duration-700 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-slate-900 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-6 group-hover:rotate-0 transition-transform">
                                <span className="material-symbols-outlined text-4xl font-black">fingerprint</span>
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 leading-tight uppercase tracking-tighter italic">Neural <span className="not-italic text-indigo-600">ID</span></h2>
                            <p className="text-slate-400 text-[10px] mt-4 font-black uppercase tracking-[0.3em]">Map your profile to the ecosystem</p>

                            <div className="mt-10 space-y-5 mb-12 text-left">
                                <div className="p-6 bg-slate-50/80 backdrop-blur-sm rounded-[1.5rem] border border-slate-100 flex items-center gap-5 transition-all hover:bg-white group">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-50 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-indigo-600 text-xl">alternate_email</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Registered Vector</p>
                                        <p className="text-xs font-black text-slate-900">{formData.email}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <input type="text" placeholder="First Name" className="w-full p-6 bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none font-black text-xs text-slate-900 shadow-inner" />
                                    <input type="text" placeholder="Last Name" className="w-full p-6 bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none font-black text-xs text-slate-900 shadow-inner" />
                                </div>
                                <div className="relative">
                                    <input type="password" placeholder="Secure Key" className="w-full p-6 bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none font-black text-xs text-slate-900 shadow-inner" />
                                    <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">visibility_off</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setPhase('BUILDING_ASSETS')}
                                className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/30 hover:bg-black hover:scale-[1.02] transition-all active:scale-95"
                            >
                                Secure My Brand Identity
                            </button>
                        </div>
                    </div>
                )}

                {/* Building Loader - Recursive Rendering */}
                {phase === 'BUILDING_ASSETS' && (
                    <div className="bg-slate-900 rounded-[3.5rem] p-16 text-center text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] animate-pulse delay-700"></div>

                        <div className="relative z-10">
                            <div className="w-24 h-24 border-[6px] border-white/5 border-t-indigo-500 rounded-full animate-spin mx-auto mb-10 shadow-[0_0_40px_rgba(79,70,229,0.4)]"></div>
                            <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter italic">Factory <span className="not-italic text-indigo-400">Rendering...</span></h2>
                            <p className="text-[11px] text-slate-400 font-bold tracking-[0.4em] uppercase mb-16 animate-pulse">Synthesizing Digital Assets</p>

                            <div className="space-y-6 max-w-xs mx-auto">
                                {[
                                    { label: 'Neural Mesh', progress: '94%' },
                                    { label: 'Pixel Buffer', progress: '72%' },
                                    { label: 'Vector Logic', progress: '45%' }
                                ].map((step, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-500">
                                            <span>{step.label}</span>
                                            <span className="text-indigo-400">{step.progress}</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500/40 w-full animate-pulse"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Selection Phases (Overlays) - Immersive Fullscreen Experience */}
                {(phase === 'LOGO_SAMPLES' || phase === 'LOGO_SELECTION' || phase === 'WEBSITE_FLOW') && (
                    <div className="fixed inset-0 z-[110] bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center p-8 overflow-hidden animate-in fade-in duration-700">
                        {/* Phase Content ... */}
                        {phase === 'LOGO_SAMPLES' && (
                            <div className="bg-white rounded-[4rem] p-16 max-w-6xl w-full shadow-2xl animate-in zoom-in-95 duration-700 text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-16">
                                        <div>
                                            <h2 className="text-5xl font-black text-slate-900 tracking-tightest uppercase italic">Brand <span className="not-italic text-indigo-600">DNA</span></h2>
                                            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] mt-4 opacity-80">Engine identified 6 strategic directions</p>
                                        </div>
                                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 shadow-inner">
                                            <span className="material-symbols-outlined text-indigo-600 text-4xl font-black">palette</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                                        {logoSamples.map((logo) => (
                                            <button
                                                key={logo.id}
                                                onClick={() => {
                                                    setFormData({ ...formData, logoPreference: logo.name });
                                                    setPhase('LOGO_SELECTION');
                                                }}
                                                className="group relative bg-slate-50 aspect-[16/10] rounded-[3rem] border-2 border-transparent hover:border-indigo-600 transition-all overflow-hidden flex flex-col items-center justify-center p-10 shadow-sm hover:shadow-2xl"
                                            >
                                                <div className="absolute inset-0 opacity-10 group-hover:opacity-40 transition-opacity grayscale group-hover:grayscale-0">
                                                    <img src={logo.preview} alt="" className="w-full h-full object-cover scale-150 group-hover:scale-100 transition-transform duration-1000" />
                                                </div>
                                                <span className="material-symbols-outlined text-5xl text-indigo-600 group-hover:scale-110 transition-transform mb-4 relative z-10 font-black">{logo.icon}</span>
                                                <span className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em] relative z-10">{logo.name}</span>
                                                <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                                    <span className="px-5 py-2 bg-indigo-600 text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl">Select Vision</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {phase === 'LOGO_SELECTION' && (
                            <div className="bg-white rounded-[4rem] p-16 max-w-[90vw] w-full shadow-2xl animate-in zoom-in-95 duration-700 flex flex-col max-h-[90vh] text-left relative overflow-hidden">
                                <div className="flex items-center justify-between mb-12 shrink-0 relative z-10">
                                    <div>
                                        <h2 className="text-5xl font-black text-slate-900 tracking-tightest uppercase italic">Neural <span className="not-italic text-indigo-600">Prototypes</span></h2>
                                        <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] mt-4">Recursive iterations for {formData.logoPreference}</p>
                                    </div>
                                    <button onClick={() => setPhase('LOGO_SAMPLES')} className="px-10 py-5 bg-slate-100 hover:bg-slate-200 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3">
                                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                                        Back to Concepts
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scroll grid grid-cols-2 md:grid-cols-5 gap-10 p-4 relative z-10">
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <div key={i} className="group relative bg-white aspect-square rounded-[3.5rem] border-2 border-slate-100 hover:border-indigo-600 shadow-sm hover:shadow-[0_24px_48px_-12px_rgba(79,70,229,0.3)] transition-all flex flex-col items-center justify-center p-14 cursor-pointer" onClick={() => setPhase('WEBSITE_FLOW')}>
                                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="w-24 h-24 rounded-full border-[6px] border-indigo-600 flex items-center justify-center text-5xl font-black text-indigo-600 group-hover:scale-110 transition-transform shadow-xl rotate-[15deg] group-hover:rotate-0">
                                                {formData.businessName.charAt(0)}
                                            </div>
                                            <div className="absolute inset-x-0 bottom-8 flex justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                                <span className="text-[9px] font-black text-white bg-slate-900 px-6 py-2.5 rounded-full uppercase tracking-widest shadow-2xl">Initialize Unit</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {phase === 'WEBSITE_FLOW' && (
                            <div className="bg-white rounded-[4rem] max-w-[95vw] w-full h-[90vh] shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden flex text-left border border-white/20">
                                <div className="w-96 bg-slate-900 flex flex-col p-12 text-white relative">
                                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(79,70,229,0.1),transparent_50%)]"></div>
                                    <div className="relative z-10">
                                        <h3 className="text-3xl font-black mb-12 tracking-tightest uppercase italic">The Layer <span className="not-italic text-indigo-400">Builder</span></h3>
                                        <div className="space-y-4 mb-12">
                                            {['Hero Matrix', 'Product Ecosystem', 'Founder Story', 'Neural Feedback', 'Signal Capture'].map(comp => (
                                                <div key={comp} className="p-5 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black text-slate-300 flex items-center justify-between shadow-lg cursor-grab uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all group">
                                                    {comp}
                                                    <span className="material-symbols-outlined text-[18px] opacity-30 group-hover:opacity-100 transition-opacity">drag_indicator</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-6 bg-indigo-600/10 rounded-3xl border border-indigo-500/20 mb-12">
                                            <p className="text-[9px] font-medium text-indigo-300 leading-relaxed uppercase tracking-wider">
                                                Live preview is rendered using Gemini 3.5. Any changes are reflected immediately across the neural stack.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setPhase('COMPLETED')}
                                            className="w-full py-6 bg-white text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-50 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                        >
                                            Transmit Store
                                            <span className="material-symbols-outlined text-sm">send</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 bg-slate-50 p-16 overflow-y-auto custom-scroll relative">
                                    <div className="absolute top-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-white rounded-full shadow-sm border border-slate-100 z-10 flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Live Rendering Active</span>
                                    </div>
                                    <div className="bg-white w-full min-h-full rounded-[4rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.1)] p-24 text-center border border-slate-200/50 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-50/30 to-transparent"></div>
                                        <nav className="flex justify-between items-center mb-32 text-[11px] font-black uppercase tracking-[0.3em] relative z-10">
                                            <span className="italic text-slate-900 border-b-4 border-indigo-600 pb-2">{formData.businessName}</span>
                                            <div className="space-x-12 text-slate-400">
                                                <span className="hover:text-indigo-600 cursor-pointer transition-colors">Vision</span>
                                                <span className="hover:text-indigo-600 cursor-pointer transition-colors">Neural Kit</span>
                                                <span className="hover:text-indigo-600 cursor-pointer transition-colors">Connect</span>
                                            </div>
                                        </nav>
                                        <div className="relative z-10">
                                            <h1 className="text-8xl font-black mb-12 tracking-tightest text-slate-900 leading-[0.85]">
                                                NEXT-GEN <br />
                                                <span className="text-indigo-600 italic">{formData.service}</span>
                                            </h1>
                                            <p className="text-slate-500 max-w-2xl mx-auto mb-20 text-lg font-medium leading-relaxed uppercase tracking-tight opacity-70">
                                                {formData.description || "Synthesizing new paradigms for the modern entrepreneur."}
                                            </p>
                                            <div className="flex justify-center gap-8">
                                                <div className="px-12 py-5 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all cursor-pointer">Initialize Access</div>
                                                <div className="px-12 py-5 bg-slate-100 text-slate-900 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-200 transition-all cursor-pointer">System View</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Phase 8: Completed - Final Transcendence */}
                {phase === 'COMPLETED' && (
                    <div className="bg-white rounded-[4rem] p-16 shadow-[0_32px_128px_-32px_rgba(79,70,229,0.3)] border border-slate-100 animate-in flip-in-y duration-1000 overflow-hidden text-center relative max-w-2xl mx-auto">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full -translate-y-32 translate-x-32 opacity-80 blur-[80px]"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full translate-y-32 -translate-x-32 opacity-80 blur-[80px]"></div>

                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-green-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl scale-110">
                                <span className="material-symbols-outlined text-5xl font-black animate-pulse">check</span>
                            </div>
                            <h2 className="text-5xl font-black text-slate-900 leading-tight uppercase tracking-tightest italic mb-4">Signal <span className="not-italic text-indigo-600">Locked.</span></h2>
                            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.5em] mb-16">Universal stack fully initialized</p>

                            <div className="space-y-4 mb-20 text-left">
                                {[
                                    { label: 'Neural Roadmap', status: 'SYNCHRONIZED', icon: 'auto_awesome' },
                                    { label: 'Pixel Ecosystem', status: 'RENDERED', icon: 'brush' },
                                    { label: 'Factory Core', status: 'OPERATIONAL', icon: 'settings_input_component' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-indigo-200 hover:bg-white transition-all shadow-sm hover:shadow-xl">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-lg border border-slate-50 group-hover:rotate-6 transition-transform">
                                                <span className="material-symbols-outlined text-xl font-black">{item.icon}</span>
                                            </div>
                                            <span className="text-[12px] font-black uppercase tracking-widest text-slate-900">{item.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">{item.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    onComplete(formData);
                                    window.location.reload();
                                }}
                                className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-black hover:scale-[1.02] transition-all flex items-center justify-center gap-4"
                            >
                                TRANSMIT TO WORKSPACE
                                <span className="material-symbols-outlined text-sm font-black">login</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
