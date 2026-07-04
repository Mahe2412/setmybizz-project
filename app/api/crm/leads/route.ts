import { prisma } from "@billease/db";
import { getSession } from "@/lib/billease/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();
    const businessId = session?.user?.businessId || null;

    const leads = await prisma.crmLead.findMany({
      where: businessId ? { businessId } : {},
      include: {
        messages: {
          orderBy: { sentAt: "asc" }
        }
      },
      orderBy: { addedAt: "desc" }
    });

    return NextResponse.json(leads);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const businessId = session?.user?.businessId || null;
    const body = await req.json();

    const lead = await prisma.crmLead.create({
      data: {
        businessId,
        name: body.name || "Unknown",
        phone: body.phone || "—",
        category: body.category || "Unknown",
        stage: body.stage || "New",
        priority: body.priority || "Medium",
        source: body.source || "Manual",
        note: body.note || null,
        score: body.score || 40,
      }
    });

    return NextResponse.json(lead);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...patchData } = body;

    if (!id) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    const lead = await prisma.crmLead.update({
      where: { id },
      data: patchData
    });

    return NextResponse.json(lead);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
