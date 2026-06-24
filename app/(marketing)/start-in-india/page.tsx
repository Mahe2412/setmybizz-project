import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Globe2, Building2, Package, MessageCircle, ChevronRight, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Start Your Business in India | SetMyBizz – Foreign & NRI Company Setup',
    description: 'Incorporate a company in India, access the Indian market, or start exporting to India. SetMyBizz handles FDI compliance, RBI approvals, GST, and all India-entry requirements for foreign entrepreneurs and NRIs.',
    keywords: ['incorporate in india for foreigners', 'start business in india nri', 'india market access foreign company', 'fdi india company registration', 'setmybizz global'],
    alternates: { canonical: 'https://setmybizz.com/start-in-india' },
};

const PATHS = [
    {
        id: 'incorporate',
        icon: Building2,
        emoji: '🏢',
        tag: 'Most Popular',
        tagColor: 'bg-blue-100 text-blue-700',
        title: 'Incorporate in India',
        subtitle: 'Full company setup with FDI compliance',
        desc: 'Set up a Wholly Owned Subsidiary, JV, Branch Office, or LLP in India. We handle every step — from RBI/FEMA approvals to your company PAN and bank account.',
        features: [
            'Pvt Ltd / LLP / WOS / Branch Office',
            'FDI filing & FEMA compliance',
            'RBI approvals handled',
            'Director DIN, DSC & MCA filings',
            'NRE/NRO business bank account',
            'GST registration included',
        ],
        timeline: '15–21 working days',
        ideal: 'Foreign companies, NRIs, overseas investors',
        cta: 'Incorporate Now',
        ctaHref: '/onboarding?audience=incorporate-india',
        gradient: 'from-blue-600 to-blue-800',
        borderColor: 'border-blue-200',
        bgColor: 'bg-blue-50',
    },
    {
        id: 'market-access',
        icon: Globe2,
        emoji: '📈',
        tag: 'No Company Needed',
        tagColor: 'bg-emerald-100 text-emerald-700',
        title: 'India Market Access',
        subtitle: 'Sell in India without full incorporation',
        desc: 'Test and sell in the Indian market through distributors, agents, or e-commerce platforms without setting up a full company. Fastest route to revenue.',
        features: [
            'Distributor / Agent agreements',
            'GST registration for foreign entities',
            'B2B marketplace onboarding',
            'Razorpay / payment gateway setup',
            'Import license (if needed)',
            'Legal entity representation',
        ],
        timeline: '5–10 working days',
        ideal: 'SaaS companies, product brands, B2B sellers',
        cta: 'Access Indian Market',
        ctaHref: '/onboarding?audience=india-market',
        gradient: 'from-emerald-600 to-emerald-800',
        borderColor: 'border-emerald-200',
        bgColor: 'bg-emerald-50',
    },
    {
        id: 'export',
        icon: Package,
        emoji: '📦',
        tag: 'Exporters',
        tagColor: 'bg-purple-100 text-purple-700',
        title: 'Export TO India',
        subtitle: 'Ship your products to Indian buyers',
        desc: 'Sell your products to Indian importers, retailers, or consumers. Get HS code guidance, customs duty advisory, and connect with verified Indian importers.',
        features: [
            'HS code classification & duty advisory',
            'Verified Indian importer introductions',
            'Shipping & logistics guidance',
            'B2B buyer connections in India',
            'Customs documentation support',
            'Trade credit & payment terms',
        ],
        timeline: '3–7 working days',
        ideal: 'Manufacturers, wholesalers, product exporters',
        cta: 'Start Exporting',
        ctaHref: '/onboarding?audience=export-india',
        gradient: 'from-purple-600 to-purple-800',
        borderColor: 'border-purple-200',
        bgColor: 'bg-purple-50',
    },
];

const TRUST = [
    { label: '500+', sub: 'Companies Set Up' },
    { label: '40+', sub: 'Countries Served' },
    { label: '₹2 Cr+', sub: 'FDI Facilitated' },
    { label: '15 Days', sub: 'Avg Incorporation Time' },
];

const FAQS = [
    { q: 'Can a 100% foreign-owned company operate in India?', a: 'Yes, in most sectors. Under automatic FDI route, up to 100% ownership is allowed without government approval. Some sectors like defence, media, insurance have caps. We check your sector before you start.' },
    { q: 'Do I need to visit India to incorporate?', a: 'No. The entire process can be done remotely. We collect notarized/apostilled documents digitally and handle all MCA, RBI, and bank account filings on your behalf.' },
    { q: 'What is the minimum capital required?', a: 'There is no minimum paid-up capital for a Pvt Ltd. However, FDI inflows must comply with FEMA regulations and be reported to RBI within 30 days.' },
    { q: 'How long does it take to open a business bank account?', a: 'After company incorporation (10–15 days), a business current account can be opened in 5–7 additional working days. We work with HDFC, ICICI, and Axis Bank.' },
];

