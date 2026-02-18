"use client";
import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lightbulb, Rocket, Store } from 'lucide-react';

function StageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    const params = new URLSearchParams(searchParams);
    if (selected) params.set('stage', selected);
    // Mundu 'existing-assets' folder create chesi pettandi
    router.push(`/onboarding/existing-assets?${params.toString()}`);
  };

  return (
    <main className="bg-[#F8FAFC] h-screen flex flex-col items-center justify-center p-6 text-slate-900">
      <h1 className="text-3xl font-black mb-12 text-center uppercase">What stage is your business at?</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {[
          { id: 'idea', label: 'Just an idea', icon: <Lightbulb className="w-12 h-12" /> },
          { id: 'launch', label: 'Ready to launch', icon: <Rocket className="w-12 h-12" /> },
          { id: 'running', label: 'Already in business', icon: <Store className="w-12 h-12" /> }
        ].map((s) => (
          <button key={s.id} onClick={() => setSelected(s.id)} 
            className={`p-10 bg-white rounded-3xl border-4 transition-all flex flex-col items-center ${selected === s.id ? 'border-blue-600 shadow-xl' : 'border-slate-100'}`}>
             <div className="mb-4 text-blue-500">{s.icon}</div>
             <span className="font-bold text-lg">{s.label}</span>
          </button>
        ))}
      </div>
      <footer className="fixed bottom-0 w-full p-8 flex justify-between max-w-4xl">
        <button onClick={() => router.back()} className="font-black text-slate-400 uppercase">Back</button>
        <button onClick={handleNext} disabled={!selected} className={`px-14 py-4 rounded-2xl font-black text-white ${selected ? 'bg-slate-900' : 'bg-slate-200'}`}>CONTINUE</button>
      </footer>
    </main>
  );
}

export default function Page() { return <Suspense fallback={<div>Loading...</div>}><StageContent /></Suspense>; }