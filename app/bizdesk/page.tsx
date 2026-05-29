'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
    Building2, ShieldCheck, Zap, ArrowLeft, ChevronRight, CheckCircle2,
    Briefcase, FileText, Landmark, Clock, Users, ShieldAlert, Check,
    HelpCircle, ChevronDown, Calendar, MessageSquare, ArrowUpRight
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

const DETAILED_SERVICES = [
    {
        title: 'Pvt Ltd Incorporation',
        desc: 'Complete digital setup including DIN, DSC, PAN, TAN, and SPICe+ filing within 7-10 days.',
        price: '₹5,999 + Govt Fees',
        time: '7-10 Days'
    },
    {
        title: 'GST Registration',
        desc: 'End-to-end application including ARN tracking, document verification, and immediate certificate delivery.',
        price: '₹1,499',
        time: '3-5 Days'
    },
    {
        title: 'Trademark Search & Reg',
        desc: 'Protect your brand name. Includes class classification, comprehensive search, and TM-A application filing.',
        price: '₹1,999 + Govt Fees',
        time: '24 Hours'
    },
    {
        title: 'LLP Setup',
        desc: 'Perfect for professional practices and partnerships. Drafting of partnership agreements included.',
        price: '₹4,999 + Govt Fees',
        time: '10-12 Days'
    },
    {
        title: 'Annual Compliance Pack',
        desc: 'Dedicated CA for all periodic filings, MCA compliance, AOC-4, MGT-7, and balance sheet prep.',
        price: '₹1,999 / month',
        time: 'Annual Support'
    },
    {
        title: 'Corporate Bank Account',
        desc: 'Zero balance corporate current account setup with RazorpayX or ICICI partner integration.',
        price: 'Free Integration',
        time: '48 Hours'
    }
];

const FAQS = [
    {
        q: 'How long does Private Limited incorporation take in India?',
        a: 'Typically it takes 7 to 10 business days. This includes obtaining DSC (Digital Signature Certificates), approval of name reservation, and final incorporation approval from the MCA (Ministry of Corporate Affairs).'
    },
    {
        q: 'What documents are required to start a company?',
        a: 'You will need PAN cards, Aadhaar cards (or passport for foreign nationals), passport-sized photographs, bank statements (less than 2 months old) of all directors, and address proof for the registered office (utility bill and NOC).'
    },
    {
        q: 'How does the AI compliance tracking work?',
        a: 'BizDesk monitors tax calendars, GST filing windows, and TDS schedules automatically. It cross-references your transactional ledger with federal guidelines and raises alerts or assigns jobs to verified human professionals before deadlines hit.'
    },
    {
        q: 'Can I set up an office in US/UK/Dubai using SetMyBizz?',
        a: 'Yes! Our "Go Global" section handles US Delaware C-Corp setup, UK LTD formation, and Dubai Freezone incorporation, including overseas bank accounts and global tax consulting.'
    }
];

