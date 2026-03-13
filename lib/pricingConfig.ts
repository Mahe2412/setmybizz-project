import { Building2, Receipt, Copyright, ShieldCheck, Globe, Award, FileText, Scale, Megaphone, Activity, Landmark, FileSignature } from 'lucide-react';

export const CORE_SERVICES = [
    { id: 'cs_inc_pvt', price: 14999, category: 'Incorporation', title: 'Private Limited Company', desc: 'Premium setup with MCA approvals in 5-7 days.', icon: Building2, colors: 'bg-orange-50 text-orange-600 border-orange-100', showIf: 'scale' },
    { id: 'cs_inc_llp', price: 2499, category: 'Incorporation', title: 'Proprietorship / LLP', desc: 'Quick and easy legal entity setup for solo founders.', icon: Building2, colors: 'bg-orange-50 text-orange-600 border-orange-100', showIf: 'solo' },
    { id: 'cs_udyam', price: 999, category: 'Govt Benefits', title: 'Udyam Registration', desc: 'MSME Certificate for Govt subsidies and benefits.', icon: Award, colors: 'bg-blue-50 text-blue-600 border-blue-100', showIf: 'all' },
    { id: 'cs_startup', price: 4999, category: 'Startup Growth', title: 'Startup India Registration', desc: 'Govt. Recognition & tax redemption schemes for 3 years.', icon: ShieldCheck, colors: 'bg-emerald-50 text-emerald-600 border-emerald-100', showIf: 'all' },
    { id: 'cs_gst', price: 1499, category: 'Tax & Compliance', title: 'GST Registration', desc: 'Stay compliant with Govt tax regulations effortlessly.', icon: Receipt, colors: 'bg-purple-50 text-purple-600 border-purple-100', showIf: 'all' },
    { id: 'cs_tm', price: 5499, category: 'Brand Protection', title: 'Trademark (TM) & IP', desc: 'Brand Security: Secure your brand name and logo permanently.', icon: Copyright, colors: 'bg-rose-50 text-rose-600 border-rose-100', showIf: 'all' },
    { id: 'cs_lic', price: 2999, category: 'Operations', title: 'Business Licenses', desc: 'FSSAI, ISO, IEC and other essential operating licenses.', icon: FileSignature, colors: 'bg-amber-50 text-amber-600 border-amber-100', showIf: 'all' },
    { id: 'cs_doc', price: 1999, category: 'Legal', title: 'Documentation', desc: 'Custom Drafting of NDA, Founders Agreement & more.', icon: FileText, colors: 'bg-teal-50 text-teal-600 border-teal-100', showIf: 'all' },
    { id: 'cs_ca', price: 9999, category: 'Advisory', title: 'Expert CA/CS', desc: 'Reports & Filings: Annual compliance and bookkeeping.', icon: Scale, colors: 'bg-indigo-50 text-indigo-600 border-indigo-100', showIf: 'all' },
    { id: 'cs_marketing', price: 8999, category: 'Growth', title: 'Marketing Expert', desc: 'Growth Strategy: GTM strategies and customer acquisition.', icon: Megaphone, colors: 'bg-pink-50 text-pink-600 border-pink-100', showIf: 'all' },
    { id: 'cs_proj', price: 4999, category: 'Funding', title: 'Project Reports', desc: 'Business Model and Financial projections for funding.', icon: Activity, colors: 'bg-cyan-50 text-cyan-600 border-cyan-100', showIf: 'all' },
    { id: 'cs_bank', price: 0, category: 'Finance', title: 'Banking & Loans', desc: 'Funding Support: Current accounts and SME working capital.', icon: Landmark, colors: 'bg-green-50 text-green-600 border-green-100', showIf: 'all' },
];

