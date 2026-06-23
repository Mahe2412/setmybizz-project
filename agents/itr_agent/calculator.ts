/**
 * ═══════════════════════════════════════════════════════════════
 *  ARKLE CA ENGINE — India's Advanced Tax Computation Core
 *  Handles: ITR-1/3/4, GST (GSTR-1/3B), TDS, Advance Tax
 *  Sections: 44AD, 44ADA, 115BAC, Chapter VI-A
 * ═══════════════════════════════════════════════════════════════
 */

// ─── Income Source Types ────────────────────────────────────────

export type IncomeSourceType =
  | 'SALARY'
  | 'HOUSE_PROPERTY'
  | 'BUSINESS_44AD'        // Business (Presumptive ≤ 2Cr digital / 3Cr)
  | 'BUSINESS_44ADA'       // Professional (Presumptive ≤ 75L)
  | 'BUSINESS_REGULAR'     // Regular books of accounts
  | 'CAPITAL_GAINS_STCG'   // Short-term capital gains
  | 'CAPITAL_GAINS_LTCG'   // Long-term capital gains
  | 'OTHER_SOURCES'        // Interest, dividends, etc.
  | 'EXEMPT';              // Agricultural, etc.

export interface IncomeSource {
  type: IncomeSourceType;
  label: string;
  grossAmount: number;
  exemptions?: number;     // HRA, LTA, etc. for salary
  deductions?: number;     // Standard deduction, professional tax
}

// ─── Deduction Entries ──────────────────────────────────────────

export interface DeductionEntry {
  section: string;         // e.g. "80C", "80D", "80G"
  label: string;
  amount: number;
  maxLimit: number;
}

// ─── TDS / Advance Tax Entry ────────────────────────────────────

export interface TaxCreditEntry {
  type: 'TDS' | 'TCS' | 'ADVANCE_TAX' | 'SELF_ASSESSMENT';
  deductorName?: string;
  tanOfDeductor?: string;
  amount: number;
  quarter?: string;
}

// ─── Full Client Tax Profile Input ──────────────────────────────

export interface ClientTaxInput {
  assessmentYear: string;           // e.g. "2026-27"
  financialYear: string;            // e.g. "2025-26"
  clientType: 'INDIVIDUAL' | 'HUF' | 'FIRM' | 'COMPANY';
  age: number;                      // For senior citizen slabs
  residencyStatus: 'RESIDENT' | 'NRI' | 'RNOR';

  // Income sources
  incomeSources: IncomeSource[];

  // Deductions (Chapter VI-A) — only for Old Regime
  deductions: DeductionEntry[];

  // Tax credits already paid
  taxCredits: TaxCreditEntry[];

  // GST inputs (for GST mode)
  gstTurnover?: number;
  gstOutputTax?: number;
  gstInputTaxCredit?: number;
}

// ─── Computed Results ───────────────────────────────────────────

export interface IncomeBreakdown {
  source: string;
  gross: number;
  netTaxable: number;
}

export interface SlabDetail {
  range: string;
  rate: string;
  taxOnSlab: number;
}

export interface RegimeResult {
  regime: 'OLD' | 'NEW';
  incomeBreakdown: IncomeBreakdown[];
  grossTotalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  slabs: SlabDetail[];
  taxBeforeRebate: number;
  rebate87A: number;
  taxAfterRebate: number;
  surcharge: number;
  cess: number;
  totalTaxLiability: number;
  totalTaxCredits: number;
  netTaxPayable: number;    // Can be negative (refund)
}

export interface TaxOptimizationResult {
  input: ClientTaxInput;
  oldRegime: RegimeResult;
  newRegime: RegimeResult;
  recommended: 'OLD' | 'NEW';
  savings: number;
  tips: string[];
}

// ─── GST Computation ────────────────────────────────────────────

export interface GSTResult {
  outputTax: number;
  inputTaxCredit: number;
  netGSTPayable: number;
  cgst: number;
  sgst: number;
  igst: number;
}

// ═══════════════════════════════════════════════════════════════
//  COMPUTATION ENGINE
// ═══════════════════════════════════════════════════════════════

/**
 * Calculate net taxable income for each source
 */
function computeIncomeBreakdown(sources: IncomeSource[]): IncomeBreakdown[] {
  return sources.map((s) => {
    let netTaxable = s.grossAmount - (s.exemptions || 0) - (s.deductions || 0);

    // Presumptive income adjustments
    if (s.type === 'BUSINESS_44AD') {
      // 6% of digital turnover + 8% of cash turnover (simplified: user enters gross)
      // If gross ≤ 2Cr digital: 6%, else 8% for cash portion
      netTaxable = s.grossAmount * 0.06; // Simplified: assume digital
    } else if (s.type === 'BUSINESS_44ADA') {
      netTaxable = s.grossAmount * 0.50; // 50% deemed profit
    } else if (s.type === 'HOUSE_PROPERTY') {
      // Standard deduction 30% on Net Annual Value
      const nav = Math.max(0, s.grossAmount - (s.exemptions || 0));
      netTaxable = nav - (nav * 0.30) - (s.deductions || 0); // minus home loan interest
    } else if (s.type === 'SALARY') {
      // Standard deduction ₹75,000 (FY 2025-26 New Regime) / ₹50,000 (Old)
      netTaxable = s.grossAmount - (s.exemptions || 0) - (s.deductions || 0);
    } else if (s.type === 'EXEMPT') {
      netTaxable = 0;
    }

    return {
      source: s.label || s.type,
      gross: s.grossAmount,
      netTaxable: Math.max(0, netTaxable),
    };
  });
}

