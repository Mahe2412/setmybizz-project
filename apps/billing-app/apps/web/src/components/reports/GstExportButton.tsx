"use client";

import { useState } from "react";

export function GstExportButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reports/gst-export");
      if (!res.ok) throw new Error("Failed to generate GST export");
      const data = await res.json();
      
      // Convert to blob and download
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `GSTR1_Export_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err: any) {
      alert(err.message || "An error occurred during export");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/10"
    >
      {loading ? "Exporting..." : "📥 Export GST Data (GSTR-1 JSON)"}
    </button>
  );
}
