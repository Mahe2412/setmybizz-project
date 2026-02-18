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

        // Cancel any ongoing speech
        synthRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.lang = 'en-US';

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

        // Show notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-top';
        notification.textContent = newState ? '🔊 Voice conversation enabled' : '🔇 Voice conversation disabled';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    };

    // Handler for New Chat
    const handleNewChat = () => {
        setMessages([]);
        setInputValue('');
        setUploadedFiles([]);
        setOracleSidebarOpen(false);

        if (onNewChat) onNewChat();

        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-top';
        notification.textContent = '✓ New chat started!';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    };

    // Handler for New Project
    const handleCreateProject = () => {
        if (!projectName.trim()) return;

        // Save project
        if (onNewProject) {
            onNewProject(projectName, projectIcon, projectColor);
        }

        console.log('Creating project:', { name: projectName, icon: projectIcon, color: projectColor });

        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-top';
        notification.textContent = `✓ Project "${projectName}" created!`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);

        // Reset and close modal
        setProjectName('');
        setProjectIcon('folder');
        setProjectColor('blue');
        setShowProjectModal(false);
    };

    // Voice Recognition & Speech Synthesis Setup
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Initialize Speech Recognition
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
                    setVoiceTranscript(transcript);
                    setInputValue(transcript);
                };

                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                    setIsRecording(false);
                };

                recognition.onend = () => {
                    setIsRecording(false);
                };

                recognitionRef.current = recognition;
            }

            // Initialize Speech Synthesis
            if (window.speechSynthesis) {
                synthRef.current = window.speechSynthesis;
            }
        }
    }, []);

    // Load initial message
    useEffect(() => {
        if (chatId && messages.length === 0) {
            setMessages([{
                id: '1',
                chatId,
                role: 'rkle',
                content: "👋 Hello! I'm Rkle, your AI Co-Founder. I'm here to help you with sales, marketing, business development, and everything in between.\n\nI can:\n• Generate images, documents, spreadsheets\n• Connect with Google Workspace, ERP, Invoice tools\n• Analyze data and provide strategic insights\n• Create brochures, presentations, and reports\n\nHow can I help your business today?",
                timestamp: new Date(),
                canCopy: true,
                canShare: true,
            }]);
        }
    }, [chatId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

        try {
            const response = await fetch('/api/oracle/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: inputValue,
                    chatId,
                    conversationHistory: messages.slice(-6),
                })
            });

            const data = await response.json();

            if (data.success) {
                const oracleMessage: Message = {
                    id: Date.now().toString(),
                    chatId: chatId || 'default',
                    role: 'rkle',
                    content: data.response,
                    timestamp: new Date(),
                    canCopy: true,
                    canShare: true,
                };
                setMessages(prev => [...prev, oracleMessage]);

                // Speak the response if voice conversation is enabled
                speakText(data.response);
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: Date.now().toString(),
                chatId: chatId || 'default',
                role: 'rkle',
                content: "I apologize, but I'm having trouble connecting right now. Please try again.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);

            // Speak error message if voice is enabled
            speakText("I apologize, but I'm having trouble connecting right now. Please try again.");
        } finally {
            setIsLoading(false);
            setUploadedFiles([]);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploadedFiles(Array.from(e.target.files));
        }
    };

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
        // TODO: Show toast notification
    };

    const handleShare = (content: string) => {
        if (navigator.share) {
            navigator.share({
                text: content,
                title: 'Rkle AI Response',
            });
        }
    };

    const toggleVoiceRecording = () => {
        if (!recognitionRef.current) {
            alert('Voice recognition not supported in this browser. Please use Chrome or Edge.');
            return;
        }

        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        } else {
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    return (
        <div className="flex h-full overflow-hidden">
            {/* Oracle Internal Sidebar */}
            <div className={`bg-slate-900 border-r border-slate-700 transition-all duration-300 flex-shrink-0 ${oracleSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
                <div className="h-full flex flex-col p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="material-icons text-white text-sm">psychology</span>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-xs">Rkle</h3>
                                <p className="text-slate-400 text-[9px]">SetMyBizz AI Studio</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setOracleSidebarOpen(false)}
                            className="p-1 hover:bg-slate-800 rounded transition-colors"
                        >
                            <span className="material-icons text-slate-400 text-sm">close</span>
                        </button>
                    </div>

                    {/* New Chat Button */}
                    <button
                        onClick={handleNewChat}
                        className="w-full px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                        <span className="material-icons text-sm">add</span>
                        New Chat
                    </button>

                    {/* Menu Items */}
                    <div className="flex-1 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                        <button
                            onClick={() => setShowProjectModal(true)}
                            className="w-full px-3 py-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-2 transition-colors text-left"
                        >
                            <span className="material-icons text-sm">folder</span>
                            New Project
                        </button>

                        <div className="border-t border-slate-700 my-2"></div>

                        <button className="w-full px-3 py-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-2 transition-colors text-left">
                            <span className="material-icons text-sm">extension</span>
                            Connect Apps
                        </button>

                        <button className="w-full px-3 py-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-2 transition-colors text-left">
                            <span className="material-icons text-sm">task_alt</span>
                            Tasks
                            <span className="ml-auto bg-purple-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">3</span>
                        </button>

                        <button className="w-full px-3 py-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-2 transition-colors text-left">
                            <span className="material-icons text-sm">notifications</span>
                            Notifications
                            <span className="ml-auto bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">5</span>
                        </button>

                        <div className="border-t border-slate-700 my-2"></div>

                        <button className="w-full px-3 py-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-2 transition-colors text-left">
                            <span className="material-icons text-sm">settings</span>
                            Settings
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="border-t border-slate-700 pt-3">
                        <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
                            <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                <span className="material-icons text-white text-xs">person</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-xs font-medium truncate">User</p>
                                <p className="text-slate-400 text-[9px] truncate">Free Plan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
                {/* Header */}
                <div className="h-14 border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0 bg-white">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setOracleSidebarOpen(!oracleSidebarOpen)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Toggle Rkle Menu"
                        >
                            <span className="material-icons text-slate-600">menu</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-300 ring-2 ring-purple-200 animate-pulse">
                                <span className="material-icons text-white text-xl">psychology</span>
                            </div>
                            <div>
                                <h2 className="font-bold text-base text-slate-900">Rkle</h2>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <p className="text-[11px] text-purple-600 font-semibold">Your AI co-founder</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Voice Conversation Toggle */}
                        <button
                            onClick={toggleVoiceConversation}
                            className={`p-2 rounded-lg transition-all ${voiceEnabled
                                ? 'bg-purple-100 text-purple-600'
                                : 'hover:bg-slate-100 text-slate-600'
                                } ${isSpeaking ? 'animate-pulse' : ''}`}
                            title={voiceEnabled ? "Disable voice conversation" : "Enable voice conversation"}
                        >
                            <span className="material-icons text-xl">
                                {voiceEnabled ? 'volume_up' : 'volume_off'}
                            </span>
                        </button>
                        {!rightSidebarOpen && (
                            <button
                                onClick={onToggleRightSidebar}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                title="Show Tools"
                            >
                                <span className="material-icons text-slate-600">widgets</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-slate-50">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center max-w-2xl px-4">
                                {/* AI Co-Founder Brain - Large Visual */}
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                                    <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-300 ring-8 ring-purple-50">
                                        <span className="material-icons text-white" style={{ fontSize: '80px' }}>psychology</span>
                                    </div>
                                    {/* Orbiting Icons */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-blue-100 p-2 rounded-lg shadow-lg animate-bounce">
                                        <span className="material-icons text-blue-600 text-sm">email</span>
                                    </div>
                                    <div className="absolute bottom-0 right-1/4 translate-y-4 bg-green-100 p-2 rounded-lg shadow-lg animate-bounce" style={{ animationDelay: '0.2s' }}>
                                        <span className="material-icons text-green-600 text-sm">trending_up</span>
                                    </div>
                                    <div className="absolute bottom-0 left-1/4 translate-y-4 bg-orange-100 p-2 rounded-lg shadow-lg animate-bounce" style={{ animationDelay: '0.4s' }}>
                                        <span className="material-icons text-orange-600 text-sm">analytics</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 mb-3">
                                    Welcome to Rkle
                                </h1>
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <span className="text-lg font-bold text-slate-700">🧠 Your AI Co-founder</span>
                                    <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-bold rounded-full border border-purple-200">
                                        Business Brain
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 mb-8 max-w-lg mx-auto">
                                    I help with sales, marketing, business development, and everything in between. Just ask me anything!
                                </p>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-2 gap-3 text-left max-w-md mx-auto">
                                    <button
                                        onClick={() => setInputValue("Create a sales strategy for Q2")}
                                        className="p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 hover:shadow-lg transition-all group"
                                    >
                                        <span className="material-icons text-2xl text-purple-600 mb-2 group-hover:scale-110 transition-transform">trending_up</span>
                                        <div className="font-bold text-slate-800 text-sm">Sales Strategy</div>
                                        <div className="text-xs text-slate-500">Q2 planning</div>
                                    </button>
                                    <button
                                        onClick={() => setInputValue("Generate a marketing campaign")}
                                        className="p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 hover:shadow-lg transition-all group"
                                    >
                                        <span className="material-icons text-2xl text-purple-600 mb-2 group-hover:scale-110 transition-transform">campaign</span>
                                        <div className="font-bold text-slate-800 text-sm">Marketing Ideas</div>
                                        <div className="text-xs text-slate-500">Get campaigns</div>
                                    </button>
                                    <button
                                        onClick={() => setInputValue("Create a business plan")}
                                        className="p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 hover:shadow-lg transition-all group"
                                    >
                                        <span className="material-icons text-2xl text-purple-600 mb-2 group-hover:scale-110 transition-transform">description</span>
                                        <div className="font-bold text-slate-800 text-sm">Business Plan</div>
                                        <div className="text-xs text-slate-500">Full roadmap</div>
                                    </button>
                                    <button
                                        onClick={() => setInputValue("Analyze my sales data")}
                                        className="p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 hover:shadow-lg transition-all group"
                                    >
                                        <span className="material-icons text-2xl text-purple-600 mb-2 group-hover:scale-110 transition-transform">analytics</span>
                                        <div className="font-bold text-slate-800 text-sm">Data Analysis</div>
                                        <div className="text-xs text-slate-500">Insights</div>
                                    </button>
                                </div>

                                {/* Build Customized Workspace Button */}
                                <button
                                    onClick={() => setShowWorkspaceBuilder(true)}
                                    className="mt-6 w-full max-w-md mx-auto py-4 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-xl font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
                                >
                                    <span className="material-icons text-2xl group-hover:rotate-12 transition-transform">construction</span>
                                    Build Your Customized Workspace
                                    <span className="material-icons text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
                                    <div className={`flex items-start gap-3 max-w-[75%]`}>
                                        {msg.role === 'rkle' && (
                                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="material-icons text-white text-sm">auto_awesome</span>
                                            </div>
                                        )}
                                        <div className={`flex-1`}>
                                            <div className={`rounded-2xl px-4 py-3 ${msg.role === 'user'
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-slate-100 text-slate-800'
                                                }`}>
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                            </div>
                                            {msg.canCopy && msg.role === 'rkle' && (
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        onClick={() => handleCopy(msg.content)}
                                                        className="text-xs text-slate-500 hover:text-purple-600 flex items-center gap-1 transition-colors"
                                                    >
                                                        <span className="material-icons text-sm">content_copy</span>
                                                        Copy
                                                    </button>
                                                    <button
                                                        onClick={() => handleShare(msg.content)}
                                                        className="text-xs text-slate-500 hover:text-purple-600 flex items-center gap-1 transition-colors"
                                                    >
                                                        <span className="material-icons text-sm">share</span>
                                                        Share
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        {msg.role === 'user' && (
                                            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="material-icons text-white text-sm">person</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                            <span className="material-icons text-white text-sm">auto_awesome</span>
                                        </div>
                                        <div className="bg-slate-100 rounded-2xl px-4 py-3">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div >

                {/* Input Area */}
                < div className="border-t border-slate-200 p-4 bg-white flex-shrink-0" >
                    {
                        uploadedFiles.length > 0 && (
                            <div className="mb-2 flex flex-wrap gap-2">
                                {uploadedFiles.map((file, idx) => (
                                    <div key={idx} className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs">
                                        <span className="material-icons text-sm text-purple-600">attach_file</span>
                                        <span className="text-purple-800">{file.name}</span>
                                        <button
                                            onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx))}
                                            className="text-purple-600 hover:text-purple-800"
                                        >
                                            <span className="material-icons text-sm">close</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )
                    }
                    < div className="max-w-4xl mx-auto bg-slate-50 border border-slate-300 rounded-2xl p-3 focus-within:border-purple-500 focus-within:bg-white transition-all" >
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                            placeholder="Ask your AI co-founder..."
                            disabled={isLoading}
                            rows={1}
                            className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 text-sm resize-none"
                            style={{ minHeight: '24px', maxHeight: '200px' }}
                        />
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.svg"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                                    title="Attach Files"
                                >
                                    <span className="material-icons text-slate-600 text-lg">attach_file</span>
                                </button>
                                <button
                                    onClick={toggleVoiceRecording}
                                    className={`p-1.5 rounded-lg transition-all duration-200 ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'hover:bg-slate-200 text-slate-600'}`}
                                    title={isRecording ? "Stop Recording" : "Start Voice Input"}
                                >
                                    <span className="material-icons text-lg">{isRecording ? 'stop_circle' : 'mic'}</span>
                                </button>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={(!inputValue.trim() && uploadedFiles.length === 0) || isLoading}
                                className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 transition-all ${(!inputValue.trim() && uploadedFiles.length === 0) || isLoading
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-purple-600 text-white hover:bg-purple-700'
                                    }`}
                            >
                                <span className="material-icons text-sm">send</span>
                                Send
                            </button>
                        </div>
                    </div >
                    <p className="text-center text-[10px] text-slate-400 mt-2">Rkle can make mistakes. Check important info.</p>
                </div >
            </div >

            {/* Project Creation Modal */}
            {
                showProjectModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in duration-200">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-900">Create New Project</h3>
                                <button
                                    onClick={() => setShowProjectModal(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <span className="material-icons text-slate-600">close</span>
                                </button>
                            </div>

                            {/* Project Name Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Project Name</label>
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    placeholder="e.g., Marketing Campaign 2024"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:border-purple-500 focus:bg-white focus:outline-none transition-all"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCreateProject();
                                        }
                                    }}
                                    autoFocus
                                />
                            </div>

                            {/* Icon Picker */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 mb-3">Choose Icon</label>
                                <div className="grid grid-cols-6 gap-2">
                                    {['folder', 'trending_up', 'business_center', 'account_balance', 'shopping_cart', 'campaign', 'analytics', 'lightbulb', 'rocket_launch', 'EmojiObjects', 'psychology', 'auto_awesome'].map((icon) => (
                                        <button
                                            key={icon}
                                            onClick={() => setProjectIcon(icon)}
                                            className={`p-3 rounded-lg border-2 transition-all ${projectIcon === icon
                                                ? 'border-purple-600 bg-purple-50'
                                                : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            <span className={`material-icons text-xl ${projectIcon === icon ? 'text-purple-600' : 'text-slate-600'}`}>
                                                {icon}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Picker */}
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 mb-3">Choose Color</label>
                                <div className="grid grid-cols-8 gap-2">
                                    {['blue', 'purple', 'pink', 'red', 'orange', 'yellow', 'green', 'teal'].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setProjectColor(color)}
                                            className={`w-10 h-10 rounded-lg transition-all ${projectColor === color
                                                ? 'ring-2 ring-offset-2 ring-slate-900 scale-110'
                                                : 'hover:scale-105'
                                                }`}
                                            style={{ backgroundColor: `var(--color-${color}-500, #6366f1)` }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-xs text-slate-600 mb-2 font-bold">Preview</p>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 bg-${projectColor}-100 rounded-xl flex items-center justify-center`}>
                                        <span className={`material-icons text-${projectColor}-600`}>{projectIcon}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{projectName || 'Project Name'}</p>
                                        <p className="text-xs text-slate-500">0 chats</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowProjectModal(false)}
                                    className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateProject}
                                    disabled={!projectName.trim()}
                                    className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all ${projectName.trim()
                                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    Create Project
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            {/* Workspace Builder Modal - Questionnaire Flow */}
            {
                showWorkspaceBuilder && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
                            {/* Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white p-6 rounded-t-3xl text-left">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-black">Build Your Workspace</h2>
                                        <p className="text-sm text-purple-100 mt-1">Step {workspaceStep} of 5 - Let&apos;s customize your perfect workspace!</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowWorkspaceBuilder(false);
                                            setWorkspaceStep(1);
                                        }}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <span className="material-icons">close</span>
                                    </button>
                                </div>
                                {/* Progress Bar */}
                                <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white transition-all duration-300"
                                        style={{ width: `${(workspaceStep / 5) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Question Content */}
                            <div className="p-8">
                                {/* Step 1: Industry */}
                                {workspaceStep === 1 && (
                                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                                        <div className="text-center mb-8">
                                            <span className="material-icons text-6xl text-purple-600 mb-4 inline-block">business</span>
                                            <h3 className="text-2xl font-bold text-slate-900">What&apos;s your industry?</h3>
                                            <p className="text-slate-600 mt-2">Help us understand your business better</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['E-commerce', 'SaaS', 'Consulting', 'Manufacturing', 'Healthcare', 'Education', 'Real Estate', 'Other'].map((ind) => (
                                                <button
                                                    key={ind}
                                                    onClick={() => setWorkspaceData({ ...workspaceData, industry: ind })}
                                                    className={`p-4 rounded-xl border-2 transition-all text-left ${workspaceData.industry === ind
                                                        ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                                                        : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50'
                                                        }`}
                                                >
                                                    <span className="font-bold text-slate-900">{ind}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Team Size */}
                                {workspaceStep === 2 && (
                                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                                        <div className="text-center mb-8">
                                            <span className="material-icons text-6xl text-purple-600 mb-4 inline-block">groups</span>
                                            <h3 className="text-2xl font-bold text-slate-900">What&apos;s your team size?</h3>
                                            <p className="text-slate-600 mt-2">This helps us scale your workspace</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {['Just me (1)', 'Small (2-10)', 'Medium (11-50)', 'Large (50+)'].map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setWorkspaceData({ ...workspaceData, teamSize: size })}
                                                    className={`p-6 rounded-xl border-2 transition-all ${workspaceData.teamSize === size
                                                        ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                                                        : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50'
                                                        }`}
                                                >
                                                    <div className="text-3xl mb-2">{size.includes('Just') ? '👤' : size.includes('Small') ? '👥' : size.includes('Medium') ? '👨‍👩‍👧‍👦' : '🏢'}</div>
                                                    <span className="font-bold text-slate-900">{size}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Goals */}
                                {workspaceStep === 3 && (
                                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                                        <div className="text-center mb-8">
                                            <span className="material-icons text-6xl text-purple-600 mb-4 inline-block">flag</span>
                                            <h3 className="text-2xl font-bold text-slate-900">What are your main goals?</h3>
                                            <p className="text-slate-600 mt-2">Select all that apply</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {[
                                                { id: 'sales', label: 'Increase Sales', icon: 'trending_up' },
                                                { id: 'marketing', label: 'Improve Marketing', icon: 'campaign' },
                                                { id: 'operations', label: 'Streamline Operations', icon: 'settings' },
                                                { id: 'customer', label: 'Better Customer Service', icon: 'support_agent' },
                                                { id: 'analytics', label: 'Data & Analytics', icon: 'analytics' }
                                            ].map((goal) => (
                                                <button
                                                    key={goal.id}
                                                    onClick={() => {
                                                        const goals = workspaceData.goals.includes(goal.id)
                                                            ? workspaceData.goals.filter(g => g !== goal.id)
                                                            : [...workspaceData.goals, goal.id];
                                                        setWorkspaceData({ ...workspaceData, goals });
                                                    }}
                                                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${workspaceData.goals.includes(goal.id)
                                                        ? 'border-purple-600 bg-purple-50 shadow-md'
                                                        : 'border-slate-200 hover:border-purple-300'
                                                        }`}
                                                >
                                                    <span className={`material-icons text-2xl ${workspaceData.goals.includes(goal.id) ? 'text-purple-600' : 'text-slate-400'}`}>
                                                        {goal.icon}
                                                    </span>
                                                    <span className="font-bold text-slate-900 flex-1 text-left">{goal.label}</span>
                                                    {workspaceData.goals.includes(goal.id) && (
                                                        <span className="material-icons text-purple-600">check_circle</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Tools */}
                                {workspaceStep === 4 && (
                                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                                        <div className="text-center mb-8">
                                            <span className="material-icons text-6xl text-purple-600 mb-4 inline-block">extension</span>
                                            <h3 className="text-2xl font-bold text-slate-900">Which tools do you use?</h3>
                                            <p className="text-slate-600 mt-2">We'll integrate with your favorites</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { id: 'sheets', label: 'Google Sheets', icon: 'table_chart' },
                                                { id: 'docs', label: 'Google Docs', icon: 'description' },
                                                { id: 'gmail', label: 'Gmail', icon: 'mail' },
                                                { id: 'crm', label: 'CRM Software', icon: 'people' },
                                                { id: 'slack', label: 'Slack', icon: 'chat' },
                                                { id: 'zoom', label: 'Zoom', icon: 'videocam' }
                                            ].map((tool) => (
                                                <button
                                                    key={tool.id}
                                                    onClick={() => {
                                                        const tools = workspaceData.tools.includes(tool.id)
                                                            ? workspaceData.tools.filter(t => t !== tool.id)
                                                            : [...workspaceData.tools, tool.id];
                                                        setWorkspaceData({ ...workspaceData, tools });
                                                    }}
                                                    className={`p-4 rounded-xl border-2 transition-all ${workspaceData.tools.includes(tool.id)
                                                        ? 'border-purple-600 bg-purple-50 shadow-md'
                                                        : 'border-slate-200 hover:border-purple-300'
                                                        }`}
                                                >
                                                    <span className={`material-icons text-3xl mb-2 ${workspaceData.tools.includes(tool.id) ? 'text-purple-600' : 'text-slate-400'}`}>
                                                        {tool.icon}
                                                    </span>
                                                    <div className="font-bold text-sm text-slate-900">{tool.label}</div>
                                                    {workspaceData.tools.includes(tool.id) && (
                                                        <span className="material-icons text-green-600 text-sm mt-1">check</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Step 5: Budget */}
                                {workspaceStep === 5 && (
                                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                                        <div className="text-center mb-8">
                                            <span className="material-icons text-6xl text-purple-600 mb-4 inline-block">account_balance_wallet</span>
                                            <h3 className="text-2xl font-bold text-slate-900">What&apos;s your monthly budget?</h3>
                                            <p className="text-slate-600 mt-2">For automation and tools</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {[
                                                { value: 'free', label: 'Free Plan', desc: 'Perfect for getting started' },
                                                { value: 'basic', label: '$49/month', desc: 'Essential features' },
                                                { value: 'pro', label: '$99/month', desc: 'Advanced automation' },
                                                { value: 'enterprise', label: '$299+/month', desc: 'Full enterprise suite' }
                                            ].map((plan) => (
                                                <button
                                                    key={plan.value}
                                                    onClick={() => setWorkspaceData({ ...workspaceData, budget: plan.value })}
                                                    className={`p-5 rounded-xl border-2 transition-all text-left ${workspaceData.budget === plan.value
                                                        ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                                                        : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50'
                                                        }`}
                                                >
                                                    <div className="font-bold text-lg text-slate-900">{plan.label}</div>
                                                    <div className="text-sm text-slate-600 mt-1">{plan.desc}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200">
                                    {workspaceStep > 1 && (
                                        <button
                                            onClick={() => setWorkspaceStep(workspaceStep - 1)}
                                            className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span className="material-icons">arrow_back</span>
                                            Previous
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            if (workspaceStep < 5) {
                                                setWorkspaceStep(workspaceStep + 1);
                                            } else {
                                                // Final step - Generate workspace
                                                console.log('Workspace Data:', workspaceData);

                                                // Save to localStorage so Workspace dashboard can use it
                                                localStorage.setItem('workspaceProfile', JSON.stringify(workspaceData));

                                                const notification = document.createElement('div');
                                                notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-top';
                                                notification.textContent = '✓ Your customized workspace is being generated!';
                                                document.body.appendChild(notification);
                                                setTimeout(() => {
                                                    notification.remove();
                                                    // Trigger a reload if we're in the workspace view to show the new data
                                                    if (window.location.pathname.includes('workspace')) {
                                                        window.location.reload();
                                                    }
                                                }, 3000);

                                                setShowWorkspaceBuilder(false);
                                                setWorkspaceStep(1);
                                            }
                                        }}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                    >
                                        {workspaceStep < 5 ? 'Next' : 'Generate Workspace'}
                                        <span className="material-icons">{workspaceStep < 5 ? 'arrow_forward' : 'rocket_launch'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Floating AI Co-Founder Avatar - Transparent */}
            {
                messages.length > 0 && !isLoading && (
                    <div className="fixed bottom-24 right-8 z-30 animate-in slide-in-from-bottom duration-500">
                        <div className="relative group cursor-pointer">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-full blur-2xl opacity-40 group-hover:opacity-60 animate-pulse"></div>
                            {/* Avatar */}
                            <div className="relative w-20 h-20 bg-gradient-to-br from-purple-600/90 via-pink-600/90 to-indigo-700/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/50 group-hover:scale-110 transition-transform">
                                <span className="material-icons text-white text-4xl">{isSpeaking ? 'graphic_eq' : 'psychology'}</span>
                            </div>
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {isSpeaking ? 'Speaking...' : 'Rkle - Your AI Co-founder'}
                            </div>
                            {/* Voice indicator */}
                            {isSpeaking && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                                    <span className="material-icons text-white text-sm">mic</span>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default CenterChat;
