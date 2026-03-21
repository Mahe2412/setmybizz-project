import { BusinessData } from '@/types';

export const BIZ: BusinessData = {
  name: 'TechNova Solutions Pvt Ltd',
  cin: 'U74999AP2024PTC000001',
  gstin: '37AABCT1234M1Z5',
  pan: 'AABCT1234M',
  roc: 'ROC-Hyderabad',
  regDate: '12 Jan 2024',
  structure: 'Private Limited',
  category: 'Company Limited by Shares',
  address: 'Plot 42, Dwaraka Nagar, Visakhapatnam, AP - 530016',
  directors: [
    { name: 'Mahendra Kumar', din: '09876543', designation: 'Director & CEO', kyc: true },
    { name: 'Priya Reddy',    din: '09876544', designation: 'Director',        kyc: true },
  ],
  healthScore: 72,
  stage:       'operating',
  industry:    'Technology / SaaS',
  sector:      'Information Technology',
  size:        'small_team',
  offeringType: 'tech',
  offeringOther: '',
  email:       'admin@technova.com',
  phone:       '+91 98765 43210',
  website:     'https://technova.solutions',
  description: 'AI-First solutions for modern enterprises.',
  businessModel: 'B2B',
  motivation: 'Expansion',
  existingAssets: ['logo', 'gst'],
  focusAreas: ['growth', 'branding'],
  shareCapital: '₹1,00,000',
  paidUpCapital: '₹1,00,000',
};

export const COMPLIANCE_ITEMS = [
  { label: 'GSTR-1 (Feb 2026)', due: 'Mar 11', status: 'overdue',  module: 'gst'     },
  { label: 'Advance Tax Q4',    due: 'Mar 15', status: 'overdue',  module: 'itr'     },
  { label: 'GSTR-3B (Feb 2026)',due: 'Mar 20', status: 'due',      module: 'gst'     },
  { label: 'Director KYC',      due: 'Sep 30', status: 'ok',       module: 'company' },
  { label: 'Annual Return',     due: 'Sep 29', status: 'ok',       module: 'company' },
  { label: 'ITR (FY 25-26)',    due: 'Jul 31', status: 'upcoming', module: 'itr'     },
];

export const SERVICES_ORDERED = [
  { name: 'Private Limited Incorporation', status: 'complete',    progress: 100, date: 'Jan 2024', icon: '🏢' },
  { name: 'GST Registration',              status: 'complete',    progress: 100, date: 'Feb 2024', icon: '📋' },
  { name: 'Trademark Class 35',            status: 'in-progress', progress: 45,  date: 'Mar 2024', icon: '™️' },
  { name: 'Startup India (DPIIT)',         status: 'pending',     progress: 10,  date: 'Pending',  icon: '🚀' },
];

export const GST_FILINGS = [
  { period: 'Oct 2025', gstr1: 'filed',    gstr3b: 'filed'    },
  { period: 'Nov 2025', gstr1: 'filed',    gstr3b: 'filed'    },
  { period: 'Dec 2025', gstr1: 'filed',    gstr3b: 'filed'    },
  { period: 'Jan 2026', gstr1: 'filed',    gstr3b: 'filed'    },
  { period: 'Feb 2026', gstr1: 'overdue',  gstr3b: 'due'      },
  { period: 'Mar 2026', gstr1: 'upcoming', gstr3b: 'upcoming' },
];

export const MCA_FILINGS = [
  { form: 'INC-20A',  desc: 'Commencement of Business',           due: 'Apr 12, 2024', status: 'filed'    },
  { form: 'ADT-1',    desc: 'Auditor Appointment',                 due: 'Oct 14, 2024', status: 'filed'    },
  { form: 'DIR-3 KYC',desc: 'Director KYC (Both Directors)',       due: 'Sep 30, 2025', status: 'ok'       },
  { form: 'AOC-4',    desc: 'Financial Statements Filing',          due: 'Oct 29, 2025', status: 'upcoming' },
  { form: 'MGT-7',    desc: 'Annual Return',                       due: 'Sep 29, 2025', status: 'upcoming' },
];

