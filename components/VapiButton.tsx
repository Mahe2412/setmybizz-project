'use client';
import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { Mic, Square, Loader2 } from 'lucide-react';

const HARDCODED_PUBLIC_KEY = '2a108c49-2447-4bbb-be41-fffa7b8d9cab';
const HARDCODED_ASSISTANT_ID = 'd9f38a6e-e6d7-4608-abfe-65c392577e4d';

interface VapiButtonProps {
  assistantId?: string; // Optional: ID of the assistant created in Vapi Dashboard
  className?: string;
}

export default function VapiButton({ assistantId, className }: VapiButtonProps) {
  const [callStatus, setCallStatus] = useState<'inactive' | 'loading' | 'active'>('inactive');
  const [volumeLevel, setVolumeLevel] = useState(0);
  const vapiRef = useRef<Vapi | null>(null);

  useEffect(() => {
    // Safely initialize Vapi on client side only
    const apiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || HARDCODED_PUBLIC_KEY;
    const vapi = new Vapi(apiKey);
    vapiRef.current = vapi;

    vapi.on('call-start', () => {
      setCallStatus('active');
    });

    vapi.on('call-end', () => {
      setCallStatus('inactive');
      setVolumeLevel(0);
    });

    vapi.on('volume-level', (level) => {
      setVolumeLevel(level);
    });

    vapi.on('error', (e) => {
      console.error('Vapi error:', e);
      setCallStatus('inactive');
      alert('Failed to connect to Voice Agent. Please ensure microphone permissions are granted.');
    });

    return () => {
      vapi.removeAllListeners();
      vapiRef.current = null;
    };
  }, []);

  const toggleCall = async () => {
    if (!vapiRef.current) return;

    if (callStatus === 'active') {
      vapiRef.current.stop();
      setCallStatus('inactive');
    } else {
      setCallStatus('loading');
      try {
        const targetAssistantId = assistantId || process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || HARDCODED_ASSISTANT_ID;
        await vapiRef.current.start(targetAssistantId);
      } catch (error) {
        console.error('Error starting Vapi call:', error);
        setCallStatus('inactive');
        alert('Voice agent connection failed. Please check microphone permissions.');
      }
    }
  };

  return (
    <button
      onClick={toggleCall}
      disabled={callStatus === 'loading'}
      className={`relative flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all shadow-lg overflow-hidden ${
        callStatus === 'active' 
          ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' 
          : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
      } ${className}`}
    >
      {/* Background Pulse Effect when Active */}
      {callStatus === 'active' && (
        <div 
          className="absolute inset-0 bg-white/20 transition-transform duration-75"
          style={{ transform: `scale(${1 + volumeLevel * 0.5})` }}
        />
      )}
      
      <span className="relative z-10 flex items-center gap-2">
        {callStatus === 'loading' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : callStatus === 'active' ? (
          <Square className="w-5 h-5 fill-current" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
        {callStatus === 'loading' 
          ? 'Connecting...' 
          : callStatus === 'active' 
            ? 'End Call' 
            : 'Talk to Arkle'}
      </span>
    </button>
  );
}
