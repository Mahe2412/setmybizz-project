/* ── Service Registry ─────────────────────────────────── */
export const SERVICES = [
    { id: 'logo',      label: 'Logo',        icon: 'palette',     color: '#579bfc', desc: 'AI-generated brand identity' },
    { id: 'website',   label: 'Website',     icon: 'language',    color: '#00c875', desc: 'Responsive landing page' },
    { id: 'store',     label: 'Store',       icon: 'storefront',  color: '#ffcc00', desc: 'E-commerce storefront' },
    { id: 'gen-img',   label: 'AI Image',    icon: 'image',       color: '#00d2d2', desc: 'Generate visual assets' },
    { id: 'social',    label: 'Social',      icon: 'campaign',    color: '#e2445c', desc: 'Social media templates' },
    { id: 'tool',      label: 'AI Tool',     icon: 'smart_toy',   color: '#9d94ff', desc: 'Custom automation tool' },
    { id: 'pitchdeck', label: 'Pitch Deck',  icon: 'description', color: '#ff7b00', desc: 'Investor-ready deck' },
    { id: 'brochure',  label: 'Brochure',    icon: 'auto_stories',color: '#0073ea', desc: 'Digital brochure' },
    { id: 'brandkit',  label: 'Brand Kit',   icon: 'category',    color: '#00c875', desc: 'Full branding guide' },
    { id: 'letter',    label: 'Letterhead',  icon: 'mail',        color: '#579bfc', desc: 'Official letterhead' },
    { id: 'designer',  label: 'Designer',    icon: 'edit_square', color: '#ffcc00', desc: 'AI Design assistant' },
    { id: 'catalogue', label: 'Catalogue',   icon: 'menu_book',   color: '#e2445c', desc: 'Product catalogues' },
    { id: 'cards',     label: 'Digital Card',icon: 'contact_page',color: '#9d94ff', desc: 'Digital business cards' },
];

/* ── Solutions Ideas ─────────────────────────────────── */
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

/* ── AI Digital Employees Data ─────────────────────────── */
export const DIGITAL_EMPLOYEES = [
    { id: 'marketing', title: 'Marketing Head', role: 'Growth', desc: 'Creates ad campaigns, plans SEO, and drives market positioning.', icon: 'insights', clr: '#ff7b00', status: 'Available' },
    { id: 'social', title: 'Social Media Expert', role: 'Engagement', desc: 'Writes, schedules, and analyzes viral posts across platforms.', icon: 'campaign', clr: '#e2445c', status: 'Available' },
    { id: 'sales', title: 'Sales Executive', role: 'Revenue', desc: 'Handles outbound emails, lead qualification, and deal closing.', icon: 'trending_up', clr: '#00c875', status: 'Available' },
    { id: 'crm', title: 'Account Manager', role: 'Retention', desc: 'Manages client follow-ups, retention, and seamless onboarding.', icon: 'group', clr: '#579bfc', status: 'Available' },
    { id: 'designer', title: 'Creative Designer', role: 'Brand', desc: 'Generates brand kits, logos, brochures, and interface designs.', icon: 'palette', clr: '#9d94ff', status: 'Available' },
    { id: 'finance', title: 'Finance Advisor', role: 'Tax & P&L', desc: 'Tracks expenses, monitors runway, and plans tax strategies.', icon: 'account_balance', clr: '#ffcc00', status: 'Available' },
    { id: 'legal', title: 'Legal Assistant', role: 'Compliance', desc: 'Drafts contracts, term sheets, and ensures corporate compliance.', icon: 'gavel', clr: '#323338', status: 'Available' },
    { id: 'overseer', title: 'Business Manager', role: 'Operations', desc: 'Deploys apps, builds websites, and manages Arkle services on autopilot.', icon: 'rocket_launch', clr: '#0073ea', status: 'Available' },
];

