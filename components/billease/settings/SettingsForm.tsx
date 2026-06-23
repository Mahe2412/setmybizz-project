"use client";

import { INDIAN_STATES } from "@billease/shared";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Tab = "business" | "banking" | "invoice" | "terms";

export function SettingsForm({ initial }: { initial: Record<string, unknown> }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("business");
  const [form, setForm] = useState({
    name: (initial.name as string) ?? "",
    legalName: (initial.legalName as string) ?? "",
    gstin: (initial.gstin as string) ?? "",
    stateCode: (initial.stateCode as string) ?? "27",
    address: (initial.address as string) ?? "",
    city: (initial.city as string) ?? "",
    pincode: (initial.pincode as string) ?? "",
    phone: (initial.phone as string) ?? "",
    email: (initial.email as string) ?? "",
    invoicePrefix: (initial.invoicePrefix as string) ?? "INV",
    bankName: (initial.bankName as string) ?? "",
    bankAccount: (initial.bankAccount as string) ?? "",
    bankIfsc: (initial.bankIfsc as string) ?? "",
    bankBranch: (initial.bankBranch as string) ?? "",
    upiId: (initial.upiId as string) ?? "",
    signatory: (initial.signatory as string) ?? "",
    termsAndConditions: (initial.termsAndConditions as string) ?? "1. Goods once sold will not be taken back.\n2. Payment due within 30 days.\n3. Subject to local jurisdiction.",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    await fetch("/api/business", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setSaved(true);
    router.refresh();
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "business", label: "Business Info", icon: "🏢" },
    { id: "banking", label: "Bank & UPI", icon: "🏦" },
    { id: "invoice", label: "Invoice Config", icon: "🧾" },
    { id: "terms", label: "Terms & Notes", icon: "📋" },
  ];

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-1 border border-slate-200 rounded-xl p-1 bg-slate-50 w-full overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex-1 justify-center ${
              activeTab === t.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Business Info */}
      {activeTab === "business" && (
        <div className="card space-y-4">
          <h2 className="font-bold text-slate-800">Business Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Business Name *</label>
              <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div>
              <label className="label">Legal Name</label>
              <input className="input" value={form.legalName} onChange={(e) => set("legalName", e.target.value)} />
            </div>
            <div>
              <label className="label">GSTIN</label>
              <input className="input font-mono uppercase" value={form.gstin} onChange={(e) => set("gstin", e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" maxLength={15} />
            </div>
            <div>
              <label className="label">State</label>
              <select className="input" value={form.stateCode} onChange={(e) => set("stateCode", e.target.value)}>
                {Object.entries(INDIAN_STATES).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="billing@yourbusiness.com" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Address</label>
              <textarea className="input" rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Street, Area" />
            </div>
            <div>
              <label className="label">City</label>
              <input className="input" value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div>
              <label className="label">Pincode</label>
              <input className="input" value={form.pincode} onChange={(e) => set("pincode", e.target.value)} maxLength={6} />
            </div>
          </div>
        </div>
      )}

      {/* Bank & UPI */}
      {activeTab === "banking" && (
        <div className="card space-y-4">
          <div>
            <h2 className="font-bold text-slate-800">Bank & Payment Details</h2>
            <p className="text-xs text-slate-500 mt-1">These details will be printed on your invoices so customers can pay via bank transfer.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Bank Name</label>
              <input className="input" value={form.bankName} onChange={(e) => set("bankName", e.target.value)} placeholder="State Bank of India" />
            </div>
            <div>
              <label className="label">Account Number</label>
              <input className="input font-mono" value={form.bankAccount} onChange={(e) => set("bankAccount", e.target.value)} placeholder="1234 5678 9012" />
            </div>
            <div>
              <label className="label">IFSC Code</label>
              <input className="input font-mono uppercase" value={form.bankIfsc} onChange={(e) => set("bankIfsc", e.target.value.toUpperCase())} placeholder="SBIN0001234" maxLength={11} />
            </div>
            <div>
              <label className="label">Branch</label>
              <input className="input" value={form.bankBranch} onChange={(e) => set("bankBranch", e.target.value)} placeholder="MG Road, Hyderabad" />
            </div>
            <div className="md:col-span-2">
              <label className="label">UPI ID</label>
              <input className="input" value={form.upiId} onChange={(e) => set("upiId", e.target.value)} placeholder="yourbusiness@upi" />
              <p className="text-xs text-slate-400 mt-1">Used to generate UPI payment links in invoice notifications.</p>
            </div>
          </div>
          {(form.bankName || form.bankAccount) && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-700 space-y-1">
              <p className="font-bold">Preview: Invoice PDF Bank Details</p>
              <p>Bank: {form.bankName || "—"} | A/C: {form.bankAccount || "—"} | IFSC: {form.bankIfsc || "—"}</p>
              {form.upiId && <p>UPI: {form.upiId}</p>}
            </div>
          )}
        </div>
      )}

      {/* Invoice Config */}
      {activeTab === "invoice" && (
        <div className="card space-y-4">
          <div>
            <h2 className="font-bold text-slate-800">Invoice Configuration</h2>
            <p className="text-xs text-slate-500 mt-1">Customize the numbering format for your documents.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Invoice Prefix</label>
              <input className="input" value={form.invoicePrefix} onChange={(e) => set("invoicePrefix", e.target.value)} placeholder="INV" />
              <p className="text-xs text-slate-400 mt-1">e.g. INV-0001</p>
            </div>
          </div>
          <div>
            <label className="label">Authorized Signatory Name</label>
            <input className="input" value={form.signatory} onChange={(e) => set("signatory", e.target.value)} placeholder="Owner / Manager name" />
            <p className="text-xs text-slate-400 mt-1">Printed at the bottom-right of your PDF invoice as "Authorized Signatory".</p>
          </div>
        </div>
      )}

      {/* Terms & Conditions */}
      {activeTab === "terms" && (
        <div className="card space-y-4">
          <div>
            <h2 className="font-bold text-slate-800">Terms & Conditions</h2>
            <p className="text-xs text-slate-500 mt-1">Printed at the bottom of every invoice.</p>
          </div>
          <textarea
            className="input min-h-[160px] font-mono text-xs"
            value={form.termsAndConditions}
            onChange={(e) => set("termsAndConditions", e.target.value)}
            placeholder="Enter your terms and conditions..."
            rows={8}
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving…" : "Save Settings"}
        </button>
        {saved && (
          <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
            ✓ Saved successfully
          </span>
        )}
      </div>
    </form>
  );
}

