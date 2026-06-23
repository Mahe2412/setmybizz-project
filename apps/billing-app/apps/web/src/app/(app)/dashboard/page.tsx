import { getDashboardStats } from "@/lib/ledger";
import { requireBusinessId } from "@/lib/session";
import { prisma } from "@billease/db";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const revalidate = 15;

export default async function DashboardPage() {
  const { businessId } = await requireBusinessId();
  const stats = await getDashboardStats(businessId);

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { name: true },
  });

  return (
    <DashboardClient
      stats={stats}
      businessName={business?.name ?? "YOUR BUSINESS"}
    />
  );
}
