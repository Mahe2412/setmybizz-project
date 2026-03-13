'use client';
import React, { useState } from 'react';
import { T } from '@/components/os/shared';

const PILLARS = [
  {
    emoji: '🏢',
    title: 'Incorporate Abroad',
    tagline: 'Start a Company in USA or UK',
    simple: 'Just like you started your company in India — but for the whole world.',
    why: 'US and UK companies are trusted by global clients, investors, and banks. Many big Indian startups (Freshworks, Zomato) have US entities.',
    steps: [
      { n: '1', text: 'Choose your country (USA, UK, Singapore)' },
      { n: '2', text: 'Fill a simple form — SetMyBizz handles the rest' },
      { n: '3', text: 'Company ready in 5-7 days. We open the bank account too.' },
    ],
    countries: ['🇺🇸 USA (Delaware)', '🇬🇧 UK (London)', '🇸🇬 Singapore'],
    cta: 'Start My US Company →',
    ctaColor: '#1a56db',
    badge: 'Most Popular',
    price: 'Starting ₹29,999',
    bg: 'from-blue-50 to-indigo-50',
    border: 'border-blue-200',
  },
  {
    emoji: '🛒',
    title: 'Market Access',
    tagline: 'Sell to International Customers',
    simple: 'Your product + global buyers = more money. And it is easier than you think.',
    why: 'India has 1.4 billion people. The world has 8 billion. Your customers are everywhere — you just need to reach them.',
    steps: [
      { n: '1', text: 'List on Amazon Global, Etsy, or your own international website' },
      { n: '2', text: 'Accept payments in USD, GBP — we set it all up for you' },
      { n: '3', text: 'Sell to US, UK, Middle East customers from India' },
    ],
    countries: ['🇺🇸 USA', '🇬🇧 UK', '🇦🇪 UAE', '🇦🇺 Australia'],
    cta: 'Start Selling Globally →',
    ctaColor: T.green,
    badge: 'No Company Needed',
    price: 'Starting ₹9,999',
    bg: 'from-green-50 to-emerald-50',
    border: 'border-green-200',
  },
  {
    emoji: '📦',
    title: 'Export from India',
    tagline: 'Send Your Products Abroad',
    simple: 'IEC Code (a small certificate) + simple paperwork = you can legally earn in USD from India.',
    why: 'India exports ₹33 Lakh Crore every year. Your product can be part of this. Even small businesses export successfully.',
    steps: [
      { n: '1', text: 'Get IEC Code — SetMyBizz does it for you in 3 days (₹1,999)' },
      { n: '2', text: 'Find international buyers — we help you connect' },
      { n: '3', text: 'Ship and collect USD payment in your Indian bank account' },
    ],
    countries: ['📦 Any country you want'],
    cta: 'Start Exporting →',
    ctaColor: T.amber,
    badge: 'Earn in Dollars',
    price: 'IEC Code only ₹1,999',
    bg: 'from-orange-50 to-amber-50',
    border: 'border-orange-200',
  },
];

