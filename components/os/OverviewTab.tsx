'use client';
import React from 'react';
import { BIZ, COMPLIANCE_ITEMS, SERVICES_ORDERED } from '@/lib/mockBizData';
import { DCard, SectionTitle, StatusBadge, HealthRing, MiniProgress, ActionBtn, T } from '@/components/os/shared';
import type { OsTab } from '@/components/os/shared';

export default function OverviewTab({ setTab }: { setTab: (t: OsTab) => void }) {
  const urgent   = COMPLIANCE_ITEMS.filter(c => ['overdue', 'due'].includes(c.status));
  const upcoming = COMPLIANCE_ITEMS.filter(c => c.status === 'upcoming');

  return (
    <div className="space-y-5">
      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Health Score */}
        <DCard className="lg:col-span-1 flex flex-col items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 self-start">Business Health</p>
          <HealthRing score={BIZ.healthScore} />
          <div className="w-full space-y-2">
            <MiniProgress pct={60} color={T.amber}  label="GST Compliance" />
            <MiniProgress pct={90} color={T.green}  label="Legal Documents" />
            <MiniProgress pct={70} color={T.blue}   label="Tax Filing" />
            <MiniProgress pct={55} color={T.purple} label="Brand & IP" />
          </div>
          <button
            onClick={() => setTab('company')}
            className="w-full py-2 rounded-xl text-[11px] font-bold transition-all hover:bg-blue-100 text-blue-600 bg-blue-50 border border-blue-200"
          >
            View Full Report →
          </button>
        </DCard>

        {/* Quick Stats */}
        {([
          { icon: '🔴', label: 'Urgent Actions',  value: `${urgent.length}`, sub: 'File today — penalties accumulating', color: T.red,   tab: 'gst'     as OsTab },
          { icon: '📦', label: 'Active Services', value: '4',                sub: '2 complete · 2 in progress',       color: T.blue,  tab: 'records' as OsTab },
          { icon: '🌍', label: 'Global Presence', value: '1',                sub: 'India — Active',                   color: T.green, tab: 'global'  as OsTab },
        ] as const).map(stat => (
          <DCard key={stat.label} className="hover:shadow-md transition-shadow" onClick={() => setTab(stat.tab)}>
            <div className="flex items-start justify-between mb-4">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: `${stat.color}15`, color: stat.color }}>VIEW →</span>
            </div>
            <div className="text-4xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-sm font-bold text-slate-800">{stat.label}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{stat.sub}</div>
          </DCard>
        ))}
      </div>

      {/* Compliance Alerts */}
      <DCard>
        <SectionTitle icon="🚨" title="Compliance Alerts" sub="Immediate action required" />
        <div className="space-y-2.5">
          {urgent.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 p-3.5 rounded-xl"
              style={{
                background: item.status === 'overdue' ? 'rgba(220,38,38,0.06)' : 'rgba(217,119,6,0.06)',
                border: `1px solid ${item.status === 'overdue' ? 'rgba(220,38,38,0.2)' : 'rgba(217,119,6,0.2)'}`,
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl flex-shrink-0">{item.status === 'overdue' ? '🔴' : '⚠️'}</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{item.label}</p>
                  <p className="text-[11px] font-bold" style={{ color: item.status === 'overdue' ? T.red : T.amber }}>
                    {item.status === 'overdue' ? 'OVERDUE — File immediately' : `Due: ${item.due}`}
                  </p>
                </div>
              </div>
              <ActionBtn
                label="FILE NOW"
                color={item.status === 'overdue' ? T.red : T.amber}
                onClick={() => setTab(item.module as OsTab)}
              />
            </div>
          ))}
          {upcoming.map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl flex-shrink-0">📅</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{item.label}</p>
                  <p className="text-[11px] text-slate-500">Upcoming — Due: {item.due}</p>
                </div>
              </div>
              <button onClick={() => setTab(item.module as OsTab)} className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-100 transition-all whitespace-nowrap">PREPARE</button>
            </div>
          ))}
          {urgent.length === 0 && upcoming.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-sm">✅ All compliance tasks are on track!</div>
          )}
        </div>
      </DCard>

      {/* Services Tracker */}
      <DCard>
        <SectionTitle icon="📦" title="My Services" sub="SetMyBizz ordered & in-progress services" />
        <div className="space-y-3">
          {SERVICES_ORDERED.map((s, i) => {
            const barColor = s.status === 'complete' ? T.green : s.status === 'in-progress' ? T.amber : T.blue;
            return (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-2xl flex-shrink-0">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-bold text-slate-800 truncate">{s.name}</p>
                    <StatusBadge status={s.status} />
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200">
                    <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${s.progress}%`, background: barColor }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{s.progress}% complete · {s.date}</p>
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={() => setTab('records')} className="mt-4 w-full py-2.5 rounded-xl text-[12px] font-bold border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-400 transition-all">
          View All Records & Documents →
        </button>
      </DCard>

      {/* Arkle Recommendations */}
      <DCard>
        <SectionTitle icon="💡" title="Arkle Recommends" sub="Personalised suggestions for your startup" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {([
            { color: T.red,    icon: '🔴', title: 'File GSTR-1 immediately',         sub: 'Feb filing overdue — penalties accumulating from Mar 11',    cta: 'File Now →',   tab: 'gst'     as OsTab },
            { color: T.amber,  icon: '⚠️', title: 'Apply for Startup India (DPIIT)', sub: 'Tax exemption + Govt grants. Takes 7-10 days. Free.',       cta: 'Apply Free →', tab: 'company' as OsTab },
            { color: T.blue,   icon: '🔵', title: 'Set up e-Invoicing early',         sub: 'Be ready before you cross ₹5Cr threshold.',                  cta: 'Learn More →', tab: 'gst'     as OsTab },
            { color: T.purple, icon: '💜', title: 'Hire a CA for Annual Audit',        sub: 'Mandatory before Sep 30. Book now to avoid last-minute rush.', cta: 'Hire Expert →', tab: 'experts' as OsTab },
          ] as const).map((rec, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl cursor-pointer hover:shadow-md transition-shadow group"
              style={{ background: `${rec.color}08`, border: `1px solid ${rec.color}20` }}
              onClick={() => setTab(rec.tab)}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0">{rec.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 mb-0.5">{rec.title}</p>
                  <p className="text-[11px] text-slate-500 mb-2">{rec.sub}</p>
                  <span className="text-[10px] font-bold" style={{ color: rec.color }}>{rec.cta}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DCard>
    </div>
  );
}
