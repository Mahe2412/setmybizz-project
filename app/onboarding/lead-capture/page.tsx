"use client";

import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { User, Mail, Phone, ChevronRight, ArrowLeft, ShieldCheck } from 'lucide-react';

function LeadContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState({ userName: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const progress = 85;

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Auto-capture lead (optional but good practice)
    try {
        await fetch('/api/leads', {
            method: 'POST',
            body: JSON.stringify({
                name: formData.userName,
                email: formData.email,
                phone: formData.phone,
                businessName: searchParams.get('bizName') || "Unknown",
                source: 'onboarding_flow'
            })
        });
    } catch (err) {
        console.error("Lead capture failed", err);
    }

    const params = new URLSearchParams(searchParams);
    params.set('userName', formData.userName);
    params.set('email', formData.email);
    params.set('phone', formData.phone);
    router.push(`/onboarding/analysis?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#f0f4ff] flex flex-col items-center font-sans text-slate-900 overflow-hidden">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-white/30 z-50">
        <div 
          className="h-full bg-[#8daaff] transition-all duration-1000 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 max-w-xl mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 transform rotate-6">
                <ShieldCheck className="w-8 h-8 text-[#8daaff]" />
            </div>
            <h1 className="text-4xl font-serif font-black text-[#1a2b4b]">
                Almost there!
            </h1>
            <p className="text-slate-500 font-medium">
                We're generating your customized business blueprint. Where should we send it?
            </p>
        </div>

        <form onSubmit={handleNext} className="w-full space-y-4">
          <div className="space-y-4 bg-white p-8 rounded-[2.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-[#8daaff] transition-colors" />
                </div>
                <input 
                    type="text" 
                    required
                    value={formData.userName}
                    onChange={(e) => setFormData({...formData, userName: e.target.value})}
                    placeholder="Full Name" 
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#8daaff] font-bold text-slate-700 transition-all"
                />
            </div>

            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-[#8daaff] transition-colors" />
                </div>
                <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Email Address" 
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#8daaff] font-bold text-slate-700 transition-all"
                />
            </div>

            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-[#8daaff] transition-colors" />
                </div>
                <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Phone Number" 
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#8daaff] font-bold text-slate-700 transition-all"
                />
            </div>
          </div>

          <div className="w-full flex items-center justify-between pt-8">
            <button 
                type="button"
                onClick={() => router.back()} 
                className="flex items-center gap-2 text-slate-400 font-black text-xs hover:text-[#1a2b4b] transition-all uppercase tracking-widest"
            >
                <ArrowLeft className="w-4 h-4" /> Back
            </button>
            
            <button 
                type="submit"
                disabled={isSubmitting}
                className={`px-12 py-5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl transition-all transform active:scale-95 bg-[#8daaff] text-white hover:bg-[#7a99ff] shadow-[#8daaff]/20 disabled:opacity-50`}
            >
                {isSubmitting ? 'Generating...' : 'Get My Blueprint'}
                <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-gradient-to-br from-[#f0f4ff] via-white to-[#f0f4ff]"></div>
    </main>
  );
}

export default function Page() {
  return <Suspense fallback={<div className="min-h-screen bg-[#f0f4ff]" />}><LeadContent /></Suspense>;
}