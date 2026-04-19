import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Clock, ArrowRight, MessageCircle, ChevronLeft, Zap } from 'lucide-react';
import { getServiceBySlug, SERVICES, CATEGORY_META } from '@/lib/services-data';
import ServiceLeadForm from '@/components/ServiceLeadForm';

export async function generateStaticParams() {
    return SERVICES.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const service = getServiceBySlug(slug);
    if (!service) return {};
    return {
        title: `${service.title} | SetMyBizz — ${service.shortDesc}`,
        description: service.fullDesc,
        keywords: service.seoKeywords.join(', '),
        openGraph: {
            title: `${service.title} | SetMyBizz`,
            description: service.shortDesc,
            type: 'website',
        },
    };
}

const TIER_COLORS: Record<string, { bg: string; border: string; badge: string }> = {
    Free: { bg: 'bg-slate-50', border: 'border-slate-200', badge: 'bg-slate-100 text-slate-600' },
    Premium: { bg: 'bg-blue-50', border: 'border-blue-300', badge: 'bg-blue-600 text-white' },
    Ultra: { bg: 'bg-purple-50', border: 'border-purple-300', badge: 'bg-purple-600 text-white' },
};

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const service = getServiceBySlug(slug);
    if (!service) notFound();

    const categoryMeta = CATEGORY_META[service.category];
    const related = SERVICES.filter(s => s.category === service.category && s.slug !== slug).slice(0, 3);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Navbar */}
            <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <span className="text-white font-black text-base">S</span>
                            </div>
                            <span className="font-black text-lg text-slate-900">SetMyBizz</span>
                        </Link>
                        <span className="hidden md:flex items-center gap-1 text-slate-400 text-sm">
                            <ChevronLeft className="w-3 h-3" />
                            <Link href="/#services" className="hover:text-blue-600 transition-colors">Services</Link>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href="https://wa.me/917893332884" className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                            <MessageCircle className="w-4 h-4" /> Expert Help
                        </a>
                        <Link href="/onboarding" className="inline-flex items-center gap-1 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                            Start Free <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="pt-28 pb-16 px-4" style={{ background: 'linear-gradient(160deg,#f0f9ff 0%,#faf5ff 100%)' }}>
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase mb-6 border border-blue-200">
                        {categoryMeta.emoji} {categoryMeta.label}
                    </div>
                    <div className="text-6xl mb-4">{service.icon}</div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">{service.title}</h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-6">{service.fullDesc}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold border border-emerald-200">
                        <Clock className="w-4 h-4" /> {service.timelineNote}
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left: Pricing + Lead Form */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* AI Capability Banner */}
                        <div className="flex items-start gap-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
                            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-blue-700 mb-1">🤖 How AI Helps You</div>
                                <p className="text-slate-700 text-sm leading-relaxed">{service.aiCapability}</p>
                            </div>
                        </div>

                        {/* Pricing Tiers */}
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Choose Your Plan</h2>
                            <p className="text-slate-500 mb-6 text-sm">Pay as you go. No subscriptions unless stated. Start free, upgrade anytime.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {service.tiers.map(tier => {
                                    const colors = TIER_COLORS[tier.name] || TIER_COLORS['Free'];
                                    return (
                                        <div key={tier.name} className={`relative rounded-2xl border-2 p-6 flex flex-col ${colors.bg} ${colors.border} ${tier.highlight ? 'shadow-lg ring-2 ring-blue-400/30' : ''}`}>
                                            {tier.highlight && (
                                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full bg-blue-600 text-white shadow">Most Popular</span>
                                            )}
                                            <div className={`text-xs font-bold px-3 py-1 rounded-full w-fit mb-3 ${colors.badge}`}>{tier.name}</div>
                                            <div className="text-3xl font-black text-slate-900 mb-0.5">{tier.price}</div>
                                            {tier.priceNote && <div className="text-xs text-slate-500 mb-4">{tier.priceNote}</div>}
                                            <div className="flex flex-col gap-2.5 flex-1 mb-6 mt-3">
                                                {tier.features.map(f => (
                                                    <div key={f} className="flex items-start gap-2 text-sm text-slate-700">
                                                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                        {f}
                                                    </div>
                                                ))}
                                            </div>
                                            <Link
                                                href={`/onboarding?service=${service.slug}&tier=${tier.name.toLowerCase()}`}
                                                className={`block text-center py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 ${tier.highlight ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' : 'bg-white text-slate-800 border border-slate-200 hover:border-blue-300 hover:text-blue-700'}`}
                                            >
                                                {tier.cta}
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* What's Included */}
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 mb-5">What&apos;s Included</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {service.includes.map(item => (
                                    <div key={item} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5">
                                        <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                        <span className="text-sm text-slate-700 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Lead Capture Form */}
                        <ServiceLeadForm serviceName={service.title} serviceSlug={service.slug} />

                        {/* FAQ */}
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 mb-5">FAQs</h2>
                            <div className="flex flex-col gap-4">
                                {service.faq.map((f, i) => (
                                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                                        <h3 className="font-bold text-slate-900 mb-2">{f.q}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">{f.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* WhatsApp CTA */}
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                            <div className="text-3xl mb-3">💬</div>
                            <h3 className="font-bold text-slate-900 mb-2">Talk to an Expert</h3>
                            <p className="text-slate-600 text-sm mb-4">Get free guidance on {service.title}. Our CA team answers in minutes.</p>
                            <a href="https://wa.me/917893332884" className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors">
                                <MessageCircle className="w-4 h-4" /> WhatsApp Now
                            </a>
                        </div>

                        {/* Timeline */}
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                            <h3 className="font-bold text-slate-900 mb-1">⏱️ Timeline</h3>
                            <p className="text-blue-700 font-black text-lg">{service.timelineNote}</p>
                            <p className="text-slate-500 text-xs mt-1">From document submission to completion</p>
                        </div>

                        {/* Related Services */}
                        {related.length > 0 && (
                            <div>
                                <h3 className="font-bold text-slate-900 mb-3">Related Services</h3>
                                <div className="flex flex-col gap-2">
                                    {related.map(s => (
                                        <Link key={s.slug} href={`/services/${s.slug}`} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all hover:bg-white group">
                                            <span className="text-2xl">{s.icon}</span>
                                            <div>
                                                <div className="text-sm font-bold text-slate-800 group-hover:text-blue-700">{s.title}</div>
                                                <div className="text-xs text-slate-500">{s.shortDesc.slice(0, 40)}...</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
