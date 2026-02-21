"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/app/components/Navbar";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AIIncorporationAssistant from "@/components/dashboard/AIIncorporationAssistant";

// ─── Constants & Mock Data ────────────────────────────────────────────────────
const TABS = [
    { id: 'business', label: 'My Business', icon: 'business' },
    { id: 'marketplace', label: 'Launch Pad', icon: 'rocket_launch' },
    { id: 'academy', label: 'Learn', icon: 'school' },
    { id: 'vault', label: 'Document Vault', icon: 'folder_shared' },
];

const MARKETPLACE_SERVICES = [
    { name: "GST Registration", emoji: "📋", price: 1499, description: "Goods & Services Tax registration", category: "Compliance" },
    { name: "Trademark Registration", emoji: "™️", price: 6999, description: "Protect your brand name & logo", category: "IPR" },
    { name: "FSSAI License", emoji: "🍽️", price: 2499, description: "Mandatory for food businesses", category: "License" },
    { name: "IEC Code", emoji: "🌐", price: 1999, description: "Import Export Code for trading", category: "License" },
    { name: "Professional Tax", emoji: "📊", price: 1999, description: "State-level PT registration", category: "Tax" },
    { name: "ROC Annual Filing", emoji: "🗂️", price: 4999, description: "MCA annual return filing", category: "Compliance" },
    { name: "Virtual Office Address", emoji: "🏢", price: 3999, description: "Premium business address (1 year)", category: "Office" },
    { name: "CA Support (Annual)", emoji: "👨‍💼", price: 9999, description: "ITR, GST, MCA compliance", category: "Tax" },
];

const ACADEMY_COURSES = [
    { title: "Startup India Benefits", duration: "10 min", type: "Video", emoji: "🇮🇳" },
    { title: "Understanding GST Filing", duration: "15 min", type: "Article", emoji: "📋" },
    { title: "Fundraising 101", duration: "45 min", type: "Webinar", emoji: "💰" },
];

// ─── Components ───────────────────────────────────────────────────────────────

