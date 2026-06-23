import { prisma } from "@billease/db";
import { InvoiceEditor } from "@/components/invoice/InvoiceEditor";
import { InvoiceActions } from "@/components/invoice/InvoiceActions";
import { requireBusinessId } from "@/lib/session";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PaymentForm } from "@/components/payments/PaymentForm";
import { ConvertQuotationButton } from "@/components/invoice/ConvertQuotationButton";
import { ComplianceCenter } from "@/components/invoice/ComplianceCenter";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { businessId } = await requireBusinessId();
  const { id } = await params;

  const doc = await prisma.document.findFirst({
    where: { id, businessId },
    include: {
      lines: { orderBy: { sortOrder: "asc" } },
      party: true,
      payments: true,
      business: true,
    },
  });

  if (!doc) notFound();

  const parties = await prisma.party.findMany({
    where: { businessId, type: "customer" },
  });

  const items = await prisma.item.findMany({ where: { businessId } });

  const paid = doc.payments.reduce((s, p) => s + p.amount, 0);
  const due = doc.grandTotal - paid;
  const isQuotation = doc.type === "quotation";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/invoices" className="text-sm text-slate-400 hover:text-blue-600 transition-colors">
              ← {isQuotation ? "Quotations" : "Invoices"}
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {doc.number ?? "Draft"}&nbsp;
            <span className="text-sm font-normal text-slate-500 capitalize">— {doc.type.replace(/_/g, " ")}</span>
          </h1>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-sm text-slate-500">{formatDate(doc.date)}</span>
            <StatusBadge status={doc.status} />
            {doc.dueDate && (
              <span className="text-xs text-amber-600 font-medium">
                Due: {formatDate(doc.dueDate)}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Convert Quotation to Invoice */}
          {isQuotation && doc.status === "finalized" && (
            <ConvertQuotationButton documentId={doc.id} />
          )}

          {doc.status === "finalized" && due > 0 && (
            <Link href={`/payments?documentId=${doc.id}`} className="btn-primary text-xs">
              Record Payment
            </Link>
          )}
        </div>
      </div>

      {doc.status === "finalized" ? (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              {/* Payment Summary */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="font-bold text-slate-800 text-sm mb-4">Payment Summary</h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500 mb-1">Invoice Total</p>
                    <p className="text-lg font-black text-slate-800">{formatCurrency(doc.grandTotal)}</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-3">
                    <p className="text-xs text-emerald-600 mb-1">Received</p>
                    <p className="text-lg font-black text-emerald-700">{formatCurrency(paid)}</p>
                  </div>
                  <div className={`rounded-xl p-3 ${due > 0 ? "bg-amber-50" : "bg-emerald-50"}`}>
                    <p className={`text-xs mb-1 ${due > 0 ? "text-amber-600" : "text-emerald-600"}`}>{due > 0 ? "Balance Due" : "Fully Paid"}</p>
                    <p className={`text-lg font-black ${due > 0 ? "text-amber-700" : "text-emerald-700"}`}>{formatCurrency(Math.abs(due))}</p>
                  </div>
                </div>

                {/* Payment history */}
                {doc.payments.length > 0 && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Payment History</p>
                    {doc.payments.map((p) => (
                      <div key={p.id} className="flex justify-between items-center py-1.5 text-xs text-slate-600">
                        <span className="capitalize">{p.mode}</span>
                        <span className="font-bold text-emerald-700">{formatCurrency(p.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {due > 0 && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <PaymentForm
                      partyId={doc.partyId ?? undefined}
                      documentId={doc.id}
                      maxAmount={due}
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <InvoiceActions
                docId={doc.id}
                docNumber={doc.number}
                grandTotal={doc.grandTotal}
                businessName={doc.business.name}
                businessPhone={doc.business.phone}
                partyName={doc.party?.name ?? "Customer"}
                partyPhone={doc.party?.phone}
                dueAmount={due}
              />
            </div>
          </div>
          <ComplianceCenter doc={doc} />
        </>
      ) : (
        <InvoiceEditor
          documentId={doc.id}
          initial={{
            partyId: doc.partyId ?? undefined,
            notes: doc.notes ?? undefined,
            status: doc.status,
            lines: doc.lines.map((l) => ({
              itemId: l.itemId ?? undefined,
              description: l.description,
              hsnSac: l.hsnSac ?? undefined,
              qty: l.qty,
              unit: l.unit,
              rate: l.rate,
              discountPct: l.discountPct,
              gstRate: l.gstRate,
            })),
          }}
          parties={parties}
          items={items}
          businessStateCode={doc.business.stateCode}
          docType={doc.type}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { cls: string; label: string }> = {
    draft: { cls: "bg-slate-100 text-slate-600 border-slate-200", label: "Draft" },
    finalized: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Finalized" },
    cancelled: { cls: "bg-rose-50 text-rose-700 border-rose-200", label: "Cancelled" },
  };
  const c = config[status] ?? config.draft;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${c.cls}`}>
      {c.label}
    </span>
  );
}
