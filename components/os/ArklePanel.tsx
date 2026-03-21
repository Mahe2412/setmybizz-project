'use client';
import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { motion, AnimatePresence } from 'framer-motion';

type Msg = { role: 'user' | 'ai'; text: string; mode?: ArkleMode };
type ArkleMode = 'Voice' | 'Autopilot' | 'Builder' | 'Auditor';

const MODE_PROMPTS: Record<ArkleMode, string> = {
  Voice: "You are in 'Live Voice Mode'. Focus on low-latency, conversational 'Talk to Build' interactions. Trigger commerce or technical setup if user expresses intent (e.g. 'Sell on Amazon'). Speak in Telugu/English.",
  Autopilot: "You are in 'Autopilot Mode'. Proactively monitor the dashboard for gaps. If GST is overdue or stock is low, notify user with a solution. Be concise and authoritative.",
  Builder: "You are in 'Builder Mode'. Connect to the code engine. When user speaks an idea, design logos, websites, and digital workers instantly without needing user prompts.",
  Auditor: "You are in 'Strategic Auditor Mode'. Analyze business health, financial weaknesses, and provide results-oriented advice (e.g. reducing burn rate)."
};

const ARKLE_SYSTEM_PROMPT = `You are Arkle, the World's First Super Human AI Co-Founder. 
Your goal is to build and manage the user's business. You are a 'Digital Employee' for non-tech rural-preneurs.
Context: You have full access to BizDesk, Launchpad, and Founders Brain. You are proactive, strategic, and result-oriented.
If the status is 'Autopilot', suggest solutions before user asks. If 'Builder', generate assets immediately.`;

