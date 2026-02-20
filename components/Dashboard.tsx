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
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
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

    // Right Sidebar Agent State
    const [agentMode, setAgentMode] = useState<'developer' | 'cofounder'>('cofounder');
    const [isAgentSidebarExpanded, setIsAgentSidebarExpanded] = useState(true);
    const [isAgentSidebarWide, setIsAgentSidebarWide] = useState(false);
    const [currentServiceCategory, setCurrentServiceCategory] = useState<'all' | 'brand' | 'legal' | 'growth'>('all');
    const [agentMessages, setAgentMessages] = useState<any[]>([]);

    const [selectedModel, setSelectedModel] = useState<'gemini' | 'gpt4o' | 'claude'>('gemini');
    const [showBuildPopup, setShowBuildPopup] = useState(false);
    const [businessDescription, setBusinessDescription] = useState("");

    // Resizable Sidebar States
    const [agentSidebarWidth, setAgentSidebarWidth] = useState(400);
    const [isResizing, setIsResizing] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            const newWidth = window.innerWidth - e.clientX - 32; // 32 is roughly the right padding
            if (newWidth > 300 && newWidth < 800) {
                setAgentSidebarWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.body.style.cursor = 'default';
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'ew-resize';
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

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

    const handleLaunchPadComplete = async (onboardingData: any) => {
        // Save to Firestore for permanent record
        try {
            await addDoc(collection(db, "brand_requests"), {
                ...onboardingData,
                status: 'new',
                userId: user?.uid || null,
                guestId: guestId,
                createdAt: serverTimestamp()
            });
            console.log("Brand request saved to cloud.");
        } catch (error) {
            console.error("Error saving brand request:", error);
        }

        localStorage.setItem('hasSeenLaunchPadFlow', 'true');
        setShowLaunchPadFlow(false);
        // Optionally update data context or trigger other successes
        setToast({
            visible: true,
            message: "Brand Identity Secured",
            sub: "Your brand assets are being generated on our servers."
        });
    };

    const handleAiAsk = (input?: string) => {
        const query = input?.toLowerCase() || "";
        if (chatCount >= 2) {
            setAiMessage("Your Customized Roadmap is ready in Business Setup. Hover to see.");
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
        { label: 'Logos', icon: 'brush', bg: 'bg-orange-50', color: 'text-orange-600' },
        { label: 'LLC / Registration', icon: 'gavel', bg: 'bg-blue-50', color: 'text-blue-600' },
        { label: 'Domain', icon: 'language', bg: 'bg-indigo-50', color: 'text-indigo-600' },
        { label: 'Website', icon: 'web', bg: 'bg-teal-50', color: 'text-teal-600' },
        { label: 'Digital Card', icon: 'badge', bg: 'bg-slate-100', color: 'text-slate-600' },
        { label: 'Business Email', icon: 'mail', bg: 'bg-sky-50', color: 'text-sky-600' },
        { label: 'Legal Documents', icon: 'description', bg: 'bg-purple-50', color: 'text-purple-600' },
        { label: 'CA Assistance', icon: 'support_agent', bg: 'bg-rose-50', color: 'text-rose-600' },
        { label: 'Banking', icon: 'account_balance', bg: 'bg-emerald-50', color: 'text-emerald-600' }
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
        { label: 'Banking & Loans', time: 'Funding Support', icon: 'account_balance', bg: 'bg-emerald-50', color: 'text-emerald-600', button: 'GET LOAN' },
        { label: 'Global Market Access', time: 'Export & Expansion', icon: 'public', bg: 'bg-blue-50', color: 'text-blue-600', button: 'EXPLORE', btnColor: 'bg-blue-600' },
        { label: 'Ready to Go Global', time: 'International Setup', icon: 'flight_takeoff', bg: 'bg-indigo-50', color: 'text-indigo-600', button: 'START NOW', btnColor: 'bg-indigo-900' }
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



    return (
        <div className="flex w-full h-screen overflow-hidden bg-white font-display text-[#1e293b] antialiased">
            {/* Sidebar */}
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col h-full transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 overflow-hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:w-0 md:hidden'}`}>
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
                    <button
                        onClick={() => setActiveTab('A')}
                        className={`flex items-center gap-3 px-3 py-2.5 transition-all w-full text-left group ${activeTab === 'A' ? 'text-blue-600' : 'text-slate-600'}`}
                    >
                        <span className={`material-symbols-outlined text-[20px] ${activeTab === 'A' ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`}>description</span>
                        <span className="text-[14px] font-medium">Business Setup</span>
                    </button>

                    {activeTab === 'B' ? (
                        <>
                            <div className="pt-6 pb-2 px-3 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="material-icons text-[12px]">rocket_launch</span> EXECUTION ROADMAP
                            </div>
                            {/* Left Sidebar Roadmap View */}
                            <div className="px-2 py-4 space-y-3 ml-1">
                                {buildServices.map((service, i) => (
                                    <div
                                        key={i}
                                        onClick={() => handleServiceClick(service.label, (service as any).badge)}
                                        className={`flex items-center gap-3 px-3 py-1 cursor-pointer transition-all ${i === 0 ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
                                    >
                                        <span className={`material-symbols-outlined text-[20px]`}>{service.icon}</span>
                                        <span className="text-[14px] font-medium">{service.label}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="pt-6 pb-2 px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Launchpad</div>
                            <button
                                onClick={() => setActiveTab('B')}
                                className={`flex items-center gap-3 px-3 py-2.5 transition-all w-full text-left text-slate-600 hover:text-slate-900 group`}
                            >
                                <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-indigo-600">rocket</span>
                                <span className="text-[14px] font-medium">Launch Pad</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('LearnerStudio')}
                                className={`flex items-center gap-3 px-3 py-2.5 transition-all w-full text-left ${activeTab === 'LearnerStudio' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900 group'}`}
                            >
                                <span className={`material-symbols-outlined text-[20px] ${activeTab === 'LearnerStudio' ? 'text-blue-600' : 'text-slate-400 group-hover:text-teal-600'}`}>menu_book</span>
                                <span className="text-[14px] font-medium">Learner Studio</span>
                            </button>

                            <div className="pt-6 pb-2 px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Services</div>
                            {sidebarItems.map((item, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handleServiceClick(item.label, (item as any).badge); }}
                                    className={`flex items-center gap-3 px-3 py-2.5 transition-all text-slate-600 hover:text-blue-600 group ${(item as any).badge ? 'cursor-alias opacity-50' : ''}`}
                                >
                                    <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform text-slate-400 group-hover:text-blue-600">{item.icon}</span>
                                    <span className="text-[14px] font-medium">{item.label}</span>
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
                <header className="sticky top-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 flex-shrink-0 z-50 shadow-sm">
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden"
                        >
                            <span className="material-symbols-outlined text-2xl">menu</span>
                        </button>
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                            className="hidden md:block text-slate-400 hover:text-slate-600 mr-2"
                        >
                            <span className="material-symbols-outlined text-xl">menu_open</span>
                        </button>
                        <div className="flex bg-slate-100/50 p-1.5 rounded-2xl gap-2">
                            {/* Business Setup Nav Item */}
                            <div className="relative group">
                                <button
                                    onClick={() => setActiveTab('A')}
                                    className={`px-5 py-2.5 rounded-xl transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${activeTab === 'A' ? 'bg-white text-blue-600 shadow-md shadow-blue-500/10 scale-105' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">description</span>
                                    Business Setup
                                </button>
                                
                                {/* Hover Popup for Business Setup */}
                                <div className="absolute top-full left-0 mt-4 w-96 bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white/40 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 z-50 transform translate-y-4 group-hover:translate-y-0">
                                    <div className="absolute -top-2 left-8 w-4 h-4 bg-white/80 backdrop-blur-xl border-t border-l border-white/40 rotate-45"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                                <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 leading-tight">Business Setup</h4>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Operating System</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed mb-4 font-medium">
                                            It's not just selling services. It's an entire business journey assistance.
                                        </p>
                                        
                                        <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <span>Idea</span>
                                            <span className="text-slate-300">→</span>
                                            <span>Setup</span>
                                            <span className="text-slate-300">→</span>
                                            <span>Operate</span>
                                            <span className="text-slate-300">→</span>
                                            <span className="text-blue-600">Global</span>
                                        </div>

                                        <p className="text-[10px] text-slate-500 font-medium border-l-2 border-blue-500 pl-3 mb-5 italic">
                                            "Build, monitor & scale your startup with AI + experts. 365 days business support."
                                        </p>

                                        <div className="flex items-center justify-between">
                                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Global Markets</span>
                                             <button 
                                                onClick={() => setShowGlobalIncorporation(true)}
                                                className="text-[10px] font-black text-blue-600 hover:underline flex items-center gap-1"
                                             >
                                                Read More <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                                             </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Launch Pad Nav Item */}
                            <div className="relative group">
                                <button
                                    onClick={() => setActiveTab('B')}
                                    className={`px-5 py-2.5 rounded-xl transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${activeTab === 'B' ? 'bg-white text-indigo-600 shadow-md shadow-indigo-500/10 scale-105' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">rocket</span>
                                    Launch Pad
                                </button>

                                {/* Hover Popup for Launch Pad */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-80 bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white/40 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 z-50 transform translate-y-4 group-hover:translate-y-0">
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/80 backdrop-blur-xl border-t border-l border-white/40 rotate-45"></div>
                                    <div className="relative z-10">
                                        <div className="mb-4">
                                            <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg uppercase tracking-wider">AI Studio</span>
                                        </div>
                                        <h4 className="text-sm font-black text-slate-900 mb-2">Build Your Identity</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                            Generate Logos, Websites, and Social Media content instantly with Neural AI.
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Logo', 'Website', 'Domian', 'Deck'].map(i => (
                                                <div key={i} className="bg-slate-50 text-[10px] font-bold text-slate-600 px-2 py-1.5 rounded-lg text-center border border-slate-100">
                                                    {i}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Learner Studio Nav Item */}
                            <div className="relative group">
                                <button
                                    onClick={() => setActiveTab('LearnerStudio')}
                                    className={`px-5 py-2.5 rounded-xl transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${activeTab === 'LearnerStudio' ? 'bg-white text-teal-600 shadow-md shadow-teal-500/10 scale-105' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">menu_book</span>
                                    Learner Studio
                                </button>

                                {/* Hover Popup for Learner Studio */}
                                <div className="absolute top-full right-0 mt-4 w-80 bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white/40 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 z-50 transform translate-y-4 group-hover:translate-y-0">
                                    <div className="absolute -top-2 right-12 w-4 h-4 bg-white/80 backdrop-blur-xl border-t border-l border-white/40 rotate-45"></div>
                                    <div className="relative z-10">
                                        <h4 className="text-sm font-black text-slate-900 mb-1">Founder's Academy</h4>
                                        <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider mb-3">Skill Upgradation</p>
                                        <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                            Master business operations, financial literacy, and leadership.
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-700">
                                                <span className="material-symbols-outlined text-[14px] text-green-500">check_circle</span> GST & Tax Mastery
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-700">
                                                <span className="material-symbols-outlined text-[14px] text-green-500">check_circle</span> Zero-to-One Scale
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <button
                                onClick={() => setActiveTab('Workspace')}
                                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-2 uppercase tracking-widest active:scale-95 border border-indigo-400/30"
                            >
                                <span className="material-icons-outlined text-sm">rocket</span> WORKSPACE <span className="bg-white/20 px-1 py-0.5 rounded text-[8px] text-white">SOON</span>
                            </button>

                            {/* Hover Popup for Workspace */}
                            <div className="absolute top-full right-0 mt-4 w-72 bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white/40 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 z-50 transform translate-y-4 group-hover:translate-y-0">
                                <div className="absolute -top-2 right-8 w-4 h-4 bg-white/80 backdrop-blur-xl border-t border-l border-white/40 rotate-45"></div>
                                <div className="relative z-10">
                                    <h4 className="text-sm font-black text-slate-900 mb-1">Operations Hub</h4>
                                    <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mb-3">Central Command</p>
                                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                        Track service status, upload documents, and manage your business profile.
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 p-2 rounded-lg border border-slate-100">
                                        <span className="material-symbols-outlined text-[14px] text-slate-400">lock</span> Encrypted & Secure
                                    </div>
                                </div>
                            </div>
                        </div>
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

                        {/* Workspace Dashboard */}
                        {activeTab === 'Workspace' && (
                            <div className="h-full w-full animate-in fade-in duration-500">
                                <Workspace onNavigate={setActiveTab} />
                            </div>
                        )}

                        {activeTab === 'A' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">

                                {/* ── Incorporation Hero CTA ── */}
                                <div className="mb-8">
                                    {/* Main Hero Banner */}
                                    <a href="/incorporation" className="block group relative bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 rounded-3xl p-7 text-white overflow-hidden shadow-2xl hover:shadow-indigo-900/40 transition-all hover:-translate-y-1 mb-5">
                                        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -translate-y-40 translate-x-40 group-hover:bg-indigo-500/20 transition-all duration-1000" />
                                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">AI-Powered Incorporation</span>
                                                </div>
                                                <h2 className="text-2xl font-black mb-2 leading-tight">
                                                    Register Your Business <span className="text-indigo-400">in 10-15 Days</span>
                                                </h2>
                                                <p className="text-slate-400 text-sm mb-4 max-w-md">
                                                    Choose from 3 expert packages or let our AI build a custom plan for your business. 100% online, CA-supported.
                                                </p>
                                                {/* Mini Package Preview */}
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    {[
                                                        { emoji: '🏪', name: 'Proprietor', price: '₹2,999' },
                                                        { emoji: '🚀', name: 'Startup', price: '₹7,999', popular: true },
                                                        { emoji: '📈', name: 'Scale-Up', price: '₹14,999' },
                                                    ].map((p, i) => (
                                                        <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${p.popular ? 'bg-indigo-500/30 border-indigo-400/50 text-white' : 'bg-white/10 border-white/10 text-slate-300'}`}>
                                                            <span>{p.emoji}</span>
                                                            <span>{p.name}</span>
                                                            <span className="text-indigo-300 font-black">{p.price}</span>
                                                            {p.popular && <span className="bg-indigo-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black">⭐</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-3 flex-shrink-0">
                                                <div className="flex items-center gap-3 px-7 py-4 bg-white text-indigo-900 rounded-2xl font-black text-sm shadow-2xl group-hover:shadow-white/20 transition-all group-hover:scale-105">
                                                    <span className="material-icons">rocket_launch</span>
                                                    Open Incorporation Dashboard
                                                    <span className="material-icons">arrow_forward</span>
                                                </div>
                                                <div className="flex items-center gap-3 px-7 py-3 bg-white/10 border border-white/20 text-white rounded-2xl font-bold text-xs hover:bg-white/20 transition-all text-center justify-center">
                                                    <span className="material-icons text-sm">auto_awesome</span>
                                                    Get AI-Recommended Pack
                                                </div>
                                            </div>
                                        </div>
                                    </a>

                                    {/* Quick Stats Row */}
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { icon: 'verified', label: '5,000+ Registered', sub: 'Businesses incorporated', color: 'text-green-600 bg-green-50' },
                                            { icon: 'schedule', label: '10-15 Days', sub: 'Average timeline', color: 'text-indigo-600 bg-indigo-50' },
                                            { icon: 'support_agent', label: 'Expert CA Support', sub: 'Dedicated professionals', color: 'text-purple-600 bg-purple-50' },
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                                                    <span className="material-icons text-xl">{stat.icon}</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-900">{stat.label}</p>
                                                    <p className="text-[10px] text-slate-400">{stat.sub}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Hero Grid: Roadmap + Progress */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-start">
                                    {/* Left Column: Progress */}
                                    <div className="lg:col-span-2 space-y-6">
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
                                        <div 
                                            key={i} 
                                            onClick={() => {
                                                if (item.label.includes('Global') || item.label.includes('Ready to Go')) {
                                                    setShowGlobalIncorporation(true);
                                                }
                                            }}
                                            className={`bg-white rounded-xl p-3 md:p-4 border border-slate-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-all group cursor-pointer`}
                                        >
                                            <div className={`w-10 h-10 rounded-lg ${item.bg} ${item.color} flex items-center justify-center transition-all flex-shrink-0`}>
                                                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-sm text-slate-800 leading-tight tracking-tight truncate" title={item.label}>{item.label}</h3>
                                                <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate">{item.time}</p>
                                            </div>
                                            <div className="flex items-center gap-4 flex-shrink-0">
                                                <button className="text-[9px] font-bold text-slate-400 hover:text-indigo-600 tracking-wide hidden sm:block transition-colors">DETAILS</button>
                                                <button className={`px-4 py-1.5 ${item.button === 'UPLOAD' && (item as any).variant === 'secondary' ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' : (item as any).btnColor ? `${(item as any).btnColor} text-white` : 'bg-slate-900 text-white hover:bg-slate-800'} text-[10px] font-bold rounded-lg shadow-md transition-all active:scale-95 min-w-[80px]`}>
                                                    {item.button || 'UPLOAD'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Ready to Go Global Banner */}
                                <div className="mt-8 relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl group cursor-pointer border-4 border-white/20 transition-all hover:scale-[1.01]" onClick={() => setShowGlobalIncorporation(true)}>
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl group-hover:bg-white/20 transition-all duration-1000"></div>
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full translate-y-32 -translate-x-32 blur-3xl group-hover:bg-cyan-500/30 transition-all duration-1000"></div>
                                    
                                    <div className="relative z-10 flex flex-col items-center justify-center text-center">
                                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500 border border-white/20">
                                            <span className="material-icons text-4xl text-white">public</span>
                                        </div>
                                        
                                        <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">
                                            Ready to Go Global?
                                        </h2>
                                        <p className="text-blue-100 text-sm md:text-base mb-8 max-w-lg mx-auto font-medium leading-relaxed">
                                            Expand your business to international markets. Incorporation, Export, and Market Access in 50+ countries.
                                        </p>
                                        
                                        <button className="bg-white text-blue-600 px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl hover:shadow-white/20 hover:bg-blue-50 transition-all hover:-translate-y-1 flex items-center gap-2 group-hover:gap-3">
                                            <span className="material-icons text-lg">public</span>
                                            Explore Global Opportunities 
                                            <span className="material-icons text-sm">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>


                            </div>
                        )}

                        {activeTab === 'B' && (
                            <div className="flex gap-4 relative min-h-[85vh]">
                                {/* Main Content Area */}
                                <div className={`flex-1 transition-all duration-300 ${isAgentSidebarExpanded ? 'mr-0' : 'mr-12'}`} style={{ marginRight: isAgentSidebarExpanded ? `${agentSidebarWidth + 32}px` : '48px' }}>
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative p-8 rounded-[3rem] bg-[#f8faff] min-h-full">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(79,70,229,0.03),transparent_40%),radial-gradient(circle_at_10%_80%,rgba(236,72,153,0.03),transparent_40%)] rounded-[3rem] pointer-events-none"></div>

                                        {showLaunchPadFlow && (
                                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500">
                                                <div className="relative w-full max-w-xl">
                                                    <button
                                                        onClick={() => setShowLaunchPadFlow(false)}
                                                        className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all z-[110] border border-slate-100"
                                                    >
                                                        <span className="material-symbols-outlined font-black">close</span>
                                                    </button>
                                                    <LaunchPadAIOnboarding
                                                        businessData={data}
                                                        onComplete={handleLaunchPadComplete}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {currentCanvas === 'Logo Designer' ? (
                                            <div className="animate-in zoom-in-95 duration-500 relative max-w-4xl mx-auto">
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

                                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
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
                                            <div className="max-w-5xl mx-auto pt-4">
                                                {/* NEW: Build your Business CTA (35% Smaller Version) */}
                                                <div className="mb-8 relative overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-black rounded-[2.5rem] p-6 text-white shadow-2xl group cursor-pointer border border-white/5" onClick={() => setShowBuildPopup(true)}>
                                                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24 blur-3xl group-hover:bg-white/10 transition-all duration-1000"></div>
                                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                                        <div className="text-left">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-[7px] font-black uppercase tracking-[0.2em] border border-indigo-500/20">Ignition Phase</span>
                                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                                <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em]">Neural Link Active</span>
                                                            </div>
                                                            <h2 className="text-2xl font-black tracking-tightest leading-[0.9] italic mb-3">
                                                                BUILD YOUR ENTIRE <span className="text-indigo-400 not-italic">BRAND PRESENCE</span>
                                                            </h2>
                                                            <p className="text-white/50 text-[9px] font-black uppercase tracking-[0.2em] mb-3">
                                                                GET LIFE TO YOUR STARTUP • BUILD EVERYTHING IN MINUTE CLICK
                                                            </p>
                                                            <div className="flex items-center gap-2 text-indigo-400/80">
                                                                <span className="material-symbols-outlined text-[12px] animate-bounce">expand_circle_down</span>
                                                                <span className="text-[8px] font-black uppercase tracking-[0.3em]">Initialize Mission Control</span>
                                                            </div>
                                                        </div>
                                                        <div className="w-14 h-14 bg-white/10 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 backdrop-blur-xl border border-white/10 shadow-2xl relative shrink-0">
                                                            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse"></div>
                                                            <span className="material-symbols-outlined text-2xl font-black animate-bounce relative z-10">rocket_launch</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Service Category Toggles */}
                                                <div className="flex items-center justify-center gap-2 mb-12 bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-white/50 shadow-sm w-fit mx-auto">
                                                    {[
                                                        { id: 'all', label: 'All Engines', icon: 'grid_view' },
                                                        { id: 'brand', label: 'Brand Identity', icon: 'brush' },
                                                        { id: 'legal', label: 'Legal & Compliance', icon: 'gavel' },
                                                        { id: 'growth', label: 'Growth & Socials', icon: 'campaign' }
                                                    ].map((cat) => (
                                                        <button
                                                            key={cat.id}
                                                            onClick={() => setCurrentServiceCategory(cat.id as any)}
                                                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentServiceCategory === cat.id
                                                                ? 'bg-slate-900 text-white shadow-xl scale-105'
                                                                : 'text-slate-400 hover:text-slate-900 hover:bg-white/80'
                                                                }`}
                                                        >
                                                            <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                                                            {cat.label}
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Filtered Service Grid */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                    {[
                                                        { label: 'DOMAIN SEARCH', icon: 'language', bg: 'bg-blue-50', color: 'text-blue-600', badge: 'COMING SOON', cat: 'brand' },
                                                        { label: 'WEBSITE BUILDER', icon: 'web_stories', bg: 'bg-emerald-50', color: 'text-emerald-600', badge: 'COMING SOON', cat: 'brand' },
                                                        { label: 'E-STORE SETUP', icon: 'shopping_cart', bg: 'bg-indigo-50', color: 'text-indigo-600', badge: 'COMING SOON', cat: 'growth' },
                                                        { label: 'PRODUCT COPY', icon: 'edit_note', bg: 'bg-amber-50', color: 'text-amber-600', badge: 'COMING SOON', sub: 'PAGE CREATE', cat: 'growth' },
                                                        { label: 'BRAND BROCHURE', icon: 'folder_open', bg: 'bg-pink-50', color: 'text-pink-600', badge: 'COMING SOON', cat: 'brand' },
                                                        { label: 'PRODUCT CATALOG', icon: 'menu_book', bg: 'bg-purple-50', color: 'text-purple-600', badge: 'COMING SOON', cat: 'brand' },
                                                        { label: 'DIGITAL CARD', icon: 'contact_page', bg: 'bg-slate-50', color: 'text-slate-600', badge: 'COMING SOON', cat: 'brand' },
                                                        { label: 'PITCH DECK AI', icon: 'play_circle', bg: 'bg-cyan-50', color: 'text-cyan-600', badge: 'BETA', cat: 'growth' },
                                                        { label: 'SM MANAGER', icon: 'share', bg: 'bg-rose-50', color: 'text-rose-600', badge: 'COMING SOON', cat: 'growth' },
                                                        { label: 'AI POST GEN', icon: 'post_add', bg: 'bg-green-50', color: 'text-green-600', badge: 'BETA', cat: 'growth' },
                                                        { label: 'BRAND KITS', icon: 'category', bg: 'bg-teal-50', color: 'text-teal-600', badge: 'COMING SOON', cat: 'brand' },
                                                        { label: 'SEO TOOLS', icon: 'build', bg: 'bg-sky-50', color: 'text-sky-600', badge: 'COMING SOON', cat: 'growth' }
                                                    ]
                                                        .filter(s => currentServiceCategory === 'all' || s.cat === currentServiceCategory)
                                                        .map((service, i) => (
                                                            <div
                                                                key={i}
                                                                className="bg-white p-4 h-28 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between cursor-pointer relative overflow-hidden"
                                                                onClick={() => setCurrentCanvas(service.label)}
                                                            >
                                                                <div className="absolute top-3 right-5 text-[6px] font-black text-slate-300 uppercase tracking-[0.1em]">
                                                                    {service.badge}
                                                                </div>
                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${service.bg} ${service.color} group-hover:scale-110 transition-transform`}>
                                                                    <span className="material-symbols-outlined text-xl font-black">{service.icon}</span>
                                                                </div>
                                                                <div className="text-left">
                                                                    <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest leading-tight">{service.label}</h4>
                                                                    {(service as any).sub && <p className="text-[6px] text-slate-400 font-bold uppercase mt-1 tracking-wider leading-none">{(service as any).sub}</p>}
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Agent Sidebar */}
                                <div
                                    className={`fixed top-24 bottom-24 right-8 z-50 transition-all duration-300 ease-in-out ${isAgentSidebarExpanded ? '' : 'w-14'}`}
                                    style={{ width: isAgentSidebarExpanded ? `${agentSidebarWidth}px` : '56px' }}
                                >
                                    <div className="h-full bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl flex flex-col overflow-hidden relative group/sidebar">
                                        {/* Resize Drag Handle (Left Edge) */}
                                        {isAgentSidebarExpanded && (
                                            <div
                                                onMouseDown={() => setIsResizing(true)}
                                                className="absolute top-1/4 bottom-1/4 left-0 w-1.5 cursor-ew-resize hover:bg-indigo-500/20 transition-colors z-30 group/handle flex items-center justify-center"
                                            >
                                                <div className="w-0.5 h-8 bg-slate-200 group-hover/handle:bg-indigo-400 rounded-full transition-colors"></div>
                                            </div>
                                        )}

                                        {/* Resize/Toggle Button */}
                                        <button
                                            onClick={() => setIsAgentSidebarExpanded(!isAgentSidebarExpanded)}
                                            className="absolute top-1/2 -left-4 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-40"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">
                                                {isAgentSidebarExpanded ? 'chevron_right' : 'chevron_left'}
                                            </span>
                                        </button>

                                        {isAgentSidebarExpanded ? (
                                            <>
                                                {/* Sidebar Header */}
                                                <div className="border-b border-slate-100 bg-white sticky top-0 z-20">
                                                    <div className="p-6">
                                                        <div className="flex items-center justify-between mb-6">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                                                                    <span className="material-symbols-outlined text-xl">bolt</span>
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter italic flex items-center gap-2">
                                                                        Arkle <span className={`not-italic ${agentMode === 'developer' ? 'text-emerald-600' : 'text-indigo-600'}`}>
                                                                            {agentMode === 'developer' ? 'Developer' : 'Co-founder'}
                                                                        </span>
                                                                        <span className="bg-slate-900 text-white text-[6px] px-1.5 py-0.5 rounded-full not-italic tracking-[0.2em] font-black uppercase">Plus</span>
                                                                    </h3>
                                                                    <div className="flex items-center gap-1">
                                                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                                        <span className="text-[8px] font-medium text-slate-400 uppercase tracking-widest">Neural Link Active</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => setAgentSidebarWidth(prev => prev > 500 ? 400 : 700)}
                                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${agentSidebarWidth > 500 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                                                >
                                                                    <span className="material-symbols-outlined text-sm font-black">
                                                                        {agentSidebarWidth > 500 ? 'close_fullscreen' : 'fullscreen'}
                                                                    </span>
                                                                </button>
                                                                <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400">
                                                                    <span className="material-symbols-outlined text-sm font-black">settings</span>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Mode Switcher Tabs */}
                                                        <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
                                                            <button
                                                                onClick={() => setAgentMode('cofounder')}
                                                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${agentMode === 'cofounder' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">psychology</span>
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Co-founder</span>
                                                            </button>
                                                            <button
                                                                onClick={() => setAgentMode('developer')}
                                                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${agentMode === 'developer' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">terminal</span>
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Developer</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Chat/Messages Area */}
                                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white custom-scrollbar">
                                                    <div className={`p-4 rounded-2xl ${agentMode === 'developer' ? 'bg-emerald-50 border border-emerald-100' : 'bg-indigo-50 border border-indigo-100'}`}>
                                                        <p className={`text-[10px] font-bold ${agentMode === 'developer' ? 'text-emerald-700' : 'text-indigo-700'} uppercase tracking-widest mb-2 flex items-center justify-between`}>
                                                            <span>{agentMode === 'developer' ? '[ DEV_LOG_ACTIVE ]' : 'Strategic Guidance'}</span>
                                                            <span className="text-[7px] text-slate-400">ENGINE: {selectedModel.toUpperCase()}</span>
                                                        </p>
                                                        <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                                                            {agentMode === 'developer'
                                                                ? `[System] Using ${selectedModel.toUpperCase()} to monitor build logic. Neural parsing at 99%. All components optimized for rapid deployment.`
                                                                : `Welcome back. I'm using ${selectedModel === 'gemini' ? 'Google Gemini' : selectedModel === 'claude' ? 'Anthropic Claude' : 'OpenAI'} to provide deep architectural insights for ${data?.name || 'your startup'}.`}
                                                        </p>
                                                    </div>

                                                    {agentMode === 'developer' && (
                                                        <div className="bg-slate-900 rounded-xl p-4 font-mono text-[9px] text-emerald-400 shadow-inner">
                                                            <div className="flex gap-2 mb-1"><span className="text-slate-500">$</span> arkle --model {selectedModel}</div>
                                                            <div className="text-white opacity-80">Configuring Engine: {selectedModel}... Done.</div>
                                                            <div className="text-white opacity-80">Latency: 45ms</div>
                                                            <div className="mt-2 text-emerald-300 animate-pulse">&gt; Ready for High-Fidelity Commands_</div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Arkle Input Command Center */}
                                                <div className="p-6 bg-white border-t border-slate-50">
                                                    <div className="relative group/input bg-slate-50 rounded-[2rem] p-3 border-2 border-transparent focus-within:border-slate-200 transition-all shadow-lg overflow-hidden">
                                                        <textarea
                                                            value={businessDescription}
                                                            onChange={(e) => setBusinessDescription(e.target.value)}
                                                            placeholder={agentMode === 'developer' ? "Define technical logic..." : "Ask Arkle anything..."}
                                                            className="w-full bg-transparent px-4 py-2 text-[13px] font-medium outline-none transition-all resize-none h-28 placeholder-slate-300"
                                                        />

                                                        <div className="flex items-center justify-between px-2 pt-2 border-t border-slate-100/50 mt-2">
                                                            <div className="flex items-center gap-1.5">
                                                                {/* Utility Buttons */}
                                                                <label className="w-9 h-9 rounded-xl hover:bg-slate-200/50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all cursor-pointer group/util">
                                                                    <input type="file" className="hidden" onChange={(e) => {
                                                                        if (e.target.files?.[0]) {
                                                                            setToast({ visible: true, message: "Asset Linked", sub: `${e.target.files[0].name} synchronized.` });
                                                                        }
                                                                    }} />
                                                                    <span className="material-symbols-outlined text-[20px]">add</span>
                                                                </label>

                                                                {/* Agent Mode Dropdown (Co-founder / Developer) */}
                                                                <button
                                                                    className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-200/60 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-900 transition-all border border-transparent hover:border-slate-200 group/mode"
                                                                    onClick={() => setAgentMode(agentMode === 'cofounder' ? 'developer' : 'cofounder')}
                                                                >
                                                                    <span className="material-symbols-outlined text-[16px] text-indigo-600 group-hover/mode:scale-110 transition-transform">
                                                                        {agentMode === 'developer' ? 'terminal' : 'psychology'}
                                                                    </span>
                                                                    {agentMode === 'developer' ? 'Arkle Developer' : 'Arkle Co-founder'}
                                                                    <span className="material-symbols-outlined text-[14px] opacity-30">expand_less</span>
                                                                </button>

                                                                {/* Model Selection Dropdown */}
                                                                <button
                                                                    className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-200/60 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-900 transition-all border border-transparent hover:border-slate-200 group/model"
                                                                    onClick={() => {
                                                                        const models: ('gemini' | 'claude' | 'gpt4o')[] = ['gemini', 'claude', 'gpt4o'];
                                                                        const nextIdx = (models.indexOf(selectedModel) + 1) % models.length;
                                                                        setSelectedModel(models[nextIdx]);
                                                                    }}
                                                                >
                                                                    <span className={`w-1.5 h-1.5 rounded-full ${selectedModel === 'gemini' ? 'bg-blue-500' : selectedModel === 'claude' ? 'bg-orange-500' : 'bg-green-500'} animate-pulse`}></span>
                                                                    {selectedModel === 'gemini' ? 'Gemini 3.5' : selectedModel === 'claude' ? 'Claude 3.5' : 'GPT-4o Mini'}
                                                                    <span className="material-symbols-outlined text-[14px] opacity-30">expand_less</span>
                                                                </button>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    className="w-9 h-9 rounded-xl hover:bg-rose-50 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-all group/mic"
                                                                    onClick={() => setToast({ visible: true, message: "Voice Activated", sub: "Listening for commands..." })}
                                                                >
                                                                    <span className="material-symbols-outlined text-[20px]">mic</span>
                                                                </button>
                                                                <button className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all">
                                                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            /* Minimized View */
                                            <div className="flex flex-col items-center py-8 gap-6 h-full">
                                                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:rotate-12 transition-transform" onClick={() => setIsAgentSidebarExpanded(true)}>
                                                    <span className="material-symbols-outlined text-xl">bolt</span>
                                                </div>
                                                <div className="h-full w-[1px] bg-slate-100"></div>
                                                <div className="rotate-90 origin-center whitespace-nowrap text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                                                    ARKLE AI AGENT
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
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
                            <a className="hover:text-primary transition-colors cursor-pointer">Business Setup</a>
                            <a className="hover:text-primary transition-colors cursor-pointer">Branding</a>
                            <a className="hover:text-primary transition-colors cursor-pointer">Growth</a>
                        </div>
                    </div>
                </div>

                {/* Global Floating Layout Components */}
                {activeTab === 'A' && (
                    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4 pointer-events-none">
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

            {/* Build Vision Popup - Spotlight Style Modal */}
            {showBuildPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowBuildPopup(false)}></div>
                    <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
                        <div className="p-10">
                            <div className="flex items-center gap-5 mb-10">
                                <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform">
                                    <span className="material-symbols-outlined text-4xl">rocket_launch</span>
                                </div>
                                <div className="text-left">
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">NEURAL <span className="not-italic text-indigo-600">IGNITION</span></h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Initialize your digital ecosystem</p>
                                </div>
                                <button onClick={() => setShowBuildPopup(false)} className="ml-auto w-12 h-12 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="relative">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Business Description</label>
                                    <textarea
                                        autoFocus
                                        value={businessDescription}
                                        onChange={(e) => setBusinessDescription(e.target.value)}
                                        placeholder="Briefly describe your vision. (e.g. 'Build a modern organic skincare brand for athletes')"
                                        className="w-full h-48 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[2rem] p-8 text-sm font-medium outline-none transition-all resize-none shadow-inner"
                                    />
                                    <div className="absolute bottom-6 right-8 flex items-center gap-3">
                                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[10px]">auto_fix</span> AI ENHANCE READY
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => {
                                            setShowBuildPopup(false);
                                            setIsAgentSidebarExpanded(true);
                                        }}
                                        className="p-8 bg-white border-2 border-slate-100 rounded-[2rem] hover:border-indigo-600 hover:shadow-xl hover:-translate-y-1 transition-all group group/btn text-left"
                                    >
                                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-2xl font-black">forum</span>
                                        </div>
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1 group-hover:text-indigo-600 transition-colors">Submit to Arkle</h4>
                                        <p className="text-[10px] text-slate-400 font-bold leading-tight">Discuss and refine your vision with your AI Co-founder.</p>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowBuildPopup(false);
                                            setShowLaunchPadFlow(true);
                                        }}
                                        className="p-8 bg-slate-900 text-white rounded-[2rem] hover:bg-black hover:shadow-xl hover:-translate-y-1 transition-all group group/btn text-left"
                                    >
                                        <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-2xl font-black">playlist_add_check</span>
                                        </div>
                                        <h4 className="text-sm font-black uppercase tracking-tight mb-1">Start Setup Flow</h4>
                                        <p className="text-[10px] text-white/50 font-bold leading-tight">Launch the step-by-step interactive builder pages.</p>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 flex items-center justify-center gap-8 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Gemini 3.5 SYNCED
                            </div>
                            <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div> GPT-4o MINI READY
                            </div>
                            <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div> CLAUDE 3.5 ACTIVE
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
