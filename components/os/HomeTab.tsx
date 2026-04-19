'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArkleVoiceOrb from './ArkleVoiceOrb';
import WhiteboardPanel from './WhiteboardPanel';
import BizboardSpotlight from './launchpad/LaunchPadSpotlight';
import { useBizStore } from '@/lib/useBizStore';

type Message = {
   id: string;
   role: 'user' | 'assistant';
   content: string;
   timestamp: Date;
};

const RIGHT_TRAY_APPS = [
   { id: 'mail', icon: 'mail', label: 'Gmail', count: 4, color: 'text-red-500' },
   { id: 'docs', icon: 'description', label: 'Documents', color: 'text-blue-500' },
   { id: 'grid', icon: 'grid_view', label: 'Apps', color: 'text-green-500' },
   { id: 'notes', icon: 'edit_note', label: 'Notes', color: 'text-orange-500' },
   { id: 'tasks', icon: 'check_circle', label: 'Tasks', count: 12, color: 'text-indigo-600' },
   { id: 'marketing', icon: 'campaign', label: 'Marketing', color: 'text-pink-500' },
   { id: 'calendar', icon: 'calendar_month', label: 'Calendar', color: 'text-sky-500' },
   { id: 'alerts', icon: 'notifications', label: 'Alerts', count: 2, color: 'text-orange-500' },
   { id: 'chat', icon: 'chat', label: 'WhatsApp', color: 'text-emerald-500' },
];

const HUB_APPS = [
   { id: 'biz', icon: 'business_center', label: 'BizDesk' },
   { id: 'vault', icon: 'account_balance_wallet', label: 'Vault' },
   { id: 'legal', icon: 'gavel', label: 'Legal' },
   { id: 'market', icon: 'storefront', label: 'Market' },
];

const QUICK_TILES = [
   { title: 'CREATE TASK', desc: 'Add new task', icon: 'auto_awesome_motion' },
   { title: 'BRAINSTORM IDEAS', desc: 'Neural ideation engine', icon: 'psychology' },
   { title: 'GST EXPERT', desc: 'Tax & Compliance audit', icon: 'account_balance' },
   { title: 'US INCORPORATION', desc: 'Expand to USA', icon: 'flag' },
   { title: 'MARKET TRENDS', desc: 'AI Market Analysis', icon: 'trending_up' },
   { title: 'LEGAL BOT', desc: 'Agreements & Docs', icon: 'gavel' },
   { title: 'BRAND GEN', desc: 'Logo & Identity', icon: 'palette' },
   { title: 'SALES PITCH', desc: 'Convert more leads', icon: 'leaderboard' },
];

const NEURAL_NOTIFICATIONS = [
   { id: 1, text: "GST Filing due in 2 days. Arkle has prepared the draft.", type: "alert" },
   { id: 2, text: "New funding scheme detected: NITI Aayog Seed Fund ₹50L.", type: "opportunity" },
   { id: 3, text: "Business health score increased to 84%.", type: "info" }
];

