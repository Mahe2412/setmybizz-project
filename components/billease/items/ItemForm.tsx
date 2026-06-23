"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ItemForm({
  initial,
  itemId,
}: {
  initial?: Record<string, unknown>;
  itemId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: (initial?.name as string) ?? "",
    unit: (initial?.unit as string) ?? "pcs",
    hsnSac: (initial?.hsnSac as string) ?? "",
    gstRate: (initial?.gstRate as number) ?? 18,
    salePrice: (initial?.salePrice as number) ?? 0,
    purchasePrice: (initial?.purchasePrice as number) ?? 0,
    trackStock: (initial?.trackStock as boolean) ?? false,
    stockQty: (initial?.stockQty as number) ?? 0,
    lowStockAlert: (initial?.lowStockAlert as number) ?? 10,
  });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const url = itemId ? `/api/items/${itemId}` : "/api/items";
    const method = itemId ? "PATCH" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);
    router.push("/items");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card max-w-lg space-y-4">
      <div>
        <label className="label">Name *</label>
        <input
          className="input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Unit</label>
          <input
            className="input"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          />
        </div>
        <div>
          <label className="label">HSN/SAC</label>
          <input
            className="input"
            value={form.hsnSac}
            onChange={(e) => setForm({ ...form, hsnSac: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="label">GST %</label>
        <input
          type="number"
          className="input"
          value={form.gstRate}
          onChange={(e) => setForm({ ...form, gstRate: Number(e.target.value) })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Sale price</label>
          <input
            type="number"
            className="input"
            value={form.salePrice}
            onChange={(e) => setForm({ ...form, salePrice: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="label">Purchase price</label>
          <input
            type="number"
            className="input"
            value={form.purchasePrice}
            onChange={(e) =>
              setForm({ ...form, purchasePrice: Number(e.target.value) })
            }
          />
        </div>
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.trackStock}
          onChange={(e) => setForm({ ...form, trackStock: e.target.checked })}
        />
        <span className="text-sm">Track stock</span>
      </label>
      {form.trackStock && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Stock qty</label>
            <input
              type="number"
              className="input"
              value={form.stockQty}
              onChange={(e) => setForm({ ...form, stockQty: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="label">Low stock alert</label>
            <input
              type="number"
              className="input"
              value={form.lowStockAlert}
              onChange={(e) =>
                setForm({ ...form, lowStockAlert: Number(e.target.value) })
              }
            />
          </div>
        </div>
      )}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Saving..." : "Save item"}
      </button>
    </form>
  );
}

