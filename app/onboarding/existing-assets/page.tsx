"use client";

import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Globe, BadgeCheck, Mail, Brush, ArrowLeft, ChevronRight, Check } from 'lucide-react';

function AssetsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const bizName = searchParams.get('bizName') || "Your Business";

  const assets = [
    { id: 'logo', label: 'Logo design', icon: <Brush className="w-6 h-6" /> },
    { id: 'domain', label: 'Domain name', icon: <Globe className="w-6 h-6" /> },
    { id: 'gst', label: 'GST Number', icon: <BadgeCheck className="w-6 h-6" /> },
    { id: 'email', label: 'Business mailbox', icon: <Mail className="w-6 h-6" /> }
  ];

  const toggleAsset = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const handleNext = () => {
    const params = new URLSearchParams(searchParams);
    params.set('assets', selected.join(','));
    router.push(`/onboarding/focus-area?${params.toString()}`);
  };

  return (
    <main className="bg-[#F1F5F9] h-screen flex flex-col font-sans text-slate-900 overflow-hidden">
      <div className="flex-1 max-w-2xl mx-auto w-full p-6 flex flex-col items-center justify-center space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-black leading-tight">Does {bizName} already have any of these?</h1>
          <p className="text-slate-500 font-bold">Select to skip steps you've already completed.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          {assets.map((asset) => (
            <button
              key={asset.id}
              onClick={() => toggleAsset(asset.id)}
              className={`p-8 rounded-[32px] border-4 flex flex-col items-center gap-4 transition-all relative ${
                selected.includes(asset.id) ? 'border-slate-900 bg-white shadow-xl' : 'border-white bg-white/60'
              }`}
            >
              <div className="p-4 bg-slate-50 rounded-2xl">{asset.icon}</div>
              <span className="font-black text-sm uppercase tracking-tight">{asset.label}</span>
              {selected.includes(asset.id) && (
                <div className="absolute top-4 right-4 bg-emerald-500 rounded-full p-1">
                  <Check className="w-3 h-3 text-white stroke-[4]" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <footer className="bg-white border-t-2 border-slate-200 p-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-900 font-black text-sm uppercase">
            <ArrowLeft className="w-5 h-5 stroke-[3]" /> BACK
          </button>
          <button onClick={handleNext} className="bg-slate-900 text-white px-14 py-4 rounded-2xl font-black text-base shadow-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
            CONTINUE <ChevronRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      </footer>
    </main>
  );
}

export default function Page() { return <Suspense><AssetsContent /></Suspense>; }