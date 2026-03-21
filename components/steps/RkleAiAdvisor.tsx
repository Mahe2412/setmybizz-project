"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bot, Globe2, Lightbulb, Send, X, UserPlus, Sparkles, MessageSquare } from 'lucide-react';

interface ArkleAiAdvisorProps {
    onLeadCapture?: () => void;
}

export default function RkleAiAdvisor({ onLeadCapture }: ArkleAiAdvisorProps) {
    const [mode, setMode] = useState<'advice' | 'global'>('advice');
    const [messages, setMessages] = useState<{role: 'ai' | 'user', content: string}[]>([
        { role: 'ai', content: "Hi! I'm Arkle, your Personal Business Advisor. I speak all languages. How can I assist you with your business setup or global expansion today?" }
    ]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [leadPrompted, setLeadPrompted] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
        if (!recognitionRef.current) return alert("Browser does not support Live Voice Mode.");
        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        } else {
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        
        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');

        setTimeout(() => {
            let reply = "";
            const lowerInput = userMsg.toLowerCase();
            
            if (lowerInput.includes('setmybizz')) {
                reply = "SetMyBizz is the world's first AI-powered Business Operating System. We help you set up, grow, and manage your entire business globally through our LaunchPad, Workspace, and AI Co-Founders.";
            } else if (lowerInput.includes('os') || lowerInput.includes('business os')) {
                reply = "A Business OS (Operating System) centralizes all your tools, compliance, teams, and operations into one single intelligent dashboard powered by AI.";
            } else if (lowerInput.includes('setup') || lowerInput.includes('register') || lowerInput.includes('incorporate')) {
                reply = "We offer seamless Private Limited, LLP, and Sole Proprietorship registrations. Our process is 100% online and takes just 10-15 days. Need a detailed breakdown?";
            } else if (lowerInput.includes('global') || lowerInput.includes('country') || mode === 'global') {
                reply = "With our 'Go Global' service, you can register your company in the US, UK, UAE, or Singapore from your home country, complete with banking and payment gateway integrations.";
            } else if (lowerInput.includes('language') || lowerInput.includes('telugu') || lowerInput.includes('hindi')) {
                reply = "I understand all languages! మీ వ్యాపారాన్ని ఎలా ప్రారంభించాలో నేను సహాయం చేయగలను (I can help you start your business).";
            } else {
                reply = "That is a great thought regarding your setup roadmap. I can provide expert step-by-step guidance on this.";
            }

            setMessages(prev => [...prev, { role: 'ai', content: reply }]);

            if (messages.length >= 3 && !leadPrompted) {
                setTimeout(() => {
                    setMessages(prev => [...prev, { role: 'ai', content: "💡 Want to save this strategy and unlock your full AI Co-Founder to run your operations? Claim your free account now." }]);
                    setLeadPrompted(true);
                }, 1500);
            }
        }, 1200);
    };

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <button 
                    onClick={() => setIsOpen(true)}
                    className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-900 border border-slate-700 shadow-2xl hover:scale-110 transition-all duration-500 overflow-hidden"
                >
                    {/* Glowing background effects */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/40 via-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse" />
                    
                    <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full bg-slate-900/90 backdrop-blur-sm border border-slate-700/50">
                        <Sparkles className="absolute top-2 right-2 w-3 h-3 text-indigo-300 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                        <MessageSquare className="w-6 h-6 md:w-7 md:h-7 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                    </div>

                    {/* Notification Dot */}
                    <div className="absolute top-0 right-0 w-3 h-3 md:w-3.5 md:h-3.5 bg-red-500 border-2 border-slate-900 rounded-full z-20 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] md:w-[400px] max-h-[650px] h-[82vh] flex flex-col bg-[#0B0F19]/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-slate-800/80 overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-500">
            {/* Ambient Inner Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none" />

            {/* Header Area */}
            <div className="px-6 py-5 flex items-center justify-between shrink-0 relative z-10 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/20">
                            <div className="w-full h-full bg-[#0B0F19] rounded-2xl flex items-center justify-center">
                                <Bot className="w-6 h-6 text-indigo-400" />
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0B0F19] rounded-full z-10 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg tracking-wide flex items-center gap-2">
                            Arkle <Sparkles className="w-3.5 h-3.5 text-indigo-400 opacity-80" />
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Personal Advisor</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsOpen(false)} 
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Premium Mode Selector */}
            <div className="px-5 py-3 shrink-0 relative z-10">
                <div className="flex w-full p-1 bg-slate-900/60 rounded-xl border border-slate-800 backdrop-blur-md">
                    <button 
                        onClick={() => setMode('advice')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-bold tracking-wider uppercase transition-all duration-300 ${mode === 'advice' ? 'bg-indigo-500/20 text-indigo-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Lightbulb className="w-4 h-4" /> Business Advice
                    </button>
                    <button 
                        onClick={() => setMode('global')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-bold tracking-wider uppercase transition-all duration-300 ${mode === 'global' ? 'bg-purple-500/20 text-purple-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Globe2 className="w-4 h-4" /> Go Global
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 relative z-10 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        {msg.role === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mr-3 shrink-0 border border-indigo-500/30 mt-1">
                                <Bot className="w-4 h-4 text-indigo-400" />
                            </div>
                        )}
                        <div className={`p-4 rounded-2xl max-w-[85%] text-[13px] font-medium leading-relaxed backdrop-blur-md ${
                            msg.role === 'user' 
                            ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-900/20 rounded-tr-sm' 
                            : 'bg-slate-800/60 border border-slate-700/50 text-slate-200 rounded-tl-sm shadow-xl shadow-black/20'
                        }`}>
                            {msg.content}
                            
                            {/* Hooks / Suggestion Chips for the first message */}
                            {idx === 0 && msg.role === 'ai' && messages.length === 1 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {[
                                        "Tailor-Made Business Setup",
                                        "Expert Legal Advice",
                                        "Tax, GST & Trademark Support",
                                        "Sell on Amazon & Expand Globally",
                                        "Identify Gaps & Solutions",
                                        "Get Free Udyam, GST Filing & DPR"
                                    ].map((hook, i) => (
                                        <button 
                                            key={i}
                                            onClick={() => {
                                                setInput(hook);
                                                // Trigger handleSend using a tiny timeout so state has time to update
                                                setTimeout(() => {
                                                    const sendBtn = document.getElementById('arkle-send-btn');
                                                    if (sendBtn) sendBtn.click();
                                                }, 100);
                                            }}
                                            className="text-left text-[11px] font-bold tracking-wide bg-indigo-500/10 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/20 px-3 py-2 rounded-lg transition-colors"
                                        >
                                            {hook}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {(msg.content.includes('claim') || msg.content.includes('Claim') || msg.content.includes('free account')) ? (
                                <button onClick={onLeadCapture} className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-bold tracking-widest uppercase py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02]">
                                    <UserPlus className="w-4 h-4" /> Claim My Account
                                </button>
                            ) : null}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Sleek Input Area */}
            <div className="p-4 sm:p-5 pt-2 shrink-0 relative z-10 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19] to-transparent">
                <div className="relative flex items-center bg-slate-900/90 border border-slate-700/60 shadow-[0_0_20px_rgba(0,0,0,0.5)] rounded-2xl p-1.5 backdrop-blur-2xl focus-within:border-indigo-500/50 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300 group">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isRecording ? "Listening... Speak now" : (mode === 'advice' ? "Ask Arkle for advice..." : "Ask about global setup...")}
                        className="flex-1 bg-transparent px-4 py-3 text-[13px] font-medium text-white placeholder:text-slate-500 outline-none min-w-0"
                    />
                    <button 
                        onClick={toggleVoice}
                        className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all mr-1 ${isRecording ? 'text-red-400 bg-red-500/10 animate-pulse' : 'text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10'}`}
                        title="Voice Input (Live Voice Support)"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </button>
                    <button 
                        id="arkle-send-btn"
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="w-10 h-10 shrink-0 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center disabled:opacity-30 disabled:bg-transparent disabled:text-slate-600 transition-all hover:bg-indigo-500 hover:text-white mr-1"
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </button>
                </div>
                <div className="text-center mt-4 mb-1 flex items-center justify-center gap-1.5 opacity-60">
                    <Sparkles className="w-3 h-3 text-indigo-300" />
                    <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Arkle understands all languages</span>
                </div>
            </div>
        </div>
    );
}
