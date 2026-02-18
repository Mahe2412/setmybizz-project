"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import ProfileCompletionModal from '@/components/ProfileCompletionModal';

export const Navbar = () => {
    const { user, guestId, dbUser } = useAuth();
    const [showProfile, setShowProfile] = useState(false);

    // If user is logged in, show their name/profile
    // If guest, show Guest ID
    const displayName = user?.displayName || dbUser?.displayName || "User";
    const displayId = dbUser?.registeredId || (user ? "SMB-USER" : guestId);

    return (
        <>
            <nav className="border-b border-slate-200 py-4 px-6 fixed top-0 w-full bg-white/80 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {/* Logo */}
                        <Link href="/dashboard" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 cursor-pointer">
                            SetMyBizz
                        </Link>
                    </div>

                    <div className="hidden md:flex gap-6 items-center">
                        <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors">Dashboard</Link>
                        <Link href="/services" className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors">Services</Link>
                        {user && <Link href="/workspace" className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors">My Workspace</Link>}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <button
                                onClick={() => setShowProfile(true)}
                                className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-full bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-bold text-slate-800">{displayName}</p>
                                    <p className="text-[10px] text-slate-500 font-mono">{displayId}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="hidden sm:inline-block text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                    ID: {guestId}
                                </span>
                                <Link
                                    href="/onboarding/login"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                                >
                                    <span className="material-icons text-sm">login</span>
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Profile Modal */}
            {user && (
                <ProfileCompletionModal
                    isOpen={showProfile}
                    onComplete={() => setShowProfile(false)} // Just close for now, logic inside handles save
                />
            )}
        </>
    );
}
