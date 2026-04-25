import React from 'react';
import ArkleSearch from '@/components/shared/ArkleSearch';

export default function ArkleStandalonePage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center">
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      {/* Navigation */}
      <nav className="w-full px-8 py-6 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-sm">A</div>
          <span className="font-black text-white tracking-tighter text-xl">Arkle</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="/os" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">BizOS Login</a>
          <button className="px-5 py-2 bg-white text-black text-sm font-black rounded-full hover:bg-slate-200 transition-all active:scale-95">
            Get OS Pro
          </button>
        </div>
      </nav>

      <ArkleSearch />
      
      {/* Footer */}
      <footer className="mt-auto py-8 text-slate-600 text-[10px] font-bold uppercase tracking-widest relative z-10">
        © 2026 SetMyBizz Intelligence Systems. All rights reserved.
      </footer>
    </div>
  );
}
