'use client';
import React from 'react';

export default function NetworkingTab() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-8">
         <h1 className="text-3xl font-black text-slate-900 tracking-tight">Networking & Incubators</h1>
         <p className="text-slate-500 font-medium mt-2 max-w-2xl leading-relaxed">Connect with top-tier VCs, incubators, and startup founders. A curated network to help you secure funding and partnerships instantly inside the SetMyBizz ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:-translate-y-1 transition-transform cursor-pointer">
           <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-4">🤝</div>
           <h3 className="font-black text-xl text-slate-900 mb-2">Connect with VCs & Angels</h3>
           <p className="text-sm text-slate-600 leading-relaxed mb-4">Get direct introductions to 100+ active angel investors and VC firms focused on your industry.</p>
           <button className="text-purple-600 font-bold text-sm bg-purple-50 px-4 py-2 rounded-xl border border-purple-200">Explore Network →</button>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:-translate-y-1 transition-transform cursor-pointer">
           <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4">🚀</div>
           <h3 className="font-black text-xl text-slate-900 mb-2">Startup Incubators</h3>
           <p className="text-sm text-slate-600 leading-relaxed mb-4">Apply directly to YC, Techstars, and top Indian incubators with pre-vetted founder profiles.</p>
           <button className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl border border-blue-200">View Active Programs →</button>
        </div>
      </div>
    </div>
  );
}