export default function StartInIndiaPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Minimal Navbar */}
            <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-black text-base">S</span>
                        </div>
                        <span className="font-black text-lg text-slate-900">SetMyBizz</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <a href="https://wa.me/918501999457" className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                            <MessageCircle className="w-4 h-4" /> Talk to Expert
                        </a>
                        <Link href="/onboarding" className="inline-flex items-center gap-1 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow">
                            Get Started <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="pt-32 pb-20 px-4 text-center" style={{ background: 'linear-gradient(160deg,#f0f9ff 0%,#e8f4ff 50%,#f5f0ff 100%)' }}>
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase mb-6 border border-blue-200">
                        🌍 For Foreign Entrepreneurs & NRIs
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight mb-6">
                        Start Your Business<br />
                        <span style={{ background: 'linear-gradient(135deg,#1a56db,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            in India
                        </span>
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10">
                        India is the world&apos;s fastest-growing major economy. 1.4 billion consumers, youngest median age, and a business-friendly government. SetMyBizz handles all the complexity — FDI, FEMA, RBI, GST — so you can focus on growth.
                    </p>

                    {/* Trust row */}
                    <div className="flex flex-wrap items-center justify-center gap-8 mb-4">
                        {TRUST.map(t => (
                            <div key={t.label}>
                                <div className="text-2xl font-black text-blue-700">{t.label}</div>
                                <div className="text-xs text-slate-500 font-medium mt-0.5">{t.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3 Paths */}
            <section className="py-20 px-4 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                            Choose Your India Entry Path
                        </h2>
                        <p className="text-slate-500 text-lg max-w-xl mx-auto">
                            Three focused paths. No overwhelming service lists. Pick what fits your goal.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                        {PATHS.map(path => {
                            const Icon = path.icon;
                            return (
                                <div key={path.id} className={`bg-white border-2 ${path.borderColor} rounded-3xl p-8 flex flex-col hover:shadow-xl transition-all hover:-translate-y-1 relative`}>
                                    {/* Tag */}
                                    <span className={`absolute top-6 right-6 text-xs font-bold px-3 py-1 rounded-full ${path.tagColor}`}>
                                        {path.tag}
                                    </span>

                                    {/* Icon */}
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg bg-gradient-to-br ${path.gradient}`}>
                                        <Icon className="w-7 h-7" />
                                    </div>

                                    <h3 className="text-xl font-black text-slate-900 mb-1">{path.title}</h3>
                                    <p className="text-sm font-semibold text-slate-500 mb-4">{path.subtitle}</p>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-6">{path.desc}</p>

                                    {/* Features */}
                                    <div className="flex flex-col gap-2.5 mb-7 flex-1">
                                        {path.features.map(f => (
                                            <div key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                                                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                {f}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Meta */}
                                    <div className={`${path.bgColor} rounded-xl p-4 mb-6`}>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Timeline</div>
                                        <div className="text-sm font-bold text-slate-800">{path.timeline}</div>
                                        <div className="text-xs text-slate-500 mt-2 font-medium">Ideal for: {path.ideal}</div>
                                    </div>

                                    <Link
                                        href={path.ctaHref}
                                        className={`flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-sm hover:-translate-y-0.5 transition-all bg-gradient-to-r ${path.gradient} shadow-lg`}
                                    >
                                        {path.cta} <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center mt-10">
                        <p className="text-slate-500 text-sm mb-3">Not sure which path is right for you?</p>
                        <a href="https://wa.me/918501999457" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                            <MessageCircle className="w-4 h-4" /> Talk to Our India Entry Expert (Free Consultation)
                        </a>
                    </div>
                </div>
            </section>

            {/* Why India + Why SetMyBizz */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-3">Why India Now?</div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            World&apos;s Fastest Growing<br />Major Economy
                        </h2>
                        {[
                            { icon: '🚀', stat: '#1', label: 'Fastest growing G20 economy (7%+ GDP)' },
                            { icon: '👥', stat: '1.4B', label: 'Consumers, 500M middle class' },
                            { icon: '💻', stat: '800M+', label: 'Internet users, 3rd largest startup ecosystem' },
                            { icon: '🏭', stat: '100%', label: 'FDI allowed in most sectors (automatic route)' },
                            { icon: '🌏', stat: '50+', label: 'Countries with India Double Tax Treaties (DTAA)' },
                        ].map(item => (
                            <div key={item.label} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
                                <span className="text-2xl w-8">{item.icon}</span>
                                <span className="text-blue-700 font-black text-lg w-16">{item.stat}</span>
                                <span className="text-slate-600 text-sm">{item.label}</span>
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="text-xs font-bold tracking-widest text-purple-600 uppercase mb-3">Why SetMyBizz?</div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            We Speak Both<br />Your Languages
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Indian government processes are complex — multiple portals, local requirements, and compliance layers. SetMyBizz is the only platform that combines AI automation with a team of chartered accountants who specialize in foreign entry.
                        </p>
                        {[
                            'Remote process — no India visit needed',
                            'Dedicated India Entry manager assigned',
                            'All government filings handled end-to-end',
                            'English + regional language support',
                            'Transparent pricing, no hidden fees',
                            '24/7 WhatsApp support',
                        ].map(item => (
                            <div key={item} className="flex items-center gap-3 mb-3 text-sm text-slate-700">
                                <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 px-4 bg-slate-50">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black text-slate-900 mb-2">Frequently Asked Questions</h2>
                        <p className="text-slate-500">Common questions about setting up a business in India</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        {FAQS.map((f, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-7">
                                <h3 className="font-bold text-slate-900 mb-3 text-base">{f.q}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{f.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 px-4 text-center" style={{ background: 'linear-gradient(135deg,#1a56db 0%,#7c3aed 100%)' }}>
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                        Ready to Enter India?
                    </h2>
                    <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                        Join 500+ global companies who chose SetMyBizz to enter India. Free consultation. No obligation.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/onboarding?audience=incorporate-india" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold rounded-xl hover:-translate-y-0.5 transition-all shadow-lg">
                            Start Now — It&apos;s Free <ArrowRight className="w-4 h-4" />
                        </Link>
                        <a href="https://wa.me/918501999457" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
                            <MessageCircle className="w-4 h-4" /> WhatsApp Expert
                        </a>
                    </div>
                    <p className="text-blue-200 text-sm mt-6">📍 Based in Visakhapatnam, India · +91 7893332884</p>
                </div>
            </section>
        </div>
    );
}
