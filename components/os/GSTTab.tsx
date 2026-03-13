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
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="rounded-3xl p-6 text-center" style={{ background: 'linear-gradient(135deg,#14532d,#16a34a)' }}>
        <div className="text-5xl mb-3">📋</div>
        <h1 className="text-2xl font-black text-white mb-1">GST — Made Simple</h1>
        <p className="text-green-100 text-sm">Your GSTIN: <strong className="text-white">{BIZ.gstin}</strong></p>
        <div className="flex justify-center gap-3 mt-4">
          <div className="bg-white/20 rounded-2xl px-4 py-2 text-center">
            <p className="text-xs text-green-100">Status</p>
            <p className="font-black text-sm text-white">✅ Active</p>
          </div>
          <div className="bg-white/20 rounded-2xl px-4 py-2 text-center">
            <p className="text-xs text-green-100">State</p>
            <p className="font-black text-sm text-white">Andhra Pradesh</p>
          </div>
          <div className="bg-white/20 rounded-2xl px-4 py-2 text-center">
            <p className="text-xs text-green-100">Turnover</p>
            <p className="font-black text-sm text-white">₹0 (Nil)</p>
          </div>
        </div>
      </div>

      {/* Urgent Banner */}
      <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-5 flex items-start gap-4">
        <span className="text-4xl">🔴</span>
        <div className="flex-1">
          <p className="font-black text-red-800 text-lg">GSTR-1 for February is Overdue!</p>
          <p className="text-sm text-red-600 mt-1">Every day you delay, a penalty of ₹50 is added. <strong>File today to stop the fine.</strong></p>
        </div>
        <button className="flex-shrink-0 px-4 py-2.5 rounded-2xl font-black text-sm text-white bg-red-600 hover:bg-red-700 transition-all">FILE NOW</button>
      </div>

      {/* Monthly Filing — Accordion */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 pb-3">
          <h2 className="text-lg font-black text-slate-900">📅 Monthly Filing</h2>
          <p className="text-sm text-slate-400 mt-0.5">Click on any month to see what needs to be filed</p>
        </div>
        <div className="divide-y divide-slate-100">
          {GST_FILINGS.map((row, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenMonth(openMonth === row.period ? null : row.period)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">📆</span>
                  <span className="font-bold text-slate-800">{row.period}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={row.gstr1 === 'overdue' ? 'overdue' : row.gstr3b === 'due' ? 'due' : row.gstr1 === 'filed' ? 'filed' : 'upcoming'} />
                  <span className="text-slate-300">{openMonth === row.period ? '▲' : '▼'}</span>
                </div>
              </button>
              {openMonth === row.period && (
                <div className="px-5 pb-4 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">GSTR-1 <span className="text-xs text-slate-400 ml-1">(Sales Return)</span></p>
                      <p className="text-xs text-slate-400">What you sold this month</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={row.gstr1} />
                      {(row.gstr1 === 'overdue' || row.gstr1 === 'due') && (
                        <button className="text-xs font-black px-3 py-1.5 rounded-xl text-white" style={{ background: T.red }}>FILE NOW</button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">GSTR-3B <span className="text-xs text-slate-400 ml-1">(Tax Payment)</span></p>
                      <p className="text-xs text-slate-400">GST you need to pay to government</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={row.gstr3b} />
                      {row.gstr3b === 'due' && (
                        <button className="text-xs font-black px-3 py-1.5 rounded-xl text-white" style={{ background: T.amber }}>FILE NOW</button>
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
      <div className="grid grid-cols-2 gap-3">
        {/* #1 GST Calculator */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 col-span-2">
          <h3 className="font-black text-slate-900 text-base mb-1">🧮 GST Calculator</h3>
          <p className="text-xs text-slate-400 mb-3">Enter any amount and see how much GST is added</p>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[120px]">
              <label className="text-xs font-bold text-slate-500 mb-1 block">Amount (₹)</label>
              <input
                type="number"
                value={calcAmt}
                onChange={e => setCalcAmt(e.target.value)}
                placeholder="e.g. 10000"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div className="w-28">
              <label className="text-xs font-bold text-slate-500 mb-1 block">GST Rate</label>
              <select
                value={calcRate}
                onChange={e => setCalcRate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm outline-none focus:border-blue-400"
              >
                {['0', '5', '12', '18', '28'].map(r => <option key={r} value={r}>{r}%</option>)}
              </select>
            </div>
          </div>
          {calcResult && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">
                <p className="text-xs text-orange-500 mb-0.5">GST Amount</p>
                <p className="text-xl font-black text-orange-700">₹{calcResult.tax}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                <p className="text-xs text-green-500 mb-0.5">Total Amount</p>
                <p className="text-xl font-black text-green-700">₹{calcResult.total}</p>
              </div>
            </div>
          )}
        </div>

        {/* #2 File with AI */}
        <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5 flex flex-col gap-3">
          <span className="text-3xl">🤖</span>
          <div>
            <h3 className="font-black text-slate-900 text-sm">File with AI</h3>
            <p className="text-xs text-slate-500 mt-0.5">Arkle fills your GST return for you. Just review and submit.</p>
          </div>
          <button className="w-full py-2.5 rounded-2xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 transition-all">Start Filing →</button>
        </div>

        {/* #3 Expert Advice */}
        <div className="bg-purple-50 border border-purple-200 rounded-3xl p-5 flex flex-col gap-3">
          <span className="text-3xl">📞</span>
          <div>
            <h3 className="font-black text-slate-900 text-sm">Get Expert Advice</h3>
            <p className="text-xs text-slate-500 mt-0.5">Talk to a CA who knows GST. First call is free.</p>
          </div>
          <button className="w-full py-2.5 rounded-2xl text-xs font-black text-white bg-purple-600 hover:bg-purple-700 transition-all">Free Call →</button>
        </div>

        {/* #4 Hire GST Expert */}
        <div className="bg-green-50 border border-green-200 rounded-3xl p-5 col-span-2 flex items-center gap-4">
          <span className="text-4xl">👨‍💼</span>
          <div className="flex-1">
            <h3 className="font-black text-slate-900">Hire a GST Expert</h3>
            <p className="text-sm text-slate-500 mt-0.5">Let a CA handle all your GST filings every month. Starting <strong>₹499/month</strong>. No stress, no penalties.</p>
          </div>
          <button className="flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-black text-white bg-green-600 hover:bg-green-700 transition-all">Hire Now →</button>
        </div>
      </div>
    </div>
  );
}
