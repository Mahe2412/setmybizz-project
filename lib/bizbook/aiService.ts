import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export interface InvoiceScanResult {
  vendor: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  confidence: number;
  items?: Array<{
    name: string;
    qty: number;
    price: number;
    gst?: number;
  }>;
}

export interface BusinessInsight {
  title: string;
  insight: string;
  recommendation: string;
  impact: "high" | "medium" | "low";
  actionable: boolean;
}

export interface PaymentReminder {
  invoiceId: string;
  customerName: string;
  amount: number;
  daysOverdue: number;
  suggestedMessage: string;
  priority: "urgent" | "high" | "medium";
}

export interface ExpenseAnalysis {
  category: string;
  totalAmount: number;
  percentage: number;
  trend: "increasing" | "decreasing" | "stable";
  insight: string;
}

class BizBookAIService {
  private model = genAI.getGenerativeModel({ model: "gemini-pro" });
  private visionModel = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  async scanInvoiceImage(imageBase64: string): Promise<InvoiceScanResult> {
    try {
      const response = await this.visionModel.generateContent([
        {
          inlineData: {
            data: imageBase64,
            mimeType: "image/jpeg",
          },
        },
        `Analyze this invoice/receipt image and extract the following information in JSON format:
{
  "vendor": "Company name",
  "date": "YYYY-MM-DD",
  "amount": number,
  "category": "one of: Office, Travel, Marketing, Supplies, Vendor Payment, Inventory, Other",
  "description": "Brief description",
  "items": [{"name": "item name", "qty": number, "price": number, "gst": percentage}],
  "confidence": 0-1
}
Return ONLY valid JSON, no other text.`,
      ]);

      const text = response.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Invoice scanning error:", error);
      throw error;
    }
  }

  async generateBusinessInsights(
    transactions: any[],
    expenses: any[],
    items: any[]
  ): Promise<BusinessInsight[]> {
    try {
      const totalSales = transactions.reduce((sum, t) => sum + (t.total || 0), 0);
      const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
      const profit = totalSales - totalExpenses;
      const profitMargin = totalSales > 0 ? (profit / totalSales) * 100 : 0;

      const prompt = `As a business advisor, analyze this data and provide 3-4 key insights:
- Total Sales: ₹${totalSales.toFixed(2)}
- Total Expenses: ₹${totalExpenses.toFixed(2)}
- Profit Margin: ${profitMargin.toFixed(1)}%
- Number of Transactions: ${transactions.length}
- Low Stock Items: ${items.filter((i) => (i.stock ?? 0) <= 5).length}

For each insight, provide JSON array with:
{
  "title": "insight title",
  "insight": "detailed insight",
  "recommendation": "actionable recommendation",
  "impact": "high|medium|low",
  "actionable": boolean
}
Return ONLY valid JSON array.`;

      const response = await this.model.generateContent(prompt);
      const text = response.response.text();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("No JSON array found");

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Insights generation error:", error);
      return [];
    }
  }

  async generatePaymentReminders(
    transactions: any[],
    parties: any[]
  ): Promise<PaymentReminder[]> {
    try {
      const unpaidInvoices = transactions.filter(
        (t) => t.status === "unpaid" || t.status === "partial"
      );

      if (unpaidInvoices.length === 0) return [];

      const prompt = `Generate payment reminder messages for ${unpaidInvoices.length} overdue invoices.
For each invoice, suggest a professional, friendly SMS/email message.
Return JSON array with:
{
  "invoiceId": "id",
  "customerName": "name",
  "amount": number,
  "daysOverdue": number,
  "suggestedMessage": "short, professional reminder message",
  "priority": "urgent|high|medium"
}`;

      const response = await this.model.generateContent(prompt);
      const text = response.response.text();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("No JSON array found");

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Payment reminder error:", error);
      return [];
    }
  }

  async analyzeExpenses(expenses: any[]): Promise<ExpenseAnalysis[]> {
    try {
      const categories = new Map<string, number>();
      expenses.forEach((e) => {
        const curr = categories.get(e.category) || 0;
        categories.set(e.category, curr + e.amount);
      });

      const prompt = `Analyze these business expenses and provide insights:
${Array.from(categories.entries())
  .map(([cat, amt]) => `${cat}: ₹${amt.toFixed(2)}`)
  .join("\n")}

For each category, provide JSON with:
{
  "category": "name",
  "totalAmount": number,
  "percentage": number,
  "trend": "increasing|decreasing|stable",
  "insight": "brief insight"
}
Return ONLY valid JSON array.`;

      const response = await this.model.generateContent(prompt);
      const text = response.response.text();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("No JSON array found");

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Expense analysis error:", error);
      return [];
    }
  }

  async getSmartSuggestions(
    currentInvoice: any,
    parties: any[],
    items: any[]
  ): Promise<{
    suggestedParty?: string;
    suggestedItems?: string[];
    suggestedNextSteps?: string[];
  }> {
    try {
      const prompt = `Based on invoice creation patterns, suggest:
1. Most likely customer for this invoice
2. Items that should be added to catalog
3. Next immediate business actions

Current data: 
- Available parties: ${parties.map((p) => p.name).join(", ")}
- Popular items: ${items
        .slice(0, 5)
        .map((i) => i.name)
        .join(", ")}

Return JSON with keys: suggestedParty, suggestedItems, suggestedNextSteps`;

      const response = await this.model.generateContent(prompt);
      const text = response.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Smart suggestions error:", error);
      return {};
    }
  }

  async validateInvoiceCompliance(invoice: any): Promise<{
    isCompliant: boolean;
    issues: string[];
    warnings: string[];
  }> {
    try {
      const issues = [];
      const warnings = [];

      // Basic GST validation
      if (!invoice.gstin) warnings.push("Business GSTIN not set");
      if (
        invoice.total > 0 &&
        !invoice.cgst_total &&
        !invoice.sgst_total &&
        !invoice.igst_total
      ) {
        issues.push("GST not calculated or missing");
      }

      // Party validation
      if (!invoice.party_id && invoice.total > 50000) {
        warnings.push("Large invoice without registered customer");
      }

      // Invoice number validation
      if (!invoice.number || invoice.number.trim() === "") {
        issues.push("Invoice number missing");
      }

      // Date validation
      const invoiceDate = new Date(invoice.txn_date);
      const today = new Date();
      if (invoiceDate > today) {
        warnings.push("Invoice date is in the future");
      }

      return {
        isCompliant: issues.length === 0,
        issues,
        warnings,
      };
    } catch (error) {
      console.error("Compliance check error:", error);
      return {
        isCompliant: false,
        issues: ["Error checking compliance"],
        warnings: [],
      };
    }
  }
}

export const bizBookAI = new BizBookAIService();
