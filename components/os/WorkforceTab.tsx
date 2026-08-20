'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Phone, Zap, Database, MessageSquare,
  Clock, Building2, Brain, Package, Target, ShoppingBag,
  X, Sparkles, Mic, MicOff, PhoneCall, CheckCircle2,
  Mail, BarChart2, Send, Calendar, PlayCircle, Plus,
  ChevronRight, Settings, TrendingUp, Bot, Cpu,
  Activity, Star, Globe, Edit3, Briefcase, Rocket
} from 'lucide-react';
import VapiButton from '../VapiButton';

// ── Types ──────────────────────────────────────────────────────────────────────
interface VoiceAgent {
  id: string;
  name: string;
  role: string;
  language: string;
  voiceId: string;
  status: string;
  totalCalls: number;
  totalMinutes: number;
  createdAt: string;
  businessDescription?: string;
}

interface WorkAgent {
  id: string;
  name: string;
  type: 'email' | 'whatsapp' | 'report' | 'calendar' | 'marketing';
  status: 'active' | 'idle' | 'building';
  tasksCompleted: number;
  lastRun?: string;
  description: string;
}

// ── Agent Templates ────────────────────────────────────────────────────────────
const VOICE_TEMPLATES = [
  {
    id: 'sales_caller',
    name: 'Swara',
    role: 'sales',
    label: 'Sales Caller',
    icon: '🎯',
    color: 'indigo',
    desc: 'Calls warm leads, pitches products, qualifies prospects',
  },
  {
    id: 'receptionist',
    name: 'Priya',
    role: 'reception',
    label: 'Receptionist',
    icon: '📞',
    color: 'purple',
    desc: 'Answers inbound calls, books appointments, routes to team',
  },
  {
    id: 'support',
    name: 'Ravi',
    role: 'support',
    label: 'Support Agent',
    icon: '💬',
    color: 'blue',
    desc: 'Handles complaints, FAQs, returns, and escalations',
  },
  {
    id: 'collections',
    name: 'Kavya',
    role: 'collections',
    label: 'Collections Agent',
    icon: '💰',
    color: 'amber',
    desc: 'Follows up on dues, sends payment links politely',
  },
];

const WORK_TEMPLATES = [
  { id: 'email_agent', name: 'Email Bot', type: 'email' as const, icon: '📧', desc: 'Sends follow-up emails, newsletters automatically' },
  { id: 'whatsapp_agent', name: 'WhatsApp Bot', type: 'whatsapp' as const, icon: '💬', desc: 'Sends catalogs, payment links, order updates' },
  { id: 'report_agent', name: 'Report Bot', type: 'report' as const, icon: '📊', desc: 'Daily morning business summary report' },
  { id: 'marketing_agent', name: 'Marketing Bot', type: 'marketing' as const, icon: '📣', desc: 'Creates content, manages campaigns' },
];

const STATUS_DOT: Record<string, string> = {
  active: 'bg-emerald-400 animate-pulse',
  idle: 'bg-slate-300',
  building: 'bg-amber-400 animate-pulse',
};

