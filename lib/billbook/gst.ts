/**
 * GST calculation utilities (shared with BillEase billing module).
 * Used for consistent CGST/SGST/IGST totals in Bill Book.
 */
export type GstLineInput = {
  qty: number;
  rate: number;
  discountPct?: number;
  gstRate: number;
};

export type GstLineResult = {
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  lineTotal: number;
};

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function isInterState(
  businessStateCode: string,
  placeOfSupply: string
): boolean {
  const a = (businessStateCode || '').trim().slice(0, 2);
  const b = (placeOfSupply || '').trim().slice(0, 2);
  return !!a && !!b && a !== b;
}

export function calculateLineTax(
  line: GstLineInput,
  interState: boolean
): GstLineResult {
  const gross = round2(line.qty * line.rate);
  const discountPct = line.discountPct ?? 0;
  const discount = round2((gross * discountPct) / 100);
  const taxableValue = round2(gross - discount);
  const tax = round2((taxableValue * line.gstRate) / 100);

  if (interState) {
    return {
      taxableValue,
      cgst: 0,
      sgst: 0,
      igst: tax,
      lineTotal: round2(taxableValue + tax),
    };
  }

  const half = round2(tax / 2);
  return {
    taxableValue,
    cgst: half,
    sgst: half,
    igst: 0,
    lineTotal: round2(taxableValue + tax),
  };
}

export const INDIAN_STATE_CODES: Record<string, string> = {
  "01": "Jammu & Kashmir",
  "07": "Delhi",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "19": "West Bengal",
  "24": "Gujarat",
  "27": "Maharashtra",
  "29": "Karnataka",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "36": "Telangana",
  "37": "Andhra Pradesh",
};
