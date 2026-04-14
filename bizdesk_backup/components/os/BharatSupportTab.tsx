'use client';
import React from 'react';

export default function BharatSupportTab() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8">
         <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bharat Startup Support</h1>
         <p className="text-slate-500 font-medium mt-2 max-w-2xl leading-relaxed">The ultimate gateway to all Government Schemes, Subsidies, and MSME Support available for your startup. Never miss free national benefits.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 bg-gradient-to-r from-orange-50 via-white to-green-50 border-b border-slate-100">
           <span className="px-3 py-1 bg-green-100 text-green-700 font-black text-[10px] rounded-md uppercase tracking-wide border border-green-200">100% Guaranteed</span>
           <h2 className="text-2xl font-black text-slate-900 mt-3 mb-2">Startup India Registration (DPIIT)</h2>
           <p className="text-sm text-slate-600 max-w-lg mb-5">Unlock tax holidays, fast-track patent filings, and direct government tender access through the official DPIIT certification.</p>
           <button className="px-6 py-3 bg-slate-900 text-white font-black text-sm rounded-xl hover:bg-slate-800 shadow-md">Apply Now (Free via OS)</button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
           <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="text-2xl mb-2">🏦</div>
              <p className="font-black text-slate-900 mb-1">MSME Mudra Loans</p>
              <p className="text-xs text-slate-500">Collateral-free loans up to ₹10 Lakhs. Pre-approved for registered users.</p>
           </div>
           <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="text-2xl mb-2">👩‍💼</div>
              <p className="font-black text-slate-900 mb-1">Women Entrepreneur Funds</p>
              <p className="text-xs text-slate-500">Special grants and subsidies for female-led tech and retail startups.</p>
           </div>
           <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="text-2xl mb-2">📜</div>
              <p className="font-black text-slate-900 mb-1">Patent & IP Support</p>
              <p className="text-xs text-slate-500">80% rebate on patent filing costs through Government SIPP schemes.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
