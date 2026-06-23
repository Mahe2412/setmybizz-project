/**
 * ═══════════════════════════════════════════════════════════════
 *  ARKLE GST ENGINE — GSTR-1 & GSTR-3B Computation Pipeline
 *  Handles: Invoice aggregation, ITC matching, HSN summary,
 *           B2B/B2CS/B2CL bucketing, liability computation
 * ═══════════════════════════════════════════════════════════════
 */

// ─── Types ──────────────────────────────────────────────────────

export type SupplyType = 'B2B' | 'B2CS' | 'B2CL' | 'EXPORT' | 'NIL_RATED' | 'EXEMPT';

export interface GSTInvoice {
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerGSTIN?: string;
  placeOfSupply: string;        // State code e.g. "37" for AP
  sellerStateCode: string;
  items: GSTInvoiceItem[];
  totalTaxableValue: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
  totalCESS: number;
  grandTotal: number;
  reverseCharge: boolean;
}

export interface GSTInvoiceItem {
  description: string;
  hsnCode: string;
  qty: number;
  rate: number;
  taxableValue: number;
  gstRate: number;              // 5, 12, 18, 28
  cgst: number;
  sgst: number;
  igst: number;
  cess: number;
}

export interface PurchaseInvoice {
  invoiceNumber: string;
  invoiceDate: string;
  supplierName: string;
  supplierGSTIN: string;
  items: GSTInvoiceItem[];
  totalTaxableValue: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
  totalCESS: number;
  grandTotal: number;
  itcEligible: boolean;
  itcReason?: string;           // If not eligible, why
}

// ─── GSTR-1 Result ──────────────────────────────────────────────

export interface GSTR1Result {
  period: string;
  gstin: string;

  // B2B Supplies (to registered dealers)
  b2b: {
    recipientGSTIN: string;
    invoices: {
      invoiceNumber: string;
      invoiceDate: string;
      taxableValue: number;
      cgst: number;
      sgst: number;
      igst: number;
      totalValue: number;
    }[];
    totalTaxableValue: number;
    totalTax: number;
  }[];

  // B2CS (to consumers, intra-state < ₹2.5L per invoice)
  b2cs: {
    stateCode: string;
    gstRate: number;
    taxableValue: number;
    cgst: number;
    sgst: number;
    cess: number;
  }[];

  // B2CL (to consumers, inter-state ≥ ₹2.5L per invoice)
  b2cl: {
    placeOfSupply: string;
    invoiceNumber: string;
    taxableValue: number;
    igst: number;
  }[];

  // HSN Summary
  hsnSummary: {
    hsnCode: string;
    description: string;
    uqc: string;
    totalQty: number;
    totalTaxableValue: number;
    totalCGST: number;
    totalSGST: number;
    totalIGST: number;
  }[];

  // Totals
  totalTaxableValue: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
  totalCESS: number;
  totalTax: number;
  totalInvoices: number;
}

// ─── GSTR-3B Result ─────────────────────────────────────────────

export interface GSTR3BResult {
  period: string;
  gstin: string;

  // 3.1 — Outward supplies
  outwardSupplies: {
    taxableB2B: number;
    taxableB2C: number;
    nilRatedExempt: number;
    reverseCharge: number;
    totalTaxable: number;
    totalCGST: number;
    totalSGST: number;
    totalIGST: number;
    totalCESS: number;
  };

  // 4 — Eligible ITC
  itcAvailable: {
    importOfGoods: { cgst: number; sgst: number; igst: number; cess: number };
    importOfServices: { cgst: number; sgst: number; igst: number; cess: number };
    inwardReverseCharge: { cgst: number; sgst: number; igst: number; cess: number };
    fromISD: { cgst: number; sgst: number; igst: number; cess: number };
    allOtherITC: { cgst: number; sgst: number; igst: number; cess: number };
    totalITC: { cgst: number; sgst: number; igst: number; cess: number };
  };

  // Net tax payable (after ITC)
  netTaxPayable: {
    cgst: number;
    sgst: number;
    igst: number;
    cess: number;
    total: number;
  };

  // Interest on late payment
  interest: {
    cgst: number;
    sgst: number;
    igst: number;
  };

  totalPayable: number;
}

// ═══════════════════════════════════════════════════════════════
//  GST COMPUTATION ENGINE
// ═══════════════════════════════════════════════════════════════

export class GSTFilingEngine {
  private sellerGSTIN: string;
  private sellerState: string;

  constructor(gstin: string) {
    this.sellerGSTIN = gstin;
    this.sellerState = gstin.substring(0, 2); // First 2 digits = state code
  }

