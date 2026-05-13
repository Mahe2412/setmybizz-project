import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSupabase } from '@/lib/supabase';
import { buildArkleSystemPrompt, selectModel, type BusinessContext } from '@/lib/ArkleToolBrain';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
    const startTime = Date.now();
    try {
        const body = await req.json();
        const { 
            prompt, 
            toolId = 'arkle', // Default context
            userId = 'anonymous',
            businessProfile = {} as BusinessContext,
            messages = [],
            modelOverride = null
        } = body;

        if (!prompt) {
            return NextResponse.json({ error: 'Mission prompt is required' }, { status: 400 });
        }

        // 1. NEURAL BRAIN ACTIVATION
        // We use ArkleToolBrain to get the right persona for the current task
        const systemPrompt = buildArkleSystemPrompt(toolId, businessProfile, prompt);
        
        // Add chat history context if available
        const historyContext = messages.length > 0 
            ? `\n\nCHAT HISTORY:\n${messages.slice(-6).map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}`
            : '';

        const finalPrompt = `${systemPrompt}${historyContext}`;

        // 2. MODEL SELECTION
        const modelName = modelOverride || selectModel(toolId, prompt.length);
        const model = genAI.getGenerativeModel({ 
            model: modelName,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 4096,
            }
        });

        // 3. GENERATION
        const result = await model.generateContent(finalPrompt);
        const responseText = result.response.text();

        // 4. SUPABASE LOGGING (Asynchronous)
        const supabase = getSupabase();
        
        // Log the interaction
        // Note: we don't await this to keep the response snappy
        supabase.from('voice_logs').insert({
            user_id: userId === 'anonymous' ? null : userId,
            transcript: prompt,
            command_type: 'CHAT',
            tool_hint: toolId,
            was_processed: true,
            created_at: new Date().toISOString()
        }).then(({ error }) => {
            if (error) console.error('[Arkle Core] Log Error:', error.message);
        });

        return NextResponse.json({ 
            text: responseText, 
            engine: modelName, 
            persona: toolId,
            timestamp: new Date().toISOString(),
            latency: `${Date.now() - startTime}ms`
        });

    } catch (error: any) {
        console.error('[Arkle Core] Global Failure:', error.message);
        return NextResponse.json({ 
            error: 'Arkle Neural Core is experiencing high load.', 
            details: error.message 
        }, { status: 500 });
    }
}

