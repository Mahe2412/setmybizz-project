import { IndustryTemplate, IndustryType, WorkspaceTheme } from '@/types/workspace';

export const INDUSTRY_TEMPLATES: Record<IndustryType, IndustryTemplate> = {
    ecommerce: {
        industry: 'ecommerce',
        name: 'E-Commerce & Online Store',
        description: 'Complete toolkit for online retail businesses',
        defaultTools: [
            'whatsapp-business',
            'payment-gateway',
            'invoice-generator',
            'inventory-management',
            'social-media-manager',
            'email-marketing',
            'google-analytics',
            'customer-support'
        ],
        defaultWidgets: [
            'sales-dashboard',
            'order-management',
            'inventory-tracker',
            'whatsapp-chat',
            'payment-summary',
            'marketing-analytics',
            'customer-feedback'
        ],
        theme: {
            primaryColor: '#7C3AED', // Purple
            secondaryColor: '#EC4899', // Pink
            accentColor: '#F59E0B', // Amber
            icons: {
                store: '🛍️',
                orders: '📦',
                payments: '💳',
                inventory: '📊',
                customers: '👥',
                marketing: '📢',
                analytics: '📈'
            },
            layout: 'ecommerce'
        },
        workflows: [
            'order-processing',
            'inventory-sync',
            'customer-followup',
            'abandoned-cart-recovery',
            'review-requests'
        ]
    },

    pharma: {
        industry: 'pharma',
        name: 'Pharmaceutical & Healthcare',
        description: 'Compliance-ready tools for pharma businesses',
        defaultTools: [
            'inventory-erp',
            'compliance-tracker',
            'invoice-generator',
            'customer-crm',
            'whatsapp-business',
            'document-management',
            'reporting-analytics',
            'supplier-management'
        ],
        defaultWidgets: [
            'inventory-status',
            'compliance-alerts',
            'sales-pipeline',
            'stock-expiry-tracker',
            'vendor-management',
            'financial-reports',
            'regulatory-dashboard'
        ],
        theme: {
            primaryColor: '#0EA5E9', // Sky Blue
            secondaryColor: '#10B981', // Green
            accentColor: '#3B82F6', // Blue
            icons: {
                inventory: '💊',
                compliance: '✅',
                sales: '📋',
                reports: '📊',
                alerts: '⚠️',
                suppliers: '🏭',
                quality: '🔬'
            },
            layout: 'pharma'
        },
        workflows: [
            'batch-tracking',
            'expiry-alerts',
            'compliance-reporting',
            'order-fulfillment',
            'quality-control'
        ]
    },

    saas: {
        industry: 'saas',
        name: 'SaaS & Software',
        description: 'Growth tools for software companies',
        defaultTools: [
            'crm-system',
            'email-automation',
            'analytics-dashboard',
            'customer-support',
            'payment-gateway',
            'marketing-automation',
            'project-management',
            'team-collaboration'
        ],
        defaultWidgets: [
            'mrr-dashboard',
            'customer-acquisition',
            'churn-analysis',
            'support-tickets',
            'product-analytics',
            'sales-pipeline',
            'team-activity'
        ],
        theme: {
            primaryColor: '#8B5CF6', // Violet
            secondaryColor: '#06B6D4', // Cyan
            accentColor: '#F97316', // Orange
            icons: {
                revenue: '💰',
                users: '👥',
                analytics: '📊',
                support: '💬',
                growth: '📈',
                product: '🚀',
                team: '👨‍💼'
            },
            layout: 'saas'
        },
        workflows: [
            'lead-nurturing',
            'trial-conversion',
            'customer-onboarding',
            'support-escalation',
            'churn-prevention'
        ]
    },

    manufacturing: {
        industry: 'manufacturing',
        name: 'Manufacturing & Production',
        description: 'End-to-end manufacturing management',
        defaultTools: [
            'production-erp',
            'inventory-management',
            'supply-chain',
            'quality-control',
            'maintenance-tracker',
            'procurement-system',
            'warehouse-management',
            'reporting-analytics'
        ],
        defaultWidgets: [
            'production-dashboard',
            'inventory-levels',
            'quality-metrics',
            'machine-status',
            'order-tracking',
            'supplier-performance',
            'cost-analysis'
        ],
        theme: {
            primaryColor: '#EF4444', // Red
            secondaryColor: '#F59E0B', // Amber
            accentColor: '#14B8A6', // Teal
            icons: {
                production: '🏭',
                inventory: '📦',
                quality: '✅',
                machines: '⚙️',
                orders: '📋',
                suppliers: '🚚',
                costs: '💵'
            },
            layout: 'default'
        },
        workflows: [
            'production-planning',
            'quality-inspection',
            'maintenance-scheduling',
            'procurement-automation',
            'inventory-optimization'
        ]
    },

    retail: {
        industry: 'retail',
        name: 'Retail & Physical Store',
        description: 'Point of sale and retail management',
        defaultTools: [
            'pos-system',
            'inventory-management',
            'customer-loyalty',
            'payment-gateway',
            'billing-invoicing',
            'supplier-management',
            'staff-scheduling',
            'sales-analytics'
        ],
        defaultWidgets: [
            'daily-sales',
            'inventory-alerts',
            'customer-insights',
            'staff-roster',
            'payment-reconciliation',
            'top-products',
            'foot-traffic'
        ],
        theme: {
            primaryColor: '#EC4899', // Pink
            secondaryColor: '#8B5CF6', // Purple
            accentColor: '#F59E0B', // Amber
            icons: {
                sales: '🛒',
                inventory: '📦',
                customers: '👥',
                staff: '👨‍💼',
                payments: '💳',
                analytics: '📊',
                store: '🏪'
            },
            layout: 'default'
        },
        workflows: [
            'daily-reconciliation',
            'inventory-reorder',
            'customer-rewards',
            'staff-management',
            'sales-reporting'
        ]
    },

    services: {
        industry: 'services',
        name: 'Professional Services',
        description: 'Client and project management for service businesses',
        defaultTools: [
            'client-crm',
            'project-management',
            'time-tracking',
            'invoicing-billing',
            'document-management',
            'calendar-scheduling',
            'email-automation',
            'reporting-analytics'
        ],
        defaultWidgets: [
            'client-dashboard',
            'project-timeline',
            'billable-hours',
            'revenue-tracker',
            'task-management',
            'calendar-view',
            'team-capacity'
        ],
        theme: {
            primaryColor: '#3B82F6', // Blue
            secondaryColor: '#10B981', // Green
            accentColor: '#F59E0B', // Amber
            icons: {
                clients: '👥',
                projects: '📁',
                time: '⏰',
                invoices: '💵',
                documents: '📄',
                calendar: '📅',
                team: '👨‍💼'
            },
            layout: 'default'
        },
        workflows: [
            'client-onboarding',
            'project-delivery',
            'time-billing',
            'invoice-automation',
            'client-reporting'
        ]
    },

    food: {
        industry: 'food',
        name: 'Food & Beverage',
        description: 'Restaurant and food business management',
        defaultTools: [
            'pos-system',
            'inventory-management',
            'online-ordering',
            'delivery-management',
            'kitchen-display',
            'table-reservation',
            'supplier-management',
            'menu-management'
        ],
        defaultWidgets: [
            'order-dashboard',
            'inventory-alerts',
            'revenue-summary',
            'delivery-tracking',
            'table-status',
            'kitchen-queue',
            'customer-reviews'
        ],
        theme: {
            primaryColor: '#F97316', // Orange
            secondaryColor: '#EF4444', // Red
            accentColor: '#FBBF24', // Yellow
            icons: {
                orders: '🍽️',
                inventory: '📦',
                revenue: '💰',
                delivery: '🚚',
                tables: '🪑',
                kitchen: '👨‍🍳',
                reviews: '⭐'
            },
            layout: 'default'
        },
        workflows: [
            'order-processing',
            'kitchen-workflow',
            'delivery-dispatch',
            'inventory-restock',
            'customer-feedback'
        ]
    },

    education: {
        industry: 'education',
        name: 'Education & Training',
        description: 'Learning management and student administration',
        defaultTools: [
            'student-management',
            'course-platform',
            'attendance-tracking',
            'fee-management',
            'communication-portal',
            'assignment-grading',
            'parent-portal',
            'reporting-analytics'
        ],
        defaultWidgets: [
            'student-dashboard',
            'attendance-summary',
            'fee-collection',
            'course-progress',
            'announcements',
            'exam-schedule',
            'performance-metrics'
        ],
        theme: {
            primaryColor: '#8B5CF6', // Purple
            secondaryColor: '#3B82F6', // Blue
            accentColor: '#10B981', // Green
            icons: {
                students: '👨‍🎓',
                courses: '📚',
                attendance: '✅',
                fees: '💰',
                exams: '📝',
                reports: '📊',
                communication: '📧'
            },
            layout: 'default'
        },
        workflows: [
            'student-enrollment',
            'attendance-marking',
            'fee-collection',
            'exam-management',
            'result-publication'
        ]
    },

    healthcare: {
        industry: 'healthcare',
        name: 'Healthcare & Medical',
        description: 'Patient management and medical practice tools',
        defaultTools: [
            'patient-management',
            'appointment-scheduling',
            'electronic-records',
            'billing-insurance',
            'prescription-management',
            'inventory-pharmacy',
            'lab-integration',
            'telemedicine'
        ],
        defaultWidgets: [
            'appointment-calendar',
            'patient-queue',
            'billing-summary',
            'prescription-tracker',
            'inventory-alerts',
            'lab-results',
            'teleconsult-status'
        ],
        theme: {
            primaryColor: '#0EA5E9', // Sky
            secondaryColor: '#10B981', // Green
            accentColor: '#3B82F6', // Blue
            icons: {
                patients: '🏥',
                appointments: '📅',
                records: '📋',
                billing: '💵',
                prescriptions: '💊',
                lab: '🔬',
                telemedicine: '💻'
            },
            layout: 'default'
        },
        workflows: [
            'patient-registration',
            'appointment-booking',
            'consultation-workflow',
            'prescription-dispensing',
            'billing-insurance'
        ]
    },

    finance: {
        industry: 'finance',
        name: 'Financial Services',
        description: 'Client and investment management',
        defaultTools: [
            'client-crm',
            'portfolio-management',
            'document-vault',
            'compliance-tracker',
            'reporting-analytics',
            'communication-portal',
            'task-workflow',
            'payment-collection'
        ],
        defaultWidgets: [
            'client-dashboard',
            'portfolio-performance',
            'compliance-status',
            'revenue-tracker',
            'pending-tasks',
            'document-status',
            'market-insights'
        ],
        theme: {
            primaryColor: '#059669', // Emerald
            secondaryColor: '#0EA5E9', // Sky
            accentColor: '#F59E0B', // Amber
            icons: {
                clients: '👥',
                portfolio: '📊',
                compliance: '✅',
                revenue: '💰',
                tasks: '📋',
                documents: '📄',
                market: '📈'
            },
            layout: 'default'
        },
        workflows: [
            'client-onboarding',
            'kyc-verification',
            'portfolio-review',
            'compliance-reporting',
            'client-communication'
        ]
    },

    'real-estate': {
        industry: 'real-estate',
        name: 'Real Estate',
        description: 'Property and client management',
        defaultTools: [
            'property-management',
            'lead-crm',
            'document-management',
            'virtual-tours',
            'booking-payments',
            'maintenance-tracker',
            'tenant-portal',
            'marketing-automation'
        ],
        defaultWidgets: [
            'property-listings',
            'lead-pipeline',
            'booking-status',
            'revenue-tracker',
            'maintenance-requests',
            'tenant-communications',
            'market-analytics'
        ],
        theme: {
            primaryColor: '#0EA5E9', // Sky
            secondaryColor: '#8B5CF6', // Purple
            accentColor: '#F59E0B', // Amber
            icons: {
                properties: '🏢',
                leads: '👥',
                bookings: '📅',
                revenue: '💰',
                maintenance: '🔧',
                tenants: '👨‍👩‍👧',
                analytics: '📊'
            },
            layout: 'default'
        },
        workflows: [
            'lead-qualification',
            'property-viewing',
            'booking-process',
            'tenant-onboarding',
            'maintenance-management'
        ]
    },

    other: {
        industry: 'other',
        name: 'General Business',
        description: 'Flexible tools for any business',
        defaultTools: [
            'crm-system',
            'task-management',
            'document-storage',
            'email-integration',
            'calendar-scheduling',
            'invoicing-billing',
            'reporting-basic',
            'team-collaboration'
        ],
        defaultWidgets: [
            'business-dashboard',
            'task-list',
            'calendar-view',
            'revenue-summary',
            'team-activity',
            'recent-documents',
            'notifications'
        ],
        theme: {
            primaryColor: '#6366F1', // Indigo
            secondaryColor: '#8B5CF6', // Purple
            accentColor: '#F59E0B', // Amber
            icons: {
                business: '💼',
                tasks: '✅',
                calendar: '📅',
                revenue: '💰',
                team: '👥',
                documents: '📄',
                notifications: '🔔'
            },
            layout: 'default'
        },
        workflows: [
            'task-management',
            'client-communication',
            'invoice-generation',
            'team-collaboration',
            'basic-reporting'
        ]
    }
};

// Get theme for industry
export function getIndustryTheme(industry: IndustryType): WorkspaceTheme {
    const template = INDUSTRY_TEMPLATES[industry];
    return {
        industry,
        primaryColor: template.theme.primaryColor || '#6366F1',
        secondaryColor: template.theme.secondaryColor || '#8B5CF6',
        accentColor: template.theme.accentColor || '#F59E0B',
        icons: template.theme.icons || {},
        widgets: template.defaultWidgets,
        layout: template.theme.layout || 'default'
    };
}

// Get default tools for industry
export function getIndustryTools(industry: IndustryType): string[] {
    return INDUSTRY_TEMPLATES[industry]?.defaultTools || [];
}

// Get default widgets for industry
export function getIndustryWidgets(industry: IndustryType): string[] {
    return INDUSTRY_TEMPLATES[industry]?.defaultWidgets || [];
}
