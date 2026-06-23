import { prisma } from "@billease/db";
import { requireBusinessId } from "@/lib/session";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PaymentForm } from "@/components/payments/PaymentForm";
import {
  CreditCard,
  Calendar,
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
  User,
  ArrowLeft,
  FileText
} from "lucide-react";
import Link from "next/link";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ documentId?: string }>;
}) {
  const { businessId } = await requireBusinessId();
  const { documentId } = await searchParams;

  const payments = await prisma.payment.findMany({
    where: { businessId },
    include: { party: true, document: true },
    orderBy: { date: "desc" },
    take: 50,
  });

  // Calculate stats
  const cashTotal = payments.filter(p => p.mode === "cash").reduce((acc, curr) => acc + curr.amount, 0);
  const onlineTotal = payments.filter(p => p.mode !== "cash").reduce((acc, curr) => acc + curr.amount, 0);
  const totalReceived = cashTotal + onlineTotal;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Payments Timeline</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Chronological log and ledger updates of all client transactions and receivables.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Collected</p>
            <p className="text-xl font-black text-slate-800 mt-0.5">{formatCurrency(totalReceived)}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ArrowDownCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Online / UPI</p>
            <p className="text-xl font-black text-slate-800 mt-0.5">{formatCurrency(onlineTotal)}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <ArrowUpCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Cash Payments</p>
            <p className="text-xl font-black text-slate-800 mt-0.5">{formatCurrency(cashTotal)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Record Form Panel */}
        <div className="card border border-slate-200/80 bg-white rounded-2xl p-5 shadow-sm h-fit">
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-4">Record Client Payment</h2>
          <PaymentForm documentId={documentId} />
        </div>

        {/* Chronological Timeline View */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">Transaction History</h2>

          {payments.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
              No payments logged yet.
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-200 pl-6 ml-4 space-y-6 py-2">
              {payments.map((p) => {
                const isCash = p.mode === "cash";
                return (
                  <div key={p.id} className="relative group">
                    {/* Timeline Node Point */}
                    <div className={`absolute left-[-31px] top-1.5 h-4 w-4 rounded-full border-2 bg-white transition-all group-hover:scale-110 ${
                      isCash ? "border-amber-500" : "border-emerald-500"
                    }`} />

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md transition-all space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-slate-400">{formatDate(p.date)}</span>
                          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            {p.party?.name ?? "Walk-in Customer"}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-800 block">{formatCurrency(p.amount)}</span>
                          <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                            isCash ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                          }`}>
                            {p.mode}
                          </span>
                        </div>
                      </div>

                      {p.document && (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 w-fit">
                          <FileText className="h-3 w-3 text-slate-400" />
                          <span>Linked to document:</span>
                          <Link href={`/invoices/${p.document.id}`} className="text-blue-600 hover:underline">
                            {p.document.number ?? "Draft"}
                          </Link>
                        </div>
                      )}

                      {p.notes && (
                        <p className="text-[11px] text-slate-400 italic">
                          "{p.notes}"
                        </p>
                      )}
                      
                      {p.reference && (
                        <span className="text-[9px] font-mono text-slate-400 block">
                          Ref: {p.reference}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
