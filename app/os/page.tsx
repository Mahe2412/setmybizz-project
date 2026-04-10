'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { BIZ } from '@/lib/mockBizData';
import type { OsTab } from '@/components/os/shared';
import ArklePanel  from '@/components/os/ArklePanel';
import NotesAndTasksPanel from '@/components/os/NotesAndTasksPanel';
import HomeTab     from '@/components/os/HomeTab';
import CompanyTab  from '@/components/os/CompanyTab';
import BankingTab  from '@/components/os/BankingTab';
import GSTTab      from '@/components/os/GSTTab';
import ExpertsTab  from '@/components/os/ExpertsTab';
import RecordsTab  from '@/components/os/RecordsTab';
import GlobalTab   from '@/components/os/GlobalTab';
import NetworkingTab from '@/components/os/NetworkingTab';
import BharatSupportTab from '@/components/os/BharatSupportTab';
import MarketAccessTab from '@/components/os/MarketAccessTab';
import UserProfileTab from '@/components/os/UserProfileTab';
import SettingsTab from '@/components/os/SettingsTab';
import SellCommerceTab from '@/components/os/SellCommerceTab';
import SuppliersTab from '@/components/os/SuppliersTab';
import RetailerTab from '@/components/os/RetailerTab';
import LearnTab from '@/components/os/LearnTab';
import LaunchPadTab from '@/components/os/LaunchPadTab';
import Workspace from '@/components/dashboard/Workspace';

/* ───────────── SIDEBAR NAV CONFIG (BizDesk) ───────────── */
type SidebarSection = { section: string; items: { id: OsTab; icon: string; label: string; badge?: string }[] };

const BIZDESK_SIDEBAR: SidebarSection[] = [
  {
    section: 'NEURAL OPERATOR',
    items: [
      { id: 'home', icon: '🧠', label: 'Arkle Control', badge: 'Live' },
      { id: 'experts', icon: '⚡', label: 'Neural Automations', badge: 'New' },
    ],
  },
  {
    section: 'OPERATIONAL CORE',
    items: [
      { id: 'company',  icon: '🏢', label: 'Company Hub' },
      { id: 'gst',      icon: '⚖️', label: 'Legal & Compliance', badge: '⚠️' },
      { id: 'banking',  icon: '💳', label: 'Financial Desk' },
      { id: 'records',  icon: '📂', label: 'Neural Records' },
    ],
  },
  {
    section: 'EXPANSION ENGINE',
    items: [
      { id: 'sell-commerce', icon: '📦', label: 'Commerce OS' },
      { id: 'suppliers',     icon: '🏭', label: 'Supply Chain' },
      { id: 'retailer',      icon: '🏪', label: 'Retailer Matrix' },
      { id: 'global',        icon: '🌐', label: 'Global Gateway' },
    ],
  },
  {
    section: 'ARKLE ECOSYSTEM',
    items: [
      { id: 'experts',        icon: '👨‍💼', label: 'Expert Network' },
      { id: 'networking',     icon: '🤝', label: 'Founders Circle' },
      { id: 'bharat-support', icon: '🇮🇳', label: 'Bharat Startup' },
      { id: 'market-access',  icon: '💎', label: 'Arkle Apps' },
    ],
  },
];

const LAUNCHPAD_SIDEBAR: SidebarSection[] = [
  {
    section: 'BRAND ENGINES',
    items: [
      { id: 'launchpad', icon: '🎨', label: 'Logo Designer' },
      { id: 'launchpad', icon: '🌐', label: 'Domain Search' },
      { id: 'launchpad', icon: '💻', label: 'Website Builder' },
      { id: 'launchpad', icon: '📦', label: 'Brand Kits' },
    ],
  },
  {
    section: 'GROWTH ENGINES',
    items: [
      { id: 'launchpad', icon: '📊', label: 'Pitch Deck AI' },
      { id: 'launchpad', icon: '📱', label: 'SM Manager' },
      { id: 'launchpad', icon: '🔍', label: 'SEO Tools' },
    ],
  },
  {
    section: 'LEGAL ENGINES',
    items: [
      { id: 'gst', icon: '⚖️', label: 'Incorporation' },
      { id: 'gst', icon: '🛡️', label: 'Compliance' },
    ],
  },
];

