"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BusinessData } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface LaunchPadTabProps {
    data: BusinessData;
    externalLang?: string;
    onLangChange?: (l: string) => void;
}

/* ── Types ─────────────────────────────────────────────── */
type TopTab = 'arkle' | 'co-founder' | 'solutions' | 'ai-agents';
type AppState = 'home' | 'discuss' | 'building' | 'ready' | 'solutions-chat' | 'agent-workspace';

interface ChatMsg { role: 'ai' | 'user'; text: string; ts: number; }
interface BuiltAsset { id: string; label: string; icon: string; status: 'pending' | 'building' | 'done'; color: string; }
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

/* ── Service Registry ─────────────────────────────────── */
const SERVICES = [
    { id: 'logo',      label: 'Logo',        icon: 'palette',     color: '#579bfc', desc: 'AI-generated brand identity' },
    { id: 'website',   label: 'Website',     icon: 'language',    color: '#00c875', desc: 'Responsive landing page' },
    { id: 'store',     label: 'Store',       icon: 'storefront',  color: '#ffcc00', desc: 'E-commerce storefront' },
    { id: 'gen-img',   label: 'AI Image',    icon: 'image',       color: '#00d2d2', desc: 'Generate visual assets' },
    { id: 'social',    label: 'Social',      icon: 'campaign',    color: '#e2445c', desc: 'Social media templates' },
    { id: 'tool',      label: 'AI Tool',     icon: 'smart_toy',   color: '#9d94ff', desc: 'Custom automation tool' },
    { id: 'pitchdeck', label: 'Pitch Deck',  icon: 'description', color: '#ff7b00', desc: 'Investor-ready deck' },
    { id: 'brochure',  label: 'Brochure',    icon: 'auto_stories',color: '#0073ea', desc: 'Digital brochure' },
    { id: 'brandkit',  label: 'Brand Kit',   icon: 'category',    color: '#00c875', desc: 'Full branding guide' },
    { id: 'letter',    label: 'Letterhead',  icon: 'mail',        color: '#579bfc', desc: 'Official letterhead' },
    { id: 'designer',  label: 'Designer',    icon: 'edit_square', color: '#ffcc00', desc: 'AI Design assistant' },
    { id: 'catalogue', label: 'Catalogue',   icon: 'menu_book',   color: '#e2445c', desc: 'Product catalogues' },
    { id: 'cards',     label: 'Digital Card',icon: 'contact_page',color: '#9d94ff', desc: 'Digital business cards' },
];

/* ── Solutions Ideas ─────────────────────────────────── */
const SOLUTION_IDEAS = [
    { 
        title: 'Client Project Hub', 
        category: 'Projects', 
        image: '/images/templates/projects.png',
        prompt: 'Build a premium Client Project Hub for account managers to track deliverables, milestones, and client communication. I need a data-forward dashboard that highlights project health, upcoming deadlines, and real-time status updates for external stakeholders.', 
        clr: '#579bfc' 
    },
    { 
        title: 'Sales Delivery Tracker', 
        category: 'Sales', 
        image: '/images/templates/crm.png',
        prompt: 'Create a Sales Delivery Tracker that coordinates seamless hand-offs from sales to operations. It should enable teams to manage onboarding tasks in a structured, audit-ready timeline interface with clear ownership and phase-based transitions.', 
        clr: '#00c875' 
    },
    { 
        title: 'Strategy Execution Suite', 
        category: 'Strategy', 
        image: '/images/templates/projects.png', // Fallback
        prompt: 'Build a Strategy Execution Suite for executives to align project outcomes with company goals. I need a high-level KPI dashboard with risk indicators, financial summaries, and a "number-first" approach to tracking growth.', 
        clr: '#9d94ff' 
    },
    { 
        title: 'Social Media Calendar', 
        category: 'Marketing', 
        image: '/images/templates/marketing.png',
        prompt: 'Design an omni-channel Social Media Calendar for content managers. It should support platform-specific grouping (LinkedIn, Instagram, etc.), status tracking (Draft/Scheduled/Published), and a color-coded grid layout with drag-and-drop capabilities.', 
        clr: '#e2445c' 
    },
    { 
        title: 'Employee Onboarding Engine', 
        category: 'HR', 
        image: '/images/templates/hr.png',
        prompt: 'Create an automated Employee Onboarding Engine that guides new hires through documentation, training modules, and equipment requests. I want a progress-tracking view to ensure every hire has a consistent and high-quality start.', 
        clr: '#00d2d2' 
    },
    { 
        title: 'Product Roadmap Planner', 
        category: 'Development', 
        image: '/images/templates/projects.png', 
        prompt: 'Build a Product Roadmap Planner to visualize releases, feature requests, and engineering sprints. It should support Kanban and Gantt views with priority scoring and automated dependency tracking.', 
        clr: '#ff7b00' 
    },
    { 
        title: 'Finance & Burn Monitor', 
        category: 'Operations', 
        image: '/images/templates/crm.png', 
        prompt: 'Develop a Finance & Burn Monitor to track startup runway, MRR, and departmental spending. I need automated projections and alerts for budget variances to keep the business financially healthy.', 
        clr: '#ffcc00' 
    },
    { 
        title: 'Customer Success Hub', 
        category: 'Sales', 
        image: '/images/templates/crm.png', 
        prompt: 'Design a Customer Success Hub to track health scores, renewal dates, and expansion opportunities. Integrate it with a support ticket overview to provide a 360-degree view of every client account.', 
        clr: '#0073ea' 
    },
    { 
        title: 'Campaign ROI Tracker', 
        category: 'Marketing', 
        image: '/images/templates/marketing.png', 
        prompt: 'Build a Campaign ROI Tracker that aggregates data from multiple ad platforms. It should calculate CAC, LTV, and conversion rates automatically to optimize marketing spend in real-time.', 
        clr: '#e2445c' 
    },
];

