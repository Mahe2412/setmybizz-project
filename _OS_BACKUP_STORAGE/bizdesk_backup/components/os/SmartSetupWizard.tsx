'use client';
import React, { useState } from 'react';
import {
  INDUSTRY_INTELLIGENCE, SIZE_CONFIG,
  BusinessProfile, BusinessSize, BusinessStage, BusinessModel,
  createDefaultProfile, saveBrain
} from '@/lib/businessBrain';

interface SmartSetupWizardProps {
  onComplete: (profile: BusinessProfile) => void;
  ownerName?: string;
}

type Step = 'industry' | 'size' | 'stage' | 'goals' | 'details' | 'done';

const INDUSTRIES = Object.values(INDUSTRY_INTELLIGENCE);

const GOALS = [
  { id: 'increase_sales', label: 'Grow Sales & Revenue', icon: 'trending_up', color: '#00c875' },
  { id: 'compliance', label: 'Stay Legally Compliant', icon: 'gavel', color: '#e2445c' },
  { id: 'automate', label: 'Automate Operations', icon: 'smart_toy', color: '#9d94ff' },
  { id: 'expand', label: 'Expand / New Markets', icon: 'public', color: '#0073ea' },
  { id: 'fundraise', label: 'Fundraise / Get Investment', icon: 'paid', color: '#ffcc00' },
  { id: 'brand', label: 'Build Brand & Online Presence', icon: 'palette', color: '#ff7b00' },
  { id: 'reduce_costs', label: 'Cut Costs & Save Money', icon: 'savings', color: '#00d2d2' },
  { id: 'hire_team', label: 'Build My Team', icon: 'group_add', color: '#323338' },
];

const CHALLENGES = [
  { id: 'gst_filing', label: 'GST & Tax Filing' },
  { id: 'lead_management', label: 'Getting & Managing Leads' },
  { id: 'inventory', label: 'Inventory / Stock Control' },
  { id: 'cash_flow', label: 'Cash Flow Problems' },
  { id: 'customer_retention', label: 'Retaining Customers' },
  { id: 'hiring', label: 'Finding Good Employees' },
  { id: 'marketing', label: 'Marketing & Social Media' },
  { id: 'accounting', label: 'Accounts & Bookkeeping' },
  { id: 'legal_compliance', label: 'Legal & Compliance' },
  { id: 'scaling', label: 'Scaling the Business' },
];

const BUSINESS_TYPES = [
  'Proprietorship / Self-Employed',
  'Partnership Firm',
  'LLP (Limited Liability Partnership)',
  'Private Limited Company',
  'OPC (One Person Company)',
  'MSME / Udyam',
  'Startup India (DPIIT Recognized)',
  'NGO / Section 8 Company',
  'Not Yet Registered',
];

const STEPS: Step[] = ['industry', 'size', 'stage', 'goals', 'details', 'done'];