const LEARN_SIDEBAR: SidebarSection[] = [
  {
    section: 'STUDIO',
    items: [
      { id: 'learn', icon: '🎓', label: 'Learner Studio' },
      { id: 'learn', icon: '🧬', label: 'Tech Adoption' },
    ],
  },
  {
    section: 'TRACKS',
    items: [
      { id: 'learn', icon: '📈', label: 'Business Growth' },
      { id: 'learn', icon: '🏢', label: 'MBA Mini' },
      { id: 'learn', icon: '👥', label: 'Leadership' },
    ],
  },
];

/* ───────────── TOP NAV CONFIG ───────────── */
type TopNavId = 'bizdesk' | 'launchpad' | 'learn' | 'ai-workspace';

const TOP_NAV: { id: TopNavId; label: string; icon: string; badge?: string; description: string }[] = [
  {
    id: 'bizdesk',
    label: 'Biz Desk',
    icon: 'home_work',
    description: 'Your entire company — one desk. Management, legal, compliance, finance, banking, hiring, scaling, and go-global support. Run your company from your desk.',
  },
  {
    id: 'launchpad',
    label: 'LaunchPad',
    icon: 'rocket_launch',
    badge: 'Beta',
    description: 'A rapid business builder. Build your brand, logo, website, pitch decks, and brochures without agencies or coding. Your AI Co-Founder builds everything through simple conversation.',
  },
  {
    id: 'learn',
    label: 'LearnHub',
    icon: 'school',
    badge: 'Beta',
    description: 'Skill upgradation and tech adoption center. Learn business strategy, marketing, compliance, and more.',
  },
  {
    id: 'ai-workspace',
    label: 'AI Workspace',
    icon: 'api',
    badge: 'Beta',
    description: 'Your tech automation control room. CRM, sales pipelines, WhatsApp campaigns, email automation, stock management, ERP — all AI-powered.',
  },
];

