/* ── LaunchPad Static Data ─────────────────────────────── */

export const SERVICES = [
    { id: 'logo', label: 'Logo', icon: 'palette', color: '#579bfc', desc: 'AI-generated brand identity' },
    { id: 'website', label: 'Website', icon: 'language', color: '#00c875', desc: 'Responsive landing page' },
    { id: 'store', label: 'Store', icon: 'storefront', color: '#ffcc00', desc: 'E-commerce storefront' },
    { id: 'gen-img', label: 'AI Image', icon: 'image', color: '#00d2d2', desc: 'Generate visual assets' },
    { id: 'social', label: 'Social', icon: 'campaign', color: '#e2445c', desc: 'Social media templates' },
    { id: 'tool', label: 'AI Tool', icon: 'smart_toy', color: '#9d94ff', desc: 'Custom automation tool' },
    { id: 'pitchdeck', label: 'Pitch Deck', icon: 'description', color: '#ff7b00', desc: 'Investor-ready deck' },
    { id: 'brochure', label: 'Brochure', icon: 'auto_stories', color: '#0073ea', desc: 'Digital brochure' },
    { id: 'brandkit', label: 'Brand Kit', icon: 'category', color: '#00c875', desc: 'Full branding guide' },
    { id: 'letter', label: 'Letterhead', icon: 'mail', color: '#579bfc', desc: 'Official letterhead' },
    { id: 'designer', label: 'Designer', icon: 'edit_square', color: '#ffcc00', desc: 'AI Design assistant' },
    { id: 'catalogue', label: 'Catalogue', icon: 'menu_book', color: '#e2445c', desc: 'Product catalogues' },
    { id: 'cards', label: 'Digital Card', icon: 'contact_page', color: '#9d94ff', desc: 'Digital business cards' },
];

export const LAUNCHER_CATEGORIES = [
    { id: 'voice', label: 'Arkle Voice', icon: 'graphic_eq', color: '#575CDE', gradient: 'from-[#575CDE] to-[#3B82F6]' },
    { id: 'logo', label: 'Logo', icon: 'palette', color: '#ec4899', gradient: 'from-pink-500 to-rose-500' },
    { id: 'website', label: 'Website', icon: 'language', color: '#3b82f6', gradient: 'from-blue-500 to-indigo-500' },
    { id: 'ecom', label: 'Ecom Store', icon: 'shopping_cart', color: '#f59e0b', gradient: 'from-amber-500 to-orange-500' },
    { id: 'landing', label: 'Landing Pages', icon: 'web', color: '#10b981', gradient: 'from-emerald-500 to-teal-500' },
    { id: 'webpages', label: 'Web Pages', icon: 'auto_awesome_motion', color: '#6366f1', gradient: 'from-indigo-500 to-purple-500' },
    { id: 'images', label: 'Images', icon: 'image', color: '#ef4444', gradient: 'from-red-500 to-rose-500' },
    { id: 'brochure', label: 'Brochure', icon: 'auto_stories', color: '#f97316', gradient: 'from-orange-500 to-red-500' },
    { id: 'deck', label: 'Pitch Deck', icon: 'monitoring', color: '#8b5cf6', gradient: 'from-violet-500 to-purple-500' },
    { id: 'social', label: 'Social Media', icon: 'share', color: '#0ea5e9', gradient: 'from-sky-500 to-blue-500' },
    { id: 'ads', label: 'Ads', icon: 'campaign', color: '#f43f5e', gradient: 'from-rose-500 to-pink-500' },
    { id: 'video', label: 'AI Video', icon: 'videocam', color: '#ef4444', gradient: 'from-red-500 to-orange-500' },
    { id: 'designs', label: 'Designs', icon: 'draw', color: '#a855f7', gradient: 'from-purple-500 to-indigo-500' },
    { id: 'seo', label: 'SEO & Data', icon: 'query_stats', color: '#10b981', gradient: 'from-emerald-500 to-teal-500' },
    { id: 'digital-card', label: 'Digital Card', icon: 'contact_page', color: '#8b5cf6', gradient: 'from-violet-500 to-indigo-500' },
    { id: 'brand-kit', label: 'Brand Kit', icon: 'category', color: '#10b981', gradient: 'from-emerald-500 to-green-500' },
    { id: 'letterhead', label: 'Letterhead', icon: 'mail', color: '#3b82f6', gradient: 'from-blue-500 to-sky-500' },
    { id: 'legal', label: 'Legal Docs', icon: 'gavel', color: '#64748b', gradient: 'from-slate-500 to-slate-700' },
    { id: 'automation', label: 'Workflows', icon: 'account_tree', color: '#6366f1', gradient: 'from-indigo-500 to-blue-500' },
    { id: 'catalogue', label: 'Catalogue', icon: 'menu_book', color: '#f43f5e', gradient: 'from-rose-500 to-pink-500' },
];

