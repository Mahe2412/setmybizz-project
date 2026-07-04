import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Star, Zap, LayoutGrid, Check, Settings2, Trash2, Link as LinkIcon, AlertCircle, Sparkles, Award, PlusCircle } from 'lucide-react';

interface IntegrationsPanelProps {
    onClose: () => void;
    installedApps: string[];
    onInstallApp: (appId: string) => void;
    onUninstallApp: (appId: string) => void;
    initialTab?: 'bizos_apps' | 'marketplace';
}

const BIZOS_APPS = [
    { 
        id: 'billbook', 
        name: 'Bill Book / Invoicing', 
        desc: 'Built-in Billing with SQLite & Prisma. Invoices, GST calculations, and payment tracking.', 
        rating: 4.9, 
        reviews: '8.2K', 
        badge: 'Core App', 
        icon: '📒', 
        color: 'bg-violet-50 text-violet-600 border-violet-100',
        features: ['GST Invoicing', 'Product Catalogues', 'Party Ledgers', 'Receipt Scanning']
    },
    { 
        id: 'crm', 
        name: 'BizOS CRM', 
        desc: 'Lead tracking, customer management pipeline, and customer follow-ups.', 
        rating: 4.8, 
        reviews: '2.4K', 
        badge: 'Core App', 
        icon: '🎯', 
        color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        features: ['Lead Pipelines', 'WhatsApp Templates', 'Meeting Scheduler', 'Client Profiles']
    },
    { 
        id: 'sales', 
        name: 'Sales Desk', 
        desc: 'Real-time sales tracking, deals, order management, and revenue analytics.', 
        rating: 4.7, 
        reviews: '1.8K', 
        badge: 'Core App', 
        icon: '💼', 
        color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        features: ['Deal Tracker', 'Order Desk', 'Revenue Goals', 'Analytics Dashboard']
    },
    { 
        id: 'banking', 
        name: 'Financial Banking Desk', 
        desc: 'Connect Zero-Balance Current Accounts and track cashflow analytics.', 
        rating: 4.8, 
        reviews: '1.2K', 
        badge: 'Finance Core', 
        icon: '💳', 
        color: 'bg-amber-50 text-amber-600 border-amber-100',
        features: ['Zero Balance Account', 'Cashflow Radar', 'Payouts API', 'Bank Statement Sync']
    }
];

const MARKETPLACE_APPS = [
    { 
        id: 'gmail', 
        name: 'Gmail Connector', 
        desc: 'Sync emails, scan receipt attachments, and track communications with Arkle AI.', 
        rating: 4.9, 
        reviews: '12K', 
        badge: 'Verified', 
        icon: '📧', 
        color: 'bg-blue-50 text-blue-600 border-blue-100',
        connected: false
    },
    { 
        id: 'zoho', 
        name: 'Zoho Books Sync', 
        desc: 'Sync invoices, ledger entries, and tax compliance data. Manage under Arkle grip.', 
        rating: 4.8, 
        reviews: '4.5K', 
        badge: 'ERP Sync', 
        icon: '💼', 
        color: 'bg-red-50 text-red-600 border-red-100',
        connected: false
    },
    { 
        id: 'tally-erp', 
        name: 'Tally.ERP 9 Connector', 
        desc: 'Direct bridge to Tally. Export invoices and sync ledger sheets automatically.', 
        rating: 4.7, 
        reviews: '3.1K', 
        badge: 'Enterprise', 
        icon: '📊', 
        color: 'bg-cyan-50 text-cyan-600 border-cyan-100',
        connected: false
    },
    { 
        id: 'whatsapp-business', 
        name: 'WhatsApp Business API', 
        desc: 'Automate sending invoices and payment alerts directly to client WhatsApp numbers via Arkle.', 
        rating: 4.9, 
        reviews: '8.7K', 
        badge: 'Best Seller', 
        icon: '💬', 
        color: 'bg-green-50 text-green-600 border-green-100',
        connected: false
    },
    { 
        id: 'razorpay', 
        name: 'Razorpay Pro Integrator', 
        desc: 'Enable instant payment links and UPI payments directly on your generated invoices.', 
        rating: 4.9, 
        reviews: '5.4K', 
        badge: 'Payment API', 
        icon: '💳', 
        color: 'bg-purple-50 text-purple-600 border-purple-100',
        connected: false
    },
    { 
        id: 'zapier', 
        name: 'Zapier Webhooks', 
        desc: 'Connect 5000+ external tools and trigger automation recipes using Arkle AI commands.', 
        rating: 4.9, 
        reviews: '15K', 
        badge: 'Automation', 
        icon: '⚡', 
        color: 'bg-orange-50 text-orange-600 border-orange-100',
        connected: false
    }
];

