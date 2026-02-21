"use client";
import React, { useState, useEffect, ReactNode, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type AdminRole = 'super_admin' | 'incorporation_team' | 'launchpad_team' | 'content_team';
type AdminModule = 'business_setup' | 'launch_pad' | 'learn' | 'workspace';

interface AdminLayoutProps {
    children: ReactNode;
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
    const [activeRole, setActiveRole] = useState<AdminRole>('super_admin');
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentView = searchParams.get('view') as AdminModule || 'workspace';
    
    // Sync state with URL
    const [activeModule, setActiveModule] = useState<AdminModule>(currentView);

    useEffect(() => {
        if (currentView) setActiveModule(currentView);
    }, [currentView]);

    const handleTabChange = (moduleId: AdminModule) => {
        setActiveModule(moduleId);
        router.push(`/admin?view=${moduleId}`);
    };

    // Module definitions with their accessible roles
    const modules: { id: AdminModule; label: string; icon: string; roles: AdminRole[] }[] = [
        { id: 'business_setup', label: 'Business Setup', icon: 'business', roles: ['super_admin', 'incorporation_team'] },
        { id: 'launch_pad', label: 'Launch Pad', icon: 'rocket_launch', roles: ['super_admin', 'launchpad_team'] },
        { id: 'learn', label: 'Learn', icon: 'school', roles: ['super_admin', 'content_team'] },
        { id: 'workspace', label: 'Workspace', icon: 'workspaces', roles: ['super_admin', 'incorporation_team', 'launchpad_team', 'content_team'] },
    ];

    // Sidebar items based on active module
    const getSidebarItems = () => {
        switch (activeModule) {
            case 'business_setup':
                return [
                    { href: '/admin?view=business_setup', label: 'Incorporation Leads', icon: 'list_alt' },
                    { href: '/admin/applications', label: 'Applications', icon: 'assignment' },
                    { href: '/admin/compliance', label: 'Compliance', icon: 'gavel' },
                    { href: '/admin/documents', label: 'Document Vault', icon: 'folder_shared' },
                ];
            case 'launch_pad':
                return [
                    { href: '/admin?view=launch_pad', label: 'Service Catalog', icon: 'grid_view' },
                    { href: '/admin/partners', label: 'Partner Network', icon: 'handshake' },
                    { href: '/admin/integrations', label: 'Integrations', icon: 'extension' },
                ];
            case 'learn':
                return [
                    { href: '/admin?view=learn', label: 'Course Manager', icon: 'class' },
                    { href: '/admin/articles', label: 'Knowledge Base', icon: 'article' },
                    { href: '/admin/quizzes', label: 'Quizzes & Certs', icon: 'quiz' },
                ];
            case 'workspace':
                return [
                    { href: '/admin?view=workspace', label: 'CRM Dashboard', icon: 'dashboard' }, // Mapping current page here
                    { href: '/admin/tasks', label: 'My Tasks', icon: 'check_circle' },
                    { href: '/admin/calendar', label: 'Calendar', icon: 'calendar_today' },
                    { href: '/admin/team', label: 'Team Chat', icon: 'forum' },
                    { href: '/admin/analytics', label: 'Analytics', icon: 'analytics' },
                    { href: '/admin/settings', label: 'Global Settings', icon: 'settings_applications' },
                ];
            default:
                return [];
        }
    };

    const sidebarItems = getSidebarItems();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            {/* ── Top Navigation Header ── */}
            <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-4 shadow-md z-20 flex-shrink-0">
                <div className="flex items-center gap-8">
                    {/* Logo Area */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">S</div>
                        <div>
                            <span className="font-bold text-lg tracking-tight">SetMyBizz</span>
                            <span className="text-[10px] text-slate-400 block -mt-1 uppercase tracking-widest">Master Admin</span>
                        </div>
                    </div>

                    {/* Main Module Tabs */}
                    <nav className="hidden md:flex items-center gap-1">
                        {modules.map((mod) => {
                            if (!mod.roles.includes(activeRole)) return null;
                            const isActive = activeModule === mod.id;
                            return (
                                <button
                                    key={mod.id}
                                    onClick={() => handleTabChange(mod.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                                        isActive 
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                                >
                                    <span className="material-icons text-sm">{mod.icon}</span>
                                    {mod.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Right Side: Role Switcher & Profile */}
                <div className="flex items-center gap-4">
                    {/* Role Switcher (For Demo/Design purposes) */}
                    <div className="hidden lg:flex items-center gap-2 bg-slate-800 rounded-lg p-1 pr-3 border border-slate-700">
                        <span className="bg-slate-900 text-[10px] font-bold text-slate-400 px-2 py-1 rounded uppercase tracking-wider">View As</span>
                        <select 
                            value={activeRole} 
                            onChange={(e) => {
                                const newRole = e.target.value as AdminRole;
                                setActiveRole(newRole);
                                // Reset module if current one is not allowed
                                const mod = modules.find(m => m.id === activeModule);
                                if (!mod?.roles.includes(newRole)) {
                                    handleTabChange('workspace'); // Fallback
                                }
                            }}
                            className="bg-transparent text-xs font-bold text-indigo-400 focus:outline-none cursor-pointer"
                        >
                            <option value="super_admin">Super Admin</option>
                            <option value="incorporation_team">Incorp Team</option>
                            <option value="launchpad_team">Launchpad Team</option>
                            <option value="content_team">Content Team</option>
                        </select>
                    </div>

                    <div className="w-px h-8 bg-slate-800 mx-2" />

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-white">Mahendra</p>
                            <p className="text-[10px] text-slate-400">Super Admin</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-xs font-bold shadow-lg ring-2 ring-slate-800">
                            MK
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Main Layout Body ── */}
            <div className="flex flex-1 overflow-hidden">
                {/* ── Dynamic Sidebar ── */}
                <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col z-10">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Current Context</p>
                        <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                            <span className="material-icons text-indigo-600 text-base">
                                {modules.find(m => m.id === activeModule)?.icon}
                            </span>
                            {modules.find(m => m.id === activeModule)?.label} Panel
                        </h2>
                    </div>

                    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                        {sidebarItems.map((item) => (
                            <Link 
                                key={item.label} 
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all group"
                            >
                                <span className="material-icons text-xl text-slate-400 group-hover:text-indigo-500 transition-colors">{item.icon}</span>
                                <span className="text-xs font-bold">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Stats / Widget Area in Sidebar */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                        <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 mb-1">System Status</p>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold text-slate-700">All Systems Operational</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ── Page Content ── */}
                <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 relative">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white to-transparent pointer-events-none" />
                    
                    {/* Render Children (Current Page) */}
                    <div className="relative z-10 max-w-7xl mx-auto">
                        {/* We can inject a breadcrumb here dynamically if needed */}
                        <div className="mb-6 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <span>Admin</span>
                            <span className="material-icons text-[10px]">chevron_right</span>
                            <span className="text-indigo-600">{modules.find(m => m.id === activeModule)?.label}</span>
                        </div>
                        
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-400">Loading Admin...</div>}>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </Suspense>
    );
}
