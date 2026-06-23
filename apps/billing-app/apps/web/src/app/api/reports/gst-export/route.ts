import { prisma } from "@billease/db";
import { requireBusinessId } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { businessId } = await requireBusinessId();

    const sales = await prisma.document.findMany({
      where: {
        businessId,
        status: "finalized",
        type: { in: ["invoice", "bill_of_supply"] },
      },
      include: { party: true, lines: true },
    });

    const b2b: any[] = [];
    const b2cs: any[] = [];
    const hsnSummary: Record<string, {
      hsn_sc: string;
      desc: string;
      uqc: string;
      qty: number;
      val: number;
      txval: number;
      iamt: number;
      camt: number;
      samt: number;
    }> = {};

    for (const doc of sales) {
      const isRegistered = !!doc.party?.gstin;
      const invoiceDate = doc.date.toISOString().split("T")[0];

      if (isRegistered) {
        b2b.push({
          ctin: doc.party?.gstin,
          inv: [
            {
              inum: doc.number,
              idt: invoiceDate,
              val: doc.grandTotal,
              pos: doc.placeOfSupply || doc.party?.stateCode,
              rchrg: "N",
              inv_typ: "R",
              itms: doc.lines.map((l, index) => ({
                num: index + 1,
                itm_det: {
                  ty: l.gstRate,
                  txval: l.taxableValue,
                  iamt: l.igst,
                  camt: l.cgst,
                  samt: l.sgst,
                  csamt: 0,
                },
              })),
            },
          ],
        });
      } else {
        b2cs.push({
          sply_ty: doc.igstTotal > 0 ? "INTER" : "INTRA",
          txval: doc.taxableTotal,
          typ: "OE",
          pos: doc.placeOfSupply || "27",
          rt: doc.lines[0]?.gstRate || 18,
          iamt: doc.igstTotal,
          camt: doc.cgstTotal,
          samt: doc.sgstTotal,
          csamt: 0,
        });
      }

      // Group by HSN/SAC
      for (const line of doc.lines) {
        const hsn = line.hsnSac || "9999"; // default service code if blank
        const key = `${hsn}-${line.gstRate}`;
        if (!hsnSummary[key]) {
          hsnSummary[key] = {
            hsn_sc: hsn,
            desc: line.description,
            uqc: line.unit.toUpperCase(),
            qty: 0,
            val: 0,
            txval: 0,
            iamt: 0,
            camt: 0,
            samt: 0,
          };
        }
        hsnSummary[key].qty += line.qty;
        hsnSummary[key].val += line.lineTotal;
        hsnSummary[key].txval += line.taxableValue;
        hsnSummary[key].iamt += line.igst;
        hsnSummary[key].camt += line.cgst;
        hsnSummary[key].samt += line.sgst;
      }
    }

    return NextResponse.json({
      gst_version: "GSTR-1 v2.0",
      b2b,
      b2cs,
      hsn: {
        data: Object.values(hsnSummary),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to export GST data" }, { status: 500 });
  }
}
