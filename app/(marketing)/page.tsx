'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Building2, ShieldCheck, Zap, MessageCircle, FileText, CheckCircle2, Star,
    Scale, HelpCircle, ArrowRight, Laptop, Award, PhoneCall, AlertCircle, Check, X, Sparkles, ChevronDown
} from 'lucide-react';
import LeadCaptureModal from '@/components/marketing/LeadCaptureModal';
import RkleAiAdvisor from '@/components/steps/RkleAiAdvisor';

export default function HomePage() {
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<string | null>(null);

    // Embedded Form State
    const [formData, setFormData] = useState({ name: '', phone: '', stage: 'Idea' });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [businessNameInput, setBusinessNameInput] = useState('');
    const [bizosDropdownOpen, setBizosDropdownOpen] = useState(false);

    const openLeadModal = (serviceName?: string) => {
        if (serviceName) {
            setSelectedService(serviceName);
        } else {
            setSelectedService(null);
        }
        setIsLeadModalOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) return;
        
        console.log('Consultation request submitted:', formData);
        setFormSubmitted(true);
        setTimeout(() => {
            window.location.href = `/onboarding?name=${encodeURIComponent(formData.name)}&phone=${encodeURIComponent(formData.phone)}&stage=${encodeURIComponent(formData.stage)}`;
        }, 1500);
    };

    const CORE_SERVICES = [
        {
            title: 'Business Setup & Incorporation',
            description: 'Start your legal entity structure correctly and quickly.',
            icon: Building2,
            features: [
                'Pvt Ltd / LLP Registration',
                'DSC, PAN, TAN',
                'Bank Account Setup'
            ]
        },
        {
            title: 'Compliance & CA Services',
            description: 'Zero-stress tax filings and continuous legal adherence.',
            icon: ShieldCheck,
            features: [
                'GST Filing',
                'ITR & Audits',
                'ROC Filings'
            ]
        },
        {
            title: 'Financial Planning & VCFO',
            description: 'Raise capital and plan budgets with seasoned financial partners.',
            icon: FileText,
            features: [
                'Financial Planning',
                'Business Loans',
                'CFO Advisory'
            ]
        }
    ];

    const FAQ_DATA = [
        {
            q: 'Is SetMyBizz a CA firm or an automated platform?',
            a: 'SetMyBizz is a corporate advisory and startup support platform backed by a dedicated team of Chartered Accountants, CS, and corporate lawyers. We merge professional expertise with clean digital workflows to deliver stress-free business operations.'
        },
        {
            q: 'What details do I need to register a company?',
            a: 'You only need basic KYC documents (PAN, Aadhaar, bank statement, or utility bill) of the proposed directors and proof of the registered office address (electricity bill/rent agreement).'
        },
        {
            q: 'When is BizOS launching?',
            a: 'BizOS is currently under active development. It will launch soon as a complimentary digital platform for our clients to centralize government certificates, verify compliance status in real-time, and manage invoicing.'
        },
        {
            q: 'Are government fees included in the service cost?',
            a: 'Our plans cover our professional fees. Government fee calculations vary dynamically based on your state of incorporation and authorized capital, which our advisors will calculate upfront for total transparency.'
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden relative">
            
            {/* ─── NAV / HEADER ─── */}
            <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3.5 group">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-300">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-slate-950 text-lg tracking-tighter uppercase leading-none">SetMyBizz</span>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Start, Run & Manage Your Startup</span>
                        </div>
                    </Link>

                    {/* Navigation links - Simplified */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#services" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">CA Services</a>
                        <a href="#founders" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">For Founders</a>
                        <a href="#consultation" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Get Free Consultation</a>
                        <a href="#faqs" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">FAQs</a>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* bizOS Dropdown Button */}
                        <div className="relative flex items-center">
                            <div className="flex items-center gap-1">
                                <Link 
                                    href="/bizos" 
                                    className="text-sm font-black text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>bizOS</span>
                                </Link>
                                <button 
                                    onClick={() => setBizosDropdownOpen(!bizosDropdownOpen)}
                                    className="text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center p-1 rounded-full hover:bg-blue-50/50"
                                >
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${bizosDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                            </div>

                            {/* Dropdown Menu */}
                            {bizosDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setBizosDropdownOpen(false)} />
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-3 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1.5">
                                            Ecosystem Parts
                                        </div>
                                        <div className="space-y-0.5">
                                            {[
                                                { label: 'Bizdesk', href: '/os?topNav=bizdesk&tab=home', desc: 'Manage legal & finance' },
                                                { label: 'Launchpad', href: '/os?topNav=launchpad', desc: 'Design brand assets' },
                                                { label: 'Ai workspace', href: '/os?topNav=ai-workspace', desc: 'AI co-founder workspace' },
                                                { label: 'Arkle', href: '/os?arkle=true', desc: 'Voice assistant agent' }
                                            ].map((item) => (
                                                <Link
                                                    key={item.label}
                                                    href={item.href}
                                                    onClick={() => setBizosDropdownOpen(false)}
                                                    className="block w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-all group"
                                                >
                                                    <span className="block text-[11.5px] font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                                                        {item.label}
                                                    </span>
                                                    <span className="block text-[8.5px] font-medium text-slate-400 mt-0.5 leading-none">
                                                        {item.desc}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <a 
                            href="https://wa.me/918501999457"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 transition-all"
                        >
                            <PhoneCall size={12} className="text-emerald-500" />
                            <span>Talk to Expert</span>
                        </a>

                        <button 
                            onClick={() => openLeadModal('nav_register')}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-xs transition-all shadow-md shadow-blue-600/10"
                        >
                            Register Company
                        </button>
                    </div>
                </div>
            </nav>

            {/* ─── HERO SECTION ─── */}
            <section className="pt-36 pb-16 px-6 relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-100/30 rounded-full blur-[100px] -z-10" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100/80">
                        <Award size={12} />
                        Built for Startups & Founders
                    </span>

                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-[1.15]">
                        Start, Run & Scale Your Business — <br />
                        <span className="text-blue-600">With Complete CA & Business Support</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
                        From company registration to scaling globally — we handle your complete <strong>business backend (CA, finance, compliance)</strong> so you can focus on growth.
                    </p>

                    <div className="max-w-2xl mx-auto mb-8">
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!businessNameInput.trim()) return;
                                window.location.href = `/onboarding?name=${encodeURIComponent(businessNameInput)}`;
                            }}
                            className="flex flex-col sm:flex-row items-center gap-3 bg-white border border-slate-200 p-2 rounded-3xl shadow-lg focus-within:border-blue-500 transition-all"
                        >
                            <div className="flex-1 w-full flex items-center gap-3 px-3 py-2 sm:py-0">
                                <Building2 className="text-slate-400 shrink-0" size={20} />
                                <input 
                                    type="text"
                                    placeholder="Enter your business name or idea..."
                                    value={businessNameInput}
                                    onChange={(e) => setBusinessNameInput(e.target.value)}
                                    className="w-full bg-transparent text-sm font-semibold focus:outline-none placeholder:text-slate-400 text-slate-800"
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
                            >
                                <span>Get Started</span>
                                <ArrowRight size={16} />
                            </button>
                        </form>

                        {/* List of sub-benefits */}
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-4 text-[11px] font-bold text-slate-500">
                            <span className="flex items-center gap-1.5"><Check size={12} className="text-blue-500" /> Build your Business</span>
                            <span className="flex items-center gap-1.5"><Check size={12} className="text-blue-500" /> Tailor-made business setup</span>
                            <span className="flex items-center gap-1.5"><Check size={12} className="text-blue-500" /> Validate business plan</span>
                            <span className="flex items-center gap-1.5"><Check size={12} className="text-blue-500" /> Fix business challenges</span>
                            <span className="flex items-center gap-1.5"><Check size={12} className="text-blue-500" /> Get free personal business advisor</span>
                        </div>
                    </div>

                    <p className="text-xs font-bold text-slate-500 mb-6 uppercase tracking-wider">
                        Trusted by 180+ startups & 900+ businesses across India
                    </p>

                    {/* Micro Trust badges */}
                    <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                        <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> No consultation fees</span>
                        <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> Expert CA & finance team</span>
                        <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> Response within 24 hours</span>
                    </div>
                </div>
            </section>

            {/* ─── WHERE MOST FOUNDERS STRUGGLE SECTION ─── */}
            <section className="py-20 px-6 bg-slate-50 border-y border-slate-100">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-100">Common Obstacles</span>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-3 tracking-tight">Where Most Founders Struggle</h2>
                    </div>

                    <div className="space-y-4 max-w-xl mx-auto mb-12">
                        {[
                            'Confusion in company registration & business structure',
                            'Difficulty managing GST, compliance & filings',
                            'Lack of proper financial planning & control',
                            'Challenges in getting loans or funding',
                            'No clear roadmap for business growth'
                        ].map((bullet, idx) => (
                            <div key={idx} className="flex items-start gap-3 bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs">
                                <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                                <span className="text-slate-700 font-semibold text-sm">{bullet}</span>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <p className="text-lg font-bold text-slate-800 mb-8">
                            That’s where SetMyBizz steps in.
                        </p>

                        <div className="flex flex-col items-center gap-4">
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <a
                                    href="https://wa.me/918501999457"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-all"
                                >
                                    Talk to Expert
                                </a>
                                <button
                                    onClick={() => openLeadModal('struggle_plan_15min')}
                                    className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-600/10"
                                >
                                    Get Your Free Business Setup Plan in 15 Minutes
                                </button>
                            </div>
                            
                            {/* Micro Trust badges */}
                            <div className="flex flex-wrap justify-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">
                                <span className="flex items-center gap-1"><Check size={10} className="text-emerald-500" /> No consultation fees</span>
                                <span className="flex items-center gap-1"><Check size={10} className="text-emerald-500" /> Expert CA & finance team</span>
                                <span className="flex items-center gap-1"><Check size={10} className="text-emerald-500" /> Response within 24 hours</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── 3-STEP FOUNDERS SECTION ─── */}
            <section id="founders" className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Built for Startups & Founders</h2>
                        <div className="w-12 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                        {/* Step 1: Start */}
                        <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-8 relative hover:shadow-md transition-all">
                            <div className="absolute top-6 right-8 text-4xl font-black text-blue-100 select-none">01</div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">For New Founders</span>
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 font-black text-lg">
                                START
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-slate-700 font-semibold text-sm">
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                    <span>Idea validation & basic planning</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-semibold text-sm">
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                    <span>Company registration (Pvt Ltd, LLP, etc.)</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-semibold text-sm">
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                    <span>Business structure & compliance setup</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-semibold text-sm">
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                    <span>Tailored business setup guidance</span>
                                </li>
                            </ul>
                        </div>

                        {/* Step 2: Run */}
                        <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-8 relative hover:shadow-md transition-all">
                            <div className="absolute top-6 right-8 text-4xl font-black text-blue-100 select-none">02</div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">For Growing Businesses</span>
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 font-black text-lg">
                                RUN
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-slate-700 font-semibold text-sm">
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                    <span>GST, compliance & filings</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-semibold text-sm">
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                    <span>Accounting & bookkeeping</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-semibold text-sm">
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                    <span>Audit & legal support</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-semibold text-sm">
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                    <span>Financial management & VCFO</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-semibold text-sm">
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                    <span>Personal business advisory</span>
                                </li>
                            </ul>
                        </div>

                        {/* Step 3: Scale */}
                        <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-8 relative hover:shadow-md transition-all">
                            <div className="absolute top-6 right-8 text-4xl font-black text-blue-100 select-none">03</div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">For Scaling Companies</span>
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 font-black text-lg">
                                SCALE
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-slate-700 font-semibold text-sm">
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                    <span>Financial planning & funding support</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-semibold text-sm">
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                    <span>Business growth strategy</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-semibold text-sm">
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                    <span>Global business setup</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-semibold text-sm">
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                    <span>US incorporation & market access</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-semibold text-sm">
                                    <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                                    <span>Export & expansion support</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <p className="text-center text-slate-500 font-bold text-sm mb-8">
                        We support you at every stage of your business journey.
                    </p>
                </div>
            </section>

            {/* ─── WHY SETMYBIZZ DIFFERENTIATION SECTION ─── */}
            <section className="py-20 px-6 bg-slate-50 border-y border-slate-100">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Why SetMyBizz?</h2>
                        <p className="text-slate-500 font-semibold mt-2">How we compare to traditional service providers.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        {/* Others */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-8">
                            <h4 className="text-lg font-black text-slate-400 mb-6 uppercase tracking-wider">Traditional Providers</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-slate-500 font-semibold text-sm">
                                    <X size={18} className="text-rose-500 shrink-0 mt-0.5" />
                                    <span>Only company registration services</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-500 font-semibold text-sm">
                                    <X size={18} className="text-rose-500 shrink-0 mt-0.5" />
                                    <span>One-time service model</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-500 font-semibold text-sm">
                                    <X size={18} className="text-rose-500 shrink-0 mt-0.5" />
                                    <span>No long-term advisory</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-500 font-semibold text-sm">
                                    <X size={18} className="text-rose-500 shrink-0 mt-0.5" />
                                    <span>No structured business roadmap</span>
                                </li>
                            </ul>
                        </div>

                        {/* SetMyBizz */}
                        <div className="bg-white border-2 border-blue-500 rounded-3xl p-8 shadow-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                                Startup Partner
                            </div>
                            <h4 className="text-lg font-black text-blue-600 mb-6 uppercase tracking-wider">SetMyBizz</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-slate-800 font-bold text-sm">
                                    <Check size={18} className="text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                                    <span>End-to-end startup support (Start → Run → Scale)</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-800 font-bold text-sm">
                                    <Check size={18} className="text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                                    <span>Long-term business partner approach</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-800 font-bold text-sm">
                                    <Check size={18} className="text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                                    <span>Personal business advisor & VCFO support</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-800 font-bold text-sm">
                                    <Check size={18} className="text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                                    <span>Structured growth & financial planning</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
                            <a
                                href="https://wa.me/918501999457"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all"
                            >
                                Talk to Expert
                            </a>
                            <button
                                onClick={() => openLeadModal('why_consultation')}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all"
                            >
                                Book Free Consultation
                            </button>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            ⚡ Free consultation — limited slots available
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── SIMPLIFIED CORE SERVICES SECTION ─── */}
            <section id="services" className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Our Core Services</h2>
                        <p className="text-slate-500 font-semibold mt-2">Professional CA & incorporation solutions crafted for modern companies.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        {CORE_SERVICES.map((srv, idx) => {
                            const IconComp = srv.icon;
                            return (
                                <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-3xl p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300">
                                    <div>
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                                            <IconComp size={22} />
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{srv.title}</h3>
                                        <p className="text-slate-500 text-[11px] leading-relaxed font-medium mb-5">{srv.description}</p>
                                        
                                        <ul className="space-y-3 mb-8">
                                            {srv.features.map((feat, fidx) => (
                                                <li key={fidx} className="flex items-start gap-2.5 text-xs text-slate-700 font-bold">
                                                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                                    <span>{feat}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <button 
                                        onClick={() => openLeadModal(srv.title)}
                                        className="w-full py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-black transition-all"
                                    >
                                        Inquire About Service
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center">
                        <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
                            <a
                                href="https://wa.me/918501999457"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all"
                            >
                                Talk to Expert
                            </a>
                            <button
                                onClick={() => openLeadModal('services_consultation')}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all"
                            >
                                Book Free Consultation
                            </button>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            ⚡ Get expert guidance within 24 hours
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── LEAD CAPTURE FORM SECTION ─── */}
            <section id="consultation" className="py-20 px-6 bg-slate-50 border-t border-slate-100">
                <div className="max-w-lg mx-auto bg-white border border-slate-200/60 rounded-3xl p-8 md:p-10 shadow-sm">
                    <div className="text-center mb-8">
                        <span className="text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-widest">Advisory desk</span>
                        <h3 className="text-2xl font-black text-slate-900 mt-3 mb-2">Get Free Business Consultation</h3>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Free consultation — limited slots available</p>
                    </div>

                    {!formSubmitted ? (
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Name</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Phone Number</label>
                                <input 
                                    type="tel" 
                                    required
                                    placeholder="Enter mobile number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Business Stage</label>
                                <select 
                                    value={formData.stage}
                                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat"
                                >
                                    <option value="Idea">Idea Stage</option>
                                    <option value="Running">Running Business</option>
                                    <option value="Scaling">Scaling Phase</option>
                                </select>
                            </div>

                            <button 
                                type="submit"
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-black transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-2"
                            >
                                <span>Get Free Consultation</span>
                                <ArrowRight size={16} />
                            </button>

                            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-4">
                                Our team will connect with you within 24 hours.
                            </p>
                        </form>
                    ) : (
                        <div className="text-center py-12 flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
                                <Check size={24} />
                            </div>
                            <h4 className="font-extrabold text-slate-900 text-lg mb-1">Request Received!</h4>
                            <p className="text-slate-500 text-xs font-semibold">Redirecting to onboarding desk...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ─── BIZOS POSITIONING SECTION ─── */}
            <section className="py-20 px-6 bg-slate-50 border-t border-slate-100">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                        <Zap size={12} className="animate-pulse" />
                        Launching Soon
                    </span>
                    
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4">
                        BizOS (AI Business Platform — Currently Under Development, Launching Soon)
                    </h3>
                    
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
                        A proprietary operational dashboard designed to securely store your incorporation certificates, track monthly tax deadlines, and automate client invoices. Active SetMyBizz clients will get early beta access.
                    </p>
                </div>
            </section>

            {/* ─── TRUST SECTION ─── */}
            <section className="py-20 px-6 bg-white border-t border-slate-100">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Trusted by Founders & Businesses</h2>
                        <div className="w-12 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
                        <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                            <h4 className="text-4xl font-black text-blue-600 mb-2">180+</h4>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Startups Supported</p>
                        </div>
                        <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                            <h4 className="text-4xl font-black text-blue-600 mb-2">900+</h4>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Businesses Served</p>
                        </div>
                        <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                            <h4 className="text-4xl font-black text-blue-600 mb-2">180+</h4>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Founders Guided</p>
                        </div>
                    </div>

                    <div id="founders" className="bg-gradient-to-br from-blue-50/20 to-slate-50 border border-slate-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto shadow-xs">
                        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 font-black text-3xl shadow-sm border-2 border-white">
                            MK
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Founder & Managing Partner</span>
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-1 mb-3">CA Mahendra Kolli</h3>
                            <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-semibold">
                                "Working closely with founders as their business & financial partner."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── PRICING PLACEHOLDER (To keep navigation clean) ─── */}
            <section id="pricing" className="py-20 px-6 bg-slate-50/50 border-t border-slate-100">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">Transparent Pricing, Personalized Solutions</h2>
                    <p className="text-slate-500 text-xs md:text-sm font-semibold max-w-xl mx-auto leading-relaxed mb-6">
                        No surprise billing. Get clear upfront pricing based on your startup structure. Let our advisory team suggest the ideal compliance roadmap for you.
                    </p>
                    <button 
                        onClick={() => openLeadModal('pricing_inquiry')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all"
                    >
                        Request Quote Report
                    </button>
                </div>
            </section>

            {/* ─── FAQS SECTION ─── */}
            <section id="faqs" className="py-20 px-6 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-6">
                        {FAQ_DATA.map((faq, i) => (
                            <div key={i} className="border-b border-slate-200/60 pb-6">
                                <h4 className="text-base font-extrabold text-slate-950 mb-2 flex items-start gap-3">
                                    <HelpCircle size={16} className="text-blue-500 shrink-0 mt-1" />
                                    <span>{faq.q}</span>
                                </h4>
                                <p className="text-slate-600 text-xs md:text-sm font-semibold leading-relaxed pl-7">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FINAL CTA SECTION ─── */}
            <section className="py-24 px-6 text-center bg-slate-900 text-white relative overflow-hidden">
                <div className="max-w-3xl mx-auto relative z-10">
                    <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
                        Still figuring out your business setup or next step?
                    </h2>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 max-w-xl mx-auto font-medium">
                        Get expert guidance tailored to your business stage — whether you're starting, running, or scaling.
                    </p>
                    
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="https://wa.me/918501999457"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-slate-900 font-extrabold rounded-xl hover:bg-slate-100 transition-all text-sm"
                            >
                                <PhoneCall size={14} className="text-emerald-500" />
                                <span>Talk to Expert</span>
                            </a>
                            <button
                                onClick={() => openLeadModal('final_plan_15min')}
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-extrabold rounded-xl hover:bg-blue-700 transition-all text-sm"
                            >
                                Get Your Free Business Setup Plan in 15 Minutes
                            </button>
                        </div>
                        
                        <p className="text-rose-400 text-xs font-bold uppercase tracking-wider mt-2">
                            Free consultation — limited slots available
                        </p>

                        {/* Micro Trust badges */}
                        <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">
                            <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> No consultation fees</span>
                            <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> Expert CA & finance team</span>
                            <span className="flex items-center gap-1.5"><Check size={12} className="text-emerald-500" /> Response within 24 hours</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="py-16 px-6 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-slate-600">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                                <Sparkles size={16} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-slate-950 text-sm tracking-tighter uppercase leading-none">SetMyBizz</span>
                                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1">Start, Run & Manage Your Startup</span>
                            </div>
                        </div>
                        <p className="text-xs font-bold leading-relaxed max-w-xs mb-6 uppercase tracking-wider text-slate-400">
                            Partnering with founders for startup setups, accounting compliance, and strategic scale.
                        </p>
                    </div>

                    <div>
                        <h5 className="font-black text-slate-950 uppercase text-[10px] tracking-[0.2em] mb-4">Quick Links</h5>
                        <ul className="space-y-3.5 text-xs font-bold text-slate-500">
                            <li><a href="#services" className="hover:text-blue-600 transition-colors">CA Services</a></li>
                            <li><a href="#founders" className="hover:text-blue-600 transition-colors">For Founders</a></li>
                            <li><a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                            <li><a href="#faqs" className="hover:text-blue-600 transition-colors">FAQs</a></li>
                        </ul>
                    </div>

                    <div>
                        <h5 className="font-black text-slate-950 uppercase text-[10px] tracking-[0.2em] mb-4">Office & Support</h5>
                        <p className="text-xs font-bold text-slate-500 leading-relaxed mb-3">
                            Visakhapatnam, Andhra Pradesh, India.
                        </p>
                        <a 
                            href="https://wa.me/918501999457" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs font-black text-blue-600 hover:underline"
                        >
                            +91 78933 32884 (WhatsApp Support)
                        </a>
                    </div>
                </div>
                
                <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© 2026 SetMyBizz Technologies. All Rights Reserved.</p>
                </div>
            </footer>

            {/* ─── STICKY WHATSAPP FLOATING CTA ─── */}
            <div className="fixed bottom-6 right-24 md:right-28 z-50 animate-pulse hover:scale-105 transition-all">
                <a 
                    href="https://wa.me/918501999457"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-5 py-3 rounded-full shadow-lg shadow-emerald-500/20"
                >
                    <MessageCircle size={18} fill="currentColor" />
                    <span>Talk to Expert (WhatsApp)</span>
                </a>
            </div>

            {/* ─── ARKLE FLOATING AI ADVISOR CHATBOT ─── */}
            <RkleAiAdvisor onLeadCapture={() => openLeadModal()} />

            {/* ─── LEAD CAPTURE MODAL ─── */}
            <LeadCaptureModal 
                isOpen={isLeadModalOpen}
                onClose={() => setIsLeadModalOpen(false)}
                onComplete={(data) => {
                    console.log('Lead captured:', data);
                    setIsLeadModalOpen(false);
                    window.location.href = '/onboarding';
                }}
                source={selectedService ? `marketing_landing_${selectedService}` : "marketing_landing_root"}
            />
        </div>
    );
}
