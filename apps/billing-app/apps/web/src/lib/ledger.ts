import { prisma } from "@billease/db";

export async function getPartyBalance(businessId: string, partyId: string) {
  const party = await prisma.party.findFirst({
    where: { id: partyId, businessId },
  });
  if (!party) return 0;

  const invoices = await prisma.document.findMany({
    where: {
      businessId,
      partyId,
      status: "finalized",
      type: { in: ["invoice", "bill_of_supply"] },
    },
  });

  const purchases = await prisma.document.findMany({
    where: {
      businessId,
      partyId,
      status: "finalized",
      type: "purchase",
    },
  });

  const payments = await prisma.payment.findMany({
    where: { businessId, partyId },
  });

  const salesTotal = invoices.reduce((s, d) => s + d.grandTotal, 0);
  const purchaseTotal = purchases.reduce((s, d) => s + d.grandTotal, 0);

  const received = payments
    .filter((p) => p.amount > 0)
    .reduce((s, p) => s + p.amount, 0);

  const paid = payments.reduce((s, p) => s + Math.abs(p.amount), 0);

  if (party.type === "customer") {
    return party.openingBalance + salesTotal - received;
  }

  return party.openingBalance + purchaseTotal - paid;
}

const INVOICE_TYPES = ["invoice", "bill_of_supply"] as const;

export async function getDashboardStats(businessId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const invoiceWhere = {
    businessId,
    status: "finalized" as const,
    type: { in: [...INVOICE_TYPES] },
  };

  const [todayAgg, invoiceBalances, customerCount, lowStockRows, recentInvoices, salesAgg, purchaseAgg] =
    await Promise.all([
      prisma.document.aggregate({
        where: { ...invoiceWhere, date: { gte: today } },
        _sum: { grandTotal: true },
        _count: true,
      }),
      prisma.document.findMany({
        where: invoiceWhere,
        select: {
          grandTotal: true,
          payments: { select: { amount: true } },
        },
      }),
      prisma.party.count({
        where: { businessId, type: "customer" },
      }),
      prisma.item.findMany({
        where: {
          businessId,
          trackStock: true,
          lowStockAlert: { not: null },
        },
        select: { stockQty: true, lowStockAlert: true },
      }),
      prisma.document.findMany({
        where: { businessId, type: { in: [...INVOICE_TYPES] } },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { party: { select: { name: true } } },
      }),
      prisma.document.aggregate({
        where: { businessId, status: "finalized", type: { in: [...INVOICE_TYPES] } },
        _sum: { grandTotal: true },
      }),
      prisma.document.aggregate({
        where: { businessId, status: "finalized", type: "purchase" },
        _sum: { grandTotal: true },
      }),
    ]);

  let outstanding = 0;
  for (const inv of invoiceBalances) {
    const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
    outstanding += Math.max(0, inv.grandTotal - paid);
  }

  const lowStockCount = lowStockRows.filter(
    (i) => i.lowStockAlert != null && i.stockQty <= i.lowStockAlert
  ).length;

  return {
    todaySales: todayAgg._sum.grandTotal ?? 0,
    todayCount: todayAgg._count,
    outstanding,
    customerCount,
    lowStockCount,
    recentInvoices,
    totalSales: salesAgg._sum.grandTotal ?? 0,
    totalPurchases: purchaseAgg._sum.grandTotal ?? 0,
  };
}
