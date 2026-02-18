"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from '@/context/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PackageService {
    name: string;
    included: boolean;
}

interface Addon {
    id: string;
    name: string;
    description: string;
    price: number;
    emoji: string;
    popular?: boolean;
    serviceLink?: string; // editable by admin
}

interface ServiceInfo {
    what: string;
    benefits: string[];
    defaultLink: string;
}

interface Package {
    id: string;
    name: string;
    emoji: string;
    tagline: string;
    price: number;
    originalPrice: number;
    isVisible: boolean;
    isPopular: boolean;
    badge: string | null;
    color: string;
    gradient: string;
    services: PackageService[];
}

interface UserAnswers {
    businessType?: string;
    founderCount?: string;
    revenue?: string;
    funding?: string;
    contact?: { phone: string; email: string };
}

// ─── Add-ons Catalog (per package) ───────────────────────────────────────────
const PACKAGE_ADDONS: Record<string, Addon[]> = {
    proprietor: [
        { id: "tm", name: "Trademark Registration", description: "Protect your brand name & logo (1 class)", price: 6999, emoji: "™️", popular: true },
        { id: "fssai", name: "FSSAI Basic License", description: "Mandatory for food businesses", price: 2499, emoji: "🍽️" },
        { id: "iec", name: "IEC Code", description: "Import Export Code for trading businesses", price: 1999, emoji: "🌐" },
        { id: "ca_support", name: "CA Support (6 months)", description: "Dedicated CA for ITR, GST returns", price: 4999, emoji: "👨‍💼" },
        { id: "current_account", name: "Current Account Opening", description: "Assisted bank account setup", price: 999, emoji: "🏦" },
    ],
    startup: [
        { id: "tm", name: "Trademark Registration", description: "Protect your brand name & logo (1 class)", price: 6999, emoji: "™️", popular: true },
        { id: "extra_din", name: "Extra DIN + DSC", description: "For additional directors (per person)", price: 1499, emoji: "🪪" },
        { id: "sha", name: "Shareholders Agreement (Custom)", description: "Lawyer-drafted custom SHA", price: 4999, emoji: "📄" },
        { id: "pitch_deck", name: "Investor Pitch Deck", description: "Professional pitch deck template", price: 2999, emoji: "📊", popular: true },
        { id: "fssai", name: "FSSAI License", description: "Mandatory for food businesses", price: 2499, emoji: "🍽️" },
        { id: "iec", name: "IEC Code", description: "Import Export Code", price: 1999, emoji: "🌐" },
        { id: "ca_annual", name: "CA Support (Annual)", description: "ITR, GST, MCA compliance", price: 9999, emoji: "👨‍💼" },
    ],
    scaleup: [
        { id: "extra_tm", name: "Trademark (2nd Class)", description: "Protect in an additional class", price: 5999, emoji: "™️" },
        { id: "extra_din", name: "Extra DIN + DSC", description: "For additional directors", price: 1499, emoji: "🪪" },
        { id: "vat", name: "Professional Tax Registration", description: "State-level PT registration", price: 1999, emoji: "📋" },
        { id: "esop", name: "ESOP Policy Drafting", description: "Employee stock option plan", price: 7999, emoji: "📈", popular: true },
        { id: "roc", name: "ROC Annual Filing (Year 1)", description: "MCA annual return filing", price: 4999, emoji: "🗂️" },
        { id: "fdi", name: "FDI Compliance Setup", description: "For foreign investment readiness", price: 9999, emoji: "🌍" },
        { id: "virtual_office", name: "Virtual Office Address", description: "Premium business address (1 year)", price: 3999, emoji: "🏢", popular: true },
    ],
};

