'use client';

import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
    chatId: string;
    projectId?: string;
    artifacts?: Artifact[];
    toolRecommendations?: ToolRecommendation[];
}

interface Artifact {
    id: string;
    type: 'image' | 'document' | 'code' | 'chart' | 'table';
    name: string;
    content: string;
    url?: string;
    exportFormats: ExportFormat[];
}

interface ExportFormat {
    type: 'docs' | 'slides' | 'sheets' | 'csv' | 'pdf' | 'png' | 'jpg';
    icon: string;
    label: string;
}

interface ToolRecommendation {
    toolId: string;
    toolName: string;
    toolIcon: string;
    reason: string;
    connected: boolean;
    canConnect: boolean;
}

interface Chat {
    id: string;
    name: string;
    createdAt: Date;
    lastMessageAt: Date;
    messageCount: number;
    projectId?: string;
}

interface Project {
    id: string;
    name: string;
    description: string;
    color: string;
    icon: string;
    createdAt: Date;
    chatCount: number;
}

interface ConnectedTool {
    id: string;
    name: string;
    icon: string;
    status: 'connected' | 'disconnected';
    lastUsed?: Date;
}

type ViewMode = 'quick' | 'deep' | 'minimized';
type SidebarView = 'chats' | 'projects' | 'connectors' | 'artifacts';