/**
 * Calculate total Chapter VI-A deductions (Old Regime only)
 */
function computeDeductions(deductions: DeductionEntry[]): { total: number; applied: DeductionEntry[] } {
  const applied = deductions.map((d) => ({
    ...d,
    amount: Math.min(d.amount, d.maxLimit),
  }));
  const total = applied.reduce((sum, d) => sum + d.amount, 0);
  return { total, applied };
}

/**
 * Old Regime Slabs FY 2025-26
 */
function computeOldRegimeTax(taxableIncome: number, age: number): { slabs: SlabDetail[]; tax: number } {
  const slabs: SlabDetail[] = [];
  let tax = 0;
  let remaining = taxableIncome;

  // Senior citizen (60-80) gets ₹3L exemption, Super senior (80+) gets ₹5L
  const exemptionLimit = age >= 80 ? 500000 : age >= 60 ? 300000 : 250000;

  const brackets = [
    { limit: exemptionLimit, rate: 0 },
    { limit: 500000, rate: 0.05 },
    { limit: 1000000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
  ];

  let prevLimit = 0;
  for (const b of brackets) {
    const slabWidth = b.limit - prevLimit;
    const taxable = Math.min(remaining, slabWidth);
    if (taxable <= 0) break;

    const taxOnSlab = taxable * b.rate;
    tax += taxOnSlab;
    remaining -= taxable;

    slabs.push({
      range: `₹${(prevLimit / 100000).toFixed(1)}L – ₹${b.limit === Infinity ? '∞' : (b.limit / 100000).toFixed(1) + 'L'}`,
      rate: `${(b.rate * 100).toFixed(0)}%`,
      taxOnSlab: Math.round(taxOnSlab),
    });

    prevLimit = b.limit;
  }

  return { slabs, tax: Math.round(tax) };
}

/**
 * New Regime Slabs FY 2025-26 (u/s 115BAC)
 */
function computeNewRegimeTax(taxableIncome: number): { slabs: SlabDetail[]; tax: number } {
  const slabs: SlabDetail[] = [];
  let tax = 0;
  let remaining = taxableIncome;

  const brackets = [
    { limit: 300000, rate: 0 },
    { limit: 700000, rate: 0.05 },
    { limit: 1000000, rate: 0.10 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
  ];

  let prevLimit = 0;
  for (const b of brackets) {
    const slabWidth = b.limit - prevLimit;
    const taxable = Math.min(remaining, slabWidth);
    if (taxable <= 0) break;

    const taxOnSlab = taxable * b.rate;
    tax += taxOnSlab;
    remaining -= taxable;

    slabs.push({
      range: `₹${(prevLimit / 100000).toFixed(1)}L – ₹${b.limit === Infinity ? '∞' : (b.limit / 100000).toFixed(1) + 'L'}`,
      rate: `${(b.rate * 100).toFixed(0)}%`,
      taxOnSlab: Math.round(taxOnSlab),
    });

    prevLimit = b.limit;
  }

  return { slabs, tax: Math.round(tax) };
}

/**
 * Rebate u/s 87A
 */
function computeRebate(taxableIncome: number, tax: number, regime: 'OLD' | 'NEW'): number {
  if (regime === 'OLD' && taxableIncome <= 500000) {
    return Math.min(tax, 12500);
  }
  if (regime === 'NEW' && taxableIncome <= 700000) {
    return Math.min(tax, 25000);
  }
  return 0;
}

/**
 * Surcharge calculation
 */
function computeSurcharge(taxableIncome: number, tax: number): number {
  if (taxableIncome > 50000000) return tax * 0.37;
  if (taxableIncome > 20000000) return tax * 0.25;
  if (taxableIncome > 10000000) return tax * 0.15;
  if (taxableIncome > 5000000) return tax * 0.10;
  return 0;
}

/**
 * Full regime computation
 */
function computeRegime(
  input: ClientTaxInput,
  regime: 'OLD' | 'NEW'
): RegimeResult {
  const breakdown = computeIncomeBreakdown(input.incomeSources);
  const grossTotalIncome = breakdown.reduce((s, b) => s + b.netTaxable, 0);

  let totalDeductions = 0;
  if (regime === 'OLD') {
    const ded = computeDeductions(input.deductions);
    totalDeductions = ded.total;
  }

  // New regime allows ₹75,000 standard deduction for salaried (already handled in breakdown)
  const taxableIncome = Math.max(0, grossTotalIncome - totalDeductions);

  const { slabs, tax: taxBeforeRebate } = regime === 'OLD'
    ? computeOldRegimeTax(taxableIncome, input.age)
    : computeNewRegimeTax(taxableIncome);

  const rebate = computeRebate(taxableIncome, taxBeforeRebate, regime);
  const taxAfterRebate = Math.max(0, taxBeforeRebate - rebate);
  const surcharge = Math.round(computeSurcharge(taxableIncome, taxAfterRebate));
  const cess = Math.round((taxAfterRebate + surcharge) * 0.04);
  const totalTaxLiability = taxAfterRebate + surcharge + cess;

  const totalTaxCredits = input.taxCredits.reduce((s, c) => s + c.amount, 0);
  const netTaxPayable = totalTaxLiability - totalTaxCredits;

  return {
    regime,
    incomeBreakdown: breakdown,
    grossTotalIncome,
    totalDeductions,
    taxableIncome,
    slabs,
    taxBeforeRebate,
    rebate87A: rebate,
    taxAfterRebate,
    surcharge,
    cess,
    totalTaxLiability,
    totalTaxCredits,
    netTaxPayable,
  };
}

/**
 * Generate smart tax-saving tips
 */
function generateTips(input: ClientTaxInput, oldResult: RegimeResult, newResult: RegimeResult): string[] {
  const tips: string[] = [];

  // Check 80C utilization
  const ded80C = input.deductions.find((d) => d.section === '80C');
  if (ded80C && ded80C.amount < 150000) {
    const gap = 150000 - ded80C.amount;
    tips.push(`Invest ₹${(gap / 1000).toFixed(0)}K more in 80C (ELSS/PPF/NPS) to save up to ₹${Math.round(gap * 0.30)} in Old Regime.`);
  }

  // Check 80D
  const ded80D = input.deductions.find((d) => d.section === '80D');
  if (!ded80D || ded80D.amount === 0) {
    tips.push('Consider health insurance (Sec 80D). You can claim up to ₹25,000 (₹50,000 for senior citizens).');
  }

  // NPS
  const ded80CCD = input.deductions.find((d) => d.section === '80CCD(1B)');
  if (!ded80CCD || ded80CCD.amount < 50000) {
    tips.push('Invest in NPS (Sec 80CCD(1B)) for additional ₹50,000 deduction beyond 80C limit.');
  }

  // Presumptive tax tip
  const hasBusiness = input.incomeSources.some((s) => s.type === 'BUSINESS_44AD' || s.type === 'BUSINESS_44ADA');
  if (hasBusiness) {
    tips.push('Under Presumptive taxation, no books of accounts required. Ensure turnover stays within limits.');
  }

  // Advance tax reminder
  if (newResult.totalTaxLiability > 10000 || oldResult.totalTaxLiability > 10000) {
    tips.push('Tax liability exceeds ₹10,000. Pay Advance Tax in quarterly installments to avoid interest u/s 234C.');
  }

  return tips;
}

// ═══════════════════════════════════════════════════════════════
//  PUBLIC API
// ═══════════════════════════════════════════════════════════════

/**
 * Main entry: Compute both regimes and recommend the best
 */
export function computeTaxOptimization(input: ClientTaxInput): TaxOptimizationResult {
  const oldRegime = computeRegime(input, 'OLD');
  const newRegime = computeRegime(input, 'NEW');

  const recommended = oldRegime.totalTaxLiability <= newRegime.totalTaxLiability ? 'OLD' : 'NEW';
  const savings = Math.abs(oldRegime.totalTaxLiability - newRegime.totalTaxLiability);
  const tips = generateTips(input, oldRegime, newRegime);

  return { input, oldRegime, newRegime, recommended, savings, tips };
}

/**
 * GST Computation (simple output - input model)
 */
export function computeGST(turnover: number, outputTaxRate: number, itcAmount: number, isInterstate: boolean): GSTResult {
  const outputTax = Math.round(turnover * outputTaxRate);
  const netGSTPayable = Math.max(0, outputTax - itcAmount);

  return {
    outputTax,
    inputTaxCredit: itcAmount,
    netGSTPayable,
    cgst: isInterstate ? 0 : Math.round(netGSTPayable / 2),
    sgst: isInterstate ? 0 : Math.round(netGSTPayable / 2),
    igst: isInterstate ? netGSTPayable : 0,
  };
}

/**
 * Determine ITR form type based on income sources
 */
export function determineITRForm(input: ClientTaxInput): string {
  const types = input.incomeSources.map((s) => s.type);
  const hasSalary = types.includes('SALARY');
  const hasBusinessPresumptive = types.includes('BUSINESS_44AD') || types.includes('BUSINESS_44ADA');
  const hasBusinessRegular = types.includes('BUSINESS_REGULAR');
  const hasCapitalGains = types.includes('CAPITAL_GAINS_STCG') || types.includes('CAPITAL_GAINS_LTCG');
  const hasHouseProperty = types.includes('HOUSE_PROPERTY');

  if (hasBusinessRegular) return 'ITR-3';
  if (hasBusinessPresumptive) return 'ITR-4 (Sugam)';
  if (hasCapitalGains) return 'ITR-2';
  if (hasSalary || hasHouseProperty) return 'ITR-1 (Sahaj)';
  return 'ITR-2';
}
