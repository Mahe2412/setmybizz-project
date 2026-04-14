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
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (e: any) => {
        let transcript = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        setInput(transcript);
      };
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return alert('Voice not supported in this browser.');
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

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
        <div className="flex items-center gap-1 rounded-[20px] px-2 py-1.5 bg-slate-50 border border-slate-200 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask your global agent..."
            className="flex-1 bg-transparent text-[13px] text-slate-800 placeholder-slate-400 outline-none w-full px-3"
          />
          <div className="flex items-center gap-1">
            <button
              onClick={toggleVoice}
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${isRecording ? 'bg-black text-white shadow-md animate-pulse' : 'bg-transparent text-slate-400 hover:text-emerald-700 hover:bg-emerald-50'}`}
              title="Voice Mode"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.39-.9.88C16.69 14.54 14.54 16.5 12 16.5s-4.69-1.96-5.01-4.62c-.05-.49-.46-.88-.9-.88-.56 0-1.01.5-1.01 1.06 0 3.34 2.5 6.16 5.71 6.67V21c0 .55.45 1 1 1s1-.45 1-1v-2.28c3.21-.51 5.71-3.33 5.71-6.67 0-.56-.45-1.05-1.01-1.05z"/></svg>
            </button>
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all shadow-sm ${!input.trim() || loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-105 active:scale-95'}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a.993.993 0 00-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88a1 1 0 00-.87.99l.01 4.61c0 .71.73 1.2 1.39.92z"/></svg>
            </button>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 font-medium text-center mt-3">Trained exclusively for SetMyBizz Global Operations</p>
      </div>
    </div>
  );
}
