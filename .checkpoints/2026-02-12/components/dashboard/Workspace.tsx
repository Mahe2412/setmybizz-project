"use client";

import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import SortableToolCard from './SortableToolCard';
import ContextMenu from './ContextMenu';
import IntegrationModal from './IntegrationModal';
import GoogleIntegrationModal from './GoogleIntegrationModal';
import GoogleWorkspaceDashboard, { GoogleApp } from './GoogleWorkspaceDashboard';
import AiCoFounderChat from './AiCoFounderChat';
import AdvancedOnboarding from '../AdvancedOnboarding';
import CenterChat from '../ai-studio/CenterChat';

interface WorkspaceProps {
    onNavigate: (tab: 'A' | 'B' | 'LearnerStudio' | 'Workspace') => void;
}
const colorVariants: Record<string, { bg: string, bg100: string, text: string, hoverBg: string, hoverText: string, border: string, from: string }> = {
    blue: { bg: 'bg-blue-50', bg100: 'bg-blue-100', text: 'text-blue-600', hoverBg: 'group-hover:bg-blue-600', hoverText: 'group-hover:text-white', border: 'hover:border-blue-200', from: 'from-blue-50' },
    indigo: { bg: 'bg-indigo-50', bg100: 'bg-indigo-100', text: 'text-indigo-600', hoverBg: 'group-hover:bg-indigo-600', hoverText: 'group-hover:text-white', border: 'hover:border-indigo-200', from: 'from-indigo-50' },
    purple: { bg: 'bg-purple-50', bg100: 'bg-purple-100', text: 'text-purple-600', hoverBg: 'group-hover:bg-purple-600', hoverText: 'group-hover:text-white', border: 'hover:border-purple-200', from: 'from-purple-50' },
    pink: { bg: 'bg-pink-50', bg100: 'bg-pink-100', text: 'text-pink-600', hoverBg: 'group-hover:bg-pink-600', hoverText: 'group-hover:text-white', border: 'hover:border-pink-200', from: 'from-pink-50' },
    rose: { bg: 'bg-rose-50', bg100: 'bg-rose-100', text: 'text-rose-600', hoverBg: 'group-hover:bg-rose-600', hoverText: 'group-hover:text-white', border: 'hover:border-rose-200', from: 'from-rose-50' },
    red: { bg: 'bg-red-50', bg100: 'bg-red-100', text: 'text-red-600', hoverBg: 'group-hover:bg-red-600', hoverText: 'group-hover:text-white', border: 'hover:border-red-200', from: 'from-red-50' },
    orange: { bg: 'bg-orange-50', bg100: 'bg-orange-100', text: 'text-orange-600', hoverBg: 'group-hover:bg-orange-600', hoverText: 'group-hover:text-white', border: 'hover:border-orange-200', from: 'from-orange-50' },
    emerald: { bg: 'bg-emerald-50', bg100: 'bg-emerald-100', text: 'text-emerald-600', hoverBg: 'group-hover:bg-emerald-600', hoverText: 'group-hover:text-white', border: 'hover:border-emerald-200', from: 'from-emerald-50' },
    teal: { bg: 'bg-teal-50', bg100: 'bg-teal-100', text: 'text-teal-600', hoverBg: 'group-hover:bg-teal-600', hoverText: 'group-hover:text-white', border: 'hover:border-teal-200', from: 'from-teal-50' },
    cyan: { bg: 'bg-cyan-50', bg100: 'bg-cyan-100', text: 'text-cyan-600', hoverBg: 'group-hover:bg-cyan-600', hoverText: 'group-hover:text-white', border: 'hover:border-cyan-200', from: 'from-cyan-50' },
    green: { bg: 'bg-green-50', bg100: 'bg-green-100', text: 'text-green-600', hoverBg: 'group-hover:bg-green-600', hoverText: 'group-hover:text-white', border: 'hover:border-green-200', from: 'from-green-50' },
    yellow: { bg: 'bg-yellow-50', bg100: 'bg-yellow-100', text: 'text-yellow-600', hoverBg: 'group-hover:bg-yellow-600', hoverText: 'group-hover:text-white', border: 'hover:border-yellow-200', from: 'from-yellow-50' },
    violet: { bg: 'bg-violet-50', bg100: 'bg-violet-100', text: 'text-violet-600', hoverBg: 'group-hover:bg-violet-600', hoverText: 'group-hover:text-white', border: 'hover:border-violet-200', from: 'from-violet-50' },
    fuchsia: { bg: 'bg-fuchsia-50', bg100: 'bg-fuchsia-100', text: 'text-fuchsia-600', hoverBg: 'group-hover:bg-fuchsia-600', hoverText: 'group-hover:text-white', border: 'hover:border-fuchsia-200', from: 'from-fuchsia-50' },
    amber: { bg: 'bg-amber-50', bg100: 'bg-amber-100', text: 'text-amber-600', hoverBg: 'group-hover:bg-amber-600', hoverText: 'group-hover:text-white', border: 'hover:border-amber-200', from: 'from-amber-50' },
};

