'use client';

import React, { useState } from 'react';

const SAMPLE_LEADS = [
  { id: 'L-001', name: 'Prakash Traders', company: 'Prakash Traders', phone: '9876543210', status: 'New', nextAction: 'Send proposal', value: 48000 },
  { id: 'L-002', name: 'Sesha Technologies', company: 'Sesha Technologies', phone: '9444556677', status: 'Follow-up', nextAction: 'WhatsApp demo link', value: 125000 },
  { id: 'L-003', name: 'Anitha Foods', company: 'Anitha Foods', phone: '9988776655', status: 'Negotiation', nextAction: 'Prepare invoice', value: 76000 },
];

const STATUS_STYLES: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700',
  'Follow-up': 'bg-amber-100 text-amber-700',
  Negotiation: 'bg-emerald-100 text-emerald-700',
  Won: 'bg-slate-100 text-slate-700',
};

export default function SalesTab() {
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadStage, setLeadStage] = useState('New');

  return (
    <div className="space-y-8 pb-20">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-slate-500">Sales Desk</p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">CRM Lite for BizDesk</h2>
            <p className="mt-2 text-sm text-slate-500 max-w-2xl">
              Track new enquiries, follow-ups, and winning opportunities without leaving your business desk.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4 shadow-inner">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Sales focus</div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl font-black text-slate-900">3</p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Open leads</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">₹46K</p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Potential value</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">2</p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Next actions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900">Active Leads</h3>
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-100">
              <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-0 bg-slate-50 px-5 py-4 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                <span>Lead</span>
                <span>Company</span>
                <span>Status</span>
                <span>Next action</span>
                <span className="text-right">Value</span>
              </div>
              <div className="divide-y divide-slate-100">
                {SAMPLE_LEADS.map(lead => (
                  <div key={lead.id} className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-0 px-5 py-4 items-center text-sm text-slate-700">
                    <div>
                      <p className="font-semibold">{lead.name}</p>
                      <p className="text-[11px] text-slate-400">{lead.id}</p>
                    </div>
                    <div>{lead.company}</div>
                    <div>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${STATUS_STYLES[lead.status] || 'bg-slate-100 text-slate-700'}`}>
                        {lead.status}
                      </span>
                    </div>
                    <div>{lead.nextAction}</div>
                    <div className="text-right font-black">₹{lead.value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900">Quick actions</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <button className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                Create proposal
              </button>
              <button className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                Send WhatsApp follow-up
              </button>
              <button className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                Convert to invoice
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-900">Add new lead</h3>
          <div className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Lead Name</label>
              <input value={leadName} onChange={(e) => setLeadName(e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400" placeholder="Name" />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Company</label>
              <input value={leadCompany} onChange={(e) => setLeadCompany(e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400" placeholder="Company" />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Phone / WhatsApp</label>
              <input value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400" placeholder="+91 9XXXXXXXXX" />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Stage</label>
              <select value={leadStage} onChange={(e) => setLeadStage(e.target.value)} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-400">
                <option>New</option>
                <option>Follow-up</option>
                <option>Negotiation</option>
                <option>Won</option>
              </select>
            </div>
            <button className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white hover:bg-slate-800 transition">
              Add lead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
