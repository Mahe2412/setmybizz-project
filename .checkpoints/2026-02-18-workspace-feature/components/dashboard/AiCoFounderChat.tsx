'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
    attachments?: Array<{
        type: 'image' | 'document';
        name: string;
        url: string;
        size?: string;
    }>;
}

interface AiCoFounderChatProps {
    defaultMinimized?: boolean;
}

const AiCoFounderChat: React.FC<AiCoFounderChatProps> = ({ defaultMinimized = false }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'ai',
            content: "नमस्ते! Hi! I'm your AI Co-Founder 🚀\n\nI can help you with Marketing, Sales, Operations, Analytics and much more. What would you like to work on today?",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getBusinessProfile = () => {
        try {
            const profile = localStorage.getItem('workspaceProfile');
            return profile ? JSON.parse(profile) : null;
        } catch {
            return null;
        }
    };

    const handleFileSelect = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const fileArray = Array.from(files);
        setAttachments(prev => [...prev, ...fileArray]);
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleQuickAction = (action: string) => {
        setInputValue(action);
    };

    const handleVoiceInput = () => {
        setIsRecording(!isRecording);
        // Voice recording logic would go here
        if (!isRecording) {
            setTimeout(() => setIsRecording(false), 3000);
        }
    };

    const handleSubmit = async () => {
        if ((!inputValue.trim() && attachments.length === 0) || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: inputValue || '📎 Sent attachments',
            timestamp: new Date(),
            attachments: attachments.map(file => ({
                type: file.type.startsWith('image/') ? 'image' : 'document',
                name: file.name,
                url: URL.createObjectURL(file),
                size: `${(file.size / 1024).toFixed(1)} KB`
            }))
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        const currentAttachments = [...attachments];
        setAttachments([]);
        setIsLoading(true);

        try {
            let apiMessage = inputValue;
            if (currentAttachments.length > 0) {
                apiMessage += `\n\n[User attached ${currentAttachments.length} file(s): ${currentAttachments.map(f => f.name).join(', ')}]`;
            }

            const response = await fetch('/api/ai-cofounder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: apiMessage,
                    userId: 'workspace-user',
                    userRole: 'owner',
                    businessProfile: getBusinessProfile(),
                    conversationHistory: messages.slice(-6)
                })
            });

            const data = await response.json();

            if (data.success) {
                const aiMessage: Message = {
                    role: 'ai',
                    content: data.response,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                throw new Error(data.response || data.error || 'Failed to get response');
            }
        } catch (error: any) {
            console.error('AI error:', error);
            const errorMessage: Message = {
                role: 'ai',
                content: `I encountered an issue: ${error.message}. Please try again.`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const quickActions = [
        { label: 'Marketing Ideas', icon: 'campaign', gradient: 'from-pink-500 to-rose-500' },
        { label: 'Email Campaign', icon: 'mail', gradient: 'from-blue-500 to-cyan-500' },
        { label: 'WhatsApp Message', icon: 'chat', gradient: 'from-green-500 to-emerald-500' },
        { label: 'Sales Strategy', icon: 'trending_up', gradient: 'from-purple-500 to-indigo-500' },
        { label: 'Financial Report', icon: 'analytics', gradient: 'from-orange-500 to-amber-500' },
    ];

    const toolConnections = [
        { label: 'Marketing', icon: 'campaign', angle: 0, color: 'text-pink-400' },
        { label: 'Email', icon: 'mail', angle: 45, color: 'text-blue-400' },
        { label: 'Inventory', icon: 'inventory_2', angle: 90, color: 'text-green-400' },
        { label: 'CRM', icon: 'people', angle: 135, color: 'text-purple-400' },
        { label: 'Analytics', icon: 'bar_chart', angle: 180, color: 'text-orange-400' },
        { label: 'Sales', icon: 'shopping_cart', angle: 225, color: 'text-cyan-400' },
        { label: 'Support', icon: 'support_agent', angle: 270, color: 'text-indigo-400' },
        { label: 'Finance', icon: 'account_balance', angle: 315, color: 'text-yellow-400' },
    ];

    return (
        <div className="w-full h-full bg-gradient-to-br from-white via-indigo-50 to-purple-50 rounded-2xl shadow-2xl border border-indigo-200 flex flex-col overflow-hidden relative">
            {/* Background Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse"></div>
            </div>

            {/* AI Brain Hub Section */}
            <div className="relative p-8 border-b border-indigo-200 bg-gradient-to-b from-indigo-100/30 to-transparent">
                {/* Central Brain Container */}
                <div className="relative w-48 h-48 mx-auto mb-6">
                    {/* Animated Pulse Rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-20 animate-ping"></div>
                        <div className="absolute w-40 h-40 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-10 animate-pulse"></div>
                    </div>

                    {/* Tool Connections */}
                    {toolConnections.map((tool, idx) => {
                        const radius = 90;
                        const x = Math.cos((tool.angle * Math.PI) / 180) * radius;
                        const y = Math.sin((tool.angle * Math.PI) / 180) * radius;

                        return (
                            <div key={idx}>
                                {/* Connection Line */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                                    <line
                                        x1="50%"
                                        y1="50%"
                                        x2={`calc(50% + ${x}px)`}
                                        y2={`calc(50% + ${y}px)`}
                                        stroke="url(#gradient)"
                                        strokeWidth="1"
                                        className="animate-pulse"
                                        opacity="0.4"
                                    />
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                                            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
                                            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                {/* Tool Icon */}
                                <div
                                    className="absolute w-10 h-10 -ml-5 -mt-5 flex items-center justify-center bg-white backdrop-blur-md rounded-lg border border-indigo-300 shadow-lg hover:scale-110 transition-transform cursor-pointer group"
                                    style={{
                                        left: `calc(50% + ${x}px)`,
                                        top: `calc(50% + ${y}px)`,
                                        zIndex: 10,
                                    }}
                                >
                                    <span className={`material-icons text-sm ${tool.color} group-hover:scale-125 transition-transform`}>
                                        {tool.icon}
                                    </span>
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-2 py-1 rounded text-[10px] font-bold text-white whitespace-nowrap">
                                        {tool.label}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Central Brain Icon */}
                    <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 20 }}>
                        <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/50 animate-pulse">
                            <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                                <span className="material-icons text-5xl bg-gradient-to-br from-cyan-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
                                    psychology
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center">
                    <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        AI Co-Founder
                    </h2>
                    <p className="text-indigo-700 text-sm font-medium">
                        Central Intelligence • Connected to All Business Functions
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4f46e5 transparent' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        {msg.role === 'ai' && (
                            <div className="w-8 h-8 mr-3 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                                <span className="material-icons text-white text-sm">psychology</span>
                            </div>
                        )}

                        <div className={`max-w-[80%] rounded-2xl shadow-lg backdrop-blur-md ${msg.role === 'user'
                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-none'
                            : 'bg-white border-2 border-indigo-200 text-slate-800 rounded-tl-none'
                            }`}>
                            <div className="px-4 py-3">
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            </div>

                            {msg.attachments && msg.attachments.length > 0 && (
                                <div className={`px-4 pb-3 space-y-2 border-t ${msg.role === 'user' ? 'border-white/20' : 'border-indigo-200'} pt-2`}>
                                    {msg.attachments.map((att, i) => (
                                        <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${msg.role === 'user' ? 'bg-white/10' : 'bg-indigo-50 border border-indigo-100'}`}>
                                            {att.type === 'image' ? (
                                                <img src={att.url} alt={att.name} className="w-8 h-8 rounded object-cover" />
                                            ) : (
                                                <span className="material-icons text-lg opacity-70">description</span>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold truncate">{att.name}</p>
                                                <p className="text-[10px] opacity-70">{att.size}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="px-4 pb-2 text-[10px] text-right opacity-60 font-medium">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>

                        {msg.role === 'user' && (
                            <div className="w-8 h-8 ml-3 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="material-icons text-slate-300 text-sm">person</span>
                            </div>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start animate-in fade-in">
                        <div className="w-8 h-8 mr-3 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg">
                            <span className="material-icons text-white text-sm animate-spin">psychology</span>
                        </div>
                        <div className="bg-white border-2 border-indigo-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-lg">
                            <div className="flex items-center gap-2">
                                <span className="flex gap-1">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                                </span>
                                <span className="text-xs text-indigo-700 font-medium ml-2">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-3 border-t border-indigo-200 bg-white/80 backdrop-blur-sm">
                <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                    {quickActions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleQuickAction(action.label)}
                            className={`flex-shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r ${action.gradient} text-white text-xs font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2 hover:shadow-xl`}
                        >
                            <span className="material-icons text-sm">{action.icon}</span>
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Attachment Preview */}
            {attachments.length > 0 && (
                <div className="px-6 py-3 bg-indigo-50/50 border-t border-indigo-200 flex gap-2 overflow-x-auto">
                    {attachments.map((file, idx) => (
                        <div key={idx} className="relative group bg-white border border-indigo-300 rounded-lg p-2 min-w-[120px] flex items-center gap-2 shadow-md">
                            <button
                                onClick={() => removeAttachment(idx)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                <span className="material-icons text-xs block">close</span>
                            </button>
                            <span className="material-icons text-indigo-400 text-lg">
                                {file.type.startsWith('image/') ? 'image' : 'description'}
                            </span>
                            <div className="overflow-hidden">
                                <p className="text-xs font-medium text-slate-800 truncate w-20">{file.name}</p>
                                <p className="text-[10px] text-indigo-600">{(file.size / 1024).toFixed(0)} KB</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white/90 backdrop-blur-md border-t border-indigo-200 relative z-20">
                <div className="flex items-end gap-2 bg-white border-2 border-indigo-300 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-500 transition-all shadow-lg">
                    {/* Left Icons: Upload & Voice */}
                    <div className="flex gap-1 pb-1 pl-1">
                        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleFileSelect(e.target.files)} />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-all"
                            title="Upload Documents"
                        >
                            <span className="material-icons text-xl">attach_file</span>
                        </button>

                        <button
                            onClick={handleVoiceInput}
                            className={`p-2 rounded-lg transition-all ${isRecording ? 'text-red-400 bg-red-500/10 animate-pulse' : 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10'}`}
                            title="Voice Input (All Indian Languages)"
                        >
                            <span className="material-icons text-xl">{isRecording ? 'mic' : 'mic_none'}</span>
                        </button>

                        <button
                            className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-all relative group"
                            title="Multi-language Support"
                        >
                            <span className="material-icons text-xl">translate</span>
                            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-slate-800 text-white text-[10px] px-3 py-2 rounded-lg shadow-xl whitespace-nowrap border border-indigo-400">
                                🇮🇳 Hindi • English • Telugu • Tamil • Bengali
                            </div>
                        </button>
                    </div>

                    {/* Input */}
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything... (Type in English, Hindi, Telugu, or any Indian language)"
                        disabled={isLoading}
                        rows={1}
                        className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-indigo-400/60 text-sm py-3 px-2 resize-none max-h-32 min-h-[44px]"
                    />

                    {/* Send Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={(!inputValue.trim() && attachments.length === 0) || isLoading}
                        className={`p-3 rounded-xl transition-all flex items-center justify-center mb-0.5 shadow-lg ${(!inputValue.trim() && attachments.length === 0) || isLoading
                            ? 'bg-slate-300 text-slate-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/50 hover:scale-105'
                            }`}
                    >
                        {isLoading ? (
                            <span className="material-icons animate-spin">refresh</span>
                        ) : (
                            <span className="material-icons">send</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiCoFounderChat;
