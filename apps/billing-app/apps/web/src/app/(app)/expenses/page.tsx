"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  TrendingDown,
  Plus,
  Trash2,
  Calendar,
  X,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

type Expense = {
  id: string;
  category: string;
  amount: number;
  date: string;
  notes?: string | null;
  reference?: string | null;
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [category, setCategory] = useState("Office Rent & Maintenance");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    try {
      const res = await fetch("/api/expenses");
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    setSaving(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          amount: Number(amount),
          notes,
          reference,
          date,
        }),
      });

      if (res.ok) {
        setShowAddForm(false);
        setAmount("");
        setNotes("");
        setReference("");
        fetchExpenses();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteExpense(id: string) {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchExpenses();
      }
    } catch (err) {
      console.error(err);
    }
  }

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Expenses Registry</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Log and audit company operational spending like rent, fuel, software, and payroll.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Main Stats Card */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4 border-l-4 border-l-purple-500">
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <TrendingDown className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Expenses</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">{formatCurrency(totalExpense)}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Transactions</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">{expenses.length}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Last Activity</p>
            <p className="text-sm font-black text-slate-700 mt-0.5">
              {expenses.length > 0 ? formatDate(expenses[0].date) : "No records yet"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-xs text-slate-400">Loading expenses...</div>
        ) : expenses.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-600">No Expenses Recorded</p>
            <p className="text-xs text-slate-400">Add an expense to start tracking your operational overheads.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Add Expense
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-400 text-xs uppercase tracking-wider bg-slate-50/50">
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold">Reference / ID</th>
                  <th className="p-4 font-bold">Notes</th>
                  <th className="p-4 font-bold text-right">Amount</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-xs font-semibold text-slate-600">{formatDate(exp.date)}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-bold text-slate-500">{exp.reference || "—"}</td>
                    <td className="p-4 text-xs text-slate-500 truncate max-w-[200px]">{exp.notes || "—"}</td>
                    <td className="p-4 text-right font-black text-slate-800">{formatCurrency(exp.amount)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Expense Form Drawer/Overlay */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddExpense}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-200 space-y-4"
          >
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingDown className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Record Expense</h3>
              <p className="text-xs text-slate-500 mt-0.5">Input your transactional details below.</p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Expense Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500 bg-white cursor-pointer font-semibold"
                >
                  <option>Office Rent & Maintenance</option>
                  <option>Logistics & Delivery Fuel</option>
                  <option>IT & Software Subscriptions</option>
                  <option>Employee Salary & Payroll</option>
                  <option>Marketing & Advertising</option>
                  <option>Utilities (Electricity/Water)</option>
                  <option>Office Supplies & Stationary</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Reference / Bill ID</label>
                  <input
                    type="text"
                    placeholder="e.g. BILL-992"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Notes / Remarks</label>
                <textarea
                  placeholder="Optional details..."
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full btn-primary bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/10 cursor-pointer"
              >
                {saving ? "Saving Record..." : "Save Expense"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
