import { prisma } from "@billease/db";
import { InvoiceEditor } from "@/components/invoice/InvoiceEditor";
import { requireBusinessId } from "@/lib/session";

export default async function NewPurchasePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { businessId } = await requireBusinessId();
  const { type } = await searchParams;

  const docType = type === "po" ? "purchase_order" : "purchase";
  const title = type === "po" ? "Purchase Order" : "Purchase Bill";

  const business = await prisma.business.findUniqueOrThrow({
    where: { id: businessId },
  });

  const parties = await prisma.party.findMany({
    where: { businessId, type: "supplier" },
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
