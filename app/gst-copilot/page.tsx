'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, FileText, Clock, CheckCircle2, AlertCircle,
  IndianRupee, Calendar, Upload, ChevronRight, Plus,
  Loader2, Receipt, Activity, User, Shield, AlertTriangle
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────

interface GSTRequest {
  id: string;
  user_id?: string;
  gstin: string;
  business_name: string;
  month: string;
  total_sales: number;
  cgst: number;
  sgst: number;
  igst: number;
  status: 'draft' | 'pending_payment' | 'paid' | 'processing' | 'filed';
  amount: number;
  ai_insights?: string[];
  ai_errors?: string[];
  created_at: string;
}

// ─── Main Dashboard ─────────────────────────────────────────────────

export default function GSTCopilotDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'file' | 'requests'>('overview');
  const [requests, setRequests] = useState<GSTRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const user = {
    id: 'demo-user-123',
    name: 'Mahendra Kumar',
    email: 'mahendra@setmybizz.com',
    phone: '+91 78933 32884',
    gstin: '37AADCS1234F1ZP',
    tradeName: 'SetMyBizz Technologies Pvt Ltd',
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gst-copilot/requests?user_id=${user.id}`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'filed': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'paid': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'processing': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'pending_payment': return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'draft': return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] text-slate-100 font-['Inter']">
      {/* ─── Nav ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0a0a14]/90 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">GST Copilot</h1>
              <p className="text-[10px] text-slate-500 font-semibold -mt-0.5">by SetMyBizz</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            {[
              { id: 'overview', label: 'Home' },
              { id: 'file', label: 'File GST Wizard' },
              { id: 'requests', label: 'My GST Filings' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-emerald-500/15 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ─── Content ──────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black">Welcome, {user.name} 👋</h2>
              <button onClick={() => setActiveTab('file')} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" /> Start Filing
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <p className="text-slate-400 text-xs font-semibold">Total Drafts</p>
                <p className="text-2xl font-black mt-1">{requests.filter(r => r.status === 'draft').length}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <p className="text-slate-400 text-xs font-semibold">Processing</p>
                <p className="text-2xl font-black mt-1 text-amber-400">{requests.filter(r => r.status === 'paid' || r.status === 'processing').length}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <p className="text-slate-400 text-xs font-semibold">Filed Returns</p>
                <p className="text-2xl font-black mt-1 text-emerald-400">{requests.filter(r => r.status === 'filed').length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'file' && <GSTWizard user={user} onComplete={() => setActiveTab('requests')} />}

        {activeTab === 'requests' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black mb-4">My GST Filings</h2>
            {loading ? <p>Loading...</p> : requests.length === 0 ? <p className="text-slate-500">No filings found.</p> : (
              <div className="space-y-3">
                {requests.map(req => (
                  <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-100">{req.month}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-sm text-slate-400">{req.business_name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                        <span>GSTIN: {req.gstin}</span>
                        <span>Sales: ₹{req.total_sales?.toLocaleString('en-IN')}</span>
                        <span>Fee: ₹{req.amount}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${statusColor(req.status)} uppercase`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  GST WIZARD COMPONENT
// ═══════════════════════════════════════════════════════════════════

function GSTWizard({ user, onComplete }: { user: any; onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<GSTRequest>>({
    user_id: user.id, gstin: user.gstin, business_name: user.tradeName, month: 'Jun-2026'
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const saveDraft = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gst-copilot/requests', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_draft', ...formData, id: currentId })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentId(data.request.id);
        setStep(2);
      }
    } catch (e) { }
    setLoading(false);
  };

  const analyzeInvoices = async () => {
    setLoading(true);
    try {
      const dataBody = new FormData();
      if (files.length > 0) files.forEach(f => dataBody.append('files', f));
      else dataBody.append('files', new File(['mock'], 'mock.pdf', { type: 'application/pdf' })); // mock file if empty

      const res = await fetch('/api/gst-copilot/analyze', { method: 'POST', body: dataBody });
      const data = await res.json();

      if (data.success) {
        const newData = { ...formData, ...data.data, status: 'draft' };
        setFormData(newData);

        // Update draft with AI data
        await fetch('/api/gst-copilot/requests', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'update', ...newData, id: currentId })
        });
        setStep(3);
      }
    } catch (e) { }
    setLoading(false);
  };

  const initiatePayment = async () => {
    setLoading(true);
    try {
      // 1. Update status to pending_payment
      await fetch('/api/gst-copilot/requests', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', request_id: currentId, status: 'pending_payment' })
      });

      // 2. Load Razorpay
      const res = await loadRazorpay();
      if (!res) { alert('Razorpay SDK failed to load. Check your connection.'); setLoading(false); return; }

      const options = {
        key: 'rzp_test_mock_key', // Mock key
        amount: 49900, // ₹499
        currency: 'INR',
        name: 'SetMyBizz',
        description: `GST Filing - ${formData.month}`,
        handler: async function (response: any) {
          // On Success
          await fetch('/api/gst-copilot/requests', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update_status', request_id: currentId, status: 'paid', payment_id: response.razorpay_payment_id || 'mock_pay_123' })
          });
          onComplete();
        },
        prefill: { name: user.name, email: user.email, contact: user.phone },
        theme: { color: '#10b981' }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

      // For testing without real keys, we mock the success if handler isn't called:
      setTimeout(async () => {
        if (!document.querySelector('.razorpay-container')) {
          // Modal didn't open properly (likely due to fake key). Force success for MVP demo.
          await fetch('/api/gst-copilot/requests', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update_status', request_id: currentId, status: 'paid', payment_id: 'mock_pay_123' })
          });
          onComplete();
        }
      }, 3000);

    } catch (e) { }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Step Indicators */}
      <div className="flex gap-2">
        {['Details', 'AI Analysis', 'Summary'].map((s, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full ${step > i ? 'bg-emerald-500' : 'bg-slate-800'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold">1. Filing Details</h3>
          <div>
            <label className="text-xs font-semibold text-slate-400">Business Name</label>
            <input type="text" value={formData.business_name} onChange={e => setFormData({ ...formData, business_name: e.target.value })} className="w-full mt-1 px-4 py-2 bg-slate-800 rounded-lg outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400">GSTIN</label>
            <input type="text" value={formData.gstin} onChange={e => setFormData({ ...formData, gstin: e.target.value })} className="w-full mt-1 px-4 py-2 bg-slate-800 rounded-lg outline-none uppercase" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400">Filing Month</label>
            <select value={formData.month} onChange={e => setFormData({ ...formData, month: e.target.value })} className="w-full mt-1 px-4 py-2 bg-slate-800 rounded-lg outline-none">
              <option value="Jun-2026">June 2026</option>
              <option value="May-2026">May 2026</option>
            </select>
          </div>
          <button onClick={saveDraft} disabled={loading} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save & Continue'}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold">2. Upload Invoices for AI Analysis</h3>
          <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-emerald-500/30 rounded-xl p-10 text-center cursor-pointer hover:bg-emerald-500/5 transition-all">
            <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="font-semibold">Drop invoices here</p>
            <input ref={fileRef} type="file" multiple className="hidden" onChange={e => { if (e.target.files) setFiles(Array.from(e.target.files)) }} />
          </div>
          {files.length > 0 && <p className="text-xs text-slate-400">{files.length} files selected</p>}
          <button onClick={analyzeInvoices} disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Run AI Analysis</>}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-lg font-bold text-center border-b border-slate-800 pb-4">GST Summary Report</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-xl">
              <p className="text-xs text-slate-400 font-semibold mb-1">Total Sales</p>
              <p className="text-xl font-black">₹{formData.total_sales?.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl">
              <p className="text-xs text-slate-400 font-semibold mb-1">Total GST Tax</p>
              <p className="text-xl font-black text-emerald-400">₹{((formData.cgst || 0) + (formData.sgst || 0) + (formData.igst || 0)).toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4" /> AI Insights</h4>
            <ul className="text-xs text-blue-200/80 space-y-1 list-disc pl-4">
              {formData.ai_insights?.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
          </div>

          {formData.ai_errors && formData.ai_errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <h4 className="text-sm font-bold text-red-400 flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4" /> Issues Detected</h4>
              <ul className="text-xs text-red-200/80 space-y-1 list-disc pl-4">
                {formData.ai_errors.map((msg, i) => <li key={i}>{msg}</li>)}
              </ul>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-slate-300">Platform Filing Fee</span>
              <span className="font-black text-xl">₹499</span>
            </div>
            <button onClick={initiatePayment} disabled={loading} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'File GST for Me'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
