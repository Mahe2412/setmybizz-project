'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Sparkles, User, Building2, Play, Upload, KeyRound, RefreshCw,
  PhoneCall, ArrowRight, TrendingDown, Shield, FileText, Plus,
  ChevronRight, Search, Clock, CheckCircle2, AlertTriangle,
  Loader2, X, Brain, Zap, BarChart3, IndianRupee, Users,
  FileCheck, CalendarClock, Bot, TrendingUp, Landmark, Calculator,
  ExternalLink, Phone, Mail,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────

interface AgentLog {
  timestamp: string;
  node: string;
  message: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
}

interface AgentState {
  taxFilingId: string;
  profileId: string;
  clientName: string;
  currentNode: string;
  status: string;
  interruptionReason?: string;
  progress: number;
  data: {
    documentsFound: number;
    documentsProcessed: number;
    itrForm?: string;
    filingType?: string;
    taxResult?: any;
    gstResult?: any;
    discrepancies: string[];
    missingDocuments: string[];
    otpRequired?: boolean;
    ackNumber?: string;
  };
  logs: AgentLog[];
}

interface Stats {
  totalClients: number;
  filedCount: number;
  pendingCount: number;
  waitingOtp: number;
}

type Mode = 'b2c' | 'b2b' | 'leads' | 'financials';

