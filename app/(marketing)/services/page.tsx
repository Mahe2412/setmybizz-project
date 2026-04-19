'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
    ArrowRight, CheckCircle2, ShieldCheck, Zap, Globe, 
    MessageSquare, Download, FileText, BarChart, Users,
    Building2, Search, Rocket, ChevronRight, Star,
    Briefcase, PieChart, Shield
} from 'lucide-react';
import HomepageServices from '@/components/HomepageServices';

const PACKAGES = [
    {
        name: 'Startup Foundation',
        price: '₹9,999',
        priceLabel: 'One-time setup',
        desc: 'Everything needed to legally start your dream business in India.',
        color: 'blue',
        icon: Rocket,
        features: [
            'Pvt Ltd / LLP Registration',
            'GST Registration',
            'MSME / Udyam Certificate',
            'Business Bank Account (Digital)',
            'AI Logo & Brand Kit',
            'Startup Legal Documents'
        ],
        highlight: false
    },
    {
        name: 'Growth Engine',
        price: '₹24,999',
        priceLabel: 'Package deal',
        desc: 'Scale your operations with automated compliance and branding.',
        color: 'indigo',
        icon: Zap,
        features: [
            'Everything in Foundation',
            'Trademark Registration (1 Class)',
            '5-Page Professional Website',
            'Monthly GST & Tax Filing (1 Year)',
            'AI Workspace Access',
            'Priority Expert Support'
        ],
        highlight: true
    },
    {
        name: 'Global Enterprise',
        price: 'Custom',
        priceLabel: 'Based on requirements',
        desc: 'Go beyond borders and establish a global presence.',
        color: 'emerald',
        icon: Globe,
        features: [
            'US / UK / UAE Incorporation',
            'IEC (Import/Export Code)',
            'FDI & FEMA Compliance',
            'India Market Access Service',
            'Global Tax Planning',
            'Dedicated Account Manager'
        ],
        highlight: false
    }
];

const BROCHURES = [
    { title: 'India Business Setup Guide 2024', type: 'PDF • 4.2 MB', icon: FileText, color: 'text-blue-600' },
    { title: 'Startup Funding & Compliance Roadmap', type: 'PDF • 2.8 MB', icon: BarChart, color: 'text-purple-600' },
    { title: 'Trademark & Brand Protection Catalog', type: 'PDF • 1.5 MB', icon: Shield, color: 'text-emerald-600' },
];

