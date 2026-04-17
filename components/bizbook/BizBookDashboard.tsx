'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BizBookDashboard = () => {
    const [activeTab, setActiveTab] = useState<'transaction' | 'party'>('transaction');

    return (
        <div className="flex flex-col h-screen bg-[#F5F9FF] font-['Outfit'] selection:bg-blue-100 overflow-hidden text-slate-800">
            
            {/* 1. TOP HEADER */}
            <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500 flex items-center justify-center">
                        <span className="material-icons-round text-blue-500 text-lg">storefront</span>
                    </div>
                    <span className="text-lg font-bold text-gray-700 tracking-tight lowercase">mahe</span>
                </div>
                <div className="flex items-center gap-5">
                    <button className="relative">
                        <span className="material-icons-round text-gray-400">notifications</span>
                        <div className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
                    </button>
                    <button>
                        <span className="material-symbols-outlined text-gray-400">settings</span>
                    </button>
                </div>
            </div>

            {/* 2. TOP TAB NAVIGATION */}
            <div className="bg-white p-2 flex border-b border-gray-100">
                <button 
                    onClick={() => setActiveTab('transaction')}
                    className={`flex-1 py-3 text-sm font-bold tracking-tight rounded-xl transition-all ${activeTab === 'transaction' ? 'bg-[#FFF5F5] text-rose-500 border border-rose-100' : 'text-gray-400'}`}
                >
                    Transaction Details
                </button>
                <div className="w-4"></div>
                <button 
                    onClick={() => setActiveTab('party')}
                    className={`flex-1 py-3 text-sm font-bold tracking-tight rounded-xl transition-all ${activeTab === 'party' ? 'bg-blue-50 text-blue-500 border border-blue-100' : 'text-gray-400'}`}
                >
                    Party Details
                </button>
            </div>

            {/* MAIN CONTENT SCROLL AREA */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                
                {/* 3. QUICK LINKS PANEL */}
                <div className="m-4 bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase mb-6">Quick Links</p>
                    <div className="grid grid-cols-4 gap-4">
                        {[
                            { label: 'Add Txn', icon: 'note_add', bg: 'bg-rose-50', iconCol: 'text-rose-500' },
                            { label: 'Sale Report', icon: 'assessment', bg: 'bg-blue-50', iconCol: 'text-blue-500' },
                            { label: 'Txn Settings', icon: 'settings', bg: 'bg-indigo-50', iconCol: 'text-indigo-500' },
                            { label: 'Show All', icon: 'chevron_right', bg: 'bg-sky-50', iconCol: 'text-sky-500' },
                        ].map((link, i) => (
                            <button key={i} className="flex flex-col items-center gap-2 group">
                                <div className={`w-12 h-12 ${link.bg} rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm border border-white`}>
                                    <span className={`material-icons-round ${link.iconCol} text-2xl`}>{link.icon}</span>
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 tracking-tight">{link.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. TRANSACTION LIST */}
                <div className="px-4 space-y-3">
                    {[
                        { party: 'Shiva', type: 'SALE', amount: '1,000.00', balance: '1,000.00', date: '15 Apr, 26', txn: '#1' },
                        { party: 'Ramesh Stores', type: 'SALE', amount: '4,500.00', balance: '0.00', date: '14 Apr, 26', txn: '#2' },
                    ].map((tx, i) => (
                        <div key={i} className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex flex-col">
                                    <h4 className="text-lg font-black text-gray-700 tracking-tight leading-none mb-2">{tx.party}</h4>
                                    <span className="text-[9px] font-black bg-emerald-50 text-emerald-500 px-2.5 py-1 rounded-lg self-start tracking-widest uppercase">{tx.type}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-bold text-gray-300 tracking-widest uppercase mb-1">{tx.txn}</p>
                                    <p className="text-[10px] text-gray-400 font-medium tracking-tighter">{tx.date}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-end pb-3">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total</p>
                                    <p className="text-xl font-black text-gray-800 tracking-tight">₹ {tx.amount}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Balance</p>
                                    <p className="text-xl font-black text-gray-800 tracking-tight">₹ {tx.balance}</p>
                                </div>
                            </div>

                            {/* ITEM FOOTER ACTIONS */}
                            <div className="pt-4 border-t border-gray-50 flex justify-end gap-6 items-center">
                                <button className="material-icons-round text-gray-300 hover:text-blue-500 transition-colors text-xl">print</button>
                                <button className="material-icons-round text-gray-300 hover:text-emerald-500 transition-colors text-xl">ios_share</button>
                                <button className="material-icons-round text-gray-300 hover:text-gray-600 transition-colors text-xl">more_vert</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. FLOATING ADD SALE BUTTON */}
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100]">
                <button className="bg-rose-500 text-white px-8 py-4 rounded-full flex items-center gap-3 shadow-[0_15px_30px_rgba(244,63,94,0.3)] hover:scale-105 active:scale-95 transition-all group">
                    <span className="material-icons-round text-xl group-hover:rotate-90 transition-all duration-500">add_circle</span>
                    <span className="text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap">Add New Sale</span>
                </button>
            </div>

            {/* 6. BOTTOM NAVIGATION BAR */}
            <div className="bg-white border-t border-gray-100 flex items-center justify-around py-4 absolute bottom-0 left-0 right-0 z-50">
                {[
                    { label: 'HOME', icon: 'home', active: true },
                    { label: 'DASHBOARD', icon: 'bar_chart', active: false },
                    { label: 'ITEMS', icon: 'inventory_2', active: false },
                    { label: 'MENU', icon: 'menu', active: false },
                    { label: 'GET DESKTOP', icon: 'laptop_mac', active: false }
                ].map((item, idx) => (
                    <button key={idx} className={`flex flex-col items-center gap-1.5 group ${item.active ? 'text-blue-600' : 'text-gray-300'}`}>
                        <span className={`material-icons-round text-2xl ${item.active ? 'text-blue-600 animate-pulse' : 'group-hover:text-blue-400'}`}>{item.icon}</span>
                        <span className="text-[8px] font-black tracking-[0.2em] uppercase">{item.label}</span>
                        {item.active && <div className="w-1 h-1 bg-blue-600 rounded-full mt-1"></div>}
                    </button>
                ))}
            </div>

        </div>
    );
};

export default BizBookDashboard;
