'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBizStore } from '@/lib/useBizStore';
import { StatusBadge } from '@/components/os/shared';

export default function GSTTab() {
  const { tasks, updateTask } = useBizStore();
  const [isFiling, setIsFiling] = useState(false);
  const [filingStep, setFilingStep] = useState(1);
  const [calcAmt, setCalcAmt] = useState('');
  const [calcRate, setCalcRate] = useState('18');

  // Find the specific GST task from the global store
  const gstTask = tasks.find(t => t.task === 'Monthly GSTR-1 Filing') || tasks[0];

  const handleStartFiling = () => {
    setIsFiling(true);
    setFilingStep(1);
  };

  const nextStep = () => {
    if (filingStep < 3) setFilingStep(filingStep + 1);
    else {
        // Mark task as Done in global store
        updateTask(gstTask.id, { status: 'Done', arklePrediction: 'Filing successful. Acknowledgement generated.' });
        setIsFiling(false);
    }
  };

  const calcResult = calcAmt && !isNaN(+calcAmt)
    ? { tax: ((+calcAmt * +calcRate) / 100).toFixed(2), total: (+calcAmt + (+calcAmt * +calcRate) / 100).toFixed(2) }
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 px-4">
      {/* Dynamic Header */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] -z-0" />
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                    <span className="material-symbols-outlined text-indigo-400">verified_user</span>
                    <h1 className="text-2xl font-black uppercase tracking-tight italic">GST Neural Hub</h1>
                </div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">GSTIN: {gstTask.indianId}</p>
            </div>
            <div className="flex gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-center backdrop-blur-md">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Status</p>
                    <p className={`text-xs font-black uppercase ${gstTask.status === 'Overdue' ? 'text-red-400' : 'text-emerald-400'}`}>{gstTask.status}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-center backdrop-blur-md">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Liability</p>
                    <p className="text-xs font-black uppercase text-white">₹12,450.00</p>
                </div>
            </div>
         </div>
      </div>

      <AnimatePresence>
        {isFiling ? (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border-2 border-indigo-600 rounded-[3rem] p-10 shadow-3xl shadow-indigo-500/10 relative"
            >
                <button onClick={() => setIsFiling(false)} className="absolute top-6 right-8 text-slate-400 hover:text-slate-900 font-black text-xs uppercase">Cancel Passage</button>
                
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center animate-pulse shadow-lg">
                        <span className="material-symbols-outlined text-indigo-400">psychology</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight italic">Arkle Guided Filing</h2>
                        <div className="flex gap-2 mt-1">
                            {[1, 2, 3].map(s => <div key={s} className={`h-1 w-8 rounded-full ${filingStep >= s ? 'bg-indigo-600' : 'bg-slate-100'}`} />)}
                        </div>
                    </div>
                </div>

                {filingStep === 1 && (
                    <div className="space-y-6">
                        <p className="text-[15px] font-bold text-slate-700 italic">"Mahendra, analyzing your sales data for February. I found 12 B2B invoices and 5 B2C transactions. Verify them below."</p>
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                             <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Sales extracted</span>
                                <span className="text-sm font-black text-slate-900">₹85,450.00</span>
                             </div>
                             <div className="h-[1px] bg-slate-200 mb-4" />
                             <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">✅ All Invoices are HSN/SAC compliant</p>
                        </div>
                    </div>
                )}

                {filingStep === 2 && (
                    <div className="space-y-6">
                        <p className="text-[15px] font-bold text-slate-700 italic">"Now checking Input Tax Credit (ITC). I've synced with 2B. You can claim ₹4,200 in credits today."</p>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-center">
                                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Net Payable</p>
                                <p className="text-xl font-black text-indigo-900">₹1,240</p>
                             </div>
                             <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center cursor-pointer hover:bg-slate-100 transition-all">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Add missing bills</p>
                                <span className="material-symbols-outlined mt-2 text-slate-400">add_circle</span>
                             </div>
                        </div>
                    </div>
                )}

                {filingStep === 3 && (
                    <div className="space-y-6">
                        <p className="text-[15px] font-bold text-slate-700 italic">"Ready to submit GSTR-1. Verification via OTP will be triggered."</p>
                        <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                           <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Final Confirmation</p>
                           <h4 className="text-xl font-black text-slate-900 leading-none">Execute Filing Authorization?</h4>
                        </div>
                    </div>
                )}

                <button 
                    onClick={nextStep}
                    className="w-full mt-10 bg-indigo-600 text-white py-5 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 transition-all"
                >
                    {filingStep === 3 ? 'Finalize & Submit' : 'Next Step →'}
                </button>
            </motion.div>
        ) : (
            <>
                {/* Urgent Action Bar */}
                {gstTask.status === 'Overdue' && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-red-500/5 hover:-translate-y-1 transition-all">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-red-500/30">
                            <span className="material-symbols-outlined text-white text-[32px] animate-bounce">priority_high</span>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-lg font-black text-red-900 uppercase tracking-tight">GSTR-1 for {gstTask.deadline} is Overdue!</h3>
                            <p className="text-xs font-bold text-red-600/70 uppercase tracking-widest mt-1 italic">Penalty Risk detected: ₹50.00 / day</p>
                        </div>
                        <button 
                            onClick={handleStartFiling}
                            className="bg-red-600 text-white px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-red-700 transition-all shadow-xl shadow-red-500/20 active:scale-95 whitespace-nowrap"
                        >
                            FILE NOW
                        </button>
                    </div>
                )}

                {/* Main GST Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* GST Calculator */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm col-span-1 md:col-span-2 hover:shadow-xl transition-all">
                        <div className="flex justify-between items-center mb-8">
                           <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] border-l-4 border-slate-900 pl-4 leading-none">Neural Calculator</h3>
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Real-time Fiscal Loop</span>
                        </div>
                        <div className="flex flex-col md:flex-row gap-6 items-end">
                            <div className="flex-1 w-full">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Base Amount (₹)</label>
                                <input
                                    type="number"
                                    value={calcAmt}
                                    onChange={e => setCalcAmt(e.target.value)}
                                    placeholder="Enter total sale amount"
                                    className="w-full px-6 py-4 rounded-[1.5rem] border border-slate-100 bg-slate-50 text-slate-800 text-sm font-bold outline-none focus:bg-white focus:border-indigo-400 transition-all shadow-inner"
                                />
                            </div>
                            <div className="w-full md:w-32 shrink-0">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">GST Rate (%)</label>
                                <select
                                    value={calcRate}
                                    onChange={e => setCalcRate(e.target.value)}
                                    className="w-full px-6 py-4 rounded-[1.5rem] border border-slate-100 bg-slate-50 text-slate-800 text-sm font-bold outline-none cursor-pointer focus:bg-white focus:border-indigo-400 transition-all shadow-inner"
                                >
                                    {['0', '5', '12', '18', '28'].map(r => <option key={r} value={r}>{r}%</option>)}
                                </select>
                            </div>
                        </div>
                        {calcResult && (
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-[2rem] text-center">
                                    <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-2">GST Value</p>
                                    <h4 className="text-2xl font-black text-indigo-700">₹{calcResult.tax}</h4>
                                </div>
                                <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-[2rem] text-center">
                                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2">Final Total</p>
                                    <h4 className="text-2xl font-black text-emerald-700">₹{calcResult.total}</h4>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Arkle CA Advisor Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-[60px]">policy</span>
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest opacity-60">Arkle Legal/CA Node</h4>
                        <p className="text-[17px] font-black mt-6 leading-tight italic">"Mahendra, your latest transactions suggest an optimization. Switch to <strong>QRMP scheme</strong> to save ₹2,000 in monthly CA fees."</p>
                        <button className="w-full bg-white text-indigo-700 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] mt-10 hover:bg-slate-50 active:scale-95 transition-all shadow-xl">Engage Strategy</button>
                    </div>

                    {/* Quick Support Card */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all">
                        <div>
                           <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] border-l-4 border-amber-500 pl-4 leading-none mb-6">Expert Connection</h3>
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Need a humans review? Connect with a Big-4 CA instantly.</p>
                        </div>
                        <div className="pt-8">
                            <button className="w-full border-2 border-slate-900 text-slate-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">Schedule Consultation</button>
                        </div>
                    </div>
                </div>
                
                {/* Info Footer */}
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-center">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Compliance Integrity Synchronized for {gstTask.indianId} via Arkle OS v1.0</p>
                </div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
}
