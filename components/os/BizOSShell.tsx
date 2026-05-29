'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
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
import LearnTab from '@/components/os/LearnTab';
import StartupStoreTab from '@/components/os/StartupStoreTab';
import RetailerTab from '@/components/os/RetailerTab';
import { useBizStore } from '@/lib/useBizStore';
import WorkflowBuilderTab from '@/components/os/WorkflowBuilderTab';
import LaunchPadTab from '@/components/os/LaunchPadTab';
import { ArkleVoiceIcon } from '../shared/ArkleVoiceIcon';
import Workspace from '@/components/dashboard/Workspace';
import IntegrationsPanel from '@/components/os/IntegrationsPanel';
import WhiteboardPanel from './WhiteboardPanel';
import BizboardSpotlight from './launchpad/LaunchPadSpotlight';
import VibeCommandBar from '../vibe-studio/VibeCommandBar';
import ArkleFloatingVoice from './ArkleFloatingVoice';
import ArkleVoiceOrb from './ArkleVoiceOrb';

/* ───────────── SIDEBAR NAV CONFIG (BizDesk) ───────────── */
type SidebarSection = { section: string; items: { id: OsTab; icon: string; label: string; badge?: string }[] };

const BIZDESK_SIDEBAR: SidebarSection[] = [
  {
    section: 'NEURAL OPERATOR',
    items: [
      { id: 'home', icon: '🧠', label: 'Arkle Control', badge: 'Live' },
    ],
  },
  {
    section: 'AI AUTOMATIONS',
    items: [
      { id: 'workflows', icon: '⚡', label: 'AI Workflows', badge: 'New' },
    ],
  },
  {
    section: 'OPERATIONAL CORE',
    items: [
      { id: 'company',  icon: '🛡️', label: 'Business Vault' },
      { id: 'banking',  icon: '💳', label: 'Financial Desk' },
    ],
  },
  {
    section: 'MARKETPLACE',
    items: [
      { id: 'learn',       icon: '🛒', label: 'Startup Store', badge: 'New' },
    ],
  },
  {
    section: 'EXPANSION ENGINE',
    items: [
      { id: 'sell-commerce', icon: '📦', label: 'Commerce OS' },
      { id: 'suppliers',     icon: '🏭', label: 'Supply Chain' },
      { id: 'global',        icon: '🌐', label: 'Global Gateway' },
    ],
  },
  {
    section: 'ARKLE ECOSYSTEM',
    items: [
      { id: 'bharat-support', icon: '🇮🇳', label: 'Bharat Startup' },
      { id: 'spotlight', icon: '✨', label: 'Biz Spotlight', badge: 'Live' },
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
    icon: 'work',
    description: 'Your entire company — one desk. Management, legal, compliance, finance, banking, hiring, scaling, and go-global support.',
  },
  {
    id: 'launchpad',
    label: 'LaunchPad',
    icon: 'rocket_launch',
    badge: 'Beta',
    description: 'A rapid business builder. Build your brand, logo, website, pitch decks, and brochures.',
  },
  {
    id: 'learn',
    label: 'LearnHub',
    icon: 'school',
    badge: 'Beta',
    description: 'Skill upgradation and tech adoption center.',
  },
  {
    id: 'ai-workspace',
    label: 'AI Workspace',
    icon: 'api',
    badge: 'Beta',
    description: 'Your tech automation control room.',
  },
];

interface BizOSShellProps {
    data: any;
    onLogin?: () => void;
}

export default function BizOSShell({ data: initialData }: BizOSShellProps) {
  const { user, dbUser, dbBusiness } = useAuth();
  const [activeTab, setActiveTab] = useState<OsTab>('home');
  const [arkleOpen, setArkleOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [activeTopNav, setActiveTopNav] = useState<TopNavId>('bizdesk');
  const [bizData, setBizData] = useState(initialData || BIZ);
  const [integrationsOpen, setIntegrationsOpen] = useState(false);
  const [globalLang, setGlobalLang] = useState('en-IN');
  const conversationMode = useBizStore((state) => state.conversationMode);
  const sidebarOpen = useBizStore((state) => state.sidebarOpen);
  const setSidebarOpen = useBizStore((state) => state.setSidebarOpen);
  const whiteboardOpen = useBizStore((state) => state.whiteboardOpen);
  const setWhiteboardOpen = useBizStore((state) => state.setWhiteboardOpen);
  const isVoiceActive = useBizStore((state) => state.isVoiceActive);
  const setIsVoiceActive = useBizStore((state) => state.setIsVoiceActive);
  const lastVoiceCommand = useBizStore((state) => state.lastVoiceCommand);
  const setLastVoiceCommand = useBizStore((state) => state.setLastVoiceCommand);

  // ── Global Voice Navigation Actuators ──
  useEffect(() => {
    if (lastVoiceCommand) {
      const cmd = lastVoiceCommand.toLowerCase();
      
      if (cmd.includes('go to') || cmd.includes('open') || cmd.includes('show')) {
        if (cmd.includes('bank') || cmd.includes('money')) setActiveTab('banking');
        else if (cmd.includes('gst') || cmd.includes('tax')) setActiveTab('gst');
        else if (cmd.includes('expert') || cmd.includes('help')) setActiveTab('experts');
        else if (cmd.includes('company') || cmd.includes('profile')) setActiveTab('company');
        else if (cmd.includes('record') || cmd.includes('file')) setActiveTab('records');
        else if (cmd.includes('launch') || cmd.includes('build')) setActiveTab('launchpad');
        
        console.log("Voice Navigation Executed:", cmd);
        // Do NOT setLastVoiceCommand(null) here if you want other components to also react
      }
    }
  }, [lastVoiceCommand]);

  const [isConv, setIsConv] = useState(false);

  useEffect(() => {
    if (initialData) {
        setBizData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    // Manually subscribe to ensure updates are caught across component boundaries
    const unsub = useBizStore.subscribe((state) => {
      setIsConv(state.conversationMode);
      if (state.conversationMode) {
        setSidebarOpen(false);
      }
    });
    // Initial sync
    setIsConv(useBizStore.getState().conversationMode);
    return unsub;
  }, [setSidebarOpen]);

  const switchTopNav = useCallback((navId: TopNavId) => {
    if (navId === activeTopNav) return;
    setActiveTopNav(navId);
    if (navId === 'bizdesk') setActiveTab('home');
    if (navId === 'launchpad') setActiveTab('launchpad');
    if (navId === 'learn') setActiveTab('learn');
  }, [activeTopNav]);

  useEffect(() => {
    const handleSwitch = (e: Event) => {
      const customEvent = e as CustomEvent<TopNavId>;
      if (customEvent.detail) {
        switchTopNav(customEvent.detail);
      }
    };
    window.addEventListener('switch-top-nav', handleSwitch);
    return () => window.removeEventListener('switch-top-nav', handleSwitch);
  }, [switchTopNav]);

  useEffect(() => {
    if (conversationMode) {
      setSidebarOpen(false);
    }
  }, [conversationMode, setSidebarOpen]);

  return (
    <div className={`h-screen flex flex-col overflow-hidden bg-slate-50 w-full ${isConv ? 'is-conversation-mode' : ''}`} style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        
        .material-symbols-rounded {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }

        .is-conversation-mode aside:not(.arkle-sidebar) {
          display: none !important;
        }
      `}</style>

      {/* ═══════ COMPACT SKYBLUE TOP BAR ═══════ */}
      <header className="shrink-0 h-16 bg-sky-50/80 backdrop-blur-3xl flex items-center justify-between px-8 gap-4 z-50 transition-all duration-1000">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-white hover:text-sky-600 hover:shadow-sm transition-all"
            title={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
          >
            <span className="material-symbols-rounded text-[22px]">
              {sidebarOpen ? 'menu_open' : 'menu'}
            </span>
          </button>
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center font-black text-white bg-linear-to-tr from-sky-600 to-blue-700 shadow-lg shadow-sky-600/20 group-hover:scale-105 active:scale-95 transition-all outline outline-2 outline-white/50">B</div>
            <div className="hidden lg:block space-y-0">
              <span className="font-black text-slate-900 text-[14px] tracking-tight uppercase block leading-tight">BizOS</span>
              <span className="text-[8px] font-black tracking-[0.1em] text-sky-600/80 block uppercase">SetMyBizz</span>
            </div>
          </div>
          {/* DEBUG INDICATOR - WILL REMOVE AFTER VERIFICATION */}
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isConv ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
            {isConv ? 'Conversation Active' : 'Dashboard Mode'}
          </div>
        </div>

        {/* ─── TOP NAV BUTTONS ─── */}
        <div className="flex flex-1 items-center justify-center">
          <nav className="flex items-center bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-sky-100/50 shadow-sm gap-8 px-8">
            {TOP_NAV.map(nav => (
              <button
                key={nav.id}
                onClick={() => switchTopNav(nav.id)}
                className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all relative group ${
                  activeTopNav === nav.id
                    ? 'bg-white text-sky-600 shadow-md scale-110'
                    : 'text-slate-400 hover:text-sky-500 hover:bg-white/80'
                }`}
                title={nav.label}
              >
                <span className={`material-symbols-rounded text-[23px] transition-all ${activeTopNav === nav.id ? '[font-variation-settings:"FILL"_1]' : ''}`}>
                  {nav.icon}
                </span>
                
                {activeTopNav === nav.id && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-sky-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
                
                <span className="absolute -bottom-10 px-2.5 py-1.5 bg-slate-900/90 text-white text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 whitespace-nowrap pointer-events-none z-50">
                  {nav.label}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* ─── RIGHT UTILITIES ─── */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/40 p-1 rounded-xl border border-sky-100/40 backdrop-blur-sm mr-2 pr-2">
             <button 
                onClick={() => setWhiteboardOpen(!whiteboardOpen)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all group relative ${whiteboardOpen ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-500 hover:text-sky-600 hover:bg-white'}`} 
             >
                <span className={`material-symbols-rounded text-[21px] ${whiteboardOpen ? '[font-variation-settings:"FILL"_1]' : ''}`}>notifications</span>
             </button>
             <button 
                onClick={() => setIntegrationsOpen(!integrationsOpen)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${integrationsOpen ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-500 hover:text-sky-600 hover:bg-white'}`}
             >
                <span className="material-symbols-rounded text-[21px]">apps</span>
             </button>
             <button 
                onClick={() => setNotesOpen(!notesOpen)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${notesOpen ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-500 hover:text-amber-600 hover:bg-white'}`}
             >
                <span className="material-symbols-rounded text-[21px]">event_note</span>
             </button>
          </div>

          <div className="hidden lg:block text-right mr-1">
            <p className="text-[9px] font-black text-slate-900 leading-none uppercase tracking-widest">
              {dbBusiness?.name || dbBusiness?.business_name || dbUser?.business_name || bizData.name || 'My Startup'}
            </p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-[8px] font-black text-sky-600 italic leading-none">{bizData.healthScore || 72}%</span>
            </div>
          </div>

          <div 
            title={dbUser?.full_name || user?.user_metadata?.full_name || bizData.userName || 'Operator'}
            className="w-10 h-10 rounded-full flex items-center justify-center font-black text-xs bg-linear-to-tr from-sky-600 to-blue-700 text-white cursor-pointer shadow-md border-2 border-white/80"
          >
            {(dbUser?.full_name || user?.user_metadata?.full_name || bizData.userName || 'U').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
        </div>
      </header>

      {/* ═══════ BODY ═══════ */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ─── SKYBLUE SIDEBAR (Hidden in Conversation Mode) ─── */}
        <AnimatePresence>
          {(sidebarOpen && !isConv) && (
            <motion.aside 
               key="bizdesk-sidebar"
               initial={{ x: -260 }}
               animate={{ x: 0 }}
               exit={{ x: -260 }}
               style={{ display: isConv ? 'none' : 'flex' }}
               className="shrink-0 w-64 bg-sky-50/80 backdrop-blur-xl flex flex-col h-full overflow-hidden shadow-2xl border-r border-sky-100/60"
            >
              <div className="h-full flex flex-col pt-12 pb-8 px-4 overflow-y-auto no-scrollbar">
              {(activeTopNav === 'bizdesk' ? BIZDESK_SIDEBAR : activeTopNav === 'launchpad' ? LAUNCHPAD_SIDEBAR : LEARN_SIDEBAR).map((section, si) => (
                <div key={si} className="mb-6">
                  <h3 className="px-3 mb-3 text-[11px] font-bold capitalize tracking-[0.15em] text-[#676879]">
                    {section.section.toLowerCase()}
                  </h3>
                  <div className="space-y-2">
                    {section.items.map(item => (
                      <button
                        key={item.label}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3.5 px-3 py-2 transition-all text-left rounded-[8px] hover:bg-slate-50 ${activeTab === item.id ? 'bg-white shadow-sm ring-1 ring-sky-100' : ''}`}
                      >
                        <span className={`text-[16px] text-center shrink-0 w-6 leading-none text-[#676879] ${activeTab === item.id ? 'text-[#0073ea]' : ''}`}>{item.icon}</span>
                        <span className={`text-[12.5px] flex-1 truncate font-medium ${activeTab === item.id ? 'text-[#0073ea]' : 'text-[#323338]'}`}>
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ─── MAIN CONTENT ─── */}
        <main className="flex-1 overflow-hidden relative bg-slate-50/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTopNav + activeTab}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="h-full w-full overflow-y-auto"
            >
              {activeTopNav === 'bizdesk' && (
                <div className="h-full">
                  {activeTab === 'home' && <HomeTab data={bizData} />}
                  {activeTab === 'company' && <CompanyTab />}
                  {activeTab === 'banking' && <BankingTab />}
                  {activeTab === 'learn' && <StartupStoreTab />}
                  {activeTab === 'global' && <GlobalTab />}
                  {activeTab === 'networking' && <NetworkingTab />}
                  {activeTab === 'bharat-support' && <BharatSupportTab />}
                  {activeTab === 'market-access' && <MarketAccessTab />}
                  {activeTab === 'user-profile' && <UserProfileTab />}
                  {activeTab === 'settings' && <SettingsTab />}
                  {activeTab === 'sell-commerce' && <SellCommerceTab />}
                  {activeTab === 'suppliers' && <SuppliersTab />}
                  {activeTab === 'retailer' && <RetailerTab />}
                  {activeTab === 'spotlight' && <BizboardSpotlight />}
                  {activeTab === 'workflows' && <WorkflowBuilderTab />}
                </div>
              )}
              {activeTopNav === 'launchpad' && <LaunchPadTab data={bizData} externalLang={globalLang} onLangChange={setGlobalLang} />}
              {activeTopNav === 'learn' && <LearnTab />}
              {activeTopNav === 'ai-workspace' && <Workspace onNavigate={(tab: any) => {
                  if (tab === 'A' || tab === 'B') setActiveTopNav('bizdesk');
                  if (tab === 'LearnerStudio') setActiveTopNav('learn');
                  if (tab === 'Workspace') setActiveTopNav('ai-workspace');
                  if (tab === 'workflows') { setActiveTopNav('bizdesk'); setActiveTab('workflows'); }
              }} />}
            </motion.div>
          </AnimatePresence>

          {/* Drawers */}
          <AnimatePresence>
            {notesOpen && (
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-y-0 right-0 z-[60] w-full max-w-sm bg-sky-50/80 backdrop-blur-3xl shadow-2xl border-l border-sky-100/60">
                  <NotesAndTasksPanel onClose={() => setNotesOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {integrationsOpen && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-10 z-[200] bg-white shadow-2xl border border-slate-200 rounded-[32px] overflow-hidden flex flex-col">
                 <IntegrationsPanel onClose={() => setIntegrationsOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          <WhiteboardPanel isOpen={whiteboardOpen} onClose={() => setWhiteboardOpen(false)} />
        </main>
      </div>

      {/* LEFT SIDEBAR TOGGLE */}
      {!isConv && (
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`fixed left-0 top-1/2 -translate-y-1/2 z-[55] w-6 h-12 bg-white/80 backdrop-blur-md border border-slate-200 border-l-0 rounded-r-xl flex items-center justify-center text-slate-400 hover:text-sky-600 shadow-lg transition-all duration-300 ${sidebarOpen ? 'left-[256px]' : 'left-0'}`}
          title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        >
          <span className="material-symbols-rounded text-[18px]">
            {sidebarOpen ? 'chevron_left' : 'chevron_right'}
          </span>
        </button>
      )}

      {/* RIGHT SIDEBAR TOGGLE */}
      <button 
        onClick={() => setNotesOpen(!notesOpen)}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-[55] w-6 h-12 bg-white/80 backdrop-blur-md border border-slate-200 border-r-0 rounded-l-xl flex items-center justify-center text-slate-400 hover:text-sky-600 shadow-lg transition-all ${notesOpen ? 'right-[400px]' : 'right-0'}`}
        title={notesOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        <span className="material-symbols-rounded text-[18px]">
          {notesOpen ? 'chevron_right' : 'chevron_left'}
        </span>
      </button>

      {/* ARKLE PANEL */}
      <AnimatePresence>
        {arkleOpen && (
          <div className="fixed inset-0 z-[150] pointer-events-none">
             <div className="pointer-events-auto">
                <AnimatePresence>
        {isVoiceActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[90] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <ArklePanel onClose={() => setArkleOpen(false)} selectedLang={globalLang} />
             </div>
          </div>
        )}
      </AnimatePresence>

      <VibeCommandBar />
      
      {/* ─── ARKLE NEURAL TASKBAR (Floating OS Control) ─── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-900/90 backdrop-blur-3xl rounded-[32px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-[95vw]">
          {/* Dashboard Switcher Quick Tool (Optional/Contextual) */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 border-r border-white/10 mr-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Neural OS Active</span>
          </div>

          {/* TaskBar Actions */}
          <div className="flex items-center gap-4">
              <button 
                  onClick={() => setArkleOpen(!arkleOpen)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${arkleOpen ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
                  title="Toggle Arkle Agent (IDE)"
              >
                  <span className="material-symbols-rounded text-[24px]">psychology</span>
              </button>

              {/* THE VOICE TRIGGER (The Request) */}
              <div className="relative">
                  {isVoiceActive && (
                      <>
                          <div className="absolute inset-0 bg-indigo-500 rounded-2xl animate-ping opacity-25"></div>
                          <div className="absolute -inset-2 bg-indigo-400/20 rounded-full blur-xl animate-pulse"></div>
                      </>
                  )}
                  <button 
                      onClick={() => setIsVoiceActive(true)}
                      className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 overflow-hidden ${isVoiceActive ? 'opacity-0 scale-50 pointer-events-none' : 'text-white/40 hover:text-white hover:bg-white/10 hover:scale-105'}`}
                      title="Arkle Voice Mode"
                  >
                      <ArkleVoiceIcon size="md" className={isVoiceActive ? '' : 'opacity-40'} />
                  </button>
              </div>

              <button 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                  title="System Health"
              >
                  <span className="material-symbols-rounded text-[24px]">analytics</span>
              </button>
          </div>
      </div>

      {/* GLOBAL NEURAL VOICE HUB (Hidden by default, triggered by TaskBar) */}
      <ArkleFloatingVoice />
    </div>
  );
}
