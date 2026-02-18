import { AIRoadmap, AISocialPost } from '../types/ai';
import { generateRoadmap, generateSocialPost } from './gemini';

export const getBusinessRoadmap = async (businessData: any): Promise<AIRoadmap | null> => {
    try {
        const result = await generateRoadmap(businessData);
        return result;
    } catch (e) {
        console.error("AI Service Error", e);
        return null;
    }
};

export const getSocialPost = async (businessData: any, customPrompt?: string): Promise<AISocialPost | null> => {
    try {
        const result = await generateSocialPost(businessData, customPrompt);
        return result;
    } catch (e) {
        console.error("AI Service Error", e);
        return null;
    }
};
