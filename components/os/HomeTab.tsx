'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: { label: string; action: string }[];
};

type Project = {
  id: string;
  title: string;
  lastMsg: string;
  date: string;
  status: 'active' | 'archived';
};

type ArkleFile = {
  id: string;
  name: string;
  type: 'PDF' | 'DOC' | 'FUNNEL' | 'IMAGE';
  date: string;
};

const NEURAL_COMMANDS = [
  "GST Compliance", "Sell on Amazon", "Sales Tax Setup", "Manage Bills", 
  "Financial Strategy", "Track Expenses", "TM & FSSAI Filing", 
  "Draft Agreements", "Legal Opinion", "CA/CS Support", "Marketing Plan", "Banking Sync"
];

const QUICK_TRAY_APPS = [
  { id: 'gmail', icon: 'mail', label: 'Gmail', count: 4, color: 'text-red-500' },
  { id: 'docs', icon: 'description', label: 'Documents', color: 'text-blue-500' },
  { id: 'drive', icon: 'add_to_drive', label: 'Drive', color: 'text-green-500' },
  { id: 'notes', icon: 'note_alt', label: 'Notes', color: 'text-amber-500' },
  { id: 'tasks', icon: 'task_alt', label: 'Tasks', count: 12, color: 'text-indigo-500' },
  { id: 'marketing', icon: 'campaign', label: 'Marketing', color: 'text-pink-500' },
  { id: 'schedules', icon: 'calendar_month', label: 'Schedules', color: 'text-sky-500' },
  { id: 'notifs', icon: 'notifications', label: 'Alerts', count: 2, color: 'text-orange-500' },
];

const ARKLE_SYSTEM_PROMPT = `You are Arkle, the World's First Super Human AI Co-Founder. 
Your goal is to build and manage the business. You are proactive, strategic, and highly technical.
Current Context: User is viewing their BizDesk Business Command Center.`;

const parseActions = (text: string) => {
  const actions: { label: string; action: string }[] = [];
  const clean = text.replace(/\[\[(.*?)\]\]/g, (_, p1) => {
    const [label, action] = p1.split('|');
    actions.push({ label: label.trim(), action: (action || label).trim() });
    return '';
  }).trim();
  return { clean, actions };
};

