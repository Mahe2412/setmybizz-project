import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIRoadmap, AISocialPost } from "../types/ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

// Mock Data for Demo Backup
const MOCK_ROADMAP: AIRoadmap = {
    overview: "This is a generated strategic roadmap to launch your business successfully in 30 days (Demo Backup).",
    weeks: [
        { week: 1, title: "Legal & Foundation", tasks: ["Register business name", "Obtain necessary licenses", "Open bank account"] },
        { week: 2, title: "Branding & Identity", tasks: ["Design logo", "Setup social media profiles", "Create brand guidelines"] },
        { week: 3, title: "Operations Setup", tasks: ["Setup accounting software", "Find vendors/partners", "Setup workspace"] },
        { week: 4, title: "Launch & Marketing", tasks: ["Soft launch to friends", "Run initial ads", "Official opening day"] }
    ]
};

const MOCK_SOCIAL_POST: AISocialPost = {
    headline: "🚀 Launch Your Dream Business Today!",
    caption: "Don't wait for the perfect moment. Take the first step towards your entrepreneurial journey with SetMyBizz. We make incorporation easy and fast.\n\nStart your story now! ✨",
    hashtags: ["#Entrepreneur", "#StartupLife", "#BusinessLaunch", "#SetMyBizz", "#NewBeginnings"]
};

// Shared System Prompt Generator
const getSystemPrompt = (data: any) => {
    return `You are the dedicated AI Co-founder for "${data.name}". 
    
    CRITICAL CONTEXT:
    - Business Name: "${data.name}"
    - Industry: "${data.industry}"
    - Offerings: "${data.offeringType}"
    - Focus Areas: "${data.focusAreas?.join(', ') || 'General Growth'}"
    
    YOUR ROLE:
    - Do NOT talk about "Setmybizz" or general incorporation unless asked.
    - You MUST tailor every response specifically to "${data.name}" and its products/services.
    - Act as a partner who has been with the business since day one.
    
    Always be professional, encouraging, and entrepreneurial.`;
};

export const generateRoadmap = async (data: any): Promise<AIRoadmap> => {
    console.log("Generating Roadmap for:", data.name);
    try {
        if (!model) throw new Error("Gemini API Key not configured");

        const systemPrompt = getSystemPrompt(data);
        const prompt = `
        ${systemPrompt}

        Task: Create a 30-day step-by-step roadmap for this business.
        
        Output STRICT JSON format with this structure:
        {
            "overview": "2 sentence strategic summary",
            "weeks": [
                { "week": 1, "title": "Foundation", "tasks": ["task 1", "task 2"] },
                { "week": 2, "title": "Development", "tasks": ["task 1", "task 2"] },
                { "week": 3, "title": "Launch Preparation", "tasks": ["task 1", "task 2"] },
                { "week": 4, "title": "Go-Live & Initial Growth", "tasks": ["task 1", "task 2"] }
            ]
        }
        Minimize formatted text, give raw JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Gemini Response (Roadmap):", text);

        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Gemini API Error (Roadmap):", error);
        console.warn("Using Mock Roadmap for Demo");
        return MOCK_ROADMAP;
    }
};

// Helper to enhance image prompts for Professional/Luxury results
export const enhanceImagePrompt = async (originalPrompt: string, data: any): Promise<string> => {
    console.log("Enhancing Image Prompt:", originalPrompt);
    try {
        if (!model) return originalPrompt;

        // Detect Intent
        const isLogo = originalPrompt.toLowerCase().includes('logo') || originalPrompt.toLowerCase().includes('icon') || originalPrompt.toLowerCase().includes('identity');

        const styleGuide = isLogo
            ? "Style: High-End Luxury Brand Logo, Minimalist Vector, Gold/Black or Corporate Blue, White Background, Award-Winning Graphic Design."
            : "Style: Cinematic 4K Photography, Architectural Digest Style, Professional Lighting, Highly Detailed, Realistic.";

        const prompt = `
        Role: World-Class Art Director.
        Task: Rewrite user request: "${originalPrompt}" into a professional image generation prompt.
        
        Business Context:
        - Name: "${data.name}"
        - Industry: "${data.industry}"
        - Offering: "${data.offeringType}"
        
        Rules:
        1. Ignore "Setmybizz". Use "${data.name}" branding.
        2. Force HIGH QUALITY terms: (4k, photorealistic, trending on artstation).
        3. If Logo: Focus on symbols related to ${data.industry} (e.g., if Construction -> Building silhouette).
        4. If Post: Focus on emotions, people, or high-end product shots.
        5. Output ONLY the refined prompt text.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();
        console.log("Enhanced Prompt:", text);
        return text;
    } catch (error) {
        console.error("Prompt Enhancement Failed:", error);
        return `${originalPrompt}, high quality, professional, 4k`;
    }
};

export const generateSocialPost = async (data: any, customPrompt?: string): Promise<AISocialPost> => {
    console.log("Generating Content for:", data.name, "Custom Prompt:", customPrompt);
    try {
        if (!model) throw new Error("Gemini API Key not configured");

        const systemPrompt = getSystemPrompt(data);
        const specificInstruction = customPrompt && customPrompt.trim() !== ""
            ? `User Request: "${customPrompt}"`
            : `User Request: Create a comprehensive "Grand Launch" post announcing the official opening of "${data.name}".`;

        const prompt = `
        ${systemPrompt}
        ${specificInstruction}
        
        IMPORTANT: Naturally mention the business name "${data.name}" in the proper context (headline or caption) to make it feel personalized.
        
        Output STRICT JSON format:
        {
            "headline": "Catchy Headline or Ad Hook",
            "caption": "Compelling caption or body text (3-4 lines)",
            "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
        }
        Minimize formatted text, give raw JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Gemini Response (Content):", text);

        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Gemini API Error (Content):", error);
        console.warn("Using Mock Social Post for Demo");
        return MOCK_SOCIAL_POST;
    }
};
