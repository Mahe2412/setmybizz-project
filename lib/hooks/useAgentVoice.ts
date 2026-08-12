import { useCallback, useRef, useState } from 'react';

/**
 * 🎙️ useAgentVoice — React hook for ElevenLabs voice playback
 * Plays any agent message text as natural speech.
 * Handles loading state, audio queueing, and cleanup.
 */

type AgentId = 'omni' | 'sales' | 'support' | 'finance' | 'voice';
type PlayStatus = 'idle' | 'loading' | 'playing' | 'error';

export function useAgentVoice() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, PlayStatus>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopCurrent = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setPlayingId(null);
  }, []);

  const speak = useCallback(async (
    messageId: string,
    text: string,
    agentId: AgentId = 'omni'
  ) => {
    // If same message is playing, stop it
    if (playingId === messageId) {
      stopCurrent();
      setStatusMap(prev => ({ ...prev, [messageId]: 'idle' }));
      return;
    }

    // Stop any current audio
    stopCurrent();

    setPlayingId(messageId);
    setStatusMap(prev => ({ ...prev, [messageId]: 'loading' }));

    try {
      const res = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, agentId }),
      });

      if (!res.ok) {
        throw new Error('Voice synthesis failed');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onplay = () => setStatusMap(prev => ({ ...prev, [messageId]: 'playing' }));
      audio.onended = () => {
        setPlayingId(null);
        setStatusMap(prev => ({ ...prev, [messageId]: 'idle' }));
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setPlayingId(null);
        setStatusMap(prev => ({ ...prev, [messageId]: 'error' }));
        URL.revokeObjectURL(url);
      };

      await audio.play();
    } catch (err) {
      console.error('[Voice Hook Error]:', err);
      setPlayingId(null);
      setStatusMap(prev => ({ ...prev, [messageId]: 'error' }));
    }
  }, [playingId, stopCurrent]);

  const getStatus = useCallback((messageId: string): PlayStatus => {
    return statusMap[messageId] || 'idle';
  }, [statusMap]);

  return { speak, stopCurrent, playingId, getStatus };
}
