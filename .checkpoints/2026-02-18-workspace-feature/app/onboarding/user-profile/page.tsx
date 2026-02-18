"use client";
import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { User, Mail, Phone, ArrowRight } from 'lucide-react';

function UserProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: ""
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set('userName', formData.userName);
    params.set('email', formData.email);
    params.set('phone', formData.phone);
    // Proceed to Motivation
    router.push(`/onboarding/motivation?${params.toString()}`);
  };

  return (
    <main className="bg-[#F1F5F9] h-screen flex flex-col items-center justify-center p-6 text-slate-900">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[40px] shadow-xl border-4 border-white">
        <div className="text-center">
          <h1 className="text-3xl font-black italic">Tell us about yourself</h1>
          <p className="text-slate-500 font-bold text-sm mt-2">To personalize your SetMyBizz experience.</p>
        </div>

        <form onSubmit={handleNext} className="space-y-4">
          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 focus-within:border-blue-600 transition-all">
            <User className="text-slate-400" size={20} />
            <input 
              type="text" required placeholder="Full Name" 
              className="bg-transparent outline-none font-bold w-full"
              onChange={(e) => setFormData({...formData, userName: e.target.value})}
            />
          </div>
          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 focus-within:border-blue-600 transition-all">
            <Mail className="text-slate-400" size={20} />
            <input 
              type="email" required placeholder="Email Address" 
              className="bg-transparent outline-none font-bold w-full"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 focus-within:border-blue-600 transition-all">
            <Phone className="text-slate-400" size={20} />
            <input 
              type="tel" required placeholder="Phone Number" 
              className="bg-transparent outline-none font-bold w-full"
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:scale-105 transition-all">
            CONTINUE <ArrowRight />
          </button>
        </form>
      </div>
    </main>
  );
}

export default function Page() { return <Suspense><UserProfileContent /></Suspense>; }