import { prisma } from "@billease/db";
import { partySchema } from "@billease/shared";
import { getPartyBalance } from "@/lib/ledger";
import { requireBusinessId } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { businessId } = await requireBusinessId();
  const { id } = await params;

  const party = await prisma.party.findFirst({
    where: { id, businessId },
  });

  if (!party) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const balance = await getPartyBalance(businessId, id);

  const documents = await prisma.document.findMany({
    where: { partyId: id, businessId },
    orderBy: { date: "desc" },
    take: 20,
  });

  const payments = await prisma.payment.findMany({
    where: { partyId: id, businessId },
    orderBy: { date: "desc" },
    take: 20,
  });

  return NextResponse.json({ party, balance, documents, payments });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { businessId } = await requireBusinessId();
  const { id } = await params;
  const body = await req.json();
  const parsed = partySchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const party = await prisma.party.updateMany({
    where: { id, businessId },
    data: parsed.data,
  });

  return NextResponse.json(party);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { businessId } = await requireBusinessId();
  const { id } = await params;

  await prisma.party.deleteMany({ where: { id, businessId } });
  return NextResponse.json({ ok: true });
}
