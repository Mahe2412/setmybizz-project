"use client";
import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Briefcase, DollarSign, Heart, ArrowLeft } from 'lucide-react';

function MotivationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    const params = new URLSearchParams(searchParams);
    if (selected) params.set('motivation', selected);
    // Folder name hyphen (-) tho undali
    router.push(`/onboarding/business-stage?${params.toString()}`);
  };

  return (
    <main className="bg-[#F8FAFC] h-screen flex flex-col items-center justify-center p-6 text-slate-900">
      <h1 className="text-3xl font-black text-center mb-12 uppercase tracking-tight">What was your biggest motivation?</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {[
          { id: 'boss', label: 'Being my own boss', icon: <Briefcase className="w-12 h-12" /> },
          { id: 'money', label: 'Making extra money', icon: <DollarSign className="w-12 h-12" /> },
          { id: 'love', label: 'Doing what I love', icon: <Heart className="w-12 h-12" /> }
        ].map((goal) => (
          <button key={goal.id} onClick={() => setSelected(goal.id)} 
            className={`bg-white p-10 rounded-2xl border-4 transition-all flex flex-col items-center gap-6 ${selected === goal.id ? 'border-blue-600 shadow-xl' : 'border-slate-100'}`}>
            {goal.icon}
            <span className="font-bold text-lg">{goal.label}</span>
          </button>
        ))}
      </div>
      <footer className="fixed bottom-0 w-full p-8 flex justify-between max-w-4xl">
        <button onClick={() => router.back()} className="font-black text-slate-400 uppercase">Back</button>
        <button onClick={handleNext} disabled={!selected} className={`px-14 py-4 rounded-2xl font-black text-white ${selected ? 'bg-slate-900' : 'bg-slate-200'}`}>NEXT</button>
      </footer>
    </main>
  );
}

export default function Page() { return <Suspense><MotivationContent /></Suspense>; }