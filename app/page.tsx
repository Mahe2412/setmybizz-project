'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import {
    ArrowRight, Menu, X, Search, Building2, Globe2, BarChart3,
    Zap, Shield, CheckCircle, Star, Bot, TrendingUp, LineChart,
    Settings, Users, ListTodo, CreditCard, LayoutDashboard,
    Rocket, Palette, Megaphone, Layers, MessageCircle,
    Twitter, Linkedin, Instagram, Facebook, Mail, HelpCircle,
    ChevronRight,
} from 'lucide-react';
import HomepageServices from '@/components/HomepageServices';

/* ── Waitlist form ── */
function WaitlistForm() {
    const [email, setEmail] = useState('');
    const [done, setDone] = useState(false);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) setDone(true);
    };
    if (done) return <p className="text-emerald-400 font-semibold text-sm">✓ You&apos;re on the waitlist!</p>;
    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm">
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 outline-none focus:border-blue-400 text-sm" />
            <button type="submit" className="px-5 py-2.5 bg-[#0052FF] hover:bg-[#0047DB] text-white font-bold rounded-lg transition-colors text-sm whitespace-nowrap shadow-lg shadow-blue-500/50">
                Join Waitlist →
            </button>
        </form>
    );
}

const FAQ_ITEMS = [
    { q: 'Is SetMyBizz free to use?', a: 'Yes! Every service has a free tier. AI consultations, eligibility checks, and basic reports are completely free. You only pay for expert execution.' },
    { q: 'How long does company registration take?', a: '5–7 working days with our AI-assisted process. We pre-validate all documents, dramatically reducing rejection rates.' },
    { q: 'Do you support businesses outside India?', a: 'Yes! Foreign entrepreneurs can incorporate in India, access the India market, or export to India through our dedicated global entry paths.' },
    { q: 'What is the AI Co-Founder feature?', a: 'An AI agent that acts as your business co-founder — handling sales, compliance, finance, and operations strategy. Coming soon.' },
];

