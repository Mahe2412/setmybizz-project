import { prisma } from "@billease/db";
import { requireBusinessId } from "@/lib/billease/session";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { businessId } = await requireBusinessId();
  const { id } = await params;

  const expense = await prisma.expense.findFirst({
    where: { id, businessId },
  });

  if (!expense) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }

  await prisma.expense.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
