export type OfferingType = 'physical_goods' | 'services' | 'hospitality' | 'content' | 'tech' | 'other';

export type BusinessStage = 'idea' | 'launch' | 'operating';

export type FocusArea = 'online_presence' | 'formation' | 'branding' | 'growth';

export type BusinessSize = 'solo' | 'small_team' | 'scaling' | 'enterprise';

export type ExistingAsset =
    | 'business_cards'
    | 'domain'
    | 'mailbox'
    | 'logo'
    | 'trademark'
    | 'gst'
    | 'llc'
    | 'name'
    | 'website'
    | 'ecommerce'
    | 'startup_india'
    | 'udyam';

export interface BusinessData {
    name: string;
    businessName?: string; // Unified with name
    offeringType: OfferingType;
    offeringOther: string;
    industry: string;
    sector: string;
    size: BusinessSize;
    businessModel: string;
    description: string;
    motivation: string;
    stage: BusinessStage | string;
    existingAssets: ExistingAsset[];
    focusAreas: FocusArea[];
    // Additional fields from AI Incorporation Assistant
    focus?: string;
    teamSize?: string;
    funding?: string;
    location?: string;
    goal?: string;
}

export type LeadStatus = 'new' | 'viewed' | 'engaged' | 'warm' | 'hot' | 'ordered' | 'fulfilled' | 'lost';

export interface Lead {
    leadId: string; // SMB-2024-XXXX
    uid?: string; // Firebase Auth ID (if logged in)
    guestId: string; // Session ID for non-logged users
    businessData: BusinessData;
    status: LeadStatus;
    interestScore: number;
    lastActiveAt: any; // Timestamp
    createdAt: any; // Timestamp
    source: string; // 'direct', 'google', 'referral'
    contact?: {
        email?: string;
        phone?: string;
        whatsapp?: string;
    };
    adminNotes?: string[];
}
