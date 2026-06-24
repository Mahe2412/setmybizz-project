'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Rocket, ArrowRight, ShieldCheck, Zap, Globe,
    MessageCircle, Building2, LayoutDashboard,
    CheckCircle2, Menu, X, Cpu, Star,
    Briefcase, PieChart, Shield, FileText,
    Globe2, BarChart3, Store, Landmark, Palette, Search, Users,
    ChevronLeft, ChevronRight, Monitor, Target, TrendingUp,
    Sparkles, Users2, Workflow, Mic, BrainCircuit, Activity,
    Award, Heart, Quote, AlertCircle, Layers, Lightbulb,
    Library, Headset, Box, ClipboardList, Gavel, FileCheck, Landmark as BankIcon,
    Send, Lock, Plane, Ship, Map, Scale, ChevronDown, Mail, Bot, LayoutGrid,
    ShoppingCart, Image as ImageIcon, BookOpen, LineChart, Share2, AudioLines
} from 'lucide-react';

const BIZ_SLIDES = [
    {
        id: 'setup',
        title: 'The Startup Engine',
        subtitle: 'Phase 1: Foundation',
        desc: 'Turning ideas into registered entities. We handle the complex legal work while you build your product.',
        features: ['Pvt Ltd / LLP Incorporation', 'Professional Trademark Search', 'GST & MSME Instant Filing'],
        icon: Building2,
        color: 'blue'
    },
    {
        id: 'compliance',
        title: 'Neural Compliance',
        subtitle: 'Phase 2: Operations',
        desc: 'Stop worrying about tax dates and filings. BizDesk AI tracks everything and notifies our experts to execute.',
        features: ['Automated GST Tracking', 'Annual Compliance Vault', 'TDS & Tax Advisory'],
        icon: ShieldCheck,
        color: 'purple'
    },
    {
        id: 'bizbook',
        title: 'BizBook Accounting',
        subtitle: 'Phase 2: SaaS Ledger',
        desc: 'Automate your bookkeeping, invoices, expense tracking, and financial statements reconciled seamlessly.',
        features: ['Smart GST Invoicing', 'Automatic Ledger Sync', 'Profit & Loss Reporting'],
        icon: FileText,
        color: 'indigo'
    },
    {
        id: 'sales',
        title: 'Sales Pipeline',
        subtitle: 'Phase 2: SaaS Sales',
        desc: 'Track deals, manage customer lists, and run automated sequences to boost your conversions.',
        features: ['Kanban Pipeline View', 'WhatsApp/Email Sequences', 'Performance Analytics'],
        icon: TrendingUp,
        color: 'rose'
    },
    {
        id: 'crm',
        title: 'CRM Suite',
        subtitle: 'Phase 2: SaaS CRM',
        desc: 'A unified customer relationship desk, support tickets, and communication history in one workspace.',
        features: ['360° Customer Profiles', 'Smart Helpdesk Ticketing', 'Team Collaboration Notes'],
        icon: Users,
        color: 'blue'
    }
];

const BIZ_LANDSCAPE_CARDS = {
    setup: [
        { title: 'Idea Validation & Structure', subTitle: 'Phase 1: Validate', desc: 'Identify the ideal company setup (Pvt Ltd, LLP, or OPC) based on business goals.', icon: Lightbulb, step: '01' },
        { title: 'Company Registration', subTitle: 'Phase 2: Incorporate', desc: 'End-to-end filing with MCA, DSC acquisition, PAN/TAN generation in 7 days.', icon: Building2, step: '02' },
        { title: 'Startup Tax Activation', subTitle: 'Phase 3: Launch', desc: 'GSTIN, Udyam MSME, and professional trademark registrations processed instantly.', icon: Award, step: '03' }
    ],
    compliance: [
        { title: 'GST & Compliance', subTitle: 'Zero-Error Filing', desc: 'Zero-error tax returns, periodic filings, MCA compliance, and legal audit prep.', icon: ShieldCheck, step: '01' },
        { title: 'BizBook', subTitle: '( AI books and invoicing )', desc: 'Generate smart invoices, track sales, and maintain books on autopilot.', icon: FileText, step: '02' },
        { title: '360° Professional Support', subTitle: 'By CA/CS & Experts', desc: 'Direct line to certified CA, CS, banking, and legal finance experts.', icon: Headset, step: '03' },
        { title: 'Arkle AI Business Brain', subTitle: 'Autonomous Agent', desc: 'Autonomous AI co-founder tracking legal, finance, and marketing operations.', icon: BrainCircuit, step: '04' }
    ],
    bizbook: [
        { title: 'Smart Ledger', subTitle: 'Automated Booking', desc: 'Real-time ledger entries, bank sync, and transaction categorization with CA approval.', icon: ClipboardList, step: '01' },
        { title: 'Pro Invoices', subTitle: 'Instant Billing', desc: 'Generate GST-compliant professional invoices with integrated payment collection links.', icon: FileText, step: '02' },
        { title: 'Tax & GST Reports', subTitle: 'One-click Exports', desc: 'Instantly download profit & loss reports, balance sheets, and GST filing readies.', icon: ShieldCheck, step: '03' }
    ],
    sales: [
        { title: 'Pipeline Visualizer', subTitle: 'Deal Flow Control', desc: 'Drag-and-drop kanban board to track deals from initial contact to successful closing.', icon: BarChart3, step: '01' },
        { title: 'Smart Sequencer', subTitle: 'Follow-ups on Autopilot', desc: 'Design context-aware automated email and WhatsApp drips to engage cold leads.', icon: Sparkles, step: '02' },
        { title: 'Performance Metrics', subTitle: 'Analytics Suite', desc: 'Monitor conversion rates, sales velocities, and team quotas in real-time.', icon: TrendingUp, step: '03' }
    ],
    crm: [
        { title: 'Unified Client Profiles', subTitle: '360° Customer View', desc: 'Keep track of all contact information, conversation history, notes, and attachments.', icon: Users2, step: '01' },
        { title: 'Resolution Desk', subTitle: 'Ticketing System', desc: 'Assign, prioritize, and resolve support requests without missing a beat.', icon: Headset, step: '02' },
        { title: 'Shared Collaboration', subTitle: 'Cross-functional Sync', desc: 'Tag team members directly in customer files to resolve inquiries fast.', icon: Users, step: '03' }
    ]
};

const ARKLE_SLIDES = [
    {
        id: 'voice',
        title: 'Voice Intelligence',
        subtitle: 'Super AI Layer',
        desc: 'Speak to your business as if it were a person. "Arkle, what is my GST liability for this month?"',
        features: ['Natural Language Voice Ops', 'Instant Context Awareness', 'Multi-lingual Support'],
        icon: Mic,
        color: 'blue'
    },
    {
        id: 'brain',
        title: 'Autonomous Brain',
        subtitle: 'Decision Engine',
        desc: 'Arkle doesn\'t just notify; it acts. From draft responses to scheduling complex compliance workflows.',
        features: ['Self-optimizing Workflows', 'Smart Data Correlation', 'Autonomous Documentation'],
        icon: BrainCircuit,
        color: 'indigo'
    },
    {
        id: 'proactive',
        title: 'Proactive Sentinel',
        subtitle: 'Risk Management',
        desc: 'Arkle scans the horizon for legal changes and risks, warning you before they become problems.',
        features: ['24/7 Risk Monitoring', 'Real-time Law Updates', 'Predictive Failure Analysis'],
        icon: Activity,
        color: 'rose'
    }
];

const LAUNCH_SLIDES = [
    {
        id: 'arkle',
        title: 'Arkle AI Developer',
        subtitle: 'Your Backend Team',
        desc: 'Build your entire startup in minutes. Arkle acts as your AI developer and backend team—generating your logo, website, apps, automations, brochures, and tools live. No coding or prompting skills needed; just answer simple questions and speak with Arkle to build it live.',
        features: ['Logo, Website & Brand Appearance', 'Custom Apps & Automations Live', 'Speak with Arkle & Build Live'],
        icon: BrainCircuit,
        color: 'blue'
    },
    {
        id: 'launcher',
        title: 'Startup Launcher',
        subtitle: 'Build & Launch Fast',
        desc: 'Go from an idea to a fully launched business in minutes. Instantly generate stunning brand kits, e-commerce stores, custom apps, and brochures all in one place.',
        features: ['No Tech Skills Needed', 'Zero Coding Required', 'Speak to Build Live'],
        icon: Rocket,
        color: 'indigo'
    },
    {
        id: 'toolhub',
        title: 'Tool Hub',
        subtitle: 'Custom Business Apps',
        desc: 'Build advanced internal tools, custom CRMs, and powerful business apps in minutes. Connect your entire workflow in one unified hub.',
        features: ['Custom CRM Builder', 'Instant Internal Tools', 'Unified Workflow Hub'],
        icon: Layers,
        color: 'emerald'
    },
    {
        id: 'aiagent',
        title: 'AGI Agents',
        subtitle: 'Business on Autopilot',
        desc: 'Build powerful AGI agents for your business and run your entire startup on autopilot. Delegate your workflows instantly.',
        features: ['Marketing Agents', 'Sales Agents', 'Social Media Agents'],
        icon: Users2,
        color: 'rose'
    }
];

const WORKSPACE_SLIDES = [
    {
        id: 'neural',
        title: 'Neural Hub',
        subtitle: 'Phase 1: Intelligence',
        desc: 'Chat with your entire business. Our AI analyzes your documents, legal filings, and data to give you instant answers.',
        features: ['Doc-to-Insights Engine', 'AI Business Strategist', '24/7 Virtual Assistant'],
        icon: Sparkles,
        color: 'violet'
    },
    {
        id: 'sync',
        title: 'Team Sync',
        subtitle: 'Phase 2: Collaboration',
        desc: 'The bridge between your team and our experts. A unified workspace for CAs, developers, and founders.',
        features: ['Multi-expert Chat Hub', 'Shared Task Boards', 'Secure File Repository'],
        icon: Users2,
        color: 'cyan'
    },
    {
        id: 'flow',
        title: 'Autonomous Flow',
        subtitle: 'Phase 3: Automation',
        desc: 'Let AI handle your daily grind. From scheduling meetings to generating compliance reports automatically.',
        features: ['AI Workflow Designer', 'Auto-report Generation', 'Intelligent Reminders'],
        icon: Workflow,
        color: 'amber'
    }
];

