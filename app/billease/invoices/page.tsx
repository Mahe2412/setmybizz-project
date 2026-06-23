import { prisma } from "@billease/db";
import { requireBusinessId } from "@/lib/billease/session";
import { formatCurrency, formatDate } from "@/lib/billease/utils";
import Link from "next/link";
import { Plus, FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>;
}) {
  const { businessId } = await requireBusinessId();
  const { status, type } = await searchParams;

  const now = new Date();

  const invoices = await prisma.document.findMany({
    where: {
      businessId,
      type: { in: type === "quotation" ? ["quotation"] : ["invoice", "bill_of_supply"] },
      ...(status && status !== "all" ? { status } : {}),
    },
    include: { party: true, payments: true },
    orderBy: { createdAt: "desc" },
  });

  // Enrich with overdue/due info
  const enriched = invoices.map((inv) => {
    const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
    const due = Math.max(0, inv.grandTotal - paid);
    const isOverdue = inv.status === "finalized" && due > 0 && inv.dueDate && new Date(inv.dueDate) < now;
    return { ...inv, paid, due, isOverdue };
  });

  const overdueCount = enriched.filter((i) => i.isOverdue).length;
  const totalOutstanding = enriched.filter(i => i.status === "finalized").reduce((s, i) => s + i.due, 0);
  const draftCount = enriched.filter((i) => i.status === "draft").length;

  const activeStatus = status || "all";
  const activeType = type || "invoice";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {activeType === "quotation" ? "Quotations" : "Invoices"}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage all your sales transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/invoices/new?type=quotation"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <FileText className="h-3.5 w-3.5" />
            New Quotation
          </Link>
          <Link
            href="/invoices/new"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
          >
            <Plus className="h-3.5 w-3.5" />
            New Invoice
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total</p>
          <p className="text-xl font-black text-slate-800 mt-1">{enriched.length}</p>
        </div>
        <div className={`rounded-xl border p-4 shadow-sm ${overdueCount > 0 ? "border-rose-200 bg-rose-50" : "border-slate-200 bg-white"}`}>
          <p className={`text-xs font-medium ${overdueCount > 0 ? "text-rose-600" : "text-slate-500"}`}>Overdue</p>
          <p className={`text-xl font-black mt-1 ${overdueCount > 0 ? "text-rose-700" : "text-slate-800"}`}>{overdueCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Drafts</p>
          <p className="text-xl font-black text-slate-800 mt-1">{draftCount}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <p className="text-xs font-medium text-amber-600">Outstanding</p>
          <p className="text-lg font-black text-amber-700 mt-1">{formatCurrency(totalOutstanding)}</p>
        </div>
      </div>

      {/* Overdue Banner */}
      {overdueCount > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <p className="text-sm font-medium text-rose-700">
            You have <strong>{overdueCount}</strong> overdue invoice{overdueCount > 1 ? "s" : ""} requiring attention.
          </p>
          <Link href={`/invoices?status=finalized`} className="ml-auto text-xs font-bold text-rose-600 underline">
            View
          </Link>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {["invoice", "quotation"].map((t) => (
          <Link
            key={t}
            href={`/invoices?type=${t}`}
            className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
              activeType === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t === "invoice" ? "Invoices" : "Quotations"}
          </Link>
        ))}
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: "all", label: "All", icon: FileText },
          { value: "draft", label: "Drafts", icon: Clock },
          { value: "finalized", label: "Finalized", icon: CheckCircle },
          { value: "cancelled", label: "Cancelled", icon: XCircle },
        ].map(({ value, label, icon: Icon }) => (
          <Link
            key={value}
            href={`/invoices?type=${activeType}&status=${value}`}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border transition-all ${
              activeStatus === value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            <Icon className="h-3 w-3" />
            {label}
          </Link>
        ))}
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        {enriched.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="h-8 w-8 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No invoices found</p>
            <p className="text-sm text-slate-400 mt-1">Create your first invoice to get started</p>
            <Link href="/invoices/new" className="btn-primary mt-4 inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create Invoice
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Number</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Party</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Balance</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {enriched.map((inv) => (
                  <tr key={inv.id} className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors ${inv.isOverdue ? "bg-rose-50/30" : ""}`}>
                    <td className="px-4 py-3 font-bold">
                      <Link href={`/invoices/${inv.id}`} className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1.5">
                        {inv.isOverdue && <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" />}
                        {inv.number ?? "Draft"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{inv.party?.name ?? <span className="text-slate-400">Walk-in</span>}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{formatDate(inv.date)}</td>
                    <td className="px-4 py-3 text-xs">
                      {inv.dueDate ? (
                        <span className={inv.isOverdue ? "font-bold text-rose-600" : "text-slate-500"}>
                          {formatDate(inv.dueDate)}
                          {inv.isOverdue && " ⚠"}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={inv.isOverdue ? "overdue" : inv.status} />
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-800">{formatCurrency(inv.grandTotal)}</td>
                    <td className="px-4 py-3 text-right">
                      {inv.due > 0 ? (
                        <span className={`font-bold text-xs ${inv.isOverdue ? "text-rose-600" : "text-amber-600"}`}>
                          {formatCurrency(inv.due)}
                        </span>
                      ) : inv.status === "finalized" ? (
                        <span className="text-emerald-600 font-bold text-xs">Paid ✓</span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3.5">
                        <Link
                          href={`/invoices/${inv.id}`}
                          className="text-xs font-bold text-blue-600 hover:underline"
                        >
                          View
                        </Link>
                        {inv.status === "finalized" && (
                          <a
                            href={(() => {
                              const rawPhone = inv.party?.phone ? inv.party.phone.replace(/\D/g, "") : "";
                              const phone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
                              const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
                              const pdf = `${baseUrl}/api/documents/${inv.id}/pdf`;
                              let text = "";
                              if (inv.type === "quotation") {
                                text = `Dear ${inv.party?.name || "Customer"}, please find the quotation estimate details below:\nQuotation No: ${inv.number}\nGrand Total: ₹ ${inv.grandTotal.toFixed(2)}\n\nDownload PDF:\n${pdf}`;
                              } else if (inv.due > 0) {
                                text = `Gentle Reminder from your billing provider. Your payment of ₹ ${inv.due.toFixed(2)} is outstanding for Invoice ${inv.number}.\n\nPlease pay instantly. Download PDF:\n${pdf}`;
                              } else {
                                text = `Dear ${inv.party?.name || "Customer"}, please find your Invoice details below:\nInvoice No: ${inv.number}\nGrand Total: ₹ ${inv.grandTotal.toFixed(2)}\n\nDownload PDF:\n${pdf}`;
                              }
                              return phone ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
                            })()}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm shadow-emerald-500/10"
                            title={inv.type === "quotation" ? "Share Quotation" : inv.due > 0 ? "Send Reminder" : "Share Invoice"}
                          >
                            💬
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { cls: string; label: string }> = {
    draft: { cls: "bg-slate-100 text-slate-600 border-slate-200", label: "Draft" },
    finalized: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Finalized" },
    cancelled: { cls: "bg-slate-100 text-slate-500 border-slate-200 line-through", label: "Cancelled" },
    overdue: { cls: "bg-rose-50 text-rose-700 border-rose-200", label: "Overdue" },
  };
  const c = config[status] ?? config.draft;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${c.cls}`}>
      {c.label}
    </span>
  );
}

