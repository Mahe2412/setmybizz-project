'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
    Monitor, Target, TrendingUp, ArrowLeft, ChevronRight, CheckCircle2, Sparkles
} from 'lucide-react';

const LAUNCH_SLIDES = [
    {
        id: 'pitch',
        title: 'AI Pitch Deck Maker',
        subtitle: 'Phase 0: Foundation',
        desc: 'Generate a stunning, investor-ready pitch presentation in minutes. Speak or type your business idea and export it directly to PDF.',
        features: ['Voice-to-Slide Structuring', 'Neon, Notion, Ocean Themes', 'Interactive Web & PDF Exports'],
        icon: Sparkles,
        color: 'purple',
        link: '/launchpad/pitch-maker'
    },
    {
        id: 'web',
        title: 'Web & Identity',
        subtitle: 'Phase 1: Presence',
        desc: 'Build websites, brand kits and live sales pages by speaking to Arkle. No coding, no designers, just fast launches.',
        features: ['Voice-built Websites', 'Brand Kit Generation', 'AI-Optimized Launch Copy'],
        icon: Monitor,
        color: 'blue',
        link: '/onboarding'
    },
    {
        id: 'leads',
        title: 'The Lead Machine',
        subtitle: 'Phase 2: Traffic',
        desc: 'Arkle scans your business dashboards and recommends the exact campaigns, funnels and automations you need.',
        features: ['Smart Funnel Recommendations', 'WhatsApp & Email Sequences', 'High-conversion Lead Paths'],
        icon: Target,
        color: 'rose',
        link: '/onboarding'
    },
    {
        id: 'scale',
        title: 'Global Scalability',
        subtitle: 'Phase 3: Reach',
        desc: 'Deploy growth tools and AI agents for international expansion without writing a single line of code.',
        features: ['International E-commerce Setup', 'Global Market Playbooks', 'Agent-based Growth Automation'],
        icon: TrendingUp,
        color: 'indigo',
        link: '/onboarding'
    }
];

export default function LaunchpadPage() {
    const [activeSlide, setActiveSlide] = useState(0);
    const slide = LAUNCH_SLIDES[activeSlide];
    const SlideIcon = slide.icon;

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
            {/* Left Column (30% width) - Sky Blue Gradient */}
            <aside className="w-[30%] h-full bg-gradient-to-b from-sky-50 to-sky-100/70 border-r border-sky-200/85 p-8 lg:p-10 flex flex-col justify-between shrink-0 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-200/20 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                    <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        Back to Home
                    </Link>

                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-11 h-11 rounded-2xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-sky-800/80 block">Growth OS</span>
                            <h1 className="text-2xl font-black tracking-tight text-slate-950">Launchpad</h1>
                        </div>
                    </div>

                    <nav className="space-y-3.5">
                        {LAUNCH_SLIDES.map((item, idx) => {
                            const Icon = item.icon;
                            const isActive = activeSlide === idx;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSlide(idx)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all duration-300 ${
                                        isActive 
                                        ? 'bg-white shadow-xl shadow-sky-900/5 border border-sky-200/50 scale-[1.02]' 
                                        : 'hover:bg-sky-200/40 border border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-sky-50' : 'bg-slate-100/50'}`}>
                                            <Icon className={`w-5 h-5 text-rose-600`} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-900">{item.title}</h3>
                                            <span className="text-[10px] font-semibold text-slate-400">{item.subtitle}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isActive ? 'translate-x-0.5 text-rose-600' : ''}`} />
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="relative z-10 pt-6 border-t border-sky-200/60 flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-sky-850">
                        System Connected: Active
                    </p>
                </div>
            </aside>

            {/* Right Column (70% width) - White Background */}
            <main className="w-[70%] h-full bg-white p-12 lg:p-16 flex items-center justify-center relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-blue-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />
                
                <div className="w-full max-w-[85%] mx-auto relative z-10 grid lg:grid-cols-5 gap-12 items-center">
                    <div className="lg:col-span-3 space-y-6 text-left">
                        <div className={`inline-flex px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest`}>
                            {slide.subtitle}
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            {slide.title}
                        </h2>
                        <p className="text-base text-slate-500 font-semibold leading-relaxed">
                            {slide.desc}
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4 pt-2">
                            {slide.features.map((f) => (
                                <div key={f} className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>
                        <div className="pt-6">
                            <Link href={slide.link || "/onboarding"} className="px-8 py-4 bg-rose-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-700 transition-colors inline-block">
                                Explore Launchpad Module
                            </Link>
                        </div>
                    </div>
                    <div className="lg:col-span-2 flex justify-center">
                        <div className={`w-60 h-60 rounded-[2.5rem] bg-rose-50/50 border border-rose-100 flex items-center justify-center shadow-inner relative overflow-hidden group`}>
                            <SlideIcon className="w-28 h-28 text-rose-500 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
