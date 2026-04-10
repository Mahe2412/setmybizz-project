'use client';
import React, { useState } from 'react';
import { EXPERTS } from '@/lib/mockBizData';
import { DCard, SectionTitle, ActionBtn, GhostBtn, T } from '@/components/os/shared';

const TYPE_TABS = ['All', 'CA', 'CS', 'Banking', 'Finance', 'Tech'];

export default function ExpertsTab() {
  const [activeType, setActiveType] = useState('All');
  const [hired, setHired]           = useState<number | null>(null);

  const visible = activeType === 'All' ? EXPERTS : EXPERTS.filter(e => e.type === activeType);

  return (
    <div className="space-y-5">
      <SectionTitle icon="👥" title="Expert Marketplace" sub="Hire CA, CS, Finance & Tech professionals on demand" />

      {/* Banner */}
      <div className="p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
        <span className="text-4xl">🤝</span>
        <div className="flex-1">
          <h3 className="font-black text-slate-900 text-base">Run your startup without a full-time team</h3>
          <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">Book proven CA, CS, finance advisors & tech consultants on-demand. Pay only per hour or monthly retainer.</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-[10px] text-slate-400">Starting from</p>
          <p className="text-2xl font-black text-blue-600">₹500/hr</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {([
          { label: 'Professionals', value: '120+',    color: T.blue   },
          { label: 'Avg Rating',    value: '4.8 ★',   color: T.amber  },
          { label: 'Sessions Done', value: '3,400+',  color: T.green  },
          { label: 'Response Time', value: '< 2 hrs', color: T.purple },
        ] as const).map(s => (
          <div key={s.label} className="p-4 rounded-3xl text-center bg-white border border-slate-100 shadow-sm">
            <p className="text-xl md:text-2xl font-black mb-0.5 whitespace-nowrap" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {TYPE_TABS.map(t => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className="text-[11px] font-bold px-3.5 py-1.5 rounded-full transition-all"
            style={activeType === t ? { background: T.blue, color: 'white' } : { background: 'white', color: '#64748b', border: '1px solid #e2e8f0' }}
          >
            {t === 'CA' ? '🧑‍💼 CA' : t === 'CS' ? '🏛️ CS' : t === 'Banking' ? '🏦 Banking' : t === 'Finance' ? '📈 Finance / CFO' : t === 'Tech' ? '💻 Tech' : '👥 All Experts'}
          </button>
        ))}
      </div>

      {/* Expert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visible.map(expert => (
          <DCard key={expert.id}>
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                style={{ background: `${expert.color}15`, color: expert.color }}
              >
                {expert.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-black text-slate-900 text-sm">{expert.name}</h4>
                  <span
                    className="text-[9px] font-black px-2 py-0.5 rounded-full"
                    style={{
                      background: expert.badge === 'Top Rated' ? 'rgba(217,119,6,0.12)' : expert.badge === 'Premium' ? 'rgba(220,38,38,0.1)' : 'rgba(37,99,235,0.1)',
                      color: expert.badge === 'Top Rated' ? T.amber : expert.badge === 'Premium' ? T.red : T.blue,
                    }}
                  >
                    {expert.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{expert.role}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-amber-500">★ {expert.rating}</span>
                  <span className="text-[10px] text-slate-400">({expert.reviews} reviews) · {expert.exp} exp</span>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-sm font-black text-slate-900">{expert.rate}</p>
                {expert.available
                  ? <span className="text-[10px] font-bold text-green-600">● Available</span>
                  : <span className="text-[10px] font-bold text-slate-400">○ Busy</span>}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {expert.tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{tag}</span>
              ))}
            </div>

            {hired === expert.id ? (
              <div className="py-4 rounded-2xl text-center text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-widest animate-in zoom-in-95">
                ✅ Request Synced! Session upcoming.
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setHired(expert.id)}
                  disabled={!expert.available}
                  className="flex-1 py-3.5 rounded-2xl text-[10px] font-black transition-all shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white uppercase tracking-widest"
                  style={{ background: expert.available ? `linear-gradient(135deg,${T.blue},#0284c7)` : '#e2e8f0', boxShadow: expert.available ? '0 8px 16px -6px rgba(37,99,235,0.4)' : 'none' }}
                >
                  {expert.available ? 'Book Session →' : 'Waitlist'}
                </button>
                <div className="sm:w-32 shrink-0">
                   <GhostBtn label="Profile" />
                </div>
              </div>
            )}
          </DCard>
        ))}
      </div>

      {/* Post Requirement */}
      <DCard>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <span className="text-4xl">📢</span>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900">Can&apos;t find the right expert?</h3>
            <p className="text-[12px] text-slate-400 mt-0.5">Post your requirement and we&apos;ll match you with a verified professional within 24 hours. Free matching.</p>
          </div>
          <ActionBtn label="Post Requirement →" color={T.amber} />
        </div>
      </DCard>
    </div>
  );
}
