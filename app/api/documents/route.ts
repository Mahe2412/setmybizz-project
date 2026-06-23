import { prisma } from "@billease/db";
import { requireBusinessId } from "@/lib/billease/session";
import {
  computeAndSaveDocumentLines,
  getNextDocumentNumber,
  type LineInput,
} from "@/lib/billease/documents";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { businessId } = await requireBusinessId();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  const documents = await prisma.document.findMany({
    where: {
      businessId,
      ...(type ? { type } : {}),
      ...(status ? { status } : {}),
    },
    include: { party: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(documents);
}

export async function POST(req: Request) {
  const { businessId } = await requireBusinessId();
  const body = await req.json();
  const { type, partyId, lines, placeOfSupply, notes, date } = body as {
    type: string;
    partyId?: string;
    lines: LineInput[];
    placeOfSupply?: string;
    notes?: string;
    date?: string;
  };

  const business = await prisma.business.findUniqueOrThrow({
    where: { id: businessId },
  });

  let pos = placeOfSupply ?? business.stateCode;
  if (partyId) {
    const party = await prisma.party.findFirst({ where: { id: partyId } });
    if (party) pos = party.stateCode;
  }

  const doc = await prisma.document.create({
    data: {
      businessId,
      partyId: partyId ?? null,
      type: type ?? "invoice",
      status: "draft",
      placeOfSupply: pos,
      notes,
      date: date ? new Date(date) : new Date(),
    },
  });

  const { totals } = await computeAndSaveDocumentLines(
    doc.id,
    business.stateCode,
    pos,
    lines ?? []
  );

  const updated = await prisma.document.update({
    where: { id: doc.id },
    data: {
      subtotal: totals.subtotal,
      taxableTotal: totals.taxableTotal,
      cgstTotal: totals.cgstTotal,
      sgstTotal: totals.sgstTotal,
      igstTotal: totals.igstTotal,
      roundOff: totals.roundOff,
      grandTotal: totals.grandTotal,
    },
    include: { lines: true, party: true },
  });

  return NextResponse.json(updated);
}
