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
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="rounded-3xl p-6 text-center" style={{ background: 'linear-gradient(135deg,#0d47a1,#0284c7)' }}>
        <div className="text-5xl mb-3">💰</div>
        <h1 className="text-2xl font-black text-white mb-1">Your Business Banking</h1>
        <p className="text-blue-100 text-sm max-w-sm mx-auto">
          Open accounts, get loans, talk to experts — everything your business needs to manage money, in one place.
        </p>
      </div>

      {/* 3 Big Service Cards */}
      {BANK_FEATURES.map((f, i) => (
        <div key={i} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Card Header */}
          <div className="p-5 pb-3 flex items-start gap-4">
            <div className="text-4xl">{f.emoji}</div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <h2 className="text-lg font-black text-slate-900">{f.title}</h2>
                  <p className="text-sm text-slate-500 mt-0.5">{f.sub}</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700 whitespace-nowrap">{f.tag}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-5 pb-3">
            <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
          </div>

          {/* Simple Steps */}
          <div className="px-5 pb-4">
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">How it works</p>
            <div className="space-y-1.5">
              {f.steps.map((step, si) => (
                <div key={si} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-black flex-shrink-0">{si + 1}</span>
                  <p className="text-sm text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Partners */}
          {f.partners.length > 0 && (
            <div className="px-5 pb-3">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Our Partners</p>
              <div className="flex flex-wrap gap-2">
                {f.partners.map(p => (
                  <span key={p} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{p}</span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="px-5 pb-5">
            {booked === i ? (
              <div className="py-3 rounded-2xl text-center text-sm font-black bg-green-50 text-green-700 border border-green-200">
                ✅ Request received! We will contact you within 2 hours.
              </div>
            ) : (
              <button
                onClick={() => setBooked(i)}
                className="w-full py-3.5 rounded-2xl text-sm font-black text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: f.ctaColor }}
              >
                {f.cta}
              </button>
            )}
          </div>
        </div>
      ))}

      {/* UPI / Digital Payments */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-4xl">📲</span>
          <div className="flex-1">
            <h3 className="font-black text-slate-900">Accept Payments via UPI</h3>
            <p className="text-sm text-slate-500 mt-0.5">Let customers pay you via UPI, cards, or bank transfer. Works for any business — shop, service, or product.</p>
          </div>
        </div>
        <button className="mt-4 w-full py-3 rounded-2xl text-sm font-bold border-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-all">
          Setup UPI for My Business →
        </button>
      </div>

      {/* Arkle Help */}
      <div className="rounded-3xl p-5 bg-blue-50 border border-blue-200 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl flex-shrink-0">A</div>
        <div className="flex-1">
          <p className="font-black text-slate-900 mb-1">Ask Arkle — Your AI Co-Founder</p>
          <p className="text-sm text-slate-600">Not sure what bank to pick? Which loan is right? Ask Arkle and get an answer in seconds.</p>
          <button className="mt-2 text-sm font-bold text-blue-700 hover:underline">Ask Arkle now →</button>
        </div>
      </div>
    </div>
  );
}
