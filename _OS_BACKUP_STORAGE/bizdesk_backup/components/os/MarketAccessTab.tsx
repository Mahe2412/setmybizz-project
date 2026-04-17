'use client';
import React from 'react';

// Price values are kept as empty strings so they are hidden now, but can be easily edited later.
const INC_SERVICES = [
  { id: 1, category: 'INCORPORATION', name: 'Private Limited Company', price: '', icon: '🏢' },
  { id: 2, category: 'INCORPORATION', name: 'Proprietorship / LLP', price: '', icon: '🧑‍💼' },
  { id: 3, category: 'GOVT BENEFITS', name: 'Udyam Registration', price: '', icon: '🏅' },
  { id: 4, category: 'STARTUP GROWTH', name: 'Startup India Registration', price: '', icon: '🚀' },
  { id: 5, category: 'TAX & COMPLIANCE', name: 'GST Registration & Filing', price: '', icon: '📊' },
  { id: 6, category: 'BRAND PROTECTION', name: 'Trademark (TM) & IP', price: '', icon: '™️' },
  { id: 7, category: 'OPERATIONS', name: 'Business Licenses (FSSAI/Trade)', price: '', icon: '📑' },
  { id: 8, category: 'LEGAL', name: 'Legal Documentation', price: '', icon: '⚖️' },
  { id: 9, category: 'ADVISORY', name: 'Expert CA/CS Services', price: '', icon: '👨‍💼' },
  { id: 10, category: 'GROWTH', name: 'Marketing & Digital Presence', price: '', icon: '📈' },
  { id: 11, category: 'FUNDING', name: 'Project Reports & Pitch Decks', price: '', icon: '💼' },
  { id: 12, category: 'FINANCE', name: 'Banking & Loans', price: '', icon: '🏦' },
  { id: 13, category: 'QUALITY', name: 'ISO Certification', price: '', icon: '🎖️' },
  { id: 14, category: 'GLOBAL', name: 'Import Export Code (IEC)', price: '', icon: '📦' },
];

export default function MarketAccessTab() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
         <div>
           <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Marketplace & Incorp</h1>
           <p className="text-slate-500 font-medium mt-1.5 max-w-xl text-sm leading-relaxed">Select from over 14 essential business setup, compliance, and growth services. Everything your startup needs in one place.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
         {INC_SERVICES.map(s => (
           <div key={s.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all relative overflow-hidden group flex items-center justify-between cursor-pointer">
             <div className="flex gap-4 items-center">
                 <div className="w-12 h-12 bg-blue-50/50 border border-blue-100/50 text-slate-700 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                   {s.icon}
                 </div>
                 <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{s.category}</div>
                    <h3 className="font-bold text-slate-900 leading-tight">{s.name}</h3>
                    {/* If price is added later, it will show up here */}
                    {s.price && <div className="text-sm font-bold text-blue-600 mt-1">{s.price}</div>}
                 </div>
             </div>
             
             {/* Plus Icon Action */}
             <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 opacity-60 group-hover:opacity-100 group-hover:bg-[#0052FF] group-hover:text-white transition-all border border-slate-200 group-hover:border-[#0052FF] shrink-0 ml-4">
                 <span className="text-lg font-medium leading-none mb-[2px]">+</span>
             </div>
           </div>
         ))}
      </div>

      <div className="mt-8 bg-blue-50/50 border border-blue-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />
        <div>
           <h2 className="text-lg md:text-xl font-black text-slate-900 mb-2 flex items-center gap-2"><span className="text-2xl">🌍</span> Custom Incorporation & Market Access</h2>
           <p className="text-sm text-slate-600 max-w-lg leading-relaxed font-medium">Looking for US/Dubai incorporation or complex licensing? Talk to our legal experts, we also setup tailored plans.</p>
        </div>
        <button className="px-6 py-3 bg-white text-blue-600 font-black text-sm rounded-xl border border-blue-200 hover:bg-blue-50 hover:border-blue-300 shadow-sm shrink-0 transition-colors">Talk to Expert</button>
      </div>
      <div className="mt-6 bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-dashed opacity-80">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-200 shrink-0">
             🛠️
           </div>
           <div>
              <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg md:text-xl font-black text-slate-800">Market Access App Store</h2>
                  <span className="px-2 py-0.5 bg-yellow-100/80 text-yellow-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-yellow-200/50">Coming Soon</span>
              </div>
              <p className="text-sm text-slate-500 font-medium">Bills, Book-keeping tools, WhatsApp automation, Payroll, and more SaaS integrations are on the way.</p>
           </div>
        </div>
        <button disabled className="px-6 py-3 bg-slate-200 text-slate-400 font-black text-sm rounded-xl shrink-0 cursor-not-allowed">Browse Tools</button>
      </div>
    </div>
  );
}
