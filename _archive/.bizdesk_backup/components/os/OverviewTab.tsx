'use client';
import React from 'react';
import { BIZ, COMPLIANCE_ITEMS, SERVICES_ORDERED } from '@/lib/mockBizData';
import { DCard, SectionTitle, StatusBadge, HealthRing, MiniProgress, ActionBtn, T } from '@/components/os/shared';
import type { OsTab } from '@/components/os/shared';

export default function OverviewTab({ setTab }: { setTab: (t: OsTab) => void }) {
  const urgent   = COMPLIANCE_ITEMS.filter(c => ['overdue', 'due'].includes(c.status));
  const upcoming = COMPLIANCE_ITEMS.filter(c => c.status === 'upcoming');

  return (
    <div className="space-y-6 pb-20">
      {/* Top Neural Pulse Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Neural Health Core */}
        <DCard className="lg:col-span-1 flex flex-col items-center gap-6 p-8 bg-white border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          <div className="w-full flex justify-between items-center mb-2">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Arkle Health Score</p>
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          <HealthRing score={BIZ.healthScore || 0} />
          <div className="w-full space-y-4 mt-2">
            <MiniProgress pct={60} color={T.amber}  label="GST Compliance" />
            <MiniProgress pct={90} color={T.green}  label="Legal Documents" />
            <MiniProgress pct={70} color={T.blue}   label="Tax Filing" />
            <MiniProgress pct={55} color={T.purple} label="IP & Brand" />
          </div>
          <button
            onClick={() => setTab('company')}
            className="w-full py-3 mt-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:bg-slate-900 hover:text-white text-slate-900 bg-slate-50 border border-slate-100"
          >
            Detailed Diagnostics →
          </button>
        </DCard>

        {/* Neural Metrics Matrix */}
        {( [
          { icon: 'priority_high', label: 'Urgent Actions',  value: `${urgent.length}`, sub: 'Requires Neural Authorisation', color: T.red,   tab: 'gst'     as OsTab },
          { icon: 'layers',       label: 'Active Pipelines', value: '4',                sub: '2 active · 2 syncing',       color: T.blue,  tab: 'records' as OsTab },
          { icon: 'public',       label: 'Global Reach',     value: '1',                sub: 'India Cluster · Active',     color: T.green, tab: 'global'  as OsTab },
        ] as const).map(stat => (
          <DCard key={stat.label} className="hover:shadow-xl hover:translate-y-[-4px] transition-all cursor-pointer p-8 bg-white border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]" onClick={() => setTab(stat.tab)}>
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: `${stat.color}10`, color: stat.color }}>
                 <span className="material-symbols-outlined text-2xl font-black">{stat.icon}</span>
              </div>
              <span className="text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-slate-100 text-slate-400">Explore</span>
            </div>
            <div className="text-5xl font-black mb-2 tracking-tighter" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{stat.label}</div>
            <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{stat.sub}</div>
          </DCard>
        ))}
      </div>

      {/* Compliance Board (Monday Inspired) */}
      <DCard className="p-0 overflow-hidden border-slate-100 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.05)]">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white">
           <SectionTitle icon="gavel" title="Neural Compliance Board" sub="Automated regulatory tracking & execution" />
           <div className="flex gap-2">
              <span className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest">2 CRITICAL</span>
              <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">SYNCED</span>
           </div>
        </div>
        <div className="p-2 space-y-1 bg-slate-50/30">
          <div className="grid grid-cols-12 px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
             <div className="col-span-6">Compliance Item</div>
             <div className="col-span-2 text-center">Status</div>
             <div className="col-span-2 text-center">Due Date</div>
             <div className="col-span-2 text-right">Action</div>
          </div>
          {urgent.map((item, i) => (
            <div key={i} className="grid grid-cols-12 items-center px-6 py-4 bg-white rounded-2xl border border-slate-50 shadow-sm hover:shadow-md transition-all group">
               <div className="col-span-6 flex items-center gap-4">
                  <div className={`w-2 h-8 rounded-full ${item.status === 'overdue' ? 'bg-red-500' : 'bg-amber-500'}`} />
                  <div>
                     <p className="text-sm font-black text-slate-900 group-hover:text-slate-900 transition-colors">{item.label}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-widest">Regulatory Submission Required</p>
                  </div>
               </div>
               <div className="col-span-2 text-center">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${item.status === 'overdue' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-amber-500 text-white shadow-lg shadow-amber-200'}`}>
                     {item.status === 'overdue' ? 'OVERDUE' : 'DUE SOON'}
                  </span>
               </div>
               <div className="col-span-2 text-center font-black text-slate-500 text-xs">{item.due}</div>
               <div className="col-span-2 text-right">
                  <button onClick={() => setTab(item.module as OsTab)} className="px-5 py-2 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-lg shadow-slate-200">Execute</button>
               </div>
            </div>
          ))}
          {upcoming.map((item, i) => (
            <div key={i} className="grid grid-cols-12 items-center px-6 py-4 bg-white rounded-2xl border border-slate-50 opacity-60 hover:opacity-100 transition-all">
               <div className="col-span-6 flex items-center gap-4">
                  <div className="w-2 h-8 rounded-full bg-blue-400" />
                  <div>
                     <p className="text-sm font-black text-slate-900">{item.label}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-widest">Future Submission Pipeline</p>
                  </div>
               </div>
               <div className="col-span-2 text-center">
                  <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-600 border border-blue-200/50">Scheduled</span>
               </div>
               <div className="col-span-2 text-center font-black text-slate-500 text-xs">{item.due}</div>
               <div className="col-span-2 text-right">
                  <button onClick={() => setTab(item.module as OsTab)} className="px-5 py-2 rounded-xl border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Prepare</button>
               </div>
            </div>
          ))}
        </div>
      </DCard>

      {/* Services Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DCard className="p-8 bg-white border-slate-100 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.05)]">
          <SectionTitle icon="package_2" title="Neural Delivery Status" sub="Active SetMyBizz service execution" />
          <div className="space-y-4 mt-6">
            {SERVICES_ORDERED.map((s, i) => (
              <div key={i} className="p-5 rounded-[1.8rem] bg-slate-50 border border-slate-100/50 group hover:bg-white hover:shadow-xl hover:shadow-slate-500/5 transition-all">
                <div className="flex items-center gap-4">
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[15px] font-black text-slate-900 truncate">{s.name}</p>
                      <StatusBadge status={s.status} />
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(0,0,0,0.1)]" style={{ width: `${s.progress}%`, background: s.status === 'complete' ? T.green : T.amber }} />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{s.progress}% Consistently Synced</p>
                       <p className="text-[10px] font-black text-slate-400">{s.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setTab('records')} className="mt-8 w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all">
            Access Neural Vault →
          </button>
        </DCard>

        {/* Arkle Intelligence */}
        <DCard className="p-8 border-slate-100 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.05)] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/30 via-white to-white">
          <SectionTitle icon="auto_awesome" title="Arkle Insights" sub="Personalised neural growth loops" />
          <div className="grid grid-cols-1 gap-3 mt-6">
            {( [
              { color: T.red,    icon: 'alarm', title: 'Critical Filing Overdue',         sub: 'GSTR-1 penalties accumulating. Requesting immediate action.',    cta: 'Authorise Now →',   tab: 'gst'     as OsTab },
              { color: T.amber,  icon: 'lightbulb', title: 'DPIIT Recognition Available', sub: 'Tax exemption loop identified. Takes 7 days. Free.',       cta: 'Ignite Process →', tab: 'company' as OsTab },
              { color: T.blue,   icon: 'receipt', title: 'Early e-Invoicing Path',         sub: 'Optimise reporting before ₹5Cr threshold sync.',                  cta: 'Review Plan →', tab: 'gst'     as OsTab },
              { color: T.purple, icon: 'diversity_3', title: 'Audit Preparation Required',        sub: 'Neural scan recommends booking CA for Annual Audit now.', cta: 'Check Experts →', tab: 'experts' as OsTab },
            ] as const).map((rec, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl cursor-pointer hover:shadow-2xl hover:shadow-slate-500/10 transition-all bg-white border border-slate-100 group"
                onClick={() => setTab(rec.tab)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform" style={{ background: rec.color }}>
                     <span className="material-symbols-outlined text-xl">{rec.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-black text-slate-900 mb-0.5">{rec.title}</p>
                    <p className="text-[11px] font-medium text-slate-400 mb-3">{rec.sub}</p>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: rec.color }}>{rec.cta}</span>
                       <span className="material-symbols-outlined text-slate-200 group-hover:text-slate-900 transition-colors">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DCard>
      </div>
    </div>
  );
}
