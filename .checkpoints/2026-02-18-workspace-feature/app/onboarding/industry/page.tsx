"use client";
import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function IndustryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [industryName, setIndustryName] = useState("");
  const [description, setDescription] = useState("");

  const handleNext = () => {
    const params = new URLSearchParams(searchParams);
    params.set('industryName', industryName);
    router.push(`/onboarding/motivation?${params.toString()}`);
  };

  return (
    <main className="bg-[#F1F5F9] h-screen flex flex-col items-center justify-center p-6 text-slate-900">
      <h1 className="text-4xl font-black mb-8">Enter your industry</h1>
      <div className="w-full max-w-md space-y-4">
        <input 
          type="text" value={industryName} 
          onChange={(e) => setIndustryName(e.target.value)} 
          placeholder="e.g. Coffee shop" 
          className="w-full p-5 rounded-2xl border-2 border-slate-300 outline-none focus:border-slate-900 font-bold"
        />
        <textarea 
          rows={4} value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Describe your business..." 
          className="w-full p-5 rounded-2xl border-2 border-slate-300 outline-none focus:border-slate-900 font-semibold resize-none"
        />
      </div>
      <footer className="fixed bottom-0 w-full p-8 flex justify-between max-w-4xl">
        <button onClick={() => router.back()} className="font-black text-slate-400 uppercase">Back</button>
        <button onClick={handleNext} disabled={!industryName} className={`px-14 py-4 rounded-2xl font-black text-white ${industryName ? 'bg-slate-900' : 'bg-slate-200'}`}>NEXT</button>
      </footer>
    </main>
  );
}

// Ee line kachitanga correct ga undali
export default function IndustryPage() {
  return <Suspense fallback={<div>Loading...</div>}><IndustryContent /></Suspense>;
}