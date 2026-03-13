'use client';
import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface Props {
    serviceName: string;
    serviceSlug: string;
}

export default function ServiceLeadForm({ serviceName, serviceSlug }: Props) {
    const [step, setStep] = useState<'form' | 'done'>('form');
    const [form, setForm] = useState({ name: '', phone: '', bizName: '', stage: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Send lead to CRM webhook
        try {
            await fetch('/api/crm-webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    source: `service-page-${serviceSlug}`,
                    service: serviceName,
                    ...form,
                    timestamp: new Date().toISOString(),
                }),
            });
        } catch {
            // Fail silently — still show success to user
        }
        setLoading(false);
        setStep('done');
    };

    if (step === 'done') {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-xl font-black text-slate-900 mb-2">You&apos;re on the list! 🎉</h3>
                <p className="text-slate-600 text-sm mb-4">Our {serviceName} expert will WhatsApp you within 30 minutes during business hours.</p>
                <a href={`/onboarding?service=${serviceSlug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                    Continue Setup <ArrowRight className="w-4 h-4" />
                </a>
            </div>
        );
    }

    return (
        <div className="bg-white border-2 border-blue-100 rounded-2xl p-7">
            <div className="mb-5">
                <h2 className="text-xl font-black text-slate-900 mb-1">Get Your {serviceName}</h2>
                <p className="text-slate-500 text-sm">Fill in a few details — our AI will start building and our team will contact you within 30 minutes.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">Your Name *</label>
                        <input
                            required
                            type="text"
                            placeholder="Your full name"
                            value={form.name}
                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none text-sm transition-all"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">WhatsApp Number *</label>
                        <input
                            required
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={form.phone}
                            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none text-sm transition-all"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">Business Name</label>
                    <input
                        type="text"
                        placeholder="Your business name (or idea name)"
                        value={form.bizName}
                        onChange={e => setForm(p => ({ ...p, bizName: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none text-sm transition-all"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">Business Stage</label>
                    <select
                        aria-label="Business stage"
                        value={form.stage}
                        onChange={e => setForm(p => ({ ...p, stage: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none text-sm transition-all bg-white"
                    >
                        <option value="">Select your stage</option>
                        <option value="idea">Just an idea</option>
                        <option value="pre-revenue">Pre-revenue startup</option>
                        <option value="early">Early revenue (0–1 Cr)</option>
                        <option value="growth">Growth stage (1Cr+)</option>
                        <option value="established">Established business</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/30"
                >
                    {loading ? 'Submitting...' : <>Get My {serviceName} <ArrowRight className="w-4 h-4" /></>}
                </button>
                <p className="text-xs text-slate-400 text-center">🔒 Your details are private. No spam. Our team will contact you on WhatsApp.</p>
            </form>
        </div>
    );
}
