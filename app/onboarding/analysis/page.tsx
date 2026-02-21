"use client";

import React, { useEffect, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ShieldCheck, BrainCircuit, Cpu, Zap } from 'lucide-react';

function AnalysisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bizName = searchParams.get('bizName') || "Your Business";
  const [status, setStatus] = useState("Analyzing market trends...");

  useEffect(() => {
    const statuses = [
        "Analyzing market trends...",
        "Evaluating competition...",
        "Mapping legal requirements...",
        "Designing growth strategy...",
        "Finalizing your AI blueprint..."
    ];
    
    let i = 0;
    const statusInterval = setInterval(() => {
        i++;
        if (i < statuses.length) setStatus(statuses[i]);
    }, 700);

    const timer = setTimeout(() => {
      router.push(`/onboarding/blueprint?${searchParams.toString()}`);
    }, 4000);

    return () => {
        clearInterval(statusInterval);
        clearTimeout(timer);
    };
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-[#f0f4ff] flex flex-col justify-center items-center text-slate-900 p-6 overflow-hidden">
      {/* Animated AI Pulse Container */}
      <div className="relative mb-16 scale-125">
        <div className="w-32 h-32 bg-[#8daaff]/10 rounded-full animate-ping absolute inset-0"></div>
        <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(141,170,255,0.2)] relative z-10 border border-[#8daaff]/20">
          <BrainCircuit className="w-16 h-16 text-[#8daaff] animate-pulse" />
        </div>
        
        {/* Floating Icons */}
        <div className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center animate-bounce duration-3000 delay-150">
            <Cpu className="w-5 h-5 text-indigo-400" />
        </div>
        <div className="absolute -bottom-2 -left-6 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center animate-bounce duration-3000 delay-500">
            <Zap className="w-6 h-6 text-amber-400" />
        </div>
      </div>

      <div className="text-center space-y-6 max-w-md animate-in fade-in duration-1000">
        <div className="space-y-2">
            <h1 className="text-3xl font-serif font-black text-[#1a2b4b]">
                Architecting <span className="text-[#8daaff]">{bizName}</span>
            </h1>
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] h-4">
                {status}
            </p>
        </div>

        <div className="w-full bg-white/50 h-2 rounded-full overflow-hidden shadow-inner border border-white">
            <div className="h-full bg-gradient-to-r from-indigo-400 to-[#8daaff] rounded-full transition-all duration-4000 ease-linear" style={{ width: '100%' }}></div>
        </div>
      </div>

      <div className="absolute bottom-10 flex items-center gap-2 opacity-30">
        <ShieldCheck className="w-4 h-4 text-[#8daaff]" />
        <span className="font-black text-xs tracking-widest uppercase text-[#1a2b4b]">SetMyBizz AI Engine</span>
      </div>

      {/* Subtle Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-gradient-to-br from-[#f0f4ff] via-white to-[#f0f4ff]"></div>
    </main>
  );
}

export default function AnalysisPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#f0f4ff]" />}><AnalysisContent /></Suspense>;
}