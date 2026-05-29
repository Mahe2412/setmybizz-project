"use client";
import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// ── Types ──
type LeadStatus = 'New' | 'Called' | 'WhatsApp Sent' | 'Interested' | 'Converted' | 'No Response';

type SheetLead = {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: LeadStatus;
  lastFollowUp: string;
  notes: string;
};

// ── Master Lead Sheet Module (Excel Style with Smart Extractor) ──
function LeadSheetView() {
  const [leads, setLeads] = useState<SheetLead[]>([
    { id: '1', name: 'Mahesh Reddy', phone: '9988776655', source: 'AP Startup Group', status: 'New', lastFollowUp: '-', notes: 'Interested in GST' },
    { id: '2', name: 'Ravi Teja', phone: '8877665544', source: 'BizDesk Community', status: 'WhatsApp Sent', lastFollowUp: '2026-05-15', notes: 'Brochure sent' },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [targetCategory, setTargetCategory] = useState('AP Startup Group');

  const extractLeads = () => {
    // Advanced Regex to find Indian phone numbers in raw text
    const phoneRegex = /(\+91|91|0)?[6-9]\d{9}/g;
    const foundNumbers = Array.from(new Set(bulkInput.match(phoneRegex)));
    
    if (foundNumbers.length === 0) {
      alert('No valid phone numbers found in the text.');
      return;
    }

    const newLeads: SheetLead[] = foundNumbers.map((num, i) => ({
      id: `ext-${Date.now()}-${i}`,
      name: `Founder ${num.slice(-4)}`, // Placeholder name using last 4 digits
      phone: num.replace(/^(\+91|91|0)/, ''), // Standardize to 10 digits
      source: targetCategory,
      status: 'New',
      lastFollowUp: '-',
      notes: 'Imported via Bulk Extractor'
    }));

    setLeads([...newLeads, ...leads]);
    setBulkInput('');
    setIsExtracting(false);
    alert(`Successfully extracted and imported ${foundNumbers.length} leads!`);
  };

  const updateStatus = (id: string, status: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status, lastFollowUp: new Date().toISOString().split('T')[0] } : l));
  };

  const openWhatsApp = (phone: string) => {
    window.open(`https://wa.me/91${phone}?text=Hello! This is from SetMyBizz. We saw your interest in our services.`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-[#13151e] p-4 rounded-2xl border border-white/5 shadow-xl">
        <div className="flex items-center gap-3">
          <h2 className="text-white font-black text-sm uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-rounded text-indigo-400">table_chart</span> Master Lead Sheet
          </h2>
          <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-black rounded-full border border-indigo-500/20">{leads.length} Total Leads</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsExtracting(!isExtracting)}
            className="px-4 py-2 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition"
          >
            {isExtracting ? 'Close Extractor' : '⚡ Smart Bulk Extractor'}
          </button>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition"
          >
            {isAdding ? 'Cancel' : '+ Manual Lead'}
          </button>
        </div>
      </div>

      {/* Smart Extractor Window */}
      {isExtracting && (
        <div className="bg-[#13151e] p-6 rounded-3xl border border-indigo-500/30 space-y-4 animate-in fade-in zoom-in duration-300">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">1. Set Destination Category / Group Name</label>
            <input 
              value={targetCategory} 
              onChange={e => setTargetCategory(e.target.value)} 
              placeholder="e.g. AP Startup WhatsApp Group"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">2. Paste Raw Data (Copy from WhatsApp Group Info)</label>
            <textarea 
              value={bulkInput}
              onChange={e => setBulkInput(e.target.value)}
              placeholder="Paste text containing phone numbers here... the AI will extract them automatically."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-slate-700 outline-none focus:border-indigo-500 transition resize-none"
            />
          </div>
          <button onClick={extractLeads} className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2">
            <span className="material-symbols-rounded text-base">auto_fix_high</span>
            Extract & Import to Sheet
          </button>
        </div>
      )}

      {/* Quick Add Form */}
      {isAdding && (
        <div className="bg-[#13151e] p-6 rounded-2xl border border-emerald-500/30 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input placeholder="Founder Name" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none" />
          <input placeholder="Phone Number" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none" />
          <button className="bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest">Save</button>
        </div>
      )}

      {/* Spreadsheet Table */}
      <div className="bg-[#13151e] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <tr>
                <th className="p-4 border-b border-white/5">Founder / Venture</th>
                <th className="p-4 border-b border-white/5 text-center">Actions</th>
                <th className="p-4 border-b border-white/5">Phone</th>
                <th className="p-4 border-b border-white/5">Source Group</th>
                <th className="p-4 border-b border-white/5">Status</th>
                <th className="p-4 border-b border-white/5">Last Follow-up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {leads.map(l => (
                <tr key={l.id} className="hover:bg-white/2 transition group">
                  <td className="p-4 font-bold text-white">
                    {l.name}
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">{l.notes}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                       <button onClick={() => openWhatsApp(l.phone)} className="p-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl transition" title="WhatsApp">
                         <span className="material-symbols-rounded text-sm">chat</span>
                       </button>
                       <a href={`tel:${l.phone}`} className="p-2 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-xl transition" title="Call">
                         <span className="material-symbols-rounded text-sm">call</span>
                       </a>
                    </div>
                  </td>
                  <td className="p-4 text-indigo-400 font-mono font-bold tracking-wider">{l.phone}</td>
                  <td className="p-4"><span className="px-2 py-0.5 bg-indigo-500/10 rounded text-[9px] font-black uppercase text-indigo-300 border border-indigo-500/20">{l.source}</span></td>
                  <td className="p-4">
                    <select 
                      value={l.status} 
                      onChange={(e) => updateStatus(l.id, e.target.value as any)}
                      className={`bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-black uppercase outline-none ${
                        l.status === 'Converted' ? 'text-emerald-400' : l.status === 'No Response' ? 'text-rose-400' : 'text-amber-400'
                      }`}
                    >
                      {['New', 'Called', 'WhatsApp Sent', 'Interested', 'Converted', 'No Response'].map(s => (
                        <option key={s} value={s} className="bg-[#13151e]">{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-slate-500 font-bold uppercase text-[10px]">{l.lastFollowUp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Communication & Social Hub Module ──
function CommHubView() {
  const [postDraft, setPostDraft] = useState('');
  const [platform, setPlatform] = useState('Instagram');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
      {/* Social Media Publisher */}
      <div className="bg-[#13151e] rounded-2xl border border-white/5 p-6 shadow-xl space-y-6">
        <div className="flex justify-between items-center">
           <h3 className="text-white font-black text-sm uppercase tracking-wider">Social Media Publisher</h3>
           <div className="flex bg-white/5 p-1 rounded-xl">
              {['Instagram', 'WhatsApp', 'LinkedIn'].map(p => (
                <button key={p} onClick={() => setPlatform(p)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition ${platform === p ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>{p}</button>
              ))}
           </div>
        </div>

        <textarea 
          value={postDraft}
          onChange={e => setPostDraft(e.target.value)}
          placeholder={`Write your ${platform} post or DM message here...`}
          className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 transition resize-none"
        />

        <div className="flex items-center justify-between">
           <div className="flex gap-2">
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 transition"><span className="material-symbols-rounded text-sm">image</span></button>
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 transition"><span className="material-symbols-rounded text-sm">picture_as_pdf</span></button>
           </div>
           <button className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 flex items-center gap-2">
              <span className="material-symbols-rounded text-sm">send</span>
              Push to {platform}
           </button>
        </div>
      </div>

      {/* Broadcast History */}
      <div className="bg-[#13151e] rounded-2xl border border-white/5 p-6 shadow-xl space-y-4">
        <h3 className="text-white font-black text-[10px] uppercase tracking-widest text-slate-500">Recent Broadcasts</h3>
        <div className="space-y-3">
           {[
             { title: 'Summer Sale Promo', sentTo: 'WhatsApp Groups', reach: '1,250' },
             { title: 'Incorp Package PDF', sentTo: 'New Leads', reach: '45' },
             { title: 'Free Consultancy DM', sentTo: 'Insta Followers', reach: '890' }
           ].map((b, i) => (
             <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-white text-xs font-bold">{b.title}</p>
                <div className="flex justify-between items-center mt-2">
                   <span className="text-[9px] font-black text-indigo-400 uppercase">{b.sentTo}</span>
                   <span className="text-[10px] text-emerald-400 font-bold">{b.reach} Reach</span>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

// ── Existing Modules (Simplified for Routing) ──
function CRMView() { return <LeadSheetView />; }
function MarketingView() { return <CommHubView />; }

// ── BizDesk & Others (Hold from previous turn) ──
// ── BizDesk: Operations Center (The Multi-Service Matrix) ──
function BizDeskOpsView() {
  const [activeTab, setActiveTab] = useState<'services' | 'support' | 'saas'>('services');
  
  const services = [
    { id: 'S1', client: 'Nexus Global', type: 'Incorporation', package: 'Startup Pro', progress: 65, status: 'Name Approved' },
    { id: 'S2', client: 'AgriSmart', type: 'Trademark', package: 'TM Lite', progress: 20, status: 'Search Completed' },
    { id: 'S3', client: 'Creative Flow', type: 'Licenses', package: 'GST + FSSAI', progress: 90, status: 'Final Review' },
    { id: 'S4', client: 'TechSphere', type: 'Banking', package: 'Current A/c', progress: 40, status: 'KYC Pending' },
  ];

  return (
    <div className="space-y-6">
       {/* Sub-Navigation */}
       <div className="flex bg-[#13151e] p-1 rounded-2xl border border-white/5 w-fit">
          <button onClick={() => setActiveTab('services')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${activeTab === 'services' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}>Service Workflows</button>
          <button onClick={() => setActiveTab('support')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${activeTab === 'support' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}>Expert Support & Advice</button>
          <button onClick={() => setActiveTab('saas')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${activeTab === 'saas' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}>SaaS Ecosystem</button>
       </div>

       {activeTab === 'services' && (
         <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between items-center bg-[#13151e] p-4 rounded-2xl border border-white/5">
               <h3 className="text-white font-black text-sm uppercase tracking-wider">Startup Setup Pipeline</h3>
               <div className="flex gap-2">
                  {['Incorp', 'Licenses', 'TM', 'Banking'].map(s => (
                    <span key={s} className="px-2 py-1 bg-white/5 text-[9px] font-black text-slate-500 rounded border border-white/5 uppercase">{s}</span>
                  ))}
               </div>
            </div>
            <div className="bg-[#13151e] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="p-4">Client / Package</th>
                    <th className="p-4">Service Type</th>
                    <th className="p-4">Milestone Progress</th>
                    <th className="p-4">Live Status</th>
                    <th className="p-4 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {services.map(s => (
                    <tr key={s.id} className="hover:bg-white/2 transition">
                      <td className="p-4">
                         <p className="text-white font-bold">{s.client}</p>
                         <p className="text-[10px] text-indigo-400 font-black">{s.package}</p>
                      </td>
                      <td className="p-4 text-slate-400 font-bold">{s.type}</td>
                      <td className="p-4">
                         <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden mb-1">
                            <div className="h-full bg-indigo-500" style={{ width: `${s.progress}%` }} />
                         </div>
                         <p className="text-[9px] text-slate-500 font-bold">{s.progress}% Complete</p>
                      </td>
                      <td className="p-4">
                         <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded text-[9px] font-black uppercase border border-indigo-500/20">{s.status}</span>
                      </td>
                      <td className="p-4 text-right">
                         <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition text-slate-400"><span className="material-symbols-rounded text-sm">edit_square</span></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
         </div>
       )}

       {activeTab === 'support' && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#13151e] p-6 rounded-3xl border border-white/5 space-y-6">
               <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-rounded text-indigo-400">psychology</span> Expert Advice Requests
               </h3>
               <div className="space-y-3">
                  {[
                    { user: 'Mahesh Reddy', topic: 'GST Structure Advice', time: '10m ago' },
                    { user: 'Sarah Jen', topic: 'Trademark Conflict Issue', time: '2h ago' }
                  ].map((r, i) => (
                    <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                       <div>
                          <p className="text-white text-xs font-bold">{r.user}</p>
                          <p className="text-slate-500 text-[10px]">{r.topic}</p>
                       </div>
                       <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">Connect Expert</button>
                    </div>
                  ))}
               </div>
            </div>
            <div className="bg-[#13151e] p-6 rounded-3xl border border-white/5 space-y-6">
               <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-rounded text-emerald-400">support_agent</span> Customer Support
               </h3>
               <div className="p-10 text-center space-y-3">
                  <span className="material-symbols-rounded text-4xl text-slate-700">task_alt</span>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">All support queries resolved</p>
               </div>
            </div>
         </div>
       )}

       {activeTab === 'saas' && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'BizBook Sync', desc: 'Financial Ledger & Billing Pulse', icon: 'menu_book', color: 'text-emerald-400' },
              { name: 'Go Global', desc: 'International Setup Tracking', icon: 'public', color: 'text-indigo-400' },
              { name: 'Dedicated Dash', desc: 'Active Client Workspace Audit', icon: 'dashboard_customize', color: 'text-amber-400' }
            ].map(p => (
              <div key={p.name} className="bg-[#13151e] p-6 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition group cursor-pointer shadow-xl">
                 <span className={`material-symbols-rounded text-3xl ${p.color} mb-4`}>{p.icon}</span>
                 <h4 className="text-white font-black text-sm mb-1">{p.name}</h4>
                 <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tight">{p.desc}</p>
                 <div className="mt-6 flex justify-between items-center">
                    <span className="text-[10px] text-slate-600 font-black uppercase">Active Monitor</span>
                    <span className="material-symbols-rounded text-sm text-slate-700 group-hover:text-white transition">arrow_forward_ios</span>
                 </div>
              </div>
            ))}
         </div>
       )}
    </div>
  );
}

function DocumentsView() {
  return (
    <div className="bg-[#13151e] rounded-3xl border border-white/5 p-12 text-center">
       <span className="material-symbols-rounded text-5xl text-indigo-400 opacity-20 mb-4">folder_shared</span>
       <h2 className="text-white font-black text-xl">Document Vault</h2>
       <p className="text-slate-500 text-sm mt-2">Universal documents for all clients and leads.</p>
    </div>
  );
}

function SaaSPlatformView() {
  return (
    <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-12 text-center">
       <span className="material-symbols-rounded text-5xl text-indigo-400 mb-4">cloud_sync</span>
       <h2 className="text-white font-black text-xl">BizOS SaaS Platform</h2>
       <p className="text-slate-400 text-sm mt-2">Manage system health, active tenants, and platform-wide rules.</p>
    </div>
  );
}

// ── Router Engine ──
function AdminContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'crm';
  const space = searchParams.get('space') || 'setmybizz';

  return useMemo(() => {
    if (space === 'saas') return <SaaSPlatformView />;
    
    switch (view) {
      case 'crm':        return <LeadSheetView />;
      case 'marketing':  return <CommHubView />;
      case 'leads':      return <BizDeskOpsView />;
      case 'documents':  return <DocumentsView />;
      default:           return <LeadSheetView />;
    }
  }, [view, space]);
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-12 text-slate-500 text-xs font-bold animate-pulse">Synchronizing CommandOS...</div>}>
      <AdminContent />
    </Suspense>
  );
}
