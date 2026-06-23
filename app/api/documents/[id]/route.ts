import { prisma } from "@billease/db";
import { requireBusinessId } from "@/lib/billease/session";
import {
  adjustStockForDocument,
  computeAndSaveDocumentLines,
  getNextDocumentNumber,
  type LineInput,
} from "@/lib/billease/documents";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { businessId } = await requireBusinessId();
  const { id } = await params;

  const doc = await prisma.document.findFirst({
    where: { id, businessId },
    include: {
      lines: { orderBy: { sortOrder: "asc" }, include: { item: true } },
      party: true,
      payments: true,
      business: true,
    },
  });

  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { businessId } = await requireBusinessId();
  const { id } = await params;
  const body = await req.json();

  const doc = await prisma.document.findFirst({
    where: { id, businessId },
    include: { business: true },
  });

  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (doc.status === "finalized" && body.action !== "cancel") {
    return NextResponse.json(
      { error: "Finalized documents cannot be edited" },
      { status: 400 }
    );
  }

  if (body.action === "finalize") {
    const number =
      doc.number ?? (await getNextDocumentNumber(businessId, doc.type));

    const updated = await prisma.document.update({
      where: { id },
      data: { status: "finalized", number },
    });

    if (["invoice", "bill_of_supply", "purchase"].includes(doc.type)) {
      await adjustStockForDocument(id, "out");
    }

    return NextResponse.json(updated);
  }

  if (body.action === "cancel") {
    if (doc.status === "finalized") {
      await adjustStockForDocument(id, "in");
    }
    const updated = await prisma.document.update({
      where: { id },
      data: { status: "cancelled" },
    });
    return NextResponse.json(updated);
  }

  if (body.action === "convert" && doc.type === "quotation") {
    const number = await getNextDocumentNumber(businessId, "invoice");
    const updated = await prisma.document.update({
      where: { id },
      data: {
        type: "invoice",
        status: "draft",
        number: null,
        convertedFromId: id,
      },
    });
    return NextResponse.json({ ...updated, previewNumber: number });
  }

  const { partyId, lines, placeOfSupply, notes, date, type } = body;
  let pos = placeOfSupply ?? doc.placeOfSupply ?? doc.business.stateCode;

  if (partyId) {
    const party = await prisma.party.findFirst({ where: { id: partyId } });
    if (party) pos = party.stateCode;
  }

  if (lines) {
    const { totals } = await computeAndSaveDocumentLines(
      id,
      doc.business.stateCode,
      pos,
      lines as LineInput[]
    );

    await prisma.document.update({
      where: { id },
      data: {
        partyId: partyId ?? doc.partyId,
        placeOfSupply: pos,
        notes: notes ?? doc.notes,
        date: date ? new Date(date) : doc.date,
        type: type ?? doc.type,
        subtotal: totals.subtotal,
        taxableTotal: totals.taxableTotal,
        cgstTotal: totals.cgstTotal,
        sgstTotal: totals.sgstTotal,
        igstTotal: totals.igstTotal,
        roundOff: totals.roundOff,
        grandTotal: totals.grandTotal,
      },
    });
  } else {
    await prisma.document.update({
      where: { id },
      data: {
        partyId,
        placeOfSupply: pos,
        notes,
        date: date ? new Date(date) : undefined,
        type,
      },
    });
  }

  const full = await prisma.document.findFirst({
    where: { id },
    include: { lines: true, party: true },
  });

  return NextResponse.json(full);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { businessId } = await requireBusinessId();
  const { id } = await params;

  const doc = await prisma.document.findFirst({ where: { id, businessId } });
  if (doc?.status === "finalized") {
    return NextResponse.json(
      { error: "Cannot delete finalized document" },
      { status: 400 }
    );
  }

  await prisma.document.deleteMany({ where: { id, businessId } });
  return NextResponse.json({ ok: true });
}
