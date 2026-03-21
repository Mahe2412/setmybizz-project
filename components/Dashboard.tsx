"use client";
import React, { useState, useEffect } from 'react';
import { BusinessData } from '../types';
import { AIRoadmap, AISocialPost } from '../types/ai';
import { getBusinessRoadmap, getSocialPost } from '../lib/aiService';
import { generateImage } from '../lib/imageService';
import Workspace from './dashboard/Workspace';
import AdvancedAiCoFounder from './dashboard/AdvancedAiCoFounder';
import QuickChatBot from './dashboard/QuickChatBot';
import AIStudioLayout from './ai-studio/AIStudioLayout';
import GlobalIncorporationFullPage from './dashboard/GlobalIncorporationFullPage';
import AIIncorporationAssistant from './dashboard/AIIncorporationAssistant';
import LaunchPadAIOnboarding from './dashboard/LaunchPadAIOnboarding';
import AIProjectReportTool from './dashboard/AIProjectReportTool';
import HookDashboard from './dashboard/HookDashboard';
import AdvisorBoard from './dashboard/AdvisorBoard';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Toast from './ToastNotification';

interface DashboardProps {
    data: BusinessData;
    initialTab?: 'A' | 'B' | 'Workspace' | 'LearnerStudio' | 'Oracle' | 'Hook';
    onNavigateToFlow?: () => void;
    initialGlobal?: boolean;
    onLogin?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, initialTab = 'A', onNavigateToFlow, initialGlobal = false, onLogin }) => {
    const { user, dbUser, guestId } = useAuth();
    const [activeTab, setActiveTab] = useState<'A' | 'B' | 'Workspace' | 'LearnerStudio' | 'Oracle' | 'Hook' | 'C'>(initialTab);
    const [activeDash, setActiveDash] = useState<'D1' | 'D2' | 'D3' | 'D4'>(
        initialTab === 'A' ? 'D1' : 
        initialTab === 'B' ? 'D2' : 
        initialTab === 'Workspace' ? 'D4' : 'D1'
    );
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [chatCount, setChatCount] = useState(0);
    const [aiMessage, setAiMessage] = useState("Greetings. I am your Setmybizz AI Architect. How can I assist with your incorporation path today?");

    // AI Roadmap State
    const [roadmap, setRoadmap] = useState<AIRoadmap | null>(null);
    const [loadingRoadmap, setLoadingRoadmap] = useState(false);

    // AI Social Post State
    const [socialPost, setSocialPost] = useState<AISocialPost | null>(null);
    const [loadingSocialPost, setLoadingSocialPost] = useState(false);
    const [promptInput, setPromptInput] = useState("");

    // AI Image State
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [loadingImage, setLoadingImage] = useState(false);

    // Global Incorporation Modal
    const [showGlobalIncorporation, setShowGlobalIncorporation] = useState(initialGlobal);

    useEffect(() => {
        if (initialGlobal) setShowGlobalIncorporation(true);
    }, [initialGlobal]);

    // Canvas View State for Tab B
    const [currentCanvas, setCurrentCanvas] = useState<string | null>(null);

    // Right Sidebar Agent State
    const [agentMode, setAgentMode] = useState<'developer' | 'cofounder'>('cofounder');
    const [isAgentSidebarExpanded, setIsAgentSidebarExpanded] = useState(true);
    const [isAgentSidebarWide, setIsAgentSidebarWide] = useState(false);
    const [currentServiceCategory, setCurrentServiceCategory] = useState<'all' | 'brand' | 'legal' | 'growth'>('all');
    
    const [selectedModel, setSelectedModel] = useState<'gemini' | 'gpt4o' | 'claude'>('gemini');
    const [showBuildPopup, setShowBuildPopup] = useState(false);
    const [showDPRTool, setShowDPRTool] = useState(false);
    const [businessDescription, setBusinessDescription] = useState("");

    const [agentSidebarWidth, setAgentSidebarWidth] = useState(400);
    const [isResizing, setIsResizing] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = React.useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onresult = (event: any) => {
                    let transcript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        transcript += event.results[i][0].transcript;
                    }
                    setBusinessDescription(transcript);
                };

                recognition.onerror = () => setIsRecording(false);
                recognition.onend = () => setIsRecording(false);
                recognitionRef.current = recognition;
            }
        }
    }, []);

    const toggleVoice = () => {
        if (!recognitionRef.current) return alert("Browser does not support Live Voice Mode.");
        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        } else {
            recognitionRef.current.start();
            setIsRecording(true);
            setToast({ visible: true, message: "Voice Activated", sub: "Listening for commands..." });
        }
    };

    const handleGenerateRoadmap = async () => {
        setLoadingRoadmap(true);
        const result = await getBusinessRoadmap(data);
        setRoadmap(result);
        setLoadingRoadmap(false);
    };

    const [showLaunchPadFlow, setShowLaunchPadFlow] = useState(false);

    useEffect(() => {
        if (activeTab === 'B') {
            const hasSeen = localStorage.getItem('hasSeenLaunchPadFlow');
            if (!hasSeen) {
                setTimeout(() => setShowLaunchPadFlow(true), 0);
            }
        }
    }, [activeTab]);

    const handleLaunchPadComplete = async (onboardingData: any) => {
        try {
            await addDoc(collection(db, "brand_requests"), {
                ...onboardingData,
                status: 'new',
                userId: user?.uid || null,
                guestId: guestId,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error saving brand request:", error);
        }

        localStorage.setItem('hasSeenLaunchPadFlow', 'true');
        setShowLaunchPadFlow(false);
        if (!user) {
            setActiveTab('Hook');
        }
        setToast({
            visible: true,
            message: "Brand Identity Secured",
            sub: "Your brand assets are being generated on our servers."
        });
    };

    const [toast, setToast] = useState<{ visible: boolean; message: string; sub?: string }>({ visible: false, message: '', sub: '' });

    const handleServiceClick = async (serviceName: string, badge?: string) => {
        const coreIncorpServices = ['LLC / Registration', 'Legal Documents'];
        if (!coreIncorpServices.includes(serviceName)) {
            setActiveTab('B');
        }

        if (badge) {
            const isComingSoon = badge === 'Coming Soon' || badge === 'Beta';
            if (isComingSoon) {
                setToast({
                    visible: true,
                    message: `We are building ${serviceName}!`,
                    sub: "Thanks for your interest. You'll be the first to know when it launches."
                });
            }
        }
    };

    const buildServices = [
        { label: 'Logo Designer', icon: 'brush', bg: 'bg-orange-50', color: 'text-orange-500', badge: 'Coming Soon', cat: 'brand' },
        { label: 'Business Email', icon: 'mail', bg: 'bg-blue-50', color: 'text-blue-500', badge: 'Coming Soon', cat: 'brand' },
        { label: 'Domain Search', icon: 'language', bg: 'bg-indigo-50', color: 'text-indigo-500', badge: 'Coming Soon', cat: 'brand' },
        { label: 'Website Builder', icon: 'web', bg: 'bg-teal-50', color: 'text-teal-500', badge: 'Coming Soon', cat: 'brand' },
        { label: 'E-Store Setup', icon: 'shopping_cart', bg: 'bg-green-50', color: 'text-green-500', badge: 'Coming Soon', cat: 'growth' },
        { label: 'Product Copy', icon: 'edit_note', sub: 'Page Create', bg: 'bg-yellow-50', color: 'text-yellow-500', badge: 'Coming Soon', cat: 'growth' },
        { label: 'Brand Brochure', icon: 'folder_open', bg: 'bg-pink-50', color: 'text-pink-500', badge: 'Coming Soon', cat: 'brand' },
        { label: 'Product Catalogue', icon: 'menu_book', bg: 'bg-purple-50', color: 'text-purple-500', badge: 'Coming Soon', cat: 'growth' },
        { label: 'Digital Card', icon: 'badge', bg: 'bg-slate-100', color: 'text-slate-600', badge: 'Coming Soon', cat: 'brand' },
        { label: 'Pitch Deck AI', icon: 'slideshow', bg: 'bg-cyan-50', color: 'text-cyan-500', badge: 'Beta', cat: 'growth' },
        { label: 'SM Manager', icon: 'share', bg: 'bg-rose-50', color: 'text-rose-500', badge: 'Coming Soon', cat: 'growth' },
        { label: 'AI Post Gen', icon: 'post_add', bg: 'bg-lime-50', color: 'text-lime-600', badge: 'Beta', cat: 'growth' },
        { label: 'Brand Kits', icon: 'category', bg: 'bg-emerald-50', color: 'text-emerald-500', badge: 'Coming Soon', cat: 'brand' },
        { label: 'SEO Tools', icon: 'construction', bg: 'bg-sky-50', color: 'text-sky-500', badge: 'Coming Soon', cat: 'growth' }
    ];

    const learnerStudioServices = [
        { label: 'Skill Upgradation', icon: 'school', desc: 'Master new industry standards.', bg: 'bg-blue-50', color: 'text-blue-600', badge: 'Coming Soon' },
        { label: 'Tech Adoption', icon: 'biotech', desc: 'Implement latest AI and automation.', bg: 'bg-purple-50', color: 'text-purple-600', badge: 'Coming Soon' },
        { label: 'Learn Business', icon: 'auto_stories', desc: 'Mini-MBA for startup founders.', bg: 'bg-green-50', color: 'text-green-600', badge: 'Coming Soon' },
        { label: 'Growth Strategies', icon: 'trending_up', desc: 'Scale your operations effectively.', bg: 'bg-orange-50', color: 'text-orange-600', badge: 'Coming Soon' },
        { label: 'Financial Literacy', icon: 'payments', desc: 'Understand tax, GST and funding.', bg: 'bg-teal-50', color: 'text-teal-600', badge: 'Coming Soon' },
        { label: 'Leadership', icon: 'groups', desc: 'Build and manage your first team.', bg: 'bg-pink-50', color: 'text-pink-600', badge: 'Coming Soon' }
    ];

    return (
        <div className="flex w-full h-screen overflow-hidden bg-white font-display text-[#1e293b] antialiased">
            {/* ── DOUBLE SIDEBAR SYSTEM ── */}
            <div className="flex bg-white border-r border-slate-100 h-full">
                {/* 1. Thin Global Switcher */}
                <aside className="w-14 bg-slate-900 flex flex-col items-center py-6 gap-6 sticky top-0 h-screen z-50 overflow-hidden">
                    <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center mb-6 shadow-xl cursor-pointer hover:rotate-12 transition-transform" onClick={() => setActiveTab('A')}>
                        <span className="material-symbols-outlined font-black text-slate-900 text-lg">bolt</span>
                    </div>

                    <div className="flex flex-col gap-3 p-1">
                        {[
                            { id: 'D1', label: 'Advisor', icon: 'psychology', tab: 'A' },
                            { id: 'D2', label: 'Launch', icon: 'rocket_launch', tab: 'B' },
                            { id: 'D3', label: 'Teams', icon: 'groups', tab: 'LearnerStudio' },
                            { id: 'D4', label: 'Work', icon: 'business_center', tab: 'Workspace' },
                        ].map((dash) => (
                            <button
                                key={dash.id}
                                onClick={() => { setActiveDash(dash.id as any); setActiveTab(dash.tab as any); }}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group relative ${activeDash === dash.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30' : 'text-slate-500 hover:bg-white/10 hover:text-white'}`}
                                title={dash.label}
                            >
                                <span className="material-symbols-outlined text-[18px]">{dash.icon}</span>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* 2. Secondary Service Sidebar */}
                <aside className="w-48 bg-white flex flex-col h-full border-r border-slate-50 relative animate-in slide-in-from-left duration-500">
                    <div className="p-4 border-b border-slate-50 mb-2">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600/60 mb-1">
                            {activeDash === 'D1' && 'Advisor Hub'}
                            {activeDash === 'D2' && 'Launch Pad'}
                            {activeDash === 'D3' && 'Academy'}
                            {activeDash === 'D4' && 'Operations'}
                        </h2>
                        <h1 className="text-xs font-black text-slate-900 tracking-tight leading-none uppercase">
                            {activeDash === 'D1' && 'Intelligence'}
                            {activeDash === 'D2' && 'Market Entry'}
                            {activeDash === 'D3' && 'Skill Stacks'}
                            {activeDash === 'D4' && 'Workspace'}
                        </h1>
                    </div>

                    <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 custom-scrollbar">
                        {(activeDash === 'D1' ? [
                            { label: 'Intelligence', icon: 'smart_toy', active: activeTab === 'A', tab: 'A' },
                            { label: 'Incorp Status', icon: 'verified' },
                            { label: 'Legal Audit', icon: 'gavel' },
                            { label: 'Tax Filings', icon: 'receipt_long' },
                            { label: 'Compliance', icon: 'security' }
                        ] : activeDash === 'D2' ? [
                            { label: 'Launch Console', icon: 'rocket', active: activeTab === 'B', tab: 'B' },
                            { label: 'Logo Designer', icon: 'brush' },
                            { label: 'Domain & SSL', icon: 'language' },
                            { label: 'Web Builder', icon: 'web' },
                            { label: 'Ad Strategy', icon: 'ads_click' }
                        ] : activeDash === 'D3' ? [
                            { label: 'Academy', icon: 'school', active: activeTab === 'LearnerStudio', tab: 'LearnerStudio' },
                            { label: 'Hiring Kit', icon: 'person_add' },
                            { label: 'Project Mgmt', icon: 'list_alt' }
                        ] : [
                            { label: 'Workspace', icon: 'dashboard', active: activeTab === 'Workspace', tab: 'Workspace' },
                            { label: 'Inbox', icon: 'inbox' },
                            { label: 'File Vault', icon: 'folder' },
                            { label: 'Team Space', icon: 'hub' }
                        ]).map((item: any, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    if (item.tab) setActiveTab(item.tab);
                                    else handleServiceClick(item.label);
                                }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all group ${item.active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                            >
                                <span className={`material-symbols-outlined text-[16px] transition-transform group-hover:scale-110 ${item.active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`}>{item.icon}</span>
                                <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Profile Footer */}
                    <div className="p-3 border-t border-slate-50">
                        <div className="flex items-center gap-2 p-2 bg-slate-50/50 rounded-xl border border-slate-100">
                            <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center text-[10px] font-black text-white">
                                {data?.name?.charAt(0) || 'S'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[9px] font-bold text-slate-900 truncate uppercase mt-0.5">{data.name}</p>
                                <div className="flex items-center gap-1">
                                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="sticky top-0 h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 flex-shrink-0 z-50 shadow-sm gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex bg-slate-50 p-1 rounded-xl gap-1">
                            <button onClick={() => setActiveTab('A')} className={`px-4 py-2 rounded-lg transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${activeTab === 'A' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                                <span className="material-symbols-outlined text-[16px]">description</span>
                                <span>Professional Dashboard</span>
                            </button>
                            <button onClick={() => setActiveTab('B')} className={`px-4 py-2 rounded-lg transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${activeTab === 'B' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                                <span className="material-symbols-outlined text-[16px]">rocket</span>
                                <span>AI Launch Pad</span>
                            </button>
                            <button onClick={() => setActiveTab('LearnerStudio')} className={`px-4 py-2 rounded-lg transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${activeTab === 'LearnerStudio' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                                <span>Learn</span>
                            </button>
                        </div>
                    </div>
                    <button onClick={() => setActiveTab('Workspace')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-2 uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">rocket</span> AI WORKSPACE
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto custom-scroll bg-[#f8faff]">
                    {activeTab === 'Workspace' ? (
                        <Workspace onNavigate={setActiveTab} />
                    ) : activeTab === 'Hook' ? (
                         <HookDashboard onAction={onLogin || (() => {})} />
                    ) : (
                        <div className="w-full max-w-6xl mx-auto p-4 pb-20">
                            {activeTab === 'A' && (
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="lg:col-span-3 space-y-8">
                                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                                            <div className="p-8 bg-slate-900 text-white relative">
                                                <div className="absolute top-0 right-0 w-64 h-full bg-blue-600/10 blur-3xl rounded-full"></div>
                                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white">A</div>
                                                            <div>
                                                                <h2 className="text-xl font-black">AI Business Advisor</h2>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">Arkle AI System Ready</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-slate-400">Monitoring operations for <strong className="text-white">{data.name}</strong>.</p>
                                                    </div>
                                                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center min-w-[120px]">
                                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Health Score</p>
                                                        <p className="text-2xl font-black text-amber-500">72<span className="text-xs text-slate-600">/100</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <AdvisorBoard />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden lg:block lg:col-span-1">
                                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-6 sticky top-4">
                                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Live Insights</h3>
                                            <div className="space-y-4">
                                                {[
                                                    { label: 'Compliance', status: 'Optimal', color: 'text-green-500' },
                                                    { label: 'Branding', status: 'Action Needed', color: 'text-amber-500' },
                                                    { label: 'Operations', status: 'Scaling', color: 'text-blue-500' }
                                                ].map((insight, i) => (
                                                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{insight.label}</p>
                                                        <p className={`text-[10px] font-bold ${insight.color}`}>{insight.status}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'B' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="bg-linear-to-r from-slate-900 to-indigo-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                            <div className="text-left">
                                                <h2 className="text-3xl font-black tracking-tighter italic mb-4">NEURAL <span className="text-indigo-400 not-italic">IGNITION</span></h2>
                                                <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-lg">Deploy your brand, legal architecture and digital presence in real-time with our AI engine.</p>
                                            </div>
                                            <button onClick={() => setShowBuildPopup(true)} className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Start Build</button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {buildServices.map((service, i) => (
                                            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer" onClick={() => handleServiceClick(service.label, service.badge)}>
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${service.bg} ${service.color} group-hover:scale-110 transition-transform shadow-sm`}>
                                                    <span className="material-symbols-outlined text-lg font-black">{service.icon}</span>
                                                </div>
                                                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-tight">{service.label}</h4>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'LearnerStudio' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    {learnerStudioServices.map((service, i) => (
                                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group cursor-pointer" onClick={() => handleServiceClick(service.label, service.badge)}>
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${service.bg} ${service.color} group-hover:rotate-6 transition-transform`}>
                                                <span className="material-symbols-outlined text-xl">{service.icon}</span>
                                            </div>
                                            <h3 className="font-black text-slate-900 text-sm mb-2 uppercase tracking-wide">{service.label}</h3>
                                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{service.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>

                {/* ── ADVANCED AI CO-FOUNDER (ARKLE) ── */}
                <AdvancedAiCoFounder />

                <div className="bg-white border-t border-slate-200 p-3 sticky bottom-0 z-40">
                    <div className="max-w-3xl mx-auto flex items-center justify-between">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg text-[10px] shadow-md transition-colors flex items-center gap-2 uppercase tracking-widest">
                            <span className="material-symbols-outlined text-sm">support_agent</span>
                            Live Support
                        </button>
                        <div className="flex gap-4 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            <span>V-1.2.0 • Neural Sync Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals & Popups */}
            {showBuildPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black italic tracking-tighter">NEURAL <span className="text-indigo-600 not-italic">IGNITION</span></h3>
                            <button onClick={() => setShowBuildPopup(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-all"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <button onClick={() => { setShowBuildPopup(false); setIsAgentSidebarExpanded(true); }} className="p-8 bg-slate-50 border-2 border-transparent hover:border-indigo-600 rounded-[2rem] text-left transition-all group">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-indigo-600">forum</span></div>
                                <h4 className="text-sm font-black uppercase tracking-tight mb-1">Submit to Arkle</h4>
                                <p className="text-[10px] text-slate-400 font-bold leading-tight">Discuss your vision with AI.</p>
                            </button>
                            <button onClick={() => { setShowBuildPopup(false); setShowLaunchPadFlow(true); }} className="p-8 bg-slate-900 text-white rounded-[2rem] text-left transition-all hover:bg-black group">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined">rocket_launch</span></div>
                                <h4 className="text-sm font-black uppercase tracking-tight mb-1">Start Setup Flow</h4>
                                <p className="text-[10px] text-white/40 font-bold leading-tight">Instant interactive builder.</p>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showLaunchPadFlow && (
                 <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                     <div className="relative w-full max-w-xl">
                         <button onClick={() => setShowLaunchPadFlow(false)} className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl z-[210]"><span className="material-symbols-outlined">close</span></button>
                         <LaunchPadAIOnboarding businessData={data} onComplete={handleLaunchPadComplete} />
                     </div>
                 </div>
            )}

            {showGlobalIncorporation && (
                <GlobalIncorporationFullPage onClose={() => setShowGlobalIncorporation(false)} onLeadCapture={() => setShowGlobalIncorporation(false)} />
            )}

            {showDPRTool && (
                <AIProjectReportTool businessData={data} onClose={() => setShowDPRTool(false)} />
            )}

            <Toast message={toast.message} subMessage={toast.sub} isVisible={toast.visible} onClose={() => setToast(prev => ({ ...prev, visible: false }))} />
            
            {activeTab === 'A' && (
                <div className="fixed bottom-24 right-8 z-[60] pointer-events-none">
                    <div className="pointer-events-auto">
                        <QuickChatBot user={user} data={data} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
