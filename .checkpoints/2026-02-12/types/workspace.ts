// Workspace Types - Industry-specific AI Workspace System

export type IndustryType =
    | 'ecommerce'
    | 'pharma'
    | 'saas'
    | 'manufacturing'
    | 'retail'
    | 'services'
    | 'food'
    | 'education'
    | 'healthcare'
    | 'finance'
    | 'real-estate'
    | 'other';

export type BusinessSize =
    | 'solo' // 1 person
    | 'micro' // 2-5
    | 'small' // 6-20
    | 'medium' // 21-50
    | 'large'; // 50+

export type TeamSize = {
    total: number;
    sales?: number;
    marketing?: number;
    operations?: number;
    finance?: number;
    hr?: number;
};

export interface BusinessProfile {
    // Basic Info
    businessName: string;
    industry: IndustryType;
    size: BusinessSize;
    teamSize: TeamSize;

    // Products/Services
    productService: string;
    productCategories?: string[];

    // Current State
    monthlyRevenue?: string;
    salesChannels: string[]; // online, offline, both
    currentTools: string[];

    // Challenges & Gaps
    challenges: string[];
    gaps: string[];
    goals: string[];

    // Sales & Marketing
    leadSources: string[];
    averageLeads?: number;
    conversionRate?: number;

    // Timeline
    businessAge?: string; // startup, 1-2 years, 3-5 years, 5+ years
    growthStage?: 'ideation' | 'launch' | 'growth' | 'scale' | 'mature';
}

export interface ToolRecommendation {
    id: string;
    name: string;
    category: string;
    description: string;
    icon: string;
    pricing: {
        free: boolean;
        freeTier?: string;
        paidTier?: string;
        price?: number;
    };
    features: string[];
    matchScore: number; // 0-100
    reason: string; // Why recommended
    priority: 'essential' | 'recommended' | 'optional';
    installStatus: 'not-installed' | 'installing' | 'installed';
    setupComplexity: 'easy' | 'medium' | 'advanced';
}

export interface IntegrationConfig {
    id: string;
    name: string;
    type: 'crm' | 'erp' | 'email' | 'payment' | 'marketing' | 'analytics' | 'communication' | 'storage' | 'automation' | 'custom';
    provider: string; // zoho, odoo, google, whatsapp, etc
    status: 'connected' | 'disconnected' | 'error' | 'pending';
    credentials?: any;
    config?: any;
    lastSync?: Date;
    features: string[];
}

export interface WorkspaceTheme {
    industry: IndustryType;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    icons: {
        [key: string]: string; // icon name: icon path or emoji
    };
    widgets: string[]; // which widgets to show
    layout: 'default' | 'ecommerce' | 'pharma' | 'saas';
}

export interface DashboardWidget {
    id: string;
    type: string;
    title: string;
    icon: string;
    position: { x: number; y: number };
    size: { w: number; h: number };
    data?: any;
    refreshInterval?: number;
    permissions?: string[];
}

export interface AICofounderInsight {
    id: string;
    type: 'tip' | 'alert' | 'suggestion' | 'opportunity' | 'warning';
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: 'sales' | 'marketing' | 'finance' | 'operations' | 'hr' | 'compliance';
    actionable: boolean;
    action?: {
        label: string;
        type: 'link' | 'modal' | 'tool' | 'integration';
        data: any;
    };
    timestamp: Date;
    read: boolean;
}

export interface WorkspaceState {
    profile: BusinessProfile;
    theme: WorkspaceTheme;
    recommendations: ToolRecommendation[];
    integrations: IntegrationConfig[];
    widgets: DashboardWidget[];
    insights: AICofounderInsight[];
    setupComplete: boolean;
    onboardingStep: number;
}

// Industry Templates
export interface IndustryTemplate {
    industry: IndustryType;
    name: string;
    description: string;
    defaultTools: string[];
    defaultWidgets: string[];
    theme: Partial<WorkspaceTheme>;
    workflows: string[];
}

// App Marketplace
export interface MarketplaceApp {
    id: string;
    name: string;
    slug: string;
    category: string;
    subcategory?: string;
    description: string;
    longDescription: string;
    icon: string;
    screenshots: string[];
    developer: {
        name: string;
        website?: string;
        support?: string;
    };
    pricing: {
        model: 'free' | 'freemium' | 'paid' | 'subscription';
        free: boolean;
        tiers: {
            name: string;
            price: number;
            features: string[];
            limits?: any;
        }[];
    };
    features: string[];
    integrations: string[];
    ratings: {
        average: number;
        count: number;
    };
    installCount: number;
    permissions: string[];
    compatibility: {
        industries: IndustryType[];
        businessSizes: BusinessSize[];
    };
    tags: string[];
    lastUpdated: Date;
    version: string;
}

export interface InstalledApp extends MarketplaceApp {
    installedAt: Date;
    config: any;
    enabled: boolean;
    tier: string;
}
