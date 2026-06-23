import { prisma } from "@billease/db";
import { requireBusinessId } from "@/lib/billease/session";
import { formatDate } from "@/lib/billease/utils";
import { StockAdjustForm } from "@/components/billease/inventory/StockAdjustForm";

export default async function InventoryPage() {
  const { businessId } = await requireBusinessId();

  const items = await prisma.item.findMany({
    where: { businessId, trackStock: true },
    orderBy: { name: "asc" },
  });

  const movements = await prisma.stockMovement.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
    take: 30,
    include: { item: true },
  });

  const lowStock = items.filter(
    (i) => i.lowStockAlert != null && i.stockQty <= (i.lowStockAlert ?? 0)
  );

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Inventory</h1>

      {lowStock.length > 0 && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
          <h2 className="font-semibold text-orange-800">Low stock alert</h2>
          <ul className="mt-2 text-sm text-orange-700">
            {lowStock.map((i) => (
              <li key={i.id}>
                {i.name}: {i.stockQty} {i.unit} (alert at {i.lowStockAlert})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card">
        <h2 className="mb-4 font-semibold">Adjust stock</h2>
        <StockAdjustForm items={items} />
      </div>

      <div className="card">
        <h2 className="mb-4 font-semibold">Stock levels</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th>Item</th>
              <th>Qty</th>
              <th>Alert at</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-b">
                <td className="py-2">{i.name}</td>
                <td
                  className={
                    i.lowStockAlert != null && i.stockQty <= i.lowStockAlert
                      ? "text-red-600 font-medium"
                      : ""
                  }
                >
                  {i.stockQty} {i.unit}
                </td>
                <td>{i.lowStockAlert ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2 className="mb-4 font-semibold">Recent movements</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th>Date</th>
              <th>Item</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Ref</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id} className="border-b">
                <td className="py-2">{formatDate(m.createdAt)}</td>
                <td>{m.item.name}</td>
                <td>{m.type}</td>
                <td className={m.qty < 0 ? "text-red-600" : "text-green-600"}>
                  {m.qty > 0 ? "+" : ""}
                  {m.qty}
                </td>
                <td>{m.reference ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

