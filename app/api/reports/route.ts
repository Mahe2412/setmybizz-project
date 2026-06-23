import { prisma } from "@billease/db";
import { requireBusinessId } from "@/lib/billease/session";
import { NextResponse } from "next/server";

export async function GET() {
  const { businessId } = await requireBusinessId();

  const sales = await prisma.document.findMany({
    where: {
      businessId,
      status: "finalized",
      type: { in: ["invoice", "bill_of_supply"] },
    },
    include: { party: true, lines: true },
  });

  const purchases = await prisma.document.findMany({
    where: {
      businessId,
      status: "finalized",
      type: "purchase",
    },
  });

  const salesTotal = sales.reduce((s, d) => s + d.grandTotal, 0);
  const purchaseTotal = purchases.reduce((s, d) => s + d.grandTotal, 0);

  const gstSummary = {
    cgst: sales.reduce((s, d) => s + d.cgstTotal, 0),
    sgst: sales.reduce((s, d) => s + d.sgstTotal, 0),
    igst: sales.reduce((s, d) => s + d.igstTotal, 0),
  };

  const byParty: Record<string, { name: string; total: number }> = {};
  for (const doc of sales) {
    const key = doc.partyId ?? "walk-in";
    const name = doc.party?.name ?? "Walk-in";
    if (!byParty[key]) byParty[key] = { name, total: 0 };
    byParty[key].total += doc.grandTotal;
  }

  const itemSales: Record<string, { name: string; qty: number; amount: number }> =
    {};
  for (const doc of sales) {
    for (const line of doc.lines) {
      const key = line.description;
      if (!itemSales[key]) {
        itemSales[key] = { name: line.description, qty: 0, amount: 0 };
      }
      itemSales[key].qty += line.qty;
      itemSales[key].amount += line.lineTotal;
    }
  }

  return NextResponse.json({
    salesTotal,
    purchaseTotal,
    profitEstimate: salesTotal - purchaseTotal,
    gstSummary,
    byParty: Object.values(byParty).sort((a, b) => b.total - a.total),
    topItems: Object.values(itemSales)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10),
    invoiceCount: sales.length,
    purchaseCount: purchases.length,
  });
}
