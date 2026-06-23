"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  MessageSquare,
  Send,
  FileText,
  AlertCircle,
  CheckCircle,
  Copy,
  ChevronDown
} from "lucide-react";

type InvoiceActionsProps = {
  docId: string;
  docNumber: string | null;
  grandTotal: number;
  businessName: string;
  businessPhone: string | null;
  partyName: string | null;
  partyPhone?: string | null;
  dueAmount: number;
};

export function InvoiceActions({
  docId,
  docNumber,
  grandTotal,
  businessName,
  businessPhone,
  partyName,
  partyPhone,
  dueAmount,
}: InvoiceActionsProps) {
  const [theme, setTheme] = useState("classic");
  const [upiId, setUpiId] = useState("");
  const [copied, setCopied] = useState(false);
  
  // Advanced WhatsApp state
  const [templateType, setTemplateType] = useState<"invoice" | "reminder" | "receipt">("invoice");
  const [customMsg, setCustomMsg] = useState("");

  // Initialize UPI ID from localStorage or fallback
  useEffect(() => {
    const savedUpi = localStorage.getItem("billease_upi_id");
    if (savedUpi) {
      setUpiId(savedUpi);
    } else {
      const sanitizedPhone = businessPhone ? businessPhone.replace(/\D/g, "") : "";
      const fallbackUpi = sanitizedPhone ? `${sanitizedPhone}@upi` : "pay@upi";
      setUpiId(fallbackUpi);
    }
  }, [businessPhone]);

  const handleUpiChange = (val: string) => {
    setUpiId(val);
    localStorage.setItem("billease_upi_id", val);
  };

  // Generate upi://pay link
  const formattedUpiName = encodeURIComponent(businessName);
  const upiLink = `upi://pay?pa=${upiId}&pn=${formattedUpiName}&am=${dueAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
    `Invoice ${docNumber || "Draft"}`
  )}`;

  // Generate WhatsApp links
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const pdfUrl = `${baseUrl}/api/documents/${docId}/pdf?theme=${theme}`;

  // Templates definition
  const getTemplateText = (type: "invoice" | "reminder" | "receipt") => {
    const custName = partyName || "Customer";
    const docNo = docNumber || "Draft";
    
    if (type === "reminder") {
      return `Gentle Reminder from *${businessName}*.
Dear ${custName}, your payment of ₹ ${dueAmount.toFixed(2)} is outstanding for invoice ${docNo}.

Please pay instantly using this UPI link:
${upiLink}

Download PDF:
${pdfUrl}

Thank you!`;
    }

    if (type === "receipt") {
      const paidAmt = grandTotal - dueAmount;
      return `Payment Receipt from *${businessName}*.
Dear ${custName}, thank you for the payment of ₹ ${paidAmt.toFixed(2)} against invoice ${docNo}.

Your outstanding balance is now: ₹ ${dueAmount.toFixed(2)}

Download updated receipt:
${pdfUrl}

Thank you for your business!`;
    }

    // Default Invoice template
    return `Dear ${custName},
Your invoice ${docNo} from *${businessName}* has been generated.

*Grand Total:* ₹ ${grandTotal.toFixed(2)}
*Due Amount:* ₹ ${dueAmount.toFixed(2)}

Please pay instantly using this UPI link:
${upiLink}

Or download your PDF Invoice here:
${pdfUrl}

Thank you!`;
  };

  // Handle template selection
  useEffect(() => {
    setCustomMsg(getTemplateText(templateType));
  }, [templateType, docNumber, grandTotal, dueAmount, businessName, partyName, upiId]);

  // Format recipient phone for WhatsApp direct routing
  const getWhatsAppHref = () => {
    const rawPhone = partyPhone ? partyPhone.replace(/\D/g, "") : "";
    const formattedPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    return formattedPhone
      ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(customMsg)}`
      : `https://wa.me/?text=${encodeURIComponent(customMsg)}`;
  };

  const copyUpiLink = () => {
    navigator.clipboard.writeText(upiLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* PDF Premium Theme Selector */}
      <div className="card p-5 border border-slate-200/80 bg-white shadow-sm rounded-2xl">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Invoice Styling</h3>
        <div className="grid grid-cols-3 gap-3">
          {["classic", "emerald", "sapphire"].map((t) => {
            const colors: Record<string, string> = {
              classic: "bg-blue-600",
              emerald: "bg-emerald-600",
              sapphire: "bg-indigo-700",
            };
            const labels: Record<string, string> = {
              classic: "Classic Blue",
              emerald: "Emerald Green",
              sapphire: "Sapphire",
            };
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={`flex flex-col items-center gap-2 p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  theme === t
                    ? "border-blue-600 bg-blue-50/20 ring-1 ring-blue-500"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className={`h-5 w-5 rounded-full ${colors[t]} border-2 border-white shadow-sm`} />
                <span className="text-[10px] font-bold text-slate-800">{labels[t]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Notification Center */}
      <div className="card p-5 border border-slate-200/80 bg-white shadow-sm rounded-2xl space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <MessageSquare className="h-5 w-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">Advanced WhatsApp Integration</h3>
          </div>
          <p className="text-[11px] text-slate-500">
            Send dynamic reminders, invoice details, and statements instantly over WhatsApp Web/App for free.
          </p>
        </div>

        {/* UPI Config Input */}
        <div>
          <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            Payee UPI ID (Embeds clickable payment links)
          </label>
          <input
            type="text"
            className="input w-full text-xs font-semibold py-2 px-3 focus:border-emerald-500 focus:ring-emerald-100"
            placeholder="e.g. UPI-address@bank"
            value={upiId}
            onChange={(e) => handleUpiChange(e.target.value)}
          />
        </div>

        {/* Template Selectors */}
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
            Select Notification Template
          </label>
          <div className="flex rounded-xl bg-slate-100 p-0.5 border">
            {(["invoice", "reminder", "receipt"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTemplateType(t)}
                className={`flex-1 text-center py-1 text-[10px] font-bold rounded-lg capitalize transition-all cursor-pointer ${
                  templateType === t
                    ? "bg-white text-emerald-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Text Preview Area */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
            Message Preview (Editable)
          </label>
          <textarea
            className="input w-full text-xs font-mono p-3 bg-slate-50/50 leading-relaxed"
            rows={6}
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
          />
        </div>

        {/* Actions Button Grid */}
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            📄 View PDF
          </a>

          <button
            type="button"
            onClick={copyUpiLink}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? "Copied!" : "🔗 Copy UPI"}
          </button>

          <a
            href={getWhatsAppHref()}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-center text-xs font-bold text-white hover:bg-emerald-700 flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
            Send
          </a>
        </div>
      </div>
    </div>
  );
}
