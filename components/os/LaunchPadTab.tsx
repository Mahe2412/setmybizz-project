"use client";
/**
 * Arkle AI OS - LaunchPadTab Component
 * Version: 2.2.0 (Minimalist Launcher & Refined UI)
 * Last Updated: 2026-04-21
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BusinessData } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceBuilderStudio from '@/components/ai-studio/VoiceBuilderStudio';
import { ArkleBrainStatus } from './ArkleBrainStatus';
import { QAOverlay } from '@/components/shared/QAOverlay';
import { useBizStore } from '@/lib/useBizStore';


import { 
    SERVICES, 
    LAUNCHER_CATEGORIES, 
    TOOL_CATEGORIES, 
    TOOL_BLUEPRINTS, 
    SOLUTION_IDEAS, 
    DIGITAL_EMPLOYEES 
} from '@/lib/launchpad-data';

interface LaunchPadTabProps {
    data: BusinessData;
    externalLang?: string;
    onLangChange?: (l: string) => void;
}

/* ── Types ─────────────────────────────────────────────── */
type TopTab = 'launchpad' | 'arkle' | 'co-founder' | 'solutions' | 'ai-agents';
type AppState = 'home' | 'discuss' | 'building' | 'ready' | 'solutions-chat' | 'agent-workspace';

interface ChatMsg { role: 'ai' | 'user'; text: string; ts: number; }
interface BuiltAsset { id: string; label: string; icon: string; status: 'pending' | 'building' | 'done' | 'failed'; color: string; result?: string; }
interface BusinessContext {
    businessName: string;
    idea: string;
    stage: string;
    type: string; // Service or Product
    industry: string;
    techLevel: string;
    brandVoice: string;
    designTaste: string;
    struggles: string;
    colors: string[];
    fonts: string;
    audience: string;
    model: string;
    usp: string;
    commitment: string;
    services: string[];
    [key: string]: any;
}

/* ── Arkle Quick Chat Tiles ──────────────────────────── */
const ARKLE_QUICK_TILES = [
    { label: 'Growth Gaps', icon: 'psychology_alt', prompt: 'Arkle, scan my business context and identify the biggest growth gaps and bottlenecks I should fix right now.' },
    { label: 'AI Automation', icon: 'smart_toy', prompt: 'Identify manual tasks in my current business model that can be automated using AI and suggest a roadmap.' },
    { label: 'Tech Solutions', icon: 'construction', prompt: 'Suggest a modern tech stack and digital solutions to scale my operations effectively.' },
    { label: 'Social Plan', icon: 'campaign', prompt: 'Draft a 30-day viral social media content strategy for my business to drive organic engagement.' },
    { label: 'Lead Engine', icon: 'hub', prompt: 'Suggest an automated lead generation engine and funnel for my startup.' },
    { label: 'Sales Pitch', icon: 'record_voice_over', prompt: 'Help me refine my sales pitch and USP to increase conversion rates.' },
    { label: 'Product Roadmap', icon: 'timeline', prompt: 'Create a 3-month product development roadmap based on my vision.' },
];

/* ── Co-Founder Discovery & Strategy Flow ──────────────── */
const DISCUSSION_FLOW = [
    {
        key: 'language',
        q: "In which language should we build your empire?",
        type: 'choice',
        options: [
            { id: 'en-IN', label: 'English', icon: 'language_us_ce', desc: 'Standard business English' },
            { id: 'te-IN', label: 'తెలుగు (Telugu)', icon: 'language_pinyin', desc: 'మీ మాతృభాషలో చర్చించండి' },
            { id: 'hi-IN', label: 'हिन्दी (Hindi)', icon: 'translate', desc: 'राष्ट्रभाषा में संवाद करें' },
        ]
    },
    {
        key: 'businessName',
        q: "What's the name of your venture?",
        type: 'text',
        placeholder: "e.g., Organic Oasis (Or say 'help me name it')"
    },
    {
        key: 'idea',
        q: "Describe your core idea in a few words.",
        type: 'text',
        placeholder: "e.g., A farm-to-table organic delivery app..."
    },
    {
        key: 'commitment',
        q: "What's your level of commitment?",
        type: 'choice',
        options: [
            { id: 'fulltime', label: 'Full-Time Founder', icon: 'person_filled', desc: '100% focused on this' },
            { id: 'sidehustle', label: 'Side Hustle', icon: 'work_history', desc: 'Working part-time currently' },
            { id: 'student', label: 'Student Project', icon: 'school', desc: 'Building as a student' },
        ]
    },
    {
        key: 'stage',
        q: "What's your current business stage?",
        type: 'choice',
        options: [
            { id: 'idea', label: 'Idea Phase', icon: 'lightbulb', desc: 'Just a vision currently' },
            { id: 'mvp', label: 'MVP Stage', icon: 'deployed_code', desc: 'Building prototype' },
            { id: 'launched', label: 'Launched', icon: 'rocket_launch', desc: 'Live with customers' },
            { id: 'scaling', label: 'Scaling', icon: 'trending_up', desc: 'Focused on growth' },
        ]
    },
    {
        key: 'audience',
        q: "Who are your target customers?",
        type: 'choice',
        options: [
            { id: 'b2c', label: 'Consumer (B2C)', icon: 'person_search', desc: 'Regular individuals' },
            { id: 'b2b', label: 'Business (B2B)', icon: 'apartment', desc: 'Other companies/startups' },
            { id: 'enterprise', label: 'Enterprise', icon: 'account_balance', desc: 'Large corporations' },
            { id: 'micro', label: 'Local Community', icon: 'location_on', desc: 'Specific neighborhood' },
        ]
    },
    {
        key: 'model',
        q: "How will you make money?",
        type: 'choice',
        options: [
            { id: 'sub', label: 'Subscription', icon: 'rebase', desc: 'Monthly/Yearly recurring' },
            { id: 'once', label: 'One-time Sale', icon: 'shopping_cart', desc: 'Direct product purchase' },
            { id: 'comm', label: 'Commission', icon: 'percent', desc: 'Fees from transactions' },
            { id: 'freemium', label: 'Freemium', icon: 'card_giftcard', desc: 'Basic free, Pro upgrade' },
        ]
    },
    {
        key: 'usp',
        q: "What's your Unique Selling Point (USP)?",
        type: 'choice',
        options: [
            { id: 'price', label: 'Lowest Price', icon: 'sell', desc: 'Best value for money' },
            { id: 'speed', label: 'Fastest Delivery', icon: 'bolt', desc: 'Speed is our soul' },
            { id: 'premium', label: 'Premium Quality', icon: 'verified', desc: 'Luxury & high standards' },
            { id: 'innovation', label: 'Unique Solution', icon: 'emergency_heat', desc: 'First of its kind' },
        ]
    },
    {
        key: 'industry',
        q: "Which industry are we Disrupting?",
        type: 'choice',
        options: [
            { id: 'tech', label: 'Technology', icon: 'memory', desc: 'AI, Software, Hardware' },
            { id: 'organic', label: 'Organic/Healthy', icon: 'nature', desc: 'Wellness, Food, Eco' },
            { id: 'retail', label: 'Retail/D2C', icon: 'shopping_bag', desc: 'Consumer brands' },
            { id: 'finance', label: 'FinTech', icon: 'payments', desc: 'Banking, Crypto, Tax' },
            { id: 'pharma', label: 'Healthcare/Pharma', icon: 'vaccines', desc: 'Medical & Wellness' },
        ]
    },
    {
        key: 'designTaste',
        q: "Pick your brand's aesthetic vibe.",
        type: 'choice',
        options: [
            { id: 'minimal', label: 'Sleek Minimal', icon: 'ink_eraser', desc: 'Apple-style clean' },
            { id: 'tech', label: 'High-Tech Dark', icon: 'dark_mode', desc: 'Futuristic dynamic' },
            { id: 'creative', label: 'Playful/Vibrant', icon: 'palette', desc: 'Friendly & colorful' },
            { id: 'corporate', label: 'Trust & Elite', icon: 'business_center', desc: 'Authority & scale' },
        ]
    },
];

const QUICK_MESSAGES = [
    "Suggest color palette", "Marketing gaps?", "Competitor analysis", "Suggest taglines"
];

const BRAND_TEMPLATES: Record<string, any> = {
    'organic': { colors: ['#2d5a27', '#f4fff1', '#88a07c'], fonts: 'Outfit, Playfair Display', vibe: 'Natural & Trustworthy' },
    'tech': { colors: ['#0073ea', '#f4f7fe', '#1c1f3b'], fonts: 'Inter, Roboto', vibe: 'Modern & Dynamic' },
    'minimal': { colors: ['#000000', '#ffffff', '#676879'], fonts: 'Montserrat, Helvetica', vibe: 'Clean & Elite' },
    'creative': { colors: ['#ff7b00', '#fff0e5', '#ff3d00'], fonts: 'Poppins, Fredoka', vibe: 'Playful & Vibrant' },
};

/* ── Solutions Question Flow ──────────────────────────── */
const SOLUTIONS_FLOW = [
    { key: 'problem', q: "What specific problem or bottleneck are you facing in your business right now?" },
    { key: 'goal', q: "What's the ideal outcome? What would solving this look like?" },
    { key: 'current', q: "What tools or processes are you currently using to handle this?" },
    { key: 'gaps', q: "Where are the biggest gaps or frustrations with your current approach?" },
    { key: 'build', q: "Got it. Based on everything you've told me, here's what I recommend building:" },
];

