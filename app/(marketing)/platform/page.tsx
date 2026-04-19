import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Zap, Globe2, BarChart3, Layers, MessageCircle, Star, Clock, Shield } from 'lucide-react';

export const metadata: Metadata = {
    title: 'SetMyBizz Platform — India\'s #1 Business Operating System | Free Business Setup',
    description: 'Build your entire business in minutes — free. Company registration, GST, logo, brand kit, website, GST filing, loans, and global access. One platform to setup, operate, and grow your business.',
    keywords: ['free business setup india', 'business operating system india', 'setup company free india', 'brand kit free startup india', 'one stop business platform india'],
    openGraph: { title: 'SetMyBizz — Your Business Operating System', description: 'From idea to running business in minutes. Free.' },
};

const STEPS = [
    {
        step: '01',
        emoji: '💡',
        title: 'Start with Your Idea',
        desc: 'Just type your business name. Our AI instantly understands your industry, recommends the right business structure, and maps your entire journey.',
        features: ['Business name check', 'Industry AI analysis', 'Structure recommendation (Pvt Ltd / LLP / OPC)', 'Cost & timeline estimate'],
        color: '#f59e0b',
        bg: '#fffbeb',
        border: '#fde68a',
    },
    {
        step: '02',
        emoji: '🏢',
        title: 'Setup in Minutes',
        desc: 'Company registration, GST, MSME, bank account — all from one dashboard. AI fills the forms. Experts review. Government filings done.',
        features: ['Company Registration (Pvt Ltd / LLP)', 'GST Registration', 'MSME / Udyam Certificate', 'Business Bank Account'],
        color: '#1a56db',
        bg: '#eff6ff',
        border: '#bfdbfe',
    },
    {
        step: '03',
        emoji: '🎨',
        title: 'Build Your Brand',
        desc: 'AI-designed logo, brand kit, business website — ready in 24 hours. No designer needed. No agency fees.',
        features: ['AI Logo Generator', 'Brand Color Palette', 'Business Website (5 pages)', 'Domain + Business Email'],
        color: '#7c3aed',
        bg: '#faf5ff',
        border: '#e9d5ff',
    },
    {
        step: '04',
        emoji: '📈',
        title: 'Operate & Grow',
        desc: 'Monthly GST filing, accounting, trademark protection, business loans — your entire compliance handled automatically.',
        features: ['Monthly GST Filing (GSTR-1 + 3B)', 'Trademark Registration', 'CA Accounting Support', 'Business Loan Advisory'],
        color: '#059669',
        bg: '#ecfdf5',
        border: '#a7f3d0',
    },
    {
        step: '05',
        emoji: '🌍',
        title: 'Go Global',
        desc: 'Export from India, setup foreign companies, bring global clients to India. SetMyBizz handles FDI, IEC, and international compliance.',
        features: ['IEC Code (Import / Export)', 'Global Company Setup', 'India Market Access for Foreigners', 'Export Documentation'],
        color: '#0891b2',
        bg: '#ecfeff',
        border: '#a5f3fc',
    },
];

const CAPABILITIES = [
    { icon: Zap, title: 'AI-Powered', desc: 'Every form, document, and filing is AI-automated — reducing errors and time to zero.' },
    { icon: Shield, title: 'Expert-Backed', desc: 'Every AI action is reviewed by our CA and legal team before submission.' },
    { icon: Clock, title: 'Minutes, Not Weeks', desc: 'What takes 3–4 weeks traditionally, we complete in 24–72 hours.' },
    { icon: Globe2, title: 'India to Global', desc: 'One platform for domestic setup and international expansion.' },
    { icon: Layers, title: 'All-in-One', desc: 'Registration → Branding → Operations → Global — no tool switching.' },
    { icon: BarChart3, title: 'Free to Start', desc: 'Every service has a free tier. Pay only for expert execution.' },
];

const FREE_SERVICES = [
    'Business name availability check',
    'AI business structure recommendation',
    'Company registration cost estimate',
    'GST eligibility & threshold check',
    'Loan eligibility pre-check',
    'AI logo generator (watermarked)',
    'MSME scheme eligibility report',
    'Trademark prior-art search',
    'IEC code requirement check',
    'Project report 1-page summary',
    'Government scheme finder',
    'Free startup legal checklist',
];

