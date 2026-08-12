import { NextResponse } from 'next/server';
import { prisma } from '@billease/db';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * 🎙️ Voice Agent Call Engine
 * 
 * This is the core real-time conversation engine:
 * 1. Client sends: agentId + userSpeech (text from speech-to-text)
 * 2. Server: loads agent's systemPrompt + call history
 * 3. Server: calls GPT/Gemini to generate a short reply
 * 4. Server: calls ElevenLabs to convert reply to audio
 * 5. Server: returns { replyText, audioBase64, callId }
 * 6. Client plays the audio, continues conversation loop
 */

export async function POST(req: Request) {
  try {
    const { agentId, userSpeech, callId, history = [], callerName } = await req.json();

    if (!agentId || !userSpeech) {
      return NextResponse.json({ error: 'agentId and userSpeech required' }, { status: 400 });
    }

    // ── Load agent from DB ──────────────────────────────────────────────────
    const agent = await prisma.voiceAgent.findUnique({ where: { id: agentId } });
    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });

    // ── Generate AI Reply (Gemini) ──────────────────────────────────────────
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const conversationHistory = history.map((h: any) => 
      `${h.sender === 'agent' ? agent.name : 'Customer'}: ${h.text}`
    ).join('\n');

    const prompt = `${agent.systemPrompt || `You are ${agent.name}, a helpful AI voice agent.`}

CONVERSATION SO FAR:
${conversationHistory || '(This is the start of the call)'}

Customer just said: "${userSpeech}"

Your reply (STRICT RULES - THIS IS A PHONE CALL):
- Maximum 2-3 sentences ONLY
- Be natural, warm, conversational
- In ${agent.language} (mix Telugu/English naturally)
- DO NOT use bullet points or lists
- If customer wants to buy/book/pay, say you'll send a WhatsApp confirmation
- Reply ONLY with the spoken words, nothing else`;

    const result = await model.generateContent(prompt);
    const replyText = result.response.text().trim();

    // ── Convert to Speech (ElevenLabs) ─────────────────────────────────────
    const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY;
    let audioBase64: string | null = null;

    if (ELEVEN_KEY) {
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
            text: replyText.slice(0, 500),
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.8,
              style: 0.3,
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (elevenRes.ok) {
        const audioBuffer = await elevenRes.arrayBuffer();
        audioBase64 = Buffer.from(audioBuffer).toString('base64');
      }
    }

    // ── Update or Create Call Record ──────────────────────────────────────
    let activeCallId = callId;
    const updatedHistory = [...history, { sender: 'user', text: userSpeech }, { sender: 'agent', text: replyText }];

    if (!activeCallId) {
      // First turn — create the call record
      const call = await prisma.voiceCall.create({
        data: {
          agentId,
          direction: 'browser',
          callerName,
          status: 'connected',
          transcript: JSON.stringify(updatedHistory),
        },
      });
      activeCallId = call.id;

      // Increment agent call count
      await prisma.voiceAgent.update({
        where: { id: agentId },
        data: { totalCalls: { increment: 1 } },
      });
    } else {
      // Ongoing call — update transcript
      await prisma.voiceCall.update({
        where: { id: activeCallId },
        data: { transcript: JSON.stringify(updatedHistory) },
      });
    }

    return NextResponse.json({
      replyText,
      audioBase64,
      callId: activeCallId,
      agentName: agent.name,
    });

  } catch (error: any) {
    console.error('[Call Engine Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
