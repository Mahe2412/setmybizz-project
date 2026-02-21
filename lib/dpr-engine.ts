import { ProjectReport, ProjectScheme } from '../types/dpr';

/**
 * PMEGP Subsidy Calculation Logic
 * @param category Promoter category
 * @param areaType Rural or Urban
 * @returns Subsidy percentage and own contribution percentage
 */
export const calculatePMEGPSubsidy = (
    category: string,
    areaType: 'RURAL' | 'URBAN'
) => {
    const isSpecial = ['SC', 'ST', 'OBC', 'MINORITY', 'EX_SERVICEMAN'].includes(category);
    
    if (areaType === 'RURAL') {
        return {
            subsidy: isSpecial ? 35 : 25,
            contribution: isSpecial ? 5 : 10
        };
    } else {
        return {
            subsidy: isSpecial ? 25 : 15,
            contribution: isSpecial ? 5 : 10
        };
    }
};

/**
 * MUDRA Loan Configuration
 * MUDRA (Micro Units Development & Refinance Agency Ltd.) doesn't have a direct capital subsidy 
 * like PMEGP, but offers interest subvention for Shishu loans (2% for prompt repayment).
 */
export const getMUDRAConfig = (type: 'SHISHU' | 'KISHORE' | 'TARUN') => {
    switch(type) {
        case 'SHISHU': return { maxLimit: 50000, collateral: 'No', processingFee: 'Nil' };
        case 'KISHORE': return { maxLimit: 500000, collateral: 'No', processingFee: 'Nil' };
        case 'TARUN': return { maxLimit: 1000000, collateral: 'No', processingFee: '0.5%' };
    }
};

/**
 * Calculate Key Banking Ratios
 */
export const calculateBankingRatios = (financials: any) => {
    const totalProjectCost = 
        financials.fixedAssets.landAndBuilding + 
        financials.fixedAssets.machinery + 
        financials.fixedAssets.furniture + 
        financials.fixedAssets.otherAssets + 
        (financials.workingCapital.rawMaterial * 3); // 3 months working capital cycle

    const annualRevenue = financials.revenue.monthlyTarget * 12;
    const estimatedProfitMargin = 0.20; // 20% default margin for projection
    const annualNetProfit = annualRevenue * estimatedProfitMargin;
    
    const dscr = annualNetProfit / (financials.funding.loanRequired / 5); // 5 year repayment assumption
    const bep = (financials.workingCapital.salaries * 12) / (financials.revenue.unitPrice - (financials.revenue.unitPrice * 0.40));

    return {
        totalProjectCost,
        dscr: Number(dscr.toFixed(2)),
        bep: Number(bep.toFixed(2)),
        roi: Number(((annualNetProfit / totalProjectCost) * 100).toFixed(2))
    };
};

/**
 * Generate Multi-Year CMA Data Projections
 * Premium tier allows up to 10 years. Default is 3-5 years.
 */
export const generateCMAData = (report: ProjectReport, yearsCount: number = 3) => {
    const years = Array.from({ length: yearsCount }, (_, i) => i + 1);
    const results = years.map(year => {
        // Industry-specific growth curves
        const growthFactor = year === 1 ? 1 : (1 + (Math.random() * 0.1 + 0.1)); // 10-20% growth
        const sales = (report.financials.revenue.monthlyTarget * 12) * Math.pow(1.15, year - 1);
        
        // P&L Components
        const rawMaterials = sales * 0.45; // 45% of sales
        const salaries = report.financials.workingCapital.salaries * 12 * Math.pow(1.08, year - 1); // 8% increment
        const interest = (report.financials.funding.loanRequired * 0.095) * (1 - (year - 1) * 0.1); // Reducing principal
        
        const ebita = sales - rawMaterials - salaries - (report.financials.workingCapital.utilities * 12);
        const pbt = ebita - interest - (report.financials.fixedAssets.machinery * 0.1);
        const tax = pbt > 0 ? pbt * 0.25 : 0;
        
        return {
            year,
            sales: Math.round(sales),
            ebita: Math.round(ebita),
            pbt: Math.round(pbt),
            pat: Math.round(pbt - tax),
            currentRatio: 1.33 + (year * 0.05), // Improving liquidity
            dscr: 1.5 + (year * 0.2) // Improving debt coverage
        };
    });
    return results;
};
