"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthCallbackPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [authErr, setAuthErr] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const errDesc = params.get('error_description') || params.get('error');
            if (errDesc) {
                setAuthErr(decodeURIComponent(errDesc.replace(/\+/g, ' ')));
            }
        }
    }, []);

    useEffect(() => {
        // Only redirect once Supabase successfully parses URL OAuth session tokens and confirms user object binding
        if (user) {
            const timer = setTimeout(() => {
                // Check if there's a stored redirect path, otherwise default to OS LaunchPad
                const redirectTo = sessionStorage.getItem('auth_return_url') || '/os';
                sessionStorage.removeItem('auth_return_url');
                router.push(redirectTo);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [user, router]);

    return (
        <div className="min-h-screen bg-[#0f0f13] flex flex-col items-center justify-center p-6 select-none font-sans">
            <div className="max-w-md w-full bg-white/5 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-2xl text-center animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
                {/* Subtle Neural Backglow */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>

                {authErr ? (
                    <>
                        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-[1.5rem] flex items-center justify-center text-red-500 shadow-xl mx-auto mb-6">
                            <span className="material-symbols-outlined text-4xl">error</span>
                        </div>
                        <h1 className="text-xl font-black text-white tracking-tight mb-2">
                            Authentication Gateway Error
                        </h1>
                        <p className="text-red-400 text-xs font-medium leading-relaxed max-w-xs mx-auto mb-6 bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                            {authErr}
                        </p>
                        <button
                            onClick={() => router.push('/os')}
                            className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all text-xs tracking-wider uppercase"
                        >
                            Back to Login Screen
                        </button>
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </div>

            <div className="mt-8 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                SetMyBizz OS &bull; Secure Authentication Endpoint
            </div>
        </div>
    );
}
