'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { BIZ } from '@/lib/mockBizData';
import type { OsTab } from '@/components/os/shared';
import ArklePanel from '@/components/os/ArklePanel';
import ArkleFloatingVoice from '@/components/os/ArkleFloatingVoice';
import NotesAndTasksPanel from '@/components/os/NotesAndTasksPanel';
import HomeTab from '@/components/os/HomeTab';
import CompanyTab from '@/components/os/CompanyTab';
import BankingTab from '@/components/os/BankingTab';
import GSTTab from '@/components/os/GSTTab';
import ExpertsTab from '@/components/os/ExpertsTab';
import RecordsTab from '@/components/os/RecordsTab';
import GlobalTab from '@/components/os/GlobalTab';
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
import SalesTab from '@/components/os/SalesTab';
import BillBookTab from '@/components/os/BillBookTab';
import dynamic from 'next/dynamic';

const BilleaseTab = dynamic(() => import('@/components/os/BilleaseTab'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[calc(100vh-8rem)] min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
    </div>
  ),
});
import OrderDeskTab from '@/components/os/OrderDeskTab';
import { useBizStore } from '@/lib/useBizStore';
import LaunchPadTab from '@/components/os/LaunchPadTab';
import Workspace from '@/components/dashboard/Workspace';
import IntegrationsPanel from '@/components/os/IntegrationsPanel';
import { ArkleCoreProvider } from '@/context/ArkleCoreContext';
import { useAuth } from '@/context/AuthContext';
import LoginStep from '@/components/steps/LoginStep';
import ProfileCompletionModal from '@/components/ProfileCompletionModal';
import GoogleIntegrationModal from '@/components/dashboard/GoogleIntegrationModal';
import GoogleWorkspaceDashboard from '@/components/dashboard/GoogleWorkspaceDashboard';
import { isDevAuthBypass } from '@/lib/devAuth';

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
    section: 'OPERATIONAL CORE',
    items: [
      { id: 'company', icon: '🛡️', label: 'Business Vault' },
      { id: 'banking', icon: '💳', label: 'Financial Desk' },
      { id: 'sales', icon: '💼', label: 'Sales Desk' },
      { id: 'billease', icon: '📒', label: 'Bill Book' },
      { id: 'billbook', icon: '🚀', label: 'Biz Book' },
    ],
  },
  {
    section: 'MARKETPLACE',
    items: [
      { id: 'learn', icon: '🛒', label: 'Startup Store', badge: 'New' },
    ],
  },
  {
    section: 'EXPANSION ENGINE',
    items: [
      { id: 'sell-commerce', icon: '📦', label: 'Commerce OS' },
      { id: 'suppliers', icon: '🏭', label: 'Supply Chain' },
      { id: 'global', icon: '🌐', label: 'Global Gateway' },
    ],
  },
  {
    section: 'ARKLE ECOSYSTEM',
    items: [
      { id: 'bharat-support', icon: '🇮🇳', label: 'Bharat Startup' },
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
    description: 'Your entire company — one desk. Management, legal, compliance, finance, banking, hiring, scaling, and go-global support. Run your company from your desk.',
  }
];

