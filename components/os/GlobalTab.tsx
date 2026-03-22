import React, { useState } from 'react';
import { T } from '@/components/os/shared';
import GlobalAssistantPanel from '@/components/os/GlobalAssistantPanel';

const TRANSLATIONS = {
  English: {
    heroTitle: "Take Your Business Global",
    heroSub: "Selling only in India? You are missing",
    heroSubBold: "95% of the world's customers.",
    heroCTA: "🚀 Start My Global Journey",
    heroFooter: "SetMyBizz does not just set up your business — we will",
    heroFooterBold: "operate and assist you globally.",
    heroFooterEnd: "Step by step. In your language.",
    whatsGlobal: "🤔 What is Global Business?",
    waysTitle: "3 Ways to Go Global",
  },
  Telugu: {
    heroTitle: "మీ వ్యాపారాన్ని గ్లోబల్‌గా మార్చండి",
    heroSub: "కేవలం ఇండియాలోనే అమ్ముతున్నారా? మీరు",
    heroSubBold: "95% ప్రపంచ కస్టమర్లను కోల్పోతున్నారు.",
    heroCTA: "🚀 నా గ్లోబల్ ప్రయాణాన్ని స్టార్ట్ చేయండి",
    heroFooter: "SetMyBizz కేవలం వ్యాపారాన్ని సెటప్ చేయడమే కాదు — గ్లోబల్‌గా మేము",
    heroFooterBold: "నిర్వహిస్తాము మరియు సహకరిస్తాము.",
    heroFooterEnd: "అడుగడుగునా. మీ సొంత భాషలో.",
    whatsGlobal: "🤔 గ్లోబల్ బిజినెస్ అంటే ఏమిటి?",
    waysTitle: "గ్లోబల్‌గా వెళ్లడానికి 3 మార్గాలు",
  },
  Hindi: {
    heroTitle: "अपने बिज़नेस को ग्लोबल बनाएं",
    heroSub: "क्या आप सिर्फ इंडिया में बेच रहे हैं? आप",
    heroSubBold: "95% दुनिया के ग्राहकों को खो रहे हैं।",
    heroCTA: "🚀 अपनी ग्लोबल यात्रा शुरू करें",
    heroFooter: "SetMyBizz सिर्फ आपके बिज़नेस को सेट ही नहीं करता — हम वैश्विक स्तर पर",
    heroFooterBold: "आपकी सहायता करते हैं।",
    heroFooterEnd: "कदम दर कदम। आपकी भाषा में।",
    whatsGlobal: "🤔 ग्लोबल बिज़नेस क्या है?",
    waysTitle: "ग्लोबल जाने के 3 तरीके",
  }
};

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
    ctaColor: '#10b981', 
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
    ctaColor: '#f59e0b',
    badge: 'Earn in Dollars',
    price: 'IEC Code only ₹1,999',
    bg: 'from-orange-50 to-amber-50',
    border: 'border-orange-200',
  },
];

