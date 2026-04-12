"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceBuilderStudio({ onClose, context }: { onClose: () => void, context: any }) {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [history, setHistory] = useState<{role: string, text: string}[]>([]);
    const [code, setCode] = useState<string>('<html><body class="bg-slate-50 flex items-center justify-center h-screen"><h1 class="text-2xl text-slate-400 font-sans">Awaiting Voice Instructions...</h1></body></html>');
    const [isThinking, setIsThinking] = useState(false);
    
    const recognitionRef = useRef<any>(null);

    // Voice Synthesis
    const speak = (text: string) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith('en-IN') || v.name.includes('Neural')) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;
        
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    // Voice Recognition Setup
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = true;
                recognition.lang = 'en-IN'; // Default to English-India

                recognition.onresult = (event: any) => {
                    let text = '';
                    let isFinal = false;
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        text += event.results[i][0].transcript;
                        if (event.results[i].isFinal) isFinal = true;
                    }
                    setTranscript(text);

                    if (isFinal) {
                        setIsRecording(false);
                        handleVoiceSubmit(text);
                    }
                };

                recognition.onerror = () => setIsRecording(false);
                recognition.onend = () => setIsRecording(false);
                recognitionRef.current = recognition;
            }
        }
    }, [code]);

    const toggleVoice = () => {
        if (!recognitionRef.current) return alert("Browser does not support voice recognition.");
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            setTranscript('');
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const handleVoiceSubmit = async (text: string) => {
        if (!text.trim()) return;
        setHistory(prev => [...prev, { role: 'user', text }]);
        setIsThinking(true);
        setTranscript('');

        try {
            const res = await fetch('/api/voice-builder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: text, 
                    history, 
                    context,
                    currentCode: code
                })
            });
            const data = await res.json();
            
            if (data.reply) {
                speak(data.reply);
                setHistory(prev => [...prev, { role: 'ai', text: data.reply }]);
            }
            if (data.code && data.code.includes('<html')) {
                setCode(data.code);
            }
        } catch (e) {
            console.error("Voice Builder Error", e);
            speak("Sorry, I encountered an error connecting to the grid.");
        } finally {
            setIsThinking(false);
        }
    };

    // Initial greeting
    useEffect(() => {
        setTimeout(() => {
            const greeting = `Welcome to the Live Voice Studio. I am Arkle. Tell me about your business idea, and I will build your website right here.`;
            speak(greeting);
            setHistory([{ role: 'ai', text: greeting }]);
        }, 1000);
    }, []);

    return (
        <div className="fixed inset-0 z-[200] bg-black flex overflow-hidden font-sans animate-in fade-in">
            {/* Left Box: Live Website Preview */}
            <div className="flex-1 bg-white relative">
                <iframe 
                    srcDoc={code}
                    className="w-full h-full border-none"
                    title="Live Builder Output"
                />
                
                {/* Floating controls for preview */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-900/80 backdrop-blur-md text-white rounded-full text-sm font-bold flex items-center gap-2 hover:bg-black transition">
                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        Exit Studio
                    </button>
                    <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-md text-white rounded-full text-sm font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        Live Preview rendering
                    </div>
                </div>

                {isThinking && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
                        <div className="flex flex-col items-center">
                            <span className="material-symbols-outlined text-[40px] text-blue-600 animate-spin mb-2">settings</span>
                            <p className="text-slate-800 font-bold bg-white px-4 py-2 rounded-full shadow-lg">Arkle is coding...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Box: Arkle Voice Panel */}
            <div className="w-[400px] border-l border-slate-800 bg-slate-900 flex flex-col relative z-20">
                <div className="p-6 pb-0 flex-1 overflow-y-auto custom-scrollbar flex flex-col justify-end">
                    <div className="space-y-4 pb-10">
                        {history.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed ${
                                    msg.role === 'user' 
                                    ? 'bg-blue-600 text-white rounded-br-sm' 
                                    : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        
                        {transcript && (
                            <div className="flex justify-end">
                                <div className="max-w-[85%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed bg-blue-600/50 text-white rounded-br-sm animate-pulse">
                                    {transcript}
                                </div>
                            </div>
                        )}
                        <div className="h-4"></div>
                    </div>
                </div>

                {/* The Orb Area */}
                <div className="h-[250px] shrink-0 bg-slate-950 rounded-t-[40px] flex items-center justify-center border-t border-slate-800/50 shadow-[0_-20px_50px_rgba(0,0,0,0.3)] relative">
                     <button 
                         onClick={toggleVoice}
                         className="relative group focus:outline-none"
                     >
                         {/* Outer Glow */}
                         <div className={`absolute inset-0 rounded-full blur-[40px] transition-all duration-700 ${
                             isRecording ? 'bg-blue-500 scale-150 opacity-50 animate-pulse' : 
                             isThinking ? 'bg-purple-500 scale-125 opacity-40 animate-spin' : 
                             'bg-emerald-500 scale-100 opacity-20 group-hover:opacity-40'
                         }`}></div>
                         
                         {/* Core Orb */}
                         <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center relative z-10 transition-all duration-500 border-2 shadow-2xl ${
                             isRecording ? 'bg-gradient-to-tr from-blue-600 to-cyan-400 border-blue-300 scale-110 shadow-blue-500/50' : 
                             isThinking ? 'bg-gradient-to-tr from-purple-600 to-indigo-500 border-purple-300 scale-95 shadow-purple-500/50' : 
                             'bg-gradient-to-tr from-emerald-500 to-teal-400 border-emerald-300 hover:scale-105 shadow-emerald-500/30'
                         }`}>
                             <span className="material-symbols-outlined text-white text-[40px] drop-shadow-md">
                                 {isRecording ? 'graphic_eq' : isThinking ? 'psychology' : 'mic'}
                             </span>
                         </div>
                     </button>
                     
                     <p className="absolute bottom-6 text-[#676879] text-[11px] font-bold uppercase tracking-widest text-center w-full">
                         {isRecording ? "Listening..." : isThinking ? "Building UI..." : "Tap to speak to Arkle"}
                     </p>
                </div>
            </div>
        </div>
    );
}
