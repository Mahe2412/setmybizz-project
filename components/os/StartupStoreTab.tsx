import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CORE_SERVICES, PACKAGE_OPTIONS } from '../../lib/pricingConfig';
import { PlusCircle, CheckCircle2, ShoppingCart, ShieldCheck, ArrowRight, Grid, LayoutGrid, Check, Settings, Trash2, Link as LinkIcon, AlertCircle } from 'lucide-react';

interface StartupStoreTabProps {
    installedApps?: string[];
    onInstall?: (appId: string) => void;
    onUninstall?: (appId: string) => void;
}

const CORE_APPS = [
    {
        id: 'billbook',
        name: 'BillBook / BizBook Invoices',
        desc: 'Professional invoicing, GST compliance, receipt scanning, and automated payment tracking.',
        icon: 'receipt_long',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        type: 'Core SaaS App'
    },
    {
        id: 'crm',
        name: 'BizOS CRM',
        desc: 'Lead tracking, customer management pipeline, and follow-up templates for MSMEs.',
        icon: 'groups',
        color: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        type: 'Core SaaS App'
    },
    {
        id: 'sales',
        name: 'Sales Desk',
        desc: 'Manage deals, orders, and sales targets in real-time with automatic analytics.',
        icon: 'query_stats',
        color: 'bg-sky-50 text-sky-700 border-sky-100',
        type: 'Core SaaS App'
    },
    {
        id: 'banking',
        name: 'Financial Banking Desk',
        desc: 'Connect zero-balance corporate accounts and track daily cashflow radar.',
        icon: 'account_balance',
        color: 'bg-amber-50 text-amber-700 border-amber-100',
        type: 'Core SaaS App'
    }
];

const THIRD_PARTY_INTEGRATIONS = [
    {
        id: 'google',
        name: 'Google Workspace',
        desc: 'Sync emails, Google Drive documents, and meetings right inside BizDesk.',
        icon: 'mail',
        color: 'bg-blue-50 text-blue-600 border-blue-100',
        type: 'Third Party API'
    },
    {
        id: 'whatsapp',
        name: 'WhatsApp Business API',
        desc: 'Automate invoice delivery and customer support alerts over WhatsApp.',
        icon: 'chat',
        color: 'bg-green-50 text-green-600 border-green-100',
        type: 'Third Party API'
    },
    {
        id: 'razorpay',
        name: 'Razorpay / Stripe Payments',
        desc: 'Accept credit card, UPI, and bank transfer payments directly on invoices.',
        icon: 'payment',
        color: 'bg-purple-50 text-purple-600 border-purple-100',
        type: 'Third Party API'
    }
];

