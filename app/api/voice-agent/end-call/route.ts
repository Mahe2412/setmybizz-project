import { NextResponse } from 'next/server';
import { prisma } from '@billease/db';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * 📋 Call End Handler
 * Called when user clicks "End Call" in the browser.
 * 1. Marks call as completed
 * 2. Generates AI summary + sentiment + outcome
 * 3. Optionally creates/updates CRM lead record
 * 4. Returns summary for UI display
 */
export async function POST(req: Request) {
  try {
    const { callId, agentId, callerName, callerPhone, durationSecs } = await req.json();

    if (!callId) return NextResponse.json({ error: 'callId required' }, { status: 400 });

    // ── Load the call record ────────────────────────────────────────────────
    const call = await prisma.voiceCall.findUnique({ where: { id: callId } });
    if (!call) return NextResponse.json({ error: 'Call not found' }, { status: 404 });

    const agent = await prisma.voiceAgent.findUnique({ where: { id: agentId || call.agentId } });
    
    const transcript = call.transcript ? JSON.parse(call.transcript) : [];
    const transcriptText = transcript.map((t: any) => 
      `${t.sender === 'agent' ? (agent?.name || 'Agent') : 'Customer'}: ${t.text}`
    ).join('\n');

    // ── Generate Summary + Sentiment + Outcome (Gemini) ─────────────────────
    let summary = 'Call completed.';
    let sentiment = 'neutral';
    let outcome = 'unknown';

    if (transcriptText.trim()) {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(`
Analyze this phone call transcript and return ONLY a valid JSON object:

TRANSCRIPT:
${transcriptText}

Return JSON:
{
  "summary": "2-3 sentence summary of the call in English",
  "sentiment": "positive | neutral | negative",
  "outcome": "interested | not-interested | callback | converted | unknown",
  "callerNeed": "one short sentence about what the customer needed"
}

Return ONLY raw JSON, no markdown.
`);
      
      try {
        const text = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(text);
        summary = parsed.summary || summary;
        sentiment = parsed.sentiment || sentiment;
        outcome = parsed.outcome || outcome;
      } catch {}
    }

    // ── Update call record ────────────────────────────────────────────────
    const updatedCall = await prisma.voiceCall.update({
      where: { id: callId },
      data: {
        status: 'completed',
        endedAt: new Date(),
        durationSecs: durationSecs || 0,
        summary,
        sentiment,
        outcome,
        callerName: callerName || call.callerName,
        toPhone: callerPhone,
      },
    });

    // ── Update agent total minutes ─────────────────────────────────────────
    if (agentId || call.agentId) {
      await prisma.voiceAgent.update({
        where: { id: agentId || call.agentId },
        data: { totalMinutes: { increment: (durationSecs || 0) / 60 } },
      });
    }

    // ── Create CRM Lead if interested ─────────────────────────────────────
    let crmLead = null;
    if ((outcome === 'interested' || outcome === 'converted') && callerPhone) {
      const agentData = agent;
      crmLead = await prisma.crmLead.create({
        data: {
          businessId: agentData?.businessId,
          name: callerName || 'Voice Call Lead',
          phone: callerPhone,
          category: 'voice-lead',
          stage: outcome === 'converted' ? 'Won' : 'Contacted',
          priority: 'high',
          source: 'voice-agent',
          note: `[Auto from Voice Agent ${agentData?.name}] ${summary}`,
          score: outcome === 'converted' ? 80 : 50,
        },
      });

      // Link CRM lead to call
      await prisma.voiceCall.update({
        where: { id: callId },
        data: { crmLeadId: crmLead.id },
      });
    }

    return NextResponse.json({
      call: updatedCall,
      summary,
      sentiment,
      outcome,
      crmLeadCreated: !!crmLead,
    });

  } catch (error: any) {
    console.error('[Call End Handler]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
