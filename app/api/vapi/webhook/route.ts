/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  VAPI WEBHOOK - Arkle Universal Voice Agent                 ║
 * ║                                                              ║
 * ║  Vapi calls this endpoint during every voice call.          ║
 * ║  We handle: tool calls, function calls, end-of-call reports ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Vapi → sends events to this URL
 * We  → run tools (CRM update, WhatsApp, etc.) and return results
 */

import { NextResponse } from 'next/server';
import { prisma } from '@billease/db';

// ── Tool: Save lead to CRM ──────────────────────────────────────────────────
async function saveCRMLead(args: {
  name?: string;
  phone?: string;
  interest?: string;
  notes?: string;
  businessId?: string;
}) {
  try {
    // Check if lead already exists
    const existingLead = await prisma.cRMLead.findFirst({
      where: { phone: args.phone || '' },
    });

    if (existingLead) {
      // Update existing lead
      await prisma.cRMLead.update({
        where: { id: existingLead.id },
        data: {
          notes: args.notes || existingLead.notes,
          stage: 'qualified',
          updatedAt: new Date(),
        },
      });
      return { success: true, message: `Lead updated for ${args.name || args.phone}` };
    }

    // Create new lead
    await prisma.cRMLead.create({
      data: {
        name: args.name || 'Unknown Caller',
        phone: args.phone || '',
        interest: args.interest || 'Inbound Call',
        notes: args.notes || '',
        stage: 'new',
        source: 'voice_agent',
        businessId: args.businessId || null,
      },
    });
    return { success: true, message: `New lead saved for ${args.name || args.phone}` };
  } catch (e: any) {
    console.error('[CRM Lead Error]', e);
    return { success: false, message: 'Failed to save lead: ' + e.message };
  }
}

// ── Tool: Get business info ─────────────────────────────────────────────────
async function getBusinessInfo(businessId?: string) {
  try {
    if (!businessId) return { success: false, message: 'No business ID provided' };

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: { items: { take: 10, orderBy: { createdAt: 'desc' } } },
    });

    if (!business) return { success: false, message: 'Business not found' };

    const productList = business.items
      .map((item: any) => `${item.name} at ₹${item.salePrice}`)
      .join(', ');

    return {
      success: true,
      data: {
        name: business.name,
        products: productList || 'Contact us for product details',
        phone: business.phone,
        email: business.email,
      },
    };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

// ── Main Webhook Handler ────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: 'No message in webhook' }, { status: 400 });
    }

    const { type } = message;

    // ── 1. Tool Call from Vapi (agent wants to execute an action) ──────────
    if (type === 'tool-calls') {
      const toolCallList = message.toolCallList || [];
      const results = [];

      for (const toolCall of toolCallList) {
        const { id, function: fn } = toolCall;
        const args = fn?.arguments ? JSON.parse(fn.arguments) : {};
        let result;

        switch (fn?.name) {
          case 'save_lead':
            result = await saveCRMLead(args);
            break;
          case 'get_business_info':
            result = await getBusinessInfo(args.businessId);
            break;
          default:
            result = { success: false, message: `Unknown tool: ${fn?.name}` };
        }

        results.push({
          toolCallId: id,
          result: JSON.stringify(result),
        });
      }

      return NextResponse.json({ results });
    }

    // ── 2. End of call report ───────────────────────────────────────────────
    if (type === 'end-of-call-report') {
      const { call, transcript, summary } = message;
      console.log('[Vapi Call Ended]', {
        callId: call?.id,
        duration: call?.duration,
        summary,
      });

      // Save call log to DB
      if (call?.customer?.number) {
        await saveCRMLead({
          phone: call.customer.number,
          notes: summary || 'Inbound call completed',
        });
      }

      return NextResponse.json({ success: true });
    }

    // ── 3. Status updates, etc. ─────────────────────────────────────────────
    return NextResponse.json({ success: true, received: type });

  } catch (error: any) {
    console.error('[Vapi Webhook Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── GET: Health check ─────────────────────────────────────────────────────
export async function GET() {
  return NextResponse.json({
    status: 'active',
    agent: 'Arkle Universal Voice Agent',
    capabilities: ['inbound', 'outbound', 'crm_sync', 'whatsapp'],
  });
}
