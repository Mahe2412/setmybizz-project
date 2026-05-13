"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthCallbackPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        // Once the user session is populated by Supabase PKCE exchange, redirect securely
        if (!loading) {
            const timer = setTimeout(() => {
                // Check if there's a stored redirect path, otherwise default to OS LaunchPad
                const redirectTo = sessionStorage.getItem('auth_return_url') || '/os';
                sessionStorage.removeItem('auth_return_url');
                router.push(redirectTo);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [user, loading, router]);

    return (
        <div className="min-h-screen bg-[#0f0f13] flex flex-col items-center justify-center p-6 select-none font-sans">
            <div className="max-w-md w-full bg-white/5 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-2xl text-center animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
                {/* Subtle Neural Backglow */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>

                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-blue-500/20 mx-auto mb-6 animate-pulse">
                    <span className="material-symbols-outlined text-4xl">verified_user</span>
                </div>

                <h1 className="text-2xl font-black text-white tracking-tight mb-2">
                    Authenticating Session
                </h1>
                <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-xs mx-auto mb-8">
                    Establishing secure AES-256 handshake with Supabase Auth Core protocols...
                </p>

                {/* Premium Spinner */}
                <div className="relative w-12 h-12 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-2 border-white/10 border-dashed animate-spin"></div>
                    <div className="absolute inset-1 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" style={{ animationDuration: '0.8s' }}></div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mt-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></span>
                    Link Active
                </div>
            </div>

            <div className="mt-8 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                SetMyBizz OS &bull; Secure Authentication Endpoint
            </div>
        </div>
    );
}