// ─── Utility Components ─────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; pulse?: boolean }> = {
    SUBMITTED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    COMPLETED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    DRAFT: { bg: 'bg-slate-800/60', text: 'text-slate-400', dot: 'bg-slate-500' },
    WAITING_FOR_OTP: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400', pulse: true },
    INTERRUPTED: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400', pulse: true },
    ACTIVE: { bg: 'bg-sky-500/10', text: 'text-sky-400', dot: 'bg-sky-400', pulse: true },
    ERROR: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
  };
  const c = config[status] || config.DRAFT;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${c.bg} ${c.text} border border-current/10`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${c.pulse ? 'animate-pulse' : ''}`} />
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-4 flex items-center gap-3 backdrop-blur-md">
      <div className={`p-2.5 rounded-lg ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="text-2xl font-extrabold text-slate-100">{value}</div>
        <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function CAAgentPage() {
  const [mode, setMode] = useState<Mode>('b2c');
  const [profiles, setProfiles] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState<Stats>({ totalClients: 0, filedCount: 0, pendingCount: 0, waitingOtp: 0 });
  const [leadsStats, setLeadsStats] = useState({ total: 0, newLeads: 0, contacted: 0, converted: 0 });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // B2C Form
  const [form, setForm] = useState({ name: '', phone: '', email: '', pan: '', gstin: '' });

  // Agent Session
  const [agentState, setAgentState] = useState<AgentState | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // ─── API Calls ──────────────────────────────────────────────

  const fetchProfiles = useCallback(async () => {
    try {
      const res = await fetch('/api/agents/tax');
      const data = await res.json();
      if (data.success) {
        setProfiles(data.profiles || []);
        setStats(data.stats || { totalClients: 0, filedCount: 0, pendingCount: 0, waitingOtp: 0 });
      }
    } catch (err) { console.error(err); }
  }, []);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch('/api/agents/leads');
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
        setLeadsStats(data.stats || { total: 0, newLeads: 0, contacted: 0, converted: 0 });
      }
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { fetchProfiles(); fetchLeads(); }, [fetchProfiles, fetchLeads]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agentState?.logs?.length]);

  const createProfile = async (formData: typeof form) => {
    setLoading(true);
    try {
      const res = await fetch('/api/agents/tax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_profile',
          clientName: formData.name,
          clientPhone: formData.phone,
          clientEmail: formData.email,
          pan: formData.pan,
          gstin: formData.gstin,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchProfiles();
        return data;
      }
    } catch (err) { console.error(err); }
    setLoading(false);
    return null;
  };

  const runPipeline = async (filingId: string, otp?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/agents/tax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run_pipeline', filingId, otp }),
      });
      const data = await res.json();
      if (data.success) {
        setAgentState(data.state);
        if (data.state.status === 'COMPLETED') setOtpInput('');
        await fetchProfiles();
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleQuickFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    const result = await createProfile(form);
    if (result?.filing?.id) {
      await runPipeline(result.filing.id);
    }
    setForm({ name: '', phone: '', email: '', pan: '', gstin: '' });
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProfile(form);
    setForm({ name: '', phone: '', email: '', pan: '', gstin: '' });
    setShowAddClient(false);
  };

  const updateLeadStatus = async (id: string, status: string) => {
    await fetch('/api/agents/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    fetchLeads();
  };

  const filteredProfiles = profiles.filter((p) =>
    (p.clientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.pan || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.clientPhone || '').includes(searchQuery)
  );

  const logIcon = (level: string) => {
    switch (level) {
      case 'SUCCESS': return <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />;
      case 'WARN': return <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />;
      case 'ERROR': return <X className="w-3 h-3 text-red-400 shrink-0" />;
      default: return <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />;
    }
  };

  // ─── Leads Panel ────────────────────────────────────────────

  const LeadsPanel = () => (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Total Leads" value={leadsStats.total} color="bg-amber-500/10 text-amber-400" />
        <StatCard icon={Zap} label="New" value={leadsStats.newLeads} color="bg-red-500/10 text-red-400" />
        <StatCard icon={PhoneCall} label="Contacted" value={leadsStats.contacted} color="bg-sky-500/10 text-sky-400" />
        <StatCard icon={CheckCircle2} label="Converted" value={leadsStats.converted} color="bg-emerald-500/10 text-emerald-400" />
      </div>

      <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white text-sm">CA Lead Requests</span>
          </div>
          <button onClick={fetchLeads} className="p-2 bg-slate-950/60 border border-slate-800/60 rounded-xl text-slate-500 hover:text-white transition cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {leads.length === 0 ? (
          <div className="p-12 text-center">
            <PhoneCall className="w-10 h-10 mx-auto mb-3 text-slate-700" />
            <p className="text-slate-600 text-sm">No leads yet.</p>
            <p className="text-slate-700 text-xs mt-1">Share the ITR Wizard link with clients to start receiving leads.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/30">
            {leads.map((lead: any) => (
              <div key={lead.id} className="p-4 hover:bg-slate-800/20 transition">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-200">{lead.name}</div>
                      <div className="flex gap-3 text-[10px] text-slate-600 mt-0.5">
                        <span className="flex items-center gap-1"><Phone className="w-2.5 h-2.5" />{lead.phone}</span>
                        {lead.email && <span className="flex items-center gap-1"><Mail className="w-2.5 h-2.5" />{lead.email}</span>}
                      </div>
                      {lead.message && (
                        <p className="text-[11px] text-slate-500 mt-1 italic">
                          &ldquo;{lead.message.slice(0, 80)}{lead.message.length > 80 ? '...' : ''}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      lead.status === 'NEW' ? 'bg-red-500/10 text-red-400' :
                      lead.status === 'CONTACTED' ? 'bg-sky-500/10 text-sky-400' :
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>{lead.status}</span>
                    <span className="text-[9px] text-slate-600">{lead.filingType} • {lead.itrForm || '?'}</span>
                    <span className="text-[9px] text-slate-600">{new Date(lead.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <a href={`tel:${lead.phone}`} className="flex items-center gap-1 px-2 py-1 bg-slate-800/60 text-slate-400 hover:text-white text-[10px] rounded-lg transition">
                    <Phone className="w-3 h-3" /> Call
                  </a>
                  <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] rounded-lg hover:bg-emerald-500/20 transition">
                    WhatsApp
                  </a>
                  <button onClick={() => updateLeadStatus(lead.id, 'CONTACTED')} className="px-2 py-1 bg-sky-500/10 text-sky-400 text-[10px] rounded-lg hover:bg-sky-500/20 transition cursor-pointer">
                    Mark Contacted
                  </button>
                  <button onClick={() => updateLeadStatus(lead.id, 'CONVERTED')} className="px-2 py-1 bg-violet-500/10 text-violet-400 text-[10px] rounded-lg hover:bg-violet-500/20 transition cursor-pointer">
                    Convert → Client
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <ExternalLink className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-amber-300 text-sm">Share ITR Wizard with Clients</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-lg px-3 py-2 font-mono text-xs text-slate-400 flex items-center justify-between">
          <span>/arkle/itr-wizard</span>
          <button
            onClick={() => navigator.clipboard.writeText(window.location.origin + '/arkle/itr-wizard')}
            className="text-amber-400 hover:text-amber-300 text-xs font-semibold transition cursor-pointer"
          >
            Copy Link
          </button>
        </div>
        <p className="text-slate-500 text-[11px] mt-2">
          Clients fill in their details → AI analyses their tax → &ldquo;File with CA&rdquo; button sends you a lead automatically.
        </p>
      </div>
    </>
  );

  // ─── Financials Panel ────────────────────────────────────────

  const FinancialsPanel = () => (
    <div className="space-y-5">
      <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-1">
          <Landmark className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Financial Statements</h2>
        </div>
        <p className="text-slate-500 text-xs mb-5">Auto-generated Balance Sheet, P&amp;L, and Tax Computation from your BizOS accounting data.</p>
        <div className="space-y-4">
          {[
            {
              title: 'Profit & Loss Account',
              sub: 'Revenue, COGS, Expenses & Net Profit for FY 2025-26',
              icon: <TrendingUp className="w-5 h-5" />,
              color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',
            },
            {
              title: 'Balance Sheet',
              sub: 'Assets, Liabilities & Capital as on 31-Mar-2026',
              icon: <Landmark className="w-5 h-5" />,
              color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20',
            },
            {
              title: 'Tax Computation Sheet',
              sub: 'Income from all heads • Deductions • Final Tax & Refund',
              icon: <Calculator className="w-5 h-5" />,
              color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20',
            },
          ].map((item, i) => (
            <div key={i} className={`p-4 rounded-xl border ${item.border} ${item.bg} flex items-center gap-4`}>
              <div className={item.color}>{item.icon}</div>
              <div className="flex-1">
                <div className={`font-bold text-sm ${item.color}`}>{item.title}</div>
                <div className="text-slate-500 text-[11px]">{item.sub}</div>
              </div>
              <button className={`text-xs px-3 py-1.5 rounded-lg border ${item.border} ${item.color} hover:bg-white/5 transition cursor-pointer font-semibold`}>
                Generate
              </button>
            </div>
          ))}
        </div>
        <div className="mt-5 p-4 bg-slate-800/40 border border-slate-700/30 rounded-xl">
          <p className="text-slate-400 text-xs leading-relaxed">
            <span className="text-emerald-400 font-semibold">How it works:</span> The AI reads your invoices, purchases, payments and expenses from BizOS to auto-generate CA-grade financial statements.
          </p>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-teal-400" />
          <h2 className="text-base font-bold text-white">GST Returns Calendar</h2>
        </div>
        {[
          { label: 'GSTR-1', sub: 'Outward supply — B2B, B2C invoices', due: '11 Jul 2026', status: 'PENDING' },
          { label: 'GSTR-3B', sub: 'Monthly summary + Tax payment', due: '20 Jul 2026', status: 'PENDING' },
          { label: 'GSTR-9', sub: 'Annual return FY 2025-26', due: '31 Dec 2026', status: 'UPCOMING' },
        ].map((r, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800/30 last:border-0">
            <div>
              <div className="font-bold text-sm text-slate-200">{r.label}</div>
              <div className="text-[10px] text-slate-600">{r.sub}</div>
            </div>
            <div className="text-right">
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                r.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800/60 text-slate-500'
              }`}>{r.status}</div>
              <div className="text-[10px] text-slate-600 mt-0.5">Due: {r.due}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-100 font-sans selection:bg-teal-500/30">

      {/* ─── Background Decorations ───────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-violet-500/3 rounded-full blur-[100px]" />
      </div>

      {/* ─── Header ───────────────────────────────────────── */}
      <header className="relative z-10 border-b border-slate-800/40 bg-slate-950/60 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0a0e1a] animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-white">
                Arkle<span className="text-teal-400">CA</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">
                AI Tax &amp; GST Compliance Engine
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/60 flex-wrap">
            {([
              { key: 'b2c', label: 'Quick File', icon: <Zap className="w-3.5 h-3.5" />, active: 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20' },
              { key: 'b2b', label: 'Clients', icon: <Building2 className="w-3.5 h-3.5" />, active: 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' },
              { key: 'leads', label: 'Leads', icon: <PhoneCall className="w-3.5 h-3.5" />, active: 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20', badge: leadsStats.newLeads },
              { key: 'financials', label: 'Financials', icon: <Landmark className="w-3.5 h-3.5" />, active: 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setMode(tab.key); setAgentState(null); if (tab.key === 'leads') fetchLeads(); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mode === tab.key ? tab.active : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
                {('badge' in tab) && tab.badge > 0 && (
                  <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">{tab.badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ─── Main Content ─────────────────────────────────── */}
      <main className="relative z-10 max-w-[1440px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ═══════════ LEFT PANEL (7 cols) ═══════════ */}
          <div className="lg:col-span-7 space-y-5">

            {mode === 'b2c' && (
              /* ─── B2C: QUICK FILE FORM ────────────────── */
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-teal-400" />
                  <h2 className="text-lg font-bold text-white">Quick ITR/GST Filing</h2>
                </div>
                <p className="text-slate-500 text-xs mb-5">
                  Enter client details → AI computes tax → Optimizes regime → Files on portal. Total time: ~2 minutes.
                </p>

                <form onSubmit={handleQuickFile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'name', label: 'Full Name *', placeholder: 'e.g. Ramesh Kumar', type: 'text', required: true },
                      { key: 'phone', label: 'WhatsApp Number *', placeholder: '+91 98765 43210', type: 'tel', required: true },
                      { key: 'email', label: 'Email', placeholder: 'client@email.com', type: 'email' },
                      { key: 'pan', label: 'PAN', placeholder: 'ABCDE1234F', type: 'text' },
                      { key: 'gstin', label: 'GSTIN (if applicable)', placeholder: '22AAAAA0000A1Z5', type: 'text' },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1.5">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          required={field.required}
                          placeholder={field.placeholder}
                          value={(form as any)[field.key]}
                          onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                          className="w-full bg-slate-950/60 border border-slate-800/60 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/40 transition"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-1">
                    <div className="flex-1">
                      <label className="block text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Filing Type</label>
                      <select className="w-full bg-slate-950/60 border border-slate-800/60 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition">
                        <option value="ITR">Income Tax Return (ITR)</option>
                        <option value="GST">GST Return (GSTR-1/3B)</option>
                        <option value="BOTH">Both ITR + GST</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Period</label>
                      <select className="w-full bg-slate-950/60 border border-slate-800/60 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition">
                        <option value="FY-2025-26">FY 2025-26 (AY 2026-27)</option>
                        <option value="FY-2024-25">FY 2024-25 (AY 2025-26)</option>
                      </select>
                    </div>
                  </div>

                  {/* Link to full wizard */}
                  <div className="p-3 bg-violet-500/5 border border-violet-500/15 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-violet-300 text-xs font-semibold">User Self-Filing Wizard</p>
                      <p className="text-slate-500 text-[10px]">Share with clients to file their own ITR with AI guidance</p>
                    </div>
                    <a
                      href="/arkle/itr-wizard"
                      target="_blank"
                      className="flex items-center gap-1 px-3 py-1.5 bg-violet-500/15 border border-violet-500/30 text-violet-400 hover:bg-violet-500/25 text-xs font-semibold rounded-lg transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open Wizard
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-500 to-teal-400 text-slate-950 font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-teal-500/20 active:scale-[0.995] transition flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                    ) : (
                      <><Play className="w-4 h-4" /> Launch Filing Agent</>
                    )}
                  </button>
                </form>
              </div>
            )}

            {mode === 'b2b' && (
              /* ─── B2B: CA CONTROL CENTER ──────────────── */
              <>
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <StatCard icon={Users} label="Total Clients" value={stats.totalClients} color="bg-indigo-500/10 text-indigo-400" />
                  <StatCard icon={FileCheck} label="Filed" value={stats.filedCount} color="bg-emerald-500/10 text-emerald-400" />
                  <StatCard icon={CalendarClock} label="Pending" value={stats.pendingCount} color="bg-slate-800/60 text-slate-400" />
                  <StatCard icon={PhoneCall} label="Awaiting OTP" value={stats.waitingOtp} color="bg-amber-500/10 text-amber-400" />
                </div>

                {/* Client List */}
                <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl backdrop-blur-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-800/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-2 flex-1 max-w-sm">
                      <Search className="w-3.5 h-3.5 text-slate-600" />
                      <input
                        type="text"
                        placeholder="Search by name, PAN, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none w-full"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setShowAddClient(!showAddClient)} className="flex items-center gap-1 px-3 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl text-xs font-semibold hover:bg-indigo-500/20 transition cursor-pointer">
                        <Plus className="w-3.5 h-3.5" /> Add Client
                      </button>
                      <button onClick={fetchProfiles} className="p-2 bg-slate-950/60 border border-slate-800/60 rounded-xl text-slate-500 hover:text-white transition cursor-pointer">
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Inline Add Client Form */}
                  {showAddClient && (
                    <form onSubmit={handleAddClient} className="p-4 bg-indigo-500/5 border-b border-slate-800/40">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { key: 'name', placeholder: 'Client Name *', required: true },
                          { key: 'phone', placeholder: 'Phone *', required: true },
                          { key: 'pan', placeholder: 'PAN' },
                          { key: 'gstin', placeholder: 'GSTIN' },
                        ].map((f) => (
                          <input
                            key={f.key}
                            type="text"
                            placeholder={f.placeholder}
                            value={(form as any)[f.key]}
                            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                            required={f.required}
                            className="bg-slate-950/60 border border-slate-800/60 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition"
                          />
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button type="submit" className="flex items-center gap-1 px-4 py-2 bg-indigo-500 text-white text-xs font-bold rounded-lg hover:bg-indigo-400 transition cursor-pointer">
                          <Plus className="w-3.5 h-3.5" /> Add & File
                        </button>
                        <button type="button" onClick={() => setShowAddClient(false)} className="px-3 py-2 text-slate-500 text-xs hover:text-slate-300 transition cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Client rows */}
                  <div className="divide-y divide-slate-800/30">
                    {filteredProfiles.length === 0 ? (
                      <div className="text-center py-16 text-slate-600 text-sm">
                        <Bot className="w-10 h-10 mx-auto mb-3 text-slate-700" />
                        No clients yet. Click &ldquo;Add Client&rdquo; to begin.
                      </div>
                    ) : (
                      filteredProfiles.map((p) => {
                        const filing = p.filings?.[0];
                        const session = filing?.sessions?.[0];
                        return (
                          <div
                            key={p.id}
                            className="flex items-center justify-between px-4 py-3 border-b border-slate-800/30 hover:bg-slate-800/10 transition cursor-pointer group"
                            onClick={() => {
                              if (!filing) return;
                              if (session?.status === 'INTERRUPTED') {
                                setAgentState({
                                  taxFilingId: filing.id,
                                  profileId: p.id,
                                  clientName: p.clientName,
                                  currentNode: session.currentNode,
                                  status: session.status,
                                  interruptionReason: session.interruptionReason,
                                  progress: JSON.parse(session.graphState || '{}')?.progress || 85,
                                  data: JSON.parse(session.graphState || '{}')?.data || { documentsFound: 0, documentsProcessed: 0, discrepancies: [], missingDocuments: [] },
                                  logs: [],
                                });
                              } else {
                                runPipeline(filing.id);
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-800/60 flex items-center justify-center text-xs font-bold text-slate-400">
                                {(p.clientName || '?')[0]?.toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition">{p.clientName}</div>
                                <div className="flex gap-3 text-[10px] text-slate-600 mt-0.5">
                                  <span>{p.clientPhone || '—'}</span>
                                  <span>PAN: {p.pan || '—'}</span>
                                  {p.gstin && <span className="text-teal-500/60">GST ✓</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={filing?.status || 'DRAFT'} />
                              <ArrowRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-slate-400 transition" />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </>
            )}

            {mode === 'leads' && <LeadsPanel />}
            {mode === 'financials' && <FinancialsPanel />}
          </div>

          {/* ═══════════ RIGHT PANEL (5 cols) — Agent Console ═══════════ */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl backdrop-blur-xl overflow-hidden h-full flex flex-col min-h-[560px] sticky top-6">

              {/* Console Header */}
              <div className="p-4 border-b border-slate-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-teal-400 to-indigo-500 flex items-center justify-center">
                    <Brain className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-bold text-white">Agent Console</span>
                </div>
                {agentState && (
                  <div className="flex items-center gap-2">
                    <StatusBadge status={agentState.status} />
                  </div>
                )}
              </div>

              {agentState ? (
                <div className="flex-1 flex flex-col">
                  {/* Client & Progress */}
                  <div className="p-4 space-y-3 border-b border-slate-800/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-500 font-semibold">CLIENT</div>
                        <div className="text-sm font-bold text-white">{agentState.clientName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500 font-semibold">NODE</div>
                        <div className="text-xs font-mono text-teal-400">{agentState.currentNode}</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                        <span>Progress</span>
                        <span className="text-teal-400 font-bold">{agentState.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full transition-all duration-700"
                          style={{ width: `${agentState.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* ITR Form Info */}
                    {agentState.data.itrForm && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Form: <span className="text-indigo-400 font-bold">{agentState.data.itrForm}</span></span>
                        <span className="text-slate-500">Type: <span className="text-teal-400 font-bold">{agentState.data.filingType || 'ITR'}</span></span>
                      </div>
                    )}
                  </div>

                  {/* Tax Results */}
                  {agentState.data.taxResult && (
                    <div className="p-4 border-b border-slate-800/30 grid grid-cols-2 gap-3">
                      {[
                        { label: 'Recommended', value: agentState.data.taxResult.recommendedRegime, color: 'text-teal-400' },
                        { label: 'Tax Payable', value: `₹${agentState.data.taxResult.finalTax?.toLocaleString('en-IN') || '—'}`, color: 'text-white' },
                        { label: 'Tax Savings', value: `₹${agentState.data.taxResult.savings?.toLocaleString('en-IN') || '—'}`, color: 'text-emerald-400' },
                        { label: 'Refund', value: `₹${agentState.data.taxResult.refundDue?.toLocaleString('en-IN') || '0'}`, color: 'text-indigo-400' },
                      ].map((item, i) => (
                        <div key={i} className="bg-slate-950/40 rounded-lg p-2.5">
                          <div className="text-[10px] text-slate-500 font-semibold">{item.label}</div>
                          <div className={`text-sm font-bold ${item.color}`}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* OTP Interrupt */}
                  {(agentState.status === 'INTERRUPTED' || agentState.interruptionReason === 'WAITING_FOR_OTP') && (
                    <div className="p-4 border-b border-slate-800/30">
                      <div className="flex items-center gap-2 mb-3">
                        <KeyRound className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-bold text-amber-400">OTP Required</span>
                      </div>
                      <p className="text-slate-500 text-xs mb-3">A one-time password was sent to the client&apos;s registered mobile on the IT portal.</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          maxLength={6}
                          className="flex-1 bg-slate-950/60 border border-amber-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-700 font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition"
                        />
                        <button
                          onClick={() => runPipeline(agentState.taxFilingId, otpInput)}
                          disabled={loading || otpInput.length < 4}
                          className="px-4 py-2.5 bg-amber-500 text-slate-950 font-bold text-sm rounded-xl hover:bg-amber-400 transition disabled:opacity-50 cursor-pointer"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Ack Number on completion */}
                  {agentState.data.ackNumber && (
                    <div className="mx-4 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-bold text-emerald-400">Filed Successfully!</span>
                      </div>
                      <p className="text-slate-500 text-xs mt-1">Acknowledgement: <span className="font-mono text-slate-300">{agentState.data.ackNumber}</span></p>
                    </div>
                  )}

                  {/* Logs */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-1.5 font-mono text-[11px]">
                    {agentState.logs.map((log, i) => (
                      <div key={i} className="flex items-start gap-2 leading-relaxed">
                        {logIcon(log.level)}
                        <span className="text-slate-500 shrink-0">{new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        <span className={log.level === 'SUCCESS' ? 'text-emerald-400' : log.level === 'WARN' ? 'text-amber-400' : log.level === 'ERROR' ? 'text-red-400' : 'text-slate-400'}>
                          {log.message}
                        </span>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex items-center gap-2 text-slate-500">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    )}
                    <div ref={logsEndRef} />
                  </div>
                </div>
              ) : (
                /* Empty State */
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500/10 to-indigo-500/10 border border-slate-800/60 flex items-center justify-center mb-4">
                    <Bot className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-slate-400 font-bold mb-2">Agent Ready</h3>
                  <p className="text-slate-600 text-xs leading-relaxed max-w-xs">
                    Fill the Quick File form and click &ldquo;Launch Filing Agent&rdquo; to start a new filing, or click on a client row to resume their session.
                  </p>

                  {/* Feature highlights */}
                  <div className="mt-6 w-full space-y-2">
                    {[
                      { icon: <Brain className="w-3.5 h-3.5" />, text: 'Gemini Vision OCR — reads Form 16, AIS, Bank Statements', color: 'text-teal-400' },
                      { icon: <TrendingDown className="w-3.5 h-3.5" />, text: 'Old vs New regime — picks best automatically', color: 'text-indigo-400' },
                      { icon: <IndianRupee className="w-3.5 h-3.5" />, text: 'GSTR-1 & GSTR-3B computation with ITC matching', color: 'text-violet-400' },
                      { icon: <Shield className="w-3.5 h-3.5" />, text: 'OTP-interrupt for portal authentication', color: 'text-amber-400' },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-slate-950/40 border border-slate-800/40 rounded-xl text-left">
                        <span className={f.color}>{f.icon}</span>
                        <span className="text-slate-500 text-[11px]">{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