export default function HomeTab({ data }: { data: any }) {
   const { whiteboardOpen: isWhiteboardOpen, setWhiteboardOpen: setIsWhiteboardOpen, conversationMode, setConversationMode, setSidebarOpen } = useBizStore();
   const [activeChatTab, setActiveChatTab] = useState<'ask' | 'agents'>('ask');
   const [msgs, setMsgs] = useState<Message[]>([]);
   const [input, setInput] = useState('');
   const [loading, setLoading] = useState(false);
   const [isSidebarOpen, setIsSidebarOpenLocal] = useState(false);
   const [isNeuralMenuOpen, setIsNeuralMenuOpen] = useState(false);
   const [isBrainMenuOpen, setIsBrainMenuOpen] = useState(false);
   const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
   const [isLiveVoice, setIsLiveVoice] = useState(false);
   const [selectedContext, setSelectedContext] = useState("Arkle Brain");
   const [selectedModel, setSelectedModel] = useState("Gemini 1.5 Pro");
   const [tileIndex, setTileIndex] = useState(0);
   const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

   const scrollRef = useRef<HTMLDivElement>(null);
   const textareaRef = useRef<HTMLTextAreaElement>(null);

   const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      if (textareaRef.current) {
         textareaRef.current.style.height = 'auto';
         textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
      }
   };

   const nextTiles = () => { if (tileIndex + 4 < QUICK_TILES.length) setTileIndex(tileIndex + 1); };
   const prevTiles = () => { if (tileIndex > 0) setTileIndex(tileIndex - 1); };

   const sendMessage = useCallback(async (text = input) => {
      const q = text.trim();
      if (!q || loading) return;
      
      setConversationMode(true);
      setSidebarOpen(false);

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
   }, [input, loading, msgs, setConversationMode, setSidebarOpen]);

   useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

   return (
      <div className="flex h-full bg-[#f8fafc] overflow-hidden relative no-scrollbar font-sans">
         {/* SIDEBAR (Only show if not in conversation mode) */}
         {!conversationMode && (
            <motion.div
               onMouseEnter={() => setIsSidebarOpenLocal(true)}
               onMouseLeave={() => setIsSidebarOpenLocal(false)}
               animate={{ width: isSidebarOpen ? 280 : 78 }}
               className="h-full bg-white border-r border-slate-100 flex flex-col shrink-0 z-[100] shadow-2xl shadow-slate-200/50"
            >
               <div className="flex flex-col h-full py-8">
                  <div className="px-6 mb-12">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0">
                           <span className="material-symbols-rounded text-white text-[22px]">auto_awesome</span>
                        </div>
                        {isSidebarOpen && <span className="font-black text-slate-900 uppercase tracking-tighter text-[16px] whitespace-nowrap">Arkle Brain</span>}
                     </div>
                  </div>
                  <div className="flex-1 px-4 space-y-3">
                     <button onClick={() => setMsgs([])} className="w-full flex items-center gap-5 p-4 hover:bg-slate-50 rounded-2xl transition-all group overflow-hidden">
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 transition-colors shrink-0">add_circle</span>
                        {isSidebarOpen && <span className="text-[12px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 whitespace-nowrap">New Session</span>}
                     </button>
                  </div>
               </div>
            </motion.div>
         )}

         {/* MAIN CONTENT */}
         <div className="flex-1 flex flex-col min-w-0 bg-white overflow-y-auto scrollbar-hide relative pb-40">
            <div className="h-16 border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-50 bg-white/80 backdrop-blur-md">
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Neural Core Active</span>
            </div>

            <div className={`px-4 md:px-20 ${conversationMode ? 'py-4' : 'py-12 md:py-16'} flex flex-col items-center flex-1 relative`}>
               {!conversationMode && (
                  <div className="flex flex-col items-center mb-10 text-center">
                     <h3 className="text-[54px] md:text-[68px] font-black text-slate-900 tracking-tighter leading-none mb-4">
                        Arkle <span className="text-blue-600">Brain</span>
                     </h3>
                     <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.5em] opacity-50">Autonomous AI Business Operating System</p>
                  </div>
               )}

               {/* MESSAGES AREA */}
               {conversationMode && (
                  <div className="w-full max-w-4xl mx-auto space-y-8 mt-8 mb-40 overflow-y-auto pr-4 no-scrollbar flex-1">
                     <AnimatePresence mode="popLayout">
                        {msgs.map(m => (
                           <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`p-6 md:p-8 rounded-[36px] text-[16px] md:text-[18px] leading-relaxed max-w-[85%] font-medium shadow-sm border ${m.role === 'user' ? 'bg-slate-100 text-slate-900 border-slate-200' : 'bg-transparent text-slate-900 border-none'}`}>
                                 {m.content}
                              </div>
                           </motion.div>
                        ))}
                     </AnimatePresence>
                     <div ref={scrollRef} className="h-20" />
                  </div>
               )}

               {/* CHAT BOX */}
               <div className={`w-full transition-all duration-500 z-50 ${conversationMode ? 'fixed bottom-6 left-1/2 -translate-x-1/2 max-w-4xl px-4' : 'max-w-[850px] mx-auto'}`}>
                  <div className="flex items-center ml-0 gap-0 mb-[-4px] relative z-20">
                     <button onClick={() => setActiveChatTab('ask')} className={`w-[105px] h-[33px] flex items-center justify-center transition-all duration-300 font-black relative z-30 ${activeChatTab === 'ask' ? 'rounded-tr-[20px] rounded-tl-none rounded-b-none bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_-5px_15px_rgba(124,58,237,0.25)]' : 'rounded-none bg-transparent text-slate-400 hover:text-slate-600'}`}><span className="relative z-10 uppercase tracking-[0.2em] text-[10px]">Ask</span></button>
                     <button onClick={() => setActiveChatTab('agents')} className={`w-[105px] h-[33px] flex items-center justify-center transition-all duration-300 font-black relative z-30 ${activeChatTab === 'agents' ? 'rounded-tl-[20px] rounded-tr-none rounded-b-none bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_-5px_15px_rgba(124,58,237,0.25)]' : 'rounded-none bg-transparent text-slate-400 hover:text-slate-600'}`}><span className="relative z-10 uppercase tracking-[0.2em] text-[10px]">Agent</span></button>
                  </div>
                  <div className="relative p-[4px] rounded-tr-[42px] rounded-br-[42px] rounded-bl-[42px] rounded-tl-none bg-gradient-to-r from-purple-600 via-rose-500 to-indigo-600 shadow-[0_30px_70px_-20px_rgba(79,70,229,0.25)] z-10">
                     <div className="bg-white rounded-tr-[39px] rounded-br-[39px] rounded-bl-[39px] rounded-tl-none flex flex-col overflow-visible">
                        <textarea ref={textareaRef} value={input} onChange={handleInput} rows={1} className="w-full bg-white border-none outline-none focus:outline-none focus:ring-0 text-slate-400 text-[18px] md:text-[21px] font-normal px-12 pt-12 pb-2 resize-none no-scrollbar placeholder:text-slate-300 placeholder:font-light rounded-[39px] min-h-[100px]" placeholder="Hi I'm Arkle your Co founder and Business advisor" />
                        <div className="flex items-center justify-between px-10 pb-12 pt-4 bg-white border-none rounded-b-[39px]">
                           <div className="flex items-center gap-2 mt-2">
                              <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:bg-slate-100"><span className="material-symbols-rounded text-[20px]">add</span></button>
                              <div className="flex items-center gap-2 bg-slate-50/50 p-1 rounded-full border border-slate-100 mt-1">
                                 <div className="relative">
                                    <button onClick={() => setIsBrainMenuOpen(!isBrainMenuOpen)} className="px-4 h-8 rounded-full bg-white border border-slate-100 flex items-center gap-2 text-[10px] font-black text-slate-800 hover:border-blue-400 transition-all shadow-xs relative z-30"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" />{selectedContext} <span className={`material-symbols-rounded text-[16px] text-slate-300 transition-transform ${isBrainMenuOpen ? 'rotate-180' : ''}`}>expand_more</span></button>
                                    <AnimatePresence>{isBrainMenuOpen && <motion.div initial={{ opacity: 0, y: conversationMode ? 10 : -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: conversationMode ? 10 : -10 }} className={`absolute ${conversationMode ? 'bottom-full mb-3' : 'top-full mt-3'} left-0 w-64 bg-white rounded-[24px] border border-slate-100 shadow-2xl p-2 z-[999]`}>{['Arkle Brain', 'Biz Book', 'Workspace', 'Launch Pad', 'Agent Mode', 'Global Market'].map(opt => (<button key={opt} onClick={() => { setSelectedContext(opt); setIsBrainMenuOpen(false); }} className="w-full text-left p-3 rounded-xl hover:bg-slate-50 text-[10px] font-black uppercase text-slate-800 transition-all flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" />{opt}</button>))}</motion.div>}</AnimatePresence>
                                 </div>
                                 <div className="relative">
                                    <button onClick={() => setIsModelMenuOpen(!isModelMenuOpen)} className="px-4 h-8 rounded-full bg-white border border-slate-100 flex items-center gap-2 text-[10px] font-black text-slate-800 hover:border-blue-400 transition-all shadow-xs relative z-30">{selectedModel} <span className={`material-symbols-rounded text-[16px] text-slate-300 transition-transform ${isModelMenuOpen ? 'rotate-180' : ''}`}>expand_more</span></button>
                                    <AnimatePresence>{isModelMenuOpen && <motion.div initial={{ opacity: 0, y: conversationMode ? 10 : -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: conversationMode ? 10 : -10 }} className={`absolute ${conversationMode ? 'bottom-full mb-3' : 'top-full mt-3'} left-0 w-64 bg-white rounded-[24px] border border-slate-100 shadow-2xl p-2 z-[999]`}>{['Gemini 1.5 Pro', 'GPT-4o (Premium)', 'Claude 3.5 Sonnet', 'Arkle Test Model'].map(m => (<button key={m} onClick={() => { setSelectedModel(m); setIsModelMenuOpen(false); }} className="w-full text-left p-3 rounded-xl hover:bg-slate-50 text-[10px] font-black uppercase text-slate-800 transition-all">{m}</button>))}</motion.div>}</AnimatePresence>
                                 </div>
                              </div>
                           </div>
                           <button onClick={() => sendMessage()} disabled={!input.trim()} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-xs mt-2 ${input.trim() ? 'bg-slate-900 text-white hover:scale-105' : 'bg-slate-50 text-slate-300'}`}><span className="material-symbols-rounded text-[22px]">arrow_forward</span></button>
                        </div>
                     </div>
                  </div>
               </div>

               {/* ELEMENTS TO HIDE IN CONVERSATION MODE */}
               {!conversationMode && (
                  <>
                     <div className="mt-20 w-full max-w-5xl mx-auto flex items-center gap-4 group">
                        <button onClick={prevTiles} disabled={tileIndex === 0} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${tileIndex === 0 ? 'opacity-0' : 'bg-white shadow-lg text-slate-400 hover:text-blue-600 hover:scale-110'}`}><span className="material-symbols-rounded">chevron_left</span></button>
                        <div className="flex-1 grid grid-cols-4 gap-6 overflow-hidden">
                           <AnimatePresence mode="popLayout">
                              {QUICK_TILES.slice(tileIndex, tileIndex + 4).map((tile) => (
                                 <motion.button key={tile.title} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white p-6 rounded-[36px] border border-slate-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all text-left group min-h-[160px] flex flex-col justify-between">
                                    <div className="mb-4 text-slate-300 group-hover:text-blue-500 transition-colors">
                                       <span className="material-symbols-rounded text-[32px]">{tile.icon}</span>
                                    </div>
                                    <div>
                                       <h4 className="text-[13px] font-black text-slate-900 mb-2 leading-tight uppercase tracking-tighter">{tile.title}</h4>
                                       <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase opacity-60">{tile.desc}</p>
                                    </div>
                                 </motion.button>
                              ))}
                           </AnimatePresence>
                        </div>
                        <button onClick={nextTiles} disabled={tileIndex + 4 >= QUICK_TILES.length} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${tileIndex + 4 >= QUICK_TILES.length ? 'opacity-0' : 'bg-white shadow-lg text-slate-400 hover:text-blue-600 hover:scale-110'}`}><span className="material-symbols-rounded">chevron_right</span></button>
                     </div>

                     <div className="w-full max-w-[850px] mx-auto mt-16 px-4 md:px-0">
                        <div className="flex items-center gap-3 mb-8">
                           <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                           <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.3em]">Quick Workspace Hub</h3>
                        </div>
                        <div className="grid grid-cols-6 gap-2 md:gap-4">
                           {[
                              { label: 'BIZ BOOK', icon: 'menu_book', color: 'text-violet-600', bg: 'bg-violet-50' },
                              { label: 'INVOICE', icon: 'receipt_long', color: 'text-blue-600', bg: 'bg-blue-50' },
                              { label: 'GLOBAL', icon: 'public', color: 'text-sky-600', bg: 'bg-sky-50' },
                              { label: 'EXCEL', icon: 'table_chart', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                              { label: 'DOCS', icon: 'description', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                           ].map((item) => (
                              <div key={item.label} className="flex flex-col items-center gap-4 group cursor-pointer">
                                 <div className={`w-16 h-16 rounded-full ${item.bg} flex items-center justify-center border-2 border-white shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300`}>
                                    <span className={`material-symbols-rounded text-[28px] ${item.color}`}>{item.icon}</span>
                                 </div>
                                 <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest text-center">{item.label}</span>
                              </div>
                           ))}
                           <div className="flex flex-col items-center gap-4 group cursor-pointer">
                              <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50/30 group-hover:border-blue-400 group-hover:bg-blue-50/30 transition-all duration-300">
                                 <span className="material-symbols-rounded text-blue-600 text-[28px]">add</span>
                              </div>
                              <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest text-center">ADD TOOL</span>
                           </div>
                        </div>
                     </div>

                     <div className="w-full max-w-[850px] mx-auto mt-16 px-4 md:px-0">
                        <div onClick={() => setIsNeuralMenuOpen(!isNeuralMenuOpen)} className="bg-slate-50/50 backdrop-blur-xl border border-slate-100 p-5 rounded-[28px] flex items-center justify-between cursor-pointer group hover:bg-white hover:shadow-2xl transition-all">
                           <div className="flex items-center gap-5">
                              <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                 <span className="material-symbols-rounded text-white text-[22px] animate-pulse">psychology</span>
                              </div>
                              <div>
                                 <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] block">Neural Notifications</span>
                                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">3 active business directives</span>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <span className="text-[9px] font-black uppercase text-slate-400 group-hover:text-blue-600 transition-colors">Operational Intelligence</span>
                              <span className={`material-symbols-rounded text-slate-300 group-hover:text-blue-600 transition-transform ${isNeuralMenuOpen ? 'rotate-180' : ''}`}>expand_more</span>
                           </div>
                        </div>
                        <AnimatePresence>
                           {isNeuralMenuOpen && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-4 space-y-3">
                                 {NEURAL_NOTIFICATIONS.map(notif => (
                                    <div key={notif.id} className="bg-white border border-slate-50 p-4 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                                       <div className={`w-2 h-2 rounded-full ${notif.type === 'alert' ? 'bg-rose-500' : notif.type === 'opportunity' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                       <p className="text-[12px] font-bold text-slate-600">{notif.text}</p>
                                    </div>
                                 ))}
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </div>

                     <div className="w-full max-w-[850px] mx-auto mt-6 px-4 md:px-0">
                        <div onClick={() => setIsSpotlightOpen(!isSpotlightOpen)} className="bg-white/40 backdrop-blur-xl border border-slate-100 p-5 rounded-[28px] flex items-center justify-between cursor-pointer group hover:bg-white hover:shadow-2xl transition-all">
                           <div className="flex items-center gap-5">
                              <div className="w-10 h-10 rounded-full bg-linear-to-tr from-fuchsia-600 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                                 <span className="material-symbols-rounded text-white text-[22px]">auto_awesome_motion</span>
                              </div>
                              <div>
                                 <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] block">Bizboard Spotlight</span>
                                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Ecosystem Hub & Media Space</span>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="flex -space-x-2 mr-2">
                                 {[1, 2, 3].map(i => (
                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                                       <img src={`https://i.pravatar.cc/100?u=spot${i}`} alt="user" />
                                    </div>
                                 ))}
                              </div>
                              <span className={`material-symbols-rounded text-slate-300 group-hover:text-rose-600 transition-transform ${isSpotlightOpen ? 'rotate-180' : ''}`}>expand_more</span>
                           </div>
                        </div>
                        <AnimatePresence>
                           {isSpotlightOpen && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-4">
                                 <BizboardSpotlight />
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </div>
                  </>
               )}
            </div>
         </div>

         {/* RIGHT QUICK TRAY & BOTTOM HUB - HIDE IN CONVERSATION MODE */}
         {!conversationMode && (
            <>
               <div className="fixed right-6 top-[42%] -translate-y-1/2 z-[100] flex flex-col gap-5 items-center">
                  {RIGHT_TRAY_APPS.map(app => (
                     <button key={app.id} className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-xl hover:scale-110 transition-all group relative">
                        <span className={`material-symbols-outlined text-[24px] ${app.color}`}>{app.icon}</span>
                        {app.count && <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">{app.count}</span>}
                        <div className="absolute right-full mr-4 bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">{app.label}</div>
                     </button>
                  ))}
               </div>

               <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-3 p-3 bg-white/70 backdrop-blur-2xl rounded-[32px] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:scale-105 transition-all duration-500">
                  <div className="flex items-center gap-2 px-3 border-r border-slate-200 mr-2"><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /><span className="text-[9px] font-black uppercase tracking-widest text-slate-400">BizHub</span></div>
                  {HUB_APPS.map(app => (<button key={app.id} className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group/hub"><span className="material-symbols-outlined text-[22px] text-slate-600 group-hover/hub:text-blue-600">{app.icon}</span></button>))}
                  <div className="w-px h-8 bg-slate-200 mx-2" />
                  <button className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:scale-110 transition-all shadow-lg"><span className="material-symbols-outlined text-[22px]">grid_view</span></button>
               </div>
            </>
         )}

         <WhiteboardPanel isOpen={isWhiteboardOpen} onClose={() => setIsWhiteboardOpen(false)} />
         <ArkleVoiceOrb isOpen={isLiveVoice} onClose={() => setIsLiveVoice(false)} isListening={true} msgs={msgs} />
      </div>
   );
}
