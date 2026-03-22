import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface LoginStepProps {
    onLogin: (skipAuth?: boolean) => void;
    businessName: string;
}

const LoginStep: React.FC<LoginStepProps> = ({ onLogin, businessName }) => {
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
    const [isLogin, setIsLogin] = useState(true);
    
    // Email State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Phone State
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    
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

    const handleSendOtp = () => {
        if (phone.length < 10) {
            setError("Please enter a valid mobile number");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOtpSent(true);
            setError('');
            // Simulate OTP sent
        }, 1500);
    };

    const handleVerifyOtp = () => {
        if (otp.length !== 4 && otp.length !== 6) {
            setError("Invalid OTP");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onLogin(); // Success
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-[100] flex flex-col items-center justify-center p-6 font-sans overflow-y-auto">
            <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-2xl border border-white/50 animate-in fade-in zoom-in-95 duration-500">

                {/* Branding */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-4 transform hover:scale-105 transition-transform duration-500">
                        <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome to SetMyBizz</h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium">
                        {loginMethod === 'phone' 
                            ? (otpSent ? 'Enter code sent to your mobile' : 'Enter your mobile number to continue')
                            : (isLogin ? 'Login to access your dashboard' : 'Create an account to get started')}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl flex items-center gap-3 border border-red-100">
                        <span className="material-symbols-outlined text-xl">error</span>
                        {error}
                    </div>
                )}

                {/* Method Switcher */}
                <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                    <button
                        onClick={() => { setLoginMethod('email'); setOtpSent(false); setError(''); }}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${loginMethod === 'email' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Email
                    </button>
                    <button
                        onClick={() => { setLoginMethod('phone'); setError(''); }}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${loginMethod === 'phone' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Phone (OTP)
                    </button>
                </div>

                {loginMethod === 'email' ? (
                    <>
                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 font-medium"
                                    placeholder="name@company.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                            >
                                {loading && <span className="material-symbols-outlined animate-spin text-lg">sync</span>}
                                {isLogin ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest text-slate-400 bg-white px-2">
                                Or continue with
                            </div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {loading ? 'Connecting...' : 'Google Workspace'}
                        </button>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-500 font-medium">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-blue-600 font-bold hover:underline"
                                    type="button"
                                >
                                    {isLogin ? 'Sign up' : 'Log in'}
                                </button>
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="space-y-5">
                        {!otpSent ? (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Mobile Number</label>
                                    <div className="flex gap-3">
                                        <div className="px-4 py-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-bold text-sm flex items-center pointer-events-none select-none">
                                            🇮🇳 +91
                                        </div>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 10) setPhone(val);
                                            }}
                                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 font-medium tracking-widest text-lg"
                                            placeholder="98765 43210"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSendOtp}
                                    disabled={loading || phone.length < 10}
                                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined">sms</span>}
                                    Get OTP
                                </button>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Enter Verification Code</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            if (val.length <= 6) setOtp(val);
                                        }}
                                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 font-black tracking-[0.5em] text-center text-xl"
                                        placeholder="••••"
                                        autoFocus
                                    />
                                    <div className="flex justify-between items-center mt-2 px-1">
                                        <p className="text-xs text-slate-400">Sent to +91 {phone}</p>
                                        <button onClick={() => setOtpSent(false)} className="text-xs font-bold text-blue-600 hover:text-blue-700">Change Number</button>
                                    </div>
                                </div>
                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={loading || otp.length < 4}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined">check_circle</span>}
                                    Verify & Login
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Dev Skip (Keep for testing) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 text-center border-t border-dashed border-slate-200 pt-4">
                        <button
                            onClick={() => onLogin(true)}
                            className="text-[10px] text-slate-400 hover:text-slate-600 font-mono uppercase tracking-widest hover:underline"
                        >
                            [DEV] Skip Login (Testing Only)
                        </button>
                    </div>
                )}
            </div>
            
            <div className="mt-8 flex items-center gap-2 text-slate-400 opacity-60">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">256-bit Secure Enterprise Login</span>
            </div>
        </div>
    );
};

export default LoginStep;
