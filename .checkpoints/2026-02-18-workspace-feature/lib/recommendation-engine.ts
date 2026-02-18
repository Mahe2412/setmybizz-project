// Tool Recommendation Engine
// Analyzes business profile and generates personalized tool recommendations

export interface BusinessProfile {
    businessName: string;
    industry: string;
    teamSize: string;
    products: string;
    challenges: string[];
    channels: string[];
    currentTools: string[];
    goals: string[];
}

export interface ToolRecommendation {
    id: string;
    name: string;
    category: string;
    icon: string;
    color: string;
    description: string;
    features: string[];
    pricing: string;
    priority: 'essential' | 'recommended' | 'advanced';
    matchScore: number;
    reasons: string[];
    integrations?: string[];
}

// Comprehensive tools database
const TOOLS_DATABASE: Omit<ToolRecommendation, 'priority' | 'matchScore' | 'reasons'>[] = [
    // OPERATIONS & INVENTORY
    {
        id: 'inventory-mgmt',
        name: 'Inventory Management',
        category: 'operations',
        icon: 'inventory_2',
        color: 'emerald',
        description: 'Track stock levels, manage products, and get low-stock alerts in real-time',
        features: ['Real-time stock tracking', 'Product catalog', 'Low stock alerts', 'Multi-location'],
        pricing: '₹499 - ₹2,999/mo',
        integrations: ['Shopify', 'Amazon', 'Excel']
    },
    {
        id: 'order-mgmt',
        name: 'Order Management',
        category: 'operations',
        icon: 'receipt_long',
        color: 'blue',
        description: 'Manage customer orders from creation to delivery',
        features: ['Order tracking', 'Status updates', 'Bulk processing', 'Customer notifications'],
        pricing: '₹399 - ₹1,999/mo'
    },
    {
        id: 'warehouse-mgmt',
        name: 'Warehouse Management',
        category: 'operations',
        icon: 'warehouse',
        color: 'teal',
        description: 'Optimize warehouse operations and stock movement',
        features: ['Bin locations', 'Pick & pack', 'Cycle counting', 'Stock transfers'],
        pricing: '₹999 - ₹4,999/mo'
    },

    // SALES & CRM
    {
        id: 'crm',
        name: 'Customer CRM',
        category: 'sales',
        icon: 'people',
        color: 'indigo',
        description: 'Manage customer relationships and track sales pipeline',
        features: ['Contact management', 'Sales pipeline', 'Lead tracking', 'Customer history'],
        pricing: '₹599 - ₹2,499/mo',
        integrations: ['Gmail', 'WhatsApp', 'Phone']
    },
    {
        id: 'quotation-tool',
        name: 'Quote Generator',
        category: 'sales',
        icon: 'request_quote',
        color: 'purple',
        description: 'Create professional quotations quickly',
        features: ['Templates', 'Auto calculations', 'PDF generation', 'Follow-up reminders'],
        pricing: '₹299 - ₹999/mo'
    },
    {
        id: 'sales-analytics',
        name: 'Sales Analytics',
        category: 'sales',
        icon: 'analytics',
        color: 'orange',
        description: 'Track sales performance and revenue metrics',
        features: ['Revenue tracking', 'Sales reports', 'Team performance', 'Forecasting'],
        pricing: '₹499 - ₹1,999/mo'
    },

    // FINANCE & ACCOUNTING
    {
        id: 'invoicing',
        name: 'Invoice Generator',
        category: 'finance',
        icon: 'description',
        color: 'blue',
        description: 'Create professional invoices with GST compliance',
        features: ['GST invoices', 'Auto numbering', 'Payment tracking', 'Reminders'],
        pricing: '₹299 - ₹1,499/mo',
        integrations: ['Tally', 'Razorpay', 'Email']
    },
    {
        id: 'expense-tracking',
        name: 'Expense Tracker',
        category: 'finance',
        icon: 'payments',
        color: 'rose',
        description: 'Track business expenses and manage budgets',
        features: ['Receipt scanning', 'Categories', 'Budget alerts', 'Expense reports'],
        pricing: '₹199 - ₹999/mo'
    },
    {
        id: 'gst-filing',
        name: 'GST Filing Tool',
        category: 'finance',
        icon: 'gavel',
        color: 'red',
        description: 'Simplify GST return filing and compliance',
        features: ['Auto GSTR filing', 'E-way bills', 'Tax calculations', 'Compliance alerts'],
        pricing: '₹499 - ₹2,999/mo'
    },

    // MARKETING
    {
        id: 'email-marketing',
        name: 'Email Marketing',
        category: 'marketing',
        icon: 'email',
        color: 'blue',
        description: 'Send professional email campaigns and newsletters',
        features: ['Email templates', 'Automation', 'Analytics', 'A/B testing'],
        pricing: '₹399 - ₹1,999/mo',
        integrations: ['Mailchimp', 'Gmail']
    },
    {
        id: 'social-media',
        name: 'Social Media Manager',
        category: 'marketing',
        icon: 'share',
        color: 'pink',
        description: 'Schedule and manage social media posts',
        features: ['Multi-platform posting', 'Content calendar', 'Analytics', 'AI captions'],
        pricing: '₹499 - ₹2,499/mo',
        integrations: ['Instagram', 'Facebook', 'LinkedIn']
    },
    {
        id: 'whatsapp-business',
        name: 'WhatsApp Business',
        category: 'marketing',
        icon: 'chat',
        color: 'green',
        description: 'Automate WhatsApp communication with customers',
        features: ['Bulk messages', 'Templates', 'Chatbot', 'Analytics'],
        pricing: '₹299 - ₹1,499/mo'
    },
    {
        id: 'sms-marketing',
        name: 'SMS Marketing',
        category: 'marketing',
        icon: 'sms',
        color: 'amber',
        description: 'Send promotional SMS to customers',
        features: ['Bulk SMS', 'Templates', 'Scheduling', 'Delivery reports'],
        pricing: 'Pay per SMS'
    },

    // CUSTOMER SUPPORT
    {
        id: 'live-chat',
        name: 'Live Chat',
        category: 'support',
        icon: 'forum',
        color: 'indigo',
        description: 'Real-time chat support for website visitors',
        features: ['Chat widget', 'Canned responses', 'Chat history', 'Mobile app'],
        pricing: '₹299 - ₹1,499/mo'
    },
    {
        id: 'helpdesk',
        name: 'Help Desk',
        category: 'support',
        icon: 'support_agent',
        color: 'purple',
        description: 'Manage customer support tickets efficiently',
        features: ['Ticket management', 'SLA tracking', 'Knowledge base', 'Multi-channel'],
        pricing: '₹499 - ₹2,499/mo'
    },

    // E-COMMERCE
    {
        id: 'online-store',
        name: 'Online Store Builder',
        category: 'ecommerce',
        icon: 'storefront',
        color: 'emerald',
        description: 'Create and manage your online store',
        features: ['Product catalog', 'Shopping cart', 'Payment gateway', 'Mobile responsive'],
        pricing: '₹999 - ₹4,999/mo',
        integrations: ['Razorpay', 'Shiprocket']
    },
    {
        id: 'payment-gateway',
        name: 'Payment Gateway',
        category: 'ecommerce',
        icon: 'payment',
        color: 'green',
        description: 'Accept online payments securely',
        features: ['UPI', 'Cards', 'Net banking', 'EMI options'],
        pricing: '2-3% per transaction'
    },
    {
        id: 'shipping-integration',
        name: 'Shipping Integration',
        category: 'ecommerce',
        icon: 'local_shipping',
        color: 'cyan',
        description: 'Integrate with multiple shipping partners',
        features: ['Rate calculator', 'Label printing', 'Tracking', 'COD available'],
        pricing: '₹299 - ₹999/mo',
        integrations: ['Delhivery', 'Blue Dart', 'Shiprocket']
    },

    // TEAM & PRODUCTIVITY
    {
        id: 'task-mgmt',
        name: 'Task Management',
        category: 'productivity',
        icon: 'task_alt',
        color: 'blue',
        description: 'Organize team tasks and projects',
        features: ['Task boards', 'Assignments', 'Deadlines', 'Progress tracking'],
        pricing: '₹199 - ₹999/mo'
    },
    {
        id: 'time-tracking',
        name: 'Time Tracking',
        category: 'productivity',
        icon: 'schedule',
        color: 'indigo',
        description: 'Track time spent on projects and tasks',
        features: ['Time logs', 'Reports', 'Billing integration', 'Mobile app'],
        pricing: '₹299 - ₹1,499/mo'
    },
    {
        id: 'team-chat',
        name: 'Team Chat',
        category: 'productivity',
        icon: 'groups',
        color: 'purple',
        description: 'Internal team communication platform',
        features: ['Channels', 'Direct messages', 'File sharing', 'Integrations'],
        pricing: '₹0 - ₹499/user/mo'
    },

    // ANALYTICS
    {
        id: 'business-analytics',
        name: 'Business Analytics',
        category: 'analytics',
        icon: 'bar_chart',
        color: 'orange',
        description: 'Comprehensive business intelligence and reporting',
        features: ['Custom dashboards', 'KPI tracking', 'Data visualization', 'Automated reports'],
        pricing: '₹999 - ₹4,999/mo'
    }
];

