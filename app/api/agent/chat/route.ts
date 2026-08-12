/**
 * 💬 CHAT AGENT API
 * 
 * Handles text-based agent interactions:
 * - Web chat widget (embedded on business website)
 * - WhatsApp incoming message webhook
 * - Internal BizDesk chat
 * 
 * POST /api/agent/chat
 * Body: { agentId, message, channel, sessionId, senderPhone, senderName }
 */

import { NextResponse } from 'next/server';
import { prisma } from '@billease/db';
import { getSession } from '@/lib/billease/session';
import { AgentOrchestrator } from '@/lib/agent-core/AgentOrchestrator';
import { ConversationMessage } from '@/lib/agent-core/AgentBrain';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const {
      agentId,
      message,
      channel = 'chat_web',
      sessionId,
      senderPhone,
      senderName,
      history = [],
    } = await req.json();

    if (!agentId || !message) {
      return NextResponse.json({ error: 'agentId and message required' }, { status: 400 });
    }

    // Load agent
    const agent = await prisma.voiceAgent.findUnique({
      where: { id: agentId },
      include: { business: { select: { id: true, name: true } } },
    });

    if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 });

    const businessId = agent.businessId || session?.user?.businessId;

    // ── Load or create chat session ─────────────────────────────────────────
    let chatHistory: ConversationMessage[] = history;
    let activeSessionId = sessionId;

    if (sessionId && !history.length) {
      // Load from DB if sessionId provided but no history in request
      const call = await prisma.voiceCall.findUnique({ where: { id: sessionId } });
      if (call?.transcript) {
        try {
          chatHistory = JSON.parse(call.transcript);
        } catch {}
      }
    }

    // ── Run agent turn ──────────────────────────────────────────────────────
    const agentConfig = AgentOrchestrator.buildConfig(
      { ...agent, businessName: agent.business?.name },
      channel as any
    );

    const orchestrator = new AgentOrchestrator(agentConfig, {
      businessId,
      agentId: agent.id,
      callerPhone: senderPhone,
      callerName: senderName,
    });

    const result = await orchestrator.handleTurn(message, chatHistory, {
      phone: senderPhone,
      name: senderName,
    });

    // ── Update history ──────────────────────────────────────────────────────
    const updatedHistory: ConversationMessage[] = [
      ...chatHistory,
      { role: 'user', content: message, timestamp: Date.now() },
      { role: 'agent', content: result.reply, timestamp: Date.now() },
    ];

    // ── Save to DB ──────────────────────────────────────────────────────────
    if (!activeSessionId) {
      const chatSession = await prisma.voiceCall.create({
        data: {
          agentId,
          direction: 'inbound',
          callerPhone: senderPhone,
          callerName: senderName,
          status: 'connected',
          channel,
          transcript: JSON.stringify(updatedHistory),
        },
      });
      activeSessionId = chatSession.id;
    } else {
      await prisma.voiceCall.update({
        where: { id: activeSessionId },
        data: { transcript: JSON.stringify(updatedHistory) },
      });
    }

    // ── Auto-send WhatsApp if channel is WhatsApp ───────────────────────────
    if (channel === 'chat_whatsapp' && senderPhone) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/whatsapp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: senderPhone,
          message: result.reply,
          businessId,
        }),
      }).catch(err => console.warn('[WhatsApp Send Error]', err));
    }

    return NextResponse.json({
      reply: result.reply,
      sessionId: activeSessionId,
      agentName: agent.name,
      intent: result.intent,
      toolsExecuted: result.toolsExecuted,
      suggestedActions: result.suggestedActions,
      history: updatedHistory,
    });

  } catch (error: any) {
    console.error('[Chat Agent Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── WhatsApp Webhook (Meta API) ─────────────────────────────────────────────
export async function GET(req: Request) {
  // WhatsApp webhook verification
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return new Response('Forbidden', { status: 403 });
}
