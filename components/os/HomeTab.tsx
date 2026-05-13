'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WhiteboardPanel from './WhiteboardPanel';
import BizboardSpotlight from './launchpad/LaunchPadSpotlight';
import { useBizStore } from '../../lib/useBizStore';
import RightQuickTray from './RightQuickTray';
import { useAuth } from '@/context/AuthContext';

type Message = {
   id: string;
   role: 'user' | 'assistant';
   content: string;
   timestamp: Date;
};

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
   const { dbUser, dbBusiness } = useAuth();
   const { whiteboardOpen: isWhiteboardOpen, setWhiteboardOpen: setIsWhiteboardOpen, conversationMode, setConversationMode, setSidebarOpen, performanceGaps } = useBizStore();
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

   const [showSuggestions, setShowSuggestions] = useState(false);
   const [suggestions] = useState(['BizDesk', 'Marketing', 'LaunchPad', 'Workspace', 'Agents', 'Legal', 'Vault', 'Market']);
   const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

   const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setInput(val);

      // Suggestion Logic
      const lastWord = val.split(/\s/).pop() || '';
      if (lastWord.startsWith('@')) {
         const query = lastWord.slice(1).toLowerCase();
         const filtered = suggestions.filter(s => s.toLowerCase().includes(query));
         setFilteredSuggestions(filtered);
         setShowSuggestions(filtered.length > 0);
      } else {
         setShowSuggestions(false);
      }

      if (textareaRef.current) {
         textareaRef.current.style.height = 'auto';
         textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
      }
   };

   const selectSuggestion = (s: string) => {
      const words = input.split(/\s/);
      words.pop(); // Remove the @query
      const newVal = [...words, `@${s.toLowerCase()}`].join(' ').trim() + ' ';
      setInput(newVal);
      setShowSuggestions(false);
      // Map BizDesk to BizBook context
      setSelectedContext(s === 'BizDesk' ? 'BizBook' : s === 'Marketing' ? 'Global Market' : s);
      textareaRef.current?.focus();
   };

   const nextTiles = () => { if (tileIndex + 4 < QUICK_TILES.length) setTileIndex(tileIndex + 1); };
   const prevTiles = () => { if (tileIndex > 0) setTileIndex(tileIndex - 1); };

   const sendMessage = useCallback(async (text = input) => {
      const q = text.trim();
      if (!q || loading) return;

      // @Mention Context Detection
      let finalPrompt = q;
      const mentionMatch = q.match(/@(\w+)/);
      if (mentionMatch) {
         const mention = mentionMatch[1].toLowerCase();
         const contextMap: { [key: string]: string } = {
            'bizdesk': 'BizBook',
            'marketing': 'Global Market',
            'launchpad': 'Launch Pad',
            'workspace': 'Workspace',
            'agents': 'Agent Mode',
            'brain': 'Arkle Brain'
         };

         if (contextMap[mention]) {
            setSelectedContext(contextMap[mention]);
            // Remove the @mention from the prompt to keep it clean for the AI
            finalPrompt = q.replace(`@${mention}`, '').trim();
         }
      }

      setConversationMode(true);
      setSidebarOpen(false);

      setInput('');
      setMsgs(prev => [...prev, { id: Date.now().toString(), role: 'user', content: q, timestamp: new Date() }]);
      setLoading(true);
      try {
         const resp = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               prompt: finalPrompt,
               context: selectedContext, // Send the selected context to the API
               businessProfile: {
                   registeredId: dbUser?.registeredId || 'Pending',
                   businessName: dbBusiness?.business_name || data?.name || 'My Startup',
                   industry: dbBusiness?.industry || data?.sector || 'General Business',
                   performanceGaps: performanceGaps
               },
               messages: msgs.map(m => ({ role: m.role, content: m.content }))
            })
         });
         const resData = await resp.json();
         setMsgs(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: resData.text, timestamp: new Date() }]);
      } catch (e) { console.error(e); } finally { setLoading(false); }
   }, [input, loading, msgs, setConversationMode, setSidebarOpen, selectedContext, dbUser, dbBusiness, performanceGaps, data]);

   useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

   useEffect(() => {
      if (conversationMode) {
         setSidebarOpen(false);
      }
   }, [conversationMode, setSidebarOpen]);

   return (
      <div className="flex h-full bg-[#f8fafc] overflow-hidden relative no-scrollbar font-sans">
         {/* SIDEBAR (Hidden in Conversation Mode) */}
         <AnimatePresence>
            {!conversationMode && (
               <motion.div
                  key="arkle-sidebar"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: isSidebarOpen ? 280 : 78, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onMouseEnter={() => setIsSidebarOpenLocal(true)}
                  onMouseLeave={() => setIsSidebarOpenLocal(false)}
                  className="arkle-sidebar h-full bg-white border-r border-slate-100 flex flex-col shrink-0 z-[100] shadow-2xl shadow-slate-200/50 overflow-hidden"
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
         </AnimatePresence>

         {/* MAIN CONTENT */}
         <div className="flex-1 flex flex-col min-w-0 bg-white overflow-y-auto scrollbar-hide relative pb-40">
            <div className="h-16 border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-50 bg-white/80 backdrop-blur-md">
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Neural Core Active</span>
               {conversationMode && (
                  <button
                     onClick={() => { setConversationMode(false); setSidebarOpen(true); }}
                     className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10"
                     title="Exit Conversation"
                  >
                     <span className="material-symbols-rounded text-[20px]">close</span>
                  </button>
               )}
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

               {conversationMode && (
                  <div className="w-full max-w-[950px] mx-auto space-y-8 mt-8 mb-40 overflow-y-auto pr-4 no-scrollbar flex-1">
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

               <div className={`w-full transition-all duration-500 z-50 ${conversationMode ? 'fixed bottom-6 left-1/2 -translate-x-1/2 max-w-[950px] px-4' : 'max-w-[850px] mx-auto'}`}>

                  {/* Suggestions Menu */}
                  <AnimatePresence>
                     {showSuggestions && (
                        <motion.div
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: 10 }}
                           className="absolute bottom-full mb-4 left-0 w-64 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl p-2 z-[100]"
                        >
                           <div className="px-3 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1">Mention Topic</div>
                           {filteredSuggestions.map(s => (
                              <button
                                 key={s}
                                 onClick={() => selectSuggestion(s)}
                                 className="w-full text-left p-3 rounded-2xl hover:bg-blue-600 hover:text-white text-[11px] font-bold transition-all flex items-center gap-3 group"
                              >
                                 <span className="material-symbols-rounded text-[18px] opacity-50 group-hover:opacity-100">alternate_email</span>
                                 {s}
                              </button>
                           ))}
                        </motion.div>
                     )}
                  </AnimatePresence>

                  <div className="flex items-center ml-0 gap-0 mb-[-4px] relative z-20">
                     <button onClick={() => setActiveChatTab('ask')} className={`w-[105px] h-[33px] flex items-center justify-center transition-all duration-300 font-black relative z-30 ${activeChatTab === 'ask' ? 'rounded-tr-[20px] rounded-tl-none rounded-b-none bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_-5px_15px_rgba(124,58,237,0.25)]' : 'rounded-none bg-transparent text-slate-400 hover:text-slate-600'}`}><span className="relative z-10 uppercase tracking-[0.2em] text-[10px]">Ask</span></button>
                     <button onClick={() => setActiveChatTab('agents')} className={`w-[105px] h-[33px] flex items-center justify-center transition-all duration-300 font-black relative z-30 ${activeChatTab === 'agents' ? 'rounded-tl-[20px] rounded-tr-none rounded-b-none bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_-5px_15px_rgba(124,58,237,0.25)]' : 'rounded-none bg-transparent text-slate-400 hover:text-slate-600'}`}><span className="relative z-10 uppercase tracking-[0.2em] text-[10px]">Agent</span></button>
                  </div>
                  <div className="relative p-[4px] rounded-tr-[42px] rounded-br-[42px] rounded-bl-[42px] rounded-tl-none bg-gradient-to-r from-purple-600 via-rose-500 to-indigo-600 shadow-[0_30px_70px_-20px_rgba(79,70,229,0.25)] z-10">
                     {/* Arkle Voice Trigger - Animated & Draggable Bubble */}
                     <motion.div
                        drag
                        dragMomentum={false}
                        className="absolute -top-16 left-1/2 -translate-x-1/2 z-40 cursor-grab active:cursor-grabbing"
                     >
                        <motion.div
                           whileHover={{ scale: 1.1, y: -3 }}
                           whileTap={{ scale: 0.9 }}
                           onClick={() => useBizStore.getState().setIsVoiceActive(true)}
                           className="relative flex flex-col items-center group cursor-pointer"
                        >
                           <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center shadow-2xl border-2 border-white/20 relative overflow-hidden">
                              {/* Hyper-Realistic Liquid Background (Screenshot Match) */}
                              <div className="absolute inset-0 overflow-hidden opacity-90">
                                 <div className="absolute inset-[-20%] bg-blue-600/30 animate-liquid [animation-duration:5s] mix-blend-screen blur-[45px] scale-150"></div>
                                 <div className="absolute inset-[-30%] bg-indigo-600/30 animate-liquid [animation-duration:8s] [animation-delay:-1s] mix-blend-screen blur-[55px] scale-125"></div>
                                 <div className="absolute inset-[-25%] bg-violet-600/30 animate-liquid [animation-duration:11s] [animation-delay:-3s] mix-blend-screen blur-[65px] scale-150"></div>
                                 <div className="absolute inset-[-40%] bg-cyan-400/20 animate-liquid [animation-duration:14s] [animation-delay:-5s] mix-blend-screen blur-[75px] scale-175"></div>
                              </div>

                              {/* The Central Liquid Morphing Blob */}
                              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full scale-[1.3] z-10 opacity-70 mix-blend-overlay">
                                 <defs>
                                    <linearGradient id="homeOrbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                       <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 0.8 }} />
                                       <stop offset="100%" style={{ stopColor: '#4f46e5', stopOpacity: 0.8 }} />
                                    </linearGradient>
                                 </defs>
                                 <motion.path
                                    animate={{
                                       d: [
                                          "M100,10 Q160,10 180,80 T160,160 T100,190 T40,160 T20,80 T100,10",
                                          "M100,20 Q170,10 190,90 T170,170 T100,180 T30,170 T10,90 T100,20",
                                          "M100,10 Q160,10 180,80 T160,160 T100,190 T40,160 T20,80 T100,10"
                                       ]
                                    }}
                                    transition={{
                                       duration: 3,
                                       repeat: Infinity,
                                       ease: "easeInOut"
                                    }}
                                    fill="url(#homeOrbGrad)"
                                 />
                              </svg>
                              
                              {/* Heart Pulse (Screenshot Match: 4-bar Equalizer) */}
                              <div className="relative z-20 w-full h-full flex items-center justify-center">
                                 <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-md animate-ping"></div>
                                 
                                 <div className="flex items-center gap-1 h-6 relative z-10">
                                     {[1, 2, 3, 4].map((i) => (
                                         <div 
                                             key={i} 
                                             className="w-1 bg-white rounded-full animate-voice-wave shadow-[0_0_8px_rgba(255,255,255,0.6)]" 
                                             style={{ 
                                                 height: i === 1 || i === 4 ? '60%' : '100%',
                                                 animationDelay: `${i * 0.15}s` 
                                             }}
                                         ></div>
                                     ))}
                                 </div>
                              </div>
                           </div>

                           {/* Quick Command Sticker Popup (Home Match) */}
                           <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.4)] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:-translate-y-0 z-50">
                               <button 
                                   onClick={(e) => { e.stopPropagation(); useBizStore.getState().setIsMuted(!useBizStore.getState().isMuted); }}
                                   className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${useBizStore.getState().isMuted ? 'text-orange-400 bg-orange-400/10' : 'text-white hover:bg-white/10'}`}
                               >
                                   <span className="material-symbols-rounded text-[18px]">{useBizStore.getState().isMuted ? 'mic_off' : 'mic'}</span>
                               </button>
                               <button 
                                   onClick={(e) => { e.stopPropagation(); useBizStore.getState().setIsVoiceActive(false); }}
                                   className="w-9 h-9 rounded-xl flex items-center justify-center text-red-400 border border-red-400/20 hover:bg-red-500/20 transition-all"
                               >
                                   <span className="material-symbols-rounded text-[18px]">close</span>
                               </button>
                               <button 
                                   onClick={(e) => { e.stopPropagation(); useBizStore.getState().setIsPaused(!useBizStore.getState().isPaused); }}
                                   className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${useBizStore.getState().isPaused ? 'text-blue-400 bg-blue-400/10' : 'text-white hover:bg-white/10'}`}
                               >
                                   <span className="material-symbols-rounded text-[18px]">{useBizStore.getState().isPaused ? 'play_arrow' : 'pause'}</span>
                               </button>
                               {/* Arrow */}
                               <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900/95 border-r border-b border-white/20 rotate-45"></div>
                           </div>

                           <div className="mt-4 px-5 py-2 bg-white shadow-xl rounded-full border border-slate-100 opacity-0 group-hover:opacity-100 transition-all text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 whitespace-nowrap">Voice Mode Active</div>

                        </motion.div>
                     </motion.div>

                     <div className="bg-white rounded-tr-[39px] rounded-br-[39px] rounded-bl-[39px] rounded-tl-none flex flex-col overflow-visible">
                        <textarea ref={textareaRef} value={input} onChange={handleInput} rows={1} className="w-full bg-white border-none outline-none focus:outline-none focus:ring-0 text-slate-400 text-[18px] md:text-[21px] font-normal px-12 pt-10 pb-2 resize-none no-scrollbar placeholder:text-slate-300 placeholder:font-light rounded-[39px] min-h-[60px]" placeholder="Ask Arkle or type @topic for deep research..." />
                        <div className="flex items-center justify-between px-10 pb-6 pt-4 bg-white border-none rounded-b-[39px]">
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
                                 <motion.button
                                    key={tile.title}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all text-left group min-h-[144px] flex flex-col justify-between"
                                 >
                                    <div className="mb-3 text-slate-300 group-hover:text-blue-500 transition-colors">
                                       <span className="material-symbols-rounded text-[28px]">{tile.icon}</span>
                                    </div>
                                    <div>
                                       <h4 className="text-[12px] font-extrabold text-slate-900 mb-1 leading-tight uppercase tracking-tight">{tile.title}</h4>
                                       <p className="text-[10px] font-semibold text-slate-400 leading-tight uppercase tracking-wide opacity-70">{tile.desc}</p>
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

         {/* RIGHT QUICK TRAY - ALWAYS VISIBLE */}
         <RightQuickTray />

         {/* BOTTOM HUB - HIDE IN CONVERSATION MODE */}
         {!conversationMode && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-3 p-3 bg-white/70 backdrop-blur-2xl rounded-[32px] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:scale-105 transition-all duration-500">
               <div className="flex items-center gap-2 px-3 border-r border-slate-200 mr-2"><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /><span className="text-[9px] font-black uppercase tracking-widest text-slate-400">BizHub</span></div>
               {HUB_APPS.map(app => (<button key={app.id} className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group/hub"><span className="material-symbols-outlined text-[22px] text-slate-600 group-hover/hub:text-blue-600">{app.icon}</span></button>))}
               <div className="w-px h-8 bg-slate-200 mx-2" />
               <button className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:scale-110 transition-all shadow-lg"><span className="material-symbols-outlined text-[22px]">grid_view</span></button>
            </div>
         )}

         <WhiteboardPanel isOpen={isWhiteboardOpen} onClose={() => setIsWhiteboardOpen(false)} />
      </div>
   );
}
