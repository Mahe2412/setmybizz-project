import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@billease.app" },
    update: {},
    create: {
      email: "demo@billease.app",
      name: "Demo User",
      passwordHash,
    },
  });

  const business = await prisma.business.upsert({
    where: { id: "seed-business" },
    update: {},
    create: {
      id: "seed-business",
      name: "Demo Traders",
      legalName: "Demo Traders Pvt Ltd",
      gstin: "27AAAAA0000A1Z5",
      stateCode: "27",
      address: "123 MG Road",
      city: "Mumbai",
      pincode: "400001",
      phone: "9876543210",
      email: "demo@billease.app",
      invoicePrefix: "INV",
      invoiceNextNum: 1,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_businessId: { userId: user.id, businessId: business.id },
    },
    update: {},
    create: {
      userId: user.id,
      businessId: business.id,
      role: "owner",
    },
  });

  await prisma.stockMovement.deleteMany({ where: { businessId: business.id } });
  await prisma.payment.deleteMany({ where: { businessId: business.id } });
  await prisma.documentLine.deleteMany({
    where: { document: { businessId: business.id } },
  });
  await prisma.document.deleteMany({ where: { businessId: business.id } });
  await prisma.item.deleteMany({ where: { businessId: business.id } });
  await prisma.party.deleteMany({ where: { businessId: business.id } });

  const customer = await prisma.party.create({
    data: {
      businessId: business.id,
      type: "customer",
      name: "Sharma Retail",
      gstin: "27BBBBB0000B1Z5",
      phone: "9123456780",
      stateCode: "27",
      billingAddress: "Andheri, Mumbai",
    },
  });

  await prisma.party.create({
    data: {
      businessId: business.id,
      type: "supplier",
      name: "Patel Wholesale",
      stateCode: "24",
      billingAddress: "Ahmedabad, Gujarat",
    },
  });

  const item1 = await prisma.item.create({
    data: {
      businessId: business.id,
      name: "Notebook A4",
      unit: "pcs",
      hsnSac: "4820",
      gstRate: 12,
      salePrice: 50,
      purchasePrice: 35,
      trackStock: true,
      stockQty: 100,
      lowStockAlert: 10,
    },
  });

  await prisma.item.create({
    data: {
      businessId: business.id,
      name: "Pen Blue",
      unit: "pcs",
      hsnSac: "9608",
      gstRate: 18,
      salePrice: 10,
      purchasePrice: 6,
      trackStock: true,
      stockQty: 500,
      lowStockAlert: 50,
    },
  });

  console.log("Seed complete. Login: demo@billease.app / demo1234");
  console.log("Business ID:", business.id);
  console.log("Sample customer:", customer.id);
  console.log("Sample item:", item1.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
