"use client";
import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Chrome, ShieldCheck } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bizName = searchParams.get('bizName') || "Business";
  const [mobile, setMobile] = useState('');

  // Redirect preserving existing params and adding a provider flag
  const handleGoogleLogin = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('provider', 'google');
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (mobile) params.set('mobile', mobile);
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <main className="bg-slate-900 h-screen flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-blue-600 w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl">
          <Lock className="text-white w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black italic">Login to {bizName}</h1>
        <div className="space-y-4 pt-4">
          <button onClick={handleGoogleLogin} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black flex items-center justify-center gap-3">
            <ShieldCheck size={20} /> Continue with Google
          </button>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="mt-4 bg-white/5 p-4 rounded-2xl flex gap-3 items-center">
              <input
                aria-label="Mobile number"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-400"
                inputMode="tel"
              />
              <button type="submit" className="bg-blue-600 px-4 py-2 rounded-xl font-black">Continue</button>
            </div>
          </form>
        </div>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest pt-6">SETMYBIZZ.IN SECURITY</p>
      </div>
    </main>
  );
}
export default function Page() { return <Suspense><LoginContent /></Suspense>; }