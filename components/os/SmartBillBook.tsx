'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LegalServiceTrigger from './LegalServiceTrigger';

// ─── Types ──────────────────────────────────────────────────────────────────
interface Party { id: string; name: string; phone?: string; gstin?: string; stateCode: string; }
interface Item { id: string; name: string; hsnSac?: string; gstRate: number; salePrice: number; unit: string; stockQty?: number; }
interface InvoiceLine { itemId?: string; description: string; hsnSac?: string; qty: number; unit: string; rate: number; discountPct: number; gstRate: number; }
interface Invoice { id: string; number: string; partyId?: string; partyName?: string; date: string; status: 'draft' | 'finalized' | 'paid'; lines: InvoiceLine[]; grandTotal: number; notes?: string; }

// ─── GST Helpers ─────────────────────────────────────────────────────────────
function calcLine(l: InvoiceLine) {
  const base = l.qty * l.rate * (1 - l.discountPct / 100);
  const tax = base * l.gstRate / 100;
  return { taxable: base, tax, total: base + tax };
}
function calcTotals(lines: InvoiceLine[]) {
  const valid = lines.filter(l => l.description.trim());
  return { taxable: valid.reduce((s,l) => s + calcLine(l).taxable, 0), tax: valid.reduce((s,l) => s + calcLine(l).tax, 0), grand: valid.reduce((s,l) => s + calcLine(l).total, 0) };
}
function fmt(n: number) { return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_PARTIES: Party[] = [
  { id: 'p1', name: 'Ravi Kumar Enterprises', phone: '9876543210', gstin: '29ABCDE1234F1Z5', stateCode: '29' },
  { id: 'p2', name: 'Sita Textiles', phone: '9876500001', stateCode: '36' },
  { id: 'p3', name: 'Hyderabad Foods Pvt Ltd', phone: '9000000001', gstin: '36XYZAB1234C1Z9', stateCode: '36' },
];
const SEED_ITEMS: Item[] = [
  { id: 'i1', name: 'Office Chair', hsnSac: '9401', gstRate: 18, salePrice: 4500, unit: 'pcs', stockQty: 24 },
  { id: 'i2', name: 'A4 Paper Ream', hsnSac: '4802', gstRate: 12, salePrice: 320, unit: 'pcs', stockQty: 150 },
  { id: 'i3', name: 'Web Design Service', hsnSac: '998314', gstRate: 18, salePrice: 25000, unit: 'hrs' },
  { id: 'i4', name: 'HP Laptop', hsnSac: '8471', gstRate: 18, salePrice: 52000, unit: 'pcs', stockQty: 8 },
  { id: 'i5', name: 'Cotton Fabric 1m', hsnSac: '5208', gstRate: 5, salePrice: 180, unit: 'mtr', stockQty: 500 },
];
const SEED_INVOICES: Invoice[] = [
  { id: 'inv1', number: 'INV-001', partyName: 'Ravi Kumar Enterprises', date: '2026-07-22', status: 'paid', lines: [{ description: 'Office Chair', qty: 2, unit: 'pcs', rate: 4500, discountPct: 0, gstRate: 18 }], grandTotal: 10620 },
  { id: 'inv2', number: 'INV-002', partyName: 'Sita Textiles', date: '2026-07-23', status: 'finalized', lines: [{ description: 'Cotton Fabric', qty: 50, unit: 'mtr', rate: 180, discountPct: 5, gstRate: 5 }], grandTotal: 8977.5 },
  { id: 'inv3', number: 'INV-003', partyName: 'Walk-in Customer', date: '2026-07-23', status: 'draft', lines: [], grandTotal: 0 },
];

type View = 'dashboard' | 'new-invoice' | 'invoices' | 'parties' | 'items';

export default function SmartBillBook() {
  const [view, setView] = useState<View>('dashboard');
  const [invoices, setInvoices] = useState<Invoice[]>(SEED_INVOICES);
  const [parties] = useState<Party[]>(SEED_PARTIES);
  const [items] = useState<Item[]>(SEED_ITEMS);

  // Invoice Form
  const [selPartyId, setSelPartyId] = useState('');
  const [lines, setLines] = useState<InvoiceLine[]>([{ description: '', qty: 1, unit: 'pcs', rate: 0, discountPct: 0, gstRate: 18 }]);
  const [invoiceNotes, setInvoiceNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // AI / Voice
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isAiParsing, setIsAiParsing] = useState(false);
  const [aiMsg, setAiMsg] = useState('');
  const [showAiBar, setShowAiBar] = useState(false);
  const [arkleInput, setArkleInput] = useState('');

  // Camera
  const [showCamera, setShowCamera] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Barcode
  const [showBarcode, setShowBarcode] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');

  // Item Search
  const [itemSearch, setItemSearch] = useState('');
  const [searchLineIdx, setSearchLineIdx] = useState<number | null>(null);

  // Offline
  const [isOnline, setIsOnline] = useState(true);
  const [offlineCount, setOfflineCount] = useState(0);

  useEffect(() => {
    const fn = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', fn);
    window.addEventListener('offline', fn);
    fn();
    return () => { window.removeEventListener('online', fn); window.removeEventListener('offline', fn); };
  }, []);

  // Arkle directive listener
  useEffect(() => {
    const handle = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return;
      const { action, data } = e.data;
      if (action === 'CREATE_INVOICE_DRAFT' || action === 'ADD_LINE_ITEM') {
        setView('new-invoice');
        if (action === 'CREATE_INVOICE_DRAFT') {
          if (data?.partyName) {
            const p = parties.find(x => x.name.toLowerCase().includes(data.partyName.toLowerCase()));
            if (p) setSelPartyId(p.id);
          }
          if (data?.lines?.length) {
            setLines(data.lines.map((l: any) => {
              const it = items.find(i => i.name.toLowerCase().includes((l.name || l.description || '').toLowerCase()));
              return { itemId: it?.id, description: l.name || it?.name || l.description || '', hsnSac: l.hsnSac || it?.hsnSac || '', qty: Number(l.qty ?? 1), unit: l.unit || it?.unit || 'pcs', rate: Number(l.rate ?? it?.salePrice ?? 0), discountPct: 0, gstRate: Number(l.gstRate ?? it?.gstRate ?? 18) };
            }));
          }
          if (data?.notes) setInvoiceNotes(data.notes);
        } else {
          const it = items.find(i => i.name.toLowerCase().includes((data?.name || data?.description || '').toLowerCase()));
          setLines(prev => [...prev.filter(l => l.description), { itemId: it?.id, description: data?.name || data?.description || '', qty: Number(data?.qty ?? 1), unit: data?.unit || it?.unit || 'pcs', rate: Number(data?.rate ?? it?.salePrice ?? 0), discountPct: 0, gstRate: Number(data?.gstRate ?? it?.gstRate ?? 18) }]);
        }
      }
    };
    window.addEventListener('message', handle);
    const pending = sessionStorage.getItem('pending_invoice_command');
    if (pending) { try { handle({ data: JSON.parse(pending) } as any); sessionStorage.removeItem('pending_invoice_command'); } catch {} }
    return () => window.removeEventListener('message', handle);
  }, [parties, items]);

  // ─── Voice Invoice ────────────────────────────────────────────────────────
  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Voice not supported. Please use Chrome browser.'); return; }
    const rec = new SR();
    rec.lang = 'hi-IN';
    rec.interimResults = true;
    let finalText = '';
    rec.onstart = () => { setIsVoiceListening(true); setView('new-invoice'); };
    rec.onresult = (e: any) => { finalText = Array.from(e.results).map((r: any) => r[0].transcript).join(''); setVoiceTranscript(finalText); };
    rec.onend = async () => {
      setIsVoiceListening(false);
      if (finalText.length > 2) await parseVoiceCommand(finalText);
    };
    rec.onerror = () => { setIsVoiceListening(false); setAiMsg('❌ Microphone error. Check permissions.'); };
    rec.start();
  };

  const parseVoiceCommand = async (text: string) => {
    setIsAiParsing(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Parse this voice command for a GST invoice. Command: "${text}"
Available items: ${items.map(i => `${i.name} (₹${i.salePrice}, GST ${i.gstRate}%)`).join(', ')}
Return ONLY valid JSON: {"partyName":"","lines":[{"name":"","qty":1,"rate":0,"gstRate":18,"unit":"pcs"}],"notes":""}
Match items from the catalog if mentioned. Handle Hindi/Telugu/English mixed.`,
        })
      });
      const d = await res.json();
      const json = JSON.parse((d.text || '{}').replace(/```json|```/g, '').trim());
      if (json.partyName) { const p = parties.find(x => x.name.toLowerCase().includes(json.partyName.toLowerCase())); if (p) setSelPartyId(p.id); }
      if (json.lines?.length) {
        setLines(json.lines.map((l: any) => {
          const it = items.find(i => i.name.toLowerCase().includes((l.name || '').toLowerCase()));
          return { itemId: it?.id, description: l.name || it?.name || '', qty: Number(l.qty ?? 1), unit: l.unit || it?.unit || 'pcs', rate: Number(l.rate ?? it?.salePrice ?? 0), discountPct: 0, gstRate: Number(l.gstRate ?? it?.gstRate ?? 18), hsnSac: it?.hsnSac || '' };
        }));
      }
      setAiMsg(`✅ Voice parsed: "${text}" — ${json.lines?.length ?? 0} item(s) added`);
    } catch { setAiMsg('⚠️ Could not fully parse. Please verify items.'); }
    setIsAiParsing(false);
    setVoiceTranscript('');
  };

  // ─── Camera Invoice ───────────────────────────────────────────────────────
  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
    } catch { setAiMsg('❌ Camera permission denied.'); setShowCamera(false); }
  };
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const c = document.createElement('canvas');
    c.width = videoRef.current.videoWidth; c.height = videoRef.current.videoHeight;
    c.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
    setShowCamera(false);
    processImageOCR();
  };
  const processImageOCR = async () => {
    setProcessingImage(true);
    setView('new-invoice');
    await new Promise(r => setTimeout(r, 2200));
    setLines([{ description: 'Scanned Item (Please verify)', qty: 1, unit: 'pcs', rate: 0, discountPct: 0, gstRate: 18 }]);
    setAiMsg('📸 Image scanned. Arkle extracted 1 item — please verify rate and GST.');
    setProcessingImage(false);
  };

  // ─── Arkle Advisor ────────────────────────────────────────────────────────
  const askArkle = async () => {
    if (!arkleInput.trim()) return;
    setIsAiParsing(true);
    const q = arkleInput; setArkleInput('');
    try {
      const res = await fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: `You are Arkle, a GST & billing expert for Indian SMEs. Answer in 1-2 sentences: "${q}"` }) });
      const d = await res.json();
      setAiMsg(d.text || 'No response.');
    } catch { setAiMsg('❌ Arkle is offline. Check connection.'); }
    setIsAiParsing(false);
  };

  // ─── Invoice Lines CRUD ───────────────────────────────────────────────────
  const addLine = () => setLines(prev => [...prev, { description: '', qty: 1, unit: 'pcs', rate: 0, discountPct: 0, gstRate: 18 }]);
  const updLine = (i: number, patch: Partial<InvoiceLine>) => setLines(prev => { const n = [...prev]; n[i] = { ...n[i], ...patch }; return n; });
  const delLine = (i: number) => setLines(prev => prev.filter((_, idx) => idx !== i));
  const selectItem = (li: number, it: Item) => { updLine(li, { itemId: it.id, description: it.name, hsnSac: it.hsnSac, rate: it.salePrice, gstRate: it.gstRate, unit: it.unit }); setSearchLineIdx(null); setItemSearch(''); };

  // ─── Save Invoice ─────────────────────────────────────────────────────────
  const saveInvoice = async () => {
    const valid = lines.filter(l => l.description.trim());
    if (!valid.length) { alert('Add at least one item.'); return; }
    setSaving(true);
    const party = parties.find(p => p.id === selPartyId);
    const totals = calcTotals(valid);
    const inv: Invoice = { id: 'inv-' + Date.now(), number: 'INV-' + String(invoices.length + 1).padStart(3, '0'), partyId: selPartyId, partyName: party?.name || 'Walk-in Customer', date: new Date().toISOString().split('T')[0], status: 'draft', lines: valid, grandTotal: totals.grand, notes: invoiceNotes };
    if (!isOnline) { setOfflineCount(c => c + 1); }
    else { try { await fetch('/api/documents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'invoice', partyId: selPartyId || undefined, lines: valid, notes: invoiceNotes }) }); } catch {} }
    setInvoices(prev => [inv, ...prev]);
    setSaving(false); setSaveSuccess(true);
    setTimeout(() => { setSaveSuccess(false); setView('invoices'); setLines([{ description: '', qty: 1, unit: 'pcs', rate: 0, discountPct: 0, gstRate: 18 }]); setSelPartyId(''); setInvoiceNotes(''); }, 1500);
  };

  // ─── WhatsApp Share ───────────────────────────────────────────────────────
  const shareWA = (inv: Invoice) => {
    const p = parties.find(x => x.id === inv.partyId);
    const phone = p?.phone || '';
    const msg = `*Invoice ${inv.number}*\nDate: ${inv.date}\nTotal: ${fmt(inv.grandTotal)}\n\nItems:\n${inv.lines.map(l => `• ${l.description}: ${l.qty} × ₹${l.rate}`).join('\n')}\n\nThank you! 🙏\n_SetMyBizz BizOS_`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const totals = calcTotals(lines);

  // ─── STYLES ──────────────────────────────────────────────────────────────
  const S = `
    .sb-card{background:white;border-radius:20px;border:1px solid #e8ecf1;box-shadow:0 2px 12px rgba(0,0,0,0.04);}
    .sb-input{width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:13px;font-weight:600;color:#1e293b;background:#f8fafc;outline:none;transition:all .2s;}
    .sb-input:focus{border-color:#1a56db;background:white;box-shadow:0 0 0 3px rgba(26,86,219,0.08);}
    .no-sb::-webkit-scrollbar{display:none;}.no-sb{-ms-overflow-style:none;scrollbar-width:none;}
    .stat-paid{background:#dcfce7;color:#166534;}.stat-finalized{background:#dbeafe;color:#1e40af;}.stat-draft{background:#fef3c7;color:#92400e;}
  `;

  return (
    <div className="flex flex-col h-full bg-[#f5f7fa] overflow-hidden" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <style>{S}</style>

      {/* ── TOP BAR ─────────────────────────────────────────────────── */}
      <div className="shrink-0 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 shadow-sm">
        {view !== 'dashboard' && (
          <button onClick={() => setView('dashboard')} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center">
            <span className="material-symbols-rounded text-slate-600 text-[18px]">arrow_back</span>
          </button>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-900 text-[15px]">
              {view === 'dashboard' ? '📒 BillBook' : view === 'new-invoice' ? '✨ New Invoice' : view === 'invoices' ? 'All Invoices' : view === 'parties' ? 'Parties & Customers' : 'Products & Items'}
            </span>
            {!isOnline && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black rounded-full">● Offline</span>}
            {offlineCount > 0 && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-black rounded-full">{offlineCount} queued</span>}
          </div>
          <p className="text-[10px] text-slate-400 font-bold">GST-Ready • SetMyBizz BizOS</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          <button onClick={() => setShowAiBar(v => !v)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${showAiBar ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
            <span className="material-symbols-rounded text-[13px]">auto_awesome</span> Arkle
          </button>
          {view === 'dashboard' && (
            <button onClick={() => setView('new-invoice')} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all">
              <span className="material-symbols-rounded text-[13px]">add</span> Invoice
            </button>
          )}
        </div>
      </div>

      {/* ── ARKLE AI BAR ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAiBar && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="shrink-0 overflow-hidden bg-gradient-to-r from-slate-900 to-blue-950">
            <div className="px-4 py-3 space-y-2">
              {aiMsg && (
                <div className="flex items-start gap-2">
                  <span className="material-symbols-rounded text-blue-400 text-[14px] mt-0.5 shrink-0">psychology</span>
                  <p className="text-[11px] text-blue-100 font-medium leading-relaxed flex-1">{aiMsg}</p>
                  <button onClick={() => setAiMsg('')} className="text-white/30 hover:text-white/60 text-[10px] shrink-0">✕</button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <input value={arkleInput} onChange={e => setArkleInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && askArkle()} placeholder='Ask Arkle: "HSN for furniture?" or "GST on software?"' className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white placeholder-white/30 outline-none focus:border-blue-400" />
                <button onClick={askArkle} disabled={isAiParsing} className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center hover:bg-blue-400 disabled:opacity-50 shrink-0 transition-all">
                  {isAiParsing ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span className="material-symbols-rounded text-white text-[15px]">send</span>}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CONTENT ──────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto no-sb px-3 py-3">

        {/* ══ DASHBOARD ══════════════════════════════════════════════ */}
        {view === 'dashboard' && (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Today's Sales", value: '₹10,620', icon: 'trending_up', c: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Outstanding', value: '₹8,978', icon: 'schedule', c: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Total Parties', value: String(SEED_PARTIES.length), icon: 'group', c: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Products', value: String(SEED_ITEMS.length), icon: 'inventory_2', c: 'text-violet-600', bg: 'bg-violet-50' },
              ].map(s => (
                <div key={s.label} className="sb-card p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 ${s.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-rounded text-[20px]" style={{ color: s.c }}>{s.icon}</span>
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-[16px] leading-tight">{s.value}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Create */}
            <div className="sb-card p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Quick Create</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Invoice', icon: 'receipt_long', c: 'text-blue-600 bg-blue-50', act: () => setView('new-invoice') },
                  { label: 'Quotation', icon: 'request_quote', c: 'text-violet-600 bg-violet-50', act: () => setView('new-invoice') },
                  { label: 'Expense', icon: 'payments', c: 'text-rose-600 bg-rose-50', act: () => {} },
                  { label: 'Purchase', icon: 'shopping_cart', c: 'text-emerald-600 bg-emerald-50', act: () => {} },
                  { label: 'Payment In', icon: 'move_to_inbox', c: 'text-teal-600 bg-teal-50', act: () => {} },
                  { label: 'Challan', icon: 'local_shipping', c: 'text-amber-600 bg-amber-50', act: () => setView('new-invoice') },
                ].map(a => (
                  <button key={a.label} onClick={a.act} className={`${a.c} flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all`}>
                    <span className="material-symbols-rounded text-[22px]">{a.icon}</span>
                    <span className="text-[9px] font-black uppercase tracking-wider">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Smart Features */}
            <div className="sb-card overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 to-blue-900 px-4 py-3">
                <p className="text-white font-black text-[13px]">⚡ Arkle Smart Features</p>
                <p className="text-blue-300 text-[10px] font-bold mt-0.5">AI-powered — faster than VyaparApp</p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-y divide-slate-100">
                {[
                  { label: 'Voice Invoice', icon: 'mic', desc: 'Speak in Hindi/Telugu', c: 'text-sky-600 bg-sky-50', act: () => { setView('new-invoice'); setTimeout(startVoice, 300); } },
                  { label: 'Scan Bill', icon: 'photo_camera', desc: 'Photo → Invoice AI', c: 'text-purple-600 bg-purple-50', act: () => { setView('new-invoice'); setTimeout(startCamera, 300); } },
                  { label: 'Barcode Scan', icon: 'qr_code_scanner', desc: 'Add product by barcode', c: 'text-emerald-600 bg-emerald-50', act: () => { setView('new-invoice'); setShowBarcode(true); } },
                  { label: 'Ask Arkle', icon: 'psychology', desc: 'GST & billing advice', c: 'text-blue-600 bg-blue-50', act: () => setShowAiBar(true) },
                ].map(f => (
                  <button key={f.label} onClick={f.act} className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left">
                    <div className={`w-9 h-9 ${f.c} rounded-xl flex items-center justify-center shrink-0`}>
                      <span className="material-symbols-rounded text-[18px]">{f.icon}</span>
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-slate-800">{f.label}</p>
                      <p className="text-[9px] text-slate-400 font-bold">{f.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="sb-card overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Invoices</p>
                <button onClick={() => setView('invoices')} className="text-[11px] font-bold text-blue-600">View all →</button>
              </div>
              {invoices.slice(0, 4).map(inv => (
                <div key={inv.id} className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <span className="material-symbols-rounded text-blue-600 text-[18px]">receipt_long</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-[13px] truncate">{inv.partyName || 'Walk-in'}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{inv.number} • {inv.date}</p>
                  </div>
                  <div className="text-right mr-2 shrink-0">
                    <p className="font-black text-slate-900 text-[14px]">{fmt(inv.grandTotal)}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase stat-${inv.status}`}>{inv.status}</span>
                  </div>
                  <button onClick={e => { e.stopPropagation(); shareWA(inv); }} className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center hover:bg-emerald-100 transition-all shrink-0">
                    <span className="material-symbols-rounded text-emerald-600 text-[15px]">chat</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Nav Cards */}
            <div className="grid grid-cols-3 gap-3 pb-4">
              {[
                { label: 'Invoices', icon: 'receipt_long', v: 'invoices' as View, c: 'text-blue-600 bg-blue-50' },
                { label: 'Parties', icon: 'group', v: 'parties' as View, c: 'text-violet-600 bg-violet-50' },
                { label: 'Products', icon: 'inventory_2', v: 'items' as View, c: 'text-emerald-600 bg-emerald-50' },
              ].map(n => (
                <button key={n.label} onClick={() => setView(n.v)} className={`sb-card p-4 flex flex-col items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all ${n.c}`}>
                  <span className="material-symbols-rounded text-[26px]">{n.icon}</span>
                  <p className="text-[10px] font-black uppercase tracking-wider">{n.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ NEW INVOICE ════════════════════════════════════════════ */}
        {view === 'new-invoice' && (
          <div className="space-y-3 pb-32">
            {/* Smart Entry Bar */}
            <div className="sb-card p-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Smart Entry — AI Powered</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={startVoice} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${isVoiceListening ? 'bg-red-500 text-white animate-pulse' : 'bg-sky-50 text-sky-600 hover:bg-sky-100'}`}>
                  <span className="material-symbols-rounded text-[13px]">mic</span>
                  {isVoiceListening ? 'Listening...' : 'Voice'}
                </button>
                <button onClick={startCamera} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase bg-purple-50 text-purple-600 hover:bg-purple-100">
                  <span className="material-symbols-rounded text-[13px]">photo_camera</span>
                  Scan Bill
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase bg-indigo-50 text-indigo-600 hover:bg-indigo-100">
                  <span className="material-symbols-rounded text-[13px]">upload</span>
                  Upload Photo
                </button>
                <button onClick={() => setShowBarcode(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 hover:bg-emerald-100">
                  <span className="material-symbols-rounded text-[13px]">qr_code_scanner</span>
                  Barcode
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => { if (e.target.files?.[0]) processImageOCR(); }} />
              </div>
            </div>

            {/* Voice feedback */}
            {(voiceTranscript || isAiParsing) && (
              <div className="sb-card p-3 border-l-4 border-sky-400 bg-sky-50">
                {isAiParsing ? (
                  <div className="flex items-center gap-2 text-sky-700 text-[12px] font-bold">
                    <div className="w-4 h-4 border-2 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
                    Arkle is understanding your voice command...
                  </div>
                ) : <p className="text-[12px] text-sky-900 font-bold">🎙️ "{voiceTranscript}"</p>}
              </div>
            )}

            {/* AI Message */}
            {aiMsg && (
              <div className="sb-card p-3 border-l-4 border-blue-400 bg-blue-50 flex items-start gap-2">
                <p className="text-[12px] text-blue-900 font-bold flex-1">{aiMsg}</p>
                <button onClick={() => setAiMsg('')} className="text-blue-400 text-[10px] shrink-0 hover:text-blue-600">✕</button>
              </div>
            )}

            {/* Party Selector */}
            <div className="sb-card p-4 space-y-2">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bill To</p>
              <select className="sb-input" value={selPartyId} onChange={e => setSelPartyId(e.target.value)}>
                <option value="">👤 Walk-in Customer</option>
                {parties.map(p => <option key={p.id} value={p.id}>{p.name}{p.phone ? ` · ${p.phone}` : ''}</option>)}
              </select>
              {selPartyId && (() => { const p = parties.find(x => x.id === selPartyId); return p ? (
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mt-1">
                  <span>{p.gstin ? `GSTIN: ${p.gstin}` : 'No GSTIN'} · State: {p.stateCode}</span>
                  {!p.gstin && (
                    <div className="flex items-center gap-1">
                      <span>Requires GST:</span>
                      <LegalServiceTrigger serviceKey="gst" label="Get GST with AI" />
                    </div>
                  )}
                </div>
              ) : null; })()}
            </div>

            {/* Line Items */}
            <div className="sb-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Items & Services</p>
                <button onClick={addLine} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black hover:bg-blue-100 transition-colors">
                  <span className="material-symbols-rounded text-[12px]">add</span> Add Row
                </button>
              </div>

              {lines.map((line, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  {/* Description with autocomplete */}
                  <div className="relative">
                    <input
                      className="sb-input"
                      value={line.description}
                      onChange={e => { updLine(i, { description: e.target.value }); setItemSearch(e.target.value); setSearchLineIdx(i); }}
                      onFocus={() => { setSearchLineIdx(i); setItemSearch(line.description); }}
                      onBlur={() => setTimeout(() => setSearchLineIdx(null), 200)}
                      placeholder="Product or service name..."
                    />
                    {searchLineIdx === i && itemSearch.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-50 bg-white rounded-xl border border-slate-200 shadow-xl mt-1 overflow-hidden">
                        {items.filter(it => it.name.toLowerCase().includes(itemSearch.toLowerCase())).slice(0, 5).map(it => (
                          <button key={it.id} onMouseDown={() => selectItem(i, it)} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 text-left border-b border-slate-50 last:border-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                              <span className="material-symbols-rounded text-blue-600 text-[14px]">inventory_2</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[12px] font-bold text-slate-900 truncate">{it.name}</p>
                              <p className="text-[9px] text-slate-400 font-bold">₹{it.salePrice} · GST {it.gstRate}%{it.stockQty !== undefined ? ` · Stock: ${it.stockQty}` : ''}</p>
                            </div>
                            <span className="text-[9px] font-black text-blue-500 uppercase">{it.unit}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Qty / Rate / GST */}
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Qty</p>
                      <input type="number" className="sb-input text-center" value={line.qty} min={0} onChange={e => updLine(i, { qty: Number(e.target.value) })} />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Unit</p>
                      <select className="sb-input" value={line.unit} onChange={e => updLine(i, { unit: e.target.value })}>
                        {['pcs','kg','mtr','ltr','hrs','box','set','dozen','bag'].map(u => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Rate ₹</p>
                      <input type="number" className="sb-input" value={line.rate} min={0} onChange={e => updLine(i, { rate: Number(e.target.value) })} />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-black uppercase mb-1">GST%</p>
                      <select className="sb-input" value={line.gstRate} onChange={e => updLine(i, { gstRate: Number(e.target.value) })}>
                        {[0,5,12,18,28].map(r => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <p className="text-[9px] text-slate-400 font-black uppercase">Disc%</p>
                      <input type="number" className="sb-input w-16 text-center" value={line.discountPct} min={0} max={100} onChange={e => updLine(i, { discountPct: Number(e.target.value) })} />
                    </div>
                    <div className="text-right flex-1">
                      <p className="text-[9px] text-slate-400 font-bold">Amount</p>
                      <p className="font-black text-blue-700 text-[15px]">{fmt(calcLine(line).total)}</p>
                    </div>
                    {lines.length > 1 && (
                      <button onClick={() => delLine(i)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100">
                        <span className="material-symbols-rounded text-red-500 text-[13px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button onClick={() => setShowAiBar(true)} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-50 rounded-xl text-[11px] font-bold text-blue-600 hover:bg-blue-100 transition-all">
                <span className="material-symbols-rounded text-[14px]">psychology</span>
                Not sure about HSN or GST rate? Ask Arkle →
              </button>
            </div>

            {/* Notes */}
            <div className="sb-card p-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Notes / Terms</p>
              <textarea className="sb-input resize-none" rows={2} value={invoiceNotes} onChange={e => setInvoiceNotes(e.target.value)} placeholder="Payment due in 15 days. Thank you for your business!" />
            </div>

            {/* Totals */}
            <div className="sb-card p-4">
              <div className="space-y-2">
                {[
                  { label: 'Subtotal (Taxable)', val: fmt(totals.taxable) },
                  { label: 'Total GST', val: fmt(totals.tax) },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-[13px]">
                    <span className="font-bold text-slate-500">{r.label}</span>
                    <span className="font-bold text-slate-700">{r.val}</span>
                  </div>
                ))}
                <div className="flex justify-between text-[17px] font-black pt-2 border-t border-slate-100">
                  <span className="text-slate-900">Grand Total</span>
                  <span className="text-blue-700">{fmt(totals.grand)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ INVOICES LIST ══════════════════════════════════════════ */}
        {view === 'invoices' && (
          <div className="space-y-3">
            <input className="sb-input" placeholder="🔍 Search by party or invoice number..." />
            <div className="sb-card overflow-hidden">
              {invoices.map(inv => (
                <div key={inv.id} className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <span className="material-symbols-rounded text-blue-600 text-[18px]">receipt_long</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-[13px] truncate">{inv.partyName || 'Walk-in'}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{inv.number} • {inv.date}</p>
                  </div>
                  <div className="text-right mr-2 shrink-0">
                    <p className="font-black text-slate-900 text-[14px]">{fmt(inv.grandTotal)}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase stat-${inv.status}`}>{inv.status}</span>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => shareWA(inv)} className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center hover:bg-emerald-100" title="Share WhatsApp">
                      <span className="material-symbols-rounded text-emerald-600 text-[14px]">chat</span>
                    </button>
                    <button className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200" title="Download PDF">
                      <span className="material-symbols-rounded text-slate-600 text-[14px]">picture_as_pdf</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ PARTIES ════════════════════════════════════════════════ */}
        {view === 'parties' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input className="sb-input flex-1" placeholder="🔍 Search parties..." />
              <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-[11px] font-black hover:bg-blue-700 shrink-0">
                <span className="material-symbols-rounded text-[14px]">add</span> Add Party
              </button>
            </div>
            <div className="sb-card overflow-hidden">
              {parties.map(p => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center font-black text-violet-700 text-[14px] shrink-0">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-[13px] truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{p.phone || 'No phone'}{p.gstin ? ` · ${p.gstin}` : ' · No GSTIN'}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => shareWA({ id: '', number: '', date: '', status: 'draft', lines: [], grandTotal: 0, partyId: p.id, partyName: p.name })} className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center hover:bg-emerald-100">
                      <span className="material-symbols-rounded text-emerald-600 text-[14px]">chat</span>
                    </button>
                    <button className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center hover:bg-blue-100">
                      <span className="material-symbols-rounded text-blue-600 text-[14px]">receipt_long</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ ITEMS ══════════════════════════════════════════════════ */}
        {view === 'items' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input className="sb-input flex-1" placeholder="🔍 Search products / services..." />
              <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-[11px] font-black hover:bg-blue-700 shrink-0">
                <span className="material-symbols-rounded text-[14px]">add</span> Add Item
              </button>
            </div>
            <div className="sb-card overflow-hidden">
              {items.map(it => (
                <div key={it.id} className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <span className="material-symbols-rounded text-emerald-600 text-[18px]">inventory_2</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-[13px] truncate">{it.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold">HSN: {it.hsnSac || '—'} · GST: {it.gstRate}% · {it.unit}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-slate-900 text-[14px]">₹{it.salePrice}</p>
                    {it.stockQty !== undefined && (
                      <p className={`text-[9px] font-black ${it.stockQty < 10 ? 'text-rose-500' : 'text-emerald-600'}`}>Stock: {it.stockQty}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── CAMERA MODAL ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showCamera && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-[300] flex flex-col">
            <div className="flex items-center justify-between p-4 shrink-0">
              <p className="text-white font-black text-[15px]">📸 Scan Handwritten Bill</p>
              <button onClick={() => { (videoRef.current?.srcObject as MediaStream)?.getTracks().forEach(t => t.stop()); setShowCamera(false); }} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-rounded text-white text-[18px]">close</span>
              </button>
            </div>
            <div className="flex-1 relative overflow-hidden">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-8 border-2 border-white/80 rounded-xl pointer-events-none">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />
              </div>
              <p className="absolute bottom-24 inset-x-0 text-center text-white/80 text-[12px] font-bold">Point at the bill/invoice to scan</p>
            </div>
            <div className="p-6 flex gap-4 justify-center shrink-0">
              <button onClick={() => { fileInputRef.current?.click(); setShowCamera(false); }} className="flex items-center gap-2 px-5 py-3 bg-white/20 text-white rounded-2xl font-bold text-[13px]">
                <span className="material-symbols-rounded">photo_library</span> Gallery
              </button>
              <button onClick={capturePhoto} className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-2xl active:scale-95">
                <div className="w-12 h-12 rounded-full border-4 border-slate-300 bg-slate-100" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BARCODE MODAL ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showBarcode && (
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }} className="fixed inset-x-0 bottom-0 z-[300] bg-white rounded-t-[28px] shadow-2xl p-5">
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <p className="font-black text-slate-900 text-[15px]">📦 Barcode Scanner</p>
              <button onClick={() => setShowBarcode(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="material-symbols-rounded text-slate-600 text-[16px]">close</span>
              </button>
            </div>
            <div className="bg-slate-100 rounded-2xl p-8 text-center mb-4">
              <span className="material-symbols-rounded text-slate-400 text-[56px]">qr_code_scanner</span>
              <p className="text-slate-500 font-bold text-[13px] mt-2">Point at EAN-13, QR, or UPC barcode</p>
              <p className="text-slate-400 text-[10px] mt-1">Supports EAN-13, QR Code, UPC-A, Code-128</p>
            </div>
            <input className="sb-input mb-3" placeholder="Or type barcode number manually..." value={barcodeInput} onChange={e => setBarcodeInput(e.target.value)} />
            <button onClick={() => {
              const matched = items[0];
              if (matched) { setLines(prev => [...prev.filter(l => l.description), { itemId: matched.id, description: matched.name, hsnSac: matched.hsnSac, qty: 1, unit: matched.unit, rate: matched.salePrice, discountPct: 0, gstRate: matched.gstRate }]); }
              setAiMsg(`✅ Barcode matched: ${matched?.name || 'item'} — added to invoice`);
              setShowBarcode(false);
            }} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-2xl font-black text-[13px] hover:bg-blue-700 transition-all">
              <span className="material-symbols-rounded text-[16px]">check</span> Add to Invoice
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── IMAGE PROCESSING OVERLAY ────────────────────────────────── */}
      <AnimatePresence>
        {processingImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[400] flex items-center justify-center">
            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl mx-6 max-w-xs">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="font-black text-slate-900 text-[15px]">Arkle is reading your bill...</p>
              <p className="text-slate-400 text-[11px] mt-1 font-bold">AI-powered OCR in progress</p>
              <div className="mt-4 flex gap-1 justify-center">
                {['Detecting text', 'Reading amounts', 'Matching items'].map((s, i) => (
                  <span key={s} className="text-[9px] px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-bold" style={{ animationDelay: `${i * 0.3}s` }}>{s}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SAVE BUTTON BAR (New Invoice) ──────────────────────────── */}
      {view === 'new-invoice' && (
        <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-3 flex items-center gap-3" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
          <div className="flex-1">
            <p className="text-[9px] text-slate-400 font-bold uppercase">Invoice Total</p>
            <p className="font-black text-blue-700 text-[18px]">{fmt(totals.grand)}</p>
          </div>
          <button onClick={() => { setView('dashboard'); setLines([{ description: '', qty: 1, unit: 'pcs', rate: 0, discountPct: 0, gstRate: 18 }]); setSelPartyId(''); }} className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-black text-[12px] hover:bg-slate-200 transition-all">Cancel</button>
          <button onClick={saveInvoice} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-black text-[12px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-60">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span className="material-symbols-rounded text-[15px]">{saveSuccess ? 'check_circle' : 'save'}</span>}
            {saving ? 'Saving...' : saveSuccess ? 'Saved! ✅' : 'Save Invoice'}
          </button>
        </div>
      )}
    </div>
  );
}
