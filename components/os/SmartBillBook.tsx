'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Party { id: string; name: string; phone?: string | null; gstin?: string | null; stateCode: string; type?: string; email?: string | null; billingAddress?: string | null; }
interface Item { id: string; name: string; hsnSac?: string | null; gstRate: number; salePrice: number; unit: string; stockQty?: number | null; }
interface InvoiceLine { tempId: string; itemId?: string; description: string; hsnSac?: string; qty: number; unit: string; rate: number; discountPct: number; gstRate: number; }
interface Invoice { id: string; number?: string | null; partyId?: string | null; partyName?: string; date: string; status: string; grandTotal: number; taxableTotal?: number; cgstTotal?: number; sgstTotal?: number; igstTotal?: number; notes?: string | null; lines?: InvoiceLine[]; party?: Party | null; }

// ─── GST Helpers ─────────────────────────────────────────────────────────────
function calcLine(l: InvoiceLine, interstate: boolean) {
  const base = l.qty * l.rate * (1 - l.discountPct / 100);
  const tax = base * l.gstRate / 100;
  return { taxable: base, tax, cgst: interstate ? 0 : tax / 2, sgst: interstate ? 0 : tax / 2, igst: interstate ? tax : 0, total: base + tax };
}
function calcTotals(lines: InvoiceLine[], interstate: boolean) {
  const v = lines.filter(l => l.description.trim());
  return { taxable: v.reduce((s, l) => s + calcLine(l, interstate).taxable, 0), cgst: v.reduce((s, l) => s + calcLine(l, interstate).cgst, 0), sgst: v.reduce((s, l) => s + calcLine(l, interstate).sgst, 0), igst: v.reduce((s, l) => s + calcLine(l, interstate).igst, 0), grand: v.reduce((s, l) => s + calcLine(l, interstate).total, 0) };
}
function fmt(n: number) { return '\u20b9' + (n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function newLine(): InvoiceLine { return { tempId: crypto.randomUUID(), description: '', qty: 1, unit: 'pcs', rate: 0, discountPct: 0, gstRate: 18 }; }

// ─── Offline Queue ────────────────────────────────────────────────────────────
const OQK = 'smb_oq';
const getQ = (): any[] => { try { return JSON.parse(localStorage.getItem(OQK) || '[]'); } catch { return []; } };
const pushQ = (item: any) => { const q = getQ(); q.push({ ...item, ts: Date.now() }); localStorage.setItem(OQK, JSON.stringify(q)); };
async function flushQ() {
  const q = getQ(); if (!q.length) return 0; let n = 0; const rem: any[] = [];
  for (const i of q) { try { await fetch(i.url, { method: i.method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(i.body) }); n++; } catch { rem.push(i); } }
  localStorage.setItem(OQK, JSON.stringify(rem)); return n;
}

type View = 'dashboard' | 'new-invoice' | 'invoices' | 'parties' | 'items' | 'add-party' | 'add-item' | 'view-invoice';
const STATES = [{ c: '01', n: 'J&K' }, { c: '07', n: 'Delhi' }, { c: '08', n: 'Rajasthan' }, { c: '09', n: 'UP' }, { c: '10', n: 'Bihar' }, { c: '19', n: 'West Bengal' }, { c: '20', n: 'Jharkhand' }, { c: '21', n: 'Odisha' }, { c: '22', n: 'Chhattisgarh' }, { c: '23', n: 'MP' }, { c: '24', n: 'Gujarat' }, { c: '27', n: 'Maharashtra' }, { c: '29', n: 'Karnataka' }, { c: '30', n: 'Goa' }, { c: '32', n: 'Kerala' }, { c: '33', n: 'Tamil Nadu' }, { c: '36', n: 'Telangana' }, { c: '37', n: 'Andhra Pradesh' }];
const GST_RATES = [0, 0.25, 1, 3, 5, 12, 18, 28];
const UNITS = ['pcs', 'kg', 'g', 'mtr', 'ltr', 'ml', 'hrs', 'box', 'set', 'dozen', 'bag', 'ton', 'ft', 'sqft'];

export default function SmartBillBook({ onBack }: { onBack?: () => void }) {
  const [view, setView] = useState<View>('dashboard');
  const [prevView, setPrevView] = useState<View>('dashboard');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedInv, setSelectedInv] = useState<Invoice | null>(null);
  const [loadingInv, setLoadingInv] = useState(false);
  const [loadingPar, setLoadingPar] = useState(false);
  const [loadingItm, setLoadingItm] = useState(false);
  const [selPartyId, setSelPartyId] = useState('');
  const [lines, setLines] = useState<InvoiceLine[]>([newLine()]);
  const [invNotes, setInvNotes] = useState('Thank you for your business!');
  const [invDate, setInvDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState('');
  const [docType, setDocType] = useState('invoice');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newParty, setNewParty] = useState({ name: '', phone: '', gstin: '', stateCode: '36', email: '', billingAddress: '', type: 'customer' });
  const [savingParty, setSavingParty] = useState(false);
  const [newItm, setNewItm] = useState({ name: '', hsnSac: '', gstRate: 18, salePrice: 0, unit: 'pcs', description: '', trackStock: false, stockQty: 0 });
  const [savingItm, setSavingItm] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceTxt, setVoiceTxt] = useState('');
  const [parsing, setParsing] = useState(false);
  const [aiMsg, setAiMsg] = useState('');
  const [showAI, setShowAI] = useState(false);
  const [arkleQ, setArkleQ] = useState('');
  const [showCam, setShowCam] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showBC, setShowBC] = useState(false);
  const [bcVal, setBcVal] = useState('');
  const [itmSearch, setItmSearch] = useState('');
  const [searchLine, setSearchLine] = useState<number | null>(null);
  const [parSearch, setParSearch] = useState('');
  const [invSearch, setInvSearch] = useState('');
  const [online, setOnline] = useState(true);
  const [qCount, setQCount] = useState(0);
  const [flushMsg, setFlushMsg] = useState('');
  const [bizSt] = useState('36');
  const vidRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selParty = parties.find(p => p.id === selPartyId) || null;
  const interstate = !!(selParty?.stateCode && selParty.stateCode !== bizSt);
  const totals = calcTotals(lines, interstate);
  const today = new Date().toISOString().slice(0, 10);
  const month = new Date().toISOString().slice(0, 7);
  const todaySales = invoices.filter(i => i.date?.slice(0, 10) === today).reduce((s, i) => s + (i.grandTotal || 0), 0);
  const outstanding = invoices.filter(i => i.status === 'draft' || i.status === 'finalized').reduce((s, i) => s + (i.grandTotal || 0), 0);
  const monthSales = invoices.filter(i => i.date?.slice(0, 7) === month).reduce((s, i) => s + (i.grandTotal || 0), 0);
  const paidCnt = invoices.filter(i => i.status === 'paid').length;

  const fetchParties = useCallback(async () => {
    setLoadingPar(true);
    try { const r = await fetch('/api/parties'); if (r.ok) setParties(await r.json()); } catch { }
    setLoadingPar(false);
  }, []);

  const fetchItems = useCallback(async () => {
    setLoadingItm(true);
    try { const r = await fetch('/api/items'); if (r.ok) setItems(await r.json()); } catch { }
    setLoadingItm(false);
  }, []);

  const fetchInvoices = useCallback(async () => {
    setLoadingInv(true);
    try {
      const r = await fetch('/api/documents?type=invoice');
      if (r.ok) {
        const data = await r.json();
        setInvoices(Array.isArray(data) ? data.map((d: any) => ({
          id: d.id, number: d.number, partyId: d.partyId,
          partyName: d.party?.name || 'Walk-in Customer',
          date: d.date ? new Date(d.date).toISOString().slice(0, 10) : '',
          status: d.status, grandTotal: d.grandTotal || 0,
          taxableTotal: d.taxableTotal, cgstTotal: d.cgstTotal,
          sgstTotal: d.sgstTotal, igstTotal: d.igstTotal, notes: d.notes, party: d.party,
        })) : []);
      }
    } catch { }
    setLoadingInv(false);
  }, []);

  useEffect(() => {
    fetchParties(); fetchItems(); fetchInvoices();
    const onO = async () => {
      setOnline(true);
      const n = await flushQ();
      if (n > 0) { setFlushMsg(`Synced ${n} offline invoice(s)!`); fetchInvoices(); setTimeout(() => setFlushMsg(''), 4000); }
      setQCount(getQ().length);
    };
    const onF = () => { setOnline(false); setQCount(getQ().length); };
    window.addEventListener('online', onO); window.addEventListener('offline', onF);
    setOnline(navigator.onLine); setQCount(getQ().length);
    return () => { window.removeEventListener('online', onO); window.removeEventListener('offline', onF); };
  }, [fetchParties, fetchItems, fetchInvoices]);

  const goTo = (v: View) => { setPrevView(view); setView(v); };
  const goBack = () => setView(prevView === view ? 'dashboard' : prevView);

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setAiMsg('Voice not supported — use Chrome.'); setShowAI(true); return; }
    const rec = new SR(); rec.lang = 'hi-IN'; rec.interimResults = true; let ft = '';
    rec.onstart = () => { setListening(true); goTo('new-invoice'); };
    rec.onresult = (e: any) => { ft = Array.from(e.results).map((r: any) => r[0].transcript).join(''); setVoiceTxt(ft); };
    rec.onend = async () => { setListening(false); if (ft.length > 2) await parseVoice(ft); else setVoiceTxt(''); };
    rec.onerror = () => { setListening(false); setAiMsg('Mic error — check permissions.'); };
    rec.start();
  };

  const parseVoice = async (text: string) => {
    setParsing(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Parse voice command for GST invoice. Command: "${text}"\nItems: ${items.slice(0, 12).map(i => `${i.name}(Rs${i.salePrice},${i.gstRate}%,${i.unit})`).join(',')}\nParties: ${parties.slice(0, 8).map(p => p.name).join(',')}\nReturn ONLY JSON: {"partyName":"","lines":[{"name":"","qty":1,"rate":0,"gstRate":18,"unit":"pcs"}],"notes":""}` })
      });
      const d = await res.json();
      const json = JSON.parse((d.text || '{}').replace(/```json|```/g, '').trim());
      if (json.partyName) { const p = parties.find(x => x.name.toLowerCase().includes(json.partyName.toLowerCase())); if (p) setSelPartyId(p.id); }
      if (json.lines?.length) setLines(json.lines.map((l: any) => {
        const it = items.find(i => i.name.toLowerCase().includes((l.name || '').toLowerCase()));
        return { tempId: crypto.randomUUID(), itemId: it?.id, description: l.name || it?.name || '', hsnSac: it?.hsnSac || '', qty: Number(l.qty ?? 1), unit: l.unit || it?.unit || 'pcs', rate: Number(l.rate ?? it?.salePrice ?? 0), discountPct: 0, gstRate: Number(l.gstRate ?? it?.gstRate ?? 18) };
      }));
      if (json.notes) setInvNotes(json.notes);
      setAiMsg(`Arkle parsed: "${text.slice(0, 35)}..." — ${json.lines?.length ?? 0} item(s) added`);
    } catch { setAiMsg('Could not parse — please verify items.'); }
    setParsing(false); setVoiceTxt('');
  };

  const startCamera = async () => {
    setShowCam(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (vidRef.current) { vidRef.current.srcObject = stream; vidRef.current.play(); }
    } catch { setAiMsg('Camera permission denied.'); setShowCam(false); }
  };

  const capturePhoto = () => {
    if (!vidRef.current || !canvasRef.current) return;
    canvasRef.current.width = vidRef.current.videoWidth; canvasRef.current.height = vidRef.current.videoHeight;
    canvasRef.current.getContext('2d')?.drawImage(vidRef.current, 0, 0);
    (vidRef.current.srcObject as MediaStream)?.getTracks().forEach(t => t.stop()); setShowCam(false);
    processOCR(canvasRef.current.toDataURL('image/jpeg', 0.8));
  };

  const processOCR = async (dataUrl?: string) => {
    setProcessing(true); goTo('new-invoice');
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Extract invoice data from image. Return ONLY JSON: {"partyName":"","lines":[{"name":"","qty":1,"rate":0,"gstRate":18,"unit":"pcs"}],"notes":""}. Catalog: ${items.slice(0, 8).map(i => i.name).join(',')}`, imageData: dataUrl })
      });
      const d = await res.json();
      try {
        const json = JSON.parse((d.text || '{}').replace(/```json|```/g, '').trim());
        if (json.lines?.length) setLines(json.lines.map((l: any) => {
          const it = items.find(i => i.name.toLowerCase().includes((l.name || '').toLowerCase()));
          return { tempId: crypto.randomUUID(), itemId: it?.id, description: l.name || '', hsnSac: it?.hsnSac || '', qty: Number(l.qty ?? 1), unit: l.unit || it?.unit || 'pcs', rate: Number(l.rate ?? it?.salePrice ?? 0), discountPct: 0, gstRate: Number(l.gstRate ?? it?.gstRate ?? 18) };
        }));
        setAiMsg(`Arkle scanned — ${json.lines?.length ?? 0} item(s) extracted. Verify please.`);
      } catch { setLines([{ ...newLine(), description: 'Scanned Item (verify)' }]); setAiMsg('Scanned — fill details manually.'); }
    } catch { setAiMsg('OCR failed — fill manually.'); }
    setProcessing(false);
  };

  const askArkle = async () => {
    if (!arkleQ.trim()) return; setParsing(true); const q = arkleQ; setArkleQ('');
    try {
      const res = await fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: `You are Arkle, GST & billing expert for Indian MSMEs. Answer in 2-3 sentences: "${q}"` }) });
      const d = await res.json(); setAiMsg(d.text || 'No response.');
    } catch { setAiMsg('Arkle offline.'); }
    setParsing(false);
  };

  const addLine = () => setLines(p => [...p, newLine()]);
  const updLine = (i: number, patch: Partial<InvoiceLine>) => setLines(p => { const n = [...p]; n[i] = { ...n[i], ...patch }; return n; });
  const delLine = (i: number) => setLines(p => p.filter((_, x) => x !== i));
  const selItem = (li: number, it: Item) => { updLine(li, { itemId: it.id, description: it.name, hsnSac: it.hsnSac || '', rate: it.salePrice, gstRate: it.gstRate, unit: it.unit }); setSearchLine(null); setItmSearch(''); };

  const saveInvoice = async (status: 'draft' | 'finalized' = 'draft') => {
    const valid = lines.filter(l => l.description.trim());
    if (!valid.length) { setAiMsg('Add at least one item.'); setShowAI(true); return; }
    setSaving(true);
    const body = { type: docType, partyId: selPartyId || undefined, lines: valid.map(l => ({ description: l.description, hsnSac: l.hsnSac, qty: l.qty, unit: l.unit, rate: l.rate, discountPct: l.discountPct, gstRate: l.gstRate, itemId: l.itemId })), notes: invNotes, date: invDate, dueDate: dueDate || undefined, status };
    if (!online) {
      pushQ({ url: '/api/documents', method: 'POST', body }); setQCount(getQ().length);
      setSaved(true); setAiMsg(`Saved offline (${getQ().length} queued)`); setShowAI(true); setSaving(false);
      setTimeout(() => { setSaved(false); goTo('invoices'); resetForm(); }, 1500); return;
    }
    try {
      const res = await fetch('/api/documents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) { setSaved(true); await fetchInvoices(); setTimeout(() => { setSaved(false); goTo('invoices'); resetForm(); }, 1400); }
      else { const err = await res.json(); setAiMsg(`Save failed: ${err?.error || 'Unknown'}`); setShowAI(true); }
    } catch { setAiMsg('Save failed.'); setShowAI(true); }
    setSaving(false);
  };

  const convertToInvoice = async (inv: Invoice) => {
    try {
      const res = await fetch(`/api/documents/${inv.id}/convert`, { method: 'POST' });
      if (res.ok) { setAiMsg('Converted to Invoice successfully!'); setShowAI(true); fetchInvoices(); goTo('invoices'); }
      else setAiMsg('Failed to convert.');
    } catch { setAiMsg('Network error.'); }
  };

  const resetForm = () => { setLines([newLine()]); setSelPartyId(''); setInvNotes('Thank you for your business!'); setInvDate(new Date().toISOString().slice(0, 10)); setDueDate(''); setDocType('invoice'); };

  const saveParty = async () => {
    if (!newParty.name.trim()) return; setSavingParty(true);
    try {
      const res = await fetch('/api/parties', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newParty) });
      if (res.ok) { await fetchParties(); setAiMsg(`"${newParty.name}" added!`); setShowAI(true); setNewParty({ name: '', phone: '', gstin: '', stateCode: '36', email: '', billingAddress: '', type: 'customer' }); goTo('parties'); }
      else { setAiMsg('Failed to add party.'); setShowAI(true); }
    } catch { setAiMsg('Network error.'); setShowAI(true); }
    setSavingParty(false);
  };

  const saveItem = async () => {
    if (!newItm.name.trim()) return; setSavingItm(true);
    try {
      const res = await fetch('/api/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newItm) });
      if (res.ok) { await fetchItems(); setAiMsg(`"${newItm.name}" added!`); setShowAI(true); setNewItm({ name: '', hsnSac: '', gstRate: 18, salePrice: 0, unit: 'pcs', description: '', trackStock: false, stockQty: 0 }); goTo('items'); }
      else { setAiMsg('Failed to add item.'); setShowAI(true); }
    } catch { setAiMsg('Network error.'); setShowAI(true); }
    setSavingItm(false);
  };

  const shareWA = async (inv: Invoice) => {
    const p = parties.find(x => x.id === inv.partyId);
    const msg = `*Invoice ${inv.number || inv.id.slice(-6).toUpperCase()}* — ${inv.date}\nTotal: ${fmt(inv.grandTotal)}\nStatus: ${inv.status?.toUpperCase()}\n\nThank you!\n_SetMyBizz BizOS_`;
    // Attempt global integration send (using fetch internally)
    try {
      const response = await fetch('/api/whatsapp/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: p?.phone || '', message: msg, type: 'text' }) });
      if (!response.ok) throw new Error();
      setAiMsg('Sent via WhatsApp Business Engine!'); setShowAI(true);
    } catch {
      // Fallback to client side if API is not set up
      window.open(`https://wa.me/${(p?.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  const printInv = (inv: Invoice, theme: 'A4' | 'Thermal' = 'A4') => {
    const p = parties.find(x => x.id === inv.partyId); const w = window.open('', '_blank')!;
    // Note: 'any' type cast here for custom property if it exists, or just use number.
    const isQuotation = (inv as any).type === 'quotation';
    const title = isQuotation ? 'Quotation / Estimate' : 'Tax Invoice';
    
    // Dynamic UPI QR generation
    const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=upi://pay?pa=merchant@upi&pn=SetMyBizz&am=${inv.grandTotal}`;
    const qrHtml = isQuotation ? '' : `<div style="text-align:right"><img src="${upiQrUrl}" alt="Pay via UPI" style="width:100px;height:100px;border-radius:8px;border:1px solid #e2e8f0;padding:4px;"/><p style="font-size:10px;color:#64748b;margin:4px 0 0">Scan to Pay via UPI</p></div>`;

    if (theme === 'A4') {
      w.document.write(`<html><head><title>${title} ${inv.number}</title><style>body{font-family:sans-serif;padding:40px;max-width:800px;margin:auto}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{padding:10px;border:1px solid #e2e8f0;font-size:13px}th{background:#f8fafc;font-weight:700}.g{font-size:20px;font-weight:900;text-align:right}</style></head><body>`);
      w.document.write(`<div style="display:flex;justify-content:space-between;margin-bottom:30px"><div><h1 style="margin:0;font-size:28px;font-weight:900">${title}</h1><p style="color:#64748b;font-size:12px">SetMyBizz BizOS</p></div><div style="text-align:right"><strong>${isQuotation ? 'Estimate' : 'Invoice'}: </strong>${inv.number || 'DRAFT'}<br><strong>Date: </strong>${inv.date}<br><span style="background:#dcfce7;color:#166534;padding:2px 10px;border-radius:9999px;font-size:11px;font-weight:700">${inv.status?.toUpperCase()}</span></div></div>`);
      w.document.write(`<div style="display:flex;justify-content:space-between;margin-bottom:24px"><div><strong>Bill To:</strong><br>${p?.name || 'Walk-in Customer'}${p?.gstin ? `<br>GSTIN: ${p.gstin}` : ''}</div>${qrHtml}</div>`);
      w.document.write(`<table><thead><tr><th>Item</th><th>HSN</th><th>Qty</th><th>Rate</th><th>GST%</th><th>Amount</th></tr></thead><tbody>`);
      (inv.lines || []).forEach(l => w.document.write(`<tr><td>${l.description}</td><td>${l.hsnSac || '-'}</td><td>${l.qty} ${l.unit}</td><td>Rs.${l.rate}</td><td>${l.gstRate}%</td><td>Rs.${(l.qty * l.rate * (1 + l.gstRate / 100)).toFixed(2)}</td></tr>`));
      w.document.write(`</tbody></table><div style="text-align:right"><p>Taxable: ${fmt(inv.taxableTotal || 0)}</p>${inv.cgstTotal ? `<p>CGST: ${fmt(inv.cgstTotal)}</p><p>SGST: ${fmt(inv.sgstTotal || 0)}</p>` : ''}${inv.igstTotal ? `<p>IGST: ${fmt(inv.igstTotal)}</p>` : ''}<p class="g">Grand Total: ${fmt(inv.grandTotal)}</p></div>`);
      if (inv.notes) w.document.write(`<p style="font-size:12px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:12px;margin-top:20px">${inv.notes}</p>`);
      w.document.write('</body></html>');
    } else {
      w.document.write(`<html><head><title>${title} ${inv.number}</title><style>body{font-family:monospace;padding:10px;width:300px;margin:auto}table{width:100%;border-collapse:collapse;margin:10px 0}th,td{padding:4px 0;font-size:12px;border-bottom:1px dashed #000;text-align:left}.r{text-align:right}.c{text-align:center}h2{margin:0;font-size:18px}</style></head><body>`);
      w.document.write(`<div class="c"><h2>SetMyBizz Retail</h2><p>${title}: ${inv.number || 'DRAFT'}<br>${inv.date}</p></div>`);
      w.document.write(`<div>To: ${p?.name || 'Walk-in'}</div>`);
      w.document.write(`<table><tr><th>Item</th><th>Qty</th><th class="r">Amt</th></tr>`);
      (inv.lines || []).forEach(l => w.document.write(`<tr><td>${l.description.substring(0,12)}</td><td>${l.qty}</td><td class="r">${(l.qty * l.rate * (1 + l.gstRate / 100)).toFixed(2)}</td></tr>`));
      w.document.write(`</table><div class="r" style="margin-top:10px;"><strong>Total: ${fmt(inv.grandTotal)}</strong></div>`);
      if (!isQuotation) w.document.write(`<div class="c" style="margin-top:10px"><img src="${upiQrUrl}" alt="UPI" style="width:80px;height:80px;"/><br>Scan to Pay</div>`);
      w.document.write(`<div class="c" style="margin-top:20px;font-size:10px">Thank You for shopping!</div></body></html>`);
    }
    w.document.close(); setTimeout(() => w.print(), 500);
  };

  const exportCSV = (inv: Invoice) => {
    const lines = inv.lines || [];
    let csv = "Item,HSN,Qty,Rate,GST%,Amount\n";
    lines.forEach(l => { csv += `"${l.description}","${l.hsnSac || ''}",${l.qty},${l.rate},${l.gstRate},${(l.qty * l.rate * (1 + l.gstRate / 100)).toFixed(2)}\n`; });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `Invoice_${inv.number || 'DRAFT'}.csv`; document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const markStatus = async (inv: Invoice, status: string) => {
    try {
      await fetch(`/api/documents/${inv.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      await fetchInvoices(); if (selectedInv?.id === inv.id) setSelectedInv(prev => prev ? { ...prev, status } : null);
      setAiMsg(`Marked as ${status}`); setShowAI(true);
    } catch { setAiMsg('Could not update.'); setShowAI(true); }
  };

  const stCls = (s: string) => s === 'paid' ? 'background:#dcfce7;color:#166534' : s === 'finalized' ? 'background:#dbeafe;color:#1e40af' : s === 'cancelled' ? 'background:#fee2e2;color:#991b1b' : 'background:#fef3c7;color:#92400e';
  const fInv = invoices.filter(i => !invSearch || i.partyName?.toLowerCase().includes(invSearch.toLowerCase()) || i.number?.toLowerCase().includes(invSearch.toLowerCase()));
  const fPar = parties.filter(p => !parSearch || p.name.toLowerCase().includes(parSearch.toLowerCase()) || p.phone?.includes(parSearch));

  const css = `.sbc{background:#fff;border-radius:20px;border:1px solid #e8ecf1;box-shadow:0 2px 12px rgba(0,0,0,.04)}.sbi{width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:13px;font-weight:600;color:#1e293b;background:#f8fafc;outline:none;transition:all .2s;box-sizing:border-box}.sbi:focus{border-color:#1a56db;background:#fff;box-shadow:0 0 0 3px rgba(26,86,219,.08)}.sbl{display:block;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.12em;color:#94a3b8;margin-bottom:5px}.nsb::-webkit-scrollbar{display:none}.nsb{-ms-overflow-style:none;scrollbar-width:none}.sgb{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:12px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.05em;cursor:pointer;border:none}@keyframes spin{to{transform:rotate(360deg)}}.spin{animation:spin 1s linear infinite}`;

  const Spinner = () => <div className="spin" style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%' }} />;
  const PageSpinner = () => <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spin" style={{ width: 24, height: 24, border: '2px solid #bfdbfe', borderTopColor: '#2563eb', borderRadius: '50%' }} /></div>;

  return (
    <div className="nsb" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#f5f7fa', fontFamily: '"DM Sans","Inter",sans-serif' }}>
      <style>{css}</style>

      {/* TOP BAR */}
      <div style={{ flexShrink: 0, background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 1px 4px rgba(0,0,0,.05)', zIndex: 10 }}>
        {view !== 'dashboard' ? (
          <button onClick={goBack} style={{ width: 32, height: 32, borderRadius: 12, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 18 }}>arrow_back</span>
          </button>
        ) : (
          onBack && (
            <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: 12, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }} title="Exit Bill Book">
              <span className="material-symbols-rounded" style={{ fontSize: 18 }}>arrow_back</span>
            </button>
          )
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 900, color: '#0f172a', fontSize: 15 }}>
              {view === 'dashboard' ? '📒 BillBook' : view === 'new-invoice' ? '✨ New Invoice' : view === 'invoices' ? 'All Invoices' : view === 'parties' ? 'Parties & Customers' : view === 'items' ? 'Products & Services' : view === 'add-party' ? 'Add Party' : view === 'add-item' ? 'Add Item' : 'Invoice Detail'}
            </span>
            {!online && <span style={{ padding: '2px 8px', background: '#fef3c7', color: '#92400e', fontSize: 9, fontWeight: 900, borderRadius: 9999 }}>📴 Offline</span>}
            {qCount > 0 && <span style={{ padding: '2px 8px', background: '#dbeafe', color: '#1e40af', fontSize: 9, fontWeight: 900, borderRadius: 9999 }}>{qCount} queued</span>}
          </div>
          <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>GST-Ready · SetMyBizz BizOS</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: online ? '#34d399' : '#fbbf24' }} />
          <button onClick={() => setShowAI(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', background: showAI ? '#1d4ed8' : '#eff6ff', color: showAI ? '#fff' : '#1d4ed8', transition: 'all .2s' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 13 }}>auto_awesome</span>Arkle
          </button>
          {view === 'dashboard' && (
            <button onClick={() => goTo('new-invoice')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(29,78,216,.3)' }}>
              <span className="material-symbols-rounded" style={{ fontSize: 13 }}>add</span>Invoice
            </button>
          )}
        </div>
      </div>

      {/* ARKLE BAR */}
      <AnimatePresence>
        {showAI && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', flexShrink: 0, overflow: 'hidden', zIndex: 9 }}>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(aiMsg || flushMsg) && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span className="material-symbols-rounded" style={{ color: '#93c5fd', fontSize: 14, marginTop: 2, flexShrink: 0 }}>psychology</span>
                  <p style={{ fontSize: 11, color: '#bfdbfe', fontWeight: 500, flex: 1, lineHeight: 1.5 }}>{flushMsg || aiMsg}</p>
                  <button onClick={() => { setAiMsg(''); setFlushMsg(''); }} style={{ color: 'rgba(255,255,255,.4)', fontSize: 10, border: 'none', background: 'transparent', cursor: 'pointer', flexShrink: 0 }}>✕</button>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={arkleQ} onChange={e => setArkleQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && askArkle()} placeholder='Ask: "HSN for software?" or "GST on gold?"' style={{ flex: 1, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 12, padding: '8px 12px', fontSize: 12, color: '#fff', outline: 'none' }} />
                <button onClick={askArkle} disabled={parsing} style={{ width: 36, height: 36, background: '#3b82f6', border: 'none', borderRadius: 12, cursor: parsing ? 'not-allowed' : 'pointer', opacity: parsing ? .5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {parsing ? <Spinner /> : <span className="material-symbols-rounded" style={{ color: '#fff', fontSize: 15 }}>send</span>}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTENT */}
      <div className="nsb" style={{ flex: 1, overflowY: 'auto', padding: 12 }}>

        {/* ── DASHBOARD ── */}
        {view === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[{ l: "Today's Sales", v: fmt(todaySales), ic: 'trending_up', bg: '#f0fdf4', ic_c: '#16a34a' }, { l: 'Outstanding', v: fmt(outstanding), ic: 'schedule', bg: '#fffbeb', ic_c: '#d97706' }, { l: 'This Month', v: fmt(monthSales), ic: 'calendar_month', bg: '#eff6ff', ic_c: '#2563eb' }, { l: `Paid (${paidCnt})`, v: `${invoices.length} invoices`, ic: 'check_circle', bg: '#f5f3ff', ic_c: '#7c3aed' }].map(s => (
                <div key={s.l} className="sbc" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, background: s.bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-rounded" style={{ fontSize: 20, color: s.ic_c }}>{s.ic}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 900, color: '#0f172a', fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.v}</p>
                    <p style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.l}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Quick Create */}
            <div className="sbc" style={{ padding: 16 }}>
              <p className="sbl" style={{ marginBottom: 12 }}>Quick Create</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {[{ l: 'Invoice', ic: 'receipt_long', bg: '#eff6ff', c: '#2563eb', a: () => goTo('new-invoice') }, { l: 'Add Party', ic: 'person_add', bg: '#f0fdf4', c: '#16a34a', a: () => goTo('add-party') }, { l: 'Add Item', ic: 'add_box', bg: '#f0fdfa', c: '#0d9488', a: () => goTo('add-item') }, { l: 'Invoices', ic: 'list_alt', bg: '#f5f3ff', c: '#7c3aed', a: () => goTo('invoices') }, { l: 'Parties', ic: 'group', bg: '#faf5ff', c: '#9333ea', a: () => goTo('parties') }, { l: 'Refresh', ic: 'refresh', bg: '#f8fafc', c: '#475569', a: () => { fetchInvoices(); fetchParties(); fetchItems(); } }].map(a => (
                  <button key={a.l} onClick={a.a} style={{ background: a.bg, border: 'none', borderRadius: 16, padding: '12px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: a.c, transition: 'transform .15s' }}>
                    <span className="material-symbols-rounded" style={{ fontSize: 22 }}>{a.ic}</span>
                    <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.05em' }}>{a.l}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Arkle Smart Entry */}
            <div className="sbc" style={{ overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', padding: '12px 16px' }}>
                <p style={{ color: '#fff', fontWeight: 900, fontSize: 13 }}>⚡ Arkle Smart Entry</p>
                <p style={{ color: '#93c5fd', fontSize: 10, fontWeight: 700, marginTop: 2 }}>Faster than VyaparApp & MyBillBook</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid #f1f5f9' }}>
                {[{ l: 'Voice Invoice', ic: 'mic', d: 'Hindi/Telugu/English', bg: '#f0f9ff', c: '#0284c7', a: () => { goTo('new-invoice'); setTimeout(startVoice, 300); } }, { l: 'Scan Bill', ic: 'photo_camera', d: 'Photo → Auto fill', bg: '#faf5ff', c: '#7c3aed', a: () => { goTo('new-invoice'); setTimeout(startCamera, 300); } }, { l: 'Barcode', ic: 'qr_code_scanner', d: 'EAN-13, QR, UPC', bg: '#f0fdf4', c: '#16a34a', a: () => { goTo('new-invoice'); setShowBC(true); } }, { l: 'Ask GST', ic: 'psychology', d: 'HSN & rate advice', bg: '#eff6ff', c: '#2563eb', a: () => setShowAI(true) }].map((f, idx) => (
                  <button key={f.l} onClick={f.a} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', borderRight: idx % 2 === 0 ? '1px solid #f1f5f9' : 'none', borderBottom: idx < 2 ? '1px solid #f1f5f9' : 'none', transition: 'background .15s' }}>
                    <div style={{ width: 36, height: 36, background: f.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-symbols-rounded" style={{ fontSize: 18, color: f.c }}>{f.ic}</span>
                    </div>
                    <div><p style={{ fontSize: 11, fontWeight: 900, color: '#0f172a' }}>{f.l}</p><p style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700 }}>{f.d}</p></div>
                  </button>
                ))}
              </div>
            </div>
            {/* Recent Invoices */}
            <div className="sbc" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p className="sbl">Recent Invoices</p>
                <button onClick={() => goTo('invoices')} style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', background: 'transparent', border: 'none', cursor: 'pointer' }}>View all ({invoices.length}) →</button>
              </div>
              {loadingInv && <PageSpinner />}
              {!loadingInv && invoices.length === 0 && <div style={{ padding: '40px 16px', textAlign: 'center' }}><p style={{ color: '#94a3b8', fontWeight: 700, fontSize: 13 }}>No invoices yet — create your first!</p></div>}
              {invoices.slice(0, 5).map(inv => (
                <div key={inv.id} onClick={() => { setSelectedInv(inv); goTo('view-invoice'); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid #fafafa', cursor: 'pointer', transition: 'background .15s' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 14, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span className="material-symbols-rounded" style={{ fontSize: 18, color: '#2563eb' }}>receipt_long</span></div>
                  <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontWeight: 700, color: '#0f172a', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.partyName || 'Walk-in'}</p><p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>{inv.number || '—'} · {inv.date}</p></div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginRight: 8 }}><p style={{ fontWeight: 900, color: '#0f172a', fontSize: 14 }}>{fmt(inv.grandTotal)}</p><span style={{ padding: '2px 8px', borderRadius: 9999, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', ...Object.fromEntries(stCls(inv.status).split(';').map(p => p.trim().split(':').map(s => s.trim()))) }}>{inv.status}</span></div>
                  <button onClick={e => { e.stopPropagation(); shareWA(inv); }} style={{ width: 32, height: 32, borderRadius: 12, background: '#f0fdf4', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span className="material-symbols-rounded" style={{ fontSize: 14, color: '#16a34a' }}>chat</span></button>
                </div>
              ))}
            </div>
            {/* Nav */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, paddingBottom: 16 }}>
              {[{ l: 'Invoices', ic: 'receipt_long', v: 'invoices' as View, bg: '#eff6ff', c: '#2563eb', n: invoices.length }, { l: 'Parties', ic: 'group', v: 'parties' as View, bg: '#f5f3ff', c: '#7c3aed', n: parties.length }, { l: 'Products', ic: 'inventory_2', v: 'items' as View, bg: '#f0fdf4', c: '#16a34a', n: items.length }].map(x => (
                <button key={x.l} onClick={() => goTo(x.v)} className="sbc" style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, border: 'none', cursor: 'pointer', background: x.bg, color: x.c, borderRadius: 20, transition: 'transform .15s' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: 26 }}>{x.ic}</span>
                  <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.05em' }}>{x.l}</p>
                  <span style={{ fontSize: 12, fontWeight: 900 }}>{x.n}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── NEW INVOICE ── */}
        {view === 'new-invoice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 120 }}>
            {/* Smart Toolbar */}
            <div className="sbc" style={{ padding: 12 }}>
              <p className="sbl" style={{ marginBottom: 8 }}>Smart Entry — AI Powered</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[{ l: listening ? 'Listening...' : 'Voice', ic: 'mic', bg: listening ? '#ef4444' : '#f0f9ff', c: listening ? '#fff' : '#0284c7', a: startVoice }, { l: 'Scan Bill', ic: 'photo_camera', bg: '#faf5ff', c: '#7c3aed', a: startCamera }, { l: 'Upload', ic: 'upload', bg: '#eef2ff', c: '#4338ca', a: () => fileRef.current?.click() }, { l: 'Barcode', ic: 'qr_code_scanner', bg: '#f0fdf4', c: '#16a34a', a: () => setShowBC(true) }].map(b => (
                  <button key={b.l} onClick={b.a} className="sgb" style={{ background: b.bg, color: b.c }}><span className="material-symbols-rounded" style={{ fontSize: 13 }}>{b.ic}</span>{b.l}</button>
                ))}
                <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) { const r = new FileReader(); r.onload = ev => processOCR(ev.target?.result as string); r.readAsDataURL(e.target.files[0]); } }} />
              </div>
            </div>
            {voiceTxt && (
              <div className="sbc" style={{ padding: 12, borderLeft: '4px solid #38bdf8', background: '#f0f9ff' }}>
                {parsing ? <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0284c7', fontSize: 12, fontWeight: 700 }}><div className="spin" style={{ width: 14, height: 14, border: '2px solid #bae6fd', borderTopColor: '#0284c7', borderRadius: '50%' }} />Arkle parsing...</div>
                  : <p style={{ fontSize: 12, color: '#0c4a6e', fontWeight: 700 }}>🎙️ "{voiceTxt}"</p>}
              </div>
            )}
            {aiMsg && !showAI && (
              <div className="sbc" style={{ padding: 12, borderLeft: '4px solid #3b82f6', background: '#eff6ff', display: 'flex', gap: 8 }}>
                <p style={{ fontSize: 12, color: '#1e3a8a', fontWeight: 700, flex: 1 }}>{aiMsg}</p>
                <button onClick={() => setAiMsg('')} style={{ color: '#93c5fd', fontSize: 10, border: 'none', background: 'transparent', cursor: 'pointer', flexShrink: 0 }}>✕</button>
              </div>
            )}
            {/* Dates and Document Type */}
            <div className="sbc" style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label className="sbl">Invoice Date</label><input type="date" className="sbi" value={invDate} onChange={e => setInvDate(e.target.value)} /></div>
              <div><label className="sbl">Due Date</label><input type="date" className="sbi" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="sbl">Document Type</label>
                <select className="sbi" value={docType} onChange={e => setDocType(e.target.value)}>
                  <option value="invoice">📄 Tax Invoice</option>
                  <option value="quotation">📑 Quotation / Estimate / Proforma</option>
                </select>
              </div>
            </div>
            {/* Party */}
            <div className="sbc" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label className="sbl">Bill To</label>
                <button onClick={() => goTo('add-party')} style={{ fontSize: 10, color: '#2563eb', fontWeight: 900, background: 'transparent', border: 'none', cursor: 'pointer' }}>+ New Party</button>
              </div>
              {loadingPar ? <div className="sbi" style={{ color: '#94a3b8' }}>Loading...</div> : (
                <select className="sbi" value={selPartyId} onChange={e => setSelPartyId(e.target.value)}>
                  <option value="">👤 Walk-in Customer</option>
                  {parties.map(p => <option key={p.id} value={p.id}>{p.name}{p.phone ? ' · ' + p.phone : ''}{p.gstin ? ' · ' + p.gstin : ''}</option>)}
                </select>
              )}
              {selParty && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: '#64748b', fontWeight: 700 }}>
                  <span>{selParty.gstin ? `GSTIN: ${selParty.gstin}` : '⚠️ No GSTIN'} · State: {selParty.stateCode}</span>
                  <span style={{ padding: '2px 8px', borderRadius: 9999, fontWeight: 900, background: interstate ? '#fef3c7' : '#dbeafe', color: interstate ? '#92400e' : '#1e40af' }}>{interstate ? 'IGST' : 'CGST+SGST'}</span>
                </div>
              )}
            </div>
            {/* Line Items */}
            <div className="sbc" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <label className="sbl">Items & Services</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => goTo('add-item')} style={{ fontSize: 10, color: '#16a34a', fontWeight: 900, background: 'transparent', border: 'none', cursor: 'pointer' }}>+ New Item</button>
                  <button onClick={addLine} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 10, fontWeight: 900 }}>
                    <span className="material-symbols-rounded" style={{ fontSize: 12 }}>add</span>Add Row
                  </button>
                </div>
              </div>
              {lines.map((line, i) => (
                <div key={line.tempId} style={{ padding: 12, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: 12 }}>
                  <div style={{ position: 'relative', marginBottom: 8 }}>
                    <input className="sbi" value={line.description} onChange={e => { updLine(i, { description: e.target.value }); setItmSearch(e.target.value); setSearchLine(i); }} onFocus={() => { setSearchLine(i); setItmSearch(line.description); }} onBlur={() => setTimeout(() => setSearchLine(null), 200)} placeholder="Product or service name..." />
                    {searchLine === i && itmSearch.length > 0 && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,.12)', marginTop: 4, overflow: 'hidden' }}>
                        {items.filter(it => it.name.toLowerCase().includes(itmSearch.toLowerCase())).slice(0, 5).map(it => (
                          <button key={it.id} onMouseDown={() => selItem(i, it)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'transparent', border: 'none', borderBottom: '1px solid #fafafa', cursor: 'pointer', textAlign: 'left' }}>
                            <div style={{ width: 32, height: 32, background: '#eff6ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span className="material-symbols-rounded" style={{ fontSize: 14, color: '#2563eb' }}>inventory_2</span></div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</p>
                              <p style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700 }}>₹{it.salePrice} · GST {it.gstRate}%{it.stockQty != null ? ` · Stk: ${it.stockQty}` : ''}</p>
                            </div>
                            <span style={{ fontSize: 9, fontWeight: 900, color: '#3b82f6', textTransform: 'uppercase', flexShrink: 0 }}>{it.unit}</span>
                          </button>
                        ))}
                        {items.filter(it => it.name.toLowerCase().includes(itmSearch.toLowerCase())).length === 0 && (
                          <div style={{ padding: 12, fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>No match — <button onClick={() => goTo('add-item')} style={{ color: '#2563eb', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Add new</button></div>
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
                    <div><label className="sbl">Qty</label><input type="number" className="sbi" style={{ textAlign: 'center' }} value={line.qty} min={0} onChange={e => updLine(i, { qty: Number(e.target.value) })} /></div>
                    <div><label className="sbl">Unit</label><select className="sbi" value={line.unit} onChange={e => updLine(i, { unit: e.target.value })}>{UNITS.map(u => <option key={u}>{u}</option>)}</select></div>
                    <div><label className="sbl">Rate ₹</label><input type="number" className="sbi" value={line.rate} min={0} onChange={e => updLine(i, { rate: Number(e.target.value) })} /></div>
                    <div><label className="sbl">GST %</label><select className="sbi" value={line.gstRate} onChange={e => updLine(i, { gstRate: Number(e.target.value) })}>{GST_RATES.map(r => <option key={r} value={r}>{r}%</option>)}</select></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <label className="sbl" style={{ margin: 0 }}>Disc%</label>
                      <input type="number" className="sbi" style={{ width: 60, textAlign: 'center' }} value={line.discountPct} min={0} max={100} onChange={e => updLine(i, { discountPct: Number(e.target.value) })} />
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <p style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700 }}>Amount</p>
                      <p style={{ fontWeight: 900, color: '#1d4ed8', fontSize: 16 }}>{fmt(calcLine(line, interstate).total)}</p>
                    </div>
                    {lines.length > 1 && <button onClick={() => delLine(i)} style={{ width: 28, height: 28, background: '#fef2f2', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-symbols-rounded" style={{ fontSize: 13, color: '#ef4444' }}>delete</span>
                    </button>}
                  </div>
                </div>
              ))}
              <button onClick={() => setShowAI(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 10, background: '#eff6ff', border: 'none', borderRadius: 12, cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#2563eb' }}>
                <span className="material-symbols-rounded" style={{ fontSize: 14 }}>psychology</span>Not sure about HSN/GST? Ask Arkle →
              </button>
            </div>
            {/* Notes */}
            <div className="sbc" style={{ padding: 16 }}>
              <label className="sbl">Notes / Terms</label>
              <textarea className="sbi" rows={2} value={invNotes} onChange={e => setInvNotes(e.target.value)} style={{ resize: 'none' }} placeholder="Payment terms or thank you note..." />
            </div>
            {/* Totals */}
            <div className="sbc" style={{ padding: 16 }}>
              {[{ l: 'Taxable Amount', v: fmt(totals.taxable) }, ...(!interstate && totals.cgst > 0 ? [{ l: 'CGST', v: fmt(totals.cgst) }, { l: 'SGST', v: fmt(totals.sgst) }] : []), ...(interstate && totals.igst > 0 ? [{ l: 'IGST', v: fmt(totals.igst) }] : [])].map(r => (
                <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}><span style={{ fontWeight: 700, color: '#64748b' }}>{r.l}</span><span style={{ fontWeight: 700, color: '#334155' }}>{r.v}</span></div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #e2e8f0', fontSize: 18, fontWeight: 900 }}>
                <span style={{ color: '#0f172a' }}>Grand Total</span><span style={{ color: '#1d4ed8' }}>{fmt(totals.grand)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── ALL INVOICES ── */}
        {view === 'invoices' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input className="sbi" value={invSearch} onChange={e => setInvSearch(e.target.value)} placeholder="🔍 Search by party or invoice number..." />
            <div className="sbc" style={{ overflow: 'hidden' }}>
              {loadingInv && <PageSpinner />}
              {!loadingInv && fInv.length === 0 && <div style={{ padding: '40px 16px', textAlign: 'center' }}><p style={{ color: '#94a3b8', fontWeight: 700 }}>No invoices found</p></div>}
              {fInv.map(inv => (
                <div key={inv.id} onClick={() => { setSelectedInv(inv); goTo('view-invoice'); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid #fafafa', cursor: 'pointer', transition: 'background .15s' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 14, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span className="material-symbols-rounded" style={{ fontSize: 18, color: '#2563eb' }}>receipt_long</span></div>
                  <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontWeight: 700, color: '#0f172a', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inv.partyName || 'Walk-in'}</p><p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>{inv.number || '—'} · {inv.date}</p></div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginRight: 8 }}>
                    <p style={{ fontWeight: 900, fontSize: 14, color: '#0f172a' }}>{fmt(inv.grandTotal)}</p>
                    <span style={{ padding: '2px 8px', borderRadius: 9999, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', ...Object.fromEntries(stCls(inv.status).split(';').map(p => p.trim().split(':').map(s => s.trim()))) }}>{inv.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button onClick={e => { e.stopPropagation(); shareWA(inv); }} style={{ width: 32, height: 32, borderRadius: 10, background: '#f0fdf4', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-rounded" style={{ fontSize: 14, color: '#16a34a' }}>chat</span></button>
                    <button onClick={e => { e.stopPropagation(); printInv(inv); }} style={{ width: 32, height: 32, borderRadius: 10, background: '#f8fafc', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-rounded" style={{ fontSize: 14, color: '#64748b' }}>print</span></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── VIEW INVOICE ── */}
        {view === 'view-invoice' && selectedInv && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 24 }}>
            <div className="sbc" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <p style={{ fontWeight: 900, fontSize: 20, color: '#0f172a' }}>{selectedInv.number || 'Draft Invoice'}</p>
                  <p style={{ color: '#64748b', fontSize: 12, fontWeight: 700, marginTop: 4 }}>{selectedInv.date}</p>
                  <span style={{ display: 'inline-block', marginTop: 8, padding: '4px 12px', borderRadius: 9999, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', ...Object.fromEntries(stCls(selectedInv.status).split(';').map(p => p.trim().split(':').map(s => s.trim()))) }}>{selectedInv.status}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>Grand Total</p>
                  <p style={{ fontWeight: 900, color: '#1d4ed8', fontSize: 26 }}>{fmt(selectedInv.grandTotal)}</p>
                  {/* Phase 1: Convert Quotation to Invoice Button */}
                  {(selectedInv as any).type === 'quotation' && (
                    <button onClick={() => convertToInvoice(selectedInv)} style={{ marginTop: 8, width: '100%', background: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <span className="material-symbols-rounded" style={{ fontSize: 14 }}>transform</span> Convert to Invoice
                    </button>
                  )}
                </div>
              </div>
              {selectedInv.party && (
                <div style={{ padding: 12, background: '#f8fafc', borderRadius: 12, marginBottom: 12 }}>
                  <p className="sbl" style={{ marginBottom: 4 }}>Bill To</p>
                  <p style={{ fontWeight: 700, color: '#0f172a' }}>{selectedInv.party.name}</p>
                  {selectedInv.party.gstin && <p style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>GSTIN: {selectedInv.party.gstin}</p>}
                  {selectedInv.party.phone && <p style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>📞 {selectedInv.party.phone}</p>}
                </div>
              )}
              {selectedInv.notes && <p style={{ fontSize: 11, color: '#64748b', fontWeight: 700, borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>{selectedInv.notes}</p>}
            </div>
            <div className="sbc" style={{ padding: 16 }}>
              <p className="sbl" style={{ marginBottom: 12 }}>Update Status</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['draft', 'finalized', 'paid', 'cancelled'].map(s => (
                  <button key={s} onClick={() => markStatus(selectedInv, s)} style={{ padding: '8px 16px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', background: selectedInv.status === s ? '#1d4ed8' : '#f1f5f9', color: selectedInv.status === s ? '#fff' : '#475569' }}>{s}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { l: 'WhatsApp Share', ic: 'chat', bg: '#f0fdf4', c: '#16a34a', d: 'Send to customer', a: () => shareWA(selectedInv) }, 
                { l: 'Print A4 PDF', ic: 'print', bg: '#eff6ff', c: '#2563eb', d: 'Standard format', a: () => printInv(selectedInv, 'A4') },
                { l: 'Print Thermal', ic: 'receipt_long', bg: '#fdf4ff', c: '#c026d3', d: '3-inch POS printer', a: () => printInv(selectedInv, 'Thermal') },
                { l: 'Export CSV', ic: 'download', bg: '#fffbeb', c: '#d97706', d: 'For Excel / Mail', a: () => exportCSV(selectedInv) }
              ].map(a => (
                <button key={a.l} onClick={a.a} className="sbc" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, border: 'none', cursor: 'pointer', background: a.bg, borderRadius: 20 }}>
                  <span className="material-symbols-rounded" style={{ fontSize: 22, color: a.c }}>{a.ic}</span>
                  <div style={{ textAlign: 'left' }}><p style={{ fontWeight: 900, fontSize: 12, color: '#0f172a' }}>{a.l}</p><p style={{ fontSize: 10, color: '#64748b' }}>{a.d}</p></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PARTIES ── */}
        {view === 'parties' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="sbi" style={{ flex: 1 }} value={parSearch} onChange={e => setParSearch(e.target.value)} placeholder="🔍 Search parties..." />
              <button onClick={() => goTo('add-party')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', fontSize: 11, fontWeight: 900, flexShrink: 0 }}>
                <span className="material-symbols-rounded" style={{ fontSize: 14 }}>add</span>Add
              </button>
            </div>
            <div className="sbc" style={{ overflow: 'hidden' }}>
              {loadingPar && <PageSpinner />}
              {!loadingPar && fPar.length === 0 && <div style={{ padding: '40px 16px', textAlign: 'center' }}><p style={{ color: '#94a3b8', fontWeight: 700 }}>No parties yet</p></div>}
              {fPar.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid #fafafa', transition: 'background .15s' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#7c3aed', fontSize: 16, flexShrink: 0 }}>{p.name.charAt(0).toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontWeight: 700, color: '#0f172a', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p><p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>{p.phone || 'No phone'}{p.gstin ? ' · ' + p.gstin : ' · No GSTIN'}</p></div>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button onClick={() => { setSelPartyId(p.id); goTo('new-invoice'); }} style={{ width: 32, height: 32, borderRadius: 10, background: '#eff6ff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-rounded" style={{ fontSize: 14, color: '#2563eb' }}>receipt_long</span></button>
                    {p.phone && <button onClick={() => shareWA({ id: '', number: '', date: today, status: 'draft', grandTotal: 0, partyId: p.id, partyName: p.name })} style={{ width: 32, height: 32, borderRadius: 10, background: '#f0fdf4', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="material-symbols-rounded" style={{ fontSize: 14, color: '#16a34a' }}>chat</span></button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ADD PARTY ── */}
        {view === 'add-party' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 100 }}>
            <div className="sbc" style={{ padding: 20 }}>
              <p style={{ fontWeight: 900, color: '#0f172a', fontSize: 15, marginBottom: 20 }}>Add Customer / Supplier</p>
              {[{ l: 'Full Name *', k: 'name', ph: 'Ravi Kumar Enterprises', t: 'text' }, { l: 'Phone', k: 'phone', ph: '9876543210', t: 'tel' }, { l: 'GSTIN', k: 'gstin', ph: '29ABCDE1234F1Z5', t: 'text' }, { l: 'Email', k: 'email', ph: 'ravi@example.com', t: 'email' }, { l: 'Billing Address', k: 'billingAddress', ph: '123, MG Road, Hyderabad', t: 'text' }].map(f => (
                <div key={f.k} style={{ marginBottom: 16 }}><label className="sbl">{f.l}</label><input type={f.t} className="sbi" value={(newParty as any)[f.k]} onChange={e => setNewParty(prev => ({ ...prev, [f.k]: e.target.value }))} placeholder={f.ph} /></div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label className="sbl">Type</label><select className="sbi" value={newParty.type} onChange={e => setNewParty(prev => ({ ...prev, type: e.target.value }))}><option value="customer">Customer</option><option value="supplier">Supplier</option><option value="both">Both</option></select></div>
                <div><label className="sbl">State</label><select className="sbi" value={newParty.stateCode} onChange={e => setNewParty(prev => ({ ...prev, stateCode: e.target.value }))}>{STATES.map(s => <option key={s.c} value={s.c}>{s.c} – {s.n}</option>)}</select></div>
              </div>
            </div>
          </div>
        )}

        {/* ── ITEMS ── */}
        {view === 'items' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="sbi" style={{ flex: 1 }} placeholder="🔍 Search products / services..." />
              <button onClick={() => goTo('add-item')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', fontSize: 11, fontWeight: 900, flexShrink: 0 }}>
                <span className="material-symbols-rounded" style={{ fontSize: 14 }}>add</span>Add
              </button>
            </div>
            <div className="sbc" style={{ overflow: 'hidden' }}>
              {loadingItm && <PageSpinner />}
              {!loadingItm && items.length === 0 && <div style={{ padding: '40px 16px', textAlign: 'center' }}><p style={{ color: '#94a3b8', fontWeight: 700 }}>No items yet — add your first product!</p></div>}
              {items.map(it => (
                <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid #fafafa', transition: 'background .15s' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 14, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span className="material-symbols-rounded" style={{ fontSize: 18, color: '#16a34a' }}>inventory_2</span></div>
                  <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontWeight: 700, color: '#0f172a', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</p><p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>HSN: {it.hsnSac || '—'} · GST: {it.gstRate}% · {it.unit}</p></div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontWeight: 900, color: '#0f172a', fontSize: 14 }}>₹{it.salePrice}</p>
                    {it.stockQty != null && <p style={{ fontSize: 9, fontWeight: 900, color: it.stockQty < 10 ? '#ef4444' : '#16a34a' }}>Stk: {it.stockQty}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ADD ITEM ── */}
        {view === 'add-item' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 100 }}>
            <div className="sbc" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <p style={{ fontWeight: 900, color: '#0f172a', fontSize: 15 }}>Add Product / Service</p>
                <button onClick={() => { setShowAI(true); setArkleQ(`What is the HSN code and GST rate for ${newItm.name || 'this product'}?`); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 10, fontWeight: 900 }}>
                  <span className="material-symbols-rounded" style={{ fontSize: 12 }}>psychology</span>Ask Arkle HSN
                </button>
              </div>
              {[{ l: 'Item Name *', k: 'name', ph: 'HP Laptop 15s', t: 'text' }, { l: 'HSN / SAC Code', k: 'hsnSac', ph: '8471 (Laptops)', t: 'text' }, { l: 'Description', k: 'description', ph: 'Brief description', t: 'text' }].map(f => (
                <div key={f.k} style={{ marginBottom: 16 }}><label className="sbl">{f.l}</label><input type={f.t} className="sbi" value={(newItm as any)[f.k]} onChange={e => setNewItm(prev => ({ ...prev, [f.k]: e.target.value }))} placeholder={f.ph} /></div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label className="sbl">Sale Price ₹</label><input type="number" className="sbi" value={newItm.salePrice} min={0} onChange={e => setNewItm(prev => ({ ...prev, salePrice: Number(e.target.value) }))} /></div>
                <div><label className="sbl">GST Rate %</label><select className="sbi" value={newItm.gstRate} onChange={e => setNewItm(prev => ({ ...prev, gstRate: Number(e.target.value) }))}>{GST_RATES.map(r => <option key={r} value={r}>{r}%</option>)}</select></div>
                <div><label className="sbl">Unit</label><select className="sbi" value={newItm.unit} onChange={e => setNewItm(prev => ({ ...prev, unit: e.target.value }))}>{UNITS.map(u => <option key={u}>{u}</option>)}</select></div>
                <div><label className="sbl">Stock Qty</label><input type="number" className="sbi" value={newItm.stockQty} min={0} onChange={e => setNewItm(prev => ({ ...prev, stockQty: Number(e.target.value), trackStock: Number(e.target.value) > 0 }))} /></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM BARS */}
      {view === 'new-invoice' && (
        <div style={{ flexShrink: 0, borderTop: '1px solid #f1f5f9', background: '#fff', padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
          <div style={{ flex: 1 }}><p style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Total</p><p style={{ fontWeight: 900, color: '#1d4ed8', fontSize: 20 }}>{fmt(totals.grand)}</p></div>
          <button onClick={() => { resetForm(); goTo('dashboard'); }} style={{ padding: '10px 16px', borderRadius: 12, background: '#f1f5f9', color: '#475569', border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: 12 }}>Cancel</button>
          <button onClick={() => saveInvoice('draft')} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#334155', color: '#fff', border: 'none', borderRadius: 12, cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 900, fontSize: 12, opacity: saving ? .6 : 1 }}>{saving ? <Spinner /> : <span className="material-symbols-rounded" style={{ fontSize: 15 }}>save</span>}Draft</button>
          <button onClick={() => saveInvoice('finalized')} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: saved ? '#16a34a' : '#1d4ed8', color: '#fff', border: 'none', borderRadius: 12, cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 900, fontSize: 12, boxShadow: '0 4px 12px rgba(29,78,216,.3)', opacity: saving ? .6 : 1, transition: 'background .3s' }}>{saving ? <Spinner /> : <span className="material-symbols-rounded" style={{ fontSize: 15 }}>{saved ? 'check_circle' : 'receipt_long'}</span>}{saved ? 'Saved! ✅' : 'Finalize'}</button>
        </div>
      )}
      {view === 'add-party' && (
        <div style={{ flexShrink: 0, borderTop: '1px solid #f1f5f9', background: '#fff', padding: '12px 16px', display: 'flex', gap: 12, paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
          <button onClick={() => goTo('parties')} style={{ flex: 1, padding: 12, borderRadius: 12, background: '#f1f5f9', border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: 12, color: '#475569' }}>Cancel</button>
          <button onClick={saveParty} disabled={savingParty || !newParty.name.trim()} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 12, cursor: savingParty || !newParty.name.trim() ? 'not-allowed' : 'pointer', fontWeight: 900, fontSize: 12, opacity: savingParty || !newParty.name.trim() ? .5 : 1 }}>{savingParty ? <Spinner /> : <span className="material-symbols-rounded" style={{ fontSize: 15 }}>person_add</span>}Save Party</button>
        </div>
      )}
      {view === 'add-item' && (
        <div style={{ flexShrink: 0, borderTop: '1px solid #f1f5f9', background: '#fff', padding: '12px 16px', display: 'flex', gap: 12, paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
          <button onClick={() => goTo('items')} style={{ flex: 1, padding: 12, borderRadius: 12, background: '#f1f5f9', border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: 12, color: '#475569' }}>Cancel</button>
          <button onClick={saveItem} disabled={savingItm || !newItm.name.trim()} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 12, cursor: savingItm || !newItm.name.trim() ? 'not-allowed' : 'pointer', fontWeight: 900, fontSize: 12, opacity: savingItm || !newItm.name.trim() ? .5 : 1 }}>{savingItm ? <Spinner /> : <span className="material-symbols-rounded" style={{ fontSize: 15 }}>add_box</span>}Save Item</button>
        </div>
      )}

      {/* CAMERA MODAL */}
      <AnimatePresence>
        {showCam && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 300, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, flexShrink: 0 }}>
              <p style={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>📸 Scan Bill / Invoice</p>
              <button onClick={() => { (vidRef.current?.srcObject as MediaStream)?.getTracks().forEach(t => t.stop()); setShowCam(false); }} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-rounded" style={{ color: '#fff', fontSize: 20 }}>close</span>
              </button>
            </div>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <video ref={vidRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div style={{ position: 'absolute', inset: 40, border: '2px solid rgba(255,255,255,.5)', borderRadius: 16, pointerEvents: 'none' }} />
              <p style={{ position: 'absolute', bottom: 100, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,.8)', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>Point at bill or invoice</p>
            </div>
            <div style={{ padding: '24px', display: 'flex', gap: 16, justifyContent: 'center', flexShrink: 0 }}>
              <button onClick={() => { fileRef.current?.click(); setShowCam(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'rgba(255,255,255,.2)', color: '#fff', border: 'none', borderRadius: 16, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                <span className="material-symbols-rounded">photo_library</span>Gallery
              </button>
              <button onClick={capturePhoto} style={{ width: 68, height: 68, borderRadius: '50%', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,.4)' }}>
                <div style={{ width: 54, height: 54, borderRadius: '50%', border: '4px solid #e2e8f0', background: '#f8fafc' }} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BARCODE MODAL */}
      <AnimatePresence>
        {showBC && (
          <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 80 }} style={{ position: 'fixed', inset: '0 0 0 0', background: 'rgba(0,0,0,.5)', zIndex: 300, display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ background: '#fff', borderRadius: '28px 28px 0 0', padding: 20, width: '100%' }}>
              <div style={{ width: 48, height: 4, background: '#e2e8f0', borderRadius: 9999, margin: '0 auto 16px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <p style={{ fontWeight: 900, fontSize: 16, color: '#0f172a' }}>📦 Barcode Scanner</p>
                <button onClick={() => setShowBC(false)} style={{ width: 32, height: 32, borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: 16, color: '#475569' }}>close</span>
                </button>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 16, padding: 32, textAlign: 'center', marginBottom: 16 }}>
                <span className="material-symbols-rounded" style={{ fontSize: 56, color: '#cbd5e1' }}>qr_code_scanner</span>
                <p style={{ color: '#94a3b8', fontWeight: 700, fontSize: 13, marginTop: 8 }}>EAN-13, QR Code, UPC-A, Code-128</p>
              </div>
              <input className="sbi" style={{ marginBottom: 12 }} placeholder="Type barcode number manually..." value={bcVal} onChange={e => setBcVal(e.target.value)} />
              <button onClick={() => {
                const matched = items.find(it => it.hsnSac === bcVal || it.name.toLowerCase().includes(bcVal.toLowerCase()));
                if (matched) { setLines(prev => [...prev.filter(l => l.description), { ...newLine(), itemId: matched.id, description: matched.name, hsnSac: matched.hsnSac || '', rate: matched.salePrice, gstRate: matched.gstRate, unit: matched.unit }]); setAiMsg(`"${matched.name}" added from barcode`); setShowAI(true); }
                setShowBC(false); setBcVal('');
              }} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 16, cursor: 'pointer', fontWeight: 900, fontSize: 13 }}>
                <span className="material-symbols-rounded" style={{ fontSize: 16 }}>check</span>Add to Invoice
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OCR OVERLAY */}
      <AnimatePresence>
        {processing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(4px)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ background: '#fff', borderRadius: 24, padding: 32, textAlign: 'center', maxWidth: 300, width: '100%' }}>
              <div className="spin" style={{ width: 64, height: 64, border: '4px solid #dbeafe', borderTopColor: '#1d4ed8', borderRadius: '50%', margin: '0 auto 16px' }} />
              <p style={{ fontWeight: 900, color: '#0f172a', fontSize: 16 }}>Arkle is reading your bill...</p>
              <p style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, marginTop: 4 }}>AI-powered OCR + GST extraction</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
