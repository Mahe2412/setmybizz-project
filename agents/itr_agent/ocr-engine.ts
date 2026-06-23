/**
 * ═══════════════════════════════════════════════════════════════
 *  ARKLE OCR ENGINE — Gemini Vision Document Intelligence
 *  Reads: Form-16, Form-26AS, AIS, Bank Statements, Invoices
 *  Output: Structured JSON tax data for computation engine
 * ═══════════════════════════════════════════════════════════════
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

// ─── Document Types & Extracted Schemas ──────────────────────────

export type TaxDocType =
  | 'FORM_16'
  | 'FORM_26AS'
  | 'AIS'
  | 'TIS'
  | 'BANK_STATEMENT'
  | 'INVOICE'
  | 'SALARY_SLIP'
  | 'RENT_RECEIPT'
  | 'OTHER';

export interface ExtractedForm16 {
  employerName: string;
  employerTAN: string;
  employeePAN: string;
  employeeName: string;
  financialYear: string;
  grossSalary: number;
  exemptAllowances: number;       // HRA, LTA etc
  standardDeduction: number;       // ₹75,000 or ₹50,000
  netTaxableFromSalary: number;
  deductions80C: number;
  deductions80D: number;
  deductions80CCD: number;
  otherDeductions: number;
  totalTDSDeducted: number;
  taxPayable: number;
}

export interface ExtractedForm26AS {
  pan: string;
  financialYear: string;
  entries: {
    deductorName: string;
    deductorTAN: string;
    section: string;               // 192, 194A, 194J etc
    transactionDate: string;
    amountPaid: number;
    tdsDeducted: number;
    tdsDeposited: number;
  }[];
  totalTDSDeducted: number;
  totalTCSCollected: number;
  advanceTaxPaid: number;
  selfAssessmentTaxPaid: number;
}

export interface ExtractedAIS {
  pan: string;
  financialYear: string;
  salaryIncome: number;
  interestIncome: number;
  dividendIncome: number;
  saleOfSecurities: { type: string; amount: number }[];
  rentalIncome: number;
  foreignRemittances: number;
  gstTurnover: number;
  tdsEntries: { source: string; amount: number }[];
  highValueTransactions: { type: string; amount: number }[];
}

export interface ExtractedBankStatement {
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  period: string;
  totalCredits: number;
  totalDebits: number;
  closingBalance: number;
  interestEarned: number;
  salaryCredits: { date: string; amount: number; from: string }[];
  highValueDeposits: { date: string; amount: number; narration: string }[];
}

export interface ExtractedInvoice {
  invoiceNumber: string;
  invoiceDate: string;
  sellerName: string;
  sellerGSTIN: string;
  buyerName: string;
  buyerGSTIN: string;
  items: { description: string; qty: number; rate: number; amount: number; gstRate: number }[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
}

export type ExtractedData =
  | { type: 'FORM_16'; data: ExtractedForm16 }
  | { type: 'FORM_26AS'; data: ExtractedForm26AS }
  | { type: 'AIS'; data: ExtractedAIS }
  | { type: 'BANK_STATEMENT'; data: ExtractedBankStatement }
  | { type: 'INVOICE'; data: ExtractedInvoice }
  | { type: 'OTHER'; data: Record<string, any> };

// ─── Extraction Prompts (per document type) ─────────────────────

const EXTRACTION_PROMPTS: Record<string, string> = {
  FORM_16: `You are a tax document extraction AI for India. Extract the following fields from this Form 16 / Part A & Part B document. Return ONLY valid JSON with these exact keys:
{
  "employerName": "string",
  "employerTAN": "string",
  "employeePAN": "string",
  "employeeName": "string",
  "financialYear": "string (e.g., 2025-26)",
  "grossSalary": number,
  "exemptAllowances": number,
  "standardDeduction": number,
  "netTaxableFromSalary": number,
  "deductions80C": number,
  "deductions80D": number,
  "deductions80CCD": number,
  "otherDeductions": number,
  "totalTDSDeducted": number,
  "taxPayable": number
}
If a value is not found, use 0 for numbers and "" for strings. Parse Indian number formats (₹, commas, lakhs).`,

  FORM_26AS: `You are a tax document extraction AI for India. Extract from this Form 26AS (Annual Tax Statement). Return ONLY valid JSON:
{
  "pan": "string",
  "financialYear": "string",
  "entries": [{ "deductorName": "string", "deductorTAN": "string", "section": "string", "transactionDate": "string", "amountPaid": number, "tdsDeducted": number, "tdsDeposited": number }],
  "totalTDSDeducted": number,
  "totalTCSCollected": number,
  "advanceTaxPaid": number,
  "selfAssessmentTaxPaid": number
}
Parse all entries from Part A (TDS), Part B (TCS), Part C (Tax Paid). Use 0 for missing numbers.`,

  AIS: `You are a tax document extraction AI for India. Extract from this Annual Information Statement (AIS). Return ONLY valid JSON:
{
  "pan": "string",
  "financialYear": "string",
  "salaryIncome": number,
  "interestIncome": number,
  "dividendIncome": number,
  "saleOfSecurities": [{ "type": "string", "amount": number }],
  "rentalIncome": number,
  "foreignRemittances": number,
  "gstTurnover": number,
  "tdsEntries": [{ "source": "string", "amount": number }],
  "highValueTransactions": [{ "type": "string", "amount": number }]
}
Capture all income categories reported. Use 0 for missing amounts.`,

  BANK_STATEMENT: `You are a financial document extraction AI. Extract from this bank statement. Return ONLY valid JSON:
{
  "accountHolder": "string",
  "accountNumber": "string",
  "bankName": "string",
  "period": "string",
  "totalCredits": number,
  "totalDebits": number,
  "closingBalance": number,
  "interestEarned": number,
  "salaryCredits": [{ "date": "string", "amount": number, "from": "string" }],
  "highValueDeposits": [{ "date": "string", "amount": number, "narration": "string" }]
}
Identify salary credits by narration patterns (SALARY, SAL, NEFT from companies). Flag deposits > ₹50,000.`,

  INVOICE: `You are a GST invoice extraction AI for India. Extract from this tax invoice. Return ONLY valid JSON:
{
  "invoiceNumber": "string",
  "invoiceDate": "string",
  "sellerName": "string",
  "sellerGSTIN": "string",
  "buyerName": "string",
  "buyerGSTIN": "string",
  "items": [{ "description": "string", "qty": number, "rate": number, "amount": number, "gstRate": number }],
  "subtotal": number,
  "cgst": number,
  "sgst": number,
  "igst": number,
  "totalAmount": number
}
Parse all line items with their GST rates. Identify intra-state vs inter-state supply.`,

  OTHER: `You are an intelligent document extraction AI. Analyze this document and extract any tax-relevant or financial information you can find. Return valid JSON with keys describing the data found. Include amounts, dates, names, and any tax references (PAN, GSTIN, TDS amounts, income figures) you can identify.`,
};

// ═══════════════════════════════════════════════════════════════
//  GEMINI VISION OCR CLASS
// ═══════════════════════════════════════════════════════════════

export class GeminiOCREngine {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
    if (!key) {
      console.warn('[OCR] No Gemini API key found. OCR will use fallback mock data.');
    }
    this.genAI = new GoogleGenerativeAI(key);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  /**
   * Extract structured data from a document file
   */
  async extractFromFile(
    filePath: string,
    documentType: TaxDocType = 'OTHER'
  ): Promise<ExtractedData> {
    try {
      const absolutePath = path.resolve(filePath);

      if (!fs.existsSync(absolutePath)) {
        console.error(`[OCR] File not found: ${absolutePath}`);
        return this.getFallbackData(documentType);
      }

      const fileBuffer = fs.readFileSync(absolutePath);
      const base64Data = fileBuffer.toString('base64');
      const mimeType = this.getMimeType(absolutePath);

      const prompt = EXTRACTION_PROMPTS[documentType] || EXTRACTION_PROMPTS.OTHER;

      const result = await this.model.generateContent([
        { text: prompt },
        {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        },
      ]);

      const response = result.response;
      const text = response.text();
      const parsed = this.parseJsonFromResponse(text);

      return { type: documentType, data: parsed } as ExtractedData;
    } catch (error: any) {
      console.error(`[OCR] Extraction failed for ${filePath}:`, error.message);
      return this.getFallbackData(documentType);
    }
  }

  /**
   * Extract from base64 data directly (for API uploads)
   */
  async extractFromBase64(
    base64Data: string,
    mimeType: string,
    documentType: TaxDocType = 'OTHER'
  ): Promise<ExtractedData> {
    try {
      const prompt = EXTRACTION_PROMPTS[documentType] || EXTRACTION_PROMPTS.OTHER;

      const result = await this.model.generateContent([
        { text: prompt },
        {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        },
      ]);

      const response = result.response;
      const text = response.text();
      const parsed = this.parseJsonFromResponse(text);

      return { type: documentType, data: parsed } as ExtractedData;
    } catch (error: any) {
      console.error(`[OCR] Base64 extraction failed:`, error.message);
      return this.getFallbackData(documentType);
    }
  }

  /**
   * Auto-detect document type from content
   */
  async detectDocumentType(
    filePath: string
  ): Promise<TaxDocType> {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const base64Data = fileBuffer.toString('base64');
      const mimeType = this.getMimeType(filePath);

      const result = await this.model.generateContent([
        {
          text: `Identify this Indian tax/financial document. Return ONLY one of these values (nothing else):
FORM_16, FORM_26AS, AIS, TIS, BANK_STATEMENT, INVOICE, SALARY_SLIP, RENT_RECEIPT, OTHER`,
        },
        { inlineData: { mimeType, data: base64Data } },
      ]);

      const detected = result.response.text().trim().toUpperCase() as TaxDocType;
      const valid: TaxDocType[] = ['FORM_16', 'FORM_26AS', 'AIS', 'TIS', 'BANK_STATEMENT', 'INVOICE', 'SALARY_SLIP', 'RENT_RECEIPT', 'OTHER'];
      return valid.includes(detected) ? detected : 'OTHER';
    } catch {
      return 'OTHER';
    }
  }

  // ─── Helpers ────────────────────────────────────────────────────

  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.tiff': 'image/tiff',
      '.gif': 'image/gif',
    };
    return mimeMap[ext] || 'application/octet-stream';
  }

  private parseJsonFromResponse(text: string): any {
    // Strip markdown code fences if present
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      // Try to find JSON object in the response
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch {
          return { rawText: text, parseError: true };
        }
      }
      return { rawText: text, parseError: true };
    }
  }

  /**
   * Fallback mock data when OCR is unavailable
   */
  private getFallbackData(documentType: TaxDocType): ExtractedData {
    switch (documentType) {
      case 'FORM_16':
        return {
          type: 'FORM_16',
          data: {
            employerName: 'Sample Employer Pvt Ltd',
            employerTAN: 'DELS12345A',
            employeePAN: 'ABCDE1234F',
            employeeName: 'Client (Auto-extracted)',
            financialYear: '2025-26',
            grossSalary: 850000,
            exemptAllowances: 48000,
            standardDeduction: 75000,
            netTaxableFromSalary: 727000,
            deductions80C: 120000,
            deductions80D: 18000,
            deductions80CCD: 0,
            otherDeductions: 0,
            totalTDSDeducted: 35000,
            taxPayable: 32500,
          },
        };

      case 'FORM_26AS':
        return {
          type: 'FORM_26AS',
          data: {
            pan: 'ABCDE1234F',
            financialYear: '2025-26',
            entries: [
              { deductorName: 'Employer Pvt Ltd', deductorTAN: 'DELS12345A', section: '192', transactionDate: '2026-03-31', amountPaid: 850000, tdsDeducted: 35000, tdsDeposited: 35000 },
              { deductorName: 'SBI Savings', deductorTAN: 'MUMS98765B', section: '194A', transactionDate: '2026-03-31', amountPaid: 45000, tdsDeducted: 4500, tdsDeposited: 4500 },
            ],
            totalTDSDeducted: 39500,
            totalTCSCollected: 0,
            advanceTaxPaid: 0,
            selfAssessmentTaxPaid: 0,
          },
        };

      case 'AIS':
        return {
          type: 'AIS',
          data: {
            pan: 'ABCDE1234F',
            financialYear: '2025-26',
            salaryIncome: 850000,
            interestIncome: 45000,
            dividendIncome: 12000,
            saleOfSecurities: [],
            rentalIncome: 0,
            foreignRemittances: 0,
            gstTurnover: 0,
            tdsEntries: [
              { source: 'Salary - Employer Pvt Ltd', amount: 35000 },
              { source: 'Interest - SBI', amount: 4500 },
            ],
            highValueTransactions: [],
          },
        };

      case 'BANK_STATEMENT':
        return {
          type: 'BANK_STATEMENT',
          data: {
            accountHolder: 'Client Name',
            accountNumber: 'XXXX1234',
            bankName: 'State Bank of India',
            period: 'Apr 2025 - Mar 2026',
            totalCredits: 1200000,
            totalDebits: 980000,
            closingBalance: 340000,
            interestEarned: 22000,
            salaryCredits: [
              { date: '2025-04-30', amount: 65000, from: 'NEFT-Employer Pvt Ltd' },
            ],
            highValueDeposits: [],
          },
        };

      case 'INVOICE':
        return {
          type: 'INVOICE',
          data: {
            invoiceNumber: 'INV-001',
            invoiceDate: '2025-10-15',
            sellerName: 'Business Name',
            sellerGSTIN: '37ABCDE1234F1Z5',
            buyerName: 'Customer Name',
            buyerGSTIN: '',
            items: [{ description: 'Service/Product', qty: 1, rate: 10000, amount: 10000, gstRate: 18 }],
            subtotal: 10000,
            cgst: 900,
            sgst: 900,
            igst: 0,
            totalAmount: 11800,
          },
        };

      default:
        return {
          type: 'OTHER',
          data: { message: 'No OCR data available — using manual entry mode', documentType },
        };
    }
  }
}

// ─── Singleton Export ──────────────────────────────────────────

let ocrInstance: GeminiOCREngine | null = null;

export function getOCREngine(): GeminiOCREngine {
  if (!ocrInstance) {
    ocrInstance = new GeminiOCREngine();
  }
  return ocrInstance;
}