export const PACKAGE_OPTIONS = [
    {
        id: 'pkg_prop',
        name: 'Proprietor Pack',
        price: 2999,
        ideal: 'Solo founders & freelancers',
        features: ['Sole Proprietorship Registration', 'MSME / Udyam Registration', 'GST Registration', 'Bank Account Opening Support'],
        bg: 'bg-orange-50 border-orange-200',
        textColor: 'text-orange-700',
        buttonBg: 'bg-orange-600 hover:bg-orange-700',
        addonCategories: [
            {
                title: "Legal & Setup Add-ons",
                id: "prop_legal",
                items: [
                    { id: 'tm', name: 'Trademark Registration', price: 6999 },
                    { id: 'fssai', name: 'FSSAI Basic License', price: 2499 },
                    { id: 'iec', name: 'IEC Code', price: 1999 },
                    { id: 'ca_support', name: 'CA Support (6 months)', price: 4999 },
                    { id: 'current_account', name: 'Current Account Opening', price: 999 }
                ]
            },
            {
                title: "Tech & Brand Kits",
                id: "prop_tech",
                items: [
                    { id: 'prop_logo', name: 'Startup Identity Kit (Logo, Domain, Email)', price: 1999 },
                    { id: 'prop_web', name: 'Growth Website Kit (Website + Content)', price: 4999 },
                    { id: 'prop_pitch', name: 'Sales Kit (Brochure + Pitch Deck)', price: 2999 }
                ]
            }
        ]
    },
    {
        id: 'pkg_startup',
        name: 'Startup Pack',
        price: 7999,
        ideal: '2-5 founders, growth-ready',
        features: ['Private Limited Company Registration', 'MOA + AOA Drafting', '2 DIN + 2 DSC', 'PAN + TAN for Company'],
        bg: 'bg-blue-50 border-blue-200',
        textColor: 'text-blue-700',
        buttonBg: 'bg-[#0052FF] hover:bg-blue-700',
        featured: true,
        addonCategories: [
            {
                title: "Legal & Setup Add-ons",
                id: "startup_legal",
                items: [
                    { id: 'tm2', name: 'Trademark Registration', price: 6999 },
                    { id: 'extra_din', name: 'Extra DIN + DSC', price: 1499 },
                    { id: 'sha', name: 'Shareholders Agreement', price: 4999 },
                    { id: 'fssai2', name: 'FSSAI License', price: 2499 },
                    { id: 'iec2', name: 'IEC Code', price: 1999 },
                    { id: 'ca_annual', name: 'CA Support (Annual)', price: 9999 }
                ]
            },
            {
                title: "Tech & Brand Kits",
                id: "startup_tech",
                items: [
                    { id: 'stu_brand', name: 'Pro Identity Kit (Logo, Brand Kit, UI/UX)', price: 4999 },
                    { id: 'stu_web', name: 'Elite Website Kit (Website + SEO)', price: 9999 },
                    { id: 'pitch_deck', name: 'Investor Pitch Deck & Projections', price: 2999 },
                    { id: 'stu_prod', name: 'Product Content Writing', price: 3999 }
                ]
            }
        ]
    },
    {
        id: 'pkg_scaleup',
        name: 'Scale-Up Pack',
        price: 14999,
        ideal: 'Funding-ready, full compliance',
        features: ['Private Limited / LLP (Choice)', 'MOA + AOA Drafting', 'GST Registration', 'Trademark Registration (1 Class)'],
        bg: 'bg-emerald-50 border-emerald-200',
        textColor: 'text-emerald-700',
        buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
        addonCategories: [
            {
                title: "Legal & Setup Add-ons",
                id: "scale_legal",
                items: [
                    { id: 'extra_tm', name: 'Trademark (2nd Class)', price: 5999 },
                    { id: 'extra_din2', name: 'Extra DIN + DSC', price: 1499 },
                    { id: 'vat', name: 'Professional Tax Reg', price: 1999 },
                    { id: 'esop', name: 'ESOP Policy Drafting', price: 7999 },
                    { id: 'roc', name: 'ROC Annual Filing (Yr 1)', price: 4999 },
                    { id: 'fdi', name: 'FDI Compliance Setup', price: 9999 },
                    { id: 'virtual_office', name: 'Virtual Office (1 yr)', price: 3999 }
                ]
            },
            {
                title: "Tech & Brand Kits",
                id: "scale_tech",
                items: [
                    { id: 'scl_app', name: 'Enterprise App/Platform Build', price: 19999 },
                    { id: 'scl_ecom', name: 'E-Commerce Store & Catalogue', price: 14999 },
                    { id: 'scl_brand', name: 'Complete Brand Refresh (All Assets)', price: 14999 }
                ]
            }
        ]
    }
];
