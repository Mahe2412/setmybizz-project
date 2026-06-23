import { prisma } from "@billease/db";
import { InvoiceEditor } from "@/components/invoice/InvoiceEditor";
import { requireBusinessId } from "@/lib/session";
import { formatCurrency, formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function PurchaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { businessId } = await requireBusinessId();
  const { id } = await params;

  const doc = await prisma.document.findFirst({
    where: { id, businessId, type: "purchase" },
    include: { lines: { orderBy: { sortOrder: "asc" } }, business: true },
  });

  if (!doc) notFound();

  const parties = await prisma.party.findMany({
    where: { businessId, type: "supplier" },
  });
  const items = await prisma.item.findMany({ where: { businessId } });

  if (doc.status !== "draft") {
    return (
      <div>
        <h1 className="text-2xl font-bold">{doc.number}</h1>
        <p className="text-slate-500">{formatDate(doc.date)} · {doc.status}</p>
        <p className="mt-4 text-xl font-bold">{formatCurrency(doc.grandTotal)}</p>
        <a href={`/api/documents/${doc.id}/pdf`} className="btn-secondary mt-4 inline-block">
          PDF
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit purchase</h1>
      <InvoiceEditor
        documentId={doc.id}
        initial={{
          partyId: doc.partyId ?? undefined,
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
        docType="purchase"
      />
    </div>
  );
}
