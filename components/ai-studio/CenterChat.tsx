"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Message, Attachment } from './AIStudioLayout';

interface CenterChatProps {
    chatId: string | null;
    leftSidebarOpen: boolean;
    rightSidebarOpen: boolean;
    onToggleLeftSidebar: () => void;
    onToggleRightSidebar: () => void;
    onNewChat?: () => void;
    onNewProject?: (name: string, icon: string, color: string) => void;
}

const CenterChat: React.FC<CenterChatProps> = ({
    chatId,
    leftSidebarOpen,
    rightSidebarOpen,
    onToggleLeftSidebar,
    onToggleRightSidebar,
    onNewChat,
    onNewProject,
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [oracleSidebarOpen, setOracleSidebarOpen] = useState(false);
    const [voiceTranscript, setVoiceTranscript] = useState('');
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectIcon, setProjectIcon] = useState('folder');
    const [projectColor, setProjectColor] = useState('blue');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [showWorkspaceBuilder, setShowWorkspaceBuilder] = useState(false);
    const [workspaceStep, setWorkspaceStep] = useState(1);
    const [workspaceData, setWorkspaceData] = useState({
        industry: '',
        teamSize: '',
        goals: [] as string[],
        tools: [] as string[],
        budget: ''
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    // Text-to-Speech Handler
    const speakText = (text: string) => {
        if (!voiceEnabled || !synthRef.current) return;
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        synthRef.current.speak(utterance);
    };

    // Toggle Voice Conversation
    const toggleVoiceConversation = () => {
        const newState = !voiceEnabled;
        setVoiceEnabled(newState);
        if (!newState && synthRef.current) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    };

    // Handler for New Chat
    const handleNewChat = () => {
        setMessages([]);
        setInputValue('');
        setUploadedFiles([]);
        setOracleSidebarOpen(false);
        if (onNewChat) onNewChat();
    };

    // Voice Recognition Setup
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.onresult = (event: any) => {
                    let transcript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        transcript += event.results[i][0].transcript;
                    }
                    setVoiceTranscript(transcript);
                    setInputValue(transcript);
                };
                recognitionRef.current = recognition;
            }
            if (window.speechSynthesis) synthRef.current = window.speechSynthesis;
        }
    }, []);

    // Load initial message
    useEffect(() => {
        if (chatId && messages.length === 0) {
            setMessages([{
                id: '1',
                chatId,
                role: 'rkle',
                content: "👋 Hello! I'm Rkle, your AI Co-Founder. I'm here to help you with sales, marketing, business development, and everything in between.\n\nI can:\n• Generate images, documents, spreadsheets\n• Connect with Google Workspace, ERP, Invoice tools\n• Analyze data and provide strategic insights\n\nHow can I help your business today?",
                timestamp: new Date(),
                canCopy: true,
                canShare: true,
            }]);
        }
    }, [chatId]);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    useEffect(() => { scrollToBottom(); }, [messages]);

    const handleSubmit = async () => {
        if (!inputValue.trim() && uploadedFiles.length === 0) return;
        if (isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            chatId: chatId || 'default',
            role: 'user',
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        // Simulation for now - usually connects to /api/oracle/chat
        setTimeout(() => {
            const oracleMessage: Message = {
                id: Date.now().toString(),
                chatId: chatId || 'default',
                role: 'rkle',
                content: "I've analyzed your request. Based on current market trends and your business goals, I recommend focusing on customer retention through personalized AI automation. Would you like me to draft a roadmap for this?",
                timestamp: new Date(),
                canCopy: true,
                canShare: true,
            };
            setMessages(prev => [...prev, oracleMessage]);
            if (voiceEnabled) speakText(oracleMessage.content);
            setIsLoading(false);
        }, 1500);
    };

    const toggleVoiceRecording = () => {
        if (!recognitionRef.current) return;
        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        } else {
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    return (
        <div className="flex h-full overflow-hidden w-full relative">
            <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
                {/* Header */}
                <div className="h-14 border-b border-slate-200 flex items-center justify-between px-4 bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-purple-50">
                                <span className="material-icons text-white text-xl">psychology</span>
                            </div>
                            <div>
                                <h2 className="font-bold text-base text-slate-900">Rkle Studio</h2>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <p className="text-[11px] text-purple-600 font-semibold">Your AI co-founder</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleVoiceConversation}
                            className={`p-2 rounded-lg transition-all ${voiceEnabled ? 'bg-purple-100 text-purple-600' : 'hover:bg-slate-100 text-slate-600'}`}
                        >
                            <span className="material-icons text-xl">{voiceEnabled ? 'volume_up' : 'volume_off'}</span>
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center min-h-full py-10">
                            <div className="text-center max-w-2xl px-4">
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                                    <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl ring-4 ring-purple-50">
                                        <span className="material-icons text-white text-5xl">psychology</span>
                                    </div>
                                </div>
                                <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Rkle AI Studio</h1>
                                <p className="text-sm text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">Your professional control room. I can run simulations, analyze sales, and manage your entire business operations through chat.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-lg mx-auto">
                                    {[
                                        { title: 'Sales Strategy', desc: 'Generate Q2 roadmap', icon: 'trending_up' },
                                        { title: 'Marketing Ideas', desc: 'Campaign suggestions', icon: 'campaign' },
                                        { title: 'Analyze Data', desc: 'Insights from sheets', icon: 'analytics' },
                                        { title: 'Business Plan', desc: 'Financial projections', icon: 'description' }
                                    ].map((action, i) => (
                                        <button key={i} onClick={() => setInputValue(action.title)} className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-purple-400 hover:shadow-xl transition-all group flex items-start gap-3">
                                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600 group-hover:scale-110 transition-transform"><span className="material-icons text-xl">{action.icon}</span></div>
                                            <div><div className="font-bold text-slate-800 text-xs">{action.title}</div><div className="text-[10px] text-slate-400">{action.desc}</div></div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                                    <div className="flex items-start gap-3 max-w-[85%]">
                                        {msg.role === 'rkle' && (
                                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm"><span className="material-icons text-white text-sm">auto_awesome</span></div>
                                        )}
                                        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-100 text-slate-800'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="px-4 py-3 bg-white border border-slate-100 rounded-2xl flex gap-1 shadow-sm"><span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-150"></span><span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-300"></span></div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200">
                    <div className="max-w-4xl mx-auto relative group">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 transition-all focus-within:bg-white focus-within:border-purple-400 focus-within:shadow-2xl focus-within:shadow-purple-500/5">
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                                placeholder="Message your AI Co-Founder..."
                                rows={1}
                                className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 text-sm resize-none"
                            />
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-1">
                                    <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"><span className="material-icons text-lg">attach_file</span></button>
                                    <button onClick={toggleVoiceRecording} className={`p-2 rounded-lg transition-all ${isRecording ? 'bg-red-50 text-red-600 animate-pulse' : 'hover:bg-slate-200 text-slate-500'}`}><span className="material-icons text-lg">{isRecording ? 'stop' : 'mic'}</span></button>
                                </div>
                                <button onClick={handleSubmit} disabled={!inputValue.trim() || isLoading} className="bg-purple-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-purple-700 disabled:opacity-50 shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2">
                                    {isLoading ? 'Wait...' : 'Send'}<span className="material-icons text-xs">send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" />
        </div>
    );
};

export default CenterChat;