  /**
   * Classify an invoice into supply type
   */
  private classifySupply(invoice: GSTInvoice): SupplyType {
    if (invoice.customerGSTIN) return 'B2B';
    const isInterState = invoice.placeOfSupply !== this.sellerState;
    if (isInterState && invoice.grandTotal >= 250000) return 'B2CL';
    return 'B2CS';
  }

  /**
   * Compute GSTR-1 from sales invoices
   */
  computeGSTR1(invoices: GSTInvoice[], period: string): GSTR1Result {
    const b2bMap = new Map<string, GSTR1Result['b2b'][0]>();
    const b2csList: GSTR1Result['b2cs'] = [];
    const b2clList: GSTR1Result['b2cl'] = [];
    const hsnMap = new Map<string, GSTR1Result['hsnSummary'][0]>();

    let totalTaxable = 0, totalCGST = 0, totalSGST = 0, totalIGST = 0, totalCESS = 0;

    for (const inv of invoices) {
      const type = this.classifySupply(inv);
      totalTaxable += inv.totalTaxableValue;
      totalCGST += inv.totalCGST;
      totalSGST += inv.totalSGST;
      totalIGST += inv.totalIGST;
      totalCESS += inv.totalCESS;

      // B2B bucketing
      if (type === 'B2B' && inv.customerGSTIN) {
        const existing = b2bMap.get(inv.customerGSTIN);
        const invEntry = {
          invoiceNumber: inv.invoiceNumber,
          invoiceDate: inv.invoiceDate,
          taxableValue: inv.totalTaxableValue,
          cgst: inv.totalCGST,
          sgst: inv.totalSGST,
          igst: inv.totalIGST,
          totalValue: inv.grandTotal,
        };
        if (existing) {
          existing.invoices.push(invEntry);
          existing.totalTaxableValue += inv.totalTaxableValue;
          existing.totalTax += inv.totalCGST + inv.totalSGST + inv.totalIGST;
        } else {
          b2bMap.set(inv.customerGSTIN, {
            recipientGSTIN: inv.customerGSTIN,
            invoices: [invEntry],
            totalTaxableValue: inv.totalTaxableValue,
            totalTax: inv.totalCGST + inv.totalSGST + inv.totalIGST,
          });
        }
      }

      // B2CS bucketing (aggregate by state + rate)
      if (type === 'B2CS') {
        for (const item of inv.items) {
          const key = `${inv.placeOfSupply}-${item.gstRate}`;
          const existing = b2csList.find((e) => `${e.stateCode}-${e.gstRate}` === key);
          if (existing) {
            existing.taxableValue += item.taxableValue;
            existing.cgst += item.cgst;
            existing.sgst += item.sgst;
            existing.cess += item.cess;
          } else {
            b2csList.push({
              stateCode: inv.placeOfSupply,
              gstRate: item.gstRate,
              taxableValue: item.taxableValue,
              cgst: item.cgst,
              sgst: item.sgst,
              cess: item.cess,
            });
          }
        }
      }

      // B2CL bucketing
      if (type === 'B2CL') {
        b2clList.push({
          placeOfSupply: inv.placeOfSupply,
          invoiceNumber: inv.invoiceNumber,
          taxableValue: inv.totalTaxableValue,
          igst: inv.totalIGST,
        });
      }

      // HSN Summary
      for (const item of inv.items) {
        const existing = hsnMap.get(item.hsnCode);
        if (existing) {
          existing.totalQty += item.qty;
          existing.totalTaxableValue += item.taxableValue;
          existing.totalCGST += item.cgst;
          existing.totalSGST += item.sgst;
          existing.totalIGST += item.igst;
        } else {
          hsnMap.set(item.hsnCode, {
            hsnCode: item.hsnCode,
            description: item.description,
            uqc: 'NOS',
            totalQty: item.qty,
            totalTaxableValue: item.taxableValue,
            totalCGST: item.cgst,
            totalSGST: item.sgst,
            totalIGST: item.igst,
          });
        }
      }
    }

    return {
      period,
      gstin: this.sellerGSTIN,
      b2b: Array.from(b2bMap.values()),
      b2cs: b2csList,
      b2cl: b2clList,
      hsnSummary: Array.from(hsnMap.values()),
      totalTaxableValue: Math.round(totalTaxable),
      totalCGST: Math.round(totalCGST),
      totalSGST: Math.round(totalSGST),
      totalIGST: Math.round(totalIGST),
      totalCESS: Math.round(totalCESS),
      totalTax: Math.round(totalCGST + totalSGST + totalIGST + totalCESS),
      totalInvoices: invoices.length,
    };
  }

