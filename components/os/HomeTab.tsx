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
  { id: 'mail', icon: 'mail', label: 'Gmail', count: 4, color: 'text-red-500' },
  { id: 'docs', icon: 'description', label: 'Documents', color: 'text-blue-500' },
  { id: 'integrations', icon: 'grid_view', label: 'Apps', color: 'text-green-500' },
  { id: 'notes', icon: 'edit_note', label: 'Notes', color: 'text-orange-500' },
  { id: 'tasks', icon: 'check_circle', label: 'Tasks', count: 12, color: 'text-indigo-600' },
  { id: 'marketing', icon: 'campaign', label: 'Marketing', color: 'text-pink-500' },
  { id: 'calendar', icon: 'calendar_month', label: 'Calendar', color: 'text-sky-500' },
  { id: 'alerts', icon: 'notifications', label: 'Alerts', count: 2, color: 'text-orange-500' },
  { id: 'whatsapp', icon: 'chat', label: 'WhatsApp', color: 'text-emerald-500' },
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
      <motion.div 
        onHoverStart={() => setIsSidebarOpen(true)}
        onHoverEnd={() => setIsSidebarOpen(false)}
        animate={{ 
          width: isSidebarOpen ? 280 : 68,
          boxShadow: isSidebarOpen ? '20px 0 50px rgba(0,0,0,0.1)' : '0 0 0 rgba(0,0,0,0)'
        }} 
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="h-full bg-white border-r border-slate-100 overflow-hidden flex flex-col shrink-0 z-50 relative"
      >
        <div className="flex flex-col h-full py-8">
          {/* LOGO AREA */}
          <div className="px-5 mb-10 overflow-hidden whitespace-nowrap">
             <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
                   <span className="material-symbols-rounded text-white text-[18px]">auto_awesome</span>
                </div>
                {isSidebarOpen && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                    <h1 className="text-slate-900 font-black text-[18px] tracking-tight leading-none">Arkle <span className="text-blue-600">Brain</span></h1>
                    <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest mt-1">BizOS Operating System</p>
                  </motion.div>
                )}
             </div>
          </div>

          <div className="space-y-4 mb-10 px-3">
             <button onClick={() => setMsgs([])} className="w-full flex items-center gap-4 hover:bg-slate-50 p-3 rounded-xl transition-all group">
               <span className="material-symbols-outlined text-slate-400 text-[22px] group-hover:text-blue-600">add_comment</span>
               {isSidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-900 font-bold text-[11px] uppercase tracking-widest whitespace-nowrap">New Session</motion.span>}
             </button>
             <button onClick={() => bizBoardRef.current?.scrollIntoView({ behavior: 'smooth' })} className="w-full flex items-center gap-4 hover:bg-slate-50 p-3 rounded-xl transition-all group">
               <span className="material-symbols-outlined text-slate-400 text-[22px] group-hover:text-slate-900">campaign</span>
               {isSidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-900 font-bold text-[11px] uppercase tracking-widest whitespace-nowrap">Biz Spotlight</motion.span>}
             </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-12 no-scrollbar px-3">
             <div className="space-y-5">
                <header className="px-2 flex items-center justify-between">
                   <span className="material-symbols-outlined text-slate-300 text-[20px]">folder_open</span>
                   {isSidebarOpen && <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] flex-1 ml-4">Threads</motion.h3>}
                </header>
                {isSidebarOpen && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    {['TechNova Scaling', 'Q4 GSTR Plan'].map((p, i) => (
                        <button key={i} className="w-full p-3 rounded-xl hover:bg-slate-50 transition-all text-left group">
                          <p className="text-slate-700 font-bold text-[11px] truncate">{p}</p>
                          <p className="text-slate-300 text-[8px] font-black uppercase mt-1 italic">Active</p>
                        </button>
                    ))}
                  </motion.div>
                )}
             </div>
             
             <div className="space-y-5">
                <header className="px-2 flex items-center justify-between">
                   <span className="material-symbols-outlined text-slate-300 text-[20px]">description</span>
                   {isSidebarOpen && <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] flex-1 ml-4">Knowledge</motion.h3>}
                </header>
                {isSidebarOpen && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    {['Incorporation_Cert.pdf', 'Sales_Perf.doc'].map((f, i) => (
                        <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition-all text-left">
                          <span className="text-slate-600 font-medium text-[10px] truncate">{f}</span>
                        </button>
                    ))}
                  </motion.div>
                )}
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
          <div className="max-w-[850px] mx-auto w-full">
            {/* CURVED TABS OUTSIDE */}
            <div className="flex items-center ml-12 gap-1 mb-[-1px] relative z-20">
               <button 
                  onClick={() => setActiveChatTab('ask')}
                  className={`px-7 py-3 rounded-t-[22px] flex items-center gap-3 transition-all duration-300 font-bold text-[14px] relative overflow-hidden group ${activeChatTab === 'ask' ? 'bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-[0_4px_20px_rgba(59,130,246,0.4)]' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  <svg className={`w-4 h-4 ${activeChatTab === 'ask' ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" /></svg>
                  Ask
                  {activeChatTab === 'ask' && <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />}
               </button>
               <button 
                  onClick={() => setActiveChatTab('agents')}
                  className={`px-7 py-3 rounded-t-[22px] flex items-center gap-3 transition-all duration-300 font-bold text-[14px] relative overflow-hidden group ${activeChatTab === 'agents' ? 'bg-linear-to-br from-slate-800 to-slate-950 text-white shadow-[0_4px_20px_rgba(30,41,59,0.4)]' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  <svg className={`w-4 h-4 ${activeChatTab === 'agents' ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M15,9H9V11H15V9M12,13H7V15H12V13M21,6V15C21,16.1 20.1,17 19,17H5C3.9,17 3,16.1 3,15V6C3,4.9 3.9,4 5,4H19C20.1,4 21,4.9 21,6M19,6H5V15H19V6Z" /></svg>
                  Agents
                  {activeChatTab === 'agents' && <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />}
               </button>
            </div>

            {/* THICK MULTI-GLOSS VIBRANT BORDER */}
            <div className="relative p-[3.5px] rounded-[34px] rounded-tl-none bg-linear-to-r from-blue-600 via-indigo-600 via-purple-600 to-pink-500 shadow-[0_30px_90px_-20px_rgba(79,70,229,0.35)] transition-all duration-500">
               <div className="bg-white rounded-[31px] rounded-tl-none flex flex-col min-h-[170px] overflow-hidden">
                  
                  {/* PURE SEAMLESS CONTENT AREA */}
                  <textarea 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    className="w-full bg-white border-none outline-none focus:outline-none focus:border-none focus:ring-0 text-slate-600 text-[18px] md:text-[21px] font-normal px-12 pt-12 pb-2 resize-none no-scrollbar placeholder:text-slate-300 placeholder:font-light" 
                    placeholder="Hi Im Arkle your Co founder and Business advisor" 
                  />
                  
                  <div className="flex items-center justify-between px-10 pb-10 bg-white border-none">
                     <div className="flex items-center gap-3">
                        <button className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                           <span className="material-symbols-rounded text-[22px]">add</span>
                        </button>
                        <button className="px-4 h-9 rounded-full bg-white border border-slate-100 flex items-center gap-2.5 text-[11px] font-bold text-slate-800 hover:border-blue-400 transition-all shadow-xs">
                           <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" /></svg>
                           Arkle Brain <span className="material-symbols-rounded text-[18px] text-slate-200">expand_more</span>
                        </button>
                     </div>
                     <div className="flex items-center gap-5">
                        <span className="material-symbols-rounded text-slate-300 text-[20px] cursor-pointer hover:text-slate-900 transition-all">language</span>
                        <button onClick={() => sendMessage()} className="w-10 h-10 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-xs">
                            <span className="material-symbols-rounded text-[22px]">arrow_forward</span>
                        </button>
                     </div>
                  </div>

               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 pt-12 pb-16">
               {[
                  { label: 'Create Task', desc: 'Add new task', icon: 'auto_awesome_motion' },
                  { label: 'Brainstorm Ideas', desc: 'Generate project ideas', icon: 'psychology_alt' },
                  { label: 'Set Reminder', desc: 'Create a new reminder', icon: 'notifications' },
                  { label: 'Search Workspace', desc: 'Find anything in BizOS', icon: 'search' }
               ].map((card, i) => (
                  <button key={i} className="flex flex-col items-start p-7 bg-white border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all rounded-[28px] group text-left">
                     <span className="material-symbols-rounded text-slate-900 mb-6 text-[24px] transition-all group-hover:scale-110">{card.icon}</span>
                     <p className="text-[15px] font-bold text-slate-900 mb-1 leading-none">{card.label}</p>
                     <p className="text-[12px] text-slate-400 font-medium">{card.desc}</p>
                  </button>
               ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 pb-16">
               {[
                  { label: 'Create Task', desc: 'Add new task', icon: 'auto_awesome_motion' },
                  { label: 'Brainstorm Ideas', desc: 'Generate project ideas', icon: 'psychology_alt' },
                  { label: 'Set Reminder', desc: 'Create a new reminder', icon: 'notifications' },
                  { label: 'Search Workspace', desc: 'Find anything in BizOS', icon: 'search' }
               ].map((card, i) => (
                  <button key={i} className="flex flex-col items-start p-6 bg-white border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all rounded-[24px] group text-left">
                     <span className="material-symbols-rounded text-slate-900 mb-6 text-[22px] transition-all group-hover:scale-110">{card.icon}</span>
                     <p className="text-[14px] font-bold text-slate-900 mb-1 leading-none">{card.label}</p>
                     <p className="text-[12px] text-slate-400 font-medium">{card.desc}</p>
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
      <div className="w-[74px] bg-slate-50/50 border-l border-slate-100 flex flex-col items-center py-8 z-40 gap-5">
        {QUICK_TRAY_APPS.map(app => (
          <button key={app.id} className="relative group">
            <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all hover:scale-110 active:scale-95 cursor-pointer ${app.color}`}>
              <span className="material-symbols-outlined text-[22px]">{app.icon}</span>
            </div>
            {app.count && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#3b82f6] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {app.count}
              </div>
            )}
            {/* Tooltip on hover */}
            <div className="absolute right-full mr-3 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
               {app.label}
            </div>
          </button>
        ))}
      </div>
      
      <ArkleVoiceOrb isOpen={isLiveVoice} onClose={() => setIsLiveVoice(false)} isListening={true} msgs={msgs} />
    </div>
  );
}
