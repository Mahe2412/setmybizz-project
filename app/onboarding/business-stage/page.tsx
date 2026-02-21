"use client";

import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lightbulb, Rocket, Store, ArrowLeft, ChevronRight, Milestone } from 'lucide-react';

function StageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  
  const progress = 40;

  const handleNext = () => {
    const params = new URLSearchParams(searchParams);
    if (selected) params.set('stage', selected);
    router.push(`/onboarding/existing-assets?${params.toString()}`);
  };

  const stages = [
    { 
        id: 'idea', 
        label: 'Just an Idea', 
        desc: 'I have a concept I want to bring to life',
        icon: <Lightbulb className="w-8 h-8 text-amber-500" /> 
    },
    { 
        id: 'launch', 
        label: 'Ready to Launch', 
        desc: 'I have a plan and I am ready to start',
        icon: <Rocket className="w-8 h-8 text-blue-600" /> 
    },
    { 
        id: 'running', 
        label: 'Already Running', 
        desc: 'My business is already operational',
        icon: <Store className="w-8 h-8 text-indigo-500" /> 
    }
  ];

  return (
    <main className="min-h-screen bg-[#f0f4ff] flex flex-col items-center font-sans text-slate-900 overflow-hidden">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-white/30 z-50">
        <div 
          className="h-full bg-[#8daaff] transition-all duration-1000 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 max-w-4xl mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <Milestone className="w-8 h-8 text-[#8daaff]" />
            </div>
            <h1 className="text-4xl font-serif font-black text-[#1a2b4b]">
                What stage are you at?
            </h1>
            <p className="text-slate-500 font-medium">
                We'll provide the right tools for your specific business stage.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {stages.map((s) => (
            <button 
                key={s.id} 
                onClick={() => setSelected(s.id)} 
                className={`group relative bg-white p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center text-center gap-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] ${
                    selected === s.id ? 'border-[#8daaff] ring-4 ring-[#8daaff]/10' : 'border-transparent'
                }`}
            >
                <div className={`p-5 rounded-2xl transition-colors ${selected === s.id ? 'bg-indigo-50' : 'bg-slate-50 group-hover:bg-slate-100'}`}>
                    {s.icon}
                </div>
                <div>
                    <span className="block font-black text-lg text-[#1a2b4b] mb-2">{s.label}</span>
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 opacity-80">{s.desc}</span>
                </div>
                {selected === s.id && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-[#8daaff] rounded-full flex items-center justify-center">
                        <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                )}
            </button>
          ))}
        </div>

        <div className="w-full flex items-center justify-between pt-12">
            <button 
                onClick={() => router.back()} 
                className="flex items-center gap-2 text-slate-400 font-black text-xs hover:text-[#1a2b4b] transition-all uppercase tracking-widest"
            >
                <ArrowLeft className="w-4 h-4" /> Back
            </button>
            
            <button 
                onClick={handleNext} 
                disabled={!selected} 
                className={`px-10 py-5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl transition-all transform active:scale-95 ${
                    selected 
                    ? 'bg-[#8daaff] text-white hover:bg-[#7a99ff] shadow-[#8daaff]/20' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
                Continue
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-gradient-to-br from-[#f0f4ff] via-white to-[#f0f4ff]"></div>
    </main>
  );
}

export default function Page() { return <Suspense fallback={<div className="min-h-screen bg-[#f0f4ff]" />}><StageContent /></Suspense>; }