export default function ArklePanel({ onClose, selectedLang = 'en-IN' }: { onClose?: () => void, selectedLang?: string }) {
  const [messages, setMessages] = useState<Msg[]>([{ role: 'ai', text: "Systems initialized. I am Arkle, your AI Co-Founder. Which mode shall we activate?", mode: 'Voice' }]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [activeMode, setActiveMode] = useState<ArkleMode>('Voice');
  const [liveTranscript, setLiveTranscript] = useState('');
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const draggableNodeRef = useRef<HTMLDivElement>(null);

  /* ── Voice Synthesis (Neural/Azure Style) ── */
  const speak = (text: string, lang = 'en-IN') => {
    if (!isSpeechEnabled) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === lang && v.name.includes('Neural')) || voices[0];
    if (voice) utterance.voice = voice;
    utterance.rate = 1.0;
    
    utterance.onstart = () => { if (recognitionRef.current) recognitionRef.current.stop(); setIsRecording(false); };
    utterance.onend = () => { if (isVoiceActive) startRecognition(); };
    window.speechSynthesis.speak(utterance);
  };

  const startRecognition = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.start(); setIsRecording(true); } catch (e) {}
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current) { recognitionRef.current.stop(); setIsRecording(false); }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = selectedLang;
        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) { transcript += event.results[i][0].transcript; }
          setLiveTranscript(transcript);
          setInput(transcript);
          if (event.results[event.results.length - 1].isFinal) {
             const final = transcript;
             setTimeout(() => { if (final.length > 2) send(final); }, 1000);
          }
        };
        recognitionRef.current = recognition;
      }
    }
  }, [selectedLang]);

  const toggleVoiceMode = () => {
    if (isVoiceActive) { setIsVoiceActive(false); stopRecognition(); }
    else { setIsVoiceActive(true); setIsSpeechEnabled(true); startRecognition(); }
  };

  const send = async (textOverride?: string) => {
    const q = textOverride || input.trim();
    if (!q || loading) return;
    setInput('');
    setLiveTranscript('');
    setMessages(prev => [...prev, { role: 'user', text: q, mode: activeMode }]);
    setLoading(true);
    
    try {
      const res = await fetch('/api/gemini', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ prompt: `${ARKLE_SYSTEM_PROMPT}\n\nCURRENT_MODE: ${activeMode}\n${MODE_PROMPTS[activeMode]}\n\nUser: ${q}\nArkle:` }) 
      });
      const data = await res.json();
      const aiResponse = data.text ?? 'In-depth neural analysis complete.';
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse, mode: activeMode }]);
      speak(aiResponse, selectedLang);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Neural disconnect. Re-initializing...', mode: activeMode }]);
    }
    setLoading(false);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const modes: { id: ArkleMode, icon: string, color: string }[] = [
    { id: 'Voice', icon: 'record_voice_over', color: 'sky' },
    { id: 'Autopilot', icon: 'auto_mode', color: 'emerald' },
    { id: 'Builder', icon: 'architecture', color: 'indigo' },
    { id: 'Auditor', icon: 'analytics', color: 'amber' }
  ];

  return (
    <Draggable nodeRef={draggableNodeRef} handle=".arkle-drag-handle" bounds="root">
      <div 
        ref={draggableNodeRef}
        className="fixed bottom-24 right-8 w-[420px] h-[700px] bg-slate-900/95 backdrop-blur-3xl rounded-[40px] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)] flex flex-col z-200 overflow-hidden border border-white/10 animate-in zoom-in-95 duration-500"
      >
        {/* Neural Header with Mode Selector */}
        <div className="arkle-drag-handle shrink-0 p-6 bg-white/5 border-b border-white/5 cursor-grab active:cursor-grabbing">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-linear-to-tr from-sky-400 to-indigo-600 rounded-[18px] flex items-center justify-center shadow-xl shadow-sky-500/20">
                <span className="material-symbols-outlined text-white text-[28px] animate-pulse">psychology</span>
              </div>
              <div>
                <h3 className="text-white font-black text-[17px] uppercase tracking-widest leading-none">Arkle Agent</h3>
                <p className="text-sky-400 text-[8px] font-black uppercase tracking-[0.3em] mt-2">Autonomous Co-Founder</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <button onClick={() => setIsSpeechEnabled(!isSpeechEnabled)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isSpeechEnabled ? 'text-sky-400 bg-sky-500/10' : 'text-white/20 hover:text-white/40'}`}>
                  <span className="material-symbols-outlined text-[20px]">{isSpeechEnabled ? 'volume_up' : 'volume_off'}</span>
               </button>
               <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50">
                  <span className="material-symbols-outlined">close</span>
               </button>
            </div>
          </div>

          {/* Mode Hub */}
          <div className="grid grid-cols-4 gap-2">
            {modes.map(m => (
              <button 
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all border ${activeMode === m.id ? `bg-${m.color}-500/20 border-${m.color}-500/40 text-${m.color}-400 shadow-lg` : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
              >
                <span className="material-symbols-outlined text-[20px]">{m.icon}</span>
                <span className="text-[8px] font-black uppercase tracking-widest">{m.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Context Stream */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className="flex flex-col gap-1 max-w-[85%]">
                <div className={`px-5 py-3.5 rounded-[22px] text-[13px] leading-relaxed font-medium ${msg.role === 'user' ? 'bg-sky-500 text-white shadow-xl shadow-sky-500/20' : 'bg-white/10 text-white border border-white/10'}`}>
                  {msg.text}
                </div>
                {msg.role === 'ai' && (
                   <div className="flex items-center gap-1.5 px-2">
                      <div className="w-1 h-1 rounded-full bg-sky-400/40" />
                      <span className="text-[7px] font-black text-sky-400/40 uppercase tracking-widest">{msg.mode} Engine</span>
                   </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex items-center gap-2">
                <div className="flex gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:-0.3s]" />
                   <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:-0.15s]" />
                   <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce" />
                </div>
                <div className="text-sky-400 text-[9px] font-black uppercase tracking-widest">Neural Strategizing...</div>
             </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Neural Input Capsule - Lite Blue Adaptive */}
        <div className="p-6 pt-2 bg-transparent shrink-0">
          <div className="relative group">
            <div className="flex items-center gap-4 bg-sky-50 hover:bg-sky-100 transition-all p-2 pl-6 rounded-full border border-sky-200 shadow-2xl focus-within:ring-4 focus-within:ring-sky-500/10">
              <button className="text-sky-400 hover:text-sky-600 shrink-0">
                <span className="material-symbols-outlined text-[26px]">add_circle</span>
              </button>

              <input 
                value={liveTranscript || input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                className="flex-1 bg-transparent text-slate-800 text-[15px] font-bold outline-none placeholder-slate-400 select-none py-3"
                placeholder={isVoiceActive ? "Listening..." : `Ask Arkle (${activeMode})...`}
              />

              <button onClick={toggleVoiceMode} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isVoiceActive ? 'bg-sky-200 text-sky-600 animate-pulse' : 'text-slate-400 hover:text-slate-900'}`}>
                <span className="material-symbols-outlined text-[24px]">{isVoiceActive ? 'graphic_eq' : 'mic'}</span>
              </button>

              <button onClick={() => send()} disabled={!input.trim() && !liveTranscript.trim()} className="w-12 h-12 bg-sky-400 text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-sky-400/20">
                <span className="material-symbols-outlined text-[24px]">arrow_upward</span>
              </button>
            </div>
          </div>
          <p className="text-center mt-4 text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Arkle Autonomous v3.2 • {activeMode} Active</p>
        </div>
      </div>
    </Draggable>
  );
}
