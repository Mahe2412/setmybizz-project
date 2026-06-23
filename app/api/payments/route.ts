import { prisma } from "@billease/db";
import { paymentSchema } from "@billease/shared";
import { requireBusinessId } from "@/lib/billease/session";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { businessId } = await requireBusinessId();
  const { searchParams } = new URL(req.url);
  const partyId = searchParams.get("partyId");
  const documentId = searchParams.get("documentId");

  const payments = await prisma.payment.findMany({
    where: {
      businessId,
      ...(partyId ? { partyId } : {}),
      ...(documentId ? { documentId } : {}),
    },
    orderBy: { date: "desc" },
    include: { party: true, document: true },
  });

  return NextResponse.json(payments);
}

export async function POST(req: Request) {
  const { businessId } = await requireBusinessId();
  const body = await req.json();
  const parsed = paymentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const payment = await prisma.payment.create({
    data: {
      businessId,
      ...parsed.data,
    },
    include: { party: true, document: true },
  });

  return NextResponse.json(payment);
}
