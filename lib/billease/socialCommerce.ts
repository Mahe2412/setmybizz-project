/** WhatsApp / Instagram social-commerce order helpers */

export type OrderStatus =
  | "awaiting_payment"
  | "screenshot_received"
  | "payment_confirmed"
  | "packed"
  | "shipped"
  | "delivered";

export type CatalogItem = {
  id: string;
  name: string;
  salePrice: number;
  gstRate: number;
  shippingDefault: number;
  unit: string;
};

export type SocialOrder = {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  instagramHandle?: string;
  items: { name: string; qty: number; rate: number; gstRate: number }[];
  shipping: number;
  paymentMode: "phonepe" | "gpay" | "upi" | "cash" | "bank";
  amountPaid: number;
  paymentScreenshotNote?: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  status: OrderStatus;
  notes?: string;
};

export function calcOrderTotal(
  items: SocialOrder["items"],
  shipping: number
): { subtotal: number; gst: number; grandTotal: number } {
  let subtotal = 0;
  let gst = 0;
  for (const line of items) {
    const lineSub = line.qty * line.rate;
    const lineGst = (lineSub * line.gstRate) / 100;
    subtotal += lineSub;
    gst += lineGst;
  }
  return {
    subtotal: round(subtotal),
    gst: round(gst),
    grandTotal: round(subtotal + gst + shipping),
  };
}

function round(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function buildCatalogWhatsAppMessage(
  items: CatalogItem[],
  businessName: string,
  extraNote?: string
): string {
  const lines = [
    `Hi! 👋 Welcome to *${businessName}*`,
    ``,
    `*Shampoo catalog & prices:*`,
    ``,
  ];
  for (const item of items) {
    const gstNote = item.gstRate ? ` (+${item.gstRate}% GST)` : "";
    lines.push(
      `• *${item.name}* — ₹${item.salePrice}${gstNote}`,
      `  Shipping from ₹${item.shippingDefault}`,
      ``
    );
  }
  lines.push(
    `*How to order:*`,
    `1️⃣ Reply with shampoo name + quantity`,
    `2️⃣ Pay via PhonePe / GPay (we'll share UPI)`,
    `3️⃣ Send payment screenshot here`,
    `4️⃣ Share full delivery address (name, phone, pincode)`,
    ``,
    `We'll confirm and dispatch quickly! 🚚`
  );
  if (extraNote) lines.push(``, extraNote);
  return lines.join("\n");
}

export function buildPaymentRequestMessage(
  items: SocialOrder["items"],
  shipping: number,
  upiId?: string
): string {
  const { grandTotal } = calcOrderTotal(items, shipping);
  const detail = items
    .map((i) => `${i.name} x${i.qty} @ ₹${i.rate}`)
    .join(", ");
  return [
    `Your order: ${detail}`,
    `Shipping: ₹${shipping}`,
    `*Total to pay: ₹${grandTotal}*`,
    upiId ? `Pay to UPI: ${upiId}` : `We'll share UPI / PhonePe link`,
    `After payment, please send screenshot + delivery address 📍`,
  ].join("\n");
}

export function buildDeliveryAgentMessage(orders: SocialOrder[]): string {
  const confirmed = orders.filter(
    (o) =>
      o.status === "payment_confirmed" ||
      o.status === "packed" ||
      o.status === "screenshot_received"
  );
  if (!confirmed.length) return "No orders ready for delivery.";

  const lines = [`📦 *Delivery list — ${new Date().toLocaleDateString("en-IN")}*`, ``];
  confirmed.forEach((o, idx) => {
    const items = o.items.map((i) => `${i.name}x${i.qty}`).join(", ");
    lines.push(
      `*${idx + 1}. ${o.customerName}*`,
      `Phone: ${o.phone}`,
      `${o.address}`,
      `${o.city}, ${o.pincode} (${o.state})`,
      `Items: ${items}`,
      `Paid: ₹${o.amountPaid} (${o.paymentMode})`,
      `---`
    );
  });
  return lines.join("\n");
}

export function buildDocsPasteBlock(orders: SocialOrder[]): string {
  return orders
    .map((o, i) => {
      const items = o.items.map((x) => `${x.name} x${x.qty}`).join(", ");
      return [
        `${i + 1}. ${o.customerName} | ${o.phone}`,
        `   ${items} | Ship ₹${o.shipping} | Paid ₹${o.amountPaid}`,
        `   ${o.address}, ${o.city} - ${o.pincode}`,
      ].join("\n");
    })
    .join("\n");
}

export const DEFAULT_SHAMPOO_CATALOG: CatalogItem[] = [
  {
    id: "sh1",
    name: "Herbal Shampoo 200ml",
    salePrice: 180,
    gstRate: 18,
    shippingDefault: 70,
    unit: "pcs",
  },
  {
    id: "sh2",
    name: "Anti-Dandruff Shampoo 200ml",
    salePrice: 220,
    gstRate: 18,
    shippingDefault: 70,
    unit: "pcs",
  },
  {
    id: "sh3",
    name: "Kids Mild Shampoo 100ml",
    salePrice: 150,
    gstRate: 18,
    shippingDefault: 70,
    unit: "pcs",
  },
];

export const STORAGE_KEY_ORDERS = "billease_social_orders_v1";
export const STORAGE_KEY_CATALOG = "billease_social_catalog_v1";