export default function ServicesLandingPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100">
            {/* ── STICKY NAV ── */}
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Rocket className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter">SetMyBizz</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
                        <a href="#packages" className="hover:text-blue-600 transition-colors">Packages</a>
                        <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
                        <a href="#brochures" className="hover:text-blue-600 transition-colors">Brochures</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <a href="https://wa.me/917893332884" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                            <MessageSquare className="w-4 h-4" /> Chat with Expert
                        </a>
                        <Link href="/onboarding" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all">
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            <main>
                {/* ── HERO ── */}
                <section className="pt-32 pb-20 px-6 relative overflow-hidden bg-slate-50">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#0052FF 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                    <div className="max-w-7xl mx-auto text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest mb-8">
                            Premium Business Services
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-none">
                            Setup, Build &amp; Scale Your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Business on Autopilot.</span>
                        </h1>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed mb-10">
                            Forget the traditional legal hassles. We combine AI-powered speed with CA-backed expertise to provide the fastest business setup in India.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/onboarding" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-blue-500/40 hover:-translate-y-1 transition-all flex items-center gap-3">
                                Start Your Setup Now <ArrowRight className="w-5 h-5" />
                            </Link>
                            <a href="https://wa.me/917893332884" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all flex items-center gap-3">
                                Download Catalog <Download className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </section>

                {/* ── PACKAGES ── */}
                <section id="packages" className="py-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Choose Your Package</h2>
                            <p className="text-lg text-slate-500 font-medium">Clear pricing. Zero hidden fees. Professional execution.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {PACKAGES.map((pkg) => (
                                <div key={pkg.name} className={`relative flex flex-col p-8 rounded-3xl border ${pkg.highlight ? 'border-blue-200 bg-blue-50/30 shadow-2xl shadow-blue-500/10' : 'border-slate-100 bg-white'} transition-all hover:-translate-y-2`}>
                                    {pkg.highlight && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Most Popular</div>
                                    )}
                                    <div className={`w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-6 shadow-sm`}>
                                        <pkg.icon className={`w-6 h-6 text-${pkg.color}-600`} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">{pkg.name}</h3>
                                    <p className="text-sm text-slate-500 font-medium mb-6">{pkg.desc}</p>
                                    <div className="mb-8">
                                        <div className="text-4xl font-black text-slate-900">{pkg.price}</div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{pkg.priceLabel}</div>
                                    </div>
                                    <div className="space-y-4 mb-10 flex-1">
                                        {pkg.features.map(feat => (
                                            <div key={feat} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                {feat}
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/onboarding" className={`w-full py-4 rounded-2xl font-black text-center transition-all ${pkg.highlight ? 'bg-blue-600 text-white shadow-xl' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                                        Choose Plan
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── ALL SERVICES (IMPORTED COMPONENT) ── */}
                <section id="services" className="bg-slate-50 py-24">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-slate-900">Our Comprehensive Ecosystem</h2>
                            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">From registration to compliance, branding to global expansion, we handle it all.</p>
                        </div>
                        <HomepageServices />
                    </div>
                </section>

                {/* ── BROCHURES ── */}
                <section id="brochures" className="py-24 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Business Resources &amp; Brochures</h2>
                                <p className="text-xl text-slate-500 font-medium leading-relaxed mb-8">
                                    Want to learn more? Download our professional business setup brochures to share with your team or read offline.
                                </p>
                                <div className="space-y-4">
                                    {BROCHURES.map((b) => (
                                        <div key={b.title} className="group p-6 rounded-2xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-white transition-all flex items-center justify-between cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                                    <b.icon className={`w-6 h-6 ${b.color}`} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{b.title}</div>
                                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{b.type}</div>
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                <Download className="w-4 h-4" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-[4/5] bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                                    <div className="p-10 h-full flex flex-col justify-between relative z-10 text-white">
                                        <div>
                                            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-6">
                                                <Rocket className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-3xl font-black leading-tight mb-4">SetMyBizz Startup Ecosystem</h3>
                                            <p className="text-slate-400 font-medium">Download the full platform guide and service catalog for 2024.</p>
                                        </div>
                                        <div className="flex items-center justify-between p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                                </div>
                                                <div className="text-sm font-bold">Comprehensive Guide</div>
                                            </div>
                                            <Download className="w-5 h-5 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                                {/* Floating stats */}
                                <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 hidden sm:block">
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-black text-slate-900">5k+</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Downloads</div>
                                        </div>
                                        <div className="w-px h-10 bg-slate-100" />
                                        <div className="text-center">
                                            <div className="text-2xl font-black text-slate-900">4.9/5</div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FINAL CTA ── */}
                <section className="py-24 bg-slate-900 text-white text-center px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
                            Start Building Your Business Today.<br />
                            <span className="text-blue-500 italic">No Commitment Required.</span>
                        </h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/onboarding" className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/40">
                                Launch Your Startup
                            </Link>
                            <a href="https://wa.me/917893332884" className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-xl hover:bg-white/20 transition-all">
                                Chat with Expert
                            </a>
                        </div>
                        <p className="mt-8 text-slate-500 text-sm font-bold uppercase tracking-widest italic">
                            Used by 500+ Indian Startups &amp; MSMEs
                        </p>
                    </div>
                </section>
            </main>

            {/* ── FOOTER ── */}
            <footer className="py-12 border-t border-slate-100 bg-white px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
                            <Rocket className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-black tracking-tighter">SetMyBizz</span>
                    </div>
                    <p className="text-sm text-slate-400 font-medium">© 2024 SetMyBizz. All rights reserved. Built for modern founders.</p>
                    <div className="flex gap-6 text-sm font-bold text-slate-600">
                        <a href="#" className="hover:text-blue-600 transition-colors">Twitter</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Instagram</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
