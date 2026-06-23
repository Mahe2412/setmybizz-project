import { prisma } from "@billease/db";
import { itemSchema } from "@billease/shared";
import { requireBusinessId } from "@/lib/billease/session";
import { NextResponse } from "next/server";

export async function GET() {
  const { businessId } = await requireBusinessId();
  const items = await prisma.item.findMany({
    where: { businessId },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const { businessId } = await requireBusinessId();
  const body = await req.json();
  const parsed = itemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const item = await prisma.item.create({
    data: { businessId, ...parsed.data },
  });

  return NextResponse.json(item);
}
