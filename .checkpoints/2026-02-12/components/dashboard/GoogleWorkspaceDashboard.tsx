"use client";

import React from 'react';
import { signInWithGoogleWorkspace } from '@/lib/firebase';
import { fetchUserEmails, fetchUserEvents, fetchUserFiles, GoogleEmail, GoogleCalendarEvent, GoogleDriveFile, getMockEmails, getMockEvents, getMockFiles } from '@/lib/google-api'; // Real + Fallback

export interface GoogleApp {
    id: string;
    label: string;
    icon: string;
    color: string;
    url?: string;
}

interface GoogleWorkspaceDashboardProps {
    onBack: () => void;
    onPinApp?: (app: GoogleApp) => void;
}

export default function GoogleWorkspaceDashboard({ onBack, onPinApp }: GoogleWorkspaceDashboardProps) {
    const [user, setUser] = React.useState<any>(null);
    const [token, setToken] = React.useState<string | null>(null);
    const [isConnecting, setIsConnecting] = React.useState(false);

    // Real Data State
    const [emails, setEmails] = React.useState<GoogleEmail[]>([]);
    const [events, setEvents] = React.useState<GoogleCalendarEvent[]>([]);
    const [files, setFiles] = React.useState<GoogleDriveFile[]>([]);
    const [isLoadingData, setIsLoadingData] = React.useState(false);

    // Fetch data when token is available
    React.useEffect(() => {
        if (token) {
            const loadData = async () => {
                setIsLoadingData(true);
                try {
                    const [fetchedEmails, fetchedEvents, fetchedFiles] = await Promise.all([
                        fetchUserEmails(token),
                        fetchUserEvents(token),
                        fetchUserFiles(token)
                    ]);
                    setEmails(fetchedEmails);
                    setEvents(fetchedEvents);
                    setFiles(fetchedFiles);
                } catch (e) {
                    console.error("Error loading workspace data", e);
                } finally {
                    setIsLoadingData(false);
                }
            };
            loadData();
        } else {
            // Reset to mocks/empty if no token (UI handles the blur)
            setEmails(getMockEmails().slice(0, 3));
            setEvents(getMockEvents().slice(0, 1));
            setFiles(getMockFiles().slice(0, 2));
        }
    }, [token]);

    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            const { user, token } = await signInWithGoogleWorkspace();
            setUser(user);
            setToken(token || null);
        } catch (error) {
            console.error("Failed to connect:", error);
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 animate-in fade-in duration-500">
            {/* Header */}
            <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <span className="material-icons-outlined">arrow_back</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-6 h-6" />
                        <h1 className="text-xl font-bold text-slate-800">Google Workspace</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {!user ? (
                        <button
                            onClick={handleConnect}
                            disabled={isConnecting}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 bg-white rounded-full p-0.5" />
                            {isConnecting ? 'Connecting...' : 'Connect Workspace'}
                        </button>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-100">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-xs font-bold">Connected as {user.email}</span>
                            </div>
                            {user.photoURL && <img src={user.photoURL} className="w-9 h-9 rounded-full border border-slate-200" alt="User" />}
                        </>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                            <span className="material-icons-outlined">mail</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900">12</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Unread Emails</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <span className="material-icons-outlined">calendar_today</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900">3</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Meetings Today</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            <span className="material-icons-outlined">description</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900">Recent</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Files Accessed</p>
                        </div>
                    </div>
                </div>

                {/* Main Widgets Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Gmail Widget */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
                        {!user && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <span className="material-icons text-red-500 text-3xl">lock</span>
                                </div>
                                <h3 className="font-bold text-slate-900 text-lg">Connect Gmail</h3>
                                <p className="text-slate-500 max-w-xs mb-4">Securely connect your Google account to view and manage your emails directly here.</p>
                                <button onClick={handleConnect} className="text-blue-600 font-bold hover:underline">Connect Now</button>
                            </div>
                        )}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-red-500">mail</span>
                                <h3 className="font-bold text-slate-800">Inbox</h3>
                            </div>
                            <button className="text-xs font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2">
                                <span className="material-icons-outlined text-sm">edit</span> Compose
                            </button>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {isLoadingData ? (
                                <div className="p-8 text-center text-slate-400 text-sm">Loading your emails...</div>
                            ) : (
                                emails.map((mail: any, i: number) => (
                                    <div key={i} className={`p-4 hover:bg-red-50/10 cursor-pointer transition-colors flex items-center gap-4 group ${!user ? 'blur-[2px] select-none opacity-50' : ''}`}>
                                        <div className={`w-2 h-2 rounded-full ${i < 3 ? 'bg-blue-600' : 'bg-transparent'}`}></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between mb-1">
                                                <span className={`text-sm font-bold ${i < 3 ? 'text-slate-900' : 'text-slate-600'}`}>{mail.from}</span>
                                                <span className="text-xs text-slate-400 font-medium">{mail.date}</span>
                                            </div>
                                            <p className="text-sm text-slate-500 truncate group-hover:text-slate-700">{mail.subject}</p>
                                        </div>
                                        {mail.isUnread && <span className="material-icons text-yellow-500 text-lg">star</span>}
                                    </div>
                                )))}
                        </div>
                    </div>

                    {/* Sidebar Widgets (Calendar & Drive) */}
                    <div className="space-y-8">
                        {/* Calendar */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                            {!user && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 text-center">
                                    <span className="material-icons text-blue-500 text-2xl mb-2">lock</span>
                                    <p className="bold text-sm text-slate-800">Connect to see events</p>
                                </div>
                            )}
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <span className="material-icons text-blue-500">calendar_today</span>
                                    <h3 className="font-bold text-slate-800">Today</h3>
                                </div>
                                <span className="text-xs font-bold text-slate-500">Jan 29</span>
                            </div>
                            <div className="p-4 space-y-3">
                                {events.map((event: any, i: number) => (
                                    <div key={i} className={`p-3 rounded-xl border-l-4 bg-blue-50 border-blue-500 hover:bg-blue-100 transition-colors cursor-pointer ${!user ? 'blur-[2px] opacity-50' : ''}`}>
                                        <h4 className={`text-sm font-bold text-slate-900`}>{event.title}</h4>
                                        <p className={`text-xs text-slate-700 mt-1`}>{event.startTime} - {event.endTime}</p>
                                        {event.meetLink && (
                                            <a href={event.meetLink} target="_blank" rel="noreferrer" className="mt-2 block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 rounded-lg">Join Google Meet</a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Drive */}
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                            {!user && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 text-center">
                                    <span className="material-icons text-green-500 text-2xl mb-2">lock</span>
                                    <p className="bold text-sm text-slate-800">Connect to see files</p>
                                </div>
                            )}
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <span className="material-icons text-green-600">description</span>
                                    <h3 className="font-bold text-slate-800">Files</h3>
                                </div>
                            </div>
                            <div className="p-2">
                                {files.map((file: any, i: number) => (
                                    <div key={i} onClick={() => file.webViewLink && window.open(file.webViewLink, '_blank')} className={`flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors ${!user ? 'blur-[2px] opacity-50' : ''}`}>
                                        <div className={`w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center overflow-hidden`}>
                                            {file.iconLink ? <img src={file.iconLink} alt="" className="w-5 h-5" /> : <span className="material-icons text-green-600 text-lg">description</span>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-slate-700 truncate">{file.name}</h4>
                                            <p className="text-[10px] text-slate-400 capitalize">Google File</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Apps Grid for Pinning */}
                <div className="mt-8">
                    <h2 className="font-bold text-slate-800 mb-4 px-2">Quick Access Apps (Pin to Dashboard)</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {[
                            { id: 'gmail', label: 'Gmail', icon: 'mail', color: 'red' },
                            { id: 'drive', label: 'Drive', icon: 'add_to_drive', color: 'green' },
                            { id: 'calendar', label: 'Calendar', icon: 'calendar_today', color: 'blue' },
                            { id: 'docs', label: 'Docs', icon: 'description', color: 'blue' },
                            { id: 'sheets', label: 'Sheets', icon: 'table_chart', color: 'green' },
                            { id: 'slides', label: 'Slides', icon: 'slideshow', color: 'orange' },
                            { id: 'meet', label: 'Meet', icon: 'videocam', color: 'purple' },
                        ].map((app) => (
                            <button
                                key={app.id}
                                onClick={() => onPinApp?.(app)}
                                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-white hover:shadow-md hover:border-blue-100 transition-all group"
                            >
                                <div className={`w-10 h-10 rounded-full bg-${app.color}-50 flex items-center justify-center text-${app.color}-600 mb-3 group-hover:scale-110 transition-transform`}>
                                    <span className="material-icons text-xl">{app.icon}</span>
                                </div>
                                <span className="text-xs font-bold text-slate-700">{app.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
