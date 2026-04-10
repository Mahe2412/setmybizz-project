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

/* --- BIZBOARD ADS DATA --- */
const ARCADE_SLIDES = [
  {
    id: 1,
    title: "Startup India: Premier Schemes",
    subtitle: "Launchpad for Bharat",
    desc: "Unlock ₹20Cr+ in seed funding, 100% tax exemptions for 3 years, and direct mentorship from NITI Aayog experts.",
    icon: "account_balance_wallet",
    image: "file:///C:/Users/mahen/.gemini/antigravity/brain/5d48074b-dd3d-45eb-8aff-e5ebecb8114c/startup_india_schemes_ad_1774098447874.png",
    color: "from-amber-950/80 to-slate-900/40",
    badge: "Government Protocol"
  },
  {
    id: 2,
    title: "Neobanking for Tech Founders",
    subtitle: "Finance Optimized by Arkle",
    desc: "Zero-fee international transactions, instant credit lines, and real-time expense classification. Built for unicorns.",
    icon: "payments",
    image: "file:///C:/Users/mahen/.gemini/antigravity/brain/5d48074b-dd3d-45eb-8aff-e5ebecb8114c/founder_banking_ad_1774098467020.png",
    color: "from-blue-950/80 to-slate-900/40",
    badge: "Fintech Elite"
  },
  {
    id: 3,
    title: "AP Innovation Hub: Visakhapatnam",
    subtitle: "Scaling the Local Vision",
    desc: "Join Asia's fastest-growing tech ecosystem. Connect with AP Innovation Society and Visakhapatnam mentors.",
    icon: "location_on",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc18a593?auto=format&fit=crop&q=80&w=1400",
    color: "from-teal-950/80 to-slate-900/40",
    badge: "Regional Powerhouse"
  },
  {
    id: 4,
    title: "India's Incubator Network",
    subtitle: "Ideation to IPO",
    desc: "Direct applications to T-Hub, NSRCEL, and IIT Hubs. Arkle streamlines your journey to the premier accelerators.",
    icon: "rocket_launch",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1400",
    color: "from-indigo-950/80 to-slate-900/40",
    badge: "Digital Bharat"
  }
];

const ARKLE_MODES = [
  "Arkle Co-founder", "Go Global", "Legal", "Incorporation", "Marketing", "Gst", "Finance", 
  "CA", "CS", "Agreements draft", "Banking", "Commerce", "Supply Chain", "Strategy", "Schedules", "Networking"
];