const IntegrationsPanel: React.FC<IntegrationsPanelProps> = ({ 
    onClose, 
    installedApps, 
    onInstallApp, 
    onUninstallApp,
    initialTab
}) => {
    const [activeTab, setActiveTab] = useState<'bizos_apps' | 'marketplace'>(initialTab || 'bizos_apps');
    const [searchQuery, setSearchQuery] = useState('');
    const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>(['gmail']); // Default connected for demo

    React.useEffect(() => {
        if (initialTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);

    const toggleIntegration = (id: string) => {
        setConnectedIntegrations(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const isInstalled = (appId: string) => {
        if (appId === 'billbook') {
            return installedApps.includes('billbook') || installedApps.includes('billease') || installedApps.includes('bizbook');
        }
        return installedApps.includes(appId);
    };

    const filteredBizosApps = BIZOS_APPS.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        app.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredMarketplaceApps = MARKETPLACE_APPS.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        app.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden font-display">
            {/* ─── HEADER ─── */}
            <header className="shrink-0 h-16 md:h-20 border-b border-slate-100 px-6 md:px-10 flex items-center justify-between sticky top-0 bg-white z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                        <span className="material-symbols-rounded text-lg">apps</span>
                    </div>
                    <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 ml-2">Arkle Marketplace</h2>
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-2xl mx-12 hidden lg:block">
                   <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder={activeTab === 'bizos_apps' ? "Search BizOS apps, widgets, tools..." : "Search third-party integrations, ERPs..."} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      />
                   </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Category Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button
                            onClick={() => setActiveTab('bizos_apps')}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                                activeTab === 'bizos_apps' 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            BizOS Apps
                        </button>
                        <button
                            onClick={() => setActiveTab('marketplace')}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                                activeTab === 'marketplace' 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Marketplace
                        </button>
                    </div>

                    <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* ─── SCROLLABLE CONTENT ─── */}
            <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth bg-slate-50/50">
                <div className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-12">
                    
                    {/* ─── TITLE INFO BANNER ─── */}
                    <div className="relative p-8 md:p-12 rounded-[32px] overflow-hidden shadow-md border border-slate-100 bg-white">
                        <div className="absolute top-0 right-0 w-82 h-82 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="max-w-3xl space-y-3">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" /> Arkle AI Control Hub
                            </span>
                            <h1 className="text-slate-900 text-3xl md:text-4xl font-black tracking-tight leading-tight">
                                {activeTab === 'bizos_apps' 
                                    ? 'Power your BizDesk with Built-in Apps & Widgets' 
                                    : 'Integrate external tools directly under Arkle Grip'}
                            </h1>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                {activeTab === 'bizos_apps'
                                    ? 'Enable or disable local modules in your MSME workspace. Once installed, these tools run natively on your desktop.'
                                    : 'Log in and connect Zoho, Tally, Gmail, or WhatsApp. Once connected, Arkle AI can autonomously read, query, and perform operations on these platforms.'}
                            </p>
                        </div>
                    </div>

                    {/* ─── APPS GRID ─── */}
                    {activeTab === 'bizos_apps' ? (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Available BizOS Modules</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredBizosApps.map((app) => {
                                    const installed = isInstalled(app.id);
                                    return (
                                        <motion.div 
                                            key={app.id} 
                                            whileHover={{ y: -5 }}
                                            className={`bg-white border rounded-[30px] p-6 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all flex flex-col justify-between h-full ${
                                                installed ? 'border-blue-200 ring-2 ring-blue-500/5' : 'border-slate-100'
                                            }`}
                                        >
                                            <div className="space-y-5">
                                                <div className="flex justify-between items-start">
                                                    <div className={`w-14 h-14 rounded-2xl ${app.color} flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform duration-500`}>
                                                        {app.icon}
                                                    </div>
                                                    <span className="bg-blue-50 text-blue-600 text-[8px] font-black px-2 py-1 rounded-sm uppercase tracking-wider border border-blue-100">
                                                        {app.badge}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="text-[16px] font-black text-slate-900 leading-tight mb-2">{app.name}</h4>
                                                    <p className="text-slate-500 text-xs font-medium leading-relaxed mb-4">{app.desc}</p>
                                                </div>

                                                {/* App Widgets / Features Preview */}
                                                <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Included Features</span>
                                                    {app.features.map((feat, i) => (
                                                        <div key={i} className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-600">
                                                            <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                            <span className="truncate">{feat}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between pt-5 mt-6 border-t border-slate-100">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                    <span className="text-[11px] font-black text-slate-900">{app.rating}</span>
                                                </div>
                                                {installed ? (
                                                    <button
                                                        onClick={() => onUninstallApp(app.id)}
                                                        className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" /> Uninstall
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => onInstallApp(app.id)}
                                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all shadow-xs flex items-center gap-1"
                                                    >
                                                        <PlusCircle className="w-3.5 h-3.5 text-white" /> Install
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Integrations & External Channels</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredMarketplaceApps.map((app) => {
                                    const connected = connectedIntegrations.includes(app.id);
                                    return (
                                        <motion.div 
                                            key={app.id} 
                                            whileHover={{ y: -5 }}
                                            className={`bg-white border rounded-[30px] p-6 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col justify-between h-full ${
                                                connected ? 'border-emerald-200 ring-2 ring-emerald-500/5' : 'border-slate-100'
                                            }`}
                                        >
                                            <div className="space-y-5">
                                                <div className="flex justify-between items-start">
                                                    <div className={`w-14 h-14 rounded-2xl ${app.color} flex items-center justify-center text-3xl shadow-xs group-hover:scale-110 transition-transform duration-500`}>
                                                        {app.icon}
                                                    </div>
                                                    <span className={`text-[8px] font-black px-2 py-1 rounded-sm uppercase tracking-wider border ${
                                                        connected 
                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                        : 'bg-slate-50 text-slate-500 border-slate-100'
                                                    }`}>
                                                        {connected ? 'Active Grip' : app.badge}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="text-[16px] font-black text-slate-900 leading-tight mb-2">{app.name}</h4>
                                                    <p className="text-slate-500 text-xs font-medium leading-relaxed mb-4">{app.desc}</p>
                                                </div>

                                                {/* Arkle Connector Info Alert */}
                                                <div className={`flex items-start gap-2 p-3 rounded-2xl border ${
                                                    connected 
                                                    ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' 
                                                    : 'bg-blue-50/30 border-blue-100/50 text-slate-600'
                                                }`}>
                                                    <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${connected ? 'text-emerald-600' : 'text-blue-500'}`} />
                                                    <span className="text-[10px] font-medium leading-tight">
                                                        {connected 
                                                            ? 'Connected! Arkle AI can now retrieve data and run commands inside Zoho/Gmail autonomously.' 
                                                            : 'Connect and authenticate. Arkle AI will operate this tool directly in your workspace.'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between pt-5 mt-6 border-t border-slate-100">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                    <span className="text-[11px] font-black text-slate-900">{app.rating}</span>
                                                </div>
                                                <button
                                                    onClick={() => toggleIntegration(app.id)}
                                                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                                                        connected 
                                                        ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-200' 
                                                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                                                    }`}
                                                >
                                                    {connected ? (
                                                        <>
                                                            <Check className="w-3.5 h-3.5" /> Connected
                                                        </>
                                                    ) : (
                                                        <>
                                                            <LinkIcon className="w-3.5 h-3.5" /> Connect App
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <footer className="shrink-0 h-16 border-t border-slate-100 px-10 flex items-center justify-between text-slate-400 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                <p className="text-[10px] font-bold uppercase tracking-widest italic flex items-center gap-2">
                   <Award className="w-3.5 h-3.5" /> Curated by Arkle Intelligence & SetMyBizz
                </p>
                <div className="flex gap-8">
                   <button className="text-[10px] font-bold uppercase tracking-widest hover:text-slate-900">Privacy Policy</button>
                   <button className="text-[10px] font-bold uppercase tracking-widest hover:text-slate-900">Developer portal</button>
                </div>
            </footer>
        </div>
    );
};

export default IntegrationsPanel;
