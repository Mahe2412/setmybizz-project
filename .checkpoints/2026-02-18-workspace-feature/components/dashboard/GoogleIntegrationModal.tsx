"use client";

import React, { useState } from 'react';

interface GoogleIntegrationModalProps {
    onClose: () => void;
    onConnect: () => void;
}

export default function GoogleIntegrationModal({ onClose, onConnect }: GoogleIntegrationModalProps) {
    const [status, setStatus] = useState<'initial' | 'connecting' | 'success'>('initial');

    const handleGoogleLogin = () => {
        setStatus('connecting');
        // Simulate OAuth Process
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                onConnect();
            }, 1000);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 relative">

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 z-10">
                    <span className="material-icons-outlined">close</span>
                </button>

                <div className="p-8 flex flex-col items-center text-center">
                    {/* Google Logo */}
                    <div className="w-16 h-16 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center mb-6">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-8 h-8" />
                    </div>

                    {status === 'initial' && (
                        <>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Connect Google Workspace</h2>
                            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                                Manage your emails, calendar, and files directly from SetMyBizz Dashboard.
                            </p>

                            <div className="w-full space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-left p-2 rounded-lg bg-slate-50 border border-slate-100">
                                    <span className="material-icons-outlined text-red-500 text-lg">mail</span>
                                    <span className="text-xs font-bold text-slate-600">Gmail Access</span>
                                </div>
                                <div className="flex items-center gap-3 text-left p-2 rounded-lg bg-slate-50 border border-slate-100">
                                    <span className="material-icons-outlined text-blue-500 text-lg">calendar_today</span>
                                    <span className="text-xs font-bold text-slate-600">Calendar Events</span>
                                </div>
                                <div className="flex items-center gap-3 text-left p-2 rounded-lg bg-slate-50 border border-slate-100">
                                    <span className="material-icons-outlined text-green-600 text-lg">description</span>
                                    <span className="text-xs font-bold text-slate-600">Google Drive Files</span>
                                </div>
                            </div>

                            <button
                                onClick={handleGoogleLogin}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                            >
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" className="w-4 h-4 bg-white rounded-full p-0.5" />
                                Sign in with Google
                            </button>
                            <p className="text-[10px] text-slate-400 mt-4">Safe & Secure via Google OAuth 2.0</p>
                        </>
                    )}

                    {status === 'connecting' && (
                        <div className="py-8">
                            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <h3 className="font-bold text-slate-800">Connecting to Google...</h3>
                            <p className="text-xs text-slate-500 mt-1">Please wait while we verify your credentials.</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="py-8 animate-in bg-green-50 rounded-xl w-full">
                            <span className="material-icons-outlined text-5xl text-green-500 mb-2">check_circle</span>
                            <h3 className="font-bold text-green-700">Connected Successfully!</h3>
                            <p className="text-xs text-green-600 mt-1">Redirecting to your workspace...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