export default function HomeTab() {
  const [msgs, setMsgs]             = useState<Message[]>([]);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  
  const [projects, setProjects] = useState<Project[]>([
    { id: 'p1', title: 'TechNova Scaling Strategy', lastMsg: 'Market analysis complete', date: 'Mar 21', status: 'active' },
    { id: 'p2', title: 'Q4 GSTR Filings Plan', lastMsg: 'Tax optimization suggested', date: 'Mar 20', status: 'active' }
  ]);
  
  const [files, setFiles] = useState<ArkleFile[]>([
    { id: 'f1', name: 'Incorporation_Cert.pdf', type: 'PDF', date: 'Mar 10' },
    { id: 'f2', name: 'Sales_Funnel_v1.doc', type: 'FUNNEL', date: 'Mar 15' },
    { id: 'f3', name: 'Brand_Kit_Preview.png', type: 'IMAGE', date: 'Mar 18' }
  ]);
  
  const scrollRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLTextAreaElement>(null);
  const fileRef    = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const bName = "TechNova Solutions Pvt Ltd";

  /* ── Voice Synthesis (Neural) ── */
  const speak = (text: string, lang = 'en-IN') => {
    if (!isSpeechEnabled) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === lang && v.name.includes('Neural')) || voices[0];
    if (voice) utterance.voice = voice;
    utterance.rate = 1.0;
    utterance.onstart = () => { if (recognitionRef.current) recognitionRef.current.stop(); };
    utterance.onend = () => { if (isVoiceActive) startRecognition(); };
    window.speechSynthesis.speak(utterance);
  };

  const startRecognition = () => {
    if (recognitionRef.current) { try { recognitionRef.current.start(); } catch (e) {} }
  };

  const stopRecognition = () => {
    if (recognitionRef.current) { recognitionRef.current.stop(); }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';
        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) { transcript += event.results[i][0].transcript; }
          setInput(transcript);
          if (event.results[event.results.length - 1].isFinal) {
             const final = transcript;
             setTimeout(() => { if (final.length > 2) sendMessage(final); }, 1000);
          }
        };
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceMode = () => {
    if (isVoiceActive) { setIsVoiceActive(false); stopRecognition(); }
    else { setIsVoiceActive(true); setIsSpeechEnabled(true); startRecognition(); }
  };

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMsgs([{
        id: 'welcome-1',
        role: 'assistant',
        content: `Hi, I'm **Arkle**, your Co-founder and personal Business advisor. I can manage your entire business.\n\nI have studied **${bName}** completely. I know your CIN, GST records, MCA filings, Trademark status, and business goals.`,
        timestamp: new Date(),
      }]);
    }, 500);
    return () => clearTimeout(timer1);
  }, []);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, loading]);

  const sendMessage = useCallback(async (text = input) => {
    const q = text.trim();
    if (!q || loading) return;
    setInput('');
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: q, timestamp: new Date() };
    setMsgs(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const res = await fetch('/api/gemini', { method: 'POST', body: JSON.stringify({ prompt: `${ARKLE_SYSTEM_PROMPT}\nUser: ${q}\nArkle:` }) });
      const data = await res.json();
      const raw = data.text ?? 'Processed.';
      const { clean, actions } = parseActions(raw);
      setMsgs(prev => [...prev, { id: (Date.now()+1).toString(), role: 'assistant', content: clean, actions, timestamp: new Date() }]);
      speak(clean);
    } catch {
      setMsgs(prev => [...prev, { id: 'err', role: 'assistant', content: 'Network error.', timestamp: new Date() }]);
    }
    setLoading(false);
  }, [input, loading, msgs, isSpeechEnabled]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) sendMessage(`Analysing: ${file.name}`);
  };

  return (
    <div className="flex h-full bg-[#f8fafc] overflow-hidden">
      {/* Strategic Sidebar - Lite */}
      <motion.div 
        animate={{ width: isSidebarOpen ? 260 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="h-full bg-slate-50 border-r border-slate-200 overflow-hidden flex flex-col shrink-0 relative z-20"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
               <span className="material-symbols-outlined text-white text-[18px]">hub</span>
            </div>
            <div>
               <h1 className="text-slate-900 font-black text-[11px] uppercase tracking-widest leading-none">Arkle OS</h1>
               <p className="text-slate-400 text-[6px] font-black uppercase tracking-[0.2em] mt-1 italic">Neural Loop</p>
            </div>
          </div>

          <div className="space-y-2 mb-8">
             <button onClick={() => setMsgs([])} className="w-full flex items-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 p-3 rounded-xl transition-all shadow-sm">
               <span className="material-symbols-outlined text-slate-400 text-[14px]">add_comment</span>
               <span className="text-slate-900 font-bold text-[8px] uppercase tracking-widest">New Session</span>
             </button>
             <button onClick={() => setProjects([{ id: 'n', title: 'New Unit', lastMsg: '', date: 'Now', status: 'active' }, ...projects])} className="w-full flex items-center gap-2 bg-slate-900 hover:bg-slate-800 p-3 rounded-xl transition-all shadow-xl">
               <span className="material-symbols-outlined text-white/50 text-[14px]">create_new_folder</span>
               <span className="text-white font-bold text-[8px] uppercase tracking-widest">Create Unit</span>
             </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar pr-1">
             <div className="space-y-4">
                <header className="px-1"><h3 className="text-slate-400 text-[7px] font-black uppercase tracking-[0.3em]">Business Threads</h3></header>
                <div className="space-y-1.5">
                   {projects.map(p => (
                      <button key={p.id} className="w-full group p-3 rounded-xl bg-white border border-slate-100 hover:border-sky-500 hover:bg-sky-50 transition-all text-left shadow-sm">
                         <p className="text-slate-700 font-bold text-[9px] truncate transition-all leading-none">{p.title}</p>
                         <p className="text-slate-300 text-[6px] font-black uppercase mt-1.5 italic">{p.date}</p>
                      </button>
                   ))}
                </div>
             </div>
             <div className="space-y-4 pb-8">
                <header className="px-1"><h3 className="text-slate-400 text-[7px] font-black uppercase tracking-[0.3em]">Neural Assets</h3></header>
                <div className="space-y-1.5">
                   {files.map(f => (
                      <div key={f.id} className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-100 hover:border-amber-400 hover:bg-amber-50 cursor-pointer group transition-all">
                         <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-amber-500">
                            <span className="material-symbols-outlined text-[14px]">{f.type === 'PDF' ? 'picture_as_pdf' : 'description'}</span>
                         </div>
                         <div className="flex-1">
                            <p className="text-slate-600 font-bold text-[8px] truncate leading-none">{f.name}</p>
                            <p className="text-slate-300 text-[6px] font-black uppercase mt-1 italic">{f.type}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Main Console Center */}
      <div className="flex-1 flex flex-col min-w-0 relative bg-white">
        <div className="h-16 border-b border-slate-100 px-8 flex items-center justify-between bg-white shrink-0 sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
               <span className="material-symbols-outlined text-[20px]">{isSidebarOpen ? 'menu_open' : 'menu'}</span>
            </button>
            <h2 className="text-slate-900 font-black text-[10px] tracking-widest uppercase">{bName}</h2>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => setIsSpeechEnabled(!isSpeechEnabled)} className={`h-8 px-4 rounded-full flex items-center gap-2 transition-all ${isSpeechEnabled ? 'bg-sky-50 text-sky-600' : 'bg-slate-50 text-slate-400'}`}>
                <span className="material-symbols-outlined text-[16px]">{isSpeechEnabled ? 'volume_up' : 'volume_off'}</span>
                <span className="text-[8px] font-black uppercase tracking-widest">{isSpeechEnabled ? 'On' : 'Off'}</span>
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-12 py-12 space-y-10 no-scrollbar bg-slate-50/5">
          <AnimatePresence mode="popLayout">
            {msgs.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-white border border-slate-100 ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
                    <span className="material-symbols-outlined text-[18px]">{msg.role === 'user' ? 'person' : 'psychology'}</span>
                  </div>
                  <div className={`space-y-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`p-6 rounded-[28px] text-[12px] leading-relaxed font-medium shadow-sm border ${
                      msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border-slate-100'
                    }`}>
                      <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>') }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && <div className="text-slate-300 text-[8px] font-black uppercase tracking-[0.4em] ml-2 animate-pulse">Strategizing...</div>}
          <div ref={scrollRef} className="h-10" />
        </div>

        <div className="px-10 py-3 bg-white shrink-0 border-t border-slate-100">
           <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              {NEURAL_COMMANDS.map((cmd, i) => (
                 <button key={i} onClick={() => sendMessage(cmd)} className="px-4 py-2 rounded-full border border-slate-100 bg-white text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-all shrink-0">
                    {cmd}
                 </button>
              ))}
           </div>
        </div>

        <div className="p-8 pt-2 bg-transparent shrink-0">
          <div className="relative group max-w-4xl mx-auto">
            <div className="flex items-center gap-4 bg-white p-3 pl-8 rounded-full border border-slate-200 shadow-xl focus-within:border-slate-900 transition-all">
              <button onClick={() => fileRef.current?.click()} className="text-slate-300 hover:text-slate-900 shrink-0"><span className="material-symbols-outlined text-[24px]">add_circle</span></button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={isVoiceActive ? "Listening..." : "Message Arkle..."}
                className="flex-1 bg-transparent text-slate-800 text-[13px] font-semibold outline-none placeholder-slate-300 py-3 h-[50px] resize-none no-scrollbar"
                rows={1}
              />
              <button onClick={toggleVoiceMode} className={`w-10 h-10 rounded-full flex items-center justify-center ${isVoiceActive ? 'bg-sky-50 text-sky-600 animate-pulse' : 'text-slate-300 hover:text-slate-900'}`}><span className="material-symbols-outlined text-[22px]">graphic_eq</span></button>
              <button onClick={() => sendMessage()} disabled={!input.trim()} className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all"><span className="material-symbols-outlined text-[20px] font-bold">arrow_upward</span></button>
            </div>
            <input ref={fileRef} type="file" className="hidden" onChange={handleFileUpload} />
          </div>
        </div>
      </div>

      {/* QUICK TRAY - RIGHT SIDEBANNER (Lite Theme) */}
      <motion.div 
        className="h-full w-[70px] bg-slate-50 border-l border-slate-200 flex flex-col items-center py-8 shrink-0 relative z-30"
      >
        <div className="flex flex-col gap-6 items-center">
           {QUICK_TRAY_APPS.map(app => (
              <div key={app.id} className="relative group flex flex-col items-center">
                 <button 
                  className={`w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center transition-all hover:scale-110 active:scale-90 shadow-sm hover:shadow-md ${app.color}`}
                  title={app.label}
                 >
                    <span className="material-symbols-outlined text-[24px]">{app.icon}</span>
                    {app.count && (
                       <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-slate-50">
                          {app.count}
                       </span>
                    )}
                 </button>
                 <span className="absolute left-[-100px] bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl">
                    {app.label}
                 </span>
              </div>
           ))}

           <div className="w-8 h-[1px] bg-slate-200 mt-4 mb-4" />

           <button className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all hover:bg-slate-100">
              <span className="material-symbols-outlined text-[24px]">apps</span>
           </button>
        </div>

        <div className="mt-auto flex flex-col gap-4 items-center">
           <button className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center animate-bounce">
              <span className="material-symbols-outlined text-[20px]">flash_on</span>
           </button>
           <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
      </motion.div>
    </div>
  );
}
