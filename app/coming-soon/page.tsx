'use client';
import React from 'react';
import Link from 'next/link';
import { Rocket, ShieldAlert, Lock, Mail } from 'lucide-react';

export default function ComingSoonPage() {
  const [showDevLogin, setShowDevLogin] = React.useState(false);
  const [password, setPassword] = React.useState('');

  const handleUnlock = () => {
    if (password === 'Mahe102410') {
      window.location.href = `/?dev=Mahe102410`;
    } else {
      alert('Incorrect Developer Password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-md text-center flex-1 flex flex-col justify-center">
        <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
          Coming <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Soon</span>
        </h1>
        
        <p className="text-slate-400 text-sm leading-relaxed">
          We are building the next generation AI-powered operating system for businesses. Stay tuned.
        </p>
      </div>

      {/* Hidden Developer Login at the very bottom */}
      <div className="relative z-10 mt-auto pb-4 w-full max-w-xs text-center">
        {!showDevLogin ? (
          <button 
            onClick={() => setShowDevLogin(true)} 
            className="text-[10px] text-slate-800 hover:text-slate-500 transition-colors cursor-pointer"
          >
            Developer
          </button>
        ) : (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <input 
              type="password" 
              placeholder="Developer Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              className="flex-1 bg-black border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              autoFocus
            />
            <button 
              onClick={handleUnlock}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all"
            >
              Unlock
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
