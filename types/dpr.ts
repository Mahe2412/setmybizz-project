export type ProjectScheme = 'PMEGP' | 'MUDRA' | 'STARTUP_INDIA' | 'GENERAL_BANK_LOAN' | 'MSME_LOAN';

export interface DPRFinancials {
    fixedAssets: {
        landAndBuilding: number;
        machinery: number;
        furniture: number;
        otherAssets: number;
    };
    workingCapital: {
        rawMaterial: number;
        salaries: number;
        utilities: number;
        marketing: number;
        contingency: number;
    };
    revenue: {
        monthlyTarget: number;
        unitPrice: number;
        unitsPerMonth: number;
    };
    funding: {
        ownContribution: number;
        loanRequired: number;
        subsidyEligible: number;
    };
    parameters?: {
        workingDays: number;
        shifts: number;
        capacityUtil: number;
        interestRate: number;
    };
}

export interface DPRContent {
    executiveSummary: string;
    businessConcept: string;
    marketAnalysis: string;
    swotAnalysis: {
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        threats: string[];
    };
    implementationSchedule: string[];
    manpowerRequirement: {
        role: string;
        count: number;
        salary: number;
    }[];
}

export interface ProjectReport {
    id: string;
    userId: string;
    scheme: ProjectScheme;
    businessName: string;
    industry: string;
    location: {
        city: string;
        state: string;
        areaType: 'RURAL' | 'URBAN';
    };
    promoter: {
        name: string;
        qualification: string;
        experience: string;
        category: 'GENERAL' | 'SC' | 'ST' | 'OBC' | 'MINORITY' | 'EX_SERVICEMAN';
        gender: 'MALE' | 'FEMALE' | 'OTHER';
    };
    content: DPRContent;
    financials: DPRFinancials;
    status: 'DRAFT' | 'COMPLETED' | 'SIGNED_BY_CA';
    createdAt: any;
    updatedAt: any;
}