export default function OSPage() {
  const [activeTab, setActiveTab] = useState<OsTab>('home');
  const [arkleOpen, setArkleOpen] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTopNav, setActiveTopNav] = useState<TopNavId>('bizdesk');
  const [showLaunchPadFlow, setShowLaunchPadFlow] = useState(false);
  const [bizData, setBizData] = useState(BIZ);
  const [globalLang, setGlobalLang] = useState('en-IN');

  useEffect(() => {
    const saved = localStorage.getItem('setmybizz_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBizData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("OS Failed to load data", e);
      }
    }
  }, []);

  /* Smooth top nav transition handled by Framer Motion */
  const switchTopNav = useCallback((navId: TopNavId) => {
    if (navId === activeTopNav) return;
    setActiveTopNav(navId);
    if (navId === 'bizdesk') setActiveTab('home');
  }, [activeTopNav]);

  const buildServices = [
    { label: 'Logo Designer', icon: 'brush', bg: 'bg-orange-50', color: 'text-orange-500' },
    { label: 'Business Email', icon: 'mail', bg: 'bg-blue-50', color: 'text-blue-500' },
    { label: 'Domain Search', icon: 'language', bg: 'bg-indigo-50', color: 'text-indigo-500' },
    { label: 'Website Builder', icon: 'web', bg: 'bg-teal-50', color: 'text-teal-500' },
    { label: 'E-Store Setup', icon: 'shopping_cart', bg: 'bg-green-50', color: 'text-green-500' },
    { label: 'Product Copy', icon: 'edit_note', bg: 'bg-yellow-50', color: 'text-yellow-500' },
    { label: 'Brand Brochure', icon: 'folder_open', bg: 'bg-pink-50', color: 'text-pink-500' },
    { label: 'Product Catalogue', icon: 'menu_book', bg: 'bg-purple-50', color: 'text-purple-500' },
    { label: 'Digital Card', icon: 'badge', bg: 'bg-slate-100', color: 'text-slate-600' },
    { label: 'Pitch Deck AI', icon: 'slideshow', bg: 'bg-cyan-50', color: 'text-cyan-500' },
    { label: 'SM Manager', icon: 'share', bg: 'bg-rose-50', color: 'text-rose-500' },
    { label: 'AI Post Gen', icon: 'post_add', bg: 'bg-lime-50', color: 'text-lime-600' },
    { label: 'Brand Kits', icon: 'category', bg: 'bg-emerald-50', color: 'text-emerald-500' },
    { label: 'SEO Tools', icon: 'construction', bg: 'bg-sky-50', color: 'text-sky-500' },
  ];

  /* All flat items for drag logic */
  const allSidebarItems = BIZDESK_SIDEBAR.flatMap(s => s.items);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:4px}.fade-switch{animation:fadeSwitch .3s ease}@keyframes fadeSwitch{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* ═══════ TOP BAR ═══════ */}
      <header className="shrink-0 h-12 md:h-14 bg-white flex items-center justify-between px-3 md:px-4 gap-3 z-30 border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setSidebarOpen(o => !o)} 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100/80 active:scale-95 transition-all md:hidden" 
            title="Toggle Menu"
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
          <Link href="/" className="flex items-center gap-1.5 md:gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white bg-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.3)]">S</div>
            <span className="font-black text-slate-900 text-sm hidden sm:block">SetMyBizz</span>
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md ml-0.5 hidden sm:block bg-blue-50 text-blue-600 border border-blue-100">OS 4.4</span>
          </Link>
        </div>

        {/* ─── TOP NAV BUTTONS (Mobile & Desktop) ─── */}
        <div className="flex flex-1 items-center justify-center gap-2 md:gap-3 px-2">
          {TOP_NAV.map(nav => (
            <button
              key={nav.id}
              onClick={() => switchTopNav(nav.id)}
              className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-[11px] md:text-[13px] font-bold transition-all whitespace-nowrap border ${
                activeTopNav === nav.id
                  ? 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] text-blue-600 border-slate-200 scale-105'
                  : 'text-slate-400 border-transparent hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-lg md:text-[22px]">{nav.icon}</span>
              <span className="hidden xs:block tracking-wide">{nav.label}</span>
              {nav.badge && (
                <span className="text-[8px] md:text-[9px] px-1.5 md:px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 border border-blue-100 hidden sm:block">
                  {nav.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ─── RIGHT ACTIONS ─── */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:block text-right">
            <p className="text-[11px] font-bold text-slate-800 leading-none truncate max-w-[150px]">{BIZ.name}</p>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <div className="h-1 w-12 rounded-full overflow-hidden bg-slate-200">
                <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${BIZ.healthScore}%` }} />
              </div>
              <span className="text-[8px] font-bold text-amber-600">{BIZ.healthScore}/100</span>
            </div>
          </div>

          <button
            onClick={() => setNotesOpen(o => !o)}
            className={`w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center font-black text-xs md:text-sm transition-all border shadow-sm hover:scale-105 active:scale-95 ${notesOpen ? 'bg-amber-100 border-amber-300 text-amber-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-amber-50'}`}
            title="Notes, Tasks & Plans"
          >
            📋
          </button>

          <div
            onClick={() => { setActiveTab('user-profile'); setActiveTopNav('bizdesk'); }}
            className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center font-black text-[10px] bg-gradient-to-tr from-slate-200 to-slate-100 text-slate-700 cursor-pointer shadow-sm border border-slate-200 hover:scale-105 transition-all"
            title="User Profile"
          >
            MK
          </div>
        </div>
      </header>

      {/* ═══════ BODY ═══════ */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-slate-900/40 z-30 transition-opacity"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ─── SIDEBAR ─── */}
        <AnimatePresence>
          {sidebarOpen && (activeTopNav === 'bizdesk' || activeTopNav === 'launchpad' || activeTopNav === 'learn') && (
            <motion.aside 
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 md:relative z-40 shrink-0 w-[260px] md:w-60 bg-white flex flex-col h-full md:h-auto overflow-hidden shadow-2xl md:shadow-none border-r border-slate-200"
            >
              <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-100">
                <span className="font-semibold text-slate-800 text-[13px]">Navigation Center</span>
                <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center text-slate-400 bg-slate-50 border border-slate-100 rounded-xl" title="Close sidebar">✕</button>
              </div>

              {/* Sectioned Navigation */}
              <div className="h-full flex flex-col pt-12 pb-8 px-4 overflow-y-auto no-scrollbar">
              {(activeTopNav === 'bizdesk' ? BIZDESK_SIDEBAR : activeTopNav === 'launchpad' ? LAUNCHPAD_SIDEBAR : LEARN_SIDEBAR).map((section, si) => (
                <div key={si} className="mb-6">
                  <h3 className={`px-3 mb-3 text-[11px] font-bold capitalize tracking-[0.15em] ${section.section.includes('ARKLE') || section.section.includes('AI PARTNER') ? 'text-[#575CDE]' : 'text-[#676879]'}`}>
                    {section.section === 'AI PARTNER' ? 'Powered by Arkle AI' : section.section.toLowerCase()}
                  </h3>
                  <div className="space-y-2">
                    {section.items.map(item => (
                      <button
                        key={item.label}
                        onClick={() => { setActiveTab(item.id); if (window.innerWidth < 768) setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3.5 px-3 py-2 mt-[2px] transition-all text-left group focus-visible:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] hover:bg-slate-50`}
                      >
                        <span className={`text-[16px] text-center shrink-0 w-6 leading-none transition-transform group-hover:scale-110 text-[#676879] ${activeTab === item.id ? 'text-[#0073ea]' : ''}`}>{item.icon}</span>
                        <span className={`text-[12.5px] flex-1 truncate font-medium group-hover:underline ${activeTab === item.id ? 'text-[#0073ea]' : 'text-[#323338]'}`}>
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#f5f6f8] text-[#676879] ml-1">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* User & Settings footer */}
            <div className="p-3 flex items-center justify-between mt-auto">
              <div
                onClick={() => { setActiveTab('user-profile'); if (window.innerWidth < 768) setSidebarOpen(false); }}
                className={`flex-1 flex items-center gap-2.5 px-3 py-2 rounded-[6px] cursor-pointer group focus-visible:outline-none focus:ring-2 focus:ring-blue-500`}
                title="User Profile"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[13px] bg-[#0073ea] text-white">
                  {bizData?.name?.charAt(0) || 'M'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-normal text-[#323338] truncate group-hover:underline">{bizData?.name || 'Mahendra Kumar'}</p>
                </div>
              </div>

              <button
                onClick={() => { setActiveTab('settings'); if (window.innerWidth < 768) setSidebarOpen(false); }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${activeTab === 'settings' ? 'bg-slate-200 text-slate-900 border border-slate-300 shadow-inner' : 'text-slate-400 hover:bg-white hover:text-slate-600 border border-transparent hover:border-slate-200 shadow-sm'}`}
                title="OS Settings"
              >
                ⚙️
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

        {/* ─── MAIN CONTENT ─── */}
        <main className="flex-1 overflow-hidden relative bg-slate-50/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTopNav}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.15, ease: 'linear' }}
              className="h-full w-full overflow-y-auto"
            >
              {/* ══════ BIZDESK MODE ══════ */}
              {activeTopNav === 'bizdesk' && (
                  <div className="flex flex-col md:flex-row gap-3 md:gap-5 p-3 md:p-5 h-full">
                      {/* Main Workspace Area (Tab-based content) */}
                      <div className="flex-1 min-w-0 h-full overflow-y-auto pr-1">
                          {activeTab === 'home' && <HomeTab />}
                          {activeTab === 'company' && <CompanyTab />}
                          {activeTab === 'banking' && <BankingTab />}
                          {activeTab === 'gst' && <GSTTab />}
                          {activeTab === 'experts' && <ExpertsTab />}
                          {activeTab === 'records' && <RecordsTab />}
                          {activeTab === 'global' && <GlobalTab />}
                          {activeTab === 'networking' && <NetworkingTab />}
                          {activeTab === 'bharat-support' && <BharatSupportTab />}
                          {activeTab === 'market-access' && <MarketAccessTab />}
                          {activeTab === 'user-profile' && <UserProfileTab />}
                          {activeTab === 'settings' && <SettingsTab />}
                          {activeTab === 'sell-commerce' && <SellCommerceTab />}
                          {activeTab === 'suppliers' && <SuppliersTab />}
                          {activeTab === 'retailer' && <RetailerTab />}
                          {activeTab === 'user-profile' && <UserProfileTab />}
                      </div>

                  </div>
              )}

              {/* ══════ LAUNCHPAD ══════ */}
              {activeTopNav === 'launchpad' && (
                <div className="h-full overflow-hidden">
                   <LaunchPadTab data={bizData} externalLang={globalLang} onLangChange={setGlobalLang} />
                </div>
              )}

              {/* ══════ LEARNHUB ══════ */}
              {activeTopNav === 'learn' && (
                <div className="h-full overflow-y-auto p-3 md:p-5">
                   <LearnTab />
                </div>
              )}

              {/* ══════ AI WORKSPACE ══════ */}
              {activeTopNav === 'ai-workspace' && (
                 <div className="h-full overflow-hidden">
                    <Workspace onNavigate={(tab) => {
                      if (tab === 'A' || tab === 'B') setActiveTopNav('bizdesk');
                      if (tab === 'LearnerStudio') setActiveTopNav('learn');
                      if (tab === 'Workspace') setActiveTopNav('ai-workspace');
                    }} />
                 </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Floating Notes/Tasks Drawer */}
          <AnimatePresence>
            {notesOpen && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 z-[60] w-full max-w-md bg-white shadow-2xl border-l border-slate-200"
              >
                 <NotesAndTasksPanel onClose={() => setNotesOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ARKLE - Floating Neural Window (Global) */}
      <AnimatePresence>
        {arkleOpen && (
          <div className="fixed inset-0 z-[150] pointer-events-none">
             <div className="pointer-events-auto">
                <ArklePanel onClose={() => setArkleOpen(false)} selectedLang={globalLang} />
             </div>
          </div>
        )}
      </AnimatePresence>

      {/* ARKLE - Floating Global Launcher Button */}
      {!arkleOpen && (
        <div className="fixed bottom-8 right-8 z-[140]">
          <button
            onClick={() => setArkleOpen(true)}
            className="group relative w-20 h-20 flex items-center justify-center transition-all"
            title="Open Arkle Brain"
          >
            {/* Outer Pulsing Ring */}
            <div className="absolute inset-0 bg-blue-600/20 rounded-[30px] animate-ping duration-1000 scale-125"></div>
            <div className="absolute inset-0 bg-blue-600/10 rounded-[30px] animate-pulse duration-700 scale-150"></div>
            
            {/* Main Button Body */}
            <div className="relative w-16 h-16 bg-gradient-to-tr from-slate-900 to-blue-900 rounded-[24px] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 group-hover:scale-110 group-active:scale-95 transition-all">
              <span className="material-symbols-outlined text-white text-[32px] animate-pulse">psychology</span>
              
              {/* Active Indicator */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[#090b1a] rounded-full animate-bounce"></div>
            </div>
            
            {/* Hover Label */}
            <div className="absolute right-20 bg-[#090b1a] text-white text-[10px] font-black px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest border border-white/10 shadow-2xl">
              Talk to Arkle
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
