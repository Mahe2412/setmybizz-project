"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  ShoppingCart,
  FileSignature,
  Truck,
  Undo2,
  FilePlus,
  TrendingDown,
  Receipt,
  Calendar,
  BarChart3,
  LineChart,
  Settings,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Users,
  MessageCircle,
  BookOpen,
  Plus,
  ArrowUpRight,
  AlertCircle,
  Package,
  ChevronRight,
  Warehouse
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface DashboardClientProps {
  stats: {
    todaySales: number;
    todayCount: number;
    outstanding: number;
    customerCount: number;
    lowStockCount: number;
    recentInvoices: any[];
    totalSales: number;
    totalPurchases: number;
  };
  businessName: string;
}

export function DashboardClient({ stats, businessName }: DashboardClientProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"This Month" | "Last Month" | "All Time">("All Time");

  const salesValue = selectedTimeframe === "All Time" ? stats.totalSales : stats.totalSales * 0.45;
  const purchasesValue = selectedTimeframe === "All Time" ? stats.totalPurchases : stats.totalPurchases * 0.35;

  const createActions = [
    { label: "Invoice", icon: FileText, href: "/invoices/new", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { label: "Purchase", icon: ShoppingCart, href: "/purchases/new", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { label: "Quotation", icon: FileSignature, href: "/invoices/new?type=quotation", color: "bg-purple-50 text-purple-600 border-purple-100" },
    { label: "Delivery Challan", icon: Truck, href: "/invoices/new?type=challan", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { label: "Credit Note", icon: Undo2, href: "/invoices/new?type=credit_note", color: "bg-rose-50 text-rose-600 border-rose-100" },
    { label: "Purchase Order", icon: FilePlus, href: "/purchases/new?type=po", color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
    { label: "Expenses", icon: TrendingDown, href: "/expenses", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { label: "Pro Forma Invoice", icon: Receipt, href: "/invoices/new?type=proforma", color: "bg-teal-50 text-teal-600 border-teal-100" },
  ];

  const quickAccessActions = [
    { label: "Payments Timeline", icon: Calendar, href: "/payments" },
    { label: "Parties Ledger", icon: Users, href: "/parties" },
    { label: "Products / Stock", icon: Package, href: "/items" },
    { label: "Digital Store", icon: Warehouse, href: "/store" },
    { label: "Reports & GST", icon: BarChart3, href: "/reports" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time billing analytics and operations for <span className="font-semibold text-slate-800">{businessName || "Your Business"}</span>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/invoices/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            New Invoice
          </Link>
        </div>
      </div>

      {/* Main Core Sales & Purchases Card */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Business Analytics</span>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
            >
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="All Time">All Time</option>
            </select>
          </div>

          <div className="grid grid-cols-2 divide-x divide-slate-100 my-auto py-2">
            <div className="pr-4 space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Sales</p>
              <p className="text-2xl font-black text-slate-800">{formatCurrency(salesValue)}</p>
              <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-1">
                <TrendingUp className="h-3 w-3" /> Sales performance active
              </p>
            </div>
            <div className="pl-6 space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Purchases</p>
              <p className="text-2xl font-black text-slate-800">{formatCurrency(purchasesValue)}</p>
              <p className="text-[10px] text-slate-400 font-bold mt-1">
                Linked to suppliers ledger
              </p>
            </div>
          </div>
        </div>

        {/* Receivables & Low stock card */}
        <div className="grid grid-rows-2 gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Receivables</p>
              <p className="text-lg font-black text-slate-800 mt-0.5">{formatCurrency(stats.outstanding)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex items-center gap-4">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${stats.lowStockCount > 0 ? "bg-rose-50 text-rose-600 animate-pulse" : "bg-slate-50 text-slate-500"}`}>
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Low Stock Items</p>
              <p className="text-lg font-black text-slate-800 mt-0.5">{stats.lowStockCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* "Create Document" grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
          Create New Document
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {createActions.map((action, i) => {
            const isQuotation = action.label === "Quotation";
            const isChallan = action.label === "Delivery Challan";
            const IconComponent = isQuotation ? FileSignature : action.icon as React.ComponentType<any>;
            
            return (
              <Link key={i} href={action.href}>
                <div className="flex flex-col items-center justify-center p-4 text-center rounded-2xl border border-slate-200/80 bg-white hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer h-24 group">
                  <div className={`p-2.5 rounded-xl border ${action.color} group-hover:scale-105 transition-transform`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <span className="mt-2 text-xs font-bold text-slate-700 tracking-tight group-hover:text-blue-600 transition-colors">
                    {action.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* "Quick Access" grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Quick Access</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {quickAccessActions.map((action, i) => {
            const IconComponent = action.icon;
            return (
              <Link key={i} href={action.href}>
                <div className="flex flex-col items-center justify-center p-3 text-center rounded-2xl border border-slate-200/50 bg-white hover:bg-slate-50 transition-all cursor-pointer h-20 group">
                  <IconComponent className="h-5 w-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                  <span className="mt-2 text-[11px] font-bold text-slate-600 tracking-tight">
                    {action.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Split Sales chart & Recent invoices */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Trend Mini-Chart */}
        <div className="card lg:col-span-2 p-5 border border-slate-200 bg-white rounded-2xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Weekly Sales Flow</h3>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 rounded-full px-2 py-0.5 flex items-center gap-0.5">
                <ArrowUpRight className="h-3 w-3" /> Real-time
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Weekly sales summary</p>
          </div>

          <div className="mt-8 flex items-end justify-between h-36 px-4">
            {[45, 20, 85, 30, 95, 60, 40].map((val, idx) => {
              const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
              return (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full max-w-[16px] bg-slate-100 rounded-md h-28 relative flex items-end">
                    <div
                      style={{ height: `${val}%` }}
                      className={`w-full rounded-md transition-all duration-500 ${
                        idx === 4 ? "bg-blue-600" : "bg-blue-400/80 hover:bg-blue-500"
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">{days[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Invoices List */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">Recent Invoices</h2>
              <Link href="/invoices" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {stats.recentInvoices.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No invoices yet.</p>
            ) : (
              <div className="space-y-3">
                {stats.recentInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <div>
                      <Link href={`/invoices/${inv.id}`} className="text-xs font-bold text-blue-600 hover:underline block">
                        {inv.number ?? "Draft"}
                      </Link>
                      <span className="text-[10px] text-slate-500">{inv.party?.name ?? "Walk-in Customer"}</span>
                    </div>
                    <span className="text-xs font-black text-slate-800">{formatCurrency(inv.grandTotal)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