export const TOOL_CATEGORIES = [
    { id: 'crm', label: 'CRM Tools', icon: 'group', color: '#3b82f6', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'automation', label: 'Workflows', icon: 'account_tree', color: '#10b981', gradient: 'from-emerald-500 to-teal-500' },
    { id: 'dashboards', label: 'Dashboards', icon: 'monitoring', color: '#f59e0b', gradient: 'from-amber-500 to-yellow-500' },
    { id: 'ai-bots', label: 'AI Agents', icon: 'smart_toy', color: '#8b5cf6', gradient: 'from-violet-500 to-purple-500' },
    { id: 'finance', label: 'Finance Hub', icon: 'account_balance', color: '#ef4444', gradient: 'from-red-500 to-rose-500' },
    { id: 'forms', label: 'Smart Forms', icon: 'list_alt', color: '#6366f1', gradient: 'from-indigo-500 to-blue-500' },
];

export const TOOL_BLUEPRINTS = [
    {
        id: 'lead-hub',
        title: 'Lead Management Hub',
        desc: 'Track every lead from capture to close with automated follow-ups.',
        icon: 'hub',
        color: '#3b82f6',
        features: ['Automated CRM', 'Email Integration', 'Sales Pipeline'],
        gradient: 'from-blue-50 to-white'
    },
    {
        id: 'hr-portal',
        title: 'Smart HR Portal',
        desc: 'Manage onboarding, documents, and payroll in one central workspace.',
        icon: 'badge',
        color: '#10b981',
        features: ['Digital Onboarding', 'Leave Tracker', 'Payroll Hub'],
        gradient: 'from-emerald-50 to-white'
    },
    {
        id: 'revenue-dash',
        title: 'Revenue Dashboard',
        desc: 'Visual real-time insights into P&L, burn rate, and growth metrics.',
        icon: 'analytics',
        color: '#f59e0b',
        features: ['KPI Tracking', 'Burn Monitoring', 'Visual Reports'],
        gradient: 'from-amber-50 to-white'
    },
    {
        id: 'support-agent',
        title: 'AI Support Desk',
        desc: '24/7 automated agent that handles FAQs and customer support tickets.',
        icon: 'support_agent',
        color: '#8b5cf6',
        features: ['Arkle-Powered Chat', 'Knowledge Sync', 'Human Handoff'],
        gradient: 'from-violet-50 to-white'
    }
];

