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

export interface Director {
    name: string;
    din: string;
    designation: string;
    kyc: boolean;
}

export interface BusinessData {
    userId?: string;
    userName?: string;
    name: string; // This is the Business/Project Name
    country?: string;
    state?: string;
    email?: string;
    phone?: string;
    cin?: string;
    gstin?: string;
    pan?: string;
    roc?: string;
    regDate?: string;
    structure?: string;
    category?: string;
    address?: string;
    directors?: Director[];
    healthScore?: number;
    website?: string;
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
    shareCapital?: string;
    paidUpCapital?: string;
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
