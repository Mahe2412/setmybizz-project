'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function VitalsTab() {
  const [pains, setPains] = useState([
    { id: 1, text: "Sales velocity is slow in the afternoon.", status: "Tracking" },
    { id: 2, text: "GST Filing overdue (Penalty risk).", status: "Critical" }
  ]);

  const [vitals, setVitals] = useState({
    monthlySales: "₹4,50,000",
    unpaidBills: "₹85,000",
    burnRate: "₹1,20,000"
  });

  return (
    <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto pb-20 animate-in fade-in duration-500 px-4 md:px-0">
      {/* Header Summary */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="text-center lg:text-left">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight italic">Business Vitals</h2>
          <p className="text-[10px] md:text-sm text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Monitoring Failures, Triumphs & Neural Trajectories</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="bg-white p-4 md:p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-center sm:justify-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
              <span className="material-symbols-outlined text-blue-600 text-[24px]">favorite</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Health</p>
              <p className="text-xl md:text-2xl font-black text-slate-900">47<span className="text-sm text-slate-300">/100</span></p>
            </div>
          </div>
          <div className="bg-slate-900 p-5 rounded-[2rem] shadow-2xl flex items-center justify-center gap-3 shrink-0">
             <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
             <p className="text-white text-[11px] font-black uppercase tracking-[0.2em]">Autopilot Global Active</p>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Financial Pulse */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 p-6 md:p-10 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full blur-3xl -z-10" />
             <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 border-l-4 border-blue-600 pl-4 leading-none">Financial Pulse</h3>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
               <div className="space-y-1 text-center sm:text-left">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Revenue</p>
                 <p className="text-2xl md:text-3xl font-black text-slate-900 mt-1">{vitals.monthlySales}</p>
                 <div className="flex items-center justify-center sm:justify-start gap-1 text-emerald-600 text-[10px] font-black uppercase tracking-tighter mt-2">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> +12% Growth Loop
                 </div>
               </div>
               <div className="space-y-1 text-center sm:text-left border-y sm:border-y-0 sm:border-x border-slate-50 py-6 sm:py-0 sm:px-8">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unpaid Liabilities</p>
                 <p className="text-2xl md:text-3xl font-black text-red-500 mt-1">{vitals.unpaidBills}</p>
                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2 italic">3 Invoices in Audit</p>
               </div>
               <div className="space-y-1 text-center sm:text-left">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cash Depletion</p>
                 <p className="text-2xl md:text-3xl font-black text-slate-900 mt-1">{vitals.burnRate}</p>
                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2 italic">Proprietorship overhead</p>
               </div>
             </div>
             
             {/* Simple visual chart area */}
             <div className="mt-12 h-32 md:h-40 w-full flex items-end gap-1.5 px-2">
                {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 80].map((h, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ height: 0 }} 
                    animate={{ height: `${h}%` }} 
                    className={`flex-1 rounded-t-xl transition-all duration-700 ${i === 11 ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-slate-100 group-hover:bg-slate-200'}`} 
                  />
                ))}
             </div>
          </div>

          {/* Business Intelligence (Pains & Failures) */}
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 p-6 md:p-10 shadow-sm transition-all hover:bg-slate-50/30">
             <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] border-l-4 border-amber-500 pl-4 leading-none">Neural Audit (Pains & Mistaks)</h3>
                <button className="w-full sm:w-auto text-[10px] font-black text-blue-600 uppercase border border-blue-100 bg-blue-50/50 px-6 py-3 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95">Add Observation</button>
             </div>
             <div className="space-y-4">
               {pains.map(p => (
                 <div key={p.id} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-[1.8rem] bg-white border border-slate-100 shadow-sm transition-all hover:shadow-lg group text-center sm:text-left">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${p.status === 'Critical' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-amber-50 text-amber-500 border border-amber-100'}`}>
                      <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">{p.status === 'Critical' ? 'warning' : 'tips_and_updates'}</span>
                    </div>
                    <div className="flex-1 w-full">
                      <p className="text-[14px] md:text-[15px] font-black text-slate-900 tracking-tight italic break-words leading-relaxed group-hover:text-blue-700 transition-colors">"{p.text}"</p>
                      <div className="flex flex-col sm:flex-row items-center gap-3 mt-3">
                         <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${p.status === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>{p.status} Indicator</span>
                         <span className="text-[9px] font-black uppercase text-blue-600 cursor-pointer hover:tracking-widest transition-all">Engage Neural Solution →</span>
                      </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Sidebar Mini-Dash */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-700 via-blue-600 to-indigo-800 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden group">
             <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-[60px]" />
             <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Arkle Intelligence Loop</p>
             <h4 className="text-xl md:text-2xl font-black mt-3 italic tracking-tight">Scale Recommendation</h4>
             <p className="text-xs md:text-sm mt-6 leading-relaxed opacity-90 font-medium">Mahendra, your trajectory suggests that <strong>GSTR-1 automation</strong> will unlock +15% operational capacity. Shall we synchronize now?</p>
             <button className="w-full mt-10 bg-white text-indigo-700 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-slate-50 active:scale-95 transition-all">Execute Synchrony</button>
          </div>

          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 p-8 md:p-10 shadow-sm transition-all hover:shadow-xl group">
             <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 border-l-4 border-slate-900 pl-4 leading-none">Udyam Compliance</h3>
             <div className="space-y-6">
                <div className="flex items-center justify-between group-hover:translate-x-1 transition-transform">
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">License Status</p>
                   <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Active</span>
                </div>
                <div className="flex items-center justify-between group-hover:translate-x-1 transition-transform delay-75">
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Audit Interval</p>
                   <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.1em]">Sep 2026 Sync</span>
                </div>
                <div className="pt-2">
                   <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-[2px]">
                      <div className="h-full bg-indigo-600 rounded-full shadow-lg" style={{ width: '85%' }} />
                   </div>
                   <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-3 text-center">85% Compliance Integrity</p>
                </div>
             </div>
          </div>

          <div className="rounded-[2.5rem] p-8 bg-amber-50 border border-amber-100 text-center animate-pulse">
             <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-relaxed">Neural Health Warning: Manual tax loops detected. Engage Arkle for 100% Autopilot Sync.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
