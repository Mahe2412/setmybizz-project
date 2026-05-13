import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSupabase } from '@/lib/supabase';
import { buildArkleSystemPrompt } from '@/lib/ArkleToolBrain';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(req: NextRequest) {
    if (!GEMINI_API_KEY) {
        return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { 
            task, 
            context = {}, 
            userId = 'anonymous' 
        } = body;

        if (!task) {
            return NextResponse.json({ error: "Task is required" }, { status: 400 });
        }

        // 1. BRAIN ACTIVATION (Sales Persona)
        // Using 'social' as base for sales strategy/outreach
        const systemPrompt = buildArkleSystemPrompt('social', context, task); 

        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-pro", 
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
            }
        });

        // 2. SUPABASE AGENT LOGGING (Start)
        const supabase = getSupabase();
        let agentRunId: string | null = null;
        
        if (userId !== 'anonymous') {
            const { data } = await supabase.from('agent_runs').insert({
                user_id: userId,
                agent_id: 'sales_alex',
                agent_name: 'Alex',
                agent_role: 'Sales Executive',
                status: 'working',
                steps_completed: ['Initializing Sales Persona', 'Analyzing Task'],
                created_at: new Date().toISOString()
            }).select().single();
            agentRunId = data?.id;
        }

        // 3. EXECUTION
        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text();

        // 4. SUPABASE AGENT LOGGING (Complete)
        if (agentRunId) {
            await supabase.from('agent_runs').update({
                status: 'completed',
                steps_completed: ['Initializing Sales Persona', 'Analyzing Task', 'Strategy Generated', 'Execution Plan Ready'],
                result_summary: responseText.slice(0, 500),
                completed_at: new Date().toISOString()
            }).eq('id', agentRunId);
        }

        return NextResponse.json({ 
            success: true, 
            result: responseText,
            agent: 'Alex (Sales Executive)',
            runId: agentRunId
        });

    } catch (error: any) {
        console.error("Sales Agent API Error:", error);
        return NextResponse.json({ 
            error: "Failed to execute sales agent task", 
            details: error.message 
        }, { status: 500 });
    }
}

