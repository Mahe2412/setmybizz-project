import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const {
            message,
            chatId,
            projectId,
            projectName,
            mode,
            conversationHistory,
            connectedTools
        } = await req.json();

        const modelToUse = mode === 'deep' ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
        const model = genAI.getGenerativeModel({ model: modelToUse });

        // Build enhanced prompt with tool context
        const toolsContext = connectedTools
            ?.map((t: any) => `- ${t.name}`)
            ?.join('\n') || 'None';

        const historyText = conversationHistory
            ?.slice(-6)
            ?.map((msg: any) => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`)
            ?.join('\n') || 'None';

        const prompt = `You are an AI Co-Founder in a Claude.ai-style interface helping with business tasks.

PROJECT CONTEXT:
- Project: ${projectName || 'General'}
- Project ID: ${projectId}

CONNECTED TOOLS:
${toolsContext}

YOUR CAPABILITIES:
1. Generate artifacts (images, documents, charts, tables, code)
2. Create content for export to Google Workspace (Docs, Slides, Sheets, CSV)
3. Recommend tools from the dashboard for specific tasks
4. Provide strategic business advice

ARTIFACT GENERATION:
When you create something visual or structured, respond with:
[ARTIFACT:type:name:content]

Types: image, document, code, chart, table
Example: [ARTIFACT:document:Business Plan:# Business Plan\n\nExecutive Summary...]

TOOL RECOMMENDATIONS:
When a task needs a specific tool, recommend it:
[TOOL_RECOMMEND:toolId:toolName:reason]

Example: [TOOL_RECOMMEND:crm:CRM:To manage customer relationships for this campaign]

CONVERSATION HISTORY:
${historyText}

USER MESSAGE: ${message}

AI CO-FOUNDER RESPONSE:`;

        const result = await model.generateContent(prompt);
        const rawResponse = result.response.text();

        // Parse artifacts
        const artifactRegex = /\[ARTIFACT:(\w+):([^:]+):([^\]]+)\]/g;
        const artifacts = [];
        let artifactMatch: RegExpExecArray | null;

        while ((artifactMatch = artifactRegex.exec(rawResponse)) !== null) {
            artifacts.push({
                id: `artifact-${Date.now()}-${artifacts.length}`,
                type: artifactMatch[1],
                name: artifactMatch[2],
                content: artifactMatch[3],
                url: artifactMatch[1] === 'image' ? `/api/placeholder-image?text=${encodeURIComponent(artifactMatch[2])}` : undefined,
                exportFormats: getExportFormats(artifactMatch[1])
            });
        }

        // Parse tool recommendations
        const toolRegex = /\[TOOL_RECOMMEND:([^:]+):([^:]+):([^\]]+)\]/g;
        const toolRecommendations = [];
        let toolMatch: RegExpExecArray | null;

        while ((toolMatch = toolRegex.exec(rawResponse)) !== null) {
            const toolId = toolMatch[1];
            const toolName = toolMatch[2];
            const reason = toolMatch[3];

            toolRecommendations.push({
                toolId,
                toolName,
                toolIcon: getToolIcon(toolId),
                reason,
                connected: connectedTools.some((t: any) => t.id === toolId && t.status === 'connected'),
                canConnect: true
            });
        }

        // Clean response
        const cleanResponse = rawResponse
            .replace(artifactRegex, '')
            .replace(toolRegex, '')
            .trim();

        return NextResponse.json({
            success: true,
            response: cleanResponse,
            artifacts: artifacts.length > 0 ? artifacts : undefined,
            toolRecommendations: toolRecommendations.length > 0 ? toolRecommendations : undefined,
            metadata: {
                model: modelToUse,
                mode,
                projectId,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error: any) {
        console.error('AI Co-Founder Claude API error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to generate response'
        }, { status: 500 });
    }
}

function getExportFormats(type: string) {
    const formats: any = {
        image: [
            { type: 'png', icon: 'image', label: 'PNG' },
            { type: 'jpg', icon: 'image', label: 'JPG' },
            { type: 'pdf', icon: 'picture_as_pdf', label: 'PDF' }
        ],
        document: [
            { type: 'docs', icon: 'description', label: 'Google Docs' },
            { type: 'pdf', icon: 'picture_as_pdf', label: 'PDF' }
        ],
        table: [
            { type: 'sheets', icon: 'table_chart', label: 'Google Sheets' },
            { type: 'csv', icon: 'table_view', label: 'CSV' }
        ],
        chart: [
            { type: 'slides', icon: 'slideshow', label: 'Google Slides' },
            { type: 'sheets', icon: 'table_chart', label: 'Google Sheets' },
            { type: 'png', icon: 'image', label: 'PNG' }
        ],
        code: [
            { type: 'docs', icon: 'description', label: 'Google Docs' }
        ]
    };

    return formats[type] || [];
}

function getToolIcon(toolId: string) {
    const icons: any = {
        crm: 'people',
        analytics: 'analytics',
        gmail: 'mail',
        calendar: 'event',
        sheets: 'table_chart',
        drive: 'cloud',
        tasks: 'task',
        forms: 'assignment'
    };

    return icons[toolId] || 'extension';
}
