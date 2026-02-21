"use client";

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Building2, ArrowLeft, ChevronRight, Briefcase } from 'lucide-react';

function IndustryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [industryName, setIndustryName] = useState("");
  const [description, setDescription] = useState("");
  
  // Progress state
  const progress = 10; // Start of the flow

  const handleNext = () => {
    const params = new URLSearchParams(searchParams);
    params.set('industryName', industryName);
    params.set('industryDescription', description);
    router.push(`/onboarding/motivation?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#f0f4ff] flex flex-col items-center font-sans text-slate-900 overflow-hidden">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-white/30 z-50">
        <div 
          className="h-full bg-[#8daaff] transition-all duration-1000 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 max-w-xl mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <Briefcase className="w-8 h-8 text-[#8daaff]" />
            </div>
            <h1 className="text-4xl font-serif font-black text-[#1a2b4b]">
                What business are you starting?
            </h1>
            <p className="text-slate-500 font-medium">
                We'll tailor your AI co-founder experience based on your industry.
            </p>
        </div>

        <div className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a2b4b] opacity-60 ml-1">Industry Name</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-slate-400 group-focus-within:text-[#8daaff] transition-colors" />
                </div>
                <input 
                    type="text" 
                    value={industryName} 
                    onChange={(e) => setIndustryName(e.target.value)} 
                    placeholder="e.g. Creative Agency, Coffee Shop, SaaS" 
                    className="w-full pl-14 pr-6 py-5 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none focus:ring-2 focus:ring-[#8daaff] font-bold text-lg transition-all"
                />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a2b4b] opacity-60 ml-1">Tell us a bit more (Optional)</label>
            <textarea 
                rows={3} 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Briefly describe what you'll be doing..." 
                className="w-full p-6 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-none focus:ring-2 focus:ring-[#8daaff] font-semibold text-slate-600 resize-none transition-all"
            />
          </div>
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
                disabled={!industryName} 
                className={`px-10 py-5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl transition-all transform active:scale-95 ${
                    industryName 
                    ? 'bg-[#8daaff] text-white hover:bg-[#7a99ff] shadow-[#8daaff]/20' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
            >
                Next Step
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Subtle Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-gradient-to-br from-[#f0f4ff] via-white to-[#f0f4ff]"></div>
    </main>
  );
}

export default function IndustryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f0f4ff] flex items-center justify-center font-black text-[#8daaff] animate-pulse">SETMYBIZZ</div>}>
      <IndustryContent />
    </Suspense>
  );
}