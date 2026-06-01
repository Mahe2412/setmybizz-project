import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const { prompt, messages = [], currentSlides = [], wizardInputs = {}, pitchDeckType = 'investor' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const systemPrompt = `You are Arkle AI, the proactive co-founder and business operating brain for SetMyBizz.
You are helping the user build and refine their pitch deck dynamically through an interactive chat conversation.

Here is the current state of the pitch deck wizard inputs:
${JSON.stringify(wizardInputs, null, 2)}

Here are the current slides:
${JSON.stringify(currentSlides, null, 2)}

Your task is twofold:
1. Respond to the user's latest message conversationally. Be supportive, ask for missing details (such as logo, launch date, tech stack, funding stage, team, and CTA) if they are not already provided. Give feedback on their business concept like a seasoned startup mentor.
2. Output updated slides and wizard inputs if the user's message contains new business details that should modify the pitch deck.

You MUST return a single, valid JSON object containing exactly these fields:
- "text": "Your conversational response to the user. Explain any updates you made to the slides, or ask clarifying questions."
- "slides": [An array of 4 slides. Modify or regenerate the slides based on the new information shared. Keep layouts as cover (hero), problem (two-column), traction (traction), and competition (matrix).]
- "wizardInputs": {
    "businessName": "Updated business name",
    "idea": "Updated idea description",
    "targetAudience": "Updated target audience",
    "problem": "Updated problem",
    "solution": "Updated solution",
    "revenueModel": "Updated revenue model",
    "growthPlan": "Updated growth plan"
  } (Extract and update any fields that were discussed in the conversation. Do not leave them empty if they already have values.)

Do NOT write any markdown wrapping, pre-text, or post-text. Return only raw JSON.

CHAT HISTORY:
${messages.slice(-6).map((m: any) => `${m.role.toUpperCase()}: ${m.text}`).join('\n')}
USER: "${prompt}"`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    let textOutput = response.text().trim();

    // Clean markdown code blocks if the model wrapped it
    if (textOutput.startsWith("```json")) {
      textOutput = textOutput.substring(7);
    } else if (textOutput.startsWith("```")) {
      textOutput = textOutput.substring(3);
    }
    if (textOutput.endsWith("```")) {
      textOutput = textOutput.substring(0, textOutput.length - 3);
    }
    textOutput = textOutput.trim();

    try {
      const parsed = JSON.parse(textOutput);
      return NextResponse.json(parsed);
    } catch (e) {
      console.warn("Gemini didn't return valid conversational JSON. Text:", textOutput);
      return NextResponse.json({ 
        text: `I've analyzed that! Let's continue building. I am updating your slides for ${wizardInputs.businessName || 'your business'}.`,
        wizardInputs: wizardInputs,
        slides: currentSlides
      });
    }

  } catch (error: any) {
    console.error('Chat Pitch Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
