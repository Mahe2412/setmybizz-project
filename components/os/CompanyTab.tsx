'use client';
import React, { useState } from 'react';
import { BIZ, MCA_FILINGS } from '@/lib/mockBizData';
import { StatusBadge } from '@/components/os/shared';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

type Section = 'identity' | 'vault' | 'directors' | 'compliance' | 'startup' | null;

const AccordionItem = ({
  id, icon, title, badge, children, isOpen, onToggle,
}: { id: Section; icon: string; title: string; badge?: React.ReactNode; children: React.ReactNode; isOpen: boolean; onToggle: () => void }) => (
  <div className="rounded-3xl border overflow-hidden transition-all duration-300" style={{ borderColor: isOpen ? '#e2e8f0' : '#f1f5f9', boxShadow: isOpen ? '0 20px 40px -20px rgba(0,0,0,0.05)' : 'none' }}>
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-4 p-5 text-left transition-all bg-white"
    >
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isOpen ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <span className="flex-1 text-[13px] font-black uppercase tracking-widest text-slate-900">{title}</span>
      {badge}
      <span className={`material-symbols-outlined text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
        >
            <div className="p-6 pt-2 bg-white border-t border-slate-50">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function CompanyTab() {
  const [open, setOpen] = useState<Section>('identity');
  const toggle = (s: Section) => setOpen(o => o === s ? null : s);
  const { user, dbUser, dbBusiness } = useAuth();
  
  // Vault specific toggles
  const [vaultSubMode, setVaultSubMode] = useState<'docs' | 'draft' | 'scan'>('docs');
  
  // AI Contract Drafter states
  const [contractType, setContractType] = useState('nda');
  const [partyA, setPartyA] = useState('');
  const [partyB, setPartyB] = useState('');
  const [jurisdiction, setJurisdiction] = useState('Hyderabad, Telangana');
  const [draftResult, setDraftResult] = useState<string | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  
  // AI Trap Clause Scanner states
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const liveBizName = dbBusiness?.name || dbBusiness?.business_name || dbUser?.business_name || BIZ.name;
  const liveUserName = dbUser?.full_name || user?.user_metadata?.full_name || 'Founder';
  const liveRegion = dbBusiness?.address || dbBusiness?.region || BIZ.address;
  const liveFirstName = liveUserName.split(' ')[0] || 'Operator';

  const liveDirectors = BIZ.directors ? [...BIZ.directors] : [];
  if (liveDirectors.length > 0) {
    liveDirectors[0] = { ...liveDirectors[0], name: liveUserName };
  }

  const [vaultDocs, setVaultDocs] = useState([
    { name: 'Incorporation Certificate', type: 'PDF', date: 'Mar 10, 2025' },
    { name: 'MOA & AOA Documents', type: 'PDF', date: 'Mar 10, 2025' },
    { name: 'GST Certificate', type: 'PDF', date: 'Mar 15, 2025' },
    { name: 'Founder Agreement - Signed', type: 'PDF', date: 'Apr 02, 2025' },
  ]);

  const handleCreateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDrafting(true);
    setTimeout(() => {
      let draftText = '';
      const pA = partyA || liveBizName;
      const pB = partyB || 'Second Party LLC';
      const city = jurisdiction || 'Hyderabad, India';

      if (contractType === 'nda') {
        draftText = `MUTUAL NON-DISCLOSURE AGREEMENT\n\nThis Agreement is entered into on this day between:\n1. ${pA} (Disclosing Party), and\n2. ${pB} (Receiving Party).\n\n1. Purpose: The parties wish to explore a business relationship under which confidential technical or financial parameters may be shared.\n2. Definition: "Confidential Information" refers to any proprietary info, patents, or trade secrets marked as confidential.\n3. Governing Law: This NDA shall be governed in accordance with the laws of India. Jurisdiction: Courts of ${city}.\n\nExecuted by authorized representatives of both parties.`;
      } else {
        draftText = `CO-FOUNDER EQUITY VESTING AGREEMENT\n\nThis Agreement is made between:\n1. ${pA} (Co-Founder A), and\n2. ${pB} (Co-Founder B).\n\n1. Equity Allocation: Co-Founder A shall hold 60% and Co-Founder B shall hold 40% equity in the entity.\n2. Vesting Schedule: All shares are subject to a 4-year vesting schedule with a 1-year cliff.\n3. Dispute Resolution: Arbitrated under the Arbitration and Conciliation Act. Jurisdiction: ${city}.`;
      }
      setDraftResult(draftText);
      setIsDrafting(false);
    }, 1500);
  };

  const handleScanContract = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScanResult({
        title: 'Vendor Master SLA Agreement.pdf',
        risks: [
          {
            level: 'high',
            title: 'Unilateral Indemnification Clause (Section 7.4)',
            desc: 'Shifts all operation losses to your startup, even if the vendor defaults.',
            translation: '⚠️ తెలుగు వివరణ: వెండర్ తప్పు చేసినా, నష్టపరిహారం మీ కంపెనీయే భరించాలని ఈ క్లాజ్ చెప్తోంది.'
          },
          {
            level: 'medium',
            title: 'Intellectual Property Assignment (Section 11.2)',
            desc: 'Assigns ownership of any derivative integration software developed by you to the vendor.',
            translation: '⚠️ తెలుగు వివరణ: మీరు తయారుచేసే సాఫ్ట్‌వేర్ వెండర్ కే చెందుతుంది. దీనిని మార్చాలి.'
          },
          {
            level: 'low',
            title: 'Lock-in and Notice (Section 14.1)',
            desc: '90-day prior written notice required for termination without cause.',
            translation: '⚠️ తెలుగు వివరణ: అగ్రిమెంట్ రద్దు చేసుకోవడానికి 90 రోజుల ముందే సమాచారం ఇవ్వాలి.'
          }
        ]
      });
      setIsScanning(false);
    }, 1800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 px-4">
      {/* Neural Entity Pulse */}
      <div className="rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 text-slate-900 border-2 border-slate-100 bg-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-[80px] -z-10 animate-pulse" />
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 relative z-10 text-center md:text-left">
          <div className="w-24 h-24 rounded-[2rem] bg-slate-900 shadow-2xl flex items-center justify-center font-black text-4xl text-white group-hover:scale-110 group-hover:rotate-6 transition-all shrink-0">
              {liveBizName[0] || 'B'}
          </div>
          <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-4">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">Entity Live & Synced</p>
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-1 tracking-tight italic">{liveBizName}</h1>
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em]">{dbBusiness?.industry || BIZ.structure} • {BIZ.roc}</p>
          </div>
          <div className="bg-slate-50 flex flex-col items-center justify-center px-8 py-5 rounded-[2rem] border border-slate-100 shadow-inner">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Health</p>
             <p className="text-3xl font-black text-slate-900">88<span className="text-xs text-slate-300">/100</span></p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Identity Hub */}
        <AccordionItem id="identity" icon="fingerprint" title="Identity Hub" isOpen={open === 'identity'} onToggle={() => toggle('identity')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {[
              { label: 'Company (CIN)', value: BIZ.cin, icon: 'qr_code' },
              { label: 'GST Identity', value: BIZ.gstin, icon: 'receipt' },
              { label: 'PAN Identity', value: BIZ.pan, icon: 'badge' },
              { label: 'Base ROC', value: BIZ.roc, icon: 'account_balance' },
              { label: 'Paid-up Capital', value: BIZ.paidUpCapital, icon: 'payments' },
              { label: 'Official Nexus', value: liveRegion, full: true },
            ].map(d => (
              <div key={d.label} className={`${d.full ? 'md:col-span-2' : ''} bg-slate-50 rounded-2xl p-5 border border-slate-100/50 hover:bg-white hover:shadow-xl transition-all group`}>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-indigo-600 transition-colors">{d.label}</p>
                <p className="text-sm font-black text-slate-900 leading-tight">{d.value}</p>
              </div>
            ))}
          </div>
        </AccordionItem>

        {/* Business Vault (Interactive OCR & Draft Options) */}
        <AccordionItem id="vault" icon="folder_special" title="Business Vault & Arkle Legal" isOpen={open === 'vault'} onToggle={() => toggle('vault')}>
            
            {/* Vault Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 mb-6 max-w-sm">
              <button
                onClick={() => setVaultSubMode('docs')}
                className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${vaultSubMode === 'docs' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Vault Docs
              </button>
              <button
                onClick={() => setVaultSubMode('draft')}
                className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${vaultSubMode === 'draft' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                AI Draft NDA
              </button>
              <button
                onClick={() => setVaultSubMode('scan')}
                className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${vaultSubMode === 'scan' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Scan Agreement
              </button>
            </div>

            {vaultSubMode === 'docs' && (
              <div className="space-y-3 mt-2">
                  {vaultDocs.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all group cursor-pointer">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-all">
                                  <span className="material-symbols-outlined text-sm">attachment</span>
                              </div>
                              <div>
                                  <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{doc.name}</h4>
                                  <p className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-widest">{doc.type} • Secured: {doc.date}</p>
                              </div>
                          </div>
                          <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                              <span className="material-symbols-outlined text-[20px]">cloud_download</span>
                          </button>
                      </div>
                  ))}
                  <button 
                    onClick={() => {
                      const newDocName = prompt("Enter document name to upload:");
                      if (newDocName) {
                        setVaultDocs([...vaultDocs, { name: newDocName, type: 'PDF', date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) }]);
                      }
                    }}
                    className="w-full mt-4 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-600 transition-all"
                  >
                    Upload New Record
                  </button>
              </div>
            )}

            {vaultSubMode === 'draft' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                <form onSubmit={handleCreateDraft} className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contract Type</label>
                    <select
                      value={contractType}
                      onChange={(e) => setContractType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      <option value="nda">Mutual NDA (Non-Disclosure)</option>
                      <option value="cofounder">Co-Founder Equity Vesting Agreement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Party A (Discloser / Founder)</label>
                    <input
                      type="text"
                      placeholder={liveBizName}
                      value={partyA}
                      onChange={(e) => setPartyA(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Party B (Receiver / Partner)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sri Balaji Solutions"
                      value={partyB}
                      onChange={(e) => setPartyB(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Legal Jurisdiction City</label>
                    <input
                      type="text"
                      placeholder="Hyderabad, Telangana"
                      value={jurisdiction}
                      onChange={(e) => setJurisdiction(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all"
                  >
                    {isDrafting ? 'Arkle Drafting...' : 'Draft with Arkle'}
                  </button>
                </form>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[250px]">
                  {draftResult ? (
                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                      <pre className="text-[10px] text-slate-700 font-mono overflow-y-auto max-h-[220px] whitespace-pre-wrap leading-relaxed">{draftResult}</pre>
                      <button
                        onClick={() => {
                          alert("Draft saved to Vault!");
                          setVaultDocs([...vaultDocs, { name: `${contractType === 'nda' ? 'Mutual NDA' : 'Founder Agreement'} - Draft`, type: 'PDF', date: 'Just Now' }]);
                          setDraftResult(null);
                        }}
                        className="w-full py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider rounded-lg hover:bg-indigo-600 transition-colors"
                      >
                        Save Draft to Vault
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                      <span className="material-symbols-outlined text-slate-300 text-3xl mb-2 font-light">note_add</span>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Contract Preview</p>
                      <p className="text-[11px] text-slate-500 max-w-[200px]">Fill the inputs on the left to review the legal document draft.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {vaultSubMode === 'scan' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {!scanResult ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-slate-400 mb-3 font-light">gavel</span>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-1">Arkle Trap Clause Finder</h3>
                    <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                      Upload any business agreement or vendor contract. Arkle scans for unfair clauses, hidden liabilities, and intellectual property transfers.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleScanContract}
                        disabled={isScanning}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all"
                      >
                        {isScanning ? 'Arkle Scanning OCR...' : 'Scan Sample Vendor SLA'}
                      </button>
                      <input 
                        type="file" 
                        id="contract-upload" 
                        className="hidden" 
                        onChange={handleScanContract}
                      />
                      <label 
                        htmlFor="contract-upload"
                        className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center justify-center"
                      >
                        Upload Custom Agreement
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide leading-none">{scanResult.title}</h4>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1 block">Arkle Audit Complete</span>
                      </div>
                      <button
                        onClick={() => setScanResult(null)}
                        className="text-xs font-black text-indigo-600 uppercase tracking-widest"
                      >
                        Clear Scan
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {scanResult.risks.map((risk: any, idx: number) => (
                        <div 
                          key={idx} 
                          className={`p-5 rounded-2xl border flex gap-4 items-start ${
                            risk.level === 'high' ? 'bg-red-50/55 border-red-100 text-red-950' : 
                            risk.level === 'medium' ? 'bg-amber-50/55 border-amber-100 text-amber-950' : 
                            'bg-slate-50 border-slate-100 text-slate-900'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            risk.level === 'high' ? 'bg-red-100 text-red-600' : 
                            risk.level === 'medium' ? 'bg-amber-100 text-amber-600' : 
                            'bg-slate-100 text-slate-600'
                          }`}>
                            <span className="material-symbols-outlined text-lg">warning</span>
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-xs font-black uppercase tracking-wider leading-none">{risk.title}</h5>
                            <p className="text-xs opacity-80 leading-relaxed font-semibold">{risk.desc}</p>
                            <p className="text-[11px] font-bold mt-1 text-slate-800 leading-relaxed">{risk.translation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
        </AccordionItem>

        {/* Primary Operators */}
        <AccordionItem id="directors" icon="groups" title="Primary Operators" isOpen={open === 'directors'} onToggle={() => toggle('directors')}>
          <div className="space-y-4 mt-2">
            {liveDirectors.map((d, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center gap-5 p-5 bg-slate-50 rounded-[2rem] border border-slate-100/50 hover:bg-white hover:shadow-xl transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-lg group-hover:rotate-12 transition-transform shrink-0">
                  {d.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div className="flex-1 text-center sm:text-left">
                   <p className="text-base font-black text-slate-900 tracking-tight">{d.name}</p>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 opacity-60">DIN: {d.din} • {d.designation}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </AccordionItem>

        {/* Compliance Sequence */}
        <AccordionItem
          id="compliance"
          icon="verified_user"
          title="Compliance Sequence"
          isOpen={open === 'compliance'} onToggle={() => toggle('compliance')}
          badge={<span className="text-[9px] font-black px-3 py-1 rounded-lg bg-red-600 text-white uppercase tracking-widest animate-pulse leading-none shadow-lg shadow-red-200">Critical</span>}
        >
          <div className="space-y-2 mt-2">
            {MCA_FILINGS.map((f, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                <div className="hidden sm:block w-2 h-10 rounded-full shrink-0" style={{ background: (f.status === 'filed' || f.status === 'ok') ? '#00c875' : '#e2445c' }} />
                <div className="flex-1 text-center sm:text-left">
                   <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{f.desc}</p>
                   <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{f.form} • Due: {f.due}</p>
                </div>
                <StatusBadge status={f.status} />
              </div>
            ))}
          </div>
        </AccordionItem>

        {/* Startup India Flow */}
        <AccordionItem
          id="startup"
          icon="auto_awesome"
          title="Neural Accelerator (DPIIT)"
          isOpen={open === 'startup'} onToggle={() => toggle('startup')}
        >
          <div className="mt-2 space-y-8 bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
            <p className="text-slate-400 text-xs font-bold leading-relaxed italic relative z-10">"{liveFirstName}, your entity is eligible for Section 80-IAC tax exemption. Launching the Startup India protocol will unlock benefits worth approx ₹12 Lakhs over 3 years."</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
              {[
                { icon: 'savings', title: 'Tax-Free Loop' },
                { icon: 'rocket', title: 'Seed Access' },
                { icon: 'gavel', title: 'Self-Compliance' },
              ].map(b => (
                <div key={b.title} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-all">
                  <span className="material-symbols-outlined text-indigo-400 mb-2">{b.icon}</span>
                  <p className="text-[9px] font-black uppercase tracking-widest">{b.title}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => alert("Initiating DPIIT Registration Sequence with Arkle AI...")}
              className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all"
            >
              Initiate Protocol
            </button>
          </div>
        </AccordionItem>
      </div>
    </div>
  );
}
