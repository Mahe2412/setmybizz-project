"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PaymentForm({
  partyId,
  documentId,
  maxAmount,
}: {
  partyId?: string;
  documentId?: string;
  maxAmount?: number;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(maxAmount ?? 0);
  const [mode, setMode] = useState("upi");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partyId,
        documentId,
        amount,
        mode,
        reference,
        date: new Date().toISOString(),
      }),
    });

    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="label">Amount</label>
        <input
          type="number"
          className="input w-32"
          value={amount}
          max={maxAmount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label className="label">Mode</label>
        <select className="input" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
          <option value="bank">Bank</option>
          <option value="cheque">Cheque</option>
          <option value="card">Card</option>
        </select>
      </div>
      <div>
        <label className="label">Reference</label>
        <input
          className="input"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="UPI ref / cheque no"
        />
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Saving..." : "Record payment"}
      </button>
    </form>
  );
}

