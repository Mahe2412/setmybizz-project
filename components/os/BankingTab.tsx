'use client';
import React, { useState, useEffect } from 'react';
import { T } from '@/components/os/shared';
import LegalServiceTrigger from './LegalServiceTrigger';

const BANK_FEATURES = [
  {
    emoji: '🏦',
    title: 'Open Digital Bank Account',
    sub: 'Current Account — No branch visit needed',
    desc: 'Open a business current account online in just 10 minutes. Works with your GST, invoicing and payments automatically.',
    steps: ['Choose your bank (HDFC / ICICI / RazorpayX)', 'Upload PAN + GST + Company docs', 'Account ready in 1-2 days'],
    cta: 'Open Account Now →',
    ctaColor: T.blue,
    tag: '✅ Free to Open',
    partners: ['🔵 HDFC', '🟠 ICICI', '⚡ RazorpayX', '🟢 Open'],
  },
  {
    emoji: '💳',
    title: 'MSME Business Loan',
    sub: 'Starting from ₹1 Lakh — Low interest',
    desc: 'Need money to grow your business? Get an MSME loan with easy documents and low interest rates. Govt-backed schemes available.',
    steps: ['Fill a simple form (5 min)', 'Upload last 6 months bank statement', 'Get approval in 48 hours'],
    cta: 'Check Loan Eligibility →',
    ctaColor: T.green,
    tag: '💡 Starting ₹1 Lakh',
    partners: ['🏦 SIDBI', '🏛️ MUDRA', '🟦 FlexiLoans', '🔶 Indifi'],
  },
  {
    emoji: '📞',
    title: 'Talk to a Banking Expert',
    sub: 'Free 30-minute call — expert advice',
    desc: 'Confused about which bank to choose? What loan is right for you? Talk to our banking expert FREE — no sales pitch, just honest advice.',
    steps: ['Pick a time that works for you', 'Expert calls you on WhatsApp or phone', 'Get personalised banking advice'],
    cta: 'Book Free Expert Call →',
    ctaColor: T.purple,
    tag: '📞 100% Free',
    partners: [],
  },
];

interface InvoiceItem {
  desc: string;
  qty: number;
  rate: number;
  gstRate: number; // 0, 5, 12, 18
}

