'use client';
import React, { useState } from 'react';
import { T, ActionBtn } from '@/components/os/shared';

const BANK_FEATURES = [
  {
    emoji: '🏦',
    title: 'Open Digital Bank Account',
    sub: 'Current Account — No branch visit needed',
    desc: 'Open a business current account online in just 10 minutes. Works with your GST, invoicing and payments automatically.',
    steps: ['Choose your bank (HDFC / ICICI / RazorpayX)', 'Upload PAN + GST + Company docs', 'Account ready in 1-2 days'],
    cta: 'Open Account Now →',
    ctaColor: T.blue,
    tag: '✅ Free to Open',
    partners: ['🔵 HDFC', '🟠 ICICI', '⚡ RazorpayX', '🟢 Open'],
  },
  {
    emoji: '💳',
    title: 'MSME Business Loan',
    sub: 'Starting from ₹1 Lakh — Low interest',
    desc: 'Need money to grow your business? Get an MSME loan with easy documents and low interest rates. Govt-backed schemes available.',
    steps: ['Fill a simple form (5 min)', 'Upload last 6 months bank statement', 'Get approval in 48 hours'],
    cta: 'Check Loan Eligibility →',
    ctaColor: T.green,
    tag: '💡 Starting ₹1 Lakh',
    partners: ['🏦 SIDBI', '🏛️ MUDRA', '🟦 FlexiLoans', '🔶 Indifi'],
  },
  {
    emoji: '📞',
    title: 'Talk to a Banking Expert',
    sub: 'Free 30-minute call — expert advice',
    desc: 'Confused about which bank to choose? What loan is right for you? Talk to our banking expert FREE — no sales pitch, just honest advice.',
    steps: ['Pick a time that works for you', 'Expert calls you on WhatsApp or phone', 'Get personalised banking advice'],
    cta: 'Book Free Expert Call →',
    ctaColor: T.purple,
    tag: '📞 100% Free',
    partners: [],
  },
];

export default function BankingTab() {
  const [booked, setBooked] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-4 md:space-y-6 pb-20 px-4 md:px-0">
      {/* Header */}
      <div className="rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-center shadow-lg" style={{ background: 'linear-gradient(135deg,#0d47a1,#0284c7)' }}>
        <div className="text-4xl md:text-5xl mb-3">💰</div>
        <h1 className="text-xl md:text-2xl font-black text-white mb-1 uppercase tracking-widest">Business Banking</h1>
        <p className="text-blue-100 text-xs md:text-sm max-w-sm mx-auto font-medium leading-relaxed italic">
          Open accounts, get loans, talk to experts — synchronized capital management in one neural workspace.
        </p>
      </div>

      {/* 3 Big Service Cards */}
      {BANK_FEATURES.map((f, i) => (
        <div key={i} className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
          {/* Card Header */}
          <div className="p-6 md:p-8 pb-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="text-4xl md:text-5xl drop-shadow-md">{f.emoji}</div>
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="w-full">
                  <h2 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tight">{f.title}</h2>
                  <p className="text-[10px] md:text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">{f.sub}</p>
                </div>
                <span className="text-[9px] font-black px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 whitespace-nowrap uppercase tracking-widest shrink-0">{f.tag.split(' ').slice(1).join(' ')}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-6 md:px-8 pb-4">
            <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed italic text-center sm:text-left">{f.desc}</p>
          </div>

          {/* Simple Steps */}
          <div className="px-6 md:px-8 pb-5">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 text-center sm:text-left">Workflow Sequence</p>
            <div className="space-y-2">
              {f.steps.map((step, si) => (
                <div key={si} className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-50 group hover:bg-white hover:border-blue-100 transition-all">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">{si + 1}</span>
                  <p className="text-xs md:text-sm text-slate-700 font-bold">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Partners */}
          {f.partners.length > 0 && (
            <div className="px-6 md:px-8 pb-4">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3 text-center sm:text-left">Integrated Partners</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {f.partners.map(p => (
                  <span key={p} className="text-[9px] font-black px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 border border-slate-100 uppercase tracking-tighter">{p}</span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="px-6 md:px-8 pb-6 md:pb-8">
            {booked === i ? (
              <div className="py-4 rounded-2xl text-center text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-widest animate-in fade-in zoom-in-95">
                ✅ Request Synced! Contact in 2 hours.
              </div>
            ) : (
              <button
                onClick={() => setBooked(i)}
                className="w-full py-4 md:py-5 rounded-2xl text-[10px] md:text-xs font-black text-white transition-all shadow-xl hover:scale-[1.02] active:scale-95 uppercase tracking-[0.2em]"
                style={{ background: f.ctaColor, boxShadow: `0 12px 24px -10px ${f.ctaColor}44` }}
              >
                {f.cta}
              </button>
            )}
          </div>
        </div>
      ))}

      {/* UPI / Digital Payments */}
      <div className="bg-slate-900 rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-[60px] -z-1" />
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 text-center sm:text-left">
          <span className="text-5xl p-4 bg-white/5 rounded-3xl border border-white/10">📲</span>
          <div className="flex-1">
            <h3 className="font-black text-white text-base md:text-lg uppercase tracking-widest">Global UPI Gateway</h3>
            <p className="text-[10px] md:text-sm text-slate-400 font-medium leading-relaxed mt-2 italic">Accept instantaneous payments via UPI, Cards, and Neural Nets. Built for high-velocity ventures.</p>
          </div>
        </div>
        <button className="mt-6 w-full py-5 rounded-2xl text-[10px] font-black bg-white text-slate-900 border border-white shadow-xl hover:bg-slate-100 transition-all uppercase tracking-[0.3em] active:scale-95">
          Activate Payment Loop →
        </button>
      </div>

      {/* Arkle Help */}
      <div className="rounded-[2.5rem] p-6 md:p-10 bg-[#f8fafc] border border-slate-100 flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left transition-all hover:bg-white hover:shadow-2xl">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-[2rem] bg-indigo-600 text-white flex items-center justify-center font-black text-3xl shadow-2xl rotate-3 shrink-0">A</div>
        <div className="flex-1">
          <p className="font-black text-slate-900 text-base md:text-lg uppercase tracking-tight mb-2">Neural Brain — Arkle Advice</p>
          <p className="text-[10px] md:text-sm text-slate-500 font-medium leading-relaxed italic">Synchronize with Arkle to analyze your fiscal trajectory. Professional banking strategy, delivered in milliseconds.</p>
          <button className="mt-4 text-[10px] md:text-xs font-black text-indigo-600 uppercase tracking-widest hover:tracking-[0.2em] transition-all">Engage Neural Brain →</button>
        </div>
      </div>
    </div>
  );
}
