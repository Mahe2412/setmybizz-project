'use client';
import React, { useState } from 'react';
import { BIZ, GST_FILINGS } from '@/lib/mockBizData';
import { StatusBadge, T } from '@/components/os/shared';

type OpenMonth = string | null;

export default function GSTTab() {
  const [openMonth, setOpenMonth] = useState<OpenMonth>(null);
  const [calcAmt, setCalcAmt]     = useState('');
  const [calcRate, setCalcRate]   = useState('18');
  const calcResult = calcAmt && !isNaN(+calcAmt)
    ? { tax: ((+calcAmt * +calcRate) / 100).toFixed(2), total: (+calcAmt + (+calcAmt * +calcRate) / 100).toFixed(2) }
    : null;

  return (
    <div className="max-w-3xl mx-auto space-y-4 md:space-y-6 pb-20 px-4 md:px-0">
      {/* Header */}
      <div className="rounded-[2rem] md:rounded-[3rem] p-6 text-center" style={{ background: 'linear-gradient(135deg,#14532d,#16a34a)' }}>
        <div className="text-4xl md:text-5xl mb-3">📋</div>
        <h1 className="text-xl md:text-2xl font-black text-white mb-1">GST — Made Simple</h1>
        <p className="text-green-100 text-xs md:text-sm">Your GSTIN: <strong className="text-white">{BIZ.gstin}</strong></p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-5">
          <div className="bg-white/20 rounded-2xl px-4 py-2 text-center border border-white/10 backdrop-blur-sm flex sm:flex-col justify-between items-center sm:items-center">
            <p className="text-[10px] text-green-100 uppercase font-black">Status</p>
            <p className="font-black text-[11px] md:text-sm text-white">✅ Active</p>
          </div>
          <div className="bg-white/20 rounded-2xl px-4 py-2 text-center border border-white/10 backdrop-blur-sm flex sm:flex-col justify-between items-center sm:items-center">
            <p className="text-[10px] text-green-100 uppercase font-black">State</p>
            <p className="font-black text-[11px] md:text-sm text-white">Andhra Pradesh</p>
          </div>
          <div className="bg-white/20 rounded-2xl px-4 py-2 text-center border border-white/10 backdrop-blur-sm flex sm:flex-col justify-between items-center sm:items-center">
            <p className="text-[10px] text-green-100 uppercase font-black">Turnover</p>
            <p className="font-black text-[11px] md:text-sm text-white">₹0 (Nil)</p>
          </div>
        </div>
      </div>

      {/* Urgent Banner */}
      <div className="bg-red-50 border-2 border-red-200 rounded-[2rem] p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left shadow-lg shadow-red-500/5">
        <span className="text-4xl">🔴</span>
        <div className="flex-1">
          <p className="font-black text-red-800 text-base md:text-lg">GSTR-1 for February is Overdue!</p>
          <p className="text-xs md:text-sm text-red-600 mt-1">Every day you delay, a penalty of ₹50 is added. <strong>File today to stop the fine.</strong></p>
        </div>
        <button className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-[11px] text-white bg-red-600 hover:bg-red-700 transition-all uppercase tracking-widest shadow-xl shadow-red-200 active:scale-95">FILE NOW</button>
      </div>

      {/* Monthly Filing — Accordion */}
      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 pb-3 md:pb-4">
          <h2 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-widest leading-none mb-1">📅 Monthly Filing</h2>
          <p className="text-[10px] md:text-sm text-slate-400 font-bold uppercase tracking-widest">Select period to inspect compliance</p>
        </div>
        <div className="divide-y divide-slate-50">
          {GST_FILINGS.map((row, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenMonth(openMonth === row.period ? null : row.period)}
                className="w-full flex items-center justify-between px-6 md:px-8 py-5 md:py-6 text-left hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">📆</span>
                  <span className="font-black text-slate-800 text-sm md:text-base uppercase tracking-tight">{row.period}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={row.gstr1 === 'overdue' ? 'overdue' : row.gstr3b === 'due' ? 'due' : row.gstr1 === 'filed' ? 'filed' : 'upcoming'} />
                  <span className={`material-symbols-outlined text-slate-300 transition-transform ${openMonth === row.period ? 'rotate-180' : ''}`}>expand_more</span>
                </div>
              </button>
              {openMonth === row.period && (
                <div className="px-6 md:px-8 pb-6 bg-slate-50/50 space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 gap-4 text-center sm:text-left">
                    <div>
                      <p className="font-black text-slate-800 text-xs md:text-sm uppercase tracking-tight">GSTR-1 <span className="text-[10px] text-slate-400 ml-1 font-bold">(SALES RETURN)</span></p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">What you sold this month</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      <StatusBadge status={row.gstr1} />
                      {(row.gstr1 === 'overdue' || row.gstr1 === 'due') && (
                        <button className="w-full sm:w-auto text-[10px] font-black px-6 py-2.5 rounded-xl text-white uppercase tracking-widest shadow-lg shadow-red-100 active:scale-95" style={{ background: T.red }}>FILE NOW</button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 gap-4 text-center sm:text-left">
                    <div>
                      <p className="font-black text-slate-800 text-xs md:text-sm uppercase tracking-tight">GSTR-3B <span className="text-[10px] text-slate-400 ml-1 font-bold">(TAX PAYMENT)</span></p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">GST you need to pay to govt</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      <StatusBadge status={row.gstr3b} />
                      {row.gstr3b === 'due' && (
                        <button className="w-full sm:w-auto text-[10px] font-black px-6 py-2.5 rounded-xl text-white uppercase tracking-widest shadow-lg shadow-amber-100 active:scale-95" style={{ background: T.amber }}>FILE NOW</button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4 Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* #1 GST Calculator */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-8 col-span-1 md:col-span-2">
          <h3 className="font-black text-slate-900 text-base md:text-lg uppercase tracking-tight mb-1">🧮 GST Calculator</h3>
          <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">Real-time fiscal computation loop</p>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Amount (₹)</label>
              <input
                type="number"
                value={calcAmt}
                onChange={e => setCalcAmt(e.target.value)}
                placeholder="e.g. 10000"
                className="w-full px-5 py-4 rounded-3xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-bold outline-none focus:bg-white focus:border-blue-400 transition-all"
              />
            </div>
            <div className="w-full sm:w-32 shrink-0">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">GST Rate</label>
              <select
                value={calcRate}
                onChange={e => setCalcRate(e.target.value)}
                className="w-full px-5 py-4 rounded-3xl border border-slate-100 bg-slate-50 text-slate-800 text-sm font-bold outline-none cursor-pointer focus:bg-white focus:border-blue-400 transition-all"
              >
                {['0', '5', '12', '18', '28'].map(r => <option key={r} value={r}>{r}%</option>)}
              </select>
            </div>
          </div>
          {calcResult && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-orange-50 border border-orange-100 rounded-[2rem] p-5 text-center shadow-inner">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">GST Amount</p>
                <p className="text-2xl font-black text-orange-700">₹{calcResult.tax}</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-5 text-center shadow-inner">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Total Amount</p>
                <p className="text-2xl font-black text-emerald-700">₹{calcResult.total}</p>
              </div>
            </div>
          )}
        </div>

        {/* #2 File with AI */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-[2rem] p-8 flex flex-col items-center sm:items-start text-center sm:text-left gap-4">
          <span className="text-4xl">🤖</span>
          <div className="flex-1">
            <h3 className="font-black text-slate-900 text-base uppercase tracking-tight">File with AI</h3>
            <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-normal leading-relaxed mt-2">Arkle fills your GST return for you automatically. Just review and submit.</p>
          </div>
          <button className="w-full py-4 rounded-2xl text-[10px] font-black text-white bg-blue-600 hover:bg-blue-700 transition-all uppercase tracking-widest shadow-xl shadow-blue-200 active:scale-95">Start Filing →</button>
        </div>

        {/* #3 Expert Advice */}
        <div className="bg-purple-50/50 border border-purple-100 rounded-[2rem] p-8 flex flex-col items-center sm:items-start text-center sm:text-left gap-4">
          <span className="text-4xl">📞</span>
          <div className="flex-1">
            <h3 className="font-black text-slate-900 text-base uppercase tracking-tight">Get Expert Advice</h3>
            <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-normal leading-relaxed mt-2">Talk to a CA who knows GST. First consultation call is on us.</p>
          </div>
          <button className="w-full py-4 rounded-2xl text-[10px] font-black text-white bg-purple-600 hover:bg-purple-700 transition-all uppercase tracking-widest shadow-xl shadow-purple-200 active:scale-95">Free Call →</button>
        </div>

        {/* #4 Hire GST Expert */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-[2.5rem] p-6 md:p-10 col-span-1 md:col-span-2 flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left">
          <span className="text-5xl md:text-6xl">👨‍💼</span>
          <div className="flex-1">
            <h3 className="font-black text-slate-900 text-lg md:text-xl uppercase tracking-widest">Hire a GST Expert</h3>
            <p className="text-[11px] md:text-sm font-medium text-slate-500 mt-2 leading-relaxed italic">Let a chartered accountant handle all your GST filings every month. Starting at only ₹499/month. Zero stress, zero penalties.</p>
          </div>
          <button className="w-full md:w-auto px-10 py-5 rounded-2xl text-[11px] font-black text-white bg-emerald-600 hover:bg-emerald-700 transition-all uppercase tracking-widest shadow-2xl shadow-emerald-200 active:scale-95 shrink-0">Hire CA Now →</button>
        </div>
      </div>
    </div>
  );
}
