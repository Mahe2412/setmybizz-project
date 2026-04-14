'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArkleVoiceOrb from './ArkleVoiceOrb';
import { useBizStore } from '@/lib/useBizStore';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const ARCADE_SLIDES = [
  { id: 1, title: "Startup India: Premier Schemes", desc: "Unlock ₹20Cr+ in seed funding and mentorship from NITI Aayog experts." },
  { id: 2, title: "Neobanking for Tech Founders", desc: "Zero-fee international transactions and instant credit lines." }
];

const QUICK_TRAY_APPS = [
  { id: 'gmail', icon: 'mail', label: 'Gmail', count: 4, color: 'text-red-500' },
  { id: 'docs', icon: 'description', label: 'Documents', color: 'text-blue-500' },
  { id: 'drive', icon: 'add_to_drive', label: 'Drive', color: 'text-green-500' },
  { id: 'tasks', icon: 'task_alt', label: 'Tasks', count: 12, color: 'text-indigo-500' },
  { id: 'whatsapp', icon: 'chat', label: 'WhatsApp AI', color: 'text-emerald-500' },
];

export default function HomeTab({ data }: { data: any }) {
  const { whiteboardOpen: isWhiteboardOpen, setWhiteboardOpen: setIsWhiteboardOpen } = useBizStore();
  const [activeChatTab, setActiveChatTab] = useState<'ask' | 'agents'>('ask');
  const [msgs, setMsgs] = useState<Message[]>([
    { id: 'msg-init', role: 'assistant', content: `👋 Hello Mahendra! How shall we begin today?`, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLiveVoice, setIsLiveVoice] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const bizBoardRef = useRef<HTMLDivElement>(null);

  const sendMessage = useCallback(async (text = input) => {
    const q = text.trim();
    if (!q || loading) return;
    setInput('');
    setMsgs(prev => [...prev, { id: Date.now().toString(), role: 'user', content: q, timestamp: new Date() }]);
    setLoading(true);
    try {
      const resp = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q, messages: msgs.map(m => ({ role: m.role, content: m.content })) })
      });
      const resData = await resp.json();
      setMsgs(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: resData.text, timestamp: new Date() }]);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [input, loading, msgs]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  return (
    <div className="flex h-full bg-[#f8fafc] overflow-y-auto relative no-scrollbar">
      {/* SIDEBAR */}
      <motion.div animate={{ width: isSidebarOpen ? 240 : 0 }} className="h-full bg-slate-50 border-r border-slate-200 overflow-hidden flex flex-col shrink-0 z-20">
        <div className="p-6 h-full flex flex-col">
          <div className="flex flex-col gap-0 px-2 mb-10">
            <h1 className="text-slate-900 font-black text-[22px] tracking-tight leading-none">Arkle <span className="text-blue-600">Brain</span></h1>
            <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest mt-1.5 leading-tight">BizOS <br/> <span className="text-[7px] opacity-60">World's First Business Operating System</span></p>
          </div>

          <div className="space-y-3 mb-10">
             <button onClick={() => setMsgs([])} className="w-full flex items-center gap-3 bg-white hover:bg-slate-100 border border-slate-200 p-4 rounded-xl transition-all shadow-sm">
               <span className="material-symbols-outlined text-slate-400 text-[18px]">add_comment</span>
               <span className="text-slate-900 font-bold text-[10px] uppercase tracking-widest">New Session</span>
             </button>
             <button onClick={() => bizBoardRef.current?.scrollIntoView({ behavior: 'smooth' })} className="w-full flex items-center gap-3 bg-slate-900 hover:bg-slate-800 p-4 rounded-xl transition-all shadow-xl">
               <span className="material-symbols-outlined text-white/50 text-[18px]">campaign</span>
               <span className="text-white font-bold text-[10px] uppercase tracking-widest">Biz Spotlight</span>
             </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-12 no-scrollbar pr-1 px-1">
             <div className="space-y-5">
                <header className="px-1 flex items-center justify-between"><h3 className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">Business Threads</h3><span className="material-symbols-outlined text-slate-300 text-[15px]">folder_open</span></header>
                <div className="space-y-2">
                   {['TechNova Scaling', 'Q4 GSTR Plan'].map((p, i) => (
                      <button key={i} className="w-full p-3 rounded-xl bg-white border border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left shadow-sm group">
                         <p className="text-slate-700 font-bold text-[11px] truncate leading-none">{p}</p>
                         <p className="text-slate-300 text-[8px] font-black uppercase mt-1.5 italic group-hover:text-blue-400">Active Thread</p>
                      </button>
                   ))}
                </div>
             </div>
             <div className="space-y-5">
                <header className="px-1 flex items-center justify-between"><h3 className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">Knowledge Vault</h3><span className="material-symbols-outlined text-slate-300 text-[15px]">description</span></header>
                <div className="space-y-2">
                   {['Incorporation_Cert.pdf', 'Sales_Performance.doc'].map((f, i) => (
                      <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition-all text-left">
                         <span className="material-symbols-outlined text-slate-400 text-[18px]">article</span>
                         <span className="text-slate-600 font-medium text-[10px] truncate">{f}</span>
                      </button>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-y-auto no-scrollbar scroll-smooth">
        <div className="h-16 border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-50 bg-white">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="material-symbols-outlined text-slate-400">menu</button>
          <div className="flex-1" />
        </div>

        <div className="flex-1 px-4 md:px-10 py-12 md:py-20 flex flex-col items-center">
          {/* LOGO */}
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="w-16 h-16 bg-linear-to-br from-indigo-500 via-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(99,102,241,0.4)] mb-8 relative">
              <span className="material-symbols-rounded text-white text-[32px]">auto_awesome</span>
            </div>
            <h3 className="text-[40px] md:text-[54px] font-black text-slate-900 tracking-tighter leading-none mb-4">
               Arkle <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Brain</span>
            </h3>
            <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.4em]">Autonomous AI Business OS</p>
          </div>

          {/* CHAT INTERFACE */}
          <div className="max-w-[800px] mx-auto w-full">
            <div className="flex items-center ml-10 overflow-hidden">
               <button 
                  onClick={() => setActiveChatTab('ask')}
                  className={`px-6 py-2 border border-slate-200 border-b-0 rounded-t-[14px] flex items-center gap-2.5 relative z-10 transition-all ${activeChatTab === 'ask' ? 'bg-linear-to-b from-white to-slate-50 text-slate-900 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] before:absolute before:inset-0 before:bg-linear-to-b before:from-white/40 before:to-transparent before:rounded-t-[14px]' : 'bg-transparent text-slate-400 border-transparent hover:text-slate-600'}`}
               >
                  <svg className={`w-3 h-3 ${activeChatTab === 'ask' ? 'text-blue-500' : 'text-slate-400'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
                  </svg>
                  <span className="text-[12.5px] font-black uppercase tracking-wider relative z-10">Ask Arkle</span>
               </button>
               <button 
                  onClick={() => setActiveChatTab('agents')}
                  className={`px-6 py-2 border border-slate-200 border-b-0 rounded-t-[14px] flex items-center gap-2.5 transition-all ${activeChatTab === 'agents' ? 'bg-linear-to-b from-white to-slate-50 text-slate-900 shadow-[0_-5px_15px_rgba(0,0,0,0.02)] before:absolute before:inset-0 before:bg-linear-to-b before:from-white/40 before:to-transparent before:rounded-t-[14px]' : 'bg-transparent text-slate-400 border-transparent hover:text-slate-600'}`}
               >
                  <svg className={`w-3 h-3 ${activeChatTab === 'agents' ? 'text-blue-500' : 'text-slate-400'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15,9H9V11H15V9M12,13H7V15H12V13M21,6V15C21,16.1 20.1,17 19,17H5C3.9,17 3,16.1 3,15V6C3,4.9 3.9,4 5,4H19C20.1,4 21,4.9 21,6M19,6H5V15H19V6Z" />
                  </svg>
                  <span className="text-[12.5px] font-black uppercase tracking-wider relative z-10">Agents</span>
               </button>
            </div>

            {/* COLORFUL GRADIENT BORDER CONTAINER */}
            <div className="relative p-[2px] rounded-[36px] rounded-tl-none bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-[0_25px_80px_-20px_rgba(79,70,229,0.3)]">
               <div className="bg-white rounded-[34px] rounded-tl-none overflow-hidden flex flex-col min-h-[170px] transition-all ease-out duration-500">
                  <textarea 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    className="w-full bg-transparent border-none outline-none focus:ring-0 text-slate-800 text-[18px] md:text-[22px] font-medium px-10 pt-10 pb-6 resize-none no-scrollbar placeholder:text-slate-300 placeholder:font-light" 
                    placeholder="Hi I'm Arkle Your co founder and Business Advisor" 
                  />
                  
                  <div className="flex items-center justify-between px-8 pb-6 mt-auto">
                     <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-white hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm">
                           <span className="material-symbols-rounded text-[24px]">add</span>
                        </button>
                        <button className="px-5 h-10 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 text-[10px] font-black uppercase text-slate-900 hover:border-indigo-400 transition-all shadow-sm">
                           <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" /> Arkle Brain <span className="material-symbols-rounded text-[16px] text-slate-400">expand_more</span>
                        </button>
                     </div>
                     <button onClick={() => sendMessage()} className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all">
                         <span className="material-symbols-rounded text-[24px]">arrow_forward</span>
                     </button>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 pb-12">
               {['Create Task', 'Brainstorm', 'Set Reminder', 'Search OS'].map((label, i) => (
                  <button key={i} className="flex flex-col items-center p-4 bg-white border border-slate-100 hover:border-blue-300 hover:shadow-xl transition-all rounded-[22px] group">
                     <span className="material-symbols-rounded text-slate-300 group-hover:text-blue-500 mb-2 text-[22px] transition-all group-hover:scale-110">{['check_circle','psychology','notifications_active','search'][i]}</span>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-none">{label}</p>
                  </button>
               ))}
            </div>

            <div className="w-full max-w-4xl mx-auto space-y-6">
              <AnimatePresence mode="popLayout">
                {msgs.map(m => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-6 rounded-[28px] text-[16px] md:text-[18px] leading-relaxed max-w-[90%] font-medium shadow-xl border ${m.role === 'user' ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-100'}`}>{m.content}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={scrollRef} />
            </div>
          </div>
        </div>

        {/* WHITEBOARD & BIZBOARD (Clean/Minimal) */}
        <div className="bg-white border-t border-slate-100">
           <button onClick={() => setIsWhiteboardOpen(!isWhiteboardOpen)} className="w-full p-6 flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
              <span>Neural Pulse • Global Operations</span>
              <span className="material-symbols-outlined">{isWhiteboardOpen ? 'expand_less' : 'expand_more'}</span>
           </button>
        </div>

        <div ref={bizBoardRef} className="min-h-[400px] py-12 px-8 bg-slate-50 border-t border-slate-200 text-center">
            <h3 className="text-slate-900 font-black text-[20px] uppercase mb-8 tracking-widest">BizBoard Spotlight</h3>
            <div className="max-w-4xl mx-auto bg-slate-900 rounded-[40px] p-12 text-white">
                <h2 className="text-[32px] md:text-[48px] font-black leading-tight mb-4">{ARCADE_SLIDES[currentSlide].title}</h2>
                <p className="text-[16px] opacity-60 mb-8">{ARCADE_SLIDES[currentSlide].desc}</p>
                <button className="px-10 py-4 bg-white text-slate-900 rounded-[20px] font-black uppercase text-[12px]">Access Intelligence</button>
            </div>
        </div>
      </div>

      {/* QUICK TRAY */}
      <div className="w-[66px] bg-slate-50 border-l border-slate-200 flex flex-col items-center py-6 z-40">
        <div className="flex flex-col gap-4">
          {QUICK_TRAY_APPS.map(app => (
            <button key={app.id} className={`w-12 h-12 rounded-[16px] bg-white border border-slate-200 flex items-center justify-center shadow-md transition-all hover:scale-110 ${app.color}`}>
              <span className="material-symbols-outlined text-[20px]">{app.icon}</span>
            </button>
          ))}
        </div>
      </div>
      
      <ArkleVoiceOrb isOpen={isLiveVoice} onClose={() => setIsLiveVoice(false)} isListening={true} msgs={msgs} />
    </div>
  );
}
