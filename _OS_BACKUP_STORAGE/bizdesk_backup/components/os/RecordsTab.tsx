'use client';
import React, { useState } from 'react';
import { RECORDS } from '@/lib/mockBizData';
import { DCard, SectionTitle, StatusBadge, ActionBtn, T } from '@/components/os/shared';

const CATS = ['All', 'Legal', 'Tax', 'Brand', 'Banking'];

export default function RecordsTab() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const visible = RECORDS.filter(r => {
    const matchCat    = filter === 'All' || r.cat === filter;
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-5">
      <SectionTitle icon="🗄️" title="Startup Records Room" sub="All certificates, filings & documents — secure vault" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {([
          { label: 'Total Records', value: RECORDS.length,                                      color: T.blue   },
          { label: 'Verified',      value: RECORDS.filter(r => r.status === 'verified').length, color: T.green  },
          { label: 'Pending Audit', value: RECORDS.filter(r => r.status === 'pending').length,  color: T.amber  },
          { label: 'Synced',        value: RECORDS.filter(r => r.status === 'filed').length,    color: T.purple },
        ] as const).map(s => (
          <div key={s.label} className="p-4 rounded-3xl text-center bg-white border border-slate-100 shadow-sm">
            <p className="text-xl md:text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl w-full sm:flex-1 bg-white border border-slate-100 shadow-sm">
          <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Query records..."
            className="bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none flex-1 font-bold"
          />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
          {CATS.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className="text-[10px] font-black px-4 py-2 rounded-xl transition-all uppercase tracking-widest"
              style={filter === c ? { background: T.blue, color: 'white' } : { background: 'white', color: '#64748b', border: '1px solid #f1f5f9' }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {visible.map((doc, i) => {
          const iconMap: Record<string, string> = { Legal: '📜', Tax: '🧾', Brand: '™️', Banking: '🏦' };
          return (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all group text-center sm:text-left"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform">
                {iconMap[doc.cat] ?? '📄'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-900 truncate uppercase tracking-tight">{doc.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{doc.cat} · {doc.date}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto justify-center">
                <StatusBadge status={doc.status} />
                <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 border border-slate-100 hover:border-blue-100 hover:bg-blue-50 transition-all shadow-sm" title="Download">
                  <span className="material-symbols-outlined text-lg">download</span>
                </button>
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <div className="col-span-full text-center py-20 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
             <span className="text-4xl block mb-4">🔍</span>
             <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No neural records found matching your query</p>
          </div>
        )}
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border-2 border-dashed border-blue-100 text-center flex flex-col items-center gap-4 hover:border-blue-300 transition-colors group">
          <span className="text-5xl group-hover:scale-110 transition-transform">📤</span>
          <h3 className="font-black text-slate-900 uppercase tracking-widest">Global Record Sync</h3>
          <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-normal leading-relaxed max-w-sm">Synchronize new certificates or filings into your startup vault. Verified by Arkle Neural Intelligence.</p>
          <button className="w-full sm:w-auto px-8 py-4 rounded-2xl text-[10px] font-black text-white bg-blue-600 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all uppercase tracking-[0.2em]">Initiate Upload Protocol →</button>
          <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest">PDF, JPG, PNG · Vault Protection Active</p>
      </div>
    </div>
  );
}
