import { Country, GlobalService, ServiceInfo } from '@/types/globalIncorporation';

export const COUNTRIES: Country[] = [
    {
        id: 'usa',
        name: 'United States',
        flag: '🇺🇸',
        currency: 'USD',
        language: 'English',
        gradient: 'from-blue-600 to-red-600'
    },
    {
        id: 'uk',
        name: 'United Kingdom',
        flag: '🇬🇧',
        currency: 'GBP',
        language: 'English',
        gradient: 'from-blue-800 to-red-700'
    },
    {
        id: 'uae',
        name: 'United Arab Emirates',
        flag: '🇦🇪',
        currency: 'AED',
        language: 'Arabic/English',
        gradient: 'from-green-600 to-red-600'
    },
    {
        id: 'australia',
        name: 'Australia',
        flag: '🇦🇺',
        currency: 'AUD',
        language: 'English',
        gradient: 'from-blue-600 to-yellow-500'
    },
    {
        id: 'singapore',
        name: 'Singapore',
        flag: '🇸🇬',
        currency: 'SGD',
        language: 'English',
        gradient: 'from-red-600 to-white'
    },
    {
        id: 'canada',
        name: 'Canada',
        flag: '🇨🇦',
        currency: 'CAD',
        language: 'English/French',
        gradient: 'from-red-600 to-red-700'
    },
    {
        id: 'germany',
        name: 'Germany',
        flag: '🇩🇪',
        currency: 'EUR',
        language: 'German',
        gradient: 'from-black to-red-600'
    },
    {
        id: 'other',
        name: 'Other Countries',
        flag: '🌐',
        currency: 'Various',
        language: 'Multiple',
        gradient: 'from-purple-600 to-pink-600'
    }
];

export const getServicesForCountry = (countryId: string): GlobalService[] => {
    const countryName = COUNTRIES.find(c => c.id === countryId)?.name || 'Global';

    return [
        {
            id: `${countryId}-incorporation`,
            type: 'incorporation',
            title: `${countryName} Incorporation`,
            description: `Register your business entity in ${countryName}`,
            icon: 'business',
            color: 'blue'
        },
        {
            id: `${countryId}-export`,
            type: 'export',
            title: `${countryName} Export`,
            description: `Export your products/services to ${countryName}`,
            icon: 'local_shipping',
            color: 'green'
        },
        {
            id: `${countryId}-market-access`,
            type: 'market_access',
            title: `${countryName} Market Access`,
            description: `Gain market entry and distribution in ${countryName}`,
            icon: 'storefront',
            color: 'purple'
        }
    ];
};

export const getServiceInfo = (countryId: string, serviceType: string): ServiceInfo => {
    const countryName = COUNTRIES.find(c => c.id === countryId)?.name || 'Global';

    const serviceInfoMap: Record<string, ServiceInfo> = {
        incorporation: {
            whatIs: `${countryName} Incorporation means registering a legal business entity in ${countryName}. This allows you to operate, sell, and conduct business legally in ${countryName} market with full compliance.`,
            eligibility: [
                'Indian registered companies (Pvt Ltd, LLP, or OPC)',
                'Startups with DPIIT recognition',
                'Businesses with export potential',
                'Service providers targeting international clients',
                'E-commerce businesses expanding globally'
            ],
            whoCanStart: [
                'Tech startups targeting global markets',
                'Export-oriented manufacturers',
                'Service providers (IT, Consulting, etc.)',
                'E-commerce brands',
                'Product companies with IP'
            ],
            benefits: [
                `Legal entity in ${countryName}`,
                'Access to local banking and payment systems',
                'Tax optimization opportunities',
                'Enhanced global credibility',
                'Easier access to international funding'
            ],
            timeline: '4-8 weeks',
            startingPrice: '₹1,50,000'
        },
        export: {
            whatIs: `${countryName} Export support includes documentation, compliance, logistics, and regulatory assistance to legally export your products/services to ${countryName}.`,
            eligibility: [
                'Registered Indian exporters (IEC holder)',
                'MSME certified businesses',
                'Manufacturers with export-ready products',
                'Service exporters (IT, Consulting)',
                'Businesses with necessary product certifications'
            ],
            whoCanStart: [
                'Product manufacturers',
                'Agricultural exporters',
                'Handicraft and textile businesses',
                'IT service providers',
                'Healthcare and pharma companies'
            ],
            benefits: [
                'Complete export documentation',
                'Customs clearance support',
                'Compliance with import regulations',
                'Logistics and shipping assistance',
                'Market entry strategy'
            ],
            timeline: '2-4 weeks',
            startingPrice: '₹50,000'
        },
        market_access: {
            whatIs: `${countryName} Market Access helps you establish distribution, partnerships, and sales channels in ${countryName} without full incorporation.`,
            eligibility: [
                'Indian businesses with proven product-market fit',
                'Startups with scalable business models',
                'Companies with export experience',
                'Brands ready for international expansion',
                'Businesses with competitive pricing'
            ],
            whoCanStart: [
                'SaaS and digital product companies',
                'Consumer goods brands',
                'B2B service providers',
                'E-commerce platforms',
                'Any business seeking market expansion'
            ],
            benefits: [
                'Market research and analysis',
                'Distribution partner connections',
                'Sales channel setup',
                'Marketing and branding support',
                'Regulatory guidance'
            ],
            timeline: '6-12 weeks',
            startingPrice: '₹75,000'
        }
    };

    return serviceInfoMap[serviceType] || serviceInfoMap.incorporation;
};

export const CHATBOT_QUESTIONS = [
    {
        id: 'businessName',
        question: 'What is your business name?',
        placeholder: 'Enter your business name',
        type: 'text',
        required: true
    },
    {
        id: 'productService',
        question: 'What product or service do you offer?',
        placeholder: 'Describe your offering',
        type: 'textarea',
        required: true
    },
    {
        id: 'industry',
        question: 'Which industry are you in?',
        type: 'select',
        options: [
            'Technology & IT',
            'Manufacturing',
            'E-commerce',
            'Healthcare',
            'Education',
            'Food & Beverage',
            'Fashion & Apparel',
            'Services',
            'Other'
        ],
        required: true
    },
    {
        id: 'launchTimeline',
        question: 'When do you plan to launch in the international market?',
        type: 'select',
        options: [
            'Immediate (0-3 months)',
            'Short-term (3-6 months)',
            'Mid-term (6-12 months)',
            'Long-term (12+ months)',
            'Just exploring'
        ],
        required: true
    },
    {
        id: 'businessSize',
        question: 'What is your current business size?',
        type: 'select',
        options: [
            'Solo Founder',
            'Small Team (2-10)',
            'Medium (11-50)',
            'Large (50+)',
            'Not yet started'
        ],
        required: true
    },
    {
        id: 'revenue',
        question: 'What is your current annual revenue? (Optional)',
        type: 'select',
        options: [
            'Not generating revenue yet',
            'Below ₹10 Lakhs',
            '₹10 Lakhs - ₹50 Lakhs',
            '₹50 Lakhs - ₹1 Crore',
            '₹1 Crore - ₹5 Crore',
            'Above ₹5 Crore'
        ],
        required: false
    }
];

export const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' }
];
