'use client';

import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
    chatId: string;
    attachments?: Array<{
        type: 'image' | 'document';
        name: string;
        url: string;
        size?: string;
    }>;
    generatedContent?: {
        type: 'image' | 'document';
        url: string;
        name: string;
    };
}

interface Chat {
    id: string;
    name: string;
    createdAt: Date;
    lastMessageAt: Date;
    messageCount: number;
}

type ChatMode = 'quick' | 'deep' | 'minimized';

const AdvancedAiCoFounder: React.FC = () => {
    const [mode, setMode] = useState<ChatMode>('quick');
    const [chats, setChats] = useState<Chat[]>([
        {
            id: 'default',
            name: 'General Chat',
            createdAt: new Date(),
            lastMessageAt: new Date(),
            messageCount: 1
        }
    ]);
    const [currentChatId, setCurrentChatId] = useState('default');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'ai',
            content: "नमस्ते! Hi! I'm your Advanced AI Co-Founder 🚀\n\nI'm powered by Gemini AI and ready to help with:\n• Marketing strategies\n• Sales optimization\n• Content generation\n• Data analysis\n• And much more!\n\nWhat can I help you build today?",
            timestamp: new Date(),
            chatId: 'default'
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showChatList, setShowChatList] = useState(false);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [newChatName, setNewChatName] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const currentChat = chats.find(c => c.id === currentChatId);
    const currentMessages = messages.filter(m => m.chatId === currentChatId);

    const createNewChat = () => {
        if (!newChatName.trim()) return;

        const newChat: Chat = {
            id: `chat-${Date.now()}`,
            name: newChatName,
            createdAt: new Date(),
            lastMessageAt: new Date(),
            messageCount: 0
        };

        setChats(prev => [newChat, ...prev]);
        setCurrentChatId(newChat.id);
        setNewChatName('');
        setShowNewChatModal(false);
    };

    const handleSubmit = async () => {
        if ((!inputValue.trim()) || isLoading) return;

        const userMessage: Message = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: inputValue,
            timestamp: new Date(),
            chatId: currentChatId
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const modelToUse = mode === 'deep' ? 'gemini-1.5-pro' : 'gemini-1.5-flash';

            const response = await fetch('/api/ai-cofounder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: inputValue,
                    chatId: currentChatId,
                    chatName: currentChat?.name,
                    mode: mode,
                    model: modelToUse,
                    conversationHistory: currentMessages.slice(-10),
                    replyingTo: replyingTo
                })
            });

            const data = await response.json();

            if (data.success) {
                const aiMessage: Message = {
                    id: `msg-${Date.now()}`,
                    role: 'ai',
                    content: data.response,
                    timestamp: new Date(),
                    chatId: currentChatId,
                    generatedContent: data.generatedContent
                };
                setMessages(prev => [...prev, aiMessage]);

                // Update chat metadata
                setChats(prev => prev.map(c =>
                    c.id === currentChatId
                        ? { ...c, lastMessageAt: new Date(), messageCount: c.messageCount + 2 }
                        : c
                ));
            }
        } catch (error: any) {
            console.error('AI error:', error);
        } finally {
            setIsLoading(false);
            setReplyingTo(null);
        }
    };

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
        // Show toast notification
    };

    const handleShare = async (content: string) => {
        if (navigator.share) {
            await navigator.share({
                title: 'AI Co-Founder Response',
                text: content
            });
        }
    };

    const handleSave = (message: Message) => {
        // Save to local storage or database
        const savedChats = JSON.parse(localStorage.getItem('saved-ai-responses') || '[]');
        savedChats.push(message);
        localStorage.setItem('saved-ai-responses', JSON.stringify(savedChats));
    };

    const handleDownload = (url: string, name: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        link.click();
    };

    const handleExportToDrive = async (url: string, name: string) => {
        // Integration with Google Drive API
        try {
            await fetch('/api/export-to-drive', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, name })
            });
        } catch (error) {
            console.error('Export error:', error);
        }
    };

    const renderMessage = (msg: Message) => (
        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300 group`}>
            {msg.role === 'ai' && (
                <div className="w-8 h-8 mr-3 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <span className="material-icons text-white text-sm">psychology</span>
                </div>
            )}

            <div className="flex flex-col max-w-[80%]">
                <div className={`rounded-2xl shadow-lg backdrop-blur-md ${msg.role === 'user'
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-none'
                    : 'bg-white border-2 border-indigo-200 text-slate-800 rounded-tl-none'
                    }`}>
                    <div className="px-4 py-3">
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>

                    {msg.generatedContent && (
                        <div className="px-4 pb-3 border-t border-indigo-200 pt-3 space-y-2">
                            <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <span className="material-icons text-indigo-600">
                                        {msg.generatedContent.type === 'image' ? 'image' : 'description'}
                                    </span>
                                    <span className="text-xs font-bold text-slate-700">{msg.generatedContent.name}</span>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleDownload(msg.generatedContent!.url, msg.generatedContent!.name)}
                                        className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                                        title="Save to PC"
                                    >
                                        <span className="material-icons text-sm">download</span>
                                        PC
                                    </button>
                                    <button
                                        onClick={() => handleExportToDrive(msg.generatedContent!.url, msg.generatedContent!.name)}
                                        className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                                        title="Export to Google Drive"
                                    >
                                        <span className="material-icons text-sm">cloud_upload</span>
                                        Drive
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="px-4 pb-2 text-[10px] text-right opacity-60 font-medium flex items-center justify-between">
                        <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>

                {/* Message Action Buttons */}
                <div className="flex items-center gap-1 mt-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => handleCopy(msg.content)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all flex items-center gap-1"
                        title="Copy"
                    >
                        <span className="material-icons text-xs text-slate-600">content_copy</span>
                        <span className="text-[10px] font-bold text-slate-600">Copy</span>
                    </button>
                    <button
                        onClick={() => handleShare(msg.content)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all flex items-center gap-1"
                        title="Share"
                    >
                        <span className="material-icons text-xs text-slate-600">share</span>
                        <span className="text-[10px] font-bold text-slate-600">Share</span>
                    </button>
                    <button
                        onClick={() => handleSave(msg)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all flex items-center gap-1"
                        title="Save"
                    >
                        <span className="material-icons text-xs text-slate-600">bookmark</span>
                        <span className="text-[10px] font-bold text-slate-600">Save</span>
                    </button>
                    <button
                        onClick={() => setReplyingTo(msg.id)}
                        className="p-1.5 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-all flex items-center gap-1"
                        title="Reply"
                    >
                        <span className="material-icons text-xs text-indigo-600">reply</span>
                        <span className="text-[10px] font-bold text-indigo-600">Reply</span>
                    </button>
                </div>
            </div>

            {msg.role === 'user' && (
                <div className="w-8 h-8 ml-3 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="material-icons text-slate-300 text-sm">person</span>
                </div>
            )}
        </div>
    );

    // Quick Chat Widget (Draggable & Resizable)
    if (mode === 'quick') {
        return (
            <Draggable handle=".drag-handle" bounds="parent">
                <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl border-2 border-indigo-300 flex flex-col overflow-hidden resize animate-in slide-in-from-right duration-500 fade-in" style={{ resize: 'both', minWidth: '350px', minHeight: '400px', maxWidth: '600px', maxHeight: '800px' }}>
                    {/* Header */}
                    <div className="drag-handle cursor-move bg-gradient-to-r from-indigo-600 to-purple-600 p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="material-icons text-white">psychology</span>
                            <div>
                                <h3 className="text-white font-bold text-sm">AI Co-Founder</h3>
                                <p className="text-indigo-200 text-[10px]">Quick Chat • Gemini 1.5 Flash</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setMode('deep')}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
                                title="Switch to Deep Mode"
                            >
                                <span className="material-icons text-white text-lg">open_in_full</span>
                            </button>
                            <button
                                onClick={() => setMode('minimized')}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-all"
                                title="Minimize"
                            >
                                <span className="material-icons text-white text-lg">minimize</span>
                            </button>
                        </div>
                    </div>

                    {/* Chat Selector */}
                    <div className="border-b border-indigo-200 bg-indigo-50/50 p-2 flex items-center justify-between">
                        <button
                            onClick={() => setShowChatList(!showChatList)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-all"
                        >
                            <span className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{currentChat?.name}</span>
                            <span className="material-icons text-sm text-indigo-600">expand_more</span>
                        </button>
                        <button
                            onClick={() => setShowNewChatModal(true)}
                            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-1"
                        >
                            <span className="material-icons text-sm">add</span>
                            New Chat
                        </button>
                    </div>

                    {/* Chat List Dropdown */}
                    {showChatList && (
                        <div className="absolute top-24 left-2 right-2 bg-white border-2 border-indigo-300 rounded-lg shadow-xl z-10 max-h-[200px] overflow-y-auto animate-in slide-in-from-top-2 fade-in duration-300">
                            {chats.map(chat => (
                                <button
                                    key={chat.id}
                                    onClick={() => {
                                        setCurrentChatId(chat.id);
                                        setShowChatList(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 hover:bg-indigo-50 transition-all border-b border-indigo-100 ${chat.id === currentChatId ? 'bg-indigo-100' : ''}`}
                                >
                                    <div className="font-bold text-sm text-slate-800">{chat.name}</div>
                                    <div className="text-[10px] text-slate-500">{chat.messageCount} messages • {chat.lastMessageAt.toLocaleDateString()}</div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30">
                        {currentMessages.map(msg => renderMessage(msg))}
                        {isLoading && (
                            <div className="flex justify-start animate-in fade-in">
                                <div className="bg-white border-2 border-indigo-200 rounded-2xl px-4 py-3 shadow-lg">
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

                    {/* Replying To Indicator */}
                    {replyingTo && (
                        <div className="px-4 py-2 bg-indigo-100 border-t border-indigo-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="material-icons text-sm text-indigo-600">reply</span>
                                <span className="text-xs font-bold text-indigo-700">Replying to message</span>
                            </div>
                            <button
                                onClick={() => setReplyingTo(null)}
                                className="text-indigo-600 hover:text-indigo-800"
                            >
                                <span className="material-icons text-sm">close</span>
                            </button>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-3 bg-white border-t border-indigo-200">
                        <div className="flex items-end gap-2 bg-white border-2 border-indigo-300 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-400">
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit();
                                    }
                                }}
                                placeholder="Ask anything..."
                                disabled={isLoading}
                                rows={1}
                                className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-indigo-400/60 text-sm py-2 px-2 resize-none max-h-24"
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={!inputValue.trim() || isLoading}
                                className={`p-2 rounded-lg transition-all ${!inputValue.trim() || isLoading
                                    ? 'bg-slate-300 text-slate-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105'
                                    }`}
                            >
                                <span className="material-icons text-lg">send</span>
                            </button>
                        </div>
                    </div>

                    {/* New Chat Modal */}
                    {showNewChatModal && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20 animate-in fade-in duration-200">
                            <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Create New Chat</h3>
                                <input
                                    type="text"
                                    value={newChatName}
                                    onChange={(e) => setNewChatName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && createNewChat()}
                                    placeholder="Enter chat name (e.g., Sales, Marketing)"
                                    className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    autoFocus
                                />
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={createNewChat}
                                        className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all"
                                    >
                                        Create
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowNewChatModal(false);
                                            setNewChatName('');
                                        }}
                                        className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-300 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Draggable>
        );
    }

    // Deep Chat Mode (70% screen)
    if (mode === 'deep') {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="w-[90vw] h-[85vh] bg-white rounded-2xl shadow-2xl border-2 border-indigo-300 flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="material-icons text-white text-2xl">psychology</span>
                            <div>
                                <h3 className="text-white font-bold text-lg">AI Co-Founder - Deep Mode</h3>
                                <p className="text-indigo-200 text-xs">Advanced Analysis • Gemini 1.5 Pro</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setMode('quick')}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-white text-sm font-bold flex items-center gap-2"
                            >
                                <span className="material-icons text-sm">close_fullscreen</span>
                                Quick Mode
                            </button>
                            <button
                                onClick={() => setMode('minimized')}
                                className="p-2 hover:bg-white/10 rounded-lg transition-all"
                            >
                                <span className="material-icons text-white">close</span>
                            </button>
                        </div>
                    </div>

                    {/* Similar content as Quick Chat but with more space */}
                    <div className="flex-1 flex overflow-hidden">
                        {/* Sidebar - Chat History */}
                        <div className="w-64 border-r border-indigo-200 bg-indigo-50/30 p-4 overflow-y-auto animate-in slide-in-from-left duration-500">
                            <button
                                onClick={() => setShowNewChatModal(true)}
                                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mb-4"
                            >
                                <span className="material-icons">add</span>
                                New Chat
                            </button>

                            <div className="space-y-2">
                                {chats.map(chat => (
                                    <button
                                        key={chat.id}
                                        onClick={() => setCurrentChatId(chat.id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-all ${chat.id === currentChatId
                                            ? 'bg-indigo-200 border-2 border-indigo-400'
                                            : 'bg-white border border-indigo-200 hover:bg-indigo-100'
                                            }`}
                                    >
                                        <div className="font-bold text-sm text-slate-800 truncate">{chat.name}</div>
                                        <div className="text-[10px] text-slate-500">{chat.messageCount} msgs</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Chat Area */}
                        <div className="flex-1 flex flex-col">
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30">
                                {currentMessages.map(msg => renderMessage(msg))}
                                {isLoading && (
                                    <div className="flex justify-start animate-in fade-in">
                                        <div className="bg-white border-2 border-indigo-200 rounded-2xl px-6 py-4 shadow-lg">
                                            <div className="flex items-center gap-3">
                                                <span className="flex gap-1">
                                                    <span className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                    <span className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                    <span className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce"></span>
                                                </span>
                                                <span className="text-sm text-indigo-700 font-medium ml-2">Deep analysis in progress...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {replyingTo && (
                                <div className="px-6 py-3 bg-indigo-100 border-t border-indigo-200 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="material-icons text-indigo-600">reply</span>
                                        <span className="text-sm font-bold text-indigo-700">Replying to message</span>
                                    </div>
                                    <button onClick={() => setReplyingTo(null)} className="text-indigo-600 hover:text-indigo-800">
                                        <span className="material-icons">close</span>
                                    </button>
                                </div>
                            )}

                            <div className="p-4 bg-white border-t border-indigo-200">
                                <div className="flex items-end gap-3 bg-white border-2 border-indigo-300 rounded-xl p-3 focus-within:ring-2 focus-within:ring-indigo-400">
                                    <textarea
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSubmit();
                                            }
                                        }}
                                        placeholder="Ask for deep analysis, strategic planning, complex problem solving..."
                                        disabled={isLoading}
                                        rows={2}
                                        className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-indigo-400/60 text-sm py-2 px-2 resize-none max-h-32"
                                    />
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!inputValue.trim() || isLoading}
                                        className={`p-3 rounded-xl transition-all ${!inputValue.trim() || isLoading
                                            ? 'bg-slate-300 text-slate-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 shadow-lg'
                                            }`}
                                    >
                                        <span className="material-icons text-xl">send</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {showNewChatModal && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20 animate-in fade-in duration-200">
                            <div className="bg-white rounded-xl p-6 w-[400px] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Create New Chat</h3>
                                <input
                                    type="text"
                                    value={newChatName}
                                    onChange={(e) => setNewChatName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && createNewChat()}
                                    placeholder="e.g., Sales Strategy, Marketing Plan, Product Launch"
                                    className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    autoFocus
                                />
                                <div className="flex gap-3 mt-4">
                                    <button onClick={createNewChat} className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all">
                                        Create
                                    </button>
                                    <button onClick={() => { setShowNewChatModal(false); setNewChatName(''); }} className="flex-1 bg-slate-200 text-slate-700 px-4 py-3 rounded-lg font-bold hover:bg-slate-300 transition-all">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Minimized Mode (FAB)
    return (
        <button
            onClick={() => setMode('quick')}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all group animate-in zoom-in-50 bounce-in duration-500"
        >
            <span className="material-icons text-white text-2xl">psychology</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
    );
};

export default AdvancedAiCoFounder;
