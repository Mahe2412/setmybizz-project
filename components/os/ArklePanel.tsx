'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ARKLE_SYSTEM_PROMPT } from '@/lib/mockBizData';

type Msg = { role: 'user' | 'ai'; text: string };

const ARKLE_GREETING = `Hi! I'm **Arkle** — your AI Business Advisor. 🤝

I've loaded your company profile for **TechNova Solutions Pvt Ltd**.

⚠️ **2 urgent actions this week:**
• GSTR-1 (Feb) is **OVERDUE** — file today
• Advance Tax Q4 due **Mar 15**

What would you like to work on?`;

function formatText(t: string) {
  return t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
}

export default function ArklePanel({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([{ role: 'ai', text: ARKLE_GREETING }]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setLoading(true);
    try {
      const res  = await fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: `${ARKLE_SYSTEM_PROMPT}\n\nUser: ${q}\n\nArkle:` }) });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.text ?? 'Something went wrong. Try again.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Network error. Please check your connection.' }]);
    }
    setLoading(false);
  };

  const quickPrompts = ['What is due this week?', 'How to file GSTR-1?', 'Explain advance tax', 'Trademark status?'];

  return (
    <div className="flex flex-col h-full bg-white" style={{ borderLeft: '1px solid #e2e8f0' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 bg-blue-600">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm bg-white/20 text-white">A</div>
          <div>
            <p className="text-sm font-black text-white leading-none">Arkle</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
              <span className="text-[9px] text-blue-100 font-bold">AI Business Advisor • Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider">Gemini AI</span>
          {onClose && (
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all">✕</button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 bg-slate-50" style={{ scrollbarWidth: 'thin' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black mr-2 flex-shrink-0 mt-1 bg-blue-600 text-white">A</div>
            )}
            <div
              className="max-w-[82%] px-3 py-2.5 rounded-2xl text-[12px] leading-relaxed"
              style={
                msg.role === 'user'
                  ? { background: '#2563eb', color: 'white', borderBottomRightRadius: 4 }
                  : { background: 'white', color: '#1e293b', borderBottomLeftRadius: 4, border: '1px solid #e2e8f0' }
              }
              dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
            />
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black bg-blue-600 text-white">A</div>
            <div className="px-3 py-2.5 rounded-2xl bg-white border border-slate-200" style={{ borderBottomLeftRadius: 4 }}>
              <div className="flex gap-1">
                {[0, 1, 2].map(d => (
                  <div key={d} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="px-3 pb-2 bg-slate-50 flex flex-wrap gap-1.5">
          {quickPrompts.map(q => (
            <button
              key={q}
              onClick={() => setInput(q)}
              className="text-[10px] font-bold px-2.5 py-1.5 rounded-full transition-all hover:bg-blue-100 bg-white border border-blue-200 text-blue-600"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-3 pb-3 pt-2 flex-shrink-0 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 bg-slate-50 border border-slate-200">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask Arkle anything..."
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-30 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>
          </button>
        </div>
        <p className="text-[9px] text-slate-400 text-center mt-1.5">Arkle knows your company profile • Powered by Gemini AI</p>
      </div>
    </div>
  );
}
