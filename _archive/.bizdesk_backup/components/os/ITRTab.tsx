'use client';
import React from 'react';
import { ITR_RECORDS } from '@/lib/mockBizData';
import { DCard, SectionTitle, StatusBadge, ActionBtn, GhostBtn, T } from '@/components/os/shared';

const ADV_TAX = [
  { q: 'Q1', date: 'Jun 15, 2025', pct: '15%', paid: true  },
  { q: 'Q2', date: 'Sep 15, 2025', pct: '45%', paid: true  },
  { q: 'Q3', date: 'Dec 15, 2025', pct: '75%', paid: true  },
  { q: 'Q4', date: 'Mar 15, 2026', pct: '100%', paid: false },
];

export default function ITRTab() {
  return (
    <div className="space-y-5">
      <SectionTitle icon="📑" title="Income Tax & ITR" sub="Tax filing, TDS, advance tax & CA support" />

      {/* Urgent Alert */}
      <div className="p-4 rounded-2xl flex items-center gap-4 bg-red-50 border border-red-200">
        <span className="text-3xl">🔴</span>
        <div className="flex-1">
          <p className="font-black text-red-700">Advance Tax Q4 Due — Mar 15, 2026</p>
          <p className="text-[12px] text-red-600 mt-0.5">Pay 100% of estimated annual tax. Pre-revenue = NIL — still file a NIL challan to avoid IT notice.</p>
        </div>
        <ActionBtn label="PAY / FILE NOW" color={T.red} />
      </div>

      {/* ITR Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ITR_RECORDS.map((itr, i) => (
          <DCard key={i}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{itr.fy}</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">{itr.form}</p>
              </div>
              <StatusBadge status={itr.status} />
            </div>
            <p className="text-[12px] text-slate-500 mb-0.5">Due Date: <span className="text-slate-800 font-bold">{itr.due}</span></p>
            <p className="text-[11px] text-slate-400">{itr.note}</p>
            {itr.status === 'pending' && (
              <div className="mt-3">
                <ActionBtn label="File ITR with CA →" color={T.blue} full />
              </div>
            )}
          </DCard>
        ))}

        {/* Tax Summary */}
        <DCard>
          <h3 className="font-bold text-slate-900 mb-3">Tax Summary (FY 25-26)</h3>
          <div className="space-y-2.5">
            {([
              { label: 'Taxable Income',       value: '₹0', note: 'Pre-revenue stage',    color: T.blue   },
              { label: 'Total Tax Liability',  value: '₹0', note: 'No income = No tax',   color: T.green  },
              { label: 'Advance Tax Paid',     value: '₹0', note: '3 of 4 (NIL filed)',   color: T.amber  },
              { label: 'Tax Refund Due',       value: '₹0', note: '—',                    color: T.purple },
            ] as const).map(row => (
              <div key={row.label} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-[11px] font-bold text-slate-700">{row.label}</p>
                  <p className="text-[9px] text-slate-400">{row.note}</p>
                </div>
                <span className="font-black text-base" style={{ color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
        </DCard>
      </div>

      {/* Advance Tax */}
      <DCard>
        <SectionTitle icon="🧮" title="Advance Tax Schedule (FY 25-26)" sub="Pay in instalments to avoid Section 234B/234C interest" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {ADV_TAX.map(q => (
            <div
              key={q.q}
              className="p-3 rounded-xl text-center"
              style={{
                background: q.paid ? 'rgba(22,163,74,0.08)'  : 'rgba(220,38,38,0.08)',
                border:     q.paid ? '1px solid rgba(22,163,74,0.2)' : '1px solid rgba(220,38,38,0.2)',
              }}
            >
              <p className="text-xs font-black" style={{ color: q.paid ? T.green : T.red }}>{q.q}</p>
              <p className="text-lg font-black text-slate-900 mt-1">{q.pct}</p>
              <p className="text-[9px] text-slate-400 mt-0.5">{q.date}</p>
              <p className="text-[10px] font-bold mt-2" style={{ color: q.paid ? T.green : T.red }}>
                {q.paid ? '✅ Filed (NIL)' : '🔴 Due Now'}
              </p>
            </div>
          ))}
        </div>
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-3">
          <span className="text-xl">💡</span>
          <p className="text-[12px] text-slate-600 flex-1">
            Pre-revenue → Tax NIL. Still file a <strong className="text-slate-900">NIL challan</strong> for Q4 by Mar 15 to stay compliant and avoid IT notices.
          </p>
          <ActionBtn label="File NIL →" color={T.blue} />
        </div>
      </DCard>

      {/* TDS */}
      <DCard>
        <h3 className="font-bold text-slate-900 mb-4">TDS Summary (FY 25-26)</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {([
            { label: 'TDS Deducted (from clients)', value: '₹0', color: T.blue   },
            { label: 'TDS Paid (vendor payments)',  value: '₹0', color: T.amber  },
            { label: '26AS Credit Available',       value: '₹0', color: T.green  },
          ] as const).map(item => (
            <div key={item.label} className="p-3 rounded-xl text-center bg-slate-50 border border-slate-100">
              <p className="text-2xl font-black mb-1" style={{ color: item.color }}>{item.value}</p>
              <p className="text-[10px] text-slate-400 leading-snug">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <GhostBtn label="View Form 26AS" />
          <GhostBtn label="Download AIS Report" />
          <ActionBtn label="Book CA for TDS Filing" color={T.blue} />
        </div>
      </DCard>

      {/* CA CTA */}
      <DCard>
        <div className="flex items-center gap-4">
          <span className="text-4xl">👨‍💼</span>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900">Need a CA for ITR filing?</h3>
            <p className="text-[12px] text-slate-400 mt-0.5">SetMyBizz connects you with CAs who specialise in startup & MSME tax filing. Transparent pricing.</p>
          </div>
          <ActionBtn label="Hire a CA →" color={T.blue} />
        </div>
      </DCard>
    </div>
  );
}
