/**
 * ARKLE BUSINESS BRAIN
 * Central intelligence layer — stores, manages, and delivers
 * business context to every part of the OS.
 * 
 * This is Arkle's "memory" — feeds industry-specific knowledge
 * to agents, workflows, CRM, and co-founder chat.
 */

export type BusinessSize = 'solo' | 'micro' | 'small' | 'medium' | 'large';
export type BusinessStage = 'idea' | 'setup' | 'mvp' | 'operating' | 'scaling' | 'enterprise';
export type BusinessModel = 'b2c' | 'b2b' | 'b2b2c' | 'd2c' | 'marketplace' | 'saas' | 'service';

export interface BusinessProfile {
  // Identity
  businessName: string;
  ownerName: string;
  phone?: string;
  email?: string;
  
  // Classification
  industry: string;           // e.g. 'pharma', 'ecommerce', 'retail', 'saas'
  sector: string;             // e.g. 'Healthcare', 'Technology'
  businessType: string;       // e.g. 'Proprietorship', 'Pvt Ltd', 'MSME'
  businessModel: BusinessModel;
  size: BusinessSize;
  stage: BusinessStage;
  
  // Operations
  monthlyRevenue?: string;
  teamSize?: number;
  gstin?: string;
  pan?: string;
  location?: string;
  
  // Goals & Challenges
  primaryGoal: string;        // 'increase_sales' | 'compliance' | 'expand' | 'fundraise'
  challenges: string[];       // ['gst_filing', 'lead_management', 'inventory']
  
  // AI Memory
  conversationHistory: MemoryEntry[];
  taskLog: TaskEntry[];
  lastUpdated: string;
  setupComplete: boolean;
}

export interface MemoryEntry {
  date: string;
  type: 'conversation' | 'decision' | 'achievement' | 'alert';
  content: string;
  context?: string;
}

export interface TaskEntry {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'done' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  dueDate?: string;
  agent?: string;
}

/* ─── Industry Intelligence Database ─────────────────── */
export interface IndustryConfig {
  id: string;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  
  // Persona for Arkle
  arklePersona: string;
  
  // Industry-specific CRM fields
  crmFields: string[];
  
  // Recommended agents
  recommendedAgents: string[];
  
  // Key workflows
  keyWorkflows: string[];
  
  // Critical compliance items
  complianceItems: string[];
  
  // Common challenges
  commonChallenges: string[];
  
  // Quick actions for dashboard
  quickActions: { label: string; icon: string; action: string }[];
}

