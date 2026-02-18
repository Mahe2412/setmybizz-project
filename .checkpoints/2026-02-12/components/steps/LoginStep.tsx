import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface LoginStepProps {
    onLogin: (skipAuth?: boolean) => void;
    businessName: string;
}

const LoginStep: React.FC<LoginStepProps> = ({ onLogin, businessName }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            onLogin();
        } catch (err: any) {
            console.error("Google Login Error:", err);
            setError(err.message || 'Failed to login with Google.');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            onLogin();
        } catch (err: any) {
            console.error("Email Auth Error:", err);
            setError(err.message || 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#f8f9fa] z-[100] flex flex-col items-center justify-center p-6 font-display overflow-y-auto">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-500">

                {/* Branding */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome to SetMyBizz</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {isLogin ? 'Login to access your dashboard' : 'Create an account to get started'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">error</span>
                        {error}
                    </div>
                )}

                {/* Google Login */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3 mb-3 relative overflow-hidden"
                >
                    <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5" />
                    {loading ? 'Connecting...' : 'Continue with Google'}
                </button>

                <button
                    onClick={() => alert("Phone Login configuration requires Firebase Console setup. This is a UI placeholder.")}
                    disabled={loading}
                    className="w-full py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3 mb-6 relative overflow-hidden"
                >
                    <span className="material-symbols-outlined text-green-600 text-xl">call</span>
                    Continue with Phone
                </button>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-slate-400">Or continue with email</span>
                    </div>
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900"
                            placeholder="name@company.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && <span className="material-symbols-outlined animate-spin text-lg">sync</span>}
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-500">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-blue-600 font-bold hover:underline"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                    {process.env.NODE_ENV === 'development' && (
                        <button
                            onClick={() => onLogin(true)}
                            className="mt-4 text-[10px] text-red-400 hover:text-red-600 font-mono border border-red-200 rounded px-2 py-1 uppercase tracking-widest"
                        >
                            [DEV] Skip Login
                        </button>
                    )}
                </div>
            </div>
            <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                Secure Enterprise Login
            </p>
        </div>
    );
};

export default LoginStep;
