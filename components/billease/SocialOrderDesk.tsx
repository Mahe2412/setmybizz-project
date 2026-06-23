"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildCatalogWhatsAppMessage,
  buildDeliveryAgentMessage,
  buildDocsPasteBlock,
  buildPaymentRequestMessage,
  calcOrderTotal,
  DEFAULT_SHAMPOO_CATALOG,
  STORAGE_KEY_CATALOG,
  STORAGE_KEY_ORDERS,
  type CatalogItem,
  type OrderStatus,
  type SocialOrder,
} from "@/lib/billease/socialCommerce";

const STATUS_LABEL: Record<OrderStatus, string> = {
  awaiting_payment: "Waiting payment",
  screenshot_received: "Screenshot received",
  payment_confirmed: "Payment confirmed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
};

const emptyLine = () => ({
  name: "Herbal Shampoo 200ml",
  qty: 1,
  rate: 180,
  gstRate: 18,
});

export default function SocialOrderDesk() {
  const [catalog, setCatalog] = useState<CatalogItem[]>(DEFAULT_SHAMPOO_CATALOG);
  const [orders, setOrders] = useState<SocialOrder[]>([]);
  const [businessName, setBusinessName] = useState("Your Shampoo Brand");
  const [upiId, setUpiId] = useState("");
  const [copied, setCopied] = useState("");
  const [view, setView] = useState<"orders" | "new" | "labels">("orders");

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    instagramHandle: "",
    items: [emptyLine()],
    shipping: 70,
    paymentMode: "phonepe" as SocialOrder["paymentMode"],
    amountPaid: 0,
    paymentScreenshotNote: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    status: "screenshot_received" as OrderStatus,
    notes: "",
  });

  useEffect(() => {
    try {
      const o = localStorage.getItem(STORAGE_KEY_ORDERS);
      const c = localStorage.getItem(STORAGE_KEY_CATALOG);
      if (o) setOrders(JSON.parse(o));
      if (c) setCatalog(JSON.parse(c));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CATALOG, JSON.stringify(catalog));
  }, [catalog]);

  const previewTotal = useMemo(
    () => calcOrderTotal(form.items, form.shipping),
    [form.items, form.shipping]
  );

  function flash(msg: string) {
    setCopied(msg);
    setTimeout(() => setCopied(""), 2000);
  }

  async function copyText(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    flash(`${label} copied`);
  }

  function openWhatsApp(text: string, phone?: string) {
    const url = phone
      ? `https://wa.me/91${phone.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  function saveOrder() {
    if (!form.customerName.trim() || !form.phone.trim()) {
      alert("Customer name and phone required");
      return;
    }
    const order: SocialOrder = {
      id: `ord_${Date.now()}`,
      createdAt: new Date().toISOString(),
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      instagramHandle: form.instagramHandle || undefined,
      items: form.items.filter((i) => i.name.trim()),
      shipping: form.shipping,
      paymentMode: form.paymentMode,
      amountPaid: form.amountPaid || previewTotal.grandTotal,
      paymentScreenshotNote: form.paymentScreenshotNote,
      address: form.address,
      city: form.city,
      pincode: form.pincode,
      state: form.state,
      status: form.status,
      notes: form.notes,
    };
    setOrders((prev) => [order, ...prev]);
    setView("orders");
    setForm({
      customerName: "",
      phone: "",
      instagramHandle: "",
      items: [emptyLine()],
      shipping: 70,
      paymentMode: "phonepe",
      amountPaid: 0,
      paymentScreenshotNote: "",
      address: "",
      city: "",
      pincode: "",
      state: "",
      status: "screenshot_received",
      notes: "",
    });
  }

  function updateStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  const readyForDelivery = orders.filter(
    (o) => o.status === "payment_confirmed" || o.status === "packed"
  );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="shrink-0 border-b border-slate-100 bg-gradient-to-r from-pink-50 to-violet-50 px-4 py-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-pink-600">
          Instagram & WhatsApp Order Desk
        </p>
        <h2 className="text-lg font-black text-slate-900">
          Shampoo orders — pay → confirm → pack → deliver
        </h2>
        <p className="text-xs text-slate-500">
          Catalog share → screenshot → address → copy for delivery agent / labels
        </p>
      </div>

      <div className="flex shrink-0 gap-1 border-b border-slate-100 p-2">
        {(
          [
            ["orders", "Orders"],
            ["new", "+ New order"],
            ["labels", "Packing labels"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setView(id)}
            className={`rounded-lg px-3 py-2 text-xs font-bold ${
              view === id ? "bg-pink-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {copied && (
        <div className="bg-green-50 px-4 py-2 text-center text-xs font-bold text-green-700">
          {copied}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {view === "orders" && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-slate-600">Brand name</label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">UPI / PhonePe ID</label>
                <input
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="brand@upi"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white"
                onClick={() =>
                  copyText(
                    buildCatalogWhatsAppMessage(catalog, businessName),
                    "Catalog"
                  )
                }
              >
                Copy catalog (WhatsApp)
              </button>
              <button
                type="button"
                className="rounded-lg border border-green-600 px-3 py-2 text-xs font-bold text-green-700"
                onClick={() =>
                  openWhatsApp(buildCatalogWhatsAppMessage(catalog, businessName))
                }
              >
                Send catalog WA
              </button>
              <button
                type="button"
                className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-bold text-white"
                onClick={() =>
                  copyText(buildDeliveryAgentMessage(orders), "Delivery list")
                }
              >
                Copy for delivery agent
              </button>
              <button
                type="button"
                className="rounded-lg border border-violet-300 px-3 py-2 text-xs font-bold text-violet-700"
                onClick={() =>
                  copyText(buildDocsPasteBlock(readyForDelivery), "Docs paste")
                }
              >
                Copy for Google Doc
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-amber-50 p-3">
                <p className="font-black text-amber-800">
                  {orders.filter((o) => o.status === "screenshot_received").length}
                </p>
                <p className="text-amber-600">Screenshot</p>
              </div>
              <div className="rounded-xl bg-green-50 p-3">
                <p className="font-black text-green-800">
                  {orders.filter((o) => o.status === "payment_confirmed").length}
                </p>
                <p className="text-green-600">Confirmed</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3">
                <p className="font-black text-blue-800">{readyForDelivery.length}</p>
                <p className="text-blue-600">To pack</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-8">
                No orders yet. Tap &quot;+ New order&quot; when customer sends screenshot.
              </p>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => {
                  const t = calcOrderTotal(o.items, o.shipping);
                  return (
                    <div
                      key={o.id}
                      className="rounded-xl border border-slate-200 p-4 text-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-bold">{o.customerName}</p>
                          <p className="text-slate-500">{o.phone}</p>
                          {o.instagramHandle && (
                            <p className="text-xs text-pink-600">@{o.instagramHandle}</p>
                          )}
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase">
                          {STATUS_LABEL[o.status]}
                        </span>
                      </div>
                      <p className="mt-2 text-slate-700">
                        {o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                      </p>
                      <p className="text-slate-500">
                        Total ₹{t.grandTotal} · Paid ₹{o.amountPaid} · Ship ₹{o.shipping}
                      </p>
                      {o.address && (
                        <p className="mt-1 text-slate-600">
                          📍 {o.address}, {o.city} {o.pincode}
                        </p>
                      )}
                      {o.paymentScreenshotNote && (
                        <p className="mt-1 text-xs text-amber-700">
                          Screenshot: {o.paymentScreenshotNote}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="text-xs font-bold text-green-700"
                          onClick={() => updateStatus(o.id, "payment_confirmed")}
                        >
                          Confirm pay
                        </button>
                        <button
                          type="button"
                          className="text-xs font-bold text-blue-700"
                          onClick={() => updateStatus(o.id, "packed")}
                        >
                          Packed
                        </button>
                        <button
                          type="button"
                          className="text-xs font-bold text-violet-700"
                          onClick={() =>
                            openWhatsApp(
                              `Hi ${o.customerName}, your shampoo order is confirmed! Dispatch soon. 🚚`,
                              o.phone
                            )
                          }
                        >
                          WA customer
                        </button>
                        <button
                          type="button"
                          className="text-xs font-bold text-slate-600"
                          onClick={() =>
                            copyText(
                              `${o.customerName}\n${o.phone}\n${o.address}\n${o.city} ${o.pincode}`,
                              "Address"
                            )
                          }
                        >
                          Copy address
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {view === "new" && (
          <div className="mx-auto max-w-lg space-y-4">
            <p className="text-sm text-slate-600">
              Customer WhatsApp screenshot + address enter chesi save cheyandi.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className="rounded-lg border px-3 py-2 text-sm"
                placeholder="Customer name *"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              />
              <input
                className="rounded-lg border px-3 py-2 text-sm"
                placeholder="Phone *"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                className="rounded-lg border px-3 py-2 text-sm sm:col-span-2"
                placeholder="Instagram @ (optional)"
                value={form.instagramHandle}
                onChange={(e) => setForm({ ...form, instagramHandle: e.target.value })}
              />
            </div>

            {form.items.map((line, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-2">
                <input
                  className="col-span-2 rounded-lg border px-2 py-2 text-sm"
                  placeholder="Shampoo"
                  value={line.name}
                  onChange={(e) => {
                    const items = [...form.items];
                    items[idx] = { ...items[idx], name: e.target.value };
                    setForm({ ...form, items });
                  }}
                />
                <input
                  type="number"
                  className="rounded-lg border px-2 py-2 text-sm"
                  placeholder="Qty"
                  value={line.qty}
                  onChange={(e) => {
                    const items = [...form.items];
                    items[idx] = { ...items[idx], qty: Number(e.target.value) };
                    setForm({ ...form, items });
                  }}
                />
                <input
                  type="number"
                  className="rounded-lg border px-2 py-2 text-sm"
                  placeholder="Rate"
                  value={line.rate}
                  onChange={(e) => {
                    const items = [...form.items];
                    items[idx] = { ...items[idx], rate: Number(e.target.value) };
                    setForm({ ...form, items });
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              className="text-xs font-bold text-pink-600"
              onClick={() =>
                setForm({ ...form, items: [...form.items, emptyLine()] })
              }
            >
              + Add product line
            </button>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold">Shipping ₹</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={form.shipping}
                  onChange={(e) =>
                    setForm({ ...form, shipping: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-bold">Amount paid ₹</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                  value={form.amountPaid || previewTotal.grandTotal}
                  onChange={(e) =>
                    setForm({ ...form, amountPaid: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <p className="rounded-lg bg-slate-50 p-3 text-sm font-bold">
              Order total: ₹{previewTotal.grandTotal} (incl. GST ₹{previewTotal.gst})
            </p>

            <button
              type="button"
              className="w-full rounded-lg border border-green-300 py-2 text-sm font-bold text-green-700"
              onClick={() =>
                openWhatsApp(
                  buildPaymentRequestMessage(form.items, form.shipping, upiId),
                  form.phone || undefined
                )
              }
            >
              Send payment message on WhatsApp
            </button>

            <textarea
              className="w-full rounded-lg border px-3 py-2 text-sm"
              rows={2}
              placeholder="Payment screenshot note (e.g. PhonePe ref 1234)"
              value={form.paymentScreenshotNote}
              onChange={(e) =>
                setForm({ ...form, paymentScreenshotNote: e.target.value })
              }
            />
            <textarea
              className="w-full rounded-lg border px-3 py-2 text-sm"
              rows={2}
              placeholder="Full address *"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                className="rounded-lg border px-3 py-2 text-sm"
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <input
                className="rounded-lg border px-3 py-2 text-sm"
                placeholder="Pincode"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              />
              <input
                className="rounded-lg border px-3 py-2 text-sm"
                placeholder="State"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </div>

            <select
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as OrderStatus })
              }
            >
              {Object.entries(STATUS_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={saveOrder}
              className="w-full rounded-xl bg-pink-600 py-3 text-sm font-black text-white"
            >
              Save order
            </button>
          </div>
        )}

        {view === "labels" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Print labels — cut & paste on packing. Confirmed orders only.
            </p>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white print:hidden"
            >
              Print labels
            </button>
            <div className="grid gap-4 sm:grid-cols-2 print:grid-cols-2">
              {readyForDelivery.map((o) => (
                <div
                  key={o.id}
                  className="break-inside-avoid rounded-lg border-2 border-dashed border-slate-300 p-4 text-sm"
                >
                  <p className="text-[10px] font-black uppercase text-slate-400">
                    {businessName}
                  </p>
                  <p className="text-lg font-black">{o.customerName}</p>
                  <p className="font-bold">{o.phone}</p>
                  <p className="mt-2 text-xs leading-snug">
                    {o.address}
                    <br />
                    {o.city}, {o.state} — {o.pincode}
                  </p>
                  <p className="mt-2 border-t pt-2 font-medium">
                    {o.items.map((i) => `${i.name}×${i.qty}`).join(", ")}
                  </p>
                  <p className="text-xs text-slate-500">#{o.id.slice(-6)}</p>
                </div>
              ))}
            </div>
            {readyForDelivery.length === 0 && (
              <p className="text-slate-400">Confirm payments first to print labels.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

