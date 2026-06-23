import { prisma } from "@billease/db";
import { getPartyBalance } from "@/lib/billease/ledger";
import { requireBusinessId } from "@/lib/billease/session";
import { formatCurrency, formatDate } from "@/lib/billease/utils";
import { PartyForm } from "@/components/billease/parties/PartyForm";
import { PaymentForm } from "@/components/billease/payments/PaymentForm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, ArrowDown, ArrowUp, Plus } from "lucide-react";

export default async function PartyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { businessId } = await requireBusinessId();
  const { id } = await params;

  const party = await prisma.party.findFirst({
    where: { id, businessId },
  });

  if (!party) notFound();

  const balance = await getPartyBalance(businessId, id);

  const documents = await prisma.document.findMany({
    where: { partyId: id, businessId },
    orderBy: { date: "desc" },
  });

  const payments = await prisma.payment.findMany({
    where: { partyId: id, businessId },
    orderBy: { date: "desc" },
  });

  // Merge and sort ledger entries
  type LedgerEntry = {
    date: Date | null;
    type?: "invoice" | "payment";
    label: string;
    ref?: string;
    id?: string;
    debit: number;
    credit: number;
  };

  const ledger: LedgerEntry[] = [
    ...documents
      .filter((d) => d.status === "finalized")
      .map((d) => ({
        date: d.date,
        type: "invoice" as const,
        label: d.type === "purchase" ? "Purchase" : "Invoice",
        ref: d.number ?? undefined,
        id: d.id,
        debit: party.type === "customer" ? d.grandTotal : 0,
        credit: party.type === "supplier" ? d.grandTotal : 0,
      })),
    ...payments.map((p) => ({
      date: p.date,
      type: "payment" as const,
      label: `Payment (${p.mode})`,
      ref: p.reference ?? undefined,
      debit: party.type === "supplier" ? p.amount : 0,
      credit: party.type === "customer" ? p.amount : 0,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Running balance
  let running = party.openingBalance;
  const ledgerWithBalance: (LedgerEntry & { balance: number })[] = [
    ...(party.openingBalance !== 0
      ? [{ date: null, label: "Opening Balance", debit: 0, credit: 0, balance: party.openingBalance }]
      : []),
    ...ledger.map((entry) => {
      running += entry.debit - entry.credit;
      return { ...entry, balance: running };
    }),
  ];

  const totalInvoiced = documents.filter(d => d.status === "finalized").reduce((s, d) => s + d.grandTotal, 0);
  const totalPaid = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/parties" className="text-sm text-slate-400 hover:text-blue-600 transition-colors">
              ← Parties
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{party.name}</h1>
          <p className="text-sm text-slate-500 capitalize">{party.type} · {party.phone ?? "No phone"}</p>
        </div>
        <Link
          href="/invoices/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-md"
        >
          <Plus className="h-3.5 w-3.5" /> New Invoice
        </Link>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500 mb-1">Total Invoiced</p>
          <p className="text-xl font-black text-slate-800">{formatCurrency(totalInvoiced)}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-xs font-medium text-emerald-600 mb-1">Total Received</p>
          <p className="text-xl font-black text-emerald-700">{formatCurrency(totalPaid)}</p>
        </div>
        <div className={`rounded-2xl border p-5 shadow-sm ${balance > 0 ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"}`}>
          <p className={`text-xs font-medium mb-1 ${balance > 0 ? "text-amber-600" : "text-slate-500"}`}>
            {balance > 0 ? "Balance Due" : "Credit Balance"}
          </p>
          <p className={`text-xl font-black ${balance > 0 ? "text-amber-700" : "text-slate-800"}`}>
            {formatCurrency(Math.abs(balance))}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Ledger - main area */}
        <div className="md:col-span-3 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-sm">Account Statement</h2>
              <span className="text-xs text-slate-400">{ledger.length} transactions</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Debit</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Credit</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerWithBalance.map((entry, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {entry.date ? formatDate(entry.date) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {entry.type === "invoice" ? (
                            <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                              <FileText className="h-2.5 w-2.5 text-blue-600" />
                            </span>
                          ) : entry.type === "payment" ? (
                            <span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                              <ArrowDown className="h-2.5 w-2.5 text-emerald-600" />
                            </span>
                          ) : null}
                          <div>
                            <p className="font-medium text-slate-700 text-xs">
                              {entry.type === "invoice" && entry.id ? (
                                <Link href={`/invoices/${entry.id}`} className="text-blue-600 hover:underline">
                                  {entry.label} {entry.ref}
                                </Link>
                              ) : (
                                <span>{entry.label}</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-xs font-medium text-rose-600">
                        {entry.debit > 0 ? formatCurrency(entry.debit) : "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-xs font-medium text-emerald-600">
                        {entry.credit > 0 ? formatCurrency(entry.credit) : "—"}
                      </td>
                      <td className={`px-4 py-3 text-right text-xs font-bold ${entry.balance > 0 ? "text-amber-700" : "text-slate-800"}`}>
                        {formatCurrency(Math.abs(entry.balance))}
                        {entry.balance > 0 ? " Dr" : entry.balance < 0 ? " Cr" : ""}
                      </td>
                    </tr>
                  ))}
                  {ledgerWithBalance.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">
                        No transactions yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:col-span-2 space-y-4">
          {/* Quick Payment */}
          {balance > 0 && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm mb-3">Record Payment</h3>
              <PaymentForm partyId={id} />
            </div>
          )}

          {/* Party Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm mb-3">Party Details</h3>
            <PartyForm partyId={id} initial={party as unknown as Record<string, unknown>} />
          </div>
        </div>
      </div>
    </div>
  );
}