  /**
   * Compute GSTR-3B from sales + purchase data
   */
  computeGSTR3B(
    salesInvoices: GSTInvoice[],
    purchaseInvoices: PurchaseInvoice[],
    period: string
  ): GSTR3BResult {
    // ── 3.1 Outward supplies ──
    let taxableB2B = 0, taxableB2C = 0, nilRated = 0, reverseCharge = 0;
    let outCGST = 0, outSGST = 0, outIGST = 0, outCESS = 0;

    for (const inv of salesInvoices) {
      const type = this.classifySupply(inv);
      if (type === 'B2B') taxableB2B += inv.totalTaxableValue;
      else taxableB2C += inv.totalTaxableValue;

      if (inv.reverseCharge) reverseCharge += inv.totalTaxableValue;
      outCGST += inv.totalCGST;
      outSGST += inv.totalSGST;
      outIGST += inv.totalIGST;
      outCESS += inv.totalCESS;
    }

    // ── 4. ITC Available ──
    let itcCGST = 0, itcSGST = 0, itcIGST = 0, itcCESS = 0;

    for (const pur of purchaseInvoices) {
      if (pur.itcEligible) {
        itcCGST += pur.totalCGST;
        itcSGST += pur.totalSGST;
        itcIGST += pur.totalIGST;
        itcCESS += pur.totalCESS;
      }
    }

    // ── Net tax payable ──
    const netCGST = Math.max(0, Math.round(outCGST - itcCGST));
    const netSGST = Math.max(0, Math.round(outSGST - itcSGST));
    const netIGST = Math.max(0, Math.round(outIGST - itcIGST));
    const netCESS = Math.max(0, Math.round(outCESS - itcCESS));

    return {
      period,
      gstin: this.sellerGSTIN,

      outwardSupplies: {
        taxableB2B: Math.round(taxableB2B),
        taxableB2C: Math.round(taxableB2C),
        nilRatedExempt: Math.round(nilRated),
        reverseCharge: Math.round(reverseCharge),
        totalTaxable: Math.round(taxableB2B + taxableB2C + nilRated),
        totalCGST: Math.round(outCGST),
        totalSGST: Math.round(outSGST),
        totalIGST: Math.round(outIGST),
        totalCESS: Math.round(outCESS),
      },

      itcAvailable: {
        importOfGoods: { cgst: 0, sgst: 0, igst: 0, cess: 0 },
        importOfServices: { cgst: 0, sgst: 0, igst: 0, cess: 0 },
        inwardReverseCharge: { cgst: 0, sgst: 0, igst: 0, cess: 0 },
        fromISD: { cgst: 0, sgst: 0, igst: 0, cess: 0 },
        allOtherITC: {
          cgst: Math.round(itcCGST),
          sgst: Math.round(itcSGST),
          igst: Math.round(itcIGST),
          cess: Math.round(itcCESS),
        },
        totalITC: {
          cgst: Math.round(itcCGST),
          sgst: Math.round(itcSGST),
          igst: Math.round(itcIGST),
          cess: Math.round(itcCESS),
        },
      },

      netTaxPayable: {
        cgst: netCGST,
        sgst: netSGST,
        igst: netIGST,
        cess: netCESS,
        total: netCGST + netSGST + netIGST + netCESS,
      },

      interest: { cgst: 0, sgst: 0, igst: 0 },
      totalPayable: netCGST + netSGST + netIGST + netCESS,
    };
  }

  /**
   * Generate invoices from BizOS Document records for a period
   */
  static convertBizDocToGSTInvoice(doc: any, sellerState: string): GSTInvoice {
    const isInterState = (doc.placeOfSupply || sellerState) !== sellerState;
    const items: GSTInvoiceItem[] = (doc.lines || []).map((line: any) => ({
      description: line.description || '',
      hsnCode: line.hsnSac || '999900',
      qty: line.qty || 1,
      rate: line.rate || 0,
      taxableValue: line.taxableValue || 0,
      gstRate: line.gstRate || 18,
      cgst: isInterState ? 0 : (line.cgst || 0),
      sgst: isInterState ? 0 : (line.sgst || 0),
      igst: isInterState ? (line.igst || 0) : 0,
      cess: 0,
    }));

    return {
      invoiceNumber: doc.number || doc.id,
      invoiceDate: doc.date?.toISOString?.() || new Date().toISOString(),
      customerName: doc.party?.name || 'Walk-in',
      customerGSTIN: doc.party?.gstin || undefined,
      placeOfSupply: doc.placeOfSupply || sellerState,
      sellerStateCode: sellerState,
      items,
      totalTaxableValue: doc.taxableTotal || 0,
      totalCGST: doc.cgstTotal || 0,
      totalSGST: doc.sgstTotal || 0,
      totalIGST: doc.igstTotal || 0,
      totalCESS: 0,
      grandTotal: doc.grandTotal || 0,
      reverseCharge: false,
    };
  }
}
