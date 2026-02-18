"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function OfferingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bizName = searchParams.get('bizName') || "Your Business";

  const handleNext = () => {
    router.push(`/onboarding/industry/?bizName=${encodeURIComponent(bizName)}`);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome to SetMyBizz!</h1>
        <p className="text-slate-600 mb-6">Let's build a blueprint for <span className="font-bold text-blue-600">{bizName}</span></p>
        <button 
          onClick={handleNext}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Start Analysis 🚀
        </button>
      </div>
    </div>
  );
}

export default function OfferingPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading sleek experience...</div>}>
      <OfferingContent />
    </Suspense>
  );
}