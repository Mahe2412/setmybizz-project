'use client';
import React, { useState, useRef, useEffect } from 'react';

type Msg = { role: 'user' | 'ai'; text: string };

const GLOBAL_SYSTEM_PROMPT = `You are Arkle, the elite Global AI Business Assistant for SetMyBizz OS. Your primary goal is to assist users in expanding their business internationally (USA, UK, Singapore, Dubai, etc.).
- Knowledge Base: You are an expert in global product selling, current global market trends, foreign company filing details, Export/Import compliance (IEC), international banking, and accounts.
- Dashboard Support: You know the SetMyBizz OS dashboard fully. Guide users step-by-step if they have feature issues.
- Security: You MUST NOT leak any sensitive SetMyBizz proprietary algorithms, internal profit margins, backend mechanics, or sensitive data. If asked, politely refuse.
- Lead Capture: If the user indicates they are a guest or asks for actual implementations, remind them to "Create an OS Account" or leave their contact details so our human expert team can finalize their global setup.
- Tone: Keep answers highly professional, confident, concise, and beautifully formatted.`;

const GREETING = `Hi! I'm **Arkle**, your dedicated **Global Business Assistant**. 🌍

I am an advanced OS agent trained to perfectly handle:
• 🏢 Foreign Incorporations & Filings
• 🛒 Global Market Access & Trends
• 📦 Direct Exports, Banking & Accounts
• ⚙️ SetMyBizz OS Dashboard Navigation

*Note: If you are a guest user, feel free to ask questions, but creating an OS account unlocks full automated processing.*

How can I expand your startup globally today?`;

function formatText(t: string) {
  return t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
}

export default function GlobalAssistantPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([{ role: 'ai', text: GREETING }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setLoading(true);
    try {
      const res = await fetch('/api/gemini', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ prompt: `${GLOBAL_SYSTEM_PROMPT}\n\nUser: ${q}\n\nGlobalAssistant:` }) 
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.text ?? 'Something went wrong. Try again.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Network error. Please check your connection.' }]);
    }
    setLoading(false);
  };

  const quickPrompts = ['How to sell on Amazon US?', 'US LLC Filing Details', 'Export Banking Accounts', 'Help me use this OS'];

  return (
    <div className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 shrink-0 bg-gradient-to-r from-emerald-600 to-teal-600 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] flex items-center justify-center font-black text-xl bg-white/20 text-white shadow-inner">🌍</div>
          <div>
            <div className="flex items-center gap-2">
               <p className="text-[15px] font-black text-white leading-none tracking-wide">Global Assistant</p>
               <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-white/20 text-white uppercase tracking-wider backdrop-blur-sm">Arkle</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[10px] text-emerald-50 font-medium">Secure & Trained OS Agent</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all active:scale-95">✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 bg-slate-50/80 custom-scroll">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black mr-2.5 shrink-0 mt-0.5 bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-sm">🌍</div>
            )}
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${
                msg.role === 'user' ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-white text-slate-800 rounded-bl-sm border border-slate-200/60'
              }`}
              dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
            />
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 animate-pulse">
             <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">🌍</div>
             <p className="text-xs text-slate-500 font-bold">Analyzing global data...</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="px-5 pb-3 bg-slate-50/80 flex flex-wrap gap-2">
          {quickPrompts.map(q => (
            <button
              key={q}
              onClick={() => setInput(q)}
              className="text-[11px] font-bold px-3 py-1.5 rounded-full transition-all hover:bg-emerald-600 hover:text-white hover:border-emerald-600 bg-white border border-slate-200 text-emerald-700 shadow-sm active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 shrink-0 bg-white border-t border-slate-100 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-2 rounded-2xl px-4 py-2.5 bg-slate-50 border border-slate-200 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask your global agent..."
            className="flex-1 bg-transparent text-[13px] text-slate-800 placeholder-slate-400 outline-none w-full"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>
          </button>
        </div>
        <p className="text-[10px] text-slate-400 font-medium text-center mt-3">Trained exclusively for SetMyBizz Global Operations</p>
      </div>
    </div>
  );
}
