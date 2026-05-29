'use client';
import React, { useState } from 'react';

interface Scheme {
  id: string;
  name: string;
  category: 'grants' | 'loans' | 'tax' | 'women';
  amount: string;
  description: string;
  eligibility: string;
  matchScore: number;
  tags: string[];
}

export default function BharatSupportTab() {
  const [activeTab, setActiveTab] = useState<'schemes' | 'dpr'>('schemes');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Scheme Matcher Inputs
  const [sector, setSector] = useState('tech');
  const [stage, setStage] = useState('mvp');
  const [location, setLocation] = useState('urban');
  const [isWomenLed, setIsWomenLed] = useState('no');
  
  // DPR Generator Inputs
  const [dprBusinessName, setDprBusinessName] = useState('');
  const [dprIdea, setDprIdea] = useState('');
  const [loanAmount, setLoanAmount] = useState('500000');
  const [machineryCost, setMachineryCost] = useState('300000');
  const [workingCapital, setWorkingCapital] = useState('200000');
  const [isGeneratingDpr, setIsGeneratingDpr] = useState(false);
  const [generatedDpr, setGeneratedDpr] = useState<any | null>(null);

  const schemesData: Scheme[] = [
    {
      id: 'sisfs',
      name: 'Startup India Seed Fund Scheme (SISFS)',
      category: 'grants',
      amount: 'Up to ₹20 Lakhs (Grants) / ₹50 Lakhs (Debt)',
      description: 'Provides financial assistance to startups for proof of concept, prototype development, product trials, and market entry.',
      eligibility: 'DPIIT recognized startup, incorporated less than 2 years ago, tech/innovative business model.',
      matchScore: stage === 'idea' ? 95 : stage === 'mvp' ? 88 : 70,
      tags: ['DPIIT Required', 'Seed Grant']
    },
    {
      id: 'mudra',
      name: 'Pradhan Mantri MUDRA Yojana (PMRY)',
      category: 'loans',
      amount: 'Up to ₹10 Lakhs (Collateral-Free)',
      description: 'Provides low-interest, collateral-free loans for non-corporate, non-farm small/micro enterprises to buy equipment and scale.',
      eligibility: 'MSME registration, solid project business report, Indian citizen.',
      matchScore: location === 'rural' ? 98 : 85,
      tags: ['Collateral Free', 'Low Interest']
    },
    {
      id: 'cgtmse',
      name: 'Credit Guarantee Scheme for Micro & Small Enterprises (CGTMSE)',
      category: 'loans',
      amount: 'Up to ₹2 Crores Credit',
      description: 'Collateral-free credit facility provided by active financial institutions to first-generation entrepreneurs.',
      eligibility: 'New and existing Micro and Small Enterprises engaged in manufacturing or service activities.',
      matchScore: stage === 'scaling' ? 92 : 75,
      tags: ['Bank Credit', 'Government Backed']
    },
    {
      id: '80iac',
      name: 'Section 80-IAC Tax Holiday',
      category: 'tax',
      amount: '100% Tax Exemption for 3 Consecutive Years',
      description: 'Allows recognized startups to claim full income tax exemption on profits to boost early-stage capital retention.',
      eligibility: 'Private Limited or LLP, incorporated after April 1, 2016, working towards innovation or improvement.',
      matchScore: stage === 'scaling' || stage === 'mvp' ? 90 : 60,
      tags: ['Tax Saving', 'DPIIT Exclusive']
    },
    {
      id: 'standup',
      name: 'Stand-Up India Scheme',
      category: 'women',
      amount: '₹10 Lakhs to ₹1 Crore Loan',
      description: 'Promotes entrepreneurship among women and SC/ST communities by helping them set up greenfield enterprises.',
      eligibility: 'At least one woman or SC/ST founder holding minimum 51% stake in the business.',
      matchScore: isWomenLed === 'yes' ? 99 : 20,
      tags: ['Women-Led', 'Greenfield Project']
    },
    {
      id: 'zed',
      name: 'ZED Certification Scheme',
      category: 'tax',
      amount: 'Up to 80% Subsidy on Certification Costs',
      description: 'Supports MSMEs in adopting Zero Defect Zero Effect practices, improving quality, and accessing global export chains.',
      eligibility: 'Udyam registered manufacturing MSME.',
      matchScore: sector === 'manufacturing' ? 95 : 40,
      tags: ['Manufacturing', 'Export Ready']
    }
  ];

  const handleGenerateDpr = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingDpr(true);
    
    setTimeout(() => {
      const loan = parseFloat(loanAmount);
      const mach = parseFloat(machineryCost);
      const wc = parseFloat(workingCapital);
      
      const salesProjectionYr1 = (loan * 2.2).toFixed(0);
      const netProfitYr1 = (loan * 0.45).toFixed(0);
      const dscr = "2.18"; // Debt Service Coverage Ratio
      
      setGeneratedDpr({
        businessName: dprBusinessName || 'Your Enterprise',
        idea: dprIdea || 'General Services / Retail trading startup',
        totalProjectCost: loan,
        machinery: mach,
        workingCapital: wc,
        projections: {
          sales: salesProjectionYr1,
          expenses: (loan * 1.5).toFixed(0),
          netProfit: netProfitYr1,
          dscr: dscr
        }
      });
      setIsGeneratingDpr(false);
    }, 1800);
  };

  const filteredSchemes = schemesData
    .filter(scheme => {
      if (filterCategory === 'all') return true;
      return scheme.category === filterCategory;
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Dynamic Navigation Sub-Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            🇮🇳 Bharat Startup & MSME Support
          </h1>
          <p className="text-slate-500 font-medium mt-1 max-w-2xl text-xs uppercase tracking-widest">
            Goverment benefits, subsidies, and bank project reports on Autopilot.
          </p>
        </div>
        
        {/* Toggle Hub */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('schemes')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${activeTab === 'schemes' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Scheme Matcher
          </button>
          <button
            onClick={() => setActiveTab('dpr')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${activeTab === 'dpr' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Mudra DPR Generator
          </button>
        </div>
      </div>

      {activeTab === 'schemes' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* left column: Arkle Matcher Parameters */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-fit space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-indigo-600">tune</span>
              <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider">Arkle Vectors</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Business Sector</label>
                <select 
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition-colors"
                >
                  <option value="tech">Information Tech / SaaS</option>
                  <option value="manufacturing">Manufacturing / Hardware</option>
                  <option value="agriculture">Agriculture & Agro-processing</option>
                  <option value="retail">Retail / E-commerce</option>
                  <option value="services">Professional Services</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Current Stage</label>
                <select 
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition-colors"
                >
                  <option value="idea">Early Idea Stage</option>
                  <option value="mvp">Working Prototype / MVP</option>
                  <option value="scaling">Generating Revenue / Scaling</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Entity Location</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLocation('urban')}
                    className={`py-2 px-3 text-xs font-black uppercase tracking-wider rounded-xl border transition-all ${location === 'urban' ? 'bg-slate-950 border-slate-950 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                  >
                    Urban
                  </button>
                  <button
                    onClick={() => setLocation('rural')}
                    className={`py-2 px-3 text-xs font-black uppercase tracking-wider rounded-xl border transition-all ${location === 'rural' ? 'bg-slate-950 border-slate-950 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                  >
                    Rural (Subsidies+)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Women Founder (51%+ Stake)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsWomenLed('yes')}
                    className={`py-2 px-3 text-xs font-black uppercase tracking-wider rounded-xl border transition-all ${isWomenLed === 'yes' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setIsWomenLed('no')}
                    className={`py-2 px-3 text-xs font-black uppercase tracking-wider rounded-xl border transition-all ${isWomenLed === 'no' ? 'bg-slate-950 border-slate-950 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-2">
              <p className="text-[10px] font-bold text-slate-500 leading-relaxed">
                💡 <span className="font-black text-indigo-600">Arkle Tip:</span> Registering an **Udyam MSME certificate** takes only 5 mins and unlocks 90% of the loan benefits shown here.
              </p>
            </div>
          </div>
          
          {/* right column: Dynamic Schemes Cards List */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Category Filter buttons */}
            <div className="flex flex-wrap gap-2 mb-1">
              {[
                { id: 'all', label: 'All Benefits' },
                { id: 'grants', label: 'Grants' },
                { id: 'loans', label: 'Debt & Loans' },
                { id: 'tax', label: 'Tax Reliefs' },
                { id: 'women', label: 'Women-Led' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${filterCategory === cat.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {filteredSchemes.map((scheme) => (
              <div 
                key={scheme.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all relative overflow-hidden group"
              >
                {/* Match score bubble */}
                <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3.5 py-1.5 rounded-2xl shadow-inner">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[11px] font-black text-slate-800">{scheme.matchScore}% Match</span>
                </div>
                
                <div className="pr-20 space-y-2">
                  <div className="flex gap-2">
                    {scheme.tags.map((tg, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 text-[8px] font-black uppercase tracking-widest rounded-md">
                        {tg}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 leading-snug tracking-tight">{scheme.name}</h3>
                  
                  <div className="flex items-center gap-1 text-emerald-600 font-extrabold text-sm py-0.5">
                    <span className="material-symbols-outlined text-base">payments</span>
                    <span>{scheme.amount}</span>
                  </div>
                  
                  <p className="text-xs text-slate-500 leading-relaxed">{scheme.description}</p>
                  
                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Eligibility Rule</span>
                    <p className="text-[11px] font-bold text-slate-700 leading-relaxed">{scheme.eligibility}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <button 
                    onClick={() => alert(`Arkle AI is drafting your application file for: ${scheme.name}`)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition-all uppercase tracking-wider"
                  >
                    Apply with Arkle AI
                  </button>
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest cursor-pointer">
                    Scheme Guidelines →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Mudra DPR Generator screen */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* left column: Input Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-fit">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-indigo-600">edit_note</span>
              <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider">Project Inputs</h3>
            </div>
            
            <form onSubmit={handleGenerateDpr} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Business / Enterprise Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Sri Lakshmi Logistics"
                  value={dprBusinessName}
                  onChange={(e) => setDprBusinessName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Core Product / Idea Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain what your startup sells or does (e.g. cold-pressed organic peanut oils manufacturing)"
                  value={dprIdea}
                  onChange={(e) => setDprIdea(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition-colors leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Machinery/Asset Cost (₹)</label>
                  <input
                    type="number"
                    value={machineryCost}
                    onChange={(e) => setMachineryCost(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Working Capital (₹)</label>
                  <input
                    type="number"
                    value={workingCapital}
                    onChange={(e) => setWorkingCapital(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Requested Loan Amount (₹)</label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-indigo-300 bg-indigo-50/20 rounded-xl px-3.5 py-2.5 text-xs font-black text-slate-800 focus:outline-none focus:border-indigo-600 transition-colors"
                />
                <span className="text-[9px] font-bold text-slate-400 mt-1 block">Maximum permissible Mudra limit is ₹10,000,000.</span>
              </div>

              <button
                type="submit"
                disabled={isGeneratingDpr}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-100 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
              >
                {isGeneratingDpr ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Arkle AI Drafting Report...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    <span>Generate Bank-Ready DPR</span>
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* right column: Generated DPR Output */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 lg:p-8 h-full min-h-[400px] flex flex-col justify-between">
            {generatedDpr ? (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[8px] font-black uppercase tracking-widest rounded-md">SBI/Mudra Standard v2</span>
                    <h2 className="text-xl font-black text-slate-900 mt-1.5">{generatedDpr.businessName}</h2>
                    <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mt-0.5">Project Profile Report</p>
                  </div>
                  <button 
                    onClick={() => alert("Downloading PDF Project Report...")}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 transition-all"
                    title="Download Report"
                  >
                    <span className="material-symbols-outlined text-base">cloud_download</span>
                  </button>
                </div>
                
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">1. Executive Idea Profile</span>
                    <p className="text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">{generatedDpr.idea}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Financial Structure</span>
                      <div className="space-y-1 text-slate-800">
                        <div className="flex justify-between"><span className="font-bold">Total Cost:</span> <span className="font-black">₹{generatedDpr.totalProjectCost.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="font-bold">Machinery:</span> <span className="font-medium">₹{generatedDpr.machinery.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="font-bold">Working Cap:</span> <span className="font-medium">₹{generatedDpr.workingCapital.toLocaleString()}</span></div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Year 1 Projections</span>
                      <div className="space-y-1 text-slate-800">
                        <div className="flex justify-between"><span className="font-bold font-serif">Gross Sales:</span> <span className="font-black text-indigo-600">₹{parseFloat(generatedDpr.projections.sales).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="font-bold">Net Profit:</span> <span className="font-black text-emerald-600">₹{parseFloat(generatedDpr.projections.netProfit).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="font-bold">DSCR Ratio:</span> <span className="font-black text-slate-700">{generatedDpr.projections.dscr}</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">2. Loan Repayment schedule (Estimate)</span>
                    <p className="text-slate-500 leading-relaxed font-semibold">
                      Estimated Monthly Installment (EMI) for a term of 5 years at 8.9% interest: <span className="text-slate-900 font-extrabold">₹{(generatedDpr.totalProjectCost * 0.0207).toFixed(0)} / Month</span>.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <button 
                    onClick={() => alert("Submitting application directly to SBI Mudra Portal...")}
                    className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md uppercase tracking-wider text-center"
                  >
                    Submit directly to bank portal
                  </button>
                  <button 
                    onClick={() => alert("Arkle AI will now match this report with optimal bank branches in your pin code.")}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl border border-slate-200 uppercase tracking-wider"
                  >
                    Match Bank Branch
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl">description</span>
                </div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-1">DPR Document Desk</h4>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  Fill out the project inputs on the left. Arkle AI will instantly generate an audit-ready Project Profile Report formatted to public sector bank guidelines (SBI, PNB, BoB).
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
