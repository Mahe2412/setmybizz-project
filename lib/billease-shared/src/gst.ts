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

export type GstDocumentTotals = {
  subtotal: number;
  discountTotal: number;
  taxableTotal: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  grandTotal: number;
  roundOff: number;
};

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function isInterState(
  businessStateCode: string,
  placeOfSupply: string
): boolean {
  return businessStateCode.trim() !== placeOfSupply.trim();
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

export function calculateDocumentTotals(
  lines: GstLineResult[],
  applyRoundOff = true
): GstDocumentTotals {
  const subtotal = round2(lines.reduce((s, l) => s + l.taxableValue, 0));
  const cgstTotal = round2(lines.reduce((s, l) => s + l.cgst, 0));
  const sgstTotal = round2(lines.reduce((s, l) => s + l.sgst, 0));
  const igstTotal = round2(lines.reduce((s, l) => s + l.igst, 0));
  const taxableTotal = subtotal;
  const rawGrand = round2(
    taxableTotal + cgstTotal + sgstTotal + igstTotal
  );
  const grandTotal = applyRoundOff ? Math.round(rawGrand) : rawGrand;
  const roundOff = round2(grandTotal - rawGrand);

  return {
    subtotal,
    discountTotal: 0,
    taxableTotal,
    cgstTotal,
    sgstTotal,
    igstTotal,
    grandTotal,
    roundOff,
  };
}

export function validateGstin(gstin: string): boolean {
  const re =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return re.test(gstin.toUpperCase());
}

export const INDIAN_STATES: Record<string, string> = {
  "01": "Jammu & Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "27": "Maharashtra",
  "29": "Karnataka",
  "30": "Goa",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "36": "Telangana",
  "37": "Andhra Pradesh",
};

export function amountInWords(amount: number): string {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function twoDigits(n: number): string {
    if (n < 20) return ones[n];
    return `${tens[Math.floor(n / 10)]} ${ones[n % 10]}`.trim();
  }

  function threeDigits(n: number): string {
    if (n === 0) return "";
    if (n < 100) return twoDigits(n);
    return `${ones[Math.floor(n / 100)]} Hundred ${twoDigits(n % 100)}`.trim();
  }

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  if (rupees === 0 && paise === 0) return "Zero Rupees Only";

  let words = "";
  const crore = Math.floor(rupees / 10000000);
  const lakh = Math.floor((rupees % 10000000) / 100000);
  const thousand = Math.floor((rupees % 100000) / 1000);
  const hundred = rupees % 1000;

  if (crore) words += `${threeDigits(crore)} Crore `;
  if (lakh) words += `${threeDigits(lakh)} Lakh `;
  if (thousand) words += `${threeDigits(thousand)} Thousand `;
  if (hundred) words += `${threeDigits(hundred)} `;

  words = words.trim() + " Rupees";
  if (paise) words += ` and ${twoDigits(paise)} Paise`;
  return words + " Only";
}
