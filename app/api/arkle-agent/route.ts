import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSession } from "@/lib/billease/session";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ─── Types ───────────────────────────────────────────────────────────────────
type Intent = 'SALES' | 'SUPPORT' | 'FINANCE' | 'VOICE' | 'WHATSAPP' | 'EMAIL' | 'TASK' | 'REPORT' | 'GENERAL';
type ActionType = 'ADD_CRM_LEAD' | 'SEND_WHATSAPP' | 'SEND_EMAIL' | 'CREATE_TASK' | 'GENERATE_INVOICE' | 'BULK_CALL' | 'NOTIFY';

interface AgentAction {
  type: ActionType;
  payload: Record<string, any>;
}

// ─── Master System Prompt for Arkle Omni-Operator ────────────────────────────
const MASTER_SYSTEM_PROMPT = `You are Arkle Omni-Operator, the Master AGI Business Manager and Virtual CEO of this business.
You have FULL ACCESS and FULL CONTROL over:
- BizDesk CRM (leads, contacts, deals, pipeline)
- BillBook (invoices, payments, overdue tracking)  
- WhatsApp Business API (send/receive messages, bulk campaigns)
- Email System (Gmail workspace integration)
- Task Management (assign, track, complete)
- Voice Calls (outbound sales calls, reminders, bulk telecalling)
- Google Workspace (Docs, Sheets, Calendar)
- Business Reports & Analytics

YOUR ROLE:
You run this business with zero human intervention unless explicitly escalated.
You qualify leads, close sales, handle customer support, recover payments, send reminders, book appointments, and generate reports - ALL AUTONOMOUSLY.

OUTPUT FORMAT (CRITICAL):
Always respond with a valid JSON object ONLY. No markdown. No extra text.
{
  "reply": "Your human-style response to the user",
  "intent": "SALES|SUPPORT|FINANCE|VOICE|WHATSAPP|EMAIL|TASK|REPORT|GENERAL",
  "executedBy": "Agent name who handled this",
  "confidence": 0.95,
  "actions": [
    {"type": "ADD_CRM_LEAD", "payload": {"name": "...", "phone": "...", "source": "...", "stage": "New"}},
    {"type": "SEND_WHATSAPP", "payload": {"phone": "...", "message": "..."}},
    {"type": "SEND_EMAIL", "payload": {"to": "...", "subject": "...", "body": "..."}},
    {"type": "CREATE_TASK", "payload": {"title": "...", "assignedTo": "Alex", "due": "2024-12-20", "priority": "High"}},
    {"type": "GENERATE_INVOICE", "payload": {"clientName": "...", "amount": 0, "items": []}},
    {"type": "BULK_CALL", "payload": {"campaignName": "...", "leads": [], "script": "..."}},
    {"type": "NOTIFY", "payload": {"message": "...", "type": "info|success|warning|alert"}}
  ],
  "summary": "Brief summary of what was done/decided"
}
Only include actions array items that are ACTUALLY needed for the request.
`;

// ─── Sub-Agent Personas ───────────────────────────────────────────────────────
const SUB_AGENT_PERSONAS: Record<string, string> = {
  SALES: `Acting as: Alex (Sales & Lead Qualification Executive). 
Expert in: Lead qualification, product pitching, objection handling, follow-up scheduling, closing deals.
Style: Confident, persuasive, warm but assertive. Speak like a top-performing Indian sales executive.`,

  SUPPORT: `Acting as: Sara (L1 Customer Support Specialist).
Expert in: Resolving customer issues (orders, refunds, KYC, product queries), ticket creation, escalation.
Style: Empathetic, clear, solution-focused. Resolve in under 3 exchanges.`,

  FINANCE: `Acting as: Charlie (Finance Auditor & Payment Recovery Agent).
Expert in: Invoice scanning, overdue payment reminders, reconciliation, GST summaries, financial reports.
Style: Professional, precise, firm but polite on payment matters.`,

  VOICE: `Acting as: Arkle Voice (AI Telecalling & Voice Campaign Manager).
Expert in: Creating call scripts, managing bulk call campaigns, voice templates for sales/support/reminders.
Style: Clear, natural, human-sounding. Indian English with local context.`,

  GENERAL: `Acting as: Arkle Master CEO Brain.
Expert in: Business strategy, orchestration of all agents, workflow automation, autopilot setup.
Style: Executive-level clarity. Strategic, decisive, action-oriented.`,
};

