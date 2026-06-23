"use client";

import {
  calculateDocumentTotals,
  calculateLineTax,
  isInterState,
  INDIAN_STATES,
} from "@billease/shared";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

type Party = { id: string; name: string; stateCode: string };
type Item = {
  id: string;
  name: string;
  unit: string;
  hsnSac?: string | null;
  gstRate: number;
  salePrice: number;
  purchasePrice: number;
};

type Line = {
  itemId?: string;
  description: string;
  hsnSac?: string;
  qty: number;
  unit: string;
  rate: number;
  discountPct: number;
  gstRate: number;
};

export function InvoiceEditor({
  documentId,
  initial,
  parties,
  items,
  businessStateCode,
  docType = "invoice",
}: {
  documentId?: string;
  initial?: {
    partyId?: string;
    lines: Line[];
    notes?: string;
    status?: string;
  };
  parties: Party[];
  items: Item[];
  businessStateCode: string;
  docType?: string;
}) {
  const router = useRouter();
  const [partyId, setPartyId] = useState(initial?.partyId ?? "");
  const [lines, setLines] = useState<Line[]>(
    initial?.lines?.length
      ? initial.lines
      : [
          {
            description: "",
            qty: 1,
            unit: "pcs",
            rate: 0,
            discountPct: 0,
            gstRate: 18,
          },
        ]
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes("localhost") && !event.origin.includes("vercel.app") && !event.origin.includes("setmybizz")) {
        return;
      }
      const payload = event.data;
      if (!payload || typeof payload !== "object") return;
      const { action, data } = payload;

      if (action === "CREATE_INVOICE_DRAFT") {
        if (data.partyName) {
          const matched = parties.find((p) =>
            p.name.toLowerCase().includes(data.partyName.toLowerCase())
          );
          if (matched) setPartyId(matched.id);
        }
        if (data.lines && Array.isArray(data.lines)) {
          const newLines = data.lines.map((l: any) => {
            const matchedItem = items.find((item) =>
              item.name.toLowerCase().includes((l.name || l.description || "").toLowerCase())
            );
            return {
              itemId: matchedItem?.id,
              description: l.description || l.name || matchedItem?.name || "",
              hsnSac: l.hsnSac || matchedItem?.hsnSac || "",
              qty: Number(l.qty ?? 1),
              unit: l.unit || matchedItem?.unit || "pcs",
              rate: Number(l.rate ?? matchedItem?.salePrice ?? 0),
              discountPct: Number(l.discountPct ?? 0),
              gstRate: Number(l.gstRate ?? matchedItem?.gstRate ?? 18),
            };
          });
          setLines(newLines);
        }
        if (data.notes) setNotes(data.notes);
      } else if (action === "ADD_LINE_ITEM") {
        const matchedItem = items.find((item) =>
          item.name.toLowerCase().includes((data.name || data.description || "").toLowerCase())
        );
        const newLine = {
          itemId: matchedItem?.id,
          description: data.description || data.name || matchedItem?.name || "",
          hsnSac: data.hsnSac || matchedItem?.hsnSac || "",
          qty: Number(data.qty ?? 1),
          unit: data.unit || matchedItem?.unit || "pcs",
          rate: Number(data.rate ?? matchedItem?.salePrice ?? 0),
          discountPct: Number(data.discountPct ?? 0),
          gstRate: Number(data.gstRate ?? matchedItem?.gstRate ?? 18),
        };
        setLines((prev) => {
          const filtered = prev.filter((l) => l.description.trim() !== "");
          return [...filtered, newLine];
        });
      } else if (action === "SET_PARTY") {
        if (data.partyName) {
          const matched = parties.find((p) =>
            p.name.toLowerCase().includes(data.partyName.toLowerCase())
          );
          if (matched) setPartyId(matched.id);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [parties, items]);

  useEffect(() => {
    const pending = sessionStorage.getItem("pending_invoice_command");
    if (pending) {
      try {
        const { action, data } = JSON.parse(pending);
        sessionStorage.removeItem("pending_invoice_command");
        if (action === "CREATE_INVOICE_DRAFT") {
          if (data.partyName) {
            const matched = parties.find((p) =>
              p.name.toLowerCase().includes(data.partyName.toLowerCase())
            );
            if (matched) setPartyId(matched.id);
          }
          if (data.lines && Array.isArray(data.lines)) {
            const newLines = data.lines.map((l: any) => {
              const matchedItem = items.find((item) =>
                item.name.toLowerCase().includes((l.name || l.description || "").toLowerCase())
              );
              return {
                itemId: matchedItem?.id,
                description: l.description || l.name || matchedItem?.name || "",
                hsnSac: l.hsnSac || matchedItem?.hsnSac || "",
                qty: Number(l.qty ?? 1),
                unit: l.unit || matchedItem?.unit || "pcs",
                rate: Number(l.rate ?? matchedItem?.salePrice ?? 0),
                discountPct: Number(l.discountPct ?? 0),
                gstRate: Number(l.gstRate ?? matchedItem?.gstRate ?? 18),
              };
            });
            setLines(newLines);
          }
          if (data.notes) setNotes(data.notes);
        }
      } catch (err) {
        console.error("Failed to parse pending invoice command:", err);
      }
    }
  }, [parties, items]);

  const party = parties.find((p) => p.id === partyId);
  const placeOfSupply = party?.stateCode ?? businessStateCode;
  const inter = isInterState(businessStateCode, placeOfSupply);

  const preview = useMemo(() => {
    const computed = lines
      .filter((l) => l.description)
      .map((l) => calculateLineTax(l, inter));
    return calculateDocumentTotals(computed);
  }, [lines, inter]);

  function addLine() {
    setLines([
      ...lines,
      {
        description: "",
        qty: 1,
        unit: "pcs",
        rate: 0,
        discountPct: 0,
        gstRate: 18,
      },
    ]);
  }

  function addFromItem(item: Item) {
    setLines([
      ...lines,
      {
        itemId: item.id,
        description: item.name,
        hsnSac: item.hsnSac ?? undefined,
        qty: 1,
        unit: item.unit,
        rate: docType === "purchase" ? item.purchasePrice : item.salePrice,
        discountPct: 0,
        gstRate: item.gstRate,
      },
    ]);
  }

  function updateLine(i: number, patch: Partial<Line>) {
    const next = [...lines];
    next[i] = { ...next[i], ...patch };
    setLines(next);
  }

  function removeLine(i: number) {
    setLines(lines.filter((_, idx) => idx !== i));
  }

  async function save() {
    setSaving(true);
    const payload = {
      type: docType,
      partyId: partyId || undefined,
      lines: lines.filter((l) => l.description),
      notes,
      placeOfSupply,
    };

    const url = documentId ? `/api/documents/${documentId}` : "/api/documents";
    const method = documentId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      const base =
        docType === "purchase"
          ? "/purchases"
          : "/invoices";
      router.push(`${base}/${data.id}`);
      router.refresh();
    }
  }

  async function finalize() {
    if (!documentId) {
      await save();
      return;
    }
    setSaving(true);
    await fetch(`/api/documents/${documentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "finalize" }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Customer / Party</label>
          <select
            className="input"
            value={partyId}
            onChange={(e) => setPartyId(e.target.value)}
          >
            <option value="">Walk-in customer</option>
            {parties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Place of supply</label>
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            {INDIAN_STATES[placeOfSupply] ?? placeOfSupply} —{" "}
            {inter ? "IGST (Inter-state)" : "CGST + SGST (Intra-state)"}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="text-sm font-medium text-slate-600">Quick add item:</span>
          {items.slice(0, 8).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => addFromItem(item)}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs hover:bg-slate-50"
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2 pr-2">Description</th>
                <th className="pb-2 pr-2">HSN</th>
                <th className="pb-2 pr-2">Qty</th>
                <th className="pb-2 pr-2">Rate</th>
                <th className="pb-2 pr-2">Disc%</th>
                <th className="pb-2 pr-2">GST%</th>
                <th className="pb-2 pr-2 text-right">Amount</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, i) => {
                const tax = calculateLineTax(line, inter);
                return (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-2 pr-2">
                      <input
                        className="input"
                        value={line.description}
                        onChange={(e) =>
                          updateLine(i, { description: e.target.value })
                        }
                        placeholder="Item name"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        className="input w-20"
                        value={line.hsnSac ?? ""}
                        onChange={(e) => updateLine(i, { hsnSac: e.target.value })}
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        className="input w-16"
                        type="number"
                        value={line.qty}
                        onChange={(e) =>
                          updateLine(i, { qty: Number(e.target.value) })
                        }
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        className="input w-24"
                        type="number"
                        value={line.rate}
                        onChange={(e) =>
                          updateLine(i, { rate: Number(e.target.value) })
                        }
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        className="input w-16"
                        type="number"
                        value={line.discountPct}
                        onChange={(e) =>
                          updateLine(i, { discountPct: Number(e.target.value) })
                        }
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        className="input w-16"
                        type="number"
                        value={line.gstRate}
                        onChange={(e) =>
                          updateLine(i, { gstRate: Number(e.target.value) })
                        }
                      />
                    </td>
                    <td className="py-2 pr-2 text-right">
                      {formatCurrency(tax.lineTotal)}
                    </td>
                    <td className="py-2">
                      <button
                        type="button"
                        onClick={() => removeLine(i)}
                        className="text-red-500 text-xs"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={addLine} className="mt-3 text-sm text-blue-600">
          + Add line
        </button>
      </div>

      <div>
        <label className="label">Notes</label>
        <textarea
          className="input"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="card max-w-sm ml-auto space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Taxable</span>
          <span>{formatCurrency(preview.taxableTotal)}</span>
        </div>
        {preview.cgstTotal > 0 && (
          <div className="flex justify-between">
            <span>CGST</span>
            <span>{formatCurrency(preview.cgstTotal)}</span>
          </div>
        )}
        {preview.sgstTotal > 0 && (
          <div className="flex justify-between">
            <span>SGST</span>
            <span>{formatCurrency(preview.sgstTotal)}</span>
          </div>
        )}
        {preview.igstTotal > 0 && (
          <div className="flex justify-between">
            <span>IGST</span>
            <span>{formatCurrency(preview.igstTotal)}</span>
          </div>
        )}
        <div className="flex justify-between border-t pt-2 text-lg font-bold">
          <span>Grand Total</span>
          <span>{formatCurrency(preview.grandTotal)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={save} className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save draft"}
        </button>
        {documentId && initial?.status === "draft" && (
          <button type="button" onClick={finalize} className="btn-secondary" disabled={saving}>
            Finalize invoice
          </button>
        )}
      </div>
    </div>
  );
}
