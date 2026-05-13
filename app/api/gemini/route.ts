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

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