const NEURAL_COMMANDS = [
  "gst and bills", "stocks", "us market", 
  "Sell on Amazon", "Sales Tax Setup", 
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

import ArkleVoiceOrb from './ArkleVoiceOrb';

export default function HomeTab({ data }: { data: any }) {
  const [msgs, setMsgs] = useState<Message[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: `👋 Hello Mahendra! I am your AI Co-founder for **${data?.name || 'your venture'}**. I am synchronized and ready to build. How shall we begin today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMode, setActiveMode] = useState("Arkle Co-founder");
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
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
  const fileRef    = useRef<HTMLInputElement>(null);
  const bizBoardRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const bName = data?.name || "New Venture";
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [isMarketplaceSection, setIsMarketplaceSection] = useState(false);
  const [isLiveVoice, setIsLiveVoice] = useState(false);
  const [isAiTalking, setIsAiTalking] = useState(false);

  // ── Auto-Expand Textarea Logic ─────────────────────────────────────────────
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  // ── Neural Voice System (Live Conversation) ─────────────────────────────────
  const speakResponse = (text: string) => {
    const synth = window.speechSynthesis;
    setIsAiTalking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    utterance.voice = voices.find(v => v.lang === 'en-IN') || voices[0];
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    
    utterance.onend = () => {
      setIsAiTalking(false);
      if (isLiveVoice) startListening();
    };
    
    synth.speak(utterance);
  };

  const startListening = () => {
    const recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!recognition) return;

    const rec = new recognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-IN';

    rec.onstart = () => {
       console.log("ARKIA is listening...");
    };

    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };

    rec.onerror = () => {
      if (isLiveVoice) setIsLiveVoice(false);
    };

    rec.start();
  };

  const toggleLiveVoice = () => {
    if (isLiveVoice) {
      window.speechSynthesis.cancel();
      setIsLiveVoice(false);
    } else {
      setIsLiveVoice(true);
      speakResponse(`Welcome back Mahendra. Arkle is online and ready for your mission directives for ${bName}.`);
    }
  };
  const handleModeSelect = (mode: string) => {
     setActiveMode(mode);
     setShowModeSelector(false);
     setMsgs(prev => [...prev, {
       id: Date.now().toString(),
       role: 'assistant',
       content: `Activated **${mode}** mode. How can I assist you with your business goals today?`,
       timestamp: new Date()
     }]);
  };

  const sendMessage = useCallback(async (text = input) => {
    const q = text.trim();
    if (!q || loading) return;
    
    setInput('');
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: q, timestamp: new Date() };
    setMsgs(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          messages: msgs.map(m => ({ role: m.role, content: m.content })),
          context: {
            businessName: bName,
            currentDashboard: 'neural',
            activeMode
          }
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const aiRes: Message = { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: data.text, 
        timestamp: new Date() 
      };
      setMsgs(prev => [...prev, aiRes]);
      
      // TRIGGER VOICE RESPONSE IF LIVE MODE IS ON
      if (isLiveVoice) {
         speakResponse(data.text);
      }

    } catch (error: any) {
      console.error("ARKIA Brain Sync Error:", error);
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `❌ Brain Sync Error: ${error.message}. Please check your connection or API configuration.`,
        timestamp: new Date()
      };
      setMsgs(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, msgs, activeMode, bName]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, loading]);

  const scrollToBizBoard = () => {
    bizBoardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsMarketplaceSection(scrollTop > 500);
  };

  return (
    <div onScroll={onScroll} className="flex h-full bg-[#f8fafc] overflow-y-auto font-sans relative no-scrollbar scroll-smooth">
      {/* Strategic Sidebar - Lite */}
      <motion.div 
        animate={{ 
          width: (isSidebarOpen && !isMarketplaceSection) ? 182 : 0, 
          opacity: (isSidebarOpen && !isMarketplaceSection) ? 1 : 0 
        }}
        className="h-full sticky top-0 bg-slate-50 border-r border-slate-200 overflow-hidden flex flex-col shrink-0 z-20"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
               <span className="material-symbols-outlined text-white text-[18px]">hub</span>
            </div>
            <div>
               <h1 className="text-slate-900 font-black text-[11px] uppercase tracking-widest leading-none">Arkle OS</h1>
               <p className="text-slate-400 text-[6px] font-black uppercase mt-1 italic">Neural Loop</p>
            </div>
          </div>

          <div className="space-y-2 mb-8">
             <button onClick={() => setMsgs([])} className="w-full flex items-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 p-3 rounded-xl transition-all shadow-sm">
               <span className="material-symbols-outlined text-slate-400 text-[14px]">add_comment</span>
               <span className="text-slate-900 font-bold text-[8px] uppercase tracking-widest">New Session</span>
             </button>
             <button onClick={scrollToBizBoard} className="w-full flex items-center gap-2 bg-slate-900 hover:bg-slate-800 p-3 rounded-xl transition-all shadow-xl">
               <span className="material-symbols-outlined text-white/50 text-[14px]">campaign</span>
               <span className="text-white font-bold text-[8px] uppercase tracking-widest">Biz Spotlight</span>
             </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar pr-1 px-1">
             <div className="space-y-4">
                <header className="px-1"><h3 className="text-slate-400 text-[7px] font-black uppercase tracking-[0.3em]">Business Threads</h3></header>
                <div className="space-y-1.5">
                   {projects.map(p => (
                      <div key={p.id} className="relative group">
                        <button className="w-full p-2.5 rounded-xl bg-white border border-slate-100 hover:border-sky-500 hover:bg-sky-50 transition-all text-left shadow-sm">
                           <p className="text-slate-700 font-bold text-[9px] truncate transition-all leading-none">{p.title}</p>
                           <p className="text-slate-300 text-[6px] font-black uppercase mt-1.5 italic">{p.date}</p>
                        </button>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Main Container - Scrollable sections */}
      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-y-auto no-scrollbar scroll-smooth">
        
          <div className="h-16 border-b border-slate-100 px-8 flex items-center justify-between bg-white sticky top-0 z-50">
            <div className="flex items-center gap-6">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                <span className="material-symbols-outlined text-[20px]">{isSidebarOpen ? 'menu_open' : 'menu'}</span>
              </button>
              <h2 className="text-slate-900 font-black text-[16px] tracking-tight uppercase">{bName} • Arkle Advisor</h2>
            </div>
            <button onClick={scrollToBizBoard} className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 hover:bg-slate-100 transition-all shadow-sm shrink-0 whitespace-nowrap">
               <span className="material-symbols-outlined text-[16px] text-slate-400">shopping_cart</span>
               <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Biz Marketplace</span>
            </button>
          </div>

          <div className="flex-1 px-4 md:px-10 py-10 no-scrollbar">
            <div className="max-w-[1240px] mx-auto w-full space-y-12">
              <AnimatePresence mode="popLayout">
                 {msgs.map((msg) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-8 rounded-[40px] text-[18px] leading-relaxed max-w-[95%] font-medium shadow-sm border ${msg.role === 'user' ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/10' : 'bg-slate-50 text-slate-900 border-slate-200'}`}>
                       {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={scrollRef} />
            </div>
          </div>

          <div className="p-8 pb-12 bg-white border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
            <div className="max-w-[1000px] mx-auto space-y-8">
              {/* Context Quick-Actions */}
               <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                  {NEURAL_COMMANDS.map((cmd, i) => (
                     <button key={i} onClick={() => sendMessage(cmd)} className="px-6 py-3 whitespace-nowrap bg-white border border-slate-200 rounded-2xl text-[12px] font-black uppercase text-slate-500 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50/50 transition-all shadow-xs">
                       {cmd}
                     </button>
                  ))}
               </div>

              {/* Professional Industry-Standard AI Chat Box (Clean, Single Container) */}
              {/* Professional Industry-Standard AI Chat Box (Clean, Single Container) */}
              {/* Professional Industry-Standard AI Chat Box (Clean, Single Container) */}
              {/* Professional Industry-Standard AI Chat Box (Clean, Single Container) */}
              <div className="max-w-4xl mx-auto w-full bg-white border border-slate-200 rounded-[32px] shadow-2xl transition-all flex flex-col overflow-hidden relative min-h-[140px] justify-center">
                
                <AnimatePresence mode="wait">
                  {!isLiveVoice ? (
                    <motion.div 
                      key="text-input"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col w-full"
                    >
                      <textarea 
                        ref={textAreaRef}
                        value={input} 
                        onChange={e => setInput(e.target.value)} 
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        rows={2}
                        className="w-full bg-transparent border-none outline-none focus:ring-0 text-slate-900 text-[18px] font-medium p-8 pb-2 resize-none max-h-[400px] min-h-[80px] no-scrollbar relative z-10" 
                        placeholder="Tell Arkle about your next business move..." 
                      />
                      
                      <div className="flex items-center justify-between p-4 px-8 select-none relative z-10">
                        <div className="flex items-center gap-4">
                          <button onClick={() => fileRef.current?.click()} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-blue-600 hover:bg-slate-50 transition-all">
                            <span className="material-symbols-outlined text-[24px]">add_circle</span>
                          </button>
                          
                          <div className="relative">
                            <button onClick={() => setShowModeSelector(!showModeSelector)} className="flex items-center gap-2 bg-slate-900 h-10 px-6 rounded-full hover:bg-blue-600 transition-all shadow-xl group">
                              <span className="material-symbols-outlined text-[16px] text-blue-400 group-hover:text-white">psychology</span>
                              <span className="text-white font-black text-[9px] uppercase tracking-widest leading-none">{activeMode}</span>
                            </button>
                            <AnimatePresence>
                              {showModeSelector && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-12 left-0 w-64 bg-slate-900 text-white rounded-[28px] shadow-2xl py-4 z-50 border border-white/10 overflow-hidden">
                                   <div className="max-h-60 overflow-y-auto no-scrollbar scroll-smooth px-2">
                                      {ARKLE_MODES.map(m => (
                                        <button key={m} onClick={() => handleModeSelect(m)} className="w-full text-left px-6 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 rounded-2xl transition-all">{m}</button>
                                      ))}
                                   </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <div className="flex items-center gap-5">
                          <button onClick={toggleLiveVoice} className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
                            <span className="material-symbols-outlined text-[26px]">mic</span>
                          </button>
                          <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl ${!input.trim() || loading ? 'bg-slate-50 text-slate-200' : 'bg-slate-900 text-white hover:bg-blue-600 active:scale-90'}`}>
                            <span className="material-symbols-outlined text-[24px]">arrow_upward</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="voice-mode"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="w-full py-10 flex flex-col items-center justify-center gap-8 bg-slate-50/10"
                    >
                      {/* IN-PLACE NEURAL ORB */}
                      <div className="relative group cursor-pointer" onClick={toggleLiveVoice}>
                        <motion.div 
                          animate={{ 
                            scale: isAiTalking ? [1, 1.4, 1] : [1, 1.2, 1], 
                            opacity: isAiTalking ? [0.2, 0.5, 0.2] : [0.1, 0.3, 0.1] 
                          }}
                          transition={{ duration: isAiTalking ? 1 : 2, repeat: Infinity }}
                          className="absolute inset-0 bg-blue-500 rounded-full blur-3xl -m-10"
                        />
                        <motion.div 
                          animate={{ 
                            borderRadius: ["40% 60% 70% 30%", "60% 40% 30% 70%", "40% 60% 70% 30%"],
                            rotate: [0, 90, 0],
                            scale: isAiTalking ? [1, 1.1, 1] : 1
                          }} 
                          transition={{ 
                            duration: isAiTalking ? 3 : 6, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          }}
                          className="w-28 h-28 md:w-32 md:h-32 bg-linear-to-tr from-blue-600 via-indigo-400 to-cyan-300 shadow-[0_0_50px_rgba(59,130,246,0.6)] backdrop-blur-xl border border-white/50 flex flex-col items-center justify-center overflow-hidden"
                        >
                           <span className="material-symbols-outlined text-white text-[40px] drop-shadow-lg">
                             {isAiTalking ? 'volume_up' : 'graphic_eq'}
                           </span>
                        </motion.div>
                      </div>
                      
                      <div className="text-center space-y-2">
                        <p className={`font-black text-[12px] uppercase tracking-[0.3em] ${isAiTalking ? 'text-indigo-600 animate-bounce' : 'text-blue-600 animate-pulse'}`}>
                          {isAiTalking ? 'Arkle is Responding' : 'Neural Link Active'}
                        </p>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest px-10">
                          {isAiTalking ? 'Synthesizing strategy directive...' : 'Speak now to interact with Arkle'}
                        </p>
                      </div>

                      <button onClick={toggleLiveVoice} className="px-6 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg hover:bg-red-500 transition-all">
                        Exit Voice Mode
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        {/* SECTION 2: NEURAL WHITEBOARD (Immediate Actions) */}
        <div className="bg-white border-t border-slate-100">
           {/* Whiteboard Toggle Bar */}
           <button 
             onClick={() => setIsWhiteboardOpen(!isWhiteboardOpen)}
             className="w-full px-6 md:px-12 py-5 flex items-center justify-between hover:bg-slate-50 transition-all border-b border-slate-100 bg-white sticky top-0 z-30"
           >
              <div className="flex items-center gap-4">
                 <div className={`w-3 h-3 rounded-full ${isWhiteboardOpen ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} />
                 <h3 className="text-slate-900 font-black text-[12px] uppercase tracking-[0.25em]">Neural Whiteboard • Executive Scan</h3>
                 {!isWhiteboardOpen && <span className="hidden md:inline-block text-[10px] font-black text-red-500 bg-red-50 px-2 py-1 rounded-md border border-red-100 uppercase tracking-widest">3 Actions Pending</span>}
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">{isWhiteboardOpen ? 'Close' : 'Expand'}</span>
                 <span className="material-symbols-outlined text-slate-400 transition-transform duration-500" style={{ transform: isWhiteboardOpen ? 'rotate(180deg)' : 'rotate(0)' }}>expand_more</span>
              </div>
           </button>

           <AnimatePresence>
             {isWhiteboardOpen && (
               <motion.div 
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: 'auto', opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 className="overflow-hidden bg-slate-50/30"
               >
                 <div className="px-6 md:px-12 py-10 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="bg-white border border-slate-200 p-6 rounded-[32px] group hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/5 transition-all cursor-pointer relative overflow-hidden">
                          <div className="flex items-center gap-3 mb-4">
                             <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px] text-red-500">warning</span>
                             </div>
                             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Compliance</span>
                          </div>
                          <p className="text-[14px] font-bold text-slate-800 leading-relaxed">GSTR-1 filing is overdue. Mahendra, penalty risks detected.</p>
                          <button className="mt-6 w-full text-[10px] font-black text-white bg-slate-900 py-3 rounded-2xl uppercase tracking-widest hover:bg-blue-600 transition-all">Resolve Now</button>
                       </div>
                       
                       <div className="bg-white border border-slate-200 p-6 rounded-[32px] group hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/5 transition-all cursor-pointer">
                          <div className="flex items-center gap-3 mb-4">
                             <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px] text-emerald-500">person_add</span>
                             </div>
                             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">CRM Update</span>
                          </div>
                          <p className="text-[14px] font-bold text-slate-800 leading-relaxed">3 new founders joined via your networking link.</p>
                          <button className="mt-6 w-full text-[10px] font-black text-blue-600 border border-blue-100 bg-white py-3 rounded-2xl uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">View Profiles</button>
                       </div>

                       <div className="bg-white border border-slate-200 p-6 rounded-[32px] group hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/5 transition-all cursor-pointer">
                          <div className="flex items-center gap-3 mb-4">
                             <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px] text-blue-500">payments</span>
                             </div>
                             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Vitals</span>
                          </div>
                          <p className="text-[14px] font-bold text-slate-800 leading-relaxed">Weekly sales are up 12%. New target: ₹5L milestone.</p>
                          <div className="mt-8">
                             <div className="flex justify-between mb-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">65%</span>
                             </div>
                             <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 1.5 }} className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* SECTION 3: BIZBOARD ADS PAGE (75% SCREEN HEIGHT FOCUS BELOW CHAT) */}
        <div ref={bizBoardRef} className="min-h-[90vh] p-12 lg:p-20 bg-slate-50/50 flex flex-col justify-center border-t border-slate-200">
           <div className="max-w-7xl mx-auto w-full">
              <header className="flex items-center justify-between mb-12 px-6">
                 <div className="space-y-1">
                    <h3 className="text-slate-900 font-black text-[24px] uppercase tracking-[0.2em] flex items-center gap-3">
                       <span className="material-symbols-outlined text-orange-500 text-[32px]">flare</span> BizBoard Spotlight
                    </h3>
                    <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mt-1">Virtual Commercials for Business Growth & Ecosystems</p>
                 </div>
                 <div className="flex gap-3">
                    {ARCADE_SLIDES.map((_, i) => (
                       <button 
                         key={i} 
                         onClick={() => setCurrentSlide(i)}
                         className={`w-4 h-4 rounded-full transition-all duration-500 ${currentSlide === i ? 'bg-slate-900 w-16 shadow-xl shadow-slate-900/20' : 'bg-slate-200'}`} 
                       />
                    ))}
                 </div>
              </header>

              <div className="relative h-[650px] rounded-[60px] overflow-hidden shadow-[0_80px_160px_-40px_rgba(0,0,0,0.2)] group border-8 border-white/50">
                 <AnimatePresence mode="wait">
                    <motion.div 
                      key={currentSlide}
                      initial={{ opacity: 0, x: 50, scale: 0.98 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -50, scale: 1.02 }}
                      transition={{ duration: 0.8, ease: "anticipate" }}
                      className={`absolute inset-0 bg-linear-to-br ${ARCADE_SLIDES[currentSlide].color} flex items-center`}
                    >
                      <div className="absolute inset-0">
                        <img src={ARCADE_SLIDES[currentSlide].image} className="w-full h-full object-cover mix-blend-overlay opacity-50 grayscale group-hover:grayscale-0 transition-all duration-[2000ms]" alt="biz ad" />
                        <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-950/30 to-transparent" />
                      </div>

                      <div className="relative z-10 px-20 lg:px-32 flex flex-col justify-center h-full w-full">
                         <div className="max-w-4xl space-y-12">
                            <motion.div 
                              initial={{ y: 20, opacity: 0 }} 
                              animate={{ y: 0, opacity: 1 }} 
                              transition={{ delay: 0.2 }} 
                              className="inline-flex items-center gap-4 px-10 py-4 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20 shadow-2xl"
                            >
                               <span className="material-symbols-outlined text-white text-[20px]">verified_user</span>
                               <span className="text-[12px] font-black tracking-[0.3em] uppercase text-white">{ARCADE_SLIDES[currentSlide].badge}</span>
                            </motion.div>
                            
                            <div className="space-y-2">
                               <motion.h4 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-white/50 text-[20px] font-black uppercase tracking-[0.6em]">{ARCADE_SLIDES[currentSlide].subtitle}</motion.h4>
                               <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-white text-[64px] lg:text-[84px] font-black leading-none tracking-tighter uppercase drop-shadow-2xl">{ARCADE_SLIDES[currentSlide].title}</motion.h2>
                            </div>

                            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-white/60 text-[22px] lg:text-[24px] leading-relaxed max-w-3xl font-medium drop-shadow-lg">{ARCADE_SLIDES[currentSlide].desc}</motion.p>
                            
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-center gap-10 pt-4">
                               <button className="px-16 py-8 bg-white text-slate-900 rounded-[35px] text-[14px] font-black uppercase tracking-[0.2em] hover:scale-110 active:scale-95 transition-all shadow-2xl flex items-center gap-5 group/btn">
                                  Access Feature <span className="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">east</span>
                               </button>
                               <div className="flex gap-4">
                                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white scale-90 hover:scale-110 transition-all">
                                     <span className="material-symbols-outlined text-[28px]">{ARCADE_SLIDES[currentSlide].icon}</span>
                                  </div>
                               </div>
                            </motion.div>
                         </div>
                      </div>
                    </motion.div>
                 </AnimatePresence>

                 <button onClick={() => setCurrentSlide((currentSlide - 1 + ARCADE_SLIDES.length) % ARCADE_SLIDES.length)} className="absolute left-10 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all z-20 group">
                    <span className="material-symbols-outlined text-[32px] group-active:-translate-x-2 transition-transform">west</span>
                 </button>
                 <button onClick={() => setCurrentSlide((currentSlide + 1) % ARCADE_SLIDES.length)} className="absolute right-10 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all z-20 group">
                    <span className="material-symbols-outlined text-[32px] group-active:translate-x-2 transition-transform">east</span>
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* QUICK TRAY (Lite Theme) */}
      <div className="h-full w-[76px] bg-slate-50 border-l border-slate-200 flex flex-col items-center py-8 shrink-0 relative z-40">
        <div className="flex flex-col gap-6 items-center">
           {QUICK_TRAY_APPS.map(app => (
              <button key={app.id} className={`w-14 h-14 rounded-[20px] bg-white border border-slate-100 flex items-center justify-center shadow-lg relative group transition-all hover:scale-110 active:scale-90 ${app.color}`}>
                 <span className="material-symbols-outlined text-[24px]">{app.icon}</span>
                 {app.count && <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-slate-50">{app.count}</span>}
                 <span className="absolute right-20 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap shadow-2xl">
                    {app.label}
                 </span>
              </button>
           ))}
        </div>
        <div className="mt-auto flex flex-col gap-4 items-center">
           <button className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center animate-bounce shadow-xl">
              <span className="material-symbols-outlined">flash_on</span>
           </button>
           <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
        </div>
      </div>
      {/* NEURAL VOICE ORB (Live Mode) */}
      <ArkleVoiceOrb 
        isOpen={isLiveVoice} 
        onClose={() => { window.speechSynthesis.cancel(); setIsLiveVoice(false); }} 
        isListening={!isAiTalking && !loading}
        msgs={msgs}
      />
    </div>
  );
}
