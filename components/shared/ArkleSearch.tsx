'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ArrowRight, MessageSquare, Globe, Zap, Shield, TrendingUp } from 'lucide-react';

const SUGGESTIONS = [
  { text: "Analyze market trends in Indian SaaS for 2026", icon: TrendingUp },
  { text: "How to incorporate a Delaware C-Corp from India?", icon: Globe },
  { text: "Review my business model for potential risks", icon: Shield },
  { text: "Draft a pitch deck outline for an AI startup", icon: Zap }
];

export default function ArkleSearch() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResponse(null);

    // Simulate AI Search (In production, this would call /api/gemini or /api/arkle/neural-core)
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `User is using Arkle for Business (Standalone). They asked: ${query}\n\nProvide a comprehensive, high-level business intelligence response.` })
      });
      const data = await res.json();
      setResponse(data.text);
    } catch (error) {
      setResponse("I encountered an error connecting to the Neural Core. Please ensure your API keys are configured.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 md:py-24">
      {/* Arkle Branding */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center mb-12"
      >
        <div className="w-20 h-20 bg-blue-600/20 rounded-[32px] flex items-center justify-center mb-6 relative group">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-400/30 transition-all duration-500 animate-pulse"></div>
          <Sparkles className="text-blue-400 relative z-10" size={40} />
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
          Arkle <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">for Business</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl font-medium">
          The elite intelligence engine for modern founders. 
          Analyze markets, automate workflows, and scale globally.
        </p>
      </motion.div>

      {/* Search Input Area */}
      <div className="relative z-20">
        <motion.form 
          onSubmit={handleSearch}
          animate={{ scale: isFocused ? 1.02 : 1 }}
          className={`relative bg-white/5 backdrop-blur-2xl border ${isFocused ? 'border-blue-500/50 shadow-2xl shadow-blue-500/10' : 'border-white/10'} rounded-[32px] p-2 transition-all duration-500`}
        >
          <div className="flex items-center gap-4 px-6 py-4">
            <Search className={`transition-colors duration-300 ${isFocused ? 'text-blue-400' : 'text-slate-500'}`} size={24} />
            <input 
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask anything about your business..."
              className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-slate-600"
            />
            <button 
              type="submit"
              disabled={isSearching || !query.trim()}
              className="w-12 h-12 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <ArrowRight size={20} />
              )}
            </button>
          </div>
        </motion.form>

        {/* Quick Suggestions */}
        {!response && !isSearching && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8"
          >
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(s.text);
                  inputRef.current?.focus();
                }}
                className="flex items-center gap-3 px-5 py-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-2xl text-left transition-all group"
              >
                <s.icon className="text-slate-500 group-hover:text-blue-400 transition-colors" size={18} />
                <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{s.text}</span>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Response Area */}
      <AnimatePresence>
        {(isSearching || response) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-12 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[40px] overflow-hidden"
          >
            <div className="p-8 md:p-12">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="text-white" size={16} />
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-widest">Arkle Intel</h3>
               </div>
               
               {isSearching ? (
                 <div className="space-y-4">
                    <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-white/5 rounded-full w-full animate-pulse delay-75"></div>
                    <div className="h-4 bg-white/5 rounded-full w-2/3 animate-pulse delay-150"></div>
                 </div>
               ) : (
                 <div className="prose prose-invert max-w-none">
                    <div 
                      className="text-slate-200 text-lg leading-relaxed whitespace-pre-line"
                      dangerouslySetInnerHTML={{ __html: response?.replace(/\n/g, '<br/>') || '' }}
                    />
                 </div>
               )}

               {!isSearching && response && (
                 <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4">
                    <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
                      <MessageSquare size={16} />
                      Ask Follow up
                    </button>
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
                      <Zap size={16} />
                      Trigger Action in BizOS
                    </button>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Trial Banner */}
      <div className="mt-24 text-center">
        <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em] mb-4">Powered by Neural Core v2.2</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Experimental Trial</span>
        </div>
      </div>
    </div>
  );
}
