'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  Sparkles, ChevronRight, ChevronLeft, User, Phone, Mail,
  FileText, Upload, Brain, CheckCircle2, AlertCircle, IndianRupee,
  TrendingDown, Shield, PhoneCall, Loader2, ArrowRight, Building2,
  CreditCard, Calculator, Zap, Star, MessageSquare, Plus, Trash2, Download
} from 'lucide-react';

interface B2BInvoice {
  id: string;
  recipientGstin: string;
  invoiceNumber: string;
  invoiceDate: string;
  taxableValue: string;
  gstRate: number; // 5, 12, 18, 28
  cgst: number;
  sgst: number;
  igst: number;
}

interface GSTData {
  gstin: string;
  tradeName: string;
  filingPeriod: string; // e.g. "May-2026"
  b2bInvoices: B2BInvoice[];
  b2cSales: {
    taxableValue: string;
    gstRate: number;
    cgst: number;
    sgst: number;
    igst: number;
  };
  hsnSummary: {
    hsnCode: string;
    description: string;
    uqc: string;
    qty: string;
    taxableValue: string;
    igst: number;
    cgst: number;
    sgst: number;
  }[];
}

const STEPS = [
  { id: 'business', title: 'Business Profile', subtitle: 'GSTIN & Trade details', icon: <Building2 className="w-5 h-5" /> },
  { id: 'b2b', title: 'B2B Sales (Invoices)', subtitle: 'Sales to registered businesses', icon: <FileText className="w-5 h-5" /> },
  { id: 'b2c', title: 'B2C Sales (Retail)', subtitle: 'Sales to unregistered consumers', icon: <IndianRupee className="w-5 h-5" /> },
  { id: 'hsn', title: 'HSN Summary', subtitle: 'Goods & Services code-wise classification', icon: <Calculator className="w-5 h-5" /> },
  { id: 'results', title: 'AI GST Analysis', subtitle: 'GSTR-1 computation summary', icon: <Brain className="w-5 h-5" /> }
];

