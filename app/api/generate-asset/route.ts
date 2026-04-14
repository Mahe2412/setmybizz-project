import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getArkleContext } from '@/lib/arkleBrain';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { assetType, context } = await req.json();
        const arkleContext = await getArkleContext();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Gemini API Key missing' }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        let prompt = `You are Arkle, the AI Co-Founder and Developer within the BIZOS (Business Operating System).
        
        === OUR STRATEGIC CONTEXT ===
        ${arkleContext}
        
        Your task is to generate a professional ${assetType} for the business: ${context.businessName || 'Startup'}.
        Industry: ${context.industry || 'Tech'}.`;

        if (assetType === 'website') {
            prompt += `
Create a complete, responsive, modern, single-page HTML website.
Idea: ${context.idea || ''}
Target Audience: ${context.audience || ''}
Design Taste/Vibe: ${context.designTaste || 'Modern'}

Requirements:
- Use Tailwind CSS via CDN (<script src="https://cdn.tailwindcss.com"></script>)
- Output ONLY the raw HTML code. Do NOT wrap it in markdown blockquotes like \`\`\`html.
- Include a beautiful Hero Section with a compelling headline and subheadline based on the Idea.
- Include an "About Us" section, a "Services/Products" section, and a simple "Contact" section.
- Use placeholders for images (e.g., https://via.placeholder.com/600x400).
- Be creative with colors that match the Design Taste.
`;
        } else if (assetType === 'logo') {
            prompt += `
Create a professional SVG logo.
Design Taste/Vibe: ${context.designTaste || 'Modern'}

Requirements:
- Output ONLY the raw SVG code. Do NOT wrap it in markdown blockquotes like \`\`\`svg.
- Keep the design clean, modern, and vector-based.
- Use a viewBox="0 0 500 500".
- Include a creative geometric or abstract symbol, followed by or integrated with the Business Name.
- Use colors that represent the industry and vibe.
- Ensure the SVG is responsive.
`;
        } else if (assetType === 'pitchdeck') {
             prompt = `
You are a top-tier venture capitalist and strategic business advisor.
Generate a compelling 10-slide Pitch Deck content for this startup:
Business Name: ${context.businessName || 'Startup'}
Idea: ${context.idea || ''}
Stage: ${context.stage || 'Idea Phase'}
Industry: ${context.industry || 'Tech'}
Target Audience: ${context.audience || ''}
Revenue Model: ${context.model || ''}
USP: ${context.usp || ''}

Format as Markdown:
# Slide 1: Cover (Catchy title)
# Slide 2: The Problem
# Slide 3: The Solution
# Slide 4: Market Size (TAM/SAM/SOM estimate)
# Slide 5: Product / Features
# Slide 6: Business Model
# Slide 7: Why Now & USP
# Slide 8: Go-to-Market Strategy
# Slide 9: Team
# Slide 10: The Ask / Vision

Ensure the content is sharp, investor-ready, and highly persuasive. Do not use generic placeholders; synthesize actual strategy based on the inputs.
`;
        } else {
             prompt = `
You are an expert business consultant. 
Generate content for a ${assetType} based on this business context:
Business Name: ${context.businessName || 'Startup'}
Idea: ${context.idea || ''}
Industry: ${context.industry || ''}

Provide professional, ready-to-use content formatting using Markdown.
`;
        }

        const result = await model.generateContent(prompt);
        let rawContent = result.response.text();
        
        // Strip markdown code blocks if the AI stubbornly included them
        if (assetType === 'website' || assetType === 'logo') {
             rawContent = rawContent.replace(/^```[a-z]*\n/gi, '').replace(/\n```$/g, '');
        }

        return NextResponse.json({ success: true, result: rawContent });

    } catch (error: any) {
        console.error('Asset Generation Error:', error);
        return NextResponse.json({ error: error.message || 'Generation failed' }, { status: 500 });
    }
}