// Calculate match score for a tool based on profile
function calculateMatchScore(
    tool: Omit<ToolRecommendation, 'priority' | 'matchScore' | 'reasons'>,
    profile: BusinessProfile
): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    // Industry-specific matching
    const industryToolMap: Record<string, string[]> = {
        'ecommerce': ['inventory-mgmt', 'order-mgmt', 'online-store', 'payment-gateway', 'shipping-integration', 'email-marketing', 'social-media'],
        'saas': ['crm', 'helpdesk', 'live-chat', 'email-marketing', 'sales-analytics', 'business-analytics'],
        'services': ['crm', 'quotation-tool', 'invoicing', 'task-mgmt', 'time-tracking', 'team-chat'],
        'manufacturing': ['inventory-mgmt', 'warehouse-mgmt', 'order-mgmt', 'gst-filing', 'expense-tracking'],
        'retail': ['inventory-mgmt', 'order-mgmt', 'crm', 'payment-gateway', 'gst-filing'],
        'wholesale': ['inventory-mgmt', 'order-mgmt', 'quotation-tool', 'invoicing', 'crm']
    };

    if (industryToolMap[profile.industry]?.includes(tool.id)) {
        score += 30;
        reasons.push(`Essential for ${profile.industry} business`);
    }

    // Challenge-based matching
    const challengeToolMap: Record<string, string[]> = {
        'inventory': ['inventory-mgmt', 'warehouse-mgmt', 'order-mgmt'],
        'marketing': ['email-marketing', 'social-media', 'whatsapp-business', 'sms-marketing'],
        'sales': ['crm', 'quotation-tool', 'sales-analytics'],
        'finance': ['invoicing', 'expense-tracking', 'gst-filing'],
        'operations': ['task-mgmt', 'time-tracking', 'business-analytics'],
        'customer-service': ['helpdesk', 'live-chat', 'whatsapp-business']
    };

    profile.challenges.forEach(challenge => {
        if (challengeToolMap[challenge]?.includes(tool.id)) {
            score += 20;
            reasons.push(`Solves your ${challenge} challenge`);
        }
    });

    // Team size matching
    const teamSizeToolMap: Record<string, string[]> = {
        'solo': ['invoicing', 'task-mgmt', 'email-marketing', 'whatsapp-business'],
        'micro': ['crm', 'inventory-mgmt', 'invoicing', 'email-marketing'],
        'small': ['crm', 'inventory-mgmt', 'task-mgmt', 'team-chat', 'helpdesk'],
        'medium': ['warehouse-mgmt', 'business-analytics', 'helpdesk', 'team-chat'],
        'large': ['warehouse-mgmt', 'business-analytics', 'sales-analytics', 'time-tracking']
    };

    if (teamSizeToolMap[profile.teamSize]?.includes(tool.id)) {
        score += 15;
        reasons.push(`Perfect for ${profile.teamSize} team size`);
    }

    // Goals alignment
    const goalsToolMap: Record<string, string[]> = {
        'scale': ['crm', 'business-analytics', 'email-marketing', 'sales-analytics'],
        'automate': ['inventory-mgmt', 'invoicing', 'task-mgmt', 'whatsapp-business'],
        'improve-experience': ['crm', 'helpdesk', 'live-chat', 'whatsapp-business'],
        'reduce-costs': ['expense-tracking', 'business-analytics', 'task-mgmt'],
        'increase-sales': ['crm', 'email-marketing', 'social-media', 'quotation-tool']
    };

    profile.goals.forEach(goal => {
        if (goalsToolMap[goal]?.includes(tool.id)) {
            score += 15;
            reasons.push(`Helps achieve your goal: ${goal}`);
        }
    });

    // Sales channel matching
    const channelToolMap: Record<string, string[]> = {
        'website': ['online-store', 'live-chat', 'email-marketing'],
        'social': ['social-media', 'whatsapp-business'],
        'marketplace': ['inventory-mgmt', 'order-mgmt'],
        'offline': ['crm', 'invoicing', 'payment-gateway']
    };

    profile.channels.forEach(channel => {
        if (channelToolMap[channel]?.includes(tool.id)) {
            score += 10;
            reasons.push(`Supports your ${channel} channel`);
        }
    });

    // Gap analysis - if they don't have similar tools
    if (profile.currentTools.includes('spreadsheets') && tool.category === 'operations') {
        score += 10;
        reasons.push('Upgrade from manual spreadsheets');
    }

    return { score: Math.min(score, 100), reasons };
}

// Assign priority based on score
function assignPriority(score: number): 'essential' | 'recommended' | 'advanced' {
    if (score >= 70) return 'essential';
    if (score >= 50) return 'recommended';
    return 'advanced';
}

// Main recommendation function
export function generateRecommendations(profile: BusinessProfile): ToolRecommendation[] {
    const recommendations: ToolRecommendation[] = [];

    TOOLS_DATABASE.forEach(tool => {
        const { score, reasons } = calculateMatchScore(tool, profile);

        // Only recommend tools with score > 30
        if (score > 30) {
            recommendations.push({
                ...tool,
                matchScore: score,
                priority: assignPriority(score),
                reasons
            });
        }
    });

    // Sort by score (highest first)
    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
}

// Get recommendations by priority
export function getRecommendationsByPriority(profile: BusinessProfile) {
    const all = generateRecommendations(profile);

    return {
        essential: all.filter(t => t.priority === 'essential'),
        recommended: all.filter(t => t.priority === 'recommended'),
        advanced: all.filter(t => t.priority === 'advanced')
    };
}