// ─── Service Info Catalog ─────────────────────────────────────────────────────
// Each service id maps to: what it is, benefits, and a default page link
const SERVICE_INFO: Record<string, ServiceInfo> = {
    tm: {
        what: "Trademark Registration protects your brand name, logo, and tagline legally under the Trade Marks Act, 1999.",
        benefits: [
            "Exclusive rights to use your brand name/logo in India",
            "Legal protection against copycats & infringement",
            "Builds brand trust and credibility with customers",
            "Required for Amazon Brand Registry & export markets",
        ],
        defaultLink: "/services/trademark",
    },
    extra_tm: {
        what: "Register your trademark in a second class to cover additional product/service categories.",
        benefits: [
            "Protects your brand across multiple business verticals",
            "Prevents competitors from using your brand in related fields",
            "Stronger legal standing in disputes",
        ],
        defaultLink: "/services/trademark",
    },
    fssai: {
        what: "FSSAI License is mandatory for any business involved in food manufacturing, processing, packaging, or distribution.",
        benefits: [
            "Legally required to sell, manufacture, or distribute food",
            "Builds consumer trust with the FSSAI logo",
            "Avoid heavy penalties and business shutdown",
            "Required for Swiggy, Zomato, and food export",
        ],
        defaultLink: "/services/fssai",
    },
    iec: {
        what: "Import Export Code (IEC) is a 10-digit code issued by DGFT, mandatory for any business doing international trade.",
        benefits: [
            "Legally required to import or export goods/services",
            "One-time registration, lifetime validity",
            "Enables access to government export benefits & schemes",
            "Required for foreign currency payments via banks",
        ],
        defaultLink: "/services/iec",
    },
    ca_support: {
        what: "Dedicated CA support for 6 months covering ITR filing, GST returns, and basic compliance queries.",
        benefits: [
            "Monthly GST return filing (GSTR-1, GSTR-3B)",
            "Annual Income Tax Return (ITR) filing",
            "Compliance reminders so you never miss a deadline",
            "Direct CA access via WhatsApp for quick queries",
        ],
        defaultLink: "/services/ca-support",
    },
    ca_annual: {
        what: "Full-year dedicated CA support covering GST, ITR, MCA filings, and compliance for your company.",
        benefits: [
            "All GST returns + annual ITR filing covered",
            "MCA annual return (AOC-4, MGT-7) filing",
            "TDS filing and advance tax computation",
            "Unlimited CA consultations for the year",
        ],
        defaultLink: "/services/ca-support",
    },
    current_account: {
        what: "Assisted current account opening with our partner banks — zero paperwork hassle for you.",
        benefits: [
            "Dedicated relationship manager from the bank",
            "Faster approval with our bank partnerships",
            "Zero balance options available for startups",
            "Required for business payments & GST compliance",
        ],
        defaultLink: "/services/banking",
    },
    extra_din: {
        what: "Director Identification Number (DIN) + Digital Signature Certificate (DSC) for each additional director.",
        benefits: [
            "Mandatory for every director of a company",
            "DSC required for MCA filings and e-signing",
            "Quick processing — 1-2 business days",
            "Lifetime validity for DIN",
        ],
        defaultLink: "/services/company-registration",
    },
    sha: {
        what: "A custom Shareholders Agreement drafted by our legal team, defining rights, responsibilities, and exit clauses.",
        benefits: [
            "Protects founder rights and equity splits",
            "Defines vesting schedules and lock-in periods",
            "Covers dispute resolution and exit mechanisms",
            "Essential for investor due diligence",
        ],
        defaultLink: "/services/legal",
    },
    pitch_deck: {
        what: "A professionally designed investor pitch deck template tailored to your business model and sector.",
        benefits: [
            "Investor-ready structure (problem, solution, market, traction)",
            "Designed by startup pitch experts",
            "Editable PowerPoint + Google Slides format",
            "Increases chances of securing funding",
        ],
        defaultLink: "/services/pitch-deck",
    },
    vat: {
        what: "Professional Tax (PT) registration is a state-level tax mandatory for businesses with employees in most Indian states.",
        benefits: [
            "Legally required for businesses with salaried employees",
            "Avoid penalties from state labour department",
            "Simple one-time registration process",
            "Covers all employees under one registration",
        ],
        defaultLink: "/services/compliance",
    },
    esop: {
        what: "Employee Stock Option Plan (ESOP) policy drafted by our legal team to help you attract and retain top talent.",
        benefits: [
            "Attract senior talent without high cash salaries",
            "Legally compliant ESOP pool structure",
            "Vesting schedule and exercise price defined",
            "Required by investors before Series A",
        ],
        defaultLink: "/services/legal",
    },
    roc: {
        what: "ROC Annual Filing covers MCA annual returns (AOC-4 and MGT-7) for your company's first financial year.",
        benefits: [
            "Avoid ₹100/day penalty for late filing",
            "Maintain active company status with MCA",
            "Includes Director KYC (DIR-3 KYC)",
            "Handled end-to-end by our CA team",
        ],
        defaultLink: "/services/compliance",
    },
    fdi: {
        what: "FDI Compliance Setup prepares your company to receive foreign investment under FEMA and RBI guidelines.",
        benefits: [
            "FEMA-compliant share allotment structure",
            "FC-GPR filing with RBI after investment",
            "Valuation certificate from registered CA",
            "Opens doors to global investors and VCs",
        ],
        defaultLink: "/services/compliance",
    },
    virtual_office: {
        what: "A premium business address in a prime location for 1 year — use it for GST, MCA, and all official correspondence.",
        benefits: [
            "Prime city address without expensive office rent",
            "Valid for GST registration and company incorporation",
            "Mail handling and forwarding included",
            "Professional image for clients and investors",
        ],
        defaultLink: "/services/virtual-office",
    },
};

// ─── Default Package Config (Admin Editable) ──────────────────────────────────
const DEFAULT_PACKAGES: Package[] = [
    {
        id: "proprietor",
        name: "Proprietor Pack",
        emoji: "🏪",
        tagline: "Solo founders & freelancers",
        price: 2999,
        originalPrice: 4999,
        isVisible: true,
        isPopular: false,
        badge: "Best Value",
        color: "from-amber-500 to-orange-500",
        gradient: "from-amber-50 to-orange-50",
        services: [
            { name: "Sole Proprietorship Registration", included: true },
            { name: "MSME / Udyam Registration", included: true },
            { name: "GST Registration", included: true },
            { name: "Bank Account Opening Support", included: true },
            { name: "Digital Signature (DSC)", included: true },
            { name: "30-day Email Support", included: true },
            { name: "Shareholders Agreement", included: false },
            { name: "Trademark Registration", included: false },
            { name: "Dedicated CA Support", included: false },
        ],
    },
    {
        id: "startup",
        name: "Startup Pack",
        emoji: "🚀",
        tagline: "2-5 founders, growth-ready",
        price: 7999,
        originalPrice: 12999,
        isVisible: true,
        isPopular: true,
        badge: "Most Popular",
        color: "from-indigo-500 to-purple-600",
        gradient: "from-indigo-50 to-purple-50",
        services: [
            { name: "Private Limited Company Registration", included: true },
            { name: "MOA + AOA Drafting", included: true },
            { name: "2 DIN + 2 DSC", included: true },
            { name: "PAN + TAN for Company", included: true },
            { name: "GST Registration", included: true },
            { name: "Startup India Recognition", included: true },
            { name: "Shareholders Agreement Template", included: true },
            { name: "90-day WhatsApp Support", included: true },
            { name: "Trademark Registration", included: false },
        ],
    },
    {
        id: "scaleup",
        name: "Scale-Up Pack",
        emoji: "📈",
        tagline: "Funding-ready, full compliance",
        price: 14999,
        originalPrice: 22999,
        isVisible: true,
        isPopular: false,
        badge: "Premium",
        color: "from-emerald-500 to-teal-600",
        gradient: "from-emerald-50 to-teal-50",
        services: [
            { name: "Private Limited / LLP (Your Choice)", included: true },
            { name: "MOA + AOA Drafting", included: true },
            { name: "GST Registration", included: true },
            { name: "Trademark Registration (1 Class)", included: true },
            { name: "FSSAI / IEC / Sector License", included: true },
            { name: "Investor-Ready Pitch Deck Template", included: true },
            { name: "Compliance Calendar Setup", included: true },
            { name: "Dedicated CA Support (1 Year)", included: true },
            { name: "Priority WhatsApp + Call Support", included: true },
        ],
    },
];

