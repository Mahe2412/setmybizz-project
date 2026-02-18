export interface Country {
    id: string;
    name: string;
    flag: string;
    currency: string;
    language: string;
    gradient: string;
}

export interface GlobalService {
    id: string;
    type: 'incorporation' | 'export' | 'market_access';
    title: string;
    description: string;
    icon: string;
    color: string;
}

export interface ServiceInfo {
    whatIs: string;
    eligibility: string[];
    whoCanStart: string[];
    benefits: string[];
    timeline: string;
    startingPrice: string;
}

export interface GlobalLead {
    businessName: string;
    productService: string;
    launchTimeline: string;
    businessSize: string;
    industry: string;
    targetCountry: string;
    selectedService: string;
    email: string;
    phone: string;
    userId?: string;
    timestamp: Date;
}

export interface PackageSuggestion {
    packageName: string;
    services: string[];
    estimatedCost: string;
    timeline: string;
    description: string;
    recommended: boolean;
}
