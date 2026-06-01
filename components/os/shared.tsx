'use client';
import React from 'react';

// ── Shared Types ────────────────────────────────────────────────────────────
export type OsTab = 'home' | 'company' | 'banking' | 'billbook' | 'billease' | 'orderdesk' | 'gst' | 'experts' | 'records' | 'global' | 'networking' | 'bharat-support' | 'market-access' | 'user-profile' | 'settings' | 'sell-commerce' | 'suppliers' | 'retailer' | 'learn' | 'launchpad' | 'spotlight' | 'workflows' | 'crm' | 'google';

// ── Light Theme Constants ────────────────────────────────────────────────────
export const T = {
  bg:          '#f8fafc',
  card:        '#ffffff',
  border:      '#e2e8f0',
  borderLight: '#f1f5f9',
  text:        '#0f172a',
  sub:         '#475569',
  muted:       '#94a3b8',
  blue:        '#2563eb',
  green:       '#16a34a',
  amber:       '#d97706',
  red:         '#dc2626',
  purple:      '#7c3aed',
  cyan:        '#0284c7',
};

export const CARD_STYLE = {
  background: T.card,
  borderColor: T.border,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

export const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  overdue:       { label: '🔴 Overdue',      color: '#dc2626', bg: 'rgba(220,38,38,0.1)'   },
  due:           { label: '⚠️ Due Soon',     color: '#d97706', bg: 'rgba(217,119,6,0.1)'   },
  upcoming:      { label: '🔵 Upcoming',     color: '#2563eb', bg: 'rgba(37,99,235,0.08)'  },
  ok:            { label: '✅ On Track',     color: '#16a34a', bg: 'rgba(22,163,74,0.1)'   },
  filed:         { label: '✅ Filed',        color: '#16a34a', bg: 'rgba(22,163,74,0.1)'   },
  complete:      { label: '✅ Complete',     color: '#16a34a', bg: 'rgba(22,163,74,0.1)'   },
  'in-progress': { label: '🟡 In Progress', color: '#d97706', bg: 'rgba(217,119,6,0.1)'   },
  pending:       { label: '🔵 Pending',      color: '#2563eb', bg: 'rgba(37,99,235,0.08)'  },
  verified:      { label: '✅ Verified',     color: '#16a34a', bg: 'rgba(22,163,74,0.1)'   },
};

// ── Shared UI Components ─────────────────────────────────────────────────────

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { label: status, color: T.muted, bg: 'rgba(148,163,184,0.1)' };
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ color: s.color, background: s.bg }}
    >
      {s.label}
    </span>
  );
}

export function DCard({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      className={`rounded-2xl p-5 border ${className} ${onClick ? 'cursor-pointer' : ''}`}
      style={CARD_STYLE}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)' }}
      >
        {icon}
      </div>
      <div>
        <h2 className="font-black text-slate-900 text-base leading-tight">{title}</h2>
        {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
      </div>
    </div>
  );
}

export function HealthRing({ score }: { score: number }) {
  const r      = 52;
  const circ   = 2 * Math.PI * r;
  const dash   = (score / 100) * circ;
  const color  = score >= 75 ? T.green : score >= 50 ? T.amber : T.red;
  const label  = score >= 75 ? 'EXCELLENT' : score >= 50 ? 'GOOD' : 'NEEDS WORK';

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="126" height="126" viewBox="0 0 126 126">
          <circle cx="63" cy="63" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <circle
            cx="63" cy="63" r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            transform="rotate(-90 63 63)"
            style={{ transition: 'stroke-dasharray 1.2s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black leading-none" style={{ color }}>{score}</span>
          <span className="text-[9px] text-slate-400 font-bold">/ 100</span>
        </div>
      </div>
      <span className="text-[9px] font-black tracking-widest mt-1.5" style={{ color }}>{label}</span>
    </div>
  );
}

export function MiniProgress({ pct, color, label }: { pct: number; color: string; label: string }) {
  return (
    <div>
      <div className="flex justify-between text-[9px] mb-1">
        <span className="text-slate-400">{label}</span>
        <span style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1 rounded-full bg-slate-100">
        <div className="h-1 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export function ActionBtn({ label, color, onClick, full }: { label: string; color?: string; onClick?: () => void; full?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80 active:scale-95 whitespace-nowrap ${full ? 'w-full py-2.5' : ''}`}
      style={{ background: color ?? T.blue, color: 'white' }}
    >
      {label}
    </button>
  );
}

export function GhostBtn({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-400 transition-all whitespace-nowrap"
    >
      {label}
    </button>
  );
}

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
      <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mb-0.5">{label}</p>
      <p className="text-sm font-bold text-slate-800 font-mono break-all">{value}</p>
    </div>
  );
}
