import { NextResponse } from 'next/server';
import { prisma } from '@billease/db';
import { getSession } from "@/lib/billease/session";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized. Access Denied.' }, { status: 401 });
    }

    const body = await req.json();
    const { phone, message, type, leadId } = body;

    if (!phone || !message) {
      return NextResponse.json({ error: 'Phone and message are required' }, { status: 400 });
    }

    console.log(`[WhatsApp API Send] Sending to ${phone}: "${message}" (${type || 'text'})`);

    // If a leadId is provided, log the message into the database
    if (leadId) {
      try {
        await prisma.crmMessage.create({
          data: {
            leadId,
            role: 'ai',
            text: message,
            channel: 'whatsapp'
          }
        });
      } catch (dbError) {
        console.error('[WhatsApp API] Failed to log message to DB:', dbError);
      }
    }

    // Return mock success response
    return NextResponse.json({
      success: true,
      messageId: `wa_msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      status: 'sent'
    });
  } catch (error: any) {
    console.error('[WhatsApp API Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
