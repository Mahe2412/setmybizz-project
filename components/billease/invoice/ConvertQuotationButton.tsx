"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function ConvertQuotationButton({ documentId }: { documentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function convert() {
    if (!confirm("Convert this quotation to a Tax Invoice? This will create a new invoice draft with the same items.")) return;
    setLoading(true);
    const res = await fetch(`/api/documents/${documentId}/convert`, { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (res.ok && data.id) {
      router.push(`/billease/invoices/${data.id}`);
      router.refresh();
    } else {
      alert("Conversion failed. Please try again.");
    }
  }

  return (
    <button
      type="button"
      onClick={convert}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all disabled:opacity-60"
    >
      <ArrowRight className="h-3.5 w-3.5" />
      {loading ? "Converting…" : "Convert to Invoice"}
    </button>
  );
}

