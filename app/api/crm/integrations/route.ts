import { prisma } from "@billease/db";
import { getSession } from "@/lib/billease/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    const businessId = session?.user?.businessId || "seed-business";

    const integrations = await prisma.crmIntegration.findMany({
      where: { businessId }
    });

    return NextResponse.json(integrations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const businessId = session?.user?.businessId || "seed-business";
    const body = await req.json();
    const { type, credentials, active } = body;

    if (!type) {
      return NextResponse.json({ error: "Integration type is required" }, { status: 400 });
    }

    const existing = await prisma.crmIntegration.findFirst({
      where: { businessId, type }
    });

    let integration;
    if (existing) {
      integration = await prisma.crmIntegration.update({
        where: { id: existing.id },
        data: {
          credentials: typeof credentials === "string" ? credentials : JSON.stringify(credentials),
          active: active !== undefined ? active : existing.active
        }
      });
    } else {
      integration = await prisma.crmIntegration.create({
        data: {
          businessId,
          type,
          credentials: typeof credentials === "string" ? credentials : JSON.stringify(credentials),
          active: active !== undefined ? active : true
        }
      });
    }

    return NextResponse.json(integration);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
