"use client";

import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Laptop, Gavel, Palette, TrendingUp, ArrowLeft, ChevronRight, Check } from 'lucide-react';

function FocusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const areas = [
    { id: 'online', label: 'Online Presence', icon: <Laptop className="w-6 h-6" />, desc: 'Website & Branding' },
    { id: 'legal', label: 'Formation', icon: <Gavel className="w-6 h-6" />, desc: 'Legal Compliance' },
    { id: 'branding', label: 'Design', icon: <Palette className="w-6 h-6" />, desc: 'Logo & Identity' },
    { id: 'growth', label: 'Growth', icon: <TrendingUp className="w-6 h-6" />, desc: 'Funding & Scaling' }
  ];

  const toggleArea = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const handleNext = () => {
    const params = new URLSearchParams(searchParams);
    params.set('focus', selected.join(','));
    // Redirecting to lead-capture folder
    router.push(`/onboarding/lead-capture?${params.toString()}`);
  };

  return (
    <main className="bg-[#F1F5F9] h-screen flex flex-col font-sans text-slate-900 overflow-hidden">
      <div className="flex-1 max-w-5xl mx-auto w-full p-6 flex flex-col items-center justify-center space-y-12">
        <h1 className="text-4xl font-black text-center leading-tight">What would you like to focus on today?</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {areas.map((area) => (
            <div
              key={area.id}
              role="button"
              tabIndex={0}
              onClick={() => toggleArea(area.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleArea(area.id);
                }
              }}
              aria-pressed={selected.includes(area.id)}
              className={`p-8 bg-white rounded-[32px] border-4 flex flex-col items-center text-center gap-4 transition-all relative ${
                selected.includes(area.id) ? 'border-slate-900 shadow-xl scale-105' : 'border-white hover:border-slate-200'
              }`}
            >
              <div className="p-5 bg-slate-50 rounded-2xl text-slate-900">{area.icon}</div>
              <h3 className="font-black text-lg leading-tight">{area.label}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase">{area.desc}</p>
              {selected.includes(area.id) && <Check className="absolute top-4 right-4 w-5 h-5 text-emerald-500 stroke-[4]" />}
            </div>
          ))}
        </div>
      </div>

      <footer className="bg-white border-t-2 border-slate-200 p-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="text-slate-900 font-black text-sm uppercase flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 stroke-[3]" /> BACK
          </button>
          <div className="flex items-center gap-6">
            <span className="text-slate-400 font-black text-xs uppercase tracking-widest">Step 6 / 8</span>
            <button 
              onClick={handleNext} 
              className="bg-slate-900 text-white px-16 py-4 rounded-2xl font-black text-base shadow-2xl flex items-center gap-2 transition-all hover:scale-105"
            >
              NEXT <ChevronRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function Page() { return <Suspense><FocusContent /></Suspense>; }