import React, { useState } from 'react';
import { PlusCircle, CheckCircle2, ArrowRight, ChevronLeft, ChevronDown, ChevronUp, CheckSquare, Square, CreditCard, X, ShoppingCart, Loader2, Rocket, Globe2, Sparkles, Bot, Users, Star, Lightbulb } from 'lucide-react';
import { BusinessData } from '../../types';
import { CORE_SERVICES, PACKAGE_OPTIONS } from '../../lib/pricingConfig';
import GlobalAccessStep from './GlobalAccessStep';
import RkleAiAdvisor from './RkleAiAdvisor';


interface SummaryStepProps {
    data: BusinessData;
    onBack: () => void;
    onDashboard: () => void;
}

type CartItem = { id: string, name: string, price: number, type: 'package' | 'service' | 'addon' };

const SummaryStep: React.FC<SummaryStepProps> = ({ data, onBack, onDashboard }) => {
    const isPvtLtd = data.stage === 'scale' || data.size !== 'solo';

    const [cart, setCart] = useState<CartItem[]>([]);
    const [showCheckout, setShowCheckout] = useState(false);
    const [processMsg, setProcessMsg] = useState('');
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

    const toggleDropdown = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenDropdowns(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredServices = CORE_SERVICES.filter(service => 
        service.showIf === 'all' || 
        (service.showIf === 'scale' && isPvtLtd) || 
        (service.showIf === 'solo' && !isPvtLtd)
    );

    const toggleCartItem = (item: CartItem) => {
        setCart(prev => {
            if (item.type === 'package') {
                const filtered = prev.filter(c => c.type !== 'package');
                const exists = prev.find(c => c.id === item.id);
                return exists ? filtered : [...filtered, item]; // Swap package or remove
            }
            const exists = prev.find(c => c.id === item.id);
            if (exists) return prev.filter(c => c.id !== item.id);
            return [...prev, item];
        });
    };

    const isInCart = (id: string) => cart.some(c => c.id === id);
    const cartTotal = cart.reduce((acc, curr) => acc + curr.price, 0);

    const handleCheckoutProcess = () => {
        setProcessMsg('Capturing lead securely & initializing Payment Gateway...');
        setTimeout(() => {
            setProcessMsg('Processing Razorpay Simulated Transaction...');
            setTimeout(() => {
                setShowCheckout(false);
                onDashboard(); // Redirects safely
            }, 2500);
        }, 2500);
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-12 animate-in fade-in zoom-in-95 duration-700 pb-32 relative">
            <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/50 text-blue-700 text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-blue-200 shadow-sm">MyBizz Advisor Recommendation</span>
                <h1 className="font-playfair text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                    Your Personalized Setup Journey
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-3xl mx-auto font-medium">
                    Based on your inputs, we&apos;ve curated the essential services and packages to transform <span className="font-bold text-[#0052FF] border-b-2 border-blue-200">{data.name || 'Your Business'}</span> into a fully compliant brand.
                </p>
            </div>

            <div className="flex flex-col gap-16">
                {/* Top Section: Essential Services List */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-2xl font-bold text-slate-900">All MyBizz Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredServices.map((step, idx) => {
                            const isSelected = isInCart(step.id);
                            return (
                                <div key={idx} className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4 cursor-pointer ${isSelected ? 'border-[#0052FF] ring-2 ring-blue-500/20 bg-blue-50/10' : 'border-slate-200'}`} onClick={() => toggleCartItem({ id: step.id, name: step.title, price: step.price, type: 'service' })}>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border transition-transform ${step.colors}`}>
                                        <step.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-grow">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">{step.category}</span>
                                        <h4 className="text-base font-bold text-slate-900 leading-tight mb-1">{step.title}</h4>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-sm font-bold text-[#0052FF] opacity-90">{step.price === 0 ? 'Free' : 'Select for Pricing'}</span>
                                        </div>
                                    </div>
                                    <button className={`flex-shrink-0 p-1.5 rounded-full transition-colors mt-1 ${isSelected ? 'text-[#0052FF]' : 'text-slate-400'}`}>
                                        {isSelected ? <CheckCircle2 className="w-6 h-6" /> : <PlusCircle className="w-6 h-6" />}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Free Hooks & Resources Section */}
                {/* Free Hooks & Resources Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 shadow-lg text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 opacity-10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-2.5 py-1 bg-white/20 text-white rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/30 shadow-sm backdrop-blur-sm">Included for you</span>
                            <h3 className="text-xl font-black">Free Business Resources & Built-in AI</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                                { title: 'Project Report (DPR)', desc: 'Bank-ready project plan.', icon: 'description', color: 'from-emerald-400 to-teal-500' },
                                { title: 'Legal Documentation', desc: 'NDA & Founders agreements.', icon: 'gavel', color: 'from-amber-400 to-orange-500' },
                                { title: 'Udyam / MSME', desc: 'Free assistance & benefits.', icon: 'card_membership', color: 'from-pink-400 to-rose-500' },
                                { title: 'Basic AI Guidance', desc: 'Chatbot access for setup.', icon: 'smart_toy', color: 'from-indigo-400 to-blue-500' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/10 p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all group backdrop-blur-sm cursor-pointer">
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform`}>
                                        <span className="material-icons text-white text-sm">{item.icon}</span>
                                    </div>
                                    <h4 className="font-bold text-white text-sm mb-0.5">{item.title}</h4>
                                    <p className="text-[11px] text-blue-100 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI Co-Founder Pre-Login Hook Section */}
                <div 
                    onClick={() => setShowCheckout(true)}
                    className="bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1 border border-slate-800"
                >
                    <div className="absolute inset-0 bg-[url('/scrolling-sketch-bg.png')] bg-center bg-cover opacity-10 mix-blend-overlay"></div>
                    <div className="absolute top-1/2 right-10 -translate-y-1/2 w-48 h-48 bg-indigo-500 rounded-full blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                        {/* Avatar / Animation */}
                        <div className="relative shrink-0">
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-md opacity-50 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse" />
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center relative z-10 shadow-xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20"></div>
                                <Bot className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-400 group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-slate-900 rounded-full z-20 shadow-[0_0_15px_rgba(16,185,129,0.8)] flex items-center justify-center">
                                <Sparkles className="w-3 h-3 text-white" />
                            </div>
                        </div>

                        {/* Text and CTA */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/30 mb-3 backdrop-blur-sm">
                                <Star className="w-3 h-3 fill-indigo-400" /> Included in all limits
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">Meet Your AI Co-Founder</h3>
                            <p className="text-slate-300 text-[13px] md:text-sm font-medium leading-relaxed max-w-2xl mb-5">
                                Build your entire brand, <strong className="text-white">logos, websites, apps, and tools</strong>. Let AI manage your <strong className="text-white">sales, leads, emails, WhatsApp, and CRM.</strong> Run, manage, and operate your entire startup with your AI Team and Assistants on the AI Workspace. <br/><br/>
                                <span className="inline-block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent font-black tracking-wide uppercase text-xs md:text-sm">1 Subscription. 1 Powerful Startup OS.</span>
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                                <button className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                                    Login to Dashboard
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <span className="text-xs text-slate-500 font-medium">Free limits applied. Pay as you go inside.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Packages */}
                <div className="border-t border-slate-200 pt-12">
                    <div className="text-center mb-10">
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">Or choose a Ready-to-go Package</h3>
                        <p className="text-slate-500 font-medium">Bundled services tailored to your exact business stage.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {PACKAGE_OPTIONS.map((pkg, idx) => {
                            const isSelected = isInCart(pkg.id);
                            return (
                                <div key={idx} className={`relative flex flex-col bg-white border-2 rounded-2xl overflow-hidden hover:shadow-xl transition-all ${isSelected || pkg.featured ? 'border-[#0052FF] shadow-lg transform md:-translate-y-2' : 'border-slate-200'}`}>
                                    {pkg.featured && !isSelected && (
                                        <div className="absolute top-0 inset-x-0 text-center bg-[#0052FF] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 z-10">Most Popular & Recommended</div>
                                    )}
                                    {isSelected && (
                                        <div className="absolute top-0 inset-x-0 text-center bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 z-10">Package Selected</div>
                                    )}
                                    <div className={`${pkg.bg} p-6 border-b transition-colors ${(pkg.featured || isSelected) ? 'pt-8' : ''}`}>
                                        <h4 className={`text-lg font-bold ${pkg.textColor} mb-1`}>{pkg.name}</h4>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{pkg.ideal}</div>
                                        <div className="text-3xl font-black text-slate-900">₹{pkg.price.toLocaleString('en-IN')}</div>
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col">
                                        <ul className="space-y-3 mb-6 flex-grow">
                                            {pkg.features.map((f, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                        
                                        {/* Add-ons Section inside Package */}
                                        <div className="border-t border-slate-100 pt-4 mb-6 space-y-3">
                                            {pkg.addonCategories.map((category) => {
                                                const isOpen = openDropdowns[category.id] || false;
                                                return (
                                                    <div key={category.id} className="border border-slate-200 rounded-xl overflow-hidden">
                                                        <div 
                                                            onClick={(e) => toggleDropdown(category.id, e)}
                                                            className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 p-3 cursor-pointer transition-colors"
                                                        >
                                                            <h5 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{category.title}</h5>
                                                            {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 ml-2" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />}
                                                        </div>
                                                        {isOpen && (
                                                            <div className="p-2 space-y-1.5 bg-white border-t border-slate-100">
                                                                {category.items.map(addon => {
                                                                    const isAddonSelected = isInCart(addon.id);
                                                                    return (
                                                                        <div 
                                                                            key={addon.id} 
                                                                            onClick={(e) => { e.stopPropagation(); toggleCartItem({ id: addon.id, name: addon.name, price: addon.price, type: 'addon' }); }}
                                                                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border transition-colors ${isAddonSelected ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-50 hover:border-indigo-200'}`}
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                {isAddonSelected ? <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                                                                                <span className="text-[11px] font-medium text-slate-700 leading-tight">{addon.name}</span>
                                                                            </div>
                                                                            <span className="text-[10px] font-bold text-slate-900 ml-2 whitespace-nowrap">+₹{addon.price.toLocaleString('en-IN')}</span>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <button 
                                            onClick={() => toggleCartItem({ id: pkg.id, name: pkg.name, price: pkg.price, type: 'package' })}
                                            className={`w-full py-3 rounded-xl font-bold transition-all shadow-md mt-auto ${isSelected ? 'bg-slate-900 text-white hover:bg-black' : pkg.buttonBg + ' text-white'}`}
                                        >
                                            {isSelected ? 'Remove Package' : 'Select Package'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Gravity Sketch Landscape Roadmap Promo - Banner Style */}
            <div className="mt-28 mb-16 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000">

                <div className="text-center mb-10">
                    <style dangerouslySetInnerHTML={{__html: `
                        @keyframes glowPulse {
                            0%, 100% { filter: drop-shadow(0 0 2px rgba(245, 158, 11, 0.4)); transform: scale(1); }
                            50% { filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.9)); transform: scale(1.15); color: #fbbf24; }
                        }
                        @keyframes rocketShake {
                            0%, 100% { transform: translateY(0) rotate(0deg); }
                            25% { transform: translateY(-3px) rotate(-2deg); }
                            50% { transform: translateY(0) rotate(2deg); }
                            75% { transform: translateY(-3px) rotate(-1deg); }
                        }
                        @keyframes botWork {
                            0%, 100% { transform: rotate(0deg) translateY(0); }
                            25% { transform: rotate(-10deg) translateY(-2px); }
                            75% { transform: rotate(10deg) translateY(-2px); }
                        }
                        .icon-lightbulb { animation: glowPulse 2s ease-in-out infinite; fill: #fef3c7; }
                        .icon-rocket { animation: rocketShake 0.5s linear infinite; transform-origin: bottom left; }
                        .icon-bot { animation: botWork 1.5s ease-in-out infinite; transform-origin: bottom center; }
                        .icon-globe { animation: spin 12s linear infinite; }
                    `}} />
                    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border-2 border-slate-900 text-slate-900 text-xs font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] mb-6 transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
                        <Star className="w-4 h-4 text-red-500 fill-red-500" /> World's First AI Business OS
                    </span>
                    <h2 className="font-playfair text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 mb-4 tracking-tighter">
                        Start Your Business <span className="underline decoration-4 decoration-red-500 underline-offset-8">Here.</span>
                    </h2>
                </div>

                {/* Banner Container - Sketch Theme (With Background Art Separate) */}
                <div className="relative w-full max-w-[1400px] mx-auto isolate pb-16 sm:pb-20 px-4 sm:px-8 lg:px-12">
                    
                    {/* Static Vector Sketch Background Placed Between Title and Cards */}
                    <div 
                        className="w-full h-24 sm:h-36 lg:h-56 relative opacity-90 mix-blend-multiply mb-12 pointer-events-none flex justify-center overflow-hidden"
                        style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}
                    >
                        <div className="absolute inset-0 bg-[url('/scrolling-sketch-bg.png')] bg-center bg-cover"></div>
                    </div>

                    <div className="relative w-full">
                        {/* Connecting Sketch Line Across the Steps (Desktop) with Blue, Green, Red Colors */}
                        <div className="hidden lg:flex absolute top-10 left-[10%] right-[10%] z-0 opacity-100 pointer-events-none items-center">
                             <div className="flex-1 h-0 border-t-[3px] border-dashed border-blue-500 relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-blue-500 bg-white shadow-sm"></div></div>
                             <div className="flex-1 h-0 border-t-[3px] border-dashed border-emerald-500 relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-emerald-500 bg-white shadow-sm"></div></div>
                             <div className="flex-1 h-0 border-t-[3px] border-dashed border-red-500 relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-red-500 bg-white shadow-sm"></div></div>
                        </div>
                        {/* Vertical Line (Mobile) with Colors */}
                        <div className="lg:hidden absolute top-8 bottom-8 left-8 w-0 z-0 opacity-100 flex flex-col pointer-events-none items-center">
                            <div className="flex-1 border-l-[3px] border-dashed border-blue-500 h-full relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-blue-500 bg-white shadow-sm"></div></div>
                            <div className="flex-1 border-l-[3px] border-dashed border-emerald-500 h-full relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-emerald-500 bg-white shadow-sm"></div></div>
                            <div className="flex-1 border-l-[3px] border-dashed border-red-500 h-full relative"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-red-500 bg-white shadow-sm"></div></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6 relative z-20">
                        
                        {/* Step 1: Advisor */}
                        <div className="relative group flex flex-row lg:flex-col items-start lg:items-center gap-6 lg:gap-8 hover:-translate-y-2 transition-transform duration-300 z-20">
                            <div className="w-12 h-12 lg:w-16 lg:h-16 shrink-0 bg-white border-2 border-slate-900 rounded-full flex items-center justify-center text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:bg-amber-50 transition-colors duration-300 relative z-30">
                                <Lightbulb className="w-6 h-6 lg:w-7 lg:h-7 text-amber-500 icon-lightbulb" strokeWidth={2.5} />
                            </div>
                            <div className="flex-col text-left lg:text-center mt-2 lg:mt-0 p-4 sm:p-5 rounded-2xl bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] group-hover:border-blue-500 transition-all duration-300 relative z-30">
                                <div className="text-slate-500 font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2 border-b-2 border-slate-200 pb-2 inline-block">Step 1: Start Here</div>
                                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2 leading-tight">Personal Business Advisor</h3>
                                <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed bg-white">
                                    <strong className="text-slate-900">365-day strong tracking & advice</strong> from top professionals. Includes scale-up planning & <strong className="text-slate-900">global access support</strong>.
                                </p>
                            </div>
                        </div>

                        {/* Step 2: Launchpad */}
                        <div className="relative group flex flex-row lg:flex-col items-start lg:items-center gap-6 lg:gap-8 lg:mt-12 hover:-translate-y-2 transition-transform duration-300 z-20">
                            <div className="w-12 h-12 lg:w-16 lg:h-16 shrink-0 bg-white border-2 border-slate-900 rounded-full flex items-center justify-center text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:bg-indigo-50 transition-colors duration-300 relative z-30 overflow-visible">
                                <div className="icon-rocket">
                                    <Rocket className="w-6 h-6 lg:w-7 lg:h-7 text-indigo-600 fill-indigo-100" strokeWidth={2} />
                                </div>
                            </div>
                            <div className="flex-col text-left lg:text-center mt-2 lg:mt-0 p-4 sm:p-5 rounded-2xl bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(99,102,241,1)] group-hover:border-indigo-500 transition-all duration-300 relative z-30">
                                <div className="text-slate-500 font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2 border-b-2 border-slate-200 pb-2 inline-block">Step 2: Build Brand</div>
                                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2 leading-tight">The AI LaunchPad</h3>
                                <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed bg-white">
                                    <strong className="text-slate-900 block mb-1">Build Unlimited Things:</strong> Instantly generate <strong className="text-slate-900">logos, websites, D2C stores, and brochures</strong> through AI.
                                </p>
                            </div>
                        </div>

                        {/* Step 3: AI Co-Founder */}
                        <div className="relative group flex flex-row lg:flex-col items-start lg:items-center gap-6 lg:gap-8 hover:-translate-y-2 transition-transform duration-300 z-20">
                            <div className="w-12 h-12 lg:w-16 lg:h-16 shrink-0 bg-white border-2 border-slate-900 rounded-full flex items-center justify-center text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:bg-purple-50 transition-colors duration-300 relative z-30">
                                <Bot className="w-6 h-6 lg:w-7 lg:h-7 text-purple-600 icon-bot" strokeWidth={2} />
                            </div>
                            <div className="flex-col text-left lg:text-center mt-2 lg:mt-0 p-4 sm:p-5 rounded-2xl bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(168,85,247,1)] group-hover:border-purple-500 transition-all duration-300 relative z-30">
                                <div className="text-slate-500 font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2 border-b-2 border-slate-200 pb-2 inline-block">Step 3: Execution</div>
                                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2 leading-tight">AI Co-Founder & Teams</h3>
                                <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed bg-white">
                                    <strong className="text-slate-900 block mb-1">Act as your employees:</strong> AI natively handles <strong className="text-slate-900">CRM, Sales, and Ops</strong> autonomously day and night.
                                </p>
                            </div>
                        </div>

                        {/* Step 4: Workspace */}
                        <div className="relative group flex flex-row lg:flex-col items-start lg:items-center gap-6 lg:gap-8 lg:mt-12 hover:-translate-y-2 transition-transform duration-300 z-20">
                            <div className="w-12 h-12 lg:w-16 lg:h-16 shrink-0 bg-white border-2 border-slate-900 rounded-full flex items-center justify-center text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:bg-emerald-50 transition-colors duration-300 relative z-30">
                                <Globe2 className="w-6 h-6 lg:w-7 lg:h-7 text-emerald-600 icon-globe" strokeWidth={2} />
                            </div>
                            <div className="flex-col text-left lg:text-center mt-2 lg:mt-0 p-4 sm:p-5 rounded-2xl bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(16,185,129,1)] group-hover:border-emerald-500 transition-all duration-300 relative z-30">
                                <div className="text-slate-500 font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2 border-b-2 border-slate-200 pb-2 inline-block">Step 4: Scale</div>
                                <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2 leading-tight">Workspace & Global</h3>
                                <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed bg-white">
                                    <strong className="text-slate-900 block mb-1">Work entire business here:</strong> Centralized AI workspace plus total support for <strong className="text-slate-900">other countries expansion</strong>.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="mt-16 flex justify-center w-full relative z-20">
                    <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 bg-slate-900 rounded-2xl px-10 py-5 shadow-[8px_8px_0px_0px_rgba(239,68,68,1)] border-2 border-slate-900 w-[95%] sm:w-auto text-center sm:text-left transition-transform hover:-translate-y-1">
                        <div className="flex items-center gap-3 text-white justify-center">
                            <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center shrink-0">
                                <span className="font-black text-slate-900 text-xl">1</span>
                            </div>
                            <span className="font-bold text-slate-200 uppercase tracking-widest text-[11px] sm:text-sm whitespace-nowrap">Single Subscription</span>
                        </div>
                        <div className="hidden sm:block w-0.5 h-10 bg-slate-500 border-l border-dashed border-slate-400"></div>
                        <h3 className="text-lg md:text-xl font-black text-white tracking-wide uppercase">
                            Can Do Wonders In Business
                        </h3>
                    </div>
                </div>
            </div>

            {/* Global Access Section Inserted Here (Moved Down & Resized) */}
            <div className="mt-16 pt-16 border-t border-slate-200 w-full animate-in fade-in zoom-in-95 duration-1000 px-4">
                <div className="text-center mb-8">
                     <h2 className="font-playfair text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">
                        Go <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Global</span>
                    </h2>
                    <p className="text-slate-600 font-medium">Take your Indian startup to the world with our global expansion services.</p>
                </div>
                <div className="mx-auto w-full max-w-5xl h-[400px] shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
                    <GlobalAccessStep onNext={onDashboard} onBack={() => {}} />
                </div>
            </div>

            <div className="mt-16 pt-10 border-t border-slate-200 flex flex-col items-center gap-6">
                <button
                    onClick={onBack}
                    className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 text-sm"
                >
                    <ChevronLeft className="w-5 h-5" /> Back to edit details
                </button>
                <div onClick={onDashboard} className="mt-4 text-xs font-medium text-slate-400 cursor-pointer hover:underline border border-dashed border-slate-300 px-4 py-2 rounded-full">
                    Skip cart & jump directly to Dashboard
                </div>
            </div>

            {/* Floating Cart & Checkout Bar */}
            {cart.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-4 z-40 animate-in slide-in-from-bottom-5">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                                <ShoppingCart className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-slate-900 font-bold text-lg leading-tight">{cart.length} item(s) selected</h4>
                                <p className="text-sm text-slate-500 font-medium max-w-sm truncate">
                                    {cart.map(c => c.name).join(', ')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 w-full md:w-auto mt-2 md:mt-0">
                            <div className="text-right flex-grow">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subtotal</div>
                                <div className="text-2xl font-black text-slate-900">₹{cartTotal.toLocaleString('en-IN')}</div>
                            </div>
                            <button 
                                onClick={() => setShowCheckout(true)}
                                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 font-bold rounded-xl flex items-center gap-2 whitespace-nowrap transition-transform active:scale-95"
                            >
                                <CreditCard className="w-5 h-5" />
                                Proceed to Pay
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Checkout Mock Modal */}
            {showCheckout && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95">
                        {processMsg ? (
                            <div className="p-12 flex flex-col items-center justify-center text-center">
                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Processing Secure Checkout...</h3>
                                <p className="text-slate-500 font-medium">{processMsg}</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <h3 className="font-bold text-slate-900">Secure Checkout (Demo)</h3>
                                    </div>
                                    <button onClick={() => setShowCheckout(false)} className="text-slate-400 hover:text-slate-600">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6 space-y-3 max-h-48 overflow-y-auto">
                                        {cart.map((c, i) => (
                                            <div key={i} className="flex justify-between items-center text-sm font-medium">
                                                <span className="text-slate-600 truncate mr-4">{c.name}</span>
                                                <span className="text-slate-900 font-bold shrink-0">₹{c.price.toLocaleString('en-IN')}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-end mb-6">
                                        <span className="text-slate-500 font-bold">Total Payable</span>
                                        <span className="text-3xl font-black text-slate-900">₹{cartTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <button 
                                        onClick={handleCheckoutProcess}
                                        className="w-full py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xl relative overflow-hidden group"
                                    >
                                        <span className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors" />
                                        Pay via Razorpay <ArrowRight className="w-5 h-5 ml-2" />
                                    </button>
                                    <p className="text-center text-xs text-slate-400 font-medium mt-4">Safe & Encrypted Transaction. GST will be added.</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            
            <RkleAiAdvisor onLeadCapture={() => setShowCheckout(true)} />
        </div>
    );
};

export default SummaryStep;
