"use client";

import React, { useState } from 'react';

interface QuickMessage {
    id: string;
    role: 'user' | 'rkle';
    content: string;
}

const QuickChatFloating: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<QuickMessage[]>([
        { id: '1', role: 'rkle', content: 'Hi! Quick question?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: QuickMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/oracle/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    mode: 'quick',
                    conversationHistory: messages.slice(-4)
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: 'rkle',
                    content: data.response
                }]);
            }
        } catch (error) {
            console.error('Quick chat error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed left-6 bottom-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center group"
                    title="Quick Chat"
                >
                    <span className="material-icons text-2xl">chat_bubble</span>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>

                    {/* Tooltip */}
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Quick Chat with Rkle
                    </div>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed left-6 bottom-6 w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-5 duration-300 border border-slate-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-t-2xl flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="material-icons text-sm">psychology</span>
                            </div>
                            <div>
                                <div className="font-bold text-xs">Quick Chat</div>
                                <div className="text-[9px] opacity-80">with Rkle</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <span className="material-icons text-lg">close</span>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'rkle' && (
                                    <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mr-1.5">
                                        <span className="material-icons text-white text-[10px]">psychology</span>
                                    </div>
                                )}
                                <div className={`max-w-[70%] rounded-xl px-2.5 py-1.5 text-[11px] leading-relaxed ${msg.role === 'user'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white text-slate-800 border border-slate-200'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white rounded-xl px-3 py-2 border border-slate-200">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-2 border-t border-slate-200 bg-white rounded-b-2xl flex-shrink-0">
                        <div className="flex items-center gap-1.5">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSubmit();
                                    }
                                }}
                                placeholder="Ask quickly..."
                                className="flex-1 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-purple-500 focus:bg-white placeholder:text-slate-400"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={!input.trim() || isLoading}
                                className={`p-1.5 rounded-lg transition-all ${!input.trim() || isLoading
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-purple-600 text-white hover:bg-purple-700'
                                    }`}
                            >
                                <span className="material-icons text-sm">send</span>
                            </button>
                        </div>
                        <div className="text-center text-[8px] text-slate-400 mt-1">
                            Quick answers • Full chat in sidebar
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuickChatFloating;
