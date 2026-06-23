import { prisma } from "@billease/db";
import { requireBusinessId } from "@/lib/billease/session";
import { NextResponse } from "next/server";

export async function GET() {
  const { businessId } = await requireBusinessId();
  const expenses = await prisma.expense.findMany({
    where: { businessId },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(expenses);
}

export async function POST(req: Request) {
  const { businessId } = await requireBusinessId();
  const body = await req.json();
  const { category, amount, notes, reference, date } = body as {
    category: string;
    amount: number;
    notes?: string;
    reference?: string;
    date?: string;
  };

  if (!category || !amount) {
    return NextResponse.json({ error: "Category and amount are required" }, { status: 400 });
  }

  const expense = await prisma.expense.create({
    data: {
      businessId,
      category,
      amount: Number(amount),
      notes,
      reference,
      date: date ? new Date(date) : new Date(),
    },
  });

  return NextResponse.json(expense);
}
