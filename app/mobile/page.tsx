'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useBizStore } from '@/lib/useBizStore';
import { BIZ } from '@/lib/mockBizData';
import { ArkleCoreProvider } from '@/context/ArkleCoreContext';

// Tabs
import HomeTab from '@/components/os/HomeTab';
import CompanyTab from '@/components/os/CompanyTab';
import BankingTab from '@/components/os/BankingTab';
import SalesTab from '@/components/os/SalesTab';
import StartupStoreTab from '@/components/os/StartupStoreTab';
import CRMTab from '@/components/os/CRMTab';
import BillBookTab from '@/components/os/BillBookTab';
import SettingsTab from '@/components/os/SettingsTab';
import ExpertsTab from '@/components/os/ExpertsTab';
import GlobalTab from '@/components/os/GlobalTab';
import LoginStep from '@/components/steps/LoginStep';

type DeviceMode = 'oneplus-11r' | 'oneplus-pad3' | 'full';

export default function MobileDashboard() {
  return (
    <ArkleCoreProvider>
      <MobileDashboardContent />
    </ArkleCoreProvider>
  );
}

function MobileDashboardContent() {
  const { user, dbUser, dbBusiness, loading: authLoading } = useAuth();
  const [devSkip, setDevSkip] = useState(false);
  const [device, setDevice] = useState<DeviceMode>('oneplus-11r');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [appsDrawerOpen, setAppsDrawerOpen] = useState(false);
  const [installedApps, setInstalledApps] = useState<string[]>(['billbook', 'crm']);
  const [bizData, setBizData] = useState(BIZ);
  
  const liveUserName = dbUser?.full_name || user?.user_metadata?.full_name || 'Operator';
  const liveUserInitials = liveUserName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'OP';

  // State bypass
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setDevSkip(true);
    }
  }, []);

  // Load installed apps
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('setmybizz_installed_apps');
      if (saved) {
        try { setInstalledApps(JSON.parse(saved)); } catch (e) {}
      }
      const savedData = localStorage.getItem('setmybizz_data');
      if (savedData) {
        try { setBizData(prev => ({ ...prev, ...JSON.parse(savedData) })); } catch (e) {}
      }
    }
  }, []);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-slate-400 text-sm animate-pulse">Initializing Mobile Workspace...</p>
        </div>
      </div>
    );
  }

  // Auth gate
  if (!user && !devSkip) {
    return (
      <div className="relative min-h-screen w-full bg-slate-900">
        <LoginStep onLogin={() => {}} businessName={bizData.name || 'Your Business'} />
        <div className="absolute bottom-6 right-6 z-[9999]">
          <button
            onClick={() => setDevSkip(true)}
            className="px-5 py-3 bg-slate-900/90 hover:bg-slate-900 text-white rounded-2xl text-xs font-bold border border-white/20"
          >
            Developer Skip Login
          </button>
        </div>
      </div>
    );
  }

  // Render content depending on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab data={bizData} />;
      case 'company':
        return <CompanyTab />;
      case 'banking':
        return <BankingTab />;
      case 'sales':
        return <SalesTab />;
      case 'crm':
        return <CRMTab />;
      case 'billbook':
        return <BillBookTab />;
      case 'learn':
        return (
          <StartupStoreTab
            installedApps={installedApps}
            onInstall={(appId) => setInstalledApps(prev => [...prev, appId])}
            onUninstall={(appId) => setInstalledApps(prev => prev.filter(x => x !== appId))}
          />
        );
      case 'settings':
        return <SettingsTab />;
      case 'experts':
        return <ExpertsTab />;
      case 'global':
        return <GlobalTab />;
      default:
        return <HomeTab data={bizData} />;
    }
  };

  // Device sizes map
  const deviceStyles: Record<DeviceMode, string> = {
    'oneplus-11r': 'w-[393px] h-[851px] rounded-[48px] border-[12px] border-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] relative overflow-hidden bg-white',
    'oneplus-pad3': 'w-[800px] h-[1120px] rounded-[36px] border-[16px] border-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] relative overflow-hidden bg-white',
    'full': 'w-full h-full relative bg-white'
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-start overflow-x-hidden font-sans antialiased text-slate-800">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Plus+Jakarta+Sans:wght@300..800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        
        .mobile-viewport {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        /* Hide scrollbars but keep functionality */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Top Device Simulator Controller Bar */}
      <div className="w-full shrink-0 py-3 bg-[#111827] border-b border-slate-800 flex flex-wrap items-center justify-between px-6 z-50 gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center text-white">
            <span className="material-symbols-rounded text-sm">phone_iphone</span>
          </div>
          <span className="text-xs font-bold text-slate-300">BizOS Mobile Studio</span>
        </div>

        {/* Device Switcher */}
        <div className="flex bg-slate-850 p-1 rounded-xl border border-slate-700/50">
          {[
            { id: 'oneplus-11r', label: 'OnePlus 11R', icon: 'smartphone' },
            { id: 'oneplus-pad3', label: 'OnePlus Pad 3', icon: 'tablet_mac' },
            { id: 'full', label: 'Responsive Full', icon: 'fullscreen' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setDevice(mode.id as DeviceMode)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${device === mode.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <span className="material-symbols-rounded text-xs">{mode.icon}</span>
              {mode.label}
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="text-[10px] text-slate-400 font-mono hidden md:block">
          Host: <span className="text-emerald-400">setmybizz.in/mobile</span> | Port: 3001
        </div>
      </div>

      {/* Simulator Workspace Wrapper */}
      <div className={`flex-1 w-full flex items-center justify-center p-4 md:p-8 ${device === 'full' ? 'p-0' : ''}`}>
        <div className={deviceStyles[device]}>
          
          {/* OnePlus 11R Punch Hole camera inside mockup */}
          {device === 'oneplus-11r' && (
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-900 z-50 flex items-center justify-center border border-slate-800 pointer-events-none">
              <div className="w-1 h-1 bg-blue-900 rounded-full" />
            </div>
          )}

          {/* OnePlus 11R Status Bar Mock */}
          {device === 'oneplus-11r' && (
            <div className="h-8 bg-white flex items-center justify-between px-6 text-[10px] font-bold text-slate-600 select-none z-40 relative">
              <span>9:30 AM</span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-rounded text-[11px]">wifi</span>
                <span className="material-symbols-rounded text-[11px]">signal_cellular_4_bar</span>
                <span className="material-symbols-rounded text-[11px]">battery_5_bar</span>
              </div>
            </div>
          )}

          {/* Mobile Shell Layout */}
          <div className="w-full h-full flex flex-col bg-white mobile-viewport relative">
            
            {/* White Top Header */}
            <header className="h-14 shrink-0 bg-white border-b border-slate-100 flex items-center justify-between px-5 sticky top-0 z-35">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
                  <span className="material-symbols-rounded text-xs text-white">rocket_launch</span>
                </div>
                <span className="font-extrabold text-[14px] text-slate-850 tracking-tight uppercase">BIZOS</span>
                <span className="px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[8px] font-black tracking-widest uppercase">Mobile</span>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Apps Drawer Trigger */}
                <button
                  onClick={() => setAppsDrawerOpen(true)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100 shadow-xs"
                >
                  <span className="material-symbols-rounded text-[18px]">apps</span>
                </button>
                {/* User Profile Avatar */}
                <button 
                  onClick={() => setActiveTab('user-profile')}
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-blue-700 text-white font-extrabold text-[10px] flex items-center justify-center shadow-md border-2 border-white"
                >
                  {liveUserInitials}
                </button>
              </div>
            </header>

            {/* Scrollable Tab Body */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-white">
              <div className="p-4">
                {renderTabContent()}
              </div>
            </div>

            {/* Floating Custom Screenshot Navigation Bar */}
            <div className="absolute bottom-5 inset-x-0 flex items-center justify-center z-40 px-4 pointer-events-none">
              <nav 
                className="bg-white/95 backdrop-blur-md rounded-full border border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.12)] h-[58px] flex items-center gap-3 px-4 py-1 pointer-events-auto transition-transform hover:scale-[1.01]"
              >
                {/* BIZHUB Tag Segment */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span className="text-[10px] font-black tracking-widest text-slate-800 uppercase">BIZHUB</span>
                </div>
                
                {/* Vertical Separator */}
                <div className="w-[1px] h-5 bg-slate-200" />

                {/* 1. Active Arkle Brain Button */}
                <button
                  onClick={() => { setActiveTab('home'); setAppsDrawerOpen(false); }}
                  className={`w-[38px] h-[38px] rounded-[12px] flex items-center justify-center transition-all ${
                    activeTab === 'home' 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105' 
                      : 'bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-600'
                  }`}
                  title="Arkle AI Control Room"
                >
                  <span className="text-[18px]">🧠</span>
                </button>

                {/* 2. Business Vault Shield Button */}
                <button
                  onClick={() => { setActiveTab('company'); setAppsDrawerOpen(false); }}
                  className={`w-[38px] h-[38px] rounded-[12px] flex items-center justify-center transition-all ${
                    activeTab === 'company' 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105' 
                      : 'bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-600'
                  }`}
                  title="Business Vault"
                >
                  <span className="text-[18px]">🛡️</span>
                </button>

                {/* 3. Financial Desk Credit Card Button */}
                <button
                  onClick={() => { setActiveTab('banking'); setAppsDrawerOpen(false); }}
                  className={`w-[38px] h-[38px] rounded-[12px] flex items-center justify-center transition-all ${
                    activeTab === 'banking' 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105' 
                      : 'bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-600'
                  }`}
                  title="Financial Desk"
                >
                  <span className="text-[18px]">💳</span>
                </button>

                {/* 4. Sales Desk Target Button */}
                <button
                  onClick={() => { setActiveTab('sales'); setAppsDrawerOpen(false); }}
                  className={`w-[38px] h-[38px] rounded-[12px] flex items-center justify-center transition-all ${
                    activeTab === 'sales' 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105' 
                      : 'bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-600'
                  }`}
                  title="Sales Desk"
                >
                  <span className="text-[18px]">🎯</span>
                </button>

                {/* Vertical Separator */}
                <div className="w-[1px] h-5 bg-slate-200" />

                {/* 5. App Grid Widget Launcher (Black Button) */}
                <button
                  onClick={() => setAppsDrawerOpen(true)}
                  className="w-[38px] h-[38px] rounded-[12px] bg-[#0c111e] flex items-center justify-center text-white hover:scale-105 active:scale-95 shadow-md transition-all"
                  title="Ecosystem Apps Drawer"
                >
                  <span className="material-symbols-rounded text-[18px] text-white">grid_view</span>
                </button>
              </nav>
            </div>

            {/* Slide-Up Bottom Drawer for Other Apps */}
            <AnimatePresence>
              {appsDrawerOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setAppsDrawerOpen(false)}
                    className="absolute inset-0 bg-slate-950 z-45"
                  />
                  {/* Drawer Sheet */}
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                    className="absolute bottom-0 inset-x-0 bg-white rounded-t-[32px] border-t border-slate-200 shadow-2xl p-6 pb-8 z-50 max-h-[75%] overflow-y-auto"
                  >
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 cursor-pointer" onClick={() => setAppsDrawerOpen(false)} />
                    
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Ecosystem Applications</h3>
                    
                    <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                      {[
                        { id: 'crm', name: 'CRM Hub', icon: 'group', color: 'text-sky-500' },
                        { id: 'billbook', name: 'Bill Book', icon: 'receipt_long', color: 'text-emerald-500' },
                        { id: 'learn', name: 'Startup Store', icon: 'shopping_bag', color: 'text-indigo-500' },
                        { id: 'experts', name: 'Experts', icon: 'support_agent', color: 'text-amber-500' },
                        { id: 'global', name: 'Go Global', icon: 'public', color: 'text-rose-500' },
                        { id: 'settings', name: 'Settings', icon: 'settings', color: 'text-slate-500' }
                      ].map((app) => (
                        <button
                          key={app.id}
                          onClick={() => {
                            setActiveTab(app.id);
                            setAppsDrawerOpen(false);
                          }}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className="w-14 h-14 rounded-[18px] bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-slate-100 transition-all">
                            <span className={`material-symbols-rounded text-[24px] ${app.color}`}>{app.icon}</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 truncate w-full text-center">{app.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
}
