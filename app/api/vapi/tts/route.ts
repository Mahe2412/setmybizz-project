/**
 * /api/vapi/tts
 * 
 * Custom TTS Proxy for Vapi → Sarvam AI
 * 
 * Vapi sends text to this endpoint, we return audio from Sarvam.
 * This gives us native Telugu/Hindi voice in Vapi calls.
 * 
 * Vapi custom-voice format: POST with { text, voice }
 * We return: audio/wav or audio/mp3
 */

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = body.text || body.message || '';
    const language = body.language || 'te-IN';

    if (!text) {
      return new NextResponse(null, { status: 400 });
    }

    const SARVAM_KEY = process.env.SARVAM_API_KEY;

    if (!SARVAM_KEY) {
      return NextResponse.json({ error: 'Sarvam API key not configured' }, { status: 500 });
    }

    // Call Sarvam TTS
    const sarvamRes = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'api-subscription-key': SARVAM_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: [text.slice(0, 500)],
        target_language_code: language,
        speaker: 'meera',       // Natural Telugu female voice
        pitch: 0,
        pace: 1.0,              // Normal speed for natural feel
        loudness: 1.5,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model: 'bulbul:v1',    // Sarvam's best Indian language model
      }),
    });

    if (!sarvamRes.ok) {
      const errText = await sarvamRes.text();
      console.error('[Sarvam TTS Error]', errText);
      return NextResponse.json({ error: 'Sarvam TTS failed' }, { status: 502 });
    }

    const sarvamData = await sarvamRes.json();
    
    // Sarvam returns base64 audio
    if (sarvamData.audios && sarvamData.audios[0]) {
      const audioBase64 = sarvamData.audios[0];
      const audioBuffer = Buffer.from(audioBase64, 'base64');
      
      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/wav',
          'Content-Length': audioBuffer.length.toString(),
        },
      });
    }

    return NextResponse.json({ error: 'No audio returned from Sarvam' }, { status: 502 });

  } catch (error: any) {
    console.error('[TTS Proxy Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: Health check
export async function GET() {
  return NextResponse.json({
    status: 'active',
    provider: 'Sarvam AI (Bulbul v1)',
    voices: ['meera (te-IN)', 'kavya (hi-IN)', 'neel (en-IN)'],
  });
}
