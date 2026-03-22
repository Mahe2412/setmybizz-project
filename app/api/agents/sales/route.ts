import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI SDK
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY environment variable is not defined.");
}
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: NextRequest) {
    if (!apiKey) {
        return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { task, context } = body;

        // Ensure we have a task
        if (!task) {
            return NextResponse.json({ error: "Task is required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 2000,
        }});

        // Build the system prompt for the Sales Executive
        const systemPrompt = `You are Alex, an expert AI Sales Executive. Your goal is to generate revenue, draft high-converting cold emails, formulate sales strategies, and qualify leads. 
        
BUSINESS CONTEXT:
${JSON.stringify(context || {}, null, 2)}

TASK ASSIGNED BY FOUNDER:
"${task}"

Your output must be structured, professional, yet aggressive in sales tactics. Use markdown for formatting. If the user asks for an email, write a subject line and the body. If they ask for a strategy, provide step-by-step actionable items. Avoid fluff; be direct and results-oriented.`;

        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text();

        return NextResponse.json({ success: true, result: responseText });
    } catch (error: any) {
        console.error("Sales Agent API Error:", error);
        return NextResponse.json(
            { error: "Failed to generate sales strategy or email", details: error.message },
            { status: 500 }
        );
    }
}