export const SOLUTION_IDEAS = [
    {
        title: 'Client Project Hub',
        category: 'Projects',
        image: '/images/templates/projects.png',
        prompt: 'Build a premium Client Project Hub for account managers to track deliverables, milestones, and client communication. I need a data-forward dashboard that highlights project health, upcoming deadlines, and real-time status updates for external stakeholders.',
        clr: '#579bfc'
    },
    {
        title: 'Sales Delivery Tracker',
        category: 'Sales',
        image: '/images/templates/crm.png',
        prompt: 'Create a Sales Delivery Tracker that coordinates seamless hand-offs from sales to operations. It should enable teams to manage onboarding tasks in a structured, audit-ready timeline interface with clear ownership and phase-based transitions.',
        clr: '#00c875'
    },
    {
        title: 'Strategy Execution Suite',
        category: 'Strategy',
        image: '/images/templates/projects.png', 
        prompt: 'Build a Strategy Execution Suite for executives to align project outcomes with company goals. I need a high-level KPI dashboard with risk indicators, financial summaries, and a "number-first" approach to tracking growth.',
        clr: '#9d94ff'
    },
    {
        title: 'Social Media Calendar',
        category: 'Marketing',
        image: '/images/templates/marketing.png',
        prompt: 'Design an omni-channel Social Media Calendar for content managers. It should support platform-specific grouping (LinkedIn, Instagram, etc.), status tracking (Draft/Scheduled/Published), and a color-coded grid layout with drag-and-drop capabilities.',
        clr: '#e2445c'
    },
    {
        title: 'Employee Onboarding Engine',
        category: 'HR',
        image: '/images/templates/hr.png',
        prompt: 'Create an automated Employee Onboarding Engine that guides new hires through documentation, training modules, and equipment requests. I want a progress-tracking view to ensure every hire has a consistent and high-quality start.',
        clr: '#00d2d2'
    },
    {
        title: 'Product Roadmap Planner',
        category: 'Development',
        image: '/images/templates/projects.png',
        prompt: 'Build a Product Roadmap Planner to visualize releases, feature requests, and engineering sprints. It should support Kanban and Gantt views with priority scoring and automated dependency tracking.',
        clr: '#ff7b00'
    },
    {
        title: 'Finance & Burn Monitor',
        category: 'Operations',
        image: '/images/templates/crm.png',
        prompt: 'Develop a Finance & Burn Monitor to track startup runway, MRR, and departmental spending. I need automated projections and alerts for budget variances to keep the business financially healthy.',
        clr: '#ffcc00'
    },
    {
        title: 'Customer Success Hub',
        category: 'Sales',
        image: '/images/templates/crm.png',
        prompt: 'Design a Customer Success Hub to track health scores, renewal dates, and expansion opportunities. Integrate it with a support ticket overview to provide a 360-degree view of every client account.',
        clr: '#0073ea'
    },
    {
        title: 'Campaign ROI Tracker',
        category: 'Marketing',
        image: '/images/templates/marketing.png',
        prompt: 'Build a Campaign ROI Tracker that aggregates data from multiple ad platforms. It should calculate CAC, LTV, and conversion rates automatically to optimize marketing spend in real-time.',
        clr: '#e2445c'
    },
];

export const DIGITAL_EMPLOYEES = [
    {
        id: 'sales',
        name: 'Arkle Sales Agent',
        role: 'Sales & Prospecting',
        icon: 'monetization_on',
        color: 'from-blue-600 to-indigo-600',
        desc: 'Finds leads, sends personalized emails, and books meetings autonomously.',
        capabilities: ['Lead Scraping', 'Email Outreach', 'Calendar Sync']
    },
    {
        id: 'support',
        name: 'Arkle Support Bot',
        role: 'Customer Success',
        icon: 'support_agent',
        color: 'from-emerald-500 to-teal-500',
        desc: 'Handles customer queries 24/7 across WhatsApp, Email, and Website.',
        capabilities: ['Instant Resolution', 'Order Tracking', 'Human Handoff']
    },
    {
        id: 'marketing',
        name: 'Arkle Content Agent',
        role: 'Marketing & Social',
        icon: 'auto_awesome',
        color: 'from-purple-600 to-pink-600',
        desc: 'Creates social media posts, schedules campaigns, and monitors brand mentions.',
        capabilities: ['Social Scheduling', 'Content Generation', 'Trend Analysis']
    }
];

export const ECOM_TEMPLATES = [
    { id: 't01', category: 'Health & Beauty', title: 'Organic Skincare', icon: 'spa', color: '#10b981', image: '/images/templates/skincare.png', desc: 'Premium layout for organic brands.' },
    { id: 't02', category: 'Grocery', title: 'Farm Fresh Veggies', icon: 'agriculture', color: '#84cc16', image: '/images/templates/farm.png', desc: 'Direct from farm to home delivery.' },
    { id: 't03', category: 'Fashion', title: 'Ethnic Saree Boutique', icon: 'checkroom', color: '#e11d48', image: '/images/templates/saree.png', desc: 'Elegant display for traditional wear.' },
    { id: 't04', category: 'Food', title: 'Artisan Pickles', icon: 'kitchen', color: '#ea580c', image: '/images/templates/pickle.png', desc: 'Spicy, local, and authentic layout.' },
    { id: 't05', category: 'Tech', title: 'Modern Electronics', icon: 'devices', color: '#3b82f6', image: '/images/templates/tech.png', desc: 'Sleek design for gadgets and tech.' },
    { id: 't06', category: 'Food', title: 'Local Bakery & Sweets', icon: 'cake', color: '#f59e0b', image: '/images/templates/bakery.png', desc: 'Warm and inviting bakery showcase.' },
];

