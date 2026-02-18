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
                {/* Phase 1: Popup 1 */}
                {phase === 'POPUP1' && (
                    <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 relative overflow-hidden text-left">
                        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#2b59ff] via-[#4d47ff] to-[#9c42ff]"></div>
                        <div className="flex items-start gap-8 mb-8">
                            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-[#4d47ff] shrink-0 shadow-inner">
                                <span className="material-symbols-outlined text-4xl font-black">rocket_launch</span>
                            </div>
                            <div className="text-left">
                                <h2 className="text-3xl font-black text-slate-900 leading-tight">Build Brands for Free</h2>
                                <p className="text-[#4d47ff] text-sm mt-1 font-black uppercase tracking-[0.2em]">Everything Ready in Seconds</p>
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm mb-8 leading-relaxed font-medium">
                            Stop spending months building assets. Get your Logo, Website, Social Kits, and Business Assets built by our AI Factory in just hours. **Bootstrapped & Free** to start.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setPhase('POPUP2')}
                                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
                            >
                                Start Building Now
                            </button>
                        </div>
                    </div>
                )}

                {/* Phase 2: Popup 2 */}
                {phase === 'POPUP2' && (
                    <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 relative overflow-hidden text-left">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600"></div>
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 shrink-0">
                                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                            </div>
                            <div className="text-left">
                                <h2 className="text-xl font-black text-slate-900 leading-tight">Everything, One Click.</h2>
                                <p className="text-slate-500 text-[10px] mt-1 font-medium tracking-widest uppercase">Full Creative Suite</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl mb-4 text-[10px] grid grid-cols-2 gap-y-1.5 font-bold text-slate-600">
                            <span className="flex items-center gap-1"><span className="material-icons text-[10px] text-indigo-500">check</span> Logo</span>
                            <span className="flex items-center gap-1"><span className="material-icons text-[10px] text-indigo-500">check</span> Website</span>
                            <span className="flex items-center gap-1"><span className="material-icons text-[10px] text-indigo-500">check</span> Content</span>
                            <span className="flex items-center gap-1"><span className="material-icons text-[10px] text-indigo-500">check</span> E-Store</span>
                            <span className="flex items-center gap-1"><span className="material-icons text-[10px] text-indigo-500">check</span> Pitch Deck</span>
                            <span className="flex items-center gap-1"><span className="material-icons text-[10px] text-indigo-500">check</span> Brand Kit</span>
                        </div>
                        <button
                            onClick={() => setPhase('QUIZ')}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all active:scale-95"
                        >
                            Build Now
                        </button>
                    </div>
                )}

                {/* Phase 3: The Quiz */}
                {phase === 'QUIZ' && (
                    <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-slate-100 animate-in slide-in-from-right-4 duration-500 text-left">
                        <div className="bg-slate-50 border-b border-slate-100 p-6">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                        <span className="material-symbols-outlined text-lg">smart_toy</span>
                                    </div>
                                    <div>
                                        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Brand AI Factory</h3>
                                        <p className="text-[9px] font-bold text-indigo-500">Question {step + 1} of {quizSteps.length}</p>
                                    </div>
                                </div>
                                <div className="flex-1 max-w-[120px] h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600 transition-all duration-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]" style={{ width: `${((step + 1) / quizSteps.length) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 max-h-[450px] overflow-y-auto custom-scroll">
                            <h2 className="text-xl font-black text-slate-900 mb-6">{quizSteps[step].title}</h2>
                            {quizSteps[step].type === 'select' && (
                                <div className="grid grid-cols-2 gap-3">
                                    {quizSteps[step].options?.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => {
                                                setFormData({ ...formData, [quizSteps[step].id]: opt });
                                                handleNextQuiz();
                                            }}
                                            className={`p-4 rounded-2xl border-2 text-xs font-black transition-all text-left uppercase tracking-widest ${formData[quizSteps[step].id as keyof typeof formData] === opt
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md transform scale-[1.02]'
                                                : 'border-slate-50 hover:border-indigo-100 text-slate-500 hover:bg-slate-50'
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {quizSteps[step].type === 'multi-text' && (
                                <div className="space-y-5">
                                    {quizSteps[step].fields?.map((field: any) => (
                                        <div key={field.id}>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{field.label}</label>
                                            {field.type === 'select' ? (
                                                <select
                                                    value={formData[field.id as keyof typeof formData] as string}
                                                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                                                    className="w-full p-4 rounded-2xl border-2 border-slate-50 focus:border-indigo-100 focus:bg-white outline-none font-black text-xs text-slate-700 bg-slate-50 transition-all"
                                                >
                                                    <option value="">Select Option...</option>
                                                    {field.options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={formData[field.id as keyof typeof formData] as string}
                                                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                                                    placeholder={field.placeholder}
                                                    className="w-full p-4 rounded-2xl border-2 border-slate-50 focus:border-indigo-100 focus:bg-white outline-none font-black text-xs text-slate-700 placeholder-slate-300 bg-slate-50 transition-all"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {quizSteps[step].type === 'products' && (
                                <div className="space-y-4">
                                    {formData.products.map((p, idx) => (
                                        <div key={idx} className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-100">
                                            <input
                                                type="text"
                                                value={p.name}
                                                onChange={(e) => {
                                                    const newProds = [...formData.products];
                                                    newProds[idx].name = e.target.value;
                                                    setFormData({ ...formData, products: newProds });
                                                }}
                                                placeholder="Service Name (e.g. Design, Coaching)..."
                                                className="w-full p-3 rounded-xl border border-slate-200 outline-none font-black text-xs"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setFormData({ ...formData, products: [...formData.products, { name: '', images: [] }] })}
                                        className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                                    >
                                        + Add Another Offering
                                    </button>
                                </div>
                            )}

                            {quizSteps[step].type === 'textarea' && (
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder={quizSteps[step].placeholder}
                                    rows={5}
                                    className="w-full p-6 rounded-[2rem] border-2 border-slate-50 focus:border-indigo-100 focus:bg-white outline-none font-bold text-xs text-slate-700 placeholder-slate-300 bg-slate-50 transition-all resize-none leading-relaxed"
                                />
                            )}
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                            <button onClick={handleBackQuiz} disabled={step === 0} className="px-6 py-3 rounded-xl font-black text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-all text-[10px] uppercase tracking-widest">Back</button>
                            <button onClick={handleNextQuiz} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-105 transition-all active:scale-95 flex items-center gap-3">
                                {step === quizSteps.length - 1 ? 'Start Building' : 'Continue'}
                                <span className="material-symbols-outlined text-xs font-black">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Login / Profile Phase */}
                {phase === 'LOGIN' && (
                    <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100 animate-in slide-in-from-right-4 duration-500 text-center">
                        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <span className="material-symbols-outlined text-4xl font-black">person_add</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 leading-tight">Founder Identity</h2>
                        <p className="text-slate-500 text-xs mt-3 font-bold uppercase tracking-widest opacity-60">Unlock your AI Factory Dashboard</p>

                        <div className="mt-8 space-y-4 mb-10 text-left">
                            <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-indigo-600">mail</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Registration Email</p>
                                    <p className="text-xs font-black text-slate-700">{formData.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="First Name" className="w-full p-5 bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none font-black text-xs text-slate-700" />
                                <input type="text" placeholder="Last Name" className="w-full p-5 bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none font-black text-xs text-slate-700" />
                            </div>
                            <input type="password" placeholder="Secure Password" className="w-full p-5 bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none font-black text-xs text-slate-700" />
                        </div>

                        <button
                            onClick={() => setPhase('BUILDING_ASSETS')}
                            className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-500/30 hover:scale-[1.02] transition-all active:scale-95"
                        >
                            Initialize AI Core
                        </button>
                    </div>
                )}

                {/* Building Loader */}
                {phase === 'BUILDING_ASSETS' && (
                    <div className="bg-slate-900 rounded-[3rem] p-12 text-center text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px]"></div>
                        <div className="w-16 h-16 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin mx-auto mb-8 shadow-[0_0_20px_rgba(79,70,229,0.3)]"></div>
                        <h2 className="text-3xl font-black mb-3 uppercase tracking-tighter italic">AI Designing...</h2>
                        <p className="text-[10px] text-indigo-400 font-bold tracking-[0.3em] uppercase">Constructing Brand Identity</p>

                        <div className="mt-12 grid grid-cols-3 gap-4 opacity-40">
                            <div className="h-1 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 w-full animate-pulse"></div></div>
                            <div className="h-1 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 w-1/2 animate-pulse"></div></div>
                            <div className="h-1 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 w-3/4 animate-pulse"></div></div>
                        </div>
                    </div>
                )}

                {/* Selection Phases (Overlays) */}
                {(phase === 'LOGO_SAMPLES' || phase === 'LOGO_SELECTION' || phase === 'WEBSITE_FLOW') && (
                    <div className="fixed inset-0 z-[110] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-8 overflow-hidden">
                        {/* Phase 内容 ... (ommited for brevity but keeping logic same) */}
                        {/* We reuse the same logic as before but with polished UI */}
                        {phase === 'LOGO_SAMPLES' && (
                            <div className="bg-white rounded-[4rem] p-16 max-w-5xl w-full shadow-2xl animate-in zoom-in-95 duration-700 text-left">
                                <div className="flex items-center justify-between mb-12">
                                    <div>
                                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Brand Philosophy</h2>
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2 opacity-60">Engine identified 6 core directions</p>
                                    </div>
                                    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100">
                                        <span className="material-symbols-outlined text-indigo-600 text-3xl font-black">palette</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                    {logoSamples.map((logo) => (
                                        <button
                                            key={logo.id}
                                            onClick={() => {
                                                setFormData({ ...formData, logoPreference: logo.name });
                                                setPhase('LOGO_SELECTION');
                                            }}
                                            className="group relative bg-slate-50 aspect-video rounded-[2.5rem] border-2 border-transparent hover:border-indigo-600 transition-all overflow-hidden flex flex-col items-center justify-center p-8"
                                        >
                                            <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity grayscale group-hover:grayscale-0">
                                                <img src={logo.preview} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <span className="material-symbols-outlined text-4xl text-indigo-600 group-hover:scale-110 transition-transform mb-3 relative z-10 font-black">{logo.icon}</span>
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] relative z-10">{logo.name}</span>
                                            <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                                <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Select Vision</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {phase === 'LOGO_SELECTION' && (
                            <div className="bg-white rounded-[4rem] p-16 max-w-7xl w-full shadow-2xl animate-in zoom-in-95 duration-700 flex flex-col max-h-[90vh] text-left">
                                <div className="flex items-center justify-between mb-12 shrink-0">
                                    <div>
                                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">AI Prototypes</h2>
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2 opacity-60">10 recursive variations for {formData.logoPreference}</p>
                                    </div>
                                    <button onClick={() => setPhase('LOGO_SAMPLES')} className="px-10 py-4 bg-slate-100 hover:bg-slate-200 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all">Back to Concepts</button>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scroll grid grid-cols-2 md:grid-cols-5 gap-8 p-4">
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <div key={i} className="group relative bg-white aspect-square rounded-[3rem] border-2 border-slate-100 hover:border-indigo-600 shadow-sm hover:shadow-2xl transition-all flex flex-col items-center justify-center p-12 cursor-pointer" onClick={() => setPhase('WEBSITE_FLOW')}>
                                            <div className={`w-20 h-20 rounded-full border-4 border-indigo-600 flex items-center justify-center text-4xl font-black text-indigo-600 group-hover:scale-110 transition-transform`}>
                                                {formData.businessName.charAt(0)}
                                            </div>
                                            <div className="absolute inset-x-0 bottom-6 flex justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                <span className="text-[8px] font-black text-white bg-indigo-600 px-3 py-1.5 rounded-full uppercase tracking-widest">Pick Prototype</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {phase === 'WEBSITE_FLOW' && (
                            <div className="bg-white rounded-[4rem] max-w-7xl w-full h-[85vh] shadow-2xl animate-in zoom-in-95 duration-700 overflow-hidden flex text-left">
                                <div className="w-80 bg-slate-50 border-r border-slate-100 flex flex-col p-10">
                                    <h3 className="text-2xl font-black mb-10 tracking-tighter uppercase">Factory</h3>
                                    <div className="flex-1 space-y-4">
                                        {['Hero Section', 'Product Grid', 'Service List', 'Testimonials', 'Contact Us'].map(comp => (
                                            <div key={comp} className="p-5 bg-white rounded-2xl border border-slate-200 text-[10px] font-black text-slate-600 flex items-center justify-between shadow-sm cursor-grab uppercase tracking-widest hover:border-indigo-100 transition-all">
                                                {comp}
                                                <span className="material-symbols-outlined text-[16px] opacity-30">drag_indicator</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setPhase('COMPLETED')}
                                        className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest mt-10 shadow-2xl shadow-slate-900/20 hover:scale-[1.02] transition-all"
                                    >
                                        Publish Store
                                    </button>
                                </div>
                                <div className="flex-1 bg-slate-100 p-16 overflow-y-auto">
                                    <div className="bg-white w-full min-h-full rounded-[3rem] shadow-2xl p-16 text-center border border-slate-200/50">
                                        <nav className="flex justify-between items-center mb-24 text-[10px] font-black uppercase tracking-[0.2em]">
                                            <span className="italic">{formData.businessName}</span>
                                            <div className="space-x-10 text-slate-400"><span>Products</span><span>About</span><span>Contact</span></div>
                                        </nav>
                                        <h1 className="text-6xl font-black mb-10 tracking-tighter text-slate-900">Innovative {formData.service} <br /> Done Right.</h1>
                                        <p className="text-slate-500 max-w-xl mx-auto mb-16 text-sm font-medium leading-relaxed uppercase tracking-wide opacity-80">{formData.description}</p>
                                        <div className="flex justify-center gap-6">
                                            <div className="px-10 py-4 bg-indigo-600 text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/30">Get Started</div>
                                            <div className="px-10 py-4 bg-slate-100 text-slate-900 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest">Deep Dive</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Phase 8: Completed */}
                {phase === 'COMPLETED' && (
                    <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-slate-100 animate-in flip-in-y duration-1000 overflow-hidden text-center relative">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-full -translate-y-20 translate-x-20 opacity-50 blur-xl"></div>
                        <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <span className="material-symbols-outlined text-4xl font-black">check_circle</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 leading-tight uppercase tracking-tighter">Brand is Live!</h2>
                        <p className="text-slate-500 text-[10px] mt-4 font-black uppercase tracking-[0.3em] opacity-60 mb-12">Universal Stack Initialized</p>

                        <div className="space-y-4 mb-12 text-left">
                            <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 group hover:border-indigo-100 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                                        <span className="material-symbols-outlined text-xl font-black">task_alt</span>
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">Founder Roadmap</span>
                                </div>
                                <span className="text-[9px] bg-indigo-600 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest">Complete</span>
                            </div>
                            <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 group hover:border-indigo-100 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                                        <span className="material-symbols-outlined text-xl font-black">brush</span>
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">Digital Identity</span>
                                </div>
                                <span className="text-[9px] bg-indigo-600 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest">Rendered</span>
                            </div>
                            <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 group hover:border-indigo-100 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                                        <span className="material-symbols-outlined text-xl font-black">web</span>
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">Custom Workspace</span>
                                </div>
                                <span className="text-[9px] bg-indigo-600 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest">Active</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    onComplete(formData);
                                    window.location.reload();
                                }}
                                className="flex-1 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:scale-[1.02] transition-all"
                            >
                                Enter Workspace
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
