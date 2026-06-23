import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── POST: Capture new CA lead ──────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, phone, email, pan, gstin, filingType,
      itrForm, assessmentYear, message, source, priority,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    const lead = await (prisma as any).caLead.create({
      data: {
        name,
        phone,
        email,
        pan,
        gstin,
        filingType: filingType || 'ITR',
        itrForm,
        assessmentYear: assessmentYear || 'AY 2026-27',
        message,
        source: source || 'WIZARD',
        priority: priority || 'MEDIUM',
        status: 'NEW',
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ─── GET: List all leads / single lead ──────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get('id');
    const status = searchParams.get('status');

    if (leadId) {
      const lead = await prisma.caLead.findUnique({ where: { id: leadId } });
      return NextResponse.json({ success: true, lead });
    }

    const where: any = {};
    if (status) where.status = status;

    const leads = await (prisma as any).caLead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const stats = {
      total: leads.length,
      newLeads: leads.filter((l: any) => l.status === 'NEW').length,
      contacted: leads.filter((l: any) => l.status === 'CONTACTED').length,
      converted: leads.filter((l: any) => l.status === 'CONVERTED').length,
    };

    return NextResponse.json({ success: true, leads, stats });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ─── PATCH: Update lead status ───────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, assignedTo, taxProfileId } = body;

    const lead = await (prisma as any).caLead.update({
      where: { id },
      data: {
        status,
        assignedTo,
        taxProfileId,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
