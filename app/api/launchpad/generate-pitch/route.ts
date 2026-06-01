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

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const modelPrompt = `You are Arkle AI, the business brain for SetMyBizz. 
You need to generate a structured pitch deck in JSON format based on the user's business description.
The response MUST be a single, valid JSON object, containing an array of slides named "slides".
Do NOT write any pre-text or post-text. Return only raw JSON.

Slide structure schema inside the "slides" array:
{
  "id": "unique-id-string",
  "title": "Slide Title (e.g. Cover, The Problem, Traction, Competitors)",
  "subtitle": "e.g. Slide 1, Slide 2, etc.",
  "layout": "hero" | "two-column" | "traction" | "matrix",
  "content": {
    "heading": "Catchy Heading for the slide",
    "body": "Optional sub-heading or description paragraph (for 'hero' or 'two-column')",
    "bullets": ["Array of 3 crisp bullet points describing details (required if layout is 'two-column')"],
    "metrics": [
      { "val": "e.g. 50k+", "label": "Metric Label (e.g. active users)", "desc": "Short description" }
    ], // (required if layout is 'traction', precisely 3 metrics)
    "competitors": [
      { "name": "Competitor 1 Name", "easy": "Simplicity review", "tech": "Tech review", "price": "Pricing review" },
      { "name": "Competitor 2 Name", "easy": "Simplicity review", "tech": "Tech review", "price": "Pricing review" },
      { "name": "SetMyBizz BizOS", "easy": "✅ Action-Focused", "tech": "✅ Arkle AI-assisted", "price": "💎 ₹999/mo Base" }
    ] // (required if layout is 'matrix', precisely 3 competitors including SetMyBizz BizOS last)
  }
}

Generate exactly 4 slides in this exact order:
1. Cover Slide (layout: 'hero')
2. The Problem (layout: 'two-column')
3. Traction/Market Opportunity (layout: 'traction')
4. Competition Matrix (layout: 'matrix')

LANGUAGE RULES:
- If the user's prompt is written in or requests a language like Telugu (తెలుగు), Hindi (हिन्दी), or English, generate all slide text, bullet points, traction metrics, and labels in that language.

Business Description Prompt:
"${prompt}"`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(modelPrompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean markdown code blocks if the model wrapped it
    if (text.startsWith("```json")) {
      text = text.substring(7);
    } else if (text.startsWith("```")) {
      text = text.substring(3);
    }
    if (text.endsWith("```")) {
      text = text.substring(0, text.length - 3);
    }
    text = text.trim();

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch (e) {
      console.warn("Gemini didn't return valid JSON. Text returned:", text);
      return NextResponse.json({ error: "Failed to parse structured JSON from AI", raw: text }, { status: 500 });
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
