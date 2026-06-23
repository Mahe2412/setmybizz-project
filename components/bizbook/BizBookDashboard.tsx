'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Home, FileText, Box, Users, MoreHorizontal, CreditCard, BarChart3, ShieldCheck, TrendingUp, CheckCircle2, Plus, Printer, RefreshCcw, Save, Search, Trash2, Upload, Wand2 } from 'lucide-react';

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

const BizBookDashboard = () => {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [tab, setTab] = useState<'home' | 'invoice' | 'items' | 'parties' | 'expenses' | 'reports'>('home');
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
    () => items.filter((item) => (item.stock ?? 0) > 0 && (item.stock ?? 0) <= 5).length,
    [items]
  );

  const overdueInvoices = useMemo(
    () => transactions.filter((txn) => txn.status === 'unpaid' || txn.status === 'partial').length,
    [transactions]
  );

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

  const quickAccessLinks = [
    { label: 'Reports', icon: BarChart3, description: 'Sales, cash flow, and tax' },
    { label: 'GST', icon: ShieldCheck, description: 'Compliance-ready totals' },
    { label: 'Launch', icon: TrendingUp, description: 'Growth and income pulse' },
    { label: 'Templates', icon: FileText, description: 'Invoice design options' },
  ];

  const bottomNavButtons = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'invoice', label: 'Bills', icon: FileText },
    { id: 'items', label: 'Products', icon: Box },
    { id: 'parties', label: 'Customers', icon: Users },
    { id: 'reports', label: 'Reports', icon: MoreHorizontal },
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
      setMessage('Invoice saved successfully.');
      setInvoiceNumber('');
      setPaidAmount(0);
      setLines([emptyLine()]);
      await loadData();
    } catch (err: any) {
      setSaveState('error');
      setMessage(err?.message || 'Could not save invoice');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#eff6ff_0%,#f8fafc_35%,#eef2ff_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 lg:px-8">
        <div className="rounded-[28px] border border-white/70 bg-white/75 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-slate-200/70 p-5 md:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-5 rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 shadow-sm">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-sm">
                BizBook Mobile
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                    Mobile-first billing shell
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-slate-500">
                    Fast mobile billing for Indian MSMEs — GST invoicing, product master, customer ledger, expenses, and payment follow-up.
                  </p>
                </div>
                <div className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 shadow-sm">B</span>
                  <span>Billing shell ready</span>
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                { label: 'Invoices', value: transactions.length },
                { label: 'Receivables', value: formatMoney(outstandingReceivables) },
                { label: 'GST collected', value: formatMoney(gstCollected) },
                { label: 'Low stock', value: lowStockCount },
              ].map((stat) => (
                <div key={stat.label} className="rounded-[28px] border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">{stat.label}</div>
                  <div className="mt-3 text-2xl font-black tracking-tight text-slate-900">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

          <div className="grid border-b border-slate-200/70 md:grid-cols-[1.2fr_0.8fr]">
            <div className="p-4 md:p-6">
              <div className="flex flex-wrap items-stretch gap-2 rounded-2xl bg-slate-100 p-1">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'invoice', label: 'Create Invoice' },
                  { id: 'items', label: 'Items' },
                  { id: 'parties', label: 'Parties' },
                  { id: 'expenses', label: 'Expenses' },
                  { id: 'reports', label: 'Reports' },
                ].map((button) => (
                  <button
                    key={button.id}
                    onClick={() => setTab(button.id as any)}
                    className={`flex-1 min-w-[140px] rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      tab === button.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex flex-wrap items-center justify-end gap-2">
                <button onClick={loadData} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <RefreshCcw className="size-4" /> Refresh
                </button>
                <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <Upload className="size-4" /> Import bills
                </button>
                <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <Printer className="size-4" /> Print
                </button>
                <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25">
                  <Wand2 className="size-4" /> AI scan
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-4 md:p-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {tab === 'home' && (
                  <motion.section
                    key="home"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-700">
                          Swipe shell
                        </div>
                        <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900">Your business dashboard</h2>
                        <p className="mt-2 max-w-2xl text-sm text-slate-500">One home screen for GST invoices, customer ledger, product master, payments, and fast bill creation.</p>
                      </div>
                      <button
                        onClick={() => setTab('invoice')}
                        className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
                      >
                        Quick invoice
                      </button>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div className="rounded-3xl bg-white p-3 text-indigo-700 shadow-sm">
                            <FileText className="h-5 w-5" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Sales</span>
                        </div>
                        <div className="mt-4 text-2xl font-black text-slate-900">{formatMoney(salesTotal)}</div>
                        <div className="mt-2 text-sm text-slate-500">Total invoice value</div>
                      </div>
                      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div className="rounded-3xl bg-white p-3 text-emerald-700 shadow-sm">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Spend</span>
                        </div>
                        <div className="mt-4 text-2xl font-black text-slate-900">{formatMoney(totalExpenses)}</div>
                        <div className="mt-2 text-sm text-slate-500">Expenses tracked</div>
                      </div>
                      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div className="rounded-3xl bg-white p-3 text-rose-700 shadow-sm">
                            <Users className="h-5 w-5" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Due</span>
                        </div>
                        <div className="mt-4 text-2xl font-black text-slate-900">{overdueInvoices}</div>
                        <div className="mt-2 text-sm text-slate-500">Pending invoices</div>
                      </div>
                      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div className="rounded-3xl bg-white p-3 text-violet-700 shadow-sm">
                            <Box className="h-5 w-5" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Stock</span>
                        </div>
                        <div className="mt-4 text-2xl font-black text-slate-900">{lowStockCount}</div>
                        <div className="mt-2 text-sm text-slate-500">Products low in stock</div>
                      </div>
                    </div>

                    <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-4 shadow-sm">
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {quickActions.map((action) => (
                          <button
                            key={action.id}
                            onClick={() => setTab(action.id as any)}
                            className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-indigo-300"
                          >
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-700">
                              <action.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{action.label}</div>
                              <p className="mt-1 text-sm text-slate-500">{action.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {quickAccessLinks.map((link) => (
                        <div key={link.label} className="rounded-[24px] border border-slate-200 bg-slate-950/5 p-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-700">
                              <link.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{link.label}</div>
                              <p className="text-sm text-slate-500">{link.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>
              <AnimatePresence mode="wait">
                {tab === 'invoice' && (
                  <motion.section
                    key="invoice"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-black tracking-tight">Create Invoice</h2>
                        <p className="text-sm text-slate-500">Fast billing, GST-ready totals, and clean transaction storage.</p>
                      </div>
                      <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                        {saveState === 'saving' ? 'Saving...' : saveState === 'saved' ? 'Saved' : generatedNumber}
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Customer name</span>
                        <select
                          value={partyId}
                          onChange={(e) => setPartyId(e.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
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
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Invoice number</span>
                        <input
                          value={invoiceNumber}
                          onChange={(e) => setInvoiceNumber(e.target.value)}
                          placeholder={generatedNumber}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Date</span>
                        <input
                          type="date"
                          value={invoiceDate}
                          onChange={(e) => setInvoiceDate(e.target.value)}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">GST mode</span>
                        <div className="flex h-full items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
                          {isInterstate ? 'Interstate (IGST)' : 'Intrastate (CGST + SGST)'}
                        </div>
                      </label>
                      <label className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Received amount</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={paidAmount}
                          onChange={(e) => setPaidAmount(Number(e.target.value))}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                          placeholder="0.00"
                        />
                      </label>
                    </div>

                    <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Due amount</span>
                        <span className="font-black">{formatMoney(Math.max(summary.total - paidAmount, 0))}</span>
                      </div>
                      <div className="mt-2 text-xs text-slate-500">Mark paid, unpaid, or record a partial payment before saving.</div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Add items</h3>
                        <button onClick={addLine} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                          <Plus className="size-4" /> Add row
                        </button>
                      </div>

                      <div className="mt-4 space-y-3">
                        {lines.map((line) => (
                          <div key={line.id} className="grid gap-3 rounded-[22px] border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1.6fr_0.55fr_0.75fr_0.55fr_0.35fr]">
                            <div>
                              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Item name</div>
                              <div className="flex gap-2">
                                <input
                                  value={line.name}
                                  onChange={(e) => updateLine(line.id, { name: e.target.value })}
                                  placeholder="Shampoo bottle"
                                  className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                                />
                                <select
                                  onChange={(e) => pickItem(line.id, e.target.value)}
                                  className="w-16 rounded-2xl border border-slate-200 bg-white px-2 text-sm outline-none transition focus:border-indigo-400"
                                  defaultValue=""
                                >
                                  <option value="">↓</option>
                                  {items.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <label>
                              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Qty</div>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={line.qty}
                                onChange={(e) => updateLine(line.id, { qty: Number(e.target.value) })}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                              />
                            </label>
                            <label>
                              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Price</div>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={line.price}
                                onChange={(e) => updateLine(line.id, { price: Number(e.target.value) })}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                              />
                            </label>
                            <label>
                              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">GST %</div>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={line.tax_percent}
                                onChange={(e) => updateLine(line.id, { tax_percent: Number(e.target.value) })}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                              />
                            </label>
                            <button
                              onClick={() => removeLine(line.id)}
                              className="self-end rounded-2xl border border-rose-200 bg-rose-50 p-3 text-rose-600 transition hover:bg-rose-100"
                              title="Remove row"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
                      <label className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Notes</span>
                        <textarea
                          rows={4}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                          placeholder="Payment terms, thanks note, special instructions..."
                        />
                      </label>

                      <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                        <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Total amount</div>
                        <div className="mt-2 text-3xl font-black tracking-tight text-slate-900">{formatMoney(summary.total)}</div>
                        <div className="mt-4 space-y-2 text-sm">
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

                        <div className="mt-4 grid gap-2">
                          <button
                            disabled={saveState === 'saving'}
                            onClick={() => saveInvoice()}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:opacity-95 disabled:opacity-60"
                          >
                            <Save className="size-4" /> Save invoice
                          </button>
                          <button
                            disabled={saveState === 'saving'}
                            onClick={() => saveInvoice(summary.total)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                          >
                            <CheckCircle2 className="size-4" /> Save & mark paid
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {tab === 'items' && (
                  <motion.section
                    key="items"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                      <div>
                        <h2 className="text-xl font-black tracking-tight">Item master</h2>
                        <p className="mt-1 text-sm text-slate-500">These are the products that auto-fill price, GST and unit in invoices.</p>
                      </div>
                      <button
                        onClick={createItem}
                        className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:opacity-95"
                      >
                        Add product
                      </button>
                    </div>
                    <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                      <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <label className="block space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Product name</span>
                          <input
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="Product name"
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                          />
                        </label>
                        <label className="block space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Selling price</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={newItemPrice}
                            onChange={(e) => setNewItemPrice(Number(e.target.value))}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                            placeholder="₹0.00"
                          />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">GST %</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={newItemTaxPercent}
                              onChange={(e) => setNewItemTaxPercent(Number(e.target.value))}
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                            />
                          </label>
                          <label className="block space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Stock</span>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={newItemStock}
                              onChange={(e) => setNewItemStock(Number(e.target.value))}
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                            />
                          </label>
                        </div>
                        <label className="block space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">HSN / unit</span>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <input
                              value={newItemHsn}
                              onChange={(e) => setNewItemHsn(e.target.value)}
                              placeholder="HSN code"
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                            />
                            <input
                              value={newItemUnit}
                              onChange={(e) => setNewItemUnit(e.target.value)}
                              placeholder="Unit"
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                            />
                          </div>
                        </label>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Products list</h3>
                        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                              <tr>
                                <th className="px-4 py-3">Item</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">GST</th>
                                <th className="px-4 py-3">Stock</th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.map((item) => (
                                <tr key={item.id} className="border-t border-slate-200">
                                  <td className="px-4 py-3">
                                    <div className="font-semibold">{item.name}</div>
                                    <div className="text-xs text-slate-400">{item.hsn || 'HSN not set'}</div>
                                  </td>
                                  <td className="px-4 py-3">{formatMoney(Number(item.sale_price || 0))}</td>
                                  <td className="px-4 py-3">{item.tax_percent || 0}%</td>
                                  <td className="px-4 py-3">{item.stock ?? 0}</td>
                                </tr>
                              ))}
                              {items.length === 0 && (
                                <tr>
                                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">
                                    No items yet. Add a product to start invoicing.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {tab === 'parties' && (
                  <motion.section
                    key="parties"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                      <div>
                        <h2 className="text-xl font-black tracking-tight">Party master</h2>
                        <p className="mt-1 text-sm text-slate-500">Customers and suppliers that power invoicing and collections.</p>
                      </div>
                      <button
                        onClick={createParty}
                        className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:opacity-95"
                      >
                        Add customer
                      </button>
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="grid gap-3">
                          <label className="block space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Name</span>
                            <input
                              value={newPartyName}
                              onChange={(e) => setNewPartyName(e.target.value)}
                              placeholder="Customer name"
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                            />
                          </label>
                          <label className="block space-y-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Phone</span>
                            <input
                              value={newPartyPhone}
                              onChange={(e) => setNewPartyPhone(e.target.value)}
                              placeholder="Mobile number"
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                            />
                          </label>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <label className="block space-y-2">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">State</span>
                              <input
                                value={newPartyState}
                                onChange={(e) => setNewPartyState(e.target.value)}
                                placeholder="State code"
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                              />
                            </label>
                            <label className="block space-y-2">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">GSTIN</span>
                              <input
                                value={newPartyGstin}
                                onChange={(e) => setNewPartyGstin(e.target.value)}
                                placeholder="GSTIN"
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {parties.length > 0 ? (
                          parties.map((party) => (
                            <div key={party.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <div className="font-semibold">{party.name}</div>
                                  <div className="text-xs text-slate-400">{party.phone || 'No phone'} {party.gstin ? `• GSTIN ${party.gstin}` : ''}</div>
                                </div>
                                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                  {party.state || 'No state'}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                            No parties yet. Add customers to make invoice entry faster.
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {tab === 'expenses' && (
                  <motion.section
                    key="expenses"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-xl font-black tracking-tight">Expense tracker</h2>
                        <p className="mt-1 text-sm text-slate-500">Record operational spend quickly and keep a live expense register for GST reconciliation.</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                        Total spent: {formatMoney(totalExpenses)}
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                      <div className="space-y-4">
                        <label className="block space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Category</span>
                          <select
                            value={expenseCategory}
                            onChange={(e) => setExpenseCategory(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                          >
                            {['Office', 'Travel', 'Marketing', 'Supplies', 'Vendor Payment'].map((category) => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </label>
                        <label className="block space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Amount</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={expenseAmount}
                            onChange={(e) => setExpenseAmount(Number(e.target.value))}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                            placeholder="₹0.00"
                          />
                        </label>
                        <label className="block space-y-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Note</span>
                          <textarea
                            rows={3}
                            value={expenseNote}
                            onChange={(e) => setExpenseNote(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                            placeholder="Receipt, vendor, or purpose"
                          />
                        </label>
                        <button
                          onClick={addExpense}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:opacity-95"
                        >
                          <Save className="size-4" /> Add expense
                        </button>
                      </div>
                      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Recent expenses</h3>
                        <div className="mt-4 space-y-3">
                          {expenses.length > 0 ? (
                            expenses.slice(0, 6).map((expense) => (
                              <div key={expense.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <div className="font-semibold">{expense.category}</div>
                                    <div className="text-xs text-slate-400">{expense.note}</div>
                                  </div>
                                  <div className="text-sm font-black text-slate-900">{formatMoney(expense.amount)}</div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                              No expenses recorded yet.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {tab === 'reports' && (
                  <motion.section
                    key="reports"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <h2 className="text-xl font-black tracking-tight">BizBook reports</h2>
                    <p className="mt-1 text-sm text-slate-500">A quick view of cash flow, GST readiness, and sales health for service, product, and ecommerce MSMEs.</p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <div className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Open receivables</div>
                        <div className="mt-3 text-3xl font-black text-slate-900">{formatMoney(outstandingReceivables)}</div>
                      </div>
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <div className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Overdue invoices</div>
                        <div className="mt-3 text-3xl font-black text-slate-900">{overdueInvoices}</div>
                      </div>
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <div className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Expense burn</div>
                        <div className="mt-3 text-3xl font-black text-slate-900">{formatMoney(totalExpenses)}</div>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <div className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">GST readiness</div>
                        <p className="mt-2 text-sm text-slate-600">GST liabilities and invoice details are ready for export once transactions are synced.</p>
                      </div>
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <div className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Stock risk</div>
                        <p className="mt-2 text-sm text-slate-600">{lowStockCount} item(s) are low stock. Keep your catalogue updated for ecommerce or retail sales.</p>
                      </div>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {message && (
                <div className={`rounded-2xl px-4 py-3 text-sm ${saveState === 'error' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {message}
                </div>
              )}
            </div>

            <aside className="space-y-5">
              <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Recent invoices</h3>
                  <Search className="size-4 text-slate-400" />
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search invoice, customer..."
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400"
                />
                <div className="mt-4 space-y-3">
                  {loading ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Loading invoices...</div>
                  ) : filteredTransactions.length > 0 ? (
                    filteredTransactions.map((txn) => {
                      const partyName = Array.isArray(txn.parties) ? txn.parties?.[0]?.name : txn.parties?.name;
                      return (
                        <div key={txn.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="font-semibold">{txn.number}</div>
                              <div className="text-xs text-slate-400">{partyName || 'Walk-in customer'}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-black">{formatMoney(Number(txn.total || 0))}</div>
                              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{formatDate(txn.txn_date)}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                      No invoices yet. Create your first GST invoice from the form.
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white shadow-xl shadow-indigo-600/20">
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/65">BizOS note</div>
                <h3 className="mt-2 text-lg font-black tracking-tight">Billing flow ready for BizBook</h3>
                <p className="mt-2 text-sm text-white/85">
                  We’re using the cleanest billing flow: parties, items, invoice numbering, stock flow, GST totals, and one simple save path.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>Auto number</Badge>
                  <Badge>GST totals</Badge>
                  <Badge>Supabase save</Badge>
                </div>
              </section>
            </aside>
          </div>

          <div className="mt-6 rounded-[32px] border border-slate-200 bg-slate-950/5 p-3 shadow-sm ring-1 ring-slate-200/60">
            <div className="grid gap-2 sm:grid-cols-5">
              {bottomNavButtons.map((button) => (
                <button
                  key={button.id}
                  onClick={() => setTab(button.id as any)}
                  className={`flex flex-col items-center justify-center gap-2 rounded-3xl border px-3 py-3 text-xs font-semibold transition ${
                    tab === button.id
                      ? 'border-transparent bg-gradient-to-b from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-slate-900'
                  }`}
                >
                  <button.icon className="h-5 w-5" />
                  {button.label}
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
    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
      {children}
    </span>
  );
}

export default BizBookDashboard;
