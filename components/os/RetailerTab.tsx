'use client';
import React from 'react';

export default function RetailerTab() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-6 flex items-center justify-between">
         <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Retailers & Franchise</h1>
           <p className="text-slate-500 font-medium mt-1">Manage retailers, distributors, and franchise partners across your network.</p>
         </div>
         <button className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-md hover:bg-blue-700 transition-all">+ Add Partner</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
         <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Retailers</h3>
            <p className="text-4xl font-black text-slate-900">124</p>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Distributors</h3>
            <p className="text-4xl font-black text-slate-900">12</p>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Franchise Outlets</h3>
            <p className="text-4xl font-black text-slate-900">4</p>
         </div>
      </div>

      <div className="mt-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8 text-center">
         <div className="text-6xl mb-4">🏪</div>
         <h2 className="text-2xl font-black text-slate-900 mb-2">Network Geography Mapping</h2>
         <p className="text-slate-500 font-medium max-w-lg mx-auto mb-6">Visual tracking for all retail partners is currently syncing with MapBox APIs. You will see a heatmap of your active distribution channels very soon.</p>
         <button className="px-6 py-2.5 bg-slate-100 text-slate-500 font-bold text-sm rounded-xl hover:bg-slate-200">Force Sync Maps</button>
      </div>
    </div>
  );
}
