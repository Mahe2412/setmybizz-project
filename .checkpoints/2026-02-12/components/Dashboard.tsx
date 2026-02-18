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
import { useAuth } from '@/context/AuthContext';
import Toast from './ToastNotification';

interface DashboardProps {
    data: BusinessData;
    initialTab?: 'A' | 'B' | 'Workspace' | 'LearnerStudio' | 'Oracle';
    onNavigateToFlow?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, initialTab = 'A', onNavigateToFlow }) => {
    const { user, dbUser, guestId } = useAuth();
    const [activeTab, setActiveTab] = useState<'A' | 'B' | 'Workspace' | 'LearnerStudio' | 'Oracle'>(initialTab);
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
    const [showGlobalIncorporation, setShowGlobalIncorporation] = useState(false);

    // Canvas View State for Tab B
    const [currentCanvas, setCurrentCanvas] = useState<string | null>(null);

    const handleGenerateRoadmap = async () => {
        setLoadingRoadmap(true);
        const result = await getBusinessRoadmap(data);
        setRoadmap(result);
        setLoadingRoadmap(false);
    };

    const handleGenerateSocialPost = async () => {
        setLoadingSocialPost(true);
        const result = await getSocialPost(data, promptInput);
        setSocialPost(result);
        setLoadingSocialPost(false);
    };

    const handleGenerateImage = async () => {
        setLoadingImage(true);
        const prompt = promptInput || `Professional marketing image for ${data.name}`;
        const result = await generateImage(prompt, data);
        if (result.success && result.imageUrl) {
            setGeneratedImage(result.imageUrl);
        }
        setLoadingImage(false);
    };

    const [showLaunchPadFlow, setShowLaunchPadFlow] = useState(false);

    useEffect(() => {
        if (activeTab === 'B') {
            const hasSeen = localStorage.getItem('hasSeenLaunchPadFlow');
            if (!hasSeen) {
                setShowLaunchPadFlow(true);
            }
        }
    }, [activeTab]);

    const handleLaunchPadComplete = (onboardingData: any) => {
        localStorage.setItem('hasSeenLaunchPadFlow', 'true');
        setShowLaunchPadFlow(false);
        // Optionally update data context or trigger other successes
    };

    const handleAiAsk = (input?: string) => {
        const query = input?.toLowerCase() || "";
        if (chatCount >= 2) {
            setAiMessage("Your Customized Roadmap is ready in Dashboard A. Hover to see.");
            return;
        }

        if (query.includes('food') || data.industry.toLowerCase().includes('food')) {
            setAiMessage("For your food venture, I insist on prioritizing FSSAI Registration. It is the cornerstone of your legal presence in the Setmybizz ecosystem.");
        } else if (query.includes('tech') || data.offeringType === 'tech') {
            setAiMessage("As a tech startup, I insist on immediate Startup India Recognition + GST Registration. Our platform streamlines this specific path perfectly.");
        } else {
            setAiMessage("I have analyzed your business profile. We should focus on the core legal foundation available in our suite.");
        }
        setChatCount(prev => prev + 1);
    };

    // Feature Gating & Interest Capture Logic
    const [toast, setToast] = useState<{ visible: boolean; message: string; sub?: string }>({ visible: false, message: '', sub: '' });

    const handleServiceClick = async (serviceName: string, badge?: string) => {
        const coreIncorpServices = ['LLC / Registration', 'Legal Documents'];
        if (!coreIncorpServices.includes(serviceName)) {
            setActiveTab('B');
        }

        if (badge) {
            const isComingSoon = badge === 'Coming Soon' || badge === 'Beta';
            if (isComingSoon) {
                // Show Toast
                setToast({
                    visible: true,
                    message: `We are building ${serviceName}!`,
                    sub: "Thanks for your interest. You'll be the first to know when it launches."
                });
            }
        }
    };

    // 20-Second Login Prompt Logic
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    React.useEffect(() => {
        if (!user && !dbUser) {
            const timer = setTimeout(() => {
                setShowLoginPrompt(true);
            }, 20000); // 20 seconds
            return () => clearTimeout(timer);
        }
    }, [user, dbUser]);

    const handleLoginRedirect = () => {
        // Use onNavigateToFlow? Or just reload to force login step?
        // Or show a modal. For now, simple redirect to flow start if onNavigateToFlow exists
        if (onNavigateToFlow) onNavigateToFlow();
    };

    const sidebarItems = [
        { label: 'Logos', icon: 'brush' },
        { label: 'LLC / Registration', icon: 'gavel' },
        { label: 'Domain', icon: 'language' },
        { label: 'Website', icon: 'web' },
        { label: 'Digital Business Card', icon: 'badge' },
        { label: 'Business Email', icon: 'mail' },
        { label: 'Legal Documents', icon: 'description' },
        { label: 'Get CA assistance', icon: 'support_agent' },
        { label: 'Get free banking assistance', icon: 'account_balance' }
    ];

    const incorporationServices = [
        { label: 'Private Limited Company', time: '5-7 Days', icon: 'business', bg: 'bg-orange-50', color: 'text-orange-600', button: 'UPLOAD' },
        { label: 'Udyam Registration', time: 'MSME Certificate', icon: 'verified', bg: 'bg-blue-50', color: 'text-blue-600', button: 'UPLOAD', variant: 'secondary' },
        { label: 'Startup India Registration', time: 'Govt. Recognition', icon: 'rocket_launch', bg: 'bg-green-50', color: 'text-green-600', button: 'GET START', btnColor: 'bg-slate-900' },
        { label: 'GST Registration', time: 'Tax Compliance', icon: 'receipt_long', bg: 'bg-purple-50', color: 'text-purple-600', button: 'UPLOAD' },
        { label: 'Trademark (TM) & IP', time: 'Brand Security', icon: 'copyright', bg: 'bg-pink-50', color: 'text-pink-600', button: 'UPLOAD', variant: 'secondary' },
        { label: 'Business Licenses', time: 'FSSAI, ISO, IEC', icon: 'gavel', bg: 'bg-yellow-50', color: 'text-yellow-600', button: 'UPLOAD' },
        { label: 'Documentation', time: 'Custom Drafting', icon: 'description', bg: 'bg-teal-50', color: 'text-teal-600', button: 'UPLOAD', variant: 'secondary' },
        { label: 'Expert CA/CS', time: 'Reports & Filings', icon: 'support_agent', bg: 'bg-indigo-50', color: 'text-indigo-600', button: 'GET HELP', btnColor: 'bg-slate-900' },
        { label: 'Marketing Expert', time: 'Growth Strategy', icon: 'campaign', bg: 'bg-rose-50', color: 'text-rose-600', button: 'BOOK CALL' },
        { label: 'Project Reports', time: 'Business Model', icon: 'bar_chart', bg: 'bg-cyan-50', color: 'text-cyan-600', button: 'UPLOAD', variant: 'secondary' },
        { label: 'Banking & Loans', time: 'Funding Support', icon: 'account_balance', bg: 'bg-emerald-50', color: 'text-emerald-600', button: 'GET LOAN' }
    ];

    const buildServices = [
        { label: 'Logo Designer', icon: 'brush', bg: 'bg-orange-50', color: 'text-orange-500', badge: 'Coming Soon' },
        { label: 'Business Email', icon: 'mail', bg: 'bg-blue-50', color: 'text-blue-500', badge: 'Coming Soon' },
        { label: 'Domain Search', icon: 'language', bg: 'bg-indigo-50', color: 'text-indigo-500', badge: 'Coming Soon' },
        { label: 'Website Builder', icon: 'web', bg: 'bg-teal-50', color: 'text-teal-500', badge: 'Coming Soon' },
        { label: 'E-Store Setup', icon: 'shopping_cart', bg: 'bg-green-50', color: 'text-green-500', badge: 'Coming Soon' },
        { label: 'Product Copy', icon: 'edit_note', sub: 'Page Create', bg: 'bg-yellow-50', color: 'text-yellow-500', badge: 'Coming Soon' },
        { label: 'Brand Brochure', icon: 'folder_open', bg: 'bg-pink-50', color: 'text-pink-500', badge: 'Coming Soon' },
        { label: 'Product Catalogue', icon: 'menu_book', bg: 'bg-purple-50', color: 'text-purple-500', badge: 'Coming Soon' },
        { label: 'Digital Card', icon: 'badge', bg: 'bg-slate-100', color: 'text-slate-600', badge: 'Coming Soon' },
        { label: 'Pitch Deck AI', icon: 'slideshow', bg: 'bg-cyan-50', color: 'text-cyan-500', badge: 'Beta' },
        { label: 'SM Manager', icon: 'share', bg: 'bg-rose-50', color: 'text-rose-500', badge: 'Coming Soon' },
        { label: 'AI Post Gen', icon: 'post_add', bg: 'bg-lime-50', color: 'text-lime-600', badge: 'Beta' },
        { label: 'Brand Kits', icon: 'category', bg: 'bg-emerald-50', color: 'text-emerald-500', badge: 'Coming Soon' },
        { label: 'SEO Tools', icon: 'construction', bg: 'bg-sky-50', color: 'text-sky-500', badge: 'Coming Soon' }
    ];

    const learnerStudioServices = [
        { label: 'Skill Upgradation', icon: 'school', desc: 'Master new industry standards.', bg: 'bg-blue-50', color: 'text-blue-600', badge: 'Coming Soon' },
        { label: 'Tech Adoption', icon: 'biotech', desc: 'Implement latest AI and automation.', bg: 'bg-purple-50', color: 'text-purple-600', badge: 'Coming Soon' },
        { label: 'Learn Business', icon: 'auto_stories', desc: 'Mini-MBA for startup founders.', bg: 'bg-green-50', color: 'text-green-600', badge: 'Coming Soon' },
        { label: 'Growth Strategies', icon: 'trending_up', desc: 'Scale your operations effectively.', bg: 'bg-orange-50', color: 'text-orange-600', badge: 'Coming Soon' },
        { label: 'Financial Literacy', icon: 'payments', desc: 'Understand tax, GST and funding.', bg: 'bg-teal-50', color: 'text-teal-600', badge: 'Coming Soon' },
        { label: 'Leadership', icon: 'groups', desc: 'Build and manage your first team.', bg: 'bg-pink-50', color: 'text-pink-600', badge: 'Coming Soon' }
    ];

    if (activeTab === 'Workspace') {
        return <Workspace onNavigate={setActiveTab} />;
    }

    return (
        <div className="flex w-full h-screen overflow-hidden bg-white font-display text-[#1e293b] antialiased">
            {/* Sidebar */}
            <aside className={`w-56 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col h-full hidden md:flex z-20 transition-all ${isSidebarOpen ? 'ml-0' : '-ml-56'}`}>
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <div
                        className="flex items-center gap-2 px-2 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setActiveTab('A')}
                        onDoubleClick={onNavigateToFlow}
                        title="Double Click to Restart Onboarding"
                    >
                        <img src="/images/logo.png" alt="SetMyBizz" className="h-14 w-auto object-contain" />
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto custom-scroll p-3 space-y-1">
                    <button onClick={() => setActiveTab('A')} className={`flex items-center gap-3 px-3 py-2 rounded-lg font-bold text-xs uppercase tracking-widest w-full text-left ${activeTab === 'A' ? 'bg-blue-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <span className="material-symbols-outlined text-lg">home</span> Home
                    </button>

                    {activeTab === 'B' ? (
                        <>
                            <div className="pt-4 pb-2 px-3 text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="material-icons text-[10px]">rocket_launch</span> EXECUTION ROADMAP
                            </div>
                            {/* Left Sidebar Roadmap View */}
                            <div className="px-2 py-2 space-y-1.5 border-l-2 border-slate-100 ml-4">
                                {buildServices.map((service, i) => (
                                    <div
                                        key={i}
                                        onClick={() => handleServiceClick(service.label, (service as any).badge)}
                                        className="group cursor-pointer"
                                    >
                                        <div className={`p-2 rounded-lg transition-all flex items-center gap-2 ${i === 0 ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50'}`}>
                                            <div className={`w-5 h-5 rounded flex items-center justify-center ${service.bg} ${service.color} shrink-0`}>
                                                <span className="material-symbols-outlined text-[10px] font-black">{service.icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-[8px] font-black text-slate-700 uppercase tracking-tight truncate leading-none">{service.label}</h3>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <div className={`w-1 h-1 rounded-full ${i === 0 ? 'bg-indigo-600 animate-pulse' : 'bg-slate-300'}`}></div>
                                                    <span className="text-[6px] text-slate-400 font-bold uppercase tracking-widest leading-none">Phase 0{i + 1}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="pt-4 pb-2 px-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Launchpad</div>
                            <button onClick={() => setActiveTab('B')} className={`flex items-center gap-3 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors w-full text-left justify-between text-slate-600 hover:bg-slate-50`}>
                                <div className="flex items-center gap-3"><span className="material-symbols-outlined text-lg">rocket</span> Launch Pad</div>
                                <span className="text-[8px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-200 uppercase tracking-wide">Beta</span>
                            </button>
                            <button onClick={() => setActiveTab('LearnerStudio')} className={`flex items-center gap-3 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors w-full text-left justify-between ${activeTab === 'LearnerStudio' ? 'bg-blue-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>
                                <div className="flex items-center gap-3"><span className="material-symbols-outlined text-lg">school</span> Learner Studio</div>
                                <span className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 uppercase tracking-wide">Soon</span>
                            </button>

                            <div className="pt-4 pb-2 px-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Services</div>
                            {sidebarItems.map((item, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleServiceClick(item.label, (item as any).badge); }}
                                    className={`flex items-center gap-3 px-3 py-1.5 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-lg font-bold text-xs transition-colors justify-between group ${(item as any).badge ? 'cursor-alias opacity-80' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-lg">{item.icon}</span> {item.label}
                                    </div>
                                    {(item as any).badge && (
                                        <span className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 uppercase tracking-wide group-hover:bg-blue-100 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                                            {(item as any).badge}
                                        </span>
                                    )}
                                </a>
                            ))}
                        </>
                    )}
                </nav>
                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600 border border-slate-300">
                            {dbUser?.displayName ? dbUser.displayName.charAt(0) : (user?.displayName ? user.displayName.charAt(0) : 'G')}
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-700 truncate max-w-[120px]">
                                {dbUser?.displayName || user?.displayName || 'Guest User'}
                            </p>
                            <p className="text-[9px] text-slate-400">ID: {dbUser?.registeredId || guestId || '---'}</p>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 flex-shrink-0 z-10 shadow-sm">
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden text-slate-500"><span className="material-symbols-outlined text-lg">menu</span></button>
                        <div className="flex bg-slate-100 rounded-lg p-1 text-[9px] font-bold">
                            <button
                                onClick={() => setActiveTab('A')}
                                className={`px-4 py-1 rounded-md transition-all uppercase tracking-widest ${activeTab === 'A' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Compliance (A)
                            </button>
                            <button
                                onClick={() => setActiveTab('B')}
                                className={`px-4 py-1 rounded-md transition-all uppercase tracking-widest ${activeTab === 'B' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Launch Pad (B)
                            </button>
                            <button
                                onClick={() => setActiveTab('LearnerStudio')}
                                className={`px-4 py-1 rounded-md transition-all uppercase tracking-widest ${activeTab === 'LearnerStudio' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Learner Studio
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setActiveTab('Workspace')}
                            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-2 uppercase tracking-widest active:scale-95 border border-indigo-400/30"
                        >
                            <span className="material-icons-outlined text-sm">rocket</span> WORKSPACE <span className="bg-white/20 px-1 py-0.5 rounded text-[8px] text-white">SOON</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto custom-scroll p-4 md:p-8 bg-white">
                    <div className="max-w-3xl mx-auto">

                        {/* Guest Banner */}
                        {!user && (
                            <div className="mb-6 bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-xl shadow-lg flex items-center justify-between border border-slate-700 animate-in slide-in-from-top-4 duration-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-slate-900 font-bold">lock_open</span>
                                    </div>
                                    <div className="text-white">
                                        <h3 className="font-bold text-sm">Login to Unlock your FREE Startup Credits & Business Tools!</h3>
                                        <p className="text-[10px] text-slate-400">Save your progress and access premium features.</p>
                                    </div>
                                </div>
                                <button className="bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors whitespace-nowrap">
                                    Login Now
                                </button>
                            </div>
                        )}

                        {activeTab === 'A' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">

                                {/* Hero Grid: Assistant + AI Co-Founder */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-start">
                                    {/* Left Column: Flow & Progress */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <AIIncorporationAssistant onComplete={(businessData) => {
                                            console.log('Business setup data:', businessData);
                                            setToast({
                                                message: 'Business Setup Complete!',
                                                sub: 'We\'ve created your personalized plan',
                                                visible: true
                                            });
                                        }} />

                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group relative overflow-hidden">
                                            <h2 className="text-xl font-bold flex items-center justify-center gap-2 text-slate-800 relative z-10">
                                                Incorporation & Compliance
                                                <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100 uppercase font-extrabold tracking-wide">Live Progress</span>
                                            </h2>
                                            <div className="mt-4 max-w-[240px] mx-auto relative z-10">
                                                <div className="flex justify-between text-[10px] mb-1.5 font-bold tracking-wider text-slate-400">
                                                    <span>SYSTEM STATUS</span>
                                                    <span className="text-indigo-600">35%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                    <div className="bg-indigo-600 h-2 rounded-full transition-all duration-1000 relative overflow-hidden" style={{ width: '35%' }}>
                                                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute mt-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1 rounded shadow-xl font-bold z-50">
                                                Your Customized Roadmap is ready!
                                            </div>
                                        </div>

                                        {!roadmap && (
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={handleGenerateRoadmap}
                                                    disabled={loadingRoadmap}
                                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-sm shadow-lg hover:shadow-purple-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                                                >
                                                    {loadingRoadmap ? (
                                                        <><span className="animate-spin material-symbols-outlined text-lg">sync</span> Generating Plan...</>
                                                    ) : (
                                                        <><span className="material-symbols-outlined text-lg">auto_awesome</span> Generate My 30-Day Launch Plan</>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column: Advanced AI Co-Founder */}
                                    <div className="lg:col-span-1 shadow-2xl shadow-indigo-200 rounded-2xl">
                                        {/* Removed - Now using global floating widget */}
                                        {/* <AdvancedAiCoFounder /> */}
                                    </div>
                                </div>

                                {/* AI Roadmap Display */}
                                {roadmap && (
                                    <div className="mb-8 bg-white rounded-2xl border border-purple-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                                            <h3 className="text-xl font-serif font-bold flex items-center gap-2">
                                                <span className="material-symbols-outlined">map</span> Your 30-Day Launch Plan
                                            </h3>
                                            <p className="opacity-90 text-sm mt-1">{roadmap.overview}</p>
                                        </div>
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {roadmap.weeks.map((week, idx) => (
                                                <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                                    <div className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">Week {week.week}</div>
                                                    <h4 className="font-bold text-slate-900 mb-3">{week.title}</h4>
                                                    <ul className="space-y-2">
                                                        {week.tasks.map((task, tIdx) => (
                                                            <li key={tIdx} className="flex items-start gap-2 text-xs text-slate-600">
                                                                <span className="material-symbols-outlined text-sm text-green-500 mt-0.5">check_circle</span>
                                                                {task}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-3">
                                    {incorporationServices.map((item, i) => (
                                        <div key={i} className={`bg-white rounded-xl p-3 md:p-4 border border-slate-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-all group cursor-pointer`}>
                                            <div className={`w-10 h-10 rounded-lg ${item.bg} ${item.color} flex items-center justify-center transition-all flex-shrink-0`}>
                                                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-sm text-slate-800 leading-tight tracking-tight truncate" title={item.label}>{item.label}</h3>
                                                <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">{item.time}</p>
                                            </div>
                                            <div className="flex items-center gap-4 flex-shrink-0">
                                                <button className="text-[9px] font-bold text-slate-400 hover:text-indigo-600 tracking-wide hidden sm:block transition-colors">DETAILS</button>
                                                <button className={`px-4 py-1.5 ${item.button === 'UPLOAD' && item.variant === 'secondary' ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' : (item as any).btnColor ? `${(item as any).btnColor} text-white` : 'bg-slate-900 text-white hover:bg-slate-800'} text-[10px] font-bold rounded-lg shadow-md transition-all active:scale-95 min-w-[80px]`}>
                                                    {item.button || 'UPLOAD'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Global Incorporation CTA - NEW */}
                                <div className="mt-16 border-t border-slate-200 pt-12">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center shadow-2xl shadow-blue-500/20 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-grid-white/10"></div>
                                        <div className="relative z-10">
                                            <div className="text-6xl mb-6">🌍</div>
                                            <h2 className="text-4xl font-black text-white mb-4">Ready to Go Global?</h2>
                                            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                                                Expand your business to international markets. Incorporation, Export, and Market Access in 50+ countries.
                                            </p>
                                            <button
                                                onClick={() => setShowGlobalIncorporation(true)}
                                                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all hover:scale-105 active:scale-95"
                                            >
                                                <span className="material-icons text-2xl">public</span>
                                                Explore Global Opportunities
                                                <span className="material-icons">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'B' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative min-h-[80vh] p-8 -mx-8 -my-8 rounded-[3rem] bg-[#f8faff]">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(79,70,229,0.03),transparent_40%),radial-gradient(circle_at_10%_80%,rgba(236,72,153,0.03),transparent_40%)] rounded-[3rem] pointer-events-none"></div>

                                {showLaunchPadFlow && (
                                    <LaunchPadAIOnboarding
                                        businessData={data}
                                        onComplete={handleLaunchPadComplete}
                                    />
                                )}

                                {currentCanvas === 'Logo Designer' ? (
                                    <div className="animate-in zoom-in-95 duration-500 relative max-w-6xl mx-auto">
                                        <button
                                            onClick={() => setCurrentCanvas(null)}
                                            className="absolute top-0 -left-6 w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all z-10"
                                        >
                                            <span className="material-symbols-outlined font-black">arrow_back</span>
                                        </button>
                                        <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl mt-12">
                                            <div className="flex items-center gap-4 mb-10">
                                                <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600">
                                                    <span className="material-symbols-outlined text-4xl font-black">brush</span>
                                                </div>
                                                <div>
                                                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Logo Designer Studio</h2>
                                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">AI-Powered Brand Identity</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                                {[
                                                    { label: 'Minimalist', desc: 'Clean & Modern' },
                                                    { label: 'Gradient', desc: 'Vibrant & Bold' },
                                                    { label: 'Abstract', desc: 'Unique Shapes' },
                                                    { label: 'Lettermark', desc: 'Typographic focus' }
                                                ].map((style, i) => (
                                                    <div key={i} className="group cursor-pointer">
                                                        <div className="aspect-square bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 group-hover:border-indigo-600 transition-all flex items-center justify-center mb-4 relative overflow-hidden shadow-sm hover:shadow-xl">
                                                            <div className="w-16 h-16 rounded-full border-4 border-slate-200 flex items-center justify-center text-4xl font-black text-slate-300 group-hover:text-indigo-600 group-hover:border-indigo-600 transition-all">
                                                                {data?.name?.charAt(0) || 'b'}
                                                            </div>
                                                        </div>
                                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">{style.label}</h4>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{style.desc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-w-7xl mx-auto">
                                        {/* Oracle AI Hero Section */}
                                        <div className="relative mb-12 bg-gradient-to-br from-[#0a0b1e] via-[#1a1b3e] to-[#0a0b1e] rounded-[3rem] p-12 overflow-hidden shadow-2xl shadow-indigo-900/20 group">
                                            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
                                            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>

                                            <div className="relative z-10 flex flex-col items-center sm:flex-row justify-between gap-8">
                                                <div className="text-left max-w-lg">
                                                    <div className="flex items-center gap-4 mb-6">
                                                        <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-white backdrop-blur-xl border border-white/10">
                                                            <span className="material-symbols-outlined text-4xl font-black animate-pulse">rocket_launch</span>
                                                        </div>
                                                        <span className="px-4 py-1.5 bg-indigo-600/30 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-400/20">Launch Pad v1.0</span>
                                                    </div>
                                                    <h1 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter leading-none italic">{data?.name || 'mja'} <span className="not-italic text-indigo-400">Launch Pad</span></h1>
                                                    <p className="text-slate-400 text-sm font-medium leading-relaxed uppercase tracking-widest opacity-80">Universal initialization of your digital ecosystem. Everything built by AI in seconds.</p>
                                                </div>

                                                <div className="hidden lg:flex items-center gap-12 text-white/40">
                                                    {[
                                                        { val: '98%', label: 'AI Score' },
                                                        { val: '24/7', label: 'Availability' },
                                                        { val: '0ms', label: 'Latency' }
                                                    ].map((s, i) => (
                                                        <div key={i} className="text-center">
                                                            <div className="text-3xl font-black text-white/80">{s.val}</div>
                                                            <div className="text-[8px] font-black uppercase tracking-widest mt-1">{s.label}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Row of main AI Services */}
                                        <div className="flex flex-col lg:flex-row gap-8 mb-12">
                                            {/* Arkle AI Studio */}
                                            <div className="flex-1 bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden group text-left">
                                                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full -translate-y-20 translate-x-20 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                                                <div className="flex items-center gap-4 mb-10">
                                                    <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
                                                        <span className="material-symbols-outlined text-3xl font-black">bolt</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic">Arkle <span className="not-italic text-indigo-600">AI Studio</span></h3>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Universal Asset Command</p>
                                                    </div>
                                                </div>

                                                <div className="relative mb-8">
                                                    <textarea
                                                        value={promptInput}
                                                        onChange={(e) => setPromptInput(e.target.value)}
                                                        placeholder="What should Arkle build for you today? (e.g. 'Generate a minimalist tech logo')"
                                                        className="w-full h-32 bg-slate-50 rounded-[2rem] border-2 border-transparent focus:border-indigo-100 focus:bg-white p-8 outline-none font-bold text-xs text-slate-700 placeholder-slate-300 transition-all resize-none shadow-inner"
                                                    />
                                                    <div className="absolute bottom-6 right-6 flex items-center gap-3">
                                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Shift + Enter to send</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center gap-3 group/btn">
                                                        <span className="material-symbols-outlined text-[16px] group-hover/btn:rotate-12 transition-transform">bolt</span>
                                                        Ask AI Co-founder
                                                    </button>
                                                    <button className="px-8 py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-indigo-100 hover:bg-indigo-100 transition-all flex items-center gap-3" onClick={handleGenerateImage}>
                                                        <span className="material-symbols-outlined text-[16px]">image</span>
                                                        Generate Image
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Side Cards: Logo & Email */}
                                            <div className="flex flex-col gap-8 w-full lg:w-72 shrink-0">
                                                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg text-center group cursor-pointer hover:shadow-2xl transition-all h-2/3 flex flex-col justify-center" onClick={() => setCurrentCanvas('Logo Designer')}>
                                                    <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                                        <span className="material-symbols-outlined text-3xl font-black">brush</span>
                                                    </div>
                                                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-1">AI Logos</h4>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Brand Creator</p>
                                                    <div className="mt-8 flex justify-center">
                                                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all">
                                                            <span className="material-symbols-outlined text-sm font-black">edit</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-[#0f172a] p-8 rounded-[2.5rem] shadow-lg text-center group cursor-pointer hover:shadow-2xl transition-all h-1/3 flex flex-col justify-center text-white border border-white/5">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                            <span className="material-symbols-outlined text-xl font-black">mail</span>
                                                        </div>
                                                        <div className="text-left">
                                                            <h4 className="text-[9px] font-black text-white uppercase tracking-[0.2em] leading-none">Emails</h4>
                                                            <p className="text-[7px] font-bold text-white/40 uppercase tracking-widest mt-1">Webmail Setup</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Main Service Grid (The rest of items) */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {[
                                                { label: 'DOMAIN SEARCH', icon: 'language', bg: 'bg-blue-50', color: 'text-blue-600', badge: 'COMING SOON' },
                                                { label: 'WEBSITE BUILDER', icon: 'web_stories', bg: 'bg-emerald-50', color: 'text-emerald-600', badge: 'COMING SOON' },
                                                { label: 'E-STORE SETUP', icon: 'shopping_cart', bg: 'bg-indigo-50', color: 'text-indigo-600', badge: 'COMING SOON' },
                                                { label: 'PRODUCT COPY', icon: 'edit_note', bg: 'bg-amber-50', color: 'text-amber-600', badge: 'COMING SOON', sub: 'PAGE CREATE' },
                                                { label: 'BRAND BROCHURE', icon: 'folder_open', bg: 'bg-pink-50', color: 'text-pink-600', badge: 'COMING SOON' },
                                                { label: 'PRODUCT CATALOG', icon: 'menu_book', bg: 'bg-purple-50', color: 'text-purple-600', badge: 'COMING SOON' },
                                                { label: 'DIGITAL CARD', icon: 'contact_page', bg: 'bg-slate-50', color: 'text-slate-600', badge: 'COMING SOON' },
                                                { label: 'PITCH DECK AI', icon: 'play_circle', bg: 'bg-cyan-50', color: 'text-cyan-600', badge: 'BETA' },
                                                { label: 'SM MANAGER', icon: 'share', bg: 'bg-rose-50', color: 'text-rose-600', badge: 'COMING SOON' },
                                                { label: 'AI POST GEN', icon: 'post_add', bg: 'bg-green-50', color: 'text-green-600', badge: 'BETA' },
                                                { label: 'BRAND KITS', icon: 'category', bg: 'bg-teal-50', color: 'text-teal-600', badge: 'COMING SOON' },
                                                { label: 'SEO TOOLS', icon: 'build', bg: 'bg-sky-50', color: 'text-sky-600', badge: 'COMING SOON' }
                                            ].map((service, i) => (
                                                <div
                                                    key={i}
                                                    className="bg-white p-6 h-32 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group flex items-center gap-4 cursor-pointer relative overflow-hidden"
                                                    onClick={() => setCurrentCanvas(service.label)}
                                                >
                                                    <div className="absolute top-4 right-5 text-[7px] font-black text-slate-300 uppercase tracking-[0.1em]">
                                                        {service.badge}
                                                    </div>
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${service.bg} ${service.color}`}>
                                                        <span className="material-symbols-outlined text-xl font-black">{service.icon}</span>
                                                    </div>
                                                    <div className="text-left">
                                                        <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest leading-tight">{service.label}</h4>
                                                        {(service as any).sub && <p className="text-[7px] text-slate-400 font-bold uppercase mt-1 tracking-wider leading-none">{(service as any).sub}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'LearnerStudio' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="text-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                    <h2 className="text-xl font-bold font-serif text-slate-900 mb-2">Learner Studio</h2>
                                    <p className="text-slate-500 text-sm font-sans">Skill upgradation, tech adoption, and master business operations.</p>
                                </div>

                                {/* Glassmorphic Coming Soon Overlay for Learner Studio */}
                                <div className="fixed bottom-24 right-8 z-30 max-w-sm w-full animate-in slide-in-from-bottom-10 duration-1000 delay-100">
                                    <div className="backdrop-blur-xl bg-white/70 border border-white/50 shadow-2xl rounded-2xl p-5 relative overflow-hidden group hover:bg-white/90 transition-all cursor-pointer" onClick={() => handleServiceClick('Learner Studio Access', 'Coming Soon')}>
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-green-500 to-emerald-500"></div>
                                        <div className="flex items-start gap-4">
                                            <div className="bg-teal-100 text-teal-600 p-2.5 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-2xl">school</span>
                                            </div>
                                            <div>
                                                <h3 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-wide">Academy Opening Soon</h3>
                                                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                                    Detailed courses on GST, Funding, and Growth are in production.
                                                </p>
                                                <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-teal-600 uppercase tracking-wider">
                                                    <span>Join Waitlist</span>
                                                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">notifications_active</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-teal-500/10 rounded-full blur-xl group-hover:bg-teal-500/20 transition-all"></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {learnerStudioServices.map((service, i) => (
                                        <div
                                            key={i}
                                            onClick={() => handleServiceClick(service.label, (service as any).badge)}
                                            className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4 group cursor-pointer active:scale-95"
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${service.bg} ${service.color}`}>
                                                <span className="material-symbols-outlined text-lg font-bold">{service.icon}</span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-tight mb-1">{service.label}</h3>
                                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{service.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="h-8"></div>
                    </div>
                </main>

                <div className="bg-white border-t border-slate-200 p-3 sticky bottom-0 z-40">
                    <div className="max-w-3xl mx-auto flex items-center justify-between">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg text-[10px] shadow-md transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">support_agent</span>
                            GET EXPERT SUPPORT
                        </button>
                        <div className="hidden lg:flex gap-6 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                            <a className="hover:text-primary transition-colors cursor-pointer">Compliance</a>
                            <a className="hover:text-primary transition-colors cursor-pointer">Branding</a>
                            <a className="hover:text-primary transition-colors cursor-pointer">Growth</a>
                        </div>
                    </div>
                </div>

                {/* Global Floating Layout Components */}
                {activeTab === 'B' && (
                    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4 pointer-events-none">
                        {/* Floating Quick Chat Bot Widget */}
                        <div className="pointer-events-auto">
                            <QuickChatBot user={user} data={data} />
                        </div>
                    </div>
                )}
            </div>
            <Toast
                message={toast.message}
                subMessage={toast.sub}
                isVisible={toast.visible}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            {/* Global Incorporation Full Page Modal */}
            {showGlobalIncorporation && (
                <GlobalIncorporationFullPage
                    onClose={() => setShowGlobalIncorporation(false)}
                    onLeadCapture={(leadData) => {
                        console.log('Global lead captured:', leadData);
                        setShowGlobalIncorporation(false);
                        setShowLoginPrompt(true);
                    }}
                />
            )}

            {/* Oracle AI Studio - Full ChatGPT-style Interface */}
            {activeTab === 'Oracle' && (
                <AIStudioLayout />
            )}
        </div>
    );
};

export default Dashboard;