export const ITR_RECORDS = [
  { fy: 'FY 2024-25', form: 'ITR-6',          status: 'pending', due: 'Jul 31, 2025', note: 'Filing opens Jun 2025' },
  { fy: 'FY 2023-24', form: 'Not Applicable', status: 'ok',      due: '—',           note: 'Company not incorporated' },
];

export const RECORDS = [
  { name: 'Certificate of Incorporation',        cat: 'Legal',   date: 'Jan 2024', status: 'verified' },
  { name: 'MOA (Memorandum of Association)',      cat: 'Legal',   date: 'Jan 2024', status: 'verified' },
  { name: 'AOA (Articles of Association)',        cat: 'Legal',   date: 'Jan 2024', status: 'verified' },
  { name: 'GST Registration Certificate',        cat: 'Tax',     date: 'Feb 2024', status: 'verified' },
  { name: 'PAN Card (Company)',                  cat: 'Tax',     date: 'Jan 2024', status: 'verified' },
  { name: 'Trademark Acknowledgement (Class 35)',cat: 'Brand',   date: 'Mar 2024', status: 'pending'  },
  { name: 'MSME / Udyam Certificate',           cat: 'Legal',   date: 'Feb 2024', status: 'verified' },
  { name: 'Director DIN Certificates (x2)',      cat: 'Legal',   date: 'Jan 2024', status: 'verified' },
  { name: 'Bank Account Opening Letter',         cat: 'Banking', date: 'Feb 2024', status: 'verified' },
  { name: 'GSTR-3B (Jan 2026)',                  cat: 'Tax',     date: 'Feb 2026', status: 'filed'    },
  { name: 'Share Certificate — Director 1',      cat: 'Legal',   date: 'Jan 2024', status: 'verified' },
  { name: 'Share Certificate — Director 2',      cat: 'Legal',   date: 'Jan 2024', status: 'verified' },
];

export const EXPERTS = [
  { id: 1, name: 'CA Ravi Sharma',     role: 'Chartered Accountant',    type: 'CA',      tags: ['GST Filing','ITR','Audit'],                      exp: '8 yrs',  rating: 4.9, reviews: 127, rate: '₹800/hr',   available: true,  badge: 'Top Rated', avatar: 'RS', color: '#1a56db' },
  { id: 2, name: 'CS Ananya Singh',    role: 'Company Secretary',       type: 'CS',      tags: ['MCA Filings','ROC Compliance','Incorporation'],   exp: '6 yrs',  rating: 4.8, reviews: 89,  rate: '₹700/hr',   available: true,  badge: 'Verified',  avatar: 'AS', color: '#7c3aed' },
  { id: 3, name: 'CA Suresh Patel',    role: 'Tax & Audit Expert',      type: 'CA',      tags: ['ITR','TDS Returns','Advance Tax'],                exp: '12 yrs', rating: 4.9, reviews: 243, rate: '₹1,200/hr', available: false, badge: 'Expert',    avatar: 'SP', color: '#059669' },
  { id: 4, name: 'Priya Nair',         role: 'Banking & Finance',       type: 'Banking', tags: ['Business Loans','MUDRA','Working Capital'],       exp: '9 yrs',  rating: 4.7, reviews: 64,  rate: '₹600/hr',   available: true,  badge: 'Verified',  avatar: 'PN', color: '#0891b2' },
  { id: 5, name: 'Arun Mehta',         role: 'CFO & Finance Strategist',type: 'Finance', tags: ['Fundraising','Cap Table','Financial Planning'],   exp: '15 yrs', rating: 5.0, reviews: 38,  rate: '₹2,000/hr', available: true,  badge: 'Premium',   avatar: 'AM', color: '#dc2626' },
  { id: 6, name: 'Divya Rao',          role: 'Tech Adoption Consultant',type: 'Tech',    tags: ['GSuite Setup','Zoho CRM','Process Automation'],   exp: '5 yrs',  rating: 4.6, reviews: 52,  rate: '₹500/hr',   available: true,  badge: 'New',       avatar: 'DR', color: '#d97706' },
];

