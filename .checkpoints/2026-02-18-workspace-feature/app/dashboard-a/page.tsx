"use client";
import React from 'react';
import { Navbar } from '@/app/components/Navbar';
import { ArrowLeft, Rocket, Zap, Shield, Target } from 'lucide-react';
import Link from 'next/link';

export default function LaunchPad() {
    return (
        <div className="min-h-screen bg-slate-900 text-white selection:bg-purple-600/30">
            <Navbar />

            <main className="pt-24 px-6 pb-20 max-w-6xl mx-auto">
                <Link href="/dashboard" className="text-slate-400 font-bold text-sm mb-6 inline-flex items-center hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Link>

                <header className="mb-12 text-center">
                    <span className="bg-purple-600/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block">Dashboard A</span>
                    <h1 className="text-4xl md:text-6xl font-black italic mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Your Launch Pad
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Your comprehensive roadmap to launching and scaling your business. Unlock tools as you grow.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-all hover:scale-[1.02] group cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40">
                            <Rocket className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Growth Blueprint</h3>
                        <p className="text-slate-400 mb-6 leading-relaxed">AI-generated roadmap tailored to your specific industry and stage.</p>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-purple-500 h-full w-3/4"></div>
                        </div>
                        <p className="text-xs text-purple-300 mt-2 font-bold">75% Ready</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-all hover:scale-[1.02] group cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-6 shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/40">
                            <Zap className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Expert Connect</h3>
                        <p className="text-slate-400 mb-6 leading-relaxed">Book 1:1 sessions with CA, CS, and legal experts instantly.</p>
                        <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold transition-all text-sm">Find Experts</button>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-all hover:scale-[1.02] group cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Compliance Shield</h3>
                        <p className="text-slate-400 mb-6 leading-relaxed">Automated alerts for GST, TDS, and annual filing deadlines.</p>
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800"></div>
                            <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-800"></div>
                            <div className="w-8 h-8 rounded-full bg-slate-500 border-2 border-slate-800 flex items-center justify-center text-[10px] font-bold">+2</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
