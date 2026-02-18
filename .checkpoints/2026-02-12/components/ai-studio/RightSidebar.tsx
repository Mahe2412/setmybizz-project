"use client";

import React, { useState } from 'react';
import { ConnectedApp } from './AIStudioLayout';

interface RightSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    connectedApps: ConnectedApp[];
    onConnectApp: (appId: string) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
    isOpen,
    onToggle,
    connectedApps,
    onConnectApp,
}) => {
    const [view, setView] = useState<'assistants' | 'tools'>('tools');
    const [showConnectModal, setShowConnectModal] = useState(false);

    const aiAssistants = [
        { id: 'email', name: 'Email Assistant', icon: 'mail', desc: 'Draft & send emails', color: 'red' },
        { id: 'social', name: 'Social Media', icon: 'share', desc: 'Create posts & content', color: 'blue' },
        { id: 'content', name: 'Content Writer', icon: 'edit_note', desc: 'Write blogs & articles', color: 'purple' },
        { id: 'data', name: 'Data Analyst', icon: 'analytics', desc: 'Analyze & visualize', color: 'green' },
        { id: 'design', name: 'Design Assistant', icon: 'palette', desc: 'Create graphics', color: 'pink' },
    ];

    const availableApps: ConnectedApp[] = [
        { id: 'sheets', name: 'Google Sheets', icon: 'table_chart', color: 'green', connected: false, category: 'google' },
        { id: 'docs', name: 'Google Docs', icon: 'description', color: 'blue', connected: false, category: 'google' },
        { id: 'slides', name: 'Google Slides', icon: 'slideshow', color: 'yellow', connected: false, category: 'google' },
        { id: 'gmail', name: 'Gmail', icon: 'mail', color: 'red', connected: false, category: 'google' },
        { id: 'drive', name: 'Google Drive', icon: 'cloud', color: 'green', connected: false, category: 'google' },
        { id: 'zoho', name: 'Zoho Invoice', icon: 'receipt', color: 'orange', connected: false, category: 'invoice' },
        { id: 'quickbooks', name: 'QuickBooks', icon: 'account_balance', color: 'green', connected: false, category: 'invoice' },
        { id: 'tally', name: 'Tally ERP', icon: 'store', color: 'red', connected: false, category: 'erp' },
    ];

    if (!isOpen) {
        return (
            <div className="w-12 bg-white border-l border-slate-200 flex flex-col items-center py-4 gap-4 flex-shrink-0">
                <button
                    onClick={onToggle}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Open Tools"
                >
                    <span className="material-icons text-xl">widgets</span>
                </button>
            </div>
        );
    }

    return (
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full flex-shrink-0 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-3 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                <h2 className="font-bold text-sm text-slate-800">AI Assistants & Tools</h2>
                <button
                    onClick={onToggle}
                    className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                    title="Collapse"
                >
                    <span className="material-icons text-lg text-slate-600">chevron_right</span>
                </button>
            </div>

            {/* View Tabs */}
            <div className="p-2 flex gap-1 border-b border-slate-200 flex-shrink-0">
                <button
                    onClick={() => setView('assistants')}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'assistants'
                        ? 'bg-purple-100 text-purple-800'
                        : 'text-slate-600 hover:bg-slate-100'
                        }`}
                >
                    <span className="material-icons text-sm mr-1 align-middle">psychology</span>
                    Assistants
                </button>
                <button
                    onClick={() => setView('tools')}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'tools'
                        ? 'bg-purple-100 text-purple-800'
                        : 'text-slate-600 hover:bg-slate-100'
                        }`}
                >
                    <span className="material-icons text-sm mr-1 align-middle">extension</span>
                    Apps
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-300">
                {view === 'assistants' ? (
                    <>
                        <div className="text-[10px] font-bold text-slate-500 mb-2">QUICK ASSISTANTS</div>
                        {aiAssistants.map(assistant => (
                            <button
                                key={assistant.id}
                                className="w-full text-left p-3 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl transition-all group"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 bg-${assistant.color}-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                        <span className={`material-icons text-${assistant.color}-600`}>{assistant.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-sm text-slate-800 mb-0.5">{assistant.name}</div>
                                        <div className="text-[10px] text-slate-500">{assistant.desc}</div>
                                    </div>
                                    <span className="material-icons text-slate-400 group-hover:text-purple-600 text-sm">arrow_forward</span>
                                </div>
                            </button>
                        ))}
                    </>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-[10px] font-bold text-slate-500">CONNECTED APPS</div>
                            <button
                                onClick={() => setShowConnectModal(true)}
                                className="text-[10px] text-purple-600 hover:text-purple-700 font-bold flex items-center gap-0.5"
                            >
                                <span className="material-icons text-xs">add</span>
                                Add
                            </button>
                        </div>

                        {connectedApps.filter(app => app.connected).map(app => (
                            <div
                                key={app.id}
                                className="p-3 bg-green-50 border border-green-200 rounded-xl"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-8 h-8 bg-${app.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                        <span className={`material-icons text-sm text-${app.color}-600`}>{app.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-sm text-slate-800">{app.name}</div>
                                        {app.lastUsed && (
                                            <div className="text-[9px] text-slate-500">
                                                Used {Math.floor((new Date().getTime() - app.lastUsed.getTime()) / 60000)} min ago
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                                <button
                                    onClick={() => onConnectApp(app.id)}
                                    className="w-full px-3 py-1.5 bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50 rounded-lg text-xs font-medium text-slate-600 hover:text-red-600 transition-all"
                                >
                                    Disconnect
                                </button>
                            </div>
                        ))}

                        {connectedApps.filter(app => app.connected).length === 0 && (
                            <div className="text-center py-8">
                                <span className="material-icons text-4xl text-slate-300 mb-2">extension</span>
                                <p className="text-xs text-slate-500">No apps connected yet</p>
                                <button
                                    onClick={() => setShowConnectModal(true)}
                                    className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors"
                                >
                                    Connect Apps
                                </button>
                            </div>
                        )}

                        {connectedApps.filter(app => app.connected).length > 0 && (
                            <>
                                <div className="text-[10px] font-bold text-slate-500 my-3">AVAILABLE APPS</div>
                                {connectedApps.filter(app => !app.connected).slice(0, 3).map(app => (
                                    <button
                                        key={app.id}
                                        onClick={() => onConnectApp(app.id)}
                                        className="w-full p-3 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl transition-all text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 bg-${app.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                <span className={`material-icons text-sm text-${app.color}-600`}>{app.icon}</span>
                                            </div>
                                            <div className="flex-1 font-medium text-sm text-slate-800">{app.name}</div>
                                            <span className="material-icons text-purple-600 text-sm">add_circle</span>
                                        </div>
                                    </button>
                                ))}
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Connect Apps Modal */}
            {showConnectModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowConnectModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                            <h3 className="font-bold text-lg">Connect Apps</h3>
                            <button onClick={() => setShowConnectModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                                <span className="material-icons">close</span>
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[60vh]">
                            <div className="grid grid-cols-2 gap-3">
                                {availableApps.map(app => (
                                    <button
                                        key={app.id}
                                        onClick={() => {
                                            onConnectApp(app.id);
                                            setShowConnectModal(false);
                                        }}
                                        className={`p-4 border-2 rounded-xl transition-all text-left ${connectedApps.find(a => a.id === app.id)?.connected
                                            ? 'border-green-300 bg-green-50'
                                            : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 bg-${app.color}-100 rounded-xl flex items-center justify-center mb-3`}>
                                            <span className={`material-icons text-xl text-${app.color}-600`}>{app.icon}</span>
                                        </div>
                                        <div className="font-bold text-sm mb-1">{app.name}</div>
                                        <div className="text-[10px] text-slate-500 capitalize">{app.category}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RightSidebar;