export default function SmartSetupWizard({ onComplete, ownerName = 'Founder' }: SmartSetupWizardProps) {
  const [step, setStep] = useState<Step>('industry');
  const [profile, setProfile] = useState<BusinessProfile>(createDefaultProfile({ ownerName }));
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex) / (STEPS.length - 1)) * 100;

  const next = (stepId?: Step) => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep(stepId || STEPS[stepIndex + 1]);
      setIsAnimating(false);
    }, 200);
  };

  const selectIndustry = (id: string) => {
    setProfile(p => ({ ...p, industry: id }));
    next('size');
  };

  const selectSize = (id: BusinessSize) => {
    setProfile(p => ({ ...p, size: id }));
    next('stage');
  };

  const selectStage = (id: BusinessStage) => {
    setProfile(p => ({ ...p, stage: id }));
    next('goals');
  };

  const toggleChallenge = (id: string) => {
    setSelectedChallenges(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const finishSetup = () => {
    const finalProfile: BusinessProfile = {
      ...profile,
      challenges: selectedChallenges,
      setupComplete: true,
    };
    saveBrain(finalProfile);
    next('done');
    setTimeout(() => onComplete(finalProfile), 1500);
  };

  const selectedIndustry = INDUSTRY_INTELLIGENCE[profile.industry];

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b border-slate-100">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
              <span className="text-white text-[14px] font-black">A</span>
            </div>
            <div>
              <p className="text-[13px] font-black text-slate-900">SetMyBizz OS</p>
              <p className="text-[10px] text-slate-400 font-medium">Business Setup Wizard</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step {stepIndex + 1} of {STEPS.length - 1}</p>
          </div>
        </div>
        {/* Progress */}
        <div className="max-w-2xl mx-auto mt-3">
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-2xl mx-auto px-6 py-8">

          {/* ── STEP 1: INDUSTRY ── */}
          {step === 'industry' && (
            <div>
              <div className="mb-8 text-center">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-blue-600 text-[28px]">business_center</span>
                </div>
                <h1 className="text-[26px] font-black text-slate-900 mb-2">Welcome, {ownerName}! 🙏</h1>
                <p className="text-slate-400 text-[14px]">Which type of business are you running?<br/>Arkle will personalize everything for your industry.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {INDUSTRIES.map(ind => (
                  <button
                    key={ind.id}
                    onClick={() => selectIndustry(ind.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all hover:shadow-lg group ${profile.industry === ind.id ? 'border-blue-500 shadow-lg' : 'border-slate-100 hover:border-blue-200'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${ind.bgColor} flex items-center justify-center text-[22px] mb-3 group-hover:scale-110 transition-transform`}>
                      {ind.emoji}
                    </div>
                    <p className="text-[12px] font-black text-slate-900">{ind.label}</p>
                  </button>
                ))}
                {/* Other option */}
                <button
                  onClick={() => { setProfile(p => ({ ...p, industry: 'retail' })); next('size'); }}
                  className="p-4 rounded-2xl border-2 border-dashed border-slate-200 text-left hover:border-blue-300 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[22px] mb-3">🎲</div>
                  <p className="text-[12px] font-black text-slate-500">Other / General</p>
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: BUSINESS SIZE ── */}
          {step === 'size' && (
            <div>
              <div className="mb-8 text-center">
                <div className={`w-14 h-14 ${selectedIndustry?.bgColor || 'bg-blue-50'} rounded-2xl flex items-center justify-center mx-auto mb-4 text-[28px]`}>
                  {selectedIndustry?.emoji || '🏢'}
                </div>
                <h1 className="text-[24px] font-black text-slate-900 mb-2">What's your team size?</h1>
                <p className="text-slate-400 text-[13px]">We'll set up the right tools and dashboards for your scale</p>
              </div>
              <div className="space-y-3">
                {Object.entries(SIZE_CONFIG).map(([id, cfg]) => (
                  <button
                    key={id}
                    onClick={() => selectSize(id as BusinessSize)}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all hover:shadow-md flex items-center gap-4 ${profile.size === id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-blue-200 bg-white'}`}
                  >
                    <div className="text-[28px] shrink-0">{cfg.emoji}</div>
                    <div className="flex-1">
                      <p className="text-[14px] font-black text-slate-900">{cfg.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{cfg.teamRange} · {cfg.revenueRange}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {cfg.keyNeeds.slice(0, 2).map(need => (
                        <span key={need} className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{need}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 3: STAGE ── */}
          {step === 'stage' && (
            <div>
              <div className="mb-8 text-center">
                <h1 className="text-[24px] font-black text-slate-900 mb-2">Where is your business today?</h1>
                <p className="text-slate-400 text-[13px]">This helps Arkle give stage-appropriate advice</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'idea', emoji: '💡', label: 'Idea Stage', desc: 'Just a vision, not started yet' },
                  { id: 'setup', emoji: '⚙️', label: 'Setting Up', desc: 'Registering, building basics' },
                  { id: 'mvp', emoji: '🛠️', label: 'Early MVP', desc: 'First product, few customers' },
                  { id: 'operating', emoji: '🚀', label: 'Operating', desc: 'Running, generating revenue' },
                  { id: 'scaling', emoji: '📈', label: 'Scaling', desc: 'Growing fast, hiring team' },
                  { id: 'enterprise', emoji: '🏛️', label: 'Enterprise', desc: 'Established, multi-crore revenue' },
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => selectStage(s.id as BusinessStage)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all hover:shadow-md ${profile.stage === s.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-blue-200 bg-white'}`}
                  >
                    <div className="text-[28px] mb-2">{s.emoji}</div>
                    <p className="text-[13px] font-black text-slate-900">{s.label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 4: GOALS & CHALLENGES ── */}
          {step === 'goals' && (
            <div>
              <div className="mb-6 text-center">
                <h1 className="text-[24px] font-black text-slate-900 mb-2">What's your #1 goal right now?</h1>
                <p className="text-slate-400 text-[13px]">And pick your current challenges (multiple ok)</p>
              </div>

              <div className="mb-6">
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Primary Goal</p>
                <div className="grid grid-cols-2 gap-2">
                  {GOALS.map(g => (
                    <button
                      key={g.id}
                      onClick={() => setProfile(p => ({ ...p, primaryGoal: g.id }))}
                      className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${profile.primaryGoal === g.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-blue-200 bg-white'}`}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: g.color + '20' }}>
                        <span className="material-symbols-outlined text-[16px]" style={{ color: g.color }}>{g.icon}</span>
                      </div>
                      <span className="text-[11px] font-black text-slate-800">{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Current Challenges <span className="text-slate-300">(pick all that apply)</span></p>
                <div className="flex flex-wrap gap-2">
                  {CHALLENGES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => toggleChallenge(c.id)}
                      className={`px-3 py-2 rounded-xl border-2 text-[11px] font-black transition-all ${selectedChallenges.includes(c.id) ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-200 text-slate-600 hover:border-blue-300 bg-white'}`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => next('details')}
                className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[14px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30"
              >
                Continue →
              </button>
            </div>
          )}

          {/* ── STEP 5: DETAILS ── */}
          {step === 'details' && (
            <div>
              <div className="mb-6 text-center">
                <h1 className="text-[24px] font-black text-slate-900 mb-2">Almost done! Business details</h1>
                <p className="text-slate-400 text-[13px]">This lets Arkle address you and your business correctly</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Business Name *</label>
                  <input
                    value={profile.businessName}
                    onChange={e => setProfile(p => ({ ...p, businessName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] font-medium text-slate-900 outline-none focus:border-blue-500 transition-all"
                    placeholder={`e.g. ${selectedIndustry?.emoji} Sharma Medical Store`}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Your Name *</label>
                  <input
                    value={profile.ownerName}
                    onChange={e => setProfile(p => ({ ...p, ownerName: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] font-medium text-slate-900 outline-none focus:border-blue-500 transition-all"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Business Type</label>
                  <select
                    value={profile.businessType}
                    onChange={e => setProfile(p => ({ ...p, businessType: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] font-medium text-slate-900 outline-none focus:border-blue-500 bg-white transition-all"
                  >
                    {BUSINESS_TYPES.map(bt => <option key={bt}>{bt}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">City / Location</label>
                  <input
                    value={profile.location || ''}
                    onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] font-medium text-slate-900 outline-none focus:border-blue-500 transition-all"
                    placeholder="e.g. Hyderabad, Telangana"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">GSTIN <span className="text-slate-300 normal-case font-medium">(optional)</span></label>
                  <input
                    value={profile.gstin || ''}
                    onChange={e => setProfile(p => ({ ...p, gstin: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] font-medium text-slate-900 outline-none focus:border-blue-500 font-mono transition-all"
                    placeholder="e.g. 36AABCT1234M1Z5"
                  />
                </div>
              </div>

              <button
                onClick={finishSetup}
                disabled={!profile.businessName || !profile.ownerName}
                className={`w-full mt-8 py-4 rounded-2xl font-black text-[14px] transition-all ${profile.businessName && profile.ownerName ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
              >
                🚀 Launch My Arkle OS
              </button>
            </div>
          )}

          {/* ── DONE ── */}
          {step === 'done' && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 bg-blue-500/20 rounded-3xl animate-ping scale-125" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/40">
                  <span className="material-symbols-outlined text-white text-[48px]">check_circle</span>
                </div>
              </div>
              <h1 className="text-[28px] font-black text-slate-900 mb-3">
                {selectedIndustry?.emoji} Arkle is Ready!
              </h1>
              <p className="text-slate-400 text-[14px] max-w-sm leading-relaxed mb-2">
                Your <strong className="text-slate-700">{profile.businessName}</strong> workspace is being configured for <strong className="text-slate-700">{selectedIndustry?.label}</strong>.
              </p>
              <p className="text-[12px] text-blue-600 font-black animate-pulse">Setting up your personalized OS...</p>

              {/* Preview of what's being configured */}
              <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-sm">
                {['Industry CRM', 'AI Agents', 'Workflows'].map((item, i) => (
                  <div key={item} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[12px]">check</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
