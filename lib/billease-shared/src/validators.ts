import { z } from "zod";

export const partySchema = z.object({
  type: z.enum(["customer", "supplier"]),
  name: z.string().min(1),
  gstin: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  billingAddress: z.string().optional(),
  shippingAddress: z.string().optional(),
  stateCode: z.string().length(2),
  openingBalance: z.coerce.number().default(0),
});

export const itemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  unit: z.string().default("pcs"),
  hsnSac: z.string().optional(),
  gstRate: z.coerce.number().min(0).max(100),
  salePrice: z.coerce.number().min(0),
  purchasePrice: z.coerce.number().min(0),
  trackStock: z.boolean().default(false),
  stockQty: z.coerce.number().default(0),
  lowStockAlert: z.coerce.number().optional(),
});

export const businessSchema = z.object({
  name: z.string().min(1),
  legalName: z.string().optional(),
  gstin: z.string().optional(),
  stateCode: z.string().length(2),
  address: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  invoicePrefix: z.string().default("INV"),
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  bankIfsc: z.string().optional(),
  bankBranch: z.string().optional(),
  upiId: z.string().optional(),
  signatory: z.string().optional(),
  termsAndConditions: z.string().optional(),
});

export const documentLineSchema = z.object({
  itemId: z.string().optional(),
  description: z.string().min(1),
  hsnSac: z.string().optional(),
  qty: z.coerce.number().positive(),
  unit: z.string().default("pcs"),
  rate: z.coerce.number().min(0),
  discountPct: z.coerce.number().min(0).max(100).default(0),
  gstRate: z.coerce.number().min(0).max(100),
});

export const paymentSchema = z.object({
  partyId: z.string().optional(),
  documentId: z.string().optional(),
  amount: z.coerce.number().positive(),
  mode: z.enum(["cash", "upi", "bank", "cheque", "card"]),
  reference: z.string().optional(),
  notes: z.string().optional(),
  date: z.coerce.date(),
});