export default function GlobalTab() {
  const [activeRequest, setActiveRequest] = useState<number | null>(null);
  const [showGlobalJourney, setShowGlobalJourney] = useState(false);
  const [showGlobalAssistant, setShowGlobalAssistant] = useState(false);
  const [showWorkspaceDashboard, setShowWorkspaceDashboard] = useState(false);
  const [activeLang, setActiveLang] = useState<'English' | 'Telugu' | 'Hindi'>('English');

  // Accordion states
  const [openHowItWorks, setOpenHowItWorks] = useState(false);
  const [openPathway, setOpenPathway] = useState(false); 
  const [openPillar, setOpenPillar] = useState<number | null>(null);

  const text = TRANSLATIONS[activeLang];

  const togglePillar = (id: number) => setOpenPillar(prev => prev === id ? null : id);

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-24 relative">
      
      {/* Top Header Controls / Dropdown Language */}
      <div className="flex justify-end pt-1 mb-2">
        <select 
          value={activeLang}
          onChange={(e) => setActiveLang(e.target.value as any)}
          className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm cursor-pointer"
        >
          <option value="English">🌐 English</option>
          <option value="Telugu">🌐 తెలుగు (Telugu)</option>
          <option value="Hindi">🌐 हिंदी (Hindi)</option>
        </select>
      </div>

      {/* COMPACT Original Hero Banner */}
      <div
        className="rounded-3xl p-5 text-center text-white overflow-hidden relative shadow-sm"
        style={{ background: 'linear-gradient(135deg,#0d47a1,#1565c0,#1976d2)' }}
      >
        <div className="text-4xl mb-2">🌍</div>
        <h1 className="text-xl font-black mb-1">{text.heroTitle}</h1>
        <p className="text-blue-100 text-xs max-w-sm mx-auto leading-relaxed">
          {text.heroSub} <strong className="text-white">{text.heroSubBold}</strong>
        </p>
        
        <button 
          onClick={() => setShowGlobalJourney(true)}
          className="mt-3 px-6 py-2 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 hover:scale-[1.02] active:scale-95 transition-all text-xs border border-blue-200 inline-flex items-center gap-2"
        >
          {text.heroCTA}
        </button>

        <p className="text-blue-200 text-[10px] max-w-sm mx-auto mt-3 leading-relaxed">
          {text.heroFooter} <strong className="text-white">{text.heroFooterBold}</strong> {text.heroFooterEnd}
        </p>
      </div>

      {/* EXACT Original - What is Global Business? */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
        <h2 className="text-lg font-black text-slate-900 mb-3">{text.whatsGlobal}</h2>
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

      {/* NEW: How It Works (Single Accordion) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <button 
          onClick={() => setOpenHowItWorks(!openHowItWorks)} 
          className="w-full text-left p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🗺️</span>
            <div>
               <h2 className="text-lg font-black text-slate-900">How It Works</h2>
               <p className="text-xs text-slate-500 font-bold mt-0.5">Know about Global Access inside SetMyBizz</p>
            </div>
          </div>
          <svg className={`w-6 h-6 text-slate-400 transform transition-transform ${openHowItWorks ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {openHowItWorks && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 pt-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center bg-white p-4 rounded-xl border border-slate-200">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 font-black shadow-inner">1</div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Analyze & Decide</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">Our AI Co-Founder assesses your startup and recommends the exact global path.</p>
              </div>
              <div className="text-center bg-white p-4 rounded-xl border border-slate-200">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 font-black shadow-inner">2</div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Setup & Compliance</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">Expert teams handle all your paperwork, banking operations, and legal requirements globally.</p>
              </div>
              <div className="text-center bg-white p-4 rounded-xl border border-slate-200">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 font-black shadow-inner">3</div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Track & Scale</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">Monitor global milestones, metrics, and ensure ongoing compliance dynamically via your Dashboard.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NEW: Choose Your Pathway (Single Landscape Accordion) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <button 
          onClick={() => setOpenPathway(!openPathway)} 
          className="w-full text-left p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
             <span className="text-2xl">⚖️</span>
             <div>
               <h2 className="text-lg font-black text-slate-900">Choose Your Pathway</h2>
               <p className="text-xs text-slate-500 font-bold mt-0.5">Incorporation <span className="text-slate-300 mx-1">vs</span> Market Access <span className="text-slate-300 mx-1">vs</span> Export</p>
             </div>
          </div>
          <svg className={`w-6 h-6 text-slate-400 transform transition-transform ${openPathway ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {openPathway && (
          <div className="border-t border-slate-100 overflow-x-auto bg-slate-50/50">
             <div className="min-w-[800px] w-full flex divide-x divide-slate-100">
                {/* Incorporation Column */}
                <div className="flex-1 p-5 hover:bg-white transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl">🏢</span>
                     <h3 className="font-black text-slate-900">Abroad Incorporation</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-indigo-600 mb-1">What is it?</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">Opening a proper legal entity (C-Corp/LLC) in USA, UK, or Singapore.</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-indigo-600 mb-1">How it works?</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">We handle paperwork remotely. You get a foreign company, tax ID & bank account.</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-indigo-600 mb-1">Benefits</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">Trust with global clients, easier fundraising & Stripe/PayPal processing.</p>
                    </div>
                  </div>
                </div>

                {/* Market Access Column */}
                <div className="flex-1 p-5 hover:bg-white transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">🛒</span>
                     <h3 className="font-black text-slate-900">Market Access</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-blue-600 mb-1">What is it?</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">Selling existing products visually via global platforms (like Amazon US).</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-blue-600 mb-1">How it works?</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">Use your Indian company but get targeted access to foreign markets.</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-blue-600 mb-1">Benefits</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">Earn USD/GBP with zero foreign compliance hassle. Low upfront costs.</p>
                    </div>
                  </div>
                </div>

                {/* Export Column */}
                <div className="flex-1 p-5 hover:bg-white transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-xl">📦</span>
                     <h3 className="font-black text-slate-900">Direct Export</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-emerald-600 mb-1">What is it?</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">Physically shipping your goods manufactured in India to buyers abroad.</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-emerald-600 mb-1">How it works?</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">Get an IEC (Import Export Code). We help find buyers and do customs.</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-emerald-600 mb-1">Benefits</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">High-volume B2B orders, government export incentives, and high margins.</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* 3 Ways to Go Global (Original Design + Dropdown behavior) */}
      <div>
        <h2 className="text-lg font-black text-slate-900 mb-3 px-1">{text.waysTitle}</h2>
        <div className="space-y-4">
          {PILLARS.map((p, i) => (
            <div key={i} className={`bg-gradient-to-br ${p.bg} border ${p.border} rounded-3xl overflow-hidden shadow-sm transition-all duration-300 ${openPillar === i ? 'ring-2 ring-blue-500/20' : ''}`}>
              
              {/* Card Header acts as Accordion Trigger */}
              <button 
                onClick={() => togglePillar(i)}
                className="w-full text-left p-5 flex items-start sm:items-center gap-4 transition-colors"
              >
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
                <div className="w-8 h-8 rounded-full bg-white/50 border border-slate-200/50 flex flex-shrink-0 items-center justify-center self-center shrink-0">
                  <svg className={`w-5 h-5 text-slate-600 transition-transform duration-300 ${openPillar === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Accordion Body */}
              <div 
                className={`transition-all duration-500 ease-in-out origin-top ${openPillar === i ? 'max-h-[1000px] opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-95 overflow-hidden'}`}
              >
                <div className="px-5 pb-3 pt-2">
                  <div className="bg-white/70 rounded-2xl p-3">
                    <p className="text-sm text-slate-700 leading-relaxed">💡 <strong>In simple words:</strong> {p.simple}</p>
                  </div>
                </div>

                <div className="px-5 pb-3">
                  <p className="text-xs text-slate-500 leading-relaxed">{p.why}</p>
                </div>

                <div className="px-5 pb-3">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">How easy is it?</p>
                  <div className="space-y-1.5">
                    {p.steps.map(s => (
                      <div key={s.n} className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-700 shrink-0">{s.n}</span>
                        <p className="text-sm text-slate-700">{s.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-5 pb-4 flex flex-wrap gap-2">
                  {p.countries.map(c => (
                    <span key={c} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600">{c}</span>
                  ))}
                </div>

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
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sticky Action Widgets */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 p-1.5 bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-full animate-in slide-in-from-bottom-10 fade-in duration-700">
        
        <button 
          onClick={() => setShowGlobalAssistant(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full hover:bg-emerald-50 hover:text-emerald-700 transition-all active:scale-95 group font-bold text-slate-700 text-[13px]"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            🌍
          </div>
          Global Assistant
        </button>

        <div className="w-px h-8 bg-slate-200" />

        <button 
          onClick={() => setShowWorkspaceDashboard(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full hover:bg-blue-50 hover:text-blue-700 transition-all active:scale-95 group font-bold text-slate-700 text-[13px]"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            🚀
          </div>
          Go Global Dashboard
        </button>
      </div>

      {showGlobalAssistant && (
        <GlobalAssistantPanel onClose={() => setShowGlobalAssistant(false)} />
      )}

      {/* The full onboarding flow is still accessible via the top "Start My Global Journey" banner button */}
      {showGlobalJourney && (
        <div className="fixed inset-0 z-50 bg-white p-5 overflow-auto">
          <button onClick={() => setShowGlobalJourney(false)} className="mb-4 text-blue-600 font-bold">← Back</button>
          <h2 className="text-2xl font-black">Global Onboarding Coming Soon</h2>
        </div>
      )}
    </div>
  );
}