export default function HomePage() {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [bizName, setBizName] = useState('');
    const [activeMode, setActiveMode] = useState<'setup' | 'global' | 'launchpad' | 'workspace'>('setup');

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    const handleStart = (e: React.FormEvent) => {
        e.preventDefault();
        const baseRoute = bizName.trim() ? `?name=${encodeURIComponent(bizName.trim())}` : '';
        const flowSuffix = activeMode === 'setup' ? '' : `${baseRoute ? '&' : '?'}flow=${activeMode}`;
        router.push(`/onboarding${baseRoute}${flowSuffix}`);
    };

    const getModeProps = () => {
        switch (activeMode) {
            case 'global':
                return { placeholder: "Enter your company name", btnText: "Go Global", btnIcon: "🌍" };
            case 'launchpad':
                return { placeholder: "Enter your brand name", btnText: "Launch Brand", btnIcon: "🎨" };
            case 'workspace':
                return { placeholder: "Enter your workspace name", btnText: "Open Workspace", btnIcon: "🤖" };
            case 'setup':
            default:
                return { placeholder: "Enter your business name", btnText: "Start My Business", btnIcon: "🚀" };
        }
    };

    const modeProps = getModeProps();

    return (
        <>
            <Script id="org-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'SetMyBizz', url: 'https://setmybizz.in', description: 'AI-powered Business Operating System for Indian MSMEs and Startups' }) }} />
            <Script id="faq-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ_ITEMS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />

            {/* ══ NAVBAR ══ */}
            <header className={`sticky top-0 z-50 w-full border-b border-slate-100 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur-md'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#0052FF] flex items-center justify-center text-white shadow-sm">
                                <Rocket className="w-4 h-4" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">SetMyBizz</span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex gap-7">
                            {[['Platform', '/platform'], ['Services', '/#services'], ['How it Works', '/#how'], ['Start Globally 🌍', '/onboarding?flow=global']].map(([l, h]) => (
                                <Link key={l} href={h} className="text-sm font-medium text-slate-600 hover:text-[#0052FF] transition-colors">{l}</Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <a href="https://wa.me/917893332884" className="hidden sm:flex text-sm font-semibold text-slate-700 hover:text-[#0052FF] transition-colors items-center gap-1.5">
                                <MessageCircle className="w-4 h-4" /> Expert
                            </a>
                            <Link href="/onboarding" className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#0052FF] hover:bg-[#0047DB] transition-colors shadow-sm">
                                Get Started
                            </Link>
                            <button onClick={() => setMenuOpen(v => !v)} className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors" aria-label="Menu">
                                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-4 pb-6">
                        {[['Platform', '/platform'], ['Services', '/#services'], ['How it Works', '/#how'], ['Start Globally 🌍', '/onboarding?flow=global']].map(([l, h]) => (
                            <Link key={l} href={h} onClick={() => setMenuOpen(false)} className="block py-3 text-slate-700 font-medium hover:text-[#0052FF] border-b border-slate-100 text-sm">{l}</Link>
                        ))}
                        <div className="pt-4 flex flex-col gap-2">
                            <a href="https://wa.me/917893332884" className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                                <MessageCircle className="w-4 h-4" /> Talk to Expert
                            </a>
                            <Link href="/onboarding" onClick={() => setMenuOpen(false)} className="flex items-center justify-center py-2.5 rounded-lg text-sm font-bold text-white bg-[#0052FF]">Get Started →</Link>
                        </div>
                    </div>
                )}
            </header>

            <main className="neural-bg min-h-screen">
                {/* ══ NEURAL IGNITION HERO ══ */}
                <section className="relative pt-24 pb-32 lg:pt-40 lg:pb-48 overflow-hidden">
                    {/* Floating Orbs for Premium Vibe */}
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="max-w-4xl mx-auto text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/20 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural Startup OS v2.0</span>
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter italic mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                                Ignite Your Vision <br />
                                <span className="monday-gradient-border bg-clip-text text-transparent italic" style={{ WebkitTextFillColor: 'transparent', backgroundImage: 'linear-gradient(90deg, #6366f1, #3b82f6, #8b5cf6)' }}>In 60 Seconds.</span>
                            </h1>
                            
                            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                                Input your idea. Our Neural Engine builds your 30-day roadmap, legal entity, and brand identity autonomously.
                            </p>

                            {/* THE IGNITION LAUNCHER (Main Input) */}
                            <div className="max-w-3xl mx-auto relative animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                                <div className="monday-gradient-border monday-vibe-glow p-0.5 rounded-[2.5rem] group hover:scale-[1.01] transition-all">
                                    <form onSubmit={handleStart} className="bg-white/95 backdrop-blur-3xl rounded-[2.4rem] p-4 flex flex-col md:flex-row items-center gap-4">
                                        <div className="flex-1 w-full flex items-center gap-4 px-6 h-16 sm:h-20">
                                            <span className="material-symbols-outlined text-slate-300 text-3xl">psychology</span>
                                            <input
                                                value={bizName}
                                                onChange={e => setBizName(e.target.value)}
                                                className="bg-transparent border-none outline-none w-full text-xl sm:text-2xl font-black text-slate-900 placeholder-slate-200 italic"
                                                placeholder="I want to build a..."
                                                type="text"
                                            />
                                        </div>
                                        <button type="submit" className="w-full md:w-auto bg-slate-900 hover:bg-black text-white px-12 py-6 rounded-[2rem] font-black text-lg transition-all shadow-2xl flex items-center justify-center gap-3 group/btn">
                                            IGNITE VISION
                                            <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform italic">bolt</span>
                                        </button>
                                    </form>
                                </div>
                                
                                {/* Floating Neural Status */}
                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                   <div className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                      AI Co-founder Ready
                                   </div>
                                   <div className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                      Neural Roadmap Engine Sync
                                   </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Start Categories */}
                        <div className="flex flex-wrap justify-center gap-4 pt-12 animate-in fade-in duration-1000 delay-500">
                            {[
                                { id: 'setup', label: 'Setup', icon: 'account_balance', color: 'bg-indigo-50 text-indigo-600' },
                                { id: 'global', label: 'Global', icon: 'public', color: 'bg-emerald-50 text-emerald-600' },
                                { id: 'launchpad', label: 'LaunchPad', icon: 'auto_awesome', color: 'bg-purple-50 text-purple-600' },
                                { id: 'workspace', label: 'Workspace', icon: 'token', color: 'bg-blue-50 text-blue-600' }
                            ].map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => setActiveMode(mode.id as any)}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] transition-all border ${activeMode === mode.id ? 'bg-white border-slate-200 shadow-xl scale-105 select-none' : 'bg-transparent border-transparent text-slate-400 hover:text-slate-900 hover:bg-white/50'}`}
                                >
                                    <span className={`material-symbols-outlined text-xl ${activeMode === mode.id ? mode.color.split(' ')[1] : ''}`}>{mode.icon}</span>
                                    {mode.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
                {/* ══ SERVICES ══ */}
                <HomepageServices />

                {/* ══ SECTION 2: AI BUSINESS SETUP ══ */}
                <section id="products" className="py-24 bg-slate-50 border-y border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                            <div className="max-w-3xl">
                                <div className="text-sm font-bold text-[#0052FF] mb-3 uppercase tracking-[0.2em]">India&apos;s First AI Business OS & Setup Platform</div>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">Lay Your Legal Foundation in Days, Not Months.</h1>
                                <p className="mt-4 text-lg text-slate-600 font-medium">As pioneers in the industry, we bring you India&apos;s first fully automated AI Business Operating System. Stop running to multiple places for CA, Lawyers, and Designers. Register your company, get GST, and manage compliances completely online from one unified platform.</p>
                            </div>
                            <Link href="/onboarding" className="flex-shrink-0 bg-white text-[#0052FF] border-2 border-[#0052FF] hover:bg-[#0052FF] hover:text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/10 flex items-center gap-2 text-base">
                                Setup Business <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { Icon: Building2, title: 'Company Registration', desc: 'Private Limited, LLP, or Proprietorship registered with zero manual paperwork.', bg: 'bg-blue-50', color: 'text-[#0052FF]' },
                                { Icon: Search, title: 'Trademark Search', desc: 'Secure your brand name instantly with AI-driven IP searches and easy applications.', bg: 'bg-indigo-50', color: 'text-indigo-600' },
                                { Icon: Shield, title: 'GST & Compliance', desc: 'Automated monthly filings, tax preparation, and regulatory checks on autopilot.', bg: 'bg-emerald-50', color: 'text-emerald-600' },
                                { Icon: Bot, title: 'Expert CA Backing', desc: '24/7 expert advice combined with AI to optimize your tax and legal structure.', bg: 'bg-purple-50', color: 'text-purple-600' },
                            ].map(({ Icon, title, desc, bg, color }) => (
                                <div key={title} className="group bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1 hover:border-blue-300">
                                    <div className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center ${color} mb-6 group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-3">{title}</h4>
                                    <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══ SECTION 2.5: GO GLOBAL ══ */}
                <section className="py-24 bg-slate-900 border-b border-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 100% 0%, #0052FF 0%, transparent 60%)' }} />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2">
                            <span className="text-blue-400 font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Global Access</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Think Local. Act Global. Setup Anywhere.</h2>
                            <p className="text-slate-300 text-lg mb-8 leading-relaxed font-medium">
                                Take your Indian startup to the world. Incorporate your company in the US, UK, UAE, or Singapore right from your dashboard. Export faster with our simple market access setup.
                            </p>
                            <Link href="/onboarding?flow=global" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-xl shadow-white/10">
                                Start Global Setup <Globe2 className="w-5 h-5" />
                            </Link>
                        </div>
                        <div className="md:w-1/2 w-full flex justify-center">
                            {/* Visual representation of global nodes */}
                            <div className="relative w-full max-w-sm aspect-square bg-[#0c1328] rounded-full border border-slate-800 shadow-2xl flex items-center justify-center p-8">
                                <Globe2 className="w-full h-full text-blue-900/40 animate-pulse" />
                                <div className="absolute top-10 right-10 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.2)]">
                                    <div className="flex items-center gap-2 text-white font-bold text-sm"><span className="text-base">🇺🇸</span> US LLC</div>
                                </div>
                                <div className="absolute bottom-20 left-4 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                    <div className="flex items-center gap-2 text-white font-bold text-sm"><span className="text-base">🇦🇪</span> UAE Freezone</div>
                                </div>
                                <div className="absolute bottom-10 right-20 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.2)]">
                                    <div className="flex items-center gap-2 text-white font-bold text-sm"><span className="text-base">🇸🇬</span> SG Pvt. Ltd</div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0052FF] p-4 rounded-full shadow-[0_0_50px_rgba(0,82,255,0.8)] border-4 border-slate-900">
                                    <span className="text-2xl">🇮🇳</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══ SECTION 3: LAUNCHPAD ══ */}
                <section className="py-24 bg-white relative">
                    <div className="absolute inset-0 bg-slate-50/50 -z-10" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mb-14 text-center max-w-3xl mx-auto">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/80 text-purple-700 text-xs font-bold uppercase tracking-[0.2em] mb-5 border border-purple-200">World&apos;s First AI Startup LaunchPad</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 leading-tight">Build Your Entire Startup in Minutes.</h2>
                            <p className="text-slate-600 text-lg font-medium">Be the first in the industry to leverage fully automated startup building. No expensive agencies. No heavy packages. Answer a few questions, and our neural engine builds your logo, brand presence, website, store, and social media instantly.</p>
                        </div>

                        <div className="rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden p-6 md:p-10 flex flex-col lg:flex-row gap-10 items-center">
                            <div className="lg:w-2/5 flex flex-col gap-8">
                                {[
                                    { Icon: Palette, label: 'Visual Identity', sub: 'AI tailors your perfect logo, color palette, and premium typography.' },
                                    { Icon: Globe2, label: 'Website & SEO', sub: 'A fully functional, conversion-optimized website written and built for you.' },
                                    { Icon: Megaphone, label: 'Marketing Kit', sub: 'Ready-to-post social media templates and ad graphics.' },
                                ].map(({ Icon, label, sub }) => (
                                    <div key={label} className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 text-purple-600 border border-purple-100">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg text-slate-900 mb-1">{label}</div>
                                            <div className="text-sm font-medium text-slate-500 leading-relaxed">{sub}</div>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-4 p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white border border-slate-700 shadow-inner">
                                    <div className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">Early Access Waitlist</div>
                                    <div className="text-sm mb-4 font-medium text-slate-300">LaunchPad is currently in private beta. Skip the queue to build your digital presence instantly.</div>
                                    <WaitlistForm />
                                </div>
                            </div>
                            
                            {/* LaunchPad Magic UI Preview */}
                            <div className="lg:w-3/5 w-full bg-slate-50 rounded-2xl border border-slate-200 p-8 shadow-inner relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
                                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0052FF 1px,transparent 1px)', backgroundSize: '16px 16px' }} />
                                
                                <div className="relative w-full max-w-sm">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 blur-[40px] opacity-20 animate-pulse" />
                                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 relative z-10 flex flex-col items-center">
                                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-purple-50">
                                            <Rocket className="w-8 h-8 text-[#0052FF] opacity-80" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">Generating Your Brand Universe...</h3>
                                        
                                        <div className="w-full space-y-4">
                                            {['Designing Primary Logo', 'Writing Website Copy', 'Setting up e-Commerce Checkout'].map((text, i) => (
                                                <div key={i} className="flex flex-col gap-2">
                                                    <div className="flex justify-between text-xs font-bold text-slate-500">
                                                        <span>{text}</span>
                                                        <span className="text-[#0052FF]">Doing magic ✨</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.4}s`, width: i === 0 ? '100%' : i === 1 ? '60%' : '30%' }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══ SECTION 4: AI CO-FOUNDER (THE MASTERPIECE) ══ */}
                <section className="py-28 bg-slate-900 border-b-8 border-[#0052FF] text-white relative overflow-hidden">
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <div className="absolute -top-[50%] -left-[10%] w-[1000px] h-[1000px] bg-[#0052FF]/10 rounded-full blur-[120px]" />
                        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px]" />
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="lg:w-1/2">
                                <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-blue-300 font-bold tracking-widest uppercase text-xs mb-5 shadow-lg">World&apos;s First AI Co-Founder for MSMEs</span>
                                <h2 className="text-5xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight">Operate Your Business With Zero Employees.</h2>
                                <p className="text-slate-300 text-xl mb-10 leading-relaxed font-medium">
                                    For the first time in the world, you don&apos;t need to worry about hiring professional teams or finding an expensive co-founder. Meet your personal AI Co-Founder engineered to run your business with you. Generate sales, draft legal emails, manage clients, and run your startup completely solo.
                                </p>
                                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
                                    <div className="text-sm font-bold text-white mb-3">Reserve your AI Agent early:</div>
                                    <WaitlistForm />
                                </div>
                            </div>

                            <div className="lg:w-1/2 w-full flex justify-center">
                                {/* The Chat Mockup */}
                                <div className="w-full max-w-sm bg-gradient-to-b from-[#1a2238] to-[#0d1323] border border-slate-700/50 rounded-[3rem] p-3 shadow-2xl relative">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20" /> {/* Notch */}
                                    <div className="bg-[#0a0f1c] rounded-[2.5rem] h-[550px] w-full overflow-hidden relative flex flex-col border border-slate-800">
                                        {/* Header */}
                                        <div className="bg-[#111827]/80 backdrop-blur-md px-6 pt-10 pb-4 border-b border-white/5 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0052FF] to-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(0,82,255,0.4)] relative">
                                                <Bot className="w-5 h-5 text-white" />
                                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#111827] rounded-full" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm">Maya (AI Co-Founder)</div>
                                                <div className="text-[#0052FF] text-[11px] font-bold tracking-wider">ONLINE</div>
                                            </div>
                                        </div>
                                        {/* Chat Area */}
                                        <div className="flex-1 p-5 flex flex-col gap-5 overflow-hidden">
                                            <div className="flex justify-start">
                                                <div className="bg-white/10 text-white p-3 px-4 rounded-2xl rounded-tl-sm text-sm font-medium border border-white/5 max-w-[85%] shadow-lg">
                                                    Good morning Mahendra! I filed your GST Returns for this month. All compliance is green. ✅
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <div className="bg-[#0052FF] text-white p-3 px-4 rounded-2xl rounded-tr-sm text-sm font-bold shadow-[0_4px_15px_rgba(0,82,255,0.3)] max-w-[85%]">
                                                    Great! What about the leads from our new ad campaign?
                                                </div>
                                            </div>
                                            <div className="flex justify-start">
                                                <div className="bg-white/10 text-white p-3 px-4 rounded-2xl rounded-tl-sm text-sm font-medium border border-white/5 max-w-[85%] shadow-lg">
                                                    Your Sales Agent closed 3 new clients today. I have generated their invoices and sent payment links. Total revenue: ₹1.2L. 💰 What's next for today?
                                                </div>
                                            </div>
                                            {/* Typing indicator */}
                                            <div className="flex justify-start mt-2">
                                                <div className="bg-white/5 p-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Input area */}
                                        <div className="bg-[#111827] p-4 border-t border-white/5">
                                            <div className="bg-white/10 rounded-full h-10 px-4 flex items-center justify-between border border-white/10">
                                                <span className="text-slate-500 text-xs font-semibold tracking-wide">Tell Maya what to do...</span>
                                                <div className="w-6 h-6 bg-[#0052FF] rounded-full flex items-center justify-center">
                                                    <ArrowRight className="w-3 h-3 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══ SECTION 5: WORKSPACE ══ */}
                <section className="py-20 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <div className="inline-flex items-center gap-2 mb-3">
                                <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">AI Workspace</span>
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">Preview</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Operate Your Business From One Workspace</h2>
                            <p className="text-slate-600 text-lg">Replace fragmented tools with a unified dashboard for CRM, Task Management, and Finance.</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                            {/* Browser bar */}
                            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="text-xs text-slate-400 font-medium">app.setmybizz.com/workspace</div>
                                <div className="w-6" />
                            </div>

                            <div className="grid md:grid-cols-12 min-h-[440px]">
                                {/* Sidebar nav */}
                                <div className="hidden md:block col-span-2 border-r border-slate-200 p-4 bg-slate-50/50">
                                    <div className="space-y-1">
                                        {[
                                            { Icon: LayoutDashboard, label: 'Dashboard', active: true },
                                            { Icon: Users, label: 'CRM', active: false },
                                            { Icon: ListTodo, label: 'Tasks', active: false },
                                            { Icon: CreditCard, label: 'Finance', active: false },
                                        ].map(({ Icon, label, active }) => (
                                            <div key={label} className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 cursor-pointer transition-colors ${active ? 'bg-[#0052FF]/10 text-[#0052FF]' : 'text-slate-500 hover:bg-slate-100'}`}>
                                                <Icon className="w-4 h-4" /> {label}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Main area */}
                                <div className="col-span-12 md:col-span-10 p-6">
                                    <div className="grid sm:grid-cols-3 gap-4 mb-5">
                                        {[
                                            { label: 'Total Revenue', value: '₹12.4L', trend: '+15.3% this month', tColor: 'text-green-500', Icon: TrendingUp },
                                            { label: 'Active Leads', value: '142', trend: '5 new today', tColor: 'text-blue-500', Icon: Users },
                                            { label: 'Tasks Pending', value: '8', trend: '2 high priority', tColor: 'text-amber-500', Icon: ListTodo },
                                        ].map(({ label, value, trend, tColor, Icon }) => (
                                            <div key={label} className="p-5 rounded-xl border border-slate-100 shadow-sm bg-white">
                                                <div className="text-sm text-slate-500 mb-1">{label}</div>
                                                <div className="text-2xl font-bold text-slate-900">{value}</div>
                                                <div className={`text-xs mt-2 flex items-center gap-1 ${tColor}`}>
                                                    <Icon className="w-3.5 h-3.5" /> {trend}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Placeholder chart */}
                                    <div className="w-full h-56 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden relative">
                                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-around gap-1 px-6 pb-6 h-full">
                                            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                                                <div key={i} className="flex-1 rounded-t-lg bg-gradient-to-t from-[#0052FF] to-blue-300 opacity-80 transition-all" style={{ height: `${h}%` }} />
                                            ))}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
                                        <span className="text-slate-400 text-sm font-medium relative z-10 -mt-24">Revenue Analytics Dashboard</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══ SECTION 5: COMPARISON TABLE (SetMyBizz Difference) ══ */}
                <section className="py-24 bg-white relative">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm font-bold tracking-widest text-[#0052FF] uppercase mb-4 block">The SetMyBizz Difference</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">Why Modern Founders Choose AI</h2>
                            <p className="mt-4 text-lg text-slate-500 font-medium">Traditional methods are slow and fragmented. See why SetMyBizz is India's leading unified business OS.</p>
                        </div>
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden shadow-blue-500/5">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50 font-bold">
                                        <th className="p-6 text-left w-1/3 text-sm text-slate-400 uppercase tracking-widest hidden sm:table-cell">Features</th>
                                        <th className="p-6 text-center w-1/3 text-lg text-slate-500 w-1/2 sm:w-1/3">Traditional Firms</th>
                                        <th className="p-6 text-center w-1/3 text-xl text-[#0052FF] bg-[#0052FF]/5 w-1/2 sm:w-1/3 shadow-[inset_0_-4px_0_#0052FF]">SetMyBizz AI ✓</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ['Cost Structure', 'Expensive Retainers', 'Pay As You Go + Free Tools'],
                                        ['Business Setup Speed', 'Weeks to Months', 'Automated in Days'],
                                        ['Tech & Tools Integration', 'Scattered (Email / Excel)', 'All-in-One Global Platform'],
                                        ['Global Market Reach', 'Local Reach Only', 'One-Click Global Markets'],
                                        ['Operational Help', 'You figure it out', '24/7 AI Co-Founder'],
                                    ].map(([feature, trad, smb], i) => (
                                        <tr key={feature} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                            <td className="p-6 font-bold text-slate-700 text-sm hidden sm:table-cell">{feature}</td>
                                            <td className="p-6 text-center text-slate-500 text-sm font-medium">
                                                <div className="sm:hidden text-xs text-slate-400 font-bold mb-1 uppercase tracking-widest text-center">{feature}</div>
                                                ✗ {trad}
                                            </td>
                                            <td className="p-6 text-center font-bold text-slate-900 bg-[#0052FF]/5 text-sm sm:text-base border-l border-white shadow-[inset_0_-2px_0_rgba(0,82,255,0.05)]">
                                                ✓ {smb}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* ══ SECTION 6: THE JOURNEY (HOW IT WORKS) ══ */}
                <section id="how" className="py-24 bg-slate-50 border-t border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-20 max-w-2xl mx-auto">
                            <span className="text-sm font-bold tracking-widest text-emerald-600 uppercase mb-4 block">The Ecosystem</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 leading-tight">Start Here. Build Here. Run Here.</h2>
                            <p className="text-lg text-slate-500 font-medium">An entire business journey orchestrated inside a single, intelligent operating system.</p>
                        </div>
                        <div className="relative">
                            {/* Animated Connector line */}
                            <div className="hidden lg:block absolute top-[4rem] left-20 right-20 h-1 bg-slate-200 z-0 rounded-full overflow-hidden">
                                <div className="w-1/3 h-full bg-[#0052FF] animate-[progress_3s_ease-in-out_infinite]" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                                {[
                                    { n: '1', badge: 'Setup', title: 'Get Legal Approvals', desc: 'Register company, get GST, secure trademarks effortlessly.', c: 'blue' },
                                    { n: '2', badge: 'Build', title: 'Launch Brand Identity', desc: 'AI generates your logo, website, and social media presence.', c: 'purple' },
                                    { n: '3', badge: 'Run', title: 'Operate With AI', desc: 'AI Workspace and Co-Founder run your sales & daily ops.', c: 'emerald' },
                                    { n: '4', badge: 'Scale', title: 'Access Global Markets', desc: 'Export and expand internationally with simplified compliance.', c: 'indigo' },
                                ].map(item => (
                                    <div key={item.n} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 text-center hover:-translate-y-2 transition-transform duration-300">
                                        <div className={`w-16 h-16 bg-${item.c}-50 text-${item.c}-600 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 ring-8 ring-white shadow-lg border border-${item.c}-100`}>
                                            0{item.n}
                                        </div>
                                        <div className={`text-xs font-bold tracking-widest text-${item.c}-600 uppercase mb-3`}>{item.badge}</div>
                                        <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══ FAQ ══ */}
                <section className="py-14 px-4 bg-white">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">Frequently Asked Questions</h2>
                        <div className="flex flex-col gap-3">
                            {FAQ_ITEMS.map((f, i) => (
                                <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                                    <div className="font-semibold text-slate-900 mb-1.5 text-sm">{f.q}</div>
                                    <div className="text-slate-500 text-sm leading-relaxed">{f.a}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══ FINAL CTA ══ */}
                <section className="py-24 bg-white border-t border-slate-100">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">
                            Ready to Build Your Startup on the<br />World&apos;s First AI Business OS?
                        </h2>
                        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of founders who are building, running, and scaling faster and smarter with SetMyBizz.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/onboarding" className="w-full sm:w-auto px-8 py-4 bg-[#0052FF] hover:bg-[#0047DB] text-white rounded-xl font-bold text-base shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                Start Now — It&apos;s Free <ArrowRight className="w-5 h-5" />
                            </Link>
                            <a href="https://wa.me/917893332884" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 hover:border-[#0052FF] hover:text-[#0052FF] rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2">
                                <MessageCircle className="w-5 h-5" /> Talk to Expert
                            </a>
                        </div>
                        <p className="mt-6 text-sm text-slate-400">No credit card required for initial setup.</p>
                    </div>
                </section>

                {/* ══ FOOTER ══ */}
                <footer className="bg-slate-50 border-t border-slate-200 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
                            <div className="col-span-2 md:col-span-1">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-7 h-7 rounded-lg bg-[#0052FF] flex items-center justify-center"><Rocket className="w-4 h-4 text-white" /></div>
                                    <span className="font-bold text-slate-900 text-base">SetMyBizz</span>
                                </div>
                                <p className="text-sm text-slate-500 leading-relaxed mb-4">India&apos;s AI Business Operating System for MSMEs and Startups.</p>
                                <div className="flex gap-3">
                                    {[Twitter, Linkedin, Instagram, Facebook].map((Icon, i) => (
                                        <a key={i} href="#" className="w-8 h-8 rounded-lg bg-slate-200/60 hover:bg-slate-300/60 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors">
                                            <Icon className="w-4 h-4" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                            {[
                                { title: 'Platform', links: [['Business Setup', '/onboarding'], ['LaunchPad', '/onboarding'], ['AI Workspace', '/onboarding'], ['Global Access', '/onboarding']] },
                                { title: 'Services', links: [['Company Registration', '/services/company-registration'], ['GST Registration', '/services/gst-registration'], ['Project Report', '/services/project-report'], ['Trademark', '/services/trademark-registration']] },
                                { title: 'Company', links: [['About Us', 'https://setmybizz.in/about-us/'], ['Platform', '/platform'], ['Start in India', '/start-in-india'], ['Contact', 'https://wa.me/917893332884']] },
                            ].map(col => (
                                <div key={col.title}>
                                    <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">{col.title}</div>
                                    <div className="flex flex-col gap-2.5">
                                        {col.links.map(([label, href]) => (
                                            <Link key={label} href={href} className="text-sm text-slate-500 hover:text-[#0052FF] transition-colors">{label}</Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                            <span>© 2025 SetMyBizz. All rights reserved. · Visakhapatnam, Andhra Pradesh</span>
                            <div className="flex items-center gap-4">
                                <a href="#" className="hover:text-[#0052FF] transition-colors flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email</a>
                                <a href="https://wa.me/917893332884" className="hover:text-[#0052FF] transition-colors flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> Chat</a>
                                <a href="#" className="hover:text-[#0052FF] transition-colors flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5" /> Help</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
}