// ─── AI Pack Generator Logic ──────────────────────────────────────────────────
function generateAIPack(answers: UserAnswers): {
    recommendedId: string;
    reason: string;
    customServices: string[];
    price: number;
    confidence: number;
} {
    const { businessType, founderCount, revenue, funding } = answers;

    let recommendedId = "startup";
    let reason = "";
    let customServices: string[] = [];
    let price = 7999;
    let confidence = 88;

    // Logic tree
    if (founderCount === "1") {
        recommendedId = "proprietor";
        price = 2999;
        reason = "Since you're a solo founder, Sole Proprietorship is the fastest and most cost-effective way to start legally.";
        customServices = ["Sole Proprietorship Registration", "MSME Registration", "GST Registration", "Bank Account Support"];
        confidence = 94;
    } else if (funding === "Yes, within 1 year" || founderCount === "4+") {
        recommendedId = "scaleup";
        price = 14999;
        reason = "With funding plans and multiple founders, Private Limited Company with full compliance setup is essential for investor confidence.";
        customServices = ["Private Limited Company", "MOA + AOA", "GST Registration", "Trademark (1 Class)", "Compliance Calendar", "Dedicated CA Support"];
        confidence = 96;
    } else if (revenue === "> ₹1Cr" || revenue === "₹50L-1Cr") {
        recommendedId = "scaleup";
        price = 12999;
        reason = "Your revenue target requires a robust legal structure with full compliance to avoid penalties and enable growth.";
        customServices = ["Private Limited Company", "GST Registration", "Trademark Registration", "Compliance Calendar", "CA Support"];
        confidence = 91;
    } else {
        recommendedId = "startup";
        price = 7999;
        reason = "Private Limited Company is perfect for your team size and growth plans — gives you credibility, limited liability, and funding readiness.";
        customServices = ["Private Limited Company", "2 DIN + 2 DSC", "GST Registration", "Startup India Recognition", "Shareholders Agreement"];
        confidence = 89;
    }

    // Add sector-specific services
    if (businessType === "🍕 Food/F&B") {
        customServices.push("FSSAI License");
        price += 1500;
    }
    if (businessType === "📦 E-commerce") {
        customServices.push("GST Registration", "IEC Code");
    }

    return { recommendedId, reason, customServices, price, confidence };
}

// ─── Flow Questions ───────────────────────────────────────────────────────────
const FLOW_QUESTIONS = [
    {
        id: "businessType",
        question: "What kind of business are you starting?",
        emoji: "🏢",
        options: ["🛒 Retail/Trade", "💻 Tech/SaaS", "🍕 Food/F&B", "🏭 Manufacturing", "💼 Services", "📦 E-commerce"],
    },
    {
        id: "founderCount",
        question: "How many founders?",
        emoji: "👥",
        options: ["1", "2", "3", "4+"],
    },
    {
        id: "revenue",
        question: "Expected revenue in Year 1?",
        emoji: "💰",
        options: ["< ₹10L", "₹10-50L", "₹50L-1Cr", "> ₹1Cr"],
    },
    {
        id: "funding",
        question: "Planning to raise investment?",
        emoji: "🎯",
        options: ["Yes, within 1 year", "Maybe, in future", "No, bootstrapped"],
    },
];

