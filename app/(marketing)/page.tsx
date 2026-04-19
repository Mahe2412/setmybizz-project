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
    Send, Lock, Plane, Ship, Map, Scale, ChevronDown
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
        id: 'growth',
        title: 'Scale & Intelligence',
        subtitle: 'Phase 2: Expansion',
        desc: 'Real-time analytics for your business growth. From market insights to funding readiness reports.',
        features: ['Neural Growth Analytics', 'Funding Readiness Audits', 'Market Access Strategy'],
        icon: Zap,
        color: 'emerald'
    }
];

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
        id: 'web',
        title: 'Web & Identity',
        subtitle: 'Phase 1: Presence',
        desc: 'Get your brand online in 24 hours. High-conversion websites and premium brand kits designed for growth.',
        features: ['24h Website Delivery', 'Premium Logo & Brand Kit', 'AI-Optimized Copywriting'],
        icon: Monitor,
        color: 'blue'
    },
    {
        id: 'leads',
        title: 'The Lead Machine',
        subtitle: 'Phase 2: Traffic',
        desc: 'Stop burning money on ads. We build automated lead funnels that find your customers where they live.',
        features: ['Google & Meta Ad Mgmt', 'SEO & Authority Building', 'Automated Lead Funnels'],
        icon: Target,
        color: 'rose'
    },
    {
        id: 'scale',
        title: 'Global Scalability',
        subtitle: 'Phase 3: Reach',
        desc: 'Expand your market globally. E-commerce setups and international marketing strategies made simple.',
        features: ['E-commerce Infrastructure', 'Global Market Analysis', 'CRM & Sales Automation'],
        icon: TrendingUp,
        color: 'indigo'
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

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};

