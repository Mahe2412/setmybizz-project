'use client';
import React, { useState } from 'react';
import { BIZ, MCA_FILINGS } from '@/lib/mockBizData';
import { DCard, StatusBadge, ActionBtn, GhostBtn, T } from '@/components/os/shared';

type Section = 'details' | 'directors' | 'compliance' | 'startup' | null;

const AccordionItem = ({
  id, icon, title, badge, children, isOpen, onToggle,
}: { id: Section; icon: string; title: string; badge?: React.ReactNode; children: React.ReactNode; isOpen: boolean; onToggle: () => void }) => (
  <div className="rounded-3xl border overflow-hidden transition-all duration-300" style={{ borderColor: isOpen ? '#e2e8f0' : '#f1f5f9', boxShadow: isOpen ? '0 20px 40px -20px rgba(0,0,0,0.05)' : 'none' }}>
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-4 p-5 text-left transition-all"
      style={{ background: isOpen ? 'white' : 'white' }}
    >
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isOpen ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <span className="flex-1 text-[13px] font-black uppercase tracking-widest text-slate-900">{title}</span>
      {badge}
      <span className={`material-symbols-outlined text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
    </button>
    {isOpen && <div className="p-6 pt-2 bg-white border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">{children}</div>}
  </div>
);

export default function CompanyTab() {
  const [open, setOpen] = useState<Section>('details');
  const toggle = (s: Section) => setOpen(o => o === s ? null : s);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Neural Entity Pulse */}
      <div className="rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-slate-900 border border-slate-100 bg-white shadow-[0_32px_80px_-20px_rgba(0,0,0,0.04)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-indigo-50/30 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10 text-center md:text-left">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2rem] bg-slate-900 shadow-2xl flex items-center justify-center font-black text-3xl md:text-4xl text-white group-hover:rotate-6 transition-transform shrink-0">
              {BIZ.name[0]}
          </div>
          <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-3 md:mb-4">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">Entity Live & Synced</p>
              </div>
              <h1 className="text-2xl md:text-3xl font-black mb-1 tracking-tight italic break-words">{BIZ.name}</h1>
              <p className="text-slate-400 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em]">{BIZ.structure} · {BIZ.roc}</p>
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
              <div className="bg-slate-50 rounded-2xl px-6 py-3 border border-slate-100 flex md:flex-col justify-between items-center md:items-start text-left">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Health</p>
                 <p className="font-black text-lg text-slate-900">{BIZ.healthScore}<span className="text-slate-300 text-xs">/100</span></p>
              </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Accordion A: Company Details */}
        <AccordionItem id="details" icon="dataset" title="Neural Identity Data" isOpen={open === 'details'} onToggle={() => toggle('details')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {[
              { label: 'Company Number (CIN)', value: BIZ.cin, icon: 'qr_code_2' },
              { label: 'GST Alignment',           value: BIZ.gstin, icon: 'receipt_long' },
              { label: 'PAN Identity',            value: BIZ.pan, icon: 'badge' },
              { label: 'ROC Command Office',     value: BIZ.roc, icon: 'account_balance' },
              { label: 'Neural Inception',         value: BIZ.regDate, icon: 'calendar_today' },
              { label: 'Deployment Capital',          value: BIZ.paidUpCapital, icon: 'payments' },
            ].map(d => (
              <div key={d.label} className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50 hover:bg-white hover:shadow-lg transition-all group">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 group-hover:text-blue-600 transition-colors">{d.label}</p>
                <div className="flex items-center gap-2">
                   <p className="text-[13px] font-black text-slate-900 break-all">{d.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-slate-50 rounded-2xl p-4 border border-slate-100/50">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Registered Neural Nexus (Address)</p>
            <p className="text-[13px] font-medium text-slate-900 leading-relaxed italic">{BIZ.address}</p>
          </div>
          <button className="mt-6 w-full py-4 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all active:scale-95">Download Neural Certificate</button>
        </AccordionItem>

        {/* Accordion B: Directors */}
        <AccordionItem id="directors" icon="groups" title="Primary Operators" isOpen={open === 'directors'} onToggle={() => toggle('directors')}>
          <div className="space-y-3 mt-2">
            {BIZ.directors?.map((d, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-[1.8rem] border border-slate-100/50 hover:bg-white hover:shadow-xl transition-all group text-center sm:text-left">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-lg group-hover:rotate-6 transition-transform shrink-0">
                  {d.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div className="flex-1">
                   <p className="font-black text-slate-900 tracking-tight">{d.name}</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{d.designation} · DIN: {d.din}</p>
                </div>
                <span className="text-[9px] font-black px-4 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest shrink-0">KYC Synced</span>
              </div>
            ))}
          </div>
        </AccordionItem>

        {/* Accordion C: Compliance */}
        <AccordionItem
          id="compliance"
          icon="verified"
          title="Compliance Sequence"
          isOpen={open === 'compliance'} onToggle={() => toggle('compliance')}
          badge={<span className="text-[9px] md:text-[10px] font-black px-2 md:px-3 py-1 rounded-lg bg-red-50 text-red-600 uppercase tracking-widest animate-pulse leading-none">2 Critical</span>}
        >
          <div className="space-y-2 mt-2">
            {MCA_FILINGS.map((f, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all text-center sm:text-left">
                <div className="hidden sm:block w-2 h-8 rounded-full shrink-0" style={{ background: (f.status === 'filed' || f.status === 'ok') ? '#10b981' : '#ef4444' }} />
                <div className="flex-1">
                   <p className="text-[13px] font-black text-slate-900">{f.desc}</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{f.form} · Sequence: {f.due}</p>
                </div>
                <StatusBadge status={f.status} />
              </div>
            ))}
          </div>
        </AccordionItem>

        {/* Accordion D: Startup India */}
        <AccordionItem
          id="startup"
          icon="rocket_launch"
          title="Neural Accelerator (DPIIT)"
          isOpen={open === 'startup'} onToggle={() => toggle('startup')}
          badge={<span className="text-[9px] md:text-[10px] font-black px-2 md:px-3 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-widest leading-none">Loop Pending</span>}
        >
          <div className="mt-2 space-y-6">
            <p className="text-slate-500 text-xs md:text-sm font-medium italic">Apply for Startup India recognition to unlock autonomous fiscal benefits and high-impact government loops.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: 'monetization_on', title: 'Fiscal Exemption', sub: '80-IAC Loop' },
                { icon: 'account_balance_wallet', title: 'Govt Liquidity', sub: 'Seed Fund Sync' },
                { icon: 'copyright', title: 'IP Protection', sub: 'Neural Patent Discount' },
              ].map(b => (
                <div key={b.title} className="bg-slate-50 rounded-[2rem] p-5 text-center border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-indigo-600">{b.icon}</span>
                  </div>
                  <p className="text-[10px] md:text-[11px] font-black text-slate-900 uppercase tracking-tight mb-1">{b.title}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{b.sub}</p>
                </div>
              ))}
            </div>
            <button className="w-full py-4 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">Initiate Application Loop (7 Days Sync)</button>
          </div>
        </AccordionItem>
      </div>
    </div>
  );
}