export default function BizDeskPage() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const [bizType, setBizType] = useState<'new' | 'existing'>('new');
    const [bizName, setBizName] = useState('');

    const slide = BIZ_SLIDES[activeSlide];
    const SlideIcon = slide.icon;

    const handleBooking = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDate && selectedTime) {
            setBookingSuccess(true);
        }
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
            {/* Left Column (40% width) - Sky Blue Gradient */}
            <aside className="w-[40%] h-full bg-gradient-to-b from-sky-50 to-sky-100/70 border-r border-sky-200/85 p-8 lg:p-10 flex flex-col justify-between shrink-0 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-200/20 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                    <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        Back to Home
                    </Link>

                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-sky-850 block">Operations Hub</span>
                            <h1 className="text-2xl font-black tracking-tight text-slate-950">BizDesk</h1>
                        </div>
                    </div>

                    <nav className="space-y-3.5">
                        {BIZ_SLIDES.map((item, idx) => {
                            const Icon = item.icon;
                            const isActive = activeSlide === idx;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSlide(idx)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all duration-300 ${
                                        isActive 
                                        ? 'bg-white shadow-xl shadow-sky-900/5 border border-sky-200/50 scale-[1.02]' 
                                        : 'hover:bg-sky-200/40 border border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-sky-50' : 'bg-slate-100/50'}`}>
                                            <Icon className={`w-5 h-5 text-blue-600`} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-900">{item.title}</h3>
                                            <span className="text-[10px] font-semibold text-slate-400">{item.subtitle}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isActive ? 'translate-x-0.5 text-blue-600' : ''}`} />
                                </button>
                            );
						})}
                    </nav>
                </div>

                <div className="relative z-10 pt-6 border-t border-sky-200/60 flex items-center gap-3">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-sky-850">
                        System Connected: Active
                    </p>
                </div>
            </aside>

            {/* Right Column (60% width) - White Background & Scrollable Workspace */}
            <main className="w-[60%] h-full bg-white overflow-y-auto no-scrollbar relative p-8 lg:p-16 space-y-16">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-blue-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />
                
                {/* 1. Hero Content Pane */}
                <section className="w-full max-w-[90%] mx-auto grid lg:grid-cols-5 gap-12 items-center pt-4">
                    <div className="lg:col-span-3 space-y-6 text-left">
                        {activeSlide === 0 ? (
                            <>
                                <div className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                                    Start Your Journey
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                                    Breathe life into your business idea.
                                </h2>
                                <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                                    Whether starting fresh or moving an existing business, build your custom Business OS in minutes.
                                </p>
                                
                                {/* Toggle between New and Existing */}
                                <div className="flex gap-2 p-1 bg-slate-100/80 rounded-xl w-fit">
                                    <button 
                                        onClick={() => setBizType('new')}
                                        className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${bizType === 'new' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                    >
                                        New Idea / Startup
                                    </button>
                                    <button 
                                        onClick={() => setBizType('existing')}
                                        className={`px-4 py-2 text-xs font-black rounded-lg transition-all ${bizType === 'existing' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                    >
                                        Existing Business
                                    </button>
                                </div>

                                {/* Custom Input & Button */}
                                <div className="space-y-3 max-w-md pt-2">
                                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                                        <Building2 className="w-5 h-5 text-slate-400 shrink-0" />
                                        <input 
                                            type="text" 
                                            value={bizName}
                                            onChange={(e) => setBizName(e.target.value)}
                                            placeholder={bizType === 'new' ? "Enter your dream business name..." : "Enter your registered company name..."}
                                            className="w-full bg-transparent border-none outline-none text-sm font-bold text-slate-800 placeholder:text-slate-400"
                                        />
                                    </div>
                                    <Link 
                                        href={`/onboarding?name=${encodeURIComponent(bizName)}&type=${bizType}`}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-widest text-center shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                                    >
                                        {bizType === 'new' ? 'Breathe Life Into Idea 🚀' : 'Install Business OS ⚙️'}
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={`inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest`}>
                                    {slide.subtitle}
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                                    {slide.title}
                                </h2>
                                <p className="text-base text-slate-500 font-semibold leading-relaxed">
                                    {slide.desc}
                                </p>
                                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                                    {slide.features.map((f) => (
                                        <div key={f} className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                                            <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4">
                                    <Link href="/onboarding" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors inline-block">
                                        Configure System Now
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="lg:col-span-2 flex justify-center">
                        <div className={`w-60 h-60 rounded-[2.5rem] bg-blue-50/50 border border-blue-100 flex items-center justify-center shadow-inner relative overflow-hidden group`}>
                            <SlideIcon className="w-28 h-28 text-blue-500 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                    </div>
                </section>

                <div className="w-full max-w-[90%] mx-auto h-px bg-slate-100" />

                {/* 2. Interactive Mockup Dashboard Widget */}
                <section className="w-full max-w-[90%] mx-auto space-y-8">
                    <div className="text-left">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 block mb-2">Live Demonstration</span>
                        <h2 className="text-3xl font-black text-slate-950 tracking-tight">Interactive BizOS Console</h2>
                        <p className="text-sm text-slate-500 font-bold mt-1">This is how your live business incorporation and operations dashboard looks inside SetMyBizz.</p>
                    </div>

                    <div className="bg-slate-900 text-slate-100 rounded-[2rem] border border-slate-800 shadow-2xl p-6 lg:p-8 space-y-6 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px]" />
                        
                        {/* Header bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800/80">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-sm text-white">NexaCore Technologies Pvt Ltd</span>
                                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[9px] font-extrabold uppercase tracking-wider">Incorporating</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">MCA Ticket Reference: #SZ-2026-9481</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synced with MCA Servers</span>
                            </div>
                        </div>

                        {/* Interactive Grid */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Step Progress Tracker */}
                            <div className="md:col-span-2 space-y-4 bg-slate-950/50 p-5 rounded-2xl border border-slate-800/60">
                                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-400" /> Incorporation Progress Timeline
                                </h3>

                                <div className="space-y-4 pt-2">
                                    {[
                                        { step: '1', name: 'Digital Signature Certificate (DSC)', desc: 'Obtained and mapped for 2 directors', status: 'completed' },
                                        { step: '2', name: 'Name Reservation (RUN Application)', desc: 'Approved name: NexaCore Technologies Pvt Ltd', status: 'completed' },
                                        { step: '3', name: 'MCA SPICe+ Form Submission', desc: 'Form submitted. Under Registrar check', status: 'active' },
                                        { step: '4', name: 'GSTIN & PAN Issuance', desc: 'Awaiting MCA approval seal', status: 'pending' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4 items-start relative">
                                            {i < 3 && <div className="absolute left-3.5 top-7 bottom-0 w-0.5 bg-slate-800" />}
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-extrabold text-xs border ${
                                                item.status === 'completed'
                                                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                                                    : item.status === 'active'
                                                    ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                                                    : 'bg-slate-900 border-slate-800 text-slate-600'
                                            }`}>
                                                {item.status === 'completed' ? <Check className="w-3.5 h-3.5" /> : item.step}
                                            </div>
                                            <div className="text-left pt-0.5">
                                                <h4 className={`text-xs font-black ${item.status === 'pending' ? 'text-slate-500' : 'text-white'}`}>{item.name}</h4>
                                                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar Alerts / Call Action */}
                            <div className="space-y-4 flex flex-col justify-between">
                                <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800/60 space-y-3.5">
                                    <h3 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-2">
                                        <ShieldAlert className="w-4 h-4 text-rose-400" /> Attention Required
                                    </h3>
                                    <p className="text-[11px] font-medium text-slate-350 leading-relaxed">
                                        MCA requested clarification on office proof. Please upload the latest electricity bill of the registered office.
                                    </p>
                                    <button className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-[9px] uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-rose-600/20">
                                        Upload Document <ArrowUpRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <div className="bg-blue-600/10 border border-blue-500/20 p-5 rounded-2xl space-y-3">
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <Users className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Assigned CA Specialist</span>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs font-black text-white">Ananya Sharma, ACA</div>
                                        <div className="text-[9px] font-bold text-slate-400">SetMyBizz Expert Panel</div>
                                    </div>
                                    <button className="w-full py-2.5 bg-slate-900 hover:bg-slate-950 text-white font-black text-[9px] uppercase tracking-wider rounded-lg border border-slate-800 transition-colors flex items-center justify-center gap-1.5">
                                        <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> Chat with Expert
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="w-full max-w-[90%] mx-auto h-px bg-slate-100" />

                {/* 3. Services Catalog Grid */}
                <section className="w-full max-w-[90%] mx-auto space-y-8">
                    <div className="text-left">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 block mb-2">Our Capabilities</span>
                        <h2 className="text-3xl font-black text-slate-950 tracking-tight">Legal & Incorporation Catalogue</h2>
                        <p className="text-sm text-slate-500 font-bold mt-1">Select and bootstrap individual services backed by transparent pricing.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {DETAILED_SERVICES.map((s, idx) => (
                            <div key={idx} className="bg-slate-50 hover:bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col justify-between hover:shadow-2xl hover:border-blue-200 transition-all duration-300 group cursor-default text-left">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-extrabold bg-slate-900 text-white px-2.5 py-1 rounded-full">{s.time}</span>
                                    </div>
                                    <h3 className="text-base font-black text-slate-950 tracking-tight group-hover:text-blue-600 transition-colors">{s.title}</h3>
                                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">{s.desc}</p>
                                </div>
                                <div className="pt-6 mt-6 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-xs font-black text-slate-900">{s.price}</span>
                                    <Link href="/onboarding" className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                        Apply <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="w-full max-w-[90%] mx-auto h-px bg-slate-100" />

                {/* 4. Live Consultation Booking Form */}
                <section className="w-full max-w-[90%] mx-auto grid lg:grid-cols-5 gap-12 items-stretch bg-sky-50/50 border border-sky-100 rounded-[3rem] overflow-hidden p-8 lg:p-12 text-left relative">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-sky-200/20 rounded-full blur-[80px]" />
                    
                    <div className="lg:col-span-3 flex flex-col justify-between space-y-6">
                        <div>
                            <span className="inline-flex px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-[10px] font-black uppercase tracking-widest mb-4">
                                Book Advice
                            </span>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                                Talk with a Corporate Expert
                            </h2>
                            <p className="text-sm text-slate-500 font-semibold leading-relaxed mt-3">
                                Get immediate answers to legal structures, GST liabilities, or setup requirements. Book a free 15-minute consultation.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-sky-100 shadow-xs shrink-0">
                                    <Users className="w-4 h-4 text-sky-700" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-800 uppercase tracking-wide">CA/CS Specialists</div>
                                    <div className="text-[9px] text-slate-400 font-semibold">100% Verified Panels</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-sky-100 shadow-xs shrink-0">
                                    <Clock className="w-4 h-4 text-sky-700" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-800 uppercase tracking-wide">Fast Resolution</div>
                                    <div className="text-[9px] text-slate-400 font-semibold">Under 15 Mins Response</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-xl relative z-10 flex flex-col justify-center">
                        {bookingSuccess ? (
                            <div className="text-center py-6 space-y-4">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-full flex items-center justify-center mx-auto">
                                    <Check className="w-6 h-6" />
                                </div>
                                <h3 className="text-base font-black text-slate-950">Expert Session Booked!</h3>
                                <p className="text-xs text-slate-500 font-semibold">A Google Meet link and confirmation email have been sent to your email.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleBooking} className="space-y-4">
                                <h3 className="text-sm font-black text-slate-950">Schedule Your Call</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Select Date</label>
                                        <input 
                                            type="date" 
                                            required
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-150 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-bold" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Select Time Slot</label>
                                        <select 
                                            required
                                            value={selectedTime}
                                            onChange={(e) => setSelectedTime(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-150 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none font-bold text-slate-700"
                                        >
                                            <option value="">Choose slot</option>
                                            <option value="10am">10:00 AM - 10:15 AM</option>
                                            <option value="1130am">11:30 AM - 11:45 AM</option>
                                            <option value="2pm">02:00 PM - 02:15 PM</option>
                                            <option value="430pm">04:30 PM - 04:45 PM</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-colors shadow-md shadow-blue-500/20">
                                    Reserve Call
                                </button>
                            </form>
                        )}
                    </div>
                </section>

                <div className="w-full max-w-[90%] mx-auto h-px bg-slate-100" />

                {/* 5. FAQs Accordions */}
                <section className="w-full max-w-[90%] mx-auto space-y-8 pb-10">
                    <div className="text-left">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">Help Desk</span>
                        <h2 className="text-3xl font-black text-slate-950 tracking-tight">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-4">
                        {FAQS.map((faq, idx) => {
                            const isOpen = openFaq === idx;
                            return (
                                <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300">
                                    <button 
                                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                                        className="w-full flex items-center justify-between p-5 text-left font-black text-sm text-slate-900"
                                    >
                                        <span className="flex items-center gap-3">
                                            <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
                                            {faq.q}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isOpen && (
                                        <div className="px-5 pb-5 pt-1 text-xs text-slate-500 font-semibold leading-relaxed border-t border-slate-100 bg-white">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>
        </div>
    );
}
