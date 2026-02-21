/**
 * SetMyBizz AI Scheme Knowledge Base
 * This file acts as the "Training Data" for the AI. 
 * Instead of expensive fine-tuning, we inject these rules into the AI prompt context.
 */

export const SCHEME_KNOWLEDGE = {
    PMEGP: {
        fullName: "Prime Minister's Employment Generation Programme",
        maxCost: { manufacturing: 5000000, service: 2000000 },
        subsidyGrants: {
            urban: { general: 15, special: 25 },
            rural: { general: 25, special: 35 }
        },
        ownContribution: { general: 10, special: 5 },
        eligibility: [
            "Any individual above 18 years",
            "At least 8th standard pass for projects > 10L (mfg) or > 5L (service)",
            "Only new projects are eligible"
        ],
        mandatoryTables: [
            "Project Cost & Means of Finance",
            "Raw Material Calculation",
            "Manpower & Salary",
            "Power & Utility",
            "5-Year P&L Projection",
            "DSCR calculation"
        ]
    },
    MUDRA: {
        shishu: { limit: 50000, focus: "Startups/Micro units" },
        kishore: { limit: 500000, focus: "Expansion of existing units" },
        tarun: { limit: 1000000, focus: "Large business needs" },
        interestSubvention: "2% subvention for Shishu loans for prompt repayment."
    },
    CMA_STANDARDS: {
        description: "Credit Monitoring Arrangement (CMA) data as per Tandon Committee",
        forms: [
            "Form I: Particulars of existing & proposed limits",
            "Form II: Operating Statement",
            "Form III: Analysis of Balance Sheet",
            "Form IV: Comparative statement of Current Assets & Current Liabilities",
            "Form V: Fund Flow Statement",
            "Form VI: Maximum Permissible Bank Finance (MPBF)"
        ]
    }
};

/**
 * Language Support Maps
 */
export const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' }
];
