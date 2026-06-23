"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  Mail,
  CheckCircle,
  Download,
  Send,
  Building
} from "lucide-react";
import { formatCurrency } from "@/lib/billease/utils";

type CaConnectionProps = {
  sales: any[];
  purchases: any[];
  expenses: any[];
};

export function CaConnection({ sales, purchases, expenses }: CaConnectionProps) {
  const [caEmail, setCaEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleExportBundle = () => {
    setGenerating(true);

    // Create CSV content for Sales
    const salesHeader = "Invoice Number,Party Name,Date,Subtotal,CGST,SGST,IGST,Grand Total\n";
    const salesRows = sales
      .map((s) =>
        `"${s.number ?? "Draft"}","${s.party?.name ?? "Walk-inCustomer"}",${new Date(
          s.date
        ).toLocaleDateString("en-GB")},${s.subtotal},${s.cgstTotal},${s.sgstTotal},${s.igstTotal},${s.grandTotal}`
      )
      .join("\n");
    const salesCsv = salesHeader + salesRows;

    // Create CSV content for Expenses
    const expenseHeader = "Date,Category,Reference,Amount,Notes\n";
    const expenseRows = expenses
      .map((e) =>
        `${new Date(e.date).toLocaleDateString("en-GB")},"${e.category}","${e.reference ?? ""}",${e.amount},"${e.notes ?? ""}"`
      )
      .join("\n");
    const expenseCsv = expenseHeader + expenseRows;

    // Download Sales CSV
    const salesBlob = new Blob([salesCsv], { type: "text/csv" });
    const salesUrl = URL.createObjectURL(salesBlob);
    const salesLink = document.createElement("a");
    salesLink.href = salesUrl;
    salesLink.download = `SALES_REPORT_${new Date().toISOString().split("T")[0]}.csv`;
    salesLink.click();
    URL.revokeObjectURL(salesUrl);

    // Download Expenses CSV
    if (expenses.length > 0) {
      const expenseBlob = new Blob([expenseCsv], { type: "text/csv" });
      const expenseUrl = URL.createObjectURL(expenseBlob);
      const expenseLink = document.createElement("a");
      expenseLink.href = expenseUrl;
      expenseLink.download = `EXPENSES_REPORT_${new Date().toISOString().split("T")[0]}.csv`;
      expenseLink.click();
      URL.revokeObjectURL(expenseUrl);
    }

    setTimeout(() => {
      setGenerating(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }, 800);
  };

  const handleSendToCa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caEmail) return;

    const emailSubject = encodeURIComponent("GST Audit & Account Books - Financial Statements");
    const emailBody = encodeURIComponent(
      `Hi,

Please find attached the financial statements and transaction logs for the audit period.

Summary:
- Total Sales Invoices: ${sales.length}
- Total Operational Expenses: ${expenses.length}

I have exported the Sales Ledger and Expenses Ledger in CSV format for easier ingestion. Please let me know if you require any specific GSTR-1 files.

Best regards.`
    );

    window.open(`mailto:${caEmail}?subject=${emailSubject}&body=${emailBody}`);
  };

  return (
    <div className="card p-5 border border-slate-200/80 bg-white shadow-sm rounded-2xl space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <Building className="h-5 w-5 text-emerald-600" />
        <h2 className="text-sm font-bold text-slate-800">Connect CA (Chartered Accountant)</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Directly export clean audit statements for your GST filings and income audits. Converts ledgers to CA-friendly spreadsheets.
          </p>

          <button
            onClick={handleExportBundle}
            disabled={generating}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4 text-slate-500" />
            {generating ? "Exporting Books..." : "Export CA Book Bundle (.CSV)"}
          </button>

          {copied && (
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" /> Book bundles generated and downloaded successfully!
            </p>
          )}
        </div>

        <form onSubmit={handleSendToCa} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              CA Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. auditor@ca.com"
              value={caEmail}
              onChange={(e) => setCaEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 text-xs py-2 cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" /> Email Audit Books to CA
          </button>
        </form>
      </div>
    </div>
  );
}

