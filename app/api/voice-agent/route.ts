import { NextResponse } from 'next/server';
import { prisma } from '@billease/db';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createVapiAssistant } from '@/lib/agent-core/ArkleVoiceAgent';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ─── Generate a smart system prompt from business description ─────────────────
async function generateSystemPrompt(params: {
  agentName: string;
  businessName: string;
  businessDescription: string;
  faqKnowledge: string;
  role: string;
  language: string;
}): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(`
You are building a system prompt for an AI voice agent named "${params.agentName}" who works for "${params.businessName}".

Role: ${params.role}
Language: ${params.language} (mix of Telugu, English — be natural and warm)
Business Description: ${params.businessDescription}
FAQ Knowledge: ${params.faqKnowledge}

Generate a comprehensive system prompt for this voice agent. The agent must:
1. Always introduce itself as "${params.agentName}" from "${params.businessName}"
2. Speak in ${params.language} (natural, conversational — like a warm local sales rep)
3. Keep replies VERY SHORT (2-3 sentences max) because this is a phone call
4. Handle the role of: ${params.role}
5. Know all the FAQ information provided
6. Be polite, professional, and persistent but never pushy
7. If asked something outside its knowledge, say "Let me check with our team and get back to you"
8. Always end conversations by asking "Anything else I can help you with?"

Write ONLY the system prompt text, no commentary.
`);
  return result.response.text().trim();
}

// ─── GET: List all voice agents for a business ───────────────────────────────
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId');

    const agents = await prisma.voiceAgent.findMany({
      where: businessId ? { businessId } : {},
      include: {
        calls: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ agents });
  } catch (error: any) {
    console.error('[VoiceAgent GET]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── POST: Create & train a new voice agent ───────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      businessId,
      businessName,
      ownerName,
      ownerPhone,
      agentName = 'Swara',
      role = 'sales',
      businessDescription = '',
      faqKnowledge = '',
      language = 'tenglish',
      voiceId = 'N2lVS1w4EtoT3dr4eOWO',
    } = body;

    // Generate AI system prompt
    const systemPrompt = await generateSystemPrompt({
      agentName,
      businessName: businessName || 'the business',
      businessDescription,
      faqKnowledge,
      role,
      language,
    });

    // Create assistant in Vapi if key is present
    let vapiAssistantId = undefined;
    try {
      const vapiRes = await createVapiAssistant({
        businessContext: {
          businessName: businessName || 'Our Business',
          ownerName: ownerName || 'the Owner',
          products: faqKnowledge || businessDescription,
          phone: ownerPhone || '',
          customInstructions: systemPrompt,
        },
        assistantName: `${agentName} (${role})`,
        language: language === 'tenglish' ? 'te-IN' : language === 'hindi' ? 'hi-IN' : language === 'tamil' ? 'ta-IN' : 'en-IN',
      });
      vapiAssistantId = vapiRes?.id;
    } catch (e) {
      console.warn('Vapi assistant creation failed or skipped:', e);
    }

    const agent = await prisma.voiceAgent.create({
      data: {
        id: vapiAssistantId, // Use Vapi ID as database primary key if registered successfully
        businessId,
        name: agentName,
        role,
        ownerName,
        ownerPhone,
        businessDescription,
        faqKnowledge,
        systemPrompt,
        language,
        voiceId: vapiAssistantId || voiceId,
        status: 'active',
      },
    });

    return NextResponse.json({ agent, systemPrompt });
  } catch (error: any) {
    console.error('[VoiceAgent POST]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── PATCH: Update agent knowledge / status ───────────────────────────────────
export async function PATCH(req: Request) {
  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    // If description/FAQ changed, regenerate system prompt
    if (updates.businessDescription || updates.faqKnowledge) {
      const existing = await prisma.voiceAgent.findUnique({ where: { id } });
      if (existing) {
        updates.systemPrompt = await generateSystemPrompt({
          agentName: existing.name,
          businessName: updates.businessName || 'the business',
          businessDescription: updates.businessDescription || existing.businessDescription || '',
          faqKnowledge: updates.faqKnowledge || existing.faqKnowledge || '',
          role: existing.role,
          language: existing.language,
        });
      }
    }

    const agent = await prisma.voiceAgent.update({ where: { id }, data: updates });
    return NextResponse.json({ agent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── DELETE: Remove an agent ──────────────────────────────────────────────────
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.voiceAgent.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
