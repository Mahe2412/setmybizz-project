import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

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
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                }
            });
            if (error) throw error;
            // Note: with OAuth, onLogin will be handled by auth state listener in AuthContext
        } catch (err: any) {
            console.error("Supabase Google Login Error:", err);
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
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) {
                    if (error.message.includes('Invalid login credentials')) {
                        throw new Error("Invalid password or account doesn't exist. If you are new, please Sign Up.");
                    }
                    throw error;
                }
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) {
                    if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already exists')) {
                        // Auto sign-in if account exists
                        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
                        if (signInErr) throw new Error("Account already exists, but incorrect password. Please Log In.");
                    } else {
                        throw error;
                    }
                }
            }
            onLogin();
        } catch (err: any) {
            console.error("Supabase Email Auth Error:", err);
            setError(err.message || 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };


    const handleSendOtp = async () => {
        if (phone.length < 10) {
            setError("Please enter a valid 10-digit mobile number");
            return;
        }
        setLoading(true);
        setError('');
        try {
            // Real OTP sending via Supabase + Twilio
            const { error } = await supabase.auth.signInWithOtp({
                phone: `+91${phone}`,
            });
            
            if (error) throw error;
            
            setOtpSent(true);
            setError('');
        } catch (err: any) {
            console.error("OTP Send Error:", err);
            setError(err.message || 'Failed to send OTP. Please verify your number.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length < 4) {
            setError("Please enter a valid OTP code.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            // Verify real OTP via Supabase
            const { data, error } = await supabase.auth.verifyOtp({
                phone: `+91${phone}`,
                token: otp,
                type: 'sms',
            });
            
            if (error) throw error;
            
            onLogin(); // Success
        } catch (err: any) {
            console.error("Real Phone Auth Error:", err);
            setError(err.message || 'Incorrect or expired OTP code.');
        } finally {
            setLoading(false);
        }
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
                            type="button"
                            className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3 shadow-xs relative overflow-hidden group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                            </svg>
                            <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
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
                                    type="button"
                                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined">sms</span>}
                                    <span>Get OTP</span>
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
                                        <button onClick={() => setOtpSent(false)} type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700">Change Number</button>
                                    </div>
                                </div>
                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={loading || otp.length < 4}
                                    type="button"
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined">check_circle</span>}
                                    <span>Verify & Login</span>
                                </button>
                            </>
                        )}
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