export default function BankingTab() {
  const [activeSubTab, setActiveSubTab] = useState<'capital' | 'bizzbook'>('capital');
  const [booked, setBooked] = useState<number | null>(null);

  // Invoicing States
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([{ desc: '', qty: 1, rate: 0, gstRate: 18 }]);
  const [invoices, setInvoices] = useState<any[]>([
    { id: 'INV-2026-001', name: 'Krishna Traders', phone: '9948011223', amount: 45000, status: 'paid', date: 'May 10, 2026' },
    { id: 'INV-2026-002', name: 'Balaji & Sons', phone: '9988223344', amount: 18500, status: 'pending', date: 'May 15, 2026' },
    { id: 'INV-2026-003', name: 'Srinivasa Retail', phone: '9000123456', amount: 82000, status: 'overdue', date: 'May 02, 2026' },
    { id: 'INV-2026-004', name: 'Vaishnavi Enterpr.', phone: '8123456789', amount: 120000, status: 'overdue', date: 'Apr 18, 2026' },
    { id: 'INV-2026-005', name: 'Tirumala Logistics', phone: '9876543210', amount: 95000, status: 'overdue', date: 'Mar 25, 2026' }
  ]);
  const [showInvoicePreview, setShowInvoicePreview] = useState<any | null>(null);

  // Chaser Modal States
  const [chaserInvoice, setChaserInvoice] = useState<any | null>(null);
  const [chaserStage, setChaserStage] = useState<1 | 2 | 3>(1);
  const [teluguToggle, setTeluguToggle] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [samadhaanMode, setSamadhaanMode] = useState<boolean>(false);

  // Helper: Get days elapsed since invoice date relative to May 22, 2026
  const getDaysOverdue = (dateStr: string) => {
    try {
      const today = new Date('2026-05-22');
      const cleaned = dateStr.replace(/,/g, '');
      const invoiceDate = new Date(cleaned);
      if (isNaN(invoiceDate.getTime())) return 0;
      const diffTime = today.getTime() - invoiceDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch (e) {
      return 0;
    }
  };

  // Helper: MSME Samadhaan interest calculation (3x RBI compounding monthly)
  const calculateSamadhaanInterest = (principal: number, days: number) => {
    if (days <= 0) return { interest: 0, total: principal };
    const annualRate = 0.2025; // 20.25% (3x 6.75%)
    const monthlyRate = annualRate / 12;
    const months = days / 30; // standard month approximation
    const total = principal * Math.pow(1 + monthlyRate, months);
    const interest = total - principal;
    return {
      interest: Math.round(interest),
      total: Math.round(total)
    };
  };

  // Helper: Get structured notification message text
  const getChaserMessage = (invoice: any, stage: number, isTelugu: boolean) => {
    if (!invoice) return '';
    const days = getDaysOverdue(invoice.date);
    const { interest, total } = calculateSamadhaanInterest(invoice.amount, days);
    
    if (stage === 1) {
      if (isTelugu) {
        return `ప్రియమైన ${invoice.name} గారికి,\n\nమీ ఇన్వాయిస్ ${invoice.id} (తేదీ: ${invoice.date}) కి సంబంధించిన ₹${invoice.amount.toLocaleString()} చెల్లింపు ఇంకా పెండింగ్‌లో ఉందని తెలియజేయడానికి ఈ చిన్న రిమైండర్.\n\nదయచేసి ఈ క్రింది సెక్యూర్ డిజిటల్ పేమెంట్ లింక్ ఉపయోగించి వీలైనంత త్వరగా చెల్లించవలసిందిగా కోరుతున్నాము:\nhttps://pay.bizos.in/${invoice.id}\n\nధన్యవాదాలు,\nశ్రీ లక్ష్మి ఎంటర్ప్రైజెస్`;
      }
      return `Dear ${invoice.name},\n\nThis is a friendly reminder that payment of ₹${invoice.amount.toLocaleString()} for Invoice ${invoice.id} (dated ${invoice.date}) is outstanding.\n\nKindly clear this at your earliest convenience using our secure digital payment link:\nhttps://pay.bizos.in/${invoice.id}\n\nThank you,\nSri Lakshmi Enterprises`;
    }
    
    if (stage === 2) {
      if (isTelugu) {
        return `ప్రియమైన ${invoice.name} గారికి,\n\nమీ ఇన్వాయిస్ ${invoice.id} మొత్తం ₹${invoice.amount.toLocaleString()} చెల్లింపు గడువు ముగిసి ${days} రోజులు అవుతోంది.\n\nశ్రీ లక్ష్మి ఎంటర్ప్రైజెస్ MSME కింద నమోదైన సంస్థ అని దయచేసి గమనించగలరు. MSMED చట్టం 2006 (సెక్షన్ 15) ప్రకారం, వస్తువులు/సేవలు అందుకున్న 45 రోజులలోపు చెల్లింపులు పూర్తి చేయాలి. ఆలస్యమైతే సెక్షన్ 16 కింద RBI బ్యాంక్ రేటుకు 3 రెట్లు కాంపౌండ్ వడ్డీ (ప్రస్తుతం ఏడాదికి 20.25%) అదనంగా చెల్లించాల్సి ఉంటుంది.\n\nవడ్డీ పెనాల్టీలు మరియు MSME సమాధాన్ పోర్టల్‌లో చట్టపరమైన చర్యలను నివారించడానికి, దయచేసి ఈ క్రింది లింక్ ద్వారా వెంటనే చెల్లించండి:\nhttps://pay.bizos.in/${invoice.id}\n\nభవదీయుడు,\nశ్రీ లక్ష్మి ఎంటర్ప్రైజెస్`;
      }
      return `Dear ${invoice.name},\n\nWe would like to draw your attention to Invoice ${invoice.id} for ₹${invoice.amount.toLocaleString()}, which is now overdue by ${days} days.\n\nPlease note that Sri Lakshmi Enterprises is a registered MSME. Under Section 15 of the MSME Development Act, 2006, payments must be settled within 45 days. Delayed payment legally attracts compound interest at 3 times the RBI Bank Rate (currently 20.25% per annum) under Section 16.\n\nTo avoid penalty interest and legal escalation on the MSME Samadhaan portal, please clear the outstanding amount immediately:\nhttps://pay.bizos.in/${invoice.id}\n\nRegards,\nSri Lakshmi Enterprises`;
    }

    // Stage 3 Legal Demand Notice
    if (isTelugu) {
      return `MSMED చట్టం 2006 కింద చట్టపరమైన డిమాండ్ నోటీసు (సారాంశం)\n\nతేదీ: మే 22, 2026\n\nగ్రహీత:\n${invoice.name}\n\nపంపినవారు:\nశ్రీ లక్ష్మి ఎంటర్ప్రైజెస్\nGSTIN: 37AAAAA0000A1Z2\nUdyam Reg No: UDYAM-AP-01-0012345\n\nవిషయం: బాకీ ఉన్న ₹${invoice.amount.toLocaleString()} మరియు దానికి వర్తించే పెనాల్టీ వడ్డీ ₹${interest.toLocaleString()} చెల్లింపు కొరకు డిమాండ్.\n\nగౌరవనీయులైన సర్/మేడమ్,\n\nమీరు అందుకున్న వస్తువులు/సేవలకు సంబంధించిన ఇన్వాయిస్ ${invoice.id} (తేదీ: ${invoice.date}) మొత్తం ₹${invoice.amount.toLocaleString()} ఇప్పటికీ చెల్లించకుండా ${days} రోజులు ఆలస్యం చేశారు. ఇది MSME చట్టం 2006 (సెక్షన్ 15) నిర్దేశించిన 45 రోజుల పరిమితిని దాటిపోయింది.\n\nదీనివలన సెక్షన్ 16 ప్రకారం, మీరు అసలు మొత్తంతో పాటు RBI బ్యాంక్ రేటుకు 3 రెట్లు (ప్రస్తుతం 20.25%) చొప్పున కాంపౌండ్ వడ్డీతో కలిపి మొత్తం ₹${total.toLocaleString()} చెల్లించవలసి ఉంటుంది.\n\nఈ నోటీసు అందిన 15 రోజులలోపు సదరు మొత్తాన్ని చెల్లించని యెడల, మేము MSME సమాధాన్ కౌన్సిల్ (MSEFC) లో మీపై కేసు నమోదు చేస్తాము. దీనికి అయ్యే చట్టపరమైన ఖర్చులు కూడా మీరే భరించాల్సి ఉంటుంది.\n\nభవదీయుడు,\nశ్రీ లక్ష్మి ఎంటర్ప్రైజెస్ తరపున`;
    }
    return `FORMAL DEMAND NOTICE UNDER SECTION 15 & 16 OF THE MSMED ACT, 2006\n\nDate: May 22, 2026\n\nTo:\n${invoice.name}\nPhone: +91 ${invoice.phone}\n\nFrom:\nSri Lakshmi Enterprises\nGSTIN: 37AAAAA0000A1Z2\nUdyam Reg No: UDYAM-AP-01-0012345\n\nSUBJECT: DEMAND FOR PAYMENT OF OUTSTANDING RECEIVABLES OF ₹${invoice.amount.toLocaleString()} AND ACCRUED PENAL INTEREST OF ₹${interest.toLocaleString()} UNDER THE MICRO, SMALL AND MEDIUM ENTERPRISES DEVELOPMENT ACT, 2006\n\nDear Sir/Madam,\n\nThis formal notice is served upon you regarding Invoice No. ${invoice.id} dated ${invoice.date} for the value of ₹${invoice.amount.toLocaleString()} for goods/services delivered and accepted by you.\n\nDespite multiple reminders, the amount remains unpaid for ${days} days from the delivery date, which exceeds the mandatory 45-day statutory limit specified under Section 15 of the MSME Development Act, 2006.\n\nTake Notice that under Section 16 of the MSMED Act, 2006, you are legally liable to pay compound interest with monthly rests on the principal amount from the appointed day at three times (3x) the Bank Rate notified by the Reserve Bank of India.\n\nFinancial Computation:\n- Principal Invoice Amount: ₹${invoice.amount.toLocaleString()}\n- Appointed Due Date: 45 days from ${invoice.date}\n- Days Overdue: ${days} days\n- Annual Interest Rate Applicable: 20.25% (3x RBI Bank Rate of 6.75%)\n- Accrued Penalty Interest: ₹${interest.toLocaleString()}\n- TOTAL LEGAL CLAIM AMOUNT: ₹${total.toLocaleString()}\n\nYou are hereby directed to clear the total sum of ₹${total.toLocaleString()} within fifteen (15) days of receipt of this notice, failing which we shall file an official dispute before the Micro & Small Enterprises Facilitation Council (MSEFC) under the MSME Samadhaan scheme for recovery. You shall also be liable for all litigation and facilitation costs.\n\nYours faithfully,\nFor Sri Lakshmi Enterprises\n(Authorized Signatory)`;
  };

  // Helper: Get MSME Samadhaan Case File upload details
  const getSamadhaanCaseFile = (invoice: any) => {
    if (!invoice) return '';
    const days = getDaysOverdue(invoice.date);
    const { interest, total } = calculateSamadhaanInterest(invoice.amount, days);
    return `{
  "portal_dispute_details": {
    "case_type": "MSEFC_DISPUTE_FILING",
    "petitioner": {
      "name": "Sri Lakshmi Enterprises",
      "udyam_registration_number": "UDYAM-AP-01-0012345",
      "category": "Micro Enterprise",
      "state": "Andhra Pradesh",
      "mobile": "9948011223"
    },
    "respondent": {
      "company_name": "${invoice.name}",
      "mobile": "${invoice.phone}",
      "state_region": "India"
    },
    "financials": {
      "invoice_id": "${invoice.id}",
      "invoice_date": "${invoice.date}",
      "principal_amount_inr": ${invoice.amount},
      "days_overdue": ${days},
      "compounded_interest_accrued_inr": ${interest},
      "total_claim_amount_inr": ${total},
      "rbi_notified_bank_rate": "6.75% p.a.",
      "penalty_rate_applied": "20.25% p.a. (3x RBI)"
    },
    "statutory_declaration": "I declare that the goods/services supplied under Invoice ${invoice.id} were accepted and no dispute has been raised. Payment exceeds the 45 days limit under Section 15 of MSMED Act, 2006."
  }
}`;
  };

  // Invoice calculations
  const calculateTotal = (invoiceItems: InvoiceItem[]) => {
    let subtotal = 0;
    let gstTotal = 0;
    invoiceItems.forEach(item => {
      const itemSub = item.qty * item.rate;
      const itemGst = itemSub * (item.gstRate / 100);
      subtotal += itemSub;
      gstTotal += itemGst;
    });
    return {
      subtotal,
      gstTotal,
      grandTotal: subtotal + gstTotal
    };
  };

  const handleAddItem = () => {
    setItems([...items, { desc: '', qty: 1, rate: 0, gstRate: 18 }]);
  };

  const handleUpdateItem = (index: number, key: keyof InvoiceItem, val: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [key]: val };
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const { grandTotal } = calculateTotal(items);
    const newInv = {
      id: `INV-2026-00${invoices.length + 1}`,
      name: clientName || 'Retail Customer',
      phone: clientPhone || '9999999999',
      amount: grandTotal,
      status: 'pending',
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      items: [...items]
    };
    setInvoices([newInv, ...invoices]);
    setShowInvoicePreview(newInv);
    // Clear inputs
    setClientName('');
    setClientPhone('');
    setItems([{ desc: '', qty: 1, rate: 0, gstRate: 18 }]);
  };

  const handleTriggerReminder = (invoice: any) => {
    // Open chaser directly
    setChaserInvoice(invoice);
    setChaserStage(1);
    setTeluguToggle(false);
    setSamadhaanMode(false);
    setCopiedText(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 px-4">
      
      {/* Header and Toggle Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            💰 Financial & Billing Desk
          </h1>
          <p className="text-slate-500 font-medium mt-1 max-w-2xl text-xs uppercase tracking-widest">
            Capital Management & AI Invoicing (BizzBook) on a single platform.
          </p>
        </div>

        {/* Sub-tab Toggles */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveSubTab('capital')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${activeSubTab === 'capital' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Capital & Banking
          </button>
          <button
            onClick={() => setActiveSubTab('bizzbook')}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${activeSubTab === 'bizzbook' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            AI BizzBook Invoicing
          </button>
        </div>
      </div>

      {activeSubTab === 'capital' ? (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="rounded-[2.5rem] p-8 md:p-10 text-center shadow-lg bg-gradient-to-br from-blue-700 to-indigo-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[80px]" />
            <div className="text-4xl mb-3">🏦</div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest">Business Capital Suite</h2>
            <p className="text-blue-100 text-xs md:text-sm max-w-sm mx-auto font-medium leading-relaxed mt-1 italic">
              Access digital current accounts, low-interest Mudra loans, and verified banking guidance.
            </p>
          </div>

          {/* 3 Big Service Cards */}
          {BANK_FEATURES.map((f, i) => (
            <div key={i} className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left mb-4">
                <div className="text-4xl md:text-5xl drop-shadow-sm">{f.emoji}</div>
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tight">{f.title}</h3>
                      <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{f.sub}</p>
                    </div>
                    <span className="text-[9px] font-black px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 whitespace-nowrap uppercase tracking-widest shrink-0">
                      {f.tag.split(' ').slice(1).join(' ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pb-4">
                <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed italic text-center sm:text-left">{f.desc}</p>
              </div>

              {/* Simple Steps */}
              <div className="pb-5">
                <p className="text-[9px] font-black text-slate-350 uppercase tracking-[0.2em] mb-3 text-center sm:text-left">Workflow Sequence</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {f.steps.map((step, si) => (
                    <div key={si} className="flex flex-col gap-2 p-3 bg-slate-50/50 rounded-2xl border border-slate-100/50 hover:bg-white hover:border-blue-100 transition-all justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black flex-shrink-0 shadow-md">{si + 1}</span>
                        <p className="text-[11px] text-slate-700 font-semibold leading-snug">{step}</p>
                      </div>
                      {step.includes('GST') && (
                        <div className="flex flex-wrap items-center gap-1.5 pl-8 mt-1">
                          <span className="text-[9px] text-slate-400 font-bold">No GST/Company?</span>
                          <LegalServiceTrigger serviceKey="gst" label="Get GST" />
                          <LegalServiceTrigger serviceKey="incorporation" label="Get Pvt Ltd" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Partners */}
              {f.partners.length > 0 && (
                <div className="pb-6">
                  <p className="text-[9px] font-black text-slate-350 uppercase tracking-[0.2em] mb-2 text-center sm:text-left">Integrated Partners</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    {f.partners.map(p => (
                      <span key={p} className="text-[9px] font-black px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 border border-slate-100 uppercase tracking-tighter">{p}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <div>
                {booked === i ? (
                  <div className="py-4 rounded-2xl text-center text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-widest">
                    ✅ Request Synced! Contact in 2 hours.
                  </div>
                ) : (
                  <button
                    onClick={() => setBooked(i)}
                    className="w-full py-4 rounded-2xl text-[10px] font-black text-white transition-all shadow-xl hover:scale-[1.01] uppercase tracking-[0.2em]"
                    style={{ background: f.ctaColor }}
                  >
                    {f.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (() => {
        const outstandingInvoices = invoices.filter(inv => inv.status !== 'paid');
        let totalOutstanding = 0;
        let bucket1 = 0; // 0-30 days
        let bucket2 = 0; // 30-45 days
        let bucket3 = 0; // 45+ days

        outstandingInvoices.forEach(inv => {
          const days = getDaysOverdue(inv.date);
          totalOutstanding += inv.amount;
          if (days <= 30) {
            bucket1 += inv.amount;
          } else if (days <= 45) {
            bucket2 += inv.amount;
          } else {
            bucket3 += inv.amount;
          }
        });

        return (
          /* AI BizzBook Invoicing tab */
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Aging Tracker cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Outstanding</p>
                    <h3 className="text-xl font-black text-slate-900 mt-1">₹{totalOutstanding.toLocaleString()}</h3>
                  </div>
                  <span className="p-2 bg-indigo-50 rounded-xl text-indigo-600 text-lg font-bold">💰</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-2">Across {outstandingInvoices.length} unpaid invoices</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">0 - 30 Days (Current)</p>
                    <h3 className="text-xl font-black text-slate-900 mt-1">₹{bucket1.toLocaleString()}</h3>
                  </div>
                  <span className="p-2 bg-emerald-50 rounded-xl text-emerald-600 text-lg font-bold">🟢</span>
                </div>
                <p className="text-[10px] text-emerald-600 font-bold mt-2">Safe • Standard credit period</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">30 - 45 Days (Warning)</p>
                    <h3 className="text-xl font-black text-slate-900 mt-1">₹{bucket2.toLocaleString()}</h3>
                  </div>
                  <span className="p-2 bg-amber-50 rounded-xl text-amber-600 text-lg font-bold">⚠️</span>
                </div>
                <p className="text-[10px] text-amber-600 font-bold mt-2">Escalate • Near 45d legal limit</p>
              </div>

              <div className="bg-red-50/50 rounded-2xl border border-red-200 p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">45+ Days (Critical)</p>
                    <h3 className="text-xl font-black text-red-950 mt-1">₹{bucket3.toLocaleString()}</h3>
                  </div>
                  <span className="p-2 bg-red-100 text-red-600 rounded-xl text-lg font-bold">🚨</span>
                </div>
                <p className="text-[9px] text-red-700 font-bold mt-2 uppercase tracking-tighter">
                  ⚡ MSMED Sec 16 3x RBI interest active
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* left column: Invoice form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-fit space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-indigo-600">receipt_long</span>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Quick Invoicer</h3>
            </div>
            
            <form onSubmit={handleSaveInvoice} className="space-y-4">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer / Trade Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Durga General Stores"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer Phone (WhatsApp Collection)</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 994801XXXX"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                />
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bill Items</span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1"
                  >
                    + Add Item
                  </button>
                </div>

                {items.map((item, idx) => (
                  <div key={idx} className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-100 relative">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500 text-xs"
                      >
                        ✕
                      </button>
                    )}
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Item Description"
                        value={item.desc}
                        onChange={(e) => handleUpdateItem(idx, 'desc', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Qty</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={item.qty}
                          onChange={(e) => handleUpdateItem(idx, 'qty', parseInt(e.target.value) || 1)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-850"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Rate (₹)</label>
                        <input
                          type="number"
                          required
                          value={item.rate}
                          onChange={(e) => handleUpdateItem(idx, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-850"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">GST (%)</label>
                        <select
                          value={item.gstRate}
                          onChange={(e) => handleUpdateItem(idx, 'gstRate', parseInt(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-850"
                        >
                          <option value="18">18%</option>
                          <option value="12">12%</option>
                          <option value="5">5%</option>
                          <option value="0">0%</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/50 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-bold">₹{calculateTotal(items).subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>CGST & SGST:</span>
                  <span className="font-bold">₹{calculateTotal(items).gstTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-900 border-t border-slate-200 pt-2 font-black text-sm">
                  <span>Grand Total:</span>
                  <span>₹{calculateTotal(items).grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
              >
                Generate GST Invoice
              </button>
            </form>
          </div>
          
          {/* right column: Ledgers & Invoices table */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Invoice preview modal (if recently generated) */}
            {showInvoicePreview && (
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl text-white shadow-xl relative animate-in zoom-in-95">
                <button
                  onClick={() => setShowInvoicePreview(null)}
                  className="absolute top-4 right-4 text-white/50 hover:text-white"
                >
                  ✕
                </button>
                <div>
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[8px] font-black uppercase tracking-widest rounded border border-indigo-500/30">Invoice Preview</span>
                  <h4 className="text-lg font-black mt-2 leading-none">{showInvoicePreview.id}</h4>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Sri Lakshmi Enterprises</p>
                </div>
                
                <div className="mt-5 space-y-3 text-xs border-y border-white/10 py-4 my-4">
                  <div className="flex justify-between"><span className="opacity-60">Client:</span> <span className="font-bold">{showInvoicePreview.name}</span></div>
                  <div className="flex justify-between"><span className="opacity-60">WhatsApp No:</span> <span className="font-bold">+91 {showInvoicePreview.phone}</span></div>
                  <div className="flex justify-between"><span className="opacity-60">Issued Date:</span> <span className="font-bold">{showInvoicePreview.date}</span></div>
                  <div className="flex justify-between border-t border-white/5 pt-2 text-sm font-black"><span className="text-indigo-300">Total Payable:</span> <span>₹{showInvoicePreview.amount.toLocaleString()}</span></div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleTriggerReminder(showInvoicePreview)}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all"
                  >
                    Send Invoice on WhatsApp
                  </button>
                  <button
                    onClick={() => setShowInvoicePreview(null)}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/10 font-black text-xs uppercase tracking-wider rounded-xl transition-all"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            )}

            {/* Receivables Ledger */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Receivables & Sales Ledger</h3>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Powered by Arkle Brain</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="pb-3">Invoice</th>
                      <th className="pb-3">Client</th>
                      <th className="pb-3">Amount (₹)</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Autopilot Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-slate-700">
                    {invoices.map((inv, idx) => (
                      <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 font-mono text-slate-400">{inv.id}</td>
                        <td className="py-3.5 text-slate-900">{inv.name}</td>
                        <td className="py-3.5 font-black text-slate-800">₹{inv.amount.toLocaleString()}</td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-md ${
                            inv.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            inv.status === 'overdue' ? 'bg-red-50 text-red-600 border border-red-100' :
                            inv.status === 'reminded' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                            'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          {inv.status === 'paid' ? (
                            <span className="text-[10px] text-slate-350 font-black uppercase tracking-widest">Reconciled</span>
                          ) : (
                            <button
                              onClick={() => handleTriggerReminder(inv)}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white font-black text-[9px] uppercase tracking-wider rounded-lg transition-colors"
                            >
                              {inv.status === 'reminded' ? 'Remind Again' : 'Collect Auto'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
    })()}

    {/* Chaser Modal */}
    {chaserInvoice && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200 text-left">
          
          {/* Modal Header */}
          <div className="p-6 bg-slate-950 text-white flex justify-between items-start">
            <div>
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[8px] font-black uppercase tracking-widest rounded border border-indigo-500/30">
                Arkle Receivables Recovery Autopilot
              </span>
              <h3 className="text-lg font-black mt-2 flex items-center gap-2">
                <span>Collection Chaser: {chaserInvoice.id}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                  getDaysOverdue(chaserInvoice.date) > 45 ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-955'
                }`}>
                  {getDaysOverdue(chaserInvoice.date)} Days Overdue
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                Customer: {chaserInvoice.name} • Phone: +91 {chaserInvoice.phone}
              </p>
            </div>
            <button 
              onClick={() => {
                setChaserInvoice(null);
                setSamadhaanMode(false);
                setCopiedText(false);
              }} 
              className="text-slate-400 hover:text-white font-bold transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Modal Navigation */}
          <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2">
            <button
              onClick={() => { setChaserStage(1); setSamadhaanMode(false); setCopiedText(false); }}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${chaserStage === 1 && !samadhaanMode ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Stage 1: Friendly
            </button>
            <button
              onClick={() => { setChaserStage(2); setSamadhaanMode(false); setCopiedText(false); }}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${chaserStage === 2 && !samadhaanMode ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Stage 2: MSME Firm
            </button>
            <button
              onClick={() => { setChaserStage(3); setSamadhaanMode(false); setCopiedText(false); }}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${chaserStage === 3 && !samadhaanMode ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Stage 3: Legal Notice
            </button>
            <button
              onClick={() => { setSamadhaanMode(true); setCopiedText(false); }}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${samadhaanMode ? 'bg-red-50 text-red-700 border border-red-200 shadow-sm font-black' : 'text-red-500 hover:bg-red-50/50'}`}
            >
              MSME Samadhaan File
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {!samadhaanMode ? (
              <>
                {/* Language Selector */}
                <div className="flex justify-between items-center bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    🌐 Translation Active
                  </span>
                  <button
                    onClick={() => { setTeluguToggle(!teluguToggle); setCopiedText(false); }}
                    className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg border transition-all ${
                      teluguToggle 
                        ? 'bg-indigo-600 text-white border-indigo-700' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {teluguToggle ? 'Telugu (తెలుగు) Active' : 'Switch to Telugu (తెలుగు)'}
                  </button>
                </div>

                {/* Message Preview Box */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {chaserStage === 3 ? 'Document Preview' : 'WhatsApp/SMS Preview'}
                    </label>
                    <span className="text-[9px] text-slate-400 font-bold">
                      {chaserStage === 1 ? 'WhatsApp Template (Auto-sync)' : chaserStage === 2 ? 'MSMED Sec 15 Warning' : 'Legal Demand Notice Letter'}
                    </span>
                  </div>

                  <div className={`p-4 rounded-2xl border text-xs font-medium leading-relaxed whitespace-pre-wrap font-mono ${
                    chaserStage === 3 
                      ? 'bg-slate-50 border-slate-200 text-slate-850' 
                      : 'bg-emerald-50/30 border-emerald-100 text-slate-850'
                  }`}>
                    {getChaserMessage(chaserInvoice, chaserStage, teluguToggle)}
                  </div>
                </div>

                {/* Quick Action Info */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                  <span className="text-lg">💡</span>
                  <div className="text-[11px] text-slate-500 leading-normal font-medium">
                    {chaserStage === 1 && "This is a friendly reminder. It is recommended for invoices overdue by less than 30 days."}
                    {chaserStage === 2 && "This notice officially cites the MSMED Act 2006. Under Section 15, the buyer is liable to pay compound interest if payment exceeds 45 days."}
                    {chaserStage === 3 && "This is a formal legal demand notice. If the buyer does not pay within 15 days of this notice, you can directly file a dispute on the MSME Samadhaan portal."}
                  </div>
                </div>
              </>
            ) : (
              /* Samadhaan Mode */
              <div className="space-y-6">
                {/* Calculation Box */}
                <div className="bg-red-50/50 border border-red-200 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-red-200/50 pb-2">
                    <span className="text-lg">🚨</span>
                    <h4 className="text-xs font-black text-red-950 uppercase tracking-wider">
                      MSME Samadhaan Legal Calculation
                    </h4>
                  </div>

                  {(() => {
                    const age = getDaysOverdue(chaserInvoice.date);
                    const { interest, total } = calculateSamadhaanInterest(chaserInvoice.amount, age);
                    return (
                      <div className="grid grid-cols-2 gap-4 text-xs font-bold text-left">
                        <div className="space-y-2">
                          <p className="text-slate-500 font-semibold">Principal Invoice Amount:</p>
                          <p className="text-base text-slate-900 font-black">₹{chaserInvoice.amount.toLocaleString()}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-slate-500 font-semibold">Days Overdue (Appointed Day):</p>
                          <p className="text-base text-slate-900 font-black">{age} Days</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-slate-500 font-semibold">Interest Rate (3x RBI Bank Rate):</p>
                          <p className="text-base text-red-600 font-black">20.25% p.a. <span className="text-[10px] text-slate-400 font-medium">(RBI: 6.75%)</span></p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-slate-500 font-semibold">Legally Accrued Interest:</p>
                          <p className="text-base text-red-600 font-black">₹{interest.toLocaleString()}</p>
                        </div>
                        <div className="col-span-2 pt-3 border-t border-red-200/50 flex justify-between items-center">
                          <span className="text-sm font-black text-slate-900">Total Legal Claim Amount:</span>
                          <span className="text-lg font-black text-red-700">₹{total.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Case File Preview */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                    Generated Samadhaan Portal Upload JSON/Fields
                  </label>
                  <div className="p-4 bg-slate-950 text-slate-200 rounded-2xl font-mono text-[10px] leading-relaxed overflow-x-auto whitespace-pre">
                    {getSamadhaanCaseFile(chaserInvoice)}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/50 flex items-start gap-3">
                  <span className="text-lg">⚠️</span>
                  <div className="text-[11px] text-amber-900 leading-normal font-semibold">
                    Under Section 16 of the MSMED Act, the buyer MUST pay compound interest with monthly rests. This case file is pre-formatted to directly copy and upload to MSME Samadhaan.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Actions Footer */}
          <div className="p-6 border-t border-slate-150 bg-slate-50 flex gap-3">
            {samadhaanMode ? (
              <>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getSamadhaanCaseFile(chaserInvoice));
                    setCopiedText(true);
                    setTimeout(() => setCopiedText(false), 2000);
                  }}
                  className="flex-1 py-3.5 bg-red-700 hover:bg-red-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  <span>{copiedText ? 'Copied Case File!' : 'Copy Portal Details'}</span>
                </button>
                <button
                  onClick={() => {
                    setSamadhaanMode(false);
                    setChaserStage(3);
                  }}
                  className="px-6 py-3.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 font-black text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Back to Notice
                </button>
              </>
            ) : (
              <>
                {chaserStage === 3 ? (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(getChaserMessage(chaserInvoice, chaserStage, teluguToggle));
                      setCopiedText(true);
                      setTimeout(() => setCopiedText(false), 2000);
                    }}
                    className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    <span>{copiedText ? 'Copied Legal Notice!' : 'Copy Legal Notice Text'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const message = getChaserMessage(chaserInvoice, chaserStage, teluguToggle);
                      alert(`Arkle Autopilot WhatsApp Triggered!\n\nTo: +91 ${chaserInvoice.phone}\nMessage:\n"${message}"`);
                      
                      // Set status to pending/overdue/reminded
                      const updated = invoices.map(inv => {
                        if (inv.id === chaserInvoice.id) {
                          return { ...inv, status: 'reminded' };
                        }
                        return inv;
                      });
                      setInvoices(updated);
                      setChaserInvoice(null);
                    }}
                    className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">send</span>
                    <span>Send via WhatsApp Autopilot</span>
                  </button>
                )}
                <button
                  onClick={() => setChaserInvoice(null)}
                  className="px-6 py-3.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 font-black text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
);
}
