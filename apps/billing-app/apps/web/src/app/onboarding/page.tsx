"use client";

import { INDIAN_STATES } from "@billease/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    gstin: "",
    stateCode: "27",
    address: "",
    city: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/business", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="card w-full max-w-lg">
        <h1 className="text-xl font-bold">Set up your business</h1>
        <p className="text-sm text-slate-500">GST details help generate compliant invoices</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Business name *</label>
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
                  {name} ({code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Address</label>
            <textarea
              className="input"
              rows={2}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div>
            <label className="label">City</label>
            <input
              className="input"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
