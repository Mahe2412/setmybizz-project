import { prisma } from "@billease/db";
import { InvoicePdf } from "@/components/billease/invoice/InvoicePdf";
import { requireBusinessId } from "@/lib/billease/session";
import { formatDate } from "@/lib/billease/utils";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { businessId } = await requireBusinessId();
  const { id } = await params;

  const doc = await prisma.document.findFirst({
    where: { id, businessId },
    include: {
      lines: { orderBy: { sortOrder: "asc" } },
      party: true,
      business: true,
    },
  });

  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const pdfData = {
    business: {
      name: doc.business.name,
      legalName: doc.business.legalName,
      gstin: doc.business.gstin,
      address: doc.business.address,
      city: doc.business.city,
      pincode: doc.business.pincode,
      phone: doc.business.phone,
      email: doc.business.email,
      stateCode: doc.business.stateCode,
      bankName: (doc.business as any).bankName ?? null,
      bankAccount: (doc.business as any).bankAccount ?? null,
      bankIfsc: (doc.business as any).bankIfsc ?? null,
      bankBranch: (doc.business as any).bankBranch ?? null,
      upiId: (doc.business as any).upiId ?? null,
      signatory: (doc.business as any).signatory ?? null,
      termsAndConditions: (doc.business as any).termsAndConditions ?? null,
    },
    document: {
      number: doc.number,
      type: doc.type,
      date: formatDate(doc.date),
      dueDate: doc.dueDate ? formatDate(doc.dueDate) : null,
      placeOfSupply: doc.placeOfSupply,
      cgstTotal: doc.cgstTotal,
      sgstTotal: doc.sgstTotal,
      igstTotal: doc.igstTotal,
      grandTotal: doc.grandTotal,
      roundOff: doc.roundOff,
      taxableTotal: doc.taxableTotal,
      notes: doc.notes,
    },
    party: doc.party
      ? {
          name: doc.party.name,
          gstin: doc.party.gstin,
          phone: doc.party.phone,
          billingAddress: doc.party.billingAddress,
          stateCode: doc.party.stateCode,
        }
      : null,
    lines: doc.lines.map((l) => ({
      description: l.description,
      hsnSac: l.hsnSac,
      qty: l.qty,
      unit: l.unit,
      rate: l.rate,
      discountPct: l.discountPct,
      gstRate: l.gstRate,
      taxableValue: l.taxableValue,
      cgst: l.cgst,
      sgst: l.sgst,
      igst: l.igst,
      lineTotal: l.lineTotal,
    })),
  };

  const { searchParams } = new URL(_req.url);
  const theme = searchParams.get("theme") || "classic";

  const buffer = await renderToBuffer(<InvoicePdf data={pdfData} theme={theme} />);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${doc.number ?? "draft"}.pdf"`,
    },
  });
}
