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
    const nodeRef = useRef(null);

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
                    setInputValue(transcript);
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

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
        // Show local toast or feedback
    };

    const handleShare = async (content: string) => {
        if (navigator.share) {
            await navigator.share({
                title: 'Arkle AI Intelligence',
                text: content
            });
        }
    };

    const handleSave = (message: Message) => {
        const saved = JSON.parse(localStorage.getItem('saved-arkle-insights') || '[]');
        saved.push(message);
        localStorage.setItem('saved-arkle-insights', JSON.stringify(saved));
    };

    const handleDownload = (url: string, name: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        link.click();
    };

    const handleExportToDrive = async (url: string, name: string) => {
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
                <div className="w-8 h-8 mr-3 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg ring-2 ring-indigo-100">
                    <span className="material-icons text-white text-xs">bolt</span>
                </div>
            )}

            <div className="flex flex-col max-w-[85%]">
                <div className={`rounded-3xl shadow-sm border ${msg.role === 'user'
                    ? 'bg-slate-900 text-white border-slate-800 rounded-tr-none'
                    : 'bg-white border-slate-100 text-slate-800 rounded-tl-none'
                    }`}>
                    <div className="px-5 py-4">
                        <p className="text-[13px] whitespace-pre-wrap leading-relaxed font-medium">{msg.content}</p>
                    </div>

                    {msg.generatedContent && (
                        <div className="px-5 pb-4 border-t border-slate-50 pt-4 space-y-2">
                            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <span className="material-icons text-indigo-600 text-sm">
                                            {msg.generatedContent.type === 'image' ? 'image' : 'description'}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{msg.generatedContent.name}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDownload(msg.generatedContent!.url, msg.generatedContent!.name)}
                                        className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center transition-all shadow-md active:scale-95"
                                        title="Download"
                                    >
                                        <span className="material-icons text-sm">download</span>
                                    </button>
                                    <button
                                        onClick={() => handleExportToDrive(msg.generatedContent!.url, msg.generatedContent!.name)}
                                        className="w-8 h-8 bg-slate-900 hover:bg-black text-white rounded-lg flex items-center justify-center transition-all shadow-md active:scale-95"
                                        title="Export to Drive"
                                    >
                                        <span className="material-icons text-sm">cloud_upload</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 mt-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleCopy(msg.content)} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
                        <span className="material-icons text-[12px]">content_copy</span> Copy
                    </button>
                    <button onClick={() => handleSave(msg)} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
                        <span className="material-icons text-[12px]">bookmark</span> Save
                    </button>
                    <button onClick={() => setReplyingTo(msg.id)} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
                        <span className="material-icons text-[12px]">reply</span> Reply
                    </button>
                </div>
            </div>

            {msg.role === 'user' && (
                <div className="w-8 h-8 ml-3 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-1 border border-slate-200">
                    <span className="material-icons text-slate-400 text-xs">person</span>
                </div>
            )}
        </div>
    );

    if (mode === 'quick') {
        return (
            // @ts-ignore
            <Draggable nodeRef={nodeRef} handle=".drag-handle" bounds="parent">
                <div ref={nodeRef} className="fixed bottom-6 right-6 z-50 w-[420px] h-[640px] bg-white rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-right duration-500 fade-in" style={{ resize: 'both', minWidth: '380px', minHeight: '500px', maxWidth: '600px', maxHeight: '850px' }}>
                    <div className="drag-handle cursor-move bg-slate-900 p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                                <span className="material-icons">bolt</span>
                            </div>
                            <div>
                                <h3 className="text-white font-black text-xs italic tracking-tighter uppercase">Arkle <span className="text-indigo-400 not-italic">Intelligence</span></h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.2em]">Neural Link Active</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setMode('deep')} className="w-8 h-8 hover:bg-white/10 rounded-xl transition-all flex items-center justify-center text-white">
                                <span className="material-icons text-lg">open_in_full</span>
                            </button>
                            <button onClick={() => setMode('minimized')} className="w-8 h-8 hover:bg-white/10 rounded-xl transition-all flex items-center justify-center text-white">
                                <span className="material-icons text-lg">close</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-50/50 p-3 flex items-center justify-between border-b border-slate-100">
                        <button onClick={() => setShowChatList(!showChatList)} className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all shadow-sm">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 truncate max-w-[150px]">{currentChat?.name}</span>
                            <span className="material-icons text-sm text-indigo-600">expand_more</span>
                        </button>
                        <button onClick={() => setShowNewChatModal(true)} className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 hover:scale-105 transition-all shadow-lg active:scale-95">
                            <span className="material-icons">add</span>
                        </button>
                    </div>

                    {showChatList && (
                        <div className="absolute top-32 left-4 right-4 bg-white border border-slate-100 rounded-[2rem] shadow-2xl z-20 max-h-[300px] overflow-y-auto p-2 animate-in slide-in-from-top-4 fade-in duration-300">
                            {chats.map(chat => (
                                <button key={chat.id} onClick={() => { setCurrentChatId(chat.id); setShowChatList(false); }} className={`w-full text-left px-5 py-4 hover:bg-slate-50 rounded-2xl transition-all ${chat.id === currentChatId ? 'bg-indigo-50/50 text-indigo-600' : 'text-slate-600'}`}>
                                    <div className="font-black text-[10px] uppercase tracking-widest">{chat.name}</div>
                                    <div className="text-[8px] font-bold text-slate-400 mt-1">{chat.messageCount} interactions • {chat.lastMessageAt.toLocaleDateString()}</div>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white custom-scrollbar">
                        {currentMessages.map(msg => renderMessage(msg))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] px-6 py-4 flex items-center gap-4">
                                    <div className="flex gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Arkle Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-white border-t border-slate-50">
                        <div className="relative group/input bg-slate-50 rounded-[2.5rem] p-3 border border-transparent focus-within:bg-white focus-within:border-slate-100 transition-all shadow-sm">
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                                placeholder={isRecording ? "Listening... Speak naturally" : "Ask Arkle for guidance..."}
                                disabled={isLoading}
                                rows={1}
                                className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-300 text-sm py-2 px-3 resize-none max-h-32 font-medium"
                            />
                            <div className="flex items-center justify-between mt-2 px-1 border-t border-slate-100 pt-3">
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={toggleVoice}
                                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isRecording ? 'bg-rose-100 text-rose-600 shadow-lg shadow-rose-200 scale-110' : 'bg-white text-slate-400 hover:text-indigo-600 shadow-sm'}`}
                                        title="Live Voice Mode"
                                    >
                                        <span className="material-icons text-lg">{isRecording ? 'mic' : 'mic_none'}</span>
                                    </button>
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!inputValue.trim() || isLoading}
                                    className={`w-10 h-10 rounded-2xl transition-all flex items-center justify-center shadow-xl ${!inputValue.trim() || isLoading
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-slate-900 text-white hover:scale-105 active:scale-95'
                                        }`}
                                >
                                    <span className="material-icons">send</span>
                                </button>
                            </div>
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
