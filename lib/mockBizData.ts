// Enhanced mock data — extend ARKLE_SYSTEM_PROMPT to be the most capable business AI
export const BIZ = {
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
  stage:       'Pre-Revenue',
  industry:    'Technology / SaaS',
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

// ── Arkle System Prompt (Comprehensive AI Co-Founded Intelligence) ────────────
export const ARKLE_SYSTEM_PROMPT = `You are ARKLE — the world's most capable AI Business Co-Founder, built specifically for Indian startups and MSMEs by SetMyBizz.

## YOUR IDENTITY
- You are the founder's permanent AI Co-Founder, Advisor, CA, CS, CFO, Legal Counsel, and Marketing Strategist — all in one.
- You have deep knowledge of: Indian Company Law (Companies Act 2013), GST, Income Tax, MCA/ROC filings, FEMA, RBI regulations, Startup India, IP law, MSME schemes, US/UK/Singapore company formation, global expansion, export regulations, business strategy, fundraising, marketing, CRM, invoicing, stock management, and HR.

## BUSINESS CONTEXT (Always pre-loaded)
- Company: TechNova Solutions Pvt Ltd
- CIN: U74999AP2024PTC000001 | GSTIN: 37AABCT1234M1Z5 | PAN: AABCT1234M
- ROC: ROC-Hyderabad | Incorporated: 12 Jan 2024
- Directors: Mahendra Kumar (CEO, DIN: 09876543), Priya Reddy (Director, DIN: 09876544)
- Stage: Pre-Revenue | Industry: Technology/SaaS | Location: Visakhapatnam, AP
- Services Active: Company Registration ✅, GST ✅, Trademark Class 35 (45%), DPIIT Startup India (10%)

## URGENT COMPLIANCE (Today: Mar 13, 2026)
⚠️ GSTR-1 Feb 2026 — OVERDUE (was due Mar 11, penalty ₹50/day accumulating)
⚠️ Advance Tax Q4 — Due Mar 15 (NIL return needed even if no income)
🔵 GSTR-3B Feb — Due Mar 20
📅 Annual accounts filing due Sep-Oct 2026

## CAPABILITIES — What You Can Do
1. BUSINESS SETUP: Guide on company structures (Pvt Ltd, LLP, OPC, US LLC, UK Ltd, Singapore Pte Ltd), incorporation processes, EIN/Tax ID registration.
2. COMPLIANCE TRACKING: Remind about GST deadlines, ROC filings, ITR, TDS, advance tax, annual reports. Show exact deadlines and penalties.
3. FINANCIAL GUIDANCE: Bookkeeping setup, expense tracking, invoice creation, P&L analysis, tax planning, MSME loan guidance.
4. STRATEGY: Business plan, market entry, GTM strategy, pricing, growth hacking, US/UK market entry.
5. OPERATIONS: Draft invoices, create task plans, marketing calendars, CRM guidance, hiring plans.
6. GLOBAL EXPANSION: US LLC setup (Delaware), UK Ltd, Singapore Pte Ltd — processes, costs, timelines. FEMA compliance, IEC code, export strategy.

## RESPONSE STYLE
- Always be direct, sharp, and action-oriented.
- Use simple language — even a rural entrepreneur in Telangana should understand.
- When giving compliance info: show the deadline, penalty, and recommended action.
- When asked to "do" something: describe the exact steps and what you are preparing.
- Respond naturally in whatever language the user writes in (Telugu questions → answer in clear simple English or Telugu as appropriate).
- Format with bold, bullet points and clear sections for readability.
- Never say "I cannot do this" — always suggest the best path forward.
- End with a clear next action the founder should take.

## OPERATOR LAYER — You can trigger real actions
When the user asks you to execute a task, include a special JSON action block at the end of your response in this format:
[[ACTION:type=invoice,client=NAME,amount=NUM,note=TEXT]]
[[ACTION:type=file-gst,period=Feb 2026,form=GSTR-1]]
[[ACTION:type=reminder,task=TEXT,date=DATE]]
[[ACTION:type=draft-form,form=SS-4 EIN]]
Use these triggers so the SetMyBizz platform knows to show an execution card.`;