export const WEB_TEMPLATES = [
    { 
        id: 'astra', 
        category: 'Creative Agency', 
        title: 'Astra Digital', 
        icon: 'change_history', 
        color: '#4f46e5', 
        image: '/images/templates/astra.png', 
        desc: 'A highly dynamic, premium dark-mode template for creative agencies with modern scroll animations.',
        path: '/templates/astra'
    },
    { 
        id: 'nova', 
        category: 'Tech SaaS', 
        title: 'Nova SaaS Hub', 
        icon: 'rocket_launch', 
        color: '#2563eb', 
        image: '/images/templates/nova.png', 
        desc: 'Clean, high-converting B2B SaaS landing page with built-in dashboard previews and pricing tiers.',
        path: '/templates/nova'
    },
    { 
        id: 'luxe', 
        category: 'Real Estate', 
        title: 'Luxe Properties', 
        icon: 'domain', 
        color: '#d97706', 
        image: '/images/templates/luxe.png', 
        desc: 'Sophisticated luxury real estate listings with full-screen property galleries and inquiry forms.',
        path: '/templates/luxe'
    }

];

export const ECOM_REAL_TEMPLATES = [
    { 
        id: 'aura', 
        category: 'Fashion & Apparel', 
        title: 'Aura Boutique', 
        icon: 'checkroom', 
        color: '#be185d', 
        image: '/images/templates/aura.png', 
        desc: 'A high-end, Lovable-style fashion e-commerce storefront with immersive product galleries and smooth cart animations.',
        path: '/templates/aura'
    },
    { 
        id: 'nature', 
        category: 'Organic Grocery', 
        title: 'Nature Basket', 
        icon: 'eco', 
        color: '#15803d', 
        image: '/images/templates/nature.png', 
        desc: 'A fresh, Shopify-grade organic store template optimized for quick add-to-cart actions and categorized product browsing.',
        path: '/templates/nature'
    },
    { 
        id: 'roots', 
        category: 'Ayurvedic Beauty', 
        title: 'Roots & Leaves', 
        icon: 'spa', 
        color: '#2d5a27', 
        image: 'http://localhost:3000/media__1777205786157.png', 
        desc: 'A complete, fully functional Ayurvedic wellness store featuring authentic herbal powders, oils, and premium skincare products.',
        path: '/templates/roots'
    }
];

export const LOGO_TEMPLATES = [
    { id: 'l01', category: 'Modern', title: 'Minimalist Vector', icon: 'pentagon', color: '#000000', desc: 'Clean, simple, and scalable logo for startups.' },
    { id: 'l02', category: 'Retail', title: 'Badge Style', icon: 'verified', color: '#b91c1c', desc: 'Classic circular badge logo for traditional businesses.' },
    { id: 'l03', category: 'Tech', title: 'Futuristic Glow', icon: 'rocket', color: '#3b82f6', desc: 'High-tech logo with glowing neon accents.' },
    { id: 'l04', category: 'Organic', title: 'Natural Leaf', icon: 'eco', color: '#10b981', desc: 'Eco-friendly branding for green businesses.' },
    { id: 'l05', category: 'Premium', title: 'Luxury Monogram', icon: 'token', color: '#78350f', desc: 'Sophisticated monogram for high-end brands.' },
    { id: 'l06', category: 'Playful', title: 'Mascot Character', icon: 'face', color: '#f59e0b', desc: 'Fun and friendly mascot logo for children or creative brands.' }
];