export default function OSPage() {
  const [activeTab, setActiveTab] = useState<OsTab>('home');
  const [arkleOpen, setArkleOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [activeTopNav, setActiveTopNav] = useState<TopNavId>('bizdesk');
  const [showLaunchPadFlow, setShowLaunchPadFlow] = useState(false);
  const [bizData, setBizData] = useState(BIZ);
  const [integrationsOpen, setIntegrationsOpen] = useState(false);
  const [globalLang, setGlobalLang] = useState('en-IN');
  const {
    whiteboardOpen,
    setWhiteboardOpen,
    conversationMode,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    sidebarCollapsed,
    toggleSidebarCollapsed,
  } = useBizStore();
  const sidebarBeforeConversation = useRef<boolean | null>(null);
  const { user, dbUser, dbBusiness, loading: authLoading } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [devSkip, setDevSkip] = useState(false);
  const [billeaseMounted, setBilleaseMounted] = useState(false);
  const [showGoogleConnect, setShowGoogleConnect] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [billbookDropdownOpen, setBillbookDropdownOpen] = useState(false);

  // Dynamic UI replacement accessors to completely remove static mock data placeholders
  const liveBizName = dbBusiness?.business_name || dbUser?.business_name || bizData.name || 'Your Startup';
  const liveUserName = dbUser?.full_name || user?.user_metadata?.full_name || 'Operator';
  const liveUserInitials = liveUserName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'MK';

  const [installedApps, setInstalledApps] = useState<string[]>(['billbook']);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('setmybizz_installed_apps');
      if (saved) {
        try {
          setInstalledApps(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load installed apps", e);
        }
      }
    }
  }, []);

  const handleInstallApp = useCallback((appId: string) => {
    setInstalledApps(prev => {
      const updated = [...prev.filter(x => x !== appId), appId];
      localStorage.setItem('setmybizz_installed_apps', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleUninstallApp = useCallback((appId: string) => {
    setInstalledApps(prev => {
      const updated = prev.filter(x => x !== appId);
      localStorage.setItem('setmybizz_installed_apps', JSON.stringify(updated));
      return updated;
    });
  }, []);

  useEffect(() => {
    if (isDevAuthBypass()) {
      setShowProfileModal(false);
      setDevSkip(true);
    }
  }, []);

  useEffect(() => {
    // Trigger ProfileCompletionModal if core profile details or verified business workspaces are missing
    if (isDevAuthBypass()) return;
    if (user && !authLoading) {
      const localCached = localStorage.getItem('setmybizz_data');
      const hasLocalProfile = !!localCached;
      if (!hasLocalProfile && (!dbUser || !dbUser.full_name || !dbUser.phone || !dbBusiness || (!dbBusiness.business_name && !dbBusiness.name))) {
        setShowProfileModal(true);
      } else {
        setShowProfileModal(false);
      }
    }
  }, [user, dbUser, dbBusiness, authLoading]);

  useEffect(() => {
    if (conversationMode) {
      if (sidebarBeforeConversation.current === null) {
        sidebarBeforeConversation.current = useBizStore.getState().sidebarOpen;
      }
      setSidebarOpen(false);
    } else if (sidebarBeforeConversation.current !== null) {
      setSidebarOpen(sidebarBeforeConversation.current);
      sidebarBeforeConversation.current = null;
    }
  }, [conversationMode, setSidebarOpen]);

  const mobileSidebarInit = useRef(false);
  useEffect(() => {
    if (mobileSidebarInit.current || typeof window === 'undefined') return;
    mobileSidebarInit.current = true;
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, [setSidebarOpen]);

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

  useEffect(() => {
    const pendingTab = sessionStorage.getItem('bizos_open_tab') as OsTab | null;
    if (pendingTab) {
      sessionStorage.removeItem('bizos_open_tab');
      setActiveTopNav('bizdesk');
      setActiveTab(pendingTab);
    }
  }, []);

  /* Smooth top nav transition handled by Framer Motion */
  const switchTopNav = useCallback((navId: TopNavId) => {
    if (navId === activeTopNav) return;
    setActiveTopNav(navId);
    if (navId === 'bizdesk') setActiveTab('home');
  }, [activeTopNav]);

  const openBillBook = useCallback(() => {
    setActiveTopNav('bizdesk');
    setActiveTab('billbook');
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [setSidebarOpen]);

  const openBillEase = useCallback(() => {
    setActiveTopNav('bizdesk');
    setActiveTab('billease');
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [setSidebarOpen]);

  useEffect(() => {
    if (activeTab === 'billease') setBilleaseMounted(true);
  }, [activeTab]);

  useEffect(() => {
    const handleOpenBillEase = () => {
      openBillEase();
    };
    const handleOpenOsTab = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setActiveTab(customEvent.detail);
      }
    };
    window.addEventListener('open-billease', handleOpenBillEase);
    window.addEventListener('open-os-tab', handleOpenOsTab);
    return () => {
      window.removeEventListener('open-billease', handleOpenBillEase);
      window.removeEventListener('open-os-tab', handleOpenOsTab);
    };
  }, [openBillEase]);

  const openOrderDesk = useCallback(() => {
    setActiveTopNav('bizdesk');
    setActiveTab('orderdesk');
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [setSidebarOpen]);

  const showMainSidebar =
    !conversationMode &&
    activeTopNav !== 'launchpad' &&
    (activeTopNav === 'bizdesk' || activeTopNav === 'learn');

  const closeSidebar = useCallback(() => setSidebarOpen(false), [setSidebarOpen]);

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

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 text-sm font-medium animate-pulse">Verifying Access Credentials...</p>
        </div>
      </div>
    );
  }

  // Mandatory SaaS access protection gate - absolute zero bypass policy
  if (!user && !devSkip) {
    return (
      <div className="relative min-h-screen w-full">
        <LoginStep
          onLogin={() => {
            // Handled autonomously by global AuthProvider active state subscribers
          }}
          businessName={bizData.name || 'Your Business'}
        />
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute bottom-6 right-6 z-[9999]">
            <button
              onClick={() => setDevSkip(true)}
              className="px-5 py-3 bg-slate-900/90 hover:bg-slate-900 text-white rounded-2xl text-xs font-bold shadow-2xl transition-all flex items-center gap-2 border border-white/20 backdrop-blur-md"
            >
              <span className="material-symbols-rounded text-sm">code</span>
              Developer Skip Login
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <ArkleCoreProvider>
      <div className="h-screen flex flex-col overflow-hidden bg-slate-50" style={{ fontFamily: '"DM Sans", sans-serif' }}>
        {isDevAuthBypass() && (
          <div className="shrink-0 bg-amber-500 px-3 py-1 text-center text-[10px] font-bold uppercase tracking-wider text-amber-950">
            Dev mode — login bypassed (localhost only)
          </div>
        )}
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        
        .fade-switch { animation: fadeSwitch .3s ease; }
        @keyframes fadeSwitch {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .material-symbols-rounded {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>

        {/* Enterprise First-Time Onboarding Details Intake Modal */}
        <ProfileCompletionModal
          isOpen={showProfileModal}
          onComplete={(data) => {
            setShowProfileModal(false);
            if (data) {
              window.location.reload();
            }
          }}
        />

        {/* Google Integration Modal */}
        {showGoogleConnect && (
          <GoogleIntegrationModal
            onClose={() => setShowGoogleConnect(false)}
            onConnect={() => {
              setIsGoogleConnected(true);
              setShowGoogleConnect(false);
              setActiveTab('google');
            }}
          />
        )}

        {/* ═══════ COMPACT LIGHT TOP BAR ═══════ */}
        <header className="shrink-0 h-16 flex items-center justify-between px-8 gap-4 z-50 backdrop-blur-md bg-white/20 border-b border-slate-100/50">
          
          {/* Left Segment: Logo & Menu */}
          <div className="w-1/3 flex items-center gap-4">
            {showMainSidebar && (
              <button
                type="button"
                onClick={toggleSidebar}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 shadow-sm transition-all hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                title={sidebarOpen ? 'Close navigation' : 'Open navigation'}
                aria-expanded={sidebarOpen}
                aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              >
                <span className="material-symbols-rounded text-[20px]">
                  {sidebarOpen ? 'left_panel_close' : 'menu'}
                </span>
              </button>
            )}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center font-black text-white bg-linear-to-tr from-sky-600 to-blue-700 shadow-lg shadow-sky-600/20 group-hover:scale-105 active:scale-95 transition-all outline outline-2 outline-white/50">B</div>
              <div className="hidden lg:block space-y-0">
                <span className="font-black text-[13px] tracking-tight uppercase block leading-tight text-slate-900">BizOS</span>
                <span className="text-[7.5px] font-black tracking-[0.15em] block uppercase text-sky-600/80 leading-none">SetMyBizz</span>
              </div>
            </Link>
          </div>
 
          {/* Center Segment: Mathematically Aligned Premium Navigation Dock */}
          <div className="w-1/3 flex items-center justify-center">
            <nav className="flex items-center backdrop-blur-3xl p-1 rounded-full border bg-white/70 border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] gap-1 px-2.5">
              {TOP_NAV.map(nav => {
                const isActive = activeTopNav === nav.id;
                return (
                  <button
                    key={nav.id}
                    onClick={() => switchTopNav(nav.id)}
                    className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 group ${isActive
                        ? 'bg-white shadow-[0_8px_20px_rgba(0,0,0,0.08)] scale-105 border border-slate-100 z-10'
                        : 'text-slate-400 hover:text-slate-900 hover:bg-white/40'
                      }`}
                  >
                    {/* Glowing active layer */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-sky-500/10 blur-[10px] opacity-60 animate-pulse"></div>
                    )}
 
                    <div className="relative flex items-center justify-center z-10">
                      <span className={`material-symbols-rounded text-[21px] transition-all duration-300 ${isActive ? 'text-sky-600 [font-variation-settings:"FILL"_1]' : 'group-hover:scale-105'
                        }`}>
                        {nav.icon}
                      </span>
 
                      {/* Active Indicator Pin */}
                      {isActive && (
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-sky-500 rounded-full border border-white shadow-xs"></span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
 
          {/* Right Segment: Utilities Panel */}
          <div className="w-1/3 flex items-center justify-end">
            <div className="flex items-center gap-1.5 p-1 rounded-xl backdrop-blur-sm mr-2 pr-2 border transition-all duration-500 bg-white/60 border-slate-100/85 shadow-sm">
              <button
                onClick={() => setWhiteboardOpen(!whiteboardOpen)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all group relative ${whiteboardOpen ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-500 hover:text-sky-600 hover:bg-white'}`}
                title="Neural Pulse Notifications"
              >
                <span className={`material-symbols-rounded text-[13px] ${whiteboardOpen ? '[font-variation-settings:"FILL"_1]' : ''}`}>notifications</span>
              </button>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('scroll-to-bizboard'))}
                className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg transition-all text-slate-500 hover:text-sky-600 hover:bg-white"
                title="BizBoard Spotlight"
              >
                <span className="material-symbols-rounded text-[13px]">featured_play_list</span>
              </button>

              {/* Bill Book Quick Action Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setBillbookDropdownOpen(!billbookDropdownOpen)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all group relative ${billbookDropdownOpen ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-500 hover:text-sky-600 hover:bg-white'}`}
                  title="Bill Book Quick Menu"
                >
                  <span className="material-symbols-rounded text-[13px]">menu_book</span>
                  <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                </button>
                
                <AnimatePresence>
                  {billbookDropdownOpen && (
                    <>
                      {/* Click outside overlay */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setBillbookDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 overflow-hidden"
                      >
                        <div className="px-3 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1.5">
                          Biz Book Options
                        </div>
                        <div className="space-y-0.5">
                          {[
                            { label: 'Open Full Biz Book', subtab: 'home', icon: 'menu_book', color: 'text-violet-600' },
                            { label: 'Create GST Invoice', subtab: 'invoice', icon: 'receipt_long', color: 'text-emerald-600' },
                            { label: 'Add Product / Item', subtab: 'items', icon: 'inventory_2', color: 'text-amber-500' },
                            { label: 'Add Party / Customer', subtab: 'parties', icon: 'group', color: 'text-sky-500' },
                            { label: 'Record Expense', subtab: 'expenses', icon: 'payments', color: 'text-rose-500' },
                          ].map((opt) => (
                            <button
                              key={opt.label}
                              onClick={() => {
                                setBillbookDropdownOpen(false);
                                setActiveTopNav('bizdesk');
                                setActiveTab('billbook');
                                setTimeout(() => {
                                  window.dispatchEvent(new CustomEvent('open-bizbook-subtab', { detail: opt.subtab }));
                                }, 100);
                              }}
                              className="w-full text-left p-2 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2.5 group/opt"
                            >
                              <span className={`material-symbols-rounded text-[18px] ${opt.color} group-hover/opt:scale-110 transition-transform`}>
                                {opt.icon}
                              </span>
                              <span className="text-[11px] font-bold text-slate-700 group-hover/opt:text-slate-900 transition-colors">
                                {opt.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              <button className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg transition-all text-slate-500 hover:text-sky-600 hover:bg-white" title="Add Guest">
                <span className="material-symbols-rounded text-[13px]">person_add</span>
              </button>
              <button className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg transition-all text-slate-500 hover:text-sky-600 hover:bg-white" title="AI Skills">
                <span className="material-symbols-rounded text-[13px]">smart_toy</span>
              </button>
              <button className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg transition-all text-slate-500 hover:text-sky-600 hover:bg-white" title="Search Ecosystem">
                <span className="material-symbols-rounded text-[13px]">search</span>
              </button>

              <div className="hidden md:block w-[1px] h-5 bg-sky-200/50 mx-1"></div>

              <button
                onClick={() => setIntegrationsOpen(o => !o)}
                className={`w-9 h-9 flex items-center justify-center transition-all rounded-lg ${integrationsOpen ? 'bg-sky-600 text-white shadow-lg scale-105' : 'text-slate-500 hover:text-sky-600 hover:bg-white'}`}
                title="Marketplace"
              >
                <span className="material-symbols-rounded text-[13px]">apps</span>
              </button>

              <button
                onClick={() => setNotesOpen(o => !o)}
                className={`w-9 h-9 flex items-center justify-center transition-all rounded-lg ${notesOpen ? 'bg-amber-500 text-white shadow-lg scale-105' : 'text-slate-500 hover:text-amber-600 hover:bg-white'}`}
                title="Notes"
              >
                <span className={`material-symbols-rounded text-[13px] ${notesOpen ? '[font-variation-settings:"FILL"_1]' : ''}`}>event_note</span>
              </button>
            </div>

            <div className="hidden lg:block text-right mr-1">
              <p className={`text-[9px] font-black leading-none uppercase tracking-widest text-slate-900`}>{liveBizName}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <div className={`h-0.5 w-10 rounded-full overflow-hidden bg-sky-100`}>
                  <div className="h-full rounded-full bg-sky-600" style={{ width: `${BIZ.healthScore}%` }} />
                </div>
                <span className={`text-[8px] font-black italic leading-none text-sky-600`}>{BIZ.healthScore}%</span>
              </div>
            </div>

            <div className="flex items-center gap-2 border-l border-sky-100/80 pl-3">
              <div
                onClick={() => { setActiveTab('user-profile'); switchTopNav('bizdesk'); }}
                className="w-10 h-10 rounded-full flex items-center justify-center font-black text-xs bg-linear-to-tr from-sky-600 to-blue-700 text-white cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all border-2 border-white/80"
                title={liveUserName}
              >
                {liveUserInitials}
              </div>
            </div>
          </div>
        </header>

        {/* ═══════ BODY ═══════ */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Mobile sidebar overlay */}
          <AnimatePresence>
            {sidebarOpen && showMainSidebar && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 bg-slate-900/40 z-30 transition-opacity"
                onClick={closeSidebar}
              />
            )}
          </AnimatePresence>

          {/* ─── BizDesk main left sidebar ─── */}
          <AnimatePresence mode="wait">
            {sidebarOpen && showMainSidebar && (
              <motion.aside
                key="bizdesk-sidebar-main"
                initial={{ x: -280, width: 0 }}
                animate={{
                  x: 0,
                  width: sidebarCollapsed ? 72 : 256,
                }}
                exit={{ x: -280, width: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                className={`fixed inset-y-0 left-0 z-40 flex h-full shrink-0 flex-col overflow-hidden border-r border-sky-100/60 bg-sky-50/90 shadow-2xl backdrop-blur-xl md:relative md:h-auto ${sidebarCollapsed ? 'md:w-[72px]' : 'md:w-64 w-[min(280px,88vw)]'
                  }`}
              >
                <div className="flex shrink-0 items-center justify-between gap-2 border-b border-sky-100/80 px-3 py-3">
                  {!sidebarCollapsed && (
                    <span className="truncate text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                      Navigation
                    </span>
                  )}
                  <div className={`flex items-center gap-1 ${sidebarCollapsed ? 'mx-auto' : 'ml-auto'}`}>
                    <button
                      type="button"
                      onClick={toggleSidebarCollapsed}
                      className="hidden h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-white text-slate-500 transition-all hover:bg-sky-50 hover:text-sky-700 md:flex"
                      title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                      <span className="material-symbols-rounded text-[18px]">
                        {sidebarCollapsed ? 'chevron_right' : 'chevron_left'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={closeSidebar}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 bg-white text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-800"
                      title="Close sidebar"
                    >
                      <span className="material-symbols-rounded text-[18px]">close</span>
                    </button>
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2 py-4 no-scrollbar md:px-3">
                  {(activeTopNav === 'bizdesk' ? BIZDESK_SIDEBAR : LEARN_SIDEBAR).map((section, si) => {
                    const filteredItems = section.items.filter(item => {
                      if (item.id === 'billease') return installedApps.includes('billbook');
                      if (item.id === 'billbook') return installedApps.includes('bizbook');
                      return true;
                    });
                    if (filteredItems.length === 0) return null;
                    return (
                      <div key={si} className="mb-5">
                        {!sidebarCollapsed && (
                          <h3
                            className={`mb-2 px-2 text-[10px] font-bold capitalize tracking-[0.15em] ${section.section.includes('ARKLE') || section.section.includes('AI PARTNER')
                                ? 'text-[#575CDE]'
                                : 'text-[#676879]'
                              }`}
                          >
                            {section.section === 'AI PARTNER'
                              ? 'Powered by Arkle AI'
                              : section.section.toLowerCase()}
                          </h3>
                        )}
                        <div className="space-y-1">
                          {filteredItems.map((item) => (
                            <button
                              key={item.label}
                              type="button"
                               onClick={() => {
                                 setActiveTab(item.id);
                                 if (window.innerWidth < 768) closeSidebar();
                               }}
                              title={sidebarCollapsed ? item.label : undefined}
                              className={`group flex w-full items-center rounded-lg py-2.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 hover:bg-white/80 ${sidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-3'
                                } ${activeTab === item.id ? 'bg-white shadow-sm ring-1 ring-sky-100' : ''}`}
                            >
                              <span
                                className={`shrink-0 text-center text-[16px] leading-none transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-[#0073ea]' : 'text-[#676879]'
                                  }`}
                              >
                                {item.icon}
                              </span>
                              {!sidebarCollapsed && (
                                <>
                                  <span
                                    className={`flex-1 truncate text-[12.5px] font-medium group-hover:underline ${activeTab === item.id ? 'text-[#0073ea]' : 'text-[#323338]'
                                      }`}
                                  >
                                    {item.label}
                                  </span>
                                  {item.badge && (
                                    <span className="ml-1 rounded-full bg-[#f5f6f8] px-1.5 py-0.5 text-[9px] font-bold text-[#676879]">
                                      {item.badge}
                                    </span>
                                  )}
                                </>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div
                  className={`mt-auto flex shrink-0 items-center border-t border-sky-100/60 p-2 ${sidebarCollapsed ? 'flex-col gap-2' : 'justify-between gap-2'
                    }`}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setActiveTab('user-profile');
                      if (window.innerWidth < 768) closeSidebar();
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && setActiveTab('user-profile')}
                    className={`flex cursor-pointer items-center rounded-lg py-2 transition-all hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${sidebarCollapsed ? 'justify-center px-2' : 'flex-1 gap-2.5 px-2'
                      }`}
                    title="User Profile"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0073ea] text-[13px] font-bold text-white">
                      {bizData?.name?.charAt(0) || 'M'}
                    </div>
                    {!sidebarCollapsed && (
                      <p className="min-w-0 flex-1 truncate text-[13px] font-normal text-[#323338]">
                        {bizData?.name || liveUserName}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('settings');
                      if (window.innerWidth < 768) closeSidebar();
                    }}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${activeTab === 'settings'
                        ? 'border border-slate-300 bg-slate-200 text-slate-900 shadow-inner'
                        : 'border border-transparent text-slate-400 hover:border-slate-200 hover:bg-white hover:text-slate-600'
                      }`}
                    title="OS Settings"
                  >
                    <span className="material-symbols-outlined text-[18px]">settings</span>
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
                  <div className="w-full h-full">
                    <div className="flex flex-col md:flex-row gap-3 md:gap-5 p-3 md:p-5 h-full">
                      {/* Main Workspace Area (Tab-based content) */}
                      <div className="flex-1 min-w-0 h-full overflow-y-auto pr-1">
                        {activeTab === 'home' && (
                          <HomeTab
                            data={bizData}
                            onOpenBillBook={openBillBook}
                            onOpenBillEase={openBillEase}
                            onOpenOrderDesk={openOrderDesk}
                            onGmailClick={() => {
                              if (isGoogleConnected) {
                                setActiveTab('google');
                              } else {
                                setShowGoogleConnect(true);
                              }
                            }}
                          />
                        )}
                        {activeTab === 'google' && (
                          <GoogleWorkspaceDashboard onBack={() => setActiveTab('home')} />
                        )}
                        {activeTab === 'company' && <CompanyTab />}
                        {activeTab === 'banking' && <BankingTab />}
                        {activeTab === 'sales' && <SalesTab />}
                        {activeTab === 'billbook' && <BillBookTab />}
                        {activeTab === 'billease' && <BilleaseTab />}
                        {activeTab === 'orderdesk' && <OrderDeskTab />}
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
                      </div>

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

            {/* Global Notes & Tasks Side-Drawer - SKYBLUE THEME */}
            <AnimatePresence>
              {notesOpen && (
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 right-0 z-[60] w-full max-w-sm bg-sky-50/80 backdrop-blur-3xl shadow-[-10px_0_40px_rgba(0,0,0,0.1)] border-l border-sky-100/60"
                >
                  <NotesAndTasksPanel onClose={() => setNotesOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Global Integrations Drawer - Monday Marketplace Style */}
            <AnimatePresence>
              {integrationsOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-4 md:inset-10 lg:inset-20 z-[200] bg-white shadow-[0_0_100px_rgba(0,0,0,0.2)] border border-slate-200 rounded-[32px] overflow-hidden flex flex-col"
                >
                  <IntegrationsPanel 
                    onClose={() => setIntegrationsOpen(false)} 
                    installedApps={installedApps}
                    onInstallApp={handleInstallApp}
                    onUninstallApp={handleUninstallApp}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Overlay for Marketplace */}
            <AnimatePresence>
              {integrationsOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[190]"
                  onClick={() => setIntegrationsOpen(false)}
                />
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
        {/* Arkle Floating Voice Launcher and Controls */}
        <ArkleVoiceLauncher />
      </div>
    </ArkleCoreProvider>
  );
}

// Inline component to keep page.tsx clean
function ArkleVoiceLauncher() {
  const [isOpen, setIsOpen] = React.useState(false);
  const isVoiceActive = useBizStore((state) => state.isVoiceActive);
  const setIsVoiceActive = useBizStore((state) => state.setIsVoiceActive);
  const isMuted = useBizStore((state) => state.isMuted);
  const setIsMuted = useBizStore((state) => state.setIsMuted);
  const isPaused = useBizStore((state) => state.isPaused);
  const setIsPaused = useBizStore((state) => state.setIsPaused);
  const [screenShared, setScreenShared] = React.useState(false);

  // Synchronize when the global isVoiceActive is updated elsewhere (e.g. from HomeTab)
  React.useEffect(() => {
    if (isVoiceActive) {
      setIsOpen(true);
    }
  }, [isVoiceActive]);

  const handleToggleVoice = () => {
    const newState = !isVoiceActive;
    setIsVoiceActive(newState);
    setIsOpen(newState);
    if (!newState) {
      setIsPaused(false);
      setIsMuted(false);
      setScreenShared(false);
    }
  };

  const handleClose = () => {
    setIsVoiceActive(false);
    setIsOpen(false);
    setIsPaused(false);
    setIsMuted(false);
    setScreenShared(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[200] flex items-center gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="flex items-center gap-3 bg-slate-900/95 backdrop-blur-xl p-3 rounded-full border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          >
            {/* Left Side: Mic On/Off */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMuted ? 'text-orange-400 bg-orange-400/10 hover:bg-orange-400/20' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              <span className="material-symbols-outlined text-[24px]">
                {isMuted ? 'mic_off' : 'mic'}
              </span>
            </button>

            {/* Pause Button */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPaused ? 'text-blue-400 bg-blue-400/10 hover:bg-blue-400/20' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              title={isPaused ? 'Resume Voice' : 'Pause Voice'}
            >
              <span className="material-symbols-outlined text-[24px]">
                {isPaused ? 'play_arrow' : 'pause'}
              </span>
            </button>

            {/* Center: Gemini Voice Style Liquid Blue Ball/Bubble Start/Stop Button */}
            <button
              onClick={handleToggleVoice}
              className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/20 active:scale-95 group overflow-hidden bg-slate-900"
              title={isVoiceActive ? 'Stop Session' : 'Start Session'}
            >
              {/* Shifting background liquid gradient */}
              <div className="absolute inset-0 overflow-hidden opacity-90 pointer-events-none">
                <div className="absolute inset-[-20%] bg-blue-600/30 animate-liquid [animation-duration:5s] mix-blend-screen blur-[25px] scale-150"></div>
                <div className="absolute inset-[-30%] bg-indigo-600/30 animate-liquid [animation-duration:8s] [animation-delay:-1s] mix-blend-screen blur-[30px] scale-125"></div>
                <div className="absolute inset-[-25%] bg-violet-600/30 animate-liquid [animation-duration:11s] [animation-delay:-3s] mix-blend-screen blur-[35px] scale-150"></div>
                <div className="absolute inset-[-40%] bg-cyan-400/20 animate-liquid [animation-duration:14s] [animation-delay:-5s] mix-blend-screen blur-[45px] scale-175"></div>
              </div>

              {/* The Central Liquid Morphing Blob */}
              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full scale-[1.3] z-10 opacity-70 mix-blend-overlay pointer-events-none">
                <defs>
                  <linearGradient id="launcherOrbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
                  fill="url(#launcherOrbGrad)"
                />
              </svg>

              {/* Heart Pulse Visualizer / Equalizer */}
              <div className="relative z-20 w-full h-full flex items-center justify-center">
                {isVoiceActive ? (
                  <div className="flex items-center gap-1 h-5 relative z-10">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-0.5 bg-white rounded-full animate-voice-wave shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                        style={{
                          height: i === 1 || i === 4 ? '60%' : '100%',
                          animationDelay: `${i * 0.15}s`
                        }}
                      ></div>
                    ))}
                  </div>
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-white/80 animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
              </div>
            </button>

            {/* Right Side: Screen Share */}
            <button
              onClick={() => setScreenShared(!screenShared)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${screenShared ? 'text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              title={screenShared ? 'Stop Sharing' : 'Share Screen'}
            >
              <span className="material-symbols-outlined text-[24px]">
                {screenShared ? 'stop_screen_share' : 'screen_share'}
              </span>
            </button>

            {/* Cancel Button */}
            <button
              onClick={handleClose}
              className="w-12 h-12 rounded-full flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
              title="Cancel Session"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating launcher button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 bg-gradient-to-tr from-slate-900 to-blue-900 rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 hover:scale-110 active:scale-95 transition-all"
          title="Open Arkle Voice Agent"
        >
          {/* Pulsing ring */}
          <div className="absolute inset-0 bg-blue-600/20 rounded-full animate-ping duration-1000 scale-125"></div>

          <span className="material-symbols-outlined text-white text-[28px] animate-pulse">psychology</span>

          {/* Online active green indicator */}
          <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-slate-950 rounded-full animate-bounce"></div>
        </button>
      )}
    </div>
  );
}
