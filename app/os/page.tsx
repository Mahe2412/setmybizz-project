'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { BIZ } from '@/lib/mockBizData';
import type { OsTab } from '@/components/os/shared';
import ArklePanel  from '@/components/os/ArklePanel';
import HomeTab     from '@/components/os/HomeTab';
import CompanyTab  from '@/components/os/CompanyTab';
import BankingTab  from '@/components/os/BankingTab';
import GSTTab      from '@/components/os/GSTTab';
import ExpertsTab  from '@/components/os/ExpertsTab';
import RecordsTab  from '@/components/os/RecordsTab';
import GlobalTab   from '@/components/os/GlobalTab';

const D1_NAV: { id: OsTab; icon: string; label: string; badge?: string }[] = [
  { id: 'home',     icon: '🤖', label: 'Arkle AI' },
  { id: 'company',  icon: '🏢', label: 'My Company' },
  { id: 'banking',  icon: '🏦', label: 'Banking' },
  { id: 'gst',      icon: '📋', label: 'GST',          badge: '⚠️' },
  { id: 'experts',  icon: '👥', label: 'Hire Experts' },
  { id: 'records',  icon: '🗄️', label: 'Records' },
  { id: 'global',   icon: '🌍', label: 'Go Global' },
];

const OS_DASHBOARDS = [
  { id: 'D1', icon: '🤖', label: 'AI Home',   href: '/os',        active: true  },
  { id: 'D2', icon: '🚀', label: 'LaunchPad', href: '/dashboard', active: true  },
  { id: 'D3', icon: '🤖', label: 'AI Teams',  href: '#',          active: false },
  { id: 'D4', icon: '⚙️',  label: 'Workspace', href: '/workspace', active: false },
];

export default function OSPage() {
  const [activeTab,   setActiveTab]   = useState<OsTab>('home');
  const [arkleOpen,   setArkleOpen]   = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDash,  setActiveDash]  = useState('D1');

  const current = D1_NAV.find(n => n.id === activeTab);

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: '#f8fafc', fontFamily: '"DM Sans", sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:4px}`}</style>

      {/* TOP BAR */}
      <header className="flex-shrink-0 h-14 bg-white flex items-center justify-between px-4 gap-4 z-50" style={{ borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(o => !o)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="4" width="18" height="2" rx="1"/><rect x="3" y="11" width="18" height="2" rx="1"/><rect x="3" y="18" width="18" height="2" rx="1"/>
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm text-white" style={{ background: 'linear-gradient(135deg,#1a56db,#0284c7)' }}>S</div>
            <span className="font-black text-slate-900 text-sm hidden sm:block">SetMyBizz</span>
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md ml-0.5 hidden sm:block bg-blue-100 text-blue-700">OS</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="text-slate-400">Business OS</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-bold">{current?.icon} {current?.label}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-slate-800 leading-none truncate max-w-[180px]">{BIZ.name}</p>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <div className="h-1.5 w-16 rounded-full overflow-hidden bg-slate-200">
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${BIZ.healthScore}%` }} />
              </div>
              <span className="text-[9px] font-bold text-amber-600">{BIZ.healthScore}/100</span>
            </div>
          </div>
          <button
            onClick={() => setArkleOpen(o => !o)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all font-bold text-[11px]"
            style={arkleOpen ? { background: '#2563eb', color: 'white' } : { background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}
          >
            <div className="w-5 h-5 rounded-md flex items-center justify-center font-black text-xs bg-white/25">A</div>
            <span className="hidden sm:block">Co-Founder</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </button>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs bg-blue-100 text-blue-700 cursor-pointer">MK</div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        {sidebarOpen && (
          <aside className="flex-shrink-0 w-52 bg-white flex flex-col overflow-hidden" style={{ borderRight: '1px solid #e2e8f0' }}>
            {/* OS Switcher */}
            <div className="p-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Workspace</p>
              <div className="space-y-0.5">
                {OS_DASHBOARDS.map(dash => (
                  <Link key={dash.id} href={dash.href} onClick={() => setActiveDash(dash.id)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all hover:bg-slate-50"
                    style={activeDash === dash.id ? { background: '#eff6ff', border: '1px solid #bfdbfe' } : { border: '1px solid transparent' }}
                  >
                    <span className="text-base">{dash.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 truncate">{dash.id}</p>
                      <p className="text-[9px] text-slate-400">{dash.label}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* D1 Nav */}
            <div className="flex-1 overflow-y-auto py-3 px-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Core Hub</p>
              <div className="space-y-0.5">
                {D1_NAV.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left hover:bg-slate-50"
                    style={activeTab === item.id ? { background: '#eff6ff', border: '1px solid #bfdbfe' } : { border: '1px solid transparent' }}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-[13px] font-bold flex-1 leading-none" style={{ color: activeTab === item.id ? '#2563eb' : '#475569' }}>
                      {item.label}
                    </span>
                    {item.badge && <span className="text-sm">{item.badge}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* User */}
            <div className="p-3" style={{ borderTop: '1px solid #f1f5f9' }}>
              <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl cursor-pointer hover:bg-slate-50 transition-all">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs bg-blue-100 text-blue-700">MK</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-slate-800 truncate">Mahendra Kumar</p>
                  <p className="text-[9px] text-slate-400">Director & CEO</p>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
          {activeTab === 'home'    && <HomeTab />}
          {activeTab === 'company' && <CompanyTab />}
          {activeTab === 'banking' && <BankingTab />}
          {activeTab === 'gst'     && <GSTTab />}
          {activeTab === 'experts' && <ExpertsTab />}
          {activeTab === 'records' && <RecordsTab />}
          {activeTab === 'global'  && <GlobalTab />}
        </main>

        {/* ARKLE - Helper (Only visible for non-home cards) */}
        {arkleOpen && activeTab !== 'home' && (
          <aside className="flex-shrink-0 w-72 xl:w-80 hidden lg:flex flex-col">
            <ArklePanel onClose={() => setArkleOpen(false)} />
          </aside>
        )}
      </div>
    </div>
  );
}
