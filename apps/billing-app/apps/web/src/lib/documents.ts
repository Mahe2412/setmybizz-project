import { prisma } from "@billease/db";
import {
  calculateDocumentTotals,
  calculateLineTax,
  isInterState,
  type GstLineInput,
} from "@billease/shared";

export type LineInput = GstLineInput & {
  itemId?: string;
  description: string;
  hsnSac?: string;
  unit?: string;
};

export async function computeAndSaveDocumentLines(
  documentId: string,
  businessStateCode: string,
  placeOfSupply: string,
  lines: LineInput[]
) {
  const inter = isInterState(businessStateCode, placeOfSupply);

  await prisma.documentLine.deleteMany({ where: { documentId } });

  const computed = lines.map((line, i) => {
    const tax = calculateLineTax(line, inter);
    return {
      documentId,
      itemId: line.itemId,
      description: line.description,
      hsnSac: line.hsnSac,
      qty: line.qty,
      unit: line.unit ?? "pcs",
      rate: line.rate,
      discountPct: line.discountPct ?? 0,
      gstRate: line.gstRate,
      taxableValue: tax.taxableValue,
      cgst: tax.cgst,
      sgst: tax.sgst,
      igst: tax.igst,
      lineTotal: tax.lineTotal,
      sortOrder: i,
    };
  });

  await prisma.documentLine.createMany({ data: computed });

  const totals = calculateDocumentTotals(
    computed.map((c) => ({
      taxableValue: c.taxableValue,
      cgst: c.cgst,
      sgst: c.sgst,
      igst: c.igst,
      lineTotal: c.lineTotal,
    }))
  );

  return { computed, totals, inter };
}

export async function getNextDocumentNumber(
  businessId: string,
  type: string
): Promise<string> {
  const business = await prisma.business.findUniqueOrThrow({
    where: { id: businessId },
  });

  let prefix: string;
  let num: number;
  const update: Record<string, number> = {};

  switch (type) {
    case "quotation":
      prefix = business.quotationPrefix;
      num = business.quotationNextNum;
      update.quotationNextNum = num + 1;
      break;
    case "purchase":
      prefix = business.purchasePrefix;
      num = business.purchaseNextNum;
      update.purchaseNextNum = num + 1;
      break;
    case "invoice":
      prefix = business.invoicePrefix;
      num = business.invoiceNextNum;
      update.invoiceNextNum = num + 1;
      break;
    default:
      // Dynamically count other types (credit_note, proforma, challan, purchase_order)
      const typePrefixes: Record<string, string> = {
        credit_note: "CN",
        proforma: "PRO",
        challan: "CH",
        purchase_order: "PO",
      };
      prefix = typePrefixes[type] ?? "DOC";
      const docCount = await prisma.document.count({
        where: { businessId, type },
      });
      num = docCount + 1;
  }

  if (Object.keys(update).length > 0) {
    await prisma.business.update({
      where: { id: businessId },
      data: update,
    });
  }

  return `${prefix}-${String(num).padStart(4, "0")}`;
}

export async function adjustStockForDocument(
  documentId: string,
  direction: "out" | "in"
) {
  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    include: { lines: { include: { item: true } } },
  });
  if (!doc) return;

  const isSale = ["invoice", "bill_of_supply"].includes(doc.type);
  const isPurchase = doc.type === "purchase";

  for (const line of doc.lines) {
    if (!line.itemId || !line.item?.trackStock) continue;

    const delta =
      direction === "out"
        ? isSale
          ? -line.qty
          : isPurchase
            ? line.qty
            : 0
        : isSale
          ? line.qty
          : isPurchase
            ? -line.qty
            : 0;

    if (delta === 0) continue;

    await prisma.item.update({
      where: { id: line.itemId },
      data: { stockQty: { increment: delta } },
    });

    await prisma.stockMovement.create({
      data: {
        businessId: doc.businessId,
        itemId: line.itemId,
        qty: delta,
        type: direction === "out" ? (isSale ? "sale" : "purchase") : "reversal",
        reference: doc.number ?? doc.id,
        notes: `Document ${doc.number ?? doc.id} ${direction}`,
      },
    });
  }
}
