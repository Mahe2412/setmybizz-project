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

export default function HomeTab() {
  const [msgs, setMsgs]             = useState<Message[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: "👋 Hello! Here is your quick business update for today.",
      timestamp: new Date()
    },
    {
      id: 'msg-2',
      role: 'assistant',
      content: "📄 This Month Market Plan.pdf\n\nI've formulated the latest market plan. It outlines our current growth strategies and upcoming campaigns.",
      timestamp: new Date()
    },
    {
      id: 'msg-3',
      role: 'assistant',
      content: "📅 Your Schedules and Tasks\n\n• 2:00 PM - Strategy Sync\n• 4:30 PM - Marketing Review\n• 5 pending tasks to clear this week.",
      timestamp: new Date()
    },
    {
      id: 'msg-4',
      role: 'assistant',
      content: "💳 Bills and Accounts\n\nAll main bills for the month are paid. You have 2 pending invoices (Software & Legal) for approval.",
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

  const bName = "TechNova Solutions Pvt Ltd";

  const handleModeSelect = (mode: string) => {
     setActiveMode(mode);
     setShowModeSelector(false);
     setMsgs([{
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
    setTimeout(() => {
       const aiRes: Message = { id: Date.now().toString(), role: 'assistant', content: "Strategizing solution... Analysis complete.", timestamp: new Date() };
       setMsgs(prev => [...prev, aiRes]);
       setLoading(false);
    }, 1000);
  }, [input, loading]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, loading]);

  const scrollToBizBoard = () => {
    bizBoardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex h-full bg-[#f8fafc] overflow-hidden font-sans">
      {/* Strategic Sidebar - Lite */}
      <motion.div 
        animate={{ width: isSidebarOpen ? 260 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="h-full bg-slate-50 border-r border-slate-200 overflow-hidden flex flex-col shrink-0 relative z-20"
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
        
        {/* SECTION 1: ARKLE AI CHAT PAGE (FULL SCREEN) */}
        <div className="min-h-full flex flex-col border-b border-slate-100">
          <div className="h-16 border-b border-slate-100 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-6">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                <span className="material-symbols-outlined text-[20px]">{isSidebarOpen ? 'menu_open' : 'menu'}</span>
              </button>
              <h2 className="text-slate-900 font-black text-[10px] tracking-widest uppercase">{bName} • Arkle Advisor</h2>
            </div>
            <button onClick={scrollToBizBoard} className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full flex items-center gap-2 hover:bg-slate-100 transition-all">
               <span className="material-symbols-outlined text-[14px] text-slate-400">arrow_downward</span>
               <span className="text-[8px] font-black text-slate-900 uppercase tracking-widest">Biz Marketplace</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 md:px-12 py-10 space-y-8 no-scrollbar">
            <div className="w-full flex flex-col items-center justify-center space-y-4 mt-4 mb-10 opacity-90">
               <span className="material-symbols-outlined text-[56px] text-[#0073ea] bg-[#0073ea]/10 p-5 rounded-full">psychology</span>
               <p className="text-[22px] font-black uppercase tracking-[0.15em] text-slate-800 text-center">I'm Arkle</p>
               <p className="text-[12px] font-bold uppercase tracking-widest text-slate-500 text-center">Your personal Business Advisor & Co-founder</p>
            </div>
            
            <AnimatePresence mode="popLayout">
               {msgs.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-6 rounded-[28px] text-[13px] leading-relaxed max-w-[80%] font-medium border shadow-sm whitespace-pre-line ${msg.role === 'user' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-100'}`}>
                     {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={scrollRef} />
          </div>

          <div className="p-10 pt-4 bg-white sticky bottom-0 border-t border-slate-50">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                 {NEURAL_COMMANDS.map((cmd, i) => (
                    <button key={i} onClick={() => sendMessage(cmd)} className="px-5 py-2 whitespace-nowrap bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black uppercase text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-all">{cmd}</button>
                 ))}
              </div>
              <div className="flex items-center gap-4 bg-white p-4 px-10 rounded-full border border-slate-200 shadow-2xl focus-within:ring-4 focus-within:ring-slate-900/5 transition-all">
                <button onClick={() => fileRef.current?.click()} className="text-slate-300 hover:text-slate-900"><span className="material-symbols-outlined text-[24px]">add_circle</span></button>
                <div className="relative">
                  <button onClick={() => setShowModeSelector(!showModeSelector)} className="flex items-center gap-2 bg-slate-50 h-10 px-5 rounded-full border border-slate-100 hover:bg-slate-100 transition-all">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">hub</span>
                    <span className="text-slate-900 font-black text-[9px] uppercase tracking-widest">{activeMode}</span>
                  </button>
                  <AnimatePresence>
                    {showModeSelector && (
                       <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute bottom-14 left-0 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden">
                          <div className="max-h-60 overflow-y-auto no-scrollbar">
                             {ARKLE_MODES.map(m => (
                               <button key={m} onClick={() => handleModeSelect(m)} className="w-full text-left px-5 py-3 text-[9px] font-black uppercase tracking-widest hover:bg-slate-50">{m}</button>
                             ))}
                          </div>
                       </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} className="flex-1 bg-transparent text-slate-800 text-[14px] font-bold outline-none placeholder-slate-300" placeholder="Type Mission objective..." />
                <button onClick={() => sendMessage()} className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all"><span className="material-symbols-outlined">arrow_upward</span></button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: BIZBOARD ADS PAGE (75% SCREEN HEIGHT FOCUS BELOW CHAT) */}
        <div ref={bizBoardRef} className="min-h-[90vh] p-12 lg:p-20 bg-white flex flex-col justify-center border-t border-slate-200">
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
    </div>
  );
}
