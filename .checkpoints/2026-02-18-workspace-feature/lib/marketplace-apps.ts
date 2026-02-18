import { MarketplaceApp, IndustryType, BusinessSize } from '@/types/workspace';

export const MARKETPLACE_APPS: MarketplaceApp[] = [
    // CRM & Sales Tools
    {
        id: 'zoho-crm',
        name: 'Zoho CRM',
        slug: 'zoho-crm',
        category: 'crm',
        subcategory: 'sales',
        description: 'Enterprise-grade CRM for managing leads, contacts, and sales pipeline',
        longDescription: 'Zoho CRM helps you track leads, automate sales processes, and close deals faster. Features include pipeline management, email integration, workflow automation, and advanced analytics.',
        icon: '🎯',
        screenshots: [],
        developer: {
            name: 'Zoho Corporation',
            website: 'https://www.zoho.com/crm/',
            support: 'https://www.zoho.com/crm/help.html'
        },
        pricing: {
            model: 'freemium',
            free: true,
            tiers: [
                {
                    name: 'Free',
                    price: 0,
                    features: ['Up to 3 users', 'Basic CRM', 'Email integration'],
                    limits: { users: 3 }
                },
                {
                    name: 'Standard',
                    price: 899,
                    features: ['Unlimited users', 'Automation', 'Reports', 'Mobile app'],
                    limits: {}
                },
                {
                    name: 'Professional',
                    price: 1799,
                    features: ['AI assistant', 'Advanced analytics', 'Custom modules'],
                    limits: {}
                }
            ]
        },
        features: ['Lead Management', 'Sales Pipeline', 'Email Marketing', 'Workflow Automation', 'Analytics'],
        integrations: ['gmail', 'whatsapp', 'google-workspace'],
        ratings: { average: 4.5, count: 2340 },
        installCount: 12500,
        permissions: ['contacts.read', 'contacts.write', 'email.send'],
        compatibility: {
            industries: ['ecommerce', 'saas', 'services', 'real-estate', 'finance'],
            businessSizes: ['micro', 'small', 'medium', 'large']
        },
        tags: ['crm', 'sales', 'leads', 'automation'],
        lastUpdated: new Date('2024-01-15'),
        version: '5.2.1'
    },

    {
        id: 'whatsapp-business',
        name: 'WhatsApp Business Automation',
        slug: 'whatsapp-business',
        category: 'communication',
        subcategory: 'messaging',
        description: 'AI-powered WhatsApp automation for sales and customer support',
        longDescription: 'Automate WhatsApp conversations, send bulk messages, create chatbots, and manage customer interactions. Integrates with CRM for seamless lead nurturing.',
        icon: '💬',
        screenshots: [],
        developer: {
            name: 'SetMyBizz Labs',
            support: 'support@setmybizz.in'
        },
        pricing: {
            model: 'freemium',
            free: true,
            tiers: [
                {
                    name: 'Free',
                    price: 0,
                    features: ['100 messages/month', 'Basic automation', '1 bot'],
                    limits: { messages: 100, bots: 1 }
                },
                {
                    name: 'Pro',
                    price: 499,
                    features: ['5000 messages/month', 'AI chatbot', 'CRM integration', 'Analytics'],
                    limits: { messages: 5000, bots: 3 }
                },
                {
                    name: 'Enterprise',
                    price: 1999,
                    features: ['Unlimited messages', 'Custom AI', 'Priority support', 'API access'],
                    limits: {}
                }
            ]
        },
        features: ['Auto-Reply', 'Bulk Messaging', 'AI Chatbot', 'CRM Integration', 'Analytics'],
        integrations: ['whatsapp', 'zoho-crm', 'google-sheets'],
        ratings: { average: 4.8, count: 1890 },
        installCount: 8500,
        permissions: ['whatsapp.send', 'whatsapp.receive', 'contacts.read'],
        compatibility: {
            industries: ['ecommerce', 'pharma', 'retail', 'services', 'food', 'real-estate'],
            businessSizes: ['solo', 'micro', 'small', 'medium']
        },
        tags: ['whatsapp', 'automation', 'ai', 'chatbot', 'messaging'],
        lastUpdated: new Date('2024-02-01'),
        version: '2.1.0'
    },

    {
        id: 'odoo-erp',
        name: 'Odoo ERP',
        slug: 'odoo-erp',
        category: 'erp',
        subcategory: 'business-management',
        description: 'All-in-one ERP for inventory, manufacturing, and operations',
        longDescription: 'Odoo is a complete business management suite with modules for inventory, manufacturing, purchase, sales, accounting, and more. Highly customizable and scalable.',
        icon: '📊',
        screenshots: [],
        developer: {
            name: 'Odoo S.A.',
            website: 'https://www.odoo.com',
            support: 'https://www.odoo.com/help'
        },
        pricing: {
            model: 'freemium',
            free: true,
            tiers: [
                {
                    name: 'Community',
                    price: 0,
                    features: ['1 app free', 'Basic features', 'Open source'],
                    limits: { apps: 1 }
                },
                {
                    name: 'Standard',
                    price: 1499,
                    features: ['All apps', 'Support', 'Cloud hosting'],
                    limits: {}
                },
                {
                    name: 'Custom',
                    price: 2999,
                    features: ['Custom development', 'Premium support', 'Dedicated server'],
                    limits: {}
                }
            ]
        },
        features: ['Inventory Management', 'Manufacturing', 'Purchase', 'Sales', 'Accounting', 'HR'],
        integrations: ['google-workspace', 'payment-gateways', 'shipping-providers'],
        ratings: { average: 4.6, count: 3200 },
        installCount: 15000,
        permissions: ['inventory.read', 'inventory.write', 'accounting.read', 'accounting.write'],
        compatibility: {
            industries: ['manufacturing', 'pharma', 'ecommerce', 'retail', 'services'],
            businessSizes: ['small', 'medium', 'large']
        },
        tags: ['erp', 'inventory', 'manufacturing', 'accounting'],
        lastUpdated: new Date('2024-01-20'),
        version: '16.0'
    },

    {
        id: 'google-workspace',
        name: 'Google Workspace',
        slug: 'google-workspace',
        category: 'productivity',
        subcategory: 'office-suite',
        description: 'Gmail, Drive, Calendar, Sheets - Complete productivity suite',
        longDescription: 'Integrate Google Workspace to access Gmail, Google Drive, Calendar, Sheets, and Docs directly from your dashboard. Real-time sync and collaboration.',
        icon: '🔵',
        screenshots: [],
        developer: {
            name: 'Google',
            website: 'https://workspace.google.com'
        },
        pricing: {
            model: 'freemium',
            free: true,
            tiers: [
                {
                    name: 'Free (Personal)',
                    price: 0,
                    features: ['15 GB storage', 'Basic features'],
                    limits: { storage: 15 }
                },
                {
                    name: 'Business Starter',
                    price: 125,
                    features: ['30 GB storage', 'Custom email', 'Support'],
                    limits: { storage: 30 }
                },
                {
                    name: 'Business Standard',
                    price: 672,
                    features: ['2 TB storage', 'Enhanced security', 'Recording'],
                    limits: { storage: 2000 }
                }
            ]
        },
        features: ['Email', 'Calendar', 'Drive', 'Sheets', 'Docs', 'Meet'],
        integrations: ['all'],
        ratings: { average: 4.7, count: 8900 },
        installCount: 25000,
        permissions: ['gmail.read', 'gmail.send', 'calendar.read', 'drive.read'],
        compatibility: {
            industries: ['ecommerce', 'saas', 'services', 'education', 'healthcare', 'finance', 'real-estate', 'other'],
            businessSizes: ['solo', 'micro', 'small', 'medium', 'large']
        },
        tags: ['email', 'calendar', 'storage', 'productivity'],
        lastUpdated: new Date('2024-02-05'),
        version: '2024.2'
    },

    {
        id: 'razorpay',
        name: 'Razorpay Payment Gateway',
        slug: 'razorpay',
        category: 'payment',
        subcategory: 'payment-gateway',
        description: 'Accept payments online - Credit/Debit cards, UPI, Wallets',
        longDescription: 'Razorpay enables you to accept, process and disburse payments with ease. Supports all payment modes including Cards, UPI, Netbanking, and Wallets.',
        icon: '💳',
        screenshots: [],
        developer: {
            name: 'Razorpay',
            website: 'https://razorpay.com',
            support: 'https://razorpay.com/support'
        },
        pricing: {
            model: 'paid',
            free: false,
            tiers: [
                {
                    name: 'Standard',
                    price: 0,
                    features: ['2% transaction fee', 'All payment modes', 'Dashboard'],
                    limits: {}
                },
                {
                    name: 'Premium',
                    price: 999,
                    features: ['1.5% transaction fee', 'Priority support', 'Custom checkout'],
                    limits: {}
                }
            ]
        },
        features: ['Payment Gateway', 'UPI', 'QR Codes', 'Payment Links', 'Subscriptions', 'Invoices'],
        integrations: ['zoho-crm', 'whatsapp-business', 'accounting-software'],
        ratings: { average: 4.4, count: 4200 },
        installCount: 18000,
        permissions: ['payments.read', 'payments.write'],
        compatibility: {
            industries: ['ecommerce', 'saas', 'services', 'education', 'food', 'retail'],
            businessSizes: ['solo', 'micro', 'small', 'medium', 'large']
        },
        tags: ['payments', 'gateway', 'upi', 'invoicing'],
        lastUpdated: new Date('2024-01-28'),
        version: '3.8.2'
    },

    {
        id: 'invoice-generator',
        name: 'Smart Invoice Generator',
        slug: 'invoice-generator',
        category: 'finance',
        subcategory: 'invoicing',
        description: 'GST-compliant invoice and quotation generator',
        longDescription: 'Generate professional invoices, quotations, and proforma invoices. Supports GST, custom branding, multiple currencies, and automatic numbering.',
        icon: '📄',
        screenshots: [],
        developer: {
            name: 'SetMyBizz Labs',
            support: 'support@setmybizz.in'
        },
        pricing: {
            model: 'freemium',
            free: true,
            tiers: [
                {
                    name: 'Free',
                    price: 0,
                    features: ['10 invoices/month', 'GST support', 'Basic templates'],
                    limits: { invoices: 10 }
                },
                {
                    name: 'Pro',
                    price: 299,
                    features: ['Unlimited invoices', 'Custom branding', 'Auto reminders', 'Reports'],
                    limits: {}
                }
            ]
        },
        features: ['GST Invoicing', 'Quotations', 'Custom Branding', 'Payment Tracking', 'Email Delivery'],
        integrations: ['razorpay', 'google-drive', 'whatsapp-business'],
        ratings: { average: 4.6, count: 1500 },
        installCount: 6800,
        permissions: ['invoices.read', 'invoices.write', 'customers.read'],
        compatibility: {
            industries: ['ecommerce', 'services', 'retail', 'manufacturing', 'food', 'pharma'],
            businessSizes: ['solo', 'micro', 'small', 'medium']
        },
        tags: ['invoicing', 'gst', 'billing', 'quotations'],
        lastUpdated: new Date('2024-02-03'),
        version: '1.4.0'
    },

    {
        id: 'social-media-manager',
        name: 'Social Media Manager',
        slug: 'social-media-manager',
        category: 'marketing',
        subcategory: 'social-media',
        description: 'Schedule posts, generate content with AI, analyze performance',
        longDescription: 'Manage all your social media from one place. AI-powered content generation, multi-platform scheduling, analytics, and engagement tracking.',
        icon: '📢',
        screenshots: [],
        developer: {
            name: 'SetMyBizz Labs',
            support: 'support@setmybizz.in'
        },
        pricing: {
            model: 'freemium',
            free: true,
            tiers: [
                {
                    name: 'Free',
                    price: 0,
                    features: ['5 posts/month', '2 accounts', 'Basic analytics'],
                    limits: { posts: 5, accounts: 2 }
                },
                {
                    name: 'Pro',
                    price: 699,
                    features: ['Unlimited posts', '10 accounts', 'AI content', 'Advanced analytics'],
                    limits: { accounts: 10 }
                }
            ]
        },
        features: ['Multi-platform Posting', 'AI Content Generator', 'Scheduling', 'Analytics', 'Engagement Tracking'],
        integrations: ['facebook', 'instagram', 'twitter', 'linkedin', 'google-analytics'],
        ratings: { average: 4.5, count: 2100 },
        installCount: 7200,
        permissions: ['social.read', 'social.write'],
        compatibility: {
            industries: ['ecommerce', 'saas', 'services', 'food', 'retail', 'education', 'real-estate'],
            businessSizes: ['solo', 'micro', 'small', 'medium']
        },
        tags: ['social-media', 'marketing', 'ai', 'content', 'scheduling'],
        lastUpdated: new Date('2024-01-25'),
        version: '2.3.1'
    },

    {
        id: 'customer-support',
        name: 'Help Desk & Support',
        slug: 'customer-support',
        category: 'support',
        subcategory: 'helpdesk',
        description: 'Multi-channel customer support with AI-powered responses',
        longDescription: 'Manage customer support tickets from email, chat, WhatsApp, and social media. AI suggests responses, automates common queries, and tracks satisfaction.',
        icon: '🎧',
        screenshots: [],
        developer: {
            name: 'SetMyBizz Labs',
            support: 'support@setmybizz.in'
        },
        pricing: {
            model: 'freemium',
            free: true,
            tiers: [
                {
                    name: 'Free',
                    price: 0,
                    features: ['50 tickets/month', '1 agent', 'Email support'],
                    limits: { tickets: 50, agents: 1 }
                },
                {
                    name: 'Pro',
                    price: 599,
                    features: ['Unlimited tickets', '5 agents', 'AI responses', 'Multi-channel'],
                    limits: { agents: 5 }
                }
            ]
        },
        features: ['Ticket Management', 'AI Responses', 'Multi-channel', 'SLA Tracking', 'Customer Satisfaction'],
        integrations: ['whatsapp-business', 'gmail', 'facebook', 'zoho-crm'],
        ratings: { average: 4.7, count: 1800 },
        installCount: 5500,
        permissions: ['tickets.read', 'tickets.write', 'customers.read'],
        compatibility: {
            industries: ['ecommerce', 'saas', 'services', 'education', 'healthcare', 'finance'],
            businessSizes: ['micro', 'small', 'medium', 'large']
        },
        tags: ['support', 'helpdesk', 'ai', 'tickets', 'customer-service'],
        lastUpdated: new Date('2024-02-08'),
        version: '3.1.0'
    },

    {
        id: 'inventory-management',
        name: 'Inventory & Stock Manager',
        slug: 'inventory-management',
        category: 'inventory',
        subcategory: 'stock-management',
        description: 'Track inventory, manage stock levels, automate reordering',
        longDescription: 'Comprehensive inventory management with real-time stock tracking, low stock alerts, batch tracking, expiry management, and purchase order automation.',
        icon: '📦',
        screenshots: [],
        developer: {
            name: 'SetMyBizz Labs',
            support: 'support@setmybizz.in'
        },
        pricing: {
            model: 'freemium',
            free: true,
            tiers: [
                {
                    name: 'Free',
                    price: 0,
                    features: ['100 SKUs', 'Basic tracking', '1 warehouse'],
                    limits: { skus: 100, warehouses: 1 }
                },
                {
                    name: 'Pro',
                    price: 899,
                    features: ['Unlimited SKUs', 'Multiple warehouses', 'Auto-reorder', 'Batch tracking'],
                    limits: {}
                }
            ]
        },
        features: ['Stock Tracking', 'Low Stock Alerts', 'Batch Management', 'Expiry Tracking', 'Purchase Orders'],
        integrations: ['odoo-erp', 'accounting-software', 'pos-system'],
        ratings: { average: 4.5, count: 2400 },
        installCount: 9200,
        permissions: ['inventory.read', 'inventory.write'],
        compatibility: {
            industries: ['ecommerce', 'pharma', 'retail', 'manufacturing', 'food'],
            businessSizes: ['micro', 'small', 'medium', 'large']
        },
        tags: ['inventory', 'stock', 'warehouse', 'purchasing'],
        lastUpdated: new Date('2024-01-30'),
        version: '2.6.0'
    },

    {
        id: 'email-marketing',
        name: 'Email Marketing Automation',
        slug: 'email-marketing',
        category: 'marketing',
        subcategory: 'email',
        description: 'Send bulk emails, create campaigns, track engagement',
        longDescription: 'Professional email marketing with drag-drop editor, AI content suggestions, A/B testing, segmentation, and detailed analytics.',
        icon: '📧',
        screenshots: [],
        developer: {
            name: 'SetMyBizz Labs',
            support: 'support@setmybizz.in'
        },
        pricing: {
            model: 'freemium',
            free: true,
            tiers: [
                {
                    name: 'Free',
                    price: 0,
                    features: ['1000 emails/month', 'Basic templates', '500 contacts'],
                    limits: { emails: 1000, contacts: 500 }
                },
                {
                    name: 'Pro',
                    price: 799,
                    features: ['50K emails/month', 'AI content', 'A/B testing', 'Automation'],
                    limits: { emails: 50000 }
                }
            ]
        },
        features: ['Email Campaigns', 'AI Content', 'Automation', 'Segmentation', 'Analytics', 'A/B Testing'],
        integrations: ['zoho-crm', 'google-analytics', 'whatsapp-business'],
        ratings: { average: 4.6, count: 1950 },
        installCount: 6300,
        permissions: ['email.send', 'contacts.read'],
        compatibility: {
            industries: ['ecommerce', 'saas', 'services', 'education', 'real-estate', 'finance'],
            businessSizes: ['solo', 'micro', 'small', 'medium']
        },
        tags: ['email', 'marketing', 'automation', 'campaigns', 'ai'],
        lastUpdated: new Date('2024-02-02'),
        version: '1.8.0'
    },

    {
        id: 'analytics-dashboard',
        name: 'Business Analytics Dashboard',
        slug: 'analytics-dashboard',
        category: 'analytics',
        subcategory: 'business-intelligence',
        description: 'Visualize business metrics, generate reports, predictive insights',
        longDescription: 'Comprehensive analytics dashboard with real-time metrics, custom reports, predictive analytics, and AI-powered insights across all your business data.',
        icon: '📊',
        screenshots: [],
        developer: {
            name: 'SetMyBizz Labs',
            support: 'support@setmybizz.in'
        },
        pricing: {
            model: 'freemium',
            free: true,
            tiers: [
                {
                    name: 'Free',
                    price: 0,
                    features: ['Basic metrics', '5 reports', 'Manual refresh'],
                    limits: { reports: 5 }
                },
                {
                    name: 'Pro',
                    price: 999,
                    features: ['Advanced metrics', 'Unlimited reports', 'Real-time', 'AI insights'],
                    limits: {}
                }
            ]
        },
        features: ['Real-time Metrics', 'Custom Reports', 'Predictive Analytics', 'AI Insights', 'Data Export'],
        integrations: ['all'],
        ratings: { average: 4.8, count: 2800 },
        installCount: 11000,
        permissions: ['analytics.read', 'data.read'],
        compatibility: {
            industries: ['ecommerce', 'saas', 'manufacturing', 'services', 'retail', 'food', 'education'],
            businessSizes: ['small', 'medium', 'large']
        },
        tags: ['analytics', 'reports', 'insights', 'ai', 'metrics'],
        lastUpdated: new Date('2024-02-06'),
        version: '3.2.0'
    }
];

// Helper functions
export function getAppsByCategory(category: string): MarketplaceApp[] {
    return MARKETPLACE_APPS.filter(app => app.category === category);
}

export function getAppsByIndustry(industry: IndustryType): MarketplaceApp[] {
    return MARKETPLACE_APPS.filter(app =>
        app.compatibility.industries.includes(industry)
    );
}

export function getAppsByBusinessSize(size: BusinessSize): MarketplaceApp[] {
    return MARKETPLACE_APPS.filter(app =>
        app.compatibility.businessSizes.includes(size)
    );
}

export function getFreeApps(): MarketplaceApp[] {
    return MARKETPLACE_APPS.filter(app => app.pricing.free);
}

export function getAppById(id: string): MarketplaceApp | undefined {
    return MARKETPLACE_APPS.find(app => app.id === id);
}

export function searchApps(query: string): MarketplaceApp[] {
    const lowercaseQuery = query.toLowerCase();
    return MARKETPLACE_APPS.filter(app =>
        app.name.toLowerCase().includes(lowercaseQuery) ||
        app.description.toLowerCase().includes(lowercaseQuery) ||
        app.tags.some(tag => tag.includes(lowercaseQuery))
    );
}
