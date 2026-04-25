import React from 'react';
import { BrainCircuit, Activity } from 'lucide-react';

export const ArkleBrainStatus = ({ status = 'Optimal' }: { status?: string }) => (
  <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xl">
    <div className="relative">
      <BrainCircuit className="w-5 h-5 text-blue-500" />
      <div className="absolute inset-0 bg-blue-500/20 blur-lg animate-pulse"></div>
    </div>
    <div>
      <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Arkle Brain</h4>
      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em]">{status}</span>
    </div>
    <div className="flex gap-1 items-center ml-2">
      {[1, 2, 3].map(i => (
        <div key={i} className="w-1 h-3 bg-blue-500/40 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
      ))}
    </div>
  </div>
);