// ─── Service Detail Popup ────────────────────────────────────────────────────
function ServiceDetailPopup({
    addon,
    onClose,
}: {
    addon: Addon;
    onClose: () => void;
}) {
    const info = SERVICE_INFO[addon.id];
    const link = addon.serviceLink || info?.defaultLink || "#";

    if (!info) return null;

    return (
        <div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-5 text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-3xl mb-2">{addon.emoji}</div>
                            <h3 className="text-base font-black leading-tight">{addon.name}</h3>
                            <div className="mt-1.5 inline-flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full">
                                <span className="text-xs font-black">+₹{addon.price.toLocaleString()}</span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                        >
                            <span className="material-icons text-sm">close</span>
                        </button>
                    </div>
                </div>
                {/* Body */}
                <div className="p-5">
                    <div className="mb-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">What is this?</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{info.what}</p>
                    </div>
                    <div className="mb-5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Benefits</p>
                        <ul className="space-y-2">
                            {info.benefits.map((b, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                                    <span className="material-icons text-green-500 text-base flex-shrink-0 mt-0.5">check_circle</span>
                                    {b}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black text-sm shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] transition-all"
                    >
                        <span className="material-icons text-sm">open_in_new</span>
                        Get More Details
                    </a>
                </div>
            </div>
        </div>
    );
}

// ─── Admin Package Editor Modal ──────────────────────────────────────────────
function AdminPackageEditor({
    packages,
    onSave,
    onClose,
}: {
    packages: Package[];
    onSave: (pkgs: Package[]) => void;
    onClose: () => void;
}) {
    const [editPkgs, setEditPkgs] = useState<Package[]>(packages.map(p => ({ ...p })));
    const [activeIdx, setActiveIdx] = useState(0);
    const [activeAdminTab, setActiveAdminTab] = useState<'packages' | 'links'>('packages');
    const [addonLinks, setAddonLinks] = useState<Record<string, string>>(() => {
        const init: Record<string, string> = {};
        Object.values(PACKAGE_ADDONS).flat().forEach(a => {
            if (a.serviceLink) init[a.id] = a.serviceLink;
        });
        return init;
    });

    const pkg = editPkgs[activeIdx];
    const update = <K extends keyof Package>(key: K, val: Package[K]) => {
        setEditPkgs(prev => prev.map((p, i) => i === activeIdx ? { ...p, [key]: val } : p));
    };
    const toggleService = (sIdx: number) => {
        update("services", pkg.services.map((s, i) => i === sIdx ? { ...s, included: !s.included } : s));
    };
    const addService = () => {
        update("services", [...pkg.services, { name: "New Service", included: true }]);
    };
    const removeService = (sIdx: number) => {
        update("services", pkg.services.filter((_, i) => i !== sIdx));
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-black">&#9881;&#65039; Admin Package Editor</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Edit prices, services, visibility &amp; service links</p>
                    </div>
                    <button onClick={onClose} className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors">
                        <span className="material-icons text-sm">close</span>
                    </button>
                </div>

                {/* Top-level tabs */}
                <div className="flex border-b border-slate-200 bg-slate-50 flex-shrink-0">
                    <button
                        onClick={() => setActiveAdminTab('packages')}
                        className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeAdminTab === 'packages' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-700'}`}
                    >
                        <span className="material-icons text-sm">inventory_2</span>
                        Packages
                    </button>
                    <button
                        onClick={() => setActiveAdminTab('links')}
                        className={`flex-1 py-3 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${activeAdminTab === 'links' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-700'}`}
                    >
                        <span className="material-icons text-sm">link</span>
                        Service Links
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">

                    {/* PACKAGES TAB */}
                    {activeAdminTab === 'packages' && (
                        <div className="p-6 space-y-5">
                            {/* Package sub-tabs */}
                            <div className="flex gap-2 flex-wrap">
                                {editPkgs.map((p, i) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setActiveIdx(i)}
                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-2 ${activeIdx === i ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-400 hover:border-indigo-300'}`}
                                    >
                                        {p.emoji} {p.name.split(' ')[0]}
                                    </button>
                                ))}
                            </div>

                            {/* Toggles */}
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <div onClick={() => update("isVisible", !pkg.isVisible)} className={`w-11 h-6 rounded-full transition-colors relative ${pkg.isVisible ? "bg-green-500" : "bg-slate-300"}`}>
                                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${pkg.isVisible ? "left-5" : "left-0.5"}`} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">Visible</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <div onClick={() => update("isPopular", !pkg.isPopular)} className={`w-11 h-6 rounded-full transition-colors relative ${pkg.isPopular ? "bg-indigo-500" : "bg-slate-300"}`}>
                                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${pkg.isPopular ? "left-5" : "left-0.5"}`} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">Popular Badge</span>
                                </label>
                            </div>

                            {/* Prices */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-600 mb-1.5 uppercase tracking-wider">Price (&#8377;)</label>
                                    <input type="number" value={pkg.price} onChange={(e) => update("price", Number(e.target.value))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-indigo-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-600 mb-1.5 uppercase tracking-wider">Original Price (&#8377;)</label>
                                    <input type="number" value={pkg.originalPrice} onChange={(e) => update("originalPrice", Number(e.target.value))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-indigo-500 focus:outline-none" />
                                </div>
                            </div>

                            {/* Badge */}
                            <div>
                                <label className="block text-xs font-black text-slate-600 mb-1.5 uppercase tracking-wider">Badge Text</label>
                                <input type="text" value={pkg.badge || ""} onChange={(e) => update("badge", e.target.value || null)} placeholder="e.g. Most Popular, Limited Offer" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:border-indigo-500 focus:outline-none" />
                            </div>

                            {/* Services */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Services Included</label>
                                    <button onClick={addService} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                                        <span className="material-icons text-sm">add_circle</span> Add Service
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {pkg.services.map((svc, sIdx) => (
                                        <div key={sIdx} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                                            <button onClick={() => toggleService(sIdx)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${svc.included ? "bg-green-500 border-green-500" : "border-slate-300"}`}>
                                                {svc.included && <span className="material-icons text-white text-[10px]">check</span>}
                                            </button>
                                            <input
                                                type="text"
                                                value={svc.name}
                                                onChange={(e) => {
                                                    const updated = [...pkg.services];
                                                    updated[sIdx] = { ...updated[sIdx], name: e.target.value };
                                                    update("services", updated);
                                                }}
                                                className="flex-1 bg-transparent text-sm text-slate-700 font-medium focus:outline-none"
                                            />
                                            <button onClick={() => removeService(sIdx)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                <span className="material-icons text-sm">delete</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SERVICE LINKS TAB */}
                    {activeAdminTab === 'links' && (
                        <div className="p-6 space-y-4">
                            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                                <p className="text-xs font-black text-indigo-700 mb-1">How to use</p>
                                <p className="text-xs text-indigo-600 leading-relaxed">
                                    Paste your website URL for each add-on. When users click the info button on an add-on, a popup shows with a &quot;Get More Details&quot; button linking to this URL.
                                </p>
                            </div>
                            {Array.from(new Map(
                                Object.values(PACKAGE_ADDONS).flat().map((a) => [a.id, a])
                            ).values()).map((addon) => {
                                const info = SERVICE_INFO[addon.id];
                                return (
                                    <div key={addon.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                        <div className="flex items-center gap-2 mb-2.5">
                                            <span className="text-xl">{addon.emoji}</span>
                                            <div>
                                                <p className="text-sm font-black text-slate-800">{addon.name}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">{info?.defaultLink || '#'} (default)</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="url"
                                                value={addonLinks[addon.id] || ''}
                                                onChange={(e) => setAddonLinks(prev => ({ ...prev, [addon.id]: e.target.value }))}
                                                placeholder="Paste your service page URL here..."
                                                className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none bg-white"
                                            />
                                            {addonLinks[addon.id] && (
                                                <a href={addonLinks[addon.id]} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-200 transition-colors flex-shrink-0">
                                                    <span className="material-icons text-sm">open_in_new</span>
                                                </a>
                                            )}
                                            {addonLinks[addon.id] && (
                                                <button onClick={() => setAddonLinks(prev => { const n = { ...prev }; delete n[addon.id]; return n; })} className="w-8 h-8 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors flex-shrink-0">
                                                    <span className="material-icons text-sm">clear</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 flex gap-3 flex-shrink-0">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            Object.entries(addonLinks).forEach(([id, url]) => {
                                Object.values(PACKAGE_ADDONS).flat().forEach((a) => {
                                    if (a.id === id) a.serviceLink = url || undefined;
                                });
                            });
                            onSave(editPkgs);
                            onClose();
                        }}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold shadow-lg hover:shadow-indigo-500/30 transition-all"
                    >
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    );
}


// ─── Quick Flow Popup ─────────────────────────────────────────────────────────
function QuickFlowPopup({
    onComplete,
    onClose,
    existingAnswers,
}: {
    onComplete: (answers: UserAnswers) => void;
    onClose: () => void;
    existingAnswers: UserAnswers;
}) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<UserAnswers>(existingAnswers);
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const missingQuestions = FLOW_QUESTIONS.filter(
        (q) => !existingAnswers[q.id as keyof UserAnswers]
    );
    const questions = missingQuestions.length > 0 ? missingQuestions : FLOW_QUESTIONS;
    const isContactStep = step === questions.length;
    const totalSteps = questions.length + 1; // +1 for contact
    const progress = ((step + 1) / totalSteps) * 100;

    const currentQ = questions[step];

    const handleSelect = (value: string) => {
        if (!currentQ) return;
        const updated = { ...answers, [currentQ.id]: value };
        setAnswers(updated);
        setTimeout(() => setStep((s) => s + 1), 300);
    };

    const handleComplete = () => {
        if (!phone || !email) return;
        onComplete({ ...answers, contact: { phone, email } });
    };

    return (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-400">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-lg">🤖</div>
                            <div>
                                <h3 className="text-sm font-black">AI Pack Generator</h3>
                                <p className="text-[10px] text-indigo-200">Customizing your perfect package</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors">
                            <span className="material-icons text-sm">close</span>
                        </button>
                    </div>
                    {/* Progress */}
                    <div className="flex justify-between text-[10px] mb-1.5 font-bold">
                        <span>Step {Math.min(step + 1, totalSteps)} of {totalSteps}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1.5">
                        <div
                            className="bg-white h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    {!isContactStep && currentQ ? (
                        <>
                            <div className="text-3xl mb-3">{currentQ.emoji}</div>
                            <h3 className="text-lg font-black text-slate-900 mb-5">{currentQ.question}</h3>
                            <div className="grid grid-cols-2 gap-2.5">
                                {currentQ.options.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => handleSelect(opt)}
                                        className={`p-3.5 rounded-2xl border-2 text-left text-sm font-bold transition-all hover:scale-[1.02] ${answers[currentQ.id as keyof UserAnswers] === opt
                                            ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                                            : "border-slate-100 hover:border-indigo-300 text-slate-700 bg-slate-50 hover:bg-white"
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-3xl mb-3">📬</div>
                            <h3 className="text-lg font-black text-slate-900 mb-2">Almost done!</h3>
                            <p className="text-sm text-slate-500 mb-5">Where should we send your custom AI pack?</p>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-black text-slate-600 mb-1.5 uppercase tracking-wider">📱 WhatsApp Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="10-digit mobile number"
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:border-indigo-500 focus:outline-none transition-colors"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-600 mb-1.5 uppercase tracking-wider">📧 Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:border-indigo-500 focus:outline-none transition-colors"
                                    />
                                </div>
                                <button
                                    onClick={handleComplete}
                                    disabled={!phone || !email}
                                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-black text-sm shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <span className="material-icons text-sm">auto_awesome</span>
                                    Generate My AI Pack!
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Back button */}
                {step > 0 && !isContactStep && (
                    <div className="px-6 pb-5">
                        <button onClick={() => setStep((s) => s - 1)} className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors">
                            <span className="material-icons text-sm">arrow_back</span> Back
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── AI Pack Result Card ──────────────────────────────────────────────────────
function AIPackResult({
    answers,
    packages,
    onGetStarted,
}: {
    answers: UserAnswers;
    packages: Package[];
    onGetStarted: (pkg: Package & { selectedAddons: Addon[] }) => void;
}) {
    const result = generateAIPack(answers);
    const basePkg = packages.find((p) => p.id === result.recommendedId) || packages[1];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 text-white overflow-hidden shadow-2xl">
                {/* Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-32 translate-x-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl translate-y-24 -translate-x-24" />

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🤖</span>
                                <span className="text-xs font-black uppercase tracking-widest text-indigo-300">AI Recommended</span>
                                <span className="bg-green-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{result.confidence}% Match</span>
                            </div>
                            <h3 className="text-2xl font-black">{basePkg.emoji} {basePkg.name}</h3>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-black">₹{result.price.toLocaleString()}</div>
                            <div className="text-xs text-slate-400 line-through">₹{basePkg.originalPrice.toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Reason */}
                    <div className="bg-white/10 rounded-2xl p-4 mb-4 border border-white/10">
                        <p className="text-sm text-slate-200 leading-relaxed">
                            <span className="font-black text-white">Why this pack? </span>
                            {result.reason}
                        </p>
                    </div>

                    {/* Custom Services */}
                    <div className="mb-5">
                        <p className="text-xs font-black uppercase tracking-widest text-indigo-300 mb-2">What&apos;s included for you:</p>
                        <div className="grid grid-cols-2 gap-1.5">
                            {result.customServices.map((svc, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                                    <span className="material-icons text-green-400 text-sm">check_circle</span>
                                    {svc}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <button
                        onClick={() => onGetStarted({ ...basePkg, price: result.price, selectedAddons: [] })}
                        className="w-full py-4 bg-white text-indigo-900 rounded-2xl font-black text-sm shadow-2xl hover:shadow-white/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                        <span className="material-icons">rocket_launch</span>
                        Get Started with This Pack
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Package Card ─────────────────────────────────────────────────────────────
function PackageCard({
    pkg,
    onSelect,
}: {
    pkg: Package;
    onSelect: (pkg: Package & { selectedAddons: Addon[] }) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const [addonsOpen, setAddonsOpen] = useState(false);
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [infoAddon, setInfoAddon] = useState<Addon | null>(null);

    const addons = PACKAGE_ADDONS[pkg.id] || [];
    const selectedAddonObjects = addons.filter((a) => selectedAddons.includes(a.id));
    const addonsTotal = selectedAddonObjects.reduce((sum, a) => sum + a.price, 0);
    const grandTotal = pkg.price + addonsTotal;

    const toggleAddon = (id: string) => {
        setSelectedAddons((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleGetStarted = () => {
        onSelect({ ...pkg, price: grandTotal, selectedAddons: selectedAddonObjects });
    };

    return (
        <div className={`relative bg-white rounded-3xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-visible ${pkg.isPopular ? "border-indigo-500 shadow-xl shadow-indigo-100" : "border-slate-100 shadow-md"
            }`}>
            {/* Popular Badge */}
            {pkg.isPopular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center text-[10px] font-black py-1.5 uppercase tracking-widest rounded-t-3xl">
                    ⭐ {pkg.badge || "Most Popular"}
                </div>
            )}

            <div className={`p-6 ${pkg.isPopular ? "pt-10" : ""}`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        {!pkg.isPopular && pkg.badge && (
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-gradient-to-r ${pkg.color} text-white mb-2 inline-block`}>
                                {pkg.badge}
                            </span>
                        )}
                        <div className="text-3xl mb-1">{pkg.emoji}</div>
                        <h3 className="text-lg font-black text-slate-900">{pkg.name}</h3>
                        <p className="text-xs text-slate-500 font-medium">{pkg.tagline}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-black text-slate-900">₹{pkg.price.toLocaleString()}</div>
                        <div className="text-xs text-slate-400 line-through">₹{pkg.originalPrice.toLocaleString()}</div>
                        <div className="text-[10px] font-black text-green-600">
                            Save ₹{(pkg.originalPrice - pkg.price).toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Services Preview */}
                <div className="space-y-1.5 mb-4">
                    {pkg.services.slice(0, expanded ? pkg.services.length : 4).map((svc, i) => (
                        <div key={i} className={`flex items-center gap-2 text-xs ${svc.included ? "text-slate-700" : "text-slate-300"}`}>
                            <span className={`material-icons text-sm ${svc.included ? "text-green-500" : "text-slate-200"}`}>
                                {svc.included ? "check_circle" : "cancel"}
                            </span>
                            {svc.name}
                        </div>
                    ))}
                </div>

                {pkg.services.length > 4 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 mb-4 flex items-center gap-1 transition-colors"
                    >
                        <span className="material-icons text-sm">{expanded ? "expand_less" : "expand_more"}</span>
                        {expanded ? "Show less" : `+${pkg.services.length - 4} more services`}
                    </button>
                )}

                {/* CTA */}
                <button
                    onClick={handleGetStarted}
                    className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all hover:scale-[1.02] shadow-lg mb-3 ${pkg.isPopular
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/30"
                        : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-slate-900/20"
                        }`}
                >
                    {addonsTotal > 0
                        ? `Get Started · ₹${grandTotal.toLocaleString()} →`
                        : "Get Started →"}
                </button>

                {/* ── Add-ons Toggle Button ── */}
                <button
                    onClick={() => setAddonsOpen((o) => !o)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl border-2 text-xs font-black transition-all ${addonsOpen
                        ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50"
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <span className="material-icons text-sm">add_shopping_cart</span>
                        Add-ons
                        {selectedAddons.length > 0 && (
                            <span className="bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                                {selectedAddons.length}
                            </span>
                        )}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                        {addonsTotal > 0 && (
                            <span className="text-indigo-600 font-black">+₹{addonsTotal.toLocaleString()}</span>
                        )}
                        <span className="material-icons text-sm transition-transform duration-300" style={{ transform: addonsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                            expand_more
                        </span>
                    </span>
                </button>
            </div>

            {/* ── Add-ons Dropdown Panel ── */}
            <div
                className={`overflow-hidden transition-all duration-400 ease-in-out ${addonsOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                style={{ transitionProperty: 'max-height, opacity' }}
            >
                <div className="px-6 pb-5 border-t border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-3">
                        ✨ Enhance Your Package
                    </p>
                    <div className="space-y-2">
                        {addons.map((addon) => {
                            const isSelected = selectedAddons.includes(addon.id);
                            return (
                                <button
                                    key={addon.id}
                                    onClick={() => toggleAddon(addon.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all hover:scale-[1.01] ${isSelected
                                        ? "border-indigo-500 bg-indigo-50"
                                        : "border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50"
                                        }`}
                                >
                                    {/* Checkbox */}
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? "bg-indigo-600 border-indigo-600" : "border-slate-300"
                                        }`}>
                                        {isSelected && <span className="material-icons text-white text-[10px]">check</span>}
                                    </div>

                                    {/* Emoji */}
                                    <span className="text-lg flex-shrink-0">{addon.emoji}</span>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-xs font-black ${isSelected ? "text-indigo-900" : "text-slate-800"
                                                }`}>{addon.name}</span>
                                            {addon.popular && (
                                                <span className="text-[8px] font-black bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full uppercase">Popular</span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-slate-400 truncate">{addon.description}</p>
                                    </div>

                                    {/* Price */}
                                    <div className="text-right flex-shrink-0">
                                        <div className={`text-xs font-black ${isSelected ? "text-indigo-600" : "text-slate-700"
                                            }`}>+₹{addon.price.toLocaleString()}</div>
                                    </div>

                                    {/* Info button */}
                                    {SERVICE_INFO[addon.id] && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setInfoAddon(addon); }}
                                            className="w-6 h-6 rounded-full bg-slate-100 hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 flex items-center justify-center flex-shrink-0 transition-colors"
                                            title="Learn more"
                                        >
                                            <span className="material-icons text-[13px]">info</span>
                                        </button>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Add-ons Summary */}
                    {selectedAddons.length > 0 && (
                        <div className="mt-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-600 font-bold">Base Pack</span>
                                <span className="font-black text-slate-800">₹{pkg.price.toLocaleString()}</span>
                            </div>
                            {selectedAddonObjects.map((a) => (
                                <div key={a.id} className="flex items-center justify-between text-xs mt-1">
                                    <span className="text-slate-500">{a.emoji} {a.name}</span>
                                    <span className="font-bold text-indigo-600">+₹{a.price.toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="border-t border-indigo-200 mt-2 pt-2 flex items-center justify-between">
                                <span className="text-xs font-black text-slate-800">Total</span>
                                <span className="text-sm font-black text-indigo-700">₹{grandTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Service Detail Popup */}
            {infoAddon && (
                <ServiceDetailPopup addon={infoAddon} onClose={() => setInfoAddon(null)} />
            )}
        </div>
    );
}

// ─── Get Started Modal ─────────────────────────────────────────────────────────────
function GetStartedModal({
    pkg,
    selectedAddons,
    onClose,
}: {
    pkg: Package;
    selectedAddons: Addon[];
    onClose: () => void;
}) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    // Use Auth Context to get Guest ID
    const { guestId, user } = useAuth();

    const addonsTotal = selectedAddons.reduce((s, a) => s + a.price, 0);
    const basePrice = pkg.price - addonsTotal; // base price without addons

    const handleSubmit = () => {
        if (!name || !phone || !email) return;
        // Save purchased package to localStorage for workspace dashboard
        const purchaseData = {
            packageId: pkg.id,
            packageName: pkg.name,
            packageEmoji: pkg.emoji,
            packageColor: pkg.color,
            services: pkg.services,
            addons: selectedAddons,
            totalPrice: pkg.price,
            purchasedAt: new Date().toISOString(),
            userName: name,
            userPhone: phone,
            userEmail: email,
            guestId: guestId, // Link to Guest ID
            userId: user?.uid || null // Link to User ID if logged in
        };
        localStorage.setItem('smb_purchased_package', JSON.stringify(purchaseData));
        console.log("Lead captured:", { name, phone, email, package: pkg.id, addons: selectedAddons.map(a => a.id), guestId });
        setSubmitted(true);
        // Redirect to workspace after 2 seconds
        setTimeout(() => {
            window.location.href = '/workspace';
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-400 max-h-[95vh] flex flex-col">
                <div className={`bg-gradient-to-r ${pkg.color} p-5 text-white flex-shrink-0`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl mb-1">{pkg.emoji}</div>
                            <h3 className="text-lg font-black">{pkg.name}</h3>
                            <p className="text-sm opacity-80">₹{pkg.price.toLocaleString()} — Let&apos;s get started!</p>
                        </div>
                        <button onClick={onClose} className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors">
                            <span className="material-icons text-sm">close</span>
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {!submitted ? (
                        <>
                            {/* Order Summary */}
                            {selectedAddons.length > 0 && (
                                <div className="mb-5 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Order Summary</p>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-600 font-bold">{pkg.emoji} {pkg.name} (Base)</span>
                                            <span className="font-black text-slate-800">₹{basePrice.toLocaleString()}</span>
                                        </div>
                                        {selectedAddons.map((a) => (
                                            <div key={a.id} className="flex justify-between text-xs">
                                                <span className="text-slate-500">{a.emoji} {a.name}</span>
                                                <span className="font-bold text-indigo-600">+₹{a.price.toLocaleString()}</span>
                                            </div>
                                        ))}
                                        <div className="border-t border-slate-200 pt-2 mt-1 flex justify-between">
                                            <span className="text-xs font-black text-slate-900">Total</span>
                                            <span className="text-sm font-black text-indigo-700">₹{pkg.price.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <h4 className="text-base font-black text-slate-900 mb-1">Your Details</h4>
                            <p className="text-xs text-slate-500 mb-5">Our expert will contact you within 2 hours</p>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-black text-slate-600 mb-1.5 uppercase tracking-wider">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your name"
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:border-indigo-500 focus:outline-none transition-colors"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-600 mb-1.5 uppercase tracking-wider">📱 WhatsApp Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="10-digit mobile number"
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:border-indigo-500 focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-600 mb-1.5 uppercase tracking-wider">📧 Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:border-indigo-500 focus:outline-none transition-colors"
                                    />
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!name || !phone || !email}
                                    className={`w-full py-4 rounded-2xl font-black text-sm shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-white bg-gradient-to-r ${pkg.color}`}
                                >
                                    🚀 Confirm & Get Expert Call
                                </button>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
                                <a href={`https://wa.me/91XXXXXXXXXX?text=Hi! I'm interested in ${pkg.name} (₹${pkg.price})`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-green-600 transition-colors font-bold">
                                    <span className="material-icons text-sm">chat</span> WhatsApp Us
                                </a>
                                <span>•</span>
                                <a href={`mailto:hello@setmybizz.in?subject=Inquiry: ${pkg.name}`} className="flex items-center gap-1 hover:text-indigo-600 transition-colors font-bold">
                                    <span className="material-icons text-sm">mail</span> Email Us
                                </a>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="text-6xl mb-4">🎉</div>
                            <h4 className="text-xl font-black text-slate-900 mb-2">You&apos;re all set!</h4>
                            <p className="text-sm text-slate-500 mb-4">Our expert will call you on <strong>{phone}</strong> within 2 hours.</p>
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-sm text-green-800 font-medium">
                                ✅ Lead captured successfully. Check your WhatsApp for confirmation.
                            </div>
                            <button onClick={onClose} className="mt-5 w-full py-3 rounded-2xl bg-slate-900 text-white font-black text-sm">
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Inline AI Chat Assistant ─────────────────────────────────────────────────
function InlineAIChat() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "ai", text: "👋 Hi! I'm your Incorporation AI. Ask me anything about company registration, packages, or compliance in India!" },
    ]);
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    const respond = (q: string) => {
        const ql = q.toLowerCase();
        if (ql.includes("pvt") || ql.includes("private limited")) return "Private Limited Company is best for startups with 2+ founders. Benefits: limited liability, easy funding, separate legal entity. Timeline: 10-15 days. Our Startup Pack covers this at ₹7,999.";
        if (ql.includes("llp")) return "LLP (Limited Liability Partnership) is great for professional services firms. Lower compliance than Pvt Ltd. Best for CA firms, law firms, consultancies. Covered in our Scale-Up Pack.";
        if (ql.includes("proprietor") || ql.includes("sole")) return "Sole Proprietorship is the simplest structure — no separate legal entity, but easiest to start. Best for solo founders with < ₹40L turnover. Our Proprietor Pack at ₹2,999 covers this.";
        if (ql.includes("gst")) return "GST registration is mandatory if turnover > ₹40L (goods) or ₹20L (services). Timeline: 3-7 days. All our packages include GST registration.";
        if (ql.includes("trademark") || ql.includes("tm")) return "Trademark protects your brand name & logo. Timeline: 12-18 months for full registration. Included in our Scale-Up Pack (₹14,999). We handle the filing and follow-up.";
        if (ql.includes("time") || ql.includes("how long")) return "Timelines: Pvt Ltd: 10-15 days | Proprietorship: 3-5 days | GST: 3-7 days | Trademark: 12-18 months. We handle everything — you just provide documents!";
        if (ql.includes("document")) return "For Pvt Ltd, you need: PAN + Aadhaar of all directors, passport photos, address proof, rent agreement (if rented office). We guide you through every document step-by-step.";
        if (ql.includes("price") || ql.includes("cost") || ql.includes("package")) return "Our packages: 🏪 Proprietor Pack: ₹2,999 | 🚀 Startup Pack: ₹7,999 (Most Popular) | 📈 Scale-Up Pack: ₹14,999. Click 'Get AI Pack' for a personalized recommendation!";
        if (ql.includes("din") || ql.includes("dsc")) return "DIN (Director Identification Number) and DSC (Digital Signature Certificate) are mandatory for company directors. Both are included in our Startup and Scale-Up packs.";
        return "Great question! I can help with: company registration, GST, trademark, compliance, documents, and package selection. What would you like to know more about?";
    };

    const send = () => {
        if (!input.trim()) return;
        const userMsg = input;
        setMessages((m) => [...m, { role: "user", text: userMsg }]);
        setInput("");
        setTimeout(() => {
            setMessages((m) => [...m, { role: "ai", text: respond(userMsg) }]);
        }, 700);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            {open && (
                <div className="mb-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-sm">🤖</div>
                            <div>
                                <p className="text-xs font-black">Incorporation AI</p>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-[9px] text-blue-200">Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setOpen(false)} className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors">
                            <span className="material-icons text-sm">close</span>
                        </button>
                    </div>
                    <div className="h-64 overflow-y-auto p-4 space-y-3 bg-slate-50">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${m.role === "user" ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-800"}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>
                    <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && send()}
                            placeholder="Ask anything..."
                            className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-slate-900"
                        />
                        <button onClick={send} className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors">
                            <span className="material-icons text-sm">send</span>
                        </button>
                    </div>
                </div>
            )}
            <button
                onClick={() => setOpen(!open)}
                className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-2xl shadow-indigo-500/30 flex items-center justify-center hover:scale-110 transition-transform"
            >
                <span className="material-icons text-2xl">{open ? "close" : "smart_toy"}</span>
            </button>
        </div>
    );
}

// ─── Main Incorporation Dashboard ─────────────────────────────────────────────
export default function IncorporationDashboard() {
    const [packages, setPackages] = useState<Package[]>(DEFAULT_PACKAGES);
    const [showAdminEditor, setShowAdminEditor] = useState(false);
    const [showFlowPopup, setShowFlowPopup] = useState(false);
    const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
    const [aiPackGenerated, setAiPackGenerated] = useState(false);
    const [selectedPkg, setSelectedPkg] = useState<(Package & { selectedAddons: Addon[] }) | null>(null);
    const [isAdmin] = useState(true); // TODO: wire to real auth role

    const visiblePackages = packages.filter((p) => p.isVisible);

    const handleAIPackClick = () => {
        // If user has no answers yet, show flow popup
        const hasAnswers = Object.keys(userAnswers).length >= 3;
        if (!hasAnswers) {
            setShowFlowPopup(true);
        } else {
            setAiPackGenerated(true);
        }
    };

    const handleFlowComplete = (answers: UserAnswers) => {
        setUserAnswers(answers);
        setShowFlowPopup(false);
        setAiPackGenerated(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            {/* Inline AI Chat */}
            <InlineAIChat />

            {/* Flow Popup */}
            {showFlowPopup && (
                <QuickFlowPopup
                    onComplete={handleFlowComplete}
                    onClose={() => setShowFlowPopup(false)}
                    existingAnswers={userAnswers}
                />
            )}

            {/* Admin Editor */}
            {showAdminEditor && (
                <AdminPackageEditor
                    packages={packages}
                    onSave={setPackages}
                    onClose={() => setShowAdminEditor(false)}
                />
            )}

            {/* Get Started Modal */}
            {selectedPkg && (
                <GetStartedModal
                    pkg={selectedPkg}
                    selectedAddons={selectedPkg.selectedAddons}
                    onClose={() => setSelectedPkg(null)}
                />
            )}

            <div className="max-w-6xl mx-auto px-4 py-10">
                {/* ── Page Header ── */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-5">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        India&apos;s #1 AI Business Setup Platform
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
                        Start Your Business{" "}
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            The Right Way
                        </span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        AI-powered incorporation packages tailored to your business. Expert CA support, 100% online, guaranteed compliance.
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-8 mt-6">
                        {[
                            { value: "5,000+", label: "Businesses Registered" },
                            { value: "10-15", label: "Days to Incorporate" },
                            { value: "100%", label: "Online Process" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-2xl font-black text-indigo-600">{stat.value}</div>
                                <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Admin Controls ── */}
                {isAdmin && (
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => setShowAdminEditor(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-700 transition-colors shadow-lg"
                        >
                            <span className="material-icons text-sm">settings</span>
                            Admin: Edit Packages
                        </button>
                    </div>
                )}

                {/* ── Package Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {visiblePackages.map((pkg) => (
                        <PackageCard key={pkg.id} pkg={pkg} onSelect={(p) => setSelectedPkg(p)} />
                    ))}
                </div>

                {/* ── AI Pack CTA ── */}
                {!aiPackGenerated ? (
                    <div
                        onClick={handleAIPackClick}
                        className="cursor-pointer group relative bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-8 text-white overflow-hidden shadow-2xl hover:shadow-indigo-900/40 transition-all hover:-translate-y-1"
                    >
                        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -translate-y-36 translate-x-36 group-hover:bg-indigo-500/20 transition-all duration-1000" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-3xl">🤖</span>
                                    <div>
                                        <h3 className="text-xl font-black">Not sure which pack?</h3>
                                        <p className="text-indigo-300 text-sm">Let AI analyze your business and build a custom package</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                    <span className="flex items-center gap-1"><span className="material-icons text-sm text-green-400">check</span> 5 quick questions</span>
                                    <span className="flex items-center gap-1"><span className="material-icons text-sm text-green-400">check</span> Instant recommendation</span>
                                    <span className="flex items-center gap-1"><span className="material-icons text-sm text-green-400">check</span> Custom pricing</span>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="flex items-center gap-3 px-8 py-4 bg-white text-indigo-900 rounded-2xl font-black text-sm shadow-2xl group-hover:shadow-white/20 transition-all group-hover:scale-105">
                                    <span className="material-icons">auto_awesome</span>
                                    Get My AI Pack
                                    <span className="material-icons">arrow_forward</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <AIPackResult
                        answers={userAnswers}
                        packages={packages}
                        onGetStarted={(p) => setSelectedPkg(p)}
                    />
                )}

                {/* ── How It Works ── */}
                <div className="mt-16">
                    <h2 className="text-2xl font-black text-slate-900 text-center mb-8">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { step: "01", icon: "assignment", title: "Choose Package", desc: "Select from our 3 packs or let AI recommend the best one for you", color: "text-indigo-600 bg-indigo-50" },
                            { step: "02", icon: "upload_file", title: "Upload Documents", desc: "PAN, Aadhaar, address proof — we guide you through every step", color: "text-purple-600 bg-purple-50" },
                            { step: "03", icon: "gavel", title: "Expert Processing", desc: "Our CA experts file everything with MCA, GST, and other departments", color: "text-emerald-600 bg-emerald-50" },
                            { step: "04", icon: "verified", title: "Get Certificate", desc: "Receive your Certificate of Incorporation and all documents digitally", color: "text-amber-600 bg-amber-50" },
                        ].map((item, i) => (
                            <div key={i} className="text-center group">
                                <div className={`w-16 h-16 ${item.color} rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                                    <span className="material-icons text-2xl">{item.icon}</span>
                                </div>
                                <div className="text-xs font-black text-slate-300 uppercase tracking-widest mb-1">Step {item.step}</div>
                                <h4 className="font-black text-slate-900 mb-2">{item.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Trust Badges ── */}
                <div className="mt-12 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: "verified_user", label: "MCA Registered", sub: "Official filing partner" },
                            { icon: "lock", label: "100% Secure", sub: "Bank-grade encryption" },
                            { icon: "support_agent", label: "Expert CA Support", sub: "Dedicated professionals" },
                            { icon: "payments", label: "No Hidden Costs", sub: "All-inclusive pricing" },
                        ].map((badge, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="material-icons text-green-600 text-xl">{badge.icon}</span>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-900">{badge.label}</p>
                                    <p className="text-[10px] text-slate-400">{badge.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