/* ── AI Digital Employees Data ─────────────────────────── */
const DIGITAL_EMPLOYEES = [
    { id: 'marketing', title: 'Marketing Head', role: 'Growth', desc: 'Creates ad campaigns, plans SEO, and drives market positioning.', icon: 'insights', clr: '#ff7b00', status: 'Available' },
    { id: 'social', title: 'Social Media Expert', role: 'Engagement', desc: 'Writes, schedules, and analyzes viral posts across platforms.', icon: 'campaign', clr: '#e2445c', status: 'Available' },
    { id: 'sales', title: 'Sales Executive', role: 'Revenue', desc: 'Handles outbound emails, lead qualification, and deal closing.', icon: 'trending_up', clr: '#00c875', status: 'Available' },
    { id: 'crm', title: 'Account Manager', role: 'Retention', desc: 'Manages client follow-ups, retention, and seamless onboarding.', icon: 'group', clr: '#579bfc', status: 'Available' },
    { id: 'designer', title: 'Creative Designer', role: 'Brand', desc: 'Generates brand kits, logos, brochures, and interface designs.', icon: 'palette', clr: '#9d94ff', status: 'Available' },
    { id: 'finance', title: 'Finance Advisor', role: 'Tax & P&L', desc: 'Tracks expenses, monitors runway, and plans tax strategies.', icon: 'account_balance', clr: '#ffcc00', status: 'Available' },
    { id: 'legal', title: 'Legal Assistant', role: 'Compliance', desc: 'Drafts contracts, term sheets, and ensures corporate compliance.', icon: 'gavel', clr: '#323338', status: 'Available' },
    { id: 'overseer', title: 'Business Manager', role: 'Operations', desc: 'Deploys apps, builds websites, and manages Arkle services on autopilot.', icon: 'rocket_launch', clr: '#0073ea', status: 'Available' },
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
    { key: 'problem',    q: "What specific problem or bottleneck are you facing in your business right now?" },
    { key: 'goal',       q: "What's the ideal outcome? What would solving this look like?" },
    { key: 'current',    q: "What tools or processes are you currently using to handle this?" },
    { key: 'gaps',       q: "Where are the biggest gaps or frustrations with your current approach?" },
    { key: 'build',      q: "Got it. Based on everything you've told me, here's what I recommend building:" },
];

