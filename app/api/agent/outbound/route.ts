/**
 * 📞 OUTBOUND CALL TRIGGER API
 * 
 * Triggers an outbound call to a customer.
 * Can be triggered:
 *   - Manually by user clicking "Call" in the UI
 *   - Automatically when a new CRM lead arrives (webhook)
 *   - From a bulk campaign
 * 
 * POST /api/agent/outbound
 * Body: { agentId, customerPhone, customerName, reason, businessId }
 */

import { NextResponse } from 'next/server';
import { prisma } from '@billease/db';
import { getSession } from '@/lib/billease/session';
import { AgentOrchestrator, synthesizeVoice } from '@/lib/agent-core/AgentOrchestrator';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const {
      agentId,
      customerPhone,
      customerName,
      reason = 'follow_up',
      businessId: reqBusinessId,
    } = await req.json();

    if (!agentId || !customerPhone) {
      return NextResponse.json({ error: 'agentId and customerPhone required' }, { status: 400 });
    }

    const businessId = reqBusinessId || session?.user?.businessId;

    // Load agent
    const agent = await prisma.voiceAgent.findUnique({
      where: { id: agentId },
      include: { business: { select: { name: true } } },
    });

    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });

    // Check if agent has a real phone number for Twilio outbound
    const hasTwilio = !!process.env.TWILIO_ACCOUNT_SID;

    if (hasTwilio && agent.phoneNumber) {
      // ── REAL PHONE CALL via Twilio ──────────────────────────────────────
      // Dynamic import to avoid build error if twilio package not installed yet
      let twilioClient: any;
      try {
        const twilio = await import('twilio').catch(() => null);
        if (!twilio) throw new Error('Twilio not installed. Run: npm install twilio');
        twilioClient = twilio.default(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      } catch {
        return NextResponse.json({ error: 'Twilio not configured. Use browser mode.' }, { status: 501 });
      }
      const client = twilioClient;
      
      // Webhook URL that Twilio will hit when call connects
      const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/agent/twilio/voice?agentId=${agentId}&customerPhone=${customerPhone}`;
      
      const call = await client.calls.create({
        url: webhookUrl,
        to: customerPhone,
        from: agent.phoneNumber,
        statusCallback: `${process.env.NEXT_PUBLIC_APP_URL}/api/agent/twilio/status`,
        statusCallbackMethod: 'POST',
      });

      // Create call record
      const callRecord = await prisma.voiceCall.create({
        data: {
          agentId,
          direction: 'outbound',
          callerPhone: customerPhone,
          callerName: customerName,
          status: 'ringing',
          channel: 'voice_outbound',
          externalCallId: call.sid,
        },
      });

      return NextResponse.json({
        success: true,
        callId: callRecord.id,
        externalCallId: call.sid,
        mode: 'twilio_realcall',
        message: `Calling ${customerName || customerPhone} via real phone...`,
      });

    } else {
      // ── BROWSER-BASED SIMULATION ─────────────────────────────────────────
      // For demo / testing without real phone numbers
      
      const agentConfig = AgentOrchestrator.buildConfig(
        { ...agent, businessName: agent.business?.name },
        'voice_outbound'
      );

      const orchestrator = new AgentOrchestrator(agentConfig, {
        businessId,
        agentId: agent.id,
        callerPhone: customerPhone,
        callerName: customerName,
      });

      const greeting = await orchestrator.getOpeningGreeting('outbound', customerName);
      const audioBase64 = await synthesizeVoice(greeting, agent.voiceId || undefined);

      // Create call record
      const callRecord = await prisma.voiceCall.create({
        data: {
          agentId,
          direction: 'outbound',
          callerPhone: customerPhone,
          callerName: customerName,
          status: 'connected',
          channel: 'voice_outbound',
          transcript: JSON.stringify([
            { role: 'agent', content: greeting, timestamp: Date.now() }
          ]),
        },
      });

      await prisma.voiceAgent.update({
        where: { id: agentId },
        data: { totalCalls: { increment: 1 } },
      });

      return NextResponse.json({
        success: true,
        callId: callRecord.id,
        mode: 'browser_simulation',
        greeting,
        audioBase64,
        agentName: agent.name,
        message: `Outbound call initiated to ${customerName || customerPhone}`,
      });
    }

  } catch (error: any) {
    console.error('[Outbound Call Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── GET: List recent outbound calls ────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId');

    const calls = await prisma.voiceCall.findMany({
      where: {
        direction: 'outbound',
        ...(agentId ? { agentId } : {}),
        agent: { businessId: session?.user?.businessId },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        callerPhone: true,
        callerName: true,
        status: true,
        outcome: true,
        summary: true,
        sentiment: true,
        createdAt: true,
        endedAt: true,
        agent: { select: { name: true, role: true } },
      },
    });

    return NextResponse.json({ calls });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
