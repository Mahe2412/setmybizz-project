import { prisma } from "@billease/db";
import { requireBusinessId } from "@/lib/billease/session";
import { formatCurrency, formatDate } from "@/lib/billease/utils";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function PurchasesPage() {
  const { businessId } = await requireBusinessId();

  const purchases = await prisma.document.findMany({
    where: { businessId, type: "purchase" },
    include: { party: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Purchase bills</h1>
        <Link href="/purchases/new" className="btn-primary gap-2">
          <Plus className="h-4 w-4" />
          New purchase
        </Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="pb-2">Number</th>
              <th className="pb-2">Supplier</th>
              <th className="pb-2">Date</th>
              <th className="pb-2">Status</th>
              <th className="pb-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="py-3">
                  <Link href={`/purchases/${p.id}`} className="text-blue-600">
                    {p.number ?? "Draft"}
                  </Link>
                </td>
                <td>{p.party?.name ?? "—"}</td>
                <td>{formatDate(p.date)}</td>
                <td>{p.status}</td>
                <td className="text-right">{formatCurrency(p.grandTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

