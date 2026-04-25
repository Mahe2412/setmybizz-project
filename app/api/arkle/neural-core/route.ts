import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SecurityGuard } from '@/lib/security-guard';
import { db } from '@/lib/firebase';
import { doc, setDoc, updateDoc, arrayUnion, serverTimestamp, getDoc } from 'firebase/firestore';

// API Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AZURE_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;

// Deployment Mapping
const DEPLOYMENTS: Record<string, string> = {
    'Arkle Global': process.env.AZURE_OPENAI_GPT4O_DEPLOYMENT || 'Arklegpt-4o',
    'Arkle Mini': process.env.AZURE_OPENAI_MINI_DEPLOYMENT || 'arklegpt-4o-mini',
    'Arkle Flash': 'gemini-1.5-flash'
};

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
    const startTime = Date.now();
    try {
        const { 
            prompt, 
            context = 'Arkle Brain', 
            model = 'Arkle Global', 
            messages = [], 
            userId = 'anonymous',
            chatId = null,
            businessProfile = {}
        } = await req.json();

        // 1. SECURITY LAYER
        const securityCheck = SecurityGuard.validateInput(prompt, userId, 'user');
        if (!securityCheck.allowed) {
            return NextResponse.json({ text: securityCheck.reason || 'Security blocked.', error: true }, { status: 400 });
        }

        const sanitizedPrompt = securityCheck.sanitizedInput || prompt;

        // 2. SYSTEM INSTRUCTION (The Soul of Arkle)
        const systemPrompt = `You are Arkle, the Super AI Co-founder for SetMyBizz.
IDENTITY: You power BizOS (BizDesk, LaunchPad, Workspace).
CURRENT MODULE: ${context.toUpperCase()}
BUSINESS INFO: ${JSON.stringify(businessProfile)}

GUIDELINES:
- Provide elite business strategy, code, or legal advice.
- Use Indian business context (₹, GST, Indian laws).
- Be professional, futuristic, and fluent in Telugu + English.
- For AGENT mode: Provide precise code or technical architecture.

RECENT CONTEXT:
${messages.slice(-5).map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

USER MISSION: ${sanitizedPrompt}

ARKLE RESPONSE:`;

        let finalResponse = "";
        let engineUsed = "";

        // 3. NEURAL ENGINE SELECTION
        // Azure Path (Primary for Global/Mini)
        if (AZURE_KEY && AZURE_ENDPOINT && model !== 'Arkle Flash') {
            try {
                const deploymentName = DEPLOYMENTS[model] || DEPLOYMENTS['Arkle Global'];
                const azureResp = await fetch(
                    `${AZURE_ENDPOINT}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-08-01-preview`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'api-key': AZURE_KEY,
                        },
                        body: JSON.stringify({
                            messages: [{ role: 'system', content: systemPrompt }],
                            model: deploymentName,
                            temperature: 0.4,
                        }),
                    }
                );
                const azureJson = await azureResp.json();
                finalResponse = azureJson?.choices?.[0]?.message?.content || "";
                engineUsed = `azure-${model.toLowerCase()}`;
            } catch (err: any) {
                console.error('[CORE] Azure Failed, falling back...', err.message);
            }
        }

        // Gemini Path (Secondary or Flash-specific)
        if (!finalResponse) {
            const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: "You are Arkle AI OS." });
            const result = await geminiModel.generateContent(systemPrompt);
            finalResponse = result.response.text();
            engineUsed = 'google-gemini-flash';
        }

        // 4. MEMORY & LOGGING
        const filteredResponse = SecurityGuard.filterOutput(finalResponse, 'user');
        if (chatId) {
            await saveToFirebase(userId, chatId, sanitizedPrompt, filteredResponse);
        }
        SecurityGuard.logInteraction(userId, sanitizedPrompt, filteredResponse, 0);

        return NextResponse.json({ 
            text: filteredResponse, 
            engine: engineUsed, 
            timestamp: new Date().toISOString(),
            latency: `${Date.now() - startTime}ms`
        });

    } catch (error: any) {
        console.error('[CORE] Global Failure:', error.message);
        return NextResponse.json({ error: 'Arkle Neural Core is experiencing high load. Please try again.', details: error.message }, { status: 500 });
    }
}

async function saveToFirebase(userId: string, chatId: string, userMsg: string, aiResp: string) {
    try {
        const chatRef = doc(db, 'chats', chatId);
        const u = { role: 'user', content: userMsg, timestamp: new Date().toISOString() };
        const a = { role: 'assistant', content: aiResp, timestamp: new Date().toISOString() };
        const docSnap = await getDoc(chatRef);
        if (docSnap.exists()) {
            await updateDoc(chatRef, { messages: arrayUnion(u, a), lastUpdated: serverTimestamp() });
        } else {
            await setDoc(chatRef, { userId, messages: [u, a], createdAt: serverTimestamp(), title: userMsg.slice(0, 30) + '...' });
        }
    } catch (e) {}
}