function VaultTab({ services, onUpload }: { services: any[], onUpload: (svcName: string) => void }) {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="text-lg font-black text-slate-800 mb-1">Document Vault</h2>
                <p className="text-sm text-slate-500 mb-6">Securely store and access your business documents.</p>

                <div className="grid gap-4">
                    {services.map((svc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${svc.uploadedFile ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
                                    <span className="material-icons">{svc.uploadedFile ? 'description' : 'upload_file'}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700">{svc.name} Docs</p>
                                    <p className="text-[10px] text-slate-400">
                                        {svc.uploadedFile ? `Uploaded: ${svc.uploadedFile}` : 'Pending Upload'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => onUpload(svc.name)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                                    svc.uploadedFile 
                                        ? 'bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50' 
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                            >
                                {svc.uploadedFile ? 'View / Update' : 'Upload'}
                            </button>
                        </div>
                    ))}
                    {services.length === 0 && (
                        <p className="text-center text-slate-400 text-sm py-8">No active services to manage documents for.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function MarketplaceTab({ onAdd }: { onAdd: (s: any) => void }) {
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-black mb-2">Launch Pad 🚀</h2>
                    <p className="text-indigo-100 max-w-md">Scale your business with our curated marketplace of essential services.</p>
                </div>
                {/* Decor elements */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MARKETPLACE_SERVICES.map((svc) => (
                    <div key={svc.name} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-2xl">{svc.emoji}</span>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase tracking-wide">{svc.category}</span>
                        </div>
                        <h3 className="font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{svc.name}</h3>
                        <p className="text-xs text-slate-500 mb-4 h-8">{svc.description}</p>
                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-sm font-black text-slate-900">₹{svc.price.toLocaleString()}</span>
                            <button 
                                onClick={() => onAdd([svc])}
                                className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"
                            >
                                <span className="material-icons text-sm">add</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AcademyTab() {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="text-lg font-black text-slate-800 mb-4">Founder's Academy</h2>
                <div className="grid gap-4">
                    {ACADEMY_COURSES.map((course, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                {course.emoji}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{course.title}</h3>
                                <p className="text-xs text-slate-400 mt-1">{course.type} • {course.duration}</p>
                            </div>
                            <span className="material-icons text-slate-300 group-hover:text-orange-400">play_circle</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="bg-slate-900 rounded-2xl p-6 text-center">
                <p className="text-white text-sm font-bold mb-2">Want to learn more?</p>
                <p className="text-slate-400 text-xs mb-4">Get access to our full library of 50+ startup modules.</p>
                <button className="px-6 py-2 bg-white text-slate-900 rounded-full text-xs font-black hover:bg-slate-100 transition-colors">
                    View All Courses
                </button>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WorkspacePage() {
    const [activeTab, setActiveTab] = useState('business');
    const [purchase, setPurchase] = useState<any | null>(null);
    const [services, setServices] = useState<any[]>([]);
    const [loaded, setLoaded] = useState(false);
    const { user, guestId } = useAuth();

    // Load data
    useEffect(() => {
        const raw = localStorage.getItem("smb_purchased_package");
        if (raw) {
            try {
                const data = JSON.parse(raw);
                setPurchase(data);
                
                // Init services state including addons
                const initServices = [
                    ...data.services.filter((s: any) => s.included).map((s: any) => ({ name: s.name, status: "pending" })),
                    ...data.addons.map((a: any) => ({ name: a.name, status: "pending", isAddon: true, addonEmoji: a.emoji }))
                ];
                setServices(initServices);
            } catch (e) { console.error(e); }
        }
        setLoaded(true);
    }, []);

    const completedCount = services.filter(s => s.status === "completed").length;
    const progressPct = services.length > 0 ? Math.round((completedCount / services.length) * 100) : 0;

    const handleAddService = (newSvcs: any[]) => {
        setServices(prev => [
            ...prev,
            ...newSvcs.map(s => ({ name: s.name, status: "pending", isAddon: true, addonEmoji: s.emoji }))
        ]);
        alert("Service added to your dashboard!"); // Simple feedback for now
    };

    // Note: Re-using the logic from previous implementation for GuestView would be ideal here if no purchase
    // For brevity in this refactor, simplest check:
    if (loaded && !purchase) {
        // ... (Guest View Logic Placeholder - can ideally import the component) ...
        return (
             <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                 <div className="text-center">
                     <h1 className="text-2xl font-black text-slate-900 mb-4">No Active Workspace</h1>
                     <p className="text-slate-500 mb-8">Please purchase a package to activate your dashboard.</p>
                     <Link href="/incorporation" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">Get Started</Link>
                 </div>
             </div>
        );
    }
    
    if (!loaded) return <div className="min-h-screen flex items-center justify-center"><span className="material-icons animate-spin">sync</span></div>;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
            <Navbar /> {/* Assuming Navbar handles its own positioning */}
            
            {/* ── Sidebar (Desktop) / Bottom Nav (Mobile) ── */}
            <aside className="fixed bottom-0 w-full md:relative md:w-64 md:h-screen bg-white border-t md:border-t-0 md:border-r border-slate-200 z-50 flex md:flex-col shrink-0 pt-20">
                <div className="p-6 hidden md:block">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {purchase.userName.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{purchase.userName}</p>
                            <p className="text-[10px] text-slate-500">Founder</p>
                        </div>
                     </div>
                     <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Company</p>
                        <p className="text-xs font-bold text-slate-800 truncate">{purchase.packageName}</p>
                     </div>
                </div>

                <nav className="flex-1 flex md:flex-col justify-around md:justify-start md:px-4 gap-1">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col md:flex-row items-center md:gap-3 p-3 md:px-4 md:py-3 rounded-xl transition-all ${
                                activeTab === tab.id 
                                    ? 'text-indigo-600 md:bg-indigo-50' 
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <span className={`material-icons text-2xl md:text-xl mb-1 md:mb-0 ${activeTab === tab.id ? 'text-indigo-600' : ''}`}>{tab.icon}</span>
                            <span className={`text-[10px] md:text-sm font-bold ${activeTab === tab.id ? 'font-black' : ''}`}>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 pt-24 pb-24 md:pb-10 px-4 md:px-10 overflow-y-auto h-screen">
                <div className="max-w-4xl mx-auto">
                    {/* Header Context */}
                    <div className="mb-6 flex items-end justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900">{TABS.find(t => t.id === activeTab)?.label}</h1>
                            <p className="text-slate-500 text-sm">Welcome back to your workspace.</p>
                        </div>
                        {activeTab === 'business' && (
                             <div className="hidden md:block text-right">
                                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Progress</p>
                                 <div className="flex items-center gap-2">
                                     <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                         <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: `${progressPct}%` }} />
                                     </div>
                                     <span className="text-sm font-black text-slate-800">{progressPct}%</span>
                                 </div>
                             </div>
                        )}
                    </div>
                
                    {/* Content Switcher */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">

                        {activeTab === 'business' && (
                             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                 {/* Overview Stats */}
                                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                     <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Services</p>
                                         <p className="text-3xl font-black text-slate-900">{services.length}</p>
                                     </div>
                                     <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Completed</p>
                                         <p className="text-3xl font-black text-emerald-500">{completedCount}</p>
                                     </div>
                                      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Pending Action</p>
                                         <p className="text-3xl font-black text-amber-500">{services.length - completedCount}</p>
                                     </div>
                                     <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm bg-gradient-to-br from-indigo-50 to-white">
                                         <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Next Step</p>
                                         <p className="text-xs font-bold text-indigo-900 leading-tight">Upload pending documents to proceed.</p>
                                     </div>
                                 </div>
                                
                                 {/* Services List Card */}
                                 <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                     <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                                         <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Active Services</h3>
                                         <span className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-1 rounded-lg text-slate-500">{purchase.packageName}</span>
                                     </div>
                                     <div className="divide-y divide-slate-50">
                                         {services.map((svc, idx) => (
                                             <div key={idx} className="p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${
                                                      svc.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                                                      svc.status === 'uploaded' ? 'bg-amber-100 text-amber-600' :
                                                      'bg-slate-100 text-slate-400'
                                                  }`}>
                                                      {svc.isAddon ? svc.addonEmoji : <span className="material-icons">{svc.status === 'completed' ? 'check' : 'hourglass_empty'}</span>}
                                                  </div>
                                                  <div className="flex-1">
                                                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{svc.name}</h4>
                                                      <div className="flex items-center gap-2 mt-1">
                                                          <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                                              svc.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                                                              'bg-slate-100 text-slate-500'
                                                          }`}>
                                                              {svc.status.replace('_', ' ')}
                                                          </span>
                                                          {svc.isAddon && <span className="text-[9px] font-bold text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">Add-on</span>}
                                                      </div>
                                                  </div>
                                                  <button className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-2 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">Details</button>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             </div>
                        )}

                        {activeTab === 'marketplace' && (
                             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                 <MarketplaceTab onAdd={handleAddService} />
                             </div>
                        )}
                        {activeTab === 'academy' && (
                             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                 <AcademyTab />
                             </div>
                        )}
                        {activeTab === 'vault' && (
                             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                 <VaultTab services={services} onUpload={(name) => alert(`Upload for ${name}`)} />
                             </div>
                        )}
                    </div>
                </div>
            </main>
            
            {/* AI Assistant FAB */}
            <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50">
                 <AIIncorporationAssistant />
            </div>
        </div>
    );
}