const ClaudeStyleAiCoFounder: React.FC = () => {
    const [mode, setMode] = useState<ViewMode>('deep');
    const [sidebarView, setSidebarView] = useState<SidebarView>('projects');
    const [showArtifactsPanel, setShowArtifactsPanel] = useState(true);

    // Projects
    const [projects, setProjects] = useState<Project[]>([
        {
            id: 'default',
            name: 'General Business',
            description: 'General business discussions and planning',
            color: 'indigo',
            icon: 'business_center',
            createdAt: new Date(),
            chatCount: 1
        }
    ]);
    const [currentProjectId, setCurrentProjectId] = useState('default');
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDesc, setNewProjectDesc] = useState('');

    // Chats
    const [chats, setChats] = useState<Chat[]>([
        {
            id: 'default',
            name: 'Getting Started',
            createdAt: new Date(),
            lastMessageAt: new Date(),
            messageCount: 1,
            projectId: 'default'
        }
    ]);
    const [currentChatId, setCurrentChatId] = useState('default');
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [newChatName, setNewChatName] = useState('');

    // Messages & Artifacts
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'ai',
            content: "नमस्ते! Welcome to your AI Co-Founder 🚀\n\nI can help you with:\n• Create and manage Projects\n• Generate images, documents, charts\n• Export to Google Docs, Slides, Sheets\n• Connect with your dashboard tools\n• Strategic business planning\n\nWhat would you like to build today?",
            timestamp: new Date(),
            chatId: 'default',
            projectId: 'default'
        }
    ]);
    const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);

    // Connected Tools
    const [connectedTools, setConnectedTools] = useState<ConnectedTool[]>([
        { id: 'gmail', name: 'Gmail', icon: 'mail', status: 'connected', lastUsed: new Date() },
        { id: 'gdrive', name: 'Google Drive', icon: 'cloud', status: 'connected', lastUsed: new Date() },
        { id: 'calendar', name: 'Calendar', icon: 'event', status: 'connected' },
        { id: 'sheets', name: 'Sheets', icon: 'table_chart', status: 'connected' },
        { id: 'crm', name: 'CRM', icon: 'people', status: 'disconnected' },
        { id: 'analytics', name: 'Analytics', icon: 'analytics', status: 'disconnected' }
    ]);

    // UI State
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const currentProject = projects.find(p => p.id === currentProjectId);
    const currentChat = chats.find(c => c.id === currentChatId);
    const currentMessages = messages.filter(m => m.chatId === currentChatId);
    const projectChats = chats.filter(c => c.projectId === currentProjectId);

    // Create New Project
    const createNewProject = () => {
        if (!newProjectName.trim()) return;

        const colors = ['indigo', 'purple', 'pink', 'blue', 'green', 'orange', 'red'];
        const icons = ['folder', 'work', 'business_center', 'campaign', 'analytics', 'store'];

        const newProject: Project = {
            id: `proj-${Date.now()}`,
            name: newProjectName,
            description: newProjectDesc,
            color: colors[Math.floor(Math.random() * colors.length)],
            icon: icons[Math.floor(Math.random() * icons.length)],
            createdAt: new Date(),
            chatCount: 0
        };

        setProjects(prev => [newProject, ...prev]);
        setCurrentProjectId(newProject.id);
        setNewProjectName('');
        setNewProjectDesc('');
        setShowNewProjectModal(false);
    };

    // Create New Chat
    const createNewChat = () => {
        if (!newChatName.trim()) return;

        const newChat: Chat = {
            id: `chat-${Date.now()}`,
            name: newChatName,
            createdAt: new Date(),
            lastMessageAt: new Date(),
            messageCount: 0,
            projectId: currentProjectId
        };

        setChats(prev => [newChat, ...prev]);
        setCurrentChatId(newChat.id);
        setNewChatName('');
        setShowNewChatModal(false);

        // Update project chat count
        setProjects(prev => prev.map(p =>
            p.id === currentProjectId ? { ...p, chatCount: p.chatCount + 1 } : p
        ));
    };

    // Handle Message Submit
    const handleSubmit = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: inputValue,
            timestamp: new Date(),
            chatId: currentChatId,
            projectId: currentProjectId
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai-cofounder-claude', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: inputValue,
                    chatId: currentChatId,
                    projectId: currentProjectId,
                    projectName: currentProject?.name,
                    mode: mode === 'deep' ? 'deep' : 'quick',
                    conversationHistory: currentMessages.slice(-10),
                    connectedTools: connectedTools.filter(t => t.status === 'connected')
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
                    projectId: currentProjectId,
                    artifacts: data.artifacts,
                    toolRecommendations: data.toolRecommendations
                };
                setMessages(prev => [...prev, aiMessage]);

                if (data.artifacts && data.artifacts.length > 0) {
                    setSelectedArtifact(data.artifacts[0]);
                    setShowArtifactsPanel(true);
                }
            }
        } catch (error) {
            console.error('AI error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Export Artifact
    const handleExportArtifact = async (artifact: Artifact, format: ExportFormat) => {
        try {
            const response = await fetch('/api/export-artifact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    artifact,
                    format: format.type,
                    projectId: currentProjectId,
                    projectName: currentProject?.name
                })
            });

            const data = await response.json();
            if (data.success) {
                // Show success toast
                console.log(`Exported to ${format.label}:`, data.url);
            }
        } catch (error) {
            console.error('Export error:', error);
        }
    };

    // Download Artifact
    const handleDownloadArtifact = (artifact: Artifact) => {
        if (artifact.url) {
            const link = document.createElement('a');
            link.href = artifact.url;
            link.download = artifact.name;
            link.click();
        }
    };

    // Connect Tool
    const handleConnectTool = async (toolId: string) => {
        setConnectedTools(prev => prev.map(t =>
            t.id === toolId ? { ...t, status: 'connected' as const, lastUsed: new Date() } : t
        ));
    };

    // Render Sidebar
    const renderSidebar = () => {
        if (sidebarView === 'projects') {
            return (
                <div className="flex-1 overflow-y-auto">
                    <button
                        onClick={() => setShowNewProjectModal(true)}
                        className="w-full bg-indigo-600 text-white px-2 md:px-3 py-1.5 md:py-2 rounded text-[10px] md:text-xs font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-1 mb-2"
                    >
                        <span className="material-icons text-xs">add</span>
                        <span className="hidden md:inline">New Project</span>
                    </button>

                    <div className="space-y-1.5">
                        {projects.map(project => (
                            <button
                                key={project.id}
                                onClick={() => setCurrentProjectId(project.id)}
                                className={`w-full text-left px-2 md:px-2.5 py-1.5 md:py-2 rounded-lg transition-all ${project.id === currentProjectId
                                    ? 'bg-indigo-100 border border-indigo-400'
                                    : 'bg-white border border-indigo-100 hover:bg-indigo-50'
                                    }`}
                            >
                                <div className="flex items-center gap-1.5 md:gap-2">
                                    <span className={`material-icons text-xs md:text-sm text-${project.color}-600 flex-shrink-0`}>{project.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-[10px] md:text-xs text-slate-800 truncate">{project.name}</div>
                                        <div className="text-[8px] md:text-[9px] text-slate-500">{project.chatCount} chats</div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        if (sidebarView === 'chats') {
            return (
                <div className="flex-1 overflow-y-auto">
                    <button
                        onClick={() => setShowNewChatModal(true)}
                        className="w-full bg-indigo-600 text-white px-2 md:px-3 py-1.5 md:py-2 rounded text-[10px] md:text-xs font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-1 mb-2"
                    >
                        <span className="material-icons text-xs">add</span>
                        <span className="hidden md:inline">New Chat</span>
                    </button>

                    <div className="text-[9px] md:text-[10px] font-bold text-slate-500 mb-1 md:mb-1.5 px-1 truncate">
                        {currentProject?.name}
                    </div>

                    <div className="space-y-1">
                        {projectChats.map(chat => (
                            <button
                                key={chat.id}
                                onClick={() => setCurrentChatId(chat.id)}
                                className={`w-full text-left px-2 py-1.5 rounded-md transition-all ${chat.id === currentChatId
                                    ? 'bg-indigo-200 border-l-2 border-indigo-600'
                                    : 'bg-white hover:bg-indigo-50 border-l-2 border-transparent'
                                    }`}
                            >
                                <div className="font-semibold text-[10px] md:text-xs text-slate-800 truncate">{chat.name}</div>
                                <div className="text-[8px] md:text-[9px] text-slate-500">{chat.messageCount} msgs</div>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        if (sidebarView === 'connectors') {
            return (
                <div className="flex-1 overflow-y-auto space-y-2">
                    <div className="text-[10px] md:text-xs font-bold text-slate-700 mb-2">Tools</div>
                    {connectedTools.map(tool => (
                        <div
                            key={tool.id}
                            className={`p-2 md:p-2.5 rounded-lg border transition-all ${tool.status === 'connected'
                                ? 'bg-green-50 border-green-300'
                                : 'bg-slate-50 border-slate-200'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                    <span className="material-icons text-sm md:text-base text-indigo-600 flex-shrink-0">{tool.icon}</span>
                                    <span className="font-bold text-[10px] md:text-xs truncate">{tool.name}</span>
                                </div>
                                {tool.status === 'connected' ? (
                                    <span className="px-1.5 py-0.5 bg-green-600 text-white text-[8px] md:text-[9px] font-bold rounded-full flex-shrink-0">
                                        ✓
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handleConnectTool(tool.id)}
                                        className="px-1.5 py-0.5 bg-indigo-600 text-white text-[8px] md:text-[9px] font-bold rounded-full hover:bg-indigo-700 flex-shrink-0"
                                    >
                                        Connect
                                    </button>
                                )}
                            </div>
                            {tool.lastUsed && (
                                <div className="text-[8px] md:text-[9px] text-slate-500 truncate">
                                    Last used: {tool.lastUsed.toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        return null;
    };

    // Render Artifacts Panel
    const renderArtifactsPanel = () => {
        if (!showArtifactsPanel || !selectedArtifact) return null;

        return (
            <div className="w-72 md:w-80 lg:w-96 border-l border-slate-200 bg-white flex flex-col animate-in slide-in-from-right duration-300 flex-shrink-0">
                {/* Header */}
                <div className="p-2 md:p-3 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                        <span className="material-icons text-indigo-600 text-sm">folder_special</span>
                        <span className="font-bold text-xs md:text-sm">Artifacts</span>
                    </div>
                    <button
                        onClick={() => setShowArtifactsPanel(false)}
                        className="p-1 hover:bg-slate-100 rounded transition-all"
                    >
                        <span className="material-icons text-xs">close</span>
                    </button>
                </div>

                {/* Artifact Preview */}
                <div className="flex-1 overflow-y-auto p-2 md:p-3">
                    <div className="bg-slate-100 rounded-lg md:rounded-xl p-2 md:p-3 mb-2 md:mb-3">
                        <div className="flex items-center gap-1.5 mb-2">
                            <span className="material-icons text-base md:text-xl text-indigo-600">
                                {selectedArtifact.type === 'image' ? 'image' :
                                    selectedArtifact.type === 'code' ? 'code' :
                                        selectedArtifact.type === 'chart' ? 'bar_chart' :
                                            selectedArtifact.type === 'table' ? 'table_chart' : 'description'}
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="font-bold text-xs md:text-sm text-slate-800 truncate">{selectedArtifact.name}</div>
                                <div className="text-[8px] md:text-[9px] text-slate-500 capitalize truncate">{selectedArtifact.type}</div>
                            </div>
                        </div>

                        {selectedArtifact.url && selectedArtifact.type === 'image' && (
                            <img src={selectedArtifact.url} alt={selectedArtifact.name} className="w-full rounded-md md:rounded-lg mb-2" />
                        )}

                        {selectedArtifact.content && (
                            <div className="bg-white p-2 md:p-2.5 rounded-md text-[9px] md:text-xs font-mono max-h-32 md:max-h-48 overflow-y-auto">
                                {selectedArtifact.content}
                            </div>
                        )}
                    </div>

                    {/* Export Options */}
                    <div className="space-y-1.5">
                        <div className="text-[9px] md:text-[10px] font-bold text-slate-600 mb-1.5">Export:</div>

                        <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                            <button
                                onClick={() => handleDownloadArtifact(selectedArtifact)}
                                className="p-2 md:p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[9px] md:text-xs font-bold flex flex-col items-center gap-0.5 md:gap-1 transition-all"
                            >
                                <span className="material-icons text-xs md:text-sm">download</span>
                                <span className="hidden md:inline">Download</span>
                            </button>

                            <button
                                onClick={() => handleExportArtifact(selectedArtifact, { type: 'docs', icon: 'description', label: 'Google Docs' })}
                                className="p-2 md:p-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-[9px] md:text-xs font-bold flex flex-col items-center gap-0.5 md:gap-1 transition-all"
                            >
                                <span className="material-icons text-xs md:text-sm">description</span>
                                Docs
                            </button>

                            <button
                                onClick={() => handleExportArtifact(selectedArtifact, { type: 'slides', icon: 'slideshow', label: 'Google Slides' })}
                                className="p-2 md:p-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-[9px] md:text-xs font-bold flex flex-col items-center gap-0.5 md:gap-1 transition-all"
                            >
                                <span className="material-icons text-xs md:text-sm">slideshow</span>
                                Slides
                            </button>

                            <button
                                onClick={() => handleExportArtifact(selectedArtifact, { type: 'sheets', icon: 'table_chart', label: 'Google Sheets' })}
                                className="p-2 md:p-2.5 bg-green-500 hover:bg-green-600 text-white rounded-md text-[9px] md:text-xs font-bold flex flex-col items-center gap-0.5 md:gap-1 transition-all"
                            >
                                <span className="material-icons text-xs md:text-sm">table_chart</span>
                                Sheets
                            </button>

                            <button
                                onClick={() => handleExportArtifact(selectedArtifact, { type: 'pdf', icon: 'picture_as_pdf', label: 'PDF' })}
                                className="p-2 md:p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-[9px] md:text-xs font-bold flex flex-col items-center gap-0.5 md:gap-1 transition-all"
                            >
                                <span className="material-icons text-xs md:text-sm">picture_as_pdf</span>
                                PDF
                            </button>

                            <button
                                onClick={() => handleExportArtifact(selectedArtifact, { type: 'csv', icon: 'table_view', label: 'CSV' })}
                                className="p-2 md:p-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-md text-[9px] md:text-xs font-bold flex flex-col items-center gap-0.5 md:gap-1 transition-all"
                            >
                                <span className="material-icons text-xs md:text-sm">table_view</span>
                                CSV
                            </button>
                        </div>

                        <button
                            className="w-full p-2 md:p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-md md:rounded-lg text-[10px] md:text-xs font-bold flex items-center justify-center gap-1 md:gap-1.5 transition-all mt-2"
                        >
                            <span className="material-icons text-xs md:text-sm">cloud</span>
                            <span>Save to Workspace</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Deep Mode (Claude-style full screen)
    if (mode === 'deep') {
        return (
            <div className="fixed inset-0 bg-white z-50 flex animate-in fade-in duration-300 overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-48 md:w-56 lg:w-60 border-r border-slate-200 bg-slate-50 flex flex-col animate-in slide-in-from-left duration-500 flex-shrink-0">
                    {/* Sidebar Header */}
                    <div className="p-2 md:p-3 border-b border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-md flex items-center justify-center flex-shrink-0">
                                <span className="material-icons text-white text-sm">psychology</span>
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-bold text-xs md:text-sm text-slate-800 truncate">AI Co-Founder</h2>
                                <p className="text-[9px] text-slate-500 truncate">Claude-style</p>
                            </div>
                        </div>

                        {/* Sidebar Tabs */}
                        <div className="grid grid-cols-4 gap-0.5 bg-slate-200 p-0.5 rounded-md">
                            <button
                                onClick={() => setSidebarView('projects')}
                                className={`p-1.5 rounded-sm transition-all ${sidebarView === 'projects' ? 'bg-white shadow-sm' : 'hover:bg-slate-100'}`}
                                title="Projects"
                            >
                                <span className="material-icons text-xs">folder</span>
                            </button>
                            <button
                                onClick={() => setSidebarView('chats')}
                                className={`p-1.5 rounded-sm transition-all ${sidebarView === 'chats' ? 'bg-white shadow-sm' : 'hover:bg-slate-100'}`}
                                title="Chats"
                            >
                                <span className="material-icons text-xs">chat</span>
                            </button>
                            <button
                                onClick={() => setSidebarView('connectors')}
                                className={`p-1.5 rounded-sm transition-all ${sidebarView === 'connectors' ? 'bg-white shadow-sm' : 'hover:bg-slate-100'}`}
                                title="Connectors"
                            >
                                <span className="material-icons text-xs">extension</span>
                            </button>
                            <button
                                onClick={() => setMode('quick')}
                                className="p-1.5 rounded-sm hover:bg-slate-100 transition-all"
                                title="Minimize"
                            >
                                <span className="material-icons text-xs">close_fullscreen</span>
                            </button>
                        </div>
                    </div>

                    {/* Sidebar Content */}
                    <div className="flex-1 p-2 md:p-3 overflow-hidden flex flex-col">
                        {renderSidebar()}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* Chat Header */}
                    <div className="h-10 md:h-12 border-b border-slate-200 px-3 md:px-4 flex items-center justify-between flex-shrink-0">
                        <div className="min-w-0 flex-1 mr-2">
                            <h3 className="font-bold text-xs md:text-sm text-slate-800 truncate">{currentChat?.name}</h3>
                            <p className="text-[10px] text-slate-500 truncate">{currentProject?.name}</p>
                        </div>
                        <button
                            onClick={() => setShowArtifactsPanel(!showArtifactsPanel)}
                            className="px-2 md:px-3 py-1 md:py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md text-[10px] md:text-xs font-bold flex items-center gap-1 transition-all flex-shrink-0"
                        >
                            <span className="material-icons text-xs">folder_special</span>
                            <span className="hidden md:inline">Artifacts</span>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-3 md:space-y-4">
                        {currentMessages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                {msg.role === 'ai' && (
                                    <div className="w-8 h-8 mr-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons text-white text-sm">psychology</span>
                                    </div>
                                )}

                                <div className="max-w-[85%] md:max-w-[75%] lg:max-w-[70%]">
                                    <div className={`rounded-xl md:rounded-2xl p-2 md:p-3 ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-slate-100 text-slate-800'
                                        }`}>
                                        <p className="text-xs md:text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    </div>

                                    {/* Artifacts */}
                                    {msg.artifacts && msg.artifacts.length > 0 && (
                                        <div className="mt-1.5 md:mt-2 space-y-1.5">
                                            {msg.artifacts.map(artifact => (
                                                <button
                                                    key={artifact.id}
                                                    onClick={() => {
                                                        setSelectedArtifact(artifact);
                                                        setShowArtifactsPanel(true);
                                                    }}
                                                    className="w-full p-2 md:p-2.5 bg-white border border-indigo-200 rounded-lg hover:border-indigo-400 transition-all flex items-center gap-2"
                                                >
                                                    <span className="material-icons text-indigo-600 text-sm md:text-base">
                                                        {artifact.type === 'image' ? 'image' : 'description'}
                                                    </span>
                                                    <span className="text-xs md:text-sm font-bold text-slate-700 truncate flex-1 text-left">{artifact.name}</span>
                                                    <span className="material-icons text-sm text-slate-400 ml-auto">arrow_forward</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Tool Recommendations */}
                                    {msg.toolRecommendations && msg.toolRecommendations.length > 0 && (
                                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                            <div className="text-[10px] md:text-xs font-bold text-amber-800 mb-1.5">🔧 Tools</div>
                                            {msg.toolRecommendations.map(rec => (
                                                <div key={rec.toolId} className="flex items-center justify-between p-1.5 md:p-2 bg-white rounded-md mb-1">
                                                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                                        <span className="material-icons text-xs md:text-sm">{rec.toolIcon}</span>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="text-[10px] md:text-xs font-bold truncate">{rec.toolName}</div>
                                                            <div className="text-[9px] text-slate-500 truncate">{rec.reason}</div>
                                                        </div>
                                                    </div>
                                                    {rec.canConnect && !rec.connected && (
                                                        <button
                                                            onClick={() => handleConnectTool(rec.toolId)}
                                                            className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] md:text-[10px] font-bold rounded-full hover:bg-indigo-700 flex-shrink-0"
                                                        >
                                                            Connect
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {msg.role === 'user' && (
                                    <div className="w-6 h-6 ml-2 rounded-md bg-slate-700 flex items-center justify-center flex-shrink-0">
                                        <span className="material-icons text-white text-xs">person</span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-100 rounded-xl px-4 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <span className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                                        </span>
                                        <span className="text-xs text-slate-600 font-medium">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-slate-200 p-2 md:p-3">
                        <div className="max-w-4xl mx-auto bg-white border border-slate-300 rounded-lg md:rounded-xl p-2 md:p-2.5 focus-within:border-indigo-500 transition-all">
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
                                className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 text-xs md:text-sm resize-none"
                            />
                            <div className="flex items-center justify-between mt-1.5">
                                <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] text-slate-500">
                                    <span className="material-icons text-[10px]">info</span>
                                    <span className="hidden sm:inline">{connectedTools.filter(t => t.status === 'connected').length} tools</span>
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!inputValue.trim() || isLoading}
                                    className={`px-2.5 md:px-3 py-1 md:py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-all ${!inputValue.trim() || isLoading
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                >
                                    <span className="material-icons text-xs">send</span>
                                    <span className="hidden sm:inline">Send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Artifacts Panel */}
                {renderArtifactsPanel()}

                {/* Modals */}
                {showNewProjectModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl p-6 w-[500px] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                            <h3 className="text-xl font-black text-slate-800 mb-4">Create New Project</h3>
                            <input
                                type="text"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                placeholder="Project name (e.g., Sales Campaign, Product Launch)"
                                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none mb-3"
                                autoFocus
                            />
                            <textarea
                                value={newProjectDesc}
                                onChange={(e) => setNewProjectDesc(e.target.value)}
                                placeholder="Project description (optional)"
                                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                rows={3}
                            />
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={createNewProject}
                                    className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all"
                                >
                                    Create Project
                                </button>
                                <button
                                    onClick={() => {
                                        setShowNewProjectModal(false);
                                        setNewProjectName('');
                                        setNewProjectDesc('');
                                    }}
                                    className="flex-1 bg-slate-200 text-slate-700 px-4 py-3 rounded-lg font-bold hover:bg-slate-300 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showNewChatModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl p-6 w-[400px] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                            <h3 className="text-xl font-black text-slate-800 mb-4">New Chat in {currentProject?.name}</h3>
                            <input
                                type="text"
                                value={newChatName}
                                onChange={(e) => setNewChatName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && createNewChat()}
                                placeholder="Chat name (e.g., Logo Design, Pricing Strategy)"
                                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                autoFocus
                            />
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={createNewChat}
                                    className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all"
                                >
                                    Create
                                </button>
                                <button
                                    onClick={() => {
                                        setShowNewChatModal(false);
                                        setNewChatName('');
                                    }}
                                    className="flex-1 bg-slate-200 text-slate-700 px-4 py-3 rounded-lg font-bold hover:bg-slate-300 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Quick Mode (minimized widget)
    return (
        <button
            onClick={() => setMode('deep')}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all animate-in zoom-in-50 duration-500"
        >
            <span className="material-icons text-white text-2xl">psychology</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
    );
};

export default ClaudeStyleAiCoFounder;