export default function HomePage() {
    const [bizName, setBizName] = useState('');
    const [bizSlide, setBizSlide] = useState(0);
    const [arkleSlide, setArkleSlide] = useState(0);
    const [launchSlide, setLaunchSlide] = useState(0);
    const [workSlide, setWorkSlide] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [activeSubTray, setActiveSubTray] = useState(null);
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

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-slate-100 py-3 shadow-sm' : 'bg-transparent py-6'}`}>
                <div className="max-w-[1600px] mx-auto px-12 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Rocket className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter">SetMyBizz</span>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-10 text-sm font-bold text-slate-500">
                        <Link href="/onboarding" className="hover:text-blue-600 transition-colors">Platform</Link>
                        <Link href="/onboarding" className="hover:text-blue-600 transition-colors">Services</Link>
                    </nav>

                    <div className="flex items-center gap-4">
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
                <section className="relative pt-44 pb-32 px-12 lg:pl-[12%] text-center lg:text-left">
                    <div className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                India&apos;s First AI Business Operating System
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-10">
                                Simplifying your <br />
                                <span className="text-blue-600">business journey</span>
                            </h1>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0">
                                Navigate your business journey with an AI-powered platform built for every step — from idea to global market.
                            </p>
                            <div className="max-w-md mx-auto lg:mx-0 flex flex-col gap-4">
                                <input 
                                    type="text" 
                                    value={bizName}
                                    onChange={(e) => setBizName(e.target.value)}
                                    placeholder="Enter your business name"
                                    className="w-full px-8 py-5 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-blue-500/5 focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-bold text-slate-700"
                                />
                                <Link 
                                    href={`/onboarding?name=${encodeURIComponent(bizName)}`}
                                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl font-black text-xl shadow-2xl shadow-blue-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                                >
                                    Start My Business 🚀
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative h-[400px] lg:h-[600px] flex items-center justify-center opacity-50 lg:opacity-100">
                             <div className="w-96 h-96 bg-blue-100 rounded-full blur-[100px] absolute" />
                             <div className="w-64 h-64 bg-white rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-8 border border-slate-50">
                                <Cpu className="w-16 h-16 text-blue-600 mb-4 animate-pulse" />
                                <div className="font-black text-slate-900">Neural Engine</div>
                                <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Active</div>
                             </div>
                        </motion.div>
                    </div>
                </section>

                {/* ── LOGO STRIP (QUICK TRUST) ── */}
                <motion.div {...fadeUp} className="py-12 border-y border-slate-50 bg-slate-50/30">
                    <div className="max-w-[1600px] mx-auto px-12 overflow-hidden">
                        <div className="flex items-center justify-center gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700 overflow-x-auto no-scrollbar py-4">
                             {CLIENT_LOGOS.map(c => (
                                 <img key={c.name} src={c.logo} alt={c.name} className="h-8 md:h-12 w-auto flex-shrink-0" />
                             ))}
                        </div>
                    </div>
                </motion.div>

                {/* ── BIZ OS MASTER EXPLANATION ── */}
                <motion.section {...fadeUp} id="what-is-bizos" className="py-20 px-12 lg:pl-[12%] bg-white relative overflow-hidden">
                    <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch">
                        <div className="lg:w-[20%] border-r border-slate-100 pr-10 mb-12 lg:mb-0">
                             <div className="sticky top-32 transform lg:translate-x-[25%]">
                                <div className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4">The Definition</div>
                                <h2 className="text-6xl font-black text-slate-900 tracking-tighter leading-none italic mb-8">
                                    Biz OS
                                </h2>
                                <p className="text-sm font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                                    World&apos;s First Business Operating System.
                                </p>
                             </div>
                        </div>

                        <div className="lg:w-[80%] pl-0 lg:pl-32">
                            <div className="max-w-4xl mb-20">
                                <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter">What is Biz OS?</h3>
                                <p className="text-xl text-slate-500 font-medium leading-relaxed">
                                    Imagine if your company had a <span className="text-blue-600 font-bold italic">Central Brain</span>. No more juggling 5 different consultants, 10 software tools, and 20 spreadsheets. Biz OS is a unified layer where your legal, tech, and growth needs are managed by <span className="text-slate-900 font-black">AI & Expert Humans</span> in one place.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-10 relative">
                                <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-slate-100 -translate-y-1/2 z-0" />
                                <motion.div whileHover={{ y: -5 }} className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 relative z-10 hover:bg-white hover:shadow-2xl transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-8">
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">The Chaos</h4>
                                    <p className="text-sm text-slate-500 font-bold leading-relaxed mb-6">Disconnected CAs, Freelancers, and Agencies = Wasted Time & Money.</p>
                                    <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest">It Solves: Fragmentation</div>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.08 }} className="bg-blue-600 p-10 rounded-[2.5rem] shadow-2xl shadow-blue-600/20 relative z-10 transform scale-105">
                                    <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center mb-8">
                                        <Layers className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-xl font-black text-white mb-4 uppercase tracking-tight">The Hub</h4>
                                    <p className="text-sm text-white/80 font-bold leading-relaxed mb-6">Arkle AI analyzes your data. Our Experts execute the work. You approve.</p>
                                    <div className="text-[10px] font-black text-blue-200 uppercase tracking-widest">How: AI + Expert Synergy</div>
                                </motion.div>

                                <motion.div whileHover={{ y: -5 }} className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 relative z-10 hover:bg-white hover:shadow-2xl transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-8">
                                        <Lightbulb className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">The Result</h4>
                                    <p className="text-sm text-slate-500 font-bold leading-relaxed mb-6">0 Compliance Errors. 10x Faster Growth. Total Peace of Mind.</p>
                                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Why: Built for MSMEs</div>
                                </motion.div>
                            </div>

                            <div className="mt-20 p-12 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-10">
                                <div className="max-w-md">
                                    <h4 className="text-2xl font-black mb-4">Why for Startups & MSMEs?</h4>
                                    <p className="text-slate-400 font-medium">Because you should be building your <span className="text-white">Product</span>, not chasing legal dates and marketing agencies.</p>
                                </div>
                                <Link href="/onboarding" className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all flex items-center gap-2">
                                    Get Early Access <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ── BIZDESK QUICK TRAY (GLOSSY SMART BUTTONS) ── */}
                <motion.section {...fadeUp} className="px-12 lg:px-[12%] bg-white pb-10 relative">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="flex flex-wrap items-center justify-center gap-4 p-5 bg-slate-50/50 backdrop-blur-2xl rounded-[3rem] border border-slate-100 shadow-2xl shadow-blue-500/5">
                            {BIZDESK_TRAY_ITEMS.map((item) => (
                                <Link 
                                    key={item.id}
                                    href="/onboarding"
                                    onMouseEnter={() => item.hasSub && setActiveSubTray(item.id)}
                                    onMouseLeave={() => item.hasSub && setActiveSubTray(null)}
                                    className="flex items-center gap-4 px-7 py-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm cursor-pointer group hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500"
                                >
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-${item.color}-400 to-${item.color}-600 text-white flex items-center justify-center shadow-lg shadow-${item.color}-500/30 relative overflow-hidden group-hover:rotate-6 transition-all duration-500`}>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/30 opacity-50" />
                                        <item.icon className="w-5 h-5 relative z-10" />
                                    </div>
                                    <span className="text-xs font-black text-slate-800 uppercase tracking-[0.15em] whitespace-nowrap">{item.label}</span>
                                </Link>
                            ))}
                        </div>

                        {/* SUB TRAY REVEAL */}
                        <AnimatePresence mode="wait">
                            {activeSubTray && SUB_SERVICES[activeSubTray as keyof typeof SUB_SERVICES] && (
                                <motion.div 
                                    key={activeSubTray}
                                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 10, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                    onMouseEnter={() => setActiveSubTray(activeSubTray)}
                                    onMouseLeave={() => setActiveSubTray(null)}
                                    className="absolute left-1/2 -translate-x-1/2 z-20 w-full max-w-5xl"
                                >
                                    <div className={`bg-white/80 backdrop-blur-2xl p-6 rounded-[2.5rem] border ${activeSubTray === 'setup' ? 'border-blue-100' : 'border-indigo-100'} shadow-2xl flex flex-wrap items-center justify-center gap-6`}>
                                        {SUB_SERVICES[activeSubTray as keyof typeof SUB_SERVICES].map((s) => (
                                            <div key={s.label} onClick={openLeadBot} className={`flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-${activeSubTray === 'setup' ? 'blue' : 'indigo'}-50 transition-all group cursor-pointer`}>
                                                <div className={`w-10 h-10 rounded-xl bg-${activeSubTray === 'setup' ? 'blue' : 'indigo'}-50 text-${activeSubTray === 'setup' ? 'blue' : 'indigo'}-600 flex items-center justify-center group-hover:bg-${activeSubTray === 'setup' ? 'blue' : 'indigo'}-600 group-hover:text-white transition-all`}>
                                                    <s.icon className="w-5 h-5" />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{s.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.section>

                {/* ── BIZDESK SECTION ── */}
                <motion.section {...fadeUp} id="bizdesk" className="py-24 pl-6 lg:pl-[12%] pr-6 lg:pr-24 bg-white relative overflow-hidden border-t border-slate-50">
                    <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch">
                        <div className="lg:w-[20%] flex flex-col items-center lg:items-start pt-8 lg:pr-10 border-r border-slate-100">
                            <div className="sticky top-32 text-center lg:text-left w-full transform lg:translate-x-[35%] lg:translate-y-[-9%]">
                                <div className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-6">Operations</div>
                                <h2 className="text-6xl lg:text-[66px] font-black text-slate-900 tracking-tighter leading-[0.85] mb-8 italic">
                                    Biz<br />Desk
                                </h2>
                                <div className="hidden lg:flex items-center gap-4 mt-20">
                                    <button onClick={() => setBizSlide((prev) => (prev - 1 + BIZ_SLIDES.length) % BIZ_SLIDES.length)} className="p-4 rounded-full border border-slate-100 hover:bg-slate-50 transition-all">
                                        <ChevronLeft className="w-6 h-6 text-slate-400" />
                                    </button>
                                    <button onClick={() => setBizSlide((prev) => (prev + 1) % BIZ_SLIDES.length)} className="p-4 rounded-full bg-slate-900 text-white hover:bg-black shadow-xl transition-all">
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-[80%] pl-12 lg:pl-32 pt-12">
                            <div className="relative min-h-[500px]">
                                {BIZ_SLIDES.map((slide, idx) => (
                                    <div key={slide.id} className={`absolute inset-0 transition-all duration-700 ease-in-out ${idx === bizSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
                                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                                            <div className="lg:w-3/5">
                                                <div className={`inline-flex px-4 py-1.5 rounded-full bg-${slide.color}-50 text-${slide.color}-600 text-[10px] font-black uppercase tracking-widest mb-6`}>{slide.subtitle}</div>
                                                <h3 className="text-5xl font-black text-slate-900 mb-8 tracking-tight">{slide.title}</h3>
                                                <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">{slide.desc}</p>
                                                <div className="grid sm:grid-cols-2 gap-6">
                                                    {slide.features.map(f => (
                                                        <div key={f} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                                            <div className={`w-2 h-2 rounded-full bg-${slide.color}-500`} />{f}
                                                        </div>
                                                    ))}
                                                </div>
                                                <Link href="/onboarding" className={`mt-10 px-8 py-3 bg-${slide.color}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${slide.color}-500/20 text-center`}>Explore Component</Link>
                                            </div>
                                            <div className="lg:w-2/5">
                                                <div className={`w-64 h-64 md:w-80 md:h-80 rounded-[3rem] bg-${slide.color}-50 flex items-center justify-center shadow-inner relative overflow-hidden group`}>
                                                    <slide.icon className={`w-32 h-32 text-${slide.color}-500 group-hover:scale-110 transition-transform duration-500`} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ── ARKLE AI SECTION ── */}
                <motion.section {...fadeUp} id="arkle" className="py-20 pl-6 lg:pl-[12%] pr-6 lg:pr-24 bg-white relative overflow-hidden border-t border-slate-50">
                    <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row-reverse items-stretch">
                        <div className="lg:w-[20%] flex flex-col items-center lg:items-end pt-8 lg:pl-10 border-l border-slate-100">
                            <div className="sticky top-32 text-center lg:text-right w-full transform lg:translate-x-[-35%] lg:translate-y-[-9%]">
                                <div className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-6">Neural Core</div>
                                <h2 className="text-6xl lg:text-[66px] font-black text-slate-900 tracking-tighter leading-[0.85] mb-8 italic">
                                    Arkle<br />AI
                                </h2>
                                <div className="hidden lg:flex items-center justify-end gap-4 mt-20">
                                    <button onClick={() => setArkleSlide((prev) => (prev - 1 + ARKLE_SLIDES.length) % ARKLE_SLIDES.length)} className="p-4 rounded-full border border-slate-100 hover:bg-slate-50 transition-all">
                                        <ChevronLeft className="w-6 h-6 text-slate-400" />
                                    </button>
                                    <button onClick={() => setArkleSlide((prev) => (prev + 1) % ARKLE_SLIDES.length)} className="p-4 rounded-full bg-slate-900 text-white hover:bg-black shadow-xl transition-all">
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-[80%] pr-12 lg:pr-32 pt-12">
                            <div className="relative min-h-[500px]">
                                {ARKLE_SLIDES.map((slide, idx) => (
                                    <div key={slide.id} className={`absolute inset-0 transition-all duration-700 ease-in-out ${idx === arkleSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-10px] pointer-events-none'}`}>
                                        <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
                                            <div className="lg:w-3/5">
                                                <div className={`inline-flex px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6`}>{slide.subtitle}</div>
                                                <h3 className="text-5xl font-black text-slate-900 mb-8 tracking-tight">{slide.title}</h3>
                                                <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">{slide.desc}</p>
                                                <div className="grid sm:grid-cols-2 gap-6">
                                                    {slide.features.map(f => (
                                                        <div key={f} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                                            <div className={`w-2 h-2 rounded-full bg-blue-500`} />{f}
                                                        </div>
                                                    ))}
                                                </div>
                                                <Link href="/onboarding" className={`mt-10 px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 text-center`}>Connect Arkle</Link>
                                            </div>
                                            <div className="lg:w-2/5">
                                                <div className={`w-64 h-64 md:w-80 md:h-80 rounded-[3rem] bg-blue-50 flex items-center justify-center shadow-inner relative overflow-hidden group`}>
                                                    <slide.icon className={`w-32 h-32 text-blue-600 group-hover:scale-110 transition-transform duration-500`} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ── LAUNCHPAD SLIDER SECTION ── */}
                <motion.section {...fadeUp} id="launchpad" className="py-20 pl-6 lg:pl-[12%] pr-6 lg:pr-24 bg-slate-50 relative overflow-hidden">
                    <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch">
                        <div className="lg:w-[20%] flex flex-col items-center lg:items-start pt-8 lg:pr-10 border-r border-slate-200">
                            <div className="sticky top-32 text-center lg:text-left w-full transform lg:translate-x-[35%] lg:translate-y-[-9%]">
                                <div className="text-rose-600 font-black text-[10px] uppercase tracking-[0.5em] mb-6">Growth</div>
                                <h2 className="text-6xl lg:text-[66px] font-black text-slate-900 tracking-tighter leading-[0.85] mb-8 italic">
                                    Launch<br />Pad
                                </h2>
                                <div className="hidden lg:flex items-center gap-4 mt-20">
                                    <button onClick={() => setLaunchSlide((prev) => (prev - 1 + LAUNCH_SLIDES.length) % LAUNCH_SLIDES.length)} className="p-4 rounded-full border border-slate-100 hover:bg-white transition-all">
                                        <ChevronLeft className="w-6 h-6 text-slate-400" />
                                    </button>
                                    <button onClick={() => setLaunchSlide((prev) => (prev + 1) % LAUNCH_SLIDES.length)} className="p-4 rounded-full bg-slate-900 text-white hover:bg-black shadow-xl transition-all">
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-[80%] pl-12 lg:pl-32 pt-12">
                            <div className="relative min-h-[500px]">
                                {LAUNCH_SLIDES.map((slide, idx) => (
                                    <div key={slide.id} className={`absolute inset-0 transition-all duration-700 ease-in-out ${idx === launchSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
                                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                                            <div className="lg:w-3/5">
                                                <div className={`inline-flex px-4 py-1.5 rounded-full bg-${slide.color}-50 text-${slide.color}-600 text-[10px] font-black uppercase tracking-widest mb-6`}>{slide.subtitle}</div>
                                                <h3 className="text-5xl font-black text-slate-900 mb-8 tracking-tight">{slide.title}</h3>
                                                <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">{slide.desc}</p>
                                                <div className="grid sm:grid-cols-2 gap-6">
                                                    {slide.features.map(f => (
                                                        <div key={f} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                                            <div className={`w-2 h-2 rounded-full bg-${slide.color}-500`} />{f}
                                                        </div>
                                                    ))}
                                                </div>
                                                <Link href="/onboarding" className={`mt-10 px-8 py-3 bg-${slide.color}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${slide.color}-500/20 text-center`}>Launch My Brand</Link>
                                            </div>
                                            <div className="lg:w-2/5">
                                                <div className={`w-64 h-64 md:w-80 md:h-80 rounded-[3rem] bg-white flex items-center justify-center shadow-sm relative overflow-hidden group`}>
                                                    <slide.icon className={`w-32 h-32 text-${slide.color}-500 group-hover:scale-110 transition-transform duration-500`} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ── AI WORKSPACE SLIDER SECTION ── */}
                <motion.section {...fadeUp} id="workspace" className="py-20 pl-6 lg:pl-[12%] pr-6 lg:pr-24 bg-white relative overflow-hidden border-t border-slate-50">
                    <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch">
                        <div className="lg:w-[20%] flex flex-col items-center lg:items-start pt-8 lg:pr-10 border-r border-slate-100">
                            <div className="sticky top-32 text-center lg:text-left w-full transform lg:translate-x-[35%] lg:translate-y-[-9%]">
                                <div className="text-violet-600 font-black text-[10px] uppercase tracking-[0.5em] mb-6">Collaboration</div>
                                <h2 className="text-6xl lg:text-[66px] font-black text-slate-900 tracking-tighter leading-[0.85] mb-8 italic">
                                    AI<br />Workspace
                                </h2>
                                <div className="hidden lg:flex items-center gap-4 mt-20">
                                    <button onClick={() => setWorkSlide((prev) => (prev - 1 + WORKSPACE_SLIDES.length) % WORKSPACE_SLIDES.length)} className="p-4 rounded-full border border-slate-100 hover:bg-slate-50 transition-all">
                                        <ChevronLeft className="w-6 h-6 text-slate-400" />
                                    </button>
                                    <button onClick={() => setWorkSlide((prev) => (prev + 1) % WORKSPACE_SLIDES.length)} className="p-4 rounded-full bg-slate-900 text-white hover:bg-black shadow-xl transition-all">
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-[80%] pl-12 lg:pl-32 pt-12">
                            <div className="relative min-h-[500px]">
                                {WORKSPACE_SLIDES.map((slide, idx) => (
                                    <div key={slide.id} className={`absolute inset-0 transition-all duration-700 ease-in-out ${idx === workSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
                                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                                            <div className="lg:w-3/5">
                                                <div className={`inline-flex px-4 py-1.5 rounded-full bg-${slide.color}-50 text-${slide.color}-600 text-[10px] font-black uppercase tracking-widest mb-6`}>{slide.subtitle}</div>
                                                <h3 className="text-5xl font-black text-slate-900 mb-8 tracking-tight">{slide.title}</h3>
                                                <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">{slide.desc}</p>
                                                <div className="grid sm:grid-cols-2 gap-6">
                                                    {slide.features.map(f => (
                                                        <div key={f} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                                            <div className={`w-2 h-2 rounded-full bg-${slide.color}-500`} />{f}
                                                        </div>
                                                    ))}
                                                </div>
                                                <button onClick={openLeadBot} className={`mt-10 px-8 py-3 bg-${slide.color}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${slide.color}-500/20`}>Join Workspace</button>
                                            </div>
                                            <div className="lg:w-2/5">
                                                <div className={`w-64 h-64 md:w-80 md:h-80 rounded-[3rem] bg-${slide.color}-50 flex items-center justify-center shadow-inner relative overflow-hidden group`}>
                                                    <slide.icon className={`w-32 h-32 text-${slide.color}-500 group-hover:scale-110 transition-transform duration-500`} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ── THE JOURNEY ROADMAP ── */}
                <motion.section {...fadeUp} id="journey" className="py-20 pl-6 lg:pl-[6%] pr-6 lg:pr-12 bg-white relative overflow-hidden border-t border-slate-50">
                    <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row items-stretch">
                        <div className="lg:w-[15%] flex flex-col items-center lg:items-start pt-8 lg:pr-1 border-r border-slate-100">
                            <div className="sticky top-32 text-center lg:text-left w-full transform lg:translate-x-[20%] lg:translate-y-[-9%]">
                                <div className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-6">Roadmap</div>
                                <h2 className="text-6xl lg:text-[66px] font-black text-slate-900 tracking-tighter leading-[0.85] mb-8 italic">
                                    Journey
                                </h2>
                            </div>
                        </div>

                        <div className="lg:w-[85%] pl-6 lg:pl-12 pt-12">
                            <div className="relative">
                                <div className="hidden lg:flex items-center absolute -top-10 left-0 w-full px-6">
                                    <div className="h-0.5 bg-blue-600 w-1/4 relative"><div className="absolute -right-1.5 -top-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-50" /></div>
                                    <div className="h-0.5 bg-blue-600 w-1/4 relative"><div className="absolute -right-1.5 -top-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-50" /></div>
                                    <div className="h-0.5 bg-blue-600 w-1/4 relative"><div className="absolute -right-1.5 -top-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-50" /></div>
                                    <div className="h-0.5 bg-slate-100 w-1/4 relative"><div className="absolute -right-1.5 -top-1.5 w-3.5 h-3.5 rounded-full bg-slate-100" /></div>
                                </div>
                                
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 relative z-10">
                                    {['A', 'B', 'C', 'D'].map((step, i) => (
                                        <motion.div key={step} whileHover={{ y: -5 }} onClick={openLeadBot} className="bg-slate-50/50 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-2xl transition-all duration-500 group cursor-pointer">
                                            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-black mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">{step}</div>
                                            <h3 className="text-lg font-black text-slate-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
                                                {['The Plan', 'Arkle AI', 'BizDesk', 'Ecosystem'][i]}
                                            </h3>
                                            <p className="text-[11px] text-slate-500 font-bold leading-relaxed opacity-80">
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
                <motion.section {...fadeUp} className="py-20 px-12 lg:px-[12%] bg-slate-50 border-t border-slate-100 overflow-hidden">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="flex flex-col lg:flex-row gap-20 items-center">
                            <div className="lg:w-1/3">
                                <div className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-6 text-center lg:text-left">Our Impact</div>
                                <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-10 text-center lg:text-left">
                                    Businesses <br /> We Build.
                                </h2>
                                <div className="space-y-12">
                                    {[
                                        { label: 'Startups Incorporated', val: '500+', icon: Award },
                                        { label: 'Founder Satisfaction', val: '4.9/5', icon: Heart },
                                        { label: 'Compliance Managed', val: '₹100Cr+', icon: Shield }
                                    ].map(stat => (
                                        <div key={stat.label} className="flex items-center gap-6 justify-center lg:justify-start">
                                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                                <stat.icon className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-3xl font-black text-slate-900">{stat.val}</div>
                                                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{stat.label}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:w-2/3 grid md:grid-cols-2 gap-8">
                                {[
                                    { name: 'Sandeep R.', role: 'FinTech Founder', quote: 'SetMyBizz turned our idea into a registered entity in 48 hours. The BizDesk dashboard is a game changer.' },
                                    { name: 'Priya K.', role: 'E-commerce CEO', quote: 'Scaling was a nightmare until we moved to Arkle AI. Now our compliance runs on 100% autopilot.' }
                                ].map((t, i) => (
                                    <motion.div key={i} whileHover={{ y: -5 }} className="p-10 rounded-[2.5rem] bg-white shadow-xl shadow-blue-500/5 border border-white relative group">
                                        <Quote className="absolute top-8 right-8 w-10 h-10 text-blue-500/10" />
                                        <p className="text-slate-600 font-medium leading-relaxed mb-8 italic">"{t.quote}"</p>
                                        <div>
                                            <div className="text-sm font-black text-slate-900 uppercase tracking-widest">{t.name}</div>
                                            <div className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">{t.role}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-32 pt-20 border-t border-slate-200 text-center">
                             <h3 className="text-4xl font-black text-slate-900 mb-10">Ready to build your registered reality?</h3>
                             <button onClick={openLeadBot} className="inline-flex items-center gap-3 px-16 py-6 bg-blue-600 text-white rounded-3xl font-black text-xl shadow-2xl shadow-blue-500/30 hover:-translate-y-1 transition-all">
                                Get Early Access 🚀
                             </button>
                        </div>
                    </div>
                </motion.section>

                <footer className="py-24 bg-white border-t border-slate-100 px-6">
                    <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10 px-12">
                        <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <Rocket className="w-4 h-4 text-white" />
                             </div>
                             <span className="font-black text-xl tracking-tighter">SetMyBizz</span>
                        </div>
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">© 2024 Business Operating System</div>
                    </div>
                </footer>
            </main>

            {/* ── ARKLE AI CHAT CONCIERGE (SMART DISCOVERY BOT) ── */}
            <div className="fixed bottom-10 right-10 z-[100]">
                <AnimatePresence>
                    {isChatOpen && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8, y: 50, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.8, y: 50, filter: 'blur(10px)' }}
                            className="absolute bottom-24 right-0 w-[420px] h-[600px] bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
                        >
                            {/* Chat Header */}
                            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                                        <BrainCircuit className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-black text-sm uppercase tracking-widest">Arkle Discovery</div>
                                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Profiling Active
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                                    <X className="w-5 h-5" />
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
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-slate-50/30">
                                {/* Welcome Message */}
                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3 max-w-[90%]">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20"><Sparkles className="w-4 h-4" /></div>
                                    <div className="bg-white p-5 rounded-[2rem] rounded-tl-none text-sm font-medium text-slate-700 leading-relaxed shadow-sm border border-slate-100">
                                        Namaste! I am <span className="text-blue-600 font-black">Arkle</span>. To build your perfect <span className="font-bold">BizOS</span>, I need to understand your journey.
                                    </div>
                                </motion.div>

                                {/* STEP 1: BUSINESS STAGE */}
                                {chatStep >= 0 && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-11">Select your stage</div>
                                        <div className="grid grid-cols-2 gap-3 ml-11">
                                            {[
                                                { id: 'idea', label: 'Just an Idea', icon: Lightbulb, color: 'blue' },
                                                { id: 'existing', label: 'Existing Business', icon: Building2, color: 'emerald' }
                                            ].map(s => (
                                                <button 
                                                    key={s.id}
                                                    onClick={() => { setLeadData({...leadData, stage: s.id}); setChatStep(1); }}
                                                    className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${leadData.stage === s.id ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200'}`}
                                                >
                                                    <s.icon className={`w-5 h-5 ${leadData.stage === s.id ? 'text-white' : `text-${s.color}-500`}`} />
                                                    <span className="text-[10px] font-black uppercase tracking-tight">{s.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 2: ROLE SELECTION */}
                                {chatStep >= 1 && (
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3 max-w-[90%]">
                                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20"><Users className="w-4 h-4" /></div>
                                        <div className="bg-white p-5 rounded-[2rem] rounded-tl-none text-sm font-medium text-slate-700 leading-relaxed shadow-sm border border-slate-100 w-full">
                                            Excellent. And what is your <span className="text-blue-600 font-bold">Role</span> in this venture?
                                            <div className="grid grid-cols-2 gap-2 mt-4">
                                                {['Founder/Owner', 'Marketing Lead', 'Operations Mgr', 'Developer'].map(r => (
                                                    <button 
                                                        key={r}
                                                        onClick={() => { setLeadData({...leadData, role: r}); setChatStep(2); }}
                                                        className={`px-3 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-tight transition-all ${leadData.role === r ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'}`}
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
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3 max-w-[90%]">
                                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20"><Briefcase className="w-4 h-4" /></div>
                                        <div className="bg-white p-5 rounded-[2rem] rounded-tl-none text-sm font-medium text-slate-700 leading-relaxed shadow-sm border border-slate-100 w-full">
                                            Got it. What&apos;s the <span className="text-blue-600 font-bold">Name or Core Idea</span>?
                                            <div className="mt-4 flex gap-2">
                                                <input 
                                                    type="text" 
                                                    value={leadData.idea}
                                                    onChange={(e) => setLeadData({...leadData, idea: e.target.value})}
                                                    placeholder="e.g. NeoCommerce or AI Bakery" 
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none font-bold" 
                                                />
                                                <button onClick={() => setChatStep(3)} className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20"><ArrowRight className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 4: STRUGGLE CAPTURE (THE SECRET SAUCE) */}
                                {chatStep >= 3 && (
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3 max-w-[90%]">
                                        <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-500/20"><Zap className="w-4 h-4" /></div>
                                        <div className="bg-white p-5 rounded-[2rem] rounded-tl-none text-sm font-medium text-slate-700 leading-relaxed shadow-sm border border-slate-100 w-full">
                                            Final Discovery: What is your <span className="text-rose-600 font-bold uppercase">biggest struggle</span> right now?
                                            <p className="text-[10px] text-slate-400 mt-1 italic">(Arkle uses this to configure your dashboard gaps)</p>
                                            <div className="grid gap-2 mt-4">
                                                {[
                                                    'Legal & Registration',
                                                    'Tech & Website Build',
                                                    'Marketing & Lead Gen',
                                                    'Daily Operations Chaos'
                                                ].map(s => (
                                                    <button 
                                                        key={s}
                                                        onClick={() => { setLeadData({...leadData, struggle: s}); setChatStep(4); }}
                                                        className={`px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-tight text-left transition-all ${leadData.struggle === s ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-500/20' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-rose-300'}`}
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
                                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3 max-w-[90%]">
                                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20"><Mail className="w-4 h-4" /></div>
                                        <div className="bg-white p-5 rounded-[2rem] rounded-tl-none text-sm font-medium text-slate-700 leading-relaxed shadow-sm border border-slate-100 w-full">
                                            Discovery Complete. Ready to see your <span className="text-blue-600 font-bold uppercase tracking-widest">Custom BizOS</span>?
                                            <p className="text-[10px] text-slate-400 mt-1">Leave your email for the invite.</p>
                                            <div className="mt-4 flex flex-col gap-2">
                                                <input 
                                                    type="email" 
                                                    value={leadData.email}
                                                    onChange={(e) => setLeadData({...leadData, email: e.target.value})}
                                                    placeholder="founder@company.com" 
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none font-bold" 
                                                />
                                                <input 
                                                    type="text" 
                                                    value={leadData.name}
                                                    onChange={(e) => setLeadData({...leadData, name: e.target.value})}
                                                    placeholder="Your Full Name" 
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none font-bold" 
                                                />
                                                <button onClick={() => setChatStep(5)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-500/30 mt-2">Initialize My BizOS 🚀</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 6: SUCCESS */}
                                {chatStep === 5 && (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[50px]" />
                                        <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-6" />
                                        <h4 className="text-2xl font-black mb-4 tracking-tighter leading-tight">Configuring <br /> <span className="text-blue-500">{leadData.idea}</span> BizOS</h4>
                                        <div className="space-y-4 text-xs font-bold text-slate-400 leading-relaxed">
                                            <div className="flex items-center gap-2 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Mapping {leadData.role} Profile</div>
                                            <div className="flex items-center gap-2 text-blue-400"><span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Prioritizing {leadData.struggle} Module</div>
                                            <div className="flex items-center gap-2 text-slate-400"><span className="w-1.5 h-1.5 rounded-full bg-slate-600" /> Setting up {leadData.stage === 'idea' ? 'Incorporation' : 'Compliance'} Vault</div>
                                        </div>
                                        <p className="mt-8 text-[11px] text-slate-500 italic">Check your inbox, {leadData.name.split(' ')[0]}. Arkle will reach out within 12 hours.</p>
                                    </motion.div>
                                )}

                                <div ref={chatEndRef} />
                            </div>

                            {/* Chat Footer */}
                            <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-3">
                                <div className="flex-1 flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2 border border-slate-100">
                                    <input 
                                        type="text" 
                                        placeholder="Arkle is listening..." 
                                        className="flex-1 bg-transparent text-xs focus:outline-none font-medium"
                                    />
                                    <Mic className="w-4 h-4 text-slate-400 hover:text-blue-600 cursor-pointer" />
                                </div>
                                <button className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg"><Send className="w-4 h-4" /></button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Chat Bubble */}
                <motion.button 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="w-16 h-16 rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-600/40 flex items-center justify-center border-4 border-white relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-transparent opacity-50" />
                    {isChatOpen ? <X className="w-8 h-8 relative z-10" /> : <MessageCircle className="w-8 h-8 relative z-10" />}
                    
                    {/* Pulsing indicator */}
                    {!isChatOpen && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full z-20" />
                    )}
                </motion.button>
            </div>
        </div>
    );
}