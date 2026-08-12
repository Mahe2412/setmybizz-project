'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types & Constants ────────────────────────────────────────────────────────
type BusinessStage = 'idea' | 'growing' | 'existing';
type AdvisorPersona = 'CEO' | 'CMO' | 'CA' | 'Admin';

const INCORPORATION_CHECKLIST = {
  'pvt-ltd': [
    { name: 'Director DSC & DIN Approval', desc: 'Digital signatures for promoters' },
    { name: 'Name Approval (RUN)', desc: 'Reserve unique brand name via MCA' },
    { name: 'MoA & AoA Drafting', desc: 'Define company charter and regulations' },
    { name: 'Certificate of Incorporation', desc: 'Final MCA registration certificate' },
    { name: 'PAN & TAN Issuance', desc: 'Tax identifiers generated' },
  ],
  'llp': [
    { name: 'Partner DSC Approval', desc: 'Digital signature certificates' },
    { name: 'Name Reservation', desc: 'MCA name clearance' },
    { name: 'LLP Agreement Drafting', desc: 'Define mutual rights and duties' },
    { name: 'LLP Incorporation Certificate', desc: 'Final registration certificate' },
  ],
  'proprietorship': [
    { name: 'MSME Udyam Registration', desc: 'Official micro enterprise identifier' },
    { name: 'GST Registration', desc: 'Required if turnover exceeds ₹40 Lakhs' },
    { name: 'Current Account Setup', desc: 'Business banking activation' },
  ]
};

