'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import ArkleVoiceOrb from './ArkleVoiceOrb';
import WhiteboardPanel from './WhiteboardPanel';
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
   const [msgs, setMsgs] = useState<Message[]>([]);
   const [input, setInput] = useState('');
   const [loading, setLoading] = useState(false);
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
   const [currentSlide, setCurrentSlide] = useState(0);
   const [isLiveVoice, setIsLiveVoice] = useState(false);
   const [isBrainMenuOpen, setIsBrainMenuOpen] = useState(false);
   const [selectedContext, setSelectedContext] = useState("Arkle Brain");
   const [activeAgentFocus, setActiveAgentFocus] = useState<string | null>(null);
   const [trayTools, setTrayTools] = useState([
      { id: 'bizbook', label: 'Biz Book', icon: 'book_5', bg: 'bg-indigo-50/50', iconCol: 'text-indigo-600', shadow: 'shadow-indigo-100' },
      { id: 'invoice', label: 'Invoice', icon: 'receipt', bg: 'bg-blue-50/50', iconCol: 'text-blue-600', shadow: 'shadow-blue-100' },
      { id: 'global', label: 'Global', icon: 'language', bg: 'bg-sky-50/50', iconCol: 'text-sky-600', shadow: 'shadow-sky-100' },
      { id: 'excel', label: 'Excel', icon: 'table_view', bg: 'bg-emerald-50/50', iconCol: 'text-emerald-600', shadow: 'shadow-emerald-100' },
      { id: 'docs', label: 'Docs', icon: 'description', bg: 'bg-indigo-50/50', iconCol: 'text-indigo-600', shadow: 'shadow-indigo-100' }
   ]);

   const scrollRef = useRef<HTMLDivElement>(null);
   const bizBoardRef = useRef<HTMLDivElement>(null);
   const sliderRef = useRef<HTMLDivElement>(null);

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
         <div className="flex-1 flex flex-col min-w-0 bg-white overflow-y-auto scrollbar-hide scroll-smooth">
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
                  <div className="flex items-center ml-0 gap-1 mb-[-1px] relative z-20">
                     <button
                        onClick={() => setActiveChatTab('ask')}
                        className={`px-7 py-3 rounded-t-[22px] rounded-tl-none flex items-center gap-3 transition-all duration-300 font-bold text-[14px] relative overflow-hidden group ${activeChatTab === 'ask' ? 'bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-[0_4px_20px_rgba(59,130,246,0.4)]' : 'text-slate-400 hover:text-slate-600'}`}
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
                        Agent
                        {activeChatTab === 'agents' && <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />}
                     </button>
                  </div>

                  {/* THICK MULTI-GLOSS VIBRANT BORDER */}
                  <div className="relative p-[3.5px] rounded-[34px] rounded-tl-none bg-linear-to-r from-blue-600 via-indigo-600 via-purple-600 to-pink-500 shadow-[0_30px_90px_-20px_rgba(79,70,229,0.35)] transition-all duration-500">
                     <div className="bg-white rounded-[31px] rounded-tl-none flex flex-col min-h-[170px] overflow-visible">

                        {/* PURE SEAMLESS CONTENT AREA */}
                        <textarea
                           value={input}
                           onChange={e => setInput(e.target.value)}
                           className="w-full bg-white border-none outline-none focus:outline-none focus:ring-0 text-slate-600 text-[18px] md:text-[21px] font-normal px-12 pt-12 pb-2 resize-none no-scrollbar placeholder:text-slate-300 placeholder:font-light rounded-t-[31px] rounded-tl-none"
                           placeholder="Hi Im Arkle your Co founder and Business advisor"
                        />

                        <div className="flex items-center justify-between px-10 pb-10 bg-white border-none rounded-b-[31px]">
                           <div className="flex items-center gap-3">
                              <button className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all">
                                 <span className="material-symbols-rounded text-[22px]">add</span>
                              </button>
                            <div className="relative">
                               <button 
                                  onClick={() => setIsBrainMenuOpen(!isBrainMenuOpen)}
                                  className="px-4 h-9 rounded-full bg-white border border-slate-100 flex items-center gap-2.5 text-[11px] font-bold text-slate-800 hover:border-blue-400 transition-all shadow-xs relative z-30"
                               >
                                  <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" /></svg>
                                  {selectedContext} <span className={`material-symbols-rounded text-[18px] text-slate-200 transition-transform ${isBrainMenuOpen ? 'rotate-180' : ''}`}>expand_more</span>
                               </button>

                               {/* BRAIN NAVIGATOR DROPDOWN - MOVED BELOW */}
                               <AnimatePresence>
                                  {isBrainMenuOpen && (
                                     <motion.div 
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        className="absolute top-full left-0 mt-3 w-56 bg-white rounded-3xl border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-2 z-[999] overflow-visible"
                                     >
                                        <div className="px-4 py-3 mb-1 border-b border-slate-50">
                                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Navigator</p>
                                        </div>
                                        <div className="py-1">
                                           {[
                                              { label: 'ARKLE BRAIN', icon: 'auto_awesome', color: 'text-blue-500' },
                                              { label: 'BIZ BOOK', icon: 'book_5', color: 'text-indigo-600' },
                                              { label: 'WORKSPACE', icon: 'grid_view', color: 'text-blue-600' },
                                              { label: 'LAUNCH PAD', icon: 'rocket_launch', color: 'text-orange-600' },
                                              { label: 'AGENT', icon: 'robot_2', color: 'text-emerald-600' },
                                              { label: 'GLOBAL MARKET', icon: 'language', color: 'text-sky-600' }
                                           ].map((item, idx) => (
                                              <button 
                                                 key={idx}
                                                 onClick={() => {
                                                   setSelectedContext(item.label.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' '));
                                                   setIsBrainMenuOpen(false);
                                                 }}
                                                 className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all group text-left"
                                              >
                                                 <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50 group-hover:bg-white transition-all ${item.color}`}>
                                                    <span className="material-symbols-rounded text-[20px]">{item.icon}</span>
                                                 </div>
                                                 <span className="text-[11px] font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors uppercase">{item.label}</span>
                                              </button>
                                           ))}
                                        </div>
                                     </motion.div>
                                  )}
                               </AnimatePresence>
                            </div>
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

                  {/* ULTRA-COMPACT LITE SLIDER - SHIFTED DOWN */}
                  <div className="mt-24 w-full relative group">
                     <div className="relative mt-2">
                      {/* MINIMAL LEFT ARROW */}
                      <button 
                         onClick={() => sliderRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
                         className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-200 transition-all z-10 shadow-sm"
                      >
                         <span className="material-symbols-rounded text-[20px]">chevron_left</span>
                      </button>

                      <div 
                         ref={sliderRef}
                         className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-1 scroll-smooth"
                      >
                         {[
                            { label: 'Create Task', desc: 'Add new task', icon: 'auto_awesome_motion' },
                            { label: 'Brainstorm Ideas', desc: 'Neural ideation engine', icon: 'psychology_alt' },
                            { label: 'Set Reminder', desc: 'Create a new reminder', icon: 'notifications' },
                            { label: 'Search Workspace', desc: 'Find anything in BizOS', icon: 'search' },
                            { label: 'GST Expert', desc: 'Tax & Compliance audit', icon: 'account_balance' },
                            { label: 'US Incorporation', desc: 'Expand to United States', icon: 'flag' },
                            { label: 'Scale Revenue', desc: '10X growth strategies', icon: 'trending_up' },
                            { label: 'Export Guru', desc: 'Global market access', icon: 'output' }
                         ].map((card, i) => (
                            <button key={i} className="flex flex-col items-center p-2.5 bg-white border border-slate-100 hover:border-blue-100 hover:shadow-xs transition-all rounded-[16px] group text-center min-w-[calc(20%-12px)] md:min-w-[calc(20%-12px)] shrink-0 relative overflow-hidden">
                               <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2 transition-all group-hover:scale-110 bg-slate-50">
                                  <span className="material-symbols-rounded text-slate-800 text-[14px]">{card.icon}</span>
                               </div>
                               <p className="text-[9px] font-black text-slate-900 mb-0.5 leading-none tracking-tight group-hover:text-blue-600 transition-colors uppercase">{card.label}</p>
                               <p className="text-[7.5px] text-slate-400 font-bold leading-tight opacity-70">{card.desc}</p>
                            </button>
                         ))}
                      </div>

                      {/* MINIMAL RIGHT ARROW */}
                      <button 
                         onClick={() => sliderRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
                         className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-200 transition-all z-10 shadow-sm"
                      >
                         <span className="material-symbols-rounded text-[20px]">chevron_right</span>
                      </button>
                   </div>

                   {/* PRIORITY WORKSPACE TRAY - NEW SECTION */}
                   <div className="mt-4 pt-4 border-t border-slate-50 px-1">
                      <div className="flex items-center justify-between mb-4 px-1">
                         <div className="flex items-center gap-2">
                            <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-2">
                               <span className="relative flex h-2 w-2">
                                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${activeChatTab === 'agents' ? 'bg-indigo-400' : 'bg-blue-400'} opacity-75`}></span>
                                  <span className={`relative inline-flex rounded-full h-2 w-2 ${activeChatTab === 'agents' ? 'bg-indigo-600' : 'bg-blue-500'}`}></span>
                               </span>
                               {activeChatTab === 'agents' ? 'Agent Command Center' : 'Quick Workspace Hub'}
                            </h4>
                         </div>
                      </div>
                      <Reorder.Group axis="x" values={trayTools} onReorder={setTrayTools} className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide px-2 items-center min-h-[100px]">
                         {trayTools.map((tool) => (
                            <Reorder.Item key={tool.id} value={tool} className="shrink-0 cursor-grab active:cursor-grabbing">
                               <div 
                                  onClick={() => activeChatTab === 'agents' && setActiveAgentFocus(tool.id)}
                                  className="flex flex-col items-center gap-2.5 min-w-[80px] group transition-all"
                               >
                                  <div className={`w-16 h-11 ${tool.bg} rounded-[16px] flex items-center justify-center border border-white shadow-xs group-hover:shadow-sm group-hover:scale-105 group-hover:-translate-y-0.5 transition-all duration-500 relative overflow-hidden ${activeChatTab === 'agents' ? (activeAgentFocus === tool.id ? 'ring-2 ring-indigo-600 ring-offset-1 scale-105' : 'ring-1 ring-indigo-500/10') : ''}`}>
                                     
                                     {activeChatTab === 'agents' && activeAgentFocus === tool.id && (
                                        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-linear-to-r from-transparent via-indigo-600 to-transparent animate-shimmer" />
                                     )}
                                     
                                     <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/50 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                                     <span className={`material-symbols-rounded text-[20px] ${tool.iconCol} transition-all duration-500 group-hover:scale-110 ${activeAgentFocus === tool.id ? 'scale-110' : ''}`}>{tool.icon}</span>
                                  </div>
                                  <span className={`text-[8px] font-black ${activeChatTab === 'agents' ? (activeAgentFocus === tool.id ? 'text-indigo-800 scale-110 ring-1 ring-indigo-100 px-2 py-0.5 rounded-full bg-indigo-50/50' : 'text-indigo-700 opacity-60') : 'text-slate-600'} tracking-widest uppercase group-hover:text-blue-600 transition-colors`}>
                                     {activeChatTab === 'agents' ? (activeAgentFocus === tool.id ? `Focus: ${tool.label}` : tool.label) : tool.label}
                                  </span>
                               </div>
                            </Reorder.Item>
                         ))}

                         {/* ADD MORE BUTTON */}
                         <button className="flex flex-col items-center gap-2.5 min-w-[80px] group shrink-0 self-start mt-[-1px]">
                            <div className="w-16 h-11 bg-slate-50 rounded-[16px] flex items-center justify-center border border-dashed border-slate-200 hover:border-blue-400 hover:bg-white transition-all duration-300">
                               <span className="material-symbols-rounded text-[18px] text-slate-400 group-hover:text-blue-500">add</span>
                            </div>
                            <span className="text-[8px] font-black text-slate-400 tracking-widest uppercase group-hover:text-blue-500 transition-colors">Add Tool</span>
                         </button>
                      </Reorder.Group>
                   </div>
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
            {/* NOTIFICATIONS & TASKS HUB - ENHANCED */}
            <div className="w-full max-w-[850px] mx-auto mt-6 mb-12">
               <div className="border-y border-slate-100/60 py-3 px-1 flex items-center justify-between group cursor-pointer hover:bg-slate-50/50 transition-all rounded-lg" onClick={() => setIsWhiteboardOpen(!isWhiteboardOpen)}>
                  <div className="flex items-center gap-3">
                     <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                     <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Business Control • Notifications & Tasks</span>
                     <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ml-1">Live Notifications & Tasks</span>
                  </div>
                  <div className="flex items-center gap-2 group-hover:gap-3 transition-all">
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-all">Details</span>
                     <span className="material-symbols-outlined text-slate-300 text-[18px] group-hover:text-blue-600 transition-all">{isWhiteboardOpen ? 'expand_less' : 'expand_more'}</span>
                  </div>
               </div>

               {/* EXPANDABLE HUB CONTENT */}
               <AnimatePresence>
                  {isWhiteboardOpen && (
                     <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                     >
                        <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                           {/* NOTIFICATIONS COLUMN */}
                           <div className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm">
                              <div className="flex items-center gap-2 mb-6 text-blue-600">
                                 <span className="material-symbols-rounded text-[18px]">notifications_active</span>
                                 <p className="text-[10px] font-black uppercase tracking-widest">Global Mails & Alerts</p>
                              </div>
                              <div className="space-y-4">
                                 {[
                                    { icon: 'mail', text: 'New investor query from UAE', time: '2m ago' },
                                    { icon: 'security', text: 'Security login from New Delhi', time: '1h ago' }
                                 ].map((notif, i) => (
                                    <div key={i} className="flex gap-3 hover:translate-x-1 transition-transform cursor-pointer">
                                       <span className="material-symbols-outlined text-slate-300 text-[16px]">{notif.icon}</span>
                                       <div>
                                          <p className="text-[11px] font-bold text-slate-800 leading-tight">{notif.text}</p>
                                          <p className="text-[8px] text-slate-400 mt-0.5">{notif.time}</p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           {/* PENDING TASKS COLUMN */}
                           <div className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm">
                              <div className="flex items-center gap-2 mb-6 text-amber-600">
                                 <span className="material-symbols-rounded text-[18px]">pending_actions</span>
                                 <p className="text-[10px] font-black uppercase tracking-widest">Compliance & GST</p>
                              </div>
                              <div className="space-y-4">
                                 {[
                                    { text: 'GSTR-3B filing due in 24hrs', priority: 'Critical' },
                                    { text: 'Verify US bank documents', priority: 'Medium' }
                                 ].map((task, i) => (
                                    <div key={i} className="flex items-start gap-3 bg-slate-50/50 p-3 rounded-2xl">
                                       <div className={`w-1 h-6 rounded-full shrink-0 ${task.priority === 'Critical' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                       <div>
                                          <p className="text-[11px] font-bold text-slate-800 leading-tight">{task.text}</p>
                                          <p className={`text-[8px] font-black uppercase mt-1 ${task.priority === 'Critical' ? 'text-red-500' : 'text-amber-500'}`}>{task.priority}</p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           {/* CURRENT WORKS COLUMN */}
                           <div className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm">
                              <div className="flex items-center gap-2 mb-6 text-emerald-600">
                                 <span className="material-symbols-rounded text-[18px]">bolt</span>
                                 <p className="text-[10px] font-black uppercase tracking-widest">In Motion • Real-time</p>
                              </div>
                              <div className="space-y-5">
                                 {[
                                    { title: 'Scaling UAE Market', prog: 75 },
                                    { title: 'Trademark Search', prog: 30 }
                                 ].map((work, i) => (
                                    <div key={i} className="space-y-2">
                                       <div className="flex justify-between text-[10px] font-bold text-slate-700">
                                          <span>{work.title}</span>
                                          <span>{work.prog}%</span>
                                       </div>
                                       <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${work.prog}%` }} />
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>

            {/* BIZBOARD SPOTLIGHT - SCREENSHOT ACCURATE */}
            <div ref={bizBoardRef} className="w-full pb-24 px-6 bg-white min-h-[600px] flex flex-col items-center">
               <div className="w-full max-w-[850px] flex items-center justify-between mb-10">
                  <div className="flex-1" />
                  <div className="text-center">
                     <div className="flex items-center justify-center gap-3 mb-1">
                        <span className="material-symbols-outlined text-orange-500 text-[24px]">wb_sunny</span>
                        <h3 className="text-slate-900 font-black text-[26px] tracking-[0.1em] uppercase">BizBoard Spotlight</h3>
                     </div>
                     <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Virtual Commercials for Business Growth & Ecosystems</p>
                  </div>
                  <div className="flex-1 flex justify-end gap-2">
                     {ARCADE_SLIDES.map((_, dot) => (
                        <div key={dot} className={`h-1.5 rounded-full transition-all duration-300 ${dot === currentSlide ? 'w-8 bg-slate-900' : 'w-2 bg-slate-200'}`} />
                     ))}
                  </div>
               </div>

               <div className="relative w-full max-w-[950px] group px-6">
                  {/* SLIDER CARDS */}
                  <div className="relative aspect-[16/8] w-full rounded-[48px] bg-slate-950 overflow-hidden shadow-3x">
                     <div className="absolute inset-0 bg-linear-to-br from-slate-900 to-black opacity-95 transition-all group-hover:scale-105 duration-700" />
                     
                     {/* CARD CONTENT */}
                     <div className="absolute inset-0 p-16 flex flex-col justify-start items-center text-center">
                        <div className="flex items-center gap-2 border border-white/10 rounded-full px-5 py-2 mb-14 bg-white/5 backdrop-blur-md">
                           <span className="material-symbols-outlined text-[14px] text-white/50">verified_user</span>
                           <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Government Protocol</span>
                        </div>
                        
                        <p className="text-white/30 text-[13px] font-black uppercase tracking-[0.5em] mb-6">Launchpad for Bharat</p>
                        <h2 className="text-white text-[56px] md:text-[72px] font-black leading-[1] tracking-tighter uppercase max-w-3xl">
                           {ARCADE_SLIDES[currentSlide]?.title.split(': ')[0]} <br />
                           <span className="text-slate-500">{ARCADE_SLIDES[currentSlide]?.title.split(': ')[1] || 'Premier Schemes'}</span>
                        </h2>
                     </div>

                     {/* NAVIGATION ARROWS (On card sides as in screenshot) */}
                     <button 
                        onClick={() => setCurrentSlide((currentSlide - 1 + ARCADE_SLIDES.length) % ARCADE_SLIDES.length)}
                        className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-800/50 backdrop-blur-xl border border-white/5 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100 shadow-2xl z-20"
                     >
                        <span className="material-symbols-outlined text-[24px]">chevron_left</span>
                     </button>
                     <button 
                        onClick={() => setCurrentSlide((currentSlide + 1) % ARCADE_SLIDES.length)}
                        className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-800/50 backdrop-blur-xl border border-white/5 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100 shadow-2xl z-20"
                     >
                        <span className="material-symbols-outlined text-[24px]">chevron_right</span>
                     </button>
                  </div>
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

         <WhiteboardPanel isOpen={isWhiteboardOpen} onClose={() => setIsWhiteboardOpen(false)} />
         <ArkleVoiceOrb isOpen={isLiveVoice} onClose={() => setIsLiveVoice(false)} isListening={true} msgs={msgs} />
      </div>
   );
}
