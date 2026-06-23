import { prisma } from "@billease/db";
import { itemSchema } from "@billease/shared";
import { requireBusinessId } from "@/lib/session";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { businessId } = await requireBusinessId();
  const { id } = await params;
  const body = await req.json();
  const parsed = itemSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await prisma.item.updateMany({
    where: { id, businessId },
    data: parsed.data,
  });

  const item = await prisma.item.findFirst({ where: { id, businessId } });
  return NextResponse.json(item);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { businessId } = await requireBusinessId();
  const { id } = await params;
  await prisma.item.deleteMany({ where: { id, businessId } });
  return NextResponse.json({ ok: true });
}
