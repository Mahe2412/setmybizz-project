"use client";
import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ShieldCheck } from 'lucide-react';

function AnalysisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bizName = searchParams.get('bizName') || "Your Business";

  useEffect(() => {
    // 3 seconds tharuvatha automatic ga Blueprint summary ki velthundi
    const timer = setTimeout(() => {
      router.push(`/onboarding/blueprint?${searchParams.toString()}`);
    }, 3500);
    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <main className="bg-slate-900 h-screen flex flex-col justify-center items-center text-white p-6 overflow-hidden">
      {/* Animated AI Pulse */}
      <div className="relative mb-12">
        <div className="w-32 h-32 bg-blue-500/20 rounded-full animate-ping absolute inset-0"></div>
        <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center border-4 border-blue-500 relative z-10 shadow-[0_0_50px_rgba(59,130,246,0.5)]">
          <Sparkles className="w-16 h-16 text-blue-400 animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-3xl font-black tracking-tight italic">
          Analyzing <span className="text-blue-400">{bizName}</span>...
        </h1>
        <div className="space-y-2">
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Crafting your custom blueprint</p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full animate-load-progress rounded-full" style={{ width: '100%' }}></div>
            </div>
        </div>
      </div>

      <div className="absolute bottom-10 flex items-center gap-2 opacity-40">
        <ShieldCheck className="w-5 h-5 text-emerald-500" />
        <span className="font-black text-lg tracking-tighter uppercase">SetMyBizz.in</span>
      </div>
    </main>
  );
}

export default function AnalysisPage() {
  return <Suspense><AnalysisContent /></Suspense>;
}