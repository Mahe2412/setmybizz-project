import { useState, useCallback, useRef, useEffect } from 'react';
import { WebSocketService } from '../lib/gemini-live/WebSocketService';

/**
 * useGeminiLive Hook
 * React interface for Gemini Live bidirectional voice.
 */
export const useGeminiLive = (apiKey: string, onToolCall?: (fn: string, args: any) => Promise<any>) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const serviceRef = useRef<WebSocketService | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const stopRecording = useCallback(() => {
    audioContextRef.current?.close();
  }, []);

  const startRecording = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContextRef.current = new AudioContext({ sampleRate: 16000 });
    const source = audioContextRef.current.createMediaStreamSource(stream);
    const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);

    source.connect(processor);
    processor.connect(audioContextRef.current.destination);

    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      // Convert Float32 to Int16
      const pcmData = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
      }
      // Base64 encode and send
      const base64 = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
      serviceRef.current?.sendAudio(base64);
    };
  }, []);

  const connect = useCallback(async () => {
    if (!serviceRef.current) {
      serviceRef.current = new WebSocketService(apiKey, onToolCall);
    }
    await serviceRef.current.connect();
    setIsConnected(true);
    startRecording();
  }, [apiKey, onToolCall, startRecording]);

  const disconnect = useCallback(() => {
    serviceRef.current?.disconnect();
    stopRecording();
    setIsConnected(false);
  }, [stopRecording]);

  // Listen for interruptions (e.g., if user speaks while AI is talking)
  // This would be triggered by a VAD (Voice Activity Detection) logic
  const interrupt = () => {
    serviceRef.current?.clearAudioQueue();
  };

  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return {
    connect,
    disconnect,
    isConnected,
    isSpeaking,
    interrupt
  };
};
