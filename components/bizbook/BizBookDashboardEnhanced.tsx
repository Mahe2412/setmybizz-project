'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  Home, FileText, Box, Users, MoreHorizontal, CreditCard, BarChart3, ShieldCheck, TrendingUp, CheckCircle2, Plus, Printer,
  RefreshCcw, Save, Search, Trash2, Upload, Wand2, Zap, Brain, AlertCircle, CheckCheck, MessageSquare, Camera, Download,
  TrendingDown, Calendar, Clock, Target, Lightbulb
} from 'lucide-react';
import { bizBookAI, BusinessInsight, PaymentReminder } from '@/lib/bizbook/aiService';

type Party = {
  id: string;
  name: string;
  phone?: string | null;
  state?: string | null;
  gstin?: string | null;
};

type Item = {
  id: string;
  name: string;
  sale_price: number;
  tax_percent: number;
  unit?: string | null;
  hsn?: string | null;
  stock?: number | null;
};

type Business = {
  id: string;
  name: string;
  invoice_prefix?: string | null;
  next_invoice_no?: number | null;
  state?: string | null;
  gstin?: string | null;
  address?: string | null;
};

type Transaction = {
  id: string;
  number: string;
  txn_date: string;
  total: number;
  subtotal: number;
  tax_total: number;
  balance: number;
  status: 'draft' | 'unpaid' | 'partial' | 'paid' | 'cancelled';
  party_id?: string | null;
  parties?: Party | Party[] | null;
};

type Line = {
  id: string;
  item_id?: string;
  name: string;
  hsn?: string;
  qty: number;
  price: number;
  tax_percent: number;
  discount_percent: number;
  unit?: string;
};

type Expense = {
  id: string;
  date: string;
  category: string;
  note: string;
  amount: number;
};

const emptyLine = (): Line => ({
  id: crypto.randomUUID(),
  name: '',
  qty: 1,
  price: 0,
  tax_percent: 0,
  discount_percent: 0,
});

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number.isFinite(value) ? value : 0);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(value));

type BizBookDashboardProps = {
  /** Render inside BizOS without full-page chrome */
  embedded?: boolean;
  productName?: string;
};

