import { enhanceImagePrompt } from './gemini';

export interface AIImageResponse {
    success: boolean;
    imageUrl?: string;
    error?: string;
}

const NEXT_PUBLIC_IMAGE_API_KEY = process.env.NEXT_PUBLIC_IMAGE_API_KEY; // Google Imagen / Vertex Key placeholder
const NEXT_PUBLIC_OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export const generateImage = async (prompt: string, businessData: any): Promise<AIImageResponse> => {
    console.log("Generating Image for:", businessData.name, "Industry:", businessData.industry);

    // 1. Refine the prompt using Gemini (The "Brain")
    // This turns "logo" into "minimalist vector..." and "post" into "cinematic 4k..."
    const enhancedPrompt = await enhanceImagePrompt(prompt, businessData);

    // Simulate real AI processing time (if prompt expansion was fast)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. Try Professional API (DALL-E 3) if Key Exists
    if (NEXT_PUBLIC_OPENAI_API_KEY) {
        try {
            console.log("Using DALL-E 3...");
            const response = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${NEXT_PUBLIC_OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "dall-e-3",
                    prompt: enhancedPrompt,
                    n: 1,
                    size: "1024x1024",
                    quality: "hd",
                    style: "natural"
                })
            });

            const data = await response.json();
            if (data.data && data.data[0]?.url) {
                return { success: true, imageUrl: data.data[0].url };
            }
        } catch (error) {
            console.error("OpenAI API Failed:", error);
        }
    }

    // 3. FLUX Realism Engine (Pollinations.ai)
    // The user wants "Real AI Generation". Pollinations with 'model=flux' provides 
    // State-of-the-art open source generation (Flux) which is highly photorealistic.
    // It is FREE, fast, and replaces the broken Unsplash link.

    try {
        console.log("Using Flux Realism Engine...");
        const encodedPrompt = encodeURIComponent(enhancedPrompt.substring(0, 800));
        const randomSeed = Math.floor(Math.random() * 1000000); // Ensure unique result each time

        // Flux model + No Logo + Enhanced Prompt = High Quality Realism
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&model=flux&seed=${randomSeed}&nologo=true&enhance=false`;

        return {
            success: true,
            imageUrl: imageUrl
        };
    } catch (e) {
        console.error("Image Gen Error:", e);
        return { success: false, error: "Generation failed" };
    }
};
