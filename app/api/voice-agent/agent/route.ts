import { NextResponse } from 'next/server';
import { prisma } from '@billease/db';

// ─── GET: Get greeting audio for agent startup ────────────────────────────────
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId');

    if (!agentId) return NextResponse.json({ error: 'agentId required' }, { status: 400 });

    const agent = await prisma.voiceAgent.findUnique({ where: { id: agentId } });
    if (!agent) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const greeting = `Hello! I'm ${agent.name}, your AI assistant from ${agent.name}'s team. How can I help you today?`;

    const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY;
    if (!ELEVEN_KEY) return NextResponse.json({ greeting, audioBase64: null });

    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${agent.voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVEN_KEY,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: greeting,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
        }),
      }
    );

    if (!elevenRes.ok) return NextResponse.json({ greeting, audioBase64: null });

    const audioBuffer = await elevenRes.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({ greeting, audioBase64, agent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── POST: Get recent calls for an agent ──────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { agentId, limit = 20 } = await req.json();
    const calls = await prisma.voiceCall.findMany({
      where: { agentId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return NextResponse.json({ calls });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
