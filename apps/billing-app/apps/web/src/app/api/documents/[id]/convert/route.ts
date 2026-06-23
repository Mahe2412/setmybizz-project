import { prisma } from "@billease/db";
import { requireBusinessId } from "@/lib/session";
import { NextResponse } from "next/server";

// POST /api/documents/[id]/convert
// Copies a finalized quotation into a new invoice draft
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { businessId } = await requireBusinessId();
  const { id } = await params;

  const source = await prisma.document.findFirst({
    where: { id, businessId, type: "quotation" },
    include: { lines: true },
  });

  if (!source) {
    return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
  }

  // Create a new invoice draft with the same data
  const newDoc = await prisma.document.create({
    data: {
      businessId,
      partyId: source.partyId,
      type: "invoice",
      status: "draft",
      placeOfSupply: source.placeOfSupply,
      notes: source.notes,
      subtotal: source.subtotal,
      taxableTotal: source.taxableTotal,
      cgstTotal: source.cgstTotal,
      sgstTotal: source.sgstTotal,
      igstTotal: source.igstTotal,
      roundOff: source.roundOff,
      grandTotal: source.grandTotal,
      convertedFromId: source.id,
    },
  });

  // Copy all lines
  await prisma.documentLine.createMany({
    data: source.lines.map((l) => ({
      documentId: newDoc.id,
      itemId: l.itemId,
      description: l.description,
      hsnSac: l.hsnSac,
      qty: l.qty,
      unit: l.unit,
      rate: l.rate,
      discountPct: l.discountPct,
      gstRate: l.gstRate,
      taxableValue: l.taxableValue,
      cgst: l.cgst,
      sgst: l.sgst,
      igst: l.igst,
      lineTotal: l.lineTotal,
      sortOrder: l.sortOrder,
    })),
  });

  return NextResponse.json({ id: newDoc.id });
}
