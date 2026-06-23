'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
    PlusCircle, CheckCircle2, ArrowRight, ChevronLeft, ChevronDown, ChevronUp, 
    CheckSquare, Square, CreditCard, X, ShoppingCart, Loader2, Rocket, Globe2, 
    Sparkles, Bot, Users, Star, Lightbulb, FileText, Send, Flame, ShieldAlert,
    TrendingUp, DollarSign, Award, Target, MessageSquare, RefreshCw, Download
} from 'lucide-react';
import { BusinessData } from '../../types';
import { CORE_SERVICES, PACKAGE_OPTIONS } from '../../lib/pricingConfig';
import GlobalAccessStep from './GlobalAccessStep';
import RkleAiAdvisor from './RkleAiAdvisor';
import AdvisorBoard from '../dashboard/AdvisorBoard';
import { motion, AnimatePresence } from 'framer-motion';

interface MarketHookStepProps {
    data: BusinessData;
    onBack: () => void;
    onDashboard: () => void;
}

type CartItem = { id: string, name: string, price: number, type: 'package' | 'service' | 'addon' };

const MarketHookStep: React.FC<MarketHookStepProps> = ({ data, onBack, onDashboard }) => {
    const isPvtLtd = data.stage === 'operating' || data.size !== 'solo';


    const [cart, setCart] = useState<CartItem[]>([]);
    const [showCheckout, setShowCheckout] = useState(false);
    const [processMsg, setProcessMsg] = useState('');
    const [legalStoreOpen, setLegalStoreOpen] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
    
    // Premium Report Tab Selection
    const [activeReportTab, setActiveReportTab] = useState<'validation' | 'roadmap' | 'finance'>('validation');
    
    // Interactive Chat inside Report
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState<{ role: 'ai' | 'user', content: string }[]>([
        { 
            role: 'ai', 
            content: `Hello! I have generated your personalized report for **${data.name || 'Your Business'}**. You can ask me to refine this report, suggest startup names, calculate specific tax savings, or clarify legal compliance questions right here.` 
        }
    ]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Extra user input for custom report generation
    const [extraDetails, setExtraDetails] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportData, setReportData] = useState({
        viabilityScore: data.stage === 'idea' ? 92 : 85,
        analysisText: '',
        roadmapSteps: [] as { step: string; title: string; desc: string }[],
        pricing: { setup: '₹5,999', monthly: '₹1,499', taxExemption: '' }
    });

    // Helper to generate personalized text based on onboarding answers
    const compileReport = (userDescription: string) => {
        const name = data.name || 'your startup';
        const ind = data.industry || 'the selected';
        const isIdea = data.stage === 'idea';
        const sizeStr = data.size === 'solo' ? 'solo-operated structure' : 'co-founded partnership';
        
        let text = '';
        if (isIdea) {
            text = `Based on our evaluation, launching **${name}** in the **${ind}** market presents a high viability score. Operating as a **${sizeStr}**, your primary focus should be registering the correct entity type to protect personal assets and secure intellectual property early. `;
            if (userDescription) {
                text += `We analyzed your input: "${userDescription}". Our AI matches this with high-demand trends in digital commerce and local services. We suggest initiating name checks immediately to lock down the trademark before competitor launch.`;
            } else {
                text += `We recommend setting up name availability queries to prevent other entities from occupying this domain name.`;
            }
        } else {
            text = `For your operational business **${name}** in the **${ind}** sector, our gap analysis shows that manual tracking of compliance poses a key threat to scalability. `;
            if (userDescription) {
                text += `Reviewing your operational note: "${userDescription}", we suggest migrating existing ledgers into a structured format to prepare for formal audit cycles and optimize monthly filings.`;
            } else {
                text += `We suggest setting up automatic filing reminders for GST to prevent government fines.`;
            }
        }

        // Generate Custom Roadmap Steps
        const steps = isIdea ? [
            { step: '01', title: 'ROC Name Approval', desc: `Verify and secure '${name}' under MCA rules to prevent brand duplication.` },
            { step: '02', title: 'DSC & Entity Filing', desc: 'Secure Digital Signatures and register Articles of Association (AoA) for directors.' },
            { step: '03', title: 'GST & Startup India Setup', desc: 'Acquire GSTIN and register under Startup India for key tax exemptions.' }
        ] : [
            { step: '01', title: 'Compliance & Audit Checkup', desc: 'Examine previous ROC/GST files to rectify filing inconsistencies.' },
            { step: '02', title: 'BizOS Ledger Integration', desc: 'Reconcile invoice databases and sync with professional CAs.' },
            { step: '03', title: 'Trademark & Brand Locking', desc: `Register trademark for '${name}' to safeguard your market share.` }
        ];

        // Generate custom pricing
        const setupCost = isIdea ? (data.size === 'solo' ? '₹2,999' : '₹5,999') : '₹7,999';
        const monthlyCost = (data.stage === 'operating' || data.size !== 'solo') ? '₹2,499' : '₹1,499';
        const taxTip = isIdea 
            ? 'Eligible for 100% tax rebate under Section 80-IAC once registered with DPIIT.'
            : 'Eligible for dynamic input tax credits (ITC), reducing net GST payout by up to 18%.';

        return {
            viabilityScore: isIdea ? 92 : 85,
            analysisText: text,
            roadmapSteps: steps,
            pricing: { setup: setupCost, monthly: monthlyCost, taxExemption: taxTip }
        };
    };

    // Initialize report data
    useEffect(() => {
        setReportData(compileReport(data.description || ''));
    }, [data]);

    const handleRegenerateReport = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const updated = compileReport(extraDetails || data.description || '');
            setReportData(updated);
            setIsGenerating(false);
            
            // Add Arkle notification
            setChatMessages(prev => [...prev, {
                role: 'ai',
                content: `✨ I have successfully updated your briefing report to incorporate your new inputs: "${extraDetails}". Your setup roadmap and financial metrics are now fully synchronized.`
            }]);
        }, 2000);
    };

    const toggleDropdown = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenDropdowns(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredServices = CORE_SERVICES.filter(service => 
        service.showIf === 'all' || 
        (service.showIf === 'scale' && isPvtLtd) || 
        (service.showIf === 'solo' && !isPvtLtd)
    );

    const toggleCartItem = (item: CartItem) => {
        setCart(prev => {
            if (item.type === 'package') {
                const filtered = prev.filter(c => c.type !== 'package');
                const exists = prev.find(c => c.id === item.id);
                return exists ? filtered : [...filtered, item];
            }
            const exists = prev.find(c => c.id === item.id);
            if (exists) return prev.filter(c => c.id !== item.id);
            return [...prev, item];
        });
    };

    const isInCart = (id: string) => cart.some(c => c.id === id);
    const cartTotal = cart.reduce((acc, curr) => acc + curr.price, 0);

    const handleCheckoutProcess = () => {
        setProcessMsg('Capturing lead securely & initializing Payment Gateway...');
        setTimeout(() => {
            setProcessMsg('Processing Razorpay Simulated Transaction...');
            setTimeout(() => {
                setShowCheckout(false);
                onDashboard();
            }, 2500);
        }, 2500);
    };

    const handleDownloadDoc = () => {
        const reportTitle = `SetMyBizz - Business Setup & Validation Report for ${data.name || 'Your Startup'}`;
        const content = `
        <html>
        <head>
          <meta charset="utf-8">
          <title>${reportTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            h1 { color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
            h2 { color: #2563eb; margin-top: 20px; }
            .score { font-size: 24px; font-weight: bold; color: #10b981; }
            .roadmap-step { margin-bottom: 15px; }
            .step-num { font-weight: bold; color: #2563eb; }
          </style>
        </head>
        <body>
          <h1>Business Setup & Validation Report</h1>
          <p><strong>Company Name:</strong> ${data.name || 'Your Startup'}</p>
          <p><strong>Industry:</strong> ${data.industry || 'Selected Industry'}</p>
          <p><strong>Business Stage:</strong> ${data.stage === 'idea' ? 'Idea Stage' : 'Operating Stage'}</p>
          <p><strong>Viability Score:</strong> <span class="score">${reportData.viabilityScore}%</span></p>
          
          <h2>Executive Summary</h2>
          <p>${reportData.analysisText.replace(/<[^>]*>/g, '')}</p>
          
          <h2>Recommended Setup Roadmap</h2>
          ${reportData.roadmapSteps.map(step => `
            <div class="roadmap-step">
              <span class="step-num">Step ${step.step}: ${step.title}</span>
              <p>${step.desc}</p>
            </div>
          `).join('')}
          
          <h2>Financial Estimates</h2>
          <p><strong>Setup Cost:</strong> ${reportData.pricing.setup}</p>
          <p><strong>Monthly Compliance:</strong> ${reportData.pricing.monthly}</p>
          <p><strong>Advisory Note:</strong> ${reportData.pricing.taxExemption}</p>
          
          <hr>
          <p style="font-size: 11px; color: #666; text-align: center;">Generated by Arkle AI - SetMyBizz. All rights reserved.</p>
        </body>
        </html>
        `;
        const blob = new Blob(['\ufeff' + content], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.name || 'SetMyBizz'}_Onboarding_Report.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadPdf = () => {
        const reportTitle = `SetMyBizz - Business Setup & Validation Report for ${data.name || 'Your Startup'}`;
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        
        printWindow.document.write(`
            <html>
            <head>
              <title>${reportTitle}</title>
              <style>
                @media print {
                  body { margin: 20mm; }
                }
                body {
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                  color: #1e293b;
                  line-height: 1.6;
                  padding: 40px;
                  max-width: 800px;
                  margin: 0 auto;
                }
                .header {
                  text-align: center;
                  margin-bottom: 40px;
                  border-bottom: 2px solid #3b82f6;
                  padding-bottom: 20px;
                }
                .logo {
                  font-size: 24px;
                  font-weight: 900;
                  color: #1e3a8a;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                }
                .tagline {
                  font-size: 12px;
                  color: #64748b;
                  text-transform: uppercase;
                  font-weight: 700;
                  margin-top: 5px;
                }
                h1 {
                  font-size: 28px;
                  font-weight: 800;
                  color: #0f172a;
                  margin-top: 10px;
                }
                .meta-grid {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 15px;
                  background-color: #f8fafc;
                  border: 1px solid #e2e8f0;
                  padding: 20px;
                  border-radius: 12px;
                  margin-bottom: 30px;
                }
                .meta-item {
                  font-size: 14px;
                }
                .meta-label {
                  font-weight: bold;
                  color: #64748b;
                  text-transform: uppercase;
                  font-size: 11px;
                  display: block;
                  margin-bottom: 2px;
                }
                .meta-value {
                  font-weight: 700;
                  color: #0f172a;
                }
                .score-badge {
                  display: inline-block;
                  background-color: #ecfdf5;
                  color: #065f46;
                  padding: 4px 12px;
                  border-radius: 9999px;
                  font-weight: 800;
                  border: 1px solid #a7f3d0;
                }
                h2 {
                  font-size: 18px;
                  font-weight: 800;
                  color: #1e3a8a;
                  margin-top: 30px;
                  border-bottom: 1px solid #e2e8f0;
                  padding-bottom: 8px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                }
                .step {
                  margin-bottom: 20px;
                  padding-left: 15px;
                  border-left: 3px solid #3b82f6;
                }
                .step-title {
                  font-weight: 800;
                  font-size: 14px;
                  color: #0f172a;
                  text-transform: uppercase;
                }
                .step-desc {
                  font-size: 13px;
                  color: #475569;
                  margin-top: 4px;
                }
                .footer {
                  margin-top: 60px;
                  text-align: center;
                  font-size: 11px;
                  color: #94a3b8;
                  border-top: 1px solid #e2e8f0;
                  padding-top: 20px;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="logo">SetMyBizz</div>
                <div class="tagline">Start • Run • Scale</div>
                <h1>Executive Startup Briefing</h1>
              </div>
              
              <div class="meta-grid">
                <div class="meta-item">
                  <span class="meta-label">Business Name</span>
                  <span class="meta-value">${data.name || 'Your Startup'}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Industry Sector</span>
                  <span class="meta-value">${data.industry || 'Selected Industry'}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Viability Score</span>
                  <span class="meta-value"><span class="score-badge">${reportData.viabilityScore}%</span></span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Target Stage</span>
                  <span class="meta-value">${data.stage === 'idea' ? 'Idea Stage Validation' : 'Operating Growth Stage'}</span>
                </div>
              </div>
              
              <h2>Executive Gap & Market Fit Analysis</h2>
              <p>${reportData.analysisText.replace(/<[^>]*>/g, '')}</p>
              
              <h2>Recommended Compliance & Setup Roadmap</h2>
              ${reportData.roadmapSteps.map(s => `
                <div class="step">
                  <div class="step-title">Step ${s.step}: ${s.title}</div>
                  <div class="step-desc">${s.desc}</div>
                </div>
              `).join('')}
              
              <h2>Financial Model & Compliance Estimates</h2>
              <div class="meta-grid">
                <div class="meta-item">
                  <span class="meta-label">One-Time Setup Cost</span>
                  <span class="meta-value">${reportData.pricing.setup}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Monthly Audit/CA Costs</span>
                  <span class="meta-value">${reportData.pricing.monthly}</span>
                </div>
              </div>
              <p><strong>Strategic Tax Advisory:</strong> ${reportData.pricing.taxExemption}</p>
              
              <div class="footer">
                This document is generated by Arkle AI on behalf of SetMyBizz. Confidential.
              </div>
              
              <script>
                window.onload = function() {
                  window.print();
                  window.close();
                };
              </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    const handleSendChat = () => {
        if (!chatInput.trim()) return;
        const userMsg = chatInput.trim();
        setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setChatInput('');
        setChatLoading(true);

        setTimeout(() => {
            let reply = '';
            const lower = userMsg.toLowerCase();

            if (lower.includes('name') || lower.includes('suggest')) {
                reply = `Based on your target industry (**${data.industry || 'Tech'}**), here are 3 premium trademark-available name suggestions for your business:
1. **${data.name || 'Acme'} Spark** (Modern, energetic feel)
2. **Nova${data.name || 'Acme'}** (Corporate, scalable structure)
3. **${data.name || 'Acme'} Labs** (Authority & innovation-focused)

Would you like us to run a official trademark search for any of these?`;
            } else if (lower.includes('tax') || lower.includes('gst')) {
                reply = `For a business operating in **${data.state || 'India'}**, the default GST rates are structured as:
* **Services**: 18% GST (Input Tax Credit claims fully valid)
* **Physical Goods**: 5%, 12%, or 18% depending on the exact HSN code.

By routing business expenses through your corporate entity, you can offset up to **₹1.8 Lakhs in GST liabilities** annually. We can manage this filing setup through our CA Compliance bundle.`;
            } else if (lower.includes('loan') || lower.includes('fund') || lower.includes('capital')) {
                reply = `Since your startup is in the **${data.stage === 'idea' ? 'Idea' : 'Running'} Stage**, the ideal funding roadmap is:
1. **Mudra Loan (Shishu/Kishor)**: Government backed collateral-free business loans up to ₹5 Lakhs.
2. **Startup India Seed Fund Scheme (SISFS)**: Grants up to ₹20 Lakhs for validation and prototype setup.
3. **Private Equity/Angels**: Requires a professional 10-slide pitch deck and a certified DPR (Detailed Project Report).

We draft and deliver verified DPR files inside our VCFO & Projects package.`;
            } else {
                reply = `That is a vital point for **${data.name || 'your business'}**. For the **${data.industry || 'selected'}** sector, implementing robust accounting audits and ROC documentation early prevents MCA non-compliance penalties (which can reach ₹50,000 annually). I have added this parameter to your operational roadmap memory.`;
            }

            setChatMessages(prev => [...prev, { role: 'ai', content: reply }]);
            setChatLoading(false);
        }, 1500);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-12 animate-in fade-in zoom-in-95 duration-700 pb-32 relative bg-white">
            
            {/* Top Left Navigation back to BizDesk Dashboard */}
            <div className="absolute top-4 left-4 z-50">
                <button
                    onClick={onDashboard}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors font-black text-xs uppercase tracking-wider bg-slate-50 hover:bg-slate-100/80 px-3.5 py-2 rounded-xl border border-slate-200/50 shadow-xs"
                >
                    <ChevronLeft size={16} />
                    <span>BizDesk</span>
                </button>
            </div>
            
            {/* Header */}
            <div className="text-center mb-12">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-[0.2em] mb-6 border border-blue-200/50 shadow-sm">
                    <Sparkles size={12} className="text-blue-600 animate-pulse" />
                    Arkle Intelligence Report Active
                </span>
                <h1 className="font-playfair text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                    Your Personalized Setup Journey
                </h1>
                <p className="text-slate-600 text-lg max-w-3xl mx-auto font-medium">
                    We validated your answers. Below is your detailed business report, roadmap, and pricing for services requested for <span className="font-bold text-blue-600 border-b-2 border-blue-200">{data.name || 'Your Startup'}</span>.
                </p>
            </div>

            <div className="flex flex-col gap-16">
                
                {/* ─── NEW: ARKLE AI DEDICATED WOW-FACTOR DASHBOARD ─── */}
                <div className="bg-slate-50/70 border border-slate-200/80 shadow-2xl rounded-[2.5rem] p-6 md:p-12 relative overflow-hidden text-slate-800">
                    <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
                        
                        {/* Left Side: Interactive Report (7 Columns) */}
                        <div className="lg:col-span-7 flex flex-col justify-between">
                            <div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                            <Bot size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black tracking-tight text-slate-900">Arkle AI Executive Briefing</h3>
                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5">Verified Startup Partner Output</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleDownloadPdf}
                                            className="px-4 py-2 bg-white border border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 text-slate-700 hover:text-blue-600 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
                                        >
                                            <Download size={12} />
                                            <span>PDF</span>
                                        </button>
                                        <button
                                            onClick={handleDownloadDoc}
                                            className="px-4 py-2 bg-white border border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 text-slate-700 hover:text-blue-600 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
                                        >
                                            <Download size={12} />
                                            <span>DOC</span>
                                        </button>
                                        <button
                                            onClick={onDashboard}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
                                        >
                                            <ArrowRight size={12} />
                                            <span>Go to Dashboard</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Report Tab Headers */}
                                <div className="flex border-b border-slate-200 gap-6 mb-8 overflow-x-auto pb-px">
                                    {[
                                        { id: 'validation', label: data.stage === 'idea' ? 'Idea Validation' : 'Gap Analysis', icon: Target },
                                        { id: 'roadmap', label: 'Setup Roadmap', icon: FileText },
                                        { id: 'finance', label: 'Financial Model', icon: DollarSign }
                                    ].map(tab => {
                                        const TabIcon = tab.icon;
                                        const isActive = activeReportTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveReportTab(tab.id as any)}
                                                className={`flex items-center gap-2 pb-4 font-bold text-xs uppercase tracking-wider border-b-2 transition-all shrink-0 ${isActive ? 'border-blue-600 text-blue-600 font-black' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                            >
                                                <TabIcon size={14} />
                                                <span>{tab.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Report Content Display */}
                                <div className="min-h-[220px]">
                                    <AnimatePresence mode="wait">
                                        {isGenerating ? (
                                            <motion.div 
                                                key="loader"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex flex-col items-center justify-center py-12"
                                            >
                                                <Loader2 size={36} className="text-blue-500 animate-spin mb-4" />
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">Arkle Neural Core compiling report...</p>
                                            </motion.div>
                                        ) : (
                                            <>
                                                {activeReportTab === 'validation' && (
                                                    <motion.div
                                                        key="validation"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        className="space-y-6"
                                                    >
                                                        <div className="flex items-center gap-6 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                                                            <div className="w-16 h-16 rounded-full border-4 border-emerald-500 bg-emerald-50 flex items-center justify-center shrink-0">
                                                                <span className="text-lg font-black text-emerald-700">{reportData.viabilityScore}%</span>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-extrabold text-sm mb-1 uppercase tracking-wider text-slate-800">Viability Matrix Score</h4>
                                                                <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                                                                    {data.stage === 'idea' 
                                                                        ? 'Your business plan shows strong market fit, low entry resistance, and potential for high early margins.'
                                                                        : 'Your active business operates with good sector traction but has critical back-office scaling gaps.'
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2 text-xs md:text-sm text-slate-600 font-semibold leading-relaxed">
                                                            <p dangerouslySetInnerHTML={{ __html: reportData.analysisText }} />
                                                            <p className="text-slate-700">
                                                                <strong>Selected Focus Areas:</strong> {data.focusAreas && data.focusAreas.length > 0 ? data.focusAreas.join(', ') : 'All General Compliance Areas'}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {activeReportTab === 'roadmap' && (
                                                    <motion.div
                                                        key="roadmap"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        className="space-y-5"
                                                    >
                                                        <h4 className="font-extrabold text-sm text-blue-600 uppercase tracking-wider">Recommended Structure: {data.stage === 'idea' ? (data.size === 'solo' ? 'Proprietorship / One Person Company (OPC)' : 'Private Limited Company (Pvt Ltd)') : 'Private Limited Company / LLP Setup'}</h4>
                                                        
                                                        <div className="space-y-3">
                                                              {reportData.roadmapSteps.map((item, i) => (
                                                                  <div key={i} className="flex gap-4 items-start bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                                                      <span className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{item.step}</span>
                                                                      <div>
                                                                          <h5 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">{item.title}</h5>
                                                                          <p className="text-slate-600 text-xs font-semibold leading-relaxed">{item.desc}</p>
                                                                      </div>
                                                                  </div>
                                                              ))}
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {activeReportTab === 'finance' && (
                                                    <motion.div
                                                        key="finance"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        className="space-y-6"
                                                    >
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                                                                <h5 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Entity Setup Est.</h5>
                                                                <p className="text-2xl font-black text-slate-900">{reportData.pricing.setup}</p>
                                                            </div>
                                                            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                                                                <h5 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">GST & ROC Monthly Est.</h5>
                                                                <p className="text-2xl font-black text-slate-900">{reportData.pricing.monthly}</p>
                                                            </div>
                                                        </div>

                                                        <p className="text-slate-600 text-xs md:text-sm font-semibold leading-relaxed">
                                                            <strong>Tax Strategy:</strong> {reportData.pricing.taxExemption}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Regenerator block */}
                            <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    Tell Arkle more about your business, specific challenges, or target goals to refine report:
                                </label>
                                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                                    <textarea
                                        rows={2}
                                        value={extraDetails}
                                        onChange={(e) => setExtraDetails(e.target.value)}
                                        placeholder="e.g. My startup is a SaaS tool for retail stores and I want to raise seed capital."
                                        className="flex-1 bg-white border border-slate-200 rounded-2xl p-3 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 resize-none shadow-sm"
                                    />
                                    <button
                                        onClick={handleRegenerateReport}
                                        disabled={isGenerating || !extraDetails.trim()}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 disabled:opacity-40 transition-all shadow-md"
                                    >
                                        <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""} />
                                        <span>Regenerate Report</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Interactive AI Refinement Chat (5 Columns) */}
                        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 flex flex-col justify-between min-h-[380px] shadow-sm relative">
                            {/* Chat Header */}
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                                <MessageSquare size={14} className="text-blue-600" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Discuss & Refine Report</span>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto space-y-4 max-h-[220px] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent pr-1">
                                {chatMessages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed max-w-[85%] ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-100 text-slate-850 rounded-tl-sm'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {chatLoading && (
                                    <div className="flex justify-start">
                                        <div className="p-3 bg-slate-100 rounded-2xl rounded-tl-sm flex items-center gap-2 text-xs font-semibold text-slate-500">
                                            <Loader2 size={12} className="animate-spin text-blue-600" />
                                            <span>Arkle thinking...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input Form */}
                            <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                                {/* Prompt suggestions */}
                                <div className="flex flex-wrap gap-1.5">
                                    {[
                                        { label: 'Suggest Startup Names', query: 'Suggest 3 names for my business' },
                                        { label: 'How to save GST?', query: 'How to save GST on expenses?' },
                                        { label: 'Get Mudra Loan?', query: 'How can I get government Mudra loan?' }
                                    ].map((sug, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setChatInput(sug.query);
                                            }}
                                            className="text-[9px] font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-blue-600 px-2.5 py-1 rounded-md transition-colors"
                                        >
                                            {sug.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 focus-within:border-blue-600 transition-all">
                                    <input
                                        type="text"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                                        placeholder="Ask Arkle to refine report..."
                                        className="flex-1 bg-transparent px-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
                                    />
                                    <button
                                        onClick={handleSendChat}
                                        disabled={!chatInput.trim()}
                                        className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center disabled:opacity-30 transition-all"
                                    >
                                        <Send size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Top Section: Essential Services List */}
                <div className="flex flex-col gap-6">
                    <div 
                        onClick={() => setLegalStoreOpen(!legalStoreOpen)}
                        className="flex items-center justify-between cursor-pointer border-b border-slate-200 pb-4 group select-none"
                    >
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                The Legal Store
                                {legalStoreOpen ? <ChevronUp className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" /> : <ChevronDown className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />}
                            </h3>
                            <p className="text-slate-500 font-medium">Acquire high-performance business protocols & elite professional consultations.</p>
                        </div>
                        <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
                           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                           <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Sourcing Real-time Pricing</span>
                        </div>
                    </div>
                    {legalStoreOpen && (
                        <div className="flex flex-row overflow-x-auto gap-4 pb-4 no-scrollbar scroll-smooth w-full">
                            {filteredServices.map((step, idx) => {
                                const isSelected = isInCart(step.id);
                                return (
                                    <div key={idx} className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start gap-4 cursor-pointer shrink-0 w-80 ${isSelected ? 'border-[#0052FF] ring-2 ring-blue-500/20 bg-blue-50/10' : 'border-slate-200'}`} onClick={() => toggleCartItem({ id: step.id, name: step.title, price: step.price, type: 'service' })}>
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border transition-transform ${step.colors}`}>
                                            <step.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">{step.category}</span>
                                            <h4 className="text-base font-bold text-slate-900 leading-tight mb-1 truncate">{step.title}</h4>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-sm font-bold text-[#0052FF] opacity-90">{step.price === 0 ? 'Free' : 'Select for Pricing'}</span>
                                            </div>
                                        </div>
                                        <button className={`flex-shrink-0 p-1.5 rounded-full transition-colors mt-1 ${isSelected ? 'text-[#0052FF]' : 'text-slate-400'}`}>
                                            {isSelected ? <CheckCircle2 className="w-6 h-6" /> : <PlusCircle className="w-6 h-6" />}
                                        </button>
                                    </div>
                                );
                            })}

                            {/* NEW: BOOK PROFESSIONAL FEATURE CARD */}
                            <div 
                                className={`bg-linear-to-br from-slate-900 to-indigo-950 border-2 rounded-2xl p-5 shadow-xl transition-all flex items-start gap-4 cursor-pointer group hover:scale-[1.02] border-indigo-500/30 shrink-0 w-80`}
                                onClick={() => toggleCartItem({ id: 'prof-booking', name: 'Elite CA/Legal Consultation', price: 999, type: 'service' })}
                            >
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20 group-hover:bg-blue-600 transition-colors">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1 block">Elite Support</span>
                                    <h4 className="text-base font-bold text-white leading-tight mb-1 truncate">Book a Professional</h4>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-sm font-black text-white/90">₹999 / Session</span>
                                    </div>
                                </div>
                                <button className={`flex-shrink-0 p-1.5 rounded-full transition-colors mt-1 ${isInCart('prof-booking') ? 'text-blue-400' : 'text-white/20'}`}>
                                    {isInCart('prof-booking') ? <CheckCircle2 className="w-6 h-6" /> : <PlusCircle className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Free Hooks & Resources Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 shadow-lg text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 opacity-10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-2.5 py-1 bg-white/20 text-white rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/30 shadow-sm backdrop-blur-sm">Included for you</span>
                            <h3 className="text-xl font-black">Free Business Resources & Built-in AI</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                                { title: 'Project Report (DPR)', desc: 'Bank-ready project plan.', icon: 'description', color: 'from-emerald-400 to-teal-500' },
                                { title: 'Legal Documentation', desc: 'NDA & Founders agreements.', icon: 'gavel', color: 'from-amber-400 to-orange-500' },
                                { title: 'Udyam / MSME', desc: 'Free assistance & benefits.', icon: 'card_membership', color: 'from-pink-400 to-rose-500' },
                                { title: 'Basic AI Guidance', desc: 'Chatbot access for setup.', icon: 'smart_toy', color: 'from-indigo-400 to-blue-500' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/10 p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all group backdrop-blur-sm cursor-pointer">
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform`}>
                                        <span className="material-icons text-white text-sm">{item.icon}</span>
                                    </div>
                                    <h4 className="font-bold text-white text-sm mb-0.5">{item.title}</h4>
                                    <p className="text-[11px] text-blue-100 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* BizDesk Administration Hook Section */}
                <div 
                    onClick={() => setShowCheckout(true)}
                    className="bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1 border border-slate-800"
                >
                    <div className="absolute inset-0 bg-center bg-cover opacity-10 mix-blend-overlay"></div>
                    <div className="absolute top-1/2 right-10 -translate-y-1/2 w-48 h-48 bg-blue-500 rounded-full blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                        <div className="relative shrink-0">
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-md opacity-50 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse" />
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center relative z-10 shadow-xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-600/20"></div>
                                <Bot className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-2 border-slate-900 rounded-full z-20 shadow-[0_0_15px_rgba(16,185,129,0.8)] flex items-center justify-center">
                                <Sparkles className="w-3 h-3 text-white" />
                            </div>
                        </div>

                        <div className="flex-grow flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-widest border border-blue-500/30 mb-3 backdrop-blur-sm">
                                <Star className="w-3 h-3 fill-blue-400" /> Administrative Core
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">BizDesk - Your Startup's Administration</h3>
                            <p className="text-slate-300 text-[13px] md:text-sm font-medium leading-relaxed max-w-2xl mb-5">
                                Here you can run, manage, and operate your business with tools like <strong className="text-white">Invoice, Inventory, Books, Finance, Accounts, and AI Co-Founder</strong>. Let BizOS handle the operational backend so you focus entirely on your scaling roadmap. <br/><br/>
                                <span className="inline-block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent font-black tracking-wide uppercase text-xs md:text-sm">1 Unified Space. 1 Powerful Business Operating System.</span>
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                                <button className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                                    Login to Dashboard
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <span className="text-xs text-slate-500 font-medium">Free limits applied. Pay as you go inside.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Packages */}
                <div className="border-t border-slate-200 pt-12">
                    <div className="text-center mb-10">
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">Or choose a Ready-to-go Package</h3>
                        <p className="text-slate-500 font-medium">Bundled services tailored to your exact business stage.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {PACKAGE_OPTIONS.map((pkg, idx) => {
                            const isSelected = isInCart(pkg.id);
                            return (
                                <div key={idx} className={`relative flex flex-col bg-white border-2 rounded-2xl overflow-hidden hover:shadow-xl transition-all ${isSelected || pkg.featured ? 'border-[#0052FF] shadow-lg transform md:-translate-y-2' : 'border-slate-200'}`}>
                                    {pkg.featured && !isSelected && (
                                        <div className="absolute top-0 inset-x-0 text-center bg-[#0052FF] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 z-10">Most Popular & Recommended</div>
                                    )}
                                    {isSelected && (
                                        <div className="absolute top-0 inset-x-0 text-center bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 z-10">Package Selected</div>
                                    )}
                                    <div className={`${pkg.bg} p-6 border-b transition-colors ${(pkg.featured || isSelected) ? 'pt-8' : ''}`}>
                                        <h4 className={`text-lg font-bold ${pkg.textColor} mb-1`}>{pkg.name}</h4>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{pkg.ideal}</div>
                                        <div className="text-3xl font-black text-slate-900">₹{pkg.price.toLocaleString('en-IN')}</div>
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col">
                                        <ul className="space-y-3 mb-6 flex-grow">
                                            {pkg.features.map((f, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                        
                                        {/* Add-ons Section inside Package */}
                                        <div className="border-t border-slate-100 pt-4 mb-6 space-y-3">
                                            {pkg.addonCategories.map((category) => {
                                                const isOpen = openDropdowns[category.id] || false;
                                                return (
                                                    <div key={category.id} className="border border-slate-200 rounded-xl overflow-hidden">
                                                        <div 
                                                            onClick={(e) => toggleDropdown(category.id, e)}
                                                            className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 p-3 cursor-pointer transition-colors"
                                                        >
                                                            <h5 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{category.title}</h5>
                                                            {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 ml-2" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />}
                                                        </div>
                                                        {isOpen && (
                                                            <div className="p-2 space-y-1.5 bg-white border-t border-slate-100">
                                                                {category.items.map(addon => {
                                                                    const isAddonSelected = isInCart(addon.id);
                                                                    return (
                                                                        <div 
                                                                            key={addon.id} 
                                                                            onClick={(e) => { e.stopPropagation(); toggleCartItem({ id: addon.id, name: addon.name, price: addon.price, type: 'addon' }); }}
                                                                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border transition-colors ${isAddonSelected ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-50 hover:border-indigo-200'}`}
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                {isAddonSelected ? <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                                                                                <span className="text-[11px] font-medium text-slate-700 leading-tight">{addon.name}</span>
                                                                            </div>
                                                                            <span className="text-[10px] font-bold text-slate-900 ml-2 whitespace-nowrap">+₹{addon.price.toLocaleString('en-IN')}</span>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <button 
                                            onClick={() => toggleCartItem({ id: pkg.id, name: pkg.name, price: pkg.price, type: 'package' })}
                                            className={`w-full py-3 rounded-xl font-bold transition-all shadow-md mt-auto ${isSelected ? 'bg-slate-900 text-white hover:bg-black' : pkg.buttonBg + ' text-white'}`}
                                        >
                                            {isSelected ? 'Remove Package' : 'Select Package'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>



            {/* Global Access Section Inserted Here (Moved Down & Resized) */}
            <div className="mt-16 pt-16 border-t border-slate-200 w-full animate-in fade-in zoom-in-95 duration-1000 px-4">
                <div className="text-center mb-8">
                     <h2 className="font-playfair text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">
                        Go <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Global</span>
                    </h2>
                    <p className="text-slate-600 font-medium">Take your Indian startup to the world with our global expansion services.</p>
                </div>
                <div className="mx-auto w-full max-w-5xl h-[400px] shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
                    <GlobalAccessStep onNext={onDashboard} onBack={() => {}} />
                </div>
            </div>

            <div className="mt-16 pt-10 border-t border-slate-200 flex flex-col items-center gap-6">
                <button
                    onClick={onBack}
                    className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 text-sm"
                >
                    <ChevronLeft className="w-5 h-5" /> Back to edit details
                </button>
                <div onClick={onDashboard} className="mt-4 text-xs font-medium text-slate-400 cursor-pointer hover:underline border border-dashed border-slate-300 px-4 py-2 rounded-full">
                    Skip cart & jump directly to Dashboard
                </div>
            </div>

            {/* Floating Cart & Checkout Bar */}
            {cart.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-4 z-40 animate-in slide-in-from-bottom-5">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                                <ShoppingCart className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-slate-900 font-bold text-lg leading-tight">{cart.length} item(s) selected</h4>
                                <p className="text-sm text-slate-500 font-medium max-w-sm truncate">
                                    {cart.map(c => c.name).join(', ')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 w-full md:w-auto mt-2 md:mt-0">
                            <div className="text-right flex-grow">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subtotal</div>
                                <div className="text-2xl font-black text-slate-900">₹{cartTotal.toLocaleString('en-IN')}</div>
                            </div>
                            <button 
                                onClick={() => setShowCheckout(true)}
                                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 font-bold rounded-xl flex items-center gap-2 whitespace-nowrap transition-transform active:scale-95"
                            >
                                <CreditCard className="w-5 h-5" />
                                Proceed to Pay
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Checkout Mock Modal */}
            {showCheckout && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95">
                        {processMsg ? (
                            <div className="p-12 flex flex-col items-center justify-center text-center">
                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Processing Secure Checkout...</h3>
                                <p className="text-slate-500 font-medium">{processMsg}</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <h3 className="font-bold text-slate-900">Secure Checkout (Demo)</h3>
                                    </div>
                                    <button onClick={() => setShowCheckout(false)} className="text-slate-400 hover:text-slate-600">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6 space-y-3 max-h-48 overflow-y-auto">
                                        {cart.map((c, i) => (
                                            <div key={i} className="flex justify-between items-center text-sm font-medium">
                                                <span className="text-slate-600 truncate mr-4">{c.name}</span>
                                                <span className="text-slate-900 font-bold shrink-0">₹{c.price.toLocaleString('en-IN')}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-end mb-6">
                                        <span className="text-slate-500 font-bold">Total Payable</span>
                                        <span className="text-3xl font-black text-slate-900">₹{cartTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <button 
                                        onClick={handleCheckoutProcess}
                                        className="w-full py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xl relative overflow-hidden group"
                                    >
                                        <span className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors" />
                                        Pay via Razorpay <ArrowRight className="w-5 h-5 ml-2" />
                                    </button>
                                    <p className="text-center text-xs text-slate-400 font-medium mt-4">Safe & Encrypted Transaction. GST will be added.</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            
            <RkleAiAdvisor onLeadCapture={() => setShowCheckout(true)} />
        </div>
    );
};

export default MarketHookStep;
