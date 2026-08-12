import { NextResponse } from 'next/server';
import { getSession } from "@/lib/billease/session";

/**
 * 🎙️ Arkle Voice Synthesis API
 * Converts agent text responses to natural Telugu/Tenglish speech via ElevenLabs.
 * Each sub-agent has its own dedicated voice character.
 */

// ─── Agent Voice Map ──────────────────────────────────────────────────────────
// ElevenLabs voice IDs chosen for Indian English / Tenglish naturalness
const AGENT_VOICES: Record<string, string> = {
  omni:    '9BWtsMINqrJLrRacOk9x', // Aria  - authoritative, clear (CEO voice)
  sales:   'TX3LPaxmHKxFdv7VOQHJ', // Liam  - confident, energetic (Sales voice)
  support: 'EXAVITQu4vr4xnSDxMaL', // Bella - warm, empathetic (Support voice)
  finance: 'pNInz6obpgDQGcFmaJgB', // Adam  - professional, firm (Finance voice)
  voice:   'N2lVS1w4EtoT3dr4eOWO', // Callum - clear, natural (Voice Agent)
};

// ElevenLabs model optimised for Indian English / multilingual (handles Tenglish best)
const VOICE_MODEL = 'eleven_multilingual_v2';

export async function POST(req: Request) {
  try {
    // ── Auth Guard ──────────────────────────────────────────────────────────
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY;
    if (!ELEVEN_KEY) {
      return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 500 });
    }

    const { text, agentId = 'omni' } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    const voiceId = AGENT_VOICES[agentId] || AGENT_VOICES.omni;

    // ── Call ElevenLabs TTS ──────────────────────────────────────────────────
    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVEN_KEY,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: text.slice(0, 1000), // safety limit
          model_id: VOICE_MODEL,
          voice_settings: {
            stability: 0.55,          // slight naturalness variation
            similarity_boost: 0.80,   // stay true to the voice character
            style: 0.25,              // expressive but professional
            use_speaker_boost: true,  // clarity for phone-call style
          },
        }),
      }
    );

    if (!elevenRes.ok) {
      const errText = await elevenRes.text();
      console.error('[ElevenLabs Error]:', errText);
      return NextResponse.json({ error: 'Voice synthesis failed', detail: errText }, { status: 502 });
    }

    // ── Stream audio back to client ──────────────────────────────────────────
    const audioBuffer = await elevenRes.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'no-store',
      },
    });

  } catch (error: any) {
    console.error('[Voice Synthesize Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
