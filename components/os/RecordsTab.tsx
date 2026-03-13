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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {([
          { label: 'Total Documents', value: RECORDS.length,                                      color: T.blue   },
          { label: 'Verified',        value: RECORDS.filter(r => r.status === 'verified').length, color: T.green  },
          { label: 'Pending',         value: RECORDS.filter(r => r.status === 'pending').length,  color: T.amber  },
          { label: 'Filed',           value: RECORDS.filter(r => r.status === 'filed').length,    color: T.purple },
        ] as const).map(s => (
          <div key={s.label} className="p-3 rounded-2xl text-center bg-white border border-slate-200 shadow-sm">
            <p className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 min-w-[180px] bg-white border border-slate-200 shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none flex-1"
          />
        </div>
        {CATS.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className="text-[11px] font-bold px-3 py-1.5 rounded-full transition-all"
            style={filter === c ? { background: T.blue, color: 'white' } : { background: 'white', color: '#64748b', border: '1px solid #e2e8f0' }}
          >
            {c}
          </button>
        ))}
        <ActionBtn label="+ Upload" color={T.blue} />
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {visible.map((doc, i) => {
          const iconMap: Record<string, string> = { Legal: '📜', Tax: '🧾', Brand: '™️', Banking: '🏦' };
          return (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-blue-50 border border-blue-100">
                {iconMap[doc.cat] ?? '📄'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{doc.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{doc.cat} · {doc.date} · PDF</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <StatusBadge status={doc.status} />
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 border border-slate-200 hover:border-slate-400 transition-all" title="Download">
                  ⬇
                </button>
              </div>
            </div>
          );
        })}
        {visible.length === 0 && (
          <div className="col-span-2 text-center py-10 text-slate-400 text-sm">No documents found</div>
        )}
      </div>

      {/* Upload Zone */}
      <DCard>
        <div className="border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center flex flex-col items-center gap-3">
          <span className="text-4xl">📤</span>
          <h3 className="font-bold text-slate-800">Upload a Document</h3>
          <p className="text-[12px] text-slate-400 max-w-xs">Add new documents to your records room. Securely stored and always accessible.</p>
          <ActionBtn label="Choose File to Upload →" color={T.blue} />
          <p className="text-[10px] text-slate-400">Supports PDF, JPG, PNG · Max 10MB per file</p>
        </div>
      </DCard>
    </div>
  );
}
