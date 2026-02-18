export type AIFeatureType = 'roadmap' | 'social_post';

export interface PromptPayload {
    type: AIFeatureType;
    data: any;
}

export interface AIRoadmap {
    overview: string;
    weeks: {
        week: number;
        title: string;
        tasks: string[];
    }[];
}

export interface AISocialPost {
    headline: string;
    caption: string;
    hashtags: string[];
}

export interface AIResponse {
    success: boolean;
    data?: AIRoadmap | AISocialPost | string;
    error?: string;
}