const StartupStoreTab: React.FC<StartupStoreTabProps> = ({ 
    installedApps = ['billbook'], 
    onInstall = () => {}, 
    onUninstall = () => {} 
}) => {
    const [activeSection, setActiveSection] = useState<'apps' | 'services'>('apps');
    const [cart, setCart] = useState<any[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
    const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);
    
    const toggleCartItem = (service: any) => {
        setCart(prev => {
            const exists = prev.find(item => item.id === service.id);
            if (exists) return prev.filter(item => item.id !== service.id);
            return [...prev, service];
        });
    };

    const isInCart = (id: string) => cart.some(item => item.id === id);

    const toggleIntegration = (id: string) => {
        setConnectedIntegrations(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const isInstalled = (appId: string) => {
        // Also support billease matching billbook
        if (appId === 'billbook') {
            return installedApps.includes('billbook') || installedApps.includes('billease') || installedApps.includes('bizbook');
        }
        return installedApps.includes(appId);
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 no-scrollbar overflow-y-auto">
            {/* ─── HEADER ─── */}
            <div className="shrink-0 p-8 md:p-12 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
                                <PlusCircle className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Operational OS</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">App Store & Marketplace</h1>
                        <p className="text-slate-500 font-medium text-lg">Manage your BizDesk workspaces, SaaS apps, integrations, and compliance tools.</p>
                    </div>

                    {/* Section Switcher */}
                    <div className="flex gap-1 p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200">
                        <button
                            onClick={() => setActiveSection('apps')}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                                activeSection === 'apps' 
                                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <LayoutGrid className="w-4 h-4" /> Apps & Integrations
                        </button>
                        <button
                            onClick={() => setActiveSection('services')}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                                activeSection === 'services' 
                                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' 
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <Grid className="w-4 h-4" /> Compliance Services
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-8 md:p-12">
                <div className="max-w-7xl mx-auto space-y-16">
                    
                    {activeSection === 'apps' ? (
                        <>
                            {/* ─── CORE BIZDESK SAAS APPS ─── */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-0.5 w-12 bg-blue-600 rounded-full" />
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Core Workspace Apps</h2>
                                    <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase">1-Click Install</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {CORE_APPS.map((app) => {
                                        const installed = isInstalled(app.id);
                                        return (
                                            <motion.div 
                                                key={app.id}
                                                whileHover={{ y: -5 }}
                                                className={`bg-white border rounded-[30px] p-6 transition-all shadow-md flex flex-col justify-between h-full ${
                                                    installed ? 'border-blue-200 shadow-lg' : 'border-slate-200'
                                                }`}
                                            >
                                                <div className="space-y-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${app.color}`}>
                                                            <span className="material-symbols-rounded text-2xl">{app.icon}</span>
                                                        </div>
                                                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                                            {app.type}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-base font-black text-slate-900 leading-tight mb-2">{app.name}</h3>
                                                        <p className="text-slate-500 text-xs font-medium leading-relaxed">{app.desc}</p>
                                                    </div>
                                                </div>

                                                <div className="pt-6 mt-6 border-t border-slate-100">
                                                    {installed ? (
                                                        <button 
                                                            onClick={() => {
                                                                if (app.id === 'billbook') {
                                                                    onUninstall('billbook');
                                                                    onUninstall('billease');
                                                                    onUninstall('bizbook');
                                                                } else {
                                                                    onUninstall(app.id);
                                                                }
                                                            }}
                                                            className="w-full py-3.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
                                                        >
                                                            <Check className="w-3.5 h-3.5 text-emerald-600 group-hover:hidden" />
                                                            <Trash2 className="w-3.5 h-3.5 hidden group-hover:inline" />
                                                            <span>Installed</span>
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => {
                                                                onInstall(app.id);
                                                                if (app.id === 'billbook') {
                                                                    onInstall('billease'); // Ensure both are registered
                                                                }
                                                            }}
                                                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                                        >
                                                            <PlusCircle className="w-3.5 h-3.5" /> Install App
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* ─── THIRD PARTY APP INTEGRATIONS ─── */}
                            <div className="space-y-8 pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-0.5 w-12 bg-emerald-600 rounded-full" />
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Third-Party Marketplace</h2>
                                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase">API Connections</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {THIRD_PARTY_INTEGRATIONS.map((app) => {
                                        const connected = connectedIntegrations.includes(app.id);
                                        return (
                                            <motion.div 
                                                key={app.id}
                                                whileHover={{ y: -5 }}
                                                className={`bg-white border rounded-[30px] p-8 transition-all shadow-md flex flex-col justify-between h-full ${
                                                    connected ? 'border-emerald-200' : 'border-slate-200'
                                                }`}
                                            >
                                                <div className="space-y-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${app.color}`}>
                                                            <span className="material-symbols-rounded text-2xl">{app.icon}</span>
                                                        </div>
                                                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                                            {app.type}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-black text-slate-900 leading-tight mb-2">{app.name}</h3>
                                                        <p className="text-slate-500 text-xs font-medium leading-relaxed">{app.desc}</p>
                                                    </div>
                                                </div>

                                                <div className="pt-6 mt-8 border-t border-slate-100">
                                                    <button 
                                                        onClick={() => toggleIntegration(app.id)}
                                                        className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                                                            connected 
                                                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-250' 
                                                            : 'bg-slate-900 text-white hover:bg-slate-800'
                                                        }`}
                                                    >
                                                        {connected ? (
                                                            <>
                                                                <Check className="w-3.5 h-3.5" /> Connected
                                                            </>
                                                        ) : (
                                                            <>
                                                                <LinkIcon className="w-3.5 h-3.5" /> Connect Integration
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* ─── CUSTOM PACKAGES SECTION ─── */}
                            <div className="space-y-10">
                                <div className="flex items-center gap-4">
                                    <div className="h-0.5 w-12 bg-blue-600 rounded-full" />
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Ready-to-go Packs</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {PACKAGE_OPTIONS.map((pkg) => (
                                        <motion.div 
                                            key={pkg.id}
                                            whileHover={{ y: -10 }}
                                            className={`relative flex flex-col bg-white border-2 rounded-[40px] overflow-hidden transition-all duration-300 ${selectedPackage === pkg.id ? 'border-blue-600 shadow-2xl' : 'border-slate-100 shadow-xl shadow-slate-200/50 hover:border-blue-200'}`}
                                        >
                                            <div className={`p-8 ${pkg.bg || 'bg-slate-50'} border-b border-slate-100`}>
                                                <h4 className={`text-xl font-black ${pkg.textColor || 'text-slate-900'} mb-1`}>{pkg.name}</h4>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pkg.ideal}</div>
                                            </div>
                                            <div className="p-8 flex-grow flex flex-col">
                                                <ul className="space-y-4 mb-8 flex-grow">
                                                    {pkg.features.map((f, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-[13px] text-slate-600 font-bold">
                                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                                            {f}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <button 
                                                    onClick={() => setSelectedPackage(pkg.id === selectedPackage ? null : pkg.id)}
                                                    className={`w-full py-5 rounded-[22px] font-black text-[11px] uppercase tracking-widest transition-all shadow-xl ${selectedPackage === pkg.id ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                                >
                                                    {selectedPackage === pkg.id ? 'Bundle Selected' : 'Select Bundle'}
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* ─── INDIVIDUAL SERVICES GRID ─── */}
                            <div className="space-y-10">
                                <div className="flex items-center gap-4">
                                    <div className="h-0.5 w-12 bg-slate-900 rounded-full" />
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Individual Protocols</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {CORE_SERVICES.map((service) => (
                                        <motion.div 
                                            key={service.id}
                                            whileHover={{ y: -5 }}
                                            className={`bg-white border rounded-[30px] p-6 transition-all cursor-pointer group flex flex-col justify-between h-full ${isInCart(service.id) ? 'border-slate-900 ring-4 ring-slate-900/5 shadow-2xl' : 'border-slate-200 hover:border-slate-400'}`}
                                            onClick={() => toggleCartItem(service)}
                                        >
                                            <div>
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${service.colors}`}>
                                                    <service.icon className="w-6 h-6" />
                                                </div>
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">{service.category}</span>
                                                <h3 className="text-[16px] font-black text-slate-900 leading-tight mb-3">{service.title}</h3>
                                                <p className="text-slate-500 text-[11px] font-medium leading-relaxed line-clamp-2">{service.desc}</p>
                                            </div>
                                            <div className="mt-8 flex items-center justify-between">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Sourcing</span>
                                                <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isInCart(service.id) ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white'}`}>
                                                    {isInCart(service.id) ? <CheckCircle2 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ─── SELECTION FOOTER (LITE THEME) ─── */}
            <AnimatePresence>
                {(cart.length > 0 || selectedPackage) && activeSection === 'services' && (
                    <motion.div 
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="sticky bottom-8 mx-auto mb-8 w-[95%] max-w-4xl z-50 px-8 py-5 bg-white border border-slate-200 text-slate-900 rounded-[35px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] flex items-center justify-between gap-6 backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-900/10">
                                <PlusCircle className="w-6 h-6 text-white" />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="text-base font-black">Ready for Deployment</h4>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                    {selectedPackage ? 'Package + ' : ''} {cart.length} Protocols selected
                                </p>
                            </div>
                        </div>

                        <button className="px-10 py-5 bg-blue-600 text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3 group">
                            Finalize Portfolio <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StartupStoreTab;
