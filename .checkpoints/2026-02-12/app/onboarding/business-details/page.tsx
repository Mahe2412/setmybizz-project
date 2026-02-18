"use client";

import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Rocket, Building2, Target, ChevronRight } from 'lucide-react';

function DetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialName = searchParams.get('bizName') || "";
  const [bizName, setBizName] = useState(initialName);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const brandBlue = "#ADB3F0";

  const goals = [
    { id: 'sale', label: 'Get my first sale', desc: 'Setup store and start selling immediately', icon: <Target className="w-5 h-5 text-emerald-500" /> },
    { id: 'brand', label: 'Build brand awareness', desc: 'Create a professional online presence', icon: <Rocket className="w-5 h-5 text-blue-600" /> }
  ];

  return (
    <main className="bg-white h-screen flex flex-col font-sans text-slate-900 overflow-hidden">
      <div className="flex-1 flex flex-col justify-center items-center p-6 max-w-xl mx-auto w-full">
        
        <div className="w-full space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black tracking-tight">Finalize <span style={{ color: brandBlue }}>Setup</span></h1>
            <p className="text-slate-400 text-sm font-medium">Almost there! Let's name your dream.</p>
          </div>

          {/* Business Name Input Card */}
          <div className="bg-slate-50 p-6 rounded-[32px] border-2 border-transparent focus-within:border-[#ADB3F0] transition-all">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-[#ADB3F0]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Business Identity</span>
            </div>
            <input 
              type="text"
              value={bizName}
              onChange={(e) => setBizName(e.target.value)}
              placeholder="e.g. Mahaan Sweet Store"
              className="w-full text-2xl font-bold bg-transparent border-b-2 border-slate-200 focus:outline-none focus:border-[#ADB3F0] py-2 transition-colors"
            />
          </div>

          {/* Goal Selection */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">What's your primary goal?</p>
            <div className="grid gap-3">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    selectedGoal === goal.id ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-50 bg-white'
                  }`}
                >
                  <div className="bg-white p-2 rounded-lg shadow-sm">{goal.icon}</div>
                  <div className="text-left">
                    <h4 className="font-bold text-sm leading-none mb-1">{goal.label}</h4>
                    <p className="text-[10px] text-slate-400">{goal.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER NAVIGATION */}
      <footer className="bg-white border-t border-slate-50 p-5 mt-auto">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 font-bold text-xs hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> BACK
          </button>
          
          <button 
            onClick={() => alert(`Launching ${bizName}!`)}
            disabled={!bizName || !selectedGoal}
            className={`px-10 py-4 rounded-2xl font-black text-sm text-white flex items-center gap-2 shadow-xl transition-all ${
              bizName && selectedGoal ? 'bg-[#ADB3F0] hover:scale-105 active:scale-95' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
          >
            LAUNCH NOW
            <Rocket className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </main>
  );
}

export default function BusinessDetailsPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <DetailsContent />
    </Suspense>
  );
}