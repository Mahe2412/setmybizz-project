"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

export default function LandingPage() {
    const [businessName, setBusinessName] = useState('');
    const router = useRouter();

    const handleStart = (e: React.FormEvent) => {
        e.preventDefault();
        if (businessName.trim()) {
            // Encode the business name to pass it in the URL
            const encodedName = encodeURIComponent(businessName.trim());
            // Redirect to the onboarding flow
            router.push(`/onboarding/industry?bizName=${encodedName}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f4ff] flex flex-col items-center justify-center p-6 font-sans">
            <div className="max-w-4xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Heading */}
                <h1 className="text-5xl md:text-7xl font-serif font-black text-[#1a2b4b] tracking-tight leading-[1.1]">
                    Simplifying your business journey
                </h1>

                {/* Subheading */}
                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                    Navigate your business journey with an AI-powered platform built for every step — from launch to growth.
                </p>

                {/* Search/Input Area */}
                <form onSubmit={handleStart} className="flex flex-col md:flex-row items-stretch justify-center gap-0 max-w-2xl mx-auto group">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="Enter your business name"
                            className="w-full px-8 py-5 md:py-6 bg-white text-slate-900 text-lg font-semibold rounded-2xl md:rounded-r-none md:rounded-l-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-0 border-none transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-10 py-5 md:py-6 bg-[#8daaff] hover:bg-[#7a99ff] text-white text-lg font-black rounded-2xl md:rounded-l-none md:rounded-r-[2rem] shadow-[0_4px_20px_rgba(141,170,255,0.3)] transition-all flex items-center justify-center gap-2 whitespace-nowrap transform active:scale-[0.98]"
                    >
                        Start My Business 🚀
                    </button>
                </form>

                {/* Trust Badge */}
                <div className="flex items-center justify-center gap-2 pt-8 opacity-60">
                    <div className="w-5 h-5 bg-[#3b82f6] rounded-full flex items-center justify-center">
                        <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#1a2b4b]">
                        Trusted by 10,000+ Founders
                    </span>
                </div>
            </div>

            {/* Subtle decor elements to match premium feel */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/40 rounded-full blur-[120px]"></div>
            </div>
        </div>
    );
}