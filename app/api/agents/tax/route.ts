import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ComplianceAgent } from '@/agents/itr_agent/agent';

const prisma = new PrismaClient();

// ─── GET: Fetch all profiles with filings and sessions ──────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');

    // Single profile detail
    if (profileId) {
      const profile = await prisma.taxProfile.findUnique({
        where: { id: profileId },
        include: {
          filings: { include: { sessions: true }, orderBy: { createdAt: 'desc' } },
          documents: { orderBy: { createdAt: 'desc' } },
        },
      });
      return NextResponse.json({ success: true, profile });
    }

    // All profiles (B2B dashboard)
    const profiles = await prisma.taxProfile.findMany({
      include: {
        filings: {
          include: { sessions: true },
          orderBy: { createdAt: 'desc' },
          take: 1, // Latest filing only for list view
        },
        documents: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Summary stats
    const stats = {
      totalClients: profiles.length,
      filedCount: profiles.filter((p) => p.filings[0]?.status === 'SUBMITTED').length,
      pendingCount: profiles.filter((p) => p.filings[0]?.status === 'DRAFT' || !p.filings[0]).length,
      waitingOtp: profiles.filter((p) => p.filings[0]?.status === 'WAITING_FOR_OTP').length,
    };

    return NextResponse.json({ success: true, profiles, stats });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ─── POST: Create profile, run pipeline, submit OTP ─────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // ─── Create Client Profile + Initialize Filing ──────────
    if (action === 'create_profile') {
      const { clientName, clientPhone, clientEmail, pan, gstin, filingType, period } = body;

      const profile = await prisma.taxProfile.create({
        data: {
          clientName: clientName || 'Unnamed Client',
          clientPhone,
          clientEmail,
          pan,
          gstin,
          defaultRegime: 'NEW',
        },
      });

      const filing = await prisma.taxFiling.create({
        data: {
          taxProfileId: profile.id,
          type: filingType || 'ITR',
          period: period || 'FY-2025-26',
          status: 'DRAFT',
        },
      });

      // Seed with a default document placeholder
      await prisma.taxDocument.create({
        data: {
          taxProfileId: profile.id,
          documentType: 'FORM_16',
          status: 'PENDING',
        },
      });

      return NextResponse.json({ success: true, profile, filing });
    }

    // ─── Run or Resume Agent Pipeline ───────────────────────
    if (action === 'run_pipeline') {
      const { filingId, otp } = body;
      if (!filingId) {
        return NextResponse.json({ success: false, error: 'Missing filingId' }, { status: 400 });
      }

      const agent = new ComplianceAgent(filingId);
      const state = await agent.runPipeline(otp);

      return NextResponse.json({ success: true, state });
    }

    // ─── Add Document to Profile ────────────────────────────
    if (action === 'add_document') {
      const { profileId, documentType, fileUrl } = body;
      const doc = await prisma.taxDocument.create({
        data: {
          taxProfileId: profileId,
          documentType: documentType || 'OTHER',
          fileUrl,
          status: 'PENDING',
        },
      });
      return NextResponse.json({ success: true, document: doc });
    }

    // ─── Batch: Create multiple profiles at once ────────────
    if (action === 'batch_create') {
      const { clients } = body; // Array of { clientName, clientPhone, pan, gstin }
      const results = [];

      for (const client of clients) {
        const profile = await prisma.taxProfile.create({
          data: {
            clientName: client.clientName,
            clientPhone: client.clientPhone,
            pan: client.pan,
            gstin: client.gstin,
            defaultRegime: 'NEW',
          },
        });

        const filing = await prisma.taxFiling.create({
          data: {
            taxProfileId: profile.id,
            type: 'ITR',
            period: 'FY-2025-26',
            status: 'DRAFT',
          },
        });

        results.push({ profile, filing });
      }

      return NextResponse.json({ success: true, created: results.length, results });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ─── DELETE: Remove a profile ───────────────────────────────

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');
    if (!profileId) {
      return NextResponse.json({ success: false, error: 'Missing profileId' }, { status: 400 });
    }

    await prisma.taxProfile.delete({ where: { id: profileId } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