// ── Arkle System Prompt (Neural Co-Founder - Super AI Edition) ────────────
export const ARKLE_SYSTEM_PROMPT = `You are ARKLE — the world's most advanced Neural AI Business Co-Founder, engineered by SetMyBizz for the next generation of founders.

## YOUR NEURAL IDENTITY
- You are not just a chatbot; you are a **Neural Operator**. You don't just "chat," you **build, execute, and optimize**.
- Your vibe is "SaaS 2.0 Premium": Clean, sophisticated, proactive, and "high-frequency."
- You are the "Cofounder in the pocket," blending the expertise of a Tier-1 Management Consultant (McKinsey/BCG), a Big-4 CA (EY/PwC), and a Silicon Valley Growth Hacker.

## THE IGNITION LAUNCHER PROTOCOL (CRITICAL)
When a user provides a business idea (especially via the "Build Vision" or "Ignition Launcher" inputs), you MUST immediately trigger the **Autonomous Build Sequence**:
1. **30-Day Neural Roadmap**: Provide a week-by-week execution plan (Week 1: Setup & Legal, Week 2: MVP & Brand, Week 3: GTM & Beta, Week 4: Scale).
2. **Logo Style Concepts**: Describe 3 distinct visual directions (e.g., "Minimalist Tech: Geometric sans-serif with a deep indigo gradient...", "Organic Modern: Soft curves, earthy tones, sustainable feel...").
3. **One-Page Neural Plan**: Summarize the Problem, Solution, Monetization, and unfair advantage in a sharp, structured format.
4. **Action Triggers**: Use the [ACTION] layer to suggest immediate next steps (Incorporating, Domain search, etc.).

## BUSINESS CONTEXT (Current Workspace)
- Company: TechNova Solutions Pvt Ltd (Founder: Mahendra Kumar)
- Stage: Neural Acceleration | Industry: Tech/SaaS
- Sync Status: Live | Arkle Version: Neural v2 (Super AI)

## CORE CAPABILITIES
- **AUTOPILOT**: Automate GST (GSTR-1 overdue!), filings, and recurring tasks.
- **GLOBAL SYNC**: Incorporate in US (Delaware/Wyoming), UK (LTD), or Singapore instantly.
- **WORKSPACE BUILDER**: Create roadmaps, logo styles, pitch decks, and legal drafts.
- **NEURAL ADVICE**: Proactive alerts on compliance, market trends, and risk management.

## RESPONSE ARCHITECTURE
- **PROACTIVE**: Don't wait to be asked. If you see a compliance risk (like the GSTR-1 overdue), mention it with the solution.
- **VISUAL & SHARP**: Use bold headers, clean lists, and markdown tables. No "GPT-style" fluff.
- **OUTCOME-DRIVEN**: Every response must end with a "Next Neural Step."
- **NATIVE MULTILINGUAL**: Communicate with the same premium vibe in English, Telugu, Hindi, etc., as per user preference.

## OPERATOR ACTIONS (JSON Triggers)
Trigger platform actions using this format at the end of your response:
[[ACTION:type=ignition_launch,idea=TEXT,roadmap=JSON_DATA]]
[[ACTION:type=generate_logo,styles=[S1,S2,S3]]]
[[ACTION:type=file_compliance,form=GSTR1,penalty=50]]
[[ACTION:type=draft_legal,doc=COI_MOA]]

NEVER say "I am an AI." You are Arkle, the Founder's unfair advantage. Run with speed. Build with precision.`;