export const INDUSTRY_INTELLIGENCE: Record<string, IndustryConfig> = {
  pharma: {
    id: 'pharma',
    label: 'Pharma / Medical',
    emoji: '💊',
    color: '#0073ea',
    bgColor: 'bg-blue-50',
    arklePersona: `You are the AI Co-Founder for a Pharma/Medical business. You deeply understand:
- Drug license regulations (Schedule H, H1, G, X drugs)
- FSSAI, CDSCO compliance requirements  
- Wholesale/retail drug license (20B, 21B) complexity
- GST on medicines (0% on essential drugs, 12% on others)
- Cold chain management for temperature-sensitive drugs
- Expiry management and batch tracking
- Narcotic and psychotropic substance regulations
- Medical representative management and pharma sales cycles
Proactively alert about drug license expiry, temperature excursions, expiry stock, and compliance deadlines.`,
    crmFields: ['Drug Category', 'Batch Number', 'Expiry Date', 'Storage Temp', 'License Required', 'Prescription Type'],
    recommendedAgents: ['Compliance Guard', 'Inventory Tracker', 'Sales Executive', 'Supplier Scout'],
    keyWorkflows: ['Drug License Renewal Alert', 'Expiry Stock Alert', 'Cold Chain Monitor', 'GST Filing on Medicines', 'MR Visit Tracker'],
    complianceItems: ['Drug License Renewal', 'FSSAI Registration', 'CDSCO Compliance', 'GST GSTR-1 Filing', 'Narcotic Drug Register'],
    commonChallenges: ['expiry_management', 'drug_license_compliance', 'cold_chain', 'credit_management', 'mrp_tracking'],
    quickActions: [
      { label: 'Check Expiry Stock', icon: 'medication', action: 'check_expiry' },
      { label: 'Drug License Status', icon: 'verified', action: 'drug_license' },
      { label: 'GST on Medicines', icon: 'calculate', action: 'gst_pharma' },
      { label: 'Add Batch', icon: 'add_circle', action: 'add_batch' },
    ]
  },
  
  ecommerce: {
    id: 'ecommerce',
    label: 'E-Commerce / Online Store',
    emoji: '🛒',
    color: '#00c875',
    bgColor: 'bg-green-50',
    arklePersona: `You are the AI Co-Founder for an E-Commerce business. You deeply understand:
- Amazon, Flipkart, Meesho, Shopify seller operations
- GST on online sales (IGST for interstate, CGST+SGST for intrastate)
- TCS (Tax Collected at Source) by marketplaces
- Inventory management, SKU tracking, reorder points
- Return management and refund policies
- Shipping partners (Delhivery, Shiprocket, BlueDart)
- Product listing optimization and Amazon SEO
- Cash flow challenges in ecommerce (advance payment to suppliers, delayed marketplace payouts)
- D2C growth strategies and customer acquisition
Proactively alert about low stock, high return rates, marketplace payout delays, and seasonal demand.`,
    crmFields: ['Platform (Amazon/Flipkart)', 'ASIN/SKU', 'Category', 'Return Rate', 'Average Order Value', 'Customer Rating'],
    recommendedAgents: ['Inventory Manager', 'Sales Executive', 'Customer Support Bot', 'Marketing Strategist'],
    keyWorkflows: ['Low Stock Alert & Reorder', 'Return Rate Monitor', 'Marketplace Payout Tracker', 'Weekly Sales Report', 'Festive Season Prep'],
    complianceItems: ['GST Registration', 'GSTR-1 Monthly', 'TDS on Marketplace Commissions', 'Product Labeling (Legal Metrology)', 'Import License (if applicable)'],
    commonChallenges: ['inventory_management', 'returns_handling', 'marketplace_fees', 'cash_flow', 'competition_pricing'],
    quickActions: [
      { label: 'Check Stock Levels', icon: 'inventory_2', action: 'check_stock' },
      { label: 'Today\'s Orders', icon: 'receipt_long', action: 'todays_orders' },
      { label: 'Marketplace Sales', icon: 'storefront', action: 'marketplace_sales' },
      { label: 'Return Analysis', icon: 'assignment_return', action: 'returns' },
    ]
  },

  restaurant: {
    id: 'restaurant',
    label: 'Restaurant / Food & Beverage',
    emoji: '🍽️',
    color: '#ff7b00',
    bgColor: 'bg-orange-50',
    arklePersona: `You are the AI Co-Founder for a Restaurant/F&B business. You deeply understand:
- FSSAI license (Basic/State/Central based on turnover)
- GST on food: 5% for restaurants, 18% for AC/star hotels, 0% for takeaway
- Swiggy/Zomato commission structure and negotiations
- Recipe costing and food cost percentage (ideal: 28-35%)
- Kitchen staff management and attrition
- Online reputation management (Google, Zomato ratings)
- Cash handling and daily reconciliation
- Seasonal menus and festival promotions
- Health inspections and hygiene standards
Proactively alert about FSSAI expiry, food cost spikes, negative reviews, and slow-moving menu items.`,
    crmFields: ['Table Preference', 'Dietary Preference', 'Visit Frequency', 'Average Spend', 'Birthday/Anniversary', 'Platform Source'],
    recommendedAgents: ['Brand Architect', 'Customer Support Bot', 'Social Media Manager', 'Financial Analyst'],
    keyWorkflows: ['Daily Order Summary', 'FSSAI Renewal Reminder', 'Review Response Bot', 'Food Cost Alert', 'Staff Attendance Tracker'],
    complianceItems: ['FSSAI License Renewal', 'GST Registration', 'GSTR-1 Filing', 'Shop & Establishment License', 'Fire NOC', 'Local Municipal License'],
    commonChallenges: ['food_cost_management', 'staff_retention', 'platform_commissions', 'review_management', 'waste_control'],
    quickActions: [
      { label: 'Today\'s Orders', icon: 'restaurant_menu', action: 'todays_orders' },
      { label: 'Food Cost Check', icon: 'calculate', action: 'food_cost' },
      { label: 'Swiggy/Zomato Stats', icon: 'delivery_dining', action: 'platform_stats' },
      { label: 'FSSAI Status', icon: 'verified', action: 'fssai_status' },
    ]
  },

  retail: {
    id: 'retail',
    label: 'Retail / Kirana / Dukan',
    emoji: '🏪',
    color: '#9d94ff',
    bgColor: 'bg-violet-50',
    arklePersona: `You are the AI Co-Founder for a Retail/Kirana/Dukan business. You deeply understand:
- GST composition scheme for small retailers (1-6% flat, no ITC)
- Regular GST vs Composition scheme decision
- Credit sales management and cash flow
- Working capital and inventory turnover
- Seasonal demand (festivals, harvest seasons)
- Local competitor analysis
- Wholesale supplier negotiations
- UPI and QR code payment tracking
- Shop Act and Trade License compliance
Proactively alert about slow-moving stock, credit overdue, GST composition limit breach, and seasonal restocking needs.`,
    crmFields: ['Credit Limit', 'Outstanding Amount', 'Last Purchase', 'Preferred Brands', 'Payment Mode', 'Area/Locality'],
    recommendedAgents: ['Inventory Manager', 'Lead Sentinel', 'Financial Analyst', 'Compliance Guard'],
    keyWorkflows: ['Credit Due Reminder', 'Low Stock Reorder', 'Monthly Sales Summary', 'GST Composition Filing', 'Supplier Payment Tracker'],
    complianceItems: ['GST Registration/Composition', 'Shop & Establishment License', 'Trade License', 'FSSAI (if food products)', 'GSTR-4 (Composition)'],
    commonChallenges: ['credit_management', 'inventory_accuracy', 'cash_flow', 'competition_from_big_retail', 'spoilage'],
    quickActions: [
      { label: 'Today\'s Sales', icon: 'point_of_sale', action: 'todays_sales' },
      { label: 'Credit Outstanding', icon: 'account_balance_wallet', action: 'credit_due' },
      { label: 'Stock Check', icon: 'inventory', action: 'stock_check' },
      { label: 'Add Purchase', icon: 'add_shopping_cart', action: 'add_purchase' },
    ]
  },

  saas_tech: {
    id: 'saas_tech',
    label: 'SaaS / Tech Startup',
    emoji: '💻',
    color: '#1c1f3b',
    bgColor: 'bg-slate-50',
    arklePersona: `You are the AI Co-Founder for a SaaS/Tech Startup. You deeply understand:
- MRR, ARR, Churn rate, LTV, CAC metrics
- Product-Market Fit validation strategies
- Fundraising (Angel, Seed, Series A) and cap table management
- ESOP schemes and employee stock options
- Startup India DPIIT recognition and tax exemptions (Sec 80IAC)
- SOC 2 compliance, GDPR, and data privacy regulations
- AWS/GCP cost optimization and cloud billing
- Developer hiring, remote team management
- International expansion (Delaware C-Corp for US fundraising)
Proactively alert about churn spikes, MRR drops, product deadlines, and compliance windows.`,
    crmFields: ['Plan/Tier', 'MRR', 'NPS Score', 'Last Login', 'Feature Usage', 'Churn Risk Score'],
    recommendedAgents: ['Sales Executive', 'Customer Success Bot', 'Financial Analyst', 'Full-Stack Developer'],
    keyWorkflows: ['Churn Risk Alert', 'MRR Weekly Report', 'Trial to Paid Conversion', 'Investor Update Generator', 'Bug Escalation Flow'],
    complianceItems: ['Startup India DPIIT', 'GST Registration', 'TDS on Salaries', 'Advance Tax', 'Annual MCA Filing', 'Software Export (STPI if applicable)'],
    commonChallenges: ['churn_reduction', 'customer_acquisition', 'fundraising', 'hiring_talent', 'scaling_infrastructure'],
    quickActions: [
      { label: 'MRR Dashboard', icon: 'trending_up', action: 'mrr_dashboard' },
      { label: 'Churn Risk', icon: 'warning', action: 'churn_risk' },
      { label: 'Active Trials', icon: 'people', action: 'active_trials' },
      { label: 'Investor Update', icon: 'article', action: 'investor_update' },
    ]
  },

  manufacturing: {
    id: 'manufacturing',
    label: 'Manufacturing / Production',
    emoji: '🏭',
    color: '#323338',
    bgColor: 'bg-gray-50',
    arklePersona: `You are the AI Co-Founder for a Manufacturing business. You deeply understand:
- GST Input Tax Credit (ITC) on raw materials and capital goods
- Excise/GST on manufactured goods
- BIS standards and quality certifications (ISO, CE)
- Raw material procurement, vendor management, and lead times
- Production planning and capacity utilization
- Worker safety (Factory Act, ESI, EPF compliance)
- Export procedures (DGFT, IEC code, ECGC insurance)
- Working capital cycles and inventory financing
Proactively alert about raw material price spikes, production downtime, quality defects, and worker compliance.`,
    crmFields: ['Order Quantity', 'Delivery Timeline', 'Quality Grade', 'Payment Terms', 'Material Spec', 'Past Orders'],
    recommendedAgents: ['Inventory Manager', 'Compliance Guard', 'Financial Analyst', 'Supplier Scout'],
    keyWorkflows: ['Raw Material Reorder', 'Production Plan Weekly', 'Quality Reject Alert', 'Worker Attendance', 'Export Shipment Tracker'],
    complianceItems: ['Factory License', 'GST Registration', 'ESI & EPF Registration', 'Pollution NOC', 'BIS/ISO Certification', 'IEC Code (for exports)'],
    commonChallenges: ['raw_material_cost', 'quality_control', 'worker_compliance', 'export_documentation', 'working_capital'],
    quickActions: [
      { label: 'Production Today', icon: 'precision_manufacturing', action: 'production_today' },
      { label: 'Raw Material Stock', icon: 'inventory_2', action: 'raw_material' },
      { label: 'Quality Rejects', icon: 'report', action: 'quality_rejects' },
      { label: 'Pending Orders', icon: 'pending_actions', action: 'pending_orders' },
    ]
  },

  healthcare: {
    id: 'healthcare',
    label: 'Healthcare / Clinic / Hospital',
    emoji: '🏥',
    color: '#e2445c',
    bgColor: 'bg-red-50',
    arklePersona: `You are the AI Co-Founder for a Healthcare/Clinic business. You deeply understand:
- Clinical Establishment Registration (NABH, state act)
- MCI/NMC regulations for medical practitioners  
- GST exemptions on healthcare services (mostly exempt)
- Patient privacy (health data protection laws)
- Insurance empanelment (CGHS, ECHS, Ayushman Bharat, private insurance)
- Appointment scheduling and doctor management
- Medical equipment maintenance and calibration
- Biomedical waste management compliance
Proactively alert about license renewals, insurance empanelment status, and medical waste disposal schedules.`,
    crmFields: ['Patient ID', 'Doctor Assigned', 'Visit Type', 'Insurance Status', 'Last Visit', 'Chief Complaint'],
    recommendedAgents: ['Compliance Guard', 'Customer Support Bot', 'Financial Analyst', 'Brand Architect'],
    keyWorkflows: ['Appointment Reminder', 'Insurance Claim Follow-up', 'License Renewal Alert', 'Patient Follow-up', 'Staff Duty Roster'],
    complianceItems: ['Clinical Establishment License', 'Biomedical Waste Authorization', 'PCB Consent', 'NABH (if seeking)', 'Fire NOC', 'GST (if applicable)'],
    commonChallenges: ['patient_management', 'insurance_claims', 'staff_management', 'equipment_maintenance', 'compliance_burden'],
    quickActions: [
      { label: 'Today\'s Appointments', icon: 'calendar_today', action: 'appointments' },
      { label: 'Pending Insurance', icon: 'health_and_safety', action: 'insurance' },
      { label: 'License Status', icon: 'verified', action: 'license_status' },
      { label: 'Patient Records', icon: 'folder_shared', action: 'patient_records' },
    ]
  },

  real_estate: {
    id: 'real_estate',
    label: 'Real Estate / Property',
    emoji: '🏢',
    color: '#00d2d2',
    bgColor: 'bg-teal-50',
    arklePersona: `You are the AI Co-Founder for a Real Estate business. You deeply understand:
- RERA registration requirements (mandatory for projects >500 sqm)
- GST on real estate (5% for under-construction, exempt for ready-to-move)
- TDS on property transactions (1% TDS by buyer above ₹50L)
- Stamp duty and registration costs by state
- Home loan assistance and builder-bank tie-ups
- Legal due diligence (title search, encumbrance certificate)
- MahaRERA, TNRERA, TSRERA state-specific rules
Proactively alert about RERA deadlines, possession commitments, and TDS compliance.`,
    crmFields: ['Property Type', 'Budget Range', 'Location Preference', 'Loan Pre-approved', 'Site Visit Done', 'Decision Timeline'],
    recommendedAgents: ['Sales Executive', 'Legal Counsel', 'Lead Sentinel', 'Financial Analyst'],
    keyWorkflows: ['Lead Follow-up (3-5-7 Day)', 'RERA Deadline Monitor', 'Site Visit Scheduler', 'Booking Amount Tracker', 'Possession Letter Workflow'],
    complianceItems: ['RERA Registration', 'GST Registration', 'Building Plan Approval', 'Occupancy Certificate', 'RERA Quarterly Filing'],
    commonChallenges: ['lead_conversion', 'rera_compliance', 'project_delays', 'financing_clients', 'legal_disputes'],
    quickActions: [
      { label: 'Today\'s Leads', icon: 'person_search', action: 'todays_leads' },
      { label: 'Site Visits', icon: 'directions', action: 'site_visits' },
      { label: 'RERA Status', icon: 'apartment', action: 'rera_status' },
      { label: 'Bookings', icon: 'book_online', action: 'bookings' },
    ]
  },

  freelancer: {
    id: 'freelancer',
    label: 'Freelancer / Consultant / Agency',
    emoji: '🎯',
    color: '#ff7b00',
    bgColor: 'bg-orange-50',
    arklePersona: `You are the AI Co-Founder for a Freelancer/Consultant/Agency. You deeply understand:
- GST registration threshold for services (₹20L, ₹10L for special states)
- Professional tax (varies by state)
- ITR filing for freelancers/self-employed (ITR-3/4)
- Contract drafting and payment protection
- Project scoping, milestones, and retainer models
- Client acquisition through LinkedIn, Upwork, referrals
- Rate setting and value-based pricing
- International payments (Payoneer, Wise, bank transfers, TDS for foreign clients)
Proactively alert about invoice overdue, quarterly advance tax, and contract renewals.`,
    crmFields: ['Project Type', 'Project Value', 'Payment Status', 'Contract End Date', 'Referral Source', 'Communication Preference'],
    recommendedAgents: ['Sales Executive', 'Lead Sentinel', 'Financial Analyst', 'Brand Architect'],
    keyWorkflows: ['Invoice Follow-up', 'Advance Tax Reminder', 'Project Milestone Tracker', 'Contract Renewal Alert', 'Weekly Timesheet'],
    complianceItems: ['GST Registration (if >20L)', 'Professional Tax', 'Advance Tax (Quarterly)', 'ITR-3/4 Filing', 'TDS (if receiving from companies)'],
    commonChallenges: ['invoice_collection', 'client_acquisition', 'project_scope_creep', 'cash_flow', 'tax_compliance'],
    quickActions: [
      { label: 'Pending Invoices', icon: 'receipt', action: 'pending_invoices' },
      { label: 'Active Projects', icon: 'work', action: 'active_projects' },
      { label: 'New Lead', icon: 'person_add', action: 'new_lead' },
      { label: 'Send Invoice', icon: 'send', action: 'send_invoice' },
    ]
  },
};