const BizBookDashboardEnhanced = ({
  embedded = false,
  productName = 'BizBook',
}: BizBookDashboardProps) => {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [tab, setTab] = useState<'home' | 'invoice' | 'items' | 'parties' | 'expenses' | 'reports' | 'insights' | 'ai'>('home');
  const [business, setBusiness] = useState<Business | null>(null);
  const [parties, setParties] = useState<Party[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [partyId, setPartyId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('Thank you for your business.');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [paidAmount, setPaidAmount] = useState(0);
  const [expenseCategory, setExpenseCategory] = useState('Office');
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [expenseNote, setExpenseNote] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(0);
  const [newItemTaxPercent, setNewItemTaxPercent] = useState(18);
  const [newItemStock, setNewItemStock] = useState(0);
  const [newItemHsn, setNewItemHsn] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('pcs');
  const [newPartyName, setNewPartyName] = useState('');
  const [newPartyPhone, setNewPartyPhone] = useState('');
  const [newPartyState, setNewPartyState] = useState('');
  const [newPartyGstin, setNewPartyGstin] = useState('');
  const [lines, setLines] = useState<Line[]>([emptyLine()]);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [reminders, setReminders] = useState<PaymentReminder[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const invoicePrefix = business?.invoice_prefix || 'INV';
  const nextInvoiceNo = business?.next_invoice_no || 1;
  const generatedNumber = invoiceNumber.trim() || `${invoicePrefix}-${String(nextInvoiceNo).padStart(4, '0')}`;
  const expenseStorageKey = userId ? `bizbook_expenses_${userId}` : 'bizbook_expenses_guest';

  const selectedParty = parties.find((p) => p.id === partyId) || null;
  const isInterstate = !!business?.state && !!selectedParty?.state && business.state !== selectedParty.state;

  useEffect(() => {
    if (!userId) return;
    try {
      const saved = window.localStorage.getItem(expenseStorageKey);
      if (saved) {
        setExpenses(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Could not load saved expenses', error);
    }
  }, [userId, expenseStorageKey]);

  useEffect(() => {
    if (!userId) return;
    window.localStorage.setItem(expenseStorageKey, JSON.stringify(expenses));
  }, [expenses, userId, expenseStorageKey]);

  const outstandingReceivables = useMemo(
    () => transactions.reduce((sum, txn) => sum + Number(txn.balance || 0), 0),
    [transactions]
  );

  const salesTotal = useMemo(
    () => transactions.reduce((sum, txn) => sum + Number(txn.total || 0), 0),
    [transactions]
  );

  const gstCollected = useMemo(
    () => transactions.reduce((sum, txn) => sum + Number(txn.tax_total || 0), 0),
    [transactions]
  );

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  );

  const lowStockCount = useMemo(
    () => items.filter((item) => (item.stock ?? 0) > 0 && item.stock <= 5).length,
    [items]
  );

  const overdueInvoices = useMemo(
    () => transactions.filter((txn) => txn.status === 'unpaid' || txn.status === 'partial').length,
    [transactions]
  );

  const profitMargin = useMemo(() => {
    if (salesTotal === 0) return 0;
    return ((salesTotal - totalExpenses) / salesTotal) * 100;
  }, [salesTotal, totalExpenses]);

  const summary = useMemo(() => {
    let subtotal = 0;
    let gst = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    for (const line of lines) {
      if (!line.name.trim()) continue;
      const base = Math.max(0, line.qty || 0) * Math.max(0, line.price || 0);
      const discounted = base - (base * Math.max(0, line.discount_percent || 0)) / 100;
      const tax = (discounted * Math.max(0, line.tax_percent || 0)) / 100;
      subtotal += discounted;
      gst += tax;
      if (isInterstate) igst += tax;
      else {
        cgst += tax / 2;
        sgst += tax / 2;
      }
    }

    return {
      subtotal,
      gst,
      cgst,
      sgst,
      igst,
      total: subtotal + gst,
    };
  }, [lines, isInterstate]);

  const filteredTransactions = useMemo(() => {
    const q = search.toLowerCase().trim();
    return transactions.filter((txn) => {
      const partyName = Array.isArray(txn.parties) ? txn.parties?.[0]?.name : txn.parties?.name;
      const haystack = `${txn.number} ${partyName || ''} ${txn.status}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [search, transactions]);

  const quickActions = [
    { id: 'invoice', label: 'New invoice', icon: FileText, description: 'Create GST-ready bills' },
    { id: 'items', label: 'Product master', icon: Box, description: 'Catalog products and stock' },
    { id: 'parties', label: 'Customer ledger', icon: Users, description: 'Track parties and receivables' },
    { id: 'expenses', label: 'Expense tracker', icon: CreditCard, description: 'Log business spend' },
  ];

  const loadData = React.useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [businessRes, partyRes, itemRes, txnRes] = await Promise.all([
        supabase.from('businesses').select('*').eq('user_id', userId).maybeSingle(),
        supabase.from('parties').select('*').eq('user_id', userId).order('name', { ascending: true }),
        supabase.from('items').select('*').eq('user_id', userId).order('name', { ascending: true }),
        supabase
          .from('transactions')
          .select('id, number, txn_date, total, subtotal, tax_total, balance, status, party_id, parties(name, phone, state, gstin)')
          .eq('user_id', userId)
          .eq('type', 'sale_invoice')
          .order('txn_date', { ascending: false })
          .limit(12),
      ]);

      if (businessRes.error) throw businessRes.error;
      if (partyRes.error) throw partyRes.error;
      if (itemRes.error) throw itemRes.error;
      if (txnRes.error) throw txnRes.error;

      setBusiness((businessRes.data as Business) || null);
      setParties((partyRes.data as Party[]) || []);
      setItems((itemRes.data as Item[]) || []);
      setTransactions((txnRes.data as Transaction[]) || []);
      setMessage('');
    } catch (err: any) {
      setMessage(err?.message || 'Could not load BizBook data');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const generateInsights = async () => {
    setAiLoading(true);
    try {
      const newInsights = await bizBookAI.generateBusinessInsights(transactions, expenses, items);
      setInsights(newInsights);
      setMessage('✨ AI insights generated successfully!');
    } catch (error) {
      setMessage('Could not generate insights. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const generateReminders = async () => {
    setAiLoading(true);
    try {
      const newReminders = await bizBookAI.generatePaymentReminders(transactions, parties);
      setReminders(newReminders);
      setMessage(`📱 Generated ${newReminders.length} payment reminders`);
    } catch (error) {
      setMessage('Could not generate reminders. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const updateLine = (id: string, patch: Partial<Line>) => {
    setLines((current) => current.map((line) => (line.id === id ? { ...line, ...patch } : line)));
  };

  const pickItem = (lineId: string, itemId: string) => {
    const item = items.find((x) => x.id === itemId);
    if (!item) return;
    updateLine(lineId, {
      item_id: item.id,
      name: item.name,
      hsn: item.hsn || undefined,
      price: Number(item.sale_price || 0),
      tax_percent: Number(item.tax_percent || 0),
      unit: item.unit || undefined,
    });
  };

  const addLine = () => setLines((current) => [...current, emptyLine()]);
  const removeLine = (id: string) => setLines((current) => current.filter((line) => line.id !== id));

  const addExpense = () => {
    if (!expenseAmount || expenseAmount <= 0) {
      setMessage('Enter a valid expense amount.');
      return;
    }
    const expense: Expense = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      category: expenseCategory,
      note: expenseNote || 'Expense recorded',
      amount: expenseAmount,
    };
    setExpenses((current) => [expense, ...current]);
    setExpenseAmount(0);
    setExpenseNote('');
    setMessage('Expense added to BizBook.');
  };

  const createItem = async () => {
    if (!newItemName.trim()) {
      setMessage('Enter a valid item name.');
      return;
    }
    if (!userId) {
      setMessage('Please sign in to add items.');
      return;
    }

    setSaveState('saving');
    const { error } = await supabase.from('items').insert({
      user_id: userId,
      name: newItemName,
      sale_price: newItemPrice,
      tax_percent: newItemTaxPercent,
      stock: newItemStock,
      hsn: newItemHsn || null,
      unit: newItemUnit || null,
    });
    if (error) {
      setSaveState('error');
      setMessage(error.message);
      return;
    }
    setNewItemName('');
    setNewItemPrice(0);
    setNewItemTaxPercent(18);
    setNewItemStock(0);
    setNewItemHsn('');
    setNewItemUnit('pcs');
    setMessage('Item added successfully.');
    setSaveState('saved');
    await loadData();
  };

  const createParty = async () => {
    if (!newPartyName.trim()) {
      setMessage('Enter a valid customer name.');
      return;
    }
    if (!userId) {
      setMessage('Please sign in to add customers.');
      return;
    }

    setSaveState('saving');
    const { error } = await supabase.from('parties').insert({
      user_id: userId,
      name: newPartyName,
      phone: newPartyPhone || null,
      state: newPartyState || null,
      gstin: newPartyGstin || null,
    });
    if (error) {
      setSaveState('error');
      setMessage(error.message);
      return;
    }
    setNewPartyName('');
    setNewPartyPhone('');
    setNewPartyState('');
    setNewPartyGstin('');
    setMessage('Customer added successfully.');
    setSaveState('saved');
    await loadData();
  };

  const saveInvoice = async (overridePaid?: number) => {
    if (!userId) {
      setMessage('Please sign in to save invoices.');
      return;
    }
    const validLines = lines.filter((line) => line.name.trim());
    if (validLines.length === 0) {
      setMessage('Add at least one item.');
      return;
    }

    const paidValue = overridePaid !== undefined ? overridePaid : paidAmount;
    const paid = Math.min(Math.max(paidValue, 0), summary.total);
    const status = paid === 0 ? 'unpaid' : paid >= summary.total ? 'paid' : 'partial';

    setSaveState('saving');
    setMessage('');
    try {
      const { data: txn, error } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'sale_invoice',
          number: generatedNumber,
          party_id: partyId || null,
          txn_date: invoiceDate,
          notes,
          subtotal: summary.subtotal,
          tax_total: summary.gst,
          cgst_total: summary.cgst,
          sgst_total: summary.sgst,
          igst_total: summary.igst,
          total: summary.total,
          paid_amount: paid,
          balance: Math.max(summary.total - paid, 0),
          status,
          is_interstate: isInterstate,
        })
        .select()
        .single();

      if (error) throw error;

      const lineRows = validLines.map((line) => ({
        transaction_id: txn.id,
        item_id: line.item_id || null,
        name: line.name,
        hsn: line.hsn || null,
        qty: line.qty,
        unit: line.unit || null,
        price: line.price,
        discount_percent: line.discount_percent,
        tax_percent: line.tax_percent,
        amount: ((line.qty * line.price) * (1 - line.discount_percent / 100)) * (1 + line.tax_percent / 100),
      }));

      const { error: lineError } = await supabase.from('transaction_items').insert(lineRows);
      if (lineError) throw lineError;

      if (business?.id && business.next_invoice_no !== undefined) {
        await supabase.from('businesses').update({ next_invoice_no: nextInvoiceNo + 1 }).eq('id', business.id);
      }

      setSaveState('saved');
      setMessage('✅ Invoice saved successfully.');
      setInvoiceNumber('');
      setPaidAmount(0);
      setLines([emptyLine()]);
      await loadData();
    } catch (err: any) {
      setSaveState('error');
      setMessage(err?.message || 'Could not save invoice');
    }
  };

  const bgClass = darkMode
    ? 'bg-slate-950 text-white'
    : 'bg-[radial-gradient(circle_at_top,#eff6ff_0%,#f8fafc_35%,#eef2ff_100%)] text-slate-900';

  const shellClass = embedded
    ? `h-full overflow-y-auto ${bgClass}`
    : `min-h-screen ${bgClass}`;
  const containerClass = embedded
    ? 'h-full px-3 py-3 md:px-4'
    : 'mx-auto max-w-7xl px-4 py-5 md:px-6 lg:px-8';

  return (
    <div className={`${shellClass} transition-colors duration-300`}>
      <div className={containerClass}>
        <div className={`rounded-[28px] border ${darkMode ? 'border-slate-700 bg-slate-900/75' : 'border-white/70 bg-white/75'} ${embedded ? 'shadow-md' : 'shadow-[0_24px_80px_rgba(15,23,42,0.08)]'} backdrop-blur-xl overflow-hidden transition-colors duration-300`}>
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-slate-200/70 p-5 md:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-sm">
                {embedded ? '📒 BizOS' : '🚀 BizBook AI'}
              </div>
              <h1 className={`font-black tracking-tight ${embedded ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'}`}>
                {embedded ? productName : 'Business Management Hub'}
              </h1>
              <p className="text-sm text-slate-500">
                {embedded
                  ? 'GST invoices, parties, products, expenses — MyBillBook-style billing'
                  : 'AI-powered invoicing, inventory, and expense tracking'}
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${darkMode ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-900'}`}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-slate-200/70 p-4 md:p-6">
            <div className="flex flex-wrap items-stretch gap-2 rounded-2xl bg-slate-100 p-1">
              {[
                { id: 'home', label: 'Dashboard', icon: Home },
                { id: 'invoice', label: 'Invoices', icon: FileText },
                { id: 'items', label: 'Products', icon: Box },
                { id: 'parties', label: 'Customers', icon: Users },
                { id: 'expenses', label: 'Expenses', icon: CreditCard },
                { id: 'insights', label: 'AI Insights', icon: Brain },
                { id: 'reports', label: 'Reports', icon: BarChart3 },
              ].map((button) => (
                <button
                  key={button.id}
                  onClick={() => setTab(button.id as any)}
                  className={`flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    tab === button.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <button.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{button.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 p-4 md:p-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {tab === 'home' && (
                  <motion.section
                    key="home"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    className={`rounded-[24px] border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} p-5 shadow-sm`}
                  >
                    <div className="space-y-6">
                      {/* Key Metrics */}
                      <div>
                        <h2 className="text-2xl font-black tracking-tight mb-4">Your Business Snapshot</h2>
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                          {[
                            { label: 'Total Sales', value: formatMoney(salesTotal), icon: TrendingUp, color: 'indigo' },
                            { label: 'Receivables', value: formatMoney(outstandingReceivables), icon: Clock, color: 'rose' },
                            { label: 'Expenses', value: formatMoney(totalExpenses), icon: CreditCard, color: 'amber' },
                            { label: 'Profit Margin', value: `${profitMargin.toFixed(1)}%`, icon: Target, color: 'emerald' },
                          ].map((stat, i) => (
                            <div
                              key={i}
                              className={`rounded-[20px] border ${darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-200 bg-slate-50'} p-4 shadow-sm`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">{stat.label}</div>
                                  <div className="text-2xl font-black">{stat.value}</div>
                                </div>
                                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div>
                        <h3 className="text-lg font-black mb-4">Quick Actions</h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {quickActions.map((action) => (
                            <button
                              key={action.id}
                              onClick={() => setTab(action.id as any)}
                              className={`flex flex-col gap-3 rounded-[20px] border ${darkMode ? 'border-slate-700 bg-slate-700/50 hover:bg-slate-700' : 'border-slate-200 bg-white hover:border-indigo-300'} p-4 text-left shadow-sm transition`}
                            >
                              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'} text-indigo-600`}>
                                <action.icon className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-semibold">{action.label}</div>
                                <p className="text-sm text-slate-500 mt-1">{action.description}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}

                {tab === 'invoice' && (
                  <motion.section
                    key="invoice"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    className={`rounded-[24px] border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} p-5 shadow-sm`}
                  >
                    <div className="space-y-5">
                      <div>
                        <h2 className="text-xl font-black tracking-tight">Create Invoice</h2>
                        <p className="text-sm text-slate-500 mt-1">Fast billing with GST-ready calculations</p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Customer</span>
                          <select
                            value={partyId}
                            onChange={(e) => setPartyId(e.target.value)}
                            className={`w-full rounded-2xl border ${darkMode ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-white'} px-4 py-3 text-sm outline-none transition focus:border-indigo-400`}
                          >
                            <option value="">Walk-in customer</option>
                            {parties.map((party) => (
                              <option key={party.id} value={party.id}>
                                {party.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="space-y-2">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Invoice #</span>
                          <input
                            value={invoiceNumber}
                            onChange={(e) => setInvoiceNumber(e.target.value)}
                            placeholder={generatedNumber}
                            className={`w-full rounded-2xl border ${darkMode ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-white'} px-4 py-3 text-sm outline-none transition focus:border-indigo-400`}
                          />
                        </label>
                        <label className="space-y-2">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Date</span>
                          <input
                            type="date"
                            value={invoiceDate}
                            onChange={(e) => setInvoiceDate(e.target.value)}
                            className={`w-full rounded-2xl border ${darkMode ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-white'} px-4 py-3 text-sm outline-none transition focus:border-indigo-400`}
                          />
                        </label>
                        <label className="space-y-2">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Paid Amount</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={paidAmount}
                            onChange={(e) => setPaidAmount(Number(e.target.value))}
                            className={`w-full rounded-2xl border ${darkMode ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-white'} px-4 py-3 text-sm outline-none transition focus:border-indigo-400`}
                            placeholder="0.00"
                          />
                        </label>
                      </div>

                      {/* Add Items */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold">Line Items</h3>
                          <button onClick={addLine} className="inline-flex items-center gap-2 rounded-full border border-indigo-600 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100">
                            <Plus className="w-4 h-4" /> Add
                          </button>
                        </div>
                        <div className="space-y-3">
                          {lines.map((line) => (
                            <div key={line.id} className={`grid gap-3 rounded-2xl border ${darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-200 bg-slate-50'} p-3 md:grid-cols-[2fr_0.7fr_0.7fr_0.5fr_0.3fr]`}>
                              <input
                                value={line.name}
                                onChange={(e) => updateLine(line.id, { name: e.target.value })}
                                placeholder="Item name"
                                className={`rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-600' : 'border-slate-200 bg-white'} px-3 py-2 text-sm outline-none focus:border-indigo-400`}
                              />
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={line.qty}
                                onChange={(e) => updateLine(line.id, { qty: Number(e.target.value) })}
                                placeholder="Qty"
                                className={`rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-600' : 'border-slate-200 bg-white'} px-3 py-2 text-sm outline-none focus:border-indigo-400`}
                              />
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={line.price}
                                onChange={(e) => updateLine(line.id, { price: Number(e.target.value) })}
                                placeholder="Price"
                                className={`rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-600' : 'border-slate-200 bg-white'} px-3 py-2 text-sm outline-none focus:border-indigo-400`}
                              />
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={line.tax_percent}
                                onChange={(e) => updateLine(line.id, { tax_percent: Number(e.target.value) })}
                                placeholder="GST%"
                                className={`rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-600' : 'border-slate-200 bg-white'} px-3 py-2 text-sm outline-none focus:border-indigo-400`}
                              />
                              <button
                                onClick={() => removeLine(line.id)}
                                className="rounded-lg border border-rose-300 bg-rose-50 p-2 text-rose-600 hover:bg-rose-100"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notes & Summary */}
                      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
                        <label className="space-y-2">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Notes</span>
                          <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className={`w-full rounded-2xl border ${darkMode ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-white'} px-4 py-3 text-sm outline-none focus:border-indigo-400`}
                            placeholder="Payment terms, thanks note..."
                          />
                        </label>

                        <div className={`rounded-2xl border ${darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-200 bg-slate-50'} p-4`}>
                          <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Total</div>
                          <div className="text-3xl font-black mb-4">{formatMoney(summary.total)}</div>
                          <div className="space-y-2 text-sm mb-4">
                            <SummaryRow label="Subtotal" value={formatMoney(summary.subtotal)} />
                            {isInterstate ? (
                              <SummaryRow label="IGST" value={formatMoney(summary.igst)} />
                            ) : (
                              <>
                                <SummaryRow label="CGST" value={formatMoney(summary.cgst)} />
                                <SummaryRow label="SGST" value={formatMoney(summary.sgst)} />
                              </>
                            )}
                          </div>
                          <button
                            onClick={() => saveInvoice()}
                            disabled={saveState === 'saving'}
                            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                          >
                            Save Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}

                {tab === 'items' && (
                  <motion.section
                    key="items"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    className={`rounded-[24px] border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} p-5 shadow-sm`}
                  >
                    <h2 className="text-xl font-black mb-4">Product Catalog</h2>
                    <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                      <div className={`rounded-2xl border ${darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-200 bg-slate-50'} p-4 space-y-3`}>
                        <input
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          placeholder="Product name"
                          className={`w-full rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-600' : 'border-slate-200 bg-white'} px-4 py-2 text-sm outline-none`}
                        />
                        <input
                          type="number"
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(Number(e.target.value))}
                          placeholder="Selling price"
                          className={`w-full rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-600' : 'border-slate-200 bg-white'} px-4 py-2 text-sm outline-none`}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            value={newItemTaxPercent}
                            onChange={(e) => setNewItemTaxPercent(Number(e.target.value))}
                            placeholder="GST %"
                            className={`rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-600' : 'border-slate-200 bg-white'} px-4 py-2 text-sm outline-none`}
                          />
                          <input
                            type="number"
                            value={newItemStock}
                            onChange={(e) => setNewItemStock(Number(e.target.value))}
                            placeholder="Stock"
                            className={`rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-600' : 'border-slate-200 bg-white'} px-4 py-2 text-sm outline-none`}
                          />
                        </div>
                        <button
                          onClick={createItem}
                          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
                        >
                          Add Product
                        </button>
                      </div>

                      <div className={`rounded-2xl border ${darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-200 bg-white'} p-4 max-h-96 overflow-y-auto`}>
                        <h3 className="font-bold mb-3">Your Products</h3>
                        <div className="space-y-2">
                          {items.length > 0 ? (
                            items.map((item) => (
                              <div key={item.id} className={`rounded-lg border ${darkMode ? 'border-slate-700' : 'border-slate-200'} p-2 text-sm`}>
                                <div className="font-semibold">{item.name}</div>
                                <div className="text-xs text-slate-500">{formatMoney(item.sale_price)} • {item.tax_percent}% GST • Stock: {item.stock || 0}</div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500">No products yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}

                {tab === 'parties' && (
                  <motion.section
                    key="parties"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    className={`rounded-[24px] border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} p-5 shadow-sm`}
                  >
                    <h2 className="text-xl font-black mb-4">Customer Ledger</h2>
                    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                      <div className={`rounded-2xl border ${darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-200 bg-slate-50'} p-4 space-y-3`}>
                        <input
                          value={newPartyName}
                          onChange={(e) => setNewPartyName(e.target.value)}
                          placeholder="Customer name"
                          className={`w-full rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-600' : 'border-slate-200 bg-white'} px-4 py-2 text-sm outline-none`}
                        />
                        <input
                          value={newPartyPhone}
                          onChange={(e) => setNewPartyPhone(e.target.value)}
                          placeholder="Phone"
                          className={`w-full rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-600' : 'border-slate-200 bg-white'} px-4 py-2 text-sm outline-none`}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={newPartyState}
                            onChange={(e) => setNewPartyState(e.target.value)}
                            placeholder="State"
                            className={`rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-600' : 'border-slate-200 bg-white'} px-4 py-2 text-sm outline-none`}
                          />
                          <input
                            value={newPartyGstin}
                            onChange={(e) => setNewPartyGstin(e.target.value)}
                            placeholder="GSTIN"
                            className={`rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-600' : 'border-slate-200 bg-white'} px-4 py-2 text-sm outline-none`}
                          />
                        </div>
                        <button
                          onClick={createParty}
                          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
                        >
                          Add Customer
                        </button>
                      </div>

                      <div className={`rounded-2xl border ${darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-200 bg-white'} p-4 max-h-96 overflow-y-auto`}>
                        <h3 className="font-bold mb-3">Customers</h3>
                        <div className="space-y-2">
                          {parties.length > 0 ? (
                            parties.map((party) => (
                              <div key={party.id} className={`rounded-lg border ${darkMode ? 'border-slate-700' : 'border-slate-200'} p-2 text-sm`}>
                                <div className="font-semibold">{party.name}</div>
                                <div className="text-xs text-slate-500">{party.phone} • {party.state}</div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500">No customers yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}

                {tab === 'expenses' && (
                  <motion.section
                    key="expenses"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    className={`rounded-[24px] border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} p-5 shadow-sm`}
                  >
                    <h2 className="text-xl font-black mb-4">Expense Tracker</h2>
                    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                      <div className={`rounded-2xl border ${darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-200 bg-slate-50'} p-4 space-y-3`}>
                        <select
                          value={expenseCategory}
                          onChange={(e) => setExpenseCategory(e.target.value)}
                          className={`w-full rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-600' : 'border-slate-200 bg-white'} px-4 py-2 text-sm outline-none`}
                        >
                          {['Office', 'Travel', 'Marketing', 'Supplies', 'Vendor Payment'].map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={expenseAmount}
                          onChange={(e) => setExpenseAmount(Number(e.target.value))}
                          placeholder="Amount"
                          className={`w-full rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-600' : 'border-slate-200 bg-white'} px-4 py-2 text-sm outline-none`}
                        />
                        <textarea
                          rows={3}
                          value={expenseNote}
                          onChange={(e) => setExpenseNote(e.target.value)}
                          placeholder="Note"
                          className={`w-full rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-600' : 'border-slate-200 bg-white'} px-4 py-2 text-sm outline-none`}
                        />
                        <button
                          onClick={addExpense}
                          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
                        >
                          Add Expense
                        </button>
                      </div>

                      <div className={`rounded-2xl border ${darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-200 bg-white'} p-4 max-h-96 overflow-y-auto`}>
                        <h3 className="font-bold mb-3">Recent Expenses</h3>
                        <div className="space-y-2">
                          {expenses.length > 0 ? (
                            expenses.slice(0, 6).map((exp) => (
                              <div key={exp.id} className={`rounded-lg border ${darkMode ? 'border-slate-700' : 'border-slate-200'} p-2 text-sm`}>
                                <div className="flex justify-between">
                                  <div className="font-semibold">{exp.category}</div>
                                  <div className="font-bold">{formatMoney(exp.amount)}</div>
                                </div>
                                <div className="text-xs text-slate-500">{exp.note}</div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500">No expenses yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}

                {tab === 'insights' && (
                  <motion.section
                    key="insights"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    className={`rounded-[24px] border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} p-5 shadow-sm space-y-4`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-black">🤖 AI Business Insights</h2>
                        <p className="text-sm text-slate-500 mt-1">AI-powered recommendations for your business</p>
                      </div>
                      <button
                        onClick={generateInsights}
                        disabled={aiLoading}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        {aiLoading ? <span className="animate-spin">⚙️</span> : <Zap className="w-4 h-4" />}
                        Generate Insights
                      </button>
                    </div>

                    <div className="space-y-3">
                      {insights.length > 0 ? (
                        insights.map((insight, i) => (
                          <div
                            key={i}
                            className={`rounded-lg border-l-4 border-indigo-500 ${darkMode ? 'bg-slate-700/50' : 'bg-indigo-50'} p-4`}
                          >
                            <div className="flex items-start gap-3">
                              <Lightbulb className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <h3 className="font-bold">{insight.title}</h3>
                                <p className="text-sm text-slate-600 mt-1">{insight.insight}</p>
                                <p className="text-sm text-indigo-700 font-semibold mt-2">💡 {insight.recommendation}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={`rounded-lg border ${darkMode ? 'border-slate-700' : 'border-slate-200'} p-8 text-center text-sm text-slate-500`}>
                          Click "Generate Insights" to get AI-powered business recommendations
                        </div>
                      )}
                    </div>

                    {/* Payment Reminders */}
                    <div className="mt-6">
                      <button
                        onClick={generateReminders}
                        disabled={aiLoading}
                        className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-50 flex items-center gap-2 mb-4"
                      >
                        {aiLoading ? <span className="animate-spin">⚙️</span> : <MessageSquare className="w-4 h-4" />}
                        Generate Payment Reminders
                      </button>

                      <div className="space-y-3">
                        {reminders.length > 0 ? (
                          reminders.map((reminder, i) => (
                            <div
                              key={i}
                              className={`rounded-lg border-l-4 border-rose-500 ${darkMode ? 'bg-slate-700/50' : 'bg-rose-50'} p-4`}
                            >
                              <div className="font-bold mb-2">{reminder.customerName}</div>
                              <p className="text-sm mb-2">{reminder.suggestedMessage}</p>
                              <div className="text-xs text-slate-500">
                                Amount: {formatMoney(reminder.amount)} • Priority: {reminder.priority}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className={`rounded-lg border ${darkMode ? 'border-slate-700' : 'border-slate-200'} p-8 text-center text-sm text-slate-500`}>
                            Click "Generate Reminders" to create payment follow-up messages
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.section>
                )}

                {tab === 'reports' && (
                  <motion.section
                    key="reports"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    className={`rounded-[24px] border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} p-5 shadow-sm`}
                  >
                    <h2 className="text-xl font-black mb-6">Business Reports</h2>
                    <div className="space-y-4">
                      {/* Financial Summary */}
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className={`rounded-lg border ${darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-200 bg-slate-50'} p-4`}>
                          <div className="text-xs font-bold text-slate-500 mb-2">TOTAL RECEIVABLES</div>
                          <div className="text-2xl font-black">{formatMoney(outstandingReceivables)}</div>
                          <div className="text-xs text-rose-600 mt-2">{overdueInvoices} overdue</div>
                        </div>
                        <div className={`rounded-lg border ${darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-200 bg-slate-50'} p-4`}>
                          <div className="text-xs font-bold text-slate-500 mb-2">TOTAL EXPENSES</div>
                          <div className="text-2xl font-black">{formatMoney(totalExpenses)}</div>
                          <div className="text-xs text-amber-600 mt-2">{expenses.length} entries</div>
                        </div>
                        <div className={`rounded-lg border ${darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-200 bg-slate-50'} p-4`}>
                          <div className="text-xs font-bold text-slate-500 mb-2">GST COLLECTED</div>
                          <div className="text-2xl font-black">{formatMoney(gstCollected)}</div>
                          <div className="text-xs text-emerald-600 mt-2">Compliance ready</div>
                        </div>
                      </div>

                      {/* Inventory Alert */}
                      {lowStockCount > 0 && (
                        <div className={`rounded-lg border-l-4 border-amber-500 ${darkMode ? 'bg-slate-700/50' : 'bg-amber-50'} p-4 flex items-start gap-3`}>
                          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold">⚠️ Low Stock Alert</div>
                            <p className="text-sm mt-1">{lowStockCount} product(s) have less than 5 units in stock</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {message && (
                <div className={`rounded-2xl px-4 py-3 text-sm animate-pulse ${saveState === 'error' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {message}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-4">
              <section className={`rounded-[20px] border ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'} p-4 shadow-sm`}>
                <h3 className="text-sm font-black mb-3">Recent Invoices</h3>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className={`w-full rounded-lg border ${darkMode ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-slate-50'} px-3 py-2 text-sm outline-none mb-3`}
                />
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((txn) => {
                      const partyName = Array.isArray(txn.parties) ? txn.parties?.[0]?.name : txn.parties?.name;
                      return (
                        <div
                          key={txn.id}
                          className={`rounded-lg border ${darkMode ? 'border-slate-700 bg-slate-700/30' : 'border-slate-200 bg-slate-50'} p-3`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <div className="text-sm font-semibold">{txn.number}</div>
                              <div className="text-xs text-slate-500">{partyName || 'Walk-in'}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold">{formatMoney(txn.total)}</div>
                              <div className="text-[10px] text-slate-500">{formatDate(txn.txn_date)}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-4">No invoices</p>
                  )}
                </div>
              </section>

              <div className={`rounded-[20px] border border-indigo-500/50 bg-gradient-to-br from-indigo-600/20 to-violet-600/20 ${darkMode ? 'bg-gradient-to-br from-indigo-900/30 to-violet-900/30' : ''} p-4 shadow-sm`}>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700 mb-2">⚡ AI Powered</div>
                <h3 className="font-bold mb-2">Smart Tools</h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li>✅ GST-ready invoicing</li>
                  <li>✅ AI business insights</li>
                  <li>✅ Payment reminders</li>
                  <li>✅ Expense analytics</li>
                </ul>
              </div>
            </aside>
          </div>

          {/* Bottom Navigation */}
          <div className={`rounded-[20px] border ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'} p-3 m-4 shadow-sm`}>
            <div className="grid gap-2 grid-cols-3 sm:grid-cols-7">
              {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'invoice', label: 'Bills', icon: FileText },
                { id: 'items', label: 'Products', icon: Box },
                { id: 'parties', label: 'Customers', icon: Users },
                { id: 'expenses', label: 'Expenses', icon: CreditCard },
                { id: 'insights', label: 'AI', icon: Brain },
                { id: 'reports', label: 'Reports', icon: BarChart3 },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setTab(btn.id as any)}
                  className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs font-bold transition ${
                    tab === btn.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <btn.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{btn.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white/50 px-3 py-2">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export default BizBookDashboardEnhanced;