const Workspace: React.FC<WorkspaceProps> = ({ onNavigate }) => {
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
    const [mobileLeftSidebarOpen, setMobileLeftSidebarOpen] = useState(false);
    const [mobileAiAssistantsOpen, setMobileAiAssistantsOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(true);
    const [integrationModalOpen, setIntegrationModalOpen] = useState(false);
    const [selectedToolForIntegration, setSelectedToolForIntegration] = useState<string | null>(null);
    const [googleModalOpen, setGoogleModalOpen] = useState(false);
    const [isGoogleConnected, setIsGoogleConnected] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, label: string } | null>(null);
    const [showGoogleDashboard, setShowGoogleDashboard] = useState(false);
    const [embeddedApp, setEmbeddedApp] = useState<{ url: string; label: string } | null>(null);
    const [showAppSelector, setShowAppSelector] = useState(false);
    const [showAIWorkspaceSetup, setShowAIWorkspaceSetup] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const [showNewUserPopup, setShowNewUserPopup] = useState(false);

    // Check if user is new (no workspace profile)
    useEffect(() => {
        const hasProfile = localStorage.getItem('workspaceProfile');
        setIsNewUser(!hasProfile);
    }, []);

    // Show popup every 40 seconds for new users
    useEffect(() => {
        if (!isNewUser) return;

        const timer = setInterval(() => {
            setShowNewUserPopup(true);
        }, 40000); // 40 seconds

        return () => clearInterval(timer);
    }, [isNewUser]);

    // Default pinned apps
    const [pinnedApps, setPinnedApps] = useState<GoogleApp[]>([
        { id: 'gmail', label: 'Gmail', icon: 'mail', color: 'red', url: 'https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1' }, // Compose view is cleaner for embed if poss
        { id: 'calendar', label: 'Calendar', icon: 'calendar_today', color: 'blue', url: 'https://calendar.google.com/calendar/embed?src=en.indian%23holiday%40group.v.calendar.google.com&ctz=Asia%2FKolkata' }
    ]);

    const AVAILABLE_GOOGLE_APPS = [
        { id: 'gmail', label: 'Gmail', icon: 'mail', color: 'red', url: 'https://mail.google.com/' },
        { id: 'drive', label: 'Drive', icon: 'add_to_drive', color: 'green', url: 'https://drive.google.com/drive/' },
        { id: 'calendar', label: 'Calendar', icon: 'calendar_today', color: 'blue', url: 'https://calendar.google.com/' },
        { id: 'docs', label: 'Docs', icon: 'description', color: 'blue', url: 'https://docs.google.com/' },
        { id: 'sheets', label: 'Sheets', icon: 'table_chart', color: 'green', url: 'https://docs.google.com/spreadsheets/' },
        { id: 'slides', label: 'Slides', icon: 'slideshow', color: 'orange', url: 'https://docs.google.com/presentation/' },
        { id: 'keep', label: 'Keep', icon: 'lightbulb', color: 'yellow', url: 'https://keep.google.com/' },
        { id: 'meet', label: 'Meet', icon: 'videocam', color: 'purple', url: 'https://meet.google.com/' }
    ];

    const handlePinApp = (app: GoogleApp) => {
        if (!pinnedApps.find(p => p.id === app.id)) {
            setPinnedApps([...pinnedApps, app]);
        }
        setShowAppSelector(false);
    };

    const handleOpenApp = (app: GoogleApp) => {
        // For actual embedding, we use the viewer overlay
        // Note: Many Google Apps block standard iframes (X-Frame-Options). 
        // We will try to use specific embed URLs where possible, otherwise open New Window.

        const isEmbeddable = app.id === 'calendar' || app.id === 'docs' || app.id === 'sheets' || app.id === 'slides';

        if (isEmbeddable && app.url) {
            setEmbeddedApp({ url: app.url, label: app.label });
        } else if (app.url) {
            window.open(app.url, '_blank');
        }
    };

    const [tools, setTools] = useState([
        { id: '1', label: 'Website', icon: 'language', color: 'blue' },
        { id: '2', label: 'Store', icon: 'storefront', color: 'indigo' },
        { id: '3', label: 'Orders', icon: 'receipt_long', color: 'emerald' },
        { id: '4', label: 'Inventory', icon: 'inventory_2', color: 'teal' },
        { id: '5', label: 'Payments', icon: 'payments', color: 'fuchsia' },
        { id: '6', label: 'Suppliers', icon: 'local_shipping', color: 'cyan' },
        { id: '7', label: 'Stock', icon: 'warehouse', color: 'rose' },
        { id: '8', label: 'Analytics', icon: 'analytics', color: 'orange' },
        { id: '9', label: 'Ads', icon: 'campaign', color: 'amber' },
        { id: '10', label: 'Goals', icon: 'flag', color: 'red' },
    ]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setTools((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleIntegrationSave = (data: any) => {
        console.log('Integration saved:', data);
        setIntegrationModalOpen(false);
        // Show success notification logic here
    };

    const handleContextMenu = (e: React.MouseEvent, label: string) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, label });
    };



    return (
        <div className="flex h-screen overflow-hidden bg-white font-sans text-slate-900 transition-colors duration-200">
            {/* Google Workspace Dashboard Overlay */}
            {showGoogleDashboard && (
                <GoogleWorkspaceDashboard
                    onBack={() => setShowGoogleDashboard(false)}
                    onPinApp={handlePinApp}
                />
            )}

            {/* Mobile Sidebar Backdrop */}
            {mobileLeftSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileLeftSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 transform lg:hidden ${mobileLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-transparent flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <img src="/images/logo.png" alt="SetMyBizz Logo" className="h-14 w-auto object-contain" />
                    </div>
                    <button onClick={() => setMobileLeftSidebarOpen(false)} className="text-slate-500 hover:text-slate-800">
                        <span className="material-icons-outlined">close</span>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-3 space-y-6 py-4">
                    <div className="space-y-1">
                        <button onClick={() => onNavigate('A')} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-blue-600 rounded-lg font-medium w-full text-left transition-colors">
                            <span className="material-icons-outlined text-xl">home</span> Dashboard A
                        </button>
                        <button onClick={() => onNavigate('B')} className="flex items-center gap-3 px-3 py-2.5 bg-blue-50 text-blue-600 rounded-lg font-bold w-full text-left">
                            <span className="material-icons-outlined text-xl">rocket_launch</span> Dashboard B
                        </button>
                        <button onClick={() => onNavigate('LearnerStudio')} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-blue-600 rounded-lg font-medium w-full text-left transition-colors">
                            <span className="material-icons-outlined text-xl">school</span> Learner Studio
                        </button>
                    </div>
                </div>
            </aside>

            {/* Desktop Left Sidebar */}
            <aside className={`hidden lg:flex flex-col h-full flex-shrink-0 z-30 transition-all duration-300 ${leftSidebarOpen ? 'w-64' : 'w-0'}`}>
                <div className={`bg-slate-50 border-r border-slate-200 flex flex-col h-full w-64 overflow-hidden`}>
                    <div className="h-16 flex items-center px-6 border-b border-slate-100 flex-shrink-0 bg-white">
                        <div className="flex items-center gap-2">
                            <span className="font-serif font-black text-xl text-slate-900 tracking-tighter">SetMyBizz<span className="text-blue-600">.</span></span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4 px-3 space-y-8 scrollbar-hide">
                        <div className="space-y-1">
                            <button onClick={() => onNavigate('A')} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-white hover:shadow-sm hover:text-blue-600 rounded-xl font-bold text-xs uppercase tracking-widest w-full text-left transition-all duration-300">
                                <span className="material-icons text-lg">home</span> Dashboard A
                            </button>
                            <button onClick={() => onNavigate('B')} className="flex items-center gap-3 px-3 py-2.5 bg-white text-blue-600 rounded-xl font-bold text-xs uppercase tracking-widest w-full text-left shadow-md border border-blue-50 ring-1 ring-black/5">
                                <span className="material-icons text-lg">rocket_launch</span> Dashboard B
                            </button>
                            <button onClick={() => onNavigate('LearnerStudio')} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-white hover:shadow-sm hover:text-blue-600 rounded-xl font-bold text-xs uppercase tracking-widest w-full text-left transition-all duration-300">
                                <span className="material-icons text-lg">school</span> Learner Studio
                            </button>
                        </div>
                        {/* Google Workspace Quick Access */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-2.5 border border-blue-100">
                            <div className="flex items-center gap-1.5 mb-2">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold text-slate-700">Workspace</span>
                                <button
                                    onClick={() => setShowGoogleDashboard(true)}
                                    className="ml-auto p-0.5 hover:bg-white/50 rounded transition-colors"
                                    title="Open Full Dashboard"
                                >
                                    <span className="material-icons text-xs text-slate-500">open_in_new</span>
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {pinnedApps.slice(0, 6).map((app) => (
                                    <button
                                        key={app.id}
                                        onClick={() => handleOpenApp(app)}
                                        className={`flex items-center gap-1 px-1.5 py-1 bg-white hover:bg-${app.color}-50 rounded-md transition-colors group text-left flex-1 min-w-[45%]`}
                                        title={app.label}
                                    >
                                        <span className={`material-icons text-sm text-${app.color}-600`}>{app.icon}</span>
                                        <span className="text-[9px] font-bold text-slate-600 truncate">{app.label}</span>
                                    </button>
                                ))}
                                <button
                                    onClick={() => setShowAppSelector(true)}
                                    className="flex items-center justify-center px-1.5 py-1 border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 rounded-md transition-colors group flex-1"
                                    title="Add App"
                                >
                                    <span className="material-icons text-sm text-slate-400 group-hover:text-blue-500">add</span>
                                </button>
                            </div>
                        </div>

                        {/* Operations */}
                        <div>
                            <h3 className="px-3 text-xs font-serif font-bold text-slate-500 mb-3 tracking-wide">Operations</h3>
                            <nav className="space-y-1">
                                {[
                                    { label: 'Website Management', icon: 'language', color: 'blue' },
                                    { label: 'Store', icon: 'storefront', color: 'indigo' },
                                    { label: 'Orders', icon: 'receipt_long', color: 'orange' },
                                    { label: 'Inventory', icon: 'inventory_2', color: 'emerald' },
                                    { label: 'Stock Management', icon: 'warehouse', color: 'teal' },
                                    { label: 'Suppliers', icon: 'local_shipping', color: 'cyan' }
                                ].map((item, idx) => (
                                    <a key={idx} className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm rounded-xl text-sm font-medium transition-all duration-300 group" href="#">
                                        <div className={`p-1.5 rounded-lg ${colorVariants[item.color]?.bg || colorVariants.blue.bg} ${colorVariants[item.color]?.text || colorVariants.blue.text} group-hover:scale-110 transition-transform duration-300`}>
                                            <span className="material-icons text-lg">{item.icon}</span>
                                        </div>
                                        {item.label}
                                    </a>
                                ))}
                            </nav>
                        </div>
                        {/* Finance & Accounting */}
                        <div>
                            <h3 className="px-3 text-xs font-serif font-bold text-slate-500 mb-3 tracking-wide">Finance & Accounting</h3>
                            <nav className="space-y-1">
                                {[
                                    { label: 'Invoices', icon: 'description', color: 'blue' },
                                    { label: 'Quotations', icon: 'request_quote', color: 'indigo' },
                                    { label: 'Bills', icon: 'receipt', color: 'violet' },
                                    { label: 'Expenses', icon: 'payments', color: 'fuchsia' }
                                ].map((item, idx) => (
                                    <a key={idx} className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm rounded-xl text-sm font-medium transition-all duration-300 group" href="#">
                                        <div className={`p-1.5 rounded-lg ${colorVariants[item.color]?.bg || colorVariants.blue.bg} ${colorVariants[item.color]?.text || colorVariants.blue.text} group-hover:scale-110 transition-transform duration-300`}>
                                            <span className="material-icons text-lg">{item.icon}</span>
                                        </div>
                                        {item.label}
                                    </a>
                                ))}
                            </nav>
                        </div>
                        {/* Sales & CRM */}
                        <div>
                            <h3 className="px-3 text-xs font-serif font-bold text-slate-500 mb-3 tracking-wide">Sales & CRM</h3>
                            <nav className="space-y-1">
                                {[
                                    { label: 'Leads', icon: 'leaderboard', color: 'rose' },
                                    { label: 'CRM', icon: 'people', color: 'pink' }
                                ].map((item, idx) => (
                                    <a key={idx} className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm rounded-xl text-sm font-medium transition-all duration-300 group" href="#">
                                        <div className={`p-1.5 rounded-lg ${colorVariants[item.color]?.bg || colorVariants.blue.bg} ${colorVariants[item.color]?.text || colorVariants.blue.text} group-hover:scale-110 transition-transform duration-300`}>
                                            <span className="material-icons text-lg">{item.icon}</span>
                                        </div>
                                        {item.label}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
                <header className="h-16 flex items-center justify-between px-4 lg:px-8 relative z-10 border-b border-slate-200/50 backdrop-blur-sm flex-shrink-0 bg-white/50">
                    <div className="flex items-center gap-4">
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                            className="hidden lg:flex items-center gap-2 text-slate-600 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors font-medium text-sm"
                            title="Toggle AI Assistants"
                        >
                            <span className="material-icons-outlined text-xl">smart_toy</span>
                            <span className="hidden xl:inline">AI Tools</span>
                            <span className="material-icons-outlined text-sm">{rightSidebarOpen ? 'chevron_right' : 'chevron_left'}</span>
                        </button>
                        <button
                            onClick={() => setMobileAiAssistantsOpen(true)}
                            className="lg:hidden text-slate-600 hover:bg-slate-100 p-2 rounded-lg"
                            title="Open AI Assistants"
                        >
                            <span className="material-icons-outlined text-xl">smart_toy</span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full" id="main-scroll-container">
                    <div className="absolute top-0 left-0 w-full h-full bg-white z-0"></div>

                    {/* Content Section 1: AI Co-Founder (Top View) */}
                    <div className="relative z-10 p-4 lg:p-8 flex flex-col items-center justify-start lg:justify-center min-w-0 transition-all duration-300">
                        {/* Oracle AI Studio Chat - Hero Section */}
                        <div className="w-full h-[600px] bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                            <CenterChat
                                chatId="workspace-main"
                                leftSidebarOpen={leftSidebarOpen}
                                rightSidebarOpen={rightSidebarOpen}
                                onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
                                onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
                            />
                        </div>
                    </div>

                    {/* Interactive Operations Grid */}
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Operations</h2>
                        </div>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={tools} strategy={rectSortingStrategy}>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                    {tools.map((tool) => (
                                        <SortableToolCard
                                            key={tool.id}
                                            id={tool.id}
                                            label={tool.label}
                                            icon={tool.icon}
                                            color={tool.color}
                                            onContextMenu={handleContextMenu}
                                            onClick={() => console.log('Clicked', tool.label)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </section>



                    {/* Add Iterations Section */}
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h2 className="text-sm font-bold text-slate-900 font-serif">Add Iterations</h2>
                            <span className="material-icons-outlined text-blue-600 text-lg cursor-pointer">arrow_forward</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {[
                                { label: 'Website', icon: 'language', color: 'blue' },
                                { label: 'Store', icon: 'storefront', color: 'indigo' },
                                { label: 'Inventory', icon: 'inventory_2', color: 'emerald' },
                                { label: 'Orders', icon: 'receipt_long', color: 'violet' },
                                { label: 'Suppliers', icon: 'local_shipping', color: 'orange' },
                                { label: 'Stock', icon: 'warehouse', color: 'teal' },
                                { label: 'Purchase', icon: 'shopping_bag', color: 'rose' },
                                { label: 'Workflow Builder', icon: 'account_tree', color: 'indigo', dashed: true }
                            ].map((item, i) => (
                                <div key={i} className={`p-6 rounded-2xl flex flex-col items-center justify-center gap-4 hover:shadow-md transition-all cursor-pointer group h-full ${item.dashed ? 'border-2 border-dashed border-indigo-200 bg-indigo-50/50 hover:border-indigo-400' : 'bg-white border border-slate-100 shadow-sm'}`}>
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${item.dashed ? 'bg-indigo-100 text-indigo-600' : `${colorVariants[item.color]?.bg || colorVariants.blue.bg} ${colorVariants[item.color]?.text || colorVariants.blue.text}`}`}>
                                        <span className="material-icons text-xl">{item.icon}</span>
                                    </div>
                                    <span className={`text-xs font-bold ${item.dashed ? 'text-indigo-600' : 'text-slate-700'}`}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Add Integrations Section */}
                    <section className="mb-24">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h2 className="text-sm font-bold text-slate-900 font-serif">Add Integrations</h2>
                            <span className="material-icons-outlined text-blue-600 text-lg cursor-pointer">arrow_forward</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Bank Account', icon: 'account_balance', color: 'blue' },
                                { label: 'Ecommerce', icon: 'shopping_bag', color: 'green' },
                                { label: 'Shopify', icon: 'store', color: 'emerald', img: 'https://cdn.worldvectorlogo.com/logos/shopify.svg' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-4 hover:shadow-md transition-all">
                                    <div className={`w-10 h-10 rounded-lg ${colorVariants[item.color]?.bg || colorVariants.blue.bg} flex items-center justify-center ${item.color === 'emerald' ? 'text-emerald-600' : `text-${item.color}-600`}`}>
                                        {item.img ? (
                                            <img src={item.img} className="w-6 h-6" alt={item.label} />
                                        ) : (
                                            <span className="material-icons text-xl">{item.icon}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-xs text-slate-700">{item.label}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedToolForIntegration(item.label);
                                            setIntegrationModalOpen(true);
                                        }}
                                        className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600"
                                    >
                                        CONNECT
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>


                </div>
            </main>

            {/* Right Sidebar - AI Assistant */}
            <aside className={`fixed lg:static inset-y-0 right-0 h-full border-l border-slate-200 z-50 transition-all duration-300 transform bg-white flex flex-col ${rightSidebarOpen ? 'w-80 translate-x-0' : 'w-0 translate-x-full lg:translate-x-0 lg:w-0 overflow-hidden'} ${mobileAiAssistantsOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                <div className="flex flex-col h-full bg-slate-50/50">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
                        <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                            <span className="material-icons-outlined text-blue-500">smart_toy</span> AI Co-Founder
                        </h2>
                        <button onClick={() => setMobileAiAssistantsOpen(false)} className="lg:hidden text-slate-400">
                            <span className="material-icons">close</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                        {/* AI Tools List */}
                        <div className="space-y-3">
                            <div className="px-1 py-2">
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">AI Assistants & Tools</h3>
                                <div className="space-y-3">
                                    {[
                                        { label: 'AI Email Assistant', desc: 'Drafts, replies & management', icon: 'email', color: 'blue' },
                                        { label: 'WhatsApp', desc: 'Business API Integration', icon: 'chat', color: 'green' },
                                        { label: 'Social Media Management', desc: 'Schedule & analyze posts', icon: 'share', color: 'purple' },
                                        { label: 'Generate SM Content', desc: 'AI-generated posts & visuals', icon: 'auto_awesome', color: 'pink' },
                                        { label: 'Marketing Funnel', desc: 'Lead generation & nurturing', icon: 'filter_alt', color: 'orange' },
                                        { label: 'Generate Quotation', desc: 'Instant price quotes', icon: 'request_quote', color: 'emerald' },
                                        { label: 'Stock', desc: 'Inventory tracking', icon: 'inventory_2', color: 'cyan' },
                                        { label: 'Tasks', desc: 'Team & project tasks', icon: 'task_alt', color: 'amber' }
                                    ].map((tool, i) => (
                                        <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 hover:shadow-md cursor-pointer transition-all flex items-center gap-3 group">
                                            <div className={`w-10 h-10 rounded-lg ${colorVariants[tool.color]?.bg || colorVariants.blue.bg} flex items-center justify-center ${colorVariants[tool.color]?.text || colorVariants.blue.text} group-hover:scale-110 transition-transform`}>
                                                <span className="material-icons-outlined">{tool.icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-xs text-slate-800 truncate">{tool.label}</h4>
                                                <p className="text-[10px] text-slate-500 truncate">{tool.desc}</p>
                                            </div>
                                            <span className="material-icons-outlined text-slate-300 text-sm group-hover:text-blue-600">chevron_right</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Marketplace */}
                        <div>
                            <h2 className="font-bold text-slate-800 text-sm mb-4 font-serif">Marketplace</h2>
                            <div className="space-y-3">
                                <div
                                    onClick={() => {
                                        if (isGoogleConnected) {
                                            setShowGoogleDashboard(true);
                                        } else {
                                            setGoogleModalOpen(true);
                                        }
                                    }}
                                    className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:shadow-md cursor-pointer transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center group-hover:border-red-100 transition-colors">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-xs font-bold text-slate-700 block group-hover:text-red-600 transition-colors">Google Workspace</span>
                                        <span className="text-[10px] text-slate-400">Mail, Drive & Docs</span>
                                    </div>
                                    <span className="material-icons-outlined text-slate-300 text-sm group-hover:text-red-500">chevron_right</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:shadow-md cursor-pointer transition-all group">
                                    <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center group-hover:scale-110 transition-transform"><span className="material-icons text-yellow-600 text-lg">store</span></div>
                                    <span className="text-xs font-bold text-slate-700 group-hover:text-yellow-700 transition-colors">Zoho Marketplace</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:shadow-md cursor-pointer transition-all group">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform"><span className="material-icons text-blue-600 text-lg">extension</span></div>
                                    <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700 transition-colors">Explore Plugins</span>
                                </div>
                            </div>
                        </div>

                        <div
                            onClick={() => {
                                setSelectedToolForIntegration('Custom App');
                                setIntegrationModalOpen(true);
                            }}
                            className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl hover:shadow-md cursor-pointer transition-all group"
                        >
                            <span className="material-icons-outlined text-indigo-600 group-hover:scale-110 transition-transform">add_link</span>
                            <span className="text-xs font-bold text-indigo-700">Connect App & Integrate</span>
                        </div>
                        <button className="w-full text-center text-xs text-blue-600 font-bold hover:underline">Browse All Tools</button>
                    </div>
                </div>
            </aside>


            {/* Google Integration Modal */}
            {googleModalOpen && (
                <GoogleIntegrationModal
                    onClose={() => setGoogleModalOpen(false)}
                    onConnect={() => {
                        setIsGoogleConnected(true);
                        setGoogleModalOpen(false);
                        setShowGoogleDashboard(true);
                    }}
                />
            )}

            {/* Context Menu */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    options={[
                        {
                            label: 'Connect Tool', icon: 'link', action: () => {
                                setSelectedToolForIntegration(contextMenu.label);
                                setIntegrationModalOpen(true);
                            }
                        },
                        { label: 'Settings', icon: 'settings', action: () => console.log('Settings for', contextMenu.label) },
                        { label: 'Remove', icon: 'delete', danger: true, action: () => console.log('Remove', contextMenu.label) },
                    ]}
                />
            )}


            {/* Embedded App Viewer Layer */}
            {embeddedApp && (
                <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-8">
                    <div className="bg-white w-full h-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
                        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" className="w-4 h-4" />
                                </div>
                                <h3 className="font-bold text-slate-800">{embeddedApp.label}</h3>
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wide">Live</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => window.open(embeddedApp.url, '_blank')} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500" title="Open in New Tab">
                                    <span className="material-icons text-lg">open_in_new</span>
                                </button>
                                <button onClick={() => setEmbeddedApp(null)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-red-500 transition-colors">
                                    <span className="material-icons text-lg">close</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 bg-slate-100 relative">
                            <iframe
                                src={embeddedApp.url}
                                className="w-full h-full border-0"
                                title={embeddedApp.label}
                                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* App Selector Modal */}
            {showAppSelector && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Add Google Tool</h2>
                            <button onClick={() => setShowAppSelector(false)} className="text-slate-400 hover:text-slate-600"><span className="material-icons">close</span></button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {AVAILABLE_GOOGLE_APPS.map((app) => (
                                <div
                                    key={app.id}
                                    onClick={() => handlePinApp(app)}
                                    className="p-4 rounded-xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all group flex flex-col items-center gap-3"
                                >
                                    <div className={`w-12 h-12 rounded-full bg-${app.color}-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <span className={`material-icons text-${app.color}-600 text-2xl`}>{app.icon}</span>
                                    </div>
                                    <span className="font-bold text-slate-700 group-hover:text-blue-700">{app.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Integration Modal */}
            {integrationModalOpen && (
                <IntegrationModal
                    toolName={selectedToolForIntegration || ''}
                    onClose={() => setIntegrationModalOpen(false)}
                    onSave={handleIntegrationSave}
                />
            )}

            {/* New User Popup (Every 40 seconds) */}
            {showNewUserPopup && (
                <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 p-8 text-center relative">
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => setShowNewUserPopup(false)}
                                    className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                                >
                                    <span className="material-icons text-xl">close</span>
                                </button>
                            </div>
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                <span className="material-icons text-white text-4xl">rocket_launch</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Ready to Build?</h3>
                            <p className="text-blue-100 text-sm">Create your customised AI workspace in just 2 minutes!</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-3">
                                {[
                                    { icon: 'auto_awesome', text: 'AI-powered tool recommendations', color: 'indigo' },
                                    { icon: 'speed', text: 'Quick setup (8 simple questions)', color: 'purple' },
                                    { icon: 'workspace_premium', text: 'Personalised workspace layout', color: 'blue' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg bg-${item.color}-50 flex items-center justify-center flex-shrink-0`}>
                                            <span className={`material-icons text-${item.color}-600 text-lg`}>{item.icon}</span>
                                        </div>
                                        <p className="text-slate-700 text-sm">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-2 space-y-2">
                                <button
                                    onClick={() => {
                                        setShowNewUserPopup(false);
                                        setShowAIWorkspaceSetup(true);
                                    }}
                                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:-translate-y-0.5"
                                >
                                    Build My Workspace Now
                                </button>
                                <button
                                    onClick={() => setShowNewUserPopup(false)}
                                    className="w-full py-2 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
                                >
                                    Maybe later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Workspace Setup Modal */}
            {showAIWorkspaceSetup && (
                <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 border-b border-blue-500 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <span className="material-icons text-white text-xl">rocket_launch</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Build Your Customised AI Workspace</h3>
                                    <p className="text-blue-100 text-sm">Answer a few questions to get personalised tool recommendations</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowAIWorkspaceSetup(false)}
                                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                            >
                                <span className="material-icons text-2xl">close</span>
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
                            <AdvancedOnboarding
                                onComplete={(profile) => {
                                    console.log('AI Workspace profile:', profile);
                                    // Save the profile and mark user as no longer new
                                    localStorage.setItem('workspaceProfile', JSON.stringify(profile));
                                    setIsNewUser(false); // Stop showing popups
                                    setShowAIWorkspaceSetup(false);
                                    // Optionally show a success message or redirect
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workspace;