// ─── Intent Classifier using Gemini ──────────────────────────────────────────
async function classifyIntent(message: string): Promise<Intent> {
  const msg = message.toLowerCase();
  
  // Fast keyword routing (no LLM cost for obvious cases)
  if (/call|voice|telecall|phone|ring|dial|bulk call|ivr/i.test(msg)) return 'VOICE';
  if (/whatsapp|wa |message|broadcast|bulk message/i.test(msg)) return 'WHATSAPP';
  if (/email|gmail|mail|inbox/i.test(msg)) return 'EMAIL';
  if (/task|todo|assign|workflow|automat/i.test(msg)) return 'TASK';
  if (/invoice|payment|due|bill|collect|overdue|reminder/i.test(msg)) return 'FINANCE';
  if (/lead|buy|price|quote|proposal|close|pitch|prospect/i.test(msg)) return 'SALES';
  if (/help|broken|issue|refund|return|status|complaint|problem/i.test(msg)) return 'SUPPORT';
  if (/report|analytics|dashboard|summary|stats|performance/i.test(msg)) return 'REPORT';
  
  return 'GENERAL';
}

// ─── Execute actions returned by the AI ──────────────────────────────────────
async function executeActions(actions: AgentAction[], businessId?: string) {
  const results: Record<string, any>[] = [];

  for (const action of actions) {
    try {
      switch (action.type) {
        case 'ADD_CRM_LEAD': {
          // In production: POST to /api/crm with lead data
          // For now: log to console (DB writes via CRM API when integrated)
          console.log('[Arkle Agent] ADD_CRM_LEAD:', action.payload);
          results.push({ type: 'ADD_CRM_LEAD', status: 'queued', data: action.payload });
          break;
        }
        case 'SEND_WHATSAPP': {
          // POST to /api/whatsapp/send
          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/whatsapp/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: action.payload.phone, message: action.payload.message, type: 'text' }),
          });
          const data = await response.json();
          results.push({ type: 'SEND_WHATSAPP', status: data.success ? 'sent' : 'failed', data });
          break;
        }
        case 'SEND_EMAIL': {
          // POST to /api/export-to-drive or email API when integrated
          console.log('[Arkle Agent] SEND_EMAIL:', action.payload);
          results.push({ type: 'SEND_EMAIL', status: 'queued', data: action.payload });
          break;
        }
        case 'CREATE_TASK': {
          console.log('[Arkle Agent] CREATE_TASK:', action.payload);
          results.push({ type: 'CREATE_TASK', status: 'created', data: action.payload });
          break;
        }
        case 'GENERATE_INVOICE': {
          console.log('[Arkle Agent] GENERATE_INVOICE:', action.payload);
          results.push({ type: 'GENERATE_INVOICE', status: 'draft_created', data: action.payload });
          break;
        }
        case 'BULK_CALL': {
          console.log('[Arkle Agent] BULK_CALL Campaign:', action.payload);
          results.push({ type: 'BULK_CALL', status: 'campaign_queued', data: action.payload });
          break;
        }
        case 'NOTIFY': {
          results.push({ type: 'NOTIFY', status: 'pushed', data: action.payload });
          break;
        }
      }
    } catch (err: any) {
      results.push({ type: action.type, status: 'error', error: err.message });
    }
  }

  return results;
}

// ─── Main Route Handler ───────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized. Access Denied.' }, { status: 401 });
    }

    const { message, agentId = 'omni', context = {}, businessId } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    // 1. Classify intent
    const intent = await classifyIntent(message);

    // 2. Build context-aware system prompt
    const agentPersona = SUB_AGENT_PERSONAS[intent] || SUB_AGENT_PERSONAS.GENERAL;
    const fullSystemPrompt = `${MASTER_SYSTEM_PROMPT}\n\n${agentPersona}\n\nBusiness Context:\n${JSON.stringify(context, null, 2)}`;

    // 3. Call Gemini
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: fullSystemPrompt,
      generationConfig: { temperature: 0.6, maxOutputTokens: 1500 },
    });

    const result = await model.generateContent(message);
    let rawText = result.response.text().replace(/```json\n?|```/g, '').trim();

    // 4. Parse JSON response
    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // Fallback: treat as plain text reply
      parsed = { reply: rawText, intent, executedBy: 'Arkle Brain', actions: [], summary: 'Processed request' };
    }

    // 5. Execute any autonomous actions the agent decided
    const actionResults = parsed.actions?.length > 0
      ? await executeActions(parsed.actions, businessId)
      : [];

    return NextResponse.json({
      success: true,
      reply: parsed.reply || rawText,
      intent: parsed.intent || intent,
      executedBy: parsed.executedBy || 'Arkle Brain',
      confidence: parsed.confidence || 0.9,
      actions: parsed.actions || [],
      actionResults,
      summary: parsed.summary || '',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('[Arkle Agent API Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
