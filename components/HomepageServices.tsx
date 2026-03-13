'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Building2, Search, Shield, Bot, LayoutTemplate, BriefcaseBusiness, Users, Banknote, ShieldCheck, Scale, Globe2, FileText, ChevronRight, TrendingUp, Rocket, ShoppingCart, AppWindow, Image as ImageIcon, FileImage, Receipt, Share2, Presentation, UserCog, MessageSquareText, Calculator, Lightbulb, UserCheck } from 'lucide-react';

type CategoryKey = 'setup' | 'launch' | 'scale' | 'global';
const CATEGORIES: CategoryKey[] = ['setup', 'launch', 'scale', 'global'];

// Per-category color config and metadata
const CAT_CONFIG: Record<CategoryKey, {
    label: string;
    buttonIcon: any;
    hookTitle: string;
    hookDesc: React.ReactNode | string;
    tabStyles: string;
    items: { title: string; icon: any; link: string; isFree?: boolean; color: string; bg: string }[];
}> = {
    setup: {
        label: 'MyBizz Advisor',
        buttonIcon: UserCog,
        hookTitle: 'Start Here. Build Here. Operate & Manage Here.',
        hookDesc: (
            <>
                Transform your raw idea into reality. Meet your personal <strong className="text-slate-800">MyBizz Advisor</strong>, designed to guide your solo startup journey through 3 core pillars: <span className="font-bold text-blue-700">1. Tailored Business Setup</span> (Proprietorship to Pvt Ltd packages), <span className="font-bold text-indigo-700">2. Personal Business Advisor</span> (CFO, Tech Upgrades, Gap-solving AI), and <span className="font-bold text-emerald-700">3. Go Global Access</span> with intelligent tracking. Every inch of your business assistance is here.
            </>
        ),
        tabStyles: 'text-blue-600 bg-blue-50 border-blue-200 shadow-[0_4px_12px_rgba(37,99,235,0.15)] ring-2 ring-blue-500/20',
        items: [
            { title: 'Custom Setup Packages', icon: Building2, link: '/services/company-registration', color: 'text-blue-600', bg: 'bg-blue-50' },
            { title: 'AI Problem Solver Tab', icon: MessageSquareText, link: '/onboarding', isFree: true, color: 'text-purple-600', bg: 'bg-purple-50' },
            { title: 'Virtual CFO & GST', icon: Calculator, link: '/services/gst-registration', color: 'text-rose-600', bg: 'bg-rose-50' },
            { title: 'Tech & Skill Upgrades', icon: Lightbulb, link: '/onboarding', isFree: true, color: 'text-amber-600', bg: 'bg-amber-50' },
            { title: 'Global Expansion AI', icon: Globe2, link: '/start-in-india', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: 'Guest & User Tracking', icon: UserCheck, link: '/onboarding', isFree: true, color: 'text-cyan-600', bg: 'bg-cyan-50' },
            { title: 'Business Advisory', icon: Users, link: '/onboarding', color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { title: 'Projects & Funding', icon: Banknote, link: '/services/project-report', isFree: true, color: 'text-teal-600', bg: 'bg-teal-50' },
        ]
    },
    launch: {
        label: 'Launch Business',
        buttonIcon: Rocket,
        hookTitle: 'Build Your Entire Startup & Brand Presence in Minutes',
        hookDesc: (
            <div className="flex flex-col items-center">
                <span>
                    Turn your idea into a fully operational startup without expensive agencies, developers, or technical skills. While others just build websites, our AI LaunchPad generates your complete digital identity on day one. From professional logos, brand kits, and e-commerce stores, to social media graphics, brochures, invoices, pitch decks, and custom apps with AI tools. Everything you need to get your first customers instantly, built for you right away.
                </span>
                <div className="mt-5 mb-5 flex justify-center z-10">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-linear-to-r from-violet-100 to-fuchsia-100 text-purple-800 rounded-full text-[11px] font-black uppercase tracking-wider relative overflow-hidden shadow-sm border border-purple-200">
                        <span className="absolute inset-0 bg-linear-to-r from-purple-400/20 to-pink-400/20 animate-pulse" />
                        🚀 Beta Waitlist: World's First AI Startup LaunchPad
                    </span>
                </div>
                
                {/* Scrolling Features Ticker */}
                <div 
                    className="w-full relative py-2 overflow-hidden mx-auto max-w-[800px]"
                    style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
                >
                    <div className="flex w-max animate-marquee space-x-3 px-2">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex space-x-3 items-center">
                                {[
                                    { icon: LayoutTemplate, text: 'Logo Design' },
                                    { icon: BriefcaseBusiness, text: 'Brand Kit' },
                                    { icon: Globe2, text: 'Website' },
                                    { icon: ShoppingCart, text: 'E-commerce Store' },
                                    { icon: AppWindow, text: 'Apps & Tools' },
                                    { icon: ImageIcon, text: 'Post Generator' },
                                    { icon: FileImage, text: 'Brochure' },
                                    { icon: Receipt, text: 'Quotation Generator' },
                                    { icon: Share2, text: 'Social Media Kit' },
                                    { icon: Presentation, text: 'Pitch Deck' },
                                ].map((Feature, j) => (
                                    <div key={j} className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-purple-100 shadow-sm shadow-purple-900/5 px-3.5 py-1.5 rounded-full hover:scale-105 hover:bg-white transition-all duration-300">
                                        <div className="w-5 h-5 rounded-full bg-linear-to-br from-purple-100 to-fuchsia-100 flex items-center justify-center border border-purple-200/50 shadow-inner">
                                            <Feature.icon className="w-3 h-3 text-purple-700" strokeWidth={2.5} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-700 whitespace-nowrap uppercase tracking-wider">{Feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ),
        tabStyles: 'text-violet-600 bg-violet-50 border-violet-200 shadow-[0_4px_12px_rgba(124,58,237,0.15)] ring-2 ring-violet-500/20',
        items: [
            { title: 'Logo Design', icon: LayoutTemplate, link: '/services/logo-brand-kit', color: 'text-violet-600', bg: 'bg-violet-50' },
            { title: 'Website Builder', icon: Globe2, link: '/services/website-design', color: 'text-blue-600', bg: 'bg-blue-50' },
            { title: 'Brand Kit', icon: BriefcaseBusiness, link: '/services/logo-brand-kit', color: 'text-pink-600', bg: 'bg-pink-50' },
            { title: 'SEO Review', icon: Search, link: '/onboarding', isFree: true, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ]
    },
    scale: {
        label: 'Run & Scale',
        buttonIcon: TrendingUp,
        hookTitle: 'Manage taxes, compliance, and growth on autopilot',
        hookDesc: 'Never miss a deadline. Our AI and expert CAs handle your GST, accounting, and funding requirements.',
        tabStyles: 'text-emerald-600 bg-emerald-50 border-emerald-200 shadow-[0_4px_12px_rgba(16,185,129,0.15)] ring-2 ring-emerald-500/20',
        items: [
            { title: 'GST Filing', icon: FileText, link: '/services/gst-filing', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: 'Business Loan', icon: Banknote, link: '/services/business-loan', isFree: true, color: 'text-teal-600', bg: 'bg-teal-50' },
            { title: 'Annual Compliance', icon: Shield, link: '/onboarding', color: 'text-blue-600', bg: 'bg-blue-50' },
            { title: 'AI Workspace', icon: Bot, link: '/onboarding', isFree: true, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ]
    },
    global: {
        label: 'Global Access',
        buttonIcon: Globe2,
        hookTitle: 'Expand your Indian startup to the world',
        hookDesc: 'Incorporate in the US, UK, or Dubai. Start exporting with simplified compliance and market access.',
        tabStyles: 'text-amber-600 bg-amber-50 border-amber-200 shadow-[0_4px_12px_rgba(245,158,11,0.15)] ring-2 ring-amber-500/20',
        items: [
            { title: 'US Incorporation', icon: Building2, link: '/onboarding?flow=global', color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { title: 'Dubai Freezone', icon: Globe2, link: '/onboarding?flow=global', color: 'text-amber-600', bg: 'bg-amber-50' },
            { title: 'IEC Code', icon: BriefcaseBusiness, link: '/services/iec-code', color: 'text-blue-600', bg: 'bg-blue-50' },
            { title: 'Export Advisory', icon: Users, link: '/onboarding?flow=global', isFree: true, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ]
    }
};

export default function HomepageServices() {
    const [active, setActive] = useState<CategoryKey>('setup');
    const currentConfig = CAT_CONFIG[active];

    return (
        <section id="services" className="py-20 px-4 bg-white relative">
            <div className="absolute inset-0 bg-slate-50/50 -z-10" />
            <div className="max-w-5xl mx-auto">
                
                {/* Modern App-Drawer Navigation */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {CATEGORIES.map(cat => {
                        const config = CAT_CONFIG[cat];
                        const isActive = active === cat;
                        const BtnIcon = config.buttonIcon;
                        return (
                            <button
                                key={cat}
                                onClick={() => setActive(cat)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 border ${
                                    isActive 
                                    ? config.tabStyles 
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800 hover:shadow-sm hover:-translate-y-0.5'
                                }`}
                            >
                                <BtnIcon className={`w-4 h-4 ${isActive ? 'animate-bounce' : ''}`} />
                                {config.label}
                            </button>
                        );
                    })}
                </div>

                {/* Hook Area */}
                <div className="bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] border border-slate-200 rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 mb-8 text-center transition-all duration-500">
                    <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        {currentConfig.hookTitle}
                    </h3>
                    <div className="text-slate-600 text-sm md:text-base max-w-3xl mx-auto font-medium leading-relaxed">
                        {currentConfig.hookDesc}
                    </div>
                </div>

                {/* App Drawer Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
                    {currentConfig.items.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={idx}
                                href={item.link}
                                className="group bg-white border border-slate-200 rounded-2xl p-4 md:p-5 flex flex-col items-center justify-center text-center hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 relative overflow-hidden"
                            >
                                {/* Free Badge */}
                                {item.isFree && (
                                    <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm z-10">
                                        Free
                                    </div>
                                )}
                                
                                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center ${item.color} mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                
                                <span className="font-bold text-slate-800 text-xs md:text-sm group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom Call to Action */}
                <div className="mt-10 text-center">
                    <Link
                        href="/onboarding"
                        className="inline-flex items-center gap-2 text-[#0052FF] font-bold text-sm hover:text-blue-800 transition-colors group"
                    >
                        View all tools and services 
                        <span className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                    </Link>
                </div>

            </div>
        </section>
    );
}