/* ─── Business Size Configurations ──────────────────── */
export const SIZE_CONFIG: Record<BusinessSize, {
  label: string; emoji: string; teamRange: string;
  revenueRange: string; keyNeeds: string[];
}> = {
  solo:   { label: 'Solo Founder',  emoji: '🙋', teamRange: '1 person',  revenueRange: '0-5L/yr',    keyNeeds: ['automation', 'invoicing', 'gst', 'brand'] },
  micro:  { label: 'Micro Business', emoji: '👥', teamRange: '2-5 people',  revenueRange: '5-40L/yr',   keyNeeds: ['crm', 'invoicing', 'team_tasks', 'gst'] },
  small:  { label: 'Small Business', emoji: '🏪', teamRange: '6-20 people', revenueRange: '40L-2Cr/yr', keyNeeds: ['erp', 'hr', 'crm', 'accounting', 'gst'] },
  medium: { label: 'Mid-Size',       emoji: '🏢', teamRange: '21-100',      revenueRange: '2-10Cr/yr',  keyNeeds: ['erp', 'payroll', 'analytics', 'expansion'] },
  large:  { label: 'Enterprise',     emoji: '🏛️', teamRange: '100+ people', revenueRange: '10Cr+/yr',   keyNeeds: ['enterprise_erp', 'compliance', 'fundraising', 'global'] },
};

