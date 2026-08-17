/**
 * POST /api/vapi/create-agent
 * 
 * Creates (or updates) the Arkle Voice Agent in Vapi.
 * Pulls business context from BizDesk and injects it into the system prompt.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@billease/db';
import { getSession } from '@/lib/billease/session';
import { createVapiAssistant } from '@/lib/agent-core/ArkleVoiceAgent';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const body = await req.json().catch(() => ({}));
    const language = body.language || 'te-IN';

    // ── Load business context from BizDesk ──────────────────────────────────
    const business = session?.user?.businessId
      ? await prisma.business.findUnique({
          where: { id: session.user.businessId },
          include: { items: { take: 20 } },
        })
      : null;

    const productList = business?.items
      .map((item: any) => `• ${item.name} – ₹${item.salePrice}`)
      .join('\n') || '• Contact us for product details';

    const businessContext = {
      businessName: business?.name || 'Our Business',
      ownerName: business?.ownerName || 'the Owner',
      industry: business?.industryType || 'General',
      products: productList,
      phone: business?.phone || '',
      customInstructions: body.customInstructions || '',
    };

    // ── Create assistant in Vapi ─────────────────────────────────────────────
    const vapiAssistant = await createVapiAssistant({
      businessContext,
      assistantName: `Arkle - ${businessContext.businessName}`,
      language,
    });

    // ── Save assistant ID to DB ──────────────────────────────────────────────
    if (business && vapiAssistant.id) {
      await prisma.business.update({
        where: { id: business.id },
        data: { vapiAssistantId: vapiAssistant.id } as any,
      }).catch(() => {
        // Column might not exist yet — ok for now
      });
    }

    return NextResponse.json({
      success: true,
      assistantId: vapiAssistant.id,
      assistantName: vapiAssistant.name,
      message: 'Arkle Voice Agent created successfully! Copy the Assistant ID to use with Vapi.',
    });

  } catch (error: any) {
    console.error('[Create Vapi Agent Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
