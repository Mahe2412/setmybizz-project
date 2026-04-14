import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getArkleContext } from '@/lib/arkleBrain';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { message, history, context, currentCode } = await req.json();
        const arkleContext = await getArkleContext();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'GEMINI_API_KEY missing' }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
You are Arkle, the AI Co-Founder and Developer within the BIZOS (Business Operating System).
        
=== OUR STRATEGIC CONTEXT ===
${arkleContext}

You are in a LIVE VOICE session with the user.
Your personality: Helpful, visionary, quick, and technically elite.
Current Business Name: ${context?.businessName || 'the startup'}
Industry: ${context?.industry || 'Modern Tech'}

The user said: "${message}"

Your Task:
1. "reply": A short, conversational reply to the user (like you are on a phone call). Give advice on colors, design, or layout if needed. Maximum 2-3 sentences.
2. "code": If the user is asking to build or update the website, output the full, single-file HTML code with Tailwind CSS to match their request. 
   - If they are just chatting and NOT asking for a website change, leave "code" empty ("").
   - If generating code, ensure it is complete, responsive, includes a hero section, and looks premium.
   - Use the 'currentCode' as a base if they are asking for an update, otherwise build from scratch.

Output MUST be a valid JSON object matching this schema exactly:
{
    "reply": "your conversational reply here",
    "code": "<html>...full code here...</html>" 
}

Do not include markdown wrappers around the JSON. Output raw JSON only.
`;
        
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        
        // Clean JSON
        text = text.replace(/^```[a-z]*\n/gi, '').replace(/\n```$/g, '');
        
        try {
            const data = JSON.parse(text);
            return NextResponse.json(data);
        } catch (e) {
            return NextResponse.json({ reply: text, code: null });
        }

    } catch (error: any) {
        console.error('Voice Builder Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