/* ── Co-Founder Discovery & Strategy Flow ──────────────── */
export const DISCUSSION_FLOW = [
    {
        key: 'language',
        q: "In which language should we build your empire?",
        type: 'choice',
        options: [
            { id: 'en-IN', label: 'English', icon: 'language_us_ce', desc: 'Standard business English' },
            { id: 'te-IN', label: 'తెలుగు (Telugu)', icon: 'language_pinyin', desc: 'మీ మాతృభాషలో చర్చించండి' },
            { id: 'hi-IN', label: 'हिन्दी (Hindi)', icon: 'translate', desc: 'राष्ट्रभाषा में संवाद करें' },
        ]
    },
    { 
        key: 'businessName', 
        q: "What's the name of your venture?", 
        type: 'text',
        placeholder: "e.g., Organic Oasis (Or say 'help me name it')"
    },
    { 
        key: 'idea', 
        q: "Describe your core idea in a few words.", 
        type: 'text',
        placeholder: "e.g., A farm-to-table organic delivery app..."
    },
    { 
        key: 'commitment', 
        q: "What's your level of commitment?", 
        type: 'choice',
        options: [
            { id: 'fulltime', label: 'Full-Time Founder', icon: 'person_filled', desc: '100% focused on this' },
            { id: 'sidehustle', label: 'Side Hustle', icon: 'work_history', desc: 'Working part-time currently' },
            { id: 'student', label: 'Student Project', icon: 'school', desc: 'Building as a student' },
        ]
    },
    { 
        key: 'stage', 
        q: "What's your current business stage?", 
        type: 'choice',
        options: [
            { id: 'idea', label: 'Idea Phase', icon: 'lightbulb', desc: 'Just a vision currently' },
            { id: 'mvp', label: 'MVP Stage', icon: 'deployed_code', desc: 'Building prototype' },
            { id: 'launched', label: 'Launched', icon: 'rocket_launch', desc: 'Live with customers' },
            { id: 'scaling', label: 'Scaling', icon: 'trending_up', desc: 'Focused on growth' },
        ]
    },
    { 
        key: 'audience', 
        q: "Who are your target customers?", 
        type: 'choice',
        options: [
            { id: 'b2c', label: 'Consumer (B2C)', icon: 'person_search', desc: 'Regular individuals' },
            { id: 'b2b', label: 'Business (B2B)', icon: 'apartment', desc: 'Other companies/startups' },
            { id: 'enterprise', label: 'Enterprise', icon: 'account_balance', desc: 'Large corporations' },
            { id: 'micro', label: 'Local Community', icon: 'location_on', desc: 'Specific neighborhood' },
        ]
    },
    { 
        key: 'model', 
        q: "How will you make money?", 
        type: 'choice',
        options: [
            { id: 'sub', label: 'Subscription', icon: 'rebase', desc: 'Monthly/Yearly recurring' },
            { id: 'once', label: 'One-time Sale', icon: 'shopping_cart', desc: 'Direct product purchase' },
            { id: 'comm', label: 'Commission', icon: 'percent', desc: 'Fees from transactions' },
            { id: 'freemium', label: 'Freemium', icon: 'card_giftcard', desc: 'Basic free, Pro upgrade' },
        ]
    },
    { 
        key: 'usp', 
        q: "What's your Unique Selling Point (USP)?", 
        type: 'choice',
        options: [
            { id: 'price', label: 'Lowest Price', icon: 'sell', desc: 'Best value for money' },
            { id: 'speed', label: 'Fastest Delivery', icon: 'bolt', desc: 'Speed is our soul' },
            { id: 'premium', label: 'Premium Quality', icon: 'verified', desc: 'Luxury & high standards' },
            { id: 'innovation', label: 'Unique Solution', icon: 'emergency_heat', desc: 'First of its kind' },
        ]
    },
    { 
        key: 'industry', 
        q: "Which industry are we Disrupting?", 
        type: 'choice',
        options: [
            { id: 'tech', label: 'Technology', icon: 'memory', desc: 'AI, Software, Hardware' },
            { id: 'organic', label: 'Organic/Healthy', icon: 'nature', desc: 'Wellness, Food, Eco' },
            { id: 'retail', label: 'Retail/D2C', icon: 'shopping_bag', desc: 'Consumer brands' },
            { id: 'finance', label: 'FinTech', icon: 'payments', desc: 'Banking, Crypto, Tax' },
            { id: 'pharma', label: 'Healthcare/Pharma', icon: 'vaccines', desc: 'Medical & Wellness' },
        ]
    },
    { 
        key: 'designTaste', 
        q: "Pick your brand's aesthetic vibe.", 
        type: 'choice',
        options: [
            { id: 'minimal', label: 'Sleek Minimal', icon: 'ink_eraser', desc: 'Apple-style clean' },
            { id: 'tech', label: 'High-Tech Dark', icon: 'dark_mode', desc: 'Futuristic dynamic' },
            { id: 'creative', label: 'Playful/Vibrant', icon: 'palette', desc: 'Friendly & colorful' },
            { id: 'corporate', label: 'Trust & Elite', icon: 'business_center', desc: 'Authority & scale' },
        ]
    },
];

export const QUICK_MESSAGES = [
    "Suggest color palette", "Marketing gaps?", "Competitor analysis", "Suggest taglines"
];

export const BRAND_TEMPLATES: Record<string, any> = {
    'organic': { colors: ['#2d5a27', '#f4fff1', '#88a07c'], fonts: 'Outfit, Playfair Display', vibe: 'Natural & Trustworthy' },
    'tech': { colors: ['#0073ea', '#f4f7fe', '#1c1f3b'], fonts: 'Inter, Roboto', vibe: 'Modern & Dynamic' },
    'minimal': { colors: ['#000000', '#ffffff', '#676879'], fonts: 'Montserrat, Helvetica', vibe: 'Clean & Elite' },
    'creative': { colors: ['#ff7b00', '#fff0e5', '#ff3d00'], fonts: 'Poppins, Fredoka', vibe: 'Playful & Vibrant' },
};

/* ── Solutions Question Flow ──────────────────────────── */
export const SOLUTIONS_FLOW = [
    { key: 'problem',    q: "What specific problem or bottleneck are you facing in your business right now?" },
    { key: 'goal',       q: "What's the ideal outcome? What would solving this look like?" },
    { key: 'current',    q: "What tools or processes are you currently using to handle this?" },
    { key: 'gaps',       q: "Where are the biggest gaps or frustrations with your current approach?" },
    { key: 'build',      q: "Got it. Based on everything you've told me, here's what I recommend building:" },
];
