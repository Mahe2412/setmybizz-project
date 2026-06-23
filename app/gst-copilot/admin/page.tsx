'use client';

import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw, CheckCircle2, AlertCircle, TrendingUp, Search } from 'lucide-react';

interface GSTRequest {
  id: string;
  gstin: string;
  business_name: string;
  month: string;
  status: string;
  amount: number;
  total_sales: number;
}

export default function GSTCopilotAdmin() {
  const [requests, setRequests] = useState<GSTRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gst-copilot/requests?admin=true');
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (e) {}
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/gst-copilot/requests', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', request_id: id, status })
      });
      setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
    } catch (e) {}
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'filed': return 'bg-emerald-500/15 text-emerald-400';
      case 'paid': return 'bg-blue-500/15 text-blue-400';
      case 'processing': return 'bg-amber-500/15 text-amber-400';
      case 'pending_payment': return 'bg-orange-500/15 text-orange-400';
      default: return 'bg-slate-500/15 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] text-slate-100 font-['Inter']">
      <header className="sticky top-0 z-50 bg-[#0a0a14]/90 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-sm font-black tracking-tight">Admin Dashboard — GST Copilot</h1>
          </div>
          <button onClick={fetchAll} className="p-2 text-slate-400 hover:text-white"><RefreshCw className="w-4 h-4" /></button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <p className="text-slate-400 text-xs font-semibold">Total Requests</p>
            <p className="text-3xl font-black mt-1">{requests.length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <p className="text-slate-400 text-xs font-semibold">Paid / Pending Proc.</p>
            <p className="text-3xl font-black mt-1 text-blue-400">{requests.filter(r => r.status === 'paid').length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <p className="text-slate-400 text-xs font-semibold">Currently Processing</p>
            <p className="text-3xl font-black mt-1 text-amber-400">{requests.filter(r => r.status === 'processing').length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <p className="text-slate-400 text-xs font-semibold">Filed Successfully</p>
            <p className="text-3xl font-black mt-1 text-emerald-400">{requests.filter(r => r.status === 'filed').length}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-slate-400 font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Business & GSTIN</th>
                <th className="px-6 py-4">Month</th>
                <th className="px-6 py-4">Total Sales</th>
                <th className="px-6 py-4">Fee Paid</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold">{req.business_name || 'N/A'}</p>
                    <p className="text-xs text-slate-500 font-mono">{req.gstin}</p>
                  </td>
                  <td className="px-6 py-4">{req.month}</td>
                  <td className="px-6 py-4">₹{(req.total_sales||0).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 font-bold text-emerald-400">₹{req.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${statusColor(req.status)}`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {req.status === 'paid' && (
                      <button onClick={() => updateStatus(req.id, 'processing')} className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg">
                        Processing
                      </button>
                    )}
                    {req.status === 'processing' && (
                      <button onClick={() => updateStatus(req.id, 'filed')} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg">
                        Mark Filed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No GST requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