const CLIENT_LOGOS = [
    { name: 'Arkle AI', logo: 'https://cdn.brandfetch.io/id6v9V8m4f/theme/dark/logo.svg?c=1bfb6140510257321' },
    { name: 'Startup India', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Startup_India_Logo.svg/1200px-Startup_India_Logo.svg.png' },
    { name: 'MSME India', logo: 'https://msme.gov.in/sites/default/files/msme_logo.png' },
    { name: 'Razorpay', logo: 'https://razorpay.com/assets/razorpay-logo-white.svg' },
    { name: 'Google Cloud', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/2560px-Google_Cloud_logo.svg.png' }
];

const BIZDESK_TRAY_ITEMS = [
    { id: 'setup', label: 'Business Setup', icon: Building2, color: 'blue', hasSub: true },
    { id: 'global', label: 'Go Global', icon: Globe2, color: 'indigo', hasSub: true },
    { id: 'bizbook', label: 'BizBook (Inventory)', icon: ClipboardList, color: 'purple' },
    { id: 'advisor', label: 'AI Advisor', icon: BrainCircuit, color: 'rose' },
    { id: 'support', label: '365 Support', icon: Headset, color: 'emerald' },
    { id: 'all', label: 'Startup OS', icon: Zap, color: 'amber' }
];

const SUB_SERVICES = {
    setup: [
        { label: 'Pvt Ltd / LLP', icon: Building2 },
        { label: 'GST Reg / Filing', icon: FileCheck },
        { label: 'Udyam MSME', icon: Award },
        { label: 'Business Licenses', icon: Gavel },
        { label: 'Trademark Search', icon: Search },
        { label: 'Current Account', icon: BankIcon }
    ],
    global: [
        { label: 'Global Incorporation', icon: Globe },
        { label: 'US / UK / Dubai', icon: Map },
        { label: 'Market Access', icon: TrendingUp },
        { label: 'Export-Import (IEC)', icon: Ship },
        { label: 'International Tax', icon: Scale },
        { label: 'Global Branding', icon: Palette }
    ]
};

const SETUP_SERVICES = [
    { title: 'Private Limited', desc: 'Popular for startups seeking funding', price: '₹5,999', icon: Building2 },
    { title: 'LLP Registration', desc: 'Ideal for professional partnerships', price: '₹4,999', icon: Landmark },
    { title: 'One Person Company', desc: 'Single founder structure', price: '₹5,499', icon: Users },
    { title: 'GST Registration', desc: 'Mandatory tax registration', price: '₹999', icon: FileCheck },
    { title: 'MSME / Udyam', desc: 'Govt subsidies and benefit activation', price: '₹799', icon: Award },
    { title: 'Trademark Filing', desc: 'Secure brand name & logo rights', price: '₹1,999', icon: Search },
    { title: 'Import Export Code', desc: 'Necessary for global trading', price: '₹1,499', icon: Ship },
    { title: 'Professional Tax', desc: 'PT registration for employers', price: '₹1,299', icon: Scale },
    { title: 'Shop & Establishment', desc: 'Local municipal registration', price: '₹1,999', icon: Store },
    { title: 'PAN / TAN Registration', desc: 'Essential tax identity cards', price: '₹499', icon: ClipboardList },
    { title: 'Corporate Banking', desc: 'Instant partner business account', price: 'Free Integration', icon: BankIcon }
];

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
};

export default function HomePage() {
    const [bizName, setBizName] = useState('');
    const [homepageBizType, setHomepageBizType] = useState<'new' | 'existing'>('new');
    const [bizSlide, setBizSlide] = useState(0);
    const [bizAutoplayPaused, setBizAutoplayPaused] = useState(false);
    const [arkleSlide, setArkleSlide] = useState(0);
    const [launchSlide, setLaunchSlide] = useState(0);
    const [launchAutoplayPaused, setLaunchAutoplayPaused] = useState(false);
    const [workSlide, setWorkSlide] = useState(0);
    const [activeIdeTab, setActiveIdeTab] = useState('bizdesk');
    const [activeSubSlide, setActiveSubSlide] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [bizosDropdownOpen, setBizosDropdownOpen] = useState(false);
    const [activeSubTray, setActiveSubTray] = useState<string | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatStep, setChatStep] = useState(0);
    const [leadData, setLeadData] = useState({
        name: '',
        email: '',
        idea: '',
        stage: '',
        role: '',
        struggle: ''
    });
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (bizAutoplayPaused) return;
        const interval = setInterval(() => {
            setBizSlide((prev) => (prev + 1) % BIZ_SLIDES.length); // Dynamic slides total
        }, 4000);
        return () => clearInterval(interval);
    }, [bizAutoplayPaused]);

    useEffect(() => {
        if (launchAutoplayPaused) return;
        const interval = setInterval(() => {
            setLaunchSlide((prev) => (prev + 1) % LAUNCH_SLIDES.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [launchAutoplayPaused]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatStep, isChatOpen]);

    const openLeadBot = () => {
        setIsChatOpen(true);
        setChatStep(0);
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 font-sans overflow-x-hidden">
            {/* ── NAVIGATION ── */}
            <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-slate-100 py-4 shadow-sm' : 'bg-transparent py-6'}`}>
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3.5 group">
                        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Rocket className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-3xl font-black tracking-tighter">SetMyBizz</span>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-10 text-sm font-bold text-slate-500">
                        <Link href="/onboarding" className="hover:text-blue-600 transition-colors">Platform</Link>
                        <Link href="/onboarding" className="hover:text-blue-600 transition-colors">Services</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {/* bizOS Dropdown Button */}
                        <div className="relative flex items-center">
                            <div className="flex items-center gap-1">
                                <Link 
                                    href="/bizos" 
                                    className="text-sm font-black text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>bizOS</span>
                                </Link>
                                <button 
                                    onClick={() => setBizosDropdownOpen(!bizosDropdownOpen)}
                                    className="text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center p-1 rounded-full hover:bg-blue-50/50"
                                >
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${bizosDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                            </div>

                            {/* Dropdown Menu */}
                            {bizosDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setBizosDropdownOpen(false)} />
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-3 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 mb-1.5">
                                            Ecosystem Parts
                                        </div>
                                        <div className="space-y-0.5">
                                            {[
                                                { label: 'Bizdesk', href: '/os?topNav=bizdesk&tab=home', desc: 'Manage legal & finance' },
                                                { label: 'Launchpad', href: '/os?topNav=launchpad', desc: 'Design brand assets' },
                                                { label: 'Ai workspace', href: '/os?topNav=ai-workspace', desc: 'AI co-founder workspace' },
                                                { label: 'Arkle', href: '/os?arkle=true', desc: 'Voice assistant agent' }
                                            ].map((item) => (
                                                <Link
                                                    key={item.label}
                                                    href={item.href}
                                                    onClick={() => setBizosDropdownOpen(false)}
                                                    className="block w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-all group"
                                                >
                                                    <span className="block text-[11.5px] font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                                                        {item.label}
                                                    </span>
                                                    <span className="block text-[8.5px] font-medium text-slate-400 mt-0.5 leading-none">
                                                        {item.desc}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <Link href="/onboarding?view=login" className="hidden sm:flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-slate-700 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                            <Lock className="w-3.5 h-3.5" /> BizDesk Login
                        </Link>
                        <Link href="/onboarding" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                            Early Access
                        </Link>
                    </div>
                </div>
            </header>

            <main>
                {/* ── HERO ── */}
                <section className="relative pt-40 pb-24 px-6 lg:px-12 xl:px-20 text-center lg:text-left">
                    {/* Subtle Top Atmosphere Gradient */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-b from-blue-50/50 to-transparent rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="flex flex-col justify-center items-center lg:items-start pl-4 sm:pl-8 lg:pl-16">
                            {/* Premium Top Badge - FIXED WIDTH */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="inline-flex w-fit items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900 shadow-md mb-8 group transition-all duration-300"
                            >
                                <span className="relative flex h-2.5 w-2.5 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                                    India's First AI Business Operating System
                                </span>
                            </motion.div>

                            {/* State-of-the-art Heading - REDUCED SIZE */}
                            <h1 className="text-5xl lg:text-6xl xl:text-[70px] font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                                Simplifying your <br />
                                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent pb-2 block">
                                    business journey.
                                </span>
                            </h1>

                            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12 max-w-xl">
                                Run your entire business from one AI brain — legal, finance, sales, compliance and growth — with zero setup skills.
                            </p>

                            {/* Premium Integrated Input & CTA Bar - IMPROVED PADDING */}
                            <div className="max-w-lg w-full">
                                <div className="w-full p-2 bg-white border-2 border-slate-100 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row items-center gap-2 transition-all duration-300 focus-within:border-blue-500 focus-within:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.15)]">
                                    <div className="flex items-center gap-3 w-full px-4 py-3">
                                        <Briefcase className="w-5 h-5 text-slate-400 shrink-0" />
                                        <input
                                            type="text"
                                            value={bizName}
                                            onChange={(e) => setBizName(e.target.value)}
                                            placeholder="Enter your business name or idea..."
                                            className="w-full bg-transparent border-none focus:outline-none font-bold text-slate-800 placeholder:text-slate-300 text-base"
                                        />
                                    </div>
                                    <Link
                                        href={`/onboarding?name=${encodeURIComponent(bizName)}`}
                                        className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm hover:bg-slate-900 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 whitespace-nowrap shrink-0 group shadow-lg shadow-blue-500/25"
                                    >
                                        <span>Build My BizOS</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>

                                {/* Micro Trust Pillars */}
                                <div className="flex flex-wrap items-center gap-6 mt-8 text-sm font-bold text-slate-400">
                                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant Execution</span>
                                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI Context Aware</span>
                                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Live Experts</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Visual Masterpiece: Neural Engine & Orbiting Modules */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="relative h-[400px] lg:h-[600px] flex items-center justify-center mt-12 lg:mt-0 pointer-events-none"
                        >
                            {/* Outer Atmosphere Glow */}
                            <div className="absolute w-[320px] h-[320px] lg:w-[480px] lg:h-[480px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/10 to-violet-500/15 rounded-full blur-[100px] animate-pulse" />

                            {/* Subtle Radial Pattern Grid */}
                            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

                            {/* Central Premium Glassmorphic Neural Hub */}
                            <motion.div
                                animate={{ y: [-8, 8, -8] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="w-64 h-64 lg:w-72 lg:h-72 bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-blue-500/10 flex flex-col items-center justify-center p-8 border border-white/80 relative z-20"
                            >
                                <div className="absolute -top-3 inset-x-0 flex justify-center">
                                    <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-xs">
                                        Arkle Core v2.0
                                    </span>
                                </div>
                                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-blue-50 to-indigo-50/50 flex items-center justify-center mb-5 border border-blue-100/50 shadow-inner">
                                    <Cpu className="w-10 h-10 text-blue-600 animate-pulse" />
                                </div>
                                <div className="font-black text-slate-900 text-xl tracking-tight">Neural Engine</div>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50 animate-pulse" />
                                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">System Autonomous</span>
                                </div>

                                {/* Metrics Tray */}
                                <div className="w-full mt-6 pt-5 border-t border-slate-100/80 flex items-center justify-around text-slate-400">
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs font-black text-slate-700">0ms</span>
                                        <span className="text-[8px] font-bold uppercase tracking-wider">Latency</span>
                                    </div>
                                    <div className="h-6 w-px bg-slate-100" />
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs font-black text-blue-600">100%</span>
                                        <span className="text-[8px] font-bold uppercase tracking-wider">Accuracy</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Orbiting Satellite 1: Legal Vault */}
                            <motion.div
                                animate={{ y: [0, -12, 0], x: [0, 6, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute top-12 left-4 lg:left-8 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-slate-100/80 flex items-center gap-3 z-30"
                            >
                                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs font-black text-slate-800">Compliance Vault</div>
                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Auto Tracking</div>
                                </div>
                            </motion.div>

                            {/* Orbiting Satellite 2: Growth Metrics */}
                            <motion.div
                                animate={{ y: [0, 12, 0], x: [0, -6, 0] }}
                                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-16 right-0 lg:right-6 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-slate-100/80 flex items-center gap-3 z-30"
                            >
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs font-black text-slate-800">Growth Pulse</div>
                                    <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Optimizing</div>
                                </div>
                            </motion.div>

                            {/* Floating decorative light nodes */}
                            <div className="absolute top-1/3 right-12 w-3 h-3 bg-blue-500 rounded-full shadow-md shadow-blue-500/50 animate-ping" />
                            <div className="absolute bottom-1/3 left-16 w-2.5 h-2.5 bg-violet-500 rounded-full shadow-md shadow-violet-500/50" />
                        </motion.div>
                    </div>
                </section>

                {/* ── BIZDESK QUICK TRAY (GLOSSY SMART BUTTONS) ── */}
                <motion.section {...fadeUp} className="px-6 lg:px-[12%] bg-white py-8 border-y border-slate-100 bg-slate-50 relative">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="flex flex-row items-center justify-center gap-2 p-2.5 bg-slate-50/50 backdrop-blur-2xl rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-500/5 overflow-x-auto no-scrollbar">
                            {BIZDESK_TRAY_ITEMS.map((item) => (
                                <Link
                                    key={item.id}
                                    href="/onboarding"
                                    onMouseEnter={() => item.hasSub && setActiveSubTray(item.id)}
                                    onMouseLeave={() => item.hasSub && setActiveSubTray(null)}
                                    className="flex items-center gap-2 px-3.5 py-2.5 bg-white rounded-2xl border border-slate-100 shadow-xs cursor-pointer group hover:border-blue-300 hover:shadow-md transition-all duration-300 shrink-0"
                                >
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-${item.color}-400 to-${item.color}-600 text-white flex items-center justify-center shadow-sm relative overflow-hidden group-hover:rotate-6 transition-all duration-300`}>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/30 opacity-50" />
                                        <item.icon className="w-3.5 h-3.5 relative z-10" />
                                    </div>
                                    <span className="text-[9.5px] font-black text-slate-800 uppercase tracking-[0.05em] whitespace-nowrap">{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        {/* SUB TRAY REVEAL */}
                        <AnimatePresence mode="wait">
                            {activeSubTray && SUB_SERVICES[activeSubTray as keyof typeof SUB_SERVICES] && (
                                <motion.div
                                    key={activeSubTray}
                                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 8, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                    onMouseEnter={() => setActiveSubTray(activeSubTray)}
                                    onMouseLeave={() => setActiveSubTray(null)}
                                    className="absolute left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-6"
                                >
                                    <div className={`bg-white/90 backdrop-blur-xl p-5 rounded-[2rem] border ${activeSubTray === 'setup' ? 'border-blue-100' : 'border-indigo-100'} shadow-2xl flex flex-wrap items-center justify-center gap-4`}>
                                        {SUB_SERVICES[activeSubTray as keyof typeof SUB_SERVICES].map((s) => (
                                            <div key={s.label} onClick={openLeadBot} className={`flex items-center gap-2.5 p-3 rounded-xl hover:bg-${activeSubTray === 'setup' ? 'blue' : 'indigo'}-50 transition-all group cursor-pointer`}>
                                                <div className={`w-8 h-8 rounded-lg bg-${activeSubTray === 'setup' ? 'blue' : 'indigo'}-50 text-${activeSubTray === 'setup' ? 'blue' : 'indigo'}-600 flex items-center justify-center group-hover:bg-${activeSubTray === 'setup' ? 'blue' : 'indigo'}-600 group-hover:text-white transition-all`}>
                                                    <s.icon className="w-4 h-4" />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">{s.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.section>

                {/* ── BIZ OS MASTER EXPLANATION ── */}
                <motion.section {...fadeUp} id="what-is-bizos" className="py-24 px-6 lg:pl-[12%] lg:pr-24 bg-white relative overflow-hidden">
                    <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch">
                        <div className="lg:w-[20%] border-b lg:border-b-0 lg:border-r border-slate-100 pb-8 lg:pb-0 lg:pr-8 mb-12 lg:mb-0">
                            <div className="sticky top-32 text-center lg:text-left">
                                <div className="text-red-600 font-black text-[10px] uppercase tracking-[0.2em] mb-4">• Run • Manage • Operate</div>
                                <h2 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none italic mb-6">
                                    Biz OS
                                </h2>
                                <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest max-w-xs mx-auto lg:mx-0">
                                    World&apos;s First AI Business Operating System. <br />
                                    <span className="text-slate-900 font-black mt-1 block">Business Made Simple</span>
                                </p>
                            </div>
                        </div>

                        <div className="lg:w-[80%] lg:pl-24">
                            <div className="max-w-4xl mb-16 text-center lg:text-left">
                                <h3 className="text-3xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tighter">What is Biz OS?</h3>
                                <p className="text-xl lg:text-2xl font-bold text-slate-800 leading-snug mb-3.5">
                                    Build, Run & Operate Your Business — Without a Team
                                </p>
                                <p className="text-base lg:text-lg text-slate-500 font-medium leading-relaxed">
                                    BizOS replaces tools, teams, and confusion with one intelligent system. Imagine if your company had a <span className="text-blue-600 font-bold italic">Central Brain</span> where legal, tech, and growth are handled seamlessly.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 relative">
                                <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-slate-100 -translate-y-1/2 z-0" />
                                <motion.div whileHover={{ y: -5 }} className="bg-slate-50 p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 relative z-10 hover:bg-white hover:shadow-2xl transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-6">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">Biz Admin</h4>
                                    <p className="text-xs lg:text-sm text-slate-500 font-bold leading-relaxed mb-6">Manage your entire business with Arkle — Books, Finance, CFO, Sales, HR & Expansion. Zero skills needed.</p>
                                    <div className="text-[10px] font-black text-red-500 uppercase tracking-widest">Everything with Arkle AI</div>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.05 }} className="bg-blue-600 p-8 lg:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-600/20 relative z-10 transform lg:scale-105">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center mb-6">
                                        <Rocket className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-xl font-black text-white mb-3 uppercase tracking-tight">Launchpad</h4>
                                    <p className="text-xs lg:text-sm text-white/90 font-bold leading-relaxed mb-6">Build & launch websites, custom apps, tools, and AI agents live. Just speak with Arkle — no coding, no developers, and zero cost to build.</p>
                                    <div className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Just Speak to Build Live</div>
                                </motion.div>

                                <motion.div whileHover={{ y: -5 }} className="bg-slate-50 p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 relative z-10 hover:bg-white hover:shadow-2xl transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                                        <Workflow className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">AI Workspace</h4>
                                    <p className="text-xs lg:text-sm text-slate-500 font-bold leading-relaxed mb-6">Design automated workflows to run and manage your entire business operations with ease. Custom built for Indian startups and MSMEs.</p>
                                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Built for Indian MSMEs</div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ── LIFECYCLE STRIP (REPLACED LOGOS) ── */}
                <motion.div {...fadeUp} className="py-8 lg:py-10 border-y border-slate-100 bg-white">
                    <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
                        <div className="flex flex-row items-center justify-center gap-4 lg:gap-8 text-left overflow-x-auto no-scrollbar py-4">
                            <div 
                                onClick={() => scrollToSection('bizdesk-section')} 
                                className="flex items-center gap-3 shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <Lightbulb className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-sm font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-all">BizDesk</span>
                                </div>
                            </div>
                            
                            <ArrowRight className="w-4 h-4 text-slate-300 hidden md:block shrink-0" />
                            
                            <div 
                                onClick={() => scrollToSection('launchpad-section')} 
                                className="flex items-center gap-3 shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-sm font-black text-slate-900 tracking-tight group-hover:text-indigo-605 transition-all">Launchpad</span>
                                </div>
                            </div>
                            
                            <ArrowRight className="w-4 h-4 text-slate-300 hidden md:block shrink-0" />
                            
                            <div 
                                onClick={() => scrollToSection('workspace-section')} 
                                className="flex items-center gap-3 shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shadow-inner border border-violet-200 group-hover:bg-violet-600 group-hover:text-white transition-all">
                                    <Workflow className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-sm font-black text-slate-900 tracking-tight group-hover:text-violet-600 transition-all">AI Workspace</span>
                                </div>
                            </div>

                            <ArrowRight className="w-4 h-4 text-slate-300 hidden md:block shrink-0" />
                            
                            <div 
                                onClick={() => scrollToSection('arkle-section')} 
                                className="flex items-center gap-3 shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center shadow-inner border border-fuchsia-200 group-hover:bg-fuchsia-600 group-hover:text-white transition-all">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-sm font-black text-slate-900 tracking-tight group-hover:text-fuchsia-600 transition-all">Arkle AI</span>
                                </div>
                            </div>

                            <ArrowRight className="w-4 h-4 text-slate-300 hidden md:block shrink-0" />
                            
                            <div 
                                onClick={() => scrollToSection('journey')} 
                                className="flex items-center gap-3 shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-sm font-black text-slate-900 tracking-tight group-hover:text-emerald-600 transition-all">Co-founder</span>
                                </div>
                            </div>
                            
                            <div className="hidden xl:block h-10 w-px bg-slate-200 mx-2 shrink-0" />
                            
                            <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200 shrink-0 hover:border-blue-300 transition-colors cursor-default">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                                </span>
                                <span className="text-[11px] font-bold text-slate-500">Powered by <span className="text-slate-900 font-black">Arkle AI</span></span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── BIZDESK SECTION ── */}
                <motion.section {...fadeUp} id="bizdesk-section" className="py-12 px-4 sm:px-12 md:px-24 lg:px-32 xl:px-48 bg-white relative overflow-hidden">
                    <div onMouseEnter={() => setBizAutoplayPaused(true)} onMouseLeave={() => setBizAutoplayPaused(false)} className="max-w-[1310px] mx-auto flex flex-col lg:flex-row items-stretch rounded-[3rem] border border-slate-100 bg-slate-50/50 shadow-2xl overflow-hidden min-h-[260px]">
                        
                        {/* Left Column (30% width) - Sky Blue Gradient with Vector Pattern */}
                        <div className="lg:w-[30%] bg-sky-50 border-r border-sky-100/80 p-6 lg:p-8 flex flex-col justify-between shrink-0 relative overflow-hidden">
                            {/* Vector Geometric Background */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230284c7' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-sky-100/50 to-transparent pointer-events-none" />
                            
                            <div className="relative z-10">
                                <div className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-2">Operations & Legal</div>
                                <h2 className="text-2xl font-black text-slate-950 mb-4 tracking-tight">BizDesk</h2>
                                
                                <nav className="space-y-2">
                                    {BIZ_SLIDES.map((slide, idx) => {
                                        const SlideIcon = slide.icon;
                                        const isActive = bizSlide === idx;
                                        return (
                                            <button
                                                key={slide.id}
                                                onClick={() => setBizSlide(idx)}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-300 border ${
                                                    isActive 
                                                    ? 'bg-white shadow-md border-sky-200' 
                                                    : 'hover:bg-sky-200/40 border-transparent'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100/80 text-blue-600'}`}>
                                                        <SlideIcon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-[12px] font-bold text-slate-900 leading-tight">{slide.title}</h3>
                                                        <span className="text-[9px] font-medium text-slate-500 leading-none mt-0.5 block">{slide.subtitle}</span>
                                                    </div>
                                                </div>
                                                <ChevronRight className={`w-3 h-3 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                            
                            <div className="pt-4 border-t border-sky-200/60 flex items-center gap-2 relative z-10">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                                </span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-sky-850">BizDesk Core Active</span>
                            </div>
                        </div>

                        {/* Right Column (70% width) - White Background */}
                        <div className="lg:w-[70%] bg-white p-6 lg:p-8 flex flex-col justify-center relative">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-b from-blue-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />
                            
                            <div className="w-full max-w-[95%] mx-auto relative z-10 flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    {BIZ_SLIDES.map((slide, idx) => {
                                        if (idx !== bizSlide) return null;
                                        const cards = BIZ_LANDSCAPE_CARDS[slide.id as keyof typeof BIZ_LANDSCAPE_CARDS] || [];
                                        
                                        if (slide.id === 'setup') {
                                            return (
                                                <motion.div 
                                                    key="bizdesk-onboarding-hook" 
                                                    initial={{ opacity: 0, y: 15 }} 
                                                    animate={{ opacity: 1, y: 0 }} 
                                                    exit={{ opacity: 0, y: -15 }} 
                                                    transition={{ duration: 0.3 }} 
                                                    className="w-full text-center space-y-8 py-4"
                                                >
                                                    <div className="space-y-3">
                                                        <div className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                                                            Setup Cell & Legal Desk
                                                        </div>
                                                        <h3 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-xl mx-auto">
                                                            Run your business with an AI brain. <br />
                                                            <span className="bg-gradient-to-r from-blue-600 to-violet-650 bg-clip-text text-transparent">Identify gaps, fix leaks, and automate every step.</span>
                                                        </h3>
                                                        <p className="text-sm text-slate-500 font-normal max-w-xl mx-auto leading-relaxed">
                                                            Your Business Command Center: legal, tax, finance, invoices, and operations coordinated by the AI brain.
                                                        </p>
                                                    </div>

                                                    {/* Toggle Switch */}
                                                    <div className="flex gap-2 p-1.5 bg-slate-100/90 rounded-2xl w-fit mx-auto shadow-xs border border-slate-200/50">
                                                        <button 
                                                            onClick={() => setHomepageBizType('new')}
                                                            className={`px-6 py-2.5 text-xs font-black rounded-xl transition-all ${homepageBizType === 'new' ? 'bg-white text-blue-600 shadow-sm border border-slate-205/20' : 'text-slate-550 hover:text-slate-800'}`}
                                                        >
                                                            New Idea / Startup Setup
                                                        </button>
                                                        <button 
                                                            onClick={() => setHomepageBizType('existing')}
                                                            className={`px-6 py-2.5 text-xs font-black rounded-xl transition-all ${homepageBizType === 'existing' ? 'bg-white text-blue-600 shadow-sm border border-slate-205/20' : 'text-slate-550 hover:text-slate-800'}`}
                                                        >
                                                            Existing Business Migration
                                                        </button>
                                                    </div>

                                                    {/* Custom Input & Action Button Container */}
                                                    <div className="max-w-md mx-auto bg-slate-50 border border-slate-150 p-4 rounded-[2rem] shadow-xl space-y-4">
                                                        <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-205 rounded-xl focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                                                            <Building2 className="w-5 h-5 text-slate-400 shrink-0" />
                                                            <input 
                                                                type="text" 
                                                                value={bizName}
                                                                onChange={(e) => setBizName(e.target.value)}
                                                                placeholder={homepageBizType === 'new' ? "What is your startup idea or name? (e.g. Acme Tech)" : "What is your registered company name? (e.g. Acme Labs Pvt Ltd)"}
                                                                className="w-full bg-transparent border-none outline-none text-sm font-bold text-slate-800 placeholder:text-slate-400"
                                                            />
                                                        </div>
                                                        <Link 
                                                            href={`/onboarding?name=${encodeURIComponent(bizName)}&type=${homepageBizType}`}
                                                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-widest text-center shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                                                        >
                                                            {homepageBizType === 'new' ? 'Build Business In Minutes 🚀' : 'Install Business OS & Connect CA ⚙️'}
                                                        </Link>
                                                    </div>

                                                    {/* Trust metrics under the onboarding card */}
                                                    <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-bold text-slate-400">
                                                        {homepageBizType === 'new' ? (
                                                            <>
                                                                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Tailor-Made Business Setup</span>
                                                                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Validate Idea Instantly</span>
                                                                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Free Expert Consultation</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> One Admin Business</span>
                                                                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Virtual CFO Support</span>
                                                                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Personal Business Advisor</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        }

                                        if (slide.id === 'bizbook') {
                                            return (
                                                <motion.div 
                                                    key="bizbook-marketing-hook" 
                                                    initial={{ opacity: 0, y: 15 }} 
                                                    animate={{ opacity: 1, y: 0 }} 
                                                    exit={{ opacity: 0, y: -15 }} 
                                                    transition={{ duration: 0.3 }} 
                                                    className="w-full space-y-6 py-4"
                                                >
                                                    <div className="space-y-3 text-center mx-auto max-w-2xl">
                                                        <div className="inline-flex px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                                                            Mobile billing shell
                                                        </div>
                                                        <h3 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                                            Launch BizBook — a clean, local billing app for MSMEs.
                                                        </h3>
                                                        <p className="text-sm text-slate-500 font-normal leading-relaxed">
                                                            One tool for GST invoices, customer ledger, product master, expense tracking, and payment follow-up.
                                                        </p>
                                                    </div>

                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Core features</div>
                                                            <ul className="space-y-3 text-sm text-slate-600">
                                                                <li>GST-ready invoices with partial payment</li>
                                                                <li>Product master + HSN + stock</li>
                                                                <li>Customer ledger with GSTIN & state</li>
                                                                <li>Expense tracker and receivables</li>
                                                            </ul>
                                                        </div>
                                                        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 flex flex-col justify-between">
                                                            <div>
                                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Ready to use</div>
                                                                <p className="text-sm text-slate-500 leading-relaxed">
                                                                    Open the working BizBook app directly and start billing from localhost. This is our fast, mobile-friendly GST billing flow built for Indian MSMEs.
                                                                </p>
                                                            </div>
                                                            <Link href="/bizbook" className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-black text-white uppercase tracking-[0.16em] shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700">
                                                                Open BizBook App
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        }

                                        if (slide.id === 'incorporation') {
                                            return (
                                                <motion.div 
                                                    key="bizdesk-incorporation-grid" 
                                                    initial={{ opacity: 0, y: 15 }} 
                                                    animate={{ opacity: 1, y: 0 }} 
                                                    exit={{ opacity: 0, y: -15 }} 
                                                    transition={{ duration: 0.3 }} 
                                                    className="w-full space-y-6 py-2"
                                                >
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                        <div>
                                                            <div className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider mb-3.5">
                                                                Setup Journey
                                                            </div>
                                                            <h3 className="text-3xl font-bold text-slate-900 tracking-normal leading-tight">
                                                                SetMyBizz Incorporation Services
                                                            </h3>
                                                            <p className="text-sm text-slate-500 font-normal leading-relaxed mt-1 max-w-xl">
                                                                Everything you need to set up and launch your business properly.
                                                            </p>
                                                        </div>
                                                        <Link href="/onboarding" className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:bg-emerald-700 transition-colors inline-block whitespace-nowrap shrink-0">
                                                            Start Incorporation
                                                        </Link>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[360px] overflow-y-auto no-scrollbar pb-2 pr-2">
                                                        {SETUP_SERVICES.map((srv, sIdx) => {
                                                            const SrvIcon = srv.icon;
                                                            return (
                                                                <div key={sIdx} onClick={() => window.location.href = '/onboarding'} className="bg-white border border-slate-200 hover:border-emerald-400 p-4 rounded-2xl flex flex-col items-start gap-3 cursor-pointer group transition-all hover:shadow-lg hover:-translate-y-1">
                                                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                                                        <SrvIcon className="w-5 h-5" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-sm font-bold text-slate-950 leading-tight mb-1">{srv.title}</h4>
                                                                        <p className="text-[11px] text-slate-500 font-normal leading-snug line-clamp-2">{srv.desc}</p>
                                                                    </div>
                                                                    <div className="mt-auto pt-2 w-full flex items-center justify-between border-t border-slate-100">
                                                                        <span className="text-xs font-semibold text-slate-900">{srv.price}</span>
                                                                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            );
                                        }

                                        return (
                                            <motion.div 
                                                key={slide.id} 
                                                initial={{ opacity: 0, y: 15 }} 
                                                animate={{ opacity: 1, y: 0 }} 
                                                exit={{ opacity: 0, y: -15 }} 
                                                transition={{ duration: 0.3 }} 
                                                className="space-y-6 w-full text-left cursor-pointer"
                                                onClick={() => window.location.href = '/onboarding'}
                                            >
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                    <div>
                                                        <div className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-3.5">
                                                            {slide.subtitle}
                                                        </div>
                                                        <h3 className="text-3xl font-bold text-slate-900 tracking-normal leading-tight">
                                                            {slide.title}
                                                        </h3>
                                                        <p className="text-sm text-slate-500 font-normal leading-relaxed mt-1.5 max-w-xl">
                                                            {slide.desc}
                                                        </p>
                                                    </div>
                                                    <Link href="/bizdesk" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:bg-blue-700 transition-colors inline-block whitespace-nowrap shrink-0">
                                                        Explore BizDesk
                                                    </Link>
                                                </div>

                                                {/* Landscape Horizontal Card Grid */}
                                                <div className={`grid gap-5 ${cards.length === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'}`}>
                                                    {cards.map((card, cIdx) => {
                                                        const CardIcon = card.icon;
                                                        return (
                                                            <div key={cIdx} className="bg-gradient-to-b from-slate-55/90 to-slate-100/50 backdrop-blur-md border border-slate-200/50 hover:border-blue-500/30 p-5 rounded-2xl transition-all duration-500 flex flex-col justify-between hover:shadow-[0_22px_50px_rgba(59,130,246,0.08)] hover:-translate-y-1.5 group min-h-[120px] relative overflow-hidden">
                                                                {/* Glowing accent border bottom line/glow */}
                                                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 via-indigo-500/0 to-violet-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-500 pointer-events-none" />
                                                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                                
                                                                <div className="space-y-3">
                                                                    <div className="flex justify-between items-center">
                                                                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/60 text-blue-600 flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-[0_8px_20px_rgba(59,130,246,0.25)] transition-all duration-500 shadow-xs">
                                                                            <CardIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-500" />
                                                                        </div>
                                                                        <span className="text-[9px] font-bold text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 tracking-wider">{card.step}</span>
                                                                    </div>
                                                                    <div className="space-y-1 text-left">
                                                                        <h4 className="text-[14px] lg:text-[15px] font-bold text-slate-900 tracking-normal group-hover:text-blue-600 transition-colors leading-snug">
                                                                            {card.title}
                                                                        </h4>
                                                                        {card.subTitle && (
                                                                            <div className="text-[9px] font-semibold text-indigo-650 uppercase tracking-wider leading-none mt-1">
                                                                                {card.subTitle}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-[11.5px] text-slate-500 font-normal leading-relaxed text-left group-hover:text-slate-600 transition-colors">{card.desc}</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ── LAUNCHPAD SECTION ── */}
                <motion.section {...fadeUp} id="launchpad-section" className="py-12 px-4 sm:px-12 md:px-24 lg:px-32 xl:px-48 bg-white relative overflow-hidden">
                    <div onMouseEnter={() => setLaunchAutoplayPaused(true)} onMouseLeave={() => setLaunchAutoplayPaused(false)} className="max-w-[1310px] mx-auto flex flex-col lg:flex-row items-stretch rounded-[3rem] border border-slate-100 bg-slate-50/50 shadow-2xl overflow-hidden min-h-[260px]">
                        
                        {/* Left Column (30% width) - Sky Blue Gradient */}
                        <div className="lg:w-[30%] bg-gradient-to-b from-sky-50 to-sky-100/50 border-r border-sky-100/80 p-6 lg:p-8 flex flex-col justify-between shrink-0">
                            <div>
                                <div className="text-rose-650 font-black text-[10px] uppercase tracking-[0.4em] mb-4">Brand & Growth</div>
                                <h2 className="text-3xl font-black text-slate-950 mb-8 tracking-tight">Launchpad</h2>
                                
                                <nav className="space-y-2">
                                    {LAUNCH_SLIDES.map((slide, idx) => {
                                        const SlideIcon = slide.icon;
                                        const isActive = launchSlide === idx;
                                        return (
                                            <button
                                                key={slide.id}
                                                onClick={() => setLaunchSlide(idx)}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-300 border ${
                                                    isActive 
                                                    ? 'bg-white shadow-md border-sky-200' 
                                                    : 'hover:bg-sky-200/40 border-transparent'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-rose-600 text-white' : 'bg-slate-100/80 text-rose-600'}`}>
                                                        <SlideIcon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-[11px] font-black text-slate-900 leading-tight">{slide.title}</h3>
                                                        <span className="text-[8px] font-semibold text-slate-400 leading-none">{slide.subtitle}</span>
                                                    </div>
                                                </div>
                                                <ChevronRight className={`w-3 h-3 ${isActive ? 'text-rose-600' : 'text-slate-400'}`} />
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                            
                            <div className="pt-6 border-t border-sky-200/60 flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                </span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-sky-850">Launchpad Core Active</span>
                            </div>
                        </div>

                        {/* Right Column (70% width) - White Background */}
                        <div className="lg:w-[70%] bg-white p-6 lg:p-8 flex flex-col justify-center relative">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-b from-rose-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />
                            
                            <div className="w-full max-w-[85%] mx-auto relative z-10 flex flex-col items-center justify-center">
                                {/* Top Navigation Pill - Absolutely positioned at the top of the screen card */}
                                <div className="absolute -top-14 sm:-top-8 left-1/2 -translate-x-1/2 z-30">
                                    <div className="flex bg-slate-100/80 backdrop-blur-md p-1.5 rounded-full shadow-inner border border-slate-200/50 gap-2">
                                        {[
                                            { id: 0, icon: BrainCircuit },
                                            { id: 1, icon: Rocket },
                                            { id: 2, icon: LayoutGrid },
                                            { id: 3, icon: Bot }
                                        ].map((item) => {
                                            const Icon = item.icon;
                                            const isActive = launchSlide === item.id;
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => setLaunchSlide(item.id)}
                                                    className={`p-3 rounded-full transition-all duration-300 ${
                                                        isActive 
                                                            ? 'bg-white text-orange-500 shadow-sm scale-105' 
                                                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                                                    }`}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    {LAUNCH_SLIDES.map((slide, idx) => {
                                        if (idx !== launchSlide) return null;
                                        
                                        if (slide.id === 'arkle') {
                                            return (
                                                <motion.div 
                                                    key={slide.id} 
                                                    initial={{ opacity: 0, scale: 0.95 }} 
                                                    animate={{ opacity: 1, scale: 1 }} 
                                                    exit={{ opacity: 0, scale: 0.95 }} 
                                                    transition={{ duration: 0.4 }} 
                                                    className="w-full relative min-h-[480px] flex flex-col items-center justify-center p-8 bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-700/50 shadow-2xl group"
                                                >
                                                    {/* Abstract Glassmorphism Backgrounds */}
                                                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />
                                                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-500/20 rounded-full blur-[80px] pointer-events-none" />
                                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />

                                                    {/* SVG Connection Waves */}
                                                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden sm:block" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                        <defs>
                                                            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
                                                                <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.1" />
                                                            </linearGradient>
                                                            <linearGradient id="waveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                                                                <stop offset="0%" stopColor="#34D399" stopOpacity="0.8" />
                                                                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.1" />
                                                            </linearGradient>
                                                            <linearGradient id="waveGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
                                                                <stop offset="0%" stopColor="#F472B6" stopOpacity="0.8" />
                                                                <stop offset="100%" stopColor="#818CF8" stopOpacity="0.1" />
                                                            </linearGradient>
                                                            <linearGradient id="waveGrad4" x1="100%" y1="100%" x2="0%" y2="0%">
                                                                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8" />
                                                                <stop offset="100%" stopColor="#F87171" stopOpacity="0.1" />
                                                            </linearGradient>
                                                        </defs>
                                                        
                                                        {/* From Center (50, 45) to Nodes */}
                                                        <motion.path d="M 50 45 C 40 45, 30 20, 25 20" fill="none" stroke="url(#waveGrad1)" strokeWidth="0.3" strokeDasharray="1.5 1.5" animate={{ strokeDashoffset: [5, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                                                        <motion.path d="M 50 45 C 60 45, 70 20, 75 20" fill="none" stroke="url(#waveGrad2)" strokeWidth="0.3" strokeDasharray="1.5 1.5" animate={{ strokeDashoffset: [5, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                                                        <motion.path d="M 50 45 C 40 45, 30 70, 25 70" fill="none" stroke="url(#waveGrad3)" strokeWidth="0.3" strokeDasharray="1.5 1.5" animate={{ strokeDashoffset: [5, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                                                        <motion.path d="M 50 45 C 60 45, 70 70, 75 70" fill="none" stroke="url(#waveGrad4)" strokeWidth="0.3" strokeDasharray="1.5 1.5" animate={{ strokeDashoffset: [5, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                                                        {/* Center down to Ready Solutions */}
                                                        <motion.path d="M 50 45 L 50 82" fill="none" stroke="#F43F5E" strokeOpacity="0.5" strokeWidth="0.3" strokeDasharray="1 1" animate={{ strokeDashoffset: [5, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                                                    </svg>

                                                    {/* Central Arkle Node */}
                                                    <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                                                        <motion.div 
                                                            initial={{ y: 10, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            transition={{ delay: 0.5, duration: 0.5 }}
                                                            className="absolute -top-14 bg-white text-blue-600 px-4 py-1.5 rounded-2xl rounded-br-none shadow-xl text-xs font-black tracking-tight border border-blue-100 whitespace-nowrap flex items-center gap-1.5"
                                                        >
                                                            <Sparkles className="w-3 h-3 text-blue-500" />
                                                            What can I build for you?
                                                            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white rotate-45 border-r border-b border-blue-100" />
                                                        </motion.div>

                                                        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(59,130,246,0.3)] flex items-center justify-center relative mt-4">
                                                            <div className="absolute inset-0 rounded-full border border-blue-400/50 animate-ping" style={{ animationDuration: '3s' }} />
                                                            <BrainCircuit className="w-10 h-10 text-blue-300" />
                                                        </div>
                                                        <h3 className="text-3xl font-black text-white mt-3 drop-shadow-lg tracking-tighter">Arkle</h3>
                                                        <div className="mt-1 text-[8px] font-bold text-blue-200 uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                                                            Your AI Partner
                                                        </div>
                                                    </div>

                                                    {/* Below Center: Ready Solutions */}
                                                    <div className="absolute top-[82%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 w-[240px] hidden sm:flex justify-center">
                                                        <motion.div whileHover={{ scale: 1.05 }} className="bg-slate-800/80 backdrop-blur-xl border border-rose-400/30 p-3 rounded-2xl shadow-xl flex items-center gap-3 w-full">
                                                            <div className="w-8 h-8 shrink-0 rounded-full bg-rose-500/20 flex items-center justify-center">
                                                                <CheckCircle2 className="w-4 h-4 text-rose-400" />
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] font-black text-white uppercase tracking-wider leading-tight">Ready-to-Use Solutions</div>
                                                                <div className="text-[8px] text-rose-200 leading-tight">Arkle builds the right tools</div>
                                                            </div>
                                                        </motion.div>
                                                    </div>

                                                    {/* Top Left: Apps */}
                                                    <div className="absolute top-[5%] left-[5%] sm:top-[20%] sm:left-[25%] sm:-translate-x-1/2 sm:-translate-y-1/2 z-20 w-[140px] sm:w-[180px]">
                                                        <motion.div whileHover={{ scale: 1.05 }} className="bg-slate-800/80 backdrop-blur-xl border border-blue-400/30 p-3 rounded-2xl shadow-xl flex items-center gap-3 relative">
                                                            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-lg">3</div>
                                                            <div className="w-8 h-8 shrink-0 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-400/20">
                                                                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] font-black text-white uppercase tracking-wider leading-tight">Apps</div>
                                                                <div className="text-[8px] text-blue-200 leading-tight">Built instantly</div>
                                                            </div>
                                                        </motion.div>
                                                        <div className="hidden sm:flex flex-wrap gap-1 mt-2 justify-center">
                                                            {['CRM', 'Billing', 'Helpdesk', 'HRM', 'Project'].map(chip => (
                                                                <span key={chip} className="px-1.5 py-0.5 bg-blue-900/40 border border-blue-400/20 rounded text-[7px] font-semibold text-blue-200">{chip}</span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Top Right: Website/Store */}
                                                    <div className="absolute top-[5%] right-[5%] sm:top-[20%] sm:left-[75%] sm:right-auto sm:-translate-x-1/2 sm:-translate-y-1/2 z-20 w-[140px] sm:w-[180px]">
                                                        <motion.div whileHover={{ scale: 1.05 }} className="bg-slate-800/80 backdrop-blur-xl border border-emerald-400/30 p-3 rounded-2xl shadow-xl flex items-center gap-3">
                                                            <div className="w-8 h-8 shrink-0 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-400/20">
                                                                <Monitor className="w-4 h-4 text-emerald-400" />
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] font-black text-white uppercase tracking-wider leading-tight">Website / Store</div>
                                                                <div className="text-[8px] text-emerald-200 leading-tight">E-commerce ready</div>
                                                            </div>
                                                        </motion.div>
                                                        <div className="hidden sm:flex flex-wrap gap-1 mt-2 justify-center">
                                                            {['Landing Page', 'E-commerce', 'Blog', 'Payments'].map(chip => (
                                                                <span key={chip} className="px-1.5 py-0.5 bg-emerald-900/40 border border-emerald-400/20 rounded text-[7px] font-semibold text-emerald-200">{chip}</span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Bottom Left: Digital Employees */}
                                                    <div className="absolute bottom-[5%] left-[5%] sm:bottom-auto sm:top-[68%] sm:left-[25%] sm:-translate-x-1/2 sm:-translate-y-1/2 z-20 w-[140px] sm:w-[180px]">
                                                        <motion.div whileHover={{ scale: 1.05 }} className="bg-slate-800/80 backdrop-blur-xl border border-fuchsia-400/30 p-3 rounded-2xl shadow-xl flex items-center gap-3">
                                                            <div className="w-8 h-8 shrink-0 rounded-lg bg-fuchsia-500/20 flex items-center justify-center border border-fuchsia-400/20">
                                                                <Users2 className="w-4 h-4 text-fuchsia-400" />
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] font-black text-white uppercase tracking-wider leading-tight">Advanced AI Agents</div>
                                                                <div className="text-[8px] text-fuchsia-200 leading-tight">Smart digital employees</div>
                                                            </div>
                                                        </motion.div>
                                                        <div className="hidden sm:flex flex-wrap gap-1 mt-2 justify-center">
                                                            {['Sales', 'Support', 'Marketing', 'Research'].map(chip => (
                                                                <span key={chip} className="px-1.5 py-0.5 bg-fuchsia-900/40 border border-fuchsia-400/20 rounded text-[7px] font-semibold text-fuchsia-200">{chip} Agent</span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Bottom Right: Performance & Gaps */}
                                                    <div className="absolute bottom-[5%] right-[5%] sm:bottom-auto sm:top-[68%] sm:left-[75%] sm:right-auto sm:-translate-x-1/2 sm:-translate-y-1/2 z-20 w-[140px] sm:w-[190px]">
                                                        <motion.div whileHover={{ scale: 1.05 }} className="bg-slate-800/80 backdrop-blur-xl border border-amber-400/30 p-3 rounded-2xl shadow-xl flex items-start gap-3">
                                                            <div className="w-8 h-8 shrink-0 rounded-lg bg-amber-500/20 flex items-center justify-center mt-0.5 border border-amber-400/20">
                                                                <Activity className="w-4 h-4 text-amber-400" />
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] font-black text-white uppercase tracking-wider leading-tight mb-1">Performance & Automation</div>
                                                                <div className="text-[8px] text-amber-200 leading-tight">Finds gaps & builds automation</div>
                                                            </div>
                                                        </motion.div>
                                                        <div className="hidden sm:flex flex-wrap gap-1 mt-2 justify-center">
                                                            {['Track Business', 'Analyze Gaps', 'Automation Tools'].map(chip => (
                                                                <span key={chip} className="px-1.5 py-0.5 bg-amber-900/40 border border-amber-400/20 rounded text-[7px] font-semibold text-amber-200">{chip}</span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Bottom Stepper Bar */}
                                                    <div className="hidden sm:flex absolute bottom-4 left-[50%] -translate-x-1/2 w-[95%] max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 items-center justify-around z-30 shadow-lg">
                                                        <div className="flex items-center gap-2.5">
                                                            <Zap className="w-4 h-4 text-blue-400" />
                                                            <div>
                                                                <div className="text-[9px] font-black text-white uppercase">One Idea</div>
                                                                <div className="text-[7px] text-slate-400">Start with your idea</div>
                                                            </div>
                                                        </div>
                                                        <div className="w-px h-6 bg-white/10" />
                                                        <div className="flex items-center gap-2.5">
                                                            <Sparkles className="w-4 h-4 text-fuchsia-400" />
                                                            <div>
                                                                <div className="text-[9px] font-black text-white uppercase">Arkle Builds</div>
                                                                <div className="text-[7px] text-slate-400">Everything you need</div>
                                                            </div>
                                                        </div>
                                                        <div className="w-px h-6 bg-white/10" />
                                                        <div className="flex items-center gap-2.5">
                                                            <Rocket className="w-4 h-4 text-emerald-400" />
                                                            <div>
                                                                <div className="text-[9px] font-black text-white uppercase">You Launch</div>
                                                                <div className="text-[7px] text-slate-400">Go live in no time</div>
                                                            </div>
                                                        </div>
                                                        <div className="w-px h-6 bg-white/10" />
                                                        <div className="flex items-center gap-2.5">
                                                            <TrendingUp className="w-4 h-4 text-amber-400" />
                                                            <div>
                                                                <div className="text-[9px] font-black text-white uppercase">We Optimize</div>
                                                                <div className="text-[7px] text-slate-400">Arkle keeps improving</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        }

                                        const SlideIcon = slide.icon;
                                        return (
                                            <motion.div 
                                                key={slide.id} 
                                                initial={{ opacity: 0, x: 15 }} 
                                                animate={{ opacity: 1, x: 0 }} 
                                                exit={{ opacity: 0, x: -15 }} 
                                                transition={{ duration: 0.3 }} 
                                                className="flex flex-col w-full gap-8"
                                            >
                                                <div className="grid lg:grid-cols-5 gap-10 items-center w-full">
                                                    <div className="lg:col-span-3 space-y-5 text-left">
                                                        <div className="inline-flex px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest">
                                                            {slide.subtitle}
                                                        </div>
                                                        <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                                                            {slide.title}
                                                        </h3>
                                                        <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                                                            {slide.desc}
                                                        </p>
                                                        <div className="grid sm:grid-cols-2 gap-3 pt-1">
                                                            {slide.features.map((f) => (
                                                                <div key={f} className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />{f}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="pt-4">
                                                            <Link href="/launchpad" className="px-8 py-3.5 bg-rose-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:opacity-90 transition-opacity inline-block">
                                                                Explore Launchpad
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <div className="lg:col-span-2 flex justify-center">
                                                        <div className="w-48 h-48 rounded-[2rem] bg-rose-50/50 border border-rose-100/50 flex items-center justify-center shadow-inner relative overflow-hidden group">
                                                            <SlideIcon className="w-20 h-20 text-rose-500 group-hover:scale-110 transition-transform duration-500" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {slide.id === 'launcher' && (
                                                    <div className="w-full max-w-5xl overflow-hidden px-4 py-5 mx-auto mt-6 bg-slate-100/40 backdrop-blur-md border border-white/60 shadow-sm rounded-2xl relative z-10">
                                                        <div className="flex items-end justify-start sm:justify-center overflow-x-auto gap-4 sm:gap-6 pb-2 hide-scrollbar">
                                                            {[
                                                                { label: 'ARKLE VOICE', icon: AudioLines, color: 'bg-gradient-to-br from-blue-400 to-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' },
                                                                { label: 'LOGO', icon: Palette, color: 'bg-gradient-to-br from-pink-500 to-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]' },
                                                                { label: 'WEBSITE', icon: Globe, color: 'bg-gradient-to-br from-blue-400 to-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' },
                                                                { label: 'ECOM STORE', icon: ShoppingCart, color: 'bg-gradient-to-br from-orange-400 to-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' },
                                                                { label: 'LANDING PAGES', icon: LayoutGrid, color: 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]', active: true },
                                                                { label: 'WEB PAGES', icon: Layers, color: 'bg-gradient-to-br from-purple-400 to-fuchsia-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' },
                                                                { label: 'IMAGES', icon: ImageIcon, color: 'bg-gradient-to-br from-rose-400 to-pink-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]' },
                                                                { label: 'BROCHURE', icon: BookOpen, color: 'bg-gradient-to-br from-orange-500 to-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' },
                                                                { label: 'PITCH DECK', icon: LineChart, color: 'bg-gradient-to-br from-fuchsia-400 to-purple-500 shadow-[0_0_15px_rgba(217,70,239,0.4)]' },
                                                                { label: 'SOCIAL MEDIA', icon: Share2, color: 'bg-gradient-to-br from-blue-400 to-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.4)]' }
                                                            ].map((item, i) => {
                                                                const Icon = item.icon || Mic; // fallback
                                                                return (
                                                                    <motion.div 
                                                                        key={i} 
                                                                        whileHover={{ y: -5, scale: 1.05 }}
                                                                        className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
                                                                    >
                                                                        <div className={`relative p-[3px] rounded-full ${item.active ? 'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]' : ''}`}>
                                                                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white ${item.color} border-2 border-white`}>
                                                                                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col items-center h-[18px]">
                                                                            <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider ${item.active ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                                                                {item.label}
                                                                            </span>
                                                                            {item.active && <div className="w-1 h-1 rounded-full bg-blue-500 mt-1" />}
                                                                        </div>
                                                                    </motion.div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ── AI WORKSPACE SECTION ── */}
                <motion.section {...fadeUp} id="workspace-section" className="py-12 px-4 sm:px-12 md:px-24 lg:px-32 xl:px-48 bg-white relative overflow-hidden">
                    <div className="max-w-[1310px] mx-auto flex flex-col lg:flex-row items-stretch rounded-[3rem] border border-slate-100 bg-slate-50/50 shadow-2xl overflow-hidden min-h-[260px]">
                        
                        {/* Left Column (30% width) - Sky Blue Gradient */}
                        <div className="lg:w-[30%] bg-gradient-to-b from-sky-50 to-sky-100/50 border-r border-sky-100/80 p-6 lg:p-8 flex flex-col justify-between shrink-0">
                            <div>
                                <div className="text-emerald-700 font-black text-[10px] uppercase tracking-[0.4em] mb-4">Sync & Collaboration</div>
                                <h2 className="text-3xl font-black text-slate-950 mb-8 tracking-tight">AI Workspace</h2>
                                
                                <nav className="space-y-2">
                                    {WORKSPACE_SLIDES.map((slide, idx) => {
                                        const SlideIcon = slide.icon;
                                        const isActive = workSlide === idx;
                                        return (
                                            <button
                                                key={slide.id}
                                                onClick={() => setWorkSlide(idx)}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-300 border ${
                                                    isActive 
                                                    ? 'bg-white shadow-md border-sky-200' 
                                                    : 'hover:bg-sky-200/40 border-transparent'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100/80 text-emerald-600'}`}>
                                                        <SlideIcon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-[11px] font-black text-slate-900 leading-tight">{slide.title}</h3>
                                                        <span className="text-[8px] font-semibold text-slate-400 leading-none">{slide.subtitle}</span>
                                                    </div>
                                                </div>
                                                <ChevronRight className={`w-3 h-3 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                            
                            <div className="pt-6 border-t border-sky-200/60 flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-sky-850">Workspace Core Active</span>
                            </div>
                        </div>

                        {/* Right Column (70% width) - White Background */}
                        <div className="lg:w-[70%] bg-white p-6 lg:p-8 flex flex-col justify-center relative">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-b from-emerald-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />
                            
                            <div className="w-full max-w-[85%] mx-auto relative z-10 flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    {WORKSPACE_SLIDES.map((slide, idx) => {
                                        if (idx !== workSlide) return null;
                                        const SlideIcon = slide.icon;
                                        return (
                                            <motion.div 
                                                key={slide.id} 
                                                initial={{ opacity: 0, x: 15 }} 
                                                animate={{ opacity: 1, x: 0 }} 
                                                exit={{ opacity: 0, x: -15 }} 
                                                transition={{ duration: 0.3 }} 
                                                className="grid lg:grid-cols-5 gap-10 items-center w-full"
                                            >
                                                <div className="lg:col-span-3 space-y-5 text-left">
                                                    <div className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                                        {slide.subtitle}
                                                    </div>
                                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                                                        {slide.title}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                                                        {slide.desc}
                                                    </p>
                                                    <div className="grid sm:grid-cols-2 gap-3 pt-1">
                                                        {slide.features.map((f) => (
                                                            <div key={f} className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{f}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="pt-4">
                                                        <Link href="/workspace" className="px-8 py-3.5 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:opacity-90 transition-opacity inline-block">
                                                            Explore Workspace
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="lg:col-span-2 flex justify-center">
                                                    <div className="w-48 h-48 rounded-[2rem] bg-emerald-50/50 border border-emerald-100/50 flex items-center justify-center shadow-inner relative overflow-hidden group">
                                                        <SlideIcon className="w-20 h-20 text-emerald-500 group-hover:scale-110 transition-transform duration-500" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ── ARKLE AI SECTION ── */}
                <motion.section {...fadeUp} id="arkle-section" className="py-12 px-12 sm:px-24 lg:px-32 xl:px-48 bg-white relative overflow-hidden border-t border-slate-55">
                    <div className="max-w-[1150px] mx-auto flex flex-col lg:flex-row items-stretch rounded-[3rem] border border-slate-100 bg-slate-50/50 shadow-2xl overflow-hidden min-h-[260px]">
                        
                        {/* Left Column (30% width) - Sky Blue Gradient */}
                        <div className="lg:w-[30%] bg-gradient-to-b from-sky-50 to-sky-100/50 border-r border-sky-100/80 p-6 lg:p-8 flex flex-col justify-between shrink-0">
                            <div>
                                <div className="text-indigo-700 font-black text-[10px] uppercase tracking-[0.4em] mb-4">Autonomous Agent</div>
                                <h2 className="text-3xl font-black text-slate-950 mb-8 tracking-tight">Arkle AI</h2>
                                
                                <nav className="space-y-2">
                                    {ARKLE_SLIDES.map((slide, idx) => {
                                        const SlideIcon = slide.icon;
                                        const isActive = arkleSlide === idx;
                                        return (
                                            <button
                                                key={slide.id}
                                                onClick={() => setArkleSlide(idx)}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-300 border ${
                                                    isActive 
                                                    ? 'bg-white shadow-md border-sky-200' 
                                                    : 'hover:bg-sky-200/40 border-transparent'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100/80 text-indigo-600'}`}>
                                                        <SlideIcon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-[11px] font-black text-slate-900 leading-tight">{slide.title}</h3>
                                                        <span className="text-[8px] font-semibold text-slate-400 leading-none">{slide.subtitle}</span>
                                                    </div>
                                                </div>
                                                <ChevronRight className={`w-3 h-3 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                            
                            <div className="pt-6 border-t border-sky-200/60 flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-sky-850">Arkle AI Core Active</span>
                            </div>
                        </div>

                        {/* Right Column (70% width) - White Background */}
                        <div className="lg:w-[70%] bg-white p-6 lg:p-8 flex flex-col justify-center relative">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-b from-indigo-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />
                            
                            <div className="w-full max-w-[85%] mx-auto relative z-10 flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    {ARKLE_SLIDES.map((slide, idx) => {
                                        if (idx !== arkleSlide) return null;
                                        const SlideIcon = slide.icon;
                                        return (
                                            <motion.div 
                                                key={slide.id} 
                                                initial={{ opacity: 0, x: 15 }} 
                                                animate={{ opacity: 1, x: 0 }} 
                                                exit={{ opacity: 0, x: -15 }} 
                                                transition={{ duration: 0.3 }} 
                                                className="grid lg:grid-cols-5 gap-10 items-center w-full"
                                            >
                                                <div className="lg:col-span-3 space-y-5 text-left">
                                                    <div className="inline-flex px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                                                        {slide.subtitle}
                                                    </div>
                                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                                                        {slide.title}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                                                        {slide.desc}
                                                    </p>
                                                    <div className="grid sm:grid-cols-2 gap-3 pt-1">
                                                        {slide.features.map((f) => (
                                                            <div key={f} className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />{f}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="pt-4">
                                                        <Link href="/arkle" className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:opacity-90 transition-opacity inline-block">
                                                            Consult Arkle AI
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="lg:col-span-2 flex justify-center">
                                                    <div className="w-48 h-48 rounded-[2rem] bg-indigo-50/50 border border-indigo-100/50 flex items-center justify-center shadow-inner relative overflow-hidden group">
                                                        <SlideIcon className="w-20 h-20 text-indigo-500 group-hover:scale-110 transition-transform duration-500" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ── THE JOURNEY ROADMAP ── */}
                <motion.section {...fadeUp} id="journey" className="py-24 px-6 lg:pl-[6%] lg:pr-12 bg-white relative overflow-hidden border-t border-slate-50">
                    <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row items-stretch">
                        <div className="lg:w-[15%] border-b lg:border-b-0 lg:border-r border-slate-100 pb-8 lg:pb-0 lg:pr-6 mb-12 lg:mb-0 flex flex-col justify-start">
                            <div className="sticky top-32 text-center lg:text-left">
                                <div className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4">Roadmap</div>
                                <h2 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none italic mb-4">
                                    Journey
                                </h2>
                            </div>
                        </div>

                        <div className="lg:w-[85%] lg:pl-12">
                            <div className="relative pt-4 lg:pt-8">
                                <div className="hidden lg:flex items-center absolute top-0 left-0 w-full px-6">
                                    <div className="h-0.5 bg-blue-600 w-1/4 relative"><div className="absolute -right-1.5 -top-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-50" /></div>
                                    <div className="h-0.5 bg-blue-600 w-1/4 relative"><div className="absolute -right-1.5 -top-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-50" /></div>
                                    <div className="h-0.5 bg-blue-600 w-1/4 relative"><div className="absolute -right-1.5 -top-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-50" /></div>
                                    <div className="h-0.5 bg-slate-100 w-1/4 relative"><div className="absolute -right-1.5 -top-1.5 w-3.5 h-3.5 rounded-full bg-slate-100" /></div>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                                    {['A', 'B', 'C', 'D'].map((step, i) => (
                                        <motion.div key={step} whileHover={{ y: -5 }} onClick={openLeadBot} className="bg-slate-50/50 backdrop-blur-xs p-6 lg:p-8 rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all duration-300 group cursor-pointer text-center lg:text-left">
                                            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-black mb-5 shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform mx-auto lg:mx-0">{step}</div>
                                            <h3 className="text-base lg:text-lg font-black text-slate-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors">
                                                {['The Plan', 'Arkle AI', 'BizDesk', 'Ecosystem'][i]}
                                            </h3>
                                            <p className="text-xs text-slate-500 font-bold leading-relaxed opacity-90">
                                                {[
                                                    'Map out your entire business lifecycle from scratch.',
                                                    'Activate your personal AI co-founder and advisor.',
                                                    'The command center for your legal foundation.',
                                                    'Scale your growth with LaunchPad and Workspace.'
                                                ][i]}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ── FINAL TRUST & SOCIAL PROOF SECTION ── */}
                <motion.section {...fadeUp} className="py-24 px-6 lg:px-[12%] bg-slate-50 border-t border-slate-100 overflow-hidden">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="lg:w-1/3 text-center lg:text-left">
                                <div className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4">SetMyBizz</div>
                                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-8">
                                    MSME / Startups <br className="hidden lg:block" /> We Served.
                                </h2>
                                <div className="space-y-8 max-w-xs mx-auto lg:mx-0">
                                    {[
                                        { label: 'Services Delivered', val: '500+', icon: Award },
                                        { label: 'Startups Incorporated', val: '100+', icon: Building2 },
                                        { label: 'Free Business Support', val: '365 Days', icon: Headset }
                                    ].map(stat => (
                                        <div key={stat.label} className="flex items-center gap-5 justify-center lg:justify-start">
                                            <div className="w-11 h-11 rounded-xl bg-white shadow-xs flex items-center justify-center shrink-0">
                                                <stat.icon className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-2xl font-black text-slate-900 leading-tight">{stat.val}</div>
                                                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{stat.label}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:w-2/3 grid md:grid-cols-2 gap-6 w-full">
                                {[
                                    { name: 'Tailor-Made Setup', role: 'Zero Failure Rate', quote: 'We provide tailor-made business setups with 365 days of free, dedicated support. We don\'t let your startup fall.', isBizOs: false },
                                    { name: 'The New Era', role: 'Coming Soon', quote: 'A new era of entrepreneurship is on the way. Get ready for BizOS — the ultimate AI Business Operating System.', isBizOs: true }
                                ].map((t, i) => (
                                    <motion.div key={i} whileHover={{ y: -5 }} className={`p-8 lg:p-10 rounded-[2rem] bg-white shadow-md border ${t.isBizOs ? 'border-blue-100' : 'border-white'} relative group text-left overflow-hidden`}>
                                        {t.isBizOs ? (
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-bl-[100px] flex items-start justify-end p-6">
                                                <Cpu className="w-10 h-10 text-blue-600/30 group-hover:text-blue-600/60 group-hover:scale-110 transition-all duration-300" />
                                            </div>
                                        ) : (
                                            <Quote className="absolute top-6 right-6 w-8 h-8 text-blue-500/5" />
                                        )}
                                        <p className="text-slate-600 text-sm lg:text-base font-medium leading-relaxed mb-6 italic relative z-10">"{t.quote}"</p>
                                        <div className="relative z-10">
                                            <div className="text-xs font-black text-slate-900 uppercase tracking-wider">{t.name}</div>
                                            <div className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${t.isBizOs ? 'text-blue-600' : 'text-blue-500'}`}>{t.role}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-24 pt-16 border-t border-slate-200 text-center flex flex-col items-center">
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-slate-900 shadow-[0_0_20px_rgba(59,130,246,0.3)] mb-8 border border-slate-700 cursor-pointer"
                            >
                                <Cpu className="w-4 h-4 text-blue-400" />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Powered by BizOS</span>
                            </motion.div>
                            <h3 className="text-2xl lg:text-4xl font-black text-slate-900 mb-8 tracking-tight">Ready to build your registered reality?</h3>
                            <button onClick={openLeadBot} className="inline-flex items-center gap-3 px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:opacity-95 transition-opacity">
                                Get Early Access 🚀
                            </button>
                        </div>
                    </div>
                </motion.section>

                <footer className="py-16 bg-white border-t border-slate-100 px-6">
                    <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-6 lg:px-12">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-xs">
                                <Rocket className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-black text-xl tracking-tighter">SetMyBizz</span>
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">© 2026 Business Operating System</div>
                    </div>
                </footer>
            </main>

            {/* ── ARKLE AI CHAT CONCIERGE (SMART DISCOVERY BOT) ── */}
            <div className="fixed bottom-8 right-8 z-[100]">
                <AnimatePresence>
                    {isChatOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 50, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.8, y: 50, filter: 'blur(10px)' }}
                            className="absolute bottom-20 right-0 w-[380px] sm:w-[420px] h-[550px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
                        >
                            {/* Chat Header */}
                            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-xs">
                                        <BrainCircuit className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-black text-xs uppercase tracking-widest">Arkle Discovery</div>
                                        <div className="text-[9px] font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Profiling Active
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsChatOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-all">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Discovery Progress Bar */}
                            <div className="h-1 bg-slate-100 w-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-600"
                                    animate={{ width: `${(chatStep / 6) * 100}%` }}
                                />
                            </div>

                            {/* Chat Body */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar bg-slate-50/50">
                                {/* Welcome Message */}
                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2.5 max-w-[92%]">
                                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs"><Sparkles className="w-3.5 h-3.5" /></div>
                                    <div className="bg-white p-4 rounded-[1.5rem] rounded-tl-none text-xs font-medium text-slate-700 leading-relaxed shadow-xs border border-slate-100">
                                        Namaste! I am <span className="text-blue-600 font-black">Arkle</span>. To build your perfect <span className="font-bold">BizOS</span>, I need to understand your journey.
                                    </div>
                                </motion.div>

                                {/* STEP 1: BUSINESS STAGE */}
                                {chatStep >= 0 && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5">
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-9">Select your stage</div>
                                        <div className="grid grid-cols-2 gap-2 ml-9">
                                            {[
                                                { id: 'idea', label: 'Just an Idea', icon: Lightbulb, color: 'blue' },
                                                { id: 'existing', label: 'Existing Business', icon: Building2, color: 'emerald' }
                                            ].map(s => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => { setLeadData({ ...leadData, stage: s.id }); setChatStep(1); }}
                                                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${leadData.stage === s.id ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10' : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200'}`}
                                                >
                                                    <s.icon className={`w-4 h-4 ${leadData.stage === s.id ? 'text-white' : `text-${s.color}-500`}`} />
                                                    <span className="text-[9px] font-black uppercase tracking-tight">{s.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 2: ROLE SELECTION */}
                                {chatStep >= 1 && (
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2.5 max-w-[92%]">
                                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs"><Users className="w-3.5 h-3.5" /></div>
                                        <div className="bg-white p-4 rounded-[1.5rem] rounded-tl-none text-xs font-medium text-slate-700 leading-relaxed shadow-xs border border-slate-100 w-full">
                                            Excellent. And what is your <span className="text-blue-600 font-bold">Role</span> in this venture?
                                            <div className="grid grid-cols-2 gap-1.5 mt-3">
                                                {['Founder/Owner', 'Marketing Lead', 'Operations Mgr', 'Developer'].map(r => (
                                                    <button
                                                        key={r}
                                                        onClick={() => { setLeadData({ ...leadData, role: r }); setChatStep(2); }}
                                                        className={`px-2.5 py-2 rounded-lg border text-[9px] font-black uppercase tracking-tight transition-all ${leadData.role === r ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200'}`}
                                                    >
                                                        {r}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 3: BUSINESS NAME/IDEA */}
                                {chatStep >= 2 && (
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2.5 max-w-[92%]">
                                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs"><Briefcase className="w-3.5 h-3.5" /></div>
                                        <div className="bg-white p-4 rounded-[1.5rem] rounded-tl-none text-xs font-medium text-slate-700 leading-relaxed shadow-xs border border-slate-100 w-full">
                                            Got it. What&apos;s the <span className="text-blue-600 font-bold">Name or Core Idea</span>?
                                            <div className="mt-3 flex gap-1.5">
                                                <input
                                                    type="text"
                                                    value={leadData.idea}
                                                    onChange={(e) => setLeadData({ ...leadData, idea: e.target.value })}
                                                    placeholder="e.g. NeoCommerce"
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none font-bold"
                                                />
                                                <button onClick={() => setChatStep(3)} className="p-2 bg-blue-600 text-white rounded-lg shadow-xs"><ArrowRight className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 4: STRUGGLE CAPTURE */}
                                {chatStep >= 3 && (
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2.5 max-w-[92%]">
                                        <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs"><Zap className="w-3.5 h-3.5" /></div>
                                        <div className="bg-white p-4 rounded-[1.5rem] rounded-tl-none text-xs font-medium text-slate-700 leading-relaxed shadow-xs border border-slate-100 w-full">
                                            Final Discovery: What is your <span className="text-rose-600 font-bold uppercase tracking-wider">biggest struggle</span> right now?
                                            <p className="text-[9px] text-slate-400 mt-0.5 italic">(Configures dashboard logic)</p>
                                            <div className="grid gap-1.5 mt-3">
                                                {[
                                                    'Legal & Registration',
                                                    'Tech & Website Build',
                                                    'Marketing & Lead Gen',
                                                    'Daily Operations Chaos'
                                                ].map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={() => { setLeadData({ ...leadData, struggle: s }); setChatStep(4); }}
                                                        className={`px-3 py-2 rounded-lg border text-[9px] font-black uppercase tracking-tight text-left transition-all ${leadData.struggle === s ? 'bg-rose-600 border-rose-600 text-white shadow-xs' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-rose-200'}`}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 5: CONTACT INFO */}
                                {chatStep >= 4 && (
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2.5 max-w-[92%]">
                                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs"><Mail className="w-3.5 h-3.5" /></div>
                                        <div className="bg-white p-4 rounded-[1.5rem] rounded-tl-none text-xs font-medium text-slate-700 leading-relaxed shadow-xs border border-slate-100 w-full">
                                            Discovery Complete. Ready to see your <span className="text-blue-600 font-bold uppercase tracking-wider">Custom BizOS</span>?
                                            <p className="text-[9px] text-slate-400 mt-0.5">Leave your email for the invite.</p>
                                            <div className="mt-3 flex flex-col gap-1.5">
                                                <input
                                                    type="email"
                                                    value={leadData.email}
                                                    onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                                                    placeholder="founder@company.com"
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none font-bold"
                                                />
                                                <input
                                                    type="text"
                                                    value={leadData.name}
                                                    onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                                                    placeholder="Your Full Name"
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none font-bold"
                                                />
                                                <button onClick={() => setChatStep(5)} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-black text-[9px] uppercase tracking-[0.15em] shadow-md mt-1">Initialize My BizOS 🚀</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 6: SUCCESS */}
                                {chatStep === 5 && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/20 blur-[40px]" />
                                        <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-4" />
                                        <h4 className="text-xl font-black mb-3 tracking-tight leading-tight">Configuring <br /> <span className="text-blue-500">{leadData.idea || 'Your'}</span> BizOS</h4>
                                        <div className="space-y-2.5 text-[11px] font-bold text-slate-400 leading-relaxed">
                                            <div className="flex items-center gap-2 text-emerald-400"><span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" /> Mapping {leadData.role || 'Founder'} Profile</div>
                                            <div className="flex items-center gap-2 text-blue-400"><span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" /> Prioritizing {leadData.struggle || 'Growth'} Module</div>
                                            <div className="flex items-center gap-2 text-slate-400"><span className="w-1 h-1 rounded-full bg-slate-600 shrink-0" /> Setting up {leadData.stage === 'idea' ? 'Incorporation' : 'Compliance'} Vault</div>
                                        </div>
                                        <p className="mt-5 text-[10px] text-slate-500 italic">Check your inbox, {(leadData.name || 'Founder').split(' ')[0]}. Arkle will reach out within 12 hours.</p>
                                    </motion.div>
                                )}

                                <div ref={chatEndRef} />
                            </div>

                            {/* Chat Footer */}
                            <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
                                <div className="flex-1 flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                                    <input
                                        type="text"
                                        placeholder="Arkle is listening..."
                                        className="flex-1 bg-transparent text-xs focus:outline-none font-medium"
                                    />
                                    <Mic className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 cursor-pointer shrink-0" />
                                </div>
                                <button className="p-2 bg-slate-900 text-white rounded-lg shadow-sm"><Send className="w-3.5 h-3.5" /></button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Chat Bubble */}
                <motion.button
                    whileHover={{ scale: 1.08, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/30 flex items-center justify-center border-2 border-white relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-transparent opacity-50" />
                    {isChatOpen ? <X className="w-6 h-6 relative z-10" /> : <MessageCircle className="w-6 h-6 relative z-10" />}

                    {/* Pulsing indicator */}
                    {!isChatOpen && (
                        <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full z-20" />
                    )}
                </motion.button>
            </div>
        </div>
    );
}
