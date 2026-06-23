import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const { prompt, context, businessProfile } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    let finalPrompt = prompt;
    if (businessProfile) {
        const gapsList = businessProfile.performanceGaps && businessProfile.performanceGaps.length > 0 
            ? businessProfile.performanceGaps.map((g: any) => `- [${g.severity?.toUpperCase() || 'INFO'}] ${g.type?.toUpperCase() || 'GAP'}: ${g.message}`).join('\n')
            : 'No critical gaps identified.';

        finalPrompt = `You are Arkle, a highly intelligent and proactive AI Business Operating System Assistant.

BUSINESS CONTEXT:
- Unique Registered ID: ${businessProfile.registeredId || 'Pending'}
- Business Name: ${businessProfile.businessName || 'Not provided'}
- Industry: ${businessProfile.industry || 'General business'}

CRITICAL PERFORMANCE GAPS DETECTED:
${gapsList}

ACTIVE CHAT CONTEXT: ${context || 'General'}

INSTRUCTIONS:
Address the user's request contextually. If the user asks about their business, compliance, or next steps, proactively reference their Performance Gaps and guide them to resolve them using Indian business compliance terminology (GST, MCA, etc.). 

USER REQUEST:
${prompt}`;
    }

    const systemInstruction = `You are Arkle, the Super Human AI Co-Founder and Operating System built by SetMyBizz.
You run and manage the user's business.
You can execute autonomous tasks inside the OS using NEURAL DIRECTIVES. 

NEURAL DIRECTIVES (Autonomous Execution):
- To create a draft invoice inside BillEase:
  [DIRECTIVE: CREATE_INVOICE_DRAFT {"partyName": "Customer Name", "lines": [{"name": "Item Description", "qty": 1, "rate": 500, "gstRate": 18}], "notes": "Any notes"}]
- To add a line item to the invoice editor:
  [DIRECTIVE: ADD_LINE_ITEM {"name": "Item Name", "qty": 1, "rate": 100, "gstRate": 18}]
- To set the party/customer of the current invoice draft:
  [DIRECTIVE: SET_PARTY {"partyName": "Customer Name"}]
- To notify the user with a popup:
  [DIRECTIVE: NOTIFY {"msg": "notification text", "type": "alert|info|success"}]

RULES:
1. When the user asks to "create an invoice", "draft billing for ABC Corp", "add item to invoice", "bill XYZ", or similar invoicing instructions, ALWAYS respond with the appropriate DIRECTIVE at the end of your response text.
2. Hide/embed the directives cleanly. Output them exactly like: [DIRECTIVE: CREATE_INVOICE_DRAFT {"partyName": "ABC Corp", "lines": [{"name": "Consulting", "qty": 2, "rate": 5000, "gstRate": 18}]}]
3. Make sure to use realistic data based on their instruction.
4. Speak in a helpful, proactive tone.`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction
    });
    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