// ══════════════════════════════════════════════════════════════════════════════
export default function WorkforceTab() {
  const [view, setView] = useState<'dashboard' | 'create_voice' | 'create_work' | 'agent_detail' | 'arkle_builder'>('dashboard');
  const [selectedAgent, setSelectedAgent] = useState<VoiceAgent | null>(null);

  // Agents
  const [voiceAgents, setVoiceAgents] = useState<VoiceAgent[]>([]);
  const [workAgents, setWorkAgents] = useState<WorkAgent[]>([
    { id: 'w1', name: 'WhatsApp Bot', type: 'whatsapp', status: 'active', tasksCompleted: 143, lastRun: '2 min ago', description: 'Sends catalogs after every call' },
    { id: 'w2', name: 'Daily Report', type: 'report', status: 'idle', tasksCompleted: 31, lastRun: '8 hrs ago', description: 'Morning business summary' },
  ]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);

  // Arkle builder
  const [arkleChat, setArkleChat] = useState<{role: 'arkle'|'user'; text: string}[]>([
    { role: 'arkle', text: 'నమస్కారం! నేను Arkle. మీకు కొత్త AI employee build చేయాలా? Template select చేయమంటారా, లేదా మీరు describe చేస్తే నేను build చేస్తాను?' }
  ]);
  const [arkleInput, setArkleInput] = useState('');
  const [isArkleThinking, setIsArkleThinking] = useState(false);
  const arkleChatEndRef = useRef<HTMLDivElement>(null);

  // Voice wizard
  const [wizardStep, setWizardStep] = useState(1);
  const [agentName, setAgentName] = useState('Swara');
  const [agentRole, setAgentRole] = useState('sales_caller');
  const [agentLanguage, setAgentLanguage] = useState('tenglish');
  const [businessBrain, setBusinessBrain] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdAgent, setCreatedAgent] = useState<VoiceAgent | null>(null);

  useEffect(() => { loadAgents(); }, []);
  useEffect(() => { arkleChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [arkleChat]);

  const loadAgents = async () => {
    setIsLoadingAgents(true);
    try {
      const res = await fetch('/api/voice-agent');
      const data = await res.json();
      setVoiceAgents(data.agents || []);
    } catch (e) { console.error(e); }
    finally { setIsLoadingAgents(false); }
  };

  const sendArkleMessage = async () => {
    if (!arkleInput.trim()) return;
    const msg = arkleInput;
    setArkleInput('');
    setArkleChat(prev => [...prev, { role: 'user', text: msg }]);
    setIsArkleThinking(true);
    try {
      const res = await fetch('/api/arkle-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          context: 'workforce_builder',
          history: arkleChat.slice(-6).map(m => ({ role: m.role === 'arkle' ? 'assistant' : 'user', content: m.text })),
          systemHint: 'You are Arkle, an AI workforce builder. Help create AI voice/work agents for Indian businesses. Ask clarifying questions. When ready, describe the agent you will create.'
        })
      });
      const data = await res.json();
      setArkleChat(prev => [...prev, { role: 'arkle', text: data.reply || 'మీకు ఎలాంటి agent కావాలో వివరంగా చెప్పగలరా?' }]);
    } catch {
      setArkleChat(prev => [...prev, { role: 'arkle', text: 'Connection issue. Try again.' }]);
    }
    setIsArkleThinking(false);
  };

  const handleHireAgent = async () => {
    setIsCreating(true);
    try {
      const profileRes = await fetch('/api/voice-agent/profile');
      const profileData = await profileRes.json();
      const bizDesc = profileData.business
        ? `Business: ${profileData.business.name}. Industry: ${profileData.business.industryType}.`
        : '';

      const res = await fetch('/api/voice-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: profileData.business?.id,
          businessName: profileData.business?.name,
          ownerName: profileData.business?.ownerName,
          ownerPhone: profileData.business?.phone,
          agentName: agentName,
          role: agentRole,
          language: agentLanguage,
          businessDescription: businessBrain || bizDesc || `You are ${agentName}, a helpful AI agent.`,
        })
      });
      const data = await res.json();
      if (data.agent) {
        setCreatedAgent(data.agent);
        setWizardStep(4);
        loadAgents();
      }
    } catch (e) { console.error(e); }
    finally { setIsCreating(false); }
  };

  const totalCalls = voiceAgents.reduce((s, a) => s + (a.totalCalls || 0), 0);
  const totalTasks = workAgents.reduce((s, a) => s + a.tasksCompleted, 0);
  const activeCount = voiceAgents.filter(a => a.status === 'active').length + workAgents.filter(a => a.status === 'active').length;

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-6 space-y-6">

      {/* ── ARKLE BOSS HEADER ─────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-white/10 shadow-2xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(99,102,241,0.15),transparent_60%)]" />
        <div className="relative p-6 flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/50">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-black text-white">Arkle</h1>
              <span className="px-2 py-0.5 bg-indigo-500/30 border border-indigo-400/30 rounded-full text-[10px] font-bold text-indigo-300 uppercase tracking-wider">CEO Brain</span>
            </div>
            <p className="text-sm text-slate-400 mb-3">Your AI Chief of Staff. Trains, assigns, and monitors your entire AI workforce.</p>
            <div className="flex items-center gap-3 flex-wrap">
              <VapiButton className="text-xs px-4 py-2 rounded-xl" />
              <button onClick={() => setView('arkle_builder')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/10 transition-all flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Chat to Build Agent
              </button>
            </div>
          </div>
          <div className="hidden md:flex gap-6 flex-shrink-0">
            {[
              { label: 'Active Agents', value: activeCount },
              { label: 'Calls Today', value: totalCalls },
              { label: 'Tasks Done', value: totalTasks },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-[10px] text-slate-400 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── VOICE AGENTS ──────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Phone className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Voice Agents</h2>
              <p className="text-[11px] text-slate-500">Talk on phone for your business</p>
            </div>
          </div>
          <button onClick={() => { setView('create_voice'); setWizardStep(1); setCreatedAgent(null); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Hire Voice Agent
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoadingAgents ? (
            [...Array(3)].map((_, i) => <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse" />)
          ) : voiceAgents.length === 0 ? (
            VOICE_TEMPLATES.map(t => (
              <motion.button key={t.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                onClick={() => { setAgentName(t.name); setAgentRole(t.id); setView('create_voice'); setWizardStep(1); setCreatedAgent(null); }}
                className="group p-5 bg-white border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-2xl text-left transition-all"
              >
                <div className="text-3xl mb-3">{t.icon}</div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700">{t.name} — {t.label}</h3>
                <p className="text-[11px] text-slate-500 mt-1">{t.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Hire this agent <ChevronRight className="w-3 h-3" />
                </div>
              </motion.button>
            ))
          ) : (
            <>
              {voiceAgents.map(agent => (
                <motion.div key={agent.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => { setSelectedAgent(agent); setView('agent_detail'); }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-lg shadow-sm">
                      {agent.role === 'sales' || agent.role === 'sales_caller' ? '🎯' : agent.role === 'support' ? '💬' : agent.role === 'collections' ? '💰' : '📞'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300'}`} />
                      <span className="text-[10px] font-bold text-slate-500 capitalize">{agent.status}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{agent.name}</h3>
                  <p className="text-[11px] text-slate-500 capitalize mb-3">{agent.role.replace('_', ' ')} · {agent.language}</p>
                  <div className="flex gap-3 pt-3 border-t border-slate-100">
                    <div className="text-center">
                      <div className="text-sm font-black text-slate-900">{agent.totalCalls}</div>
                      <div className="text-[9px] text-slate-400">Calls</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-black text-slate-900">{agent.totalMinutes || 0}</div>
                      <div className="text-[9px] text-slate-400">Minutes</div>
                    </div>
                  </div>
                </motion.div>
              ))}
              <button onClick={() => { setView('create_voice'); setWizardStep(1); setCreatedAgent(null); }}
                className="p-5 border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all hover:bg-indigo-50/50 group"
              >
                <div className="w-10 h-10 bg-slate-100 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center transition-colors">
                  <Plus className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                </div>
                <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-600">Hire New Agent</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── WORK AGENTS ───────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Cpu className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Work Agents</h2>
              <p className="text-[11px] text-slate-500">Automate background tasks silently</p>
            </div>
          </div>
          <button onClick={() => setView('create_work')}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Work Agent
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {workAgents.map(agent => {
            const icons: Record<string, string> = { email: '📧', whatsapp: '💬', report: '📊', calendar: '🗓️', marketing: '📣' };
            return (
              <motion.div key={agent.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{icons[agent.type]}</span>
                  <span className={`w-2 h-2 rounded-full ${STATUS_DOT[agent.status]}`} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{agent.name}</h3>
                <p className="text-[10px] text-slate-500 mt-0.5 mb-3">{agent.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">{agent.tasksCompleted} tasks</span>
                  <span className="text-[10px] text-slate-400">{agent.lastRun}</span>
                </div>
              </motion.div>
            );
          })}
          {WORK_TEMPLATES.filter(t => !workAgents.find(w => w.type === t.type)).slice(0, 2).map(t => (
            <button key={t.id} onClick={() => setView('create_work')}
              className="p-4 border-2 border-dashed border-slate-200 hover:border-emerald-300 rounded-2xl flex flex-col items-start gap-2 transition-all hover:bg-emerald-50/50 group text-left"
            >
              <span className="text-2xl opacity-40 group-hover:opacity-100 transition-opacity">{t.icon}</span>
              <div>
                <h3 className="text-xs font-bold text-slate-500 group-hover:text-emerald-700">{t.name}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ════════════════════════ MODALS ════════════════════════════════ */}
      <AnimatePresence>

        {/* ARKLE CHAT BUILDER */}
        {view === 'arkle_builder' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
          >
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col" style={{ maxHeight: '80vh' }}
            >
              <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">Build Agent with Arkle</h3>
                  <p className="text-[11px] text-slate-500">Describe what agent you need — Arkle will create it</p>
                </div>
                <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-100 rounded-xl">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {arkleChat.map((msg, i) => (
                  <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'arkle' && (
                      <div className="w-7 h-7 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <Zap className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-slate-900 text-white rounded-tr-sm'
                        : 'bg-slate-100 text-slate-800 rounded-tl-sm border border-slate-200'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isArkleThinking && (
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 flex gap-1.5 items-center">
                      {[0, 150, 300].map(d => (
                        <div key={d} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={arkleChatEndRef} />
              </div>

              <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
                {['Sales agent Telugu lo', 'WhatsApp bot create', 'Daily report agent'].map(s => (
                  <button key={s} onClick={() => setArkleInput(s)}
                    className="flex-shrink-0 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-xs text-indigo-700 font-medium hover:bg-indigo-100 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="p-4 border-t border-slate-100">
                <form onSubmit={e => { e.preventDefault(); sendArkleMessage(); }} className="flex gap-2">
                  <input value={arkleInput} onChange={e => setArkleInput(e.target.value)}
                    placeholder="నాకు ఒక sales agent కావాలి..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                  <button type="submit" disabled={!arkleInput.trim() || isArkleThinking}
                    className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center disabled:opacity-40 hover:bg-indigo-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* CREATE WORK AGENT */}
        {view === 'create_work' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Add a Work Agent</h3>
                <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-100 rounded-xl">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <div className="p-5 grid grid-cols-2 gap-3">
                {WORK_TEMPLATES.map(t => (
                  <button key={t.id}
                    onClick={() => {
                      setWorkAgents(prev => [...prev, { id: `w${Date.now()}`, name: t.name, type: t.type, status: 'idle', tasksCompleted: 0, description: t.desc }]);
                      setView('dashboard');
                    }}
                    className="p-4 border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 rounded-xl text-left transition-all group"
                  >
                    <span className="text-2xl block mb-2">{t.icon}</span>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">{t.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-1">{t.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* CREATE VOICE AGENT WIZARD */}
        {view === 'create_voice' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
            >
              {/* Wizard header */}
              <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center justify-between z-10">
                <div>
                  <h3 className="font-bold text-slate-900">
                    {wizardStep === 1 ? 'Step 1: Role & Identity'
                     : wizardStep === 2 ? 'Step 2: Business Brain'
                     : wizardStep === 3 ? 'Step 3: Confirm & Hire'
                     : createdAgent ? `${createdAgent.name} is Hired! 🎉` : 'Creating Agent...'}
                  </h3>
                  <div className="flex gap-1 mt-2">
                    {[1,2,3].map(s => (
                      <div key={s} className={`h-1 rounded-full transition-all ${wizardStep >= s ? 'bg-indigo-600 w-8' : 'bg-slate-200 w-5'}`} />
                    ))}
                  </div>
                </div>
                <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-100 rounded-xl">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="p-6">
                {/* Step 1 */}
                {wizardStep === 1 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-3">
                      {VOICE_TEMPLATES.map(t => (
                        <button key={t.id}
                          onClick={() => { setAgentName(t.name); setAgentRole(t.id); }}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            agentRole === t.id ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-2xl block mb-2">{t.icon}</span>
                          <h4 className="text-sm font-bold text-slate-900">{t.label}</h4>
                          <p className="text-[10px] text-slate-500 mt-1">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Agent Name</label>
                        <input value={agentName} onChange={e => setAgentName(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Language</label>
                        <select value={agentLanguage} onChange={e => setAgentLanguage(e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500 bg-white"
                        >
                          <option value="tenglish">Telugu + English</option>
                          <option value="hindi">Hindi</option>
                          <option value="english">English</option>
                          <option value="tamil">Tamil</option>
                        </select>
                      </div>
                    </div>
                    <button onClick={() => setWizardStep(2)}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all"
                    >
                      Next: Business Brain →
                    </button>
                  </div>
                )}

                {/* Step 2 */}
                {wizardStep === 2 && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">Teach {agentName} about your business. More detail = smarter agent.</p>
                    <button
                      onClick={async () => {
                        const res = await fetch('/api/voice-agent/profile');
                        const d = await res.json();
                        if (d.business) {
                          const products = (d.products || []).map((p: any) => `- ${p.name}: ₹${p.salePrice}`).join('\n');
                          setBusinessBrain(`Business: ${d.business.name}\nIndustry: ${d.business.industryType}\nPhone: ${d.business.phone || 'N/A'}\n\nProducts:\n${products}`);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5" /> Auto-Import from BizDesk
                    </button>
                    <textarea value={businessBrain} onChange={e => setBusinessBrain(e.target.value)} rows={10}
                      placeholder="Business name, products, prices, rules, how to handle customers..."
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
                    />
                    <div className="flex gap-3">
                      <button onClick={() => setWizardStep(1)} className="py-3 px-6 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold">Back</button>
                      <button onClick={() => setWizardStep(3)} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold">Next: Review →</button>
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {wizardStep === 3 && (
                  <div className="space-y-5 text-center">
                    <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-lg">
                      {VOICE_TEMPLATES.find(t => t.id === agentRole)?.icon || '🤖'}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">{agentName}</h3>
                      <p className="text-slate-500 capitalize">{VOICE_TEMPLATES.find(t => t.id === agentRole)?.label} · {agentLanguage}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs font-mono text-slate-600 line-clamp-4">
                      {businessBrain || 'Default business context will be used.'}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setWizardStep(2)} className="py-3 px-6 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold">Back</button>
                      <button onClick={handleHireAgent} disabled={isCreating}
                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md"
                      >
                        {isCreating
                          ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Training {agentName}...</>
                          : <><Sparkles className="w-4 h-4" /> Train & Hire {agentName}</>
                        }
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4 */}
                {wizardStep === 4 && (
                  <div className="text-center space-y-5 py-4">
                    {isCreating ? (
                      <>
                        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-slate-500">Training {agentName}...</p>
                      </>
                    ) : createdAgent ? (
                      <>
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">{createdAgent.name} is Hired! 🎉</h3>
                        <p className="text-slate-500 text-sm">Your new AI {createdAgent.role} is live and ready.</p>
                        <button onClick={() => { setView('dashboard'); loadAgents(); }}
                          className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold"
                        >
                          View My Workforce →
                        </button>
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* AGENT DETAIL */}
        {view === 'agent_detail' && selectedAgent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
            >
              <div className="flex items-center gap-4 p-6 border-b border-slate-100">
                <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-md">
                  {selectedAgent.role === 'sales' || selectedAgent.role === 'sales_caller' ? '🎯' : selectedAgent.role === 'support' ? '💬' : selectedAgent.role === 'collections' ? '💰' : '📞'}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-slate-900 text-lg">{selectedAgent.name}</h3>
                  <p className="text-sm text-slate-500 capitalize">{selectedAgent.role.replace('_', ' ')} · {selectedAgent.language}</p>
                </div>
                <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-100 rounded-xl">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Total Calls', value: selectedAgent.totalCalls },
                    { label: 'Minutes', value: selectedAgent.totalMinutes || 0 },
                    { label: 'Status', value: selectedAgent.status },
                  ].map(s => (
                    <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center">
                      <div className="text-lg font-black text-slate-900 capitalize">{s.value}</div>
                      <div className="text-[10px] text-slate-400">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center">
                  <p className="text-sm font-bold text-indigo-900 mb-1">Test {selectedAgent.name} Now</p>
                  <p className="text-xs text-indigo-600 mb-3">Speak to this agent via your browser</p>
                  <VapiButton assistantId={selectedAgent.id} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
