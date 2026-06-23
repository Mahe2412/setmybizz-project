"use client";

import { INDIAN_STATES } from "@billease/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PartyForm({
  initial,
  partyId,
}: {
  initial?: Record<string, unknown>;
  partyId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    type: (initial?.type as string) ?? "customer",
    name: (initial?.name as string) ?? "",
    gstin: (initial?.gstin as string) ?? "",
    phone: (initial?.phone as string) ?? "",
    email: (initial?.email as string) ?? "",
    billingAddress: (initial?.billingAddress as string) ?? "",
    stateCode: (initial?.stateCode as string) ?? "27",
    openingBalance: (initial?.openingBalance as number) ?? 0,
  });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const url = partyId ? `/api/parties/${partyId}` : "/api/parties";
    const method = partyId ? "PATCH" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);
    router.push("/parties");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card max-w-lg space-y-4">
      <div>
        <label className="label">Type</label>
        <select
          className="input"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="customer">Customer</option>
          <option value="supplier">Supplier</option>
        </select>
      </div>
      <div>
        <label className="label">Name *</label>
        <input
          className="input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="label">GSTIN</label>
        <input
          className="input"
          value={form.gstin}
          onChange={(e) => setForm({ ...form, gstin: e.target.value })}
        />
      </div>
      <div>
        <label className="label">State</label>
        <select
          className="input"
          value={form.stateCode}
          onChange={(e) => setForm({ ...form, stateCode: e.target.value })}
        >
          {Object.entries(INDIAN_STATES).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Phone</label>
        <input
          className="input"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>
      <div>
        <label className="label">Billing address</label>
        <textarea
          className="input"
          rows={2}
          value={form.billingAddress}
          onChange={(e) => setForm({ ...form, billingAddress: e.target.value })}
        />
      </div>
      <div>
        <label className="label">Opening balance</label>
        <input
          type="number"
          className="input"
          value={form.openingBalance}
          onChange={(e) =>
            setForm({ ...form, openingBalance: Number(e.target.value) })
          }
        />
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Saving..." : "Save party"}
      </button>
    </form>
  );
}