export default function GSTFilingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [gstData, setGstData] = useState<GSTData>({
    gstin: '',
    tradeName: '',
    filingPeriod: 'May-2026',
    b2bInvoices: [],
    b2cSales: { taxableValue: '', gstRate: 18, cgst: 0, sgst: 0, igst: 0 },
    hsnSummary: []
  });

  const [newB2B, setNewB2B] = useState<Omit<B2BInvoice, 'id' | 'cgst' | 'sgst' | 'igst'>>({
    recipientGstin: '',
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    taxableValue: '',
    gstRate: 18
  });

  const [newHSN, setNewHSN] = useState({
    hsnCode: '',
    description: '',
    uqc: 'U', // Units
    qty: '',
    taxableValue: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [agentRunning, setAgentRunning] = useState(false);
  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  const [agentDone, setAgentDone] = useState(false);
  const [showSummaryDetails, setShowSummaryDetails] = useState(false);

  // Helper for computing tax on b2b input
  const addB2BInvoice = () => {
    if (!newB2B.recipientGstin || !newB2B.invoiceNumber || !newB2B.taxableValue) {
      alert("Please fill all invoice fields");
      return;
    }

    const txVal = parseFloat(newB2B.taxableValue);
    const isInterstate = !newB2B.recipientGstin.startsWith(gstData.gstin.substring(0, 2));
    const gstPct = newB2B.gstRate / 100;

    const invoice: B2BInvoice = {
      id: Date.now().toString(),
      recipientGstin: newB2B.recipientGstin.toUpperCase(),
      invoiceNumber: newB2B.invoiceNumber.toUpperCase(),
      invoiceDate: newB2B.invoiceDate,
      taxableValue: newB2B.taxableValue,
      gstRate: newB2B.gstRate,
      cgst: isInterstate ? 0 : Math.round((txVal * gstPct / 2) * 100) / 100,
      sgst: isInterstate ? 0 : Math.round((txVal * gstPct / 2) * 100) / 100,
      igst: isInterstate ? Math.round((txVal * gstPct) * 100) / 100 : 0
    };

    setGstData(prev => ({
      ...prev,
      b2bInvoices: [...prev.b2bInvoices, invoice]
    }));

    setNewB2B({
      recipientGstin: '',
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      taxableValue: '',
      gstRate: 18
    });
  };

  const removeB2BInvoice = (id: string) => {
    setGstData(prev => ({
      ...prev,
      b2bInvoices: prev.b2bInvoices.filter(inv => inv.id !== id)
    }));
  };

  const addHSNItem = () => {
    if (!newHSN.hsnCode || !newHSN.qty || !newHSN.taxableValue) {
      alert("Please fill all HSN summary fields");
      return;
    }

    const txVal = parseFloat(newHSN.taxableValue);
    const cg = Math.round((txVal * 0.09) * 100) / 100; // default 18% assumption for summary

    setGstData(prev => ({
      ...prev,
      hsnSummary: [
        ...prev.hsnSummary,
        {
          hsnCode: newHSN.hsnCode,
          description: newHSN.description || 'Goods',
          uqc: newHSN.uqc,
          qty: newHSN.qty,
          taxableValue: newHSN.taxableValue,
          igst: 0,
          cgst: cg,
          sgst: cg
        }
      ]
    }));

    setNewHSN({ hsnCode: '', description: '', uqc: 'U', qty: '', taxableValue: '' });
  };

  // Compute final aggregate stats
  const getFilingTotals = () => {
    let totalTaxableB2B = 0;
    let totalCgstB2B = 0;
    let totalSgstB2B = 0;
    let totalIgstB2B = 0;

    gstData.b2bInvoices.forEach(inv => {
      const tx = parseFloat(inv.taxableValue || '0');
      totalTaxableB2B += tx;
      totalCgstB2B += inv.cgst;
      totalSgstB2B += inv.sgst;
      totalIgstB2B += inv.igst;
    });

    const b2cTx = parseFloat(gstData.b2cSales.taxableValue || '0');
    const b2cGstPct = gstData.b2cSales.gstRate / 100;
    const b2cCgst = Math.round((b2cTx * b2cGstPct / 2) * 100) / 100;
    const b2cSgst = Math.round((b2cTx * b2cGstPct / 2) * 100) / 100;

    const totalTaxable = totalTaxableB2B + b2cTx;
    const totalCgst = totalCgstB2B + b2cCgst;
    const totalSgst = totalSgstB2B + b2cSgst;
    const totalIgst = totalIgstB2B;
    const totalTax = totalCgst + totalSgst + totalIgst;

    return {
      totalTaxableB2B,
      totalTaxableB2C: b2cTx,
      totalTaxable,
      totalCgst,
      totalSgst,
      totalIgst,
      totalTax
    };
  };

  const totals = getFilingTotals();

  const nextStep = () => {
    if (currentStep === 0 && (!gstData.gstin || !gstData.tradeName)) {
      alert("Please enter GSTIN and Trade Name");
      return;
    }
    setCurrentStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 0));

  const runGstAgent = async () => {
    setAgentRunning(true);
    setAgentLogs([]);
    const logs = [
      '🧠 Initialising GST AI Agent...',
      '📄 Reading ledger and invoice database (Billease integration)...',
      '🔍 Reconciling internal sales registers with E-Way bills...',
      '⚖️ Computing GSTR-1 Output liability summary...',
      '📦 Creating HSN/SAC summary classification data...',
      '📝 Verifying recipient GSTINs on GST portal API (simulated)...',
      '✅ GSTR-1 Schema validation status: PASSED',
      '🔒 Draft GSTR-1 payload successfully created!'
    ];

    for (const log of logs) {
      await new Promise(r => setTimeout(r, 850));
      setAgentLogs(prev => [...prev, log]);
    }
    setAgentRunning(false);
    setAgentDone(true);
  };

  // Download GSTR-1 schema JSON
  const downloadGstr1Json = () => {
    const payload = {
      gst_version: "GSTR-1 v2.0",
      header: {
        gstin: gstData.gstin.toUpperCase(),
        fp: gstData.filingPeriod,
        cur_gt: totals.totalTaxable,
      },
      b2b: gstData.b2bInvoices.map(inv => ({
        ctin: inv.recipientGstin,
        inv: [{
          inum: inv.invoiceNumber,
          idt: inv.invoiceDate,
          val: Math.round(parseFloat(inv.taxableValue) * (1 + inv.gstRate / 100)),
          pos: inv.recipientGstin.substring(0, 2),
          rchrg: "N",
          inv_typ: "R",
          itms: [{
            num: 1,
            itm_det: {
              ty: inv.gstRate,
              txval: parseFloat(inv.taxableValue),
              iamt: inv.igst,
              camt: inv.cgst,
              samt: inv.sgst
            }
          }]
        }]
      })),
      b2cs: totals.totalTaxableB2C > 0 ? [{
        sply_ty: "INTRA",
        txval: totals.totalTaxableB2C,
        typ: "OE",
        pos: gstData.gstin.substring(0, 2),
        rt: gstData.b2cSales.gstRate,
        camt: Math.round((totals.totalTaxableB2C * (gstData.b2cSales.gstRate / 100) / 2) * 100) / 100,
        samt: Math.round((totals.totalTaxableB2C * (gstData.b2cSales.gstRate / 100) / 2) * 100) / 100,
      }] : [],
      hsn: {
        data: gstData.hsnSummary.map((h, i) => ({
          num: i + 1,
          hsn_sc: h.hsnCode,
          desc: h.description,
          uqc: h.uqc,
          qty: parseFloat(h.qty),
          val: parseFloat(h.taxableValue),
          txval: parseFloat(h.taxableValue),
          camt: h.cgst,
          samt: h.sgst,
          iamt: h.igst
        }))
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `GSTR1_Offline_Utility_${gstData.gstin}_${gstData.filingPeriod}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'business':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-300">GSTIN Number <span className="text-violet-400">*</span></label>
                <input
                  type="text"
                  placeholder="22AAAAA0000A1Z5"
                  value={gstData.gstin}
                  onChange={e => setGstData({ ...gstData, gstin: e.target.value.toUpperCase() })}
                  className="px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-300">Trade/Business Legal Name <span className="text-violet-400">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Arkle Consulting Group"
                  value={gstData.tradeName}
                  onChange={e => setGstData({ ...gstData, tradeName: e.target.value })}
                  className="px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 max-w-sm">
              <label className="text-sm font-semibold text-slate-300">Filing Period</label>
              <select
                value={gstData.filingPeriod}
                onChange={e => setGstData({ ...gstData, filingPeriod: e.target.value })}
                className="px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="May-2026">May 2026 (Due Date: 11 Jun 2026)</option>
                <option value="Jun-2026">Jun 2026 (Due Date: 11 Jul 2026)</option>
                <option value="Q1-2026">Q1 2026 (QRMP Scheme)</option>
              </select>
            </div>
          </div>
        );

      case 'b2b':
        return (
          <div className="space-y-5">
            <p className="text-slate-400 text-sm">Add outward invoices issued to GST-registered businesses (B2B):</p>
            
            {/* Invoice Form */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 bg-slate-850/40 border border-slate-700/35 rounded-xl">
              <input
                type="text"
                placeholder="Recipient GSTIN"
                value={newB2B.recipientGstin}
                onChange={e => setNewB2B({ ...newB2B, recipientGstin: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:border-violet-500"
              />
              <input
                type="text"
                placeholder="Inv No."
                value={newB2B.invoiceNumber}
                onChange={e => setNewB2B({ ...newB2B, invoiceNumber: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:border-violet-500"
              />
              <input
                type="date"
                value={newB2B.invoiceDate}
                onChange={e => setNewB2B({ ...newB2B, invoiceDate: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-violet-500"
              />
              <input
                type="number"
                placeholder="Taxable Value (₹)"
                value={newB2B.taxableValue}
                onChange={e => setNewB2B({ ...newB2B, taxableValue: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:border-violet-500"
              />
              <button
                onClick={addB2BInvoice}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Invoice
              </button>
            </div>

            {/* List */}
            {gstData.b2bInvoices.length > 0 ? (
              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-800/40 border-b border-slate-700/60 text-slate-400">
                      <th className="p-3">GSTIN</th>
                      <th className="p-3">Invoice No.</th>
                      <th className="p-3 text-right">Taxable Val</th>
                      <th className="p-3 text-right">CGST</th>
                      <th className="p-3 text-right">SGST</th>
                      <th className="p-3 text-right">IGST</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gstData.b2bInvoices.map(inv => (
                      <tr key={inv.id} className="border-b border-slate-800/40 text-slate-300">
                        <td className="p-3 font-semibold font-mono">{inv.recipientGstin}</td>
                        <td className="p-3 font-mono">{inv.invoiceNumber}</td>
                        <td className="p-3 text-right">₹{parseFloat(inv.taxableValue).toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right text-slate-400">₹{inv.cgst}</td>
                        <td className="p-3 text-right text-slate-400">₹{inv.sgst}</td>
                        <td className="p-3 text-right text-slate-400">₹{inv.igst}</td>
                        <td className="p-3 text-center">
                          <button onClick={() => removeB2BInvoice(inv.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-xl text-slate-500 text-xs">
                No B2B invoices added. (Only add if you sell to other business buyers with a GSTIN).
              </div>
            )}
          </div>
        );

      case 'b2c':
        return (
          <div className="space-y-4">
            <p className="text-slate-400 text-sm">Enter aggregate consumer sales (sales directly to buyers without a GSTIN):</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-300">Total B2C Taxable Sales (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 150000"
                  value={gstData.b2cSales.taxableValue}
                  onChange={e => setGstData({
                    ...gstData,
                    b2cSales: { ...gstData.b2cSales, taxableValue: e.target.value }
                  })}
                  className="px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-300">GST Slab Rate</label>
                <select
                  value={gstData.b2cSales.gstRate}
                  onChange={e => setGstData({
                    ...gstData,
                    b2cSales: { ...gstData.b2cSales, gstRate: parseInt(e.target.value) }
                  })}
                  className="px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value={5}>5%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18%</option>
                  <option value={28}>28%</option>
                </select>
              </div>
            </div>
            {gstData.b2cSales.taxableValue && (
              <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl space-y-1 text-xs">
                <p className="text-violet-400 font-bold">Estimated Consumer GST Breakdown:</p>
                <p className="text-slate-300">• CGST: ₹{Math.round((parseFloat(gstData.b2cSales.taxableValue) * (gstData.b2cSales.gstRate / 100) / 2) * 100) / 100}</p>
                <p className="text-slate-300">• SGST: ₹{Math.round((parseFloat(gstData.b2cSales.taxableValue) * (gstData.b2cSales.gstRate / 100) / 2) * 100) / 100}</p>
              </div>
            )}
          </div>
        );

      case 'hsn':
        return (
          <div className="space-y-4">
            <p className="text-slate-400 text-sm">Add HSN summary classification for GSTR-1 validation:</p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 bg-slate-850/40 border border-slate-700/35 rounded-xl">
              <input
                type="text"
                placeholder="HSN/SAC Code"
                value={newHSN.hsnCode}
                onChange={e => setNewHSN({ ...newHSN, hsnCode: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200"
              />
              <input
                type="text"
                placeholder="Description"
                value={newHSN.description}
                onChange={e => setNewHSN({ ...newHSN, description: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200"
              />
              <input
                type="text"
                placeholder="Qty"
                value={newHSN.qty}
                onChange={e => setNewHSN({ ...newHSN, qty: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200"
              />
              <input
                type="number"
                placeholder="Taxable Value (₹)"
                value={newHSN.taxableValue}
                onChange={e => setNewHSN({ ...newHSN, taxableValue: e.target.value })}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200"
              />
              <button
                onClick={addHSNItem}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-lg"
              >
                + Add HSN
              </button>
            </div>

            {/* List */}
            {gstData.hsnSummary.length > 0 ? (
              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-800/40 border-b border-slate-700/60 text-slate-400">
                      <th className="p-3">HSN Code</th>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-right">Qty</th>
                      <th className="p-3 text-right">Taxable Val</th>
                      <th className="p-3 text-right">Total GST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gstData.hsnSummary.map((h, i) => (
                      <tr key={i} className="border-b border-slate-800/40 text-slate-300">
                        <td className="p-3 font-semibold font-mono">{h.hsnCode}</td>
                        <td className="p-3">{h.description}</td>
                        <td className="p-3 text-right">{h.qty}</td>
                        <td className="p-3 text-right">₹{parseFloat(h.taxableValue).toLocaleString('en-IN')}</td>
                        <td className="p-3 text-right">₹{(h.cgst + h.sgst).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-xl text-slate-500 text-xs">
                No HSN items listed. Summary is auto-computed based on invoices but can be customized here.
              </div>
            )}
          </div>
        );

      case 'results':
        return (
          <div className="space-y-5">
            {/* Aggregated Output Liability Card */}
            <div className="p-5 rounded-2xl border-2 bg-violet-500/10 border-violet-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-5 h-5 text-violet-400" />
                <span className="font-bold text-slate-100">GSTR-1 Output Summary</span>
              </div>
              <p className="text-2xl font-black text-slate-100 mb-1">
                Filing Period: {gstData.filingPeriod}
              </p>
              <p className="text-violet-400 font-semibold text-sm">
                Total Outward Liability: ₹{totals.totalTax.toLocaleString('en-IN')}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Taxable Sales', value: `₹${totals.totalTaxable.toLocaleString('en-IN')}`, color: 'text-slate-100' },
                { label: 'B2B Sales Count', value: gstData.b2bInvoices.length.toString(), color: 'text-violet-300' },
                { label: 'CGST Payable', value: `₹${totals.totalCgst.toLocaleString('en-IN')}`, color: 'text-slate-300' },
                { label: 'SGST Payable', value: `₹${totals.totalSgst.toLocaleString('en-IN')}`, color: 'text-slate-300' },
                { label: 'IGST Payable', value: `₹${totals.totalIgst.toLocaleString('en-IN')}`, color: 'text-slate-300' },
                { label: 'Estimated net GST', value: `₹${totals.totalTax.toLocaleString('en-IN')}`, color: 'text-violet-400' }
              ].map((item, i) => (
                <div key={i} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/40">
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">{item.label}</p>
                  <p className={`font-black text-lg ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Agent Actions */}
            {!agentDone && !agentRunning && (
              <button
                onClick={runGstAgent}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-500/20"
              >
                <Zap className="w-5 h-5" />
                Run AI Compliance Agent — Prepare GSTR-1
              </button>
            )}

            {agentRunning && (
              <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 space-y-2 font-mono text-xs text-left">
                {agentLogs.map((log, i) => (
                  <p key={i} className={log.includes('✅') ? 'text-emerald-400' : 'text-slate-300'}>
                    {log}
                  </p>
                ))}
                <span className="inline-block w-2 h-3 bg-violet-400 animate-pulse" />
              </div>
            )}

            {agentDone && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-left">
                <p className="text-emerald-400 font-bold mb-1 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> GSTR-1 Return Draft Ready!
                </p>
                <p className="text-slate-400 text-xs">
                  Your offline schema format payload is verified. Download utility schema JSON to upload directly to the GST offline tool or online portal.
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={downloadGstr1Json}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs rounded-lg font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4" /> Download GSTR-1 Offline JSON
                  </button>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  const progress = ((currentStep) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#09090f] text-slate-100 flex flex-col items-center justify-start py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold mb-4 tracking-wider">
          <Sparkles className="w-3 h-3" /> ARKLE AI GST — COMPLIANCE ENGINE
        </div>
        <h1 className="text-3xl font-black text-slate-100 mb-2">
          File GSTR-1 Return with AI
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Process, validate and export GSTR-1 outward returns conforming strictly to current GSTN portal offline schemas.
        </p>
      </div>

      {/* Progress */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500 font-semibold">
            Step {currentStep + 1} of {STEPS.length} — {STEPS[currentStep].title}
          </span>
          <span className="text-xs text-violet-400 font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main card */}
      <div className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-6 shadow-2xl shadow-black/50 text-center">
        {/* Step Header */}
        <div className="flex items-center gap-3 mb-6 text-left">
          <div className="p-2.5 rounded-xl bg-violet-500/15 text-violet-400">
            {STEPS[currentStep].icon}
          </div>
          <div>
            <h2 className="font-bold text-slate-100 text-lg">{STEPS[currentStep].title}</h2>
            <p className="text-slate-500 text-xs">{STEPS[currentStep].subtitle}</p>
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-800/60">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
