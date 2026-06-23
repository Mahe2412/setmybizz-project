import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Star, Zap, AppWindow, LayoutGrid, Award, SlidersHorizontal, Info, Download, ExternalLink, Settings2 } from 'lucide-react';

interface IntegrationsPanelProps {
    onClose: () => void;
    installedApps: string[];
    onInstallApp: (appId: string) => void;
    onUninstallApp: (appId: string) => void;
}

const IntegrationsPanel: React.FC<IntegrationsPanelProps> = ({ onClose, installedApps, onInstallApp, onUninstallApp }) => {
    const [activeSubTab, setActiveSubTab] = useState('Discover');
    const [searchQuery, setSearchQuery] = useState('');

    const CATEGORIES = ['Discover', 'Featured', 'For you', 'Trending', 'AI skills', 'Marketing', 'CRM', 'Integrations', 'Project Management'];

    const APPS = [
        { id: 9, appId: 'billbook', name: 'Bill Book', dev: 'Main billing app (localhost:3000)', rating: 4.9, reviews: '8.2K', badge: 'Active', icon: '📒', color: 'bg-violet-50 text-violet-600' },
        { id: 10, appId: 'bizbook', name: 'Biz Book', dev: 'SetMyBizz Labs', rating: 4.8, reviews: '2.4K', badge: 'AI Powered', icon: '🚀', color: 'bg-indigo-50 text-indigo-600' },
        { id: 1, appId: 'tally-plus', name: 'Tally Plus Automation', dev: 'By SetMyBizz', rating: 4.8, reviews: '2.4K', badge: 'Best Seller', icon: '📊', color: 'bg-emerald-50 text-emerald-600' },
        { id: 2, appId: 'whatsapp-business', name: 'WhatsApp Marketing Node', dev: 'By Cloud Connect', rating: 4.9, reviews: '8.7K', badge: 'Best Seller', icon: '💬', color: 'bg-green-50 text-green-600' },
        { id: 3, appId: 'tally-erp', name: 'Tally.ERP 9 Connector', dev: 'By SetMyBizz', rating: 4.7, reviews: '3.1K', badge: 'New', icon: '💼', color: 'bg-blue-50 text-blue-600' },
        { id: 4, appId: 'zapier', name: 'Zapier Ultimate Hook', dev: 'By Automation Labs', rating: 4.9, reviews: '12K', badge: 'Top Rated', icon: '⚡', color: 'bg-orange-50 text-orange-600' },
        { id: 5, appId: 'gst-assistant', name: 'GST Filing Assistant', dev: 'By Legal Bot', rating: 4.6, reviews: '1.2K', badge: 'Popular', icon: '⚖️', color: 'bg-red-50 text-red-600' },
        { id: 6, appId: 'razorpay', name: 'Razorpay Pro Integrator', dev: 'By Fintech Ops', rating: 4.9, reviews: '5.4K', badge: 'Verified', icon: '💳', color: 'bg-indigo-50 text-indigo-600' },
        { id: 7, appId: 'email-marketing', name: 'Email Sequence Engine', dev: 'By Mail Flow', rating: 4.5, reviews: '900', badge: 'New', icon: '📧', color: 'bg-sky-50 text-sky-600' },
        { id: 8, appId: 'inventory-ai', name: 'Inventory AI Predictor', dev: 'By Arkle Labs', rating: 4.8, reviews: '450', badge: 'AI Native', icon: '🤖', color: 'bg-purple-50 text-purple-600' }
    ];

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden font-display">
            {/* ─── HEADER ─── */}
            <header className="shrink-0 h-16 md:h-20 border-b border-slate-100 px-6 md:px-10 flex items-center justify-between sticky top-0 bg-white z-50">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <div className="flex gap-[2px]">
                           <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                           <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                           <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 ml-2">ArkleMarketplace</h2>
                    </div>
                </div>

                <div className="flex-1 max-w-2xl mx-12 hidden lg:block">
                   <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search for tools, skills, or apps..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      />
                   </div>
                </div>

                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs font-bold uppercase tracking-widest transition-all">
                       <Settings2 className="w-4 h-4" /> Manage
                    </button>
                    <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* ─── SCROLLABLE CONTENT ─── */}
            <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
                
                {/* ─── MINI CATEGORY BAR ─── */}
                <div className="flex items-center gap-4 px-10 py-6 border-b border-slate-50 overflow-x-auto no-scrollbar bg-white/50 backdrop-blur-sm sticky top-0 z-40">
                    <button className="flex items-center gap-2 px-6 py-2 bg-slate-100 rounded-full text-xs font-black uppercase tracking-widest text-slate-700">Apps</button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">AI Skills <span className="text-[8px] bg-blue-600 text-white px-1.5 rounded-sm ml-1">BETA</span></button>
                </div>

                <div className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-12">
                    
                    {/* ─── HERO BANNER ─── */}
                    <div className="relative h-[250px] md:h-[350px] rounded-[40px] overflow-hidden group shadow-2xl border-4 border-white">
                        <div className="absolute inset-0 bg-linear-to-tr from-indigo-600 via-blue-500 to-cyan-400" />
                        
                        {/* Abstract Background Shapes */}
                        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-[2000ms]" />
                        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-amber-400/20 rounded-full blur-3xl group-hover:rotate-45 transition-transform duration-[2000ms]" />

                        <div className="relative z-10 flex flex-col justify-center px-10 md:px-20 h-full max-w-3xl">
                             <h1 className="text-white text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tight drop-shadow-lg">
                                Plug-and-play skills <br/>to power your Sidekick
                             </h1>
                             <div className="flex items-center gap-4">
                                <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Explore Collections</button>
                                <button className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all">Learn more</button>
                             </div>
                        </div>

                        {/* Floating elements */}
                        <div className="absolute right-20 top-1/2 -translate-y-1/2 hidden md:block animate-bounce duration-[3000ms]">
                             <div className="w-24 h-24 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[32px] flex items-center justify-center shadow-2xl">
                                <Zap className="w-10 h-10 text-white" />
                             </div>
                        </div>
                    </div>

                    {/* ─── CATEGORY PILLS ─── */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
                                {CATEGORIES.map(cat => (
                                    <button 
                                        key={cat} 
                                        onClick={() => setActiveSubTab(cat)}
                                        className={`px-6 py-2 text-xs font-bold whitespace-nowrap rounded-full transition-all ${activeSubTab === cat ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 transition-all shrink-0">
                               <SlidersHorizontal className="w-3.5 h-3.5" /> Best Match
                            </button>
                        </div>

                        {/* ─── APP CARDS GRID ─── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {APPS.map((app) => (
                                <motion.div 
                                    key={app.id} 
                                    whileHover={{ y: -5 }}
                                    className="bg-white border border-slate-100 rounded-[30px] p-6 shadow-sm hover:shadow-2xl hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`w-14 h-14 rounded-2xl ${app.color} flex items-center justify-center text-3xl shadow-sm shadow-blue-500/5 group-hover:scale-110 transition-transform duration-500`}>
                                                {app.icon}
                                            </div>
                                            <span className="bg-blue-50 text-blue-600 text-[8px] font-black px-2 py-1 rounded-sm uppercase tracking-wider border border-blue-100">
                                                {app.badge}
                                            </span>
                                        </div>
                                        <h4 className="text-[15px] font-black text-slate-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">{app.name}</h4>
                                        <p className="text-slate-400 text-[11px] font-bold mb-4">{app.dev}</p>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-1.5">
                                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                            <span className="text-[11px] font-black text-slate-900">{app.rating}</span>
                                            <span className="text-[10px] font-bold text-slate-400">({app.reviews})</span>
                                        </div>
                                        {installedApps.includes(app.appId || '') ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onUninstallApp(app.appId || '');
                                                }}
                                                className="px-3 py-1.5 bg-red-55 border border-red-200 hover:bg-red-100 text-red-600 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all"
                                            >
                                                Uninstall
                                            </button>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onInstallApp(app.appId || '');
                                                }}
                                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all shadow-xs"
                                            >
                                                Install
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    
                    {/* ─── FEATURED COLLECTIONS (REMAINING ROW) ─── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
                        <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-[40px] p-10 flex flex-col justify-center border border-indigo-100 relative overflow-hidden group shadow-lg">
                             <div className="relative z-10">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 block">Trending Now</span>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 max-w-xs leading-tight">The apps everyone loves right now</h3>
                                <button className="mt-4 px-6 py-2 bg-white text-blue-600 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">Browse trending</button>
                             </div>
                             <div className="absolute right-[-20px] bottom-[-20px] w-64 h-64 bg-linear-to-tr from-blue-200 to-transparent blur-3xl opacity-50" />
                        </div>
                        <div className="bg-linear-to-br from-emerald-50 to-teal-50 rounded-[40px] p-10 flex flex-col justify-center border border-emerald-100 relative overflow-hidden group shadow-lg">
                             <div className="relative z-10">
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 block">New Sidekick skills</span>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 max-w-xs leading-tight">Unlock powerful AI skills to get work done</h3>
                                <button className="mt-4 px-6 py-2 bg-white text-emerald-600 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">Explore AI tools</button>
                             </div>
                             <div className="absolute right-[-20px] bottom-[-20px] w-64 h-64 bg-linear-to-tr from-emerald-200 to-transparent blur-3xl opacity-50" />
                        </div>
                    </div>
                </div>
            </div>

            <footer className="shrink-0 h-16 border-t border-slate-100 px-10 flex items-center justify-between text-slate-400 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                <p className="text-[10px] font-bold uppercase tracking-widest italic flex items-center gap-2">
                   <Award className="w-3.5 h-3.5" /> Curated by Arkle Intelligence & Monday Ecosystem
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