const TESTIMONIALS = [
    { name: 'Rahul Sharma', role: 'Founder, TechNova Vizag', text: 'Registered my Pvt Ltd, got GST, and launched my website — all in 4 days. Would have taken 2 months otherwise.', stars: 5 },
    { name: 'Priya Menon', role: 'Fashion Designer, Bangalore', text: 'The free logo generator alone saved me ₹15,000. The brand kit is professional. Highly recommend.', stars: 5 },
    { name: 'Ahmed Al-Rashid', role: 'UAE Investor', text: 'SetMyBizz helped us incorporate in India without a single visit. The foreign entry process was seamless.', stars: 5 },
];

export default function PlatformPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            {/* Navbar */}
            <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-black text-base">S</span>
                        </div>
                        <div>
                            <div className="font-black text-base text-slate-900 leading-none">SetMyBizz</div>
                            <div className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">Business Operating System</div>
                        </div>
                    </Link>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                        <a href="#how" className="hover:text-blue-600 transition-colors">How it Works</a>
                        <a href="#free" className="hover:text-blue-600 transition-colors">Free Services</a>
                        <Link href="/#services" className="hover:text-blue-600 transition-colors">All Services</Link>
                        <Link href="/start-in-india" className="text-blue-600 font-semibold hover:text-blue-700">🌍 Start in India</Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href="https://wa.me/917893332884" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                            <MessageCircle className="w-4 h-4" /> Expert
                        </a>
                        <Link href="/onboarding" className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow">
                            Start Free <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── HERO ── */}
            <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden" style={{ background: 'linear-gradient(160deg,#f0f9ff 0%,#ede9fe 50%,#fef3c7 100%)' }}>
                {/* BG blobs */}
                <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-300/20 rounded-full blur-[80px] pointer-events-none" />

                <div className="max-w-4xl mx-auto relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        India&apos;s #1 AI Business Operating System
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-6">
                        Setup &amp; Build Your Business<br />
                        <span style={{ background: 'linear-gradient(135deg,#1a56db,#7c3aed,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            in Minutes — Free
                        </span>
                    </h1>

                    <p className="text-slate-600 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
                        From idea to a fully running business — company registration, brand kit, logo, website, GST, bank account &amp; more. <strong>One platform. One place. Your Business OS.</strong>
                    </p>

                    {/* Hero CTA */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                        <Link
                            href="/onboarding"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-white rounded-2xl text-lg shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
                            style={{ background: 'linear-gradient(135deg,#1a56db,#7c3aed)', boxShadow: '0 12px 40px rgba(26,86,219,0.35)' }}
                        >
                            Build My Business Free 🚀
                        </Link>
                        <a
                            href="#how"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-slate-700 bg-white rounded-2xl text-base border border-slate-200 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm"
                        >
                            See How it Works ↓
                        </a>
                    </div>

                    {/* Social proof strip */}
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5"><span className="text-yellow-400">★★★★★</span> <span className="font-semibold text-slate-700">4.9</span> Google Rating</div>
                        <div className="w-px h-4 bg-slate-300 hidden sm:block" />
                        <div><span className="font-black text-slate-800">500+</span> Businesses Setup</div>
                        <div className="w-px h-4 bg-slate-300 hidden sm:block" />
                        <div><span className="font-black text-slate-800">₹0</span> to start</div>
                        <div className="w-px h-4 bg-slate-300 hidden sm:block" />
                        <div><span className="font-black text-slate-800">24 hrs</span> avg setup time</div>
                    </div>
                </div>
            </section>

            {/* ── CAPABILITIES ── */}
            <section className="py-16 px-4 bg-slate-900 text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-black mb-2">Why SetMyBizz is Different</h2>
                        <p className="text-slate-400 text-base">Not a tool. Not an agency. A complete Business Operating System.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {CAPABILITIES.map(cap => {
                            const Icon = cap.icon;
                            return (
                                <div key={cap.title} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
                                        <Icon className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div className="font-bold text-white mb-1">{cap.title}</div>
                                    <div className="text-slate-400 text-sm leading-relaxed">{cap.desc}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS: 5 STEPS ── */}
            <section id="how" className="py-20 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">Idea → Business in Minutes</span>
                        <h2 className="text-3xl md:text-4xl font-black mt-4 mb-3 tracking-tight">Your Complete Business Journey</h2>
                        <p className="text-slate-500 text-lg max-w-xl mx-auto">Every step from concept to global business — all on one platform.</p>
                    </div>

                    <div className="flex flex-col gap-6">
                        {STEPS.map((step, i) => (
                            <div
                                key={step.step}
                                className="rounded-3xl p-7 md:p-9 border-2 flex flex-col md:flex-row gap-7 items-start hover:shadow-lg transition-all"
                                style={{ background: step.bg, borderColor: step.border }}
                            >
                                {/* Step number */}
                                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md"
                                        style={{ background: `${step.color}20`, border: `2px solid ${step.color}40` }}
                                    >
                                        {step.emoji}
                                    </div>
                                    <span className="text-xs font-black tracking-wider" style={{ color: step.color }}>STEP {step.step}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-slate-900 mb-2">{step.title}</h3>
                                    <p className="text-slate-600 leading-relaxed mb-5 text-sm">{step.desc}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {step.features.map(f => (
                                            <div key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                                                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: step.color }} />
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA */}
                                <Link
                                    href="/onboarding"
                                    className="flex-shrink-0 self-center flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm hover:-translate-y-0.5 transition-all shadow-md"
                                    style={{ background: step.color }}
                                >
                                    Start <ArrowRight className="w-4 h-4" />
                                </Link>

                                {/* Connector arrow */}
                                {i < STEPS.length - 1 && (
                                    <div className="absolute left-1/2 -translate-x-1/2 translate-y-full hidden" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FREE SERVICES ── */}
            <section id="free" className="py-16 px-4" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)' }}>
                <div className="max-w-5xl mx-auto text-center text-white">
                    <div className="text-3xl mb-3">🆓</div>
                    <h2 className="text-2xl md:text-3xl font-black mb-2">Free Services for Every Startup &amp; MSME</h2>
                    <p className="text-slate-400 text-base mb-8 max-w-lg mx-auto">
                        Start completely free. Build your business foundation at ₹0. Upgrade only when you need expert execution.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 mb-8 text-left">
                        {FREE_SERVICES.map(s => (
                            <div key={s} className="flex items-center gap-2.5 bg-white/8 border border-white/10 rounded-xl px-4 py-3">
                                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span className="text-sm text-slate-200 font-medium">{s}</span>
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/onboarding"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:-translate-y-0.5 transition-all shadow-xl text-base"
                    >
                        Explore All Free Services <ArrowRight className="w-5 h-5" />
                    </Link>
                    <p className="text-slate-500 text-xs mt-3">No credit card. No signup fees. Start in seconds.</p>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="py-16 px-4 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Trusted by Founders &amp; Global Entrepreneurs</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {TESTIMONIALS.map(t => (
                            <div key={t.name} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all">
                                <div className="flex mb-3">
                                    {Array.from({ length: t.stars }).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                                    <div className="text-slate-400 text-xs">{t.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FINAL CTA ── */}
            <section className="py-20 px-4 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1a56db 0%,#7c3aed 100%)' }}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%,white 1px,transparent 1px),radial-gradient(circle at 75% 50%,white 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="max-w-2xl mx-auto relative z-10">
                    <div className="text-4xl mb-4">🚀</div>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                        Your Business is 1 Click Away
                    </h2>
                    <p className="text-blue-100 text-lg leading-relaxed mb-8">
                        Gantalalo mee business build cheskondi. Free ga start cheyyandi.<br />
                        <span className="text-white font-bold">SetMyBizz — Your Business Operating System.</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/onboarding"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-black rounded-2xl hover:-translate-y-1 transition-all shadow-xl text-lg"
                        >
                            Start Building Free 🚀
                        </Link>
                        <a
                            href="https://wa.me/917893332884"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                        >
                            <MessageCircle className="w-5 h-5" /> Talk to an Expert
                        </a>
                    </div>
                    <p className="text-blue-200 text-sm mt-6">No credit card · No commitment · ₹0 to start</p>
                </div>
            </section>
        </div>
    );
}
