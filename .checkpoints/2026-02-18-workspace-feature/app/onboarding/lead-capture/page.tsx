"use client";
import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { User, Mail, Phone, ArrowRight } from 'lucide-react';

function LeadContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState({ userName: "", email: "", phone: "" });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set('userName', formData.userName);
    params.set('email', formData.email);
    params.set('phone', formData.phone);
    router.push(`/onboarding/analysis?${params.toString()}`);
  };

  return (
    <main className="bg-[#F1F5F9] h-screen flex flex-col items-center justify-center p-6 text-slate-900 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-12 rounded-[48px] shadow-2xl border-4 border-white">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-black italic italic">Almost Done!</h1>
          <p className="text-slate-500 font-bold text-sm">Enter details to see your customized blueprint.</p>
        </div>
        <form onSubmit={handleNext} className="space-y-4">
          <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-100 focus-within:border-blue-600 transition-all flex items-center gap-4">
            <User className="text-slate-400" size={20} />
            <input type="text" required placeholder="Full Name" className="bg-transparent outline-none font-black w-full text-lg" onChange={(e) => setFormData({...formData, userName: e.target.value})} />
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-100 focus-within:border-blue-600 transition-all flex items-center gap-4">
            <Mail className="text-slate-400" size={20} />
            <input type="email" required placeholder="Email Address" className="bg-transparent outline-none font-black w-full text-lg" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-100 focus-within:border-blue-600 transition-all flex items-center gap-4">
            <Phone className="text-slate-400" size={20} />
            <input type="tel" required placeholder="Phone Number" className="bg-transparent outline-none font-black w-full text-lg" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.02] shadow-xl">
            GET BLUEPRINT <ArrowRight strokeWidth={4} />
          </button>
        </form>
      </div>
    </main>
  );
}

export default function Page() {
  return <Suspense fallback={<div>Loading...</div>}><LeadContent /></Suspense>;
}