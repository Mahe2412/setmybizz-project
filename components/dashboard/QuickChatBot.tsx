"use client";

import React, { useState, useRef, useEffect } from 'react';
import { BusinessData } from '@/types';
import { User } from 'firebase/auth';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    type?: 'text' | 'action' | 'form';
}

interface QuickChatBotProps {
    user?: User | null;
    data?: BusinessData;
}

const QuickChatBot: React.FC<QuickChatBotProps> = ({ user, data }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: `Hello! I'm your AI Co-Founder. I can help you build your entire brand identity and business assets in minutes. How would you like to start?`,
            type: 'action'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeFlow, setActiveFlow] = useState<string | null>(null);
    const [flowStep, setFlowStep] = useState(0);

    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const BRAND_BUILD_QUESTIONS = [
        "Great! Let's build your brand. What's the name of your startup?",
        "Beautiful name. What industry are you in?",
        "Who is your target audience?",
        "What's the main problem you are solving?",
        "Perfect! I have enough to start generating your brand kit. Ready to see the results?"
    ];

    const BUSINESS_INFO_QUESTIONS = [
        "Tell me about your business. What do you do?",
        "How long have you been operating?",
        "Do you have a website or social presence yet?",
        "What are your biggest challenges right now?"
    ];

    const handleQuickAction = (action: string) => {
        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: action };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        setTimeout(() => {
            if (action.includes('entire brand')) {
                setActiveFlow('BRAND_BUILD');
                setFlowStep(0);
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: BRAND_BUILD_QUESTIONS[0]
                }]);
            } else {
                setActiveFlow('BUSINESS_INFO');
                setFlowStep(0);
                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: BUSINESS_INFO_QUESTIONS[0]
                }]);
            }
            setIsLoading(false);
        }, 800);
    };

    const handleSubmit = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');

        if (activeFlow) {
            setIsLoading(true);
            setTimeout(() => {
                const nextStep = flowStep + 1;
                const questions = activeFlow === 'BRAND_BUILD' ? BRAND_BUILD_QUESTIONS : BUSINESS_INFO_QUESTIONS;

                if (nextStep < questions.length) {
                    setFlowStep(nextStep);
                    setMessages(prev => [...prev, {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: questions[nextStep]
                    }]);
                } else {
                    setMessages(prev => [...prev, {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: "Excellent! I've captured everything. I'm now processing this for your dashboard. You'll see updates in the Launch Pad section shortly."
                    }]);
                    setActiveFlow(null);
                }
                setIsLoading(false);
            }, 800);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/ai-cofounder-claude', {
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
                    role: 'assistant',
                    content: data.response
                }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: "I'm having a bit of trouble connecting. But I'm still here to help with your brand!"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onresult = (event: any) => {
                    let transcript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        transcript += event.results[i][0].transcript;
                    }
                    setInput(transcript);
                };

                recognition.onerror = () => setIsRecording(false);
                recognition.onend = () => setIsRecording(false);
                recognitionRef.current = recognition;
            }
        }
    }, []);

    const toggleVoice = () => {
        if (!recognitionRef.current) return alert("Voice mode not supported.");
        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        } else {
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 text-white rounded-[1.25rem] shadow-2xl hover:shadow-indigo-500/50 hover:scale-110 transition-all duration-500 z-50 flex items-center justify-center group animate-in zoom-in-0 duration-500 border-2 border-white/20"
                >
                    <span className="material-symbols-outlined text-2xl font-black">bolt</span>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed inset-x-0 bottom-0 top-0 sm:top-auto sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[640px] sm:rounded-[2.5rem] bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] flex flex-col z-[100] animate-in slide-in-from-bottom-12 sm:scale-95 duration-500 border border-slate-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-slate-900 text-white p-6 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/5">
                                <span className="material-symbols-outlined text-xl font-black">bolt</span>
                            </div>
                            <div>
                                <div className="font-black text-xs uppercase tracking-[0.2em] leading-none mb-1 text-indigo-400">Agent Alpha</div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">Neural Link Active</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-90">
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scroll">
                        {messages.map((msg, idx) => (
                            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border mt-1 shadow-sm ${msg.role === 'assistant'
                                            ? 'bg-indigo-600 text-white border-indigo-700'
                                            : 'bg-white text-slate-700 border-slate-200'
                                        }`}>
                                        <span className="material-symbols-outlined text-[12px] font-black">{msg.role === 'assistant' ? 'bolt' : 'person'}</span>
                                    </div>
                                    <div className={`rounded-3xl px-5 py-4 ${msg.role === 'user'
                                            ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 rounded-tr-none'
                                            : 'bg-white text-slate-800 border border-slate-100 shadow-sm rounded-tl-none'
                                        }`}>
                                        <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </div>

                                {msg.role === 'assistant' && msg.type === 'action' && idx === 0 && !activeFlow && (
                                    <div className="flex flex-col gap-2 mt-4 ml-11">
                                        <button onClick={() => handleQuickAction('Build your entire brand')} className="px-5 py-3.5 bg-white border border-slate-100 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center gap-3 shadow-sm group">
                                            <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">rocket_launch</span> Build Entire Brand
                                        </button>
                                        <button onClick={() => handleQuickAction('Tell about your business')} className="px-5 py-3.5 bg-white border border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm">
                                            <span className="material-symbols-outlined text-sm">business_center</span> Business Details
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white rounded-[2rem] px-6 py-4 border border-slate-50 shadow-sm flex items-center gap-4">
                                    <div className="flex gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Syncing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Premium Input Area */}
                    <div className="p-6 bg-white border-t border-slate-50 flex-shrink-0">
                        <div className="relative bg-slate-50 rounded-[2.5rem] p-3 border border-transparent focus-within:bg-white focus-within:border-slate-100 transition-all shadow-inner">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                                placeholder={isRecording ? "Listening..." : "Message AI Co-founder..."}
                                className="w-full bg-transparent border-none outline-none text-xs font-medium text-slate-700 placeholder:text-slate-300 resize-none max-h-32 py-2 px-3"
                                rows={1}
                                disabled={isLoading}
                            />
                            <div className="flex items-center justify-between mt-3 px-1 border-t border-slate-100/50 pt-3">
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={toggleVoice}
                                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isRecording ? 'bg-rose-100 text-rose-600 shadow-lg shadow-rose-200 scale-110' : 'bg-white text-slate-400 hover:text-indigo-600 shadow-sm'}`}
                                        title="Live Voice Mode"
                                    >
                                        <span className="material-symbols-outlined text-lg">{isRecording ? 'mic' : 'mic_none'}</span>
                                    </button>
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!input.trim() || isLoading}
                                    className={`w-10 h-10 rounded-2xl transition-all flex items-center justify-center shadow-xl ${!input.trim() || isLoading
                                        ? 'bg-slate-200 text-slate-400'
                                        : 'bg-slate-900 text-white hover:scale-105 active:scale-95'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-xl font-black">arrow_upward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuickChatBot;
