'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
    Sparkles, Users2, Workflow, ArrowLeft, ChevronRight, CheckCircle2
} from 'lucide-react';

const WORKSPACE_SLIDES = [
    {
        id: 'neural',
        title: 'Neural Hub',
        subtitle: 'Phase 1: Intelligence',
        desc: 'Chat with your entire business. Our AI analyzes your documents, legal filings, and data to give you instant answers.',
        features: ['Doc-to-Insights Engine', 'AI Business Strategist', '24/7 Virtual Assistant'],
        icon: Sparkles,
        color: 'violet'
    },
    {
        id: 'sync',
        title: 'Team Sync',
        subtitle: 'Phase 2: Collaboration',
        desc: 'The bridge between your team and our experts. A unified workspace for CAs, developers, and founders.',
        features: ['Multi-expert Chat Hub', 'Shared Task Boards', 'Secure File Repository'],
        icon: Users2,
        color: 'cyan'
    },
    {
        id: 'flow',
        title: 'Autonomous Flow',
        subtitle: 'Phase 3: Automation',
        desc: 'Let AI handle your daily grind. From scheduling meetings to generating compliance reports automatically.',
        features: ['AI Workflow Designer', 'Auto-report Generation', 'Intelligent Reminders'],
        icon: Workflow,
        color: 'amber'
    }
];

export default function WorkspacePage() {
    const [activeSlide, setActiveSlide] = useState(0);
    const slide = WORKSPACE_SLIDES[activeSlide];
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
                        <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Users2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-sky-800/80 block">Collaboration OS</span>
                            <h1 className="text-2xl font-black tracking-tight text-slate-950">Workspace</h1>
                        </div>
                    </div>

                    <nav className="space-y-3.5">
                        {WORKSPACE_SLIDES.map((item, idx) => {
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
                                            <Icon className={`w-5 h-5 text-emerald-600`} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-900">{item.title}</h3>
                                            <span className="text-[10px] font-semibold text-slate-400">{item.subtitle}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isActive ? 'translate-x-0.5 text-emerald-600' : ''}`} />
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
                        <div className={`inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest`}>
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
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>
                        <div className="pt-6">
                            <Link href="/onboarding" className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-colors inline-block">
                                Explore Workspace Module
                            </Link>
                        </div>
                    </div>
                    <div className="lg:col-span-2 flex justify-center">
                        <div className={`w-60 h-60 rounded-[2.5rem] bg-emerald-50/50 border border-emerald-100 flex items-center justify-center shadow-inner relative overflow-hidden group`}>
                            <SlideIcon className="w-28 h-28 text-emerald-500 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
