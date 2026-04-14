import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * ARKLE BRAIN CORE
 * This utility ensures every AI request in the BIZOS ecosystem 
 * has access to the Triple Brain knowledge and user vision.
 */
export async function getArkleContext() {
    try {
        const blueprintPath = path.join(process.cwd(), '.agent', 'BIZOS_MASTER_BLUEPRINT.md');
        const skillsPath = path.join(process.cwd(), '.agent', 'arkle_skills.md');
        const promptPath = path.join(process.cwd(), '.agent', 'SYSTEM_PROMPT.md');
        
        const blueprint = fs.existsSync(blueprintPath) ? fs.readFileSync(blueprintPath, 'utf8') : '';
        const skills = fs.existsSync(skillsPath) ? fs.readFileSync(skillsPath, 'utf8') : '';
        const systemPrompt = fs.existsSync(promptPath) ? fs.readFileSync(promptPath, 'utf8') : '';
        
        return `
            === MASTER SYSTEM INSTRUCTIONS ===
            ${systemPrompt}

            === MASTER BIZOS BLUEPRINT ===
            ${blueprint}
            
            === ARKLE GLOBAL SKILLS ===
            ${skills}
        `;
    } catch (e) {
        return "Standard Arkle AI Mode Active.";
    }
}
