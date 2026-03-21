"use client";

import React, { useState } from 'react';

const QuickChatFloating: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');

    return (
        <div className="fixed bottom-6 left-6 z-[60] flex flex-col items-start gap-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {isOpen && (
                <div className="w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-4 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="material-icons text-xl">psychology</span>
                            <span className="font-bold text-xs">Arkle Quick Assist</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                            <span className="material-icons text-white text-sm">close</span>
                        </button>
                    </div>
                    <div className="p-4 bg-slate-50 min-h-[100px] text-xs text-slate-500 font-medium">
                        How can I help you right now? I can draft emails, analyze your current view, or search your records.
                    </div>
                    <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a quick command..."
                            className="flex-1 bg-slate-50 border-none outline-none text-[11px] p-2 rounded-xl"
                        />
                        <button className="bg-purple-600 text-white p-2 rounded-xl hover:bg-purple-700 transition-all shadow-md">
                            <span className="material-icons text-sm">send</span>
                        </button>
                    </div>
                </div>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all group border-2 ${isOpen ? 'border-purple-600 text-purple-600' : 'border-slate-100 text-slate-400 hover:text-purple-600'}`}
            >
                <div className="relative">
                    <span className="material-icons text-3xl font-black">bolt</span>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
            </button>
        </div>
    );
};

export default QuickChatFloating;
