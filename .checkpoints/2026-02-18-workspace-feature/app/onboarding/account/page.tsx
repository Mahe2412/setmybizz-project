"use client";
import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';

function AccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const bizName = searchParams.get('bizName') || "Your Business";

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set('email', email);
    router.push(`/onboarding/analysis?${params.toString()}`);
  };

  return (
    <main className="bg-[#F1F5F9] h-screen flex flex-col items-center justify-center p-6 text-slate-900">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-200">
          <Mail className="text-white w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black">Save your progress for {bizName}</h1>
        <form onSubmit={handleNext} className="space-y-4">
          <input 
            type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email" 
            className="w-full p-5 rounded-2xl border-4 border-slate-200 outline-none focus:border-slate-900 font-bold"
          />
          <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:scale-105 transition-all">
            SEE MY BLUEPRINT <ArrowRight />
          </button>
        </form>
        <div className="flex items-center justify-center gap-2 opacity-60">
          <ShieldCheck className="text-emerald-600 w-5 h-5" />
          <span className="font-black text-sm uppercase tracking-widest">SetMyBizz.in</span>
        </div>
      </div>
    </main>
  );
}
export default function Page() { return <Suspense><AccountContent /></Suspense>; }