const LaunchPadTab: React.FC<LaunchPadTabProps> = ({ data, externalLang, onLangChange }) => {
    const { user } = useAuth();
    const { tasks } = useBizStore();
    const firstName = user?.displayName?.split(' ')[0] || data?.name?.split(' ')[0] || 'Founder';

    /* ── State ─────────────────────────────────────────── */
    const [topTab, setTopTab] = useState<TopTab>('arkle');
    /* ── Master Theme Configuration (Mood Colors - DETAILED RESTORATION) ── */
    const themes: any = {
        arkle: {
            primary: '#0082ff',
            secondary: '#3b82f6',
            glow: 'rgba(0, 130, 255, 0.6)',
            bgBase: '#f8faff',
            meshColor1: '#dbeafe',
            meshColor2: '#eff6ff',
            accent: 'bg-gradient-to-r from-blue-600 to-cyan-500',
            text: 'text-[#0082ff]',
            border: 'border-blue-500/30'
        },
        'co-founder': {
            primary: '#10b981',
            secondary: '#059669',
            glow: 'rgba(16, 185, 129, 0.6)',
            bgBase: '#f6fdfa',
            meshColor1: '#d1fae5',
            meshColor2: '#ecfdf5',
            accent: 'bg-gradient-to-r from-emerald-600 to-teal-500',
            text: 'text-emerald-600',
            border: 'border-emerald-500/30'
        },
        solutions: {
            primary: '#a855f7',
            secondary: '#9333ea',
            glow: 'rgba(168, 85, 247, 0.6)',
            bgBase: '#faf8ff',
            meshColor1: '#f3e8ff',
            meshColor2: '#faf5ff',
            accent: 'bg-gradient-to-r from-purple-600 to-pink-500',
            text: 'text-purple-600',
            border: 'border-purple-500/30'
        },
        'ai-agents': {
            primary: '#f59e0b',
            secondary: '#d97706',
            glow: 'rgba(245, 158, 11, 0.6)',
            bgBase: '#fffbf0',
            meshColor1: '#fef3c7',
            meshColor2: '#fffbeb',
            accent: 'bg-gradient-to-r from-orange-600 to-amber-500',
            text: 'text-amber-600',
            border: 'border-amber-500/30'
        }
    };
    const theme = themes[topTab] || themes.arkle;

    const [appState, setAppState] = useState<AppState>('home');
    const [promptInput, setPromptInput] = useState('');
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
    const [agentTaskInput, setAgentTaskInput] = useState('');
    const [agentTasks, setAgentTasks] = useState<any[]>([]);
    const [isAgentWorking, setIsAgentWorking] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Onboarding & Discovery
    const [isSetupLocked, setIsSetupLocked] = useState(false);
    const [setupStep, setSetupStep] = useState(0);
    const [magicProgress, setMagicProgress] = useState(0);
    const [isMagicLoading, setIsMagicLoading] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    const [isTrayExpanded, setIsTrayExpanded] = useState(false);
    const [forgeMode, setForgeMode] = useState<'launcher' | 'pure-creation' | 'quick-template' | 'predictive'>('launcher');
    const [forgeStep, setForgeStep] = useState(0);
    const forgeSteps = ["Neural Architecting", "Generating Codebase", "Structuring Database", "Styling UI/UX", "Deploying Prototype"];

    // Forge Workspace State
    const [forgeStatus, setForgeStatus] = useState<'idle' | 'planning' | 'generating' | 'previewing' | 'refining'>('idle');
    const [forgeFiles, setForgeFiles] = useState<{ name: string; path: string; code: string; lang: string; icon: string }[]>([]);
    const [activeForgeFile, setActiveForgeFile] = useState('app/page.tsx');
    const [forgeChat, setForgeChat] = useState<{ role: 'ai' | 'user'; text: string }[]>([]);
    const [forgeChatInput, setForgeChatInput] = useState('');
    const [forgePlan, setForgePlan] = useState<{ name: string; desc: string; pages: string[]; stack: string[] }>({ name: '', desc: '', pages: [], stack: [] });
    const [forgeTerminalLogs, setForgeTerminalLogs] = useState<string[]>([]);
    const [forgeViewMode, setForgeViewMode] = useState<'code' | 'preview' | 'split'>('split');
    const [forgePreviewHtml, setForgePreviewHtml] = useState('');
    const [forgeProjectName, setForgeProjectName] = useState('');
    const [forgeSaved, setForgeSaved] = useState(false);
    const [forgeVoiceActive, setForgeVoiceActive] = useState(false);
    const [showProjectLibrary, setShowProjectLibrary] = useState(false);
    const [selectedAIModel, setSelectedAIModel] = useState<'gemini' | 'gpt4' | 'claude' | 'dummy'>('dummy');
    const [forgeSplitPercent, setForgeSplitPercent] = useState(50);
    const [forgeChatWidth, setForgeChatWidth] = useState(380);
    const [isResizingForge, setIsResizingForge] = useState(false);
    const [isResizingChat, setIsResizingChat] = useState(false);
    const [showIdeHeader, setShowIdeHeader] = useState(true);
    const forgeEndRef = useRef<HTMLDivElement>(null);
    const forgeIframeRef = useRef<HTMLIFrameElement>(null);
    const forgeVoiceRef = useRef<any>(null);

    /* ── RE-SIZE LOGIC FOR FORGE IDE ── */
    useEffect(() => {
        const handleForgeResize = (e: MouseEvent) => {
            if (isResizingForge) {
                const newPercent = (e.clientX - forgeChatWidth) / (window.innerWidth - forgeChatWidth) * 100;
                if (newPercent > 10 && newPercent < 90) setForgeSplitPercent(newPercent);
            }
            if (isResizingChat) {
                const newWidth = e.clientX;
                if (newWidth > 200 && newWidth < 800) setForgeChatWidth(newWidth);
            }
        };

        const stopForgeResize = () => {
            setIsResizingForge(false);
            setIsResizingChat(false);
        };

        if (isResizingForge || isResizingChat) {
            window.addEventListener('mousemove', handleForgeResize);
            window.addEventListener('mouseup', stopForgeResize);
        }

        return () => {
            window.removeEventListener('mousemove', handleForgeResize);
            window.removeEventListener('mouseup', stopForgeResize);
        };
    }, [isResizingForge, isResizingChat, forgeChatWidth]);

    // Sticker Animations
    const [toolIndex, setToolIndex] = useState(0);
    const toolWords = ["app", "tool", "Automation", "solution"];

    useEffect(() => {
        const interval = setInterval(() => {
            setToolIndex((prev) => (prev + 1) % toolWords.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Business context collected from Co-Founder discussion
    const [bizCtx, setBizCtx] = useState<BusinessContext>({
        businessName: '', idea: '', stage: '', type: '',
        industry: '', techLevel: '', brandVoice: '', designTaste: '', struggles: '',
        colors: [], fonts: '', audience: '', model: '', usp: '', commitment: '', services: []
    });

    const [showDiscovery, setShowDiscovery] = useState(false);
    const [showVoiceStudio, setShowVoiceStudio] = useState(false);
    const [discoveryStep, setDiscoveryStep] = useState(0);
    const selectedLang = externalLang || 'en-IN';
    const setSelectedLang = onLangChange || (() => { });
    const [isVoiceActive, setIsVoiceActive] = useState(false);

    // Discussion chat
    const [chatThread, setChatThread] = useState<ChatMsg[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [discussStep, setDiscussStep] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [liveTranscript, setLiveTranscript] = useState('');

    // Fetch Existing Profile
    useEffect(() => {
        if (user?.uid) {
            fetch(`/api/business-profile?userId=${user.uid}`)
                .then(r => r.json())
                .then(data => {
                    if (data.profile) {
                        setBizCtx(data.profile);
                        setShowWelcome(false);
                    } else {
                        setShowWelcome(true);
                    }
                });
        }
    }, [user]);

    // Force Onboarding Logic
    useEffect(() => {
        if (!bizCtx.businessName && appState === 'home' && user?.uid) {
            // Check again after fetch
            const timer = setTimeout(() => {
                if (!bizCtx.businessName) setShowWelcome(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [bizCtx.businessName, appState, user]);

    // Solutions chat
    const [solThread, setSolThread] = useState<ChatMsg[]>([]);
    const [solInput, setSolInput] = useState('');
    const [solStep, setSolStep] = useState(0);
    const [solContext, setSolContext] = useState<Record<string, string>>({});

    // Service selection
    const [selectedServices, setSelectedServices] = useState<string[]>(['logo', 'website', 'pitchdeck']);

    // Building & Ready
    const [builtAssets, setBuiltAssets] = useState<BuiltAsset[]>([]);
    const [buildProgress, setBuildProgress] = useState(0);
    const [viewingAsset, setViewingAsset] = useState<BuiltAsset | null>(null);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const solEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);
    const launcherWords = ['Launch', 'Build', 'Grow', 'Scale', 'Fund'];

    useEffect(() => {
        if (topTab === 'co-founder') {
            const interval = setInterval(() => {
                setWordIndex((prev) => (prev + 1) % launcherWords.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [topTab]);

    /* ── Voice Synthesis (Arkle Talking) ──────────────── */
    const speak = (text: string, langOverride?: string) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);

        // Dynamic Voice Selection
        const voices = window.speechSynthesis.getVoices();
        const targetLang = langOverride || selectedLang;

        const preferredVoice = voices.find(v => v.lang.startsWith(targetLang) && v.name.includes('Neural')) ||
            voices.find(v => v.lang.startsWith(targetLang)) ||
            voices.find(v => v.lang.startsWith('en-IN'));

        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.lang = targetLang;
        window.speechSynthesis.speak(utterance);
    };

    // Auto-speak new AI messages
    useEffect(() => {
        if (appState === 'discuss' && chatThread.length > 0) {
            const lastMsg = chatThread[chatThread.length - 1];
            if (lastMsg.role === 'ai') speak(lastMsg.text);
        } else if (appState === 'solutions-chat' && solThread.length > 0) {
            const lastMsg = solThread[solThread.length - 1];
            if (lastMsg.role === 'ai') speak(lastMsg.text);
        }
    }, [chatThread, solThread, appState]);

    /* ── Voice Recognition Setup ──────────────────────── */
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = true;
                recognition.lang = selectedLang; // Dynamic language support

                recognition.onresult = (event: any) => {
                    let transcript = '';
                    let isFinal = false;
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        transcript += event.results[i][0].transcript;
                        if (event.results[i].isFinal) isFinal = true;
                    }

                    setLiveTranscript(transcript);

                    // Auto-fill inputs
                    if (appState === 'home') setPromptInput(transcript);
                    else if (appState === 'discuss') setChatInput(transcript);
                    else if (appState === 'solutions-chat') setSolInput(transcript);
                    else if (appState === 'agent-workspace') setAgentTaskInput(transcript);

                    if (isFinal) {
                        setLiveTranscript('');
                        setIsRecording(false);
                        // For discovery modal, we handle it specially
                        setTimeout(() => {
                            if (appState === 'discuss') handleDiscussSubmit();
                            else if (appState === 'solutions-chat') handleSolSubmit();
                            else if (appState === 'agent-workspace') {
                                handleAgentTaskSubmit(transcript);
                            }
                        }, 500);
                    }
                };

                recognition.onerror = () => { setIsRecording(false); setLiveTranscript(''); };
                recognition.onend = () => { if (isVoiceActive && !showDiscovery) setIsRecording(false); };
                recognitionRef.current = recognition;
            }
        }
    }, [appState, selectedLang, showDiscovery]); // Re-init on language change

    const toggleVoice = () => {
        if (!recognitionRef.current) return alert("Your browser doesn't support live voice.");
        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
            setLiveTranscript(''); // Clear transcript on stop
        } else {
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    /* ── Auto-scroll ───────────────────────────────────── */
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatThread, isTyping]);

    useEffect(() => {
        solEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [solThread]);

    /* ── Co-Founder Discussion Logic ──────────────────── */
    const startDiscussion = () => {
        setAppState('discuss');
        setDiscussStep(0);
        setChatThread([
            { role: 'ai', text: `Hey ${firstName}! I'm your AI Co-Founder. Let me know how I can help with your strategy or current challenges. 🚀`, ts: Date.now() },
            { role: 'ai', text: "What's on your mind regarding your startup?", ts: Date.now() + 100 },
        ]);
    };

    const handleDiscussSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const input = chatInput.trim();
        if (!input) return;

        setChatThread(prev => [...prev, { role: 'user', text: input, ts: Date.now() }]);
        setChatInput('');
        setIsTyping(true);

        const aiResponse = await callAI(input, `Industry: ${bizCtx.industry}, Stage: ${bizCtx.stage}`);
        if (aiResponse) {
            setChatThread(prev => [...prev, { role: 'ai', text: aiResponse, ts: Date.now() }]);
        }
        setIsTyping(false);
    };

    const callAI = useCallback(async (message: string, context: string = '') => {
        try {
            const res = await fetch('/api/ai-cofounder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    businessProfile: data,
                    conversationHistory: chatThread.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })),
                    mode: 'deep',
                    chatName: 'LaunchPad Discussion',
                    // Use latest model if configured, e.g., 'gemini-pro'
                    model: process.env.NEXT_PUBLIC_AI_MODEL || 'gpt-3.5-turbo',
                }),
            });
            const json = await res.json();
            return json.response || json.error || "I'm processing your request...";
        } catch {
            return null; // Fallback to scripted flow
        }
    }, [chatThread, data]);


    const WelcomeModal = () => {
        if (!showWelcome || isSetupLocked) return null;
        return (
            <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-6 animate-in fade-in duration-1000">
                <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden p-12 text-center relative border border-white/20">
                    <div className="w-24 h-24 bg-gradient-to-tr from-sky-600 to-blue-700 rounded-[32px] mx-auto mb-10 flex items-center justify-center shadow-2xl shadow-sky-500/30">
                        <span className="material-symbols-outlined text-white text-[48px] animate-pulse">psychology</span>
                    </div>

                    <h1 className="text-[42px] font-medium text-slate-900 mb-4 leading-tight tracking-tight">Hi {firstName},</h1>
                    <p className="text-[20px] text-slate-500 mb-12 leading-relaxed">Let's build your entire startup in minutes. Just answer a few questions to sync your business brain.</p>

                    <button
                        onClick={() => {
                            setIsSetupLocked(true);
                            setShowWelcome(false);
                        }}
                        className="w-full py-6 bg-slate-900 text-white rounded-[32px] text-[18px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3"
                    >
                        Begin Startup Journey
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                </div>
            </div>
        );
    };

    const DiscoveryWizard = () => {
        if (!isSetupLocked) return null;
        const steps = [
            { key: 'stage', q: "What's your business stage?", options: ['Idea Phase', 'MVP Ready', 'Launched', 'Scaling'] },
            { key: 'size', q: "What's your team size?", options: ['Solo Founder', '2-5 People', '10+ Team', 'Enterprise'] },
            { key: 'type', q: "Are you building a...", options: ['Product', 'Service', 'Manufacturing', 'Marketplace'] },
            { key: 'industry', q: "Which industry are you in?", options: ['Tech & SaaS', 'Retail & D2C', 'Healthcare', 'Fintech', 'Other'] }
        ];

        const current = steps[setupStep];

        return (
            <div className="fixed inset-0 z-[180] bg-white flex flex-col items-center justify-center p-8 animate-in slide-in-from-bottom-10 duration-700">
                <div className="w-full max-w-2xl">
                    <div className="flex items-center justify-between mb-12">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Step {setupStep + 1} of {steps.length + 1}</span>
                        <div className="flex gap-1">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div key={i} className={`w-8 h-1 rounded-full ${i <= setupStep ? 'bg-sky-500' : 'bg-slate-100'}`}></div>
                            ))}
                        </div>
                    </div>

                    <h1 className="text-[36px] font-medium text-slate-900 leading-tight mb-10">{current?.q || "Tell me more about your startup"}</h1>

                    {setupStep < steps.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {current.options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        setBizCtx(prev => ({ ...prev, [current.key]: opt }));
                                        setSetupStep(prev => prev + 1);
                                    }}
                                    className="px-8 py-5 border-2 border-slate-50 bg-slate-50/50 hover:border-sky-500 hover:bg-white rounded-3xl text-left transition-all group"
                                >
                                    <span className="text-[18px] font-bold text-slate-800 group-hover:text-sky-600">{opt}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <textarea
                                className="w-full h-40 p-8 bg-slate-50 border-2 border-slate-50 rounded-[32px] outline-none focus:border-sky-500 transition-all text-[18px] font-medium"
                                placeholder="Describe your vision, goals, and what you want Arkle to build..."
                                value={bizCtx.idea}
                                onChange={(e) => setBizCtx(prev => ({ ...prev, idea: e.target.value }))}
                            />
                            <button
                                onClick={() => {
                                    setIsMagicLoading(true);
                                    let p = 0;
                                    const t = setInterval(() => {
                                        p += 1;
                                        setMagicProgress(p);
                                        if (p >= 100) {
                                            clearInterval(t);
                                            setIsSetupLocked(false);
                                            setIsMagicLoading(false);
                                            setAppState('home');
                                            speak(`Welcome, Founder. Your business brain is now synchronized. Let's build.`);
                                        }
                                    }, 40);
                                }}
                                className="w-full py-6 bg-slate-900 text-white rounded-[32px] text-[18px] font-black uppercase tracking-widest hover:scale-[0.98] transition-all shadow-2xl"
                            >
                                Finalize Brain Setup
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const MagicLoading = () => {
        if (!isMagicLoading) return null;
        return (
            <div className="fixed inset-0 z-[200] bg-slate-900 flex flex-col items-center justify-center p-8 animate-in fade-in duration-1000">
                <div className="w-full max-w-lg text-center">
                    <div className="relative w-48 h-48 mx-auto mb-12">
                        <div className="absolute inset-0 border-8 border-white/5 rounded-full"></div>
                        <div className="absolute inset-0 border-8 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-4 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-xl">
                            <span className="material-symbols-outlined text-white text-[64px] animate-pulse">psychology</span>
                        </div>
                    </div>

                    <h2 className="text-white text-[28px] font-black uppercase tracking-tighter mb-4">Arkle is Building...</h2>
                    <p className="text-sky-300/60 text-[14px] uppercase tracking-[0.3em] mb-12">Generating Your Startup Ecosystem</p>

                    <div className="grid grid-cols-2 gap-4 text-left">
                        {[
                            { label: 'Neural Logo', delay: 5 },
                            { label: 'Responsive Website', delay: 15 },
                            { label: 'E-commerce Store', delay: 25 },
                            { label: 'Page Content', delay: 35 },
                            { label: 'Product Images', delay: 45 },
                            { label: 'SEO Optimization', delay: 55 },
                            { label: 'Brochure Design', delay: 65 },
                            { label: 'Digital Cards', delay: 75 },
                            { label: 'Pitch Deck AI', delay: 85 },
                            { label: 'Legal Drafting', delay: 95 }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 transition-all duration-300">
                                <span className={`material-symbols-outlined text-[18px] ${magicProgress > item.delay ? 'text-emerald-500' : 'text-white/20'}`}>
                                    {magicProgress > item.delay ? 'check_circle' : 'pending'}
                                </span>
                                <span className="text-white/40 text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    /* ── Solutions Discussion Logic ────────────────────── */
    const startSolutionsChat = () => {
        setAppState('solutions-chat');
        setSolStep(0);
        setSolThread([
            { role: 'ai', text: `Hey ${firstName}, welcome to Solutions Lab. I'll analyze your business challenges and help you build the right tools. Let's start:`, ts: Date.now() },
            { role: 'ai', text: SOLUTIONS_FLOW[0].q, ts: Date.now() + 100 },
        ]);
    };

    const handleSolSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const input = solInput.trim();
        if (!input) return;

        setSolThread(prev => [...prev, { role: 'user', text: input, ts: Date.now() }]);
        setSolInput('');

        const currentKey = SOLUTIONS_FLOW[solStep]?.key;
        if (currentKey) {
            setSolContext(prev => ({ ...prev, [currentKey]: input }));
        }

        const nextStep = solStep + 1;

        setTimeout(async () => {
            if (nextStep < SOLUTIONS_FLOW.length - 1) {
                setSolThread(prev => [...prev, { role: 'ai', text: SOLUTIONS_FLOW[nextStep].q, ts: Date.now() }]);
                setSolStep(nextStep);
            } else {
                // Final recommendation
                const recommendation = `Based on your analysis:\n\n**Problem**: ${solContext.problem || input}\n**Gap**: ${solContext.gaps || 'Manual processes'}\n\nI recommend building:\n\n🛠️ **Custom CRM Dashboard** — Track leads & conversions\n🤖 **AI Automation Agent** — Auto-follow-up sequences\n📊 **Performance Tracker** — Real-time business analytics\n\nShall I start building these solutions for you?`;

                setSolThread(prev => [...prev, { role: 'ai', text: recommendation, ts: Date.now() }]);
                setSolStep(nextStep);
            }
        }, 800);
    };

    /* ── Building Engine ──────────────────────────────── */
    const startBuilding = async () => {
        setAppState('building');
        setBuildProgress(0);

        const assets: BuiltAsset[] = selectedServices.map(id => {
            const svc = SERVICES.find(s => s.id === id)!;
            return { id: svc.id, label: svc.label, icon: svc.icon, status: 'pending', color: svc.color };
        });

        setBuiltAssets(assets);

        let completed = 0;

        for (let i = 0; i < assets.length; i++) {
            const currentAsset = assets[i];

            // Mark as building
            setBuiltAssets(prev => prev.map(a =>
                a.id === currentAsset.id ? { ...a, status: 'building' } : a
            ));

            try {
                const res = await fetch('/api/generate-asset', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ assetType: currentAsset.id, context: bizCtx })
                });

                const data = await res.json();

                if (data.success && data.result) {
                    setBuiltAssets(prev => prev.map(a =>
                        a.id === currentAsset.id ? { ...a, status: 'done', result: data.result } : a
                    ));
                } else {
                    setBuiltAssets(prev => prev.map(a =>
                        a.id === currentAsset.id ? { ...a, status: 'failed' } : a
                    ));
                }
            } catch (err) {
                setBuiltAssets(prev => prev.map(a =>
                    a.id === currentAsset.id ? { ...a, status: 'failed' } : a
                ));
            }

            completed++;
            setBuildProgress(Math.round((completed / assets.length) * 100));
        }

        setTimeout(() => {
            setAppState('ready');
            const successMsg = selectedLang === 'te-IN' ? "మీ అసెట్స్ అన్నీ సిద్ధమయ్యాయి!" : "All your assets are generated and ready to view!";
            speak(successMsg, selectedLang);
        }, 1000);
    };

    /* ── Direct submit from prompt ────────────────────── */
    const handleDirectSubmit = () => {
        const input = promptInput.trim();
        if (!input) return;

        if (topTab === 'co-founder' || topTab === 'solutions') {
            startForging(input);
            setPromptInput('');
            return;
        } else {
            // Arkle mode — direct build
            startBuilding();
        }
        setPromptInput('');
    };

    /* ── Toggle service selection ──────────────────────── */
    const toggleService = (id: string) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    /* ── Render: Chat thread (Neural Engine Design) ──────────────── */
    const renderChat = (
        thread: ChatMsg[],
        input: string,
        setInput: (v: string) => void,
        onSubmit: (e?: React.FormEvent) => void,
        endRef: React.RefObject<HTMLDivElement | null>,
        title: string
    ) => {

        return (
            <div className="max-w-3xl mx-auto h-full flex flex-col pt-4 px-4 animate-in fade-in duration-700 relative overflow-hidden">
                {/* Atmospheric Mode Glow */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full h-64 blur-[120px] pointer-events-none opacity-40 transition-all duration-1000" style={{ backgroundColor: theme.primary }}></div>

                {/* Neural Grid Background (Tinted) */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none transition-all duration-1000"
                    style={{
                        backgroundImage: `radial-gradient(${theme.primary} 1px, transparent 0)`,
                        backgroundSize: '24px 24px'
                    }}></div>

                {/* Advanced Header */}
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100/50 relative z-10">
                    <button onClick={() => setAppState('home')} className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:shadow-xl hover:scale-105 transition-all">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </button>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">{title}</h2>
                            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[9px] font-black text-slate-500 uppercase">Secure</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.primary, boxShadow: `0 0 8px ${theme.primary}` }}></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Neural Link Established</span>
                        </div>
                    </div>
                </div>

                {/* Intelligent Message Thread */}
                <div className="flex-1 overflow-y-auto pb-6 space-y-6 custom-scrollbar px-2 relative z-10">
                    {thread.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                            {msg.role === 'ai' && (
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white mr-3 mt-1 shadow-lg shrink-0 scale-90" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
                                    <span className="material-symbols-outlined text-[18px]">neurology</span>
                                </div>
                            )}
                            <div className={`max-w-[85%] px-5 py-4 rounded-2xl text-[14px] leading-relaxed transition-all shadow-sm ${msg.role === 'user'
                                ? 'bg-slate-900 text-white rounded-tr-none font-medium'
                                : 'bg-white/70 backdrop-blur-md border border-slate-100 text-slate-800 rounded-tl-none font-medium'
                                }`}
                                style={{ borderLeft: msg.role === 'ai' ? `3px solid ${theme.primary}44` : undefined }}
                            >
                                {msg.text}
                                {msg.role === 'ai' && (
                                    <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between opacity-40">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px]" style={{ color: theme.primary }}>verified</span>
                                            <span className="text-[9px] font-black uppercase tracking-widest">Neural Verified</span>
                                        </div>
                                        <span className="text-[9px] font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex items-center gap-3 ml-2 animate-pulse">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
                                <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                            </div>
                            <div className="px-4 py-2 bg-white/50 backdrop-blur-sm border border-slate-100 rounded-xl">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: theme.primary }}></div>
                                    <div className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.2s]" style={{ backgroundColor: theme.primary }}></div>
                                    <div className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.4s]" style={{ backgroundColor: theme.primary }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={endRef} />
                </div>

                {/* Universal Prompt Box Input Area */}
                <div className="pb-8 pt-2 relative z-10 w-full px-4 max-w-4xl mx-auto">
                    <form onSubmit={onSubmit} className="relative group bg-white/95 border border-slate-200/50 backdrop-blur-2xl rounded-[48px] shadow-2xl focus-within:border-blue-500/30 transition-all duration-500">
                        <textarea
                            value={isRecording && (appState === 'discuss' || appState === 'solutions-chat') && liveTranscript ? liveTranscript : input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything..."
                            className="w-full bg-transparent border-none outline-none text-[18px] font-medium text-slate-700 placeholder-slate-400 px-8 pt-4 pb-6 resize-none no-scrollbar"
                            rows={2}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'inherit';
                                target.style.height = `${target.scrollHeight}px`;
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    onSubmit();
                                }
                            }}
                        />

                        {/* Universal Task Bar */}
                        <div className="flex items-center justify-between px-6 pb-2">
                            <div className="flex items-center gap-3">
                                <button type="button" title="Upload / Add File" className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                                    <span className="material-symbols-outlined text-[24px]">add_circle</span>
                                </button>
                                <select
                                    value={selectedAIModel}
                                    onChange={(e) => setSelectedAIModel(e.target.value as any)}
                                    className="bg-transparent border border-slate-200/60 rounded-lg px-2.5 py-1 text-slate-600 text-[11px] font-semibold tracking-tight outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                                    title="Select AI Model"
                                >
                                    <option value="dummy">Dummy Model</option>
                                    <option value="gemini">Gemini 1.5 Pro</option>
                                    <option value="gemini-flash">Gemini 1.5 Flash</option>
                                    <option value="gpt4o">GPT-4o</option>
                                    <option value="gpt4-turbo">GPT-4 Turbo</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-1">
                                <button type="button" onClick={toggleVoice} title="Voice Typing (Dictation)" className={`w-10 h-10 flex items-center justify-center transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-500 hover:text-slate-700'}`}>
                                    <span className="material-symbols-outlined text-[24px]">mic</span>
                                </button>
                                <button type="button" onClick={() => setShowVoiceStudio(true)} title="Live Voice Mode" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors mx-1">
                                    <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
                                </button>
                                <button type="button" onClick={(e) => { e.preventDefault(); onSubmit(); }} title="Send (Enter)" className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors">
                                    <span className="material-symbols-outlined text-[24px]">send</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    /* ── Render: Tool Lab (Modern Solutions) ───────────── */
    const renderToolLabUI = () => {
        return (
            <div className="flex flex-col items-center text-center max-w-6xl mx-auto py-20 px-8 relative z-10">
                <div className="mb-8 scale-110">
                    <span className={`px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-[0.3em] border transition-all duration-500 bg-white/5 border-white/10`} style={{ color: theme.primary, boxShadow: `0 0 30px ${theme.glow}` }}>
                        System Architect Active
                    </span>
                </div>

                <h1 className="text-[64px] font-black text-slate-900 mb-6 leading-[0.95] uppercase tracking-tighter">
                    Hi {firstName}, <br />
                    <span className="text-slate-400">Forge Your</span> <span style={{ color: theme.primary, textShadow: `0 0 20px ${theme.glow}` }} className={`italic`}>Solution</span>
                </h1>

                <p className="text-slate-500 text-[18px] max-w-2xl mx-auto mb-16 font-medium leading-relaxed opacity-80">
                    Translate your vision into high-performance autonomous tools. <br />
                    <span className="text-slate-400 text-[13px] font-black uppercase tracking-widest mt-4 block">Arkle Pure Creation Engine v2.4</span>
                </p>

                {/* Build from Idea Card */}
                <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-[80px] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.1)] p-24 flex flex-col items-center relative overflow-hidden group backdrop-blur-3xl ring-1 ring-white/5">
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"></div>
                    <div
                        className="absolute -top-40 -left-40 w-[500px] h-[500px] blur-[150px] rounded-full transition-all duration-1000 group-hover:scale-125"
                        style={{ backgroundColor: `${theme.primary}10` }}
                    ></div>

                    <div className={`w-28 h-28 rounded-[40px] bg-slate-50 border border-slate-100 flex items-center justify-center mb-12 shadow-sm relative z-10 group-hover:rotate-[10deg] transition-all duration-500`}>
                        <span className={`material-symbols-outlined text-[56px]`} style={{ color: theme.primary }}>architecture</span>
                    </div>

                    <h2 className="text-[72px] font-black text-slate-900 mb-8 tracking-tighter leading-none relative z-10">
                        Build from <span style={{ color: theme.primary, textShadow: `0 0 20px ${theme.glow}` }} className="italic">Idea.</span>
                    </h2>

                    <p className="text-[22px] text-slate-500 mb-16 max-w-2xl leading-relaxed font-bold relative z-10 opacity-90">
                        Zero templates. Pure neural generation. <br />
                        <span className="text-slate-400 text-[11px] uppercase tracking-[0.4em] font-black mt-4 block">Initialization ready for uplink</span>
                    </p>

                    <button
                        onClick={() => setAppState('discuss')}
                        className="group relative px-20 py-8 text-white rounded-[40px] font-black uppercase tracking-[0.2em] text-[16px] hover:scale-105 transition-all active:scale-95 z-10 overflow-hidden shadow-2xl"
                        style={{ backgroundColor: theme.primary, boxShadow: `0 30px 60px ${theme.glow}` }}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        <span className="relative z-10 flex items-center gap-4">
                            Initialize Forge
                            <span className="material-symbols-outlined">bolt</span>
                        </span>
                    </button>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20 w-full text-left relative z-10">
                    <div className="p-12 bg-white/[0.02] border border-white/10 rounded-[60px] shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all relative overflow-hidden group backdrop-blur-3xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[40px] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-all duration-1000"></div>
                        <h3 className="text-2xl font-black mb-6 uppercase tracking-tight flex items-center gap-4 text-white">
                            <span className="material-symbols-outlined text-[32px]" style={{ color: theme.primary }}>hub</span>
                            Connect Stack
                        </h3>
                        <p className="text-slate-500 text-sm mb-10 leading-relaxed font-bold">Link your critical startup tools to Arkle's neural orchestration engine.</p>
                        <div className="flex gap-6">
                            {['Stripe', 'Gmail', 'Twilio'].map(s => (
                                <div key={s} className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 hover:border-orange-500 transition-all cursor-pointer shadow-inner group/icon">
                                    <span className="material-symbols-outlined text-orange-500 text-[24px] group-hover/icon:scale-125 transition-transform">bolt</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-12 bg-slate-900/50 border border-white/5 rounded-[60px] shadow-2xl relative overflow-hidden group backdrop-blur-3xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-all duration-1000"></div>
                        <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight flex items-center gap-4">
                            <span className="material-symbols-outlined text-[32px]" style={{ color: theme.primary }}>grid_view</span>
                            Hive Blueprints
                        </h3>
                        <p className="text-slate-400 text-sm mb-10 leading-relaxed font-bold">Import battle-tested operational blueprints from other successful founders.</p>
                        <button className="flex items-center gap-4 text-white text-[12px] font-black uppercase tracking-widest bg-white/10 px-8 py-4 rounded-2xl hover:bg-white/20 transition-all border border-white/10 active:scale-95 shadow-xl">
                            <span className="material-symbols-outlined text-[20px]">explore</span>
                            Browse Marketplace
                        </button>
                    </div>
                </div>
            </div>
        );
    };


    /* ── Forge Engine: Start Building from Idea ──────── */
    const startForging = async (idea?: string) => {
        const userIdea = idea || promptInput.trim();
        if (!userIdea) return;

        setForgeMode('pure-creation');
        setForgeStatus('generating');
        setForgeStep(0);
        setForgeFiles([]);
        setForgePreviewHtml('');
        setForgeViewMode('split');
        const addLog = (msg: string) => setForgeTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
        setForgeTerminalLogs([`[${new Date().toLocaleTimeString()}] FORGE_INIT: Starting Pure Creation Engine...`]);
        setForgeChat([{ role: 'user', text: userIdea }, { role: 'ai', text: `⚡ Building your app now...\n\nAnalyzing: "${userIdea}"\nConnecting to Neural Code Engine...` }]);
        setPromptInput('');

        addLog(`BRAIN_SYNC: Industry=${bizCtx.industry || 'General'}, Stage=${bizCtx.stage || 'MVP'}`);
        addLog('CODEGEN: Sending to AI Code Engine (Gemini Pro)...');

        try {
            const res = await fetch('/api/forge/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: userIdea,
                    mode: 'generate',
                    model: selectedAIModel,
                    businessContext: bizCtx,
                    projectType: 'webapp',
                }),
            });

            const data = await res.json();

            if (data.success && data.files && data.files.length > 0) {
                addLog(`CODEGEN: Received ${data.files.length} files from AI ✓`);

                // Animate file arrival
                data.files.forEach((file: any, i: number) => {
                    setTimeout(() => {
                        setForgeFiles(prev => [...prev, {
                            name: file.name,
                            path: file.path,
                            code: file.code,
                            lang: file.lang || 'html',
                            icon: file.lang === 'html' ? 'code' : file.lang === 'css' ? 'palette' : file.lang === 'javascript' || file.lang === 'js' ? 'javascript' : 'description'
                        }]);
                        setActiveForgeFile(file.path);
                        addLog(`WRITE: ${file.path} (${file.code.length} bytes) ✓`);

                        if (i === data.files.length - 1) {
                            // All files loaded — assemble preview
                            assemblePreview(data.files);
                            setForgeStatus('previewing');
                            setForgeStep(3);
                            addLog('BUILD: Compilation successful ✓');
                            addLog('PREVIEW: Live preview rendered ✓');
                            setForgeChat(prev => [...prev, {
                                role: 'ai',
                                text: `🚀 **Your app is live!**\n\n${data.plan?.desc || ''}\n\nI've generated **${data.files.length} files** with a complete, working interface.\n\n**Features:**\n${(data.plan?.features || []).map((f: string) => `• ${f}`).join('\n')}\n\nYou can:\n• View the **live preview** on the right\n• Edit code in the **editor**\n• Ask me to **refine** anything\n• **Download** the complete project`
                            }]);
                        }
                    }, i * 800);
                });
            } else {
                addLog(`CODEGEN_ERR: ${data.error || 'No files generated'}`);
                setForgeStatus('previewing');
                setForgeChat(prev => [...prev, { role: 'ai', text: `⚠️ I had trouble generating the full project. ${data.error || 'Please try rephrasing your request.'}\n\nTry being more specific about what you want to build.` }]);
            }
        } catch (err: any) {
            addLog(`NETWORK_ERR: ${err.message}`);
            setForgeStatus('previewing');
            setForgeChat(prev => [...prev, { role: 'ai', text: `⚠️ Connection error: ${err.message}\n\nPlease check your network and try again.` }]);
        }
    };

    // Assemble preview HTML from generated files
    const assemblePreview = (files: any[]) => {
        const htmlFile = files.find((f: any) => f.name?.endsWith('.html') || f.path?.endsWith('.html'));
        if (htmlFile) {
            // Find CSS and JS files to inject if not already inline
            let html = htmlFile.code;
            const cssFile = files.find((f: any) => f.lang === 'css' || f.name?.endsWith('.css'));
            const jsFile = files.find((f: any) => f.lang === 'javascript' || f.lang === 'js' || f.name?.endsWith('.js'));

            // Inject CSS if not already in the HTML
            if (cssFile && !html.includes(cssFile.code.slice(0, 50))) {
                html = html.replace('</head>', `<style>\n${cssFile.code}\n</style>\n</head>`);
            }
            // Inject JS if not already in the HTML
            if (jsFile && !html.includes(jsFile.code.slice(0, 50))) {
                html = html.replace('</body>', `<script>\n${jsFile.code}\n</script>\n</body>`);
            }
            setForgePreviewHtml(html);
        } else {
            // If no HTML file, create a wrapper
            const allCode = files.map((f: any) => `<!-- ${f.path} -->\n${f.code}`).join('\n\n');
            setForgePreviewHtml(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Preview</title></head><body><pre style="padding:20px;font-family:monospace;white-space:pre-wrap;">${allCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre></body></html>`);
        }
    };

    const handleForgeChatSubmit = async (msg?: string) => {
        const input = msg || forgeChatInput.trim();
        if (!input) return;

        setForgeChat(prev => [...prev, { role: 'user', text: input }]);
        setForgeChatInput('');

        const addLog = (msg: string) => setForgeTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

        if (forgeFiles.length === 0) {
            // No files yet — treat as a new build request
            startForging(input);
            return;
        }

        // Refinement mode — send existing files + refinement prompt to AI
        setForgeStatus('refining');
        setForgeChat(prev => [...prev, { role: 'ai', text: `🔧 Refining your app...\n\nProcessing: "${input}"` }]);
        addLog(`REFINE: Processing "${input.slice(0, 40)}..."`);

        try {
            const res = await fetch('/api/forge/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: input,
                    mode: 'refine',
                    model: selectedAIModel,
                    existingFiles: forgeFiles,
                    businessContext: bizCtx,
                }),
            });

            const data = await res.json();

            if (data.success && data.files && data.files.length > 0) {
                addLog(`REFINE: Received ${data.files.length} updated files ✓`);

                // Update existing files or add new ones
                setForgeFiles(prev => {
                    const updated = [...prev];
                    data.files.forEach((newFile: any) => {
                        const existingIdx = updated.findIndex(f => f.path === newFile.path || f.name === newFile.name);
                        const fileObj = {
                            name: newFile.name,
                            path: newFile.path,
                            code: newFile.code,
                            lang: newFile.lang || 'html',
                            icon: newFile.lang === 'html' ? 'code' : newFile.lang === 'css' ? 'palette' : 'javascript'
                        };
                        if (existingIdx >= 0) {
                            updated[existingIdx] = fileObj;
                            addLog(`UPDATE: ${newFile.path} ✓`);
                        } else {
                            updated.push(fileObj);
                            addLog(`NEW_FILE: ${newFile.path} ✓`);
                        }
                    });
                    // Reassemble preview with updated files
                    setTimeout(() => assemblePreview(updated), 100);
                    return updated;
                });

                setForgeStatus('previewing');
                addLog('BUILD: Recompilation successful ✓');
                setForgeChat(prev => [...prev, { role: 'ai', text: `✅ **Done!** I've updated your app.\n\n${data.plan?.desc || 'Changes applied successfully.'}\n\nCheck the live preview to see the changes. Want to refine further?` }]);
            } else {
                // Fallback to chat-only response
                const chatResponse = await callAI(
                    `The user wants to modify their app. Request: "${input}". Describe what changes you would make in 2-3 sentences.`,
                    'forge-refine'
                );
                setForgeChat(prev => [...prev, { role: 'ai', text: chatResponse || "I understand your request. Let me work on those changes..." }]);
                setForgeStatus('previewing');
            }
        } catch (err: any) {
            addLog(`REFINE_ERR: ${err.message}`);
            setForgeStatus('previewing');
            setForgeChat(prev => [...prev, { role: 'ai', text: `⚠️ Refinement error. Please try again.` }]);
        }
    };

    // Download project as HTML file
    const downloadForgeProject = () => {
        if (forgeFiles.length === 0) return;

        // For a single-page app, download the assembled HTML
        const htmlContent = forgePreviewHtml || forgeFiles[0]?.code || '';
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${forgePlan.name || 'arkle-app'}.html`.replace(/\s+/g, '-').toLowerCase();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setForgeTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] EXPORT: Project downloaded ✓`]);
    };

    // Save project to localStorage
    const saveForgeProject = (files = forgeFiles, name = forgeProjectName) => {
        if (files.length === 0) return;
        const project = { name: name || 'Untitled', files, plan: forgePlan, savedAt: Date.now() };
        const key = `forge_project_${Date.now()}`;
        const existing = JSON.parse(localStorage.getItem('forge_projects') || '[]');
        // Keep last 10 projects
        const updated = [{ key, ...project }, ...existing].slice(0, 10);
        localStorage.setItem('forge_projects', JSON.stringify(updated));
        localStorage.setItem('forge_current', JSON.stringify(project));
        setForgeSaved(true);
        setForgeTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] SAVE: Project "${project.name}" saved locally ✓`]);
        setTimeout(() => setForgeSaved(false), 2000);
    };

    // Update a single file's code and sync preview
    const updateForgeFileCode = (path: string, newCode: string) => {
        setForgeFiles(prev => {
            const updated = prev.map(f => f.path === path ? { ...f, code: newCode } : f);
            // Live preview sync
            setTimeout(() => assemblePreview(updated), 300);
            return updated;
        });
    };

    // Start voice in forge chat
    const toggleForgeVoice = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Voice not supported in this browser. Try Chrome.');
            return;
        }
        if (forgeVoiceActive) {
            forgeVoiceRef.current?.stop();
            setForgeVoiceActive(false);
            return;
        }
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const rec = new SR();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = 'en-IN';
        rec.onresult = (e: any) => {
            const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join('');
            setForgeChatInput(transcript);
        };
        rec.onend = () => setForgeVoiceActive(false);
        rec.start();
        forgeVoiceRef.current = rec;
        setForgeVoiceActive(true);
    };

    // Reset for a new project without closing IDE
    const startNewForgeProject = () => {
        if (forgeFiles.length > 0) saveForgeProject();
        setForgeFiles([]);
        setForgePreviewHtml('');
        setForgeChat([]);
        setForgeTerminalLogs([`[${new Date().toLocaleTimeString()}] FORGE_RESET: Ready for new project`]);
        setForgeStatus('idle');
        setForgeProjectName('');
        setForgePlan({ name: '', desc: '', pages: [], stack: [] });
        setForgeChatInput('');
    };

    /* ── Render: Mode 1 - Pure Creation Forge (Advanced Builder) ── */
    const renderPureCreationForge = () => {
        const currentFile = forgeFiles.find(f => f.path === activeForgeFile) || forgeFiles[0];
        const showCode = forgeViewMode === 'code' || forgeViewMode === 'split';
        const showPreview = forgeViewMode === 'preview' || forgeViewMode === 'split';

        return (
            <div className={`fixed inset-0 z-[999] bg-[#0f0f13] flex animate-in fade-in duration-500 overflow-hidden ${(isResizingForge || isResizingChat) ? 'cursor-col-resize select-none' : ''}`} style={{ fontFamily: '"DM Sans", "Inter", sans-serif' }}>
                {/* LEFT: AGENT CHAT PANEL */}
                <div style={{ width: `${forgeChatWidth}px` }} className="h-full border-r border-white/5 flex flex-col bg-[#16161c] relative shrink-0">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-white/5 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-white uppercase tracking-tighter">Arkle Architect</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Branding</span>
                                        <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest opacity-30">•</span>
                                        <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Tool Hub</span>
                                        <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest opacity-30">•</span>
                                        <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Agents</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => {
                                    const stored = JSON.parse(localStorage.getItem('forge_projects') || '[]');
                                    setSavedProjects(stored);
                                    setShowProjectLibrary(true);
                                }} title="Project Library" className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-[16px]">database</span>
                                </button>
                                <button onClick={startNewForgeProject} title="New Project" className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-[16px]">add</span>
                                </button>
                                <button onClick={() => { setForgeMode('launcher'); setForgeStatus('idle'); }} className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-slate-500 transition-all ml-1">
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                            </div>
                        </div>

                        {/* Project Name Only */}
                        <div className="flex items-center justify-between mt-1">
                            <input value={forgeProjectName} onChange={e => setForgeProjectName(e.target.value)} placeholder="Untitled Project" className="text-[11px] font-bold text-slate-400 bg-transparent border-none outline-none placeholder-slate-600 w-full focus:text-white transition-colors" />
                        </div>
                    </div>

                    {/* Chat Area */}

                    {/* Chat */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {forgeChat.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`max-w-[92%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed break-all ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white/5 border border-white/5 text-slate-300 rounded-tl-sm'
                                    }`}>
                                    <div className="whitespace-pre-wrap">{msg.text}</div>
                                </div>
                            </div>
                        ))}
                        {(forgeStatus === 'generating' || forgeStatus === 'refining') && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-2xl">
                                <div className="flex gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"></div><div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.15s]"></div><div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.3s]"></div></div>
                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{forgeStatus === 'generating' ? 'Building...' : 'Refining...'}</span>
                            </div>
                        )}
                        <div ref={forgeEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t border-white/5 bg-black/20" style={{ height: 'auto' }}>
                        <div className="relative group">
                            <textarea
                                value={forgeChatInput}
                                onChange={(e) => setForgeChatInput(e.target.value)}
                                placeholder={forgeFiles.length === 0 ? "What shall Arkle build for your startup today?" : "I don't just chat, I build. Refine your creation..."}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 pt-4 pb-12 text-[13px] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none transition-all scrollbar-hide"
                                rows={Math.min(6, Math.max(2, forgeChatInput.split('\n').length))}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleForgeChatSubmit(); } }}
                            />
                            {/* UNIVERSAL TASK BAR (Dark Mode Version) */}
                            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <button title="Upload / Add File" className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                                    </button>
                                    <select
                                        value={selectedAIModel}
                                        onChange={(e) => setSelectedAIModel(e.target.value as any)}
                                        className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-slate-300 hover:text-white text-[10px] font-semibold tracking-tight outline-none cursor-pointer hover:bg-white/10 transition-colors"
                                        title="Select AI Model"
                                    >
                                        <option value="dummy">Dummy Model</option>
                                        <option value="gemini">Gemini 1.5 Pro</option>
                                        <option value="gemini-flash">Gemini 1.5 Flash</option>
                                        <option value="gpt4o">GPT-4o</option>
                                        <option value="gpt4-turbo">GPT-4 Turbo</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={toggleForgeVoice} title="Voice Typing (Dictation)" className={`w-7 h-7 flex items-center justify-center transition-colors ${forgeVoiceActive ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-slate-200'}`}>
                                        <span className="material-symbols-outlined text-[18px]">mic</span>
                                    </button>
                                    <button onClick={() => setShowVoiceStudio(true)} title="Live Voice Mode" className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20 transition-colors ml-1">
                                        <span className="material-symbols-outlined text-[16px]">graphic_eq</span>
                                    </button>
                                    <button onClick={() => handleForgeChatSubmit()} disabled={forgeStatus === 'generating' || forgeStatus === 'refining'} title="Send / Enter" className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-colors ml-1 disabled:opacity-40">
                                        <span className="material-symbols-outlined text-[18px]">send</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Status Line */}
                        <div className="flex items-center justify-between mt-2 px-1">
                            <div className="flex gap-1">
                                {['Add Database', 'Mobile View', 'Dark Mode'].map(chip => (
                                    <button key={chip} onClick={() => setForgeChatInput(chip)} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[8px] font-black text-slate-500 uppercase tracking-tighter hover:text-white hover:border-white/20 transition-all">{chip}</button>
                                ))}
                            </div>
                            <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{selectedAIModel.toUpperCase()} CORE 1.0</span>
                        </div>
                    </div>
                </div>

                {/* CHAT RESIZE HANDLE */}
                <div
                    onMouseDown={() => setIsResizingChat(true)}
                    className={`w-1 h-full cursor-col-resize z-[60] hover:bg-blue-500/50 transition-colors bg-white/5`}
                />

                {/* RIGHT: IDE WORKSPACE */}
                <div className="flex-1 flex flex-col bg-[#0f0f13] relative overflow-hidden">
                    {/* Floating Header Toggle Button */}
                    <button
                        onClick={() => setShowIdeHeader(!showIdeHeader)}
                        className={`absolute top-2 right-6 z-[110] w-8 h-8 rounded-full flex items-center justify-center transition-all ${showIdeHeader ? 'text-slate-500 hover:text-white bg-white/5' : 'bg-blue-600 text-white shadow-lg'}`}
                        title={showIdeHeader ? "Hide Header" : "Show Header"}
                    >
                        <span className="material-symbols-outlined text-[18px]">{showIdeHeader ? 'expand_less' : 'expand_more'}</span>
                    </button>

                    {/* IDE Top Bar */}
                    <div className={`border-b border-white/10 flex items-center justify-between px-6 bg-[#1a1a24] shadow-lg relative z-[100] transition-all duration-300 ${showIdeHeader ? 'h-14 opacity-100' : 'h-0 opacity-0 pointer-events-none overflow-hidden'}`}>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 mr-4">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            </div>
                            {/* View Mode Toggle */}
                            {(['code', 'split', 'preview'] as const).map(mode => (
                                <button key={mode} onClick={() => setForgeViewMode(mode)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${forgeViewMode === mode ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                                    <span className="material-symbols-outlined text-[16px] mr-2 align-middle">{mode === 'code' ? 'code' : mode === 'preview' ? 'visibility' : 'vertical_split'}</span>
                                    {mode}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            {forgeFiles.length > 0 && (
                                <>
                                    <button onClick={() => saveForgeProject()} className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${forgeSaved ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'}`}>
                                        <span className="material-symbols-outlined text-[14px]">{forgeSaved ? 'check_circle' : 'save'}</span>
                                        {forgeSaved ? 'Saved!' : 'Save'}
                                    </button>
                                    <button onClick={downloadForgeProject} className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 text-slate-400 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-white/10">
                                        <span className="material-symbols-outlined text-[14px]">download</span> Export
                                    </button>
                                </>
                            )}
                            <div className="h-6 w-[1px] bg-white/10 mx-2"></div>
                            <button onClick={() => { setForgeMode('launcher'); setForgeStatus('idle'); }} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-red-400 transition-all" title="Exit Forge">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>
                    </div>


                    {/* File Tabs */}
                    {forgeFiles.length > 0 && (
                        <div className="h-10 bg-[#1a1a24] border-b border-white/5 flex items-center gap-0 overflow-x-auto no-scrollbar">
                            {forgeFiles.map(file => (
                                <button key={file.path} onClick={() => setActiveForgeFile(file.path)}
                                    className={`h-full px-4 flex items-center gap-2 text-[11px] font-bold border-r border-white/5 transition-all shrink-0 ${activeForgeFile === file.path ? 'bg-[#0f0f13] text-white border-b-2 border-b-blue-500' : 'text-slate-500 hover:text-slate-300 hover:bg-white/3'
                                        }`}>
                                    <span className="material-symbols-outlined text-[14px]">{file.icon || 'description'}</span>
                                    {file.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Main IDE Area: Code + Preview */}
                    <div className="flex-1 flex overflow-hidden relative">
                        {/* Code Editor — Editable */}
                        {showCode && (
                            <div
                                style={{ width: showPreview ? `${forgeSplitPercent}%` : '100%' }}
                                className="bg-[#0d1117] flex flex-col overflow-hidden transition-none"
                            >
                                {currentFile ? (
                                    <div className="flex-1 relative overflow-hidden">
                                        {/* Line numbers overlay */}
                                        <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#0d1117] z-10 pt-4 overflow-hidden pointer-events-none">
                                            {currentFile.code.split('\n').map((_, i) => (
                                                <div key={i} className="text-[12px] text-slate-600 text-right pr-2 leading-[1.7] font-mono opacity-40">{i + 1}</div>
                                            ))}
                                        </div>
                                        {/* Editable textarea */}
                                        <textarea
                                            value={currentFile.code}
                                            onChange={e => updateForgeFileCode(currentFile.path, e.target.value)}
                                            className="absolute inset-0 w-full h-full bg-transparent text-slate-300 font-mono text-[13px] leading-[1.7] resize-none outline-none pl-12 pr-4 pt-4 pb-4 custom-scrollbar selection:bg-blue-500/30 caret-blue-400"
                                            spellCheck={false}
                                            autoComplete="off"
                                            autoCorrect="off"
                                            autoCapitalize="off"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                                        <span className="material-symbols-outlined text-[64px] mb-4 opacity-20">code_blocks</span>
                                        <p className="text-[12px] font-bold uppercase tracking-widest opacity-30">Describe your idea in the chat →</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* DRAG HANDLE */}
                        {showCode && showPreview && (
                            <div
                                onMouseDown={() => setIsResizingForge(true)}
                                className={`w-1 h-full cursor-col-resize z-50 hover:bg-blue-500/50 transition-colors group relative ${isResizingForge ? 'bg-blue-500' : 'bg-white/5'}`}
                            >
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-1 h-4 bg-white/20 rounded-full"></div>
                                </div>
                            </div>
                        )}

                        {/* Live Preview */}
                        {showPreview && (
                            <div
                                style={{ width: showCode ? `${100 - forgeSplitPercent}%` : '100%' }}
                                className="bg-white flex flex-col overflow-hidden transition-none"
                            >
                                <div className="h-8 bg-[#1a1a24] border-b border-white/5 flex items-center px-3 gap-2">
                                    <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500/60"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></div><div className="w-2.5 h-2.5 rounded-full bg-green-500/60"></div></div>
                                    <span className="text-[10px] text-slate-500 font-bold ml-2">Live Preview</span>
                                </div>
                                {forgePreviewHtml ? (
                                    <iframe srcDoc={forgePreviewHtml} className="flex-1 w-full bg-white border-0" sandbox="allow-scripts allow-same-origin" title="App Preview" />
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                                        <span className="material-symbols-outlined text-[48px] mb-3 opacity-30">preview</span>
                                        <p className="text-[11px] font-bold uppercase tracking-widest opacity-50">Preview will appear here</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Terminal */}
                    <div className="h-40 bg-[#010409] border-t border-white/5 flex flex-col">
                        <div className="px-4 py-2 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[14px] text-indigo-400">terminal</span>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Deployment Stream</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[9px] font-bold text-slate-600 uppercase">Port: 3000</span>
                                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest animate-pulse">● System Live</span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[11px] space-y-1.5 custom-scrollbar bg-black/40">
                            {forgeTerminalLogs.map((log, i) => (
                                <div key={i} className="flex gap-3">
                                    <span className="text-slate-700 opacity-50 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                                    <span className={`${log.includes('✓') ? 'text-emerald-400' : log.includes('ERR') ? 'text-rose-400' : log.includes('AGENT') ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
                                        {log.includes('✓') ? '✔ ' : log.includes('ERR') ? '✖ ' : '▶ '}{log.split('] ')[1] || log}
                                    </span>
                                </div>
                            ))}
                            {(forgeStatus === 'generating' || forgeStatus === 'refining') && (
                                <div className="text-indigo-400 animate-pulse flex items-center gap-2">
                                    <span>▶</span>
                                    <span>AGENT: Materializing Neural Assets...</span>
                                    <span className="w-2 h-4 bg-indigo-500 animate-caret"></span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /* ── Render: Legacy Solutions (Keep for Backup) ────── */
    const renderLegacySolutionsUI = () => {
        return (
            <div className="w-full flex flex-col items-center py-20 text-center animate-in fade-in duration-700">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mb-6">
                    <span className="material-symbols-outlined text-[32px]">science</span>
                </div>
                <h3 className="text-[24px] font-bold text-slate-800 mb-2">Build from Scratch</h3>
                <p className="text-slate-500 max-w-md mx-auto">Use the chat below to describe any business tool, automation, or custom engine you need. Arkle will build it purely from your ideas.</p>
            </div>
        );
    };

    /* ── Render: Home ──────────────────────────────────── */
    const renderLauncherUI = () => {
        return (
            <div className="w-full max-w-6xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Horizontal Category Scroller */}
                <div className="mb-12 overflow-visible relative">
                    <div className="flex items-center gap-6 overflow-x-auto pb-6 px-4 no-scrollbar scroll-smooth">
                        {LAUNCHER_CATEGORIES.map((cat) => (
                            <motion.button
                                key={cat.id}
                                whileHover={{ y: -5, scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex flex-col items-center gap-3 group shrink-0"
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.gradient} p-0.5 shadow-lg group-hover:shadow-2xl transition-all duration-300`}>
                                    <div className="w-full h-full bg-white/10 backdrop-blur-md rounded-[14px] flex items-center justify-center text-white">
                                        <span className="material-symbols-outlined text-[32px]">{cat.icon}</span>
                                    </div>
                                </div>
                                <span className="text-[13px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-wider">{cat.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Featured Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4 mb-20 relative z-10">
                    {/* Startup Essentials Card */}
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="group relative bg-white/[0.02] border border-white/10 p-10 rounded-[60px] shadow-2xl overflow-hidden backdrop-blur-3xl"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-all duration-1000" style={{ backgroundColor: theme.primary + '22' }}></div>
                        <h3 className="text-[24px] font-black text-white mb-4 uppercase tracking-tighter">Startup Essentials</h3>
                        <p className="text-slate-500 text-[15px] mb-10 leading-relaxed font-bold">Build the core identity of your brand with AI-powered design tools.</p>
                        <div className="space-y-4">
                            {['Brand Guidelines', 'Business Model', 'Legal Kit'].map(item => (
                                <div key={item} className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group/item">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner" style={{ backgroundColor: theme.primary + '11', color: theme.primary }}>
                                        <span className="material-symbols-outlined text-[20px] group-hover/item:rotate-[15deg] transition-transform">verified</span>
                                    </div>
                                    <span className="text-slate-300 font-black text-[12px] uppercase tracking-widest">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Marketing Suite Card */}
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="group relative bg-white/[0.02] border border-white/10 p-10 rounded-[60px] shadow-2xl overflow-hidden backdrop-blur-3xl"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-all duration-1000" style={{ backgroundColor: theme.primary + '22' }}></div>
                        <h3 className="text-[24px] font-black text-white mb-4 uppercase tracking-tighter">Growth Matrix</h3>
                        <p className="text-slate-500 text-[15px] mb-10 leading-relaxed font-bold">Scale your market presence with automated growth systems.</p>
                        <div className="space-y-4">
                            {['Ad Campaigns', 'SEO Strategy', 'Content Forge'].map(item => (
                                <div key={item} className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group/item">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner" style={{ backgroundColor: theme.primary + '11', color: theme.primary }}>
                                        <span className="material-symbols-outlined text-[20px] group-hover/item:rotate-[15deg] transition-transform">rocket_launch</span>
                                    </div>
                                    <span className="text-slate-300 font-black text-[12px] uppercase tracking-widest">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Growth & Ops Card */}
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="group relative bg-white/[0.02] border border-white/10 p-10 rounded-[60px] shadow-2xl overflow-hidden backdrop-blur-3xl"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-all duration-1000" style={{ backgroundColor: theme.primary + '22' }}></div>
                        <h3 className="text-[24px] font-black text-white mb-4 uppercase tracking-tighter">Scale Forge</h3>
                        <p className="text-slate-500 text-[15px] mb-10 leading-relaxed font-bold">Automate your business operations and revenue streams.</p>
                        <div className="space-y-4">
                            {['Revenue Tracking', 'User Analytics', 'Scaling Ops'].map(item => (
                                <div key={item} className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group/item">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner" style={{ backgroundColor: theme.primary + '11', color: theme.primary }}>
                                        <span className="material-symbols-outlined text-[20px] group-hover/item:rotate-[15deg] transition-transform">trending_up</span>
                                    </div>
                                    <span className="text-slate-300 font-black text-[12px] uppercase tracking-widest">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    };

    const renderHome = () => {
        return (
            <div className="pb-12 flex flex-col items-center min-h-full px-4 animate-in fade-in duration-1000 relative overflow-hidden transition-all duration-1000" 
                 style={{ backgroundColor: theme.bgBase, backgroundImage: `radial-gradient(at 0% 0%, ${theme.meshColor1} 0px, transparent 50%), radial-gradient(at 100% 0%, ${theme.meshColor2} 0px, transparent 50%), radial-gradient(at 50% 50%, ${theme.primary}11 0px, transparent 100%)` }}>

                {/* Atmospheric Mesh Glows */}
                <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[1600px] h-[1000px] pointer-events-none transition-all duration-1000 opacity-70" 
                     style={{ background: `radial-gradient(circle at 50% 35%, ${theme.primary}33 0%, ${theme.meshColor1}22 40%, transparent 70%)` }}></div>
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] blur-[150px] rounded-full pointer-events-none opacity-30 transition-all duration-1000 animate-pulse"
                     style={{ backgroundColor: theme.primary }}></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] blur-[120px] rounded-full pointer-events-none opacity-20 transition-all duration-1000"
                     style={{ backgroundColor: theme.primary }}></div>

                {/* Main Header */}
                <div className="text-center mt-4 mb-8 w-full max-w-5xl px-4 relative z-10">
                    <h1 className="text-[52px] md:text-[64px] font-black text-slate-900 tracking-tighter leading-none mb-4 uppercase">
                        {topTab === 'arkle' ? 'Hi Founder,' : topTab === 'co-founder' ? 'Build Something Big.' : topTab === 'solutions' ? 'Logic Forge.' : 'Hire Your Team.'}
                    </h1>
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <span className="text-[18px] font-bold text-slate-400">Neural Core</span>
                        <span className="px-3 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[12px] font-black uppercase tracking-widest animate-pulse" style={{ backgroundColor: theme.primary + '11', color: theme.primary }}>Active</span>
                    </div>
                </div>

                {/* Central Attached Prompt Box UI */}
                <div className="w-full max-w-[860px] mx-auto relative z-20 mt-16 mb-10">

                    {/* The Main Pill Prompt Box */}
                    <div className="w-full bg-white rounded-[48px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-100 p-2 relative pt-8">

                        {/* --- TOP EMBEDDED COMPONENTS --- */}
                        {/* 1. Mode Selector Pill - EXACT SCREENSHOT MATCH */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 px-4 bg-white/50 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-1.5 rounded-full border border-white/60 z-30 group/modes">

                            {/* Snaking Thread SVG - Subtle & Precise */}
                            <div className="absolute inset-0 pointer-events-none overflow-visible -z-10">
                                <svg width="100%" height="100%" viewBox="0 0 300 60" preserveAspectRatio="none" className="absolute top-1/2 left-[-150px] -translate-y-1/2 w-[600px] h-16 opacity-30">
                                    <path
                                        d="M 0 30 L 120 30 Q 140 30, 155 15 T 185 30 T 215 45 T 245 30 T 275 15 T 305 30 L 450 30"
                                        fill="none"
                                        stroke="#3b82f6"
                                        strokeWidth="1"
                                        strokeDasharray="4 4"
                                        className="animate-thread-flow"
                                    />
                                </svg>
                            </div>

                            {[
                                { id: 'arkle', icon: 'neurology' },
                                { id: 'co-founder', icon: 'rocket_launch' },
                                { id: 'solutions', icon: 'grid_view' },
                                { id: 'ai-agents', icon: 'smart_toy' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setTopTab(tab.id as any)}
                                    className={`flex items-center justify-center w-12 h-12 transition-all duration-500 relative ${topTab === tab.id
                                        ? 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl z-10'
                                        : 'text-slate-300 hover:text-slate-500'
                                        }`}
                                >
                                    <span className={`material-symbols-outlined text-[24px] ${topTab === tab.id ? 'text-blue-600' : ''}`}>
                                        {tab.icon}
                                    </span>
                                    {topTab === tab.id && (
                                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* 2. Paper Rocket (Send) Icon - Screenshot Match */}
                        <div className="absolute top-0 left-1/2 ml-[200px] -translate-y-1/2 z-30 group/rocket">
                            <div className="relative">
                                <span className="material-symbols-outlined text-[22px] text-blue-500/30 -rotate-12 group-hover/rocket:rotate-0 transition-all duration-500 cursor-pointer animate-rocket-hover">send</span>
                            </div>
                        </div>
                        {/* --- END TOP EMBEDDED COMPONENTS --- */}

                        <textarea
                            value={isRecording && (appState === 'home') && liveTranscript ? liveTranscript : promptInput}
                            onChange={(e) => setPromptInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleDirectSubmit(); } }}
                            placeholder="Ask anything..."
                            className="w-full bg-transparent border-none outline-none text-[18px] font-medium text-slate-700 placeholder-slate-400 px-8 pt-3 pb-6 resize-none no-scrollbar"
                            rows={2}
                        />

                        {/* Bottom Task Bar */}
                        <div className="flex items-center justify-between px-6 pb-2">
                            <div className="flex items-center gap-3">
                                <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors" title="Upload / Add File">
                                    <span className="material-symbols-outlined text-[24px]">add_circle</span>
                                </button>
                                <select
                                    value={selectedAIModel}
                                    onChange={(e) => setSelectedAIModel(e.target.value as any)}
                                    className="bg-transparent border border-slate-200/60 rounded-lg px-2.5 py-1 text-slate-600 text-[11px] font-semibold tracking-tight outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                                    title="Select AI Model"
                                >
                                    <option value="dummy">Dummy Model</option>
                                    <option value="gemini">Gemini 1.5 Pro</option>
                                    <option value="gemini-flash">Gemini 1.5 Flash</option>
                                    <option value="gpt4o">GPT-4o</option>
                                    <option value="gpt4-turbo">GPT-4 Turbo</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={toggleVoice} className={`w-10 h-10 flex items-center justify-center transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-500 hover:text-slate-700'}`} title="Voice Typing (Dictation)">
                                    <span className="material-symbols-outlined text-[24px]">mic</span>
                                </button>
                                <button onClick={() => setShowVoiceStudio(true)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors mx-1" title="Live Voice Mode">
                                    <span className="material-symbols-outlined text-[20px]">graphic_eq</span>
                                </button>
                                <button onClick={handleDirectSubmit} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors" title="Send (Enter)">
                                    <span className="material-symbols-outlined text-[24px]">send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub UI for specific modes */}
                <div className="w-full max-w-5xl mx-auto px-4 mt-12 relative z-10">

                    {/* Arkle Mode Quick Tiles */}
                    {topTab === 'arkle' && (
                        <div className="w-full flex justify-center mt-[-16px]">
                            <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 py-4 w-full max-w-[860px] justify-start items-center">
                                {[
                                    { label: 'Growth Gaps', icon: 'auto_awesome' },
                                    { label: 'AI Automation', icon: 'architecture' },
                                    { label: 'Tech Solutions', icon: 'query_stats' },
                                    { label: 'Social Plan', icon: 'rocket_launch' },
                                    { label: 'Market Research', icon: 'manage_search' },
                                    { label: 'Legal Advice', icon: 'gavel' },
                                    { label: 'Brand Identity', icon: 'palette' },
                                    { label: 'Scale Ops', icon: 'domain' }
                                ].map((tile, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPromptInput(tile.label)}
                                        className="flex-shrink-0 flex items-center gap-3 py-2 px-2 w-[175px] rounded-[16px] bg-white/70 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(0,115,234,0.15)] border border-white/80 hover:border-blue-200 transition-all duration-300 hover:-translate-y-1.5 hover:scale-105 hover:bg-white/95 group animate-in slide-in-from-right-8 fade-in fill-mode-both"
                                        style={{ animationDelay: `${i * 100}ms`, animationDuration: '500ms' }}
                                    >
                                        <div className="w-9 h-9 shrink-0 rounded-[10px] flex items-center justify-center bg-blue-50/80 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                            <span className="material-symbols-outlined text-[18px] group-hover:scale-125 transition-transform duration-300">{tile.icon}</span>
                                        </div>
                                        <div className="text-left overflow-hidden">
                                            <span className="text-[13.5px] font-bold text-slate-800 group-hover:text-blue-900 transition-colors tracking-tight truncate block">{tile.label}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Solutions Mode Below Card */}
                    {topTab === 'solutions' && (
                        <div className="max-w-2xl mx-auto bg-white rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-slate-100 p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 mt-8 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-50/30"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                    <span className="material-symbols-outlined text-[28px]">architecture</span>
                                </div>
                                <h2 className="text-[48px] font-black text-[#0f172a] mb-2 tracking-tight italic pr-4">Build from Idea.</h2>
                                <p className="text-[16px] text-slate-500 font-medium">No templates. No presets. Just raw innovation.</p>
                            </div>
                        </div>
                    )}

                    {/* Co-Founder Mode Below Card */}
                    {topTab === 'co-founder' && (
                        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex justify-center gap-5 flex-wrap mb-16">
                                {/* Adding the colorful square icons */}
                                {LAUNCHER_CATEGORIES.slice(0, 8).map(cat => (
                                    <div key={cat.id} className="flex flex-col items-center gap-3 cursor-pointer group">
                                        <div className="w-16 h-16 rounded-[20px] flex items-center justify-center text-white shadow-lg group-hover:-translate-y-2 group-hover:shadow-xl transition-all duration-300" style={{ background: `linear-gradient(135deg, ${cat.color}, ${cat.color}ee)` }}>
                                            <span className="material-symbols-outlined text-[28px]">{cat.icon}</span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{cat.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                                {/* The large cards at bottom of Co-Founder mode */}
                                {['Startup Essentials', 'Marketing Suite', 'Growth Tools'].map((title, i) => (
                                    <div key={i} className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 shadow-sm border border-slate-100 hover:shadow-lg hover:border-purple-100 transition-all cursor-pointer">
                                        <h3 className="text-[20px] font-bold text-slate-900 mb-3">{title}</h3>
                                        <p className="text-[14px] text-slate-500 font-medium leading-relaxed">
                                            {i === 0 ? "Build the core identity of your brand with AI-powered design tools." :
                                                i === 1 ? "Launch high-converting campaigns across all social channels." :
                                                    "Scale your business with automated systems and analytics."}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        );
    };

    /* ── Render: Building ──────────────────────────────── */
    const renderBuilding = () => (
        <div className="flex flex-col items-center justify-center h-full px-4 animate-in zoom-in-95 duration-500">
            <div className="max-w-md w-full text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 border-[3px] border-[#e6e9ef] rounded-full"></div>
                    <div className="absolute inset-0 border-[3px] border-t-[#0073ea] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                        <span className="text-[24px]">🚀</span>
                    </div>
                </div>
                <h2 className="text-[20px] font-medium text-[#323338] mb-1">Building your ecosystem</h2>
                <p className="text-[14px] text-[#676879] mb-8">{buildProgress}% complete</p>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#e6e9ef] rounded-full mb-8 overflow-hidden">
                    <div className="h-full bg-[#0073ea] rounded-full transition-all duration-500" style={{ width: `${buildProgress}%` }}></div>
                </div>

                {/* Asset status list */}
                <div className="space-y-2 text-left">
                    {builtAssets.map(asset => (
                        <div key={asset.id} className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#f9fafb] border border-[#e6e9ef]">
                            <span className="material-symbols-outlined text-[18px]" style={{ color: asset.color }}>{asset.icon}</span>
                            <span className="text-[14px] text-[#323338] font-normal flex-1">{asset.label}</span>
                            {asset.status === 'pending' && <span className="text-[12px] text-[#b8bccc]">Queued</span>}
                            {asset.status === 'building' && <span className="material-symbols-outlined text-[16px] text-[#0073ea] animate-spin">progress_activity</span>}
                            {asset.status === 'done' && <span className="material-symbols-outlined text-[16px] text-[#00c875]">check_circle</span>}
                            {asset.status === 'failed' && <span className="material-symbols-outlined text-[16px] text-red-500">error</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    /* ── Render: Ready ─────────────────────────────────── */
    const renderReady = () => (
        <div className="max-w-3xl mx-auto pt-10 px-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e6e9ef]">
                <div>
                    <h2 className="text-[22px] font-medium text-[#323338]">Your ecosystem is ready! 🎉</h2>
                    <p className="text-[14px] text-[#676879] mt-0.5">{builtAssets.length} assets built — click to open & customize</p>
                </div>
                <button onClick={() => { setAppState('home'); setBuildProgress(0); }} className="px-3 py-2 border border-[#c3c6d4] text-[#323338] text-[13px] rounded-lg hover:bg-[#f5f6f8] transition-colors flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    New Build
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {builtAssets.map(asset => (
                    <div key={asset.id} onClick={() => asset.status === 'done' && setViewingAsset(asset)} className="bg-white p-5 rounded-xl border border-[#e6e9ef] hover:border-[#0073ea] hover:shadow-lg transition-all cursor-pointer group">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" style={{ background: `${asset.color}18` }}>
                            <span className="material-symbols-outlined text-[20px]" style={{ color: asset.color }}>{asset.icon}</span>
                        </div>
                        <h3 className="text-[15px] text-[#323338] font-medium">{asset.label}</h3>
                        <p className="text-[12px] text-[#676879] mt-1">{asset.status === 'done' ? 'Click to view' : 'Generation failed'}</p>
                        <div className={`flex items-center gap-1 mt-3 text-[12px] font-medium ${asset.status === 'done' ? 'text-[#00c875]' : 'text-red-500'}`}>
                            <span className="material-symbols-outlined text-[14px]">{asset.status === 'done' ? 'check_circle' : 'error'}</span>
                            {asset.status === 'done' ? 'Generated securely' : 'Failed'}
                        </div>
                    </div>
                ))}
            </div>

            {/* Business context summary if available */}
            {bizCtx.idea && (
                <div className="mt-8 p-5 rounded-xl bg-[#f5f6f8] border border-[#e6e9ef]">
                    <h3 className="text-[14px] font-medium text-[#323338] mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#0073ea]">psychology</span>
                        Business Context Captured
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-[13px]">
                        {bizCtx.idea && <div><span className="text-[#676879]">Idea:</span> <span className="text-[#323338]">{bizCtx.idea}</span></div>}
                        {bizCtx.audience && <div><span className="text-[#676879]">Audience:</span> <span className="text-[#323338]">{bizCtx.audience}</span></div>}
                        {bizCtx.stage && <div><span className="text-[#676879]">Stage:</span> <span className="text-[#323338]">{bizCtx.stage}</span></div>}
                        {bizCtx.model && <div><span className="text-[#676879]">Model:</span> <span className="text-[#323338]">{bizCtx.model}</span></div>}
                    </div>
                </div>
            )}
        </div>
    );

    /* ── Render: Digital Employee Workspace ─────────────────────────── */
    const renderAgentWorkspace = () => {
        const agent = DIGITAL_EMPLOYEES.find(a => a.id === selectedAgentId);
        if (!agent) return null;

        const currentTasks = agentTasks.filter(t => t.agentId === selectedAgentId);
        const inProgressTasks = currentTasks.filter(t => t.status === 'in-progress');
        const doneTasks = currentTasks.filter(t => t.status === 'done');

        return (
            <div className="flex flex-col h-full bg-[#f4f7fe] animate-in fade-in slide-in-from-right-8 duration-500 relative z-0">
                {/* Workspace Header */}
                <div className="bg-white px-6 py-5 border-b border-[#e6e9ef] shadow-sm flex items-center justify-between shrink-0 relative z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setAppState('home')} className="w-8 h-8 rounded-full hover:bg-[#f5f6f8] flex items-center justify-center text-[#676879] transition-colors border border-[#e6e9ef] hover:border-[#c3c6d4]">
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md relative" style={{ backgroundColor: `${agent.clr}15`, color: agent.clr }}>
                                <span className="material-symbols-outlined text-[24px]">{agent.icon}</span>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00c875] border-2 border-white flex items-center justify-center shadow-sm">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-[18px] font-bold text-[#323338] leading-tight flex items-center gap-2">
                                    {agent.title}
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-800 text-white">AI Worker</span>
                                </h1>
                                <p className="text-[13px] text-[#676879] flex items-center gap-1.5 mt-0.5">
                                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                                    {agent.role} &bull; Ready to execute
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <button className="px-4 py-2 bg-white border border-[#e6e9ef] rounded-lg text-[13px] text-[#676879] font-medium hover:bg-[#f5f6f8] transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">settings</span>
                            Train Agent
                        </button>
                    </div>
                </div>

                {/* Workspace Board (Monday.com concept) */}
                <div className="flex-1 overflow-x-auto overflow-y-auto p-6 flex items-start gap-6 no-scrollbar relative z-0">
                    {/* Backlog / Inbox Column */}
                    <div className="w-[320px] shrink-0 flex flex-col gap-3">
                        <div className="bg-[#eef5ff] text-[#0073ea] px-3 py-1.5 rounded-lg text-[12px] font-bold uppercase tracking-wider flex items-center justify-between border border-blue-100 shadow-xs">
                            Inbox / Backlog <span className="w-5 h-5 bg-white rounded-md flex items-center justify-center text-[10px] shadow-sm">Demo</span>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-[#e6e9ef] shadow-sm cursor-grab hover:border-[#0073ea] transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded uppercase tracking-wider">Example</span>
                            </div>
                            <p className="text-[14px] text-[#323338] font-medium leading-snug">Generate {agent.role} strategy report for Q3</p>
                            <div className="mt-3 flex items-center gap-2 text-[#676879] text-[12px]">
                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                Suggested
                            </div>
                        </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="w-[320px] shrink-0 flex flex-col gap-3">
                        <div className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg text-[12px] font-bold uppercase tracking-wider flex items-center justify-between border border-orange-100 shadow-xs">
                            Working <span className="w-5 h-5 bg-white rounded-md flex items-center justify-center text-[10px] shadow-sm animate-pulse">{inProgressTasks.length}</span>
                        </div>
                        {inProgressTasks.map((t) => (
                            <div key={t.id} className="bg-white p-4 rounded-xl border border-[#e6e9ef] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-2 ring-orange-500/20">
                                <p className="text-[14px] text-[#323338] font-medium mb-3">{t.title}</p>
                                <div className="w-full bg-[#f5f6f8] h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500 w-[60%] animate-pulse"></div>
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded w-fit capitalize">
                                    <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                                    Arkle Processing
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Done Column */}
                    <div className="w-[350px] shrink-0 flex flex-col gap-3">
                        <div className="bg-[#e6fff4] text-[#00c875] px-3 py-1.5 rounded-lg text-[12px] font-bold uppercase tracking-wider flex items-center justify-between border border-green-100 shadow-xs">
                            Done <span className="w-5 h-5 bg-white rounded-md flex items-center justify-center text-[10px] shadow-sm">{doneTasks.length}</span>
                        </div>
                        {doneTasks.map((t) => (
                            <div key={t.id} className="bg-white p-4 rounded-xl border border-[#e6e9ef] shadow-sm overflow-hidden flex flex-col gap-2">
                                <div className="flex items-start gap-2 border-b border-[#f0f1f3] pb-3">
                                    <span className="material-symbols-outlined text-[16px] text-green-500 shrink-0 mt-0.5">check_circle</span>
                                    <p className="text-[13px] text-[#323338] font-medium leading-tight">{t.title}</p>
                                </div>
                                <div className="text-[12px] text-[#676879] whitespace-pre-wrap mt-1 bg-[#f5f6f8] p-3 rounded-lg overflow-x-auto max-h-[300px] overflow-y-auto">
                                    {t.result}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-white border-t border-[#e6e9ef] shrink-0 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] pb-8 relative flex flex-col items-center">
                    <div className="max-w-[960px] w-full mx-auto bg-white/95 border border-slate-200/40 backdrop-blur-xl rounded-[20px] flex flex-col p-3 shadow-2xl focus-within:border-blue-500/20 transition-all duration-500">
                        {/* Top: Dynamic Task Prompt */}
                        <input
                            value={isRecording && liveTranscript ? liveTranscript : agentTaskInput}
                            onChange={(e) => setAgentTaskInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAgentTaskSubmit(); }}
                            placeholder={`Assign a task to ${agent.title}...`}
                            className="w-full bg-transparent outline-none text-[14px] text-slate-800 placeholder-slate-400 mb-1.5"
                            disabled={isAgentWorking}
                        />

                        {/* Bottom: Razor-Thin Action Bar */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100/30">
                            <div className="flex items-center gap-3">
                                <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all" title="Upload Assets">
                                    <span className="material-symbols-outlined text-[20px]">add</span>
                                </button>
                                <select
                                    value={selectedAIModel}
                                    onChange={(e) => setSelectedAIModel(e.target.value as any)}
                                    className="bg-transparent border-none text-[8px] font-black text-slate-800 uppercase tracking-widest outline-none cursor-pointer"
                                >
                                    <option value="gemini">Gemini</option>
                                    <option value="gpt4">GPT-4</option>
                                    <option value="claude">Claude</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={toggleVoice}
                                    className={`w-6 h-6 flex items-center justify-center transition-all ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-slate-900'}`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">{isRecording ? 'graphic_eq' : 'waves'}</span>
                                </button>
                                <button
                                    onClick={() => handleAgentTaskSubmit()}
                                    className="w-6 h-6 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                                    style={{ color: theme.primary }}
                                >
                                    <span className="material-symbols-outlined text-[22px]">arrow_upward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /* ── Agent Workspace Flow ────────────────────────────── */
    const handleAgentTaskSubmit = async (overrideText?: string) => {
        const textToSubmit = overrideText || agentTaskInput;
        if (!textToSubmit.trim() || !selectedAgentId || isAgentWorking) return;

        const newTask = {
            id: Date.now().toString(),
            agentId: selectedAgentId,
            title: textToSubmit,
            status: 'in-progress',
            result: null
        };

        setAgentTasks(prev => [...prev, newTask]);
        setAgentTaskInput('');
        setIsAgentWorking(true);

        try {
            // Using the sales agent API as a universal backend for now
            const res = await fetch('/api/agents/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    task: newTask.title,
                    context: bizCtx
                })
            });

            const data = await res.json();

            if (res.ok && data.result) {
                setAgentTasks(prev => prev.map(t =>
                    t.id === newTask.id ? { ...t, status: 'done', result: data.result } : t
                ));
                // Speak out the actual response clearly without markdown characters
                speak(data.result.replace(/[*_#\[\]]/g, '').slice(0, 300) + (data.result.length > 300 ? '...' : ''));
            } else {
                setAgentTasks(prev => prev.map(t =>
                    t.id === newTask.id ? { ...t, status: 'done', result: `⚠️ API Error: ${data.error || 'Unknown error'}. ${data.details || ''}` } : t
                ));
            }
        } catch (e: any) {
            setAgentTasks(prev => prev.map(t =>
                t.id === newTask.id ? { ...t, status: 'done', result: `Failed to connect to agent backend: ${e.message}` } : t
            ));
        } finally {
            setIsAgentWorking(false);
        }
    };

    return (
        <div className="flex h-full overflow-hidden bg-white relative">

            {/* Main Content */}
            {/* Main Content Area with Dynamic Mood Lighting (Light Theme Restore) */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar bg-[#020617] transition-all duration-1000">

                {/* DYNAMIC MOOD BACKGROUND (The Core Identity) */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Primary Atmospheric Glow */}
                    <div
                        className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[120%] h-[80%] rounded-[100%] opacity-30 blur-[120px] transition-all duration-1000"
                        style={{ background: `radial-gradient(circle, ${theme.primary} 0%, transparent 70%)` }}
                    ></div>

                    {/* Secondary Accent Pulse */}
                    <div
                        className="absolute bottom-0 right-0 w-[50%] h-[50%] rounded-full opacity-10 blur-[100px] transition-all duration-1000 animate-pulse"
                        style={{ background: theme.primary }}
                    ></div>

                    {/* Technical Grid Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(${theme.primary} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
                </div>



                {/* QA Overlay */}
                <QAOverlay isScanning={forgeStatus === 'building'} />



                {/* Content Router */}
                {appState === 'home' && renderHome()}
                {appState === 'discuss' && renderChat(chatThread, chatInput, setChatInput, handleDiscussSubmit, chatEndRef, 'Co-Founder Discussion')}
                {appState === 'solutions-chat' && renderChat(solThread, solInput, setSolInput, handleSolSubmit, solEndRef, 'Solutions Lab')}
                {appState === 'building' && renderBuilding()}
                {appState === 'ready' && renderReady()}
                {appState === 'agent-workspace' && renderAgentWorkspace()}
            </div>

            {/* Inner Sidebar: Hover-Expandable Contextual Tray (Hidden in active tasks) */}
            <AnimatePresence>
                {(appState === 'home' || appState === 'agent-workspace') && (
                    <motion.div
                        key="launchpad-inner-sidebar"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: isTrayExpanded ? 280 : 64, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        onMouseEnter={() => setIsTrayExpanded(true)}
                        onMouseLeave={() => setIsTrayExpanded(false)}
                        className="shrink-0 h-full border-l border-[#e6e9ef] bg-white transition-all duration-500 ease-in-out z-30 shadow-2xl overflow-hidden"
                    >
                        <div className="p-0 flex flex-col h-full bg-[#fcfcfd] overflow-hidden">

                    {/* Header by Mode */}
                    <div className={`p-4 pt-8 transition-all duration-500 ${isTrayExpanded ? 'opacity-100' : 'opacity-0 scale-90 translate-x-10'}`}>
                        {topTab === 'arkle' && (
                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Arkle Intelligence</h3>
                                <h2 className="text-[16px] font-black text-slate-800 tracking-tighter leading-none">Brain Memory</h2>
                            </div>
                        )}
                        {topTab === 'co-founder' && (
                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Launcher Center</h3>
                                <h2 className="text-[16px] font-black text-slate-800 tracking-tighter leading-none">Startup Assets</h2>
                            </div>
                        )}
                        {topTab === 'solutions' && (
                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Development Lab</h3>
                                <h2 className="text-[16px] font-black text-slate-800 tracking-tighter leading-none">Tool Factory</h2>
                            </div>
                        )}
                        {topTab === 'ai-agents' && (
                            <div>
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Agent Ops</h3>
                                <h2 className="text-[16px] font-black text-slate-800 tracking-tighter leading-none">Digital Team</h2>
                            </div>
                        )}
                    </div>

                    {/* Dynamic Action Buttons */}
                    <div className="px-3 space-y-3 mt-4">
                        {topTab === 'arkle' && (
                            <>
                                <button onClick={() => setAppState('home')} className={`w-full flex items-center bg-[#0073ea] text-white rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 ${isTrayExpanded ? 'px-4 py-3 justify-between' : 'h-10 w-10 justify-center p-0 mx-auto'}`}>
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[20px]">add_comment</span>
                                        {isTrayExpanded && <span className="text-[13px] font-bold">New Session</span>}
                                    </div>
                                    {isTrayExpanded && <span className="text-[10px] opacity-60">⌘K</span>}
                                </button>
                                <button className={`w-full flex items-center bg-white border border-slate-100 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all ${isTrayExpanded ? 'px-4 py-3 gap-3' : 'h-10 w-10 justify-center p-0 mx-auto'}`}>
                                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                                    {isTrayExpanded && <span className="text-[13px] font-bold">Strategy Lab</span>}
                                </button>
                            </>
                        )}
                        {topTab === 'co-founder' && (
                            <>
                                <button onClick={() => setAppState('home')} className={`w-full flex items-center bg-[#00c875] text-white rounded-2xl shadow-lg shadow-green-500/20 transition-all hover:scale-105 active:scale-95 ${isTrayExpanded ? 'px-4 py-3 gap-3' : 'h-10 w-10 justify-center p-0 mx-auto'}`}>
                                    <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                                    {isTrayExpanded && <span className="text-[13px] font-bold">Launch Hub</span>}
                                </button>
                                <button className={`w-full flex items-center bg-white border border-slate-100 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all ${isTrayExpanded ? 'px-4 py-3 gap-3' : 'h-10 w-10 justify-center p-0 mx-auto'}`}>
                                    <span className="material-symbols-outlined text-[20px]">branding_watermark</span>
                                    {isTrayExpanded && <span className="text-[13px] font-bold">Brand Kit</span>}
                                </button>
                            </>
                        )}
                        {topTab === 'solutions' && (
                            <>
                                <button onClick={() => startForging("Build a new business tool")} className={`w-full flex items-center bg-[#ff7b00] text-white rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 ${isTrayExpanded ? 'px-4 py-3 gap-3' : 'h-10 w-10 justify-center p-0 mx-auto'}`}>
                                    <span className="material-symbols-outlined text-[20px]">precision_manufacturing</span>
                                    {isTrayExpanded && <span className="text-[13px] font-bold">Build App</span>}
                                </button>
                                <button className={`w-full flex items-center bg-white border border-slate-100 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all ${isTrayExpanded ? 'px-4 py-3 gap-3' : 'h-10 w-10 justify-center p-0 mx-auto'}`}>
                                    <span className="material-symbols-outlined text-[20px]">extension</span>
                                    {isTrayExpanded && <span className="text-[13px] font-bold">Skill Library</span>}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Contextual History/List */}
                    <div className={`flex-1 overflow-y-auto no-scrollbar px-3 mt-10 transition-all duration-500 ${isTrayExpanded ? 'opacity-100' : 'opacity-0 translate-x-10'}`}>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">History</span>
                            <span className="material-symbols-outlined text-slate-300 text-[16px]">history</span>
                        </div>

                        <div className="space-y-1">
                            {topTab === 'arkle' && (
                                <>
                                    {chatThread.filter(m => m.role === 'user').length > 0 ? (
                                        chatThread.filter(m => m.role === 'user').slice(-5).reverse().map((msg, i) => (
                                            <button key={i} onClick={() => setAppState('discuss')} className="w-full px-3 py-2 text-left rounded-lg text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all text-[12px] font-medium flex items-center gap-2 truncate group">
                                                <span className="material-symbols-outlined text-[14px] opacity-40 group-hover:opacity-100 transition-opacity">chat_bubble</span>
                                                <span className="truncate">{msg.text}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="px-3 py-2 text-[11px] text-slate-400 italic">No recent prompts.</p>
                                    )}
                                </>
                            )}
                            {topTab === 'solutions' && (
                                <>
                                    {solThread.filter(m => m.role === 'user').length > 0 ? (
                                        solThread.filter(m => m.role === 'user').slice(-5).reverse().map((msg, i) => (
                                            <button key={i} onClick={() => setAppState('solutions-chat')} className="w-full px-3 py-2 text-left rounded-lg text-slate-500 hover:bg-slate-50 hover:text-orange-600 transition-all text-[12px] font-medium flex items-center gap-2 truncate group">
                                                <span className="material-symbols-outlined text-[14px] opacity-40 group-hover:opacity-100 transition-opacity">lightbulb</span>
                                                <span className="truncate">{msg.text}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="px-3 py-2 text-[11px] text-slate-400 italic">No solution history.</p>
                                    )}
                                </>
                            )}
                            {topTab === 'co-founder' && (
                                <>
                                    {builtAssets.length > 0 ? (
                                        builtAssets.filter(a => a.status === 'done').map(asset => (
                                            <button key={asset.id} className="w-full px-3 py-2 text-left rounded-lg text-slate-500 hover:bg-slate-50 hover:text-green-600 transition-all text-[12px] font-medium flex items-center gap-2 truncate">
                                                <span className="material-symbols-outlined text-[14px]" style={{ color: asset.color }}>{asset.icon}</span>
                                                {asset.label}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-[11px] text-slate-400 italic px-3">No assets yet.</p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Bottom Status / Profile */}
                    <div className="mt-auto p-2 border-t border-slate-100 bg-slate-50/50">
                        <div className={`flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm transition-all ${isTrayExpanded ? 'w-full px-3 py-3' : 'w-10 h-10 justify-center p-0 mx-auto'}`}>
                            <div className="shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">
                                {firstName[0]}
                            </div>
                            {isTrayExpanded && (
                                <div className="flex-1 overflow-hidden animate-in fade-in slide-in-from-left-2">
                                    <p className="text-[11px] font-black text-slate-800 truncate">{firstName}'s Hub</p>
                                    <div className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Active</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
            )}
            </AnimatePresence>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #c3c6d4; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #676879; }
                
                @keyframes voice-wave {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(2); }
                }
                .animate-voice-wave {
                    animation: voice-wave 0.6s ease-in-out infinite;
                }
            `}</style>
            <WelcomeModal />
            <DiscoveryWizard />
            <MagicLoading />

            {showVoiceStudio && (
                <VoiceBuilderStudio onClose={() => setShowVoiceStudio(false)} context={bizCtx} />
            )}

            {/* Asset Viewer Modal */}
            {viewingAsset && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in py-10 px-5">
                    <div className="bg-[#f0f1f3] w-full max-w-7xl h-full rounded-[24px] shadow-2xl flex flex-col overflow-hidden relative border border-white/20">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-[#e6e9ef] bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${viewingAsset.color}20` }}>
                                    <span className="material-symbols-outlined text-[20px]" style={{ color: viewingAsset.color }}>{viewingAsset.icon}</span>
                                </div>
                                <div>
                                    <h3 className="text-[16px] font-bold text-[#323338]">{bizCtx.businessName || 'Your'} {viewingAsset.label}</h3>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#00c875] flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00c875] animate-pulse"></span>
                                        Arkle AI Generated
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="px-5 py-2 bg-[#0073ea] text-white font-bold text-[13px] rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">download</span> Download
                                </button>
                                <button onClick={() => setViewingAsset(null)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-[#323338] transition-colors border border-transparent hover:border-slate-300">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center relative">
                            {viewingAsset.id === 'website' ? (
                                <div className="w-full h-full bg-white rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.05)] overflow-hidden border border-slate-200">
                                    <div className="bg-slate-100 py-2 px-4 border-b border-slate-200 flex items-center gap-2">
                                        <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-amber-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div></div>
                                        <div className="mx-auto bg-white border border-slate-200 rounded-md px-4 py-0.5 text-[11px] text-slate-500 w-1/2 text-center truncate">
                                            https://{bizCtx.businessName ? bizCtx.businessName.toLowerCase().replace(/\s+/g, '') : 'startup'}.setmybizz.com
                                        </div>
                                    </div>
                                    <iframe
                                        srcDoc={viewingAsset.result}
                                        className="w-full h-[calc(100%-36px)]"
                                        title="Website Preview"
                                    />
                                </div>
                            ) : viewingAsset.id === 'logo' ? (
                                <div className="max-w-2xl w-full aspect-square bg-[#1c1f3b] rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:400%_400%] animate-shine pointer-events-none"></div>
                                    {viewingAsset.result ? (
                                        <div className="w-3/4 h-3/4 p-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-transform duration-500 group-hover:scale-105" dangerouslySetInnerHTML={{ __html: viewingAsset.result }} />
                                    ) : (
                                        <span className="text-white">SVG Failed to render</span>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full max-w-4xl min-h-full bg-white shadow-xl p-10 rounded-2xl border border-slate-200 font-serif">
                                    <div className="prose prose-slate max-w-none whitespace-pre-wrap">
                                        {viewingAsset.result}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <style jsx>{`
                .font-outfit { font-family: 'Outfit', sans-serif; }
                @keyframes voice-wave {
                    0%, 100% { transform: scaleY(1); opacity: 0.3; }
                    50% { transform: scaleY(1.8); opacity: 1; }
                }
                .animate-voice-wave {
                    animation: voice-wave 0.8s ease-in-out infinite;
                }
                @keyframes thread-flow {
                    0% { stroke-dashoffset: 40; }
                    100% { stroke-dashoffset: 0; }
                }
                .animate-thread-flow {
                    animation: thread-flow 2s linear infinite;
                }
                @keyframes rocket-hover {
                    0%, 100% { transform: translateY(0) rotate(-12deg); }
                    50% { transform: translateY(-3px) rotate(-8deg); }
                }
                .animate-rocket-hover {
                    animation: rocket-hover 3s ease-in-out infinite;
                }
            `}</style>

            {/* RENDER PURE CREATION IDE IF ACTIVE */}
            {forgeStatus !== 'idle' && renderPureCreationForge()}
        </div>
    );
};

export default LaunchPadTab;
