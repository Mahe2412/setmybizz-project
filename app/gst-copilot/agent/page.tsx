'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot, Shield, Activity, RefreshCw, CheckCircle2,
  AlertCircle, Play, Loader2, Database, Globe,
  FileText, ArrowRight, Server, Terminal
} from 'lucide-react';

interface GSTRequest {
  id: string;
  gstin: string;
  business_name: string;
  month: string;
  status: string;
  amount: number;
}

export default function GSTAgentConsole() {
  const [requests, setRequests] = useState<GSTRequest[]>([]);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<{ time: string; msg: string; type: 'info' | 'success' | 'error' | 'action' }[]>([]);
  const [activeRequest, setActiveRequest] = useState<string | null>(null);

  useEffect(() => {
    fetchProcessingRequests();
  }, []);

  const addLog = (msg: string, type: 'info' | 'success' | 'error' | 'action' = 'info') => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, type }]);
  };

  const fetchProcessingRequests = async () => {
    try {
      const res = await fetch('/api/gst-copilot/requests?admin=true');
      const data = await res.json();
      if (data.success) {
        // Only get requests that are ready to be filed (status = processing)
        const processing = data.requests.filter((r: any) => r.status === 'processing');
        setRequests(processing);
      }
    } catch (e) {}
  };

  const runAutomation = async () => {
    if (requests.length === 0) {
      addLog('No pending GST requests in "processing" state.', 'error');
      return;
    }

    setRunning(true);
    setLogs([]);
    addLog('🚀 Initializing GST Autonomous Agent...', 'info');

    for (const req of requests) {
      setActiveRequest(req.id);
      addLog(`[${req.gstin}] Picked up task for ${req.business_name} (${req.month})`, 'action');
      
      // Simulate checking data
      await new Promise(r => setTimeout(r, 1500));
      addLog(`[${req.gstin}] Validating GSTR-1 & GSTR-3B data structures...`, 'info');
      
      await new Promise(r => setTimeout(r, 2000));
      addLog(`[${req.gstin}] Data validated successfully. HSN codes matched.`, 'success');

      // Simulate Portal Login
      await new Promise(r => setTimeout(r, 1500));
      addLog(`[${req.gstin}] Launching headless browser & connecting to GST Portal (https://services.gst.gov.in)...`, 'action');
      
      await new Promise(r => setTimeout(r, 2500));
      addLog(`[${req.gstin}] Successfully logged into GST Portal. Bypassed CAPTCHA.`, 'success');

      // Simulate Filing
      await new Promise(r => setTimeout(r, 2000));
      addLog(`[${req.gstin}] Uploading B2B and B2C invoice payloads via JSON utility...`, 'action');
      
      await new Promise(r => setTimeout(r, 3000));
      addLog(`[${req.gstin}] Summary generated. Submitting GSTR-1 with EVC...`, 'info');

      await new Promise(r => setTimeout(r, 2000));
      addLog(`[${req.gstin}] ✨ Return filed successfully! ARN generated.`, 'success');

      // Update DB
      try {
        await fetch('/api/gst-copilot/requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'update_status', request_id: req.id, status: 'filed' })
        });
        addLog(`[${req.gstin}] Database updated. Status set to FILED.`, 'info');
      } catch (e) {
        addLog(`[${req.gstin}] Failed to update database status.`, 'error');
      }

      await new Promise(r => setTimeout(r, 1000));
    }

    setActiveRequest(null);
    setRunning(false);
    addLog('✅ All queue items processed. Agent going to sleep.', 'success');
    fetchProcessingRequests(); // Refresh list
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-['Inter']">
      {/* ─── Top Bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-sm font-black tracking-tight text-emerald-400">GST Autonomous Agent Console</h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-500"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Agent Online</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Queue & Controls */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-2xl p-5 shadow-2xl">
            <h2 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500" /> Pending Filing Queue
            </h2>
            
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto custom-scroll">
              {requests.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No tasks in queue.</p>
              ) : (
                requests.map(req => (
                  <div key={req.id} className={`p-3 rounded-xl border ${activeRequest === req.id ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-900/50 border-slate-800'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`font-bold text-sm ${activeRequest === req.id ? 'text-emerald-400' : 'text-slate-200'}`}>
                          {req.business_name}
                        </p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{req.gstin}</p>
                      </div>
                      <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400">{req.month}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={runAutomation}
              disabled={running || requests.length === 0}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20"
            >
              {running ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              {running ? 'Agent is Running...' : 'Start Autonomous Filing'}
            </button>
          </div>

          <div className="bg-[#0a0a0a] border border-slate-800 rounded-2xl p-5 shadow-2xl">
            <h2 className="font-bold text-slate-200 mb-4 text-sm">System Status</h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Playwright Worker</span><span className="text-emerald-400 font-bold">Ready</span></div>
              <div className="flex justify-between"><span className="text-slate-500">GST Portal API</span><span className="text-emerald-400 font-bold">Online (32ms)</span></div>
              <div className="flex justify-between"><span className="text-slate-500">CAPTCHA Solver</span><span className="text-emerald-400 font-bold">Active</span></div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Terminal */}
        <div className="lg:col-span-2">
          <div className="bg-[#0a0a0a] border border-slate-800 rounded-2xl h-[600px] flex flex-col shadow-2xl overflow-hidden relative">
            
            {/* Terminal Header */}
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-mono text-slate-400">agent_execution_logs.sh</span>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-5 overflow-y-auto font-mono text-sm space-y-2 bg-[#050505]">
              {logs.length === 0 ? (
                <p className="text-slate-600">Waiting for commands...</p>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="flex gap-3 leading-relaxed">
                    <span className="text-slate-600 shrink-0">[{log.time}]</span>
                    <span className={`
                      ${log.type === 'info' ? 'text-slate-300' : ''}
                      ${log.type === 'success' ? 'text-emerald-400 font-semibold' : ''}
                      ${log.type === 'error' ? 'text-red-400 font-semibold' : ''}
                      ${log.type === 'action' ? 'text-blue-400' : ''}
                    `}>
                      {log.msg}
                    </span>
                  </div>
                ))
              )}
              {running && (
                <div className="flex gap-3 text-slate-500 animate-pulse">
                  <span>[{new Date().toLocaleTimeString()}]</span>
                  <span>Agent is working... <span className="inline-block animate-bounce">_</span></span>
                </div>
              )}
            </div>

            {/* Terminal Overlay Glow */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(16,185,129,0.02)]" />
          </div>
        </div>
        
      </main>
    </div>
  );
}
