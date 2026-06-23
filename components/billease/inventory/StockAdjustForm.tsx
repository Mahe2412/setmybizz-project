"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function StockAdjustForm({
  items,
}: {
  items: { id: string; name: string; stockQty: number; unit: string }[];
}) {
  const router = useRouter();
  const [itemId, setItemId] = useState(items[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [type, setType] = useState<"in" | "out">("in");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, qty, type, notes }),
    });

    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="label">Item</label>
        <select className="input" value={itemId} onChange={(e) => setItemId(e.target.value)}>
          {items.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name} ({i.stockQty} {i.unit})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Type</label>
        <select className="input" value={type} onChange={(e) => setType(e.target.value as "in" | "out")}>
          <option value="in">Stock in</option>
          <option value="out">Stock out</option>
        </select>
      </div>
      <div>
        <label className="label">Qty</label>
        <input
          type="number"
          className="input w-24"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          min={1}
        />
      </div>
      <div>
        <label className="label">Notes</label>
        <input className="input" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        Adjust
      </button>
    </form>
  );
}