const LaunchPadTab: React.FC<LaunchPadTabProps> = ({ data, externalLang, onLangChange }) => {
    const { user } = useAuth();
    const firstName = user?.displayName?.split(' ')[0] || data?.name?.split(' ')[0] || 'Founder';

    /* ── State ─────────────────────────────────────────── */
    const [topTab, setTopTab] = useState<TopTab>('launchpad');
    const [appState, setAppState] = useState<AppState>('home');
    const [promptInput, setPromptInput] = useState('');
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
    const [agentTaskInput, setAgentTaskInput] = useState('');
    const [agentTasks, setAgentTasks] = useState<any[]>([]);
    const [isAgentWorking, setIsAgentWorking] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Business context collected from Co-Founder discussion
    const [bizCtx, setBizCtx] = useState<BusinessContext>({
        businessName: '', idea: '', stage: '', type: '', 
        industry: '', techLevel: '', brandVoice: '', designTaste: '', struggles: '', 
        colors: [], fonts: '', audience: '', model: '', usp: '', commitment: '', services: []
    });

    const [showWelcome, setShowWelcome] = useState(false);
    const [showDiscovery, setShowDiscovery] = useState(false);
    const [discoveryStep, setDiscoveryStep] = useState(0);
    const selectedLang = externalLang || 'en-IN';
    const setSelectedLang = onLangChange || (() => {});
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
                        setShowWelcome(false); // Don't show if already set up
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

    const chatEndRef = useRef<HTMLDivElement>(null);
    const solEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const [isRecording, setIsRecording] = useState(false);

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
                        if (showDiscovery) {
                            setTimeout(() => handlediscoveryAnswer(transcript), 800);
                        } else {
                            setTimeout(() => {
                                if (appState === 'discuss') handleDiscussSubmit();
                                else if (appState === 'solutions-chat') handleSolSubmit();
                                else if (appState === 'agent-workspace') {
                                    handleAgentTaskSubmit(transcript);
                                }
                            }, 500);
                        }
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
        const firstQ = DISCUSSION_FLOW[0].q;
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

    /* ── Discovery Popup Logic ───────────────────────── */
    const handlediscoveryAnswer = (val: string) => {
        const currentQ = DISCUSSION_FLOW[discoveryStep];
        let updatedCtx = { ...bizCtx, [currentQ.key]: val };
        let newLang = selectedLang;
        
        if (currentQ.key === 'language') {
            const langObj = (currentQ as any).options.find((o:any) => o.label === val);
            newLang = langObj?.id || 'en-IN';
            setSelectedLang(newLang);
        }

        if (currentQ.key === 'industry' || currentQ.key === 'designTaste') {
            const industryStr = (val || '').toLowerCase();
            const matchingTemplate = Object.entries(BRAND_TEMPLATES).find(([key]) => industryStr.includes(key));
            if (matchingTemplate) {
                updatedCtx.colors = matchingTemplate[1].colors;
                updatedCtx.fonts = matchingTemplate[1].fonts;
            }
        }
        setBizCtx(updatedCtx);

        if (discoveryStep < DISCUSSION_FLOW.length - 1) {
            const nextStep = discoveryStep + 1;
            setDiscoveryStep(nextStep);
            
            // Auto-speak next question in Live Talk mode
            if (isVoiceActive) speak(DISCUSSION_FLOW[nextStep].q, newLang);
        } else {
            setShowDiscovery(false);
            setAppState('building');
            setBuildProgress(10);
            const buildMsg = newLang === 'te-IN' ? "అద్భుతం! మీ బిజినెస్ ప్లాన్ సిద్ధమైంది. అర్కెల్ మీ స్టార్టప్ అసెట్స్ ని నిర్మిస్తోంది." : "Magnificent! Your strategic blueprint is ready. Arkle is now building your assets.";
            speak(buildMsg, newLang);

            // Simulation of building
            let p = 10;
            const timer = setInterval(() => {
                p += 15;
                setBuildProgress(p);
                if (p === 40) speak(newLang === 'te-IN' ? "బ్రాండ్ ఐడెంటిటీని సృష్టిస్తున్నాను..." : "Creating your brand identity...", newLang);
                if (p === 70) speak(newLang === 'te-IN' ? "మార్కెట్ అనాలిసిస్ పూర్తయింది. వెబ్ పోర్టల్ సిద్ధమవుతోంది." : "Structuring your digital ecosystem...", newLang);
                if (p >= 100) {
                    clearInterval(timer);
                    setAppState('ready');
                    speak(newLang === 'te-IN' ? "అభినందనలు! మీ స్టార్టప్ లాంచ్‌ప్యాడ్ ఇప్పుడు సిద్ధంగా ఉంది." : "Congratulations! Your startup Launchpad is now ready for world domination.", newLang);
                }
            }, 1000);

            // Save to Backend
            if (user?.uid) {
                fetch('/api/business-profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.uid, profile: updatedCtx })
                });
            }
        }
    };

    const BuildingModal = () => {
        if (appState !== 'building') return null;
        return (
            <div className="fixed inset-0 z-120 flex items-center justify-center bg-[#1c1f3b] animate-in fade-in duration-1000">
                <div className="w-full max-w-lg text-center p-12">
                    <div className="relative w-40 h-40 mx-auto mb-12">
                        <div className="absolute inset-0 border-8 border-white/5 rounded-full"></div>
                        <div 
                            className="absolute inset-0 border-8 border-[#0073ea] rounded-full transition-all duration-500"
                            style={{ clipPath: `inset(0 0 0 ${100 - buildProgress}%)`, transform: 'rotate(-90deg)' }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[64px] text-white animate-bounce">rocket_launch</span>
                        </div>
                    </div>
                    
                    <h2 className="text-[28px] font-black text-white mb-4 uppercase tracking-tighter">Arkle is Building...</h2>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-6">
                        <div className="h-full bg-[#0073ea] transition-all duration-700" style={{ width: `${buildProgress}%` }}></div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <p className={`text-[14px] uppercase tracking-[0.3em] transition-all duration-500 ${buildProgress > 20 ? 'text-[#00c875]' : 'text-white/20'}`}>
                            {buildProgress > 20 ? '✓ Strategy Mapped' : 'Mapping Strategy...'}
                        </p>
                        <p className={`text-[14px] uppercase tracking-[0.3em] transition-all duration-500 ${buildProgress > 50 ? 'text-[#00c875]' : 'text-white/20'}`}>
                            {buildProgress > 50 ? '✓ Brand Engine Loaded' : 'Deploying Brand Engine...'}
                        </p>
                        <p className={`text-[14px] uppercase tracking-[0.3em] transition-all duration-500 ${buildProgress > 80 ? 'text-[#00c875]' : 'text-white/20'}`}>
                            {buildProgress > 80 ? '✓ Assets Synchronized' : 'Generating Assets...'}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const WelcomeModal = () => {
        if (!showWelcome) return null;
        return (
            <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-700">
                <div className="bg-[#1c1f3b] w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-white/10 p-12 text-center animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-gradient-to-tr from-[#0073ea] to-[#00c875] rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-blue-500/20">
                        <span className="material-symbols-outlined text-white text-[48px] animate-pulse">psychology</span>
                    </div>
                    <h1 className="text-[42px] font-black text-white mb-4 leading-tight tracking-tight uppercase">Meet Arkle</h1>
                    <p className="text-[19px] text-white/60 mb-10 leading-relaxed max-w-md mx-auto">
                        Your strategic AI Co-Founder. I will help you build your <span className="text-white font-bold">entire startup</span> from scratch in minutes. 
                    </p>
                    <button 
                        onClick={() => { setShowWelcome(false); setShowDiscovery(true); }}
                        className="w-full py-5 bg-white text-[#1c1f3b] rounded-2xl text-[18px] font-bold shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center gap-3"
                    >
                        Start Your Empire
                        <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
                    </button>
                    <p className="mt-6 text-[12px] text-white/30 uppercase tracking-[0.2em]">Strategy · Design · Tech · Scale</p>
                </div>
            </div>
        );
    };

    const DiscoveryModal = () => {
        if (!showDiscovery) return null;
        const currentQ = DISCUSSION_FLOW[discoveryStep];
        return (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-500">
                <div className="bg-white/10 backdrop-blur-2xl w-full max-w-xl rounded-[40px] shadow-2xl border border-white/20 p-10 flex flex-col relative animate-in zoom-in-95 duration-500 overflow-hidden group">
                    
                    {/* Progress Indicator - Top */}
                    <div className="flex gap-1.5 mb-8 justify-center">
                        {DISCUSSION_FLOW.map((_, i) => (
                            <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${i === discoveryStep ? 'w-8 bg-[#0073ea]' : 'w-2 bg-white/10'}`}></div>
                        ))}
                    </div>

                    {/* Question Area & Neural Orb */}
                    <div className="flex-1 flex flex-col items-center justify-center py-6">
                        <AnimatePresence mode="wait">
                            {!isVoiceActive ? (
                                <motion.div 
                                    key="text-q"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="text-center w-full"
                                >
                                    <div className="flex items-center justify-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-tr from-[#0073ea] to-[#00c875] rounded-xl flex items-center justify-center shadow-lg">
                                            <span className="material-symbols-outlined text-white text-[20px] animate-pulse">psychology</span>
                                        </div>
                                        <span className="text-white/40 text-[11px] font-black uppercase tracking-[0.4em]">Arkle Consultation</span>
                                    </div>
                                    <h2 className="text-[28px] font-black text-white leading-tight tracking-tight uppercase font-[Outfit] mb-10 px-4">
                                        {(currentQ as any).q}
                                    </h2>

                                    {/* Interaction Zone (Text/Choice) */}
                                    <div className="w-full">
                                        {(currentQ as any).type === 'choice' ? (
                                            <div className="grid grid-cols-1 gap-3 px-2">
                                                {(currentQ as any).options.map((opt: any, idx: number) => (
                                                    <button 
                                                        key={idx}
                                                        onClick={() => handlediscoveryAnswer(opt.label)}
                                                        className="group p-4 bg-white/5 hover:bg-white rounded-[22px] text-left transition-all border border-white/5 hover:border-white shadow-lg flex items-center gap-5 active:scale-95"
                                                    >
                                                        <div className="w-10 h-10 bg-white/10 group-hover:bg-[#0073ea] group-hover:text-white rounded-xl flex items-center justify-center transition-all">
                                                            <span className="material-symbols-outlined text-white group-hover:text-white text-[20px]">{opt.icon}</span>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-[14px] font-black text-white group-hover:text-[#1c1f3b] uppercase tracking-tight">{opt.label}</h4>
                                                            <p className="text-[10px] text-white/30 group-hover:text-[#1c1f3b]/50 font-bold uppercase tracking-wider">{opt.desc}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="relative w-full px-2">
                                                <input 
                                                    autoFocus
                                                    className="w-full bg-white/5 border border-white/10 rounded-[25px] px-8 py-5 text-[18px] font-bold text-white outline-none focus:border-[#0073ea] transition-all placeholder-white/10 text-center font-[Outfit]"
                                                    placeholder={(currentQ as any).placeholder}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handlediscoveryAnswer((e.target as any).value);
                                                            (e.target as any).value = "";
                                                        }
                                                    }}
                                                />
                                                <button 
                                                    onClick={() => {
                                                        const inp = document.querySelector('input') as any;
                                                        handlediscoveryAnswer(inp.value);
                                                        inp.value = "";
                                                    }}
                                                    className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0073ea] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">east</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="voice-q"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex flex-col items-center justify-center w-full"
                                >
                                    {/* NEURAL ORB - LARGE INTEGRATED */}
                                    <div className="relative mb-12 group cursor-pointer" onClick={() => { setIsVoiceActive(false); toggleVoice(); }}>
                                        <motion.div 
                                          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }}
                                          transition={{ duration: 2, repeat: Infinity }}
                                          className="absolute inset-0 bg-[#0073ea] rounded-full blur-[60px] -m-12"
                                        />
                                        <motion.div 
                                          animate={{ 
                                            borderRadius: ["40% 60% 70% 30%", "60% 40% 30% 70%", "40% 60% 70% 30%"],
                                            rotate: [0, 90, 0]
                                          }} 
                                          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                          className="w-40 h-40 bg-linear-to-tr from-[#0073ea] via-[#00c875] to-cyan-400 shadow-[0_0_100px_rgba(0,115,234,0.4)] border border-white/40 flex flex-col items-center justify-center overflow-hidden"
                                        >
                                           <span className="material-symbols-outlined text-white text-[60px] drop-shadow-2xl">graphic_eq</span>
                                        </motion.div>
                                    </div>
                                    
                                    <div className="text-center space-y-4">
                                        <p className="text-[#0073ea] font-black text-[14px] uppercase tracking-[0.4em] animate-pulse">Neural Link Active</p>
                                        <h3 className="text-white text-[20px] font-black uppercase tracking-tight max-w-[340px] px-4 font-[Outfit]">
                                            {(currentQ as any).q}
                                        </h3>
                                        {liveTranscript ? (
                                             <p className="text-white/80 text-[14px] font-bold italic tracking-tight bg-white/5 py-3 px-6 rounded-2xl border border-white/10 animate-pulse">
                                                 "{liveTranscript}"
                                             </p>
                                        ) : (
                                            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Awaiting founder directive...</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bottom Controls */}
                    <div className="shrink-0 flex justify-between items-center mt-6 pt-6 border-t border-white/10">
                        <button 
                            onClick={() => setDiscoveryStep(prev => Math.max(0, prev - 1))}
                            disabled={discoveryStep === 0 || isVoiceActive}
                            className="text-[12px] font-black text-white/20 hover:text-white disabled:opacity-0 transition-colors uppercase tracking-[0.2em] flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[16px]">west</span>
                            Back
                        </button>

                        <button 
                            onClick={() => { setIsVoiceActive(!isVoiceActive); toggleVoice(); if (!isVoiceActive) speak(currentQ.q); }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all text-[11px] font-black uppercase tracking-widest shadow-xl transform active:scale-95 ${isVoiceActive ? 'bg-red-500 text-white animate-pulse shadow-red-500/20' : 'bg-white text-[#1c1f3b] hover:bg-[#0073ea] hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{isVoiceActive ? 'mic_off' : 'mic'}</span>
                            {isVoiceActive ? 'Exit Talk Mode' : 'Talk with Arkle'}
                        </button>
                    </div>

                    {/* Subtle Background Accent */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all duration-1000"></div>
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
    const startBuilding = () => {
        setAppState('building');
        setBuildProgress(0);

        const assets: BuiltAsset[] = selectedServices.map(id => {
            const svc = SERVICES.find(s => s.id === id)!;
            return { id: svc.id, label: svc.label, icon: svc.icon, status: 'pending', color: svc.color };
        });

        setBuiltAssets(assets);

        // Simulate sequential building with progress
        let completed = 0;
        assets.forEach((asset, idx) => {
            setTimeout(() => {
                setBuiltAssets(prev => prev.map(a => 
                    a.id === asset.id ? { ...a, status: 'building' } : a
                ));
            }, idx * 1200);

            setTimeout(() => {
                setBuiltAssets(prev => prev.map(a => 
                    a.id === asset.id ? { ...a, status: 'done' } : a
                ));
                completed++;
                setBuildProgress(Math.round((completed / assets.length) * 100));

                if (completed === assets.length) {
                    setTimeout(() => setAppState('ready'), 800);
                }
            }, idx * 1200 + 1000);
        });
    };

    /* ── Direct submit from prompt ────────────────────── */
    const handleDirectSubmit = () => {
        if (!promptInput.trim()) return;
        if (topTab === 'co-founder') {
            startDiscussion();
        } else if (topTab === 'solutions') {
            startSolutionsChat();
        } else {
            // Arkle mode — direct build
            startBuilding();
        }
    };

    /* ── Toggle service selection ──────────────────────── */
    const toggleService = (id: string) => {
        setSelectedServices(prev => 
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    /* ── Render: Chat thread ──────────────────────────── */
    const renderChat = (
        thread: ChatMsg[], 
        input: string, 
        setInput: (v: string) => void, 
        onSubmit: (e?: React.FormEvent) => void,
        endRef: React.RefObject<HTMLDivElement | null>,
        title: string
    ) => (
        <div className="max-w-2xl mx-auto h-full flex flex-col pt-6 px-4">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#e6e9ef]">
                <button onClick={() => setAppState('home')} className="w-8 h-8 rounded-md hover:bg-[#f5f6f8] flex items-center justify-center text-[#676879]">
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </button>
                <h2 className="text-[16px] font-medium text-[#323338]">{title}</h2>
                <div className="ml-auto flex items-center gap-1 text-[12px] text-[#676879]">
                    <span className="w-2 h-2 rounded-full bg-[#00c875] animate-pulse"></span>
                    Live
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-4 space-y-3 custom-scrollbar">
                {thread.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-200`}>
                        {msg.role === 'ai' && (
                            <div className="w-7 h-7 rounded-full bg-[#0073ea] flex items-center justify-center text-white text-[11px] font-bold shrink-0 mr-2 mt-1">A</div>
                        )}
                        <div className={`max-w-[80%] px-4 py-3 rounded-xl text-[14px] leading-relaxed whitespace-pre-line ${
                            msg.role === 'user' 
                            ? 'bg-[#0073ea] text-white rounded-br-sm' 
                            : 'bg-[#f5f6f8] text-[#323338] rounded-bl-sm'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex items-center gap-2 text-[#676879] text-[13px]">
                        <div className="w-7 h-7 rounded-full bg-[#0073ea] flex items-center justify-center text-white text-[11px] font-bold">A</div>
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#676879] animate-bounce [animation-delay:0ms]"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#676879] animate-bounce [animation-delay:150ms]"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#676879] animate-bounce [animation-delay:300ms]"></span>
                        </div>
                    </div>
                )}
                <div ref={endRef} />
            </div>

            <form onSubmit={onSubmit} className="mt-auto bg-white border border-[#c3c6d4] rounded-[24px] flex items-center justify-between p-1.5 shadow-sm mb-4">
                <div className="flex items-center gap-1 pl-2">
                    <button type="button" className="w-8 h-8 rounded-full flex items-center justify-center text-[#676879] hover:bg-[#f5f6f8] transition-colors" title="Attach">
                        <span className="material-symbols-outlined text-[18px]">attach_file</span>
                    </button>
                    <input 
                        value={isRecording && (appState === 'discuss' || appState === 'solutions-chat') && liveTranscript ? liveTranscript : input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your response..." 
                        className="flex-1 min-w-[300px] bg-transparent px-2 py-2 outline-none text-[14px] text-[#323338] placeholder-[#b8bccc]"
                        autoFocus
                    />
                </div>
                <div className="flex items-center gap-1 pr-1">
                    <button 
                        type="button"
                        onClick={toggleVoice}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-black text-white hover:scale-105 shadow-md animate-pulse' : 'text-[#676879] hover:bg-[#f5f6f8] hover:text-[#323338]'}`}
                        title="Voice Mode"
                    >
                        <span className="material-symbols-outlined text-[18px]">{isRecording ? 'graphic_eq' : 'mic'}</span>
                    </button>
                    <button type="submit" disabled={!input.trim() && !liveTranscript.trim()} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${(input.trim() || liveTranscript.trim()) ? 'bg-[#0073ea] text-white hover:scale-105 shadow-sm' : 'bg-[#f0f1f3] text-[#c3c6d4]'}`}>
                        <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                    </button>
                </div>
            </form>
        </div>
    );

    /* ── Render: Home ──────────────────────────────────── */
    const renderHome = () => (
        <div className="pt-10 pb-12 flex flex-col items-center min-h-full px-4 animate-in fade-in duration-300">
            {/* Header */}
            <div className="text-center mb-10 w-full max-w-2xl px-4">
                <h1 className="text-[32px] text-[#323338] font-medium tracking-tight">
                    {topTab === 'co-founder' ? `LaunchPad Startup Essentials` :
                     topTab === 'solutions' ? `Business Tools Lab` :
                     topTab === 'ai-agents' ? `AI Digital Team Hub` :
                     `Hi ${firstName}, what should we build?`}
                </h1>
                <p className="text-[#676879] text-[16px] mt-2 font-normal">
                    {topTab === 'co-founder' ? "I'll guide you through the setup of your business." :
                     topTab === 'solutions' ? "AI-powered tools to solve your specific business challenges" :
                     topTab === 'ai-agents' ? "Deploy specialized AI employees for your business" :
                     "Arkle can execute any task, from filing GST to building websites."}
                </p>

                {/* Smart Suggestion Pill for Industry */}
                {bizCtx.industry && (
                    <div className="mt-6 flex justify-center items-center gap-2 animate-in slide-in-from-bottom-2 duration-300">
                        <span className="text-[11px] font-bold text-[#00c875] bg-[#e6fff4] px-2.5 py-1 rounded-full uppercase">Industry Spot: {bizCtx.industry}</span>
                    </div>
                )}
            </div>

            {/* Top Navigation Buttons - Above Chat Box */}
            <div className="max-w-[850px] w-full flex items-center gap-2 mb-4">
                {([
                    { id: 'arkle' as TopTab, label: 'Arkle Co-Founder', icon: 'psychology' },
                    { id: 'co-founder' as TopTab, label: 'Startup Essentials', icon: 'rocket_launch' },
                    { id: 'solutions' as TopTab, label: 'Business Tools', icon: 'grid_view' },
                    { id: 'ai-agents' as TopTab, label: 'AI Digital Team', icon: 'smart_toy' },
                ]).map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setTopTab(tab.id); setAppState('home'); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-bold transition-all ${
                            topTab === tab.id 
                            ? 'bg-[#eef5ff] text-[#0073ea] shadow-sm' 
                            : 'text-[#676879] hover:bg-[#f5f6f8] hover:text-[#323338]'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Prompt Box */}
            <div className="max-w-[850px] w-full relative z-10 transition-all duration-500">
                <div className={`rounded-3xl border transition-all duration-300 overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,115,234,0.1)] relative ${
                    isRecording 
                    ? 'border-[#0073ea] shadow-[0_0_0_4px_rgba(0,115,234,0.15)] ring-2 ring-[#0073ea] scale-[1.02]' 
                    : 'border-[#e6e9ef] hover:border-[#c3c6d4]'
                }`}>
                    {/* Live voice indicator wave */}
                    {isRecording && (
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 animate-pulse"></div>
                    )}
                    
                    <textarea
                        value={isRecording ? liveTranscript : promptInput}
                        onChange={(e) => setPromptInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleDirectSubmit(); }}}
                        placeholder={
                            isRecording ? "Listening to you directly... Speak now" :
                            topTab === 'launchpad' ? "Tell me about your startup idea..." :
                            topTab === 'tools' ? "Describe a business problem you want to solve..." :
                            topTab === 'ai-team' ? "Which AI Employee do you need?" :
                            "Ask Arkle anything..."
                        }
                        className={`w-full bg-transparent border-none outline-none resize-none text-[16px] p-5 pb-2 font-medium ${isRecording ? 'text-blue-600' : 'text-[#323338]'} placeholder-[#b8bccc]`}
                        rows={isRecording ? 4 : 3}
                    />
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-t border-[#f0f1f3]">
                        <div className="flex items-center gap-3">
                            <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#676879] hover:bg-[#e6e9ef] hover:text-[#323338] transition-colors shadow-sm bg-white border border-[#e6e9ef]" title="Attach data">
                                <span className="material-symbols-outlined text-[18px]">attach_file</span>
                            </button>
                            {topTab === 'launchpad' && (
                                <button onClick={() => { setShowDiscovery(true); setDiscoveryStep(0); }} className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] text-[#0073ea] font-medium bg-[#eef5ff] hover:bg-[#ddebff] transition-all border border-blue-100 shadow-sm hover:shadow">
                                    <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
                                    {bizCtx.businessName ? "Optimize Strategy" : "Setup Strategy"}
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={toggleVoice} 
                                className={`h-11 px-4 rounded-full flex items-center justify-center gap-2 transition-all ${
                                    isRecording 
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl animate-pulse scale-110' 
                                    : 'bg-[#eef5ff] text-[#0073ea] hover:bg-[#ddebff] shadow-sm'
                                }`} 
                                title="Direct Voice Assistance"
                            >
                                <span className="material-symbols-outlined text-[20px]">{isRecording ? 'graphic_eq' : 'mic'}</span>
                                {isRecording && <span className="text-[13px] font-bold tracking-wider pr-1">Listening</span>}
                            </button>
                            <button 
                                onClick={handleDirectSubmit}
                                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                                    promptInput.trim() || liveTranscript.trim() 
                                    ? 'bg-[#0073ea] text-white shadow-md hover:scale-105' 
                                    : 'bg-[#f0f1f3] text-[#c3c6d4]'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">{isRecording ? 'send' : 'arrow_upward'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Messages - Only for Essentials mode */}
                {topTab === 'launchpad' && (
                    <div className="mt-4 flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-400">
                        {QUICK_MESSAGES.map((msg, i) => (
                            <button 
                                key={i}
                                onClick={() => setPromptInput(msg)}
                                className="px-3 py-1.5 bg-white border border-[#e6e9ef] rounded-full text-[12px] text-[#676879] hover:border-[#0073ea] hover:text-[#0073ea] hover:bg-[#eef5ff] transition-all shadow-sm flex items-center gap-1.5"
                            >
                                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                                {msg}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Services Grid — Only for essentials tab */}
            {(topTab === 'co-founder') && (
                <div className="w-full mt-10 max-w-4xl px-6">
                    <p className="text-center text-[15px] text-[#323338] mb-8 font-bold uppercase tracking-widest flex items-center justify-center gap-3">
                        <span className="h-px w-10 bg-[#e6e9ef]"></span>
                        Build Startup Essentials
                        <span className="h-px w-10 bg-[#e6e9ef]"></span>
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
                        {SERVICES.map(svc => {
                            const isSelected = selectedServices.includes(svc.id);
                            return (
                                <button
                                    key={svc.id}
                                    onClick={() => toggleService(svc.id)}
                                    className="flex flex-col items-center gap-3 group transition-all"
                                >
                                    <div 
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                                            isSelected 
                                            ? 'border-[#0073ea] bg-[#eef5ff] shadow-lg scale-110' 
                                            : 'border-[#e6e9ef] bg-white group-hover:border-[#0073ea] group-hover:shadow-md'
                                        }`}
                                    >
                                        <span 
                                            className="material-symbols-outlined text-[28px] transition-all" 
                                            style={{ color: isSelected ? '#0073ea' : svc.color }}
                                        >
                                            {svc.icon}
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <p className={`text-[13px] font-bold transition-colors ${
                                            isSelected ? 'text-[#0073ea]' : 'text-[#323338]'
                                        }`}>
                                            {svc.label}
                                        </p>
                                        <p className="text-[10px] text-[#676879] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {svc.desc.split(' ').slice(0, 2).join(' ')}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Solutions Tab Content Reordered */}
            {topTab === 'solutions' && (
                <div className="w-full flex flex-col items-center">
                    {/* Additional Apps Section (MOVED UP) */}
                    <div className="w-full mt-2 text-center animate-in fade-in slide-in-from-bottom-2">
                        <p className="text-[14px] text-[#676879] mb-4 font-medium">Want to build something specific?</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {['Build Apps', 'Web Applications', 'Tools', 'SaaS Products', 'Custom CRM'].map((item, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setPromptInput(`Help me build a ${item}...`)}
                                    className="px-6 py-2 bg-white border border-[#e6e9ef] rounded-xl text-[14px] text-[#323338] font-medium hover:border-[#0073ea] hover:text-[#0073ea] transition-all shadow-sm shadow-blue-500/5"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Solutions Cards (MOVED UP) */}
                    <div className="max-w-[680px] w-full mt-10 animate-in fade-in slide-in-from-bottom-3 flex flex-col items-center">
                        <p className="text-[14px] text-[#676879] mb-4 font-medium">Or get started with</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-2">
                            {[
                                { title: 'Build a Custom CRM', desc: 'Track leads, deals, and customer lifecycle', icon: 'group', clr: '#579bfc' },
                                { title: 'Create AI Agent', desc: 'Automate follow-ups, support, and workflows', icon: 'smart_toy', clr: '#9d94ff' },
                                { title: 'Performance Dashboard', desc: 'Real-time analytics on revenue and growth', icon: 'monitoring', clr: '#00c875' },
                                { title: 'Workflow Automation', desc: 'Connect tools and eliminate manual tasks', icon: 'account_tree', clr: '#ff7b00' },
                            ].map((card, i) => (
                                <button 
                                    key={i} 
                                    onClick={startSolutionsChat}
                                    className="flex items-start gap-4 p-5 bg-white border border-[#e6e9ef] rounded-2xl hover:border-[#c3c6d4] hover:shadow-md transition-all text-left group"
                                >
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${card.clr}15` }}>
                                        <span className="material-symbols-outlined text-[20px]" style={{ color: card.clr }}>{card.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-[15px] text-[#323338] font-medium group-hover:text-[#0073ea] transition-colors">{card.title}</p>
                                        <p className="text-[13px] text-[#676879] mt-1">{card.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Solutions Grid — Monday.com Vibe Ideas (MOVED DOWN) */}
                    <div className="w-full max-w-5xl mt-16 px-6 pb-12 animate-in fade-in slide-in-from-bottom-5">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-[20px] font-medium text-[#323338]">Start with an idea</h2>
                            <div className="flex items-center gap-4 text-[13px]">
                                {['All', 'Projects', 'Sales', 'Marketing', 'Operations', 'HR'].map((cat, i) => (
                                    <button key={i} className={`px-4 py-1.5 rounded-full border transition-all ${i === 0 ? 'bg-[#0073ea] text-white border-[#0073ea]' : 'bg-white text-[#676879] border-[#e6e9ef] hover:border-[#c3c6d4]'}`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {SOLUTION_IDEAS.map((idea, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => {
                                        setPromptInput(idea.prompt);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="group flex flex-col bg-white rounded-2xl border border-[#e6e9ef] hover:border-[#0073ea] hover:shadow-xl transition-all overflow-hidden text-left"
                                >
                                    <div className="h-40 w-full relative overflow-hidden bg-slate-50">
                                        {/* Template Preview Image */}
                                        <img 
                                            src={(idea as any).image} 
                                            alt={idea.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
                                        <div className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm">
                                            <span className="material-symbols-outlined text-[20px]" style={{ color: idea.clr }}>
                                                {idea.category === 'Marketing' ? 'campaign' : 
                                                 idea.category === 'Sales' ? 'monitoring' : 
                                                 idea.category === 'Operations' ? 'account_tree' : 'group'}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-2 py-1 rounded bg-white/90 w-fit backdrop-blur-sm shadow-sm select-none">
                                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: idea.clr }}></span>
                                            <span className="text-[10px] font-bold text-[#323338] uppercase tracking-wider">{idea.category}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white border-t border-[#e6e9ef] group-hover:border-[#0073ea] transition-colors">
                                        <p className="text-[14px] font-medium text-[#323338] group-hover:text-[#0073ea] transition-colors">{idea.title}</p>
                                        <p className="text-[12px] text-[#676879] mt-1 line-clamp-2">Visual-first startup template</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {selectedServices.length > 0 && topTab !== 'solutions' && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <button 
                        onClick={startBuilding}
                        className="px-8 py-3 bg-[#0073ea] hover:bg-[#0060c2] text-white text-[15px] font-medium rounded-full shadow-lg shadow-[#0073ea]/20 transition-all flex items-center gap-2 hover:-translate-y-px"
                    >
                        <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                        Generate ecosystem now
                    </button>
                </div>
            )}


            {/* AI Agents / Digital Employees — only show for ai-agents tab */}
            {topTab === 'ai-agents' && (
                <div className="max-w-[1000px] w-full mt-12 mb-10 px-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex flex-col items-center text-center mb-10">
                        <span className="px-3 py-1 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 text-indigo-600 rounded-full text-[11px] font-black uppercase tracking-widest mb-3 border border-indigo-100">Future of Work</span>
                        <h2 className="text-[26px] font-medium text-[#323338] tracking-tight">Hire Your Digital Team</h2>
                        <p className="text-[15px] text-[#676879] mt-2 max-w-2xl">Run an entire enterprise solo. Arkle's AI Agents act as your dedicated executive team, executing tasks autonomously 24/7 so you can focus on the big picture.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {DIGITAL_EMPLOYEES.map((emp) => (
                            <div key={emp.id} onClick={() => { setSelectedAgentId(emp.id); setAppState('agent-workspace'); }} className="relative group bg-white border border-[#e6e9ef] hover:border-[#0073ea] rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-start overflow-hidden text-left cursor-pointer">
                                {/* Subtle Background Accent */}
                                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-all blur-xl" style={{ backgroundColor: emp.clr }}></div>
                                
                                <div className="flex justify-between w-full items-start mb-4">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm relative z-10" style={{ backgroundColor: `${emp.clr}15`, color: emp.clr }}>
                                        <span className="material-symbols-outlined text-[24px]">{emp.icon}</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#f5f6f8] text-[#676879] border border-[#e6e9ef]">
                                        {emp.role}
                                    </span>
                                </div>
                                
                                <h3 className="text-[16px] font-bold text-[#323338] mb-1.5 leading-tight relative z-10">{emp.title}</h3>
                                <p className="text-[13px] text-[#676879] leading-relaxed flex-1 relative z-10">{emp.desc}</p>
                                
                                <div className="mt-5 w-full pt-4 border-t border-[#f0f1f3] flex items-center justify-between relative z-10">
                                    <span className={`text-[11px] font-bold uppercase tracking-wide ${emp.status === 'Available' ? 'text-[#00c875]' : 'text-[#ff7b00]'}`}>
                                        {emp.status}
                                    </span>
                                    <button 
                                        className="text-[#0073ea] opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-[12px] font-bold uppercase tracking-wider hover:underline"
                                        onClick={(e) => { e.stopPropagation(); setPromptInput(`I want to assign a task to my ${emp.title}...`); }}
                                    >
                                        Deploy <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 p-6 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between text-left border border-indigo-500/30">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-white text-[18px] font-bold mb-1">Need a Custom Workflow?</h3>
                            <p className="text-indigo-200 text-[14px]">Train a bespoke digital employee for your unique operational needs.</p>
                        </div>
                        <button className="px-6 py-2.5 bg-white text-slate-900 rounded-full text-[13px] font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-indigo-600">draw</span>
                            Build Custom Agent
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

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
                    <div key={asset.id} className="bg-white p-5 rounded-xl border border-[#e6e9ef] hover:border-[#c3c6d4] hover:shadow-md transition-all cursor-pointer group">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" style={{ background: `${asset.color}18` }}>
                            <span className="material-symbols-outlined text-[20px]" style={{ color: asset.color }}>{asset.icon}</span>
                        </div>
                        <h3 className="text-[15px] text-[#323338] font-medium">{asset.label}</h3>
                        <p className="text-[12px] text-[#676879] mt-1">Ready to customize</p>
                        <div className="flex items-center gap-1 mt-3 text-[12px] text-[#00c875] font-medium">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            Generated
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

                {/* Direct Chat / Assign Box */}
                <div className="p-4 bg-white border-t border-[#e6e9ef] shrink-0 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] pb-8 relative flex items-center justify-center">
                    <div className="max-w-4xl w-full mx-auto bg-white border border-[#c3c6d4] rounded-[24px] flex items-center justify-between p-1.5 shadow-sm">
                        <div className="flex items-center gap-1 pl-2">
                            <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#676879] hover:bg-[#f5f6f8] transition-colors" title="Attach">
                                <span className="material-symbols-outlined text-[18px]">attach_file</span>
                            </button>
                            <input 
                                value={isRecording && liveTranscript ? liveTranscript : agentTaskInput}
                                onChange={(e) => setAgentTaskInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleAgentTaskSubmit(); }}
                                placeholder={`Assign a task to ${agent.title}... (e.g. "Draft an email to clients")`}
                                className="flex-1 min-w-[400px] bg-transparent px-2 py-2 outline-none text-[15px] focus:bg-transparent text-[#323338] placeholder-[#b8bccc]"
                                disabled={isAgentWorking}
                            />
                        </div>
                        <div className="flex items-center gap-1 pr-1">
                            <button 
                                onClick={toggleVoice} 
                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-black text-white hover:scale-105 shadow-md animate-pulse' : 'text-[#676879] hover:bg-[#f5f6f8] hover:text-[#323338]'}`}
                                title="Voice Mode - Talk like a phone call"
                            >
                                <span className="material-symbols-outlined text-[18px]">{isRecording ? 'graphic_eq' : 'mic'}</span>
                            </button>
                            <button 
                                onClick={() => handleAgentTaskSubmit()}
                                disabled={isAgentWorking || (!agentTaskInput.trim() && !liveTranscript.trim())}
                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${(isAgentWorking || (!agentTaskInput.trim() && !liveTranscript.trim())) ? 'bg-[#f0f1f3] text-[#c3c6d4]' : 'bg-[#0073ea] text-white hover:scale-105 shadow-sm'}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">{isAgentWorking ? 'hourglass_empty' : 'arrow_upward'}</span>
                            </button>
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

    /* ── Main Layout ───────────────────────────────────── */
    return (
        <div className="flex h-[calc(100vh-60px)] -m-3 md:-m-5 overflow-hidden bg-white relative">
            
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#f4f7fe]">
                
                {/* Top Bar: Menu shifted to right */}
                <div className="sticky top-0 z-20 bg-[#f4f7fe]/95 backdrop-blur-sm border-b border-[#e6e9ef] px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {isRecording && (
                            <div className="flex items-center gap-3 px-4 py-1.5 bg-white rounded-full border border-blue-100 shadow-sm animate-in zoom-in-95">
                                <div className="flex gap-1 items-center h-4">
                                    {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
                                        <div key={i} className="w-[3px] bg-blue-500 rounded-full animate-voice-wave" style={{ height: `${h * 4}px`, animationDelay: `${i * 0.1}s` }}></div>
                                    ))}
                                </div>
                                <span className="text-[12px] text-blue-600 font-bold tracking-wide uppercase">Arkle Neutral Listening</span>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)} 
                        className="w-10 h-10 flex items-center justify-center text-[#676879] hover:bg-white hover:text-[#323338] rounded-full transition-all border border-transparent hover:border-[#e6e9ef] hover:shadow-sm mt-3"
                        title={sidebarOpen ? "Close Menu" : "Open Menu"}
                    >
                        <span className="material-symbols-outlined text-[20px]">{sidebarOpen ? 'chevron_right' : 'menu'}</span>
                    </button>
                </div>

                {/* Content Router */}
                {appState === 'home' && renderHome()}
                {appState === 'discuss' && renderChat(chatThread, chatInput, setChatInput, handleDiscussSubmit, chatEndRef, 'Co-Founder Discussion')}
                {appState === 'solutions-chat' && renderChat(solThread, solInput, setSolInput, handleSolSubmit, solEndRef, 'Solutions Lab')}
                {appState === 'building' && renderBuilding()}
                {appState === 'ready' && renderReady()}
                {appState === 'agent-workspace' && renderAgentWorkspace()}
            </div>

            {/* Inner Sidebar: Now on the Right */}
            <div className={`shrink-0 h-full border-l border-[#e6e9ef] bg-white transition-all overflow-hidden ${sidebarOpen ? 'w-[240px]' : 'w-0 border-none'}`}>
                <div className="p-3 pt-5 flex flex-col h-full">
                    {/* Sidebar menu items */}
                    <div className="space-y-2">
                        <button 
                            onClick={() => { setAppState('home'); }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${appState === 'home' ? 'bg-[#eef5ff] text-[#0073ea]' : 'hover:bg-[#f5f6f8] text-[#323338]'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                            <span className="text-[14px] font-normal">New Build</span>
                        </button>
                        <button 
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-[#f5f6f8] text-[#323338] transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">grid_view</span>
                            <span className="text-[14px] font-normal">My Apps</span>
                        </button>
                        <button 
                            onClick={startDiscussion}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-[#f5f6f8] text-[#323338] transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">chat</span>
                            <span className="text-[14px] font-normal">Discuss Context</span>
                        </button>
                    </div>

                    {/* Built Assets in sidebar */}
                    {builtAssets.length > 0 && builtAssets.some(a => a.status === 'done') && (
                        <div className="mt-6 pt-4 border-t border-[#e6e9ef]">
                            <p className="text-[11px] text-[#676879] font-medium uppercase tracking-wider px-3 mb-2">Recent Builds</p>
                            <div className="space-y-2">
                                {builtAssets.filter(a => a.status === 'done').map(asset => (
                                    <button key={asset.id} className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left hover:bg-[#f5f6f8] text-[#323338] transition-colors">
                                        <span className="material-symbols-outlined text-[16px]" style={{ color: asset.color }}>{asset.icon}</span>
                                        <span className="text-[13px] font-normal">{asset.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Business knowledge indicator & Gaps */}
                    {bizCtx.idea && (
                        <div className="mt-auto space-y-3">
                            {bizCtx.struggles && (
                                <div className="p-3 rounded-lg bg-orange-50 border border-orange-100 animate-pulse">
                                    <p className="text-[11px] text-orange-700 font-bold uppercase mb-1">Gap Detected</p>
                                    <p className="text-[12px] text-orange-800 leading-tight">I need to help you with **${bizCtx.struggles}** soon.</p>
                                </div>
                            )}
                            <div className="p-4 rounded-xl bg-[#f5f6f8] border border-[#e6e9ef] shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[11px] text-[#676879] font-bold uppercase tracking-widest">Strategy Base</p>
                                    <span className="w-2 h-2 rounded-full bg-[#00c875]"></span>
                                </div>
                                <p className="text-[13px] font-bold text-[#323338] mb-1">{bizCtx.businessName || 'Unnamed Venture'}</p>
                                <p className="text-[11px] text-[#676879] line-clamp-2 italic">"{bizCtx.idea}"</p>
                                
                                {bizCtx.colors.length > 0 && (
                                    <div className="flex gap-1.5 mt-3">
                                        {bizCtx.colors.map((c, i) => (
                                            <div key={i} className="w-4 h-4 rounded-md shadow-sm border border-white" style={{ backgroundColor: c }}></div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

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
            <DiscoveryModal />
            <BuildingModal />
            <style jsx>{`
                .font-outfit { font-family: 'Outfit', sans-serif; }
                @keyframes voice-wave {
                    0%, 100% { transform: scaleY(1); opacity: 0.3; }
                    50% { transform: scaleY(1.8); opacity: 1; }
                }
                .animate-voice-wave {
                    animation: voice-wave 0.8s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default LaunchPadTab;
