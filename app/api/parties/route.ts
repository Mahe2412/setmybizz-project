import { prisma } from "@billease/db";
import { partySchema } from "@billease/shared";
import { requireBusinessId } from "@/lib/billease/session";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { businessId } = await requireBusinessId();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const parties = await prisma.party.findMany({
    where: {
      businessId,
      ...(type ? { type } : {}),
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(parties);
}

export async function POST(req: Request) {
  const { businessId } = await requireBusinessId();
  const body = await req.json();
  const parsed = partySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const party = await prisma.party.create({
    data: { businessId, ...parsed.data, email: parsed.data.email || undefined },
  });

  return NextResponse.json(party);
}
