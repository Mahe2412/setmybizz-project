export type ServiceTier = {
    name: string;
    price: string;
    priceNote?: string;
    features: string[];
    cta: string;
    highlight?: boolean;
};

export type Service = {
    slug: string;
    category: 'setup' | 'launch' | 'scale' | 'global';
    icon: string;
    title: string;
    shortDesc: string;
    fullDesc: string;
    includes: string[];
    aiCapability: string;
    tiers: ServiceTier[];
    faq: { q: string; a: string }[];
    seoKeywords: string[];
    timelineNote: string;
};

export const SERVICES: Service[] = [
    // ── SETUP ──
    {
        slug: 'company-registration',
        category: 'setup',
        icon: '🏢',
        title: 'Company Registration',
        shortDesc: 'Register Pvt Ltd, LLP, OPC, or Partnership in 7 days.',
        fullDesc: 'Incorporate your business with full MCA compliance. Our AI pre-validates all documents before filing — reducing rejection rates to near zero. Includes DIN, DSC, MoA, AoA, and Certificate of Incorporation.',
        includes: ['DIN for up to 2 directors', 'DSC (Digital Signatures)', 'Name reservation & approval', 'MoA & AoA drafting', 'Certificate of Incorporation', 'Company PAN & TAN', 'Bank account intro'],
        aiCapability: 'AI pre-validates all documents, checks name availability, and auto-drafts MoA/AoA based on your business type.',
        tiers: [
            { name: 'Free', price: '₹0', priceNote: 'AI consultation only', features: ['AI business type recommendation', 'Name availability check', 'Cost estimate', 'Government fee calculator'], cta: 'Start Free Consultation' },
            { name: 'Premium', price: '₹8,999', features: ['Everything in Free', 'Full Pvt Ltd / LLP / OPC registration', 'DIN + DSC for 2 directors', 'MoA & AoA drafting', 'Certificate of Incorporation', 'Company PAN & TAN', '1 yr compliance reminder'], cta: 'Register Now', highlight: true },
            { name: 'Ultra', price: '₹16,999', features: ['Everything in Premium', 'GST registration included', 'MSME registration', 'Startup India recognition', 'Dedicated CA manager', 'Bank account opening help', '2 yr compliance support'], cta: 'Get Full Package' },
        ],
        faq: [
            { q: 'How long does Pvt Ltd registration take?', a: '5–7 working days with MCA. Our AI pre-validation reduces rejections, so we rarely face delays.' },
            { q: 'Can I register with just 1 person?', a: 'Yes! OPC (One Person Company) is designed for solo founders. We\'ll recommend the best structure for your situation.' },
        ],
        seoKeywords: ['private limited company registration', 'pvt ltd registration online india', 'company incorporation india'],
        timelineNote: '5–7 working days',
    },
    {
        slug: 'gst-registration',
        category: 'setup',
        icon: '📋',
        title: 'GST Registration',
        shortDesc: 'Get your GSTIN in 3–5 days. Mandatory above ₹40L turnover.',
        fullDesc: 'GST registration made simple. Our AI fills the application, verifies your documents, and submits to GST portal. Get your 15-digit GSTIN without government portal headaches.',
        includes: ['GST application filing', 'Document verification & upload', 'GSTIN generation', 'ARN tracking', 'GST certificate download', 'HSN code advisory'],
        aiCapability: 'AI auto-fills GST form based on your business type, maps your products/services to correct HSN codes.',
        tiers: [
            { name: 'Free', price: '₹0', priceNote: 'Self-service guide', features: ['Step-by-step DIY guide', 'Document checklist', 'HSN code finder', 'Threshold calculator'], cta: 'Get Free Guide' },
            { name: 'Premium', price: '₹1,499', features: ['Assisted GST registration', 'Document preparation', 'Portal submission', 'GSTIN in 3–5 days', 'GST certificate'], cta: 'Register GST', highlight: true },
            { name: 'Ultra', price: '₹3,999', features: ['GST Registration', '3 months GST filing (GSTR-1 + 3B)', 'Monthly reconciliation', 'Input tax credit advisory', 'Dedicated GST expert'], cta: 'GST Full Package' },
        ],
        faq: [
            { q: 'Is GST registration mandatory?', a: 'Mandatory if annual turnover exceeds ₹40L (₹20L for services, ₹10L for NE states). Also mandatory for e-commerce sellers regardless of turnover.' },
            { q: 'How quickly can I get my GSTIN?', a: '3–5 working days from document submission. Aadhaar-based verification can speed this up to 1 day.' },
        ],
        seoKeywords: ['gst registration online india', 'gstin apply online', 'gst number registration'],
        timelineNote: '3–5 working days',
    },
    {
        slug: 'msme-registration',
        category: 'setup',
        icon: '🏭',
        title: 'MSME / Udyam Registration',
        shortDesc: 'Get Udyam certificate and unlock government benefits & subsidies.',
        fullDesc: 'Register as Micro, Small, or Medium Enterprise on the Udyam portal. Unlock priority lending, government tenders, subsidized schemes, and legal protections.',
        includes: ['Udyam registration filing', 'NIC code classification', 'Udyam certificate', 'Government scheme eligibility report', 'Priority sector lending advisory'],
        aiCapability: 'AI classifies your business under correct NIC code, identifies applicable government schemes worth lakhs in subsidies.',
        tiers: [
            { name: 'Free', price: '₹0', features: ['DIY Udyam guide', 'Scheme eligibility check', 'NIC code finder'], cta: 'Check Eligibility' },
            { name: 'Premium', price: '₹999', features: ['Assisted Udyam filing', 'Udyam certificate', 'Scheme report (10+ schemes)', 'Bank priority letter'], cta: 'Register MSME', highlight: true },
            { name: 'Ultra', price: '₹2,499', features: ['MSME + Startup India', 'Scheme application support', 'SIDBI loan guidance', 'TReDS onboarding'], cta: 'Full MSME Package' },
        ],
        faq: [
            { q: 'What benefits does MSME registration give?', a: 'Priority bank lending at lower rates, government tender quotas, protection against delayed payments, tax exemptions, and access to 50+ government schemes.' },
        ],
        seoKeywords: ['msme registration udyam', 'udyam certificate online', 'msme benefits india'],
        timelineNote: '1–2 working days',
    },
    {
        slug: 'project-report',
        category: 'setup',
        icon: '📊',
        title: 'Project Report / DPR',
        shortDesc: 'AI-generated bank-ready project report for loans and funding.',
        fullDesc: 'Get a professional Detailed Project Report (DPR) built by our AI based on your business details. Used for bank loans, MSME schemes, government grants, and investor fundraising. Accepted by all major Indian banks.',
        includes: ['Executive summary', 'Market analysis', 'Financial projections (5 years)', 'Break-even analysis', 'Loan repayment schedule', 'Risk assessment', 'Bank-ready PDF/Word format'],
        aiCapability: 'AI builds your complete project report from 10 questions about your business. Generates financial models, market data, and projections automatically.',
        tiers: [
            { name: 'Free', price: '₹0', priceNote: 'Basic report only', features: ['1-page AI business summary', 'Rough cost estimate', 'Loan eligibility check', 'Bank list recommendation'], cta: 'Get Free Summary' },
            { name: 'Premium', price: '₹2,999', features: ['Full 20–30 page DPR', '5-year financial projection', 'Break-even analysis', 'Market research section', 'Bank-ready PDF', '1 revision'], cta: 'Build My Report', highlight: true },
            { name: 'Ultra', price: '₹5,999', features: ['Premium DPR', 'CA-certified financials', 'SWOT & competitor analysis', 'Investor pitch deck', 'Loan application support', '3 revisions', 'Bank submission help'], cta: 'CA-Certified Report' },
        ],
        faq: [
            { q: 'Will banks accept this project report?', a: 'Yes. Our format is accepted by SBI, HDFC, ICICI, Axis, Union Bank, and all PSU banks. We include all mandatory sections required by Indian banks.' },
            { q: 'How does the AI build my report?', a: 'You answer 10 questions about your business, investment, and revenue plans. Our AI generates the full financial model with market data for your industry in real-time.' },
        ],
        seoKeywords: ['project report for bank loan', 'dpr detailed project report india', 'project report msme loan', 'project report visakhapatnam'],
        timelineNote: '24–48 hours',
    },
    {
        slug: 'business-bank-account',
        category: 'setup',
        icon: '🏦',
        title: 'Business Bank Account',
        shortDesc: 'Open a current account with HDFC, ICICI, or Axis — fully online.',
        fullDesc: 'Skip the branch visits. Open your business current account digitally. We pre-fill the application and directly coordinate with the bank on your behalf.',
        includes: ['Bank selection advisory', 'Application pre-filling', 'Document checklist', 'Bank coordination', 'Account opening confirmation', 'Net banking setup guide'],
        aiCapability: 'AI recommends the best bank based on your business type, transaction volume, and location.',
        tiers: [
            { name: 'Free', price: '₹0', features: ['Bank comparison tool', 'Document checklist', 'DIY guide'], cta: 'Compare Banks' },
            { name: 'Premium', price: '₹999', features: ['Assisted account opening', 'Bank coordination', 'Fastest processing', 'Account in 5–7 days'], cta: 'Open Account', highlight: true },
        ],
        faq: [
            { q: 'Which banks do you work with?', a: 'HDFC, ICICI, Axis, Kotak, Yes Bank, and RBL Bank for current accounts. We recommend based on your business location and needs.' },
        ],
        seoKeywords: ['business current account online india', 'open business bank account online', 'current account for startup india'],
        timelineNote: '5–7 working days',
    },
    // ── LAUNCH ──
    {
        slug: 'trademark-registration',
        category: 'launch',
        icon: '™️',
        title: 'Trademark Registration',
        shortDesc: 'Protect your brand name, logo & slogan across all 45 classes.',
        fullDesc: 'Register your trademark with the IP India office. Our AI conducts a prior-art search across 3 crore+ marks before filing, minimizing opposition risk. Protect your brand in India and globally.',
        includes: ['AI prior-art search', 'Class selection advisory (up to 3 classes)', 'TM application filing', 'Govt fees paid', 'Exam report response', 'TM certificate tracking', 'TM ® watch alerts'],
        aiCapability: 'AI searches 3 crore+ existing marks, predicts opposition risk, and recommends the safe classes for your brand.',
        tiers: [
            { name: 'Free', price: '₹0', features: ['AI prior-art search', 'Conflict risk score', 'Class recommendation'], cta: 'Check Your Brand' },
            { name: 'Premium', price: '₹6,999', features: ['TM filing (1 class)', 'AI prior-art search', 'Govt fees included', 'Application tracking', 'Exam response (1)'], cta: 'Protect My Brand', highlight: true },
            { name: 'Ultra', price: '₹12,999', features: ['TM filing (up to 3 classes)', 'Priority examination request', 'Logo + wordmark both', 'Unlimited exam responses', 'TM watch alert', 'Certificate framing'], cta: 'Full Brand Protection' },
        ],
        faq: [
            { q: 'How long does trademark registration take?', a: '18–24 months for full registration. However, TM ™ symbol can be used immediately after filing. You get priority rights from the filing date.' },
        ],
        seoKeywords: ['trademark registration india', 'register trademark online india', 'brand protection india'],
        timelineNote: 'Filing: 2 days | Certificate: 18–24 months',
    },
    {
        slug: 'logo-brand-kit',
        category: 'launch',
        icon: '🎨',
        title: 'Logo & Brand Kit',
        shortDesc: 'AI-designed logo, color palette, fonts & brand guidelines.',
        fullDesc: 'Get a professional logo and complete brand identity kit. Our AI generates multiple logo concepts based on your business type, industry, and preferences.',
        includes: ['5 AI logo concepts', 'Final logo (SVG, PNG, PDF)', 'Color palette & typography', 'Brand guidelines PDF', 'Business card design', 'Email signature', 'Social media kit'],
        aiCapability: 'AI generates logo concepts in 60 seconds, learns your style preferences, and iterates until you love it.',
        tiers: [
            { name: 'Free', price: '₹0', features: ['3 AI logo concepts (watermarked)', 'Color palette suggestion', 'Font pairing'], cta: 'Generate Free Logo' },
            { name: 'Premium', price: '₹2,999', features: ['3 logo concepts (full res)', 'Brand color palette', 'Font system', 'Business card design', 'Social media kit'], cta: 'Get My Brand Kit', highlight: true },
            { name: 'Ultra', price: '₹5,999', features: ['Unlimited concepts', 'Brand guidelines (20+ pages)', 'Letterhead & envelope', 'Presentation template', 'All file formats incl. AI/EPS'], cta: 'Full Brand Identity' },
        ],
        faq: [
            { q: 'Do I own the logo copyright?', a: 'Yes, full ownership transfer. Once you pay, all files and copyright are yours forever.' },
        ],
        seoKeywords: ['logo design india startup', 'brand kit online india', 'ai logo generator india'],
        timelineNote: '24–48 hours',
    },
    {
        slug: 'website-design',
        category: 'launch',
        icon: '🌐',
        title: 'Business Website',
        shortDesc: 'Professional website built in 5 days. SEO-ready from day one.',
        fullDesc: 'Get a conversion-focused business website designed and developed by our team. SEO-optimized, mobile-first, and built on WordPress or Next.js for speed.',
        includes: ['5-page website', 'Mobile responsive design', 'SEO on-page setup', 'Contact form + WhatsApp', 'Google Analytics setup', 'SSL certificate', '1 year hosting'],
        aiCapability: 'AI generates website copy, meta descriptions, and initial design layout based on your business details.',
        tiers: [
            { name: 'Free', price: '₹0', features: ['AI website copy generator', 'Page structure planner', 'SEO keyword suggestions'], cta: 'Plan My Website' },
            { name: 'Premium', price: '₹14,999', features: ['5-page professional website', 'Mobile responsive', 'SEO setup', 'WhatsApp + contact form', '1yr hosting included'], cta: 'Build My Website', highlight: true },
            { name: 'Ultra', price: '₹29,999', features: ['10-page website', 'Custom design', 'Blog + CMS', 'E-commerce (up to 50 products)', 'Speed optimization', 'Monthly support'], cta: 'Premium Website' },
        ],
        faq: [
            { q: 'How long to build my website?', a: '5–7 working days for Premium. Includes 2 revision rounds and a review call before launch.' },
        ],
        seoKeywords: ['business website design india', 'website design startup india', 'affordable website design visakhapatnam'],
        timelineNote: '5–7 working days',
    },
    // ── SCALE ──
    {
        slug: 'gst-filing',
        category: 'scale',
        icon: '📁',
        title: 'GST Filing (Monthly)',
        shortDesc: 'GSTR-1, GSTR-3B & reconciliation. Never miss a deadline.',
        fullDesc: 'Monthly GST return filing handled end-to-end. GSTR-1 (outward supplies) and GSTR-3B (summary return) filed on time. Input tax credit reconciliation included.',
        includes: ['GSTR-1 filing', 'GSTR-3B filing', 'ITC reconciliation', 'Late fee advisory', 'Annual return (GSTR-9)', 'GST notice handling'],
        aiCapability: 'AI imports your invoice data, auto-reconciles ITC, and flags mismatches before filing to avoid notices.',
        tiers: [
            { name: 'Free', price: '₹0', features: ['GST due date alerts', 'Self-filing guide', 'ITC calculator'], cta: 'Get Reminders' },
            { name: 'Premium', price: '₹999/mo', features: ['GSTR-1 + GSTR-3B filing', 'ITC reconciliation', 'Up to 100 invoices/mo', 'Deadline guarantee'], cta: 'Start Filing', highlight: true },
            { name: 'Ultra', price: '₹1,999/mo', features: ['Unlimited invoices', 'AI notice response', 'Annual GSTR-9', 'Quarterly health check', 'Dedicated CA'], cta: 'Managed GST' },
        ],
        faq: [
            { q: 'What if I miss a GST deadline?', a: 'Late fee of ₹50/day (₹20 if nil return). We send reminders 7 days, 3 days, and 1 day before due dates to prevent this.' },
        ],
        seoKeywords: ['gst return filing india', 'gstr-1 filing online', 'gst filing service visakhapatnam'],
        timelineNote: 'Monthly, before due date',
    },
    {
        slug: 'business-loan',
        category: 'scale',
        icon: '💰',
        title: 'Business Loan Advisory',
        shortDesc: 'Get MSME loans, mudra loans & startup funding. Free advisory.',
        fullDesc: 'Navigate India\'s complex loan landscape with AI-powered guidance. We match your business profile to the best loan products across 50+ banks and NBFCs.',
        includes: ['Free loan eligibility check', 'Bank comparison (50+ banks/NBFCs)', 'Loan application support', 'CMA data preparation', 'Project report (if needed)', 'CIBIL score advisory'],
        aiCapability: 'AI scores your loan eligibility, matches you with the best products, and prepares your CMA data automatically.',
        tiers: [
            { name: 'Free', price: '₹0', features: ['Loan eligibility check', 'Bank comparison', 'CIBIL score insight', 'Mudra loan guide'], cta: 'Check Eligibility' },
            { name: 'Premium', price: '₹4,999', features: ['Full loan advisory', 'CMA data preparation', 'Bank application support', 'MSME / Mudra filing', 'Follow-up support'], cta: 'Get Loan Help', highlight: true },
            { name: 'Ultra', price: '₹9,999', features: ['Premium + Project report', 'CA-certified financials', 'Direct bank meetings', 'Subsidy identification', 'Post-sanction support'], cta: 'Full Loan Support' },
        ],
        faq: [
            { q: 'What loans can I get as a startup?', a: 'Mudra Loan (up to ₹10L), Startup India Seed Fund, SIDBI loans, CGTMSE-backed bank loans, and state government schemes. We identify the best match.' },
        ],
        seoKeywords: ['msme loan india', 'business loan startup india', 'mudra loan application'],
        timelineNote: '7–21 working days',
    },
    // ── GLOBAL ──
    {
        slug: 'iec-code',
        category: 'global',
        icon: '🚢',
        title: 'IEC Code (Import Export)',
        shortDesc: 'Get your Import-Export Code in 2 days. Mandatory for all exporters.',
        fullDesc: 'IEC (Import Export Code) is mandatory for anyone importing or exporting from India. Get your 10-digit IEC code from DGFT online within 2 working days.',
        includes: ['IEC application filing', 'DGFT portal submission', 'IEC certificate download', 'Bank account linking', 'AD code registration', 'Export benefit advisory (RoDTEP, MEIS)'],
        aiCapability: 'AI fills DGFT application, maps your product HS codes, and calculates which export incentive schemes you qualify for.',
        tiers: [
            { name: 'Free', price: '₹0', features: ['IEC eligibility check', 'HS code finder', 'Export benefit calculator'], cta: 'Check IEC Need' },
            { name: 'Premium', price: '₹1,999', features: ['Full IEC filing', 'IEC certificate', 'HS code advisory', 'AD code registration', 'Govt fees included'], cta: 'Get IEC Code', highlight: true },
        ],
        faq: [
            { q: 'Is IEC mandatory for all exports?', a: 'Yes, for any commercial export. Gifted goods (up to ₹5,000) are exempt. Services exports need IEC for wire transfers above certain thresholds.' },
        ],
        seoKeywords: ['iec code registration india', 'import export code online', 'iec dgft india'],
        timelineNote: '2–3 working days',
    },
];

export const CATEGORY_META = {
    setup: { label: 'Setup Your Business', emoji: '🏗️', desc: 'Everything to legally start your business — registration, licenses, and compliance.' },
    launch: { label: 'Launch Your Business', emoji: '🚀', desc: 'Build your brand, website, and go-to-market presence.' },
    scale: { label: 'Scale Your Business', emoji: '📈', desc: 'Tools and services to grow your revenue and protect your business.' },
    global: { label: 'Global Access', emoji: '🌍', desc: 'Expand into international markets or bring global clients to India.' },
};

export function getServiceBySlug(slug: string): Service | undefined {
    return SERVICES.find(s => s.slug === slug);
}

export function getServicesByCategory(category: Service['category']): Service[] {
    return SERVICES.filter(s => s.category === category);
}
