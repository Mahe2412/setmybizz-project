import { prisma } from "@billease/db";
import { requireBusinessId } from "@/lib/billease/session";
import { formatCurrency } from "@/lib/billease/utils";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ItemsPage() {
  const { businessId } = await requireBusinessId();

  const items = await prisma.item.findMany({
    where: { businessId },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Items</h1>
        <Link href="/items/new" className="btn-primary gap-2">
          <Plus className="h-4 w-4" />
          Add item
        </Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="pb-2">Name</th>
              <th className="pb-2">HSN</th>
              <th className="pb-2">GST%</th>
              <th className="pb-2">Sale</th>
              <th className="pb-2">Stock</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-slate-100">
                <td className="py-3">
                  <Link href={`/items/${item.id}`} className="font-medium text-blue-600">
                    {item.name}
                  </Link>
                </td>
                <td>{item.hsnSac ?? "—"}</td>
                <td>{item.gstRate}%</td>
                <td>{formatCurrency(item.salePrice)}</td>
                <td>
                  {item.trackStock ? (
                    <span
                      className={
                        item.lowStockAlert != null &&
                        item.stockQty <= item.lowStockAlert
                          ? "text-red-600 font-medium"
                          : ""
                      }
                    >
                      {item.stockQty} {item.unit}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

