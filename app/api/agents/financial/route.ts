import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  generateProfitAndLoss,
  generateBalanceSheet,
  generateTaxComputationSheet,
} from '@/agents/itr_agent/financial-statements';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId');
    const taxProfileId = searchParams.get('taxProfileId');
    const type = searchParams.get('type') || 'all'; // pl, bs, computation, all
    const fy = searchParams.get('fy') || '2025-26';

    if (!businessId) {
      return NextResponse.json({ success: false, error: 'businessId is required' }, { status: 400 });
    }

    // Parse FY dates
    const [fyStart, fyEnd] = fy.split('-');
    const startDate = new Date(`${fyStart}-04-01T00:00:00Z`);
    const endDate = new Date(`20${fyEnd}-03-31T23:59:59Z`);

    const result: any = {};

    // ── P&L ────────────────────────────────────────────────────
    if (type === 'pl' || type === 'all') {
      result.pl = await generateProfitAndLoss(businessId, startDate, endDate);
    }

    // ── Balance Sheet ───────────────────────────────────────────
    if (type === 'bs' || type === 'all') {
      const pl = result.pl || await generateProfitAndLoss(businessId, startDate, endDate);
      result.bs = await generateBalanceSheet(businessId, endDate, pl.netProfitAfterTax);
    }

    // ── Tax Computation ─────────────────────────────────────────
    if ((type === 'computation' || type === 'all') && taxProfileId) {
      const pl = result.pl || await generateProfitAndLoss(businessId, startDate, endDate);
      result.computation = await generateTaxComputationSheet(taxProfileId, pl.netProfitBeforeTax);
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Financial API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
