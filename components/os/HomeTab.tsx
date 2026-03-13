'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ARKLE_SYSTEM_PROMPT, BIZ } from '@/lib/mockBizData';

// ── Types ──────────────────────────────────────────────────────────────────
type Role = 'user' | 'assistant';

interface ActionData {
  type: 'invoice' | 'file-gst' | 'reminder' | 'draft-form';
  [key: string]: string;
}

interface Message {
  id: string;
  role: Role;
  content: string;
  actions?: ActionData[];
  timestamp: Date;
  lang?: string;
  fileRef?: string;
}

interface Project {
  id: string;
  title: string;
  lastMsg: string;
  msgCount: number;
}

// ── Parse operator action tags from Arkle response ──────────────────────────
function parseActions(text: string): { clean: string; actions: ActionData[] } {
  const actions: ActionData[] = [];
  const clean = text.replace(/\[\[ACTION:([^\]]+)\]\]/g, (_, params) => {
    const obj: Record<string, string> = {};
    params.split(',').forEach((p: string) => {
      const [k, ...v] = p.split('=');
      obj[k.trim()] = v.join('=').trim();
    });
    actions.push(obj as ActionData);
    return '';
  }).trim();
  return { clean, actions };
}

// ── Render markdown-lite ───────────────────────────────────────────────────
function renderMd(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/⚠️|🔴|🔵|✅|📅|💡|🚀|🌍|💰|📊/g, m => `<span>${m}</span>`)
    .replace(/\n/g, '<br/>');
}

// ── Quick Suggestion Pills ─────────────────────────────────────────────────
const SUGGESTIONS = [
  { icon: '🧾', label: 'File my GSTR-1',       sub: 'Feb 2026 — Overdue!' },
  { icon: '🇺🇸', label: 'Set up US LLC',         sub: 'Delaware Incorporation' },
  { icon: '📊', label: 'Business health report', sub: 'Full Analysis' },
  { icon: '💰', label: 'Create an invoice',      sub: 'Operator Task' },
  { icon: '🌍', label: 'How to export to UK?',  sub: 'Global Expansion' },
  { icon: '📅', label: 'What is due this month?', sub: 'Compliance Check' },
];

const LANG_OPTIONS = ['English', 'Telugu', 'Hindi', 'Tamil', 'Kannada', 'Marathi'];

const DEFAULT_PROJECTS: Project[] = [
  { id: 'p1', title: 'US Expansion Plan', lastMsg: '2 days ago', msgCount: 12 },
  { id: 'p2', title: 'GST Filing Feb 2026', lastMsg: 'Yesterday', msgCount: 5 },
  { id: 'p3', title: 'Trademark Strategy', lastMsg: '3h ago', msgCount: 8 },
];

