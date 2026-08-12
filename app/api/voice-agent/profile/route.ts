import { NextResponse } from 'next/server';
import { prisma } from '@billease/db';
import { getSession } from '@/lib/billease/session';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * 🧠 Voice Agent Business Profile API
 * 
 * Pulls all business data from BizDesk (Business profile, CRM leads, Parties)
 * to auto-populate the Voice Agent training form.
 * 
 * Also generates an AI-enhanced business description if the user wants.
 */

// GET: Pull business context for voice agent setup
export async function GET(req: Request) {
  try {
    const session = await getSession();
    const businessId = session?.user?.businessId || null;

    if (!businessId) {
      return NextResponse.json({ error: 'No business found' }, { status: 404 });
    }

    // Load business profile
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        parties: { take: 20, orderBy: { createdAt: 'desc' } },
        crmLeads: { take: 10, orderBy: { addedAt: 'desc' } },
        items: { take: 20, orderBy: { createdAt: 'desc' } },
        voiceAgents: {
          include: {
            calls: { take: 5, orderBy: { createdAt: 'desc' } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Summarize CRM data for context
    const leadStages = business.crmLeads.reduce((acc: any, l) => {
      acc[l.stage] = (acc[l.stage] || 0) + 1;
      return acc;
    }, {});

    const productList = business.items.map(i => `${i.name} (₹${i.salePrice})`).join(', ');

    return NextResponse.json({
      business: {
        id: business.id,
        name: business.name,
        legalName: business.legalName,
        industryType: business.industryType,
        phone: business.phone,
        email: business.email,
        address: business.address,
        city: business.city,
      },
      crmSummary: {
        totalLeads: business.crmLeads.length,
        leadStages,
        recentLeads: business.crmLeads.slice(0, 5).map(l => ({
          name: l.name,
          phone: l.phone,
          stage: l.stage,
          source: l.source,
        })),
      },
      products: business.items.slice(0, 10).map(i => ({
        name: i.name,
        price: i.salePrice,
        unit: i.unit,
      })),
      productSummary: productList,
      voiceAgents: business.voiceAgents,
      customers: business.parties
        .filter(p => p.type === 'customer')
        .slice(0, 5)
        .map(p => ({ name: p.name, phone: p.phone })),
    });

  } catch (error: any) {
    console.error('[VoiceAgent Profile]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Generate AI-enhanced business description + FAQ suggestions
export async function POST(req: Request) {
  try {
    const session = await getSession();
    const businessId = session?.user?.businessId || null;
    const { businessName, industryType, products, additionalContext } = await req.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(`
You are "Arkle", the central intelligence brain for BizDesk. You are helping the user setup a Voice Agent.
The user is conversing with you.

Business Details (from BizDesk DB):
- Name: ${businessName}
- Industry: ${industryType}
- Products/Services: ${products || 'various'}

Conversation History so far:
${additionalContext || 'none'}

YOUR TASK:
Determine if you have enough information to build a comprehensive Voice Agent Profile (Business Pitch, FAQs, Objectives, Objections).
You need to know the primary goal of the calls, and some basic info about pricing, delivery, or policies if relevant.

IF YOU NEED MORE INFO (ask a maximum of 2 short, conversational questions to gather missing pieces):
Return JSON exactly like this:
{
  "arkleReply": "Great! One more thing: how much do you charge for delivery, and what is your return policy?"
}

IF YOU HAVE ENOUGH INFO (or the user gave sufficient details):
Return JSON exactly like this:
{
  "profile": {
    "businessDescription": "2-3 sentence professional description of what this business does, their USPs, and target customers (in English, conversational tone for voice agent)",
    "suggestedFaqs": [
      {"question": "...", "answer": "..."},
      {"question": "...", "answer": "..."}
    ],
    "agentPersonality": "Brief personality description (warm, professional, helpful)",
    "callObjectives": ["objective 1", "objective 2"],
    "commonObjections": [
      {"objection": "...", "response": "..."}
    ]
  }
}

Return ONLY raw JSON, no markdown formatting blocks.
`);

    let text = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Generate Profile]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
