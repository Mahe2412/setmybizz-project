import { NextResponse } from 'next/server';
import { chatWithARKIA } from '@/lib/ArkleAutonomousEngine';
import { getArkleContext } from '@/lib/arkleBrain';

export async function POST(req: Request) {
    try {
        const { command, context } = await req.json();
        const arkleBrainMemory = await getArkleContext();

        const systemPromptSuffix = `
        The user is using the "Vibe Command Bar". 
        Be extremely concise. 
        If they want to add a task, board, or tool, use the [DIRECTIVE] format.
        Example: [DIRECTIVE: CREATE_TASK {"task": "GST Filing", "groupId": "legal", "priority": "Critical"}]
        `;

        const responseText = await chatWithARKIA(
            [{ role: 'user', content: command }],
            {
                ...context,
                brainContext: arkleBrainMemory + "\n" + systemPromptSuffix
            }
        );

        // Parse directives
        const directives: any[] = [];
        const directiveRegex = /\[DIRECTIVE: (\w+) ({.*?})\]/g;
        let match;
        while ((match = directiveRegex.exec(responseText)) !== null) {
            try {
                directives.push({
                    type: match[1],
                    payload: JSON.parse(match[2])
                });
            } catch (e) {
                console.error("Failed to parse directive payload", e);
            }
        }

        return NextResponse.json({ 
            reply: responseText.replace(/\[DIRECTIVE:.*?\]/g, '').trim(),
            directives 
        });

    } catch (error: any) {
        console.error("Vibe Engine Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
