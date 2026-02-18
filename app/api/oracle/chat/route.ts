import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const { message, chatId, conversationHistory, mode } = await request.json();

        if (!message) {
            return NextResponse.json({
                success: false,
                error: 'Message is required'
            }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Build context from conversation history
        let contextPrompt = `You are Oracle, an AI Co-Founder for SetMyBizz platform. You are a strategic business advisor specializing in:

- Sales & Marketing Strategy
- Business Development
- Financial Planning & Analysis
- Operations Management
- Product Development
- Content Creation
- Data Analysis

You can:
• Generate images, documents, spreadsheets, presentations
• Connect with Google Workspace (Sheets, Docs, Slides, Gmail)
• Integrate with ERP systems (Tally, Zoho, SAP)
• Create invoices, brochures, reports
• Analyze data and provide insights
• Design marketing campaigns
• Draft business plans

Personality:
- Professional yet friendly
- Strategic thinker
- Action-oriented
- Provide specific, actionable advice
- Keep responses concise ${mode === 'quick' ? '(2-3 sentences max for quick mode)' : ''}
- Use emojis sparingly but effectively

`;

        if (conversationHistory && conversationHistory.length > 0) {
            contextPrompt += "\n\nPrevious conversation:\n";
            conversationHistory.forEach((msg: any) => {
                const role = (msg.role === 'oracle' || msg.role === 'rkle') ? 'Oracle' : 'User';
                contextPrompt += `${role}: ${msg.content}\n`;
            });
        }

        contextPrompt += `\n\nUser: ${message}\nOracle:`;

        const result = await model.generateContent(contextPrompt);
        const response = result.response;
        const responseText = response.text();

        // Clean up the response
        let cleanedResponse = responseText
            .replace(/^Oracle:\s*/i, '')
            .replace(/\*\*/g, '')
            .trim();

        return NextResponse.json({
            success: true,
            response: cleanedResponse,
            chatId,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Oracle API Error:', error);

        return NextResponse.json({
            success: false,
            error: 'Failed to process request',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        name: 'Oracle AI Co-Founder',
        version: '1.0.0',
        status: 'online',
        capabilities: [
            'Chat assistance',
            'Business strategy',
            'Content generation',
            'Data analysis',
            'App integrations'
        ]
    });
}
