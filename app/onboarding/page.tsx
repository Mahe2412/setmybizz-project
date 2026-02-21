"use client";

import React, { Suspense } from 'react';
import MainApp from '@/components/MainApp';

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 text-sm font-medium animate-pulse">Initializing Onboarding...</p>
        </div>
      </div>
    }>
      <MainApp />
    </Suspense>
  );
}
