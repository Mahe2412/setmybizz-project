import { prisma } from "@billease/db";
import { NextResponse } from "next/server";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function classify(note: string) {
  const n = note.toLowerCase();
  if (/idea|startup|app|tech|saas|launch|found|mvp|build|fintech|edtech|product/.test(n)) return "Startup";
  if (/shop|kirana|store|trader|retail|showroom|wholesale/.test(n)) return "Retail";
  if (/manufactur|factory|msme|sme|unit|export|production|garment/.test(n)) return "MSME";
  if (/salon|clinic|consult|freelanc|agency|service|doctor|coach|it |software/.test(n)) return "Service";
  return "Unknown";
}

function priority(cat: string, stage: string) {
  if (stage === "Replied" || stage === "Interested") return "High";
  if (cat === "Unknown" || stage === "Closed") return "Low";
  return "Medium";
}

function aiScore(cat: string, stage: string) {
  return Math.min(100, (cat !== "Unknown" ? 50 : 40));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessId, name, phone, note, source } = body;

    const targetBusinessId = businessId || "seed-business";
    const contextNote = note || "Web form submission";
    const cat = classify(contextNote);
    const leadStage = "New";
    const pri = priority(cat, leadStage);
    const score = aiScore(cat, leadStage);

    const lead = await prisma.crmLead.create({
      data: {
        businessId: targetBusinessId,
        name: name || "Web Prospect",
        phone: phone || "—",
        category: cat,
        stage: leadStage,
        priority: pri,
        source: source || "Website Widget",
        note: contextNote,
        score: score,
      }
    });

    // Auto-create welcome message
    await prisma.crmMessage.create({
      data: {
        leadId: lead.id,
        role: "ai",
        text: `Welcome to SetMyBizz! Thank you for requesting info. We will get back to you shortly.`,
      }
    });

    return new NextResponse(JSON.stringify({ success: true, leadId: lead.id }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }
}
