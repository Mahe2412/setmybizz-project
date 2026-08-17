/**
 * 🧠 UNIFIED AGENT TURN API
 * 
 * Single endpoint for ALL agent interactions:
 * - Voice call turns (browser & phone)
 * - Chat messages (web & WhatsApp)
 * - Both inbound & outbound
 * 
 * POST /api/agent/turn
 * Body: {
 *   agentId: string,
 *   userInput: string,
 *   channel: 'voice_inbound' | 'voice_outbound' | 'chat_web' | 'chat_whatsapp',
 *   callId?: string,
 *   history?: ConversationMessage[],
 *   callerPhone?: string,
 *   callerName?: string,
 * }
 */

import { NextResponse } from 'next/server';
import { prisma } from '@billease/db';
import { getSession } from '@/lib/billease/session';
import { AgentOrchestrator, synthesizeVoice } from '@/lib/agent-core/AgentOrchestrator';
import { ToolContext } from '@/lib/agent-core/AgentToolExecutor';
import { ConversationMessage } from '@/lib/agent-core/AgentBrain';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const {
      agentId,
      userInput,
      channel = 'voice_inbound',
      callId,
      history = [],
      callerPhone,
      callerName,
    } = await req.json();

    if (!agentId || !userInput) {
      return NextResponse.json({ error: 'agentId and userInput are required' }, { status: 400 });
    }

    // ── Load agent from DB ──────────────────────────────────────────────────
    const agent = await prisma.voiceAgent.findUnique({
      where: { id: agentId },
      include: { business: { select: { id: true, name: true } } },
    });

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const businessId = agent.businessId || session?.user?.businessId;

    // ── Build orchestrator ──────────────────────────────────────────────────
    const agentConfig = AgentOrchestrator.buildConfig(
      { ...agent, businessName: agent.business?.name || 'Our Business' },
      channel
    );

    const toolContext: ToolContext = {
      businessId,
      agentId: agent.id,
      callerPhone,
      callerName,
    };

    const orchestrator = new AgentOrchestrator(agentConfig, toolContext);

    // ── Run conversation turn ───────────────────────────────────────────────
    const result = await orchestrator.handleTurn(userInput, history, { phone: callerPhone, name: callerName });

    // ── Generate voice audio (for voice channels) ───────────────────────────
    let audioBase64: string | null = null;
    if (channel.startsWith('voice')) {
      audioBase64 = await synthesizeVoice(result.audioText, agent.voiceId || undefined, agent.language);
    }

    // ── Update conversation history ─────────────────────────────────────────
    const updatedHistory: ConversationMessage[] = [
      ...history,
      { role: 'user', content: userInput, timestamp: Date.now() },
      { role: 'agent', content: result.reply, timestamp: Date.now() },
    ];

    // ── Save/update call record ─────────────────────────────────────────────
    let activeCallId = callId;
    
    if (!activeCallId) {
      // First turn — create call record
      const call = await prisma.voiceCall.create({
        data: {
          agentId,
          direction: channel.includes('outbound') ? 'outbound' : 'inbound',
          callerPhone,
          callerName,
          status: 'connected',
          channel,
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
      // Ongoing — update transcript
      await prisma.voiceCall.update({
        where: { id: activeCallId },
        data: { transcript: JSON.stringify(updatedHistory) },
      });
    }

    // ── Handle call end ─────────────────────────────────────────────────────
    if (result.shouldEndCall && result.callSummary && activeCallId) {
      await prisma.voiceCall.update({
        where: { id: activeCallId },
        data: {
          status: 'completed',
          outcome: result.callSummary.outcome,
          summary: result.callSummary.summary,
          sentiment: result.callSummary.sentiment,
          endedAt: new Date(),
        },
      });

      // Auto-update CRM if positive outcome
      if (['ordered', 'interested'].includes(result.callSummary.outcome) && callerPhone) {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/crm/leads`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: callerPhone,
            stage: result.callSummary.outcome === 'ordered' ? 'won' : 'qualified',
            notes: result.callSummary.summary,
            businessId,
          }),
        }).catch(() => {});
      }
    }

    return NextResponse.json({
      // Core response
      reply: result.reply,
      audioBase64,
      callId: activeCallId,
      
      // Agent context
      agentName: agent.name,
      intent: result.intent,
      
      // Tools that ran
      toolsExecuted: result.toolsExecuted.map(t => ({
        tool: t.name,
        success: t.result.success,
        message: t.result.message,
      })),
      
      // Suggested actions for UI
      suggestedActions: result.suggestedActions,
      
      // Call state
      shouldEndCall: result.shouldEndCall,
      escalateToHuman: result.escalateToHuman,
      callSummary: result.callSummary,
      
      // Updated history for client to store
      history: updatedHistory,
    });

  } catch (error: any) {
    console.error('[Agent Turn Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── GET: Generate opening greeting ─────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId');
    const callType = (searchParams.get('callType') || 'inbound') as 'inbound' | 'outbound';
    const callerName = searchParams.get('callerName') || undefined;

    if (!agentId) {
      return NextResponse.json({ error: 'agentId required' }, { status: 400 });
    }

    const agent = await prisma.voiceAgent.findUnique({
      where: { id: agentId },
      include: { business: { select: { name: true } } },
    });

    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });

    const agentConfig = AgentOrchestrator.buildConfig(
      { ...agent, businessName: agent.business?.name },
      callType === 'outbound' ? 'voice_outbound' : 'voice_inbound'
    );

    const orchestrator = new AgentOrchestrator(agentConfig, {
      businessId: agent.businessId,
      agentId: agent.id,
    });

    const greeting = await orchestrator.getOpeningGreeting(callType, callerName);
    const audioBase64 = await synthesizeVoice(greeting, agent.voiceId || undefined, agent.language);

    return NextResponse.json({ greeting, audioBase64, agentName: agent.name });

  } catch (error: any) {
    console.error('[Greeting Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
