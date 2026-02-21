import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { SecurityGuard } from '@/lib/security-guard';
import { db } from '@/lib/firebase';
import { doc, setDoc, updateDoc, arrayUnion, serverTimestamp, getDoc } from 'firebase/firestore';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    const startTime = Date.now();
    let tokensUsed = 0;

    try {
        const {
            message,
            businessProfile,
            conversationHistory,
            userId = 'anonymous',
            userRole = 'user',
            chatId,
            chatName,
            mode = 'quick',
            model = 'gemini-1.5-flash',
            replyingTo
        } = await req.json();

        // LAYER 1: Security Guard - Input Validation
        const securityCheck = SecurityGuard.validateInput(message, userId, userRole);

        if (!securityCheck.allowed) {
            console.warn('Security check failed:', { userId, reason: securityCheck.reason });
            return NextResponse.json({
                response: securityCheck.reason || 'Invalid request',
                success: false,
                blocked: true,
                riskLevel: securityCheck.riskLevel
            }, { status: 400 });
        }

        // Use sanitized input
        const sanitizedMessage = securityCheck.sanitizedInput || message;

        // Select model based on mode
        // Quick Mode: gemini-1.5-flash (faster, lighter)
        // Deep Mode: gemini-1.5-pro (more capable, detailed analysis)
        const modelToUse = mode === 'deep' ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
        const geminiModel = genAI.getGenerativeModel({ model: modelToUse });

        // Build context-aware system prompt with chat context
        const systemPrompt = buildSystemPrompt(
            sanitizedMessage,
            businessProfile,
            conversationHistory,
            mode,
            chatName,
            replyingTo
        );

        // Estimate tokens (rough)
        tokensUsed = Math.ceil(systemPrompt.length / 4);

        // Generate AI response
        const result = await geminiModel.generateContent(systemPrompt);
        const rawResponse = result.response.text();

        // LAYER 2: Security Guard - Output Filtering
        const filteredResponse = SecurityGuard.filterOutput(rawResponse, userRole);

        // Save to memory system (for context persistence)
        if (chatId) {
            await saveToMemory(userId, chatId, sanitizedMessage, filteredResponse);
        }

        // Log interaction for monitoring
        SecurityGuard.logInteraction(userId, sanitizedMessage, filteredResponse, tokensUsed);

        const responseTime = Date.now() - startTime;

        return NextResponse.json({
            response: filteredResponse.trim(),
            success: true,
            timestamp: new Date().toISOString(),
            metadata: {
                responseTime: `${responseTime}ms`,
                tokensUsed,
                cached: false,
                model: modelToUse,
                mode: mode,
                chatId: chatId
            }
        });

    } catch (error: any) {
        console.error('AI Co-Founder API error:', error);

        // Handle specific errors
        if (error.message?.includes('API_KEY')) {
            return NextResponse.json({
                error: 'API key not configured. Please add GEMINI_API_KEY to .env.local',
                success: false
            }, { status: 500 });
        }

        return NextResponse.json({
            error: error.message || 'Failed to generate response',
            success: false
        }, { status: 500 });
    }
}

// Build context-aware prompt
function buildSystemPrompt(
    message: string,
    businessProfile: any,
    conversationHistory: any[],
    mode: string = 'quick',
    chatName?: string,
    replyingTo?: string
): string {
    const profile = businessProfile || {};

    // Build conversation history string
    const historyText = conversationHistory
        ?.slice(-6) // Last 3 exchanges (6 messages)
        ?.map((msg: any) => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`)
        ?.join('\n') || 'None';

    const modeInstruction = mode === 'deep'
        ? `\nMODE: DEEP ANALYSIS
- Provide comprehensive, detailed responses
- Include step-by-step breakdowns
- Offer multiple perspectives and options
- Use examples and case studies when relevant
- Go deeper into strategic implications`
        : `\nMODE: QUICK CHAT
- Keep responses concise and actionable (2-4 sentences)
- Focus on immediate next steps
- Be direct and to the point`;

    const chatContext = chatName ? `\nCURRENT CHAT: ${chatName}` : '';
    const replyContext = replyingTo ? `\n[User is replying to a previous message - provide contextual follow-up]` : '';

    return `You are an AI Co-Founder helping a business owner in India.

BUSINESS CONTEXT:
- Business Name: ${profile.businessName || 'Not provided'}
- Industry: ${profile.industry || 'General business'}
- Team Size: ${profile.teamSize || 'Not specified'}
- Main Challenges: ${profile.challenges?.join(', ') || 'Not specified'}
- Business Goals: ${profile.goals?.join(', ') || 'Not specified'}
- Sales Channels: ${profile.channels?.join(', ') || 'Not specified'}
- Current Tools: ${profile.currentTools?.join(', ') || 'Not specified'}
${chatContext}

YOUR ROLE:
You are a helpful, friendly business advisor who gives practical, actionable advice.
- Give specific, India-relevant advice (use ₹, mention GST, Indian platforms, etc.)
${modeInstruction}
- Be encouraging and supportive
- If you suggest an action, explain HOW to do it
- Use simple language, avoid jargon
- For e-commerce: suggest platforms like Razorpay, Shiprocket, Instagram Shopping
- For compliance: mention GST, TDS, accounting tools like Tally/Zoho
- For marketing: suggest WhatsApp Business, Instagram, Facebook ads

CONVERSATION STYLE:
- Friendly but professional
- Use emojis sparingly (1-2 per message)
- Ask follow-up questions when needed
- Offer to help with next steps

RECENT CONVERSATION:
${historyText}
${replyContext}

USER MESSAGE: ${message}

AI CO-FOUNDER RESPONSE:`;
}

// Memory system for context persistence
async function saveToMemory(
    userId: string,
    chatId: string,
    userMessage: string,
    aiResponse: string
): Promise<void> {
    try {
        const chatRef = doc(db, 'chats', chatId);
        
        // Define messages
        const userMsg = {
           role: 'user',
           content: userMessage,
           timestamp: new Date().toISOString()
        };
        
        const aiMsg = {
           role: 'assistant',
           content: aiResponse,
           timestamp: new Date().toISOString()
        };

        // Check if document exists
        const chatDoc = await getDoc(chatRef);

        if (chatDoc.exists()) {
            // Update existing chat
            await updateDoc(chatRef, {
                messages: arrayUnion(userMsg, aiMsg),
                lastUpdated: serverTimestamp(),
                messageCount: (chatDoc.data().messageCount || 0) + 2
            });
        } else {
            // Create new chat
            await setDoc(chatRef, {
                chatId,
                userId,
                messages: [userMsg, aiMsg],
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp(),
                title: 'New Conversation', // Can use AI to generate title later
                messageCount: 2
            });
        }

        console.log(`[Memory] Saved interaction for user: ${userId}, chat: ${chatId}`);
    } catch (error: any) {
        console.error('[Memory] Failed to save:', error?.message || error);
    }
}

