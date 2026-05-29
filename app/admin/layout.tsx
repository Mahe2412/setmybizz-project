"use client";
import React, { useState, ReactNode, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface AdminLayoutProps { children: ReactNode; }

type ModuleId = 'crm' | 'leads' | 'documents' | 'analytics' | 'team' | 'settings' | 'marketing' | 'content' | 'tickets';

const MODULES: { id: ModuleId; label: string; icon: string; badge?: string }[] = [
  // SetMyBizz Modules
  { id: 'crm',        label: 'Leads & Onboarding', icon: 'person_add' },
  { id: 'marketing',  label: 'Ads & Social Media', icon: 'campaign' },
  { id: 'content',    label: 'Web & Landing Pages',icon: 'web' },
  
  // BizDesk Modules
  { id: 'leads',      label: 'Service Operations', icon: 'account_balance', badge: 'Live' },
  { id: 'tickets',    label: 'Performance & Support',icon: 'confirmation_number' },
  { id: 'team',       label: 'Team Management',    icon: 'groups' },
  
  // Shared/Global
  { id: 'documents',  label: 'Universal Vault',    icon: 'folder_shared' },
  { id: 'analytics',  label: 'Platform Metrics',   icon: 'bar_chart' },
  { id: 'settings',   label: 'Platform Rules',     icon: 'settings' },
];

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeModule = (searchParams.get('view') as ModuleId) || 'crm';
  const activeSpace = searchParams.get('space') || 'setmybizz';
  const [collapsed, setCollapsed] = useState(false);

  const navigate = (id: ModuleId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', id);
    router.push(`/admin?${params.toString()}`);
  };

  const setSpace = (space: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('space', space);
    // Reset view when switching space
    if (space === 'setmybizz') params.set('view', 'crm');
    if (space === 'bizdesk') params.set('view', 'leads');
    if (space === 'saas') params.set('view', 'analytics');
    router.push(`/admin?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex bg-[#0f1117] font-sans" style={{ fontFamily: '"Inter", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        .material-symbols-rounded { font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2d3a; border-radius: 4px; }
      `}</style>

      {/* ══ DARK SIDEBAR ══ */}
      <aside className={`${collapsed ? 'w-16' : 'w-60'} flex-shrink-0 bg-[#13151e] border-r border-white/5 flex flex-col transition-all duration-300 relative z-20`}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-white/5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-black text-white text-sm flex-shrink-0">S</div>
          {!collapsed && (
            <div>
              <p className="text-white text-sm font-black tracking-tight">SetMyBizz</p>
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Command OS</p>
            </div>
          )}
        </div>

        {/* Space Indicator */}
        {!collapsed && (
          <div className="px-4 py-3 bg-white/5 mx-3 mt-4 rounded-xl border border-white/10">
            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Active Space</p>
            <p className="text-xs font-bold text-white flex items-center gap-2 capitalize">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              {activeSpace}
            </p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-3 mt-2 space-y-0.5 overflow-y-auto">
          {!collapsed && <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-2 pb-2 pt-3">Space Modules</p>}
          {MODULES.filter(m => {
            if (activeSpace === 'setmybizz') return ['crm', 'marketing', 'content', 'documents', 'settings'].includes(m.id);
            if (activeSpace === 'bizdesk') return ['leads', 'tickets', 'team', 'documents'].includes(m.id);
            if (activeSpace === 'saas') return ['analytics', 'settings'].includes(m.id);
            return true;
          }).map(mod => {
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => navigate(mod.id)}
                title={collapsed ? mod.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group relative ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={`material-symbols-rounded text-xl flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} style={{ fontVariationSettings: "'FILL' 1" }}>{mod.icon}</span>
                {!collapsed && (
                  <>
                    <span className="text-xs font-bold flex-1">{mod.label}</span>
                    {mod.badge && (
                      <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">{mod.badge}</span>
                    )}
                  </>
                )}
                {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-400 rounded-full" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom: Sidebar Toggle & Identity */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full mb-2 flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-white transition rounded-xl hover:bg-white/5"
          >
            <span className="material-symbols-rounded text-base">{collapsed ? 'chevron_right' : 'chevron_left'}</span>
            {!collapsed && <span className="text-[10px] font-bold">Collapse Sidebar</span>}
          </button>
          <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition cursor-pointer`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-xs font-black text-white flex-shrink-0">MK</div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Mahendra K</p>
                <p className="text-[10px] text-indigo-400 font-bold">Super Admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ══ MAIN SHELL ══ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ══ TOP SPACE NAVIGATION HEADER ══ */}
        <div className="bg-[#13151e] border-b border-white/5 flex items-center px-6 h-14 gap-12 z-10 shadow-lg shadow-black/20">
          {[
            { id: 'setmybizz', label: 'SetMyBizz Intake' },
            { id: 'bizdesk', label: 'BizDesk Operations' },
            { id: 'saas', label: 'BizOS SaaS Platform' }
          ].map(space => (
            <button
              key={space.id}
              onClick={() => setSpace(space.id)}
              className={`relative h-full text-[12px] font-black uppercase tracking-[0.2em] transition-all flex items-center ${
                activeSpace === space.id ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {space.label}
              {activeSpace === space.id && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_-2px_12px_rgba(99,102,241,0.8)] rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Secondary Bar */}
        <header className="h-16 bg-[#13151e]/80 backdrop-blur border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{activeSpace} Context</p>
            <h1 className="text-white font-black text-base tracking-tight capitalize">
              {MODULES.find(m => m.id === activeModule)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">All Systems Live</span>
            </div>
            <Link
              href="/os"
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-300 transition"
            >
              <span className="material-symbols-rounded text-sm">open_in_new</span>
              View Client OS
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#0f1117] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-xs font-bold">Loading CommandOS...</p>
        </div>
      </div>
    }>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}