export default function HomeTab() {
  const [msgs, setMsgs]             = useState<Message[]>([]);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [projects, setProjects]     = useState<Project[]>(DEFAULT_PROJECTS);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [lang, setLang]             = useState('English');
  const [showLang, setShowLang]     = useState(false);
  const [executedActions, setExecutedActions] = useState<Set<string>>(new Set());
  const scrollRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLTextAreaElement>(null);
  const fileRef    = useRef<HTMLInputElement>(null);

  // Welcome message
  useEffect(() => {
    setMsgs([{
      id: 'welcome',
      role: 'assistant',
      content: `Hello Mahendra! I am **Arkle** — your AI Co-Founder. 🤝\n\nI have studied **${BIZ.name}** completely. I know your CIN, GST records, MCA filings, Trademark status, and business goals.\n\n**⚠️ 2 urgent items right now:**\n- **GSTR-1 (Feb)** is OVERDUE — penalty ₹50/day accumulating\n- **Advance Tax Q4** due Mar 15\n\nTell me what to do. I can file, plan, analyse, or execute any business task.`,
      timestamp: new Date(),
      actions: [],
    }]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, loading]);

  const sendMessage = useCallback(async (text = input) => {
    const q = text.trim();
    if (!q || loading) return;
    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: q,
      timestamp: new Date(),
    };
    setMsgs(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = msgs
        .slice(-6) // last 3 exchanges for context
        .map(m => `${m.role === 'user' ? 'Founder' : 'Arkle'}: ${m.content}`)
        .join('\n\n');

      const prompt = `${ARKLE_SYSTEM_PROMPT}\n\n## CONVERSATION HISTORY\n${history}\n\n## CURRENT MESSAGE\nFounder: ${q}\n\nArkle:`;

      const res  = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const raw  = data.text ?? 'I could not process that. Please try again.';
      const { clean, actions } = parseActions(raw);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: clean,
        actions,
        timestamp: new Date(),
      };
      setMsgs(prev => [...prev, aiMsg]);
    } catch {
      setMsgs(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Network error. Please check your connection and try again.',
        timestamp: new Date(),
      }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  }, [input, loading, msgs]);

  const newChat = () => {
    const title = `Session ${projects.length + 1}`;
    setProjects(prev => [{ id: Date.now().toString(), title, lastMsg: 'Just now', msgCount: 0 }, ...prev]);
    setMsgs([{
      id: 'welcome-new',
      role: 'assistant',
      content: `New session started. What business task shall we work on today?`,
      timestamp: new Date(),
    }]);
    setActiveProject(null);
  };

  const executeAction = (actionId: string, action: ActionData) => {
    setExecutedActions(prev => new Set([...prev, actionId]));
    const confirms: Record<string, string> = {
      'invoice'   : `✅ Invoice drafted for ${action.client} — ${action.amount}. Sending now via email.`,
      'file-gst'  : `✅ Initiating GSTR-1 filing for ${action.period}. Logging in to GST portal...`,
      'reminder'  : `✅ Reminder set: "${action.task}" on ${action.date}. You will get notified.`,
      'draft-form': `✅ Form ${action.form} drafted. Download it to review and sign.`,
    };
    const msg: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: confirms[action.type] ?? '✅ Task executed successfully.',
      timestamp: new Date(),
    };
    setMsgs(prev => [...prev, msg]);
  };

  return (
    <div className="flex h-[calc(100vh-98px)] gap-4 font-[DM_Sans,sans-serif]">
      <style>{`
        .no-scrollbar::-webkit-scrollbar{display:none}
        .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
        .msg-enter{animation:msgIn .3s ease}
        @keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* ── LEFT SIDEBAR: Projects ── */}
      <aside className="w-60 hidden xl:flex flex-col gap-3 flex-shrink-0">
        {/* New Chat */}
        <button
          onClick={newChat}
          className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-blue-300 text-blue-600 font-black text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
        >
          <span className="text-lg">+</span> New Chat
        </button>

        {/* Projects list */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Projects & History</p>
          </div>
          <div className="overflow-y-auto no-scrollbar">
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => setActiveProject(p.id)}
                className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-all ${activeProject === p.id ? 'bg-blue-50' : ''}`}
              >
                <p className={`text-xs font-bold truncate ${activeProject === p.id ? 'text-blue-600' : 'text-slate-700'}`}>{p.title}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-[10px] text-slate-400">{p.lastMsg}</p>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">{p.msgCount}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Memory status */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-4 text-white shadow-lg shadow-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Memory Active</p>
          </div>
          <p className="text-sm font-bold leading-tight">Synced with {BIZ.name}</p>
          <p className="text-[10px] text-blue-200 mt-1">GST · MCA · Trademark · Directors · Compliance</p>
        </div>
      </aside>

      {/* ── MAIN CHAT AREA ── */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">

        {/* Chat Header */}
        <div className="px-5 py-3 bg-white border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-200">A</div>
            <div>
              <h2 className="font-black text-slate-900 text-sm leading-none">Arkle AI Co-Founder</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-green-600">Business Context Loaded · Operator Layer Active</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLang(!showLang)}
                className="flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all uppercase tracking-wide"
              >
                🌐 {lang} <span className="text-slate-400">▼</span>
              </button>
              {showLang && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden min-w-[130px]">
                  {LANG_OPTIONS.map(l => (
                    <button key={l} onClick={() => { setLang(l); setShowLang(false); }}
                      className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-blue-50 ${lang === l ? 'text-blue-600 bg-blue-50' : 'text-slate-700'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={newChat} className="text-[10px] font-black px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-1">
              + New
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 no-scrollbar">
          {msgs.map((m) => (
            <div key={m.id} className={`flex gap-3 msg-enter ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex-shrink-0 flex items-center justify-center font-black text-xs shadow-sm mt-0.5">A</div>
              )}
              <div className={`flex flex-col gap-2 max-w-[82%]`}>
                {/* Message bubble */}
                <div
                  className={`px-5 py-4 rounded-2xl text-[14px] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white ml-auto'
                      : 'bg-slate-50 text-slate-800 border border-slate-200'
                  }`}
                  dangerouslySetInnerHTML={{ __html: renderMd(m.content) }}
                />

                {/* Operator Action Cards */}
                {m.actions && m.actions.length > 0 && m.actions.map((action, i) => {
                  const actionId = `${m.id}-${i}`;
                  const done = executedActions.has(actionId);
                  const cfg: Record<string, { icon: string; title: string; color: string }> = {
                    'invoice'   : { icon: '🧾', title: 'Invoice Ready to Send',      color: '#2563eb' },
                    'file-gst'  : { icon: '📋', title: 'GST Filing Ready to Submit', color: '#16a34a' },
                    'reminder'  : { icon: '📅', title: 'Reminder Set',               color: '#7c3aed' },
                    'draft-form': { icon: '📄', title: 'Form Draft Ready',            color: '#d97706' },
                  };
                  const c = cfg[action.type] ?? { icon: '⚡', title: 'Task Ready', color: '#2563eb' };
                  return (
                    <div
                      key={i}
                      className={`rounded-2xl border-2 p-4 transition-all ${done ? 'opacity-60' : ''}`}
                      style={{ borderColor: c.color + '40', background: c.color + '08' }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{c.icon}</span>
                        <div className="flex-1">
                          <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: c.color }}>Operator Action</p>
                          <p className="font-black text-slate-900 text-sm">{c.title}</p>
                          <p className="text-xs text-slate-500">
                            {action.client && `Client: ${action.client}`}
                            {action.amount && ` · ${action.amount}`}
                            {action.period && `Period: ${action.period}`}
                            {action.task   && action.task}
                            {action.form   && `Form: ${action.form}`}
                          </p>
                        </div>
                      </div>
                      {done ? (
                        <div className="py-2 text-center text-xs font-black text-green-600">✅ Task Executed</div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => executeAction(actionId, action)}
                            className="flex-1 py-2.5 rounded-xl text-white text-xs font-black transition-all hover:opacity-90 active:scale-95"
                            style={{ background: c.color }}
                          >
                            EXECUTE NOW →
                          </button>
                          <button className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-black hover:bg-slate-50">
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Timestamp */}
                <p className={`text-[10px] text-slate-400 ${m.role === 'user' ? 'text-right' : ''}`}>
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex-shrink-0 flex items-center justify-center font-black text-xs shadow-sm mt-0.5">MK</div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3 msg-enter">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex-shrink-0 flex items-center justify-center font-black text-xs animate-pulse">A</div>
              <div className="px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.18}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Quick Suggestions (shown at start) */}
        {msgs.length <= 1 && (
          <div className="px-5 pb-3 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s.label)}
                className="flex-shrink-0 bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md rounded-2xl p-3 text-left transition-all group min-w-[150px]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{s.icon}</span>
                  <p className="text-xs font-black text-slate-800 leading-tight group-hover:text-blue-700">{s.label}</p>
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{s.sub}</p>
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 pt-2 bg-white border-t border-slate-100 flex-shrink-0">
          <div className="relative bg-slate-50 border border-slate-200 rounded-2xl focus-within:border-blue-400 focus-within:shadow-lg focus-within:shadow-blue-100 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={`Ask Arkle in ${lang}... "File my GST", "Create invoice", "Set up US LLC", "Marketing strategy"...`}
              className="w-full bg-transparent outline-none text-[14px] text-slate-800 placeholder-slate-400 resize-none px-5 py-4 pr-32 min-h-[60px] max-h-40"
              rows={1}
            />
            {/* Right buttons */}
            <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
              <input ref={fileRef} type="file" className="hidden" accept="image/*,application/pdf" />
              <button
                onClick={() => fileRef.current?.click()}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all text-lg"
                title="Attach file"
              >
                📎
              </button>
              <button
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all text-lg"
                title="Voice input"
              >
                🎙️
              </button>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between mt-2.5 px-1">
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" />Operator Layer Active</span>
              <span>⚡ Gemini 1.5 Flash</span>
              <span>🔒 Secure</span>
            </div>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">↵ Send · Shift+↵ New Line</span>
          </div>
        </div>
      </div>
    </div>
  );
}
