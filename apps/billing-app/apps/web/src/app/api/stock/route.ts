import { prisma } from "@billease/db";
import { requireBusinessId } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  const { businessId } = await requireBusinessId();

  const items = await prisma.item.findMany({
    where: { businessId, trackStock: true },
    orderBy: { name: "asc" },
  });

  const movements = await prisma.stockMovement.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { item: true },
  });

  const lowStock = items.filter(
    (i) => i.lowStockAlert != null && i.stockQty <= (i.lowStockAlert ?? 0)
  );

  return NextResponse.json({ items, movements, lowStock });
}

export async function POST(req: Request) {
  const { businessId } = await requireBusinessId();
  const { itemId, qty, type, notes } = await req.json();

  if (!itemId || !qty) {
    return NextResponse.json({ error: "itemId and qty required" }, { status: 400 });
  }

  const item = await prisma.item.findFirst({
    where: { id: itemId, businessId },
  });

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const delta = type === "out" ? -Math.abs(qty) : Math.abs(qty);

  await prisma.item.update({
    where: { id: itemId },
    data: { stockQty: { increment: delta } },
  });

  const movement = await prisma.stockMovement.create({
    data: {
      businessId,
      itemId,
      qty: delta,
      type: type ?? "adjustment",
      notes,
    },
  });

  return NextResponse.json(movement);
}