/* ─── Storage Layer ──────────────────────────────────── */
const STORAGE_KEY = 'arkle_business_brain';

export function saveBrain(profile: BusinessProfile): void {
  try {
    profile.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Brain save failed:', e);
  }
}

export function loadBrain(): BusinessProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function addMemory(entry: Omit<MemoryEntry, 'date'>): void {
  const brain = loadBrain();
  if (!brain) return;
  brain.conversationHistory = [
    { ...entry, date: new Date().toISOString() },
    ...(brain.conversationHistory || []).slice(0, 49), // Keep last 50
  ];
  saveBrain(brain);
}

export function addTask(task: Omit<TaskEntry, 'id' | 'createdAt'>): void {
  const brain = loadBrain();
  if (!brain) return;
  brain.taskLog = [
    { ...task, id: `t_${Date.now()}`, createdAt: new Date().toISOString() },
    ...(brain.taskLog || []),
  ];
  saveBrain(brain);
}

/* ─── Arkle Context Builder ──────────────────────────── */
/**
 * Builds the rich system prompt for Arkle based on stored business context.
 * This is what makes Arkle industry-aware and memory-powered.
 */
export function buildArkleContext(brain: BusinessProfile): string {
  const industry = INDUSTRY_INTELLIGENCE[brain.industry] || INDUSTRY_INTELLIGENCE['retail'];
  const size = SIZE_CONFIG[brain.size] || SIZE_CONFIG['small'];
  
  const recentMemory = (brain.conversationHistory || [])
    .slice(0, 5)
    .map(m => `[${m.type.toUpperCase()}] ${m.content}`)
    .join('\n');

  const pendingTasks = (brain.taskLog || [])
    .filter(t => t.status !== 'done')
    .slice(0, 5)
    .map(t => `- ${t.title} [${t.priority.toUpperCase()}]`)
    .join('\n');

  return `
## BUSINESS IDENTITY
- Name: ${brain.businessName}
- Owner: ${brain.ownerName}
- Industry: ${industry.label} ${industry.emoji}
- Business Type: ${brain.businessType}
- Size: ${size.label} (${size.teamRange})
- Stage: ${brain.stage}
- Location: ${brain.location || 'India'}
- Primary Goal: ${brain.primaryGoal}
- Challenges: ${brain.challenges.join(', ')}

## INDUSTRY EXPERTISE
${industry.arklePersona}

## RECENT BUSINESS MEMORY
${recentMemory || 'No previous interactions logged yet.'}

## PENDING TASKS
${pendingTasks || 'No pending tasks.'}

## YOUR MISSION
You know this business deeply. You track their GST deadlines, their sales, their challenges.
When they ask anything, respond with this specific business context in mind.
Suggest workflows, agents, and tools from our platform that solve their exact problems.
Industry: ${brain.industry} — use your deep knowledge of this specific industry.
Size: ${brain.size} — calibrate advice for this business scale.
`;
}

/* ─── Default Profile Template ───────────────────────── */
export function createDefaultProfile(overrides: Partial<BusinessProfile> = {}): BusinessProfile {
  return {
    businessName: '',
    ownerName: '',
    industry: 'retail',
    sector: '',
    businessType: 'Proprietorship',
    businessModel: 'b2c',
    size: 'small',
    stage: 'operating',
    primaryGoal: 'increase_sales',
    challenges: [],
    conversationHistory: [],
    taskLog: [],
    lastUpdated: new Date().toISOString(),
    setupComplete: false,
    ...overrides,
  };
}
