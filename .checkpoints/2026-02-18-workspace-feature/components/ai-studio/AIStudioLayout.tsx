"use client";

import React, { useState } from 'react';
import LeftSidebar from './LeftSidebar';
import CenterChat from './CenterChat';
import RightSidebar from './RightSidebar';
import QuickChatFloating from './QuickChatFloating';

export interface Project {
    id: string;
    name: string;
    icon: string;
    color: string;
    chatCount: number;
}

export interface Chat {
    id: string;
    projectId: string;
    title: string;
    lastMessage: string;
    timestamp: Date;
    pinned?: boolean;
}

export interface Message {
    id: string;
    chatId: string;
    role: 'user' | 'rkle';
    content: string;
    timestamp: Date;
    attachments?: Attachment[];
    canCopy?: boolean;
    canShare?: boolean;
}

export interface Attachment {
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
}

export interface ConnectedApp {
    id: string;
    name: string;
    icon: string;
    color: string;
    connected: boolean;
    lastUsed?: Date;
    category: 'google' | 'erp' | 'invoice' | 'crm' | 'other';
}

const AIStudioLayout: React.FC = () => {
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

    // Sample data
    const [projects, setProjects] = useState<Project[]>([
        { id: '1', name: 'Sales & Marketing', icon: 'trending_up', color: 'blue', chatCount: 5 },
        { id: '2', name: 'Business Development', icon: 'business_center', color: 'purple', chatCount: 3 },
        { id: '3', name: 'Finance & Accounting', icon: 'account_balance', color: 'green', chatCount: 2 },
    ]);

    const [chats, setChats] = useState<Chat[]>([
        { id: '1', projectId: '1', title: 'Create sales strategy', lastMessage: 'Here\'s a comprehensive sales strategy...', timestamp: new Date(), pinned: true },
        { id: '2', projectId: '1', title: 'Marketing campaign ideas', lastMessage: 'I suggest a multi-channel approach...', timestamp: new Date(Date.now() - 3600000) },
        { id: '3', projectId: '2', title: 'Business plan for Q2', lastMessage: 'Let me help you outline Q2 goals...', timestamp: new Date(Date.now() - 7200000) },
    ]);

    const [connectedApps, setConnectedApps] = useState<ConnectedApp[]>([
        { id: 'sheets', name: 'Google Sheets', icon: 'table_chart', color: 'green', connected: true, category: 'google', lastUsed: new Date() },
        { id: 'docs', name: 'Google Docs', icon: 'description', color: 'blue', connected: true, category: 'google', lastUsed: new Date(Date.now() - 1800000) },
        { id: 'gmail', name: 'Gmail', icon: 'mail', color: 'red', connected: false, category: 'google' },
        { id: 'slides', name: 'Google Slides', icon: 'slideshow', color: 'yellow', connected: false, category: 'google' },
    ]);

    const handleNewChat = () => {
        const newChat: Chat = {
            id: Date.now().toString(),
            projectId: currentProjectId || '1',
            title: 'New Chat',
            lastMessage: '',
            timestamp: new Date(),
        };
        setChats([newChat, ...chats]);
        setCurrentChatId(newChat.id);
    };

    const handleNewProject = (name: string, icon: string, color: string) => {
        const newProject: Project = {
            id: Date.now().toString(),
            name,
            icon,
            color,
            chatCount: 0,
        };
        setProjects([...projects, newProject]);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Left Sidebar - Chat History & Projects */}
            <LeftSidebar
                isOpen={leftSidebarOpen}
                onToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
                projects={projects}
                chats={chats}
                currentChatId={currentChatId}
                currentProjectId={currentProjectId}
                onSelectChat={setCurrentChatId}
                onSelectProject={setCurrentProjectId}
                onNewChat={handleNewChat}
                onNewProject={handleNewProject}
            />

            {/* Center - Main Chat Area */}
            <CenterChat
                chatId={currentChatId}
                leftSidebarOpen={leftSidebarOpen}
                rightSidebarOpen={rightSidebarOpen}
                onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
                onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
                onNewChat={handleNewChat}
                onNewProject={handleNewProject}
            />

            {/* Right Sidebar - AI Assistants & Tools */}
            <RightSidebar
                isOpen={rightSidebarOpen}
                onToggle={() => setRightSidebarOpen(!rightSidebarOpen)}
                connectedApps={connectedApps}
                onConnectApp={(appId) => {
                    setConnectedApps(connectedApps.map(app =>
                        app.id === appId ? { ...app, connected: !app.connected } : app
                    ));
                }}
            />

            {/* Quick Chat Floating (Left Bottom) */}
            <QuickChatFloating />
        </div>
    );
};

export default AIStudioLayout;
