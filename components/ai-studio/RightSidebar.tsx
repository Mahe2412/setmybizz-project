"use client";

import React, { useState } from 'react';
import { ConnectedApp } from './AIStudioLayout';

interface RightSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    connectedApps: ConnectedApp[];
    onConnectApp: (appId: string) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onToggle, connectedApps, onConnectApp }) => {
    const [activeTab, setActiveTab] = useState<'tools' | 'apps'>('tools');

    if (!isOpen) {
        return (
            <div className="w-12 bg-white border-l border-slate-200 flex flex-col items-center py-4 gap-4 flex-shrink-0">
                <button onClick={onToggle} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors" title="Open Sidebar">
                    <span className="material-icons text-xl">widgets</span>
                </button>
                <div className="w-8 h-px bg-slate-100"></div>
                {connectedApps.filter(app => app.connected).slice(0, 3).map(app => (
                    <div key={app.id} className={`w-8 h-8 rounded-lg bg-${app.color}-50 flex items-center justify-center p-1.5`} title={app.name}>
                        <span className={`material-icons text-sm text-${app.color}-600`}>{app.icon}</span>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col h-full flex-shrink-0 animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                    <span className="material-icons text-indigo-600 text-lg">bolt</span>
                    <h2 className="font-bold text-sm text-slate-800">Rkle Strategy Control</h2>
                </div>
                <button onClick={onToggle} className="p-1.5 hover:bg-slate-100 rounded transition-colors text-slate-400">
                    <span className="material-icons text-lg">chevron_right</span>
                </button>
            </div>

            <div className="p-3 border-b border-slate-100 flex gap-1 flex-shrink-0">
                <button onClick={() => setActiveTab('tools')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'tools' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}>Strategy AI</button>
                <button onClick={() => setActiveTab('apps')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'apps' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}>Connected Apps</button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-8 scrollbar-hide">
                {activeTab === 'tools' ? (
                    <>
                        <div>
                            <h3 className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-4">Core Simulations</h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Market Sentiment', desc: 'Predict trend trajectories', icon: 'trending_up', color: 'blue' },
                                    { label: 'Revenue Forecaster', desc: 'AI-driven projections', icon: 'analytics', color: 'green' },
                                    { label: 'Risk Lab', desc: 'Stress test your strategy', icon: 'security', color: 'red' },
                                ].map((tool, i) => (
                                    <div key={i} className="bg-slate-50 border border-slate-100 p-3 rounded-2xl hover:border-indigo-100 hover:bg-white hover:shadow-xl transition-all group flex items-start gap-3 cursor-pointer">
                                        <div className={`w-10 h-10 rounded-xl bg-${tool.color}-50 flex items-center justify-center ${tool.color === 'red' ? 'text-red-500' : `text-${tool.color}-600`} group-hover:scale-110 transition-transform`}>
                                            <span className="material-symbols-outlined text-xl">{tool.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-xs text-slate-800 truncate">{tool.label}</h4>
                                            <p className="text-[10px] text-slate-500 truncate leading-relaxed">{tool.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-4">Strategy Reports</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'SEO Map', icon: 'search', color: 'indigo' },
                                    { label: 'Competitor', icon: 'groups', color: 'purple' },
                                    { label: 'Customer', icon: 'visibility', color: 'orange' },
                                    { label: 'Pitch deck', icon: 'presentation_chart_bar', color: 'pink' }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white border border-slate-100 p-4 rounded-2xl hover:border-indigo-100 hover:shadow-lg transition-all text-center group cursor-pointer">
                                        <div className={`w-full aspect-square bg-${stat.color}-50 rounded-xl flex items-center justify-center text-slate-600 mb-2 group-hover:scale-105 transition-transform`}><span className="material-symbols-outlined text-xl">{stat.icon}</span></div>
                                        <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest truncate">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-4">Enterprise Automations</h3>
                        <div className="space-y-4">
                            {connectedApps.map((app) => (
                                <div key={app.id} className="flex items-center justify-between p-3 border border-slate-100 bg-slate-50 rounded-2xl group hover:border-indigo-200 hover:bg-white transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-2 shadow-sm group-hover:scale-110 transition-transform`}><span className={`material-icons text-xl text-${app.color}-600`}>{app.icon}</span></div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-xs text-slate-800 truncate">{app.name}</h4>
                                            <p className={`text-[9px] font-bold ${app.connected ? 'text-green-500' : 'text-slate-400'} uppercase tracking-widest`}>{app.connected ? 'Active Sync' : 'Disconnected'}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => onConnectApp(app.id)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${app.connected ? 'bg-slate-100 text-slate-400 hover:text-red-500' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-400/20'}`}>{app.connected ? 'Disconnect' : 'Connect'}</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-center flex-shrink-0">
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2 hover:opacity-75 transition-opacity"><span className="material-symbols-outlined text-sm">explore</span> Explore Marketplace</button>
            </div>
        </aside>
    );
};

export default RightSidebar;