export default function GlobalTab() {
  const [activeRequest, setActiveRequest] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Hero Banner */}
      <div
        className="rounded-3xl p-7 text-center text-white overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg,#0d47a1,#1565c0,#1976d2)' }}
      >
        <div className="text-6xl mb-4">🌍</div>
        <h1 className="text-2xl font-black mb-2">Take Your Business Global</h1>
        <p className="text-blue-100 text-sm max-w-sm mx-auto leading-relaxed">
          Selling only in India? You are missing <strong className="text-white">95% of the world's customers.</strong>
        </p>
        <p className="text-blue-200 text-sm max-w-sm mx-auto mt-2 leading-relaxed">
          SetMyBizz does not just set up your business — we will <strong className="text-white">operate and assist you globally.</strong> Step by step. In your language.
        </p>
      </div>

      {/* What is Global Business? */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
        <h2 className="text-lg font-black text-slate-900 mb-3">🤔 What is Global Business?</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          Global business simply means <strong className="text-slate-900">selling your product or service to customers in other countries</strong>. 
          It could be IT services, handicrafts, food products, apps, fashion — anything!
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🌏', title: '8 Billion Customers', sub: 'The whole world can buy from you' },
            { icon: '💵', title: 'Earn in Dollars', sub: '₹1 USD = ₹83. Big difference!' },
            { icon: '🏆', title: 'Build a World Brand', sub: 'Global credibility + investor interest' },
          ].map(r => (
            <div key={r.title} className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-center">
              <p className="text-2xl mb-1">{r.icon}</p>
              <p className="text-xs font-black text-slate-800">{r.title}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{r.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Ways to Go Global */}
      <div>
        <h2 className="text-lg font-black text-slate-900 mb-3 px-1">3 Ways to Go Global</h2>
        <div className="space-y-4">
          {PILLARS.map((p, i) => (
            <div key={i} className={`bg-gradient-to-br ${p.bg} border ${p.border} rounded-3xl overflow-hidden shadow-sm`}>
              {/* Card Header */}
              <div className="p-5 pb-3 flex items-start gap-4">
                <span className="text-4xl">{p.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">{p.title}</h3>
                      <p className="text-sm font-bold text-slate-600 mt-0.5">{p.tagline}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">{p.badge}</span>
                      <span className="text-[10px] font-bold text-slate-500">{p.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plain explanation */}
              <div className="px-5 pb-3">
                <div className="bg-white/70 rounded-2xl p-3">
                  <p className="text-sm text-slate-700 leading-relaxed">💡 <strong>In simple words:</strong> {p.simple}</p>
                </div>
              </div>

              {/* Why */}
              <div className="px-5 pb-3">
                <p className="text-xs text-slate-500 leading-relaxed">{p.why}</p>
              </div>

              {/* Simple Steps */}
              <div className="px-5 pb-3">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">How easy is it?</p>
                <div className="space-y-1.5">
                  {p.steps.map(s => (
                    <div key={s.n} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-700 flex-shrink-0">{s.n}</span>
                      <p className="text-sm text-slate-700">{s.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Markets */}
              <div className="px-5 pb-4 flex flex-wrap gap-2">
                {p.countries.map(c => (
                  <span key={c} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600">{c}</span>
                ))}
              </div>

              {/* CTA */}
              <div className="px-5 pb-5">
                {activeRequest === i ? (
                  <div className="py-3 rounded-2xl text-center text-sm font-black bg-white text-green-700 border-2 border-green-300">
                    ✅ We received your request! Expert will call you within 24 hours.
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveRequest(i)}
                    className="w-full py-3.5 rounded-2xl text-sm font-black text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ background: p.ctaColor }}
                  >
                    {p.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arkle + Expert Support */}
      <div className="grid grid-cols-1 gap-3">
        {/* Arkle */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-5 flex items-center gap-4 text-white">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center font-black text-2xl">A</div>
          <div className="flex-1">
            <p className="font-black text-lg">Ask Arkle — Your AI Co-Founder</p>
            <p className="text-blue-100 text-sm mt-0.5">"Should I start in US or UK?" "What is IEC Code?" "How do I find buyers?" — Ask anything.</p>
          </div>
        </div>

        {/* Expert Support */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 flex items-center gap-4 shadow-sm">
          <span className="text-4xl">👨‍💼</span>
          <div className="flex-1">
            <p className="font-black text-slate-900">Talk to a Global Business Expert</p>
            <p className="text-sm text-slate-500 mt-0.5">Free 30-min call. Our expert will guide you on which path is best for YOUR business.</p>
          </div>
          <button className="flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-black text-white bg-slate-800 hover:bg-slate-900 transition-all">Book Free Call</button>
        </div>
      </div>

      {/* Final CTA */}
      <div className="rounded-3xl p-6 text-center" style={{ background: 'linear-gradient(135deg,#0d47a1,#1a56db)' }}>
        <p className="text-3xl mb-2">🌟</p>
        <h2 className="text-xl font-black text-white mb-2">Start Your Global Brand Today</h2>
        <p className="text-blue-100 text-sm mb-4 max-w-sm mx-auto">
          Going global is no longer only for big companies. We have helped small businesses from Vizag, Hyderabad, and across India take their brand to the world.
        </p>
        <button
          className="px-8 py-3.5 rounded-2xl font-black text-blue-800 bg-white hover:bg-blue-50 transition-all text-sm"
          onClick={() => setActiveRequest(0)}
        >
          🚀 Start My Global Journey →
        </button>
      </div>
    </div>
  );
}
