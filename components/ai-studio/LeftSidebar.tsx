"use client";

import React, { useState } from 'react';
import { Project, Chat } from './AIStudioLayout';

interface LeftSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    projects: Project[];
    chats: Chat[];
    currentChatId: string | null;
    currentProjectId: string | null;
    onSelectChat: (chatId: string) => void;
    onSelectProject: (projectId: string) => void;
    onNewChat: () => void;
    onNewProject: (name: string, icon: string, color: string) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
    isOpen,
    onToggle,
    projects,
    chats,
    currentChatId,
    currentProjectId,
    onSelectChat,
    onSelectProject,
    onNewChat,
    onNewProject,
}) => {
    const [view, setView] = useState<'chats' | 'projects'>('chats');
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredChats = chats.filter(chat =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (!currentProjectId || chat.projectId === currentProjectId)
    );

    const groupChatsByDate = (chats: Chat[]) => {
        const now = new Date();
        const today: Chat[] = [];
        const yesterday: Chat[] = [];
        const lastWeek: Chat[] = [];
        const older: Chat[] = [];

        chats.forEach(chat => {
            const diffDays = Math.floor((now.getTime() - chat.timestamp.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays === 0) today.push(chat);
            else if (diffDays === 1) yesterday.push(chat);
            else if (diffDays <= 7) lastWeek.push(chat);
            else older.push(chat);
        });

        return { today, yesterday, lastWeek, older };
    };

    const { today, yesterday, lastWeek, older } = groupChatsByDate(filteredChats);

    if (!isOpen) {
        return (
            <div className="w-12 bg-slate-900 flex flex-col items-center py-4 gap-4 flex-shrink-0">
                <button
                    onClick={onToggle}
                    className="p-2 text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Open Sidebar"
                >
                    <span className="material-icons text-xl">menu</span>
                </button>
                <button
                    onClick={onNewChat}
                    className="p-2 text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="New Chat"
                >
                    <span className="material-icons text-xl">add</span>
                </button>
            </div>
        );
    }

    return (
        <div className="w-72 bg-slate-900 text-white flex flex-col h-full flex-shrink-0 animate-in slide-in-from-left duration-300">
            {/* Header */}
            <div className="p-3 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="material-icons text-white text-lg">auto_awesome</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-sm">Rkle AI Studio</h1>
                        <p className="text-[9px] text-slate-400">Your AI Co-Founder</p>
                    </div>
                </div>
                <button
                    onClick={onToggle}
                    className="p-1.5 hover:bg-slate-800 rounded transition-colors"
                    title="Collapse"
                >
                    <span className="material-icons text-lg">chevron_left</span>
                </button>
            </div>

            {/* New Chat Button */}
            <div className="p-2 border-b border-slate-800 flex-shrink-0">
                <button
                    onClick={onNewChat}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white px-3 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                    <span className="material-icons text-lg">add</span>
                    New Chat
                </button>
            </div>

            {/* View Tabs */}
            <div className="p-2 flex gap-1 border-b border-slate-800 flex-shrink-0">
                <button
                    onClick={() => setView('chats')}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'chats'
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                >
                    <span className="material-icons text-sm mr-1 align-middle">chat</span>
                    Chats
                </button>
                <button
                    onClick={() => setView('projects')}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'projects'
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                >
                    <span className="material-icons text-sm mr-1 align-middle">folder</span>
                    Projects
                </button>
            </div>

            {/* Search */}
            <div className="p-2 border-b border-slate-800 flex-shrink-0">
                <div className="relative">
                    <span className="material-icons absolute left-2.5 top-2 text-slate-500 text-sm">search</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full bg-slate-800 text-white text-xs px-8 py-2 rounded-lg outline-none focus:ring-1 focus:ring-purple-500 placeholder:text-slate-500"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-900">
                {view === 'chats' ? (
                    <div className="p-2 space-y-4">
                        {/* Today */}
                        {today.length > 0 && (
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-500 mb-1.5 px-2">TODAY</h3>
                                <div className="space-y-0.5">
                                    {today.map(chat => (
                                        <button
                                            key={chat.id}
                                            onClick={() => onSelectChat(chat.id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all group ${currentChatId === chat.id
                                                ? 'bg-slate-800 text-white'
                                                : 'text-slate-300 hover:bg-slate-800/50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="material-icons text-sm text-slate-500">chat_bubble</span>
                                                <span className="flex-1 truncate font-medium">{chat.title}</span>
                                                {chat.pinned && <span className="material-icons text-[10px] text-yellow-500">push_pin</span>}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Yesterday */}
                        {yesterday.length > 0 && (
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-500 mb-1.5 px-2">YESTERDAY</h3>
                                <div className="space-y-0.5">
                                    {yesterday.map(chat => (
                                        <button
                                            key={chat.id}
                                            onClick={() => onSelectChat(chat.id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${currentChatId === chat.id
                                                ? 'bg-slate-800 text-white'
                                                : 'text-slate-300 hover:bg-slate-800/50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="material-icons text-sm text-slate-500">chat_bubble</span>
                                                <span className="flex-1 truncate font-medium">{chat.title}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Last 7 Days */}
                        {lastWeek.length > 0 && (
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-500 mb-1.5 px-2">LAST 7 DAYS</h3>
                                <div className="space-y-0.5">
                                    {lastWeek.map(chat => (
                                        <button
                                            key={chat.id}
                                            onClick={() => onSelectChat(chat.id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${currentChatId === chat.id
                                                ? 'bg-slate-800 text-white'
                                                : 'text-slate-300 hover:bg-slate-800/50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="material-icons text-sm text-slate-500">chat_bubble</span>
                                                <span className="flex-1 truncate font-medium">{chat.title}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-2 space-y-1">
                        {projects.map(project => (
                            <button
                                key={project.id}
                                onClick={() => onSelectProject(project.id)}
                                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${currentProjectId === project.id
                                    ? 'bg-slate-800 text-white'
                                    : 'text-slate-300 hover:bg-slate-800/50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 bg-${project.color}-500/20 rounded-lg flex items-center justify-center`}>
                                        <span className={`material-icons text-sm text-${project.color}-400`}>{project.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm truncate">{project.name}</div>
                                        <div className="text-[10px] text-slate-500">{project.chatCount} chats</div>
                                    </div>
                                </div>
                            </button>
                        ))}

                        <button
                            onClick={() => setShowNewProjectModal(true)}
                            className="w-full text-left px-3 py-2.5 rounded-lg border border-dashed border-slate-700 hover:border-purple-500 hover:bg-slate-800/50 text-slate-400 hover:text-white transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                    <span className="material-icons text-sm">add</span>
                                </div>
                                <span className="text-sm font-medium">New Project</span>
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-slate-800 flex-shrink-0">
                <button className="w-full px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-all flex items-center gap-2">
                    <span className="material-icons text-sm">settings</span>
                    Settings
                </button>
            </div>
        </div>
    );
};

export default LeftSidebar;
