import { prisma } from "@billease/db";
import { getPartyBalance } from "@/lib/ledger";
import { requireBusinessId } from "@/lib/session";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Plus, Users, Phone, TrendingUp } from "lucide-react";

export default async function PartiesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { businessId } = await requireBusinessId();
  const { type } = await searchParams;

  const parties = await prisma.party.findMany({
    where: {
      businessId,
      ...(type ? { type } : {}),
    },
    orderBy: { name: "asc" },
  });

  const balances = await Promise.all(
    parties.map(async (p) => ({
      id: p.id,
      balance: await getPartyBalance(businessId, p.id),
    }))
  );

  const balanceMap = Object.fromEntries(balances.map((b) => [b.id, b.balance]));

  const totalReceivable = balances
    .filter((b) => b.balance > 0)
    .reduce((s, b) => s + b.balance, 0);

  const customerCount = parties.filter((p) => p.type === "customer").length;
  const supplierCount = parties.filter((p) => p.type === "supplier").length;

  const activeType = type || "all";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Parties</h1>
          <p className="text-sm text-slate-500 mt-0.5">Customers, suppliers, and their ledger balances</p>
        </div>
        <Link
          href="/parties/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Party
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-500" />
            <p className="text-xs font-medium text-slate-500">Customers</p>
          </div>
          <p className="text-2xl font-black text-slate-800">{customerCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-indigo-500" />
            <p className="text-xs font-medium text-slate-500">Suppliers</p>
          </div>
          <p className="text-2xl font-black text-slate-800">{supplierCount}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-amber-600" />
            <p className="text-xs font-medium text-amber-600">Total Receivables</p>
          </div>
          <p className="text-xl font-black text-amber-700">{formatCurrency(totalReceivable)}</p>
        </div>
      </div>

      {/* Type Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: "all", label: "All Parties" },
          { value: "customer", label: "Customers" },
          { value: "supplier", label: "Suppliers" },
        ].map(({ value, label }) => (
          <Link
            key={value}
            href={value === "all" ? "/parties" : `/parties?type=${value}`}
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold border transition-all ${
              activeType === value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Parties Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        {parties.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="h-8 w-8 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No parties found</p>
            <Link href="/parties/new" className="btn-primary mt-4 inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Party
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">GSTIN</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Balance</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {parties.map((p) => {
                  const balance = balanceMap[p.id] ?? 0;
                  return (
                    <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <Link href={`/parties/${p.id}`} className="font-bold text-blue-600 hover:underline">
                            {p.name}
                          </Link>
                          {p.email && <p className="text-xs text-slate-400">{p.email}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize ${
                          p.type === "customer"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : "bg-indigo-50 text-indigo-700 border-indigo-100"
                        }`}>
                          {p.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.phone ? (
                          <span className="flex items-center gap-1 text-slate-600 text-xs">
                            <Phone className="h-3 w-3 text-slate-400" />
                            {p.phone}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.gstin ?? "—"}</td>
                      <td className="px-4 py-3 text-right">
                        {balance === 0 ? (
                          <span className="text-slate-300 text-xs">Nil</span>
                        ) : (
                          <span className={`font-bold text-xs ${balance > 0 ? "text-amber-700" : "text-emerald-700"}`}>
                            {formatCurrency(Math.abs(balance))}
                            <span className="font-normal ml-1">{balance > 0 ? "Dr" : "Cr"}</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-3.5">
                          <Link href={`/parties/${p.id}`} className="text-xs font-bold text-blue-600 hover:underline">
                            View
                          </Link>
                          {p.phone && (
                            <a
                              href={(() => {
                                const rawPhone = p.phone ? p.phone.replace(/\D/g, "") : "";
                                const phone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
                                let text = "";
                                if (balance > 0) {
                                  text = `Dear ${p.name},\nThis is a friendly balance followup statement from our accounts department. Your outstanding ledger balance is Dr ₹ ${Math.abs(balance).toFixed(2)}.\n\nPlease clear the amount at your earliest convenience. Thank you!`;
                                } else if (balance < 0) {
                                  text = `Dear ${p.name},\nThis is a ledger status update. Our current supplier account balance is Cr ₹ ${Math.abs(balance).toFixed(2)}.\n\nThank you!`;
                                } else {
                                  text = `Dear ${p.name},\nThis is a ledger status update. Your current outstanding balance is Nil. Thank you!`;
                                }
                                return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
                              })()}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm shadow-emerald-500/10 text-xs"
                              title="WhatsApp Followup"
                            >
                              💬
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
