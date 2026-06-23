import { prisma } from "@billease/db";
import { InvoiceEditor } from "@/components/billease/invoice/InvoiceEditor";
import { requireBusinessId } from "@/lib/billease/session";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { businessId } = await requireBusinessId();
  const { type } = await searchParams;
  
  // Resolve correct document type
  let docType = "invoice";
  let title = "Invoice";
  if (type === "quotation") {
    docType = "quotation";
    title = "Quotation";
  } else if (type === "challan") {
    docType = "challan";
    title = "Delivery Challan";
  } else if (type === "credit_note") {
    docType = "credit_note";
    title = "Credit Note";
  } else if (type === "proforma") {
    docType = "proforma";
    title = "Pro Forma Invoice";
  }

  const business = await prisma.business.findUniqueOrThrow({
    where: { id: businessId },
  });

  const parties = await prisma.party.findMany({
    where: { businessId, type: "customer" },
    orderBy: { name: "asc" },
  });

  const items = await prisma.item.findMany({
    where: { businessId },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">New {title}</h1>
      <InvoiceEditor
        parties={parties}
        items={items}
        businessStateCode={business.stateCode}
        docType={docType}
      />
    </div>
  );
}

