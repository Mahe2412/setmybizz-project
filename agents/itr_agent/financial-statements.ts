/**
 * ═══════════════════════════════════════════════════════════════
 *  ARKLE CA AGENT — Financial Statements Engine
 *  Generates Balance Sheet, P&L Account, Tax Computation Sheet
 *  from BizOS (SetMyBizz) accounting data
 * ═══════════════════════════════════════════════════════════════
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Types ──────────────────────────────────────────────────────

export interface ProfitAndLoss {
  period: string;
  // Revenue
  revenue: {
    salesRevenue: number;
    otherIncome: number;
    totalRevenue: number;
  };
  // COGS
  cogs: {
    openingStock: number;
    purchases: number;
    closingStock: number;
    costOfGoodsSold: number;
  };
  // Gross Profit
  grossProfit: number;
  grossProfitMarginPct: number;
  // Expenses
  expenses: {
    rent: number;
    salaries: number;
    electricity: number;
    transportation: number;
    marketing: number;
    bankCharges: number;
    depreciation: number;
    miscellaneous: number;
    totalExpenses: number;
  };
  // Net Profit
  netProfitBeforeTax: number;
  incomeTaxProvision: number;
  netProfitAfterTax: number;
  netProfitMarginPct: number;
  // Line Items
  lineItems: PLLineItem[];
}

export interface PLLineItem {
  category: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'SUBTOTAL' | 'HEADER';
}

export interface BalanceSheet {
  period: string;
  asOnDate: string;
  // Assets
  assets: {
    currentAssets: {
      cash: number;
      bankBalance: number;
      accountsReceivable: number;
      inventory: number;
      prepaidExpenses: number;
      totalCurrentAssets: number;
    };
    fixedAssets: {
      furniture: number;
      equipment: number;
      vehicles: number;
      computers: number;
      totalFixedAssets: number;
    };
    totalAssets: number;
  };
  // Liabilities
  liabilities: {
    currentLiabilities: {
      accountsPayable: number;
      gstPayable: number;
      tdsPayable: number;
      shortTermLoans: number;
      totalCurrentLiabilities: number;
    };
    longTermLiabilities: {
      bankLoans: number;
      totalLongTermLiabilities: number;
    };
    totalLiabilities: number;
  };
  // Capital / Equity
  capital: {
    openingCapital: number;
    addNetProfit: number;
    lessDrawings: number;
    closingCapital: number;
  };
  totalLiabilitiesAndCapital: number;
  isBalanced: boolean;
}

export interface TaxComputationSheet {
  clientName: string;
  pan: string;
  assessmentYear: string;
  financialYear: string;
  // Income from all heads
  incomeHeads: {
    salaryIncome: number;
    housePropertyIncome: number;
    businessIncome: number;
    capitalGains: {
      shortTermGains: number;
      longTermGains: number;
    };
    otherSourcesIncome: number;
    grossTotalIncome: number;
  };
  // Deductions (Chapter VI-A)
  deductions: {
    section80C: number;
    section80D: number;
    section80G: number;
    section80TTA: number;
    totalDeductions: number;
  };
  // Tax Computation
  computation: {
    totalIncome: number;
    taxableIncome: number;
    regime: 'OLD' | 'NEW';
    taxBeforeRebate: number;
    rebate87A: number;
    taxAfterRebate: number;
    surcharge: number;
    healthEducationCess: number;
    totalTaxPayable: number;
    advanceTaxPaid: number;
    tdsCredited: number;
    selfAssessmentTaxDue: number;
    refundDue: number;
  };
  recommendedRegime: 'OLD' | 'NEW';
  taxSavingInRecommendedRegime: number;
  itrFormApplicable: string;
}

// ─── Category Mapping ────────────────────────────────────────────

const EXPENSE_CATEGORIES: Record<string, keyof ProfitAndLoss['expenses']> = {
  'rent': 'rent',
  'rental': 'rent',
  'office rent': 'rent',
  'salary': 'salaries',
  'salaries': 'salaries',
  'wages': 'salaries',
  'electricity': 'electricity',
  'power': 'electricity',
  'utility': 'electricity',
  'transport': 'transportation',
  'freight': 'transportation',
  'logistics': 'transportation',
  'marketing': 'marketing',
  'advertising': 'marketing',
  'promotion': 'marketing',
  'bank charges': 'bankCharges',
  'bank fees': 'bankCharges',
  'depreciation': 'depreciation',
};

function mapExpenseCategory(category: string): keyof ProfitAndLoss['expenses'] {
  const normalized = category.toLowerCase().trim();
  for (const [key, val] of Object.entries(EXPENSE_CATEGORIES)) {
    if (normalized.includes(key)) return val;
  }
  return 'miscellaneous';
}

// ─── P&L Generator ───────────────────────────────────────────────

export async function generateProfitAndLoss(
  businessId: string,
  startDate: Date,
  endDate: Date
): Promise<ProfitAndLoss> {
  const period = `FY ${startDate.getFullYear()}-${String(endDate.getFullYear()).slice(-2)}`;

  // ── Sales Revenue from Documents (invoices/tax-invoices) ────────
  const salesDocs = await prisma.document.findMany({
    where: {
      businessId,
      type: { in: ['TAX_INVOICE', 'INVOICE', 'PROFORMA', 'SALE'] },
      status: { not: 'CANCELLED' },
      date: { gte: startDate, lte: endDate },
    },
  });
  const salesRevenue = salesDocs.reduce((s, d) => s + d.grandTotal, 0);

  // ── Purchases ────────────────────────────────────────────────────
  const purchaseDocs = await prisma.document.findMany({
    where: {
      businessId,
      type: { in: ['PURCHASE', 'PURCHASE_ORDER', 'PURCHASE_INVOICE'] },
      status: { not: 'CANCELLED' },
      date: { gte: startDate, lte: endDate },
    },
  });
  const purchases = purchaseDocs.reduce((s, d) => s + d.grandTotal, 0);

  // ── Expenses ─────────────────────────────────────────────────────
  const expenseRecords = await prisma.expense.findMany({
    where: {
      businessId,
      date: { gte: startDate, lte: endDate },
    },
  });

  const expenseBreakdown: ProfitAndLoss['expenses'] = {
    rent: 0, salaries: 0, electricity: 0, transportation: 0,
    marketing: 0, bankCharges: 0, depreciation: 0, miscellaneous: 0,
    totalExpenses: 0,
  };

  for (const exp of expenseRecords) {
    const key = mapExpenseCategory(exp.category);
    expenseBreakdown[key] += exp.amount;
  }
  expenseBreakdown.totalExpenses = expenseRecords.reduce((s, e) => s + e.amount, 0);

  // ── Stock Value ──────────────────────────────────────────────────
  const items = await prisma.item.findMany({ where: { businessId, trackStock: true } });
  const closingStock = items.reduce((s, i) => s + i.stockQty * i.purchasePrice, 0);
  const openingStock = 0; // First year assumption — extend for multi-year

  const cogs = openingStock + purchases - closingStock;
  const grossProfit = salesRevenue - cogs;
  const grossProfitMarginPct = salesRevenue > 0 ? (grossProfit / salesRevenue) * 100 : 0;

  const otherIncome = 0; // Can be extended with interest income records
  const totalRevenue = salesRevenue + otherIncome;

  const netProfitBeforeTax = grossProfit - expenseBreakdown.totalExpenses;
  const incomeTaxProvision = netProfitBeforeTax > 0
    ? Math.round(netProfitBeforeTax * 0.22) // 22% default corporate rate
    : 0;
  const netProfitAfterTax = netProfitBeforeTax - incomeTaxProvision;
  const netProfitMarginPct = totalRevenue > 0 ? (netProfitAfterTax / totalRevenue) * 100 : 0;

  // ── Line Items for Display ────────────────────────────────────────
  const lineItems: PLLineItem[] = [
    { category: 'REVENUE', description: 'Sales Revenue', amount: salesRevenue, type: 'INCOME' },
    { category: 'REVENUE', description: 'Other Income', amount: otherIncome, type: 'INCOME' },
    { category: 'SUBTOTAL', description: 'Total Revenue (A)', amount: totalRevenue, type: 'SUBTOTAL' },
    { category: 'COGS', description: 'Opening Stock', amount: openingStock, type: 'EXPENSE' },
    { category: 'COGS', description: 'Add: Purchases', amount: purchases, type: 'EXPENSE' },
    { category: 'COGS', description: 'Less: Closing Stock', amount: -closingStock, type: 'EXPENSE' },
    { category: 'SUBTOTAL', description: 'Cost of Goods Sold (B)', amount: cogs, type: 'SUBTOTAL' },
    { category: 'SUBTOTAL', description: 'Gross Profit (A - B)', amount: grossProfit, type: 'SUBTOTAL' },
    { category: 'EXPENSE', description: 'Rent & Utilities', amount: expenseBreakdown.rent + expenseBreakdown.electricity, type: 'EXPENSE' },
    { category: 'EXPENSE', description: 'Salaries & Wages', amount: expenseBreakdown.salaries, type: 'EXPENSE' },
    { category: 'EXPENSE', description: 'Transportation & Freight', amount: expenseBreakdown.transportation, type: 'EXPENSE' },
    { category: 'EXPENSE', description: 'Marketing & Advertising', amount: expenseBreakdown.marketing, type: 'EXPENSE' },
    { category: 'EXPENSE', description: 'Bank Charges', amount: expenseBreakdown.bankCharges, type: 'EXPENSE' },
    { category: 'EXPENSE', description: 'Depreciation', amount: expenseBreakdown.depreciation, type: 'EXPENSE' },
    { category: 'EXPENSE', description: 'Miscellaneous Expenses', amount: expenseBreakdown.miscellaneous, type: 'EXPENSE' },
    { category: 'SUBTOTAL', description: 'Total Expenses (C)', amount: expenseBreakdown.totalExpenses, type: 'SUBTOTAL' },
    { category: 'SUBTOTAL', description: 'Net Profit Before Tax', amount: netProfitBeforeTax, type: 'SUBTOTAL' },
    { category: 'EXPENSE', description: 'Income Tax Provision', amount: incomeTaxProvision, type: 'EXPENSE' },
    { category: 'SUBTOTAL', description: '✦ Net Profit After Tax', amount: netProfitAfterTax, type: 'SUBTOTAL' },
  ];

  return {
    period,
    revenue: { salesRevenue, otherIncome, totalRevenue },
    cogs: { openingStock, purchases, closingStock, costOfGoodsSold: cogs },
    grossProfit,
    grossProfitMarginPct,
    expenses: expenseBreakdown,
    netProfitBeforeTax,
    incomeTaxProvision,
    netProfitAfterTax,
    netProfitMarginPct,
    lineItems,
  };
}

// ─── Balance Sheet Generator ──────────────────────────────────────

export async function generateBalanceSheet(
  businessId: string,
  asOnDate: Date,
  netProfit: number
): Promise<BalanceSheet> {
  const period = `As on ${asOnDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`;

  // ── Accounts Receivable (pending payments on invoices) ───────────
  const unpaidInvoices = await prisma.document.findMany({
    where: {
      businessId,
      type: { in: ['TAX_INVOICE', 'INVOICE'] },
      status: { in: ['SENT', 'PARTIALLY_PAID', 'OVERDUE'] },
    },
  });
  const accountsReceivable = unpaidInvoices.reduce((s, d) => s + d.grandTotal, 0);

  // ── Accounts Payable (pending purchases) ────────────────────────
  const unpaidPurchases = await prisma.document.findMany({
    where: {
      businessId,
      type: { in: ['PURCHASE', 'PURCHASE_INVOICE'] },
      status: { in: ['RECEIVED', 'PARTIALLY_PAID'] },
    },
  });
  const accountsPayable = unpaidPurchases.reduce((s, d) => s + d.grandTotal, 0);

  // ── Inventory ────────────────────────────────────────────────────
  const items = await prisma.item.findMany({ where: { businessId, trackStock: true } });
  const inventory = items.reduce((s, i) => s + i.stockQty * i.purchasePrice, 0);

  // ── Cash / Bank ──────────────────────────────────────────────────
  const payments = await prisma.payment.findMany({ where: { businessId } });
  const bankBalance = payments
    .filter(p => p.mode === 'bank_transfer' || p.mode === 'upi')
    .reduce((s, p) => s + p.amount, 0);
  const cash = payments
    .filter(p => p.mode === 'cash')
    .reduce((s, p) => s + p.amount, 0);

  // ── GST Payable (estimated from docs) ───────────────────────────
  const salesDocs = await prisma.document.findMany({
    where: { businessId, type: { in: ['TAX_INVOICE', 'INVOICE'] }, status: { not: 'CANCELLED' } },
  });
  const outputGST = salesDocs.reduce((s, d) => s + d.cgstTotal + d.sgstTotal + d.igstTotal, 0);
  const purchaseDocs = await prisma.document.findMany({
    where: { businessId, type: { in: ['PURCHASE', 'PURCHASE_INVOICE'] }, status: { not: 'CANCELLED' } },
  });
  const inputGST = purchaseDocs.reduce((s, d) => s + d.cgstTotal + d.sgstTotal + d.igstTotal, 0);
  const gstPayable = Math.max(0, outputGST - inputGST);

  // ── Computed Figures ─────────────────────────────────────────────
  const totalCurrentAssets = cash + bankBalance + accountsReceivable + inventory;
  const totalFixedAssets = 0; // Can be extended with asset registry
  const totalAssets = totalCurrentAssets + totalFixedAssets;

  const totalCurrentLiabilities = accountsPayable + gstPayable;
  const totalLongTermLiabilities = 0;
  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

  const openingCapital = totalAssets - totalLiabilities - netProfit;
  const closingCapital = openingCapital + netProfit;
  const totalLiabilitiesAndCapital = totalLiabilities + closingCapital;

  const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndCapital) < 1;

  return {
    period,
    asOnDate: asOnDate.toISOString(),
    assets: {
      currentAssets: {
        cash, bankBalance, accountsReceivable, inventory, prepaidExpenses: 0,
        totalCurrentAssets,
      },
      fixedAssets: {
        furniture: 0, equipment: 0, vehicles: 0, computers: 0, totalFixedAssets,
      },
      totalAssets,
    },
    liabilities: {
      currentLiabilities: {
        accountsPayable, gstPayable, tdsPayable: 0, shortTermLoans: 0,
        totalCurrentLiabilities,
      },
      longTermLiabilities: { bankLoans: 0, totalLongTermLiabilities },
      totalLiabilities,
    },
    capital: {
      openingCapital,
      addNetProfit: netProfit,
      lessDrawings: 0,
      closingCapital,
    },
    totalLiabilitiesAndCapital,
    isBalanced,
  };
}

// ─── Tax Computation Sheet ────────────────────────────────────────

export async function generateTaxComputationSheet(
  taxProfileId: string,
  netProfit: number
): Promise<TaxComputationSheet> {
  const profile = await prisma.taxProfile.findUnique({ where: { id: taxProfileId } });
  if (!profile) throw new Error('Tax profile not found');

  const businessIncome = netProfit;
  const grossTotalIncome = businessIncome;
  const totalDeductions = 0; // Will be filled from OCR/intake data
  const totalIncome = Math.max(0, grossTotalIncome - totalDeductions);

  // New Regime slabs (FY 2025-26)
  function computeNewRegimeTax(income: number): number {
    if (income <= 400000) return 0;
    if (income <= 800000) return (income - 400000) * 0.05;
    if (income <= 1200000) return 20000 + (income - 800000) * 0.10;
    if (income <= 1600000) return 60000 + (income - 1200000) * 0.15;
    if (income <= 2000000) return 120000 + (income - 1600000) * 0.20;
    if (income <= 2400000) return 200000 + (income - 2000000) * 0.25;
    return 300000 + (income - 2400000) * 0.30;
  }

  // Old Regime slabs
  function computeOldRegimeTax(income: number): number {
    if (income <= 250000) return 0;
    if (income <= 500000) return (income - 250000) * 0.05;
    if (income <= 1000000) return 12500 + (income - 500000) * 0.20;
    return 112500 + (income - 1000000) * 0.30;
  }

  const newTax = computeNewRegimeTax(totalIncome);
  const oldTax = computeOldRegimeTax(totalIncome);
  const recommendedRegime = newTax <= oldTax ? 'NEW' : 'OLD';
  const chosenTax = recommendedRegime === 'NEW' ? newTax : oldTax;

  // Rebate 87A (if income ≤ 7L in New Regime)
  const rebate87A = (recommendedRegime === 'NEW' && totalIncome <= 700000)
    ? Math.min(chosenTax, 25000)
    : 0;
  const taxAfterRebate = Math.max(0, chosenTax - rebate87A);

  // Surcharge (if income > 50L)
  let surchargePct = 0;
  if (totalIncome > 50000000) surchargePct = 37;
  else if (totalIncome > 20000000) surchargePct = 25;
  else if (totalIncome > 10000000) surchargePct = 15;
  else if (totalIncome > 5000000) surchargePct = 10;
  const surcharge = taxAfterRebate * (surchargePct / 100);

  // Cess
  const healthEducationCess = (taxAfterRebate + surcharge) * 0.04;
  const totalTaxPayable = Math.round(taxAfterRebate + surcharge + healthEducationCess);

  // Determine ITR form
  let itrForm = 'ITR-4';
  if (businessIncome === 0) itrForm = 'ITR-1';
  if (totalIncome > 5000000) itrForm = 'ITR-3';

  return {
    clientName: profile.clientName || 'Unknown',
    pan: profile.pan || 'Not Provided',
    assessmentYear: 'AY 2026-27',
    financialYear: 'FY 2025-26',
    incomeHeads: {
      salaryIncome: 0,
      housePropertyIncome: 0,
      businessIncome,
      capitalGains: { shortTermGains: 0, longTermGains: 0 },
      otherSourcesIncome: 0,
      grossTotalIncome,
    },
    deductions: {
      section80C: 0, section80D: 0, section80G: 0, section80TTA: 0,
      totalDeductions,
    },
    computation: {
      totalIncome: grossTotalIncome,
      taxableIncome: totalIncome,
      regime: recommendedRegime,
      taxBeforeRebate: chosenTax,
      rebate87A,
      taxAfterRebate,
      surcharge,
      healthEducationCess,
      totalTaxPayable,
      advanceTaxPaid: 0,
      tdsCredited: 0,
      selfAssessmentTaxDue: totalTaxPayable,
      refundDue: 0,
    },
    recommendedRegime,
    taxSavingInRecommendedRegime: Math.abs(newTax - oldTax),
    itrFormApplicable: itrForm,
  };
}