export default function ExpertsTab() {
  const [stage, setStage] = useState<BusinessStage>('idea');
  const [activePersona, setActivePersona] = useState<AdvisorPersona>('CEO');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState('');
  
  // Idea Validation State
  const [ideaText, setIdeaText] = useState('');
  const [targetMarket, setTargetMarket] = useState('Tech / Digital');
  const [validationScore, setValidationScore] = useState<number | null>(null);
  const [businessCanvas, setBusinessCanvas] = useState<any | null>(null);
  const [selectedStructure, setSelectedStructure] = useState<'pvt-ltd' | 'llp' | 'proprietorship'>('pvt-ltd');
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [caReviewStatus, setCaReviewStatus] = useState<string | null>(null);

  // Existing Business State
  const [industry, setIndustry] = useState('SaaS / SaaS Platform');
  const [bizSize, setBizSize] = useState('Micro (Under 50L)');
  const [bizGoal, setBizGoal] = useState('Acquiring first 100 customers');
  const [customQuery, setCustomQuery] = useState('');

  // ── AI Idea Validation Call ───────────────────────────────────────────────
  const handleValidateIdea = async () => {
    if (!ideaText.trim()) return;
    setIsAiLoading(true);
    setValidationScore(null);
    setBusinessCanvas(null);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are Arkle, an elite venture strategist and business incubator advisor.
Validate this business idea: "${ideaText}" in sector: "${targetMarket}".
Evaluate:
1. Feasibility & Market Fit Score (out of 100)
2. Value Proposition (USP)
3. Target Audience
4. Suggested Revenue Model
5. Immediate 3 Launch Steps
Return in JSON format: {"score": 85, "usp": "", "audience": "", "revenue": "", "roadmap": ["step1", "step2", "step3"]}`
        })
      });
      const d = await res.json();
      const parsed = JSON.parse(d.text.replace(/```json|```/g, '').trim());
      setValidationScore(parsed.score || 80);
      setBusinessCanvas(parsed);
    } catch (e) {
      setValidationScore(75);
      setBusinessCanvas({
        usp: "Innovative service/product addressing customer convenience in target market.",
        audience: "Early tech adopters, local service seekes, or digital businesses.",
        revenue: "Subscription model / Transaction fees / Direct sale",
        roadmap: ["Register MSME / Udyam Certificate", "Build prototype website / landing page", "Collect first 10 beta customer feedback"]
      });
    }
    setIsAiLoading(false);
  };

  // ── AI Advisor Persona Actions ──────────────────────────────────────────────
  const handleConsultAdvisor = async (promptQuery?: string) => {
    setIsAiLoading(true);
    const finalPrompt = promptQuery || customQuery || `Provide tactical guidance.`;
    setCustomQuery('');
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are Arkle, acting as the business's ${activePersona} Advisor.
Business context: Industry - ${industry}, Size - ${bizSize}, Current goal - ${bizGoal}.
Task: ${finalPrompt}
Answer like a world-class professional ${activePersona} with practical, direct guidance. Max 4 sentences. If appropriate, suggest a templates, tax optimization, or marketing playbook.`
        })
      });
      const d = await res.json();
      setAiOutput(d.text);
    } catch {
      setAiOutput('Arkle is syncing background metrics. Please try asking in a moment.');
    }
    setIsAiLoading(false);
  };

  const docUploadSimulate = (name: string) => {
    setUploadedDocs(prev => [...prev, name]);
    if (uploadedDocs.length >= 2) {
      setCaReviewStatus('Waiting for OTP / Verification Link');
    } else {
      setCaReviewStatus('Document Checklist Updated');
    }
  };

  const submitToExperts = () => {
    setCaReviewStatus('Documents received. SetMyBizz CA team has initiated registration. Check status under Business Vault.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 animate-in fade-in zoom-in-95 duration-500 font-sans">
      <style>{`
        .adv-card { background: white; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px -2px rgba(0,0,0,0.03); }
        .adv-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; padding: 12px 20px; border-radius: 14px; transition: all 0.2s; border: none; outline: none; cursor: pointer; }
        .adv-btn-primary { background: #2563eb; color: white; }
        .adv-btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); }
        .adv-btn-ghost { background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; }
        .adv-btn-ghost:hover { background: #f1f5f9; }
        .adv-input { width: 100%; padding: 12px 16px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 12.5px; font-weight: 600; background: #f8fafc; outline: none; transition: all 0.2s; }
        .adv-input:focus { border-color: #2563eb; background: white; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        .adv-pill { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 12px; border-radius: 9999px; transition: all 0.2s; }
      `}</style>

      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            🎯 SetMyBizz Professional Desk
          </h1>
          <p className="text-slate-500 font-medium text-xs mt-1 uppercase tracking-wider">
            Smart legal, compliance, and CA services tailored to your business stage.
          </p>
        </div>

        {/* Life cycle Stage Toggles */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={() => { setStage('idea'); setAiOutput(''); }}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${stage === 'idea' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            🌱 1. Idea Stage
          </button>
          <button
            onClick={() => { setStage('growing'); setAiOutput(''); }}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${stage === 'growing' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            ⚙️ 2. Growing Setup
          </button>
          <button
            onClick={() => { setStage('existing'); setAiOutput(''); }}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${stage === 'existing' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            🚀 3. Existing Scale
          </button>
        </div>
      </div>

      {/* ═══════ STAGE 1: IDEA VALIDATION & INCUBATION ═══════ */}
      {stage === 'idea' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs & Parameters */}
          <div className="lg:col-span-5 space-y-4">
            <div className="adv-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-rounded text-blue-600">lightbulb</span>
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Idea Incubator</p>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Briefly describe your idea</label>
                <textarea
                  className="adv-input resize-none"
                  rows={4}
                  value={ideaText}
                  onChange={e => setIdeaText(e.target.value)}
                  placeholder="Example: Tech platform for rural farmers to rent agriculture tools from local vendors nearby..."
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Business Sector</label>
                <select className="adv-input" value={targetMarket} onChange={e => setTargetMarket(e.target.value)}>
                  <option>Tech / SaaS platform</option>
                  <option>Manufacturing & Retail</option>
                  <option>Agri-processing & Farming</option>
                  <option>E-commerce / D2C brand</option>
                  <option>Services & Consulting</option>
                </select>
              </div>

              <button
                onClick={handleValidateIdea}
                disabled={isAiLoading || !ideaText.trim()}
                className="w-full adv-btn adv-btn-primary"
              >
                {isAiLoading ? 'Analyzing Idea...' : 'Validate Idea with Arkle →'}
              </button>
            </div>

            {/* CA Legal Setup Forge */}
            <div className="adv-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-rounded text-blue-600">gavel</span>
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Legal Entity Forge</p>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Select Company Structure</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'pvt-ltd', label: 'Pvt Ltd' },
                    { id: 'llp', label: 'LLP' },
                    { id: 'proprietorship', label: 'Proprietor' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStructure(s.id as any)}
                      className={`py-2 px-1 text-[10px] font-black uppercase rounded-xl border transition-all ${selectedStructure === s.id ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic steps roadmap based on selector */}
              <div className="space-y-2.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Legal steps</p>
                {INCORPORATION_CHECKLIST[selectedStructure].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-black shrink-0">{idx+1}</span>
                    <div>
                      <p className="text-[11px] font-bold text-slate-800 leading-none">{step.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Document dropzone */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center">
                <span className="material-symbols-rounded text-slate-300 text-3xl">cloud_upload</span>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mt-1">Upload ID & Address Proof</p>
                <p className="text-[8px] text-slate-400 mt-0.5">PAN, Aadhaar, Rental Agreement (Max 5MB)</p>
                <div className="mt-3 flex justify-center gap-1.5">
                  <button onClick={() => docUploadSimulate('PAN_Card.pdf')} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase">PAN</button>
                  <button onClick={() => docUploadSimulate('Aadhaar.pdf')} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase">Aadhaar</button>
                </div>
                {uploadedDocs.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1 justify-center">
                    {uploadedDocs.map(d => <span key={d} className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-[8px] font-black border border-green-200">✓ {d}</span>)}
                  </div>
                )}
              </div>

              {caReviewStatus && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[10px] font-bold text-blue-700 leading-relaxed">
                  📢 Status: {caReviewStatus}
                </div>
              )}

              <button onClick={submitToExperts} disabled={uploadedDocs.length < 2} className="w-full adv-btn adv-btn-primary disabled:opacity-40">
                Register Entity & GST →
              </button>
            </div>
          </div>

          {/* Validation Diagnostics Output */}
          <div className="lg:col-span-7 space-y-4">
            <AnimatePresence mode="wait">
              {validationScore !== null ? (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="adv-card p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="font-black text-slate-900 text-[15px] uppercase">Idea Validation Report</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Diagnosed by Arkle Strategist</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold">VIBE SCORE</p>
                      <p className={`text-3xl font-black ${validationScore >= 80 ? 'text-green-600' : 'text-amber-500'}`}>{validationScore}/100</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Value Proposition (USP)</p>
                      <p className="text-[11px] text-slate-700 font-medium leading-relaxed">{businessCanvas?.usp}</p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Market</p>
                      <p className="text-[11px] text-slate-700 font-medium leading-relaxed">{businessCanvas?.audience}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Suggested Revenue Model</p>
                    <p className="text-[11px] text-slate-700 font-medium leading-relaxed">{businessCanvas?.revenue}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Launch Action Steps</p>
                    {businessCanvas?.roadmap?.map((step: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 px-4 py-3 bg-blue-50/50 border border-blue-100/50 rounded-xl">
                        <span className="material-symbols-rounded text-blue-600 text-sm">rocket_launch</span>
                        <p className="text-[12px] text-slate-800 font-bold">{step}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button className="adv-btn adv-btn-ghost">Export Plan (PDF)</button>
                    <button onClick={() => setStage('existing')} className="adv-btn adv-btn-primary">Launch & Setup Workspace</button>
                  </div>
                </motion.div>
              ) : (
                <div className="adv-card p-12 text-center text-slate-400 space-y-3">
                  <span className="material-symbols-rounded text-slate-200 text-6xl">insights</span>
                  <h3 className="font-black text-slate-700 text-base">Start-up Idea Validation Desk</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto">Input your business idea on the left and let Arkle analyze its market potential, audience segmentation, and legal steps.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}


      {/* ═══════ STAGE 2: GROWING SETUP & LEGAL INCORPORATION ═══════ */}
      {stage === 'growing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="adv-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-rounded text-blue-600">gavel</span>
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Business Registration Hub</p>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Select growing business registrations. SetMyBizz team handles filings directly.</p>
              
              <div className="space-y-3">
                {[
                  { name: 'Udyam / MSME Registration', desc: 'Settle tax benefits and subvention loans', cost: '₹999' },
                  { name: 'GSTIN Registration', desc: 'For inter-state selling (Amazon/Flipkart ready)', cost: '₹1,999' },
                  { name: 'Trademark Registry (TM)', desc: 'Protect brand name & logo', cost: '₹5,999' },
                  { name: 'Startup India DPIIT Recognition', desc: 'Get 3 Years Tax Exemption benefits', cost: '₹4,999' }
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
                    <div>
                      <p className="text-[11px] font-bold text-slate-800 leading-tight">{s.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-0.5">{s.desc}</p>
                    </div>
                    <button onClick={() => { setCaReviewStatus(`Initiated ${s.name} registration request.`); }} className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-[9px] font-black uppercase whitespace-nowrap">{s.cost}</button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="adv-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-rounded text-emerald-600">account_balance</span>
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Zero-Balance Banking OS</p>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Instantly set up startup bank accounts with ICICI, HDFC, or Jupiter partner APIs directly inside your OS.</p>
              <button onClick={() => { setCaReviewStatus('Redirecting to Partner KYC Verification...'); }} className="w-full adv-btn adv-btn-primary bg-emerald-600 hover:bg-emerald-700">Open Startup Bank Account →</button>
            </div>
          </div>
          
          <div className="lg:col-span-7 space-y-4">
            <div className="adv-card p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <span className="material-symbols-rounded text-[20px]">chat</span>
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm uppercase">Speak with CA / Tax Advisor</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">SetMyBizz Realtime Help Desk</p>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] text-slate-600 font-semibold leading-relaxed">
                💬 Need advice on private company incorporation, GST exemptions, or director listings? Click below to start an interactive consult with a live professional SetMyBizz accountant.
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => { setAiOutput('CA Advisor: "Hello! SetMyBizz CA here. Based on your stage, we recommend starting with a Proprietorship or LLP to keep compliance costs low. Let us know if you want to apply for MSME Udyam."'); }} className="adv-btn adv-btn-primary flex-1">Book Free Consultation Call</button>
                <button onClick={() => { setAiOutput('CA Advisor: "Here is your customized document checklist: 1. PAN, 2. Aadhaar, 3. Address Proof (Electricity bill / Rent agreement). Please upload these in the Business Vault."'); }} className="adv-btn adv-btn-ghost flex-1">Get Document Checklist</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ STAGE 3: EXISTING BUSINESS OPERATION & ADVISORY ═══════ */}
      {stage === 'existing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Parameters & Goals */}
          <div className="lg:col-span-5 space-y-4">
            <div className="adv-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-rounded text-blue-600">domain</span>
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Business Context</p>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Industry Sector</label>
                <select className="adv-input" value={industry} onChange={e => setIndustry(e.target.value)}>
                  <option>D2C & E-Commerce</option>
                  <option>Retail Trade & Supermarkets</option>
                  <option>Agriculture & Supply Chain</option>
                  <option>SaaS / Tech platform</option>
                  <option>Manufacturing & Logistics</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Business Size</label>
                <select className="adv-input" value={bizSize} onChange={e => setBizSize(e.target.value)}>
                  <option>Micro Enterprise (Turnover under 5Cr)</option>
                  <option>Small Enterprise (Turnover 5Cr - 75Cr)</option>
                  <option>Medium Enterprise (Turnover 75Cr - 250Cr)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Immediate Business Goal</label>
                <select className="adv-input" value={bizGoal} onChange={e => setBizGoal(e.target.value)}>
                  <option>Expanding customer acquisition & marketing</option>
                  <option>Filing GST, tax saving and audit compliance</option>
                  <option>Hiring first team members & setup payroll</option>
                  <option>Raising bank loans / Seed grants</option>
                </select>
              </div>
            </div>

            {/* Strategic Advisory Personas */}
            <div className="adv-card p-6 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-rounded text-blue-600">groups</span>
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Advisor Boardroom</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'CEO', label: 'CEO Strategist', icon: 'psychology', desc: 'Growth & Roadmap' },
                  { id: 'CMO', label: 'CMO Marketing', icon: 'campaign', desc: 'Leads & Marketing' },
                  { id: 'CA', label: 'CA Accountant', icon: 'balance', desc: 'GST & Compliance' },
                  { id: 'Admin', label: 'Admin Ops', icon: 'settings', desc: 'Legals & Agreements' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setActivePersona(p.id as any); setAiOutput(''); }}
                    className={`p-3 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-95 ${activePersona === p.id ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-700'}`}
                  >
                    <span className="material-symbols-rounded text-[18px] block mb-1">{p.icon}</span>
                    <p className="text-[10px] font-black uppercase tracking-wider leading-none">{p.label}</p>
                    <p className={`text-[8px] font-bold mt-1 ${activePersona === p.id ? 'text-blue-100' : 'text-slate-400'}`}>{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CA & Compliance Services Desk */}
          <div className="lg:col-span-12 space-y-4">
            <div className="adv-card p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-rounded text-emerald-600">assignment_turned_in</span>
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-wider">Professional CA & Compliance Services</p>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mb-4">Select the services you need. Our professional CAs and experts will handle the rest.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'GST Filing', desc: 'Monthly/Quarterly GSTR-1 & 3B filing', icon: 'receipt' },
                  { name: 'Virtual CFO', desc: 'Strategic financial planning & forecasting', icon: 'trending_up' },
                  { name: 'Statutory Audit', desc: 'Annual company audit by certified CA', icon: 'fact_check' },
                  { name: 'CMA Reports', desc: 'Credit Monitoring Arrangement for bank loans', icon: 'analytics' },
                  { name: 'Director KYC', desc: 'Annual DIR-3 KYC compliance', icon: 'badge' },
                  { name: 'Bookkeeping', desc: 'End-to-end accounting & ledger maintenance', icon: 'menu_book' }
                ].map((s, i) => (
                  <div key={i} className="flex justify-between items-start p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-rounded text-[16px]">{s.icon}</span>
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-slate-800 leading-tight">{s.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">{s.desc}</p>
                      </div>
                    </div>
                    <button onClick={() => { setCaReviewStatus(`Requested service: ${s.name}. A CA will contact you shortly.`); }} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 rounded-lg text-[9px] font-black uppercase whitespace-nowrap transition-all shadow-sm">
                      Request
                    </button>
                  </div>
                ))}
              </div>
              
              {caReviewStatus && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[10px] font-bold text-emerald-700 leading-relaxed">
                  📢 Status: {caReviewStatus}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Advisory Output */}
          <div className="lg:col-span-12 space-y-4">
            <div className="adv-card p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <span className="material-symbols-rounded text-[20px]">
                    {activePersona === 'CEO' ? 'psychology' : activePersona === 'CMO' ? 'campaign' : activePersona === 'CA' ? 'balance' : 'settings'}
                  </span>
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm uppercase">Consulting Arkle {activePersona}</h3>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Real-time business advice active</p>
                </div>
              </div>

              {/* Persona Quick Actions Prompts */}
              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Recommended Actions</p>
                <div className="flex flex-wrap gap-1.5">
                  {activePersona === 'CEO' && [
                    { q: 'Suggest strategic roadmap for scaling revenue', label: '🗺️ Revenue Roadmap' },
                    { q: 'Analyze potential business threats in this sector', label: '⚠️ Threat Analysis' }
                  ].map(a => <button key={a.label} onClick={() => handleConsultAdvisor(a.q)} className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[10px] font-bold transition-all">{a.label}</button>)}

                  {activePersona === 'CMO' && [
                    { q: 'Create 5 Instagram & WhatsApp promotional captions', label: '📱 Social Media Campaign' },
                    { q: 'Suggest offline marketing strategies for rural hubs', label: '📢 Rural Marketing Plan' }
                  ].map(a => <button key={a.label} onClick={() => handleConsultAdvisor(a.q)} className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[10px] font-bold transition-all">{a.label}</button>)}

                  {activePersona === 'CA' && [
                    { q: 'Explain GST exemption thresholds and filing guidelines', label: '⚖️ GST Compliance Check' },
                    { q: 'Draft tax-saving strategies for this micro startup', label: '💰 Tax Optimization Tips' }
                  ].map(a => <button key={a.label} onClick={() => handleConsultAdvisor(a.q)} className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[10px] font-bold transition-all">{a.label}</button>)}

                  {activePersona === 'Admin' && [
                    { q: 'Generate draft terms for founder equity split', label: '📝 Founder Agreement Template' },
                    { q: 'Create a contractor hire template for this sector', label: '🤝 Contractor Hire Template' }
                  ].map(a => <button key={a.label} onClick={() => handleConsultAdvisor(a.q)} className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[10px] font-bold transition-all">{a.label}</button>)}
                </div>
              </div>

              {/* Direct query box */}
              <div className="flex gap-2">
                <input
                  value={customQuery}
                  onChange={e => setCustomQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleConsultAdvisor()}
                  placeholder={`Ask Arkle ${activePersona} anything...`}
                  className="adv-input flex-1"
                />
                <button
                  onClick={() => handleConsultAdvisor()}
                  disabled={isAiLoading || !customQuery.trim()}
                  className="adv-btn adv-btn-primary px-5"
                >
                  Ask
                </button>
              </div>

              {/* AI Advice Output */}
              <AnimatePresence mode="wait">
                {(aiOutput || isAiLoading) && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-5 rounded-2xl bg-blue-50 border border-blue-100/50 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                      <p className="text-[9px] font-black text-blue-700 uppercase tracking-widest">{activePersona} Response</p>
                    </div>
                    {isAiLoading ? (
                      <div className="flex gap-1.5 items-center py-2 text-slate-400 text-xs font-bold">
                        <div className="w-3.5 h-3.5 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                        Generating expert advisory advice...
                      </div>
                    ) : (
                      <div className="text-[12px] text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{aiOutput}</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

