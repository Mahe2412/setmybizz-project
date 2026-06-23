import { prisma } from "@billease/db";
import { businessSchema } from "@billease/shared";
import { requireBusinessId, requireSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  const { businessId } = await requireBusinessId();
  const business = await prisma.business.findUnique({
    where: { id: businessId },
  });
  return NextResponse.json(business);
}

export async function PATCH(req: Request) {
  const { businessId } = await requireBusinessId();
  const body = await req.json();
  const parsed = businessSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const business = await prisma.business.update({
    where: { id: businessId },
    data: parsed.data,
  });

  return NextResponse.json(business);
}

export async function POST(req: Request) {
  const session = await requireSession();
  const body = await req.json();
  const parsed = businessSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const business = await prisma.business.create({ data: parsed.data });

  await prisma.membership.create({
    data: {
      userId: session.user.id,
      businessId: business.id,
      role: "owner",
    },
  });

  return NextResponse.json(business);
}
