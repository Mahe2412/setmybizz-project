'use client';
import React, { useState } from 'react';
import { BIZ, MCA_FILINGS } from '@/lib/mockBizData';
import { DCard, StatusBadge, ActionBtn, GhostBtn, T } from '@/components/os/shared';

type Section = 'details' | 'directors' | 'compliance' | 'startup' | null;

export default function CompanyTab() {
  const [open, setOpen] = useState<Section>('details');
  const toggle = (s: Section) => setOpen(o => o === s ? null : s);

  const AccordionItem = ({
    id, emoji, title, badge, children,
  }: { id: Section; emoji: string; title: string; badge?: React.ReactNode; children: React.ReactNode }) => (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: open === id ? '#bfdbfe' : '#e2e8f0' }}>
      <button
        onClick={() => toggle(id)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-blue-50 transition-all"
        style={{ background: open === id ? '#eff6ff' : 'white' }}
      >
        <span className="text-2xl">{emoji}</span>
        <span className="flex-1 text-base font-bold text-slate-800">{title}</span>
        {badge}
        <span className="text-slate-400 text-lg ml-2">{open === id ? '▲' : '▼'}</span>
      </button>
      {open === id && <div className="p-4 pt-2 bg-white border-t border-slate-100">{children}</div>}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Big Welcome Card */}
      <div className="rounded-3xl p-6 text-white text-center" style={{ background: 'linear-gradient(135deg,#1a56db,#0284c7)' }}>
        <div className="text-5xl mb-3">🏢</div>
        <h1 className="text-2xl font-black mb-1">{BIZ.name}</h1>
        <p className="text-blue-100 text-sm">{BIZ.structure} · Visakhapatnam, AP</p>
        <div className="flex justify-center gap-4 mt-4">
          <div className="bg-white/20 rounded-2xl px-4 py-2 text-center">
            <p className="text-xs text-blue-100">Registered</p>
            <p className="font-black text-sm">{BIZ.regDate}</p>
          </div>
          <div className="bg-white/20 rounded-2xl px-4 py-2 text-center">
            <p className="text-xs text-blue-100">Health Score</p>
            <p className="font-black text-sm">72 / 100 ⭐</p>
          </div>
          <div className="bg-white/20 rounded-2xl px-4 py-2 text-center">
            <p className="text-xs text-blue-100">Status</p>
            <p className="font-black text-sm">✅ Active</p>
          </div>
        </div>
      </div>

      {/* Accordion A: Company Details */}
      <AccordionItem id="details" emoji="📋" title="Company Details">
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            { label: '🪪 Company Number (CIN)', value: BIZ.cin },
            { label: '🧾 GST Number',           value: BIZ.gstin },
            { label: '📄 PAN Number',            value: BIZ.pan },
            { label: '🏛️ ROC Office',             value: BIZ.roc },
            { label: '📅 Registered On',         value: BIZ.regDate },
            { label: '💰 Share Capital',          value: BIZ.paidUpCapital },
          ].map(d => (
            <div key={d.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-[10px] text-slate-400 mb-0.5">{d.label}</p>
              <p className="text-sm font-bold text-slate-800 break-all">{d.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
          <p className="text-[10px] text-slate-400 mb-0.5">🏠 Registered Address</p>
          <p className="text-sm font-medium text-slate-800">{BIZ.address}</p>
        </div>
        <div className="flex gap-2 mt-3">
          <ActionBtn label="📄 Download Company Certificate" color={T.blue} />
        </div>
      </AccordionItem>

      {/* Accordion B: Directors */}
      <AccordionItem id="directors" emoji="👥" title="Directors & Owners">
        <div className="space-y-3 mt-2">
          {BIZ.directors.map((d, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">
                {d.name.split(' ').map(w => w[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800">{d.name}</p>
                <p className="text-xs text-slate-400">{d.designation} · DIN: {d.din}</p>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">✅ KYC Done</span>
            </div>
          ))}
        </div>
      </AccordionItem>

      {/* Accordion C: Compliance */}
      <AccordionItem
        id="compliance"
        emoji="✅"
        title="Compliance Checklist"
        badge={<span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-600">2 Pending</span>}
      >
        <div className="space-y-2 mt-2">
          {MCA_FILINGS.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xl">{f.status === 'filed' || f.status === 'ok' ? '✅' : '📅'}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">{f.desc}</p>
                <p className="text-xs text-slate-400">{f.form} · Due: {f.due}</p>
              </div>
              <StatusBadge status={f.status} />
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-sm font-bold text-amber-800">⚠️ Annual filings (AOC-4 and MGT-7) due by October. We will remind you!</p>
        </div>
      </AccordionItem>

      {/* Accordion D: Startup India */}
      <AccordionItem
        id="startup"
        emoji="🚀"
        title="Startup India (DPIIT)"
        badge={<span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-600">Not Applied</span>}
      >
        <div className="mt-2 space-y-3">
          <p className="text-slate-600 text-sm">Apply for <strong>Startup India recognition</strong> from the Government of India. It is <strong>free</strong> and gives you big benefits.</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: '💰', title: 'No Tax for 3 Years', sub: '80-IAC Benefit' },
              { icon: '🏛️', title: 'Govt Grants', sub: 'SIDBI Seed Fund' },
              { icon: '⚡', title: 'IP at Low Cost', sub: 'Patent fee discount' },
            ].map(b => (
              <div key={b.title} className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                <p className="text-2xl mb-1">{b.icon}</p>
                <p className="text-xs font-bold text-slate-800">{b.title}</p>
                <p className="text-[10px] text-slate-400">{b.sub}</p>
              </div>
            ))}
          </div>
          <ActionBtn label="🚀 Apply Free — Takes Only 7 Days" color={T.green} full />
        </div>
      </AccordionItem>
    </div>
  );